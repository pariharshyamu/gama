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

  it('counts the work a query did, not just what it found', () => {
    // The distinction is the entire point. A 1-unit grid queried at radius 2
    // sweeps a 5×5×5 block — 125 cells — to return one agent. `found` cannot
    // see that; `cellsVisited` is the reason the query is slow.
    const grid = new SpatialGrid(1);
    const a = agentAt(0, 0, 0);
    grid.rebuild([a]);
    grid.neighbors(new Vector3(0, 0, 0), 2);

    expect(grid.stats.queries).toBe(1);
    expect(grid.stats.cellsVisited).toBe(125);
    expect(grid.stats.cellsOccupied).toBe(1);
    expect(grid.stats.tested).toBe(1);
    expect(grid.stats.found).toBe(1);
    expect(grid.cellCount).toBe(1);
  });

  it('reports the same result count for wildly different amounts of work', () => {
    // Same agents, same answer, 5× the cells swept: this is the regression a
    // results-only counter is blind to.
    const agents = [agentAt(0, 0, 0), agentAt(1, 0, 1)];
    const work = (cellSize: number) => {
      const grid = new SpatialGrid(cellSize);
      grid.rebuild(agents);
      const found = grid.neighbors(new Vector3(0, 0, 0), 4).length;
      return { found, cellsVisited: grid.stats.cellsVisited };
    };
    const coarse = work(8);
    const fine = work(1);
    expect(fine.found).toBe(coarse.found);
    expect(fine.cellsVisited).toBeGreaterThan(coarse.cellsVisited * 5);
  });

  it('rebuild() zeroes the counters, so stats describe one frame', () => {
    const grid = new SpatialGrid(4);
    const agents = [agentAt(0, 0, 0)];
    grid.rebuild(agents);
    grid.neighbors(new Vector3(0, 0, 0), 2);
    expect(grid.stats.queries).toBe(1);

    grid.rebuild(agents);
    expect(grid.stats.queries).toBe(0);
    expect(grid.stats.cellsVisited).toBe(0);

    grid.neighbors(new Vector3(0, 0, 0), 2);
    grid.neighbors(new Vector3(0, 0, 0), 2);
    expect(grid.stats.queries).toBe(2);
    grid.resetStats();
    expect(grid.stats.queries).toBe(0);
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
