import { describe, expect, it, vi } from 'vitest';
import { LockOn, Missiles } from '../src';

const run = (missiles: Missiles, seconds: number, each?: () => void): void => {
  for (let t = 0; t < seconds; t += 1 / 60) {
    each?.();
    missiles.update(1 / 60);
  }
};

describe('Missiles', () => {
  it('converges on a slow mover — the fuse ends the argument', () => {
    const onHit = vi.fn();
    const missiles = new Missiles({ onHit, seed: 2 });
    const bandit = { center: { x: 20, y: 12, z: 5 }, radius: 1.5 };
    missiles.fire({ x: 0, y: 10, z: 0 }, { x: 0, y: 0, z: 1 }, bandit); // fired the WRONG way
    run(missiles, 5, () => (bandit.center.x += 3 / 60)); // ambling along
    expect(onHit).toHaveBeenCalledTimes(1);
    expect(onHit.mock.calls[0][0].target).toBe(bandit);
    expect(missiles.alive).toBe(0);
  });

  it('the turn-rate limit is the whole game: fast crossers escape low-G rounds', () => {
    const chase = (turnRate: number): { hit: number; miss: number } => {
      let hit = 0;
      let miss = 0;
      const missiles = new Missiles({
        turnRate,
        speed: 26,
        motorTime: 5,
        seed: 3,
        onHit: () => hit++,
        onMiss: () => miss++,
      });
      // The target BLOWS THROUGH the seeker's nose at close range, fast
      // and perpendicular — the geometry that demands the most turn.
      const target = { center: { x: -40, y: 12, z: 10 }, radius: 1.2 };
      missiles.fire({ x: 0, y: 12, z: 0 }, { x: 0, y: 0, z: 1 }, target);
      run(missiles, 5.2, () => (target.center.x += 46 / 60));
      return { hit, miss };
    };
    expect(chase(0.55).miss).toBe(1); // the low-G round watches it go by
    expect(chase(0.55).hit).toBe(0);
    expect(chase(3.2).hit).toBe(1); // the high-G round makes the corner
  });

  it('flares: one seeded chance each, and a bought lie ends in onDecoyed', () => {
    // With charm 1 every missile buys the first flare it sees.
    const onDecoyed = vi.fn();
    const onHit = vi.fn();
    const missiles = new Missiles({ flareCharm: 1, seed: 4, onDecoyed, onHit });
    const target = { center: { x: 0, y: 12, z: 40 }, radius: 1.5 };
    missiles.fire({ x: 0, y: 12, z: 0 }, { x: 0, y: 0, z: 1 }, target);
    run(missiles, 0.5);
    missiles.flare({ x: 0, y: 11, z: 20 }); // right on the seeker line
    run(missiles, 4);
    expect(onDecoyed).toHaveBeenCalledTimes(1);
    expect(onHit).not.toHaveBeenCalled();

    // With charm 0 the flare is furniture.
    const straight = vi.fn();
    const immune = new Missiles({ flareCharm: 0, seed: 4, onHit: straight });
    const quarry = { center: { x: 0, y: 12, z: 40 }, radius: 1.5 };
    immune.fire({ x: 0, y: 12, z: 0 }, { x: 0, y: 0, z: 1 }, quarry);
    immune.update(0.5);
    immune.flare({ x: 0, y: 11, z: 20 });
    run(immune, 4);
    expect(straight).toHaveBeenCalledTimes(1);
  });

  it('the motor runs out honestly, and the pool recycles oldest-first', () => {
    const onMiss = vi.fn();
    const missiles = new Missiles({ capacity: 3, motorTime: 1, onMiss, seed: 5 });
    // Unguided rounds fly straight until the fuel gives out.
    for (let i = 0; i < 5; i++) {
      missiles.fire({ x: i, y: 10, z: 0 }, { x: 0, y: 0, z: 1 }, null);
    }
    expect(missiles.alive).toBe(3); // capacity, not crash
    run(missiles, 1.5);
    expect(missiles.alive).toBe(0);
    expect(onMiss).toHaveBeenCalledTimes(3);
  });
});

describe('LockOn', () => {
  it('locks inside the cone over time; drifting out resets everything', () => {
    const lock = new LockOn({ halfAngle: 0.3, range: 50, lockTime: 1 });
    const seeker = { position: { x: 0, y: 10, z: 0 }, direction: { x: 0, y: 0, z: 1 } };
    const bandit = { center: { x: 2, y: 10, z: 30 }, radius: 1.5 };
    for (let i = 0; i < 30; i++) lock.update(1 / 60, seeker, bandit);
    expect(lock.state).toBe('locking');
    expect(lock.progress).toBeGreaterThan(0.4);
    for (let i = 0; i < 40; i++) lock.update(1 / 60, seeker, bandit);
    expect(lock.state).toBe('locked');

    bandit.center.x = 40; // broke the cone
    lock.update(1 / 60, seeker, bandit);
    expect(lock.state).toBe('seeking');
    expect(lock.progress).toBe(0); // no credit for past devotion

    lock.update(1 / 60, seeker, { center: { x: 0, y: 10, z: 80 }, radius: 1 });
    expect(lock.state).toBe('seeking'); // in the cone but out of range
  });
});
