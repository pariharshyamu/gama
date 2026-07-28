import {
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  SphereGeometry,
  Vector3,
} from 'three';
import type { Vec3Like } from '../audio/Soundboard';

/**
 * Something a shot can hit: a live circle, optionally a team (shots from
 * the same team pass through — no friendly fire unless you want it).
 * Structurally the same `{center, radius}` every trigger in the trilogy
 * speaks; SCENA props and GAMA agents alike qualify.
 */
export interface TargetLike {
  center: Vec3Like;
  radius: number;
  team?: string;
}

export interface ProjectileHit {
  target: TargetLike;
  /** Where the shot was when it connected. */
  at: Vec3Like;
  /** Its velocity at impact — aim the flinch and the knockback with it. */
  velocity: Vec3Like;
}

export interface FireOptions {
  /** Downward pull on this shot, m/s². Default the system's `gravity`. */
  gravity?: number;
  /** Shot radius for the hit test. Default 0.15. */
  radius?: number;
  /** Seconds before it evaporates. Default 3. */
  life?: number;
  /** The shooter's team — targets on it are ignored. */
  team?: string;
}

export interface ProjectilesOptions {
  /** Max shots in flight; past it the oldest is recycled. Default 64. */
  capacity?: number;
  /** Default downward pull, m/s². Default 0 — bullets, not mortars. */
  gravity?: number;
  /** Shots die at this height (ground hits). Default null — they fly on. */
  floor?: number | null;
  /** Visual radius of the instanced tracer spheres. Default 0.12. */
  size?: number;
  color?: number;
  onHit?: (hit: ProjectileHit) => void;
  /** A shot ran out of life or hit the floor — splash/dust goes here. */
  onExpire?: (at: Vec3Like) => void;
}

interface Shot {
  alive: boolean;
  pos: Vector3;
  vel: Vector3;
  gravity: number;
  radius: number;
  life: number;
  team?: string;
  born: number;
}

const ZERO = new Matrix4().makeScale(0, 0, 0);

/**
 * Projectiles — pooled shots against structural targets.
 *
 * One InstancedMesh renders every tracer; `fire()` costs a slot, never
 * an allocation, and a full pool recycles its oldest shot rather than
 * refusing (the newest shot is the one the player just made — it must
 * exist). Targets are registered live references, tested every step,
 * with team filtering so a turret's own shells ignore it.
 *
 * ```ts
 * const shots = new Projectiles({
 *   gravity: 9.8,
 *   floor: 0,
 *   onHit: ({ target, at, velocity }) => {
 *     const foe = byTarget.get(target)!;
 *     foe.health.damage({ from: at, knockback: 5 }, target.center);
 *     sounds.impact('soft', 0.7, { at });
 *   },
 *   onExpire: (at) => fx.burst('dust', at),   // a miss still lands somewhere
 * });
 * scene.add(shots.mesh);
 * shots.addTarget({ center: enemy.position, radius: 0.8, team: 'foes' });
 * shots.fire(muzzle, aimVelocity, { team: 'player' });
 * game.onUpdate((t) => shots.update(t.delta));
 * ```
 */
export class Projectiles {
  readonly mesh: InstancedMesh;
  private readonly capacity: number;
  private readonly gravity: number;
  private readonly floor: number | null;
  private readonly options: ProjectilesOptions;
  private readonly shots: Shot[];
  private readonly targets = new Set<TargetLike>();
  private stamp = 0;
  private liveCount = 0;

  constructor(options: ProjectilesOptions = {}) {
    this.capacity = Math.max(options.capacity ?? 64, 4);
    this.gravity = options.gravity ?? 0;
    this.floor = options.floor ?? null;
    this.options = options;
    this.mesh = new InstancedMesh(
      new SphereGeometry(options.size ?? 0.12, 8, 6),
      new MeshBasicMaterial({ color: options.color ?? 0xffe08a }),
      this.capacity
    );
    this.mesh.frustumCulled = false;
    this.mesh.name = 'projectiles';
    for (let i = 0; i < this.capacity; i++) this.mesh.setMatrixAt(i, ZERO);
    this.shots = Array.from({ length: this.capacity }, () => ({
      alive: false,
      pos: new Vector3(),
      vel: new Vector3(),
      gravity: 0,
      radius: 0.15,
      life: 0,
      team: undefined,
      born: 0,
    }));
  }

  get active(): number {
    return this.liveCount;
  }

  /** Register a live target. Returns unsubscribe. */
  addTarget(target: TargetLike): () => void {
    this.targets.add(target);
    return () => this.targets.delete(target);
  }

  /** Loose a shot. Recycles the oldest if the pool is full. */
  fire(from: Vec3Like, velocity: Vec3Like, options: FireOptions = {}): void {
    let slot: Shot | null = null;
    for (const shot of this.shots) {
      if (!shot.alive) {
        slot = shot;
        break;
      }
      if (!slot || shot.born < slot.born) slot = shot;
    }
    const shot = slot as Shot;
    if (shot.alive) this.liveCount--; // evicting the oldest
    shot.alive = true;
    shot.born = this.stamp++;
    shot.pos.set(from.x, from.y, from.z);
    shot.vel.set(velocity.x, velocity.y, velocity.z);
    shot.gravity = options.gravity ?? this.gravity;
    shot.radius = options.radius ?? 0.15;
    shot.life = options.life ?? 3;
    shot.team = options.team;
    this.liveCount++;
  }

  /** Integrate, test, report. Sub-steps a lag spike; never freezes time. */
  update(dt: number): void {
    let remaining = Number.isFinite(dt) ? Math.min(Math.max(dt, 0), 0.5) : 0;
    while (remaining > 1e-9) {
      const step = Math.min(remaining, 1 / 30);
      remaining -= step;
      this.integrate(step);
    }
    const matrix = new Matrix4();
    for (let i = 0; i < this.capacity; i++) {
      const shot = this.shots[i];
      if (!shot.alive) {
        this.mesh.setMatrixAt(i, ZERO);
        continue;
      }
      matrix.makeTranslation(shot.pos.x, shot.pos.y, shot.pos.z);
      this.mesh.setMatrixAt(i, matrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  private integrate(step: number): void {
    for (const shot of this.shots) {
      if (!shot.alive) continue;
      shot.life -= step;
      if (shot.life <= 0) {
        this.expire(shot);
        continue;
      }
      shot.vel.y -= shot.gravity * step;
      shot.pos.addScaledVector(shot.vel, step);
      if (this.floor !== null && shot.pos.y <= this.floor) {
        shot.pos.y = this.floor;
        this.expire(shot);
        continue;
      }
      for (const target of this.targets) {
        if (shot.team !== undefined && shot.team === target.team) continue;
        const dx = shot.pos.x - target.center.x;
        const dy = shot.pos.y - target.center.y;
        const dz = shot.pos.z - target.center.z;
        const range = shot.radius + target.radius;
        if (dx * dx + dy * dy + dz * dz > range * range) continue;
        shot.alive = false;
        this.liveCount--;
        this.options.onHit?.({
          target,
          at: { x: shot.pos.x, y: shot.pos.y, z: shot.pos.z },
          velocity: { x: shot.vel.x, y: shot.vel.y, z: shot.vel.z },
        });
        break;
      }
    }
  }

  private expire(shot: Shot): void {
    shot.alive = false;
    this.liveCount--;
    this.options.onExpire?.({ x: shot.pos.x, y: shot.pos.y, z: shot.pos.z });
  }
}
