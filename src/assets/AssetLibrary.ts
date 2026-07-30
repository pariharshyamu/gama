import { Object3D } from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { claimsOwnership, releaseObject } from '../core/release';
import type { Factory } from '../level/Catalog';
import { parseManifest, type AssetEntry, type AssetManifest } from './manifest';

/**
 * AssetLibrary — the loading half of the asset pipeline.
 *
 * ```ts
 * const library = new AssetLibrary(await (await fetch('assets/manifest.json')).json());
 * library.onProgress = (p) => bar.style.width = `${p.fraction * 100}%`;
 * await library.load('menu');                 // a group
 * await library.load('crate', 'oak');         // or individual keys
 *
 * scene.add(library.instance('crate'));       // a clone; geometry is shared
 * catalog.define('crate', library.factory('crate'));   // …or place it from a level file
 * library.release('level-1');                 // and free a level's assets
 * ```
 *
 * Four things it does that a `loadAsync` call does not:
 *
 * **Progress that does not lie.** The manifest carries byte sizes, so the
 * fraction is weighted by bytes and known before the first request goes out.
 * Counting files makes a 3 MB model and a 2 KB JSON weigh the same, and
 * counting requests-so-far makes the bar jump backwards every time a new
 * one starts.
 *
 * **Instances share.** `instance(key)` clones — `SkeletonUtils.clone` when
 * there is a skeleton, `Object3D.clone` otherwise — so forty crates are one
 * geometry and one material. The clone's `dispose` is deliberately a no-op:
 * freeing it would blank the other thirty-nine.
 *
 * **Loads are deduplicated and reference-counted.** Ask for the same key
 * twice and it is fetched once; `release` frees only when the last holder
 * lets go, so unloading one level cannot blank a texture the next one is
 * still using.
 *
 * **Loaders are injectable.** They are plain functions, so the tests run
 * without a GPU, a network or a DOM — and a game that wants Draco, KTX2 or
 * its own format registers one rather than waiting for this library to.
 */

/** A loader is a function. That is the whole interface. */
export type AssetLoader<T = unknown> = (
  url: string,
  onProgress?: (loaded: number, total: number) => void
) => Promise<T>;

export interface AssetProgress {
  /** Assets finished. */
  loaded: number;
  /** Assets requested. */
  total: number;
  bytesLoaded: number;
  bytesTotal: number;
  /** 0…1, weighted by bytes. 1 when there is nothing to do. */
  fraction: number;
  /** The key currently in flight, for a "loading X…" line. */
  current: string | null;
}

export interface AssetLibraryOptions {
  loaders?: Record<string, AssetLoader>;
  /**
   * Prefixed to every url. Overrides the manifest's own `base` rather than
   * stacking with it — `./assets/` twice is a 404, and it is the first thing
   * anyone hits when the manifest sits next to its assets AND declares
   * where they are.
   */
  base?: string;
  /** How many files at once. Default 6 — browsers queue past that anyway. */
  concurrency?: number;
  /** Retries per asset on failure, with backoff. Default 1. */
  retries?: number;
  /** Weight given to an asset the manifest has no size for. Default 65536. */
  assumedBytes?: number;
}

/** What a `factory()` placement hands back — the `dispose` is the point. */
export interface PlacedAsset {
  object: Object3D;
  asset: string;
  dispose(): void;
}

/** One asset in the cache, and how many holders it has. */
interface Loaded {
  entry: AssetEntry;
  value: unknown;
  refs: number;
}

export class AssetLibrary {
  readonly manifest: AssetManifest;
  onProgress: ((progress: AssetProgress) => void) | null = null;

  private readonly loaders: Record<string, AssetLoader>;
  private readonly base: string;
  private readonly concurrency: number;
  private readonly retries: number;
  private readonly assumedBytes: number;

  private readonly cache = new Map<string, Loaded>();
  private readonly inFlight = new Map<string, Promise<unknown>>();
  /** Bytes fetched per key this session, for the progress fraction. */
  private readonly fetched = new Map<string, number>();
  private requested = new Set<string>();
  private current: string | null = null;

  constructor(manifest: unknown, options: AssetLibraryOptions = {}) {
    this.manifest = parseManifest(manifest);
    this.base = options.base ?? this.manifest.base ?? '';
    this.concurrency = Math.max(1, options.concurrency ?? 6);
    this.retries = Math.max(0, options.retries ?? 1);
    this.assumedBytes = options.assumedBytes ?? 65536;
    this.loaders = { ...options.loaders };
  }

  /** Teach the library a type. Overrides whatever was there. */
  register(type: string, loader: AssetLoader): this {
    this.loaders[type] = loader;
    return this;
  }

  // ---- what is in here ---------------------------------------------------

  get keys(): string[] {
    return Object.keys(this.manifest.assets);
  }

  get groups(): string[] {
    const names = new Set<string>();
    for (const entry of Object.values(this.manifest.assets)) {
      if (entry.group) names.add(entry.group);
    }
    return [...names].sort();
  }

  entry(key: string): AssetEntry | undefined {
    return this.manifest.assets[key];
  }

  has(key: string): boolean {
    return key in this.manifest.assets;
  }

  isLoaded(key: string): boolean {
    return this.cache.has(key);
  }

  /** The url an asset will actually be fetched from. */
  url(key: string): string {
    const entry = this.require(key);
    return `${this.base}${entry.url}`;
  }

  /**
   * Expand selectors — keys, group names, or `'*'` — into keys.
   *
   * A name that is both a key and a group resolves as the key, because the
   * more specific reading is the one somebody meant.
   */
  resolve(...selectors: string[]): string[] {
    if (!selectors.length) return [];
    const out: string[] = [];
    const seen = new Set<string>();
    const take = (key: string) => {
      if (!seen.has(key)) {
        seen.add(key);
        out.push(key);
      }
    };
    for (const selector of selectors) {
      if (selector === '*') {
        this.keys.forEach(take);
      } else if (this.has(selector)) {
        take(selector);
      } else {
        const group = Object.entries(this.manifest.assets).filter(
          ([, entry]) => entry.group === selector
        );
        if (!group.length) {
          throw new Error(
            `AssetLibrary: no asset or group named "${selector}". Known groups: ${this.groups.join(', ') || '(none)'}`
          );
        }
        group.forEach(([key]) => take(key));
      }
    }
    return out;
  }

  // ---- loading -----------------------------------------------------------

  /**
   * Load keys and/or groups. Already-loaded ones are counted, not refetched.
   *
   * Resolves when everything asked for is in. Rejects on the first failure
   * that survives its retries, with the key in the message — a bare
   * "404 Not Found" from somewhere inside a loader is not a diagnosis.
   */
  async load(...selectors: string[]): Promise<void> {
    const keys = this.resolve(...selectors);
    for (const key of keys) this.requested.add(key);
    this.emit();

    const queue = [...keys];
    const workers = Array.from({ length: Math.min(this.concurrency, queue.length) }, async () => {
      for (let key = queue.shift(); key !== undefined; key = queue.shift()) {
        await this.one(key);
      }
    });
    await Promise.all(workers);
    this.current = null;
    this.emit();
  }

  private async one(key: string): Promise<unknown> {
    const cached = this.cache.get(key);
    if (cached) {
      cached.refs += 1;
      this.fetched.set(key, this.weight(key));
      this.emit();
      return cached.value;
    }
    const flying = this.inFlight.get(key);
    // A second request for something already on the wire waits for it, and
    // still gets a reference — otherwise `release` would free it early.
    if (flying) {
      const value = await flying;
      const now = this.cache.get(key);
      if (now) now.refs += 1;
      return value;
    }

    const entry = this.require(key);
    const loader = this.loaders[entry.type];
    if (!loader) {
      throw new Error(
        `AssetLibrary: no loader for type "${entry.type}" (asset "${key}"). ` +
          `Register one with library.register('${entry.type}', loader).`
      );
    }

    this.current = key;
    const url = `${this.base}${entry.url}`;
    const weight = this.weight(key);

    const attempt = async (tries: number): Promise<unknown> => {
      try {
        return await loader(url, (loaded, total) => {
          // Trust the manifest's size over the server's: a gzipped response
          // reports the compressed length and the bar would finish early.
          const done = total > 0 ? (loaded / total) * weight : 0;
          this.fetched.set(key, Math.min(weight, done));
          this.emit();
        });
      } catch (error) {
        if (tries <= 0) {
          throw new Error(`AssetLibrary: failed to load "${key}" from ${url}: ${String(error)}`);
        }
        await new Promise((r) => setTimeout(r, 150 * (this.retries - tries + 1)));
        return attempt(tries - 1);
      }
    };

    const promise = attempt(this.retries).then((value) => {
      this.cache.set(key, { entry, value, refs: 1 });
      this.fetched.set(key, weight);
      this.inFlight.delete(key);
      this.emit();
      return value;
    });
    this.inFlight.set(key, promise);
    try {
      return await promise;
    } catch (error) {
      // Do not poison the cache: a retry after a dropped connection should
      // be allowed to work.
      this.inFlight.delete(key);
      this.requested.delete(key);
      this.fetched.delete(key);
      throw error;
    }
  }

  // ---- reading -----------------------------------------------------------

  /**
   * A loaded asset, or a thrown error naming what to do about it.
   *
   * Returning undefined here would push the failure into whatever line
   * happens to touch the result next, which is usually deep inside three.js.
   */
  get<T = unknown>(key: string): T {
    const loaded = this.cache.get(key);
    if (!loaded) {
      if (!this.has(key)) throw new Error(`AssetLibrary: unknown asset "${key}"`);
      throw new Error(`AssetLibrary: "${key}" is not loaded — await library.load('${key}') first`);
    }
    return loaded.value as T;
  }

  /** A loaded model's scene root. Handles the glTF wrapper. */
  scene(key: string): Object3D {
    const value = this.get(key) as Object3D | { scene?: Object3D };
    const object = value instanceof Object3D ? value : value?.scene;
    if (!object) throw new Error(`AssetLibrary: "${key}" is not a model`);
    return object;
  }

  texture<T = unknown>(key: string): T {
    return this.get<T>(key);
  }

  audio(key: string): AudioBuffer {
    return this.get<AudioBuffer>(key);
  }

  json<T = unknown>(key: string): T {
    return this.get<T>(key);
  }

  /**
   * A fresh copy of a model, sharing the original's geometry and materials.
   *
   * `SkeletonUtils.clone` when there is a skeleton — `Object3D.clone` leaves
   * a skinned mesh bound to the ORIGINAL's bones, so every copy animates in
   * lockstep with the first one and nobody can see why.
   */
  instance(key: string): Object3D {
    const source = this.scene(key);
    const skinned = hasSkeleton(source);
    const copy = skinned ? (cloneSkinned(source) as Object3D) : source.clone(true);
    copy.name = copy.name || key;
    return copy;
  }

  /**
   * A `Catalog` factory for this model, so a level file can place it.
   *
   * The returned object claims ownership with a `dispose()` that does
   * nothing, which is exactly right: the clone's geometry belongs to the
   * library, and freeing it when one placement is deleted would blank every
   * other copy in the level.
   */
  factory(key: string, options: { scale?: number } = {}): Factory {
    return () => {
      const object = this.instance(key);
      if (options.scale !== undefined) object.scale.setScalar(options.scale);
      const placed: PlacedAsset = {
        object,
        asset: key,
        // Shared with the library. Not this placement's to free — deleting
        // one crate in the editor must not blank the other thirty-nine.
        dispose: () => {},
      };
      return placed;
    };
  }

  // ---- unloading ---------------------------------------------------------

  /**
   * Let go of keys or groups. Frees only what nobody else is holding.
   *
   * Returns the keys actually freed, which is worth logging when a level
   * transition does not reclaim what you expected.
   */
  release(...selectors: string[]): string[] {
    const freed: string[] = [];
    for (const key of this.resolve(...selectors)) {
      const loaded = this.cache.get(key);
      if (!loaded) continue;
      loaded.refs -= 1;
      if (loaded.refs > 0) continue;

      this.cache.delete(key);
      this.requested.delete(key);
      this.fetched.delete(key);
      freed.push(key);

      const value = loaded.value;
      if (claimsOwnership(value)) {
        value.dispose();
        continue;
      }
      const object = value instanceof Object3D ? value : (value as { scene?: Object3D })?.scene;
      if (object) releaseObject(object);
      else if (isDisposable(value)) value.dispose();
    }
    this.emit();
    return freed;
  }

  /**
   * Let go of everything, whatever the reference counts say.
   *
   * For a hard teardown — leaving a game, swapping a whole content pack —
   * where the point is that nothing survives.
   */
  clear(): void {
    for (const loaded of this.cache.values()) loaded.refs = 1;
    this.release(...this.cache.keys());
    this.requested.clear();
    this.fetched.clear();
    this.emit();
  }

  // ---- progress ----------------------------------------------------------

  get progress(): AssetProgress {
    let bytesTotal = 0;
    let bytesLoaded = 0;
    let loaded = 0;
    for (const key of this.requested) {
      const weight = this.weight(key);
      bytesTotal += weight;
      bytesLoaded += this.fetched.get(key) ?? 0;
      if (this.cache.has(key)) loaded += 1;
    }
    return {
      loaded,
      total: this.requested.size,
      bytesLoaded: Math.round(bytesLoaded),
      bytesTotal,
      fraction: bytesTotal > 0 ? Math.min(1, bytesLoaded / bytesTotal) : 1,
      current: this.current,
    };
  }

  /** Total download for a selection, before loading any of it. */
  weightOf(...selectors: string[]): number {
    return this.resolve(...selectors).reduce((sum, key) => sum + this.weight(key), 0);
  }

  private weight(key: string): number {
    return this.manifest.assets[key]?.bytes ?? this.assumedBytes;
  }

  private emit(): void {
    this.onProgress?.(this.progress);
  }

  private require(key: string): AssetEntry {
    const entry = this.manifest.assets[key];
    if (!entry) {
      throw new Error(
        `AssetLibrary: unknown asset "${key}". Did the manifest get rebuilt? ` +
          `Known: ${this.keys.slice(0, 8).join(', ')}${this.keys.length > 8 ? '…' : ''}`
      );
    }
    return entry;
  }
}

function hasSkeleton(root: Object3D): boolean {
  let found = false;
  root.traverse((node) => {
    if ((node as { isSkinnedMesh?: boolean }).isSkinnedMesh) found = true;
  });
  return found;
}

function isDisposable(value: unknown): value is { dispose: () => void } {
  return typeof (value as { dispose?: unknown } | null)?.dispose === 'function';
}
