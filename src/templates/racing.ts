import { Vector3, type Object3D } from 'three';
import {
  ChaseCamera,
  FollowPath,
  MotionAgent,
  Path,
  SphereCollider,
  TouchControls,
  VehicleController,
  driveVehicle,
  resolveCircleCollisions,
  type ChaseCameraOptions,
  type GameObject,
  type Time,
  type TouchControlsOptions,
  type VehicleControllerOptions,
  type VehicleRunningGear,
} from '../index';
import type { GameContext } from './common';

export interface Point2 {
  x: number;
  z: number;
}

/**
 * A closed race circuit as pure geometry over its waypoint polyline — no
 * visuals (SCENA's `createPath` draws the ribbon from the same points). It
 * answers the two questions a racing game keeps asking: *how far off the
 * racing line am I?* (for grip loss) and *how far around the lap am I?* (for
 * lap counting and standings).
 *
 * ```ts
 * const circuit = new Circuit(WAYPOINTS);
 * const drive = new VehicleController(game.input, {
 *   vehicle: car,
 *   offTrack: (x, z) => circuit.distanceTo(x, z) > 4,   // grass past the verge
 * });
 * ```
 */
export class Circuit {
  readonly points: Point2[];
  /** Total centreline length (metres). */
  readonly length: number;
  private readonly cumulative: number[]; // arc length at the start of each segment

  constructor(points: Point2[]) {
    if (points.length < 3) throw new Error('Circuit needs at least 3 waypoints');
    this.points = points.map((p) => ({ x: p.x, z: p.z }));
    this.cumulative = [];
    let total = 0;
    const n = this.points.length;
    for (let i = 0; i < n; i++) {
      this.cumulative.push(total);
      const a = this.points[i];
      const b = this.points[(i + 1) % n];
      total += Math.hypot(b.x - a.x, b.z - a.z);
    }
    this.length = total;
  }

  /** Perpendicular distance from (x, z) to the nearest centreline segment. */
  distanceTo(x: number, z: number): number {
    return Math.sqrt(this.nearest(x, z).distSq);
  }

  /** Fractional position around the lap, 0 at the start/finish line … 1. */
  progress(x: number, z: number): number {
    const { index, t } = this.nearest(x, z);
    const a = this.points[index];
    const b = this.points[(index + 1) % this.points.length];
    const seg = Math.hypot(b.x - a.x, b.z - a.z);
    return ((this.cumulative[index] + t * seg) / this.length) % 1;
  }

  /** Nearest segment index, param t in [0,1] along it, and squared distance. */
  private nearest(x: number, z: number): { index: number; t: number; distSq: number } {
    let best = { index: 0, t: 0, distSq: Infinity };
    const n = this.points.length;
    for (let i = 0; i < n; i++) {
      const a = this.points[i];
      const b = this.points[(i + 1) % n];
      const abx = b.x - a.x;
      const abz = b.z - a.z;
      const lenSq = abx * abx + abz * abz || 1e-6;
      let t = ((x - a.x) * abx + (z - a.z) * abz) / lenSq;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const px = a.x + abx * t;
      const pz = a.z + abz * t;
      const distSq = (x - px) * (x - px) + (z - pz) * (z - pz);
      if (distSq < best.distSq) best = { index: i, t, distSq };
    }
    return best;
  }
}

export interface LapTrackerOptions {
  /** Total laps in the race; sets `finished` when reached. 0 = endless. Default 0. */
  laps?: number;
}

export interface LapState {
  /** Completed laps. */
  lap: number;
  /** Seconds into the current lap. */
  lapTime: number;
  /** Duration of the last completed lap (seconds), or 0. */
  lastLap: number;
  /** Best completed lap (seconds), or Infinity. */
  bestLap: number;
  /** True once `laps` completed (endless races never finish). */
  finished: boolean;
}

/**
 * Counts laps and times them by watching a body's `Circuit.progress` cross
 * the start/finish line in the forward direction (driving backward across it
 * doesn't count). Feed it your position each frame.
 *
 * ```ts
 * const laps = new LapTracker(circuit, { laps: 3 });
 * game.onUpdate((t) => {
 *   const s = laps.update(t.delta, car.object.position.x, car.object.position.z);
 *   hud.textContent = `LAP ${s.lap + 1} · ${s.lapTime.toFixed(1)}s`;
 * });
 * ```
 */
export class LapTracker {
  lap = 0;
  lapTime = 0;
  lastLap = 0;
  bestLap = Infinity;
  finished = false;

  private prev = -1;
  private started = false;

  constructor(private circuit: Circuit, private options: LapTrackerOptions = {}) {}

  update(dt: number, x: number, z: number): LapState {
    const p = this.circuit.progress(x, z);
    if (!this.started) {
      this.prev = p;
      this.started = true;
      return this.state();
    }
    if (this.finished) return this.state();

    this.lapTime += dt;
    // Forward line crossing: progress wraps high → low.
    if (this.prev > 0.75 && p < 0.25) {
      this.lastLap = this.lapTime;
      this.bestLap = Math.min(this.bestLap, this.lapTime);
      this.lapTime = 0;
      this.lap += 1;
      if (this.options.laps && this.lap >= this.options.laps) this.finished = true;
    }
    this.prev = p;
    return this.state();
  }

  reset(): void {
    this.lap = 0;
    this.lapTime = 0;
    this.lastLap = 0;
    this.bestLap = Infinity;
    this.finished = false;
    this.prev = -1;
    this.started = false;
  }

  private state(): LapState {
    return {
      lap: this.lap,
      lapTime: this.lapTime,
      lastLap: this.lastLap,
      bestLap: this.bestLap,
      finished: this.finished,
    };
  }
}

// --------------------------------------------------------------- createRace

/** One car in a race: a visual to drive, and (optionally) running gear to spin. */
export interface RaceEntrant {
  /**
   * The visual to place on the grid and move around the track — a SCENA
   * `createCar().object`, a GLTF scene, anything. The template spawns a
   * GameObject body, parents this under it, and drives the body.
   */
  object: Object3D;
  /**
   * The visual's running gear (a SCENA vehicle prop) to spin each frame —
   * structural, so no SCENA import. Omit for a bare sliding mesh.
   */
  vehicle?: VehicleRunningGear;
  /** Name shown in standings. Defaults to `player` / `rival N`. */
  name?: string;
  /** Collision radius for jostling. Default 1.3 m. */
  radius?: number;
  /** Rival top speed, m/s (ignored for the player). Default 9. */
  speed?: number;
}

export interface RaceOptions {
  /** The circuit geometry (SCENA's `createPath` draws the ribbon from the same points). */
  circuit: Circuit;
  /** The human-driven car. */
  player: RaceEntrant;
  /** AI rivals that follow the racing line. */
  rivals?: RaceEntrant[];
  /** Laps to win. 0 = endless practice. Default 3. */
  laps?: number;
  /** Half-width of the tarmac (m); beyond it the player loses grip. Default 4.5. */
  trackHalfWidth?: number;
  /** Player driving feel (top speed, braking, …); merged over the defaults. */
  driving?: VehicleControllerOptions;
  /** Chase-camera tuning. Default `{ distance: 8.5, height: 4.4 }`. */
  camera?: ChaseCameraOptions;
  /**
   * On-screen touch controls. `true` (default) mounts an auto joystick on
   * touch devices; pass options to customise; `false` to skip.
   */
  touch?: boolean | TouchControlsOptions;
  /** Push overlapping cars apart so they can't drive through each other. Default true. */
  collide?: boolean;
  /** Subscribe to `game.onUpdate` automatically. Default true (false for manual stepping/tests). */
  autoUpdate?: boolean;
}

/** A racer's live placing. */
export interface RacerStanding {
  name: string;
  /** Completed laps. */
  lap: number;
  /** Fractional lap progress, 0…1. */
  progress: number;
  /** 1 = leader. */
  position: number;
  isPlayer: boolean;
  /** True once this racer has completed every lap. */
  finished: boolean;
}

export interface RaceState {
  /** Player laps completed. */
  lap: number;
  /** Seconds into the player's current lap. */
  lapTime: number;
  /** Player's last completed lap (s), or 0. */
  lastLap: number;
  /** Player's best lap (s), or Infinity. */
  bestLap: number;
  /** Player's total race time so far (s). */
  totalTime: number;
  /** Player's place, 1 = leading. */
  position: number;
  /** Number of racers. */
  total: number;
  /** True once the player has finished all laps. */
  finished: boolean;
  /** Every racer, leader first. */
  standings: RacerStanding[];
}

/** The result handed to `onFinish`. */
export interface RaceResult {
  position: number;
  total: number;
  totalTime: number;
  bestLap: number;
}

interface Racer {
  name: string;
  body: GameObject;
  tracker: LapTracker;
  isPlayer: boolean;
  spin?: (dt: number) => void;
}

/**
 * A whole racing game — packaged. `createRace` assembles the pieces every
 * racer demo used to wire by hand: a player `VehicleController` (keyboard +
 * gamepad + `TouchControls`), AI rivals steering the racing line, a
 * `ChaseCamera`, car-vs-car collision so nobody drives through anybody, and
 * live lap **standings** with a finish. Hand it a `Circuit` and the cars;
 * feed it the frame, read `state` for your HUD.
 *
 * ```ts
 * const race = createRace(game, {
 *   circuit: new Circuit(WAYPOINTS),          // SCENA's createPath draws it
 *   player: { object: playerCar.object, vehicle: playerCar },
 *   rivals: [{ object: r1.object, vehicle: r1, speed: 10 }],
 *   laps: 3,
 * });
 * race.onFinish((r) => showResults(r.position));
 * game.onUpdate(() => hud.textContent = `P${race.state.position} · LAP ${race.state.lap + 1}`);
 * ```
 *
 * Parent an ANIMA driver onto `race.player.object` and they ride the moving
 * seat. Everything is public API underneath — when the options run out, copy
 * this function and edit it.
 */
export class Race {
  readonly circuit: Circuit;
  readonly player: {
    object: Object3D;
    body: GameObject;
    controller: VehicleController;
    tracker: LapTracker;
  };
  readonly rivals: Array<{ object: Object3D; body: GameObject; agent: MotionAgent }> = [];
  readonly camera: ChaseCamera;
  readonly touch?: TouchControls;

  private readonly game: GameContext;
  private readonly all: Racer[] = [];
  private readonly collide: boolean;
  private totalTime = 0;
  private wasFinished = false;
  private finishCallbacks: Array<(r: RaceResult) => void> = [];
  private unsubscribe: (() => void) | null = null;

  constructor(game: GameContext, options: RaceOptions) {
    this.game = game;
    this.circuit = options.circuit;
    this.collide = options.collide ?? true;
    const laps = options.laps ?? 3;
    const half = options.trackHalfWidth ?? 4.5;
    const rivals = options.rivals ?? [];
    const count = 1 + rivals.length;
    const line = startLine(this.circuit);
    const lapPoints = this.circuit.points.map((p) => new Vector3(p.x, 0, p.z));

    // Player: pole position, a VehicleController reading input (WASD/stick/touch).
    const p = options.player;
    const playerBody = game.world.spawn(p.name ?? 'player');
    playerBody.add(p.object);
    gridPose(playerBody, line, 0, count);
    const controller = playerBody.addComponent(
      new VehicleController(game.input, {
        vehicle: p.vehicle,
        offTrack: (x, z) => this.circuit.distanceTo(x, z) > half,
        ...options.driving,
      })
    );
    if (this.collide) playerBody.addComponent(new SphereCollider(p.radius ?? 1.3));
    const playerTracker = new LapTracker(this.circuit, { laps });
    this.player = { object: p.object, body: playerBody, controller, tracker: playerTracker };
    this.all.push({ name: p.name ?? 'player', body: playerBody, tracker: playerTracker, isPlayer: true });

    // Rivals: a MotionAgent following the racing line, wheels spun by driveVehicle.
    rivals.forEach((r, i) => {
      const body = game.world.spawn(r.name ?? `rival-${i + 1}`);
      body.add(r.object);
      gridPose(body, line, i + 1, count);
      const agent = body.addComponent(
        new MotionAgent({ maxSpeed: r.speed ?? 9, maxForce: 16, planar: true })
      );
      agent.addBehavior(new FollowPath(new Path(lapPoints, true), 2.5));
      if (this.collide) body.addComponent(new SphereCollider(r.radius ?? 1.3));
      const spin = r.vehicle ? driveVehicle(agent, r.vehicle) : undefined;
      const tracker = new LapTracker(this.circuit, { laps });
      this.rivals.push({ object: r.object, body, agent });
      this.all.push({ name: r.name ?? `rival ${i + 1}`, body, tracker, isPlayer: false, spin });
    });

    // Chase camera on the player, and (on touch) an on-screen joystick.
    this.camera = new ChaseCamera(game.camera, playerBody, {
      distance: 8.5,
      height: 4.4,
      ...options.camera,
    });
    if (options.touch !== false) {
      this.touch = new TouchControls(game.input, options.touch === true ? {} : options.touch);
    }

    if (options.autoUpdate ?? true) {
      this.unsubscribe = game.onUpdate((t: Time) => this.update(t.delta));
    }
  }

  /** Register a callback fired once, when the player crosses the final line. */
  onFinish(callback: (result: RaceResult) => void): this {
    this.finishCallbacks.push(callback);
    return this;
  }

  /**
   * Advance the race one frame: spin rival wheels, jostle overlapping cars
   * apart, chase the player, and recompute lap standings. Returns the state
   * (also on `.state`). Called for you unless `autoUpdate: false`.
   */
  update(dt: number): RaceState {
    for (const r of this.all) if (r.spin) r.spin(dt);
    if (this.collide) resolveCircleCollisions(this.game.world.objects);
    this.camera.update(dt);

    if (!this.player.tracker.finished) this.totalTime += dt;
    for (const r of this.all) {
      const pos = r.body.position;
      r.tracker.update(dt, pos.x, pos.z);
    }

    const state = this.state;
    if (state.finished && !this.wasFinished) {
      this.wasFinished = true;
      const result: RaceResult = {
        position: state.position,
        total: state.total,
        totalTime: this.totalTime,
        bestLap: state.bestLap,
      };
      for (const cb of this.finishCallbacks) cb(result);
    }
    return state;
  }

  /** The live race state — standings, the player's place, lap and time. */
  get state(): RaceState {
    const ranked = this.all
      .map((r) => {
        const progress = this.circuit.progress(r.body.position.x, r.body.position.z);
        return {
          racer: r,
          lap: r.tracker.lap,
          progress,
          distance: r.tracker.lap + progress, // laps + fraction = race distance
        };
      })
      .sort((a, b) => b.distance - a.distance);

    const standings: RacerStanding[] = ranked.map((e, i) => ({
      name: e.racer.name,
      lap: e.lap,
      progress: e.progress,
      position: i + 1,
      isPlayer: e.racer.isPlayer,
      finished: e.racer.tracker.finished,
    }));
    const playerRank = standings.find((s) => s.isPlayer)!;
    const t = this.player.tracker;
    return {
      lap: t.lap,
      lapTime: t.lapTime,
      lastLap: t.lastLap,
      bestLap: t.bestLap,
      totalTime: this.totalTime,
      position: playerRank.position,
      total: this.all.length,
      finished: t.finished,
      standings,
    };
  }

  /** Reset every car to the grid and zero the clocks. */
  reset(): void {
    const line = startLine(this.circuit);
    const count = this.all.length;
    this.all.forEach((r, i) => {
      gridPose(r.body, line, i, count);
      r.tracker.reset();
      const ctrl = r.body.getComponent(VehicleController);
      if (ctrl) ctrl.reset(r.body.position.x, r.body.position.z, r.body.rotation.y);
      const agent = r.body.getComponent(MotionAgent);
      if (agent) agent.velocity.set(0, 0, 0);
    });
    this.totalTime = 0;
    this.wasFinished = false;
    this.camera.snap();
  }

  /** Stop driving the race (unsubscribes from the update loop). */
  dispose(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.touch?.dispose();
  }
}

/** Sugar for `new Race(game, options)`. */
export function createRace(game: GameContext, options: RaceOptions): Race {
  return new Race(game, options);
}

interface StartLine {
  x: number;
  z: number;
  fx: number; // forward unit (heading direction)
  fz: number;
  rx: number; // right unit (perpendicular, for lateral stagger)
  rz: number;
  heading: number;
}

function startLine(circuit: Circuit): StartLine {
  const a = circuit.points[0];
  const b = circuit.points[1];
  let fx = b.x - a.x;
  let fz = b.z - a.z;
  const len = Math.hypot(fx, fz) || 1;
  fx /= len;
  fz /= len;
  return { x: a.x, z: a.z, fx, fz, rx: fz, rz: -fx, heading: Math.atan2(fx, fz) };
}

/**
 * Place racer `i` of `count` on a staggered grid, all just *past* the
 * start/finish line (so the first crossing completes a full lap, not a
 * three-metre one), pole (i = 0) furthest ahead.
 */
function gridPose(body: GameObject, line: StartLine, i: number, count: number): void {
  const ahead = 1.5 + (count - 1 - i) * 3.5; // metres past the line
  const lat = i === 0 ? 0 : (i % 2 === 0 ? -1 : 1) * 1.6; // pole centred, rest alternate
  body.position.set(
    line.x + line.fx * ahead + line.rx * lat,
    body.position.y,
    line.z + line.fz * ahead + line.rz * lat
  );
  body.rotation.y = line.heading;
}
