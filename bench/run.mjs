#!/usr/bin/env node
/**
 * The perf gate.
 *
 *   npm run bench              compare against bench/baseline.json
 *   npm run bench:update       record a new baseline
 *   node bench/run.mjs --only flock-200 --json
 *   node bench/run.mjs --counters-only     gate counters, report times (CI)
 *
 * ## Why this is shaped the way it is
 *
 * A committed timing baseline is usually worthless: it was recorded on one
 * machine, every other machine fails it, and within a week the gate is
 * something people rerun until it passes. Two things fix that here.
 *
 * **Times are stored as ratios to a calibration case** — a fixed lump of
 * arithmetic with no library in it, re-measured inside every sample — so a
 * laptop at half the speed of the recording machine scores the same, and so
 * does this machine ten seconds later when a neighbour wakes up. It is a
 * first-order correction, not a perfect one: the band is 1.5×, which catches
 * an O(n) that became an O(n²) and will not catch a 15% slowdown. Claiming
 * otherwise is the whole problem with perf gates.
 *
 * The `noise` column is the spread of that case's own samples (max ÷ min).
 * When it approaches the tolerance, the measurement is not saying anything.
 *
 * **Counters are exact.** How many neighbour candidates a broadphase
 * examined, how many bytes a snapshot put on the wire, how many
 * mispredictions eight clients accumulated over ten seconds. These do not
 * move unless behaviour moved, so they are compared exactly and they are the
 * real gate. A change that makes the flock 5% faster by examining twice the
 * candidates fails here, which is correct.
 *
 * Each case's band is the tolerance OR its own recorded sample spread,
 * whichever is wider, and a run noisier than its own band is not gated on
 * timing at all. A measurement that cannot resolve the threshold must not be
 * allowed to fail the build — that is how a gate becomes a coin toss people
 * learn to rerun until it passes.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cases } from './cases.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const BASELINE = join(here, 'baseline.json');

const args = process.argv.slice(2);
const has = (flag) => args.includes(`--${flag}`);
const value = (flag, fallback) => {
  const i = args.indexOf(`--${flag}`);
  return i >= 0 ? args[i + 1] : fallback;
};

const update = has('update');
const asJson = has('json');
const only = value('only', null);
/**
 * Report timings but never fail on them. What CI uses.
 *
 * The counters are exact integers about behaviour, so they mean the same thing
 * on every machine and gate everywhere. The times are ratios to a calibration
 * case, which is a first-order correction for machine speed and NOT a
 * validated one — it has been measured across this container's own drift and
 * nowhere else. Failing somebody's build on an unvalidated cross-machine
 * claim is precisely the behaviour this file argues against, so CI prints the
 * timings and gates the counters. Drop the flag once there is data from
 * enough machines to know what the ratio is really worth.
 */
const countersOnly = has('counters-only');
const SAMPLES = Number(value('samples', '9'));
/** How much slower than baseline is a failure. Wide on purpose — see above. */
const SLOWER = Number(value('tolerance', '1.5'));

const calibrateCase = cases.find((c) => c.name === 'calibrate');

/** One timed execution. Setup is outside the timer. */
function once(bench) {
  const fixture = bench.setup ? bench.setup() : undefined;
  const started = process.hrtime.bigint();
  const result = bench.run(fixture);
  return { ms: Number(process.hrtime.bigint() - started) / 1e6, result };
}

/**
 * One case, `SAMPLES` times, against calibration measured IN EACH SAMPLE.
 *
 * Three decisions, every one forced by a measurement rather than by taste:
 *
 * **Calibration is interleaved, not run once up front.** This container's
 * speed drifts *during* a run — identical code scored 1.01× to 1.61× against
 * a single up-front calibration — so normalising against a number measured
 * ten seconds ago normalises against the wrong machine.
 *
 * **The MINIMUM time is kept, not the median.** For a benchmark the fastest
 * observation is the most informative one: it is the sample least disturbed
 * by a GC pause, a scheduler hiccup or a neighbour. A median still averages
 * in noise that only ever pushes one way.
 *
 * **The two minima are divided — the per-sample ratios are NOT.** This is the
 * subtle one, and the first version got it wrong. Keeping the smallest
 * `run ÷ calibration` sounds like the same rule applied to a ratio, but it
 * selects the sample whose *denominator* was worst: the run where calibration
 * happened to get hit by a hiccup. Measured on unchanged code, the case's own
 * time was stable to 4% (225.6, 225.6, 216.0 ms) while min-of-ratios swung
 * 31% (4.61, 3.51, 3.99). The ratio was adding noise instead of removing it.
 * `min(case) ÷ min(calibration)` compares each at its cleanest, which is the
 * only fair reference point either of them has.
 */
function measure(bench) {
  const times = [];
  const calibrations = [];
  let result = null;
  for (let sample = 0; sample < SAMPLES; sample++) {
    calibrations.push(once(calibrateCase).ms);
    const run = once(bench);
    times.push(run.ms);
    result = run.result;
  }
  const fastest = Math.min(...times);
  return {
    ms: fastest,
    units: fastest / Math.min(...calibrations),
    // Spread of the CASE's own samples. Previously the spread of the ratios,
    // which mixed in the calibration's noise and made the noise-skip fire on
    // cases that were themselves perfectly steady.
    spread: Number((Math.max(...times) / fastest).toFixed(2)),
    result,
  };
}

// ---- run -------------------------------------------------------------------

const selected = cases.filter((c) => !only || c.name === only || c.name === 'calibrate');
if (only && selected.length < 2) {
  console.error(`bench: no case named "${only}". Known: ${cases.map((c) => c.name).join(', ')}`);
  process.exit(1);
}

const measured = {};
for (const bench of selected) {
  const { ms, units, spread, result } = measure(bench);
  measured[bench.name] = {
    ms,
    spread,
    units: bench.name === 'calibrate' ? 1 : Number(units.toFixed(4)),
    counters: result?.counters ?? null,
    checksum: result?.checksum ?? null,
  };
}
const calibration = measured.calibrate.ms;

// ---- report / compare ------------------------------------------------------

if (asJson) {
  console.log(JSON.stringify({ node: process.version, calibration, cases: measured }, null, 2));
}

if (update) {
  const baseline = {
    note: 'Times are RATIOS to the calibrate case, so this file is portable. Counters are exact.',
    recorded: { node: process.version, calibrationMs: Number(calibration.toFixed(2)) },
    cases: Object.fromEntries(
      Object.entries(measured).map(([name, m]) => [
        name,
        { units: m.units, spread: m.spread, counters: m.counters, checksum: m.checksum },
      ])
    ),
  };
  await writeFile(BASELINE, `${JSON.stringify(baseline, null, 2)}\n`);
  console.log(`bench: wrote ${SAMPLES}-sample baseline (calibration ${calibration.toFixed(1)} ms)`);
  printTable(measured, null);
  process.exit(0);
}

let baseline;
try {
  baseline = JSON.parse(await readFile(BASELINE, 'utf8'));
} catch {
  console.error('bench: no baseline — run `npm run bench:update` and commit the result');
  process.exit(1);
}

printTable(measured, baseline);

// ---- the gate --------------------------------------------------------------

const problems = [];
for (const [name, m] of Object.entries(measured)) {
  const was = baseline.cases[name];
  if (!was) {
    console.log(`  · ${name} is new — run bench:update to record it`);
    continue;
  }

  // Counters first: they are exact, and a mismatch is a behaviour change
  // whether or not it made anything faster.
  for (const [counter, now] of Object.entries(m.counters ?? {})) {
    const before = was.counters?.[counter];
    if (before === undefined) continue;
    if (before !== now) {
      problems.push(`${name}: ${counter} ${before} → ${now} (exact counter changed)`);
    }
  }
  if (was.checksum !== null && m.checksum !== null && was.checksum !== m.checksum) {
    problems.push(`${name}: checksum ${was.checksum} → ${m.checksum} (the simulation moved)`);
  }
  if (name === 'calibrate' || countersOnly) continue;

  // A case's band is the tolerance OR its own recorded noise, whichever is
  // wider. `level-roundtrip` allocates six thousand meshes and disposes
  // them, so it is GC-dominated and spreads 2.2× run to run: gating it at
  // 1.5× failed at random on unchanged code, which is exactly how a perf
  // gate becomes something people learn to rerun. A noisy case earns a wide
  // band, and the `noise` column says so out loud.
  const band = Math.max(SLOWER, was.spread ?? SLOWER);

  // And if THIS run was noisier than the band, it cannot resolve the band.
  if (m.spread > band) {
    console.log(
      `  ·  ${name}: this run spread ${m.spread.toFixed(2)}× (> ${band.toFixed(2)}× band) — timing not gated`
    );
    continue;
  }
  if (m.units > was.units * band) {
    problems.push(
      `${name}: ${was.units.toFixed(2)} → ${m.units.toFixed(2)} calibration units ` +
        `(${(m.units / was.units).toFixed(2)}× slower, band ${band.toFixed(2)}×)`
    );
  }
}

console.log('');
if (problems.length) {
  for (const problem of problems) console.log(`  FAIL  ${problem}`);
  console.log(
    `\n${problems.length} regression(s). If the change is intended, re-record with ` +
      '`npm run bench:update` and say why in the commit.'
  );
  process.exit(1);
}
console.log(
  `bench: ${Object.keys(measured).length} cases, no regressions ✓` +
    (countersOnly ? ' (counters gated, timings reported only)' : '')
);

// ---- printing --------------------------------------------------------------

function printTable(now, was) {
  const pad = (text, width) => String(text).padEnd(width);
  const rpad = (text, width) => String(text).padStart(width);
  console.log(
    `\n${pad('case', 18)}${rpad('ms', 9)}${rpad('units', 8)}${rpad('noise', 7)}${rpad('vs base', 9)}  counters`
  );
  console.log('-'.repeat(84));
  for (const [name, m] of Object.entries(now)) {
    const before = was?.cases?.[name];
    const ratio =
      before && name !== 'calibrate' ? `${(m.units / before.units).toFixed(2)}×` : '—';
    const counters = m.counters
      ? Object.entries(m.counters)
          .map(([k, v]) => `${k}=${v}`)
          .join(' ')
      : m.checksum !== null
        ? `checksum=${m.checksum}`
        : '';
    console.log(
      pad(name, 18) +
        rpad(m.ms.toFixed(2), 9) +
        rpad(m.units.toFixed(2), 8) +
        rpad(`${m.spread.toFixed(2)}×`, 7) +
        rpad(ratio, 9) +
        '  ' +
        counters
    );
  }
}
