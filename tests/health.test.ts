import { describe, expect, it, vi } from 'vitest';
import { Health, Projectiles } from '../src';

describe('Health', () => {
  it('I-FRAMES: a hazard costs one heart per window, not one per frame', () => {
    const health = new Health({ max: 5, invulnerable: 0.8 });
    expect(health.damage()).not.toBeNull();
    expect(health.current).toBe(4);
    // Standing in the fire: every frame tries again, the window refuses.
    for (let i = 0; i < 30; i++) {
      expect(health.damage()).toBeNull();
      health.update(1 / 60);
    }
    expect(health.current).toBe(4);
    health.update(0.5); // window over (0.5 + 30/60 > 0.8)
    expect(health.damage()).not.toBeNull();
    expect(health.current).toBe(3);
  });

  it('death is an edge: onDeath fires once, then damage is ignored', () => {
    const onDeath = vi.fn();
    const onDamage = vi.fn();
    const health = new Health({ max: 2, invulnerable: 0, onDeath, onDamage });
    health.damage();
    health.damage();
    expect(health.alive).toBe(false);
    expect(onDeath).toHaveBeenCalledTimes(1);
    expect(onDamage).toHaveBeenCalledTimes(2); // the killing blow still reports
    expect(health.damage()).toBeNull();
    expect(onDeath).toHaveBeenCalledTimes(1);
  });

  it('the dead do not heal — revive is the way back, with mercy i-frames', () => {
    const onRevive = vi.fn();
    const health = new Health({ max: 3, invulnerable: 0.5, onRevive });
    health.damage({ amount: 3 });
    expect(health.heal(2)).toBe(0);
    health.revive();
    expect(health.current).toBe(3);
    expect(onRevive).toHaveBeenCalledOnce();
    expect(health.invulnerableFor).toBeGreaterThanOrEqual(1); // mercy window
    expect(health.damage()).toBeNull();
    // And healing clamps at max for the living.
    health.update(2);
    health.damage();
    expect(health.heal(99)).toBe(3);
  });

  it('knockback points away from the blow, with a pop of lift', () => {
    const health = new Health({ invulnerable: 0 });
    const event = health.damage(
      { from: { x: 0, y: 0, z: 0 }, knockback: 6 },
      { x: 3, y: 0, z: 4 } // victim standing at 3-4-5 from the blow
    )!;
    expect(event.knockback!.x).toBeCloseTo(6 * 0.6);
    expect(event.knockback!.z).toBeCloseTo(6 * 0.8);
    expect(event.knockback!.y).toBeCloseTo(6 * 0.35);
    // A dead-centre hit still knocks somewhere, never divides by zero.
    const centre = health.damage(
      { from: { x: 1, y: 0, z: 1 }, knockback: 4 },
      { x: 1, y: 0, z: 1 }
    )!;
    expect(Number.isFinite(centre.knockback!.x)).toBe(true);
    expect(Math.hypot(centre.knockback!.x, centre.knockback!.z)).toBeCloseTo(4);
  });

  it('garbage in, nothing out: NaN amounts default, zero amounts refuse', () => {
    const health = new Health({ invulnerable: 0 });
    expect(health.damage({ amount: NaN })!.amount).toBe(1);
    expect(health.damage({ amount: 0 })).toBeNull();
    expect(health.current).toBe(2); // one defaulted hit off the default max of 3
  });
});

describe('Projectiles', () => {
  it('a shot flies, drops with gravity, and dies on the floor', () => {
    const expired: Array<{ x: number; y: number }> = [];
    const shots = new Projectiles({ gravity: 10, floor: 0, onExpire: (at) => expired.push(at) });
    shots.fire({ x: 0, y: 2, z: 0 }, { x: 5, y: 0, z: 0 });
    expect(shots.active).toBe(1);
    for (let i = 0; i < 90; i++) shots.update(1 / 60);
    expect(shots.active).toBe(0);
    expect(expired.length).toBe(1);
    expect(expired[0].y).toBe(0); // it died ON the floor
    expect(expired[0].x).toBeGreaterThan(2); // and had travelled
  });

  it('hits the target, reports where and how fast, and stops existing', () => {
    const hits: Array<{ at: { x: number }; velocity: { x: number } }> = [];
    const shots = new Projectiles({ onHit: (h) => hits.push(h as never) });
    const target = { center: { x: 4, y: 1, z: 0 }, radius: 0.5 };
    shots.addTarget(target);
    shots.fire({ x: 0, y: 1, z: 0 }, { x: 10, y: 0, z: 0 });
    for (let i = 0; i < 40; i++) shots.update(1 / 60);
    expect(hits.length).toBe(1);
    expect(hits[0].at.x).toBeGreaterThan(3);
    expect(hits[0].velocity.x).toBeCloseTo(10);
    expect(shots.active).toBe(0);
  });

  it('NO FRIENDLY FIRE: same team passes through, everyone else does not', () => {
    const hits: string[] = [];
    const shots = new Projectiles({
      onHit: (h) => hits.push(h.target.team ?? '?'),
    });
    shots.addTarget({ center: { x: 3, y: 0, z: 0 }, radius: 0.6, team: 'player' });
    shots.addTarget({ center: { x: 6, y: 0, z: 0 }, radius: 0.6, team: 'foes' });
    shots.fire({ x: 0, y: 0, z: 0 }, { x: 12, y: 0, z: 0 }, { team: 'player' });
    for (let i = 0; i < 60; i++) shots.update(1 / 60);
    expect(hits).toEqual(['foes']); // flew straight through its own side
  });

  it('life expires shots; a removed target is never hit', () => {
    const onHit = vi.fn();
    const onExpire = vi.fn();
    const shots = new Projectiles({ onHit, onExpire });
    const off = shots.addTarget({ center: { x: 3, y: 0, z: 0 }, radius: 0.5 });
    off();
    shots.fire({ x: 0, y: 0, z: 0 }, { x: 6, y: 0, z: 0 }, { life: 0.4 });
    for (let i = 0; i < 40; i++) shots.update(1 / 60);
    expect(onHit).not.toHaveBeenCalled();
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('a full pool recycles its oldest — the newest shot must exist', () => {
    const shots = new Projectiles({ capacity: 4 });
    for (let i = 0; i < 9; i++) shots.fire({ x: i, y: 5, z: 0 }, { x: 0, y: 0, z: 0 }, { life: 60 });
    expect(shots.active).toBe(4);
  });
});
