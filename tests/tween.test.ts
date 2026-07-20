import { describe, expect, it } from 'vitest';
import { Tweens } from '../src/animation/Tween';
import { quadOut, bounceOut, linear } from '../src/animation/easing';

describe('Tweens', () => {
  it('interpolates numeric properties to the target values', () => {
    const tweens = new Tweens();
    const obj = { x: 0, y: 10 };
    tweens.to(obj, { x: 100, y: 0 }, { duration: 1, easing: linear });

    tweens.update(0.5);
    expect(obj.x).toBeCloseTo(50);
    expect(obj.y).toBeCloseTo(5);

    tweens.update(0.5);
    expect(obj.x).toBe(100);
    expect(obj.y).toBe(0);
    expect(tweens.active).toBe(0);
  });

  it('respects delay and captures start values lazily', () => {
    const tweens = new Tweens();
    const obj = { x: 0 };
    tweens.to(obj, { x: 10 }, { duration: 1, delay: 0.5 });

    tweens.update(0.25);
    expect(obj.x).toBe(0);

    obj.x = 5; // moved during the delay — tween should start from here
    tweens.update(0.25);
    tweens.update(1);
    expect(obj.x).toBe(10);
  });

  it('fires onComplete exactly once', () => {
    const tweens = new Tweens();
    let calls = 0;
    tweens.to({ x: 0 }, { x: 1 }, { duration: 0.1, onComplete: () => calls++ });
    tweens.update(1);
    tweens.update(1);
    expect(calls).toBe(1);
  });
});

describe('easing', () => {
  it.each([linear, quadOut, bounceOut])('maps 0→0 and 1→1', (fn) => {
    expect(fn(0)).toBeCloseTo(0);
    expect(fn(1)).toBeCloseTo(1);
  });
});
