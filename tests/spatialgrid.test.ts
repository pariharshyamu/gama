import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { GameObject } from '../src/core/GameObject';
import { MotionAgent } from '../src/motion/MotionAgent';
import { SpatialGrid } from '../src/motion/SpatialGrid';

function agentAt(x: number, y: number, z: number): MotionAgent {
  const object = new GameObject();
  object.position.set(x, y, z);
  return object.addComponent(new MotionAgent());
}

describe('SpatialGrid', () => {
  it('finds agents within the radius and excludes ones beyond it', () => {
    const grid = new SpatialGrid(4);
    const near = agentAt(1, 0, 1);
    const far = agentAt(30, 0, 30);
    grid.rebuild([near, far]);

    const result = grid.neighbors(new Vector3(0, 0, 0), 3);
    expect(result).toContain(near);
    expect(result).not.toContain(far);
  });

  it('matches a brute-force query on a random scatter', () => {
    let seed = 42;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 60 - 30;
    const agents = Array.from({ length: 200 }, () => agentAt(rand(), rand(), rand()));
    const grid = new SpatialGrid(5);
    grid.rebuild(agents);

    const center = new Vector3(2, -3, 5);
    const radius = 8;
    const expected = agents.filter((a) => a.position.distanceTo(center) <= radius);
    const actual = grid.neighbors(center, radius);
    expect(new Set(actual)).toEqual(new Set(expected));
  });

  it('finds agents across cell boundaries', () => {
    const grid = new SpatialGrid(4);
    const a = agentAt(3.9, 0, 0); // cell 0
    const b = agentAt(4.1, 0, 0); // cell 1
    grid.rebuild([a, b]);
    const result = grid.neighbors(new Vector3(4, 0, 0), 1);
    expect(result).toHaveLength(2);
  });

  it('near() reuses its result array across calls', () => {
    const grid = new SpatialGrid(4);
    const a = agentAt(0, 0, 0);
    const b = agentAt(1, 0, 0);
    grid.rebuild([a, b]);
    const query = grid.near(a, 5);
    const first = query();
    const second = query();
    expect(first).toBe(second); // same array instance — zero allocation per frame
    expect(second).toHaveLength(2);
  });
});
