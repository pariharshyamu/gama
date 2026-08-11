/**
 * The first gate. Nothing else in this build means anything until it passes.
 *
 * Every gradient in `model.ts` is derived by hand. A wrong one does not throw
 * and does not produce a visibly broken picture — it produces a model that
 * trains slightly worse, which is indistinguishable from a model that needs
 * more steps.
 *
 * THE TOLERANCE IS NOT A NUMBER I CHOSE. Comparing an analytic gradient to a
 * finite difference always leaves a residual, and picking a threshold for it
 * is guesswork: too tight and float noise fails a correct derivation, too
 * loose and a real error walks through. So this gate measures the residual's
 * CONVERGENCE ORDER instead.
 *
 * A central difference has truncation error O(h²). So if the analytic
 * gradient is right, the discrepancy between the two is pure truncation and
 * HALVING h must quarter it — order 2. If the analytic gradient is wrong, the
 * discrepancy is dominated by that fixed error, which h does not touch at all
 * — order 0. The two cases are not close to each other, and neither one needs
 * me to know what the right residual is.
 *
 * The run ends by corrupting gradients on purpose and showing the order
 * collapses, because a check that never fires is a decoration.
 *
 *   node --experimental-strip-types tools/gradcheck.mjs
 */
import { Transformer, Rng, sample, CONFIG } from '../src/model.ts';

const H = 4e-3; // coarse step
const PER_PARAM = 20;
const MIN_ORDER = 1.7; // second order, with room for the sample being finite

const model = new Transformer(CONFIG, 11);
const s = sample(CONFIG, new Rng(3));

model.zeroGrad();
model.forward(s);
model.backward(s, 1);
const analytic = model.params.map((p) => Float64Array.from(p.grad));

const lossAt = () => model.forward(s).loss;

/** Central difference of the loss w.r.t. one parameter element. */
function numeric(p, i, h) {
  const orig = p.data[i];
  p.data[i] = orig + h;
  const lp = lossAt();
  p.data[i] = orig - h;
  const lm = lossAt();
  p.data[i] = orig;
  return (lp - lm) / (2 * h);
}

/**
 * @param corrupt scales the analytic gradients, to prove the check bites.
 * @returns RMS |numeric - analytic| at h and h/2, plus the worst per tensor.
 */
function measure(corrupt = 1) {
  const pick = new Rng(99);
  let sumCoarse = 0;
  let sumFine = 0;
  let count = 0;
  const perTensor = [];
  for (let pi = 0; pi < model.params.length; pi++) {
    const p = model.params[pi];
    const n = p.data.length;
    const take = Math.min(PER_PARAM, n);
    let worstRel = 0;
    let scale = 0;
    for (let c = 0; c < take; c++) {
      const i = n <= PER_PARAM ? c : pick.int(n);
      const ana = analytic[pi][i] * corrupt;
      const coarse = numeric(p, i, H);
      const fine = numeric(p, i, H / 2);
      sumCoarse += (coarse - ana) ** 2;
      sumFine += (fine - ana) ** 2;
      count++;
      const denom = Math.max(Math.abs(fine), Math.abs(ana), 1e-9);
      worstRel = Math.max(worstRel, Math.abs(fine - ana) / denom);
      scale = Math.max(scale, Math.abs(fine));
    }
    perTensor.push({ name: p.name, size: n, worstRel, scale });
  }
  const coarse = Math.sqrt(sumCoarse / count);
  const fine = Math.sqrt(sumFine / count);
  return { coarse, fine, count, perTensor, order: Math.log2(coarse / fine) };
}

const real = measure(1);

for (const t of real.perTensor) {
  console.log(
    `  ${t.name.padEnd(10)} ${String(t.size).padStart(6)} params   ` +
      `|grad| up to ${t.scale.toExponential(2)}   worst rel ${t.worstRel.toExponential(2)}`,
  );
}
console.log(`\n${real.count} partials, each differenced at h and h/2 (h = ${H})`);
console.log(`  rms discrepancy   h: ${real.coarse.toExponential(3)}   h/2: ${real.fine.toExponential(3)}`);
console.log(`  convergence order ${real.order.toFixed(2)}   (2 = pure truncation, 0 = a wrong derivative)`);

// ---- the control ---------------------------------------------------------
// Every analytic gradient off by 2%. Small enough that a fixed relative
// tolerance might wave it through; the order test cannot, because a constant
// error does not shrink when h does.
const broken = measure(1.02);
console.log(
  `\ncontrol, all gradients scaled by 1.02:` +
    `\n  rms discrepancy   h: ${broken.coarse.toExponential(3)}   h/2: ${broken.fine.toExponential(3)}` +
    `\n  convergence order ${broken.order.toFixed(2)}`,
);

const fails = [];
if (!(real.order > MIN_ORDER)) {
  fails.push(`convergence order ${real.order.toFixed(2)} is below ${MIN_ORDER} — the residual is not truncation, it is a wrong derivative`);
}
if (!(broken.order < 1)) {
  fails.push(`a 2% gradient error still scored order ${broken.order.toFixed(2)} — this check does not discriminate`);
}
if (fails.length) {
  console.error('\nGRADCHECK FAILED:');
  for (const f of fails) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('\ngradcheck ok');
