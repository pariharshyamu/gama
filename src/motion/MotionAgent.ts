import { Vector3 } from 'three';
import { Component } from '../core/Component';
import type { Time } from '../core/Time';
import type { SteeringBehavior } from './steering';

export interface MotionAgentOptions {
  maxSpeed?: number;
  maxForce?: number;
  mass?: number;
  /** Rotate the owner to face the direction of travel. Default true. */
  faceVelocity?: boolean;
  /** Turn responsiveness when facing velocity (higher = snappier). Default 10. */
  turnRate?: number;
  /** Lock movement to the XZ plane (typical for ground units). Default false. */
  planar?: boolean;
}

/**
 * The heart of GAMA's motion layer: a steering-driven agent attached to a
 * GameObject. Each frame it sums the forces produced by its active steering
 * behaviors (weighted), clamps them to `maxForce`, integrates velocity with
 * `maxSpeed`, moves its owner and optionally turns it to face travel.
 *
 * ```ts
 * const agent = enemy.addComponent(new MotionAgent({ maxSpeed: 6 }));
 * agent.addBehavior(new Seek(player.position));
 * agent.addBehavior(new Separation(() => enemies), 1.5);
 * ```
 */
export class MotionAgent extends Component {
  readonly velocity = new Vector3();
  /** The clamped steering force applied last frame (useful for debugging). */
  readonly lastSteering = new Vector3();
  maxSpeed: number;
  maxForce: number;
  mass: number;
  faceVelocity: boolean;
  turnRate: number;
  planar: boolean;

  private behaviors: Array<{ behavior: SteeringBehavior; weight: number }> = [];
  private readonly steering = new Vector3();
  private readonly acceleration = new Vector3();

  constructor(options: MotionAgentOptions = {}) {
    super();
    this.maxSpeed = options.maxSpeed ?? 5;
    this.maxForce = options.maxForce ?? 10;
    this.mass = options.mass ?? 1;
    this.faceVelocity = options.faceVelocity ?? true;
    this.turnRate = options.turnRate ?? 10;
    this.planar = options.planar ?? false;
  }

  get position(): Vector3 {
    return this.owner.position;
  }

  addBehavior(behavior: SteeringBehavior, weight = 1): this {
    this.behaviors.push({ behavior, weight });
    return this;
  }

  removeBehavior(behavior: SteeringBehavior): void {
    this.behaviors = this.behaviors.filter((b) => b.behavior !== behavior);
  }

  clearBehaviors(): void {
    this.behaviors.length = 0;
  }

  override update(time: Time): void {
    const dt = time.delta;
    if (dt <= 0) return;

    this.steering.set(0, 0, 0);
    for (const { behavior, weight } of this.behaviors) {
      const force = behavior.calculate(this);
      this.steering.addScaledVector(force, weight);
    }
    this.steering.clampLength(0, this.maxForce);
    this.lastSteering.copy(this.steering);

    this.acceleration.copy(this.steering).divideScalar(this.mass);
    this.velocity.addScaledVector(this.acceleration, dt);
    if (this.planar) this.velocity.y = 0;
    this.velocity.clampLength(0, this.maxSpeed);

    this.position.addScaledVector(this.velocity, dt);

    if (this.faceVelocity && this.velocity.lengthSq() > 1e-6) {
      const targetYaw = Math.atan2(this.velocity.x, this.velocity.z);
      const t = Math.min(1, this.turnRate * dt);
      this.owner.rotation.y += shortestAngle(this.owner.rotation.y, targetYaw) * t;
    }
  }
}

function shortestAngle(from: number, to: number): number {
  const tau = Math.PI * 2;
  let diff = (to - from) % tau;
  if (diff > Math.PI) diff -= tau;
  if (diff < -Math.PI) diff += tau;
  return diff;
}
