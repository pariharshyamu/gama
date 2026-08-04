#!/usr/bin/env node
/**
 * The flow-field gate.
 *
 *   npm run flow            fail if the field stops being a distance
 *   npm run flow -- --json  the numbers, machine-readable
 *
 * ## The claim
 *
 * A flow field is built by flooding outward from the goal, and almost always by
 * Dijkstra over eight neighbours with costs 1 and √2. That looks exact. It is
 * not, because the PATH is still made of eight directions, and a staircase is
 * longer than the line it approximates:
 *
 *   grid distance at angle θ = cos θ + (√2 − 1) sin θ
 *   worst at tan θ = √2 − 1, which is exactly 22.5°
 *   ratio there = √(4 − 2√2) = 1.08239220…
 *
 * So this gate measures the field against EUCLIDEAN TRUTH, which neither solver
 * is ever shown, and checks that the eight-way one is wrong by that exact
 * amount at that exact angle.
 *
 * ## And the half that matters more
 *
 * 8.24% is a BIAS, not a discretisation error: halve the cell size and you get
 * the same staircase twice as often. The gate refines the grid three times and
 * requires the eight-way error to sit still while the eikonal error falls —
 * because a wrong answer that converges is a different kind of thing from a
 * wrong answer that does not.
 */
import { FlowField, EIGHT_WAY_ANISOTROPY, EIGHT_WAY_WORST_ANGLE } from '../dist/index.js';

const json = process.argv.includes('--json');
const failures = [];
const fail = (l) => failures.push(l);
const close = (a, b, tol, what) => {
  if (!(Math.abs(a - b) <= tol)) fail(`${what}: ${a} against ${b}, tolerance ${tol}`);
};

// ------------------------------------------- 1. the closed form, before anything

close(EIGHT_WAY_ANISOTROPY, Math.sqrt(4 - 2 * Math.SQRT2), 0, 'the anisotropy constant is not √(4−2√2)');
close((EIGHT_WAY_WORST_ANGLE * 180) / Math.PI, 22.5, 1e-12, 'the worst angle is not 22.5°');
// ...and the same number the long way round, from the staircase itself.
{
  let worst = 0;
  let at = 0;
  for (let d = 0; d <= 45; d += 0.001) {
    const t = (d * Math.PI) / 180;
    const r = Math.cos(t) + (Math.SQRT2 - 1) * Math.sin(t);
    if (r > worst) { worst = r; at = d; }
  }
  close(worst, EIGHT_WAY_ANISOTROPY, 1e-6, 'the closed form disagrees with sweeping the angle');
  close(at, 22.5, 0.01, 'sweeping the angle does not find 22.5°');
}

// --------------------------- 2. measured against a distance neither solver knows

/** Worst relative error against Euclidean truth, in an annulus, by angle. */
function measure(solver, cell = 1, span = 121) {
  const n = span | 1;
  const mid = ((n - 1) / 2) * cell;
  const field = new FlowField({ width: n, height: n, cell, solver });
  field.build([{ x: mid, z: mid }]);
  const inner = (n * cell) / 8;
  const outer = (n * cell) / 3;
  let worst = 0;
  let worstAngle = 0;
  const byAngle = new Map();
  for (let cy = 0; cy < n; cy++) {
    for (let cx = 0; cx < n; cx++) {
      const dx = cx * cell - mid;
      const dz = cy * cell - mid;
      const truth = Math.hypot(dx, dz);
      if (truth < inner || truth > outer) continue;
      const got = field.distance[field.index(cx, cy)];
      if (!Number.isFinite(got)) { fail(`${solver}: an open cell came out unreachable`); continue; }
      const err = got / truth - 1;
      const a = (Math.atan2(Math.min(Math.abs(dx), Math.abs(dz)), Math.max(Math.abs(dx), Math.abs(dz))) * 180) / Math.PI;
      const bucket = Math.round(a / 2.5) * 2.5;
      byAngle.set(bucket, Math.max(byAngle.get(bucket) ?? 0, err));
      if (err > worst) { worst = err; worstAngle = a; }
    }
  }
  return { worst, worstAngle, byAngle, field };
}

const g8 = measure('grid8');
const ek = measure('eikonal');

// THE PREDICTION, ON THE REAL FIELD. Not "about 8%" — the closed form.
close(g8.worst, EIGHT_WAY_ANISOTROPY - 1, 0.0005,
  'an eight-way field is not wrong by √(4−2√2) − 1');
close(g8.worstAngle, 22.5, 1.5, 'the eight-way error does not peak at 22.5°');
// ...and the eikonal solve has to be substantially better, or the release is
// arithmetic with no consequence.
if (!(ek.worst < g8.worst * 0.6)) {
  fail(`the eikonal field is ${(ek.worst * 100).toFixed(2)}% out against the eight-way ${(g8.worst * 100).toFixed(2)}% — not worth the trouble`);
}

// -------------------------- 3. a bias does not converge, and that is the point

const refine = [];
for (const cell of [1, 0.5, 0.25]) {
  const span = Math.round(120 / cell) | 1;
  refine.push({
    cell,
    grid8: measure('grid8', cell, span).worst,
    eikonal: measure('eikonal', cell, span).worst,
  });
}
const g8Spread = Math.max(...refine.map((r) => r.grid8)) - Math.min(...refine.map((r) => r.grid8));
if (!(g8Spread < 0.001)) {
  fail(`the eight-way error moved by ${(g8Spread * 100).toFixed(3)}% across three cell sizes — it is supposed to be a bias`);
}
if (!(refine[2].eikonal < refine[0].eikonal * 0.7)) {
  fail(
    `quartering the cell only took the eikonal error from ${(refine[0].eikonal * 100).toFixed(2)}% ` +
      `to ${(refine[2].eikonal * 100).toFixed(2)}% — a discretisation error is supposed to converge`
  );
}

// --------------------------------- 4. what an agent actually does with it

function headings(solver) {
  const n = 121;
  const mid = (n - 1) / 2;
  const field = new FlowField({ width: n, height: n, cell: 1, solver });
  field.build([{ x: mid, z: mid }]);
  let sum = 0;
  let worst = 0;
  let count = 0;
  for (let a = 0; a < 360; a += 0.5) {
    const r = 40;
    const x = mid + Math.cos((a * Math.PI) / 180) * r;
    const z = mid + Math.sin((a * Math.PI) / 180) * r;
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

const h8 = headings('grid8');
const hek = headings('eikonal');
if (!(hek.worst < h8.worst / 3)) {
  fail(`headings: eikonal worst ${hek.worst.toFixed(1)}° against eight-way ${h8.worst.toFixed(1)}° — not the improvement claimed`);
}
if (!(hek.worst < 6)) fail(`the eikonal field sends an agent ${hek.worst.toFixed(1)}° off the true bearing`);

// ------------------------- 5. the properties an agent's life depends on

function walk(solver) {
  const n = 121;
  const mid = (n - 1) / 2;
  const field = new FlowField({ width: n, height: n, cell: 1, solver });
  // A wall across the map with one gap in it.
  for (let cy = 20; cy < 100; cy++) if (cy < 55 || cy > 65) field.setCost(60, cy, Infinity);
  field.build([{ x: 100, z: mid }]);
  let arrived = 0;
  let tried = 0;
  let climbed = 0;
  for (let sx = 5; sx < 55; sx += 5) {
    for (let sz = 25; sz < 95; sz += 5) {
      tried++;
      let x = sx;
      let z = sz;
      let last = field.sample(x, z).distance;
      for (let step = 0; step < 4000; step++) {
        const s = field.sample(x, z);
        if (!s.reachable) break;
        if (s.distance > last + 1e-6) climbed++;
        last = s.distance;
        if (s.distance < 1.2) { arrived++; break; }
        if (s.x === 0 && s.z === 0) break;
        x += s.x * 0.1;
        z += s.z * 0.1;
      }
    }
  }
  return { arrived, tried, climbed };
}

const walked = { grid8: walk('grid8'), eikonal: walk('eikonal') };
for (const [solver, w] of Object.entries(walked)) {
  // Following the flow must ARRIVE. A field an agent can get stuck in is worse
  // than no field, because the agent stands there for ever looking broken.
  if (w.arrived !== w.tried) fail(`${solver}: ${w.tried - w.arrived} of ${w.tried} agents never reached the goal`);
  // ...and must never climb. The distance is a potential; walking downhill on
  // it cannot go up, and if it does there is a local minimum to be caught in.
  if (w.climbed !== 0) fail(`${solver}: an agent walked UPHILL on the distance field ${w.climbed} times`);
}

// THE FUNNEL. Behind a wall, the only way through is the gap, so the distance
// has to be at least the two-leg path through it — and near it.
{
  const n = 121;
  const mid = (n - 1) / 2;
  const field = new FlowField({ width: n, height: n, cell: 1 });
  for (let cy = 0; cy < n; cy++) if (cy < 58 || cy > 62) field.setCost(60, cy, Infinity);
  field.build([{ x: 100, z: mid }]);
  const from = { x: 20, z: 20 };
  const gap = { x: 60, z: mid };
  const twoLeg = Math.hypot(gap.x - from.x, gap.z - from.z) + Math.hypot(100 - gap.x, mid - gap.z);
  const got = field.sample(from.x, from.z).distance;
  if (!(got >= twoLeg - 1e-6)) fail(`the field found a way through a wall: ${got.toFixed(3)} against a floor of ${twoLeg.toFixed(3)}`);
  if (!(got < twoLeg * 1.02)) fail(`the funnel costs ${((got / twoLeg - 1) * 100).toFixed(2)}% more than going through the gap`);
  var funnel = { got, twoLeg };
}

// A SEALED ROOM stays unreachable rather than being given a made-up distance.
{
  const field = new FlowField({ width: 41, height: 41, cell: 1 });
  for (let i = 8; i <= 16; i++) {
    field.setCost(i, 8, Infinity); field.setCost(i, 16, Infinity);
    field.setCost(8, i, Infinity); field.setCost(16, i, Infinity);
  }
  field.build([{ x: 30, z: 30 }]);
  const inside = field.sample(12, 12);
  if (inside.reachable) fail('a sealed room was given a route out');
  if (Number.isFinite(field.distance[field.index(12, 12)])) fail('a sealed cell got a finite distance');
}

// ONE FIELD, ANY NUMBER OF AGENTS: every open cell is settled exactly once, and
// the count has nothing to do with how many agents will read it.
{
  const field = new FlowField({ width: 81, height: 81, cell: 1 });
  for (let i = 20; i < 60; i++) field.setCost(i, 40, Infinity);
  field.build([{ x: 5, z: 5 }]);
  let open = 0;
  for (let i = 0; i < field.cost.length; i++) if (Number.isFinite(field.cost[i]) && field.cost[i] > 0) open++;
  if (field.visited !== open) fail(`the flood settled ${field.visited} cells of ${open} open ones`);
  var settled = { visited: field.visited, open };
}

// MANY GOALS: the field is the distance to the NEAREST of them.
{
  const field = new FlowField({ width: 81, height: 81, cell: 1 });
  field.build([{ x: 10, z: 10 }, { x: 70, z: 70 }]);
  // Well clear of either goal, so the answer is unambiguous and not dominated
  // by interpolation across the source cell.
  const near = field.sample(60, 60).distance;
  const truth = Math.hypot(10, 10);
  close(near, truth, truth * 0.05, 'two goals did not give the distance to the nearer');
}

// ------------------------------------------------------------------ report

if (json) {
  console.log(JSON.stringify({ failures, g8: { worst: g8.worst, angle: g8.worstAngle }, ek: { worst: ek.worst, angle: ek.worstAngle }, refine, h8, hek, walked, funnel, settled }, null, 2));
} else {
  console.log('flow fields — the eight-way grid is 8.24% wrong, and it stays wrong\n');
  console.log('  THE CLOSED FORM, BEFORE ANY CODE');
  console.log('    grid distance at θ = cos θ + (√2 − 1) sin θ');
  console.log('    worst at tan θ = √2 − 1  →  θ = 22.5° exactly');
  console.log(`    ratio there = √(4 − 2√2) = ${EIGHT_WAY_ANISOTROPY.toFixed(8)}\n`);

  console.log('  MEASURED AGAINST A DISTANCE NEITHER SOLVER IS SHOWN');
  console.log('    solver    worst error   at angle');
  console.log(`    grid8       ${(g8.worst * 100).toFixed(3).padStart(7)}%     ${g8.worstAngle.toFixed(1).padStart(5)}°   ← the prediction`);
  console.log(`    eikonal     ${(ek.worst * 100).toFixed(3).padStart(7)}%     ${ek.worstAngle.toFixed(1).padStart(5)}°`);
  console.log('    error by angle, eight-way:');
  {
    const keys = [...g8.byAngle.keys()].sort((a, b) => a - b);
    let line = '      ';
    for (const k of keys) line += `${k}° ${(g8.byAngle.get(k) * 100).toFixed(1)}%  `;
    console.log(line);
  }

  console.log('\n  A BIAS DOES NOT CONVERGE. THAT IS WHAT MAKES IT A BIAS.');
  console.log('    cell    grid8    eikonal');
  for (const r of refine) {
    console.log(`    ${r.cell.toFixed(2)}   ${(r.grid8 * 100).toFixed(3).padStart(6)}%   ${(r.eikonal * 100).toFixed(3).padStart(6)}%`);
  }
  console.log('    Halve the cell and you get the same staircase twice as often.');

  console.log('\n  AND WHAT AN AGENT ACTUALLY DOES WITH IT');
  console.log('    heading error against the true bearing, on open ground');
  console.log(`      grid8     mean ${h8.mean.toFixed(2)}°   worst ${h8.worst.toFixed(2)}°`);
  console.log(`      eikonal   mean ${hek.mean.toFixed(2)}°   worst ${hek.worst.toFixed(2)}°`);
  console.log('    21° off is a crowd that separates into lanes nothing in the level put there.');

  console.log('\n  THE PROPERTIES AN AGENT\'S LIFE DEPENDS ON');
  console.log(`    every one of ${walked.eikonal.tried} agents reached the goal through a gap in a wall`);
  console.log(`    and not one of them ever walked uphill on the distance field`);
  console.log(`    behind the wall the field says ${funnel.got.toFixed(3)}, against a floor of ${funnel.twoLeg.toFixed(3)} through the gap`);
  console.log(`    a sealed room stays unreachable rather than being given a made-up distance`);
  console.log(`    one flood settles ${settled.visited} of ${settled.open} open cells — exactly once each,`);
  console.log(`    and that number has nothing to do with how many agents will read it`);
}

if (failures.length) {
  console.error('\nFLOW FIELD OVER BUDGET');
  for (const l of failures) console.error(`  ${l}`);
  console.error('\n√(4−2√2) is not negotiable. If the field stopped agreeing with it, the field moved.');
  process.exit(1);
}
if (!json) console.log('\nflow: the field is a distance, and the distance is Euclidean ✓');
