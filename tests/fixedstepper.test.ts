import { describe, expect, it } from 'vitest';
import { FixedStepper } from '../src/core/FixedStepper';

describe('FixedStepper', () => {
  it('produces a deterministic number of steps for a given elapsed time', () => {
    // Binary-exact values so the accumulator carries no float error.
    const stepper = new FixedStepper(0.25, 100);
    let steps = 0;
    for (const dt of [0.5, 0.375, 0.75, 0.625]) {
      stepper.advance(dt, () => steps++);
    }
    expect(steps).toBe(9); // 2.25s / 0.25s
  });

  it('always passes the exact fixed delta to the step callback', () => {
    const stepper = new FixedStepper(0.02);
    const deltas: number[] = [];
    stepper.advance(0.07, (dt) => deltas.push(dt));
    expect(deltas).toEqual([0.02, 0.02, 0.02]);
  });

  it('caps sub-steps after a long stall and drops the surplus', () => {
    const stepper = new FixedStepper(1 / 50, 5);
    let steps = 0;
    stepper.advance(3, () => steps++); // 3s stall would be 150 steps
    expect(steps).toBe(5);
    // Next normal frame does not replay the backlog
    steps = 0;
    stepper.advance(1 / 60, () => steps++);
    expect(steps).toBeLessThanOrEqual(1);
  });

  it('exposes an interpolation alpha in [0, 1)', () => {
    const stepper = new FixedStepper(0.02);
    stepper.advance(0.03, () => {});
    expect(stepper.alpha).toBeCloseTo(0.5);
    expect(stepper.alpha).toBeGreaterThanOrEqual(0);
    expect(stepper.alpha).toBeLessThan(1);
  });
});
