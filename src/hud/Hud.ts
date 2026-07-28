/**
 * Hud — the game's words, drawn over the game's world.
 *
 * A DOM overlay, deliberately: text wants the text engine. No textures, no
 * SDF fonts, no packages — a handful of absolutely-positioned elements with
 * inline styles, which means it works over any renderer and costs nothing
 * when nothing changes. Everything is driven, not scheduled: banners and
 * captions age in `update(dt)`, so a paused game pauses its HUD with it.
 *
 * ```ts
 * const hud = new Hud();
 * hud.score(1250);
 * hud.hearts(3, 5);
 * hud.banner('LAP 2/3');
 * hud.prompt('Press E to open');          // null hides
 * sounds.onCaption((c) => hud.caption(`♪ ${c.text}`));
 *
 * const radar = hud.radar({ range: 40 });
 * game.onUpdate((t) => {
 *   radar.set(blips, hero.position, heading);
 *   hud.update(t.delta);
 * });
 * ```
 *
 * For tests (or exotic embeddings) the document is injectable — the whole
 * HUD builds against anything that can `createElement`.
 */

export interface HudOptions {
  /** Document to build into. Default: the page's. */
  document?: Document;
  /** Element to mount on. Default: document.body. */
  parent?: HTMLElement;
  /** Accent colour for fills and blips. Default '#60a5fa'. */
  accent?: string;
}

export interface RadarBlip {
  x: number;
  z: number;
  /** Colour group — looked up in the radar's `colors` map. */
  kind?: string;
}

export interface RadarOptions {
  /** Diameter in CSS pixels. Default 140. */
  size?: number;
  /** World metres from centre to rim. Default 40. */
  range?: number;
  /** Blip colours by kind; `default` covers the rest. */
  colors?: Record<string, string>;
}

export interface Radar {
  element: HTMLElement;
  /**
   * Redraw around `center`. Pass `heading` (radians, the facing's world-Y
   * angle) for heading-up rotation; omit it for north-up.
   */
  set(blips: readonly RadarBlip[], center: { x: number; z: number }, heading?: number): void;
  dispose(): void;
}

const FONT = "600 14px/1.4 system-ui, -apple-system, sans-serif";
const SHADOW = 'text-shadow: 0 1px 3px rgba(0,0,0,0.7);';

export class Hud {
  readonly root: HTMLElement;
  private readonly doc: Document;
  private readonly accent: string;
  private readonly scoreEl: HTMLElement;
  private readonly timerEl: HTMLElement;
  private readonly lapEl: HTMLElement;
  private readonly heartsEl: HTMLElement;
  private readonly bannerEl: HTMLElement;
  private readonly objectiveEl: HTMLElement;
  private readonly promptEl: HTMLElement;
  private readonly captionEl: HTMLElement;
  private bannerLeft = 0;
  private bannerTotal = 0;
  private captionLeft = 0;
  private radars: Radar[] = [];

  constructor(options: HudOptions = {}) {
    const doc =
      options.document ??
      (typeof document === 'undefined' ? null : document);
    if (!doc) {
      throw new Error('Hud: no document in this environment — pass one in options.');
    }
    this.doc = doc;
    this.accent = options.accent ?? '#60a5fa';

    this.root = doc.createElement('div');
    this.root.style.cssText =
      'position:fixed;inset:0;pointer-events:none;z-index:10;color:#eef2f7;' +
      `font:${FONT};`;

    const make = (css: string): HTMLElement => {
      const el = doc.createElement('div');
      el.style.cssText = `position:absolute;${SHADOW}${css}`;
      this.root.appendChild(el);
      return el;
    };

    this.scoreEl = make('top:12px;left:14px;font-size:18px;letter-spacing:0.04em;');
    this.timerEl = make('top:12px;left:50%;transform:translateX(-50%);font-size:18px;font-variant-numeric:tabular-nums;');
    this.lapEl = make('top:36px;left:14px;opacity:0.85;');
    this.heartsEl = make('top:60px;left:14px;font-size:16px;letter-spacing:2px;');
    this.objectiveEl = make('top:12px;right:14px;max-width:20em;text-align:right;opacity:0.9;');
    this.bannerEl = make(
      'top:26%;left:50%;transform:translate(-50%,-50%);font-size:44px;font-weight:800;' +
      'letter-spacing:0.06em;opacity:0;transition:none;white-space:nowrap;'
    );
    this.promptEl = make(
      'bottom:16%;left:50%;transform:translateX(-50%);padding:6px 14px;border-radius:8px;' +
      'background:rgba(10,14,20,0.65);display:none;'
    );
    this.captionEl = make('bottom:14px;left:14px;font-family:ui-monospace,monospace;font-size:13px;opacity:0;');

    (options.parent ?? doc.body).appendChild(this.root);
  }

  /** The score, top-left. */
  score(value: number, label = 'SCORE'): void {
    this.scoreEl.textContent = `${label} ${Math.round(value)}`;
  }

  /** A clock, top-centre, as m:ss.t. Pass null to hide it. */
  timer(seconds: number | null): void {
    if (seconds === null || !Number.isFinite(seconds)) {
      this.timerEl.textContent = '';
      return;
    }
    const s = Math.max(seconds, 0);
    const m = Math.floor(s / 60);
    const rest = s - m * 60;
    this.timerEl.textContent = `${m}:${rest < 10 ? '0' : ''}${rest.toFixed(1)}`;
  }

  /** Lap or round counter under the score. */
  lap(current: number, total: number, label = 'LAP'): void {
    this.lapEl.textContent = `${label} ${current}/${total}`;
  }

  /** A row of hearts: `current` filled out of `max`. */
  hearts(current: number, max: number): void {
    const full = Math.max(Math.min(Math.round(current), Math.round(max)), 0);
    const filled = '♥'.repeat(full);
    const hollow = '♡'.repeat(Math.max(Math.round(max) - full, 0));
    this.heartsEl.textContent = filled + hollow;
    this.heartsEl.style.color = full <= 1 ? '#ef6a6a' : this.accent;
  }

  /** The big centre announcement. Fades itself out in `update`. */
  banner(text: string, seconds = 2.2): void {
    this.bannerEl.textContent = text;
    this.bannerTotal = Math.max(seconds, 0.2);
    this.bannerLeft = this.bannerTotal;
    this.bannerEl.style.opacity = '1';
  }

  /** Standing objective, top-right. Pass null to clear. */
  objective(text: string | null): void {
    this.objectiveEl.textContent = text ?? '';
  }

  /** Contextual key hint, bottom-centre. Pass null to hide. */
  prompt(text: string | null): void {
    if (text) {
      this.promptEl.textContent = text;
      this.promptEl.style.display = 'block';
    } else {
      this.promptEl.style.display = 'none';
    }
  }

  /** One caption line, bottom-left — feed it Soundboard's caption stream. */
  caption(text: string, seconds = 3): void {
    this.captionEl.textContent = text;
    this.captionLeft = Math.max(seconds, 0.2);
    this.captionEl.style.opacity = '0.85';
  }

  /** Age banners and captions. Drive it with GAMEPLAY time, so pause pauses it. */
  update(dt: number): void {
    const step = Number.isFinite(dt) ? Math.max(dt, 0) : 0;
    if (this.bannerLeft > 0) {
      this.bannerLeft = Math.max(this.bannerLeft - step, 0);
      // Hold, then fade over the last 0.4 s.
      const fade = Math.min(this.bannerLeft / 0.4, 1);
      this.bannerEl.style.opacity = String(fade);
    }
    if (this.captionLeft > 0) {
      this.captionLeft = Math.max(this.captionLeft - step, 0);
      if (this.captionLeft === 0) this.captionEl.style.opacity = '0';
    }
  }

  /** A round minimap, bottom-right, drawn on a 2D canvas. */
  radar(options: RadarOptions = {}): Radar {
    const size = options.size ?? 140;
    const range = Math.max(options.range ?? 40, 1);
    const colors = options.colors ?? {};
    const fallback = colors.default ?? '#e8eef4';

    const wrap = this.doc.createElement('div');
    wrap.style.cssText =
      `position:absolute;bottom:14px;right:14px;width:${size}px;height:${size}px;` +
      'border-radius:50%;overflow:hidden;background:rgba(8,12,18,0.6);' +
      'box-shadow:0 0 0 2px rgba(255,255,255,0.25);';
    const canvas = this.doc.createElement('canvas') as HTMLCanvasElement;
    canvas.width = size * 2; // crisp on hidpi
    canvas.height = size * 2;
    canvas.style.cssText = 'width:100%;height:100%;';
    wrap.appendChild(canvas);
    this.root.appendChild(wrap);

    const radar: Radar = {
      element: wrap,
      set: (blips, center, heading) => {
        const ctx = canvas.getContext?.('2d');
        if (!ctx) return; // test fakes and exotic embeddings draw nothing
        const c = size; // centre in canvas px (2x scale)
        ctx.clearRect(0, 0, c * 2, c * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        for (const r of [0.5, 1]) {
          ctx.beginPath();
          ctx.arc(c, c, (c - 4) * r, 0, Math.PI * 2);
          ctx.stroke();
        }
        const rot = heading === undefined ? 0 : heading;
        const cos = Math.cos(rot);
        const sin = Math.sin(rot);
        for (const blip of blips) {
          const dx = blip.x - center.x;
          const dz = blip.z - center.z;
          // World → radar: rotate by heading so "up" is where we face.
          const rx = dx * cos - dz * sin;
          const rz = dx * sin + dz * cos;
          const px = c + (rx / range) * (c - 8);
          const py = c + (rz / range) * (c - 8);
          const inside = (px - c) ** 2 + (py - c) ** 2 <= (c - 6) ** 2;
          if (!inside) continue;
          ctx.fillStyle = (blip.kind && colors[blip.kind]) || fallback;
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        // The player: a wedge at centre, pointing up.
        ctx.fillStyle = this.accent;
        ctx.beginPath();
        ctx.moveTo(c, c - 9);
        ctx.lineTo(c - 6, c + 7);
        ctx.lineTo(c + 6, c + 7);
        ctx.closePath();
        ctx.fill();
      },
      dispose: () => {
        wrap.parentNode?.removeChild(wrap);
        this.radars = this.radars.filter((r) => r !== radar);
      },
    };
    this.radars.push(radar);
    return radar;
  }

  /** Remove the overlay and everything on it. */
  dispose(): void {
    this.root.parentNode?.removeChild(this.root);
    this.radars = [];
  }
}
