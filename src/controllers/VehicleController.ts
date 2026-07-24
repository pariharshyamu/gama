import { Vector2, Vector3 } from 'three';
import { Component } from '../core/Component';
import type { Time } from '../core/Time';
import type { Input } from '../input/Input';

/**
 * A vehicle's running gear — structurally identical to SCENA's `VehicleProp`
 * (car/bike/tractor/…), so this controller drives one without either library
 * importing the other. `speed` is m/s, `steer` a small front-wheel angle.
 */
export interface VehicleRunningGear {
  update(dt: number, input: { speed?: number; steer?: number }): void;
}

/** Raw driver intent, each component in [-1, 1]. */
export interface DriveIntent {
  /** Forward (1) … reverse (−1). */
  throttle: number;
  /** Right (1) … left (−1). */
  steer: number;
}

export interface VehicleControllerOptions {
  /** Top forward speed, m/s. Default 19. */
  topSpeed?: number;
  /** Top reverse speed, m/s. Default 6. */
  reverseSpeed?: number;
  /** Acceleration toward the target speed, m/s². Default 10. */
  accel?: number;
  /** Extra deceleration when braking against travel, m/s². Default 16. */
  braking?: number;
  /** Coast drag when off the throttle (fraction of speed per second). Default 1.1. */
  drag?: number;
  /** Peak steering rate at speed, rad/s. Default 1.75. */
  turnRate?: number;
  /** Speed (m/s) at which steering reaches full authority. Default 5. */
  fullSteerSpeed?: number;
  /**
   * The visual running gear to drive each frame (spins wheels, turns the
   * fronts). Optional — omit to move a bare object.
   */
  vehicle?: VehicleRunningGear;
  /**
   * Return true where the surface is slow (grass, gravel): speed bleeds off
   * fast off the racing line. Called with the vehicle's world x, z.
   */
  offTrack?: (x: number, z: number) => boolean;
  /** Off-track drag (fraction of speed per second). Default 2.2. */
  offTrackDrag?: number;
}

/**
 * A player-drivable kinematic car — the "motion" the racing benchmark was
 * missing. Feed it driver intent (throttle/steer in [-1, 1]) and it does the
 * rest: eager acceleration, coast drag, braking, reverse, speed-scaled
 * steering, optional off-track grip loss — moving and yawing its owner and
 * (if given one) driving the visual running gear so the wheels spin and the
 * fronts turn.
 *
 * ```ts
 * const car = createCar();              // SCENA
 * const body = game.world.spawn('player'); body.add(car.object);
 * const drive = body.addComponent(new VehicleController(game.input, { vehicle: car }));
 * // WASD + on-screen joystick both work — the controller reads input.moveAxis().
 * ```
 *
 * Attach it to a GameObject and the Game update loop advances it; or call
 * `step(dt)` yourself. Read `speed` for a HUD.
 */
export class VehicleController extends Component {
  speed = 0;
  topSpeed: number;
  reverseSpeed: number;
  accel: number;
  braking: number;
  drag: number;
  turnRate: number;
  fullSteerSpeed: number;
  vehicle?: VehicleRunningGear;
  offTrack?: (x: number, z: number) => boolean;
  offTrackDrag: number;

  /** Heading in radians (GAMA's +z facing). Mirrors `owner.rotation.y`. */
  heading = 0;

  private source: (() => DriveIntent) | null = null;
  private readonly axis = new Vector2();
  private readonly move = new Vector3();

  /**
   * @param input Optional — when given, intent defaults to `input.moveAxis()`
   *   (y = throttle, x = steer), so keyboard, gamepad and `TouchControls` all
   *   drive it. Override with `setIntentSource`.
   */
  constructor(private input?: Input, options: VehicleControllerOptions = {}) {
    super();
    this.topSpeed = options.topSpeed ?? 19;
    this.reverseSpeed = options.reverseSpeed ?? 6;
    this.accel = options.accel ?? 10;
    this.braking = options.braking ?? 16;
    this.drag = options.drag ?? 1.1;
    this.turnRate = options.turnRate ?? 1.75;
    this.fullSteerSpeed = options.fullSteerSpeed ?? 5;
    this.vehicle = options.vehicle;
    this.offTrack = options.offTrack;
    this.offTrackDrag = options.offTrackDrag ?? 2.2;
  }

  override onAttach(): void {
    this.heading = this.owner.rotation.y;
  }

  /** Provide custom driver intent (an AI, a network peer, a second stick). */
  setIntentSource(source: (() => DriveIntent) | null): this {
    this.source = source;
    return this;
  }

  private readIntent(): DriveIntent {
    if (this.source) return this.source();
    if (this.input) {
      const a = this.input.moveAxis(this.axis);
      return { throttle: a.y, steer: a.x };
    }
    return { throttle: 0, steer: 0 };
  }

  override update(time: Time): void {
    this.step(time.delta);
  }

  /** Advance the car one step (called by the Game loop via `update`). */
  step(dt: number): void {
    if (dt <= 0) return;
    const { throttle, steer } = this.readIntent();

    // Target speed and the rate we approach it (braking is quicker).
    const target = throttle >= 0 ? this.topSpeed * throttle : -this.reverseSpeed * -throttle;
    const opposing = Math.sign(target - this.speed) !== Math.sign(this.speed || target);
    const rate = throttle === 0 ? 0 : opposing ? this.braking : this.accel;
    if (throttle === 0) {
      this.speed *= Math.max(0, 1 - this.drag * dt);
    } else {
      this.speed += Math.sign(target - this.speed) * Math.min(Math.abs(target - this.speed), rate * dt);
    }

    // Steering: scales with speed and reverses in reverse; no spinning still.
    const authority = Math.min(1, Math.abs(this.speed) / this.fullSteerSpeed);
    this.heading -= steer * this.turnRate * dt * authority * Math.sign(this.speed || 1);

    // Off-track grip loss.
    const p = this.owner.position;
    if (this.offTrack && this.offTrack(p.x, p.z)) {
      this.speed *= Math.max(0, 1 - this.offTrackDrag * dt);
    }

    // Integrate on the XZ plane (facing +z).
    this.owner.rotation.y = this.heading;
    this.move.set(Math.sin(this.heading), 0, Math.cos(this.heading)).multiplyScalar(this.speed * dt);
    p.add(this.move);

    this.vehicle?.update(dt, { speed: Math.abs(this.speed), steer: steer * 0.5 });
  }

  /** Reposition and re-face the car (e.g. respawn on track). */
  reset(x: number, z: number, heading = this.heading): void {
    this.owner.position.set(x, this.owner.position.y, z);
    this.heading = heading;
    this.owner.rotation.y = heading;
    this.speed = 0;
  }
}
