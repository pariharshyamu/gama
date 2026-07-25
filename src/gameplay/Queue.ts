/**
 * Queue — who is next.
 *
 * `Occupancy` answers *who sits where*: a fixed set of places, claimed and
 * released. A queue is its sibling and answers *who is next*: an ordered
 * line where the only place that matters is the front, and everybody else is
 * defined by how far back they are.
 *
 * What makes a rendered queue look real is almost none of that bookkeeping:
 *
 * - **The shuffle is staggered.** When the head leaves, a queue does not
 *   advance as one — each person notices and steps up in their own time, so
 *   the gap travels back down the line like a wave. Advancing everyone on the
 *   same frame is a conveyor belt, and reads as one instantly.
 * - **Gaps are not uniform.** People leave different amounts of room, and the
 *   same person leaves the same amount every time.
 * - **People balk.** Nobody joins a line of thirty. Some will not join a line
 *   of four.
 * - **People renege.** Having joined, they give up if it takes too long —
 *   which is the thing that stops a jammed queue growing forever.
 *
 * ```ts
 * const queue = new Queue<Character>({ service: 6, spacing: 0.62 });
 * if (queue.join(person) === null) wanderOffInstead(person);
 * game.onUpdate((t) => {
 *   queue.update(t.delta);
 *   for (const p of people) p.target = lineHead.position.clone()
 *     .addScaledVector(back, queue.distanceOf(p));
 * });
 * ```
 */

export interface QueueOptions {
  /** Metres between people, before per-person variation. Default 0.62. */
  spacing?: number;
  /** Seconds the person at the front takes to be served. Default 5. */
  service?: number;
  /**
   * Line length somebody will tolerate joining. Beyond it they balk — with
   * per-person variation, so the same line turns some people away and not
   * others. Default 6.
   */
  patience?: number;
  /**
   * Seconds of waiting before somebody gives up and leaves. 0 disables.
   * Default 0 — reneging is opt-in, because a queue that empties itself is
   * surprising if you did not ask for it.
   */
  giveUpAfter?: number;
  /** Mean seconds before somebody notices the line moved. Default 0.5. */
  reaction?: number;
  seed?: number;
}

interface Member<T> {
  who: T;
  /** Their own preferred gap, in metres. */
  gap: number;
  /** Where they are now, metres back from the head. Eases toward `target`. */
  current: number;
  /** Where they should be. */
  target: number;
  /** Seconds until they notice the line moved. */
  wake: number;
  /** Seconds spent in the line. */
  waited: number;
  /** How long they will put up with it. */
  limit: number;
}

export class Queue<T = unknown> {
  /** Fires when the person at the front finishes and leaves. */
  onServed?: (who: T) => void;
  /** Fires when somebody takes one look at the line and walks away. */
  onBalk?: (who: T) => void;
  /** Fires when somebody who had joined gives up and leaves. */
  onGiveUp?: (who: T) => void;
  /** Fires when the front of the line changes. */
  onAdvance?: (who: T | null) => void;

  private readonly members: Member<T>[] = [];
  private readonly spacing: number;
  private readonly service: number;
  private readonly patience: number;
  private readonly giveUpAfter: number;
  private readonly reaction: number;
  private readonly random: () => number;
  private serving = 0;

  constructor(options: QueueOptions = {}) {
    this.spacing = options.spacing ?? 0.62;
    this.service = options.service ?? 5;
    this.patience = options.patience ?? 6;
    this.giveUpAfter = options.giveUpAfter ?? 0;
    this.reaction = options.reaction ?? 0.5;
    let s = ((options.seed ?? 1) * 2654435761) >>> 0;
    this.random = () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** How many are in the line, including whoever is being served. */
  get length(): number {
    return this.members.length;
  }

  /** Whoever is at the front, or null. */
  get head(): T | null {
    return this.members[0]?.who ?? null;
  }

  /** 0..1 through the current service. */
  get progress(): number {
    return this.members.length ? Math.min(1, this.serving / this.service) : 0;
  }

  /** Everybody in the line, front first. */
  get members_(): readonly T[] {
    return this.members.map((m) => m.who);
  }

  /** Place in line: 0 is being served, -1 is not in it. */
  placeOf(who: T): number {
    return this.members.findIndex((m) => m.who === who);
  }

  /**
   * How far back from the head they are standing *right now*, in metres.
   * This eases, so a caller can drive a walk toward it rather than teleport.
   */
  distanceOf(who: T): number {
    const member = this.members.find((m) => m.who === who);
    return member ? member.current : 0;
  }

  /** Where they are heading — the distance they will settle at. */
  targetOf(who: T): number {
    const member = this.members.find((m) => m.who === who);
    return member ? member.target : 0;
  }

  /**
   * Take a look at the line and join it, or not. Returns the place taken, or
   * null if they balked. A caller who gets null should send them elsewhere.
   */
  join(who: T): number | null {
    if (this.placeOf(who) >= 0) return this.placeOf(who);
    // Per-person tolerance, so the same line turns some people away and not
    // others — a hard cutoff makes a queue snap between "everyone joins" and
    // "nobody does" at one length.
    const tolerance = this.patience * (0.6 + this.random() * 0.85);
    if (this.members.length > tolerance) {
      this.onBalk?.(who);
      return null;
    }
    const gap = this.spacing * (0.85 + this.random() * 0.35);
    const place = this.members.length;
    const member: Member<T> = {
      who,
      gap,
      target: 0,
      // They walk up from wherever they were; start them a stride further
      // back than their place so the approach is a step forward, not a pop.
      current: 0,
      wake: 0,
      waited: 0,
      limit: this.giveUpAfter > 0 ? this.giveUpAfter * (0.65 + this.random() * 0.8) : Infinity,
    };
    this.members.push(member);
    this.restack(place);
    member.current = member.target + gap;
    return place;
  }

  /** Take somebody out of the line, wherever they are in it. */
  leave(who: T): boolean {
    const at = this.placeOf(who);
    if (at < 0) return false;
    this.members.splice(at, 1);
    if (at === 0) {
      this.serving = 0;
      this.onAdvance?.(this.head);
    }
    this.restack(at);
    return true;
  }

  /** Serve the person at the front now, whatever the timer says. */
  serve(): T | null {
    const front = this.members.shift();
    if (!front) return null;
    this.serving = 0;
    this.restack(0);
    this.onServed?.(front.who);
    this.onAdvance?.(this.head);
    return front.who;
  }

  update(dt: number): void {
    if (dt <= 0) return;

    if (this.members.length) {
      this.serving += dt;
      if (this.serving >= this.service) this.serve();
    }

    for (let i = this.members.length - 1; i >= 0; i--) {
      const member = this.members[i];
      member.waited += dt;
      // Only people actually waiting give up; nobody walks out mid-service.
      if (i > 0 && member.waited > member.limit) {
        this.members.splice(i, 1);
        this.restack(i);
        this.onGiveUp?.(member.who);
        continue;
      }
      // Notice the line moved, then step up. The delay is what turns a
      // simultaneous advance into a wave travelling back down the queue.
      if (member.wake > 0) {
        member.wake -= dt;
        continue;
      }
      const k = 1 - Math.exp(-6 * dt);
      member.current += (member.target - member.current) * k;
    }
  }

  /** Recompute targets from `from` back, and give each a reaction delay. */
  private restack(from: number): void {
    let distance = 0;
    for (let i = 0; i < this.members.length; i++) {
      const member = this.members[i];
      if (i > 0) distance += member.gap;
      if (i >= from && member.target !== distance) {
        // Further back in the line, you notice later — the person behind the
        // person who moved sees it before the one ten places back does.
        member.wake = this.reaction * (0.4 + this.random() * 1.1) * (1 + i * 0.22);
      }
      member.target = distance;
    }
  }
}
