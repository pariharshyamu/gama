/**
 * Automation — devices wired to each other.
 *
 * A smart home is a graph: a sensor drives a lamp, a switch drives a scene, a
 * thermostat drives a fan. Modelled naively it is a lookup table and it feels
 * like one. Two properties do all the work of making it feel like *hardware*:
 *
 * - **Nothing happens instantly.** You flip a smart switch and the light comes
 *   on a beat later. That lag is the single most recognisable quality of the
 *   real thing, and a graph without it reads as a light switch with extra
 *   steps.
 * - **Sensors hold.** A motion sensor that goes low the instant you stop
 *   moving turns the lights off on somebody sitting still, which is both the
 *   classic real-world failure and, modelled, the classic tell of a fake one.
 *   A hold keeps the channel high for a while after the last trigger.
 *
 * ```ts
 * const home = new Automation({ seed: 2 });
 * home.hold('motion', 12);                    // sensor stays on for 12 s
 * home.link('motion', 'lamp', { delay: 0.4 });
 * home.on('lamp', (v) => (light.intensity = v * 6));
 * game.onUpdate((t) => home.update(t.delta));
 * ```
 */

export interface LinkOptions {
  /**
   * Seconds before the change reaches the target. Default 0.35, jittered per
   * link so a house full of devices does not respond in lockstep.
   */
  delay?: number;
  /** Transform the value on the way through. Default passes it along. */
  map?: (value: number) => number;
}

export interface AutomationOptions {
  /** Default link delay. Default 0.35. */
  delay?: number;
  seed?: number;
}

interface Link {
  to: string;
  delay: number;
  map?: (value: number) => number;
}

interface Sending {
  to: string;
  value: number;
  left: number;
}

export class Automation {
  private readonly values = new Map<string, number>();
  private readonly links = new Map<string, Link[]>();
  private readonly listeners = new Map<string, Set<(value: number) => void>>();
  /** Channels that stay high for a while after their last trigger. */
  private readonly holds = new Map<string, number>();
  private readonly holding = new Map<string, number>();
  private readonly inFlight: Sending[] = [];
  private readonly defaultDelay: number;
  private readonly random: () => number;

  constructor(options: AutomationOptions = {}) {
    this.defaultDelay = options.delay ?? 0.35;
    let s = ((options.seed ?? 1) * 2654435761) >>> 0;
    this.random = () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** Current value of a channel. Unknown channels read 0. */
  get(channel: string): number {
    return this.values.get(channel) ?? 0;
  }

  /** True if the channel is above half — the boolean reading. */
  isOn(channel: string): boolean {
    return this.get(channel) > 0.5;
  }

  /** Seconds a held channel has left before it drops. */
  holdLeft(channel: string): number {
    return this.holding.get(channel) ?? 0;
  }

  /** Everything currently in flight between devices. */
  get pending(): number {
    return this.inFlight.length;
  }

  /**
   * Make a channel latch: once set high it stays high for `seconds` after the
   * last time it was set, then falls on its own.
   */
  hold(channel: string, seconds: number): this {
    this.holds.set(channel, seconds);
    return this;
  }

  /** Wire one channel to another. */
  link(from: string, to: string, options: LinkOptions = {}): this {
    if (from === to) throw new Error(`Automation: cannot link "${from}" to itself`);
    const list = this.links.get(from) ?? [];
    // Jitter, so a bank of identical devices does not answer as one.
    const base = options.delay ?? this.defaultDelay;
    list.push({ to, delay: base * (0.7 + this.random() * 0.6), map: options.map });
    this.links.set(from, list);
    if (this.reaches(to, from)) {
      this.links.set(from, list.slice(0, -1));
      throw new Error(`Automation: linking "${from}" to "${to}" would make a loop`);
    }
    return this;
  }

  /** Listen to a channel. Returns an unsubscribe. */
  on(channel: string, fn: (value: number) => void): () => void {
    const set = this.listeners.get(channel) ?? new Set();
    set.add(fn);
    this.listeners.set(channel, set);
    return () => set.delete(fn);
  }

  /**
   * Drive a channel. Downstream devices hear about it after their own delay,
   * which is the whole point — this returns immediately and the house catches
   * up over the next second.
   */
  set(channel: string, value: number | boolean): void {
    const v = typeof value === 'boolean' ? (value ? 1 : 0) : value;
    const holdFor = this.holds.get(channel);
    if (holdFor !== undefined && v > 0.5) {
      // Re-trigger: refresh the hold rather than restarting the channel.
      this.holding.set(channel, holdFor);
      if (this.get(channel) > 0.5) return;
    }
    this.apply(channel, v);
  }

  update(dt: number): void {
    if (dt <= 0) return;

    for (const [channel, left] of this.holding) {
      const next = left - dt;
      if (next <= 0) {
        this.holding.delete(channel);
        this.apply(channel, 0);
      } else {
        this.holding.set(channel, next);
      }
    }

    for (let i = this.inFlight.length - 1; i >= 0; i--) {
      const send = this.inFlight[i];
      send.left -= dt;
      if (send.left <= 0) {
        this.inFlight.splice(i, 1);
        this.apply(send.to, send.value);
      }
    }
  }

  /** Set a value now and start anything it drives on its way. */
  private apply(channel: string, value: number): void {
    // Compare against the READ value, not the stored one: an unknown channel
    // already reads 0, so setting it to 0 must be silent. Comparing the raw
    // map entry makes the first `set(x, false)` fire a change from nothing
    // to nothing, and downstream devices act on a switch that never moved.
    if (this.get(channel) === value) {
      this.values.set(channel, value);
      return;
    }
    this.values.set(channel, value);
    const set = this.listeners.get(channel);
    if (set) for (const fn of set) fn(value);
    for (const link of this.links.get(channel) ?? []) {
      const next = link.map ? link.map(value) : value;
      // A change already on its way to the same target is superseded — a
      // switch flicked twice quickly settles once, not twice.
      const existing = this.inFlight.findIndex((s) => s.to === link.to);
      if (existing >= 0) this.inFlight.splice(existing, 1);
      this.inFlight.push({ to: link.to, value: next, left: link.delay });
    }
  }

  /** Would following links from `start` ever arrive at `goal`? */
  private reaches(start: string, goal: string): boolean {
    const seen = new Set<string>();
    const stack = [start];
    while (stack.length) {
      const at = stack.pop()!;
      if (at === goal) return true;
      if (seen.has(at)) continue;
      seen.add(at);
      for (const link of this.links.get(at) ?? []) stack.push(link.to);
    }
    return false;
  }
}
