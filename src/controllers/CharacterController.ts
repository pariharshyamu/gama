import { Vector3 } from 'three';
import { Component } from '../core/Component';
import type { Time } from '../core/Time';
import type { Input } from '../input/Input';

export interface CharacterControllerOptions {
  speed?: number;
  /** Acceleration/deceleration smoothing (higher = snappier). Default 12. */
  responsiveness?: number;
  /** Rotate the character to face movement. Default true. */
  faceMovement?: boolean;
  turnRate?: number;
}

/**
 * WASD/arrow-key ground movement on the XZ plane, with smoothed
 * acceleration and optional facing. The bread-and-butter player
 * controller for third-person and top-down games.
 */
export class CharacterController extends Component {
  readonly velocity = new Vector3();
  speed: number;
  responsiveness: number;
  faceMovement: boolean;
  turnRate: number;

  private readonly desired = new Vector3();

  constructor(private input: Input, options: CharacterControllerOptions = {}) {
    super();
    this.speed = options.speed ?? 6;
    this.responsiveness = options.responsiveness ?? 12;
    this.faceMovement = options.faceMovement ?? true;
    this.turnRate = options.turnRate ?? 12;
  }

  override update(time: Time): void {
    const dt = time.delta;
    const axis = this.input.moveAxis();
    // Screen-space forward is -Z in the default camera setup.
    this.desired.set(axis.x, 0, -axis.y).multiplyScalar(this.speed);

    const blend = Math.min(1, this.responsiveness * dt);
    this.velocity.lerp(this.desired, blend);
    this.owner.position.addScaledVector(this.velocity, dt);

    if (this.faceMovement && this.velocity.lengthSq() > 0.01) {
      const targetYaw = Math.atan2(this.velocity.x, this.velocity.z);
      const tau = Math.PI * 2;
      let diff = (targetYaw - this.owner.rotation.y) % tau;
      if (diff > Math.PI) diff -= tau;
      if (diff < -Math.PI) diff += tau;
      this.owner.rotation.y += diff * Math.min(1, this.turnRate * dt);
    }
  }
}
