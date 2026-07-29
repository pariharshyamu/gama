import { GameFlow, type FlowState } from '../gameplay/GameFlow';
import { SaveSlot, type StorageLike } from '../gameplay/SaveSlot';

/**
 * Shell — the part of a game that is not the game.
 *
 * Every 3D library on the web hands you a renderer and a loop and stops
 * there, which is why every game built on one re-writes the same four
 * hundred lines: which panel is on screen, what Escape does, where the
 * settings live between visits, what happens when the tab is hidden, how
 * the phone gets a thumbstick, and where focus goes when a dialog opens.
 * None of it is interesting and all of it is required, and a demo that
 * skips it is a demo forever.
 *
 * This is that layer, extracted from a game that shipped rather than
 * imagined in advance. It owns **no markup and no styling** — you write
 * the HTML and CSS, and mark it up with data attributes:
 *
 * ```html
 * <section data-screen="title">
 *   <button data-shell="play">Start</button>
 *   <button data-screen-open="settings">Settings</button>
 * </section>
 * <section data-screen="settings" hidden>
 *   <select data-setting="quality">…</select>
 *   <input type="checkbox" data-setting="sound" />
 *   <button data-screen-open="title">Back</button>
 * </section>
 * <section data-screen="paused" hidden>
 *   <button data-shell="resume">Resume</button>
 *   <button data-shell="quit">End round</button>
 * </section>
 * <section data-screen="results" hidden>
 *   <button data-shell="again">Again</button>
 * </section>
 * ```
 *
 * ```ts
 * const shell = new Shell({
 *   settings: { quality: 'medium', sound: true },
 *   onStart: () => buildRound(shell.settings),
 *   onFinish: () => showScore(),
 * });
 * game.onUpdate((t) => {
 *   const dt = shell.gate(t.delta);   // 0 unless actually playing
 *   …
 * });
 * ```
 *
 * The state machine underneath is `GameFlow`, so illegal moves (results →
 * paused) are refused rather than smeared over.
 */

/** States the shell drives. `loading` is a screen, not a flow state. */
export type ShellScreen = FlowState | 'loading' | (string & {});

export interface ShellOptions<S extends object> {
  /** Pass a document in Node/tests. Defaults to the global one. */
  document?: Document;
  /** Where to look for screens and controls. Defaults to `document.body`. */
  root?: HTMLElement;
  /** Settings defaults; also the schema — a value's type decides its binding. */
  settings?: S;
  /** Storage key prefix. Default `'game'`. */
  name?: string;
  /** Bump to invalidate saved settings whose shape has changed. Default 1. */
  version?: number;
  /** Where saves live. Default the page's localStorage; absent = in-memory. */
  storage?: StorageLike;
  /** Keys that toggle pause. Default Escape and P. */
  pauseKeys?: readonly string[];
  /** Pause when the tab is hidden. Default true. */
  pauseOnBlur?: boolean;
  /** Build a round. May be async; the loading screen shows until it settles. */
  onStart?: () => void | Promise<void>;
  /** A round ended — fill in the results screen here. */
  onFinish?: () => void;
  onPause?: (paused: boolean) => void;
  /** Called after any settings change, with the whole settings object. */
  onSettings?: (settings: S) => void;
  /** Torn down before a new round and on `toTitle`. */
  onTeardown?: () => void;
  /** Surfaced instead of thrown, so a failed build does not wedge the shell. */
  onError?: (error: unknown) => void;
}

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export class Shell<S extends object = Record<string, never>> {
  readonly flow: GameFlow;
  /** Live settings. Mutating them directly is fine; call `saveSettings()`. */
  settings: S;

  private readonly doc: Document;
  private readonly root: HTMLElement;
  private readonly screens = new Map<string, HTMLElement>();
  private readonly options: ShellOptions<S>;
  private readonly settingsSlot: SaveSlot<S> | null;
  private readonly cleanups: Array<() => void> = [];
  private current: ShellScreen = 'title';
  private starting = false;

  constructor(options: ShellOptions<S> = {}) {
    this.options = options;
    const doc = options.document ?? (typeof document === 'undefined' ? null : document);
    if (!doc) throw new Error('Shell: no document in this environment — pass one in options.');
    this.doc = doc;
    this.root = options.root ?? (doc.body as HTMLElement);

    const name = options.name ?? 'game';
    const version = options.version ?? 1;
    this.settingsSlot = options.settings
      ? new SaveSlot<S>(`${name}.settings`, { version, storage: options.storage })
      : null;
    // Merged, not replaced: a saved file written before a setting existed
    // must not delete the new default.
    this.settings = { ...(options.settings ?? ({} as S)), ...(this.settingsSlot?.load() ?? {}) };

    this.flow = new GameFlow({
      initial: 'title',
      onEnter: {
        title: () => this.show('title'),
        playing: () => this.show('playing'),
        paused: () => {
          this.show('paused');
          options.onPause?.(true);
        },
        results: () => this.show('results'),
      },
      onExit: {
        paused: () => options.onPause?.(false),
      },
    });

    this.collectScreens();
    this.bindControls();
    this.bindSettings();
    this.bindKeys();
    this.show('title');
  }

  get state(): FlowState {
    return this.flow.state;
  }

  /** The one-line pause: `dt` while playing, 0 anywhere else. */
  gate(dt: number): number {
    return this.flow.gate(dt);
  }

  /**
   * Show exactly one screen — or none, which is what `playing` means.
   *
   * Screens are hidden with the `hidden` ATTRIBUTE as well as a class,
   * because `hidden` is what assistive technology reads and a class is
   * only what CSS reads. A panel that is invisible but still in the
   * accessibility tree is a screen reader announcing a menu the player
   * cannot see.
   */
  show(name: ShellScreen): void {
    this.current = name;
    for (const [id, el] of this.screens) {
      const on = id === name;
      el.hidden = !on;
      el.classList?.toggle('hidden', !on);
      if (el.setAttribute) el.setAttribute('aria-hidden', on ? 'false' : 'true');
    }
    this.focusInto(this.screens.get(String(name)));
  }

  /** Which screen is up — including non-flow ones like `help`. */
  get screen(): ShellScreen {
    return this.current;
  }

  /**
   * Begin a round: loading screen, a breath for it to paint, then `onStart`.
   *
   * The two frames matter. Building a world is usually a second or more of
   * blocked main thread, and without yielding first the loading screen is
   * painted *after* the wait it exists to cover.
   */
  async start(): Promise<void> {
    if (this.starting) return;
    this.starting = true;
    try {
      this.show('loading');
      await this.breathe();
      this.options.onTeardown?.();
      await this.options.onStart?.();
      this.flow.to('playing');
    } catch (error) {
      this.options.onError?.(error);
      this.flow.to('title');
      this.show('title');
    } finally {
      this.starting = false;
    }
  }

  /** Toggle, or force, the pause. Does nothing outside a round. */
  pause(on?: boolean): void {
    const paused = this.flow.state === 'paused';
    if (on === paused) return;
    this.flow.togglePause();
  }

  /** End the round and show the results. */
  finish(): void {
    if (this.flow.state === 'paused') this.flow.togglePause();
    this.options.onFinish?.();
    this.flow.to('results');
  }

  /** Abandon whatever is running and go back to the title. */
  toTitle(): void {
    this.options.onTeardown?.();
    this.flow.to('title');
    this.show('title');
  }

  saveSettings(): void {
    this.settingsSlot?.save(this.settings);
    this.options.onSettings?.(this.settings);
  }

  /** A versioned record for high scores, progress, whatever a game keeps. */
  record<T>(key: string, version = 1): SaveSlot<T> {
    return new SaveSlot<T>(`${this.options.name ?? 'game'}.${key}`, {
      version,
      storage: this.options.storage,
    });
  }

  dispose(): void {
    for (const off of this.cleanups) off();
    this.cleanups.length = 0;
  }

  // -- wiring ---------------------------------------------------------------

  private collectScreens(): void {
    const found = this.root.querySelectorAll?.('[data-screen]') ?? [];
    for (const el of Array.from(found) as HTMLElement[]) {
      const id = el.getAttribute('data-screen');
      if (id) this.screens.set(id, el);
    }
  }

  private on(target: EventTarget | null, type: string, fn: EventListener): void {
    if (!target?.addEventListener) return;
    target.addEventListener(type, fn);
    this.cleanups.push(() => target.removeEventListener?.(type, fn));
  }

  private bindControls(): void {
    const actions: Record<string, () => void> = {
      play: () => void this.start(),
      again: () => void this.start(),
      resume: () => this.pause(false),
      pause: () => this.pause(),
      quit: () => this.finish(),
      title: () => this.toTitle(),
    };
    for (const el of this.queryAll('[data-shell]')) {
      const fn = actions[el.getAttribute('data-shell') ?? ''];
      if (fn) this.on(el, 'click', fn);
    }
    // `data-screen-open` is for panels the flow does not know about —
    // settings, help, credits. They are screens, not states.
    for (const el of this.queryAll('[data-screen-open]')) {
      const target = el.getAttribute('data-screen-open') ?? 'title';
      this.on(el, 'click', () => this.show(target));
    }
  }

  /**
   * Two-way binding for anything marked `data-setting`.
   *
   * The DEFAULT's type decides how the control is read — boolean from
   * `checked`, number through `Number`, everything else as a string. That
   * keeps the schema in one place (the defaults object) instead of
   * scattered across markup that can drift from it.
   */
  private bindSettings(): void {
    for (const el of this.queryAll('[data-setting]')) {
      const key = el.getAttribute('data-setting') as keyof S & string;
      if (!key || !(key in this.settings)) continue;
      const current = this.settings[key];
      const input = el as HTMLInputElement;
      if (typeof current === 'boolean') input.checked = current as boolean;
      else input.value = String(current);

      this.on(el, 'change', () => {
        const next =
          typeof current === 'boolean'
            ? input.checked
            : typeof current === 'number'
              ? Number(input.value)
              : input.value;
        (this.settings as Record<string, unknown>)[key] = next;
        this.saveSettings();
      });
    }
  }

  private bindKeys(): void {
    const keys = this.options.pauseKeys ?? ['Escape', 'KeyP'];
    const target = (this.doc.defaultView ?? this.doc) as unknown as EventTarget;
    this.on(target, 'keydown', (event) => {
      const e = event as KeyboardEvent;
      if (keys.includes(e.code) || keys.includes(e.key)) this.pause();
    });
    if (this.options.pauseOnBlur !== false) {
      // A round that keeps running in a background tab is a round the
      // player loses to a phone call. Browsers throttle rAF when hidden —
      // they do not stop it.
      this.on(this.doc as unknown as EventTarget, 'visibilitychange', () => {
        if (this.doc.hidden && this.flow.state === 'playing') this.pause(true);
      });
    }
  }

  private queryAll(selector: string): HTMLElement[] {
    return Array.from(this.root.querySelectorAll?.(selector) ?? []) as HTMLElement[];
  }

  /**
   * Move focus to where the player is now.
   *
   * Opening a panel focuses its first control (or whatever carries
   * `data-autofocus`). Going back to PLAY blurs instead — because a button
   * that still has focus eats the next Space or Enter, and a player who
   * resumes and then jumps has just pressed Resume again. It is a two-line
   * fix for a bug that is very hard to see and very easy to feel.
   */
  private focusInto(el: HTMLElement | undefined): void {
    if (!el) {
      (this.doc.activeElement as HTMLElement | null)?.blur?.();
      return;
    }
    const first = (el.querySelector?.('[data-autofocus]') ??
      el.querySelector?.(FOCUSABLE)) as HTMLElement | null;
    first?.focus?.();
  }

  /** Two animation frames, or a macrotask where there is no rAF (tests). */
  private breathe(): Promise<void> {
    const raf = (this.doc.defaultView ?? (globalThis as unknown as Window))?.requestAnimationFrame;
    if (typeof raf !== 'function') return new Promise((r) => setTimeout(r, 0));
    return new Promise((resolve) => raf(() => raf(() => resolve())));
  }
}
