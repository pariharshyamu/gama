import { Object3D, Vector3 } from 'three';
import { EventEmitter } from '../core/EventEmitter';

/**
 * A place one character can be — structurally SCENA's `PropSlot`, so a
 * gathering's seats drop straight in with no import between the libraries.
 */
export interface Seat {
  /** Where the body goes. */
  anchor: Object3D;
  /** Where to stand before taking it, if the prop published one. */
  approach?: Object3D;
  /** Free label ('seat', 'sit', 'work'…). */
  kind?: string;
}

export interface SeatClaim<T, S extends Seat = Seat> {
  owner: T;
  seat: S;
  /** Index of the seat in the original list — stable, handy for logging. */
  index: number;
}

export interface OccupancyEvents<T, S extends Seat = Seat> extends Record<string, unknown> {
  /** Someone took a seat. */
  claim: SeatClaim<T, S>;
  /** Someone got up. */
  release: SeatClaim<T, S>;
  /** The last free seat just went. */
  full: undefined;
}

export interface OccupancyOptions {
  /**
   * How hard occupants avoid sitting next to a stranger, 0..2. At 0 they
   * take the nearest seat like a queue; at 1 they behave like people —
   * spreading out over an empty bench, filling the gaps only once they
   * must. Default 1.
   */
  personalSpace?: number;
  /** Distance under which two seats feel adjacent, in metres. Default 1.3. */
  spacing?: number;
  /** How much the walk matters against the company. Default 1. */
  effort?: number;
  /**
   * Indecision, 0..1: how often someone takes a seat that isn't the
   * optimal one. Real people are not optimisers. Default 0.25.
   */
  whim?: number;
  /** Seed for the whim. Same seed, same seating. Default 1. */
  seed?: number;
}

/** Deterministic little PRNG — mulberry32, matching SCENA's `Rng`. */
function makeRandom(seed: number): () => number {
  let state = seed >>> 0 || 1;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const world = (object: Object3D, out: Vector3): Vector3 => {
  object.updateWorldMatrix(true, false);
  return object.getWorldPosition(out);
};

/**
 * Who is sitting where — the bookkeeping that stops two villagers sharing
 * a chair, and the *manners* that stop them all piling onto the same end
 * of a bench.
 *
 * The interesting part is `claim`. It does not hand out the nearest free
 * seat; it scores each one against how far the claimer must walk **and how
 * close it puts them to whoever is already sitting**. So the first arrival
 * takes an end, the second takes the far end, and only when the bench is
 * busy does anyone squeeze into the middle — which is exactly what people
 * do, and is startlingly more convincing than any amount of extra polish
 * on the sitting animation itself.
 *
 * ```ts
 * const bench = createLongBench({ seats: 4 });            // SCENA
 * const seating = new Occupancy(bench.seats);             // GAMA
 * const seat = seating.claim(villager, { from: villager.position });
 * agent.moveTo(seat.approach ?? seat.anchor);             // walk there first
 * // …on arrival: interaction.use(seat, { approach: true })  // ANIMA
 * seating.release(villager);                              // when they leave
 * ```
 *
 * The seat type is inferred from what you hand it, so a SCENA gathering's
 * slots come back out of `claim` as full slots — pose and all — ready to
 * pass straight to ANIMA's `Interaction.use`.
 */
export class Occupancy<T = unknown, S extends Seat = Seat> {
  readonly events = new EventEmitter<OccupancyEvents<T, S>>();
  readonly personalSpace: number;
  readonly spacing: number;
  readonly effort: number;
  readonly whim: number;

  private readonly places: S[];
  private readonly byOwner = new Map<T, S>();
  private readonly bySeat = new Map<S, T>();
  private readonly random: () => number;
  private readonly a = new Vector3();
  private readonly b = new Vector3();

  constructor(seats: Iterable<S>, options: OccupancyOptions = {}) {
    this.places = [...seats];
    this.personalSpace = options.personalSpace ?? 1;
    this.spacing = options.spacing ?? 1.3;
    this.effort = options.effort ?? 1;
    this.whim = options.whim ?? 0.25;
    this.random = makeRandom(options.seed ?? 1);
  }

  /** Every seat, in the order given. */
  get seats(): readonly S[] {
    return this.places;
  }

  /** The unclaimed seats. */
  get free(): S[] {
    return this.places.filter((seat) => !this.bySeat.has(seat));
  }

  /** How many seats are claimed. */
  get taken(): number {
    return this.bySeat.size;
  }

  /** Is every seat claimed? */
  get full(): boolean {
    return this.bySeat.size >= this.places.length;
  }

  /** Is this seat unclaimed? */
  isFree(seat: S): boolean {
    return !this.bySeat.has(seat);
  }

  /** Who is in this seat, if anyone. */
  occupantOf(seat: S): T | null {
    return this.bySeat.get(seat) ?? null;
  }

  /** Where this owner is sitting, if anywhere. */
  seatOf(owner: T): S | null {
    return this.byOwner.get(owner) ?? null;
  }

  /**
   * Take the best free seat for `owner` — nearest, discounted by the company
   * it keeps. Returns null when the place is full. Claiming twice moves the
   * owner (their old seat is freed first).
   */
  claim(owner: T, options: { from?: Vector3 } = {}): S | null {
    const free = this.free.filter((seat) => seat !== this.byOwner.get(owner));
    if (!free.length) return null;

    const scored = free.map((seat) => ({ seat, score: this.score(seat, options.from) }));
    scored.sort((x, y) => y.score - x.score);
    // Nobody sweeps the room and takes the mathematically ideal chair. Some
    // of the time they take the second-best one, because it looked fine.
    const pick =
      scored.length > 1 && this.random() < this.whim
        ? scored[1 + Math.floor(this.random() * Math.min(2, scored.length - 1))]
        : scored[0];
    return this.claimSeat(owner, pick.seat) ? pick.seat : null;
  }

  /** Take one specific seat. False if it is already someone else's. */
  claimSeat(owner: T, seat: S): boolean {
    const holder = this.bySeat.get(seat);
    if (holder !== undefined && holder !== owner) return false;
    this.release(owner);
    this.byOwner.set(owner, seat);
    this.bySeat.set(seat, owner);
    this.events.emit('claim', { owner, seat, index: this.places.indexOf(seat) });
    if (this.full) this.events.emit('full', undefined);
    return true;
  }

  /** Get up. Returns the vacated seat, or null if they weren't sitting. */
  release(owner: T): S | null {
    const seat = this.byOwner.get(owner);
    if (!seat) return null;
    this.byOwner.delete(owner);
    this.bySeat.delete(seat);
    this.events.emit('release', { owner, seat, index: this.places.indexOf(seat) });
    return seat;
  }

  /** Clear the room. */
  releaseAll(): void {
    for (const owner of [...this.byOwner.keys()]) this.release(owner);
  }

  /** The plain nearest free seat, ignoring company — for queues and docks. */
  nearestFree(from: Vector3): S | null {
    let best: S | null = null;
    let bestDistance = Infinity;
    for (const seat of this.places) {
      if (this.bySeat.has(seat)) continue;
      const d = world(seat.anchor, this.a).distanceToSquared(from);
      if (d < bestDistance) {
        bestDistance = d;
        best = seat;
      }
    }
    return best;
  }

  /**
   * How appealing a free seat is: closer is better, and elbow room is
   * better still. Exposed because tuning it against your own scene beats
   * guessing at the constants.
   */
  score(seat: S, from?: Vector3): number {
    const at = world(seat.anchor, this.a);
    let score = 0;
    if (from) score -= this.effort * 0.35 * at.distanceTo(from);
    if (this.personalSpace > 0) {
      for (const other of this.places) {
        if (other === seat || !this.bySeat.has(other)) continue;
        const gap = at.distanceTo(world(other.anchor, this.b));
        // A soft falloff: shoulder-to-shoulder is unpleasant, a seat away is
        // merely close, across the room is nothing at all.
        if (gap < this.spacing) score -= this.personalSpace * (1 - gap / this.spacing);
      }
    }
    return score;
  }
}

export interface StaggerOptions {
  /** Seconds between arrivals, on average. Default 0.9. */
  spread?: number;
  /** Seconds before the first one moves. Default 0. */
  lead?: number;
  /** Seed. Default 1. */
  seed?: number;
}

/**
 * Start times for a group doing the same thing — sitting down, standing up,
 * turning to look. Nothing betrays a crowd of puppets faster than all of it
 * moving on the same frame; these delays are uneven (people bunch up and
 * trail off) rather than a tidy metronome.
 *
 * ```ts
 * const delays = stagger(diners.length, { spread: 1.2 });
 * diners.forEach((d, i) => setTimeout(() => sit(d), delays[i] * 1000));
 * ```
 */
export function stagger(count: number, options: StaggerOptions = {}): number[] {
  const spread = options.spread ?? 0.9;
  const random = makeRandom(options.seed ?? 1);
  const delays: number[] = [];
  let t = options.lead ?? 0;
  for (let i = 0; i < count; i++) {
    delays.push(t);
    t += spread * (0.3 + random() * 1.4);
  }
  return delays;
}
