import { Component } from '../core/Component';
import type { Time } from '../core/Time';

/**
 * A train driver.
 *
 * Every other controller in GAMA steers: it takes a direction and integrates
 * it. This one does not, and that is the whole design. A train's position is
 * ONE NUMBER — how far along the line — so the controller's job is not "where
 * do I go" but "how fast, and can I still stop in time".
 *
 * ```ts
 * const driver = train.addComponent(new RailController(line, {
 *   topSpeed: 22, accel: 0.6, brake: 0.9,
 * }));
 * driver.schedule([{ at: platform.stopMark, dwell: 20 }]);
 * driver.onArrive((stop) => guard.blowWhistle());
 *
 * driver.etaTo(platform.stopMark);   // seconds, honestly
 * driver.stoppingDistance;           // metres, at this instant
 * ```
 *
 * ## What it does NOT model
 *
 * Traction curves, adhesion, wheel slip, brake-force fade, gradient
 * resistance. That is a simulator, and this is the arcade model — the same
 * choice `FlightController` makes and for the same reason: what a game needs
 * is that the train accelerates, that it cannot stop instantly, and that
 * arriving on the mark takes skill or planning. Everything past that is
 * detail nobody can see and everybody has to tune.
 *
 * What it DOES take seriously is `stoppingDistance`, because that is the one
 * number the fantasy rests on. A train you can stop on a sixpence is a car.
 */

/** Anything that can say how long it is. SCENA's track fits. */
export interface RailLine {
  length: number;
  /** Total length is enough for the controller; placement is the caller's. */
  loop?: boolean;
}

export interface ScheduledStop {
  /** Distance along the line where the train's front should come to rest. */
  at: number;
  /**
   * Seconds to wait once stopped. Default 0 — the train still stops, it just
   * departs in the same frame. There is no passing timing point: reaching a
   * stop means standing at it.
   */
  dwell?: number;
  /** Free label for the caller: a platform id, a station name. */
  name?: string;
}

export interface RailControllerOptions {
  /** Line speed, m/s. Default 22 (~80 km/h). */
  topSpeed?: number;
  /** Acceleration, m/s². Default 0.5 — a train is not a car. */
  accel?: number;
  /**
   * Service braking, m/s². Default 0.8.
   *
   * This sets `stoppingDistance`, and so how far ahead the driver has to
   * think. At the defaults a train doing line speed needs 300 m to stop.
   */
  brake?: number;
  /**
   * Emergency braking, m/s². Default 1.6 — used only by `emergencyStop`.
   */
  emergencyBrake?: number;
  /** Where the train starts, metres along. Default 0. */
  distance?: number;
  /** Stop at the end of the line rather than running past it. Default true. */
  buffers?: boolean;
}

export type RailPhase = 'running' | 'braking' | 'stopped' | 'dwelling';

/** Arrival and departure listener. `overrun` is metres past the mark. */
export type RailStopListener = (stop: ScheduledStop, overrun: number) => void;

/**
 * Drives a scalar along a line, with a schedule.
 *
 * The component moves NOTHING by itself: it owns `distance` and the caller
 * places the train. That keeps the controller free of any geometry, which is
 * why it takes a `RailLine` — a length — rather than SCENA's track, and why a
 * consist can be placed by whatever the game likes.
 *
 * ## The braking law
 *
 * Speed is capped at the fastest the train could still stop from in the
 * distance it has left: `v ≤ √(2·brake·remaining)`. Following that ceiling
 * down IS braking at exactly the brake rate.
 *
 * This is the closed form of "am I inside my stopping distance yet?", not an
 * improvement on it — measured side by side in the same harness the two land
 * identically and differ only in the speed left on the final step (0.50 vs
 * 0.36 m/s at 60 Hz, 1.28 vs 1.89 at 10 Hz — each better at one of them).
 * The closed form is used because `remaining` then bounds the speed
 * continuously, which is what `couldStop` in `step` is a question about.
 *
 * The thing that was actually wrong, and is worth remembering: an earlier
 * version arrived when `distance ≥ target` AND `speed < 0.05`, with the last
 * step clamped so the train could not pass the mark. That is a train which
 * reaches the platform and then shivers in place for up to **2.4 seconds** at
 * 10 Hz while its speed bleeds off against a clamp. The brake law had nothing
 * to do with it. Arriving means landing on the mark in one step, and it is
 * the arrival rule — not the ceiling — that this module's tests guard.
 */
export class RailController extends Component {
  distance: number;
  speed = 0;
  topSpeed: number;
  accel: number;
  brake: number;
  emergencyBrake: number;
  buffers: boolean;
  /**
   * Fraction of line speed the driver is asking for, 0..1. The schedule
   * overrides it: 0 asks for a stop, not for coasting — there is no neutral
   * here, a train off power is a train braking.
   */
  throttle = 1;

  private line: RailLine;
  private stops: ScheduledStop[] = [];
  private index = 0;
  private dwellLeft = 0;
  private phase: RailPhase = 'running';
  private emergency = false;
  /** Overrun of the stop currently being served, so departure reports it too. */
  private lastOverrun = 0;
  /** The mark being approached, watched so the three fields below reset with it. */
  private approaching: number | null = null;
  /** Was this train EVER able to stop for that mark? See `step`. */
  private couldStop = false;
  /** Committed to running through the mark; braking to a stand beyond it. */
  private overshooting = false;
  private overrunSoFar = 0;
  private arriveListeners: RailStopListener[] = [];
  private departListeners: RailStopListener[] = [];

  constructor(line: RailLine, options: RailControllerOptions = {}) {
    super();
    this.line = line;
    this.topSpeed = options.topSpeed ?? 22;
    this.accel = options.accel ?? 0.5;
    this.brake = options.brake ?? 0.8;
    this.emergencyBrake = options.emergencyBrake ?? 1.6;
    this.distance = options.distance ?? 0;
    this.buffers = options.buffers ?? true;
  }

  /** Where the train is in its cycle. */
  get state(): RailPhase {
    return this.phase;
  }

  /** The stop being approached, or `null` past the last one. */
  get nextStop(): ScheduledStop | null {
    return this.stops[this.index] ?? null;
  }

  /** Seconds left of the current dwell; 0 when not dwelling. */
  get dwellRemaining(): number {
    return this.dwellLeft;
  }

  /**
   * How far this train needs to stop, from its current speed, at service
   * braking. `v² / 2a` — the only piece of physics here that has to be right,
   * because everything about driving a train is deciding when to start.
   */
  get stoppingDistance(): number {
    return (this.speed * this.speed) / (2 * this.brake);
  }

  /**
   * Seconds until the train comes to rest at `target`, or `Infinity` if the
   * target is behind it and the line does not loop.
   *
   * Honest about the approach in three ways it would be easy not to be: it
   * integrates the same stopping curve `step` drives rather than dividing
   * distance by current speed, it stops at every scheduled stop in between,
   * and it adds their dwell — including whatever is left of the one the train
   * is standing at now.
   */
  etaTo(target: number): number {
    const gap = this.aheadOf(target);
    if (!Number.isFinite(gap)) return Infinity;
    if (gap <= 1e-6) return 0;

    const waypoints = this.stops
      .slice(this.index)
      .map((stop) => ({ at: this.aheadOf(stop.at), dwell: Math.max(0, stop.dwell ?? 0) }))
      .filter((w) => Number.isFinite(w.at) && w.at > 1e-6 && w.at < gap - 1e-6)
      .sort((a, b) => a.at - b.at);

    let seconds = this.dwellLeft;
    let speed = this.dwellLeft > 0 ? 0 : this.speed;
    let from = 0;
    for (const w of waypoints) {
      seconds += this.runTime(speed, w.at - from);
      if (!Number.isFinite(seconds)) return Infinity;
      seconds += w.dwell;
      speed = 0;
      from = w.at;
    }
    return seconds + this.runTime(speed, gap - from);
  }

  /** Give the driver a route. Replaces any existing schedule. */
  schedule(stops: ScheduledStop[]): this {
    // Sorted, because a schedule out of order would make the driver brake for
    // a stop it has already passed and never reach the next one.
    this.stops = [...stops].sort((a, b) => a.at - b.at);
    this.index = 0;
    this.dwellLeft = 0;
    this.phase = 'running';
    this.skipStopsBehind();
    return this;
  }

  /**
   * Called when the train comes to a stand at a scheduled stop. `overrun` is
   * how many metres past the mark it actually stopped — 0 for every normal
   * arrival, and non-zero only when the stop was scheduled closer than the
   * train could stop in. Read it if the doors matter.
   *
   * Not an emergency brake: that is HARDER than service braking, so a train
   * already inside its service curve is inside the emergency one by a wider
   * margin still and always stops short. Tested at four points on the run.
   */
  onArrive(listener: RailStopListener): () => void {
    this.arriveListeners.push(listener);
    return () => {
      const i = this.arriveListeners.indexOf(listener);
      if (i >= 0) this.arriveListeners.splice(i, 1);
    };
  }

  /** Called when the train pulls away, once the dwell is served. */
  onDepart(listener: RailStopListener): () => void {
    this.departListeners.push(listener);
    return () => {
      const i = this.departListeners.indexOf(listener);
      if (i >= 0) this.departListeners.splice(i, 1);
    };
  }

  /**
   * Slam the brakes. Cleared by `resume`.
   *
   * Ignores the schedule while applied and brakes on the emergency rate,
   * which is the point of it. It cannot make the train overrun a mark it was
   * already braking for — emergency braking is harder than service braking,
   * so it always comes to a stand short — and `resume` picks the approach up
   * from wherever that is.
   */
  emergencyStop(): void {
    this.emergency = true;
  }

  /** Release an emergency stop and carry on with the schedule. */
  resume(): void {
    this.emergency = false;
  }

  override fixedUpdate(time: Time): void {
    this.step(time.delta);
  }

  /**
   * Advance by `dt`. Exposed so a caller driving its own loop — or a replay —
   * can step the driver without a `Game`.
   */
  step(dt: number): void {
    if (dt <= 0) return;

    if (this.emergency) {
      this.speed = Math.max(0, this.speed - this.emergencyBrake * dt);
      this.distance += this.speed * dt;
      this.phase = this.speed > 0 ? 'braking' : 'stopped';
      this.clamp();
      return;
    }

    if (this.dwellLeft > 0) {
      this.dwellLeft -= dt;
      this.speed = 0;
      this.phase = 'dwelling';
      if (this.dwellLeft <= 0) {
        this.dwellLeft = 0;
        const done = this.stops[this.index];
        this.advance();
        this.phase = 'running';
        if (done) for (const listener of this.departListeners) listener(done, this.lastOverrun);
      }
      return;
    }

    const target = this.targetDistance();
    if (target !== this.approaching) {
      this.approaching = target;
      this.couldStop = false;
      this.overshooting = false;
      this.overrunSoFar = 0;
    }
    // Once committed to running through, the mark stays the target rather than
    // wrapping a whole lap away — otherwise a loop line forgets the station it
    // just slipped past and accelerates off to go round again.
    const gap = this.overshooting ? -1 : target === null ? Infinity : this.gapTo(target);
    const remaining = Math.max(0, gap);

    // Whether a landing is real or a lie is not a question about this step, it
    // is a question about the whole approach: was this train EVER able to stop
    // for this mark? If it was, the last few centimetres are discretisation
    // and it lands. If it never was — a stop booked inside its braking
    // distance — no tolerance should be able to fake it, and it runs through.
    if (this.stoppingDistance <= remaining + 1e-9) this.couldStop = true;

    // The ceiling: the fastest this train could still stop from, here.
    const cruise = this.topSpeed * Math.max(0, Math.min(1, this.throttle));
    const limit = Math.min(cruise, Math.sqrt(2 * this.brake * remaining));
    if (this.speed > limit) {
      // max() so a ceiling that drops faster than the brakes can — a stop
      // scheduled right in front of a moving train — still decelerates at the
      // brake rate rather than teleporting the speed down.
      this.speed = Math.max(limit, this.speed - this.brake * dt);
      this.phase = this.speed > 0 ? 'braking' : 'stopped';
    } else {
      this.speed = Math.min(limit, this.speed + this.accel * dt);
      this.phase = 'running';
    }

    // Land exactly on the mark — but ONLY if the train could really stop in
    // what is left. Clamping unconditionally is how a controller ends up
    // stopping a train dead in 10 m from line speed, which is the one thing
    // this module says a train must never do.
    //
    // The last few centimetres of any discrete approach are unstoppable:
    // `√(2br)` has infinite slope at the mark, so the train leaves the ceiling
    // around 0.6 m/s with 10 cm to run and the brakes can only shed
    // `brake·dt` a step. An earlier version tested that gap against a
    // per-step tolerance, which got WORSE the faster the frame rate — a
    // smaller `dt` bought a tighter tolerance while a single earlier long
    // frame had already left the train above the ceiling. Measured in the
    // browser: a train 0.39 m short at 1.11 m/s ran straight through
    // HAVENBROOK. `couldStop` asks about the approach instead, and does not
    // depend on `dt` at all.
    const move = this.speed * dt;
    const crossing = remaining > 0 && move >= remaining;
    const lands = crossing && this.couldStop;
    if (lands) {
      // Set, not accumulated: `d + (target - d)` is not exactly `target` in
      // binary floating point, and a stop mark is a number callers compare
      // against. `lands` implies a target, since remaining is otherwise
      // Infinity and no finite step reaches it.
      this.distance = target as number;
      this.speed = 0;
    } else {
      this.distance += move;
      if (crossing) {
        this.overshooting = true;
        this.overrunSoFar = move - remaining;
      } else if (this.overshooting) {
        this.overrunSoFar += move;
      }
    }

    // Coming to a stand at or past the mark is an arrival either way; the
    // overrun says which. Never snapped backwards — where the train stopped is
    // where it stopped. Measured by accumulation rather than
    // `distance - target`, which a loop's wrap would render meaningless.
    if (target !== null && this.speed <= 1e-9 && (this.overshooting || this.gapTo(target) <= 1e-6)) {
      this.speed = 0;
      this.arriveAt(target, this.overrunSoFar);
    }
    this.clamp();
  }

  /** Fire arrival for whatever the train has just come to rest at. */
  private arriveAt(target: number, overrun: number): void {
    const stop = this.stops[this.index];
    this.phase = 'stopped';
    if (!stop || stop.at !== target) return;
    this.dwellLeft = Math.max(0, stop.dwell ?? 0);
    this.lastOverrun = overrun;
    this.overshooting = false;
    this.overrunSoFar = 0;
    for (const listener of this.arriveListeners) listener(stop, overrun);
    if (this.dwellLeft <= 0) {
      this.advance();
      this.phase = 'running';
      for (const listener of this.departListeners) listener(stop, overrun);
    } else {
      this.phase = 'dwelling';
    }
  }

  /**
   * Step to the next stop. A loop line runs its schedule round again — that
   * is what a circle line is — while a line with ends runs out of schedule.
   */
  private advance(): void {
    this.index++;
    if (this.index >= this.stops.length && this.line.loop && this.stops.length > 0) {
      this.index = 0;
      return;
    }
    this.skipStopsBehind();
  }

  /**
   * A stop already behind the train can never be reached on a line with ends,
   * and a driver waiting for one would stall every stop behind it. Dropped at
   * the moment it would become the target, so that a NEGATIVE gap during the
   * run can only ever mean a genuine overrun. No arrival fires: the train
   * never stopped there.
   */
  private skipStopsBehind(): void {
    if (this.line.loop) return;
    while (this.index < this.stops.length && this.stops[this.index]!.at < this.distance - 1e-6) {
      this.index++;
    }
  }

  /**
   * Signed distance from here to `d` in the direction of travel. On a loop it
   * wraps and so is never negative; on a line with ends it goes negative once
   * the train is past.
   */
  private gapTo(d: number): number {
    const gap = d - this.distance;
    if (gap >= 0 || !this.line.loop) return gap;
    const l = this.line.length;
    return l > 0 ? ((gap % l) + l) % l : 0;
  }

  /** Distance ahead, or `Infinity` for what a line with ends puts behind. */
  private aheadOf(d: number): number {
    const gap = this.gapTo(d);
    return gap < -1e-6 ? Infinity : Math.max(0, gap);
  }

  /** Seconds to run `distance` from `v0` and come to rest, on the same law. */
  private runTime(v0: number, distance: number): number {
    if (distance <= 1e-6) return 0;
    // Coarse on purpose: this is a prediction, not the simulation. The error
    // it costs is a fraction of a second over a run measured in minutes.
    const dt = 0.05;
    const cruise = this.topSpeed * Math.max(0, Math.min(1, this.throttle));
    if (cruise <= 0) return Infinity;
    let v = v0;
    let travelled = 0;
    for (let t = 0; t < 7200; t += dt) {
      const remaining = distance - travelled;
      const limit = Math.min(cruise, Math.sqrt(2 * this.brake * remaining));
      v = v > limit ? Math.max(limit, v - this.brake * dt) : Math.min(limit, v + this.accel * dt);
      const move = Math.min(v * dt, remaining);
      travelled += move;
      if (remaining - move <= 1e-6) return t + dt;
    }
    return Infinity;
  }

  /** The next thing to stop for: a scheduled stop, or the buffers. */
  private targetDistance(): number | null {
    const stop = this.stops[this.index];
    if (stop) return stop.at;
    if (this.buffers && !this.line.loop) return this.line.length;
    return null;
  }

  private clamp(): void {
    if (this.line.loop) {
      const l = this.line.length;
      if (l > 0) this.distance = ((this.distance % l) + l) % l;
    } else if (this.distance > this.line.length) {
      this.distance = this.line.length;
      this.speed = 0;
    } else if (this.distance < 0) {
      this.distance = 0;
      this.speed = 0;
    }
  }
}
