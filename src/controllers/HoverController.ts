import { Vector3, type Object3D } from 'three';

export interface HoverControls {
  /** Climb (+1) / descend (-1). Nothing lifts until the rotor is spooled. */
  collective?: number;
  /** Cyclic forward (+1 = nose down, move ahead). */
  cyclicPitch?: number;
  /** Cyclic right (+1). */
  cyclicRoll?: number;
  /** Pedals: yaw rate, right = +1. */
  pedal?: number;
}

export interface HoverControllerOptions {
  /** Top translational speed, m/s. Default 9. */
  maxSpeed?: number;
  /** Top climb/descent rate, m/s. Default 3.5. */
  maxClimb?: number;
  /** Yaw rate at full pedal, rad/s. Default 1.3. */
  yawRate?: number;
  /** How snappily velocities chase the cyclic. Default 1.6. */
  responsiveness?: number;
  /** Hover drift amplitude, metres — a REAL hover is never still. Default 0.35. */
  drift?: number;
  /** Ground height. Default 0. */
  ground?: number;
  seed?: number;
  onTakeoff?: () => void;
  /** Touchdown with the sink rate (m/s) — a one is gentle, a five bends skids. */
  onLand?: (sinkRate: number) => void;
}

const MAX_STEP = 1 / 60;

/**
 * HoverController — helicopter flight in the arcade-honest register.
 *
 * Collective climbs, cyclic tilts-to-translate in the heading frame,
 * pedals yaw — and the rotor has INERTIA: `spool` commands it up over
 * seconds, and nothing lifts until it's singing. The signature detail
 * is the **hover drift**: with the stick centred, a real helicopter
 * wanders — a seeded breath of motion that keeps a "perfectly still"
 * hover from reading as a screenshot. Same seed, same wander.
 *
 * ```ts
 * const hover = new HoverController({ seed: 4, onLand: (s) => feel.shake(s / 10) });
 * hover.spool = 1;
 * game.onUpdate((t) => {
 *   hover.control({ collective: stick.climb, cyclicPitch: stick.y, cyclicRoll: stick.x });
 *   hover.update(t.delta);
 *   hover.apply(heliMesh);
 *   heli.update(t.delta, hover.helicopterInput);  // the SCENA ship shows it
 * });
 * ```
 */
export class HoverController {
  readonly position = new Vector3();
  readonly velocity = new Vector3();
  heading = 0;
  /** Rotor spool target, 0..1 — the rotor chases it over ~3 s. */
  spool = 0;
  /** Actual rotor state, 0..1. */
  rotor = 0;
  grounded = true;

  maxSpeed: number;
  maxClimb: number;
  yawRate: number;
  responsiveness: number;
  drift: number;
  ground: number;

  private collective = 0;
  private cyclicPitch = 0;
  private cyclicRoll = 0;
  private pedal = 0;
  private clock: number;
  private readonly seedPhase: number;
  private readonly onTakeoff?: () => void;
  private readonly onLand?: (sinkRate: number) => void;

  constructor(options: HoverControllerOptions = {}) {
    this.maxSpeed = options.maxSpeed ?? 9;
    this.maxClimb = options.maxClimb ?? 3.5;
    this.yawRate = options.yawRate ?? 1.3;
    this.responsiveness = options.responsiveness ?? 1.6;
    this.drift = options.drift ?? 0.35;
    this.ground = options.ground ?? 0;
    this.position.y = this.ground;
    const seed = options.seed ?? 1;
    this.clock = seed * 3.7;
    this.seedPhase = seed * 1.31;
    this.onTakeoff = options.onTakeoff;
    this.onLand = options.onLand;
  }

  control(controls: HoverControls): void {
    const clamp = (v: number | undefined): number =>
      Math.min(Math.max(Number.isFinite(v as number) ? (v as number) : 0, -1), 1);
    this.collective = clamp(controls.collective);
    this.cyclicPitch = clamp(controls.cyclicPitch);
    this.cyclicRoll = clamp(controls.cyclicRoll);
    this.pedal = clamp(controls.pedal);
  }

  /** Mirror for a SCENA helicopter's `update` — the ship shows the stick. */
  get helicopterInput(): { rotor: number; cyclicPitch: number; cyclicRoll: number } {
    return { rotor: this.spool, cyclicPitch: this.cyclicPitch, cyclicRoll: this.cyclicRoll };
  }

  /** Pose an airframe: position, heading, and a lean into the motion. */
  apply(object: Object3D): void {
    object.position.copy(this.position);
    object.rotation.set(0, 0, 0);
    object.rotateY(this.heading);
    // Lean with the cyclic and the actual velocity — ships tilt into travel.
    const lean = this.grounded ? 0 : 1;
    object.rotateX((this.cyclicPitch * 0.14 + this.velocity.z * 0.004) * lean);
    object.rotateZ((-this.cyclicRoll * 0.14 - this.velocity.x * 0.004) * lean);
  }

  update(dt: number): void {
    let remaining = Number.isFinite(dt) ? Math.min(Math.max(dt, 0), 0.25) : 0;
    while (remaining > 1e-9) {
      const step = Math.min(remaining, MAX_STEP);
      remaining -= step;
      this.substep(step);
    }
  }

  private substep(dt: number): void {
    this.clock += dt;
    const spoolTarget = Math.min(Math.max(this.spool, 0), 1);
    this.rotor += Math.min(Math.max(spoolTarget - this.rotor, -dt / 3), dt / 3);
    const flying = this.rotor > 0.9;

    if (this.grounded) {
      this.velocity.set(0, 0, 0);
      if (flying && this.collective > 0.15) {
        this.grounded = false;
        this.onTakeoff?.();
      }
      return;
    }

    // Cyclic translates in the heading frame; velocities chase it.
    const sin = Math.sin(this.heading);
    const cos = Math.cos(this.heading);
    const wantX = (this.cyclicRoll * cos + this.cyclicPitch * sin) * this.maxSpeed;
    const wantZ = (this.cyclicPitch * cos - this.cyclicRoll * sin) * this.maxSpeed;
    const blend = Math.min(this.responsiveness * dt, 1);
    this.velocity.x += (wantX - this.velocity.x) * blend;
    this.velocity.z += (wantZ - this.velocity.z) * blend;
    this.velocity.y += (this.collective * this.maxClimb - this.velocity.y) * blend;
    // A dying rotor stops holding you up.
    if (!flying) this.velocity.y = Math.min(this.velocity.y - 9.8 * dt * 0.6, this.velocity.y);

    this.heading += this.pedal * this.yawRate * dt;

    // The hover breath: seeded aperiodic wander, strongest hands-off.
    const idle =
      1 -
      Math.min(
        Math.abs(this.cyclicPitch) + Math.abs(this.cyclicRoll) + Math.abs(this.collective),
        1
      );
    const breathe = this.drift * idle;
    this.velocity.x += Math.sin(this.clock * 0.9 + this.seedPhase) *
      Math.sin(this.clock * 0.53) * breathe * dt * 2;
    this.velocity.z += Math.sin(this.clock * 0.77 + this.seedPhase * 2) *
      Math.sin(this.clock * 0.41) * breathe * dt * 2;
    this.velocity.y += Math.sin(this.clock * 1.13 + this.seedPhase) * breathe * dt * 1.2;

    this.position.addScaledVector(this.velocity, dt);

    if (this.position.y <= this.ground) {
      const sink = Math.max(-this.velocity.y, 0);
      this.position.y = this.ground;
      this.grounded = true;
      this.velocity.set(0, 0, 0);
      this.onLand?.(sink);
    }
  }
}
