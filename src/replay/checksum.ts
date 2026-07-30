import type { Object3D } from 'three';

/**
 * A number that says what the world looks like.
 *
 * Determinism is a claim — "the same inputs produce the same game" — and a
 * claim nobody measures is a wish. This turns the whole world into one
 * integer, so two runs can be compared per tick and the FIRST tick they
 * disagree on can be named. That tick is the bug; everything after it is
 * consequence, and a diff of final states only ever shows you consequence.
 *
 * ```ts
 * const a = worldChecksum(game.world);
 * // …replay the same inputs into a fresh world…
 * const b = worldChecksum(replayed.world);
 * a === b   // the run reproduced
 * ```
 */

/** Anything with an ordered list of objects — `World`, or your own. */
export interface ChecksumSource {
  objects: ReadonlyArray<Object3D>;
}

export interface ChecksumOptions {
  /**
   * Round each component to this many decimal places before hashing.
   *
   * Leave it off for a replay on ONE machine, where the arithmetic is bit
   * exact and any difference at all is a real divergence you want to see the
   * moment it appears.
   *
   * Set it — 3 or 4 — when comparing two *different* machines, where the same
   * expression can legally differ in the last bit. Understand the trade: a
   * rounded checksum cannot see drift below the quantum, so it reports a
   * desync later than it started, and sometimes not at all.
   */
  precision?: number;
  /**
   * Include an object's name in the hash. Default true.
   *
   * Turn it off to compare two worlds built by different code paths — a
   * server's authoritative copy against a client's prediction, say, where the
   * bodies match but the labels do not.
   */
  names?: boolean;
  /** Also hash `visible`, `scale` and `userData.checksum`. Default false. */
  deep?: boolean;
}

// FNV-1a, 32-bit. Chosen because it is four lines, has no lookup table and no
// seed to get wrong, and this is not a security hash — it is a tripwire.
const OFFSET = 0x811c9dc5;
const PRIME = 0x01000193;

const view = new DataView(new ArrayBuffer(8));

function mixByte(hash: number, byte: number): number {
  return Math.imul(hash ^ byte, PRIME) >>> 0;
}

/**
 * Fold one float in, by its IEEE-754 bits.
 *
 * Not because a decimal string would lose information — JavaScript's
 * `Number#toString` emits the shortest text that round-trips, so it
 * distinguishes any two distinct doubles, including out at 1e21. The reasons
 * are that this runs on every component of every object on every fixed step,
 * where allocating a string per number is the whole cost; and that reading
 * eight bytes is uniform, where decimal output has special cases (`-0`, `1e+21`
 * notation) that each need remembering.
 */
function mixNumber(hash: number, value: number, precision?: number): number {
  let v = value;
  if (precision !== undefined) {
    const scale = 10 ** precision;
    v = Math.round(v * scale) / scale;
  }
  // −0 and 0 are the same position and must hash the same; their bits do not.
  if (v === 0) v = 0;
  // NaN has many bit patterns and one meaning. Collapse it, and do not throw:
  // a NaN in the world IS the finding, and it should show up as a divergence
  // rather than as an exception from the tool looking for one.
  if (Number.isNaN(v)) return mixByte(hash, 0xff);
  view.setFloat64(0, v);
  let h = hash;
  for (let i = 0; i < 8; i++) h = mixByte(h, view.getUint8(i));
  return h;
}

function mixString(hash: number, text: string): number {
  let h = hash;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    h = mixByte(mixByte(h, code & 0xff), code >>> 8);
  }
  return h;
}

/**
 * Hash a world's transforms into one unsigned 32-bit integer.
 *
 * Order matters and is taken as given: `World.objects` is an array, spawned
 * order is stable, and two runs that spawn the same things in the same order
 * hash the same. If your own source iterates a `Set` or an object's keys, sort
 * it first — an unordered container will report a divergence every run and
 * teach everybody to ignore the gate.
 */
export function worldChecksum(source: ChecksumSource, options: ChecksumOptions = {}): number {
  const { precision, names = true, deep = false } = options;
  let hash = OFFSET;
  for (const object of source.objects) {
    if (names) hash = mixString(hash, object.name);
    const p = object.position;
    hash = mixNumber(hash, p.x, precision);
    hash = mixNumber(hash, p.y, precision);
    hash = mixNumber(hash, p.z, precision);
    const q = object.quaternion;
    hash = mixNumber(hash, q.x, precision);
    hash = mixNumber(hash, q.y, precision);
    hash = mixNumber(hash, q.z, precision);
    hash = mixNumber(hash, q.w, precision);
    if (deep) {
      const s = object.scale;
      hash = mixNumber(hash, s.x, precision);
      hash = mixNumber(hash, s.y, precision);
      hash = mixNumber(hash, s.z, precision);
      hash = mixByte(hash, object.visible ? 1 : 0);
      // The escape hatch: anything a game knows is state but three.js does not
      // — health, ammo, a timer. Put a number in `userData.checksum` and it
      // joins the hash. Without this, a world can desync in every way that
      // matters while every transform still agrees.
      const extra = (object.userData as { checksum?: unknown }).checksum;
      if (typeof extra === 'number') hash = mixNumber(hash, extra, precision);
    }
    // A separator, so [1,23] and [12,3] cannot collide by concatenation.
    hash = mixByte(hash, 0x1f);
  }
  return hash >>> 0;
}

/** The same hash over plain numbers — for a tick's inputs, or your own state. */
export function checksumOf(values: ReadonlyArray<number | string | boolean>): number {
  let hash = OFFSET;
  for (const value of values) {
    if (typeof value === 'number') hash = mixNumber(hash, value);
    else if (typeof value === 'string') hash = mixString(hash, value);
    else hash = mixByte(hash, value ? 1 : 0);
    hash = mixByte(hash, 0x1f);
  }
  return hash >>> 0;
}
