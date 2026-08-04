import { describe, expect, it } from 'vitest';
import {
  EIGHT_WAY_ANISOTROPY, EIGHT_WAY_WORST_ANGLE, FlowField,
} from '../src/nav/FlowField';
import type { FlowSolver } from '../src/nav/FlowField';

/** Worst relative error against Euclidean truth in an annulus, and where. */
function measure(solver: FlowSolver, cell = 1, span = 121): { worst: number; angle: number } {
  const n = span | 1;
  const mid = ((n - 1) / 2) * cell;
  const field = new FlowField({ width: n, height: n, cell, solver });
  field.build([{ x: mid, z: mid }]);
  const inner = (n * cell) / 8;
  const outer = (n * cell) / 3;
  let worst = 0;
  let angle = 0;
  for (let cy = 0; cy < n; cy++) {
    for (let cx = 0; cx < n; cx++) {
      const dx = cx * cell - mid;
      const dz = cy * cell - mid;
      const truth = Math.hypot(dx, dz);
      if (truth < inner || truth > outer) continue;
      const err = field.distance[field.index(cx, cy)] / truth - 1;
      if (err > worst) {
        worst = err;
        angle = (Math.atan2(Math.min(Math.abs(dx), Math.abs(dz)), Math.max(Math.abs(dx), Math.abs(dz))) * 180) / Math.PI;
      }
    }
  }
  return { worst, angle };
}

function headings(solver: FlowSolver): { mean: number; worst: number } {
  const n = 121;
  const mid = (n - 1) / 2;
  const field = new FlowField({ width: n, height: n, cell: 1, solver });
  field.build([{ x: mid, z: mid }]);
  let sum = 0;
  let worst = 0;
  let count = 0;
  for (let a = 0; a < 360; a += 1) {
    const x = mid + Math.cos((a * Math.PI) / 180) * 40;
    const z = mid + Math.sin((a * Math.PI) / 180) * 40;
    const s = field.sample(x, z);
    if (!s.reachable) continue;
    const want = Math.atan2(mid - z, mid - x);
    const got = Math.atan2(s.z, s.x);
    const err = (Math.abs(((got - want + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * 180) / Math.PI;
    sum += err;
    worst = Math.max(worst, err);
    count++;
  }
  return { mean: sum / count, worst };
}

describe('the eight-way grid’s anisotropy', () => {
  it('is √(4 − 2√2), at exactly 22.5°', () => {
    expect(EIGHT_WAY_ANISOTROPY).toBe(Math.sqrt(4 - 2 * Math.SQRT2));
    expect((EIGHT_WAY_WORST_ANGLE * 180) / Math.PI).toBeCloseTo(22.5, 12);
  });

  it('is the same number if you sweep the angle instead of differentiating', () => {
    let worst = 0;
    let at = 0;
    for (let d = 0; d <= 45; d += 0.001) {
      const t = (d * Math.PI) / 180;
      const r = Math.cos(t) + (Math.SQRT2 - 1) * Math.sin(t);
      if (r > worst) { worst = r; at = d; }
    }
    expect(worst).toBeCloseTo(EIGHT_WAY_ANISOTROPY, 6);
    expect(at).toBeCloseTo(22.5, 2);
  });

  it('shows up in a real field, at the predicted size and angle', () => {
    const g8 = measure('grid8');
    expect(g8.worst).toBeCloseTo(EIGHT_WAY_ANISOTROPY - 1, 3);
    expect(g8.angle).toBeCloseTo(22.5, 0);
  });

  it('does not shrink when the cells do — it is a bias, not a resolution error', () => {
    const errors = [1, 0.5, 0.25].map((cell) => measure('grid8', cell, Math.round(120 / cell)).worst);
    for (const e of errors) expect(e).toBeCloseTo(EIGHT_WAY_ANISOTROPY - 1, 3);
  });
});

describe('the eikonal solve', () => {
  it('is substantially closer to the truth at the same resolution', () => {
    expect(measure('eikonal').worst).toBeLessThan(measure('grid8').worst * 0.6);
  });

  it('converges when the grid is refined', () => {
    const errors = [1, 0.5, 0.25].map((cell) => measure('eikonal', cell, Math.round(120 / cell)).worst);
    expect(errors[1]).toBeLessThan(errors[0]);
    expect(errors[2]).toBeLessThan(errors[1]);
    expect(errors[2]).toBeLessThan(errors[0] * 0.7);
  });

  it('sends an agent where it meant to, and the eight-way one does not', () => {
    const g8 = headings('grid8');
    const ek = headings('eikonal');
    expect(g8.worst).toBeGreaterThan(15);
    expect(ek.worst).toBeLessThan(g8.worst / 3);
    expect(ek.worst).toBeLessThan(6);
  });
});

describe('the field is a field', () => {
  const walled = (solver: FlowSolver): FlowField => {
    const field = new FlowField({ width: 121, height: 121, cell: 1, solver });
    for (let cy = 20; cy < 100; cy++) if (cy < 55 || cy > 65) field.setCost(60, cy, Infinity);
    field.build([{ x: 100, z: 60 }]);
    return field;
  };

  it('gets every agent to the goal, through a gap in a wall', () => {
    for (const solver of ['grid8', 'eikonal'] as const) {
      const field = walled(solver);
      let arrived = 0;
      let tried = 0;
      for (let sx = 5; sx < 55; sx += 10) {
        for (let sz = 25; sz < 95; sz += 10) {
          tried++;
          let x = sx;
          let z = sz;
          for (let step = 0; step < 4000; step++) {
            const s = field.sample(x, z);
            if (!s.reachable || (s.x === 0 && s.z === 0)) break;
            if (s.distance < 1.2) { arrived++; break; }
            x += s.x * 0.1;
            z += s.z * 0.1;
          }
        }
      }
      expect(arrived, solver).toBe(tried);
    }
  });

  it('never lets an agent walk uphill', () => {
    const field = walled('eikonal');
    let x = 10;
    let z = 30;
    let last = field.sample(x, z).distance;
    for (let step = 0; step < 4000; step++) {
      const s = field.sample(x, z);
      if (!s.reachable || s.distance < 1.2) break;
      expect(s.distance).toBeLessThanOrEqual(last + 1e-6);
      last = s.distance;
      x += s.x * 0.1;
      z += s.z * 0.1;
    }
  });

  it('cannot find a way through a wall', () => {
    const field = new FlowField({ width: 121, height: 121, cell: 1 });
    for (let cy = 0; cy < 121; cy++) if (cy < 58 || cy > 62) field.setCost(60, cy, Infinity);
    field.build([{ x: 100, z: 60 }]);
    const twoLeg = Math.hypot(60 - 20, 60 - 20) + Math.hypot(100 - 60, 0);
    const got = field.sample(20, 20).distance;
    expect(got).toBeGreaterThanOrEqual(twoLeg - 1e-6);
    expect(got).toBeLessThan(twoLeg * 1.02);
  });

  it('leaves a sealed room unreachable instead of inventing a distance', () => {
    const field = new FlowField({ width: 41, height: 41, cell: 1 });
    for (let i = 8; i <= 16; i++) {
      field.setCost(i, 8, Infinity); field.setCost(i, 16, Infinity);
      field.setCost(8, i, Infinity); field.setCost(16, i, Infinity);
    }
    field.build([{ x: 30, z: 30 }]);
    expect(field.sample(12, 12).reachable).toBe(false);
    expect(Number.isFinite(field.distance[field.index(12, 12)])).toBe(false);
  });

  it('settles every open cell exactly once, whatever reads it afterwards', () => {
    const field = new FlowField({ width: 81, height: 81, cell: 1 });
    for (let i = 20; i < 60; i++) field.setCost(i, 40, Infinity);
    field.build([{ x: 5, z: 5 }]);
    let open = 0;
    for (let i = 0; i < field.cost.length; i++) {
      if (Number.isFinite(field.cost[i]) && field.cost[i] > 0) open++;
    }
    expect(field.visited).toBe(open);
  });

  it('gives the distance to the NEAREST of several goals', () => {
    const field = new FlowField({ width: 81, height: 81, cell: 1 });
    field.build([{ x: 10, z: 10 }, { x: 70, z: 70 }]);
    // Within the eikonal's own diagonal error — this checks WHICH goal was
    // found, not the last percent of the distance to it.
    const truth = Math.hypot(10, 10);
    expect(field.sample(60, 60).distance).toBeLessThan(truth * 1.05);
    expect(field.sample(60, 60).distance).toBeGreaterThan(truth * 0.95);
  });

  it('respects a cost that is expensive rather than impassable', () => {
    const slow = new FlowField({ width: 61, height: 61, cell: 1 });
    for (let cy = 0; cy < 61; cy++) for (let cx = 28; cx <= 32; cx++) slow.setCost(cx, cy, 5);
    slow.build([{ x: 50, z: 30 }]);
    const open = new FlowField({ width: 61, height: 61, cell: 1 });
    open.build([{ x: 50, z: 30 }]);
    // Crossing five metres of mud at 5× costs more than crossing open ground.
    expect(slow.sample(10, 30).distance).toBeGreaterThan(open.sample(10, 30).distance + 15);
  });

  it('reports nothing outside its own grid', () => {
    const field = new FlowField({ width: 21, height: 21, cell: 1 });
    field.build([{ x: 10, z: 10 }]);
    expect(field.sample(-40, -40).reachable).toBe(false);
    expect(field.sample(200, 200).reachable).toBe(false);
  });

  it('survives a goal placed inside a wall, and a build with no goals', () => {
    const field = new FlowField({ width: 21, height: 21, cell: 1 });
    field.setCost(10, 10, Infinity);
    field.build([{ x: 10, z: 10 }]);
    expect(field.visited).toBe(0);
    field.build([]);
    expect(field.visited).toBe(0);
    expect(field.sample(5, 5).reachable).toBe(false);
  });

  it('steers at the speed it is given', () => {
    const field = new FlowField({ width: 61, height: 61, cell: 1 });
    field.build([{ x: 50, z: 30 }]);
    const step = field.steer(10, 30, 3);
    expect(Math.hypot(step.x, step.z)).toBeCloseTo(3, 6);
    expect(step.x).toBeGreaterThan(0);
  });
});
