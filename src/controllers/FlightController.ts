import { Vector3, type Object3D } from 'three';

export interface FlightControls {
  /** Stick back = 1 (nose up), forward = -1. */
  pitch?: number;
  /** Stick right = 1 (right wing down). */
  roll?: number;
  /** Rudder right = 1. */
  yaw?: number;
}

export interface FlightControllerOptions {
  /** Top speed at full throttle, m/s. Default 40. */
  maxSpeed?: number;
  /** Below this, wings stop flying. Default 12. */
  stallSpeed?: number;
  /** Speed at which the nose can lift off the ground. Default 14. */
  rotateSpeed?: number;
  /** Throttle response, higher = snappier. Default 0.5. */
  acceleration?: number;
  /** Pitch rate at full stick, rad/s. Default 0.9. */
  pitchRate?: number;
  /** Roll rate at full stick, rad/s. Default 1.8. */
  rollRate?: number;
  /** How strongly bank turns the nose. Default 0.9. */
  turnCoupling?: number;
  /** Ground height (flat world). Default 0. */
  ground?: number;
  onTakeoff?: () => void;
  /** Touchdown, with the sink rate (m/s, positive down) — judge it yourself. */
  onLand?: (sinkRate: number) => void;
  onStall?: () => void;
}

const MAX_STEP = 1 / 60;
const MAX_BANK = 1.15;
const MAX_PITCH = 0.7;
const G = 9.8;

/**
 * FlightController — arcade-honest fixed-wing flight.
 *
 * The trilogy's flight model keeps exactly the physics a player can
 * FEEL and nothing they can't: throttle buys speed, speed buys lift,
 * **bank-to-turn** (roll and pull — the thing that makes flight feel
 * like flight), an energy trade (climbing costs speed, diving returns
 * it), and the one rule that gives the sky its stakes: below stall
 * speed **the wings stop flying** — the nose drops, the ground gets
 * closer, and only airspeed buys it back.
 *
 * On the ground it taxis: rudder steers, wheels grip, and nothing
 * flies until `rotateSpeed` — then stick back and the runway lets go.
 *
 * ```ts
 * const flight = new FlightController({ onLand: (sink) => feel.shake(sink / 20) });
 * game.onUpdate((t) => {
 *   flight.throttle = input.throttle;
 *   flight.control({ pitch: stick.y, roll: stick.x });
 *   flight.update(t.delta);
 *   flight.apply(planeMesh);                    // pose the airframe
 *   plane.update(t.delta, flight.aircraftInput); // SCENA plane shows it
 * });
 * ```
 */
export class FlightController {
  readonly position = new Vector3();
  readonly velocity = new Vector3();
  /** Airspeed along the flight path, m/s. */
  speed = 0;
  /** Heading, radians (0 = +z, like everything here). */
  heading = 0;
  /** Flight-path pitch, radians (+ = climbing). */
  pitch = 0;
  /** Bank, radians (+ = right wing down). */
  bank = 0;
  throttle = 0;
  grounded = true;
  stalled = false;

  maxSpeed: number;
  stallSpeed: number;
  rotateSpeed: number;
  acceleration: number;
  pitchRate: number;
  rollRate: number;
  turnCoupling: number;
  ground: number;

  private stickPitch = 0;
  private stickRoll = 0;
  private stickYaw = 0;
  private readonly onTakeoff?: () => void;
  private readonly onLand?: (sinkRate: number) => void;
  private readonly onStall?: () => void;

  constructor(options: FlightControllerOptions = {}) {
    this.maxSpeed = options.maxSpeed ?? 40;
    this.stallSpeed = options.stallSpeed ?? 12;
    this.rotateSpeed = options.rotateSpeed ?? 14;
    this.acceleration = options.acceleration ?? 0.5;
    this.pitchRate = options.pitchRate ?? 0.9;
    this.rollRate = options.rollRate ?? 1.8;
    this.turnCoupling = options.turnCoupling ?? 0.9;
    this.ground = options.ground ?? 0;
    this.position.y = this.ground;
    this.onTakeoff = options.onTakeoff;
    this.onLand = options.onLand;
    this.onStall = options.onStall;
  }

  /** The stick, -1..1 per axis. Call every frame you're flying. */
  control(controls: FlightControls): void {
    const clamp = (v: number | undefined): number =>
      Math.min(Math.max(Number.isFinite(v as number) ? (v as number) : 0, -1), 1);
    this.stickPitch = clamp(controls.pitch);
    this.stickRoll = clamp(controls.roll);
    this.stickYaw = clamp(controls.yaw);
  }

  /** Ready to hand to a SCENA plane's `update` — the airframe shows the stick. */
  get aircraftInput(): {
    throttle: number;
    pitch: number;
    roll: number;
    yaw: number;
    gearDown: boolean;
  } {
    return {
      throttle: this.throttle,
      pitch: this.stickPitch,
      roll: this.stickRoll,
      yaw: this.stickYaw,
      // Gear down whenever low and slow — an arcade autopilot's one chore.
      gearDown: this.grounded || this.position.y - this.ground < 8 || this.speed < this.stallSpeed + 6,
    };
  }

  /** Pose an Object3D from the flight state (position + yaw/pitch/roll). */
  apply(object: Object3D): void {
    object.position.copy(this.position);
    object.rotation.set(0, 0, 0);
    object.rotateY(this.heading);
    object.rotateX(-this.pitch);
    object.rotateZ(-this.bank);
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
    const throttle = Math.min(Math.max(this.throttle, 0), 1);

    // Speed: chase the throttle, pay for the climb, collect from the dive.
    const target = throttle * this.maxSpeed;
    this.speed += (target - this.speed) * Math.min(this.acceleration * dt, 1);
    if (!this.grounded) this.speed -= Math.sin(this.pitch) * G * 0.55 * dt;
    if (this.grounded && throttle < 0.05) {
      this.speed = Math.max(this.speed - 6 * dt, 0); // brakes and grass
    }
    this.speed = Math.max(this.speed, 0);

    if (this.grounded) {
      // Taxi: rudder steers, wings stay level, nose stays down…
      this.bank = 0;
      this.pitch = Math.max(this.pitch - 1.2 * dt, 0);
      this.heading += this.stickYaw * 0.9 * Math.min(this.speed / 6, 1) * dt;
      // …until rotation speed and a pull on the stick.
      if (this.speed >= this.rotateSpeed && this.stickPitch > 0.15) {
        this.grounded = false;
        this.pitch = 0.12;
        this.onTakeoff?.();
      }
    } else {
      // The stick.
      this.bank += this.stickRoll * this.rollRate * dt;
      this.bank = Math.min(Math.max(this.bank, -MAX_BANK), MAX_BANK);
      if (Math.abs(this.stickRoll) < 0.05) this.bank *= Math.max(1 - 0.8 * dt, 0);
      this.pitch += this.stickPitch * this.pitchRate * dt;
      this.pitch = Math.min(Math.max(this.pitch, -MAX_PITCH), MAX_PITCH);

      // Bank-to-turn, with a whisper of rudder.
      const flying = Math.min(this.speed / this.stallSpeed, 1);
      this.heading += (-Math.sin(this.bank) * this.turnCoupling * flying + this.stickYaw * 0.25) * dt;

      // The stall: below stall speed the wings stop flying.
      if (this.speed < this.stallSpeed) {
        if (!this.stalled) {
          this.stalled = true;
          this.onStall?.();
        }
        this.pitch = Math.max(this.pitch - 1.1 * dt, -0.55); // the nose drops
        this.position.y -= (1 - flying) * G * 0.8 * dt * 2;  // and the sky lets go
      } else {
        this.stalled = false;
      }
    }

    // Fly the path.
    const cosPitch = Math.cos(this.pitch);
    this.velocity.set(
      Math.sin(this.heading) * cosPitch * this.speed,
      this.grounded ? 0 : Math.sin(this.pitch) * this.speed,
      Math.cos(this.heading) * cosPitch * this.speed
    );
    this.position.addScaledVector(this.velocity, dt);

    // The ground is not optional.
    if (!this.grounded && this.position.y <= this.ground) {
      const sink = Math.max(-this.velocity.y, 0);
      this.position.y = this.ground;
      this.grounded = true;
      this.stalled = false;
      this.bank = 0;
      this.pitch = 0;
      this.onLand?.(sink);
    }
    if (this.grounded) this.position.y = this.ground;
  }
}
