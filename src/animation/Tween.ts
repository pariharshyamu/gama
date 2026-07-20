import { linear, type Easing } from './easing';

type NumericRecord = Record<string, number>;

export interface TweenOptions<T> {
  duration?: number;
  easing?: Easing;
  delay?: number;
  onUpdate?: (target: T, t: number) => void;
  onComplete?: (target: T) => void;
}

/**
 * Tween any numeric properties of an object (positions, rotations, material
 * opacity, ...) over time. Update tweens each frame via a Tweens group:
 *
 * ```ts
 * const tweens = new Tweens();
 * game.onUpdate((time) => tweens.update(time.delta));
 * tweens.to(mesh.position, { y: 3 }, { duration: 0.5, easing: bounceOut });
 * ```
 */
export class Tween<T extends object> {
  private elapsed = 0;
  private from: NumericRecord = {};
  private started = false;
  done = false;

  private readonly duration: number;
  private readonly easing: Easing;
  private readonly delay: number;
  private readonly onUpdateCb?: (target: T, t: number) => void;
  private readonly onCompleteCb?: (target: T) => void;

  constructor(
    public readonly target: T,
    private readonly to: NumericRecord,
    options: TweenOptions<T> = {}
  ) {
    this.duration = options.duration ?? 1;
    this.easing = options.easing ?? linear;
    this.delay = options.delay ?? 0;
    this.onUpdateCb = options.onUpdate;
    this.onCompleteCb = options.onComplete;
  }

  /** Advance by dt seconds. Returns true while still running. */
  update(dt: number): boolean {
    if (this.done) return false;
    this.elapsed += dt;
    const local = this.elapsed - this.delay;
    if (local < 0) return true;

    if (!this.started) {
      this.started = true;
      // Capture start values lazily so delayed tweens start from live state.
      for (const key of Object.keys(this.to)) {
        this.from[key] = (this.target as NumericRecord)[key];
      }
    }

    const t = this.duration <= 0 ? 1 : Math.min(local / this.duration, 1);
    const eased = this.easing(t);
    for (const key of Object.keys(this.to)) {
      (this.target as NumericRecord)[key] =
        this.from[key] + (this.to[key] - this.from[key]) * eased;
    }
    this.onUpdateCb?.(this.target, t);

    if (t >= 1) {
      this.done = true;
      this.onCompleteCb?.(this.target);
    }
    return !this.done;
  }

  cancel(): void {
    this.done = true;
  }
}

/** A group of running tweens, updated once per frame. */
export class Tweens {
  private tweens: Tween<object>[] = [];

  to<T extends object>(target: T, to: NumericRecord, options?: TweenOptions<T>): Tween<T> {
    const tween = new Tween(target, to, options);
    this.tweens.push(tween as unknown as Tween<object>);
    return tween;
  }

  update(dt: number): void {
    for (let i = this.tweens.length - 1; i >= 0; i--) {
      if (!this.tweens[i].update(dt)) this.tweens.splice(i, 1);
    }
  }

  get active(): number {
    return this.tweens.length;
  }

  clear(): void {
    this.tweens.length = 0;
  }
}
