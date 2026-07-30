/**
 * The asset manifest.
 *
 * A game's assets are a *list*, not a pile of string literals scattered
 * through the code. The manifest is that list, generated at build time by
 * `scripts/assets.mjs`, and it is what turns loading from "fetch some URLs"
 * into a pipeline:
 *
 *   - **keys, not paths.** Code says `library.model('crate')`, so moving a
 *     file or adding a content hash to its name breaks the build script, not
 *     the game.
 *   - **sizes, before loading.** A loading bar that only knows how many
 *     files are left jumps backwards every time a new request starts and
 *     lies about the last 40% (one 3 MB model weighs the same as one 2 KB
 *     JSON). Bytes are recorded at build time, so the bar is honest from
 *     the first frame.
 *   - **groups.** A game loads its menu, then a level, then the next level.
 *     Groups are how it says which is which — and how it unloads one.
 *   - **hashes.** Both for cache-busting and so the build script can point
 *     out that two paths are the same bytes.
 */

export const MANIFEST_VERSION = 1;

export type AssetType = 'model' | 'texture' | 'audio' | 'json' | 'text' | (string & {});

export interface AssetEntry {
  /** Path, relative to the manifest's `base`. */
  url: string;
  type: AssetType;
  /** Byte length, for honest progress. */
  bytes?: number;
  /** Content hash, short. Cache-busting, and duplicate detection. */
  hash?: string;
  /** Which bundle this belongs to. Absent means "always". */
  group?: string;
  /** Anything the game wants alongside: colliders, anchors, licence, author. */
  meta?: Record<string, unknown>;
}

export interface AssetManifest {
  format: 'gama.assets';
  version: number;
  /** Prefixed to every url. `'./assets/'` is the usual answer. */
  base?: string;
  assets: Record<string, AssetEntry>;
  /** Build stamp, source directory, budget warnings — informational. */
  meta?: Record<string, unknown>;
}

/**
 * Identity, for the type inference.
 *
 * ```ts
 * export const manifest = defineManifest({
 *   format: 'gama.assets', version: 1, base: './assets/',
 *   assets: { crate: { url: 'models/crate.gltf', type: 'model', bytes: 2048 } },
 * });
 * type Key = AssetKey<typeof manifest>;   // 'crate'
 * ```
 */
export const defineManifest = <T extends AssetManifest>(manifest: T): T => manifest;

/** The keys of a manifest, as a union — so a typo is a compile error. */
export type AssetKey<M extends AssetManifest> = keyof M['assets'] & string;

/**
 * Read a manifest from parsed JSON, refusing anything that is not one.
 *
 * The same reasoning as `Level.parse`: a stray JSON file should fail loudly
 * here rather than half-load into a game with no textures.
 */
export function parseManifest(input: unknown): AssetManifest {
  if (!input || typeof input !== 'object') throw new Error('parseManifest: not an object');
  const data = input as AssetManifest;
  if (data.format !== 'gama.assets') {
    throw new Error(`parseManifest: not a gama manifest (format: ${String(data.format)})`);
  }
  if (Number(data.version) > MANIFEST_VERSION) {
    throw new Error(
      `parseManifest: manifest is version ${data.version}, this build understands ${MANIFEST_VERSION}`
    );
  }
  if (!data.assets || typeof data.assets !== 'object') {
    throw new Error('parseManifest: no assets');
  }
  return data;
}
