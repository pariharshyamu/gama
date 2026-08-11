/**
 * The laws gate: the three facts the architecture rests on, measured.
 *
 * These are not properties of my code — they are properties of the maths the
 * code is built on. So each one is measured first and the code is checked
 * against the measurement, never the other way round.
 *
 *   1. sqrt(d_k). Vaswani et al. (2017) do not tune this divisor, they derive
 *      it: for q and k with independent unit-variance components, q·k is a sum
 *      of d_k such products, so its variance is d_k and its scale is sqrt(d_k).
 *      Measured by sampling dot products at several widths and FITTING THE
 *      EXPONENT. If the fit does not come out at 0.5, the divisor in the code
 *      is the wrong function and no assertion about it would have caught that.
 *
 *   2. Softmax conserves mass. Every query has exactly 1.0 of attention to
 *      spend, which is what makes attention a distribution rather than a
 *      similarity score, and what makes attending harder to one key
 *      necessarily mean attending less to another.
 *
 *   3. Relative position. The sinusoidal table is pairs of (sin, cos) at
 *      geometric frequencies, so advancing the position by k ROTATES each pair
 *      by a fixed angle. The consequence is that PE(pos)·PE(pos+k) depends
 *      only on k and not on pos. Measured as the spread across pos.
 *
 *   node --experimental-strip-types tools/laws.mjs
 */
import {
  Transformer, Rng, sample, CONFIG, positionalEncoding, headDim, seqLen, rowEntropy,
} from '../src/model.ts';

const fails = [];
const check = (ok, msg) => {
  if (!ok) fails.push(msg);
  return ok;
};

// ------------------------------------------------------------- 1. sqrt(d_k)
console.log('1. THE DIVISOR');
const widths = [8, 16, 32, 64, 128, 256, 512];
const rng = new Rng(4);
const points = [];
for (const dk of widths) {
  const N = 20000;
  let sum = 0;
  let sq = 0;
  for (let t = 0; t < N; t++) {
    let dot = 0;
    for (let i = 0; i < dk; i++) dot += rng.normal() * rng.normal();
    sum += dot;
    sq += dot * dot;
  }
  const mean = sum / N;
  const sd = Math.sqrt(sq / N - mean * mean);
  points.push({ dk, sd });
  console.log(`   d_k ${String(dk).padStart(4)}   mean ${mean.toFixed(4)}   sd of q·k ${sd.toFixed(3)}   sd/sqrt(d_k) ${(sd / Math.sqrt(dk)).toFixed(4)}`);
}
// Least squares on log(sd) = a + b*log(d_k). b is the exponent, and it is the
// whole claim: the scale of a dot product goes as d_k to the one half.
const lx = points.map((p) => Math.log(p.dk));
const ly = points.map((p) => Math.log(p.sd));
const mx = lx.reduce((a, b) => a + b) / lx.length;
const my = ly.reduce((a, b) => a + b) / ly.length;
let num = 0;
let den = 0;
for (let i = 0; i < lx.length; i++) {
  num += (lx[i] - mx) * (ly[i] - my);
  den += (lx[i] - mx) ** 2;
}
const exponent = num / den;
console.log(`   fitted exponent ${exponent.toFixed(4)}  (the paper's derivation says 0.5)`);
check(Math.abs(exponent - 0.5) < 0.01, `dot-product scale goes as d_k^${exponent.toFixed(3)}, not d_k^0.5 — the divisor is the wrong function of width`);

// And on THIS model at init, where LayerNorm supplies the unit variance the
// argument assumes. If the initialiser drifted, this is where it shows.
{
  const model = new Transformer(CONFIG, 11);
  const s = sample(CONFIG, new Rng(2));
  model.forward(s);
  const dh = headDim(CONFIG);
  const n = seqLen(CONFIG);
  // Recover raw dot products from the scaled logits the model actually used.
  let sum = 0;
  let sq = 0;
  let count = 0;
  const probs = model.attention(0, 0);
  // The softmax destroys the logits, so recompute q·k from the cached q and k.
  const q = model.qkv(0).q;
  const k = model.qkv(0).k;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let dot = 0;
      for (let m = 0; m < dh; m++) dot += q[i * CONFIG.dModel + m] * k[j * CONFIG.dModel + m];
      sum += dot;
      sq += dot * dot;
      count++;
    }
  }
  void probs;
  const mean = sum / count;
  const sd = Math.sqrt(sq / count - mean * mean);
  const ratio = sd / Math.sqrt(dh);
  console.log(`   on this model at init: d_head ${dh}, sd of q·k ${sd.toFixed(3)}, sd/sqrt(d_head) ${ratio.toFixed(3)}`);
  check(ratio > 0.4 && ratio < 2.5, `this model's dot products scale at ${ratio.toFixed(2)}x sqrt(d_head) — the initialiser no longer supplies the unit variance the derivation assumes`);
}

// What the divisor BUYS: without it the softmax saturates as width grows.
console.log('\n   what the divisor buys — attention entropy over 16 keys, in bits:');
const KEYS = 16;
for (const dk of [16, 64, 256]) {
  const measure = (scaled) => {
    let h = 0;
    const R = 300;
    for (let r = 0; r < R; r++) {
      const logits = new Float64Array(KEYS);
      const qv = new Float64Array(dk);
      for (let i = 0; i < dk; i++) qv[i] = rng.normal();
      for (let j = 0; j < KEYS; j++) {
        let dot = 0;
        for (let i = 0; i < dk; i++) dot += qv[i] * rng.normal();
        logits[j] = scaled ? dot / Math.sqrt(dk) : dot;
      }
      let max = -Infinity;
      for (const v of logits) if (v > max) max = v;
      let sum = 0;
      for (let j = 0; j < KEYS; j++) {
        logits[j] = Math.exp(logits[j] - max);
        sum += logits[j];
      }
      for (let j = 0; j < KEYS; j++) logits[j] /= sum;
      h += rowEntropy(logits, 0, KEYS);
    }
    return h / R;
  };
  const on = measure(true);
  const off = measure(false);
  console.log(`   d_k ${String(dk).padStart(3)}   scaled ${on.toFixed(2)} bits   unscaled ${off.toFixed(2)} bits   (uniform = ${Math.log2(KEYS).toFixed(2)})`);
  if (dk === 256) {
    check(off < 0.5, `at d_k 256 the unscaled softmax still holds ${off.toFixed(2)} bits — it is not collapsing, so the divisor is not earning its place`);
    check(on > 2.5, `at d_k 256 the scaled softmax fell to ${on.toFixed(2)} bits — the divisor is not holding the distribution open`);
  }
}

// ------------------------------------------------------- 2. conservation
console.log('\n2. EVERY QUERY SPENDS EXACTLY 1.0');
{
  const model = new Transformer(CONFIG, 3);
  const trainRng = new Rng(1);
  for (let i = 0; i < 200; i++) model.trainStep(trainRng);
  const n = seqLen(CONFIG);
  let worst = 0;
  let rows = 0;
  let leaked = 0;
  for (let t = 0; t < 12; t++) {
    const s = sample(CONFIG, new Rng(100 + t));
    model.forward(s);
    for (let l = 0; l < CONFIG.layers; l++) {
      for (let h = 0; h < CONFIG.heads; h++) {
        const p = model.attention(l, h);
        for (let i = 0; i < n; i++) {
          let sum = 0;
          for (let j = 0; j < n; j++) {
            sum += p[i * n + j];
            // Anything at all above the diagonal is the model reading the
            // future, which would make every number downstream meaningless.
            if (j > i) leaked += p[i * n + j];
          }
          worst = Math.max(worst, Math.abs(sum - 1));
          rows++;
        }
      }
    }
  }
  console.log(`   ${rows} rows checked   worst |sum - 1| = ${worst.toExponential(2)}   mass above the diagonal = ${leaked.toExponential(2)}`);
  check(worst < 1e-12, `an attention row summed to ${(1 + worst).toFixed(6)} — it is not a distribution`);
  check(leaked === 0, `${leaked} of attention mass sits above the causal diagonal — the model can see the future`);
}

// ------------------------------------------------------- 3. relative position
console.log('\n3. POSITION IS A ROTATION');
{
  const d = CONFIG.dModel;
  const N = 64;
  const pe = positionalEncoding(N, d);
  const dot = (a, b) => {
    let s = 0;
    for (let i = 0; i < d; i++) s += pe[a * d + i] * pe[b * d + i];
    return s;
  };
  console.log('   offset k    mean PE(pos)·PE(pos+k)    spread across pos');
  let worstSpread = 0;
  let selfDot = dot(0, 0);
  for (const k of [1, 2, 3, 5, 8, 13]) {
    const vals = [];
    for (let pos = 0; pos + k < N; pos++) vals.push(dot(pos, pos + k));
    const mean = vals.reduce((a, b) => a + b) / vals.length;
    const spread = Math.max(...vals) - Math.min(...vals);
    worstSpread = Math.max(worstSpread, spread / Math.abs(selfDot));
    console.log(`   ${String(k).padStart(6)}      ${mean.toFixed(4).padStart(16)}      ${spread.toFixed(4)}`);
  }
  console.log(`   worst spread is ${(worstSpread * 100).toFixed(2)}% of PE(pos)·PE(pos), which is ${selfDot.toFixed(2)}`);
  // A dot product that depended on WHERE you are, not just how far apart, is
  // a table that cannot express relative position at all.
  check(worstSpread < 0.06, `the overlap varies by ${(worstSpread * 100).toFixed(1)}% across positions at fixed offset — this table does not encode relative position`);

  // The control: shuffle the frequencies out of their sin/cos pairs and the
  // property must die. Otherwise this check would pass for any table at all.
  const broken = new Float64Array(N * d);
  for (let pos = 0; pos < N; pos++) {
    for (let i = 0; i < d; i++) {
      broken[pos * d + i] = Math.sin(pos / Math.pow(10000, i / d) + i);
    }
  }
  const bdot = (a, b) => {
    let s = 0;
    for (let i = 0; i < d; i++) s += broken[a * d + i] * broken[b * d + i];
    return s;
  };
  let bWorst = 0;
  const bSelf = bdot(0, 0);
  for (const k of [1, 2, 3, 5, 8, 13]) {
    const vals = [];
    for (let pos = 0; pos + k < N; pos++) vals.push(bdot(pos, pos + k));
    bWorst = Math.max(bWorst, (Math.max(...vals) - Math.min(...vals)) / Math.abs(bSelf));
  }
  console.log(`   control, all-sine table with no cosine partner: spread ${(bWorst * 100).toFixed(1)}%`);
  check(bWorst > 0.2, `the control table also looked position-invariant (${(bWorst * 100).toFixed(1)}%) — this check would pass for anything`);
}

console.log('\n---');
if (fails.length) {
  console.error(`LAWS GATE FAILED (${fails.length}):`);
  for (const f of fails) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('laws ok');
