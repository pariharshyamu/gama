/**
 * A transformer small enough to train in a browser tab, written out longhand.
 *
 * There is no autodiff here. Every backward pass is derived by hand and lives
 * next to the forward pass it undoes, because the whole point of this app is
 * that you can look at any number on screen and follow it back to the line
 * that produced it. A tape you cannot read would defeat the exercise.
 *
 * Hand-derived gradients are also exactly where a silent bug lives: a wrong
 * gradient does not crash, it just trains slightly worse, and "slightly worse"
 * is indistinguishable from "needs more steps". `tools/gradcheck.mjs` compares
 * every parameter against a central finite difference and is the first gate
 * this build has to pass. Nothing downstream means anything until it does.
 *
 * ZERO IMPORTS. This file runs unchanged in the browser bundle and under
 * `node --experimental-strip-types` in the gates, so the thing being verified
 * is the thing that ships.
 */

// ---------------------------------------------------------------- the shape

export interface Config {
  /** Distinct symbols. */
  vocab: number;
  /** Tokens on the line. */
  seq: number;
  /**
   * The repeating pattern's length is drawn from [minPeriod, maxPeriod].
   *
   * IT HAS TO VARY, and this is the single most important line in the file.
   * The first version of this task used one fixed period, so the answer for
   * query t always sat at t - period + 1 — a CONSTANT offset, reachable from
   * the positional encoding alone with no content matching whatever. The model
   * duly learned "look 7 back", drove the repeat loss to 0.001, and the
   * induction metric read 0.85 for a head that was doing nothing of the kind.
   * It was in layer 0, which is what gave it away: the circuit being claimed
   * needs two.
   */
  minPeriod: number;
  maxPeriod: number;
  /** Residual stream width. */
  dModel: number;
  heads: number;
  layers: number;
  /** Hidden width of the per-position MLP. */
  dFF: number;
  /**
   * Whether each block gets its MLP. Default OFF, and that is a finding, not
   * a shortcut.
   *
   * With the MLPs in, this model still learns the task — repeat loss 0.13 —
   * but NO head is interpretable: the best induction score in the stack is
   * 0.21, barely above the 0.1 a uniform head would score, and the
   * previous-token heads turn up in layer 1 where nothing can read them. The
   * mechanism is real and it is smeared across the MLPs where no attention
   * picture can show it.
   *
   * Switch them off and the circuit snaps into place — previous-token heads in
   * layer 0, an induction head in layer 1 holding 98% of its mass on the right
   * key — and the repeat loss goes DOWN, to 0.02. Attention-only is the
   * setting Elhage et al. (2021) work in, and this is why.
   *
   * The app keeps the switch because the contrast is the lesson.
   */
  mlp: boolean;
  /** Sequences per optimiser step. */
  batch: number;
  lr: number;
}

/**
 * Small enough that a phase change arrives in tens of seconds of wall clock,
 * large enough that the circuit that appears is the real two-head one.
 *
 * `heads: 2` is the interesting number. One head cannot do induction at all —
 * the pattern needs a previous-token head to write "the symbol before me was
 * X" into the residual stream and a second head, in a later layer, to read it.
 * Elhage et al. (2021) show a one-layer attention-only model provably cannot
 * express it, which is what the one-layer control in the gate is for.
 */
export const CONFIG: Config = {
  vocab: 16,
  seq: 16,
  minPeriod: 5,
  maxPeriod: 8,
  dModel: 24,
  heads: 2,
  layers: 2,
  dFF: 48,
  mlp: false,
  batch: 8,
  // 3e-3 trains, and never forms the circuit. Two seeds ran 8000 steps and
  // both settled into a smeared solution: repeat loss 0.03-0.13, with no head
  // above 0.20 induction. At 1e-2 the same model finds the clean two-head
  // circuit and the repeat loss drops another order of magnitude, to 0.005.
  // The learning rate was not a tuning knob here — it decided which ALGORITHM
  // the model ended up implementing.
  lr: 1e-2,
};

export const seqLen = (c: Config): number => c.seq;
export const headDim = (c: Config): number => c.dModel / c.heads;

// ---------------------------------------------------------------- the noise

/** mulberry32 — small, seeded, and identical in node and the browser. */
export class Rng {
  private s: number;
  constructor(seed = 1) {
    this.s = seed >>> 0;
  }
  next(): number {
    this.s = (this.s + 0x6d2b79f5) >>> 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  int(n: number): number {
    return Math.floor(this.next() * n);
  }
  /** Box–Muller. Unit variance, which the initialiser below depends on. */
  normal(): number {
    let u = 0;
    while (u === 0) u = this.next();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * this.next());
  }
}

// ---------------------------------------------------------------- the task

export interface Sample {
  /** Length `seq`: a pattern of `period` distinct symbols, tiled. */
  tokens: Int32Array;
  /** `targets[t]` is the token at t+1; the last position has no target. */
  targets: Int32Array;
  /** This sequence's pattern length. Varies, which is the whole point. */
  period: number;
}

/**
 * A random pattern, repeated until the line is full.
 *
 * A position t is answerable only if the symbol sitting at t has appeared
 * before — then whatever followed it last time follows it again. That is
 * induction, and for t < period there is no earlier occurrence, so those
 * positions are unguessable no matter how good the model is. The gap between
 * those two groups is the measurement this whole build rests on.
 *
 * The pattern's symbols are DISTINCT. With a repeat inside the pattern, "where
 * did I see this symbol before" would have two answers with different
 * successors, and the model would be penalised for a correct induction step.
 *
 * The pattern LENGTH is redrawn every sequence. See `Config.minPeriod`.
 */
export function sample(c: Config, rng: Rng): Sample {
  const n = seqLen(c);
  const period = c.minPeriod + rng.int(c.maxPeriod - c.minPeriod + 1);
  const pool: number[] = [];
  for (let i = 0; i < c.vocab; i++) pool.push(i);
  // Partial Fisher–Yates: take `period` distinct symbols.
  for (let i = 0; i < period; i++) {
    const j = i + rng.int(c.vocab - i);
    const t = pool[i];
    pool[i] = pool[j];
    pool[j] = t;
  }
  const tokens = new Int32Array(n);
  for (let i = 0; i < n; i++) tokens[i] = pool[i % period];
  const targets = new Int32Array(n);
  for (let i = 0; i < n - 1; i++) targets[i] = tokens[i + 1];
  targets[n - 1] = -1;
  return { tokens, targets, period };
}

// ---------------------------------------------------------- the parameters

export class Param {
  data: Float64Array;
  grad: Float64Array;
  m: Float64Array;
  v: Float64Array;
  // Written out rather than declared as constructor parameter properties:
  // node's strip-only TypeScript mode, which the gates run under, rejects
  // those outright. The gates have to load the file that ships.
  readonly name: string;
  readonly rows: number;
  readonly cols: number;
  constructor(name: string, rows: number, cols: number) {
    this.name = name;
    this.rows = rows;
    this.cols = cols;
    const n = rows * cols;
    this.data = new Float64Array(n);
    this.grad = new Float64Array(n);
    this.m = new Float64Array(n);
    this.v = new Float64Array(n);
  }
}

export interface Layer {
  wq: Param;
  wk: Param;
  wv: Param;
  wo: Param;
  w1: Param;
  b1: Param;
  w2: Param;
  b2: Param;
  g1: Param;
  bn1: Param;
  g2: Param;
  bn2: Param;
}

/** One layer's activations, kept so the backward pass can undo them. */
interface LayerCache {
  xIn: Float64Array; // [n, d]  block input
  ln1: Float64Array; // [n, d]  normalised
  ln1rstd: Float64Array; // [n]
  q: Float64Array; // [n, d] (heads packed along the row)
  k: Float64Array;
  v: Float64Array;
  probs: Float64Array; // [heads, n, n] post-softmax
  ctx: Float64Array; // [n, d]  concatenated head outputs
  xMid: Float64Array; // [n, d]  after the attention residual
  ln2: Float64Array;
  ln2rstd: Float64Array;
  ff: Float64Array; // [n, dFF] post-activation
  ffPre: Float64Array; // [n, dFF] pre-activation (GELU's derivative needs it)
  xOut: Float64Array; // [n, d]
}

// --------------------------------------------------------------- activation

/**
 * GELU, in the tanh form GPT-2 shipped.
 *
 * THIS STARTED AS ReLU AND THE GRADIENT CHECK REJECTED IT — correctly, and
 * not because the derivative was wrong. ReLU has a kink at zero, so a central
 * difference that straddles it is comparing a one-sided slope to a two-sided
 * secant, and the error falls off as h rather than h². The check measures
 * convergence order, so it saw order 1 where it wanted 2 and failed the build.
 * The scattered handful of failing weights were exactly the ones whose
 * pre-activation sat within h of zero.
 *
 * The honest fix is not a looser tolerance: it is an activation that is
 * actually differentiable. GELU is smooth everywhere, and it is what every
 * transformer since GPT-2 has used anyway — so the model got more faithful
 * and more verifiable in the same edit.
 */
const GELU_C = Math.sqrt(2 / Math.PI);

export function gelu(x: number): number {
  const inner = GELU_C * (x + 0.044715 * x * x * x);
  return 0.5 * x * (1 + Math.tanh(inner));
}

export function geluPrime(x: number): number {
  const inner = GELU_C * (x + 0.044715 * x * x * x);
  const t = Math.tanh(inner);
  const dInner = GELU_C * (1 + 3 * 0.044715 * x * x);
  return 0.5 * (1 + t) + 0.5 * x * (1 - t * t) * dInner;
}

// ------------------------------------------------------------------ helpers

/** C[M,N] = A[M,K] · B[K,N] */
function matmul(
  a: Float64Array,
  b: Float64Array,
  out: Float64Array,
  M: number,
  K: number,
  N: number,
): void {
  out.fill(0);
  for (let i = 0; i < M; i++) {
    const ai = i * K;
    const oi = i * N;
    for (let k = 0; k < K; k++) {
      const av = a[ai + k];
      if (av === 0) continue;
      const bk = k * N;
      for (let j = 0; j < N; j++) out[oi + j] += av * b[bk + j];
    }
  }
}

/** dA[M,K] += dC[M,N] · B[K,N]^T   and   dB[K,N] += A[M,K]^T · dC[M,N] */
function matmulBackward(
  a: Float64Array,
  b: Float64Array,
  dOut: Float64Array,
  dA: Float64Array | null,
  dB: Float64Array | null,
  M: number,
  K: number,
  N: number,
): void {
  for (let i = 0; i < M; i++) {
    const ai = i * K;
    const oi = i * N;
    for (let k = 0; k < K; k++) {
      const bk = k * N;
      let acc = 0;
      const av = a[ai + k];
      for (let j = 0; j < N; j++) {
        const g = dOut[oi + j];
        acc += g * b[bk + j];
        if (dB) dB[bk + j] += av * g;
      }
      if (dA) dA[ai + k] += acc;
    }
  }
}

/**
 * LayerNorm forward, per row.
 *
 * Pre-norm placement (normalise going in, add the residual raw) rather than
 * the 2017 paper's post-norm. Post-norm needs a warmup schedule to train at
 * all past a couple of layers; pre-norm is what every model since GPT-2
 * actually ships, and it keeps the residual stream a clean additive channel —
 * which is the thing this app draws.
 */
function layerNorm(
  x: Float64Array,
  g: Float64Array,
  b: Float64Array,
  out: Float64Array,
  rstd: Float64Array,
  n: number,
  d: number,
): void {
  for (let i = 0; i < n; i++) {
    const o = i * d;
    let mu = 0;
    for (let j = 0; j < d; j++) mu += x[o + j];
    mu /= d;
    let va = 0;
    for (let j = 0; j < d; j++) {
      const t = x[o + j] - mu;
      va += t * t;
    }
    va /= d;
    const r = 1 / Math.sqrt(va + 1e-5);
    rstd[i] = r;
    for (let j = 0; j < d; j++) out[o + j] = ((x[o + j] - mu) * r) * g[j] + b[j];
  }
}

/**
 * LayerNorm backward.
 *
 * `xhat` is recovered from the stored output rather than re-derived from the
 * input: out = g·xhat + b, so xhat = (out - b)/g. That keeps one array instead
 * of two and cannot drift out of step with the forward pass — but it means g
 * must never reach zero, which the initialiser (g = 1) and Adam's step size
 * make safe in practice.
 */
function layerNormBackward(
  dOut: Float64Array,
  outCache: Float64Array,
  g: Float64Array,
  b: Float64Array,
  rstd: Float64Array,
  dX: Float64Array,
  dG: Float64Array,
  dB: Float64Array,
  n: number,
  d: number,
): void {
  const xhat = new Float64Array(d);
  const dxhat = new Float64Array(d);
  for (let i = 0; i < n; i++) {
    const o = i * d;
    let mDxhat = 0;
    let mDxhatXhat = 0;
    for (let j = 0; j < d; j++) {
      const xh = (outCache[o + j] - b[j]) / g[j];
      xhat[j] = xh;
      const dy = dOut[o + j];
      dG[j] += dy * xh;
      dB[j] += dy;
      const dxh = dy * g[j];
      dxhat[j] = dxh;
      mDxhat += dxh;
      mDxhatXhat += dxh * xh;
    }
    mDxhat /= d;
    mDxhatXhat /= d;
    const r = rstd[i];
    for (let j = 0; j < d; j++) {
      dX[o + j] += r * (dxhat[j] - mDxhat - xhat[j] * mDxhatXhat);
    }
  }
}

// ------------------------------------------------------------------- model

export interface Forward {
  /** [n, vocab] post-softmax next-token distribution. */
  probs: Float64Array;
  /** Mean cross-entropy over the n-1 positions that have a target, in nats. */
  loss: number;
  /**
   * Loss on positions t < period — the symbol there has never been seen, so
   * nothing can predict its successor. This is the floor the task imposes, and
   * it should stay near ln(vocab) forever.
   */
  lossCold: number;
  /**
   * Loss on positions t >= period, where the symbol HAS occurred before and
   * induction can answer exactly. This is the number that falls off a cliff.
   */
  lossRepeat: number;
}

export class Transformer {
  readonly cfg: Config;
  readonly params: Param[] = [];
  readonly layers: Layer[] = [];
  readonly wemb: Param;
  readonly wu: Param;
  readonly gf: Param;
  readonly bf: Param;
  /** [seq, dModel] fixed sinusoidal table. Not a parameter — never trained. */
  readonly pe: Float64Array;

  step = 0;

  private caches: LayerCache[] = [];
  private xFinal: Float64Array;
  private lnF: Float64Array;
  private lnFrstd: Float64Array;
  private logits: Float64Array;
  private probs: Float64Array;
  private dBuf: Float64Array;
  private dBuf2: Float64Array;

  constructor(cfg: Config = CONFIG, seed = 7) {
    this.cfg = cfg;
    const { dModel: d, dFF, vocab, layers } = cfg;
    const n = seqLen(cfg);
    const rng = new Rng(seed);

    // `track` decides whether a tensor joins `this.params` — which is what the
    // optimiser steps and what the gradient check verifies. With the MLPs off
    // their weights still exist (so the layer type stays one shape) but they
    // are untracked, because a parameter that cannot reach the loss would sail
    // through a gradient check for the worst possible reason.
    const mk = (name: string, rows: number, cols: number, std: number, track = true): Param => {
      const p = new Param(name, rows, cols);
      for (let i = 0; i < p.data.length; i++) p.data[i] = rng.normal() * std;
      if (track) this.params.push(p);
      return p;
    };
    const ones = (name: string, len: number, track = true): Param => {
      const p = new Param(name, 1, len);
      p.data.fill(1);
      if (track) this.params.push(p);
      return p;
    };
    const zeros = (name: string, len: number, track = true): Param => {
      const p = new Param(name, 1, len);
      if (track) this.params.push(p);
      return p;
    };
    const useMlp = cfg.mlp;

    this.wemb = mk('wemb', vocab, d, 1 / Math.sqrt(d));
    for (let l = 0; l < layers; l++) {
      // std = 1/sqrt(fan_in) is not a style choice here. LayerNorm hands each
      // projection a unit-variance input, so this init is exactly the premise
      // of the sqrt(d_k) argument: q and k come out with unit-variance
      // components, their dot product therefore has variance d_k, and the
      // divisor the attention uses is the one the data actually needs. The
      // gate measures that on this model at init rather than assuming it.
      this.layers.push({
        wq: mk(`l${l}.wq`, d, d, 1 / Math.sqrt(d)),
        wk: mk(`l${l}.wk`, d, d, 1 / Math.sqrt(d)),
        wv: mk(`l${l}.wv`, d, d, 1 / Math.sqrt(d)),
        wo: mk(`l${l}.wo`, d, d, 1 / Math.sqrt(d)),
        w1: mk(`l${l}.w1`, d, dFF, 1 / Math.sqrt(d), useMlp),
        b1: zeros(`l${l}.b1`, dFF, useMlp),
        w2: mk(`l${l}.w2`, dFF, d, 1 / Math.sqrt(dFF), useMlp),
        b2: zeros(`l${l}.b2`, d, useMlp),
        g1: ones(`l${l}.g1`, d),
        bn1: zeros(`l${l}.bn1`, d),
        g2: ones(`l${l}.g2`, d, useMlp),
        bn2: zeros(`l${l}.bn2`, d, useMlp),
      });
    }
    this.gf = ones('gf', d);
    this.bf = zeros('bf', d);
    this.wu = mk('wu', d, vocab, 1 / Math.sqrt(d));

    this.pe = positionalEncoding(n, d);

    for (let l = 0; l < layers; l++) {
      this.caches.push({
        xIn: new Float64Array(n * d),
        ln1: new Float64Array(n * d),
        ln1rstd: new Float64Array(n),
        q: new Float64Array(n * d),
        k: new Float64Array(n * d),
        v: new Float64Array(n * d),
        probs: new Float64Array(cfg.heads * n * n),
        ctx: new Float64Array(n * d),
        xMid: new Float64Array(n * d),
        ln2: new Float64Array(n * d),
        ln2rstd: new Float64Array(n),
        ff: new Float64Array(n * dFF),
        ffPre: new Float64Array(n * dFF),
        xOut: new Float64Array(n * d),
      });
    }
    this.xFinal = new Float64Array(n * d);
    this.lnF = new Float64Array(n * d);
    this.lnFrstd = new Float64Array(n);
    this.logits = new Float64Array(n * vocab);
    this.probs = new Float64Array(n * vocab);
    this.dBuf = new Float64Array(n * Math.max(d, dFF));
    this.dBuf2 = new Float64Array(n * Math.max(d, dFF));
  }

  /** Attention weights for a layer/head after the last forward, [n, n]. */
  attention(layer: number, head: number): Float64Array {
    const n = seqLen(this.cfg);
    const c = this.caches[layer];
    return c.probs.subarray(head * n * n, (head + 1) * n * n);
  }

  /** [seq, vocab] next-token distribution from the last forward. */
  probs2d(): Float64Array {
    return this.probs;
  }

  /**
   * The queries, keys and values a layer computed, [n, dModel] with the heads
   * packed side by side along each row. Head h owns columns
   * `h*headDim .. (h+1)*headDim`.
   *
   * The laws gate needs these to measure the scale of q·k on the real model —
   * the softmax has already destroyed the logits by the time attention() can
   * be read, and re-deriving them from the probabilities is not the same
   * measurement.
   */
  qkv(layer: number): { q: Float64Array; k: Float64Array; v: Float64Array } {
    const c = this.caches[layer];
    return { q: c.q, k: c.k, v: c.v };
  }

  /** The residual stream after a given block, [n, dModel]. */
  residual(layer: number): Float64Array {
    return this.caches[layer].xOut;
  }

  // ------------------------------------------------------------- forward

  /**
   * @param scale multiplies the pre-softmax logits. 1 is the trained model.
   *        Setting it to `sqrt(headDim)` cancels the divisor, which is what
   *        the app's switch does — the model was trained scaled and the point
   *        is to watch what the same numbers look like when it is not.
   */
  forward(s: Sample, scale = 1): Forward {
    const c = this.cfg;
    const n = seqLen(c);
    const d = c.dModel;
    const dh = headDim(c);
    const invSqrt = (1 / Math.sqrt(dh)) * scale;

    // embed + position
    let x = this.caches[0].xIn;
    for (let t = 0; t < n; t++) {
      const e = s.tokens[t] * d;
      for (let j = 0; j < d; j++) x[t * d + j] = this.wemb.data[e + j] + this.pe[t * d + j];
    }

    for (let l = 0; l < c.layers; l++) {
      const L = this.layers[l];
      const ca = this.caches[l];
      if (l > 0) ca.xIn.set(this.caches[l - 1].xOut);
      x = ca.xIn;

      layerNorm(x, L.g1.data, L.bn1.data, ca.ln1, ca.ln1rstd, n, d);
      matmul(ca.ln1, L.wq.data, ca.q, n, d, d);
      matmul(ca.ln1, L.wk.data, ca.k, n, d, d);
      matmul(ca.ln1, L.wv.data, ca.v, n, d, d);

      ca.ctx.fill(0);
      for (let h = 0; h < c.heads; h++) {
        const off = h * dh;
        const pBase = h * n * n;
        for (let i = 0; i < n; i++) {
          // CAUSAL. j runs to i, not to n. Everything past the diagonal is
          // not masked to a large negative number here — it is simply never
          // computed, and the probs array keeps the zeros it was filled with.
          let max = -Infinity;
          const row = pBase + i * n;
          for (let j = 0; j <= i; j++) {
            let dot = 0;
            for (let m = 0; m < dh; m++) dot += ca.q[i * d + off + m] * ca.k[j * d + off + m];
            const sc = dot * invSqrt;
            ca.probs[row + j] = sc;
            if (sc > max) max = sc;
          }
          let sum = 0;
          for (let j = 0; j <= i; j++) {
            const e = Math.exp(ca.probs[row + j] - max);
            ca.probs[row + j] = e;
            sum += e;
          }
          const inv = 1 / sum;
          for (let j = 0; j <= i; j++) ca.probs[row + j] *= inv;
          for (let j = i + 1; j < n; j++) ca.probs[row + j] = 0;
          for (let j = 0; j <= i; j++) {
            const p = ca.probs[row + j];
            if (p === 0) continue;
            for (let m = 0; m < dh; m++) ca.ctx[i * d + off + m] += p * ca.v[j * d + off + m];
          }
        }
      }

      const proj = this.dBuf.subarray(0, n * d);
      matmul(ca.ctx, L.wo.data, proj, n, d, d);
      for (let i = 0; i < n * d; i++) ca.xMid[i] = x[i] + proj[i];

      if (!c.mlp) {
        // Attention-only: the block is just the attention write-back, and the
        // residual stream carries on unchanged. See `Config.mlp`.
        ca.xOut.set(ca.xMid);
        continue;
      }

      layerNorm(ca.xMid, L.g2.data, L.bn2.data, ca.ln2, ca.ln2rstd, n, d);
      matmul(ca.ln2, L.w1.data, ca.ffPre, n, d, c.dFF);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < c.dFF; j++) {
          const idx = i * c.dFF + j;
          const val = ca.ffPre[idx] + L.b1.data[j];
          ca.ffPre[idx] = val;
          ca.ff[idx] = gelu(val);
        }
      }
      const ffOut = this.dBuf2.subarray(0, n * d);
      matmul(ca.ff, L.w2.data, ffOut, n, c.dFF, d);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < d; j++) {
          const idx = i * d + j;
          ca.xOut[idx] = ca.xMid[idx] + ffOut[idx] + L.b2.data[j];
        }
      }
    }

    this.xFinal.set(this.caches[c.layers - 1].xOut);
    layerNorm(this.xFinal, this.gf.data, this.bf.data, this.lnF, this.lnFrstd, n, d);
    matmul(this.lnF, this.wu.data, this.logits, n, d, c.vocab);

    // softmax + cross-entropy over the n-1 scored positions
    let loss = 0;
    let lossA = 0;
    let lossB = 0;
    let countA = 0;
    let countB = 0;
    for (let t = 0; t < n - 1; t++) {
      const o = t * c.vocab;
      let max = -Infinity;
      for (let j = 0; j < c.vocab; j++) if (this.logits[o + j] > max) max = this.logits[o + j];
      let sum = 0;
      for (let j = 0; j < c.vocab; j++) {
        const e = Math.exp(this.logits[o + j] - max);
        this.probs[o + j] = e;
        sum += e;
      }
      const inv = 1 / sum;
      for (let j = 0; j < c.vocab; j++) this.probs[o + j] *= inv;
      const nll = -Math.log(Math.max(1e-12, this.probs[o + s.targets[t]]));
      loss += nll;
      // The split is at `period`: from there on, the symbol under the query
      // has occurred before, so its successor is knowable. Before it, it has
      // not, and no mechanism can do better than the prior.
      if (t < s.period) {
        lossA += nll;
        countA++;
      } else {
        lossB += nll;
        countB++;
      }
    }
    return {
      probs: this.probs,
      loss: loss / (n - 1),
      lossCold: countA ? lossA / countA : 0,
      lossRepeat: countB ? lossB / countB : 0,
    };
  }

  // ------------------------------------------------------------ backward

  /** Accumulates into `param.grad`. Call `zeroGrad` before a batch. */
  backward(s: Sample, scaleByCount = 1): void {
    const c = this.cfg;
    const n = seqLen(c);
    const d = c.dModel;
    const dh = headDim(c);
    const invSqrt = 1 / Math.sqrt(dh);
    const norm = 1 / ((n - 1) * scaleByCount);

    // d/dlogits of mean cross-entropy
    const dLogits = new Float64Array(n * c.vocab);
    for (let t = 0; t < n - 1; t++) {
      const o = t * c.vocab;
      for (let j = 0; j < c.vocab; j++) dLogits[o + j] = this.probs[o + j] * norm;
      dLogits[o + s.targets[t]] -= norm;
    }

    const dLnF = new Float64Array(n * d);
    matmulBackward(this.lnF, this.wu.data, dLogits, dLnF, this.wu.grad, n, d, c.vocab);

    let dX = new Float64Array(n * d);
    layerNormBackward(
      dLnF, this.lnF, this.gf.data, this.bf.data, this.lnFrstd,
      dX, this.gf.grad, this.bf.grad, n, d,
    );

    for (let l = c.layers - 1; l >= 0; l--) {
      const L = this.layers[l];
      const ca = this.caches[l];

      // --- MLP branch (residual: dxMid gets dX directly, plus via the MLP)
      const dFFout = dX; // xOut = xMid + ffOut + b2
      const dXMid = new Float64Array(n * d);
      dXMid.set(dFFout); // the residual path around the MLP
      if (c.mlp) {
        for (let i = 0; i < n; i++)
          for (let j = 0; j < d; j++) L.b2.grad[j] += dFFout[i * d + j];

        const dFF = new Float64Array(n * c.dFF);
        matmulBackward(ca.ff, L.w2.data, dFFout, dFF, L.w2.grad, n, c.dFF, d);
        for (let i = 0; i < n * c.dFF; i++) dFF[i] *= geluPrime(ca.ffPre[i]);
        for (let i = 0; i < n; i++)
          for (let j = 0; j < c.dFF; j++) L.b1.grad[j] += dFF[i * c.dFF + j];

        const dLn2 = new Float64Array(n * d);
        matmulBackward(ca.ln2, L.w1.data, dFF, dLn2, L.w1.grad, n, d, c.dFF);
        layerNormBackward(
          dLn2, ca.ln2, L.g2.data, L.bn2.data, ca.ln2rstd,
          dXMid, L.g2.grad, L.bn2.grad, n, d,
        );
      }

      // --- attention branch
      const dCtx = new Float64Array(n * d);
      matmulBackward(ca.ctx, L.wo.data, dXMid, dCtx, L.wo.grad, n, d, d);

      const dQ = new Float64Array(n * d);
      const dK = new Float64Array(n * d);
      const dV = new Float64Array(n * d);
      const dP = new Float64Array(n); // one row of dL/dprob at a time

      for (let h = 0; h < c.heads; h++) {
        const off = h * dh;
        const pBase = h * n * n;
        for (let i = 0; i < n; i++) {
          const row = pBase + i * n;
          // ctx_i = sum_j p_ij v_j
          for (let j = 0; j <= i; j++) {
            let acc = 0;
            const p = ca.probs[row + j];
            for (let m = 0; m < dh; m++) {
              const g = dCtx[i * d + off + m];
              acc += g * ca.v[j * d + off + m];
              dV[j * d + off + m] += p * g;
            }
            dP[j] = acc;
          }
          // softmax jacobian, restricted to the unmasked prefix
          let dot = 0;
          for (let j = 0; j <= i; j++) dot += dP[j] * ca.probs[row + j];
          for (let j = 0; j <= i; j++) {
            const dScore = ca.probs[row + j] * (dP[j] - dot) * invSqrt;
            if (dScore === 0) continue;
            for (let m = 0; m < dh; m++) {
              dQ[i * d + off + m] += dScore * ca.k[j * d + off + m];
              dK[j * d + off + m] += dScore * ca.q[i * d + off + m];
            }
          }
        }
      }

      const dLn1 = new Float64Array(n * d);
      matmulBackward(ca.ln1, L.wq.data, dQ, dLn1, L.wq.grad, n, d, d);
      matmulBackward(ca.ln1, L.wk.data, dK, dLn1, L.wk.grad, n, d, d);
      matmulBackward(ca.ln1, L.wv.data, dV, dLn1, L.wv.grad, n, d, d);

      const dXIn = new Float64Array(n * d);
      dXIn.set(dXMid); // the residual path around attention
      layerNormBackward(
        dLn1, ca.ln1, L.g1.data, L.bn1.data, ca.ln1rstd,
        dXIn, L.g1.grad, L.bn1.grad, n, d,
      );

      dX = dXIn;
    }

    // embedding: the position table is fixed, so only the token rows learn
    for (let t = 0; t < n; t++) {
      const e = s.tokens[t] * d;
      for (let j = 0; j < d; j++) this.wemb.grad[e + j] += dX[t * d + j];
    }
  }

  zeroGrad(): void {
    for (const p of this.params) p.grad.fill(0);
  }

  /** Adam, with the 2014 defaults and no schedule. */
  adam(lr = this.cfg.lr): void {
    this.step++;
    const b1 = 0.9;
    const b2 = 0.999;
    const eps = 1e-8;
    const c1 = 1 - Math.pow(b1, this.step);
    const c2 = 1 - Math.pow(b2, this.step);
    for (const p of this.params) {
      for (let i = 0; i < p.data.length; i++) {
        const g = p.grad[i];
        p.m[i] = b1 * p.m[i] + (1 - b1) * g;
        p.v[i] = b2 * p.v[i] + (1 - b2) * g * g;
        p.data[i] -= (lr * (p.m[i] / c1)) / (Math.sqrt(p.v[i] / c2) + eps);
      }
    }
  }

  /** One optimiser step over a fresh batch. Returns the batch means. */
  trainStep(rng: Rng): Forward & { samples: Sample[] } {
    const c = this.cfg;
    this.zeroGrad();
    let loss = 0;
    let a = 0;
    let b = 0;
    const samples: Sample[] = [];
    for (let i = 0; i < c.batch; i++) {
      const s = sample(c, rng);
      samples.push(s);
      const f = this.forward(s);
      loss += f.loss;
      a += f.lossCold;
      b += f.lossRepeat;
      this.backward(s, c.batch);
    }
    this.adam();
    return {
      probs: this.probs,
      loss: loss / c.batch,
      lossCold: a / c.batch,
      lossRepeat: b / c.batch,
      samples,
    };
  }

  /** Mean losses over fresh sequences, without touching the parameters. */
  evaluate(rng: Rng, n = 32): Forward {
    let loss = 0;
    let a = 0;
    let b = 0;
    for (let i = 0; i < n; i++) {
      const f = this.forward(sample(this.cfg, rng));
      loss += f.loss;
      a += f.lossCold;
      b += f.lossRepeat;
    }
    return { probs: this.probs, loss: loss / n, lossCold: a / n, lossRepeat: b / n };
  }
}

// -------------------------------------------------------------- positions

/**
 * The 2017 sinusoidal table: for each pair of channels, one sine and one
 * cosine of the position, at a wavelength that grows geometrically from 2π to
 * 10000·2π across the width.
 *
 * The reason it is a pair per frequency and not a single sine is the property
 * the paper hypothesises: because (sin, cos) at a fixed frequency is a point
 * on a circle, advancing the position by k ROTATES that point by a fixed
 * angle, independent of where it started. So relative offset is a linear map,
 * and PE(pos)·PE(pos+k) depends only on k. The gate measures exactly that.
 */
export function positionalEncoding(n: number, d: number): Float64Array {
  const pe = new Float64Array(n * d);
  for (let pos = 0; pos < n; pos++) {
    for (let i = 0; i < d; i += 2) {
      const w = 1 / Math.pow(10000, i / d);
      pe[pos * d + i] = Math.sin(pos * w);
      if (i + 1 < d) pe[pos * d + i + 1] = Math.cos(pos * w);
    }
  }
  return pe;
}

// ------------------------------------------------------------ measurements

/** Shannon entropy of one attention row, in BITS. */
export function rowEntropy(p: Float64Array, from: number, count: number): number {
  let h = 0;
  for (let j = 0; j < count; j++) {
    const v = p[from + j];
    if (v > 1e-12) h -= v * Math.log2(v);
  }
  return h;
}

/**
 * How much of each query's attention lands on the two positions that matter.
 *
 * The symbol at position t last occurred at t - period. An INDUCTION head puts
 * its mass on the token AFTER that earlier occurrence — position t-period+1 —
 * because that is the symbol about to repeat. A PREVIOUS-TOKEN head instead
 * puts its mass on t-1, which is what lets a later head match on "what came
 * before you" at all.
 *
 * Both are measured so the two members of the circuit can be told apart. That
 * is the entire claim being made: this is not one head being clever, it is two
 * heads composing through the residual stream.
 *
 * `period` comes from the sample rather than the config, because it is drawn
 * fresh per sequence — which is exactly what stops a fixed positional offset
 * from impersonating induction here.
 */
export function circuitMass(
  probs: Float64Array,
  cfg: Config,
  s: Sample,
): { induction: number; previous: number; same: number } {
  const n = seqLen(cfg);
  let ind = 0;
  let prev = 0;
  let same = 0;
  let count = 0;
  for (let t = s.period; t < n; t++) {
    const row = t * n;
    // EVERY position whose predecessor matches the current symbol, not just
    // the nearest one. The line is tiled, so t-p+1, t-2p+1 and so on are all
    // correct induction targets and a head that spreads across them is doing
    // the job perfectly. Counting only the first undercounted a sharp head as
    // a diffuse one.
    for (let j = 1; j <= t; j++) {
      if (s.tokens[j - 1] === s.tokens[t]) ind += probs[row + j];
      if (s.tokens[j] === s.tokens[t] && j < t) same += probs[row + j];
    }
    prev += probs[row + (t - 1)];
    count++;
  }
  return { induction: ind / count, previous: prev / count, same: same / count };
}
