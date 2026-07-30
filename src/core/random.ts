/**
 * A seeded random number generator.
 *
 * GAMA had seeds — `Level` carries one, `Catalog` hands one to every factory —
 * and no generator to spend them on, so the one template that needed random
 * numbers reached for `Math.random`. That made `createFlock` unreplayable: the
 * same tape, the same seed, a different flock every run. `npm test`'s replay
 * suite is what said so.
 *
 * ```ts
 * const rng = new Rng(7);
 * rng.next();                 // 0..1
 * rng.range(-5, 5);           // a float in a span
 * rng.int(1, 6);              // an integer, both ends inclusive
 * rng.pick(['a', 'b', 'c']);  // an element
 * ```
 *
 * Same seed, same sequence, forever — which is the entire point, and why the
 * algorithm below must not be "improved" without a version bump. Every
 * recorded replay, every committed level, every ghost is a promise about the
 * exact numbers this produces.
 */
export class Rng {
  private state: number;

  constructor(seed = 1) {
    // Mix the seed before first use so that 1, 2, 3 do not begin with three
    // near-identical values — a crowd seeded 1..n would otherwise start out
    // visibly striped.
    this.state = (Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) ^ 0x165667b1) >>> 0;
    for (let i = 0; i < 4; i++) this.next();
  }

  /**
   * The next float in [0, 1). mulberry32 — 32 bits of state, one multiply and
   * three shifts, and it passes the small-crush tests that matter for a game.
   */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** A float in [min, max). */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** An integer in [min, max] — BOTH ends inclusive, like a die. */
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  /** A float in [-spread, spread), centred on `about`. */
  jitter(about: number, spread: number): number {
    return about + this.range(-spread, spread);
  }

  /** True with probability `chance`. */
  chance(chance: number): boolean {
    return this.next() < chance;
  }

  /** An element. Throws on an empty list rather than returning undefined. */
  pick<T>(items: ReadonlyArray<T>): T {
    if (items.length === 0) throw new Error('Rng.pick: empty list');
    return items[Math.floor(this.next() * items.length)];
  }

  /**
   * Shuffle a copy, Fisher–Yates. Returns a new array so the caller's own
   * list — which is very often a shared constant — is not reordered.
   */
  shuffle<T>(items: ReadonlyArray<T>): T[] {
    const out = items.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  /**
   * A bound `() => number`, for the APIs that take one — `Wander`'s `random`
   * parameter, and anything else that wants injectable randomness without
   * knowing what produced it.
   */
  get stream(): () => number {
    return () => this.next();
  }

  /** A fresh generator whose seed comes from this one. */
  fork(): Rng {
    return new Rng((this.next() * 4294967296) >>> 0);
  }
}
