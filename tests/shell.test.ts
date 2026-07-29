import { describe, expect, it, vi } from 'vitest';
import { Shell } from '../src';

/**
 * A fake document, in the same spirit as the one the Hud tests use: the
 * Shell builds against `querySelectorAll`, `hidden`, `classList` and
 * `addEventListener`, so about sixty lines of stand-in exercises every
 * behaviour in Node with no jsdom.
 */
interface FakeEl {
  tagName: string;
  attrs: Record<string, string>;
  hidden: boolean;
  checked: boolean;
  value: string;
  focused: boolean;
  children: FakeEl[];
  classes: Set<string>;
  classList: { toggle(name: string, on: boolean): void };
  listeners: Map<string, Array<(e: unknown) => void>>;
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string): void;
  addEventListener(type: string, fn: (e: unknown) => void): void;
  removeEventListener(type: string, fn: (e: unknown) => void): void;
  querySelector(sel: string): FakeEl | null;
  querySelectorAll(sel: string): FakeEl[];
  focus(): void;
  click(): void;
}

const el = (tag: string, attrs: Record<string, string> = {}): FakeEl => {
  const node: FakeEl = {
    tagName: tag.toUpperCase(),
    attrs,
    hidden: false,
    checked: false,
    value: '',
    focused: false,
    children: [],
    classes: new Set<string>(),
    listeners: new Map(),
    classList: {
      toggle(name: string, on: boolean) {
        if (on) node.classes.add(name);
        else node.classes.delete(name);
      },
    },
    getAttribute: (name) => node.attrs[name] ?? null,
    setAttribute: (name, value) => void (node.attrs[name] = value),
    addEventListener(type, fn) {
      const list = node.listeners.get(type) ?? [];
      list.push(fn);
      node.listeners.set(type, list);
    },
    removeEventListener(type, fn) {
      node.listeners.set(type, (node.listeners.get(type) ?? []).filter((f) => f !== fn));
    },
    querySelector: (sel) => node.querySelectorAll(sel)[0] ?? null,
    querySelectorAll(sel) {
      // Enough selector support for what the Shell actually asks for:
      // a single [attr] test, or a comma-separated list of tag names.
      const walk = (n: FakeEl, out: FakeEl[]): FakeEl[] => {
        for (const child of n.children) {
          const attr = sel.match(/^\[([\w-]+)\]$/);
          if (attr && child.attrs[attr[1]] !== undefined) out.push(child);
          else if (!attr && sel.split(',').some((s) => s.trim().toUpperCase() === child.tagName))
            out.push(child);
          walk(child, out);
        }
        return out;
      };
      return walk(node, []);
    },
    focus() {
      node.focused = true;
      doc.activeElement = node as unknown as Element;
    },
    click() {
      for (const fn of node.listeners.get('click') ?? []) fn({});
    },
  };
  return node;
};

const add = (parent: FakeEl, child: FakeEl): FakeEl => {
  parent.children.push(child);
  return child;
};

/** A document with a title/settings/paused/results/loading set of screens. */
let doc: { createElement: typeof el; body: FakeEl; activeElement: Element | null;
  hidden: boolean; defaultView: null; listeners: Map<string, Array<(e: unknown) => void>>;
  addEventListener(t: string, f: (e: unknown) => void): void;
  removeEventListener(t: string, f: (e: unknown) => void): void };

const build = () => {
  const body = el('body');
  doc = {
    createElement: el,
    body,
    activeElement: null,
    hidden: false,
    defaultView: null,
    listeners: new Map(),
    addEventListener(type, fn) {
      const list = doc.listeners.get(type) ?? [];
      list.push(fn);
      doc.listeners.set(type, list);
    },
    removeEventListener(type, fn) {
      doc.listeners.set(type, (doc.listeners.get(type) ?? []).filter((f) => f !== fn));
    },
  };

  const screen = (name: string) => add(body, el('section', { 'data-screen': name }));
  const title = screen('title');
  const play = add(title, el('button', { 'data-shell': 'play' }));
  add(title, el('button', { 'data-screen-open': 'settings' }));
  const settings = screen('settings');
  const quality = add(settings, el('select', { 'data-setting': 'quality' }));
  const sound = add(settings, el('input', { 'data-setting': 'sound' }));
  const length = add(settings, el('select', { 'data-setting': 'length' }));
  screen('loading');
  const paused = screen('paused');
  const resume = add(paused, el('button', { 'data-shell': 'resume' }));
  const quit = add(paused, el('button', { 'data-shell': 'quit' }));
  const results = screen('results');
  const again = add(results, el('button', { 'data-shell': 'again' }));
  const pauseBtn = add(body, el('button', { 'data-shell': 'pause' }));

  return { body, title, play, settings, quality, sound, length, paused, resume, quit,
    results, again, pauseBtn };
};

/** localStorage stand-in, so persistence is testable and isolated. */
const store = () => {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    map,
  };
};

const DEFAULTS = { quality: 'medium', sound: true, length: 120 };
const shellWith = (dom: ReturnType<typeof build>, opts: Record<string, unknown> = {}) =>
  new Shell<typeof DEFAULTS>({
    document: doc as unknown as Document,
    root: dom.body as unknown as HTMLElement,
    settings: { ...DEFAULTS },
    storage: store(),
    ...opts,
  });

const key = (code: string) => {
  for (const fn of doc.listeners.get('keydown') ?? []) fn({ code, key: code });
};

describe('Shell', () => {
  it('shows exactly one screen, and hides the rest from assistive tech too', () => {
    const dom = build();
    const shell = shellWith(dom);
    expect(shell.state).toBe('title');
    expect(dom.title.hidden).toBe(false);
    expect(dom.settings.hidden).toBe(true);
    // A panel that is invisible but still in the accessibility tree is a
    // screen reader reading out a menu nobody can see.
    expect(dom.settings.attrs['aria-hidden']).toBe('true');
    expect(dom.title.attrs['aria-hidden']).toBe('false');

    shell.show('settings');
    expect(dom.settings.hidden).toBe(false);
    expect(dom.title.hidden).toBe(true);
    expect(dom.title.classes.has('hidden')).toBe(true);
  });

  it('moves focus into the panel it opens, and lets go of it to play', async () => {
    const dom = build();
    const shell = shellWith(dom, { onStart: () => {} });
    expect(dom.play.focused).toBe(true); // title's first control
    shell.show('paused');
    expect(dom.resume.focused).toBe(true);

    // Going back to play must BLUR: a button that keeps focus eats the next
    // Space, so the player who resumes and jumps presses Resume again.
    let blurred = false;
    (doc.activeElement as unknown as { blur(): void }).blur = () => (blurred = true);
    await shell.start();
    expect(blurred).toBe(true);
  });

  it('runs a round: loading → playing → results, and gates dt throughout', async () => {
    const dom = build();
    const onStart = vi.fn();
    const onFinish = vi.fn();
    const shell = shellWith(dom, { onStart, onFinish });

    expect(shell.gate(0.016)).toBe(0); // nothing runs on the title

    const started = shell.start();
    expect(shell.screen).toBe('loading'); // shown BEFORE the world is built
    await started;

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(shell.state).toBe('playing');
    expect(shell.gate(0.016)).toBeCloseTo(0.016);

    shell.finish();
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(shell.state).toBe('results');
    expect(dom.results.hidden).toBe(false);
    expect(shell.gate(0.016)).toBe(0);
  });

  it('pauses on the key, on the button, and when the tab goes away', async () => {
    const dom = build();
    const onPause = vi.fn();
    const shell = shellWith(dom, { onStart: () => {}, onPause });
    await shell.start();

    key('Escape');
    expect(shell.state).toBe('paused');
    expect(shell.gate(0.016)).toBe(0); // the world genuinely stops
    expect(onPause).toHaveBeenLastCalledWith(true);

    dom.resume.click();
    expect(shell.state).toBe('playing');
    expect(onPause).toHaveBeenLastCalledWith(false);

    dom.pauseBtn.click();
    expect(shell.state).toBe('paused');
    dom.pauseBtn.click();
    expect(shell.state).toBe('playing');

    // A round that keeps running in a hidden tab is a round lost to a
    // phone call.
    doc.hidden = true;
    for (const fn of doc.listeners.get('visibilitychange') ?? []) fn({});
    expect(shell.state).toBe('paused');
  });

  it('binds settings by the DEFAULT type, and persists them', () => {
    const dom = build();
    const storage = store();
    const onSettings = vi.fn();
    const shell = shellWith(dom, { storage, onSettings, name: 'demo' });

    // Controls arrive pre-filled from the saved (or default) values.
    expect(dom.quality.value).toBe('medium');
    expect(dom.sound.checked).toBe(true);
    expect(dom.length.value).toBe('120');

    dom.quality.value = 'low';
    for (const fn of dom.quality.listeners.get('change') ?? []) fn({});
    dom.sound.checked = false;
    for (const fn of dom.sound.listeners.get('change') ?? []) fn({});
    dom.length.value = '90';
    for (const fn of dom.length.listeners.get('change') ?? []) fn({});

    expect(shell.settings.quality).toBe('low');
    expect(shell.settings.sound).toBe(false); // boolean, not the string "false"
    expect(shell.settings.length).toBe(90); // number, not "90"
    expect(onSettings).toHaveBeenCalledTimes(3);

    // And a second visit reads them back.
    const again = new Shell<typeof DEFAULTS>({
      document: doc as unknown as Document,
      root: build().body as unknown as HTMLElement,
      settings: { ...DEFAULTS },
      storage,
      name: 'demo',
    });
    expect(again.settings).toEqual({ quality: 'low', sound: false, length: 90 });
  });

  it('a save written before a setting existed keeps the new default', () => {
    const storage = store();
    const dom = build();
    new Shell({ document: doc as unknown as Document, root: dom.body as unknown as HTMLElement,
      settings: { quality: 'high' }, storage, name: 'demo' }).saveSettings();

    // The next release adds a setting the old save has never heard of.
    const next = new Shell<{ quality: string; captions: boolean }>({
      document: doc as unknown as Document,
      root: build().body as unknown as HTMLElement,
      settings: { quality: 'medium', captions: true },
      storage,
      name: 'demo',
    });
    expect(next.settings.quality).toBe('high'); // the player's choice survives
    expect(next.settings.captions).toBe(true); // …and the new default arrives
  });

  it('a failed round build lands back on the title instead of wedging', async () => {
    const dom = build();
    const onError = vi.fn();
    const shell = shellWith(dom, {
      onStart: () => {
        throw new Error('village generator exploded');
      },
      onError,
    });
    await shell.start();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(shell.state).toBe('title');
    expect(dom.title.hidden).toBe(false);
  });

  it('tears down before each round and on the way back to the title', async () => {
    const dom = build();
    const onTeardown = vi.fn();
    const shell = shellWith(dom, { onStart: () => {}, onTeardown });
    await shell.start();
    expect(onTeardown).toHaveBeenCalledTimes(1);
    dom.again.click(); // "go again" is a fresh round, not a resumed one
    // start() yields a macrotask before building, so the click needs one too.
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));
    shell.toTitle();
    expect(onTeardown).toHaveBeenCalledTimes(3);
    expect(shell.state).toBe('title');
  });

  it('opens non-flow panels without disturbing the state machine', () => {
    const dom = build();
    const shell = shellWith(dom);
    const openSettings = dom.title.children.find((c) => c.attrs['data-screen-open']);
    openSettings?.click();
    expect(shell.screen).toBe('settings');
    expect(shell.state).toBe('title'); // a panel is not a state
  });

  it('dispose unhooks every listener it added', async () => {
    const dom = build();
    const shell = shellWith(dom, { onStart: () => {} });
    await shell.start();
    shell.dispose();
    key('Escape');
    expect(shell.state).toBe('playing'); // nothing is listening any more
  });
});
