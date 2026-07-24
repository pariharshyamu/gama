import { describe, expect, it, vi } from 'vitest';
import { Object3D, Vector3 } from 'three';
import { throwObject, ballisticVelocity } from '../src/physics/ballistic';

/** Advance an updater until it reports landed (or a step cap). */
function fly(update: (dt: number) => boolean, dt = 1 / 60, cap = 1000): number {
  let steps = 0;
  while (update(dt) && steps < cap) steps++;
  return steps;
}

describe('ballisticVelocity', () => {
  it('rises to roughly the requested apex', () => {
    const v = ballisticVelocity(new Vector3(0, 0, 0), new Vector3(4, 0, 0), 3, 18);
    // Apex height from vy: h = vy² / 2g.
    const apex = (v.y * v.y) / (2 * 18);
    expect(apex).toBeCloseTo(3, 1);
    expect(v.x).toBeGreaterThan(0); // travelling toward +x
  });
});

describe('throwObject', () => {
  it('lands the object on the target point', () => {
    const box = new Object3D();
    box.position.set(0, 1, 0);
    const target = new Vector3(5, 0, -3);
    const onLand = vi.fn();
    const update = throwObject(box, { to: target, peak: 2.5, onLand });
    fly(update);
    expect(box.position.x).toBeCloseTo(5, 1);
    expect(box.position.z).toBeCloseTo(-3, 1);
    expect(box.position.y).toBeCloseTo(0, 4); // settled on the ground
    expect(onLand).toHaveBeenCalledOnce();
  });

  it('arcs up before coming down (it is a lob, not a line)', () => {
    const box = new Object3D();
    box.position.set(0, 1, 0);
    const update = throwObject(box, { to: new Vector3(6, 0, 0), peak: 3 });
    let maxY = box.position.y;
    for (let i = 0; i < 200 && update(1 / 60); i++) maxY = Math.max(maxY, box.position.y);
    expect(maxY).toBeGreaterThan(3); // cleared an apex well above the start
  });

  it('tumbles as it flies and settles on a custom ground height', () => {
    const box = new Object3D();
    box.position.set(0, 2, 0);
    const update = throwObject(box, {
      velocity: new Vector3(1, 4, 0),
      ground: () => 0.5,
      spin: new Vector3(4, 0, 0),
    });
    fly(update);
    expect(box.position.y).toBeCloseTo(0.5, 4); // landed on the raised ground
    expect(Math.abs(box.rotation.x)).toBeGreaterThan(0.1); // it tumbled
  });

  it('reports landed exactly once, then stops updating', () => {
    const box = new Object3D();
    box.position.set(0, 1, 0);
    const update = throwObject(box, { velocity: new Vector3(0, 1, 0) });
    fly(update);
    const resting = box.position.clone();
    expect(update(1 / 60)).toBe(false); // no motion after landing
    expect(box.position.distanceTo(resting)).toBe(0);
  });
});
