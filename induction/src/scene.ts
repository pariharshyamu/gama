/**
 * The stack, in three dimensions.
 *
 * A transformer has three independent axes and a diagram on paper can only
 * show two of them, which is the entire reason this thing is in 3D:
 *
 *     X   token position
 *     Y   how far an arc reaches (and which head drew it)
 *     Z   depth through the model
 *
 * So the model is laid out down Z — input row, layer 0, layer 1, output row —
 * with a residual bar running the whole length at every token position. That
 * bar is not decoration. Elhage et al. (2021) describe the residual stream as
 * a communication channel that every block reads from and writes back into,
 * and "two heads composing through a shared channel" is the one idea in the
 * architecture that is genuinely spatial.
 *
 * Attention is drawn as arcs from query to key. In 2D every head lands on top
 * of every other head and twelve patterns become mud; here each head gets its
 * own tilt around the token axis, so they can all be read at once.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  BoxGeometry,
} from 'three';
import { buildTextGeometry } from 'scena3d';
import type { Config, Sample, Transformer } from './model';
import { headDim, seqLen } from './model';

export const PALETTE = {
  bg: 0x0b1016,
  rail: 0x1b2836,
  tile: 0x243444,
  ink: 0xdfe9ef,
  label: 0x6d8797,
  /**
   * One colour per (layer, head), NOT per head.
   *
   * Colouring by head index alone gave layer 0 head 0 and layer 1 head 0 the
   * same teal, and since arcs from both layers bow up into the same airspace
   * there was then no way to tell which layer an arc belonged to — which is
   * the one thing the depth axis exists to show. The previous-token head and a
   * diffuse layer-1 head were the same colour in the first screenshot.
   */
  head: [0x35c0ac, 0xe8834f, 0x7f8fe0, 0xd8c24f],
  right: 0x35c0ac,
  wrong: 0xd8543f,
};

/** Token spacing along X, in world units. */
const STEP = 1.15;
/** Z of the input row, each layer, and the output row. */
const LAYER_GAP = 5;
const IN_Z = 0;
const OUT_PAD = 3.4;

/** Vocabulary symbols. Letters, because a reader can hold a letter in mind. */
export const SYMBOLS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * How an attention weight becomes brightness.
 *
 * Raw weight would be nearly invisible for everything but the peak: a row of
 * 16 keys averages 0.06, and 6% of full brightness is black. The gamma lifts
 * the mid-range without touching either end, and it is INVERTIBLE, which is
 * what lets the gate read the drawn colour back off the buffer and recover the
 * weight the model actually computed.
 */
const GAMMA = 0.6;
export const toIntensity = (w: number): number => Math.pow(Math.max(0, Math.min(1, w)), GAMMA);
export const fromIntensity = (i: number): number => Math.pow(Math.max(0, Math.min(1, i)), 1 / GAMMA);

/** Cap height of the row labels, in world units. */
const LABEL_SIZE = 0.42;

/** Points along one arc, in the plane tilted by `tilt` around the X axis. */
const ARC_SEGMENTS = 14;

interface HeadArcs {
  layer: number;
  head: number;
  mesh: LineSegments;
  colors: Float32Array;
  /** Arc a connects query `qs[a]` to key `ks[a]`. */
  qs: Int32Array;
  ks: Int32Array;
  /** First vertex index of arc a in the buffer. */
  starts: Int32Array;
  vertsPerArc: number;
}

export class Stack {
  readonly group = new Group();
  private cfg: Config;
  private arcs: HeadArcs[] = [];
  private glyphs: BufferGeometry[] = [];
  private inRow: Mesh[] = [];
  private outRow: Mesh[] = [];
  private outMat: MeshStandardMaterial[] = [];
  private width: number;

  constructor(cfg: Config) {
    this.cfg = cfg;
    const n = seqLen(cfg);
    this.width = (n - 1) * STEP;
    const outZ = IN_Z + LAYER_GAP * cfg.layers + OUT_PAD;

    // One glyph geometry per symbol, built once and shared. Rebuilding text
    // every time a prediction changes would allocate on every frame.
    for (let v = 0; v < cfg.vocab; v++) {
      this.glyphs.push(buildTextGeometry(SYMBOLS[v], { size: 0.52, depth: 0.1 }).geometry);
    }

    this.buildRails(outZ);
    this.buildRows(outZ);
    this.buildLabels(outZ);
    for (let l = 0; l < cfg.layers; l++) {
      for (let h = 0; h < cfg.heads; h++) this.arcs.push(this.buildArcs(l, h));
    }
  }

  private x(i: number): number {
    return i * STEP - this.width / 2;
  }

  private zOf(layer: number): number {
    return IN_Z + LAYER_GAP * (layer + 1);
  }

  /** The residual stream: one bar per token, running the length of the model. */
  private buildRails(outZ: number): void {
    const n = seqLen(this.cfg);
    const mat = new MeshStandardMaterial({
      color: PALETTE.rail,
      roughness: 0.85,
      metalness: 0.05,
      emissive: new Color(PALETTE.rail).multiplyScalar(0.25),
    });
    const length = outZ - IN_Z + 1.2;
    const geo = new BoxGeometry(0.34, 0.09, length);
    for (let i = 0; i < n; i++) {
      const bar = new Mesh(geo, mat);
      bar.position.set(this.x(i), -0.12, IN_Z + length / 2 - 0.6);
      this.group.add(bar);
    }
    // A dim floor so the arcs have something to sit above.
    const floor = new Mesh(
      new PlaneGeometry(this.width + 4, length + 4),
      new MeshStandardMaterial({ color: PALETTE.bg, roughness: 1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.45, IN_Z + length / 2 - 0.6);
    this.group.add(floor);
  }

  /** Lettered tiles at the input, and a prediction tile at the output. */
  private buildRows(outZ: number): void {
    const n = seqLen(this.cfg);
    const tileGeo = new BoxGeometry(0.82, 0.16, 0.82);
    const tileMat = new MeshStandardMaterial({ color: PALETTE.tile, roughness: 0.8 });
    const inkMat = new MeshStandardMaterial({
      color: PALETTE.ink,
      emissive: new Color(PALETTE.ink).multiplyScalar(0.55),
      roughness: 0.5,
    });

    for (let i = 0; i < n; i++) {
      const tile = new Mesh(tileGeo, tileMat);
      tile.position.set(this.x(i), 0, IN_Z);
      this.group.add(tile);
      const letter = new Mesh(this.glyphs[0], inkMat);
      letter.position.set(this.x(i), 0.1, IN_Z);
      letter.rotation.x = -Math.PI / 2;
      this.group.add(letter);
      this.inRow.push(letter);

      // Small pads under each layer so the arcs visibly land on a position.
      for (let l = 0; l < this.cfg.layers; l++) {
        const pad = new Mesh(new BoxGeometry(0.5, 0.1, 0.5), tileMat);
        pad.position.set(this.x(i), 0, this.zOf(l));
        this.group.add(pad);
      }

      const outTile = new Mesh(tileGeo, tileMat);
      outTile.position.set(this.x(i), 0, outZ);
      this.group.add(outTile);
      const mat = inkMat.clone();
      this.outMat.push(mat);
      const pred = new Mesh(this.glyphs[0], mat);
      pred.position.set(this.x(i), 0.1, outZ);
      pred.rotation.x = -Math.PI / 2;
      this.group.add(pred);
      this.outRow.push(pred);
    }
  }

  /**
   * Name the rows: TOKENS, LAYER 0, LAYER 1, PREDICTS.
   *
   * Without these the board is four identical rows of tiles and there is no
   * way to tell which arcs belong to which layer — which is the one thing the
   * depth axis exists to show. The first screenshot had a perfect circuit in
   * it and no way to see that the previous-token head was in the near row and
   * the induction head in the far one.
   */
  private buildLabels(outZ: number): void {
    const mat = new MeshStandardMaterial({
      color: PALETTE.label,
      emissive: new Color(PALETTE.label).multiplyScalar(0.5),
      roughness: 0.6,
    });
    const at = (text: string, z: number) => {
      const t = buildTextGeometry(text, { size: LABEL_SIZE, depth: 0.05, align: 'right' });
      const m = new Mesh(t.geometry, mat);
      m.position.set(-this.width / 2 - 1.1, 0.02, z);
      m.rotation.x = -Math.PI / 2;
      this.group.add(m);
    };
    at('TOKENS', IN_Z);
    for (let l = 0; l < this.cfg.layers; l++) at(`LAYER ${l}`, this.zOf(l));
    at('PREDICTS', outZ);
  }

  /**
   * Every causal (query, key) pair for one head, as one LineSegments.
   *
   * Positions never change — an arc from token 9 to token 3 is the same curve
   * whatever the weights are — so the geometry is built once and only the
   * colour buffer is rewritten. That is what makes a refresh cheap enough to
   * run while the model is training.
   */
  private buildArcs(layer: number, head: number): HeadArcs {
    const n = seqLen(this.cfg);
    const spread = 0.55;
    const tilt = (head - (this.cfg.heads - 1) / 2) * spread;
    const z = this.zOf(layer);

    const pairs: Array<[number, number]> = [];
    for (let q = 0; q < n; q++) for (let k = 0; k <= q; k++) pairs.push([q, k]);

    const vertsPerArc = ARC_SEGMENTS * 2; // LineSegments: two ends per segment
    const pos = new Float32Array(pairs.length * vertsPerArc * 3);
    const colors = new Float32Array(pairs.length * vertsPerArc * 3);
    const qs = new Int32Array(pairs.length);
    const ks = new Int32Array(pairs.length);
    const starts = new Int32Array(pairs.length);

    const cy = Math.cos(tilt);
    const cz = Math.sin(tilt);
    let v = 0;
    for (let a = 0; a < pairs.length; a++) {
      const [q, k] = pairs[a];
      qs[a] = q;
      ks[a] = k;
      starts[a] = v;
      const x0 = this.x(k);
      const x1 = this.x(q);
      // A self-loop (q === k, which position 0 always is) has nowhere to go,
      // so give it a small fixed bump rather than a zero-height degenerate arc.
      const reach = Math.abs(x1 - x0);
      const rise = 0.32 + reach * 0.42;
      const at = (t: number): [number, number, number] => {
        const x = x0 + (x1 - x0) * t;
        const bow = Math.sin(Math.PI * t) * rise;
        return [x, 0.08 + bow * cy, z + bow * cz];
      };
      for (let s = 0; s < ARC_SEGMENTS; s++) {
        const p0 = at(s / ARC_SEGMENTS);
        const p1 = at((s + 1) / ARC_SEGMENTS);
        pos[v * 3] = p0[0];
        pos[v * 3 + 1] = p0[1];
        pos[v * 3 + 2] = p0[2];
        v++;
        pos[v * 3] = p1[0];
        pos[v * 3 + 1] = p1[1];
        pos[v * 3 + 2] = p1[2];
        v++;
      }
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(pos, 3));
    geo.setAttribute('color', new BufferAttribute(colors, 3));
    const mesh = new LineSegments(
      geo,
      new LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.group.add(mesh);
    return { layer, head, mesh, colors, qs, ks, starts, vertsPerArc };
  }

  /** Point the input row at a sequence. */
  setSample(s: Sample): void {
    for (let i = 0; i < this.inRow.length; i++) {
      this.inRow[i].geometry = this.glyphs[s.tokens[i]];
    }
  }

  /**
   * Repaint every arc from the model's CURRENT attention, and the output row
   * from its current prediction.
   *
   * `model.forward(s, scale)` must already have run — this reads the caches it
   * filled, so the picture cannot drift from the numbers.
   */
  refresh(model: Transformer, s: Sample): void {
    const n = seqLen(this.cfg);
    for (const a of this.arcs) {
      const probs = model.attention(a.layer, a.head);
      const base = new Color(this.headColour(a.layer, a.head));
      for (let i = 0; i < a.qs.length; i++) {
        const w = probs[a.qs[i] * n + a.ks[i]];
        const t = toIntensity(w);
        const r = base.r * t;
        const g = base.g * t;
        const b = base.b * t;
        const from = a.starts[i] * 3;
        for (let v = 0; v < a.vertsPerArc; v++) {
          a.colors[from + v * 3] = r;
          a.colors[from + v * 3 + 1] = g;
          a.colors[from + v * 3 + 2] = b;
        }
      }
      (a.mesh.geometry.getAttribute('color') as BufferAttribute).needsUpdate = true;
    }

    const probs = model.probs2d();
    for (let t = 0; t < n; t++) {
      if (t >= n - 1) {
        this.outRow[t].visible = false;
        continue;
      }
      this.outRow[t].visible = true;
      let best = 0;
      for (let vv = 1; vv < this.cfg.vocab; vv++) {
        if (probs[t * this.cfg.vocab + vv] > probs[t * this.cfg.vocab + best]) best = vv;
      }
      this.outRow[t].geometry = this.glyphs[best];
      // Green when the argmax is right, red when it is wrong — and dimmed for
      // the cold positions, where being wrong is the correct behaviour.
      const right = best === s.targets[t];
      const cold = t < s.period;
      const col = new Color(right ? PALETTE.right : PALETTE.wrong);
      this.outMat[t].color.copy(col);
      this.outMat[t].emissive.copy(col).multiplyScalar(cold ? 0.12 : 0.5);
      this.outMat[t].opacity = cold ? 0.5 : 1;
      this.outMat[t].transparent = cold;
    }
  }

  /**
   * What weight is each arc actually DRAWN with, recovered from the colour
   * buffer the renderer will read.
   *
   * This exists for the gate. An arc diagram that renders *a* distribution
   * rather than *the* distribution the model computed would look completely
   * convincing, so the gate compares this against a fresh forward pass instead
   * of trusting that `refresh` was called with the right numbers.
   */
  readback(layer: number, head: number): { q: number; k: number; w: number }[] {
    const a = this.arcs.find((x) => x.layer === layer && x.head === head);
    if (!a) return [];
    const base = new Color(this.headColour(layer, head));
    // Read the largest channel: the smallest is worst-conditioned for the
    // divide, and for a saturated palette colour it can be near zero.
    const channel = base.r >= base.g && base.r >= base.b ? 0 : base.g >= base.b ? 1 : 2;
    const scale = channel === 0 ? base.r : channel === 1 ? base.g : base.b;
    const drawn = (a.mesh.geometry.getAttribute('color') as BufferAttribute).array as Float32Array;
    const out: { q: number; k: number; w: number }[] = [];
    for (let i = 0; i < a.qs.length; i++) {
      const c = drawn[a.starts[i] * 3 + channel];
      out.push({ q: a.qs[i], k: a.ks[i], w: fromIntensity(c / scale) });
    }
    return out;
  }

  /**
   * Where to point a camera, and how much room to leave.
   *
   * The row labels hang off the left end, so the board is NOT what has to fit
   * in frame — the board plus the labels is. Framing on the board alone put
   * "PREDICTS" half off the bottom-left corner.
   */
  private get labelOverhang(): number {
    return 1.1 + LABEL_SIZE * 5.5; // the longest label is PREDICTS, eight glyphs
  }

  get centre(): [number, number, number] {
    return [
      -this.labelOverhang / 2,
      0.6,
      IN_Z + (LAYER_GAP * this.cfg.layers + OUT_PAD) / 2,
    ];
  }

  get span(): number {
    return Math.max(this.width + this.labelOverhang, LAYER_GAP * this.cfg.layers + OUT_PAD);
  }

  /** Used by the HUD to label the heads it is scoring. */
  get headCount(): number {
    return this.cfg.heads;
  }

  headColour(layer: number, head: number): number {
    return PALETTE.head[(layer * this.cfg.heads + head) % PALETTE.head.length];
  }
}

/** Attention row entropy in bits, and the maximum a row of that width allows. */
export function entropyBits(probs: Float64Array, n: number, query: number): number {
  let h = 0;
  for (let j = 0; j <= query; j++) {
    const v = probs[query * n + j];
    if (v > 1e-12) h -= v * Math.log2(v);
  }
  return h;
}

export const maxEntropyBits = (query: number): number => Math.log2(query + 1);

/**
 * Mean attention spread across the whole stack, in bits, with the ceiling that
 * the causal mask allows.
 *
 * This started as the entropy of one head — the last one, which is the
 * induction head — and that was useless the moment the model trained. A sharp
 * head is already at 0.12 bits, so turning the divisor off moved it to 0.00 and
 * the switch looked like it did nothing. The claim being made is about
 * attention in general, so the number has to be about attention in general.
 *
 * Query 0 is excluded: it can only attend to itself, so it is 0 bits under
 * every possible model and averaging it in only drags the scale down.
 */
export function meanEntropy(
  attention: (layer: number, head: number) => Float64Array,
  cfg: Config,
): { bits: number; ceiling: number } {
  const n = seqLen(cfg);
  let bits = 0;
  let ceiling = 0;
  let count = 0;
  for (let l = 0; l < cfg.layers; l++) {
    for (let h = 0; h < cfg.heads; h++) {
      const p = attention(l, h);
      for (let q = 1; q < n; q++) {
        bits += entropyBits(p, n, q);
        ceiling += maxEntropyBits(q);
        count++;
      }
    }
  }
  return count ? { bits: bits / count, ceiling: ceiling / count } : { bits: 0, ceiling: 0 };
}

export const headDimOf = headDim;
