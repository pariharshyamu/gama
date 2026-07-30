#!/usr/bin/env node
/**
 * How many can you actually have?
 *
 *   npm run bench:throughput
 *
 * The other two benchmarks answer "did this get worse". This one answers the
 * question people actually ask before choosing a library, and it is a
 * different kind of measurement: absolute milliseconds on THIS machine, not
 * ratios. It is therefore not a gate and nothing fails — a number that means
 * something concrete has to be allowed to be machine-specific.
 *
 * Read it as a shape, not as a promise. Your agents do more than steer, your
 * renderer wants most of the frame, and a phone is several times slower than
 * a laptop. The useful output is the CROSSOVER and the SLOPE: where the
 * broadphase starts paying for itself, and how the cost grows.
 *
 * It exists because it found a real bug. `SpatialGrid` keyed its cells with
 * `"x,y,z"` strings, which cost a concatenation and a string hash per agent
 * per rebuild and per cell per query. At 400 agents — the size of the flock
 * example — the "fast" broadphase was two times SLOWER than comparing every
 * agent to every other one. Packing the coordinates into one integer made it
 * 2.5x faster across every size and moved the crossover from ~1300 agents to
 * ~450. No gate caught that, because both versions were equally fast as each
 * other on the day the baseline was recorded; only asking the absolute
 * question found it.
 */
import {
  Alignment,
  Cohesion,
  MotionAgent,
  Separation,
  SpatialGrid,
  World,
} from '../dist/index.js';

const args = process.argv.slice(2);
const asJson = args.includes('--json');

/** Deterministic, so the same sizes build the same worlds every run. */
const rng = (seed) => {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
};

function stepper(dt = 1 / 60) {
  const time = { delta: dt, rawDelta: dt, elapsed: 0, frame: 0, scale: 1 };
  return {
    tick() {
      time.elapsed += dt;
      time.frame += 1;
      return time;
    },
  };
}

/**
 * A flock at constant DENSITY, not constant area.
 *
 * This is the one control that matters. Spread the same agent count over a
 * bigger box and the broadphase looks better for free, because each cell holds
 * fewer of them — you would be measuring the box, not the algorithm. The
 * extent grows with sqrt(n) so neighbours per agent stay put and the only
 * thing changing is n.
 */
function flock(n, useGrid) {
  const random = rng(7);
  const world = new World();
  const grid = new SpatialGrid(4);
  const agents = [];
  const extent = Math.sqrt(n) * 6;
  for (let i = 0; i < n; i++) {
    const object = world.spawn(`a${i}`);
    object.position.set((random() - 0.5) * extent, 0, (random() - 0.5) * extent);
    const agent = object.addComponent(new MotionAgent({ maxSpeed: 6, planar: true }));
    const near = useGrid ? grid.near(agent, 6) : () => agents;
    agent.addBehavior(new Separation(near, 3), 1.6);
    agent.addBehavior(new Alignment(near, 6), 1);
    agent.addBehavior(new Cohesion(near, 6), 0.8);
    agents.push(agent);
  }
  return { world, grid, agents };
}

/** Warm the JIT, then time whole frames — rebuild included, as a game pays it. */
function frameMs(n, useGrid, frames) {
  const f = flock(n, useGrid);
  const clock = stepper();
  for (let i = 0; i < 10; i++) {
    if (useGrid) f.grid.rebuild(f.agents);
    f.world.update(clock.tick());
  }
  const started = process.hrtime.bigint();
  for (let i = 0; i < frames; i++) {
    if (useGrid) f.grid.rebuild(f.agents);
    f.world.update(clock.tick());
  }
  return Number(process.hrtime.bigint() - started) / 1e6 / frames;
}

const SIZES = [100, 250, 500, 1000, 2000, 4000];
/** Above this, the O(n²) arm takes long enough to be worth skipping. */
const BRUTE_LIMIT = 2000;
const FRAME = 1000 / 60;

const rows = [];
for (const n of SIZES) {
  const frames = n > 1000 ? 30 : 60;
  const brute = n <= BRUTE_LIMIT ? frameMs(n, false, frames) : null;
  const grid = frameMs(n, true, frames);
  rows.push({ agents: n, bruteMs: brute, gridMs: grid, budget: grid / FRAME });
}

if (asJson) {
  console.log(JSON.stringify({ node: process.version, frameBudgetMs: FRAME, rows }, null, 2));
  process.exit(0);
}

console.log('\nFlocking: separation + alignment + cohesion, constant density.');
console.log('Whole frames, rebuild included. Absolute ms on THIS machine.\n');
console.log(
  'agents'.padStart(7) +
    'brute'.padStart(10) +
    'grid'.padStart(10) +
    'speedup'.padStart(10) +
    '   share of a 16.7 ms frame'
);
console.log('-'.repeat(72));
for (const r of rows) {
  const bar = '#'.repeat(Math.min(24, Math.round(r.budget * 12)));
  console.log(
    String(r.agents).padStart(7) +
      (r.bruteMs === null ? '—' : r.bruteMs.toFixed(2)).padStart(10) +
      r.gridMs.toFixed(2).padStart(10) +
      (r.bruteMs === null ? '—' : `${(r.bruteMs / r.gridMs).toFixed(1)}×`).padStart(10) +
      `   ${(r.budget * 100).toFixed(0)}%`.padEnd(7) +
      bar
  );
}

const crossover = rows.find((r) => r.bruteMs !== null && r.gridMs < r.bruteMs);
console.log(
  `\nSpatialGrid overtakes brute force at ~${crossover ? crossover.agents : '>' + BRUTE_LIMIT} agents. ` +
    'Below that a plain array is\nfaster and simpler — the grid is not free, it trades a per-agent ' +
    'rebuild for\nfewer comparisons, and under a few hundred agents there are not enough\ncomparisons to be worth it.\n'
);
