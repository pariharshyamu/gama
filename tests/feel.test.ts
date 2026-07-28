import { describe, expect, it } from 'vitest';
import { PerspectiveCamera } from 'three';
import { GameFeel, Hud } from '../src';

describe('GameFeel', () => {
  it('trauma adds, clamps at 1, and decays to zero', () => {
    const feel = new GameFeel({ decay: 1 });
    feel.shake(0.7);
    feel.shake(0.7);
    expect(feel.trauma).toBe(1);
    feel.update(0.5);
    expect(feel.trauma).toBeCloseTo(0.5);
    feel.update(2);
    expect(feel.trauma).toBe(0);
  });

  it('SHAKE IS TRAUMA SQUARED — a small knock barely registers', () => {
    const offset = (amount: number): number => {
      const feel = new GameFeel({ seed: 5, decay: 0 });
      const camera = new PerspectiveCamera();
      feel.shake(amount);
      feel.update(0.016);
      feel.apply(camera);
      return Math.abs(camera.position.x) + Math.abs(camera.position.y);
    };
    const small = offset(0.2);
    const big = offset(0.8);
    // 0.8² / 0.2² = 16× — allow noise the same phase, so the ratio is exact.
    expect(big / small).toBeCloseTo(16, 5);
  });

  it('apply is remove-then-add: when trauma dies the camera comes home', () => {
    const feel = new GameFeel({ seed: 3, decay: 2 });
    const camera = new PerspectiveCamera();
    camera.position.set(4, 2, 9);
    camera.rotation.z = 0.1;
    feel.shake(1);
    for (let i = 0; i < 60; i++) {
      feel.update(1 / 30);
      feel.apply(camera);
    }
    expect(feel.trauma).toBe(0);
    expect(camera.position.x).toBeCloseTo(4, 10);
    expect(camera.position.y).toBeCloseTo(2, 10);
    expect(camera.rotation.z).toBeCloseTo(0.1, 10);
  });

  it('hit-stop freezes gameplay time and real time keeps flowing', () => {
    const feel = new GameFeel();
    feel.hitStop(0.08);
    feel.hitStop(0.03); // repeat takes the LONGER, never shortens
    expect(feel.timeScale).toBe(0);
    expect(feel.update(0.05)).toBe(0);
    expect(feel.update(0.05)).toBe(0); // 0.1 elapsed > 0.08, but this frame was still inside
    expect(feel.update(0.05)).toBeCloseTo(0.05); // over
  });

  it('slow-mo scales gameplay and eases back to full speed', () => {
    const feel = new GameFeel();
    feel.slowMo(0.25, 0.2, 0.4);
    expect(feel.update(0.1)).toBeCloseTo(0.025);
    expect(feel.timeScale).toBe(0.25);
    feel.update(0.1); // window ends here
    const ramping = feel.update(0.1); // partway back
    expect(ramping).toBeGreaterThan(0.025);
    expect(ramping).toBeLessThan(0.1);
    feel.update(0.4); // ramp exhausted
    expect(feel.update(0.05)).toBeCloseTo(0.05);
    expect(feel.timeScale).toBe(1);
  });

  it('same seed shakes the same; garbage input shakes not at all', () => {
    const run = (seed: number) => {
      const feel = new GameFeel({ seed, decay: 0.2 });
      const camera = new PerspectiveCamera();
      feel.shake(0.9);
      const xs: number[] = [];
      for (let i = 0; i < 8; i++) {
        feel.update(1 / 60);
        feel.apply(camera);
        xs.push(camera.position.x);
      }
      return xs;
    };
    expect(run(7)).toEqual(run(7));
    expect(run(7)).not.toEqual(run(8));

    const feel = new GameFeel();
    feel.shake(NaN);
    feel.hitStop(NaN);
    expect(feel.update(NaN)).toBe(0);
    const camera = new PerspectiveCamera();
    feel.apply(camera);
    expect(Number.isFinite(camera.position.x)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// The Hud builds against anything that can createElement — so a ~40-line
// fake document is enough to test every widget in Node.
// ---------------------------------------------------------------------------

interface FakeEl {
  tagName: string;
  style: Record<string, string>;
  textContent: string;
  children: FakeEl[];
  parentNode: FakeEl | null;
  width: number;
  height: number;
  appendChild(child: FakeEl): void;
  removeChild(child: FakeEl): void;
  getContext(kind: string): Fake2d | null;
}

class Fake2d {
  calls: string[] = [];
  fillStyle = '';
  strokeStyle = '';
  lineWidth = 0;
  clearRect() { this.calls.push('clearRect'); }
  beginPath() { this.calls.push('beginPath'); }
  arc() { this.calls.push('arc'); }
  stroke() { this.calls.push('stroke'); }
  fill() { this.calls.push(`fill:${this.fillStyle}`); }
  moveTo() { this.calls.push('moveTo'); }
  lineTo() { this.calls.push('lineTo'); }
  closePath() { this.calls.push('closePath'); }
}

const makeFakeDoc = () => {
  const contexts: Fake2d[] = [];
  const el = (tagName: string): FakeEl => ({
    tagName,
    style: {},
    textContent: '',
    children: [],
    parentNode: null,
    width: 0,
    height: 0,
    appendChild(child: FakeEl) {
      this.children.push(child);
      child.parentNode = this;
    },
    removeChild(child: FakeEl) {
      this.children = this.children.filter((c) => c !== child);
      child.parentNode = null;
    },
    getContext(kind: string) {
      if (kind !== '2d' || tagName !== 'canvas') return null;
      const ctx = new Fake2d();
      contexts.push(ctx);
      return ctx;
    },
  });
  const body = el('body');
  return {
    contexts,
    body,
    doc: { createElement: el, body } as unknown as Document,
  };
};

const findByText = (root: FakeEl, text: string): FakeEl | undefined => {
  if (root.textContent === text) return root;
  for (const child of root.children) {
    const hit = findByText(child, text);
    if (hit) return hit;
  }
  return undefined;
};

describe('Hud', () => {
  it('mounts one overlay and writes the numbers where they go', () => {
    const { doc, body } = makeFakeDoc();
    const hud = new Hud({ document: doc });
    expect(body.children.length).toBe(1);
    hud.score(1249.6);
    hud.lap(2, 3);
    hud.timer(83.25);
    const root = body.children[0];
    expect(findByText(root, 'SCORE 1250')).toBeDefined();
    expect(findByText(root, 'LAP 2/3')).toBeDefined();
    expect(findByText(root, '1:23.3')).toBeDefined();
    hud.timer(null);
    expect(findByText(root, '1:23.3')).toBeUndefined();
    hud.dispose();
    expect(body.children.length).toBe(0);
  });

  it('hearts fill, hollow, and go red at the last one', () => {
    const { doc, body } = makeFakeDoc();
    const hud = new Hud({ document: doc, accent: '#123456' });
    hud.hearts(2, 5);
    const hearts = findByText(body.children[0], '♥♥♡♡♡')!;
    expect(hearts).toBeDefined();
    expect(hearts.style.color).toBe('#123456');
    hud.hearts(1, 5);
    expect(hearts.style.color).toBe('#ef6a6a');
  });

  it('banners hold, then fade on GAMEPLAY time — a paused game pauses its HUD', () => {
    const { doc, body } = makeFakeDoc();
    const hud = new Hud({ document: doc });
    hud.banner('LAP 2', 1);
    const banner = findByText(body.children[0], 'LAP 2')!;
    expect(banner.style.opacity).toBe('1');
    hud.update(0.5);
    expect(banner.style.opacity).toBe('1'); // still holding
    hud.update(0.3);
    expect(Number(banner.style.opacity)).toBeLessThan(1); // inside the last 0.4 s
    hud.update(0.3);
    expect(banner.style.opacity).toBe('0');
  });

  it('the prompt shows and hides; captions fade on their own clock', () => {
    const { doc, body } = makeFakeDoc();
    const hud = new Hud({ document: doc });
    hud.prompt('Press E to open');
    const prompt = findByText(body.children[0], 'Press E to open')!;
    expect(prompt.style.display).toBe('block');
    hud.prompt(null);
    expect(prompt.style.display).toBe('none');

    hud.caption('♪ footstep on wood', 1);
    const caption = findByText(body.children[0], '♪ footstep on wood')!;
    expect(caption.style.opacity).toBe('0.85');
    hud.update(1.1);
    expect(caption.style.opacity).toBe('0');
  });

  it('the radar draws rings, in-range blips by colour, and the player wedge', () => {
    const { doc, contexts } = makeFakeDoc();
    const hud = new Hud({ document: doc, accent: '#0af' });
    const radar = hud.radar({ range: 20, colors: { foe: '#f00' } });
    radar.set(
      [
        { x: 5, z: -5, kind: 'foe' },
        { x: 0, z: 8 },
        { x: 500, z: 0, kind: 'foe' }, // far out of range — must be culled
      ],
      { x: 0, z: 0 }
    );
    const ctx = contexts[0];
    const fills = ctx.calls.filter((c) => c.startsWith('fill:'));
    // Two blips + the player wedge — the out-of-range foe drew nothing.
    expect(fills).toEqual(['fill:#f00', 'fill:#e8eef4', 'fill:#0af']);
    expect(ctx.calls.filter((c) => c === 'stroke').length).toBe(2); // the rings
    radar.dispose();
  });

  it('without a document it refuses loudly instead of half-working', () => {
    expect(() => new Hud({ document: undefined })).toThrow(/document/);
  });
});
