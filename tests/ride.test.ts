import { describe, expect, it, vi } from 'vitest';
import { Object3D } from 'three';
import { RideController } from '../src';

const ride = (options = {}) => new RideController({ response: 0.001, ...options });
const drive = (r: RideController, seconds: number, intent: Parameters<RideController['update']>[1]) => {
  for (let i = 0; i < seconds * 60; i++) r.update(1 / 60, intent);
};

describe('RideController', () => {
  it('picks up and tops out at the animal\'s limit', () => {
    const r = ride({ topSpeed: 12 });
    drive(r, 8, { urge: 1, rein: 0 });
    expect(r.speed).toBeCloseTo(12, 1);
    expect(r.effort).toBeCloseTo(1, 2);
  });

  it('comes back to a halt on its own when the leg comes off', () => {
    // A horse is not a car in neutral: it slows down by itself.
    const r = ride();
    drive(r, 3, { urge: 1, rein: 0 });
    expect(r.speed).toBeGreaterThan(3);
    drive(r, 10, { urge: 0, rein: 0 });
    expect(r.speed).toBeCloseTo(0, 2);
  });

  it('answers the leg LATE — there is a beat before it changes', () => {
    const slow = new RideController({ response: 0.5 });
    const quick = new RideController({ response: 0.02 });
    for (let i = 0; i < 6; i++) {
      slow.update(1 / 60, { urge: 1, rein: 0 });
      quick.update(1 / 60, { urge: 1, rein: 0 });
    }
    // Same ask, same time — the responsive one is already moving faster.
    expect(quick.speed).toBeGreaterThan(slow.speed * 1.5);
  });

  it('steers less the faster it goes — the second-biggest tell', () => {
    const turnAt = (speed: number) => {
      const r = ride({ stiffness: 0.72 });
      r.speed = speed;
      r.heading = 0;
      // Give the rein time to be taken up, then measure one second of turn.
      drive(r, 0.3, { urge: 0.5, rein: 1 });
      const start = r.heading;
      const at = r.speed;
      drive(r, 1, { urge: 0.5, rein: 1 });
      return { turned: r.heading - start, at };
    };
    const walk = turnAt(1.5);
    const gallop = turnAt(11);
    expect(gallop.at).toBeGreaterThan(walk.at);
    expect(walk.turned).toBeGreaterThan(gallop.turned * 1.8);
  });

  it('will not pivot on the spot from a standstill', () => {
    const r = ride();
    const before = r.heading;
    drive(r, 1, { urge: 0, rein: 1 });
    expect(Math.abs(r.heading - before)).toBeLessThan(0.02);
  });

  it('halt stops it faster than simply taking the leg off', () => {
    const a = ride();
    const b = ride();
    drive(a, 4, { urge: 1, rein: 0 });
    drive(b, 4, { urge: 1, rein: 0 });
    const start = a.speed;
    drive(a, 0.8, { urge: 0, rein: 0, halt: true });
    drive(b, 0.8, { urge: 0, rein: 0 });
    expect(a.speed).toBeLessThan(b.speed);
    expect(a.speed).toBeLessThan(start);
  });

  it('backs up, but only slowly', () => {
    const r = ride({ topSpeed: 12 });
    drive(r, 10, { urge: -1, rein: 0 });
    expect(r.speed).toBeLessThan(0);
    expect(Math.abs(r.speed)).toBeLessThan(12 * 0.25);
  });

  it('moves an Object3D along its own heading', () => {
    const r = ride();
    const horse = new Object3D();
    r.speed = 4;
    r.heading = Math.PI / 2; // facing +x
    r.applyTo(horse, 1);
    expect(horse.position.x).toBeCloseTo(4, 3);
    expect(horse.position.z).toBeCloseTo(0, 3);
    expect(horse.rotation.y).toBeCloseTo(Math.PI / 2, 5);
  });

  it('emits halt once when it comes to a stop', () => {
    const r = ride();
    const onHalt = vi.fn();
    r.events.on('halt', onHalt);
    drive(r, 2, { urge: 1, rein: 0 });
    drive(r, 10, { urge: 0, rein: 0 });
    expect(onHalt).toHaveBeenCalledTimes(1);
  });

  it('reset puts it back to a standstill', () => {
    const r = ride();
    drive(r, 3, { urge: 1, rein: 1 });
    r.reset(1.2);
    expect(r.speed).toBe(0);
    expect(r.heading).toBe(1.2);
  });
});
