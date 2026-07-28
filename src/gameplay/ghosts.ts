import type { Vec3Like } from '../audio/Soundboard';

/**
 * Ghosts — the recording of a run, and the racing of it.
 *
 * Record an actor's pose at a fixed sample interval into flat arrays;
 * play it back later as the translucent rival every time-trial needs.
 * The seeded-procedural bet makes the tapes tiny: a two-minute lap at
 * 20 Hz is ~2400 floats of position plus yaw — small enough to live in
 * a SaveSlot next to the seed, which is the whole retention loop:
 * *beat yesterday's you*.
 *
 * ```ts
 * const recorder = new GhostRecorder();
 * game.onUpdate((t) => {
 *   const dt = flow.gate(t.delta);
 *   recorder.record(kart.position, kart.rotation.y, dt);
 * });
 * // at the finish line:
 * const tape = recorder.finish();
 * slot.save({ seed, best: tape.toJSON() });
 *
 * // next run:
 * const ghost = new Ghost(GhostTape.fromJSON(loaded.best));
 * game.onUpdate(() => {
 *   const pose = ghost.at(lapClock);
 *   ghostMesh.position.copy(pose.position);
 *   ghostMesh.rotation.y = pose.yaw;
 * });
 * ```
 */

export interface GhostPose {
  position: { x: number; y: number; z: number };
  yaw: number;
}

export interface GhostTapeJSON {
  interval: number;
  samples: number[];
}

const STRIDE = 4; // x, y, z, yaw

export class GhostTape {
  constructor(
    /** Seconds between samples. */
    readonly interval: number,
    /** Flat [x, y, z, yaw] per sample. */
    readonly samples: Float32Array
  ) {}

  get count(): number {
    return this.samples.length / STRIDE;
  }

  get duration(): number {
    return Math.max(this.count - 1, 0) * this.interval;
  }

  toJSON(): GhostTapeJSON {
    return { interval: this.interval, samples: Array.from(this.samples) };
  }

  static fromJSON(json: GhostTapeJSON): GhostTape {
    const interval = Number.isFinite(json?.interval) && json.interval > 0 ? json.interval : 1 / 20;
    const raw = Array.isArray(json?.samples) ? json.samples : [];
    // Truncate to whole samples; a torn tail is dropped, not interpolated.
    const whole = raw.length - (raw.length % STRIDE);
    return new GhostTape(interval, Float32Array.from(raw.slice(0, whole)));
  }
}

export interface GhostRecorderOptions {
  /** Seconds between samples. Default 1/20 — smooth enough, tiny enough. */
  sampleEvery?: number;
  /** Hard cap on samples (memory honesty). Default 12000 (10 min at 20 Hz). */
  maxSamples?: number;
}

export class GhostRecorder {
  private readonly interval: number;
  private readonly maxSamples: number;
  private samples: number[] = [];
  private accumulator = 0;
  private started = false;

  constructor(options: GhostRecorderOptions = {}) {
    this.interval = Math.max(options.sampleEvery ?? 1 / 20, 1 / 120);
    this.maxSamples = Math.max(options.maxSamples ?? 12000, 2);
  }

  get recording(): number {
    return this.samples.length / STRIDE;
  }

  /**
   * Feed the actor's pose every frame with the frame's GAMEPLAY delta;
   * the recorder samples itself at its own fixed interval. The first
   * call is always captured — a tape must start where the run started.
   */
  record(position: Vec3Like, yaw: number, dt: number): void {
    const step = Number.isFinite(dt) ? Math.max(dt, 0) : 0;
    if (!this.started) {
      this.started = true;
      this.push(position, yaw);
      return;
    }
    this.accumulator += step;
    while (this.accumulator >= this.interval) {
      this.accumulator -= this.interval;
      this.push(position, yaw);
    }
  }

  private push(position: Vec3Like, yaw: number): void {
    if (this.samples.length / STRIDE >= this.maxSamples) return;
    this.samples.push(position.x, position.y, position.z, Number.isFinite(yaw) ? yaw : 0);
  }

  /** Seal the tape (and reset the recorder for the next run). */
  finish(): GhostTape {
    const tape = new GhostTape(this.interval, Float32Array.from(this.samples));
    this.reset();
    return tape;
  }

  reset(): void {
    this.samples = [];
    this.accumulator = 0;
    this.started = false;
  }
}

/** Playback: ask for the pose at any time; between samples it interpolates. */
export class Ghost {
  private readonly pose: GhostPose = { position: { x: 0, y: 0, z: 0 }, yaw: 0 };

  constructor(readonly tape: GhostTape) {}

  get duration(): number {
    return this.tape.duration;
  }

  /** True once `time` has passed the end of the tape — the ghost finished. */
  done(time: number): boolean {
    return time >= this.duration;
  }

  /**
   * The pose at `time`, clamped to the tape's ends. The returned object
   * is reused between calls — copy it if you keep it.
   */
  at(time: number): GhostPose {
    const { samples, interval } = this.tape;
    const count = this.tape.count;
    if (count === 0) return this.pose;
    const t = Number.isFinite(time) ? Math.max(time, 0) : 0;
    const exact = Math.min(t / interval, count - 1);
    const i = Math.floor(exact);
    const j = Math.min(i + 1, count - 1);
    const f = exact - i;
    const a = i * STRIDE;
    const b = j * STRIDE;
    this.pose.position.x = samples[a] + (samples[b] - samples[a]) * f;
    this.pose.position.y = samples[a + 1] + (samples[b + 1] - samples[a + 1]) * f;
    this.pose.position.z = samples[a + 2] + (samples[b + 2] - samples[a + 2]) * f;
    // Yaw interpolates the short way around — a ghost must not pirouette
    // crossing ±π.
    let ya = samples[a + 3];
    const yb = samples[b + 3];
    let dy = yb - ya;
    if (dy > Math.PI) dy -= Math.PI * 2;
    else if (dy < -Math.PI) dy += Math.PI * 2;
    this.pose.yaw = ya + dy * f;
    return this.pose;
  }
}
