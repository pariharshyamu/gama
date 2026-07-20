/**
 * Accumulator for fixed-timestep simulation. Feed it variable frame deltas;
 * it invokes `step` zero or more times per frame with a constant delta.
 * `maxSubSteps` prevents the spiral of death after a long stall.
 */
export class FixedStepper {
  private accumulator = 0;

  constructor(public fixedDelta = 1 / 50, public maxSubSteps = 5) {}

  advance(dt: number, step: (fixedDelta: number) => void): void {
    this.accumulator += dt;
    let steps = 0;
    while (this.accumulator >= this.fixedDelta && steps < this.maxSubSteps) {
      step(this.fixedDelta);
      this.accumulator -= this.fixedDelta;
      steps++;
    }
    // If we hit the cap, drop the surplus instead of accumulating debt.
    if (this.accumulator >= this.fixedDelta) {
      this.accumulator = this.accumulator % this.fixedDelta;
    }
  }

  /** Interpolation factor in [0, 1) — how far into the next fixed step we are. */
  get alpha(): number {
    return this.accumulator / this.fixedDelta;
  }

  reset(): void {
    this.accumulator = 0;
  }
}
