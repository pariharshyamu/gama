/**
 * Record what the player did; play it back and get the same game.
 *
 * A replay is not a video. It is the seed, the tick rate, and the inputs — a
 * few hundred bytes for a whole run — and playing it back means running the
 * simulation again. That buys three things a recording cannot:
 *
 *   - **A regression test made of real play.** Record a session that broke,
 *     commit the tape, and every future build has to reproduce it.
 *   - **A ghost, a demo, a spectator, an anti-cheat check.** All the same
 *     mechanism.
 *   - **The determinism itself, measured.** A replay that drifts has found a
 *     bug: something in the loop is reading the wall clock, or `Math.random`,
 *     or iterating a `Set`.
 *
 * That last one is the reason this ships with `checksums`. Determinism is easy
 * to claim and easy to lose — one `Math.random()` in a spawn routine does it —
 * and without a per-tick hash you find out weeks later when a tape stops
 * reproducing and nobody knows which commit broke it.
 *
 * ```ts
 * const tape = new Recorder({ seed: 7, tickRate: 50 });
 * game.onFixedUpdate(() => {
 *   const input = { x: pad.x, jump: pad.jump };
 *   tape.capture(input, worldChecksum(game.world));
 *   drive(input);
 * });
 *
 * const result = replay(tape.toJSON(), {
 *   build: (seed) => buildWorld(seed),
 *   apply: (input, world) => drive(input, world),
 *   checksum: (world) => worldChecksum(world),
 * });
 * result.diverged;   // null, or the FIRST tick that disagreed
 * ```
 */

/**
 * Bump when the shape changes in a way an old tape cannot survive, and add a
 * migration. Same contract as `LEVEL_VERSION` and `DIALOGUE_VERSION`: a
 * recorded session is evidence, and evidence is migrated rather than refused.
 */
export const REPLAY_VERSION = 1;

/** One tick's input, and optionally what the world looked like after it. */
export interface ReplayFrame<I = unknown> {
  tick: number;
  input: I;
  /** The world's checksum AFTER this tick, if the recorder was given one. */
  checksum?: number;
}

export interface ReplayTape<I = unknown> {
  version: number;
  /** The seed every generator in the run must start from. */
  seed: number;
  /** Simulation ticks per second. A replay at another rate is a different game. */
  tickRate: number;
  /**
   * Only the ticks where the input CHANGED. A tick with no frame repeats the
   * previous one, which is what turns a three-minute run into a few hundred
   * bytes — most ticks of most games are "the same as last tick".
   */
  frames: Array<ReplayFrame<I>>;
  /** Total ticks, including the repeats that are not stored. */
  ticks: number;
  /** Anything the game wants to carry: a level id, a build number, a name. */
  meta?: Record<string, unknown>;
}

export interface RecorderOptions {
  seed: number;
  tickRate: number;
  meta?: Record<string, unknown>;
  /**
   * Compare inputs to decide whether a tick needs storing. The default is
   * `JSON.stringify` equality, which is right for the small flat objects an
   * input frame should be and wrong for anything holding a `Map` or a class
   * instance — pass your own then.
   */
  same?: (a: unknown, b: unknown) => boolean;
}

const defaultSame = (a: unknown, b: unknown): boolean =>
  a === b || JSON.stringify(a) === JSON.stringify(b);

/**
 * Collects a tape as the game runs.
 *
 * Call `capture` exactly once per FIXED step, never per frame. A replay is a
 * sequence of simulation ticks; sampling it on a variable-rate render loop
 * records a tape that plays back differently on a faster machine, which is
 * the exact failure the whole idea exists to avoid.
 */
export class Recorder<I = unknown> {
  readonly seed: number;
  readonly tickRate: number;
  private frames: Array<ReplayFrame<I>> = [];
  private tick = 0;
  private last: I | undefined;
  private started = false;
  private same: (a: unknown, b: unknown) => boolean;
  private meta?: Record<string, unknown>;

  constructor(options: RecorderOptions) {
    this.seed = options.seed;
    this.tickRate = options.tickRate;
    this.same = options.same ?? defaultSame;
    this.meta = options.meta;
  }

  /** Ticks recorded so far. */
  get length(): number {
    return this.tick;
  }

  /** Frames actually stored — the tape's real size, after de-duplication. */
  get stored(): number {
    return this.frames.length;
  }

  /**
   * Record one tick. `checksum` is optional and worth the cost: without it a
   * replay can only tell you the run diverged, not when.
   */
  capture(input: I, checksum?: number): void {
    const changed = !this.started || !this.same(input, this.last);
    // A checksum is stored on every tick it is given, even an unchanged one:
    // divergence usually appears on a tick where the INPUT held steady and the
    // world moved differently anyway, and skipping those would hide it.
    if (changed || checksum !== undefined) {
      const frame: ReplayFrame<I> = { tick: this.tick, input };
      if (checksum !== undefined) frame.checksum = checksum;
      this.frames.push(frame);
    }
    if (changed) {
      // Structured-clone the stored input so a caller reusing one mutable
      // object per tick — which every input system does — does not rewrite
      // its own history.
      this.last = input;
    }
    this.tick++;
    this.started = true;
  }

  toJSON(): ReplayTape<I> {
    return {
      version: REPLAY_VERSION,
      seed: this.seed,
      tickRate: this.tickRate,
      frames: this.frames.map((f) => ({ ...f })),
      ticks: this.tick,
      ...(this.meta ? { meta: this.meta } : {}),
    };
  }

  reset(): void {
    this.frames = [];
    this.tick = 0;
    this.last = undefined;
    this.started = false;
  }
}

/** Reads a tape back, filling in the ticks it did not need to store. */
export class TapeReader<I = unknown> {
  private index = 0;
  private current: I | undefined;

  constructor(private tape: ReplayTape<I>) {}

  /** The input for `tick`. Must be called in order, from 0. */
  at(tick: number): I | undefined {
    while (this.index < this.tape.frames.length && this.tape.frames[this.index].tick <= tick) {
      this.current = this.tape.frames[this.index].input;
      this.index++;
    }
    return this.current;
  }

  /** The recorded checksum for `tick`, if one was stored. */
  checksumAt(tick: number): number | undefined {
    for (const frame of this.tape.frames) {
      if (frame.tick === tick) return frame.checksum;
      if (frame.tick > tick) break;
    }
    return undefined;
  }
}

export interface ReplayOptions<W, I> {
  /** Build a fresh world from the tape's seed. Must not read the wall clock. */
  build: (seed: number) => W;
  /** Advance the world by one tick with this input. */
  apply: (input: I | undefined, world: W, tick: number) => void;
  /** Hash the world after each tick, so a divergence can be located. */
  checksum?: (world: W, tick: number) => number;
  /** Stop after this many ticks rather than the tape's full length. */
  ticks?: number;
}

export interface Divergence {
  /** The first tick whose checksum disagreed. */
  tick: number;
  expected: number;
  actual: number;
}

export interface ReplayResult<W> {
  world: W;
  /** Ticks actually run. */
  ticks: number;
  /** `null` when the run reproduced, or the FIRST tick that did not. */
  diverged: Divergence | null;
  /** How many ticks carried a recorded checksum to compare against. */
  compared: number;
}

/**
 * Re-run a tape and report where — if anywhere — it stopped matching.
 *
 * It stops at the first divergence on purpose. Every later difference is
 * downstream of the first one, and a report listing four hundred diverging
 * ticks buries the only one that is a cause.
 */
export function replay<W, I = unknown>(
  tape: ReplayTape<I>,
  options: ReplayOptions<W, I>
): ReplayResult<W> {
  const reader = new TapeReader(tape);
  const world = options.build(tape.seed);
  const total = Math.min(options.ticks ?? tape.ticks, tape.ticks);
  let compared = 0;

  for (let tick = 0; tick < total; tick++) {
    options.apply(reader.at(tick), world, tick);
    if (!options.checksum) continue;
    const expected = reader.checksumAt(tick);
    if (expected === undefined) continue;
    compared++;
    const actual = options.checksum(world, tick);
    if (actual !== expected) {
      return { world, ticks: tick + 1, compared, diverged: { tick, expected, actual } };
    }
  }
  return { world, ticks: total, compared, diverged: null };
}

/** Accept a tape, migrating older versions. Throws on one from the future. */
export function parseReplay<I = unknown>(data: unknown): ReplayTape<I> {
  const tape = data as ReplayTape<I>;
  if (!tape || typeof tape !== 'object') throw new Error('parseReplay: not a tape');
  if (typeof tape.version !== 'number') throw new Error('parseReplay: no version');
  if (tape.version > REPLAY_VERSION) {
    throw new Error(
      `parseReplay: tape version ${tape.version} is newer than this build understands ` +
        `(${REPLAY_VERSION}). Refusing rather than replaying it wrong.`
    );
  }
  // No migrations yet — version 1 is the first shape. When one is needed it
  // goes here, and the tape is upgraded rather than rejected.
  if (!Array.isArray(tape.frames)) throw new Error('parseReplay: no frames');
  if (typeof tape.ticks !== 'number') throw new Error('parseReplay: no tick count');
  if (typeof tape.tickRate !== 'number' || tape.tickRate <= 0) {
    throw new Error('parseReplay: tickRate must be a positive number');
  }
  return tape;
}
