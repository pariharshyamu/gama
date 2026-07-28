import { Vector3 } from 'three';
import type { Vec3Like } from '../audio/Soundboard';

/**
 * Anything standable: an axis-aligned box. `center` and `size` are read
 * live every update, so a game that moves a platform just moves it; add
 * a `velocity` and riders are carried. SCENA crates, slabs and roofs are
 * boxes already — a `{ center, size }` view drops straight in with no
 * imports between the libraries.
 */
export interface PlatformLike {
  center: Vec3Like;
  /** Full extents (not half). */
  size: Vec3Like;
  /** Units/second — riders standing on this are carried along. */
  velocity?: Vec3Like;
}

export interface PlatformerOptions {
  /** Top running speed, units/s. Default 6. */
  moveSpeed?: number;
  /** Ground acceleration, units/s². Default 40 — snappy, not instant. */
  acceleration?: number;
  /** Fraction of acceleration available mid-air (0..1). Default 0.5. */
  airControl?: number;
  /** Downward pull, units/s² (positive). Default 28 — game gravity, not Earth's. */
  gravity?: number;
  /** Apex height of a full jump, units. Default 2.2. */
  jumpHeight?: number;
  /** Terminal fall speed, units/s. Default 22. */
  maxFall?: number;
  /** Grace period to jump after walking off an edge. Default 0.1 s. */
  coyoteTime?: number;
  /** How early a jump press may land and still count. Default 0.12 s. */
  jumpBuffer?: number;
  /** Multiply upward speed by this on early release (0..1). Default 0.45. */
  jumpCut?: number;
  /** Body radius for walls and ledges. Default 0.35. */
  radius?: number;
  /** Head height above the feet. Default 1.7. */
  height?: number;
  onJump?: () => void;
  /** Fired on touchdown with the impact speed (units/s) — scale the shake by it. */
  onLand?: (fallSpeed: number) => void;
  /** Fired on walking off an edge (jumps don't count as falls). */
  onFall?: () => void;
}

const MAX_TOTAL = 0.25; // clamp the whole frame, honestly…
const MAX_STEP = 1 / 60; // …then sub-step it, so fast falls can't tunnel
const SNAP = 0.06; // how far feet may hover above ground and still be grounded
const STEP_UP = 0.35; // ledges lower than this are steps, not walls

/**
 * PlatformerController — gravity, jumps, and every forgiving detail
 * between them.
 *
 * The character `position` is its FEET. Feed `update()` the frame's
 * gameplay delta and the platforms (live-read boxes); drive it with
 * `move()`, `jump()` and `release()`. The forgiveness trio is on by
 * default because platformers feel broken without it: coyote time (you
 * may jump for a moment after the ledge), jump buffering (a press just
 * before landing still jumps), and variable height (release early, rise
 * less).
 *
 * ```ts
 * const body = new PlatformerController({ onLand: (v) => feel.shake(v / 30) });
 * game.onUpdate((t) => {
 *   const dt = flow.gate(t.delta);
 *   body.move(input.axis.x);
 *   if (input.pressed('jump')) body.jump();
 *   if (input.released('jump')) body.release();
 *   body.update(dt, platforms);
 *   hero.position.copy(body.position);
 * });
 * ```
 */
export class PlatformerController {
  readonly position = new Vector3();
  readonly velocity = new Vector3();
  /** Standing on something this frame. */
  grounded = false;
  /** The platform under the feet, or null mid-air. */
  ground: PlatformLike | null = null;

  moveSpeed: number;
  acceleration: number;
  airControl: number;
  gravity: number;
  maxFall: number;
  coyoteTime: number;
  jumpBufferTime: number;
  jumpCut: number;
  radius: number;
  height: number;

  private readonly jumpSpeed: number;
  private intentX = 0;
  private intentZ = 0;
  private coyote = 0;
  private buffer = 0;
  private canCut = false;
  private jumped = false;
  private readonly onJump?: () => void;
  private readonly onLand?: (fallSpeed: number) => void;
  private readonly onFall?: () => void;

  constructor(options: PlatformerOptions = {}) {
    this.moveSpeed = options.moveSpeed ?? 6;
    this.acceleration = options.acceleration ?? 40;
    this.airControl = Math.min(Math.max(options.airControl ?? 0.5, 0), 1);
    this.gravity = options.gravity ?? 28;
    this.maxFall = options.maxFall ?? 22;
    this.coyoteTime = options.coyoteTime ?? 0.1;
    this.jumpBufferTime = options.jumpBuffer ?? 0.12;
    this.jumpCut = Math.min(Math.max(options.jumpCut ?? 0.45, 0), 1);
    this.radius = options.radius ?? 0.35;
    this.height = options.height ?? 1.7;
    const jumpHeight = options.jumpHeight ?? 2.2;
    this.jumpSpeed = Math.sqrt(2 * this.gravity * jumpHeight);
    this.onJump = options.onJump;
    this.onLand = options.onLand;
    this.onFall = options.onFall;
  }

  /** Movement intent, -1..1 per axis. Call every frame you want to move. */
  move(x: number, z = 0): void {
    this.intentX = Math.min(Math.max(Number.isFinite(x) ? x : 0, -1), 1);
    this.intentZ = Math.min(Math.max(Number.isFinite(z) ? z : 0, -1), 1);
  }

  /** The jump BUTTON, not the jump: buffered, coyote-checked, then flown. */
  jump(): void {
    this.buffer = this.jumpBufferTime;
  }

  /** Release the jump button — rising jumps are cut short (variable height). */
  release(): void {
    if (this.canCut && this.velocity.y > 0) {
      this.velocity.y *= this.jumpCut;
    }
    this.canCut = false;
  }

  /** Put the body somewhere (respawns); clears all motion and timers. */
  teleport(x: number, y: number, z = 0): void {
    this.position.set(x, y, z);
    this.velocity.set(0, 0, 0);
    this.grounded = false;
    this.ground = null;
    this.coyote = 0;
    this.buffer = 0;
    this.canCut = false;
    this.jumped = false;
  }

  update(dt: number, platforms: ReadonlyArray<PlatformLike>): void {
    let remaining = Number.isFinite(dt) ? Math.min(Math.max(dt, 0), MAX_TOTAL) : 0;
    while (remaining > 1e-9) {
      const step = Math.min(remaining, MAX_STEP);
      remaining -= step;
      this.substep(step, platforms);
    }
  }

  private substep(dt: number, platforms: ReadonlyArray<PlatformLike>): void {
    const p = this.position;
    const v = this.velocity;

    // Horizontal: approach the intended velocity; thinner air, less grip.
    const accel = this.acceleration * (this.grounded ? 1 : this.airControl) * dt;
    v.x += Math.min(Math.max(this.intentX * this.moveSpeed - v.x, -accel), accel);
    v.z += Math.min(Math.max(this.intentZ * this.moveSpeed - v.z, -accel), accel);

    // Vertical: gravity to a terminal speed.
    if (!this.grounded) v.y = Math.max(v.y - this.gravity * dt, -this.maxFall);

    // Riders go where their platform goes.
    if (this.grounded && this.ground?.velocity) {
      p.x += this.ground.velocity.x * dt;
      p.y += this.ground.velocity.y * dt;
      p.z += this.ground.velocity.z * dt;
    }

    // Walls: anything too tall to step onto pushes the body circle out.
    p.x += v.x * dt;
    p.z += v.z * dt;
    for (const box of platforms) {
      const top = box.center.y + box.size.y / 2;
      const bottom = box.center.y - box.size.y / 2;
      if (top <= p.y + STEP_UP || bottom >= p.y + this.height) continue;
      const dx = p.x - box.center.x;
      const dz = p.z - box.center.z;
      const overlapX = box.size.x / 2 + this.radius - Math.abs(dx);
      const overlapZ = box.size.z / 2 + this.radius - Math.abs(dz);
      if (overlapX <= 0 || overlapZ <= 0) continue;
      if (overlapX < overlapZ) {
        p.x += dx >= 0 ? overlapX : -overlapX;
        if ((dx >= 0) === v.x < 0) v.x = 0;
      } else {
        p.z += dz >= 0 ? overlapZ : -overlapZ;
        if ((dz >= 0) === v.z < 0) v.z = 0;
      }
    }

    // Vertical motion: land on tops, bump heads on bottoms.
    const prevFeet = p.y;
    p.y += v.y * dt;
    if (this.grounded) {
      // Still supported? Follow the top (vertical movers carry for free).
      const under = this.support(platforms);
      if (under) {
        this.ground = under;
        p.y = under.center.y + under.size.y / 2;
        v.y = 0;
      } else {
        this.grounded = false;
        this.ground = null;
        this.coyote = this.coyoteTime;
        if (!this.jumped) this.onFall?.();
      }
    } else if (v.y <= 0) {
      // Falling: catch the highest top the feet crossed this step.
      let landed: PlatformLike | null = null;
      let landTop = -Infinity;
      for (const box of platforms) {
        if (!this.overFootprint(box)) continue;
        const top = box.center.y + box.size.y / 2;
        if (prevFeet >= top - 1e-3 && p.y <= top && top > landTop) {
          landed = box;
          landTop = top;
        }
      }
      if (landed) {
        const impact = -v.y;
        p.y = landTop;
        v.y = 0;
        this.grounded = true;
        this.ground = landed;
        this.jumped = false;
        this.canCut = false;
        this.onLand?.(impact);
      }
    } else {
      // Rising: ceilings end jumps.
      const prevHead = prevFeet + this.height;
      const head = p.y + this.height;
      for (const box of platforms) {
        if (!this.overFootprint(box)) continue;
        const bottom = box.center.y - box.size.y / 2;
        if (prevHead <= bottom + 1e-3 && head >= bottom) {
          p.y = bottom - this.height;
          v.y = 0;
          break;
        }
      }
    }

    // The jump itself: buffered press meets ground (or its coyote shadow).
    if (this.buffer > 0 && (this.grounded || this.coyote > 0)) {
      v.y = this.jumpSpeed;
      this.grounded = false;
      this.ground = null;
      this.coyote = 0;
      this.buffer = 0;
      this.canCut = true;
      this.jumped = true;
      this.onJump?.();
    }

    this.coyote = Math.max(this.coyote - dt, 0);
    this.buffer = Math.max(this.buffer - dt, 0);
  }

  /** The highest platform still under the feet (within snap distance). */
  private support(platforms: ReadonlyArray<PlatformLike>): PlatformLike | null {
    let best: PlatformLike | null = null;
    let bestTop = -Infinity;
    for (const box of platforms) {
      if (!this.overFootprint(box)) continue;
      const top = box.center.y + box.size.y / 2;
      if (Math.abs(this.position.y - top) <= SNAP && top > bestTop) {
        best = box;
        bestTop = top;
      }
    }
    return best;
  }

  private overFootprint(box: PlatformLike): boolean {
    const reach = this.radius * 0.6;
    return (
      Math.abs(this.position.x - box.center.x) <= box.size.x / 2 + reach &&
      Math.abs(this.position.z - box.center.z) <= box.size.z / 2 + reach
    );
  }
}
