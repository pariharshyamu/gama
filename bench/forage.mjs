#!/usr/bin/env node
/**
 * The foraging gate — utility with a unit, and a theorem instead of a threshold.
 *
 *   npm run forage            fail if the agent stops being optimal
 *   npm run forage -- --json  the numbers, machine-readable
 *
 * ## The claim
 *
 * A utility system's response curves and weights exist to map incommensurable
 * things onto an invented 0..1 axis. Do not invent the axis: an action is worth
 * something and it costs seconds, so utility is VALUE PER SECOND and there is
 * nothing left to shape or balance.
 *
 * ## And the one that can actually be checked
 *
 * Knowing when to STOP is the half that every implementation solves with a
 * threshold — leave at 20% remaining, give up after 8 seconds. Charnov's
 * marginal value theorem (1976) says leave when the patch's instantaneous rate
 * of return has fallen to the average rate available elsewhere, and it is one of
 * the most tested results in behavioural ecology.
 *
 * A theorem that claims optimality can be checked against BRUTE FORCE. This gate
 * sweeps every fixed leaving time from 0.05 s to 300 s, takes the best rate any
 * of them achieves, and requires the forager — which was told none of it, and
 * measures the environment off its own life — to land on that number.
 *
 * It also checks the two predictions a threshold cannot make:
 *
 *   travel gets longer   → stay LONGER
 *   the world gets richer → leave SOONER
 */
import {
  Forager, bestRate, choose, depletingPatch, leaveWhen, longRunRate,
  marginalRate, optimalStay, rank, rateOf,
} from '../dist/index.js';

const json = process.argv.includes('--json');
const failures = [];
const fail = (l) => failures.push(l);
const close = (a, b, tol, what) => {
  if (!(Math.abs(a - b) <= tol)) fail(`${what}: ${a} against ${b}, tolerance ${tol}`);
};

const DT = 1 / 60;

// ------------------------------------------- 1. the utility is value / second

{
  const context = { distance: 12, coins: 30 };
  const actions = [
    { name: 'loot', value: (c) => c.coins, seconds: () => 6 },
    { name: 'sprint', value: (c) => c.distance, seconds: (c) => c.distance / 6 },
    { name: 'nap', value: () => 0, seconds: () => 30 },
    { name: 'locked', value: () => 1e6, seconds: () => 0.001, available: () => false },
  ];
  const ranked = rank(actions, context);
  if (ranked.length !== 3) fail(`an unavailable action was ranked (${ranked.length} of 3)`);
  close(rateOf(actions[0], context), 5, 1e-12, 'loot is not 30 coins over 6 seconds');
  close(rateOf(actions[1], context), 6, 1e-12, 'sprint is not its own speed');
  if (choose(actions, context).name !== 'sprint') fail('the best rate did not win');

  // A free action is not an action. Returning Infinity here would make it beat
  // everything for ever, which presents as an agent standing still doing
  // something instantaneous.
  close(rateOf({ name: 'free', value: () => 5, seconds: () => 0 }, context), 0, 0,
    'a zero-second action did not score zero');

  // SCALE. A rate is a ratio scale: counting in pennies instead of pounds must
  // not reorder anything, and neither must counting in minutes.
  const scaled = actions.map((a) => ({
    ...a, value: (c) => a.value(c) * 100, seconds: (c) => a.seconds(c) / 60,
  }));
  const before = rank(actions, context).map((r) => r.action.name).join(',');
  const after = rank(scaled, context).map((r) => r.action.name).join(',');
  if (before !== after) fail(`changing the unit of value and of time reordered the actions: ${before} vs ${after}`);

  // Ties keep their declared order, or an agent dithers between two identical
  // options for ever and looks broken.
  const twins = [
    { name: 'a', value: () => 1, seconds: () => 1 },
    { name: 'b', value: () => 1, seconds: () => 1 },
  ];
  for (let i = 0; i < 50; i++) {
    if (choose(twins, context).name !== 'a') fail('two equally good actions did not keep their order');
  }
}

// ------------------------ 2. the theorem, solved, against an exhaustive sweep

/** Long-run rate of an agent that always leaves at a fixed time. */
const fixedRate = (amount, tau, travel, leaveAt) =>
  depletingPatch(amount, tau).gain(leaveAt) / (travel + leaveAt);

/** Brute force: the best any fixed leaving time can manage. */
function sweep(amount, tau, travel) {
  let best = { at: 0, rate: 0 };
  for (let t = 0.05; t <= 300; t += 0.05) {
    const rate = fixedRate(amount, tau, travel, t);
    if (rate > best.rate) best = { at: t, rate };
  }
  return best;
}

function forage(amount, tau, travel, seconds = 4000, environmentRate) {
  const leaves = [];
  const f = new Forager(() => depletingPatch(amount, tau, travel), {
    environmentRate,
    onLeave: (e) => leaves.push(e.seconds),
  });
  for (let i = 0; i * DT < seconds; i++) f.update(DT);
  const tail = leaves.slice(Math.floor(leaves.length * 0.6));
  return {
    rate: f.rate,
    visits: f.visits,
    settled: tail.reduce((a, b) => a + b, 0) / Math.max(1, tail.length),
  };
}

const WORLDS = [
  { amount: 10, tau: 5, travel: 2 },
  { amount: 10, tau: 5, travel: 10 },
  { amount: 10, tau: 5, travel: 30 },
  { amount: 40, tau: 12, travel: 5 },
  { amount: 5, tau: 2, travel: 1 },
  { amount: 100, tau: 30, travel: 20 },
];

const optimality = [];
for (const w of WORLDS) {
  const patch = depletingPatch(w.amount, w.tau, w.travel);
  const star = optimalStay(patch, w.travel);
  const brute = sweep(w.amount, w.tau, w.travel);
  const run = forage(w.amount, w.tau, w.travel);
  optimality.push({ ...w, star, brute, run, ratio: run.rate / brute.rate });

  // THE FORMULA AGAINST SOMETHING THAT IS NOT THE FORMULA. `optimalStay` is a
  // root of g′(t)(T+t) − g(t); the sweep is a search over rates. They are
  // different computations and they have to agree, to within the sweep's own
  // 0.05 s grid.
  close(star, brute.at, 0.06, `the theorem's leaving time disagrees with an exhaustive sweep (travel ${w.travel})`);

  // ...and the forager, told none of it, has to land on the same rate.
  if (!(run.rate >= brute.rate * 0.99)) {
    fail(
      `the forager got ${run.rate.toFixed(5)} against the best possible ${brute.rate.toFixed(5)} ` +
        `(travel ${w.travel}) — ${((1 - run.rate / brute.rate) * 100).toFixed(1)}% short of a rule it was never given`
    );
  }
  // It cannot BEAT the sweep either. The sweep is optimal by construction, so a
  // forager that outscores it is measuring its own rate wrongly.
  if (!(run.rate <= brute.rate * 1.001)) {
    fail(`the forager beat an exhaustive search by ${((run.rate / brute.rate - 1) * 100).toFixed(2)}%, which is not possible`);
  }

  // The theorem's own identity: at the moment of leaving, the patch's marginal
  // rate IS the rate the whole cycle achieves.
  if (Number.isFinite(star)) {
    close(marginalRate(patch, star), longRunRate(patch, star, w.travel), 1e-4,
      'the marginal rate at the leaving moment is not the long-run rate');
    close(bestRate(patch, w.travel), brute.rate, brute.rate * 0.002,
      'bestRate disagrees with the sweep');
  }
}

// ------------------------------- 3. the two predictions a threshold cannot make

const travelRows = [];
for (const travel of [0.5, 2, 5, 15, 40]) {
  const star = optimalStay(depletingPatch(10, 5, travel), travel);
  const run = forage(10, 5, travel, 6000);
  travelRows.push({ travel, star, settled: run.settled, rate: run.rate });
}
for (let i = 1; i < travelRows.length; i++) {
  if (!(travelRows[i].settled > travelRows[i - 1].settled)) {
    fail(
      `travel went from ${travelRows[i - 1].travel} to ${travelRows[i].travel} s and the forager did ` +
        `NOT stay longer (${travelRows[i - 1].settled.toFixed(2)} then ${travelRows[i].settled.toFixed(2)})`
    );
  }
}

const richRows = [];
const one = depletingPatch(10, 5, 3);
for (const rate of [0.2, 0.5, 1.0, 1.5]) {
  const run = forage(10, 5, 3, 4000, rate);
  richRows.push({ rate, predicted: leaveWhen(one, rate), settled: run.settled });
  close(run.settled, leaveWhen(one, rate), 0.05,
    `told the world pays ${rate}/s, the forager did not leave where the theorem says`);
}
for (let i = 1; i < richRows.length; i++) {
  if (!(richRows[i].settled < richRows[i - 1].settled)) {
    fail(
      `the world got richer (${richRows[i - 1].rate} → ${richRows[i].rate} per second) and the forager did ` +
        `NOT leave sooner (${richRows[i - 1].settled.toFixed(2)} then ${richRows[i].settled.toFixed(2)})`
    );
  }
}

// ------------------------- 4. what a tuned threshold costs one level along

/** The rule everybody writes: leave when the patch is `fraction` emptied. */
const fractionRate = (amount, tau, travel, fraction) => {
  const at = -tau * Math.log(1 - fraction);
  return depletingPatch(amount, tau).gain(at) / (travel + at);
};
function bestFraction(amount, tau, travel) {
  let best = { fraction: 0, rate: 0 };
  for (let f = 0.01; f < 0.999; f += 0.001) {
    const rate = fractionRate(amount, tau, travel, f);
    if (rate > best.rate) best = { fraction: f, rate };
  }
  return best;
}

const TUNED_AT = 2;
const tuned = bestFraction(10, 5, TUNED_AT);
const carried = [];
let worstLoss = 0;
for (const travel of [0.5, 2, 5, 15, 40]) {
  const here = bestFraction(10, 5, travel);
  const keeps = fractionRate(10, 5, travel, tuned.fraction);
  const mvt = forage(10, 5, travel, 5000).rate;
  const loss = 1 - keeps / mvt;
  worstLoss = Math.max(worstLoss, loss);
  carried.push({ travel, best: here.fraction, keeps, mvt, loss });
}
// The threshold is not badly tuned — it is optimal where it was tuned. The
// point is that "optimal here" is a different number over there, and no amount
// of care with the first number fixes the second.
if (!(worstLoss > 0.2)) {
  fail(
    `a depletion threshold tuned at travel ${TUNED_AT} only lost ${(worstLoss * 100).toFixed(1)}% ` +
      `elsewhere in the same game — if a fixed threshold is nearly as good, this release is decoration`
  );
}

// -------------------------------------------- 5. patches that are not patches

const linear = { gain: (t) => 2 * t, travel: 3 };
if (Number.isFinite(optimalStay(linear, 3))) {
  fail('a patch that never depletes was given a moment to leave, and there is not one');
}
close(optimalStay({ gain: () => 0 }, 1), 0, 1e-9, 'a patch that gives nothing was worth staying in');
if (!(optimalStay(depletingPatch(10, 0.001, 5), 5) < 0.05)) {
  fail('a patch emptied in a blink was worth lingering in');
}
{
  // A forager handed nothing to go to does not crash and does not advance.
  const idle = new Forager(() => null);
  for (let i = 0; i < 100; i++) idle.update(DT);
  if (idle.harvest !== 0 || idle.visits !== 0) fail('a forager with nowhere to go harvested something');
}

// -------------------------------------------------------------------- report

if (json) {
  console.log(JSON.stringify({ failures, optimality, travelRows, richRows, carried, tuned }, null, 2));
} else {
  console.log('utility — value per second, and Charnov instead of a threshold\n');

  console.log('  AGAINST AN EXHAUSTIVE SEARCH IT WAS NEVER SHOWN');
  console.log('   amount  tau  travel   theorem t*   sweep t*   best rate   forager   of best');
  for (const o of optimality) {
    console.log(
      `   ${String(o.amount).padStart(6)} ${String(o.tau).padStart(4)} ${String(o.travel).padStart(7)}   ` +
        `${o.star.toFixed(3).padStart(10)} ${o.brute.at.toFixed(2).padStart(10)}   ` +
        `${o.brute.rate.toFixed(5).padStart(9)}  ${o.run.rate.toFixed(5).padStart(8)}   ` +
        `${(o.ratio * 100).toFixed(2).padStart(6)}%`
    );
  }
  console.log('   The theorem is solved as a ROOT of g′(t)(T+t) − g(t); the sweep is a search');
  console.log('   over 6000 fixed leaving times. Different computations, same answer.\n');

  console.log('  CHARNOV 1 — LONGER TRAVEL, LONGER STAY');
  console.log('   travel   theorem t*   forager   rate');
  for (const r of travelRows) {
    console.log(
      `   ${String(r.travel).padStart(6)}   ${r.star.toFixed(3).padStart(10)}   ` +
        `${r.settled.toFixed(3).padStart(7)}   ${r.rate.toFixed(5)}`
    );
  }

  console.log('\n  CHARNOV 2 — A RICHER WORLD, AN EARLIER EXIT');
  console.log('   the patch is identical every time. Only what is on offer elsewhere changes.');
  console.log('   world pays   leave at   forager');
  for (const r of richRows) {
    console.log(
      `   ${r.rate.toFixed(2).padStart(10)}   ${r.predicted.toFixed(3).padStart(8)}   ${r.settled.toFixed(3).padStart(7)}`
    );
  }
  console.log('   Better opportunities elsewhere abandon a patch nothing has changed about.');
  console.log('   No "leave at 20% remaining" rule does that, because it cannot see elsewhere.\n');

  console.log('  AND WHAT A TUNED THRESHOLD COSTS ONE LEVEL ALONG');
  console.log(`   tuned on travel ${TUNED_AT}: leave at ${(tuned.fraction * 100).toFixed(0)}% depleted, and it is OPTIMAL there`);
  console.log('   travel   best there   the tuned rule   the forager   it loses');
  for (const r of carried) {
    console.log(
      `   ${String(r.travel).padStart(6)}   ${(r.best * 100).toFixed(0).padStart(9)}%   ` +
        `${r.keeps.toFixed(4).padStart(14)}   ${r.mvt.toFixed(4).padStart(11)}   ${(r.loss * 100).toFixed(1).padStart(7)}%`
    );
  }
  console.log('   The threshold is not badly tuned. "Optimal here" is simply a different');
  console.log('   number over there, and the forager was never given either one.');
}

if (failures.length) {
  console.error('\nFORAGING OVER BUDGET');
  for (const l of failures) console.error(`  ${l}`);
  console.error('\nCharnov 1976 is not negotiable. If the agent stopped agreeing with it, the agent moved.');
  process.exit(1);
}
if (!json) console.log('\nforage: the utility has a unit, and the quitting rule is a theorem ✓');
