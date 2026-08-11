/**
 * The panel: the loss curve, the head scores, and the pair of numbers that
 * make the sqrt(d_k) switch mean something.
 *
 * The loss curve is a 2D canvas rather than geometry in the scene. A line
 * chart is not a 3D object and pretending otherwise costs legibility for
 * nothing — the 3D is carrying the part that genuinely has three axes.
 */
import type { Config } from './model';

export interface Point {
  step: number;
  cold: number;
  repeat: number;
}

export interface HeadScore {
  layer: number;
  head: number;
  induction: number;
  previous: number;
  colour: number;
}

const css = (n: number): string => `#${n.toString(16).padStart(6, '0')}`;

export class Panel {
  private plot: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private heads: HTMLElement;
  private stats: HTMLElement;
  private entropy: HTMLElement;
  private cfg: Config;
  /** ln(vocab): the loss of knowing nothing. Drawn as the ceiling. */
  private readonly chance: number;

  constructor(root: HTMLElement, cfg: Config) {
    this.cfg = cfg;
    this.chance = Math.log(cfg.vocab);
    this.plot = root.querySelector('#plot') as HTMLCanvasElement;
    this.ctx = this.plot.getContext('2d')!;
    this.heads = root.querySelector('#heads') as HTMLElement;
    this.stats = root.querySelector('#stats') as HTMLElement;
    this.entropy = root.querySelector('#entropy') as HTMLElement;
  }

  /**
   * Two curves, because one would hide the whole point.
   *
   * The total loss barely moves: most positions on the line are unguessable by
   * construction, so their loss is pinned at ln(vocab) forever and it drowns
   * everything else. Split out the positions where the symbol HAS occurred
   * before and the drop is a cliff.
   */
  drawCurve(history: Point[], step: number): void {
    const w = this.plot.width;
    const h = this.plot.height;
    const c = this.ctx;
    c.clearRect(0, 0, w, h);
    const pad = { l: 34, r: 8, t: 10, b: 18 };
    const iw = w - pad.l - pad.r;
    const ih = h - pad.t - pad.b;
    const top = this.chance * 1.15;
    const X = (s: number) => pad.l + (iw * s) / Math.max(1, step);
    const Y = (v: number) => pad.t + ih * (1 - Math.min(1, v / top));

    // The ceiling: no model can be more certain than the prior about a symbol
    // it has never seen.
    c.strokeStyle = 'rgba(255,255,255,0.22)';
    c.setLineDash([3, 3]);
    c.beginPath();
    c.moveTo(pad.l, Y(this.chance));
    c.lineTo(w - pad.r, Y(this.chance));
    c.stroke();
    c.setLineDash([]);
    c.fillStyle = 'rgba(255,255,255,0.45)';
    c.font = '10px ui-monospace, monospace';
    c.fillText(`ln V = ${this.chance.toFixed(2)}`, pad.l + 2, Y(this.chance) - 3);
    c.fillText('0', 14, h - pad.b);

    const line = (key: 'cold' | 'repeat', colour: string) => {
      c.strokeStyle = colour;
      c.lineWidth = 1.6;
      c.beginPath();
      history.forEach((p, i) => {
        const x = X(p.step);
        const y = Y(p[key]);
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      });
      c.stroke();
    };
    line('cold', 'rgba(147,166,173,0.85)');
    line('repeat', css(0x35c0ac));
  }

  /**
   * One row per head, scored on the two behaviours the circuit is made of.
   *
   * Both bars are drawn against what a UNIFORM head would score on the same
   * data — a head that attends to nothing in particular still lands some mass
   * on the right key by luck, and without that mark on the bar a diffuse head
   * reads as a weak version of a sharp one.
   */
  drawHeads(scores: HeadScore[], chance: { induction: number; previous: number }): void {
    const bar = (v: number, ch: number, colour: number) => {
      const pct = Math.min(100, v * 100);
      const mark = Math.min(100, ch * 100);
      return (
        `<span class="bar"><i style="width:${pct}%;background:${css(colour)}"></i>` +
        `<u style="left:${mark}%"></u></span>`
      );
    };
    // Each metric is its own flex row. This was a two-column grid, and the
    // bars auto-placed into the 34-pixel label column because only the label
    // and the number had been given an explicit `grid-column` — so a head at
    // 0.98 drew the same three-pixel stub as a head at 0.00.
    const metric = (label: string, v: number, ch: number, colour: number) =>
      `<div class="metric"><span class="lab">${label}</span>` +
      bar(v, ch, colour) +
      `<span class="num">${v.toFixed(2)}</span></div>`;

    this.heads.innerHTML = scores
      .map((s) => {
        const role =
          s.induction > 0.5 ? 'induction' : s.previous > 0.5 ? 'previous-token' : '';
        return (
          `<div class="head${role ? ' named' : ''}">` +
          `<div class="hrow"><b style="color:${css(s.colour)}">L${s.layer}H${s.head}</b>` +
          `<span class="role">${role}</span></div>` +
          metric('ind', s.induction, chance.induction, s.colour) +
          metric('prev', s.previous, chance.previous, 0x93a6ad) +
          `</div>`
        );
      })
      .join('');
  }

  setStats(step: number, cold: number, repeat: number, secs: number): void {
    this.stats.innerHTML =
      `<span><b>${step}</b> steps</span>` +
      `<span>cold <b>${cold.toFixed(2)}</b></span>` +
      `<span class="hi">repeat <b>${repeat < 0.01 ? repeat.toExponential(1) : repeat.toFixed(3)}</b></span>` +
      `<span>${secs.toFixed(0)}s</span>`;
  }

  /**
   * What the divisor is doing, right now, on the sequence on screen.
   *
   * Entropy in bits is the honest unit: a query choosing between k keys has at
   * most log2(k) bits of spread, and 0 bits is a hard argmax. Showing the
   * ceiling next to the value is what makes "the softmax saturated" legible
   * rather than just a small number.
   */
  setEntropy(bits: number, ceiling: number, scaled: boolean): void {
    const pct = ceiling > 0 ? Math.max(0, Math.min(1, bits / ceiling)) : 0;
    this.entropy.innerHTML =
      `<div class="g-row"><span class="g-lab">attention spread</span>` +
      `<span id="g-mm">${bits.toFixed(2)}</span><span class="g-unit">of ${ceiling.toFixed(2)} bits</span></div>` +
      `<div class="g-bar"><i style="width:${pct * 100}%;background:${scaled ? css(0x35c0ac) : css(0xd8543f)}"></i></div>` +
      `<div class="g-note">${
        scaled
          ? 'Logits divided by √d_head, as the paper derives. The distribution stays open.'
          : 'DIVISOR OFF. The dot products scale as √d_head, so the softmax saturates toward a hard argmax and the gradient with it.'
      }</div>`;
  }

  get vocab(): number {
    return this.cfg.vocab;
  }
}
