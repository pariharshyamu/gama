import { Vector3 } from 'three';

/**
 * Attention — what pulls a character out of what they were doing.
 *
 * Every prop in the trilogy so far waits to be used. Nothing initiates. A
 * phone that rings is the first thing in the world that reaches out and
 * interrupts somebody, and interruption turns out to be almost entirely
 * about the things that are *not* uniform:
 *
 * - **Nobody reacts at the same speed.** A single shared latency makes a
 *   room of people turn their heads like a chorus line. Each character draws
 *   its own reaction time, and draws it fresh for every alert.
 * - **Not everybody reacts at all.** `sensitivity` decides who is the sort
 *   to look up.
 * - **The fifth buzz is not the first buzz.** Without habituation a repeated
 *   alert produces an identical response forever, which reads as clockwork
 *   within about three repeats. Interest in a *kind* of alert decays as it
 *   repeats and recovers while it is quiet.
 *
 * ```ts
 * const attention = new Attention({ seed: 3 });
 * attention.onNotice = (alert) => gaze.glance(alert.at, 1.2);
 * phone.onRing = () => broadcast({ kind: 'ring', urgency: 0.9, at: phone.position, range: 8 }, crowd);
 * game.onUpdate((t) => attention.update(t.delta));
 * ```
 */

export interface Alert {
  /** Free label: 'ring', 'buzz', 'notify', 'speech', 'crash'… */
  kind: string;
  /** How insistent, 0..1. A ring beats a buzz beats a screen lighting up. */
  urgency: number;
  /** Where it came from, for whoever wants to look at it. */
  at?: Vector3;
  /** How long it is worth attending to. Default 1.6 s. */
  duration?: number;
  /** Anything the caller wants to carry through — the device, an id. */
  source?: unknown;
}

export interface AttentionOptions {
  /**
   * How readily this character looks up, 0..1. Scales every alert's urgency
   * before it is judged — with a little noise on top, so two characters
   * with the same sensitivity still disagree about a marginal alert.
   * Default 0.75.
   */
  sensitivity?: number;
  /** Effective urgency an alert must clear to be noticed. Default 0.25. */
  threshold?: number;
  /** Mean reaction time in seconds. Default 0.42. */
  latency?: number;
  /**
   * How fast interest in a repeated kind is used up, 0..1. Higher tires
   * faster. Default 0.45.
   */
  fatigue?: number;
  /** Seconds for a tired kind to recover half its interest. Default 22. */
  recovery?: number;
  seed?: number;
}

interface Pending {
  alert: Alert;
  /** Seconds left before they actually react. */
  wait: number;
}

export class Attention {
  /** Fires when the character actually turns their attention to something. */
  onNotice?: (alert: Alert) => void;
  /** Fires when the alert has run its course and they can go back to it. */
  onRelease?: (alert: Alert) => void;
  /** Fires when an alert arrived and was NOT worth reacting to. */
  onIgnore?: (alert: Alert, reason: 'weak' | 'busy' | 'tired') => void;

  private readonly sensitivity: number;
  private readonly threshold: number;
  private readonly latency: number;
  private readonly fatigue: number;
  private readonly recovery: number;
  private readonly random: () => number;

  private _focus: Alert | null = null;
  private hold = 0;
  private pending: Pending | null = null;
  /** Interest remaining per kind, 1 = fresh. */
  private readonly interest = new Map<string, number>();

  constructor(options: AttentionOptions = {}) {
    this.sensitivity = options.sensitivity ?? 0.75;
    this.threshold = options.threshold ?? 0.25;
    this.latency = options.latency ?? 0.42;
    this.fatigue = options.fatigue ?? 0.45;
    this.recovery = options.recovery ?? 22;
    let s = ((options.seed ?? 1) * 2654435761) >>> 0;
    this.random = () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** What has their attention, or null. */
  get focus(): Alert | null {
    return this._focus;
  }

  /** True while attending to something. */
  get engaged(): boolean {
    return this._focus !== null;
  }

  /** True once an alert has landed but before they have reacted to it. */
  get reacting(): boolean {
    return this.pending !== null;
  }

  /** How much interest is left in a kind of alert, 1 = fresh, 0 = worn out. */
  interestIn(kind: string): number {
    return this.interest.get(kind) ?? 1;
  }

  /**
   * Offer an alert. Whether it lands depends on the character, on how
   * insistent it is, on what they are already attending to, and on how many
   * times they have heard it lately.
   */
  notice(alert: Alert): boolean {
    const left = this.interestIn(alert.kind);
    // A little noise on the judgement itself, not just on the timing. Without
    // it `sensitivity` is a constant, so a dozen characters built the same way
    // either all look up or none do — a chorus line on the *whether* axis
    // exactly as a shared latency is one on the *when* axis. With it, a
    // marginal alert splits a room and an insistent one still gets everybody.
    const mood = 0.8 + this.random() * 0.4;
    const effective = alert.urgency * this.sensitivity * left * mood;

    if (effective < this.threshold) {
      // Distinguish "too quiet to bother with" from "heard it, over it" —
      // callers want to know which, and so does anyone debugging a room that
      // has stopped responding.
      this.onIgnore?.(alert, left < 0.55 ? 'tired' : 'weak');
      this.wear(alert.kind);
      return false;
    }
    // Something more insistent is already holding them. A buzz does not
    // interrupt a phone call.
    if (this._focus && this._focus.urgency >= alert.urgency) {
      this.onIgnore?.(alert, 'busy');
      this.wear(alert.kind);
      return false;
    }

    // React late, and by a different amount every time. A shared constant
    // here is what makes a crowd turn in unison.
    const jitter = 0.55 + this.random() * 0.9;
    // The more insistent it is, the faster they come round to it.
    const urgencyRush = 1.25 - alert.urgency * 0.5;
    this.pending = { alert, wait: this.latency * jitter * urgencyRush };
    this.wear(alert.kind);
    return true;
  }

  /** Drop whatever they were attending to right now. */
  release(): void {
    if (!this._focus) return;
    const was = this._focus;
    this._focus = null;
    this.hold = 0;
    this.onRelease?.(was);
  }

  update(dt: number): void {
    if (dt <= 0) return;

    // Interest recovers while nothing is going off — exponential, so a kind
    // that has been quiet a while is nearly as interesting as it ever was.
    if (this.recovery > 0) {
      const back = Math.pow(0.5, dt / this.recovery);
      for (const [kind, value] of this.interest) {
        const next = 1 - (1 - value) * back;
        if (next > 0.999) this.interest.delete(kind);
        else this.interest.set(kind, next);
      }
    }

    if (this.pending) {
      this.pending.wait -= dt;
      if (this.pending.wait <= 0) {
        const alert = this.pending.alert;
        this.pending = null;
        this._focus = alert;
        this.hold = alert.duration ?? 1.6;
        this.onNotice?.(alert);
      }
    }

    if (this._focus) {
      this.hold -= dt;
      if (this.hold <= 0) this.release();
    }
  }

  private wear(kind: string): void {
    this.interest.set(kind, this.interestIn(kind) * (1 - this.fatigue));
  }
}

export interface BroadcastAlert extends Alert {
  /** Where it went off. */
  at: Vector3;
  /** Beyond this it is inaudible. Default 12 m. */
  range?: number;
}

/**
 * Offer an alert to a group, quieter the further away they are.
 *
 * The listener's position is read from `position` if it has one, so a rig, a
 * mesh or a plain `{ position }` all work. Returns how many took it up —
 * which will not be all of them, and that is the point.
 */
export function broadcast(
  alert: BroadcastAlert,
  listeners: Iterable<{ attention: Attention; position?: Vector3 }>
): number {
  const range = alert.range ?? 12;
  let taken = 0;
  for (const listener of listeners) {
    let urgency = alert.urgency;
    if (listener.position) {
      const d = listener.position.distanceTo(alert.at);
      if (d > range) continue;
      // Inverse-square-ish, floored so a near miss is not silent.
      urgency *= Math.max(0, 1 - (d / range) ** 2);
    }
    if (urgency <= 0) continue;
    if (listener.attention.notice({ ...alert, urgency })) taken++;
  }
  return taken;
}
