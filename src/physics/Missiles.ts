import {
  ConeGeometry,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  Quaternion,
  Vector3,
} from 'three';
import type { Vec3Like } from '../audio/Soundboard';

/** What a missile chases — structurally the same shape Projectiles hit. */
export interface MissileTarget {
  center: Vec3Like;
  radius: number;
}

export interface MissileHit {
  target: MissileTarget;
  at: Vec3Like;
}

export interface MissilesOptions {
  /** Pool size. Default 16 — oldest recycled, a salvo never crashes. */
  capacity?: number;
  /** Cruise speed, m/s. Default 26. */
  speed?: number;
  /**
   * Hard turn-rate limit, rad/s — THE balance dial. Default 1.4.
   * This single number is what makes a missile EVADABLE: a fast target
   * crossing the seeker's nose demands more turn than the airframe has.
   */
  turnRate?: number;
  /** Seconds of motor and guidance; then it's a lawn dart. Default 6. */
  motorTime?: number;
  /** Chance (0..1) that ONE flare seduces ONE missile. Default 0.55. */
  flareCharm?: number;
  seed?: number;
  onHit?: (hit: MissileHit) => void;
  /** Motor died or ground arrived without a hit. */
  onMiss?: (at: Vec3Like) => void;
  /** The missile bought the flare. */
  onDecoyed?: (at: Vec3Like) => void;
}

interface Round {
  alive: boolean;
  position: Vector3;
  velocity: Vector3;
  target: MissileTarget | null;
  lastTargetPos: Vector3;
  fuel: number;
  age: number;
  /** Flare ids already resisted — each flare gets ONE chance per missile. */
  judged: Set<number>;
  chasingFlare: number; // flare id, or -1
}

interface Flare {
  id: number;
  position: Vector3;
  life: number;
}

const MAX_STEP = 1 / 60;
const scratch = new Vector3();
const los = new Vector3();
const axis = new Vector3();
const matrix = new Matrix4();
const quat = new Quaternion();
const UP = new Vector3(0, 1, 0);

/**
 * Missiles — the Projectiles philosophy, guided.
 *
 * Pooled instanced rounds that CHASE: lead pursuit toward where the
 * target is going (velocity estimated by watching it move — targets
 * stay structural `{center, radius}`), turned by an airframe with a
 * hard rate limit. That limit is the whole game: a slow target is
 * doomed, a fast crosser at close range out-turns the seeker, and the
 * space between is piloting.
 *
 * Countermeasures are first-class: `flare(at)` drops a decoy, and each
 * missile gives each flare exactly one seeded chance to seduce it —
 * `onDecoyed` fires when the round buys it. The motor runs out
 * (`onMiss`), the ground is not optional, and the proximity fuse ends
 * arguments (`onHit`).
 *
 * ```ts
 * const missiles = new Missiles({ turnRate: 1.4, onHit: ({ target }) => down(target) });
 * scene.add(missiles.group);
 * missiles.fire(jet.position, jet.forward, { center: bandit.position, radius: 2 });
 * // per frame: missiles.update(dt);   and when afraid: missiles.flare(bandit.position)
 * ```
 */
export class Missiles {
  readonly group: InstancedMesh;
  private readonly rounds: Round[];
  private readonly flares: Flare[] = [];
  private readonly capacity: number;
  private readonly speed: number;
  private readonly turnRate: number;
  private readonly motorTime: number;
  private readonly flareCharm: number;
  private cursor = 0;
  private flareIds = 0;
  private randState: number;
  private readonly onHit?: (hit: MissileHit) => void;
  private readonly onMiss?: (at: Vec3Like) => void;
  private readonly onDecoyed?: (at: Vec3Like) => void;

  constructor(options: MissilesOptions = {}) {
    this.capacity = Math.max(options.capacity ?? 16, 1);
    this.speed = options.speed ?? 26;
    this.turnRate = options.turnRate ?? 1.4;
    this.motorTime = options.motorTime ?? 6;
    this.flareCharm = Math.min(Math.max(options.flareCharm ?? 0.55, 0), 1);
    this.randState = (options.seed ?? 1) >>> 0;
    this.onHit = options.onHit;
    this.onMiss = options.onMiss;
    this.onDecoyed = options.onDecoyed;

    this.group = new InstancedMesh(
      new ConeGeometry(0.14, 0.9, 6),
      new MeshBasicMaterial({ color: 0xffe9b8 }),
      this.capacity
    );
    this.group.frustumCulled = false;
    matrix.makeScale(0, 0, 0);
    for (let i = 0; i < this.capacity; i++) this.group.setMatrixAt(i, matrix);
    this.group.instanceMatrix.needsUpdate = true;

    this.rounds = Array.from({ length: this.capacity }, () => ({
      alive: false,
      position: new Vector3(),
      velocity: new Vector3(),
      target: null,
      lastTargetPos: new Vector3(),
      fuel: 0,
      age: 0,
      judged: new Set<number>(),
      chasingFlare: -1,
    }));
  }

  /** Live rounds in the air. */
  get alive(): number {
    return this.rounds.filter((r) => r.alive).length;
  }

  /** Decoys currently burning. */
  get flaresBurning(): number {
    return this.flares.length;
  }

  private random(): number {
    // mulberry32 — the same seeded coin everything here flips.
    this.randState = (this.randState + 0x6d2b79f5) >>> 0;
    let t = this.randState;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Launch at a target (or unguided along `direction` with none). */
  fire(from: Vec3Like, direction: Vec3Like, target: MissileTarget | null = null): void {
    const round = this.rounds[this.cursor];
    this.cursor = (this.cursor + 1) % this.capacity; // oldest recycled
    round.alive = true;
    round.position.set(from.x, from.y, from.z);
    round.velocity.set(direction.x, direction.y, direction.z);
    if (round.velocity.lengthSq() < 1e-6) round.velocity.set(0, 0, 1);
    round.velocity.normalize().multiplyScalar(this.speed);
    round.target = target;
    if (target) round.lastTargetPos.set(target.center.x, target.center.y, target.center.z);
    round.fuel = this.motorTime;
    round.age = 0;
    round.judged.clear();
    round.chasingFlare = -1;
  }

  /** Drop a decoy — burns ~2.6 s, and every missile gets one look at it. */
  flare(at: Vec3Like): void {
    this.flares.push({
      id: this.flareIds++,
      position: new Vector3(at.x, at.y, at.z),
      life: 2.6,
    });
  }

  update(dt: number): void {
    let remaining = Number.isFinite(dt) ? Math.min(Math.max(dt, 0), 0.25) : 0;
    while (remaining > 1e-9) {
      const step = Math.min(remaining, MAX_STEP);
      remaining -= step;
      this.substep(step);
    }
    for (let i = 0; i < this.capacity; i++) {
      const round = this.rounds[i];
      if (!round.alive) {
        matrix.makeScale(0, 0, 0);
      } else {
        scratch.copy(round.velocity).normalize();
        quat.setFromUnitVectors(UP, scratch);
        matrix.makeRotationFromQuaternion(quat);
        matrix.setPosition(round.position);
      }
      this.group.setMatrixAt(i, matrix);
    }
    this.group.instanceMatrix.needsUpdate = true;
  }

  private substep(dt: number): void {
    for (let i = this.flares.length - 1; i >= 0; i--) {
      this.flares[i].life -= dt;
      if (this.flares[i].life <= 0) this.flares.splice(i, 1);
    }

    for (const round of this.rounds) {
      if (!round.alive) continue;
      round.age += dt;
      round.fuel -= dt;
      if (round.fuel <= 0) {
        round.alive = false;
        this.onMiss?.(round.position);
        continue;
      }

      // The seeker looks for flares between it and its quarry — each
      // flare gets exactly one seeded chance per missile.
      if (round.chasingFlare < 0 && round.target) {
        for (const decoy of this.flares) {
          if (round.judged.has(decoy.id)) continue;
          scratch.subVectors(decoy.position, round.position);
          const inFront = scratch.dot(round.velocity) > 0;
          if (!inFront || scratch.length() > 24) continue;
          round.judged.add(decoy.id);
          if (this.random() < this.flareCharm) {
            round.chasingFlare = decoy.id;
            break;
          }
        }
      }

      // Where is the quarry — the real one, or the lie it bought?
      let aimX: number;
      let aimY: number;
      let aimZ: number;
      if (round.chasingFlare >= 0) {
        const decoy = this.flares.find((f) => f.id === round.chasingFlare);
        if (!decoy) {
          // The flare burned out under it — the round is now a lawn dart.
          round.target = null;
          round.chasingFlare = -1;
          continue;
        }
        aimX = decoy.position.x;
        aimY = decoy.position.y;
        aimZ = decoy.position.z;
        // Close enough to the lie: spent.
        if (round.position.distanceTo(decoy.position) < 1.2) {
          round.alive = false;
          this.onDecoyed?.(round.position);
          continue;
        }
      } else if (round.target) {
        // Lead pursuit: watch the target move, aim where it's going.
        const c = round.target.center;
        const vx = (c.x - round.lastTargetPos.x) / dt;
        const vy = (c.y - round.lastTargetPos.y) / dt;
        const vz = (c.z - round.lastTargetPos.z) / dt;
        round.lastTargetPos.set(c.x, c.y, c.z);
        const eta = Math.min(round.position.distanceTo(round.lastTargetPos) / this.speed, 1.5);
        aimX = c.x + vx * eta;
        aimY = c.y + vy * eta;
        aimZ = c.z + vz * eta;
      } else {
        // Unguided: fly straight until the fuel or the ground.
        round.position.addScaledVector(round.velocity, dt);
        if (round.position.y < 0) {
          round.alive = false;
          this.onMiss?.(round.position);
        }
        continue;
      }

      // Turn toward the aim point — but only as fast as the airframe can,
      // and hard turns BLEED SPEED, which tightens the radius. Without the
      // bleed, a round whose turn circle is wider than the range ORBITS its
      // quarry forever — the same trap the aviator autopilot fell into.
      los.set(aimX - round.position.x, aimY - round.position.y, aimZ - round.position.z);
      let bleed = 1;
      if (los.lengthSq() > 1e-8) {
        los.normalize();
        scratch.copy(round.velocity).normalize();
        const angle = Math.acos(Math.min(Math.max(scratch.dot(los), -1), 1));
        const maxTurn = this.turnRate * dt;
        if (angle > 1e-5) {
          axis.crossVectors(scratch, los);
          if (axis.lengthSq() < 1e-10) axis.set(0, 1, 0);
          axis.normalize();
          quat.setFromAxisAngle(axis, Math.min(angle, maxTurn));
          round.velocity.applyQuaternion(quat);
          bleed = 1 - 0.45 * Math.min(angle / Math.max(maxTurn, 1e-6), 1);
        }
      }
      round.position.addScaledVector(round.velocity, dt * bleed);

      // The fuse, and the floor.
      if (round.target && round.chasingFlare < 0) {
        const reach = round.target.radius + 0.7;
        if (round.position.distanceTo(round.lastTargetPos) <= reach) {
          round.alive = false;
          this.onHit?.({ target: round.target, at: round.position });
          continue;
        }
      }
      if (round.position.y < 0) {
        round.alive = false;
        this.onMiss?.(round.position);
      }
    }
  }
}

// ---------------------------------------------------------------------------

export interface LockOnOptions {
  /** Seeker cone half-angle, radians. Default 0.35. */
  halfAngle?: number;
  /** Seeker range, metres. Default 60. */
  range?: number;
  /** Seconds in the cone to go from seeking to locked. Default 1.4. */
  lockTime?: number;
}

/**
 * LockOn — the growl before the shot.
 *
 * Feed it the seeker's pose and the target every frame: while the
 * target sits inside the cone and range, `progress` climbs; at 1 the
 * state is `locked` and the missile is honest to fire. Drift outside
 * the cone and it all resets — keeping the nose on the bandit IS the
 * skill. Map `progress` to a tick cadence and you have the tone.
 */
export class LockOn {
  state: 'seeking' | 'locking' | 'locked' = 'seeking';
  progress = 0;

  halfAngle: number;
  range: number;
  lockTime: number;

  constructor(options: LockOnOptions = {}) {
    this.halfAngle = options.halfAngle ?? 0.35;
    this.range = options.range ?? 60;
    this.lockTime = Math.max(options.lockTime ?? 1.4, 0.05);
  }

  update(
    dt: number,
    seeker: { position: Vec3Like; direction: Vec3Like },
    target: MissileTarget | null
  ): void {
    const step = Number.isFinite(dt) ? Math.max(dt, 0) : 0;
    if (!target) {
      this.state = 'seeking';
      this.progress = 0;
      return;
    }
    los.set(
      target.center.x - seeker.position.x,
      target.center.y - seeker.position.y,
      target.center.z - seeker.position.z
    );
    const distance = los.length();
    scratch.set(seeker.direction.x, seeker.direction.y, seeker.direction.z);
    const inCone =
      distance <= this.range &&
      distance > 1e-6 &&
      scratch.lengthSq() > 1e-8 &&
      los.normalize().dot(scratch.normalize()) >= Math.cos(this.halfAngle);
    if (!inCone) {
      this.state = 'seeking';
      this.progress = 0;
      return;
    }
    this.progress = Math.min(this.progress + step / this.lockTime, 1);
    this.state = this.progress >= 1 ? 'locked' : 'locking';
  }
}
