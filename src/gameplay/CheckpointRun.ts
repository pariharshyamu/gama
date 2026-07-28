import type { Vec3Like } from '../audio/Soundboard';

/**
 * A checkpoint the run can drive: a trigger circle, and optionally a
 * `setState` for its visuals. Structurally SCENA's `Checkpoint` — the
 * arch lights up without either library importing the other. A bare
 * `{trigger}` works too; the run simply has nothing to light.
 */
export interface CheckpointLike {
  trigger: { center: Vec3Like; radius: number };
  setState?(state: 'upcoming' | 'active' | 'passed'): void;
}

export interface CheckpointRunOptions {
  /** How many laps make a finish. Default 1. */
  laps?: number;
  /** The actor's radius added to every checkpoint's. Default 0.5. */
  reach?: number;
  /** Fired when a checkpoint is taken: its index, and the current lap (1-based). */
  onAdvance?: (index: number, lap: number) => void;
  /** Fired when a lap completes, with the lap just finished. */
  onLap?: (lap: number) => void;
  /** Fired once, when the last checkpoint of the last lap is taken. */
  onFinish?: () => void;
}

/**
 * CheckpointRun — order, enforced.
 *
 * The one thing a checkpoint sequence must do is refuse shortcuts: only
 * the NEXT checkpoint counts, however hard you drive through the others.
 * Feed it a position every frame; it advances when the right circle is
 * entered, tells each checkpoint prop what it now is (passed / active /
 * upcoming), and calls the lap and finish events at the moments a HUD
 * banner wants them.
 *
 * ```ts
 * const run = new CheckpointRun(arches, {
 *   laps: 3,
 *   onAdvance: () => sounds.blip(),
 *   onLap: (lap) => { hud.banner(`LAP ${lap + 1}/3`); hud.lap(lap + 1, 3); },
 *   onFinish: () => { hud.banner('FINISH!'); feel.slowMo(0.3, 2); },
 * });
 * game.onUpdate(() => run.test(kart.position));
 * ```
 */
export class CheckpointRun {
  private readonly points: CheckpointLike[];
  private readonly laps: number;
  private readonly reach: number;
  private readonly options: CheckpointRunOptions;
  private next = 0;
  private currentLap = 1;
  private done = false;

  constructor(
    points: ReadonlyArray<CheckpointLike | { center: Vec3Like; radius: number }>,
    options: CheckpointRunOptions = {}
  ) {
    if (points.length === 0) throw new Error('CheckpointRun: no checkpoints');
    // Accept bare circles by wrapping them into the checkpoint shape.
    this.points = points.map((p) =>
      'trigger' in p ? p : ({ trigger: p } as CheckpointLike)
    );
    this.laps = Math.max(options.laps ?? 1, 1);
    this.reach = options.reach ?? 0.5;
    this.options = options;
    this.paint();
  }

  /** Index of the checkpoint that counts next. */
  get index(): number {
    return this.next;
  }

  /** The lap in progress, 1-based. */
  get lap(): number {
    return this.currentLap;
  }

  get finished(): boolean {
    return this.done;
  }

  /** Fraction of the whole run completed, 0..1 — progress bars want this. */
  get progress(): number {
    if (this.done) return 1;
    const perLap = this.points.length;
    return ((this.currentLap - 1) * perLap + this.next) / (this.laps * perLap);
  }

  /** Back to the start line: lap 1, checkpoint 0, lights repainted. */
  reset(): void {
    this.next = 0;
    this.currentLap = 1;
    this.done = false;
    this.paint();
  }

  /**
   * Test the actor's position; returns true if it took its next
   * checkpoint this call. Everything else — wrong arches included — is
   * ignored, which is the entire point.
   */
  test(position: Vec3Like): boolean {
    if (this.done) return false;
    const point = this.points[this.next];
    const { center, radius } = point.trigger;
    const dx = position.x - center.x;
    const dz = position.z - center.z;
    const range = radius + this.reach;
    // Planar on purpose: an arch is entered at any height under it.
    if (dx * dx + dz * dz > range * range) return false;

    point.setState?.('passed');
    const taken = this.next;
    this.next++;
    this.options.onAdvance?.(taken, this.currentLap);

    if (this.next >= this.points.length) {
      const lapDone = this.currentLap;
      if (lapDone >= this.laps) {
        this.done = true;
        this.options.onLap?.(lapDone);
        this.options.onFinish?.();
        return true;
      }
      this.currentLap++;
      this.next = 0;
      this.options.onLap?.(lapDone);
    }
    this.paint();
    return true;
  }

  /** Tell every checkpoint what it currently is. */
  private paint(): void {
    if (this.done) return;
    this.points.forEach((point, i) => {
      point.setState?.(i === this.next ? 'active' : i < this.next ? 'passed' : 'upcoming');
    });
  }
}
