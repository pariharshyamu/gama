/**
 * Devices — the invisible half of an electronic prop.
 *
 * Every other prop in the trilogy wears its state: a door is open or shut and
 * you can see which. A device's state is invisible except through what it is
 * displaying, and it does not change instantly — a cold machine takes seconds
 * to boot, an idle one dims before it sleeps, and waking from sleep is much
 * faster than starting from cold. Those delays are the entire difference
 * between a prop that has a light on it and a prop that feels powered.
 *
 * ```ts
 * const tv = new Device({ boot: 2.5, idle: 30 });
 * tv.attach(screenPanel);          // anything with setMode(string)
 * tv.press();                      // the remote
 * game.onUpdate((t) => tv.update(t.delta));
 * ```
 *
 * `attach` takes anything with a `setMode(mode: string)` method — which is
 * exactly what SCENA's `ScreenPanel` publishes — so GAMA drives what a SCENA
 * screen is showing without either library importing the other.
 */

export type PowerState = 'off' | 'booting' | 'on' | 'dimmed' | 'sleeping' | 'waking';

/** Anything that can show something. Structurally SCENA's `ScreenPanel`. */
export interface DisplayTarget {
  setMode(mode: string): void;
}

export interface DeviceOptions {
  /** Cold start, seconds. Default 2.2. */
  boot?: number;
  /** Sleep → on, seconds. Much shorter than a cold boot. Default 0.45. */
  wake?: number;
  /**
   * Seconds of no interaction before dimming, then sleeping. 0 disables —
   * a television does not doze off mid-film, a desk monitor does.
   * Default 0 (never).
   */
  idle?: number;
  /** Fraction of `idle` spent dimmed before sleeping. Default 0.25. */
  dimShare?: number;
  /** What to display in each state. */
  modes?: Partial<Record<PowerState, string>>;
  /** Starting state. Default 'off'. */
  state?: PowerState;
}

const DEFAULT_MODES: Record<PowerState, string> = {
  off: 'off',
  // A booting screen is not blank and it is not the UI either — it is the
  // manufacturer's logo. 'standby' is the closest thing we have to "lit but
  // showing nothing", and it reads correctly for the second or two it lasts.
  booting: 'standby',
  on: 'home',
  dimmed: 'home',
  sleeping: 'standby',
  waking: 'standby',
};

export interface DeviceEvents {
  /** Fires on every state transition. */
  onChange?: (state: PowerState, previous: PowerState) => void;
  /** Fires once when the device finishes booting or waking. */
  onReady?: () => void;
}

export class Device implements DeviceEvents {
  onChange?: (state: PowerState, previous: PowerState) => void;
  onReady?: () => void;

  private _state: PowerState;
  private readonly bootTime: number;
  private readonly wakeTime: number;
  private readonly idleTime: number;
  private readonly dimShare: number;
  private readonly modes: Record<PowerState, string>;
  private readonly displays: DisplayTarget[] = [];
  /** Seconds spent in the current transition (booting/waking). */
  private elapsed = 0;
  /** Seconds since the last interaction. */
  private since = 0;
  /** What `on` should show — set by `show()`, survives a sleep/wake. */
  private content: string;

  constructor(options: DeviceOptions = {}) {
    this.bootTime = options.boot ?? 2.2;
    this.wakeTime = options.wake ?? 0.45;
    this.idleTime = options.idle ?? 0;
    this.dimShare = options.dimShare ?? 0.25;
    this.modes = { ...DEFAULT_MODES, ...options.modes };
    this._state = options.state ?? 'off';
    this.content = this.modes.on;
  }

  get state(): PowerState {
    return this._state;
  }

  /** True once it is usable — `on` or `dimmed`, not mid-boot. */
  get ready(): boolean {
    return this._state === 'on' || this._state === 'dimmed';
  }

  /** 0..1 through the current boot or wake; 1 when not transitioning. */
  get progress(): number {
    if (this._state === 'booting') return Math.min(1, this.elapsed / this.bootTime);
    if (this._state === 'waking') return Math.min(1, this.elapsed / this.wakeTime);
    return 1;
  }

  /** Attach a display this device drives. */
  attach(display: DisplayTarget): this {
    this.displays.push(display);
    display.setMode(this.currentMode());
    return this;
  }

  /**
   * Set what the device shows while it is on. Kept separately from the
   * power state so that sleeping and waking return to the same content
   * rather than dumping the user back to a home screen.
   */
  show(mode: string): this {
    this.content = mode;
    if (this.ready) this.push();
    return this;
  }

  /** The power button: off → boot, on → sleep, asleep → wake. */
  press(): this {
    if (this._state === 'off') this.go('booting');
    else if (this._state === 'on' || this._state === 'dimmed') this.go('off');
    else if (this._state === 'sleeping') this.go('waking');
    // Pressing during a boot does nothing. Neither does mashing it in life.
    return this;
  }

  /**
   * Somebody touched it. Resets the idle clock, and wakes it if it had
   * dozed — which is what actually happens when you sit down at a monitor.
   */
  nudge(): this {
    this.since = 0;
    if (this._state === 'dimmed') this.go('on');
    else if (this._state === 'sleeping') this.go('waking');
    return this;
  }

  /** Force states, for scripting a scene. */
  turnOn(instant = false): this {
    if (this.ready) return this;
    this.go(instant ? 'on' : 'booting');
    return this;
  }

  turnOff(): this {
    this.go('off');
    return this;
  }

  sleep(): this {
    if (this.ready) this.go('sleeping');
    return this;
  }

  update(dt: number): void {
    if (dt <= 0) return;
    this.elapsed += dt;

    if (this._state === 'booting' && this.elapsed >= this.bootTime) {
      this.go('on');
      this.onReady?.();
      return;
    }
    if (this._state === 'waking' && this.elapsed >= this.wakeTime) {
      this.go('on');
      this.onReady?.();
      return;
    }

    if (this.idleTime > 0 && (this._state === 'on' || this._state === 'dimmed')) {
      this.since += dt;
      const dimAt = this.idleTime * (1 - this.dimShare);
      if (this._state === 'on' && this.since >= dimAt) this.go('dimmed');
      else if (this._state === 'dimmed' && this.since >= this.idleTime) this.go('sleeping');
    }
  }

  private currentMode(): string {
    if (this._state === 'on' || this._state === 'dimmed') return this.content;
    return this.modes[this._state];
  }

  private push(): void {
    const mode = this.currentMode();
    for (const display of this.displays) display.setMode(mode);
  }

  private go(next: PowerState): void {
    if (next === this._state) return;
    const previous = this._state;
    this._state = next;
    this.elapsed = 0;
    if (next === 'on') this.since = 0;
    this.push();
    this.onChange?.(next, previous);
  }
}
