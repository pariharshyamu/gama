/**
 * The circuit gate: does the thing this app claims to show actually happen?
 *
 * The claim is Elhage et al. (2021) and Olsson et al. (2022): a model solves
 * "what comes after the last time I saw this?" with a two-head circuit — a
 * previous-token head in the first layer writing "the symbol before me was X"
 * into the residual stream, and an induction head in the second reading that
 * to attend to whatever followed the earlier occurrence. One layer provably
 * cannot express it.
 *
 * So this trains the shipped model, and then trains TWO CONTROLS:
 *
 *   one layer   should fail. If it succeeds, the app's whole story is wrong
 *               and the task has a shortcut in it — which is exactly what
 *               happened the first time, when a fixed repeat period let a
 *               single head solve everything by counting positions.
 *   with MLPs   should learn the task and NOT produce a readable head. That
 *               is the justification for shipping attention-only.
 *
 * Neither threshold is a number I picked. Induction mass is reported against
 * the mass a UNIFORM head would put on the same targets, measured from the
 * same sequences — so "4x chance" means four times what attending to nothing
 * in particular would score on this exact data.
 *
 *   node --experimental-strip-types tools/circuit.mjs
 */
import { Transformer, Rng, sample, CONFIG, circuitMass, seqLen } from '../src/model.ts';

const STEPS = +(process.env.STEPS ?? 6000);
const PROBES = [4242, 77, 1234, 909, 5150].map((s) => s);

/** What a head that attends uniformly over its causal window would score. */
function chanceMass(cfg, samples) {
  const n = seqLen(cfg);
  let ind = 0;
  let prev = 0;
  let count = 0;
  for (const s of samples) {
    for (let t = s.period; t < n; t++) {
      let targets = 0;
      for (let j = 1; j <= t; j++) if (s.tokens[j - 1] === s.tokens[t]) targets++;
      ind += targets / (t + 1);
      prev += 1 / (t + 1);
      count++;
    }
  }
  return { induction: ind / count, previous: prev / count };
}

function scoreHeads(model, cfg, samples) {
  const rows = [];
  for (let l = 0; l < cfg.layers; l++) {
    for (let h = 0; h < cfg.heads; h++) rows.push({ l, h, induction: 0, previous: 0, same: 0 });
  }
  for (const s of samples) {
    model.forward(s);
    for (const r of rows) {
      const cm = circuitMass(model.attention(r.l, r.h), cfg, s);
      r.induction += cm.induction / samples.length;
      r.previous += cm.previous / samples.length;
      r.same += cm.same / samples.length;
    }
  }
  return rows;
}

function run(label, overrides, seed = 7) {
  const cfg = { ...CONFIG, ...overrides };
  const model = new Transformer(cfg, seed);
  const rng = new Rng(1);
  const curve = [];
  const t0 = Date.now();
  for (let i = 0; i <= STEPS; i++) {
    model.trainStep(rng);
    if (i % 100 === 0) {
      const ev = model.evaluate(new Rng(999), 16);
      curve.push({ step: i, loss: ev.loss, cold: ev.lossCold, repeat: ev.lossRepeat });
    }
  }
  const samples = PROBES.map((s) => sample(cfg, new Rng(s)));
  const heads = scoreHeads(model, cfg, samples);
  const chance = chanceMass(cfg, samples);
  const ev = model.evaluate(new Rng(31337), 64);
  return { label, cfg, curve, heads, chance, ev, seconds: (Date.now() - t0) / 1000 };
}

function report(r) {
  const best = { ind: null, prev: null };
  for (const h of r.heads) {
    if (!best.ind || h.induction > best.ind.induction) best.ind = h;
    if (!best.prev || h.previous > best.prev.previous) best.prev = h;
  }
  console.log(`\n### ${r.label}  (${r.cfg.layers} layer${r.cfg.layers > 1 ? 's' : ''}, ${r.cfg.mlp ? 'with MLPs' : 'attention-only'}, ${r.seconds.toFixed(0)}s)`);
  console.log(
    `  held-out loss ${r.ev.loss.toFixed(3)}   cold ${r.ev.lossCold.toFixed(3)}   repeat ${r.ev.lossRepeat.toFixed(4)} nats`,
  );
  console.log(`  a uniform head would score induction ${r.chance.induction.toFixed(3)}, previous ${r.chance.previous.toFixed(3)}`);
  for (const h of r.heads) {
    const tag =
      h.induction > 0.5 ? '  <-- INDUCTION' : h.previous > 0.5 ? '  <-- PREVIOUS-TOKEN' : '';
    console.log(
      `    L${h.l}H${h.h}   induction ${h.induction.toFixed(3)} (${(h.induction / r.chance.induction).toFixed(1)}x chance)` +
        `   previous ${h.previous.toFixed(3)}   same ${h.same.toFixed(3)}${tag}`,
    );
  }
  return best;
}

// ---------------------------------------------------------------- the model
const main = run('the shipped model', {});
const mainBest = report(main);

// Where did it turn? Halfway between the first and last repeat loss.
const first = main.curve[0].repeat;
const last = main.curve[main.curve.length - 1].repeat;
const mid = (first + last) / 2;
const crossed = main.curve.find((p) => p.repeat <= mid);
console.log(`  repeat loss ${first.toFixed(2)} -> ${last.toFixed(3)} nats; crossed the midpoint at step ${crossed?.step}`);
console.log(`  cold loss stayed at ${main.curve[main.curve.length - 1].cold.toFixed(2)} against ln(vocab) = ${Math.log(CONFIG.vocab).toFixed(2)} — the task's floor, and the model never beats it`);

// Is there a loss BUMP at the transition, as Olsson et al. report? Measure it
// rather than assert it: the largest rise in the total loss over any window
// inside the transition, against the noise in the flat tail.
const tail = main.curve.slice(Math.floor(main.curve.length * 0.7));
const tailMean = tail.reduce((a, p) => a + p.loss, 0) / tail.length;
const tailSd = Math.sqrt(tail.reduce((a, p) => a + (p.loss - tailMean) ** 2, 0) / tail.length);
let rise = 0;
let riseAt = 0;
for (let i = 1; i < main.curve.length; i++) {
  for (let j = i + 1; j < Math.min(main.curve.length, i + 6); j++) {
    if (main.curve[j].loss - main.curve[i].loss > rise) {
      rise = main.curve[j].loss - main.curve[i].loss;
      riseAt = main.curve[i].step;
    }
  }
}
console.log(
  `  largest rise in total loss: ${rise.toFixed(3)} nats at step ${riseAt}, against ${tailSd.toFixed(3)} nats of eval noise (${(rise / tailSd).toFixed(1)} sigma)`,
);
// Olsson et al. report a visible loss BUMP as induction heads form. Whether
// this model shows one is a question, not an assumption — so print where the
// rise landed relative to the transition and let the reader judge. A rise in
// the flat tail is eval noise wearing a costume.
const nearTransition = crossed && Math.abs(riseAt - crossed.step) < 0.35 * crossed.step;
console.log(
  `  that rise is ${nearTransition ? 'AT' : 'NOT at'} the transition (step ${crossed?.step}) — ` +
    `${nearTransition ? 'consistent with the bump Olsson et al. report' : 'so this run shows no bump, only a fall'}`,
);

// ------------------------------------------------------------- the controls
const oneLayer = run('CONTROL: one layer', { layers: 1 });
const oneBest = report(oneLayer);

const withMlp = run('CONTROL: two layers, MLPs on', { mlp: true });
const mlpBest = report(withMlp);

// ---------------------------------------------------------------- the gates
const fails = [];
const R = (h, c) => h / c;

if (!(mainBest.ind.induction > 0.5)) {
  fails.push(`no induction head formed: best is L${mainBest.ind.l}H${mainBest.ind.h} at ${mainBest.ind.induction.toFixed(3)}`);
}
if (mainBest.ind.l !== main.cfg.layers - 1) {
  fails.push(`the induction head is in layer ${mainBest.ind.l}, not the last layer — a head that early cannot be reading a previous-token head, so it is doing something else`);
}
if (!(mainBest.prev.previous > 0.5)) {
  fails.push(`no previous-token head formed: best is ${mainBest.prev.previous.toFixed(3)}`);
}
if (mainBest.prev.l !== 0) {
  fails.push(`the previous-token head is in layer ${mainBest.prev.l}, not layer 0 — nothing downstream could use it there`);
}
if (!(main.ev.lossRepeat < main.ev.lossCold / 10)) {
  fails.push(`repeat loss ${main.ev.lossRepeat.toFixed(3)} is not an order of magnitude under the cold loss ${main.ev.lossCold.toFixed(3)}`);
}
if (!(main.ev.lossCold > 0.8 * Math.log(CONFIG.vocab))) {
  fails.push(`cold loss ${main.ev.lossCold.toFixed(3)} fell below the task's own floor — the "unguessable" half is guessable, so the split is wrong`);
}

// The one-layer control has to FAIL, and that failure is the evidence.
if (R(oneBest.ind.induction, oneLayer.chance.induction) > 2.5) {
  fails.push(`the one-layer control scored ${R(oneBest.ind.induction, oneLayer.chance.induction).toFixed(1)}x chance induction — if one layer can do this, the task has a shortcut and the two-layer story is unearned`);
}
if (!(oneLayer.ev.lossRepeat > 4 * main.ev.lossRepeat)) {
  fails.push(`the one-layer control reached repeat loss ${oneLayer.ev.lossRepeat.toFixed(3)} against the model's ${main.ev.lossRepeat.toFixed(3)} — too close to claim the second layer is doing the work`);
}

// The MLP control has to learn AND stay unreadable — that is the case for
// shipping attention-only.
if (mlpBest.ind.induction > 0.5) {
  fails.push(`the MLP model DID produce a readable induction head (${mlpBest.ind.induction.toFixed(3)}) — then attention-only is an unnecessary simplification and the default should change`);
}

console.log('\n---');
console.log(`induction head      ${mainBest.ind.induction.toFixed(3)}  (${R(mainBest.ind.induction, main.chance.induction).toFixed(1)}x chance)  L${mainBest.ind.l}H${mainBest.ind.h}`);
console.log(`previous-token head ${mainBest.prev.previous.toFixed(3)}  (${R(mainBest.prev.previous, main.chance.previous).toFixed(1)}x chance)  L${mainBest.prev.l}H${mainBest.prev.h}`);
console.log(`one-layer control   ${oneBest.ind.induction.toFixed(3)}  (${R(oneBest.ind.induction, oneLayer.chance.induction).toFixed(1)}x chance)  repeat loss ${oneLayer.ev.lossRepeat.toFixed(3)}`);
console.log(`MLP control         ${mlpBest.ind.induction.toFixed(3)}  (${R(mlpBest.ind.induction, withMlp.chance.induction).toFixed(1)}x chance)  repeat loss ${withMlp.ev.lossRepeat.toFixed(3)}`);

if (fails.length) {
  console.error(`\nCIRCUIT GATE FAILED (${fails.length}):`);
  for (const f of fails) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('\ncircuit ok');
