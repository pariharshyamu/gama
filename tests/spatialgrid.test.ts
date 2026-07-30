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

  it('separates cells that pack near each other, including negatives', () => {
    // Cell coordinates are packed into one number instead of an "x,y,z"
    // string. A packing collision would silently merge two cells — agents
    // teleporting into each other's neighbour lists — so this walks a block
    // straddling the origin and checks every cell stays distinct.
    const grid = new SpatialGrid(1);
    const agents: MotionAgent[] = [];
    for (let x = -2; x <= 2; x++)
      for (let y = -2; y <= 2; y++)
        for (let z = -2; z <= 2; z++) agents.push(agentAt(x + 0.5, y + 0.5, z + 0.5));
    grid.rebuild(agents);
    expect(grid.cellCount).toBe(agents.length); // 125 cells, 125 agents, no merging

    // And a query in the middle of that block finds exactly its own cell.
    const one = grid.neighbors(new Vector3(0.5, 0.5, 0.5), 0.1);
    expect(one).toHaveLength(1);
    expect(one[0].position.x).toBeCloseTo(0.5);
  });

  it('finds neighbours a long way from the origin', () => {
    // Packing is finite. At cellSize 5 the safe box is ±163,840 units; a
    // world well inside it must still work exactly.
    const grid = new SpatialGrid(5);
    const a = agentAt(50_000, 0, -50_000);
    const b = agentAt(50_003, 0, -50_000);
    const far = agentAt(-50_000, 0, 50_000);
    grid.rebuild([a, b, far]);
    const found = grid.neighbors(a.position, 4);
    expect(new Set(found)).toEqual(new Set([a, b]));
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
