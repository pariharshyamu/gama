/**
 * Utility AI — and the utility has a UNIT.
 *
 * A utility system scores every action an agent could take and picks the best.
 * The standard shape, from Dave Mark's Infinite Axis Utility System onward, is:
 * each action has a handful of CONSIDERATIONS, each consideration maps some
 * input onto 0..1 through a RESPONSE CURVE, the curves are multiplied, and the
 * highest product wins.
 *
 * Which leaves a designer holding:
 *
 *   - a curve per consideration, with two to four shape parameters each
 *   - a weight per consideration
 *   - a "compensation factor", because multiplying N numbers below 1 drives the
 *     score toward zero, so an action described by five considerations loses to
 *     one described by two for no reason but the count
 *
 * None of those numbers means anything. They are fitted by watching the agent
 * and nudging until it stops doing something stupid, and they are refitted
 * whenever the game changes.
 *
 * ## They exist because the scale is invented
 *
 * A response curve's job is to map incommensurable things — metres of distance,
 * fractions of health, seconds of cooldown — onto one made-up 0..1 axis so they
 * can be combined. The weights then trade off axes that were never comparable
 * in the first place.
 *
 * So do not invent the scale. **An action is worth something and it costs
 * time**, and both are quantities the game already counts:
 *
 *   utility = value / seconds        coins per second, metres per second,
 *                                    hit points per second
 *
 * That is a rate. Rates compare. There is no curve to shape, no weight to
 * balance, and no compensation factor, because nothing is being multiplied.
 *
 * ## And then WHEN TO QUIT is a theorem rather than a threshold
 *
 * The harder half of an agent's life is not choosing between actions, it is
 * knowing when to stop the one it is doing. Every implementation of that is a
 * threshold somebody picked: leave the node at 20% remaining, retreat below 30%
 * health, give up after 8 seconds.
 *
 * Behavioural ecology settled this in 1976. Charnov's **marginal value theorem**
 * says an animal exploiting a depleting patch should leave when the patch's
 * INSTANTANEOUS rate of return drops to the AVERAGE rate available in the
 * environment as a whole — no sooner, no later. It is one of the most tested
 * results in the field, and it makes two predictions that a threshold cannot:
 *
 *   travel gets longer  → stay LONGER in each patch
 *   the world gets richer → leave patches SOONER
 *
 * The second one is worth staring at. Better opportunities elsewhere make an
 * agent abandon a patch it was perfectly happy with, and no amount of tuning a
 * "leave at 20%" rule produces that, because the rule has no idea what else is
 * on offer.
 *
 * `optimalStay` solves the theorem's condition directly, and `Forager` runs the
 * rule with the environment rate it has MEASURED rather than been told — which
 * removes the last number. `npm run forage` checks the result the only way
 * worth checking it: against an exhaustive sweep of every fixed leaving time,
 * which the theorem says it must beat.
 */

/** Anything an agent could spend time doing. */
export interface UtilityAction<C = unknown> {
  name: string;
  /**
   * What doing it is worth, in whatever the game already counts — coins, hit
   * points, metres of ground. Not normalised, because normalising is the step
   * that loses the unit.
   */
  value(context: C): number;
  /**
   * What it costs, in seconds. Never zero: an action that takes no time is not
   * an action, and a rate divided by zero is not a comparison.
   */
  seconds(context: C): number;
  /** Optional availability gate. Absent means always available. */
  available?(context: C): boolean;
}

export interface RankedAction<C = unknown> {
  action: UtilityAction<C>;
  value: number;
  seconds: number;
  /** value ÷ seconds. The only number that gets compared. */
  rate: number;
}

/**
 * What an action is worth per second.
 *
 * Returns 0 for a non-positive duration rather than infinity: a free action
 * would otherwise beat everything forever, which is a bug that presents as an
 * agent standing still doing something instantaneous.
 */
export function rateOf<C>(action: UtilityAction<C>, context: C): number {
  const seconds = action.seconds(context);
  if (!(seconds > 0)) return 0;
  return action.value(context) / seconds;
}

/** Every available action, best rate first. Ties keep their declared order. */
export function rank<C>(actions: readonly UtilityAction<C>[], context: C): RankedAction<C>[] {
  const out: RankedAction<C>[] = [];
  for (const action of actions) {
    if (action.available && !action.available(context)) continue;
    const seconds = action.seconds(context);
    const value = action.value(context);
    out.push({ action, value, seconds, rate: seconds > 0 ? value / seconds : 0 });
  }
  // Stable: a sort by rate alone would let two equally good actions swap places
  // between frames, and an agent that dithers between two identical options
  // looks broken in exactly the way a utility system is supposed to prevent.
  return out
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => b.entry.rate - a.entry.rate || a.index - b.index)
    .map((x) => x.entry);
}

/** The best available action, or null when none is. */
export function choose<C>(actions: readonly UtilityAction<C>[], context: C): UtilityAction<C> | null {
  const ranked = rank(actions, context);
  return ranked.length ? ranked[0].action : null;
}

// --------------------------------------------------------------- the patch

/**
 * Something that yields less the longer you work it.
 *
 * `gain(t)` is the CUMULATIVE yield after `t` seconds — a berry bush emptying,
 * an ore vein thinning, a room running out of things worth looting. It has to
 * be non-decreasing, and the theorem only has something to say when it is
 * concave: if yield is linear in time there is no marginal moment to leave at,
 * and `optimalStay` says so by returning Infinity.
 */
export interface PatchLike {
  gain(seconds: number): number;
  /** Seconds to get here from wherever the agent was. */
  travel?: number;
}

/**
 * A step small enough to differentiate over and large enough to survive
 * floating point: 10 μs of game time.
 */
export const MARGINAL_STEP = 1e-5;

/** The patch's instantaneous rate of return at `t` — g′(t). */
export function marginalRate(patch: PatchLike, seconds: number): number {
  const h = MARGINAL_STEP;
  const t = Math.max(0, seconds);
  return (patch.gain(t + h) - patch.gain(Math.max(0, t - h))) / (t >= h ? 2 * h : t + h);
}

/**
 * The long-run rate of an agent that always leaves at `t` — g(t) / (T + t).
 *
 * The travel time is in the denominator and not the numerator, which is the
 * whole reason travel changes the answer: it is time bought and paid for that
 * yields nothing.
 */
export function longRunRate(patch: PatchLike, seconds: number, travel = patch.travel ?? 0): number {
  const total = travel + Math.max(0, seconds);
  if (!(total > 0)) return 0;
  return patch.gain(Math.max(0, seconds)) / total;
}

/**
 * Solve g′(t) = R for t — leave when the patch's marginal rate has fallen to
 * the rate on offer elsewhere.
 *
 * Bisection, because g′ is decreasing on a depleting patch and a decreasing
 * function crossing a level has exactly one root. Returns 0 if the patch is
 * already worse than the environment at the moment of arrival, and Infinity if
 * it never gets that bad.
 */
export function leaveWhen(patch: PatchLike, environmentRate: number, horizon = 600): number {
  if (!(environmentRate > 0)) return Infinity;
  if (marginalRate(patch, 0) <= environmentRate) return 0;
  if (marginalRate(patch, horizon) > environmentRate) return Infinity;
  let lo = 0;
  let hi = horizon;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (marginalRate(patch, mid) > environmentRate) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Charnov's marginal value theorem, solved.
 *
 *   maximise  R(t) = g(t) / (T + t)
 *   dR/dt = 0  ⟹  g′(t) · (T + t) = g(t)  ⟹  g′(t*) = R(t*)
 *
 * So the optimum is exactly where the patch's marginal rate has fallen to the
 * rate the whole cycle is achieving — the tangent from −T to the gain curve,
 * which is how the theorem is always drawn.
 *
 * Solved as a ROOT of `g′(t)(T + t) − g(t)`, deliberately, and not by searching
 * R for its maximum. A number found by sweeping cannot then be checked against a
 * sweep, and checking it against a sweep is the only check worth having.
 */
export function optimalStay(patch: PatchLike, travel = patch.travel ?? 0, horizon = 600): number {
  const surplus = (t: number): number => marginalRate(patch, t) * (travel + t) - patch.gain(t);
  if (!(surplus(0) > 0)) return 0;
  if (surplus(horizon) > 0) return Infinity; // never depletes: no moment to leave
  let lo = 0;
  let hi = horizon;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (surplus(mid) > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** The long-run rate an optimal forager gets from this patch and travel. */
export function bestRate(patch: PatchLike, travel = patch.travel ?? 0): number {
  const t = optimalStay(patch, travel);
  return Number.isFinite(t) ? longRunRate(patch, t, travel) : marginalRate(patch, 0);
}

// -------------------------------------------------------------- the forager

export interface ForagerOptions {
  /**
   * The rate the rest of the world is worth, in value per second.
   *
   * Leave it out and the forager MEASURES it: its own yield divided by its own
   * elapsed time, travel included. That is the version with no parameters in
   * it at all, and it is also what the theorem is about — an animal cannot be
   * told the environment's average, it can only have experienced it.
   */
  environmentRate?: number;
  /**
   * Seconds of experience before the measured rate is trusted. Until then the
   * forager stays put, because an average over one patch is not an average.
   * Default 0 — no warm-up, which is honest about a forager that has just been
   * born and will get its first patch wrong.
   */
  settle?: number;
  /** Called when a patch is abandoned, with what it gave and how long it took. */
  onLeave?: (event: { gained: number; seconds: number; rate: number }) => void;
}

export type ForagerPhase = 'travelling' | 'foraging';

/**
 * An agent that works a patch and knows when to stop.
 *
 * ```ts
 * const forager = new Forager(() => nextBush());
 * game.onUpdate(({ delta }) => forager.update(delta));
 * ```
 *
 * The rule is one line and it is Charnov's: leave when this patch's marginal
 * rate has fallen to the rate the environment is paying. Everything a designer
 * would otherwise have to tune — how empty is empty, how long is too long, how
 * good does somewhere else have to be — follows from it.
 */
export class Forager {
  phase: ForagerPhase = 'travelling';
  /** The patch being worked, or null while travelling. */
  patch: PatchLike | null = null;
  /** Seconds spent in the current patch. */
  inPatch = 0;
  /** Seconds left of the current journey. */
  remainingTravel = 0;
  /** Everything gathered, ever. */
  harvest = 0;
  /** Seconds lived, travel included. */
  elapsed = 0;
  /** Patches worked and left. */
  visits = 0;

  private readonly next: () => PatchLike | null;
  private readonly given?: number;
  private readonly settle: number;
  private readonly onLeave?: ForagerOptions['onLeave'];
  private patchGain = 0;

  constructor(next: () => PatchLike | null, options: ForagerOptions = {}) {
    this.next = next;
    this.given = options.environmentRate;
    this.settle = options.settle ?? 0;
    this.onLeave = options.onLeave;
    this.depart();
  }

  /**
   * The rate the environment is paying, per second.
   *
   * Given, or measured off the forager's own life. The measured one is a
   * fixed point: leaving on it changes it, which changes when to leave, and it
   * settles on the value the theorem predicts.
   */
  get environmentRate(): number {
    if (this.given !== undefined) return this.given;
    return this.elapsed > 0 ? this.harvest / this.elapsed : 0;
  }

  /** What this patch is paying right now, per second. */
  get marginal(): number {
    return this.patch ? marginalRate(this.patch, this.inPatch) : 0;
  }

  private depart(): void {
    const patch = this.next();
    this.patch = patch;
    this.patchGain = 0;
    this.inPatch = 0;
    this.remainingTravel = patch ? Math.max(0, patch.travel ?? 0) : 0;
    this.phase = this.remainingTravel > 0 ? 'travelling' : 'foraging';
  }

  update(dt: number): void {
    const step = Math.max(0, dt);
    if (step === 0 || !this.patch) return;
    this.elapsed += step;

    if (this.phase === 'travelling') {
      this.remainingTravel -= step;
      if (this.remainingTravel > 0) return;
      // Any overshoot is time already spent in the patch, not time thrown away.
      this.inPatch = -this.remainingTravel;
      this.remainingTravel = 0;
      this.phase = 'foraging';
      const gained = this.patch.gain(this.inPatch);
      this.harvest += gained;
      this.patchGain = gained;
      return;
    }

    this.inPatch += step;
    const total = this.patch.gain(this.inPatch);
    this.harvest += total - this.patchGain;
    this.patchGain = total;

    // THE RULE. One comparison, both sides in value per second.
    const rate = this.environmentRate;
    if (this.elapsed >= this.settle && rate > 0 && this.marginal <= rate) {
      this.visits++;
      this.onLeave?.({
        gained: this.patchGain,
        seconds: this.inPatch,
        rate: this.patchGain / Math.max(1e-9, this.inPatch),
      });
      this.depart();
    }
  }

  /** Value per second over this forager's whole life, travel included. */
  get rate(): number {
    return this.elapsed > 0 ? this.harvest / this.elapsed : 0;
  }
}

/**
 * An exponentially depleting patch — the standard shape, and the one every
 * measurement in the literature is fitted with.
 *
 *   g(t) = amount · (1 − e^(−t / tau))
 *
 * `amount` is everything the patch would ever give and `tau` is how long it
 * takes to give 63% of it. The marginal rate falls off at exactly the same
 * time constant, which is what makes the leaving moment well defined.
 */
export function depletingPatch(amount: number, tau: number, travel = 0): PatchLike {
  return {
    travel,
    gain: (t: number) => amount * (1 - Math.exp(-Math.max(0, t) / tau)),
  };
}
