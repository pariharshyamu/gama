/**
 * SaveSlot — where the all-procedural bet pays off in kilobytes.
 *
 * Everything in this trilogy is generated from seeds, so a save is not a
 * world: it is a seed, a handful of numbers, and maybe a ghost tape.
 * This wraps the boring-but-load-bearing parts: a versioned envelope, a
 * JSON round-trip, corruption treated as "no save" rather than a crash,
 * and an injectable storage so tests (and exotic embeddings) never touch
 * the real localStorage.
 *
 * ```ts
 * const slot = new SaveSlot<MySave>('coinrun', { version: 2 });
 * slot.save({ seed: 7, bestLap: 41.3, coins: 120 });
 * const loaded = slot.load();          // null: absent, corrupt, or old version
 * ```
 */

/** The subset of Storage this needs — a Map-backed fake satisfies it. */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface SaveSlotOptions {
  /**
   * Bump this when the save shape changes: older envelopes load as null
   * instead of as shape-mismatched objects your code trips over.
   * Default 1.
   */
  version?: number;
  /** Storage to use. Default the page's localStorage; absent = in-memory. */
  storage?: StorageLike;
}

interface Envelope<T> {
  v: number;
  savedAt: number;
  data: T;
}

/** In-memory fallback, so a storage-less environment degrades to "session only". */
class MemoryStorage implements StorageLike {
  private readonly map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

export class SaveSlot<T> {
  private readonly key: string;
  private readonly version: number;
  private readonly storage: StorageLike;

  constructor(name: string, options: SaveSlotOptions = {}) {
    this.key = `gama:${name}`;
    this.version = options.version ?? 1;
    this.storage =
      options.storage ??
      (typeof localStorage === 'undefined' ? new MemoryStorage() : localStorage);
  }

  /** True if a loadable (current-version, uncorrupt) save exists. */
  get exists(): boolean {
    return this.load() !== null;
  }

  save(data: T): void {
    const envelope: Envelope<T> = { v: this.version, savedAt: Date.now(), data };
    this.storage.setItem(this.key, JSON.stringify(envelope));
  }

  /**
   * The save, or null — and null MEANS null: absent, unparseable, and
   * wrong-version all land there, because code downstream should branch
   * on "is there a usable save", not on three flavours of failure.
   */
  load(): T | null {
    const raw = this.storage.getItem(this.key);
    if (raw === null) return null;
    try {
      const envelope = JSON.parse(raw) as Envelope<T>;
      if (!envelope || envelope.v !== this.version) return null;
      return envelope.data ?? null;
    } catch {
      return null;
    }
  }

  /** When the current save was written (ms epoch), or null. */
  savedAt(): number | null {
    const raw = this.storage.getItem(this.key);
    if (raw === null) return null;
    try {
      const envelope = JSON.parse(raw) as Envelope<T>;
      return envelope.v === this.version ? envelope.savedAt : null;
    } catch {
      return null;
    }
  }

  clear(): void {
    this.storage.removeItem(this.key);
  }
}
