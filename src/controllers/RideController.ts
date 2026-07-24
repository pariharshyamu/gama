import { Object3D, Vector3 } from 'three';
import { EventEmitter } from '../core/EventEmitter';

/** What the rider is asking the horse for, in the range −1..1. */
export interface RideIntent {
  /** Forward ask. Positive urges on, negative asks to slow or back up. */
  urge: number;
  /** Rein: −1 left, +1 right. */
  rein: number;
  /** Halt — sit down and close the hands. */
  halt?: boolean;
}

export interface RideControllerOptions {
  /** Top speed the animal will offer, m/s. Default 12 (a good gallop). */
  topSpeed?: number;
  /** How fast it picks up, m/s². Default 3.2. */
  acceleration?: number;
  /** How fast it comes back, m/s². Default 5. */
  braking?: number;
  /** Rolling resistance when the rider asks for nothing, m/s². Default 1.8. */
  settle?: number;
  /** Turn rate at a walk, rad/s. Default 1.9. */
  agility?: number;
  /**
   * How much a horse resists being steered at speed, 0..1. A galloping
   * horse cannot turn like a walking one — it has too much of itself
   * going forwards. Default 0.72.
   */
  stiffness?: number;
  /**
   * Seconds the animal takes to answer the leg. A horse is not a machine:
   * there is a beat between the ask and the change. Default 0.25.
   */
  response?: number;
}

export interface RideEvents extends Record<string, unknown> {
  /** Speed crossed into a new band — hook the rider's seat to this. */
  speed: number;
  halt: undefined;
}

/**
 * Riding, as a control problem.
 *
 * A horse is not a car, and controlling one like a car is what makes most
 * game horses feel wrong. Three differences are worth modelling, and this
 * is all of them:
 *
 * - **It answers late.** There is a beat between the rider's ask and the
 *   horse's answer (`response`). Instant acceleration reads as a vehicle.
 * - **It steers less the faster it goes** (`stiffness`). A galloping horse
 *   carries too much of itself forward to turn sharply; a walking one can
 *   pivot almost on the spot. Constant turn rate is the second-biggest tell.
 * - **It slows down on its own.** Take your leg off and a horse comes back
 *   to a walk (`settle`); it does not coast forever.
 *
 * The gait itself is NOT chosen here — hand `speed` to ANIMA's
 * `QuadrupedLocomotion` and the animal picks the gait, exactly as it does
 * in life.
 *
 * ```ts
 * const ride = new RideController();
 * game.onUpdate((t) => {
 *   ride.update(t.delta, { urge: input.axis('throttle'), rein: input.axis('steer') });
 *   ride.applyTo(horseObject, t.delta);
 *   gaits.update(t.delta, ride.speed);       // ANIMA picks walk/trot/canter/gallop
 * });
 * ```
 */
export class RideController {
  readonly events = new EventEmitter<RideEvents>();
  readonly topSpeed: number;
  readonly acceleration: number;
  readonly braking: number;
  readonly settle: number;
  readonly agility: number;
  readonly stiffness: number;
  readonly response: number;

  /** Current ground speed, m/s. */
  speed = 0;
  /** Current heading, radians (0 = +z, the trilogy's facing convention). */
  heading = 0;

  private askedUrge = 0;
  private askedRein = 0;
  private readonly forward = new Vector3();

  constructor(options: RideControllerOptions = {}) {
    this.topSpeed = options.topSpeed ?? 12;
    this.acceleration = options.acceleration ?? 3.2;
    this.braking = options.braking ?? 5;
    this.settle = options.settle ?? 1.8;
    this.agility = options.agility ?? 1.9;
    this.stiffness = options.stiffness ?? 0.72;
    this.response = options.response ?? 0.25;
  }

  /** How much of the animal's range it is using, 0..1. */
  get effort(): number {
    return Math.max(0, Math.min(1, this.speed / this.topSpeed));
  }

  /** Advance the horse's own state from what the rider is asking. */
  update(dt: number, intent: RideIntent): void {
    // The horse answers late: ease the ask rather than applying it raw.
    const k = 1 - Math.exp(-dt / Math.max(0.016, this.response));
    this.askedUrge += (clamp(intent.urge, -1, 1) - this.askedUrge) * k;
    this.askedRein += (clamp(intent.rein, -1, 1) - this.askedRein) * k;

    const before = this.speed;
    if (intent.halt) {
      this.speed = Math.max(0, this.speed - this.braking * 1.6 * dt);
    } else if (this.askedUrge > 0.02) {
      this.speed += this.acceleration * this.askedUrge * dt;
    } else if (this.askedUrge < -0.02) {
      this.speed += this.braking * this.askedUrge * dt;
    } else {
      // Leg off: it comes back to a halt by itself.
      this.speed -= Math.sign(this.speed) * Math.min(Math.abs(this.speed), this.settle * dt);
    }
    this.speed = clamp(this.speed, -this.topSpeed * 0.18, this.topSpeed); // it can back up, slowly

    // Steering stiffens with speed — the faster it goes, the wider it turns.
    const ease = 1 - this.stiffness * this.effort;
    // A horse standing still does not spin on the spot either; it needs a
    // little way on before the rein does anything.
    const way = Math.min(1, Math.abs(this.speed) / 0.8);
    this.heading += this.askedRein * this.agility * ease * way * dt;

    if (before > 0.05 && this.speed <= 0.05) this.events.emit('halt', undefined);
    if (Math.abs(before - this.speed) > 1e-4) this.events.emit('speed', this.speed);
  }

  /** Move and turn an Object3D by this frame's motion. */
  applyTo(object: Object3D, dt: number): void {
    object.rotation.y = this.heading;
    this.forward.set(Math.sin(this.heading), 0, Math.cos(this.heading));
    object.position.addScaledVector(this.forward, this.speed * dt);
  }

  /** Put the animal back to a standstill facing `heading`. */
  reset(heading = 0): void {
    this.speed = 0;
    this.heading = heading;
    this.askedUrge = 0;
    this.askedRein = 0;
  }
}

const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));
