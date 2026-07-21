import * as RAPIER from '@dimforge/rapier3d-compat';
import { Vector2, Vector3 } from 'three';
import { Component } from '../core/Component';
import type { Time } from '../core/Time';
import type { Input } from '../input/Input';
import type { PhysicsWorld } from './PhysicsWorld';

export interface PhysicsCharacterOptions {
  /** Capsule dimensions. Total height = 2 * (halfHeight + radius). */
  radius?: number;
  halfHeight?: number;
  /** Horizontal move speed in units/s. Default 6. */
  speed?: number;
  /** Initial upward velocity of a jump. Default 8. */
  jumpSpeed?: number;
  /** Downward acceleration. Default 25 (gamey; 9.81 feels floaty). */
  gravity?: number;
  /** Steepest walkable slope in radians. Default 50°. */
  maxSlopeClimbAngle?: number;
  /** Max step height climbed automatically (stairs). Default 0.5. */
  autostepHeight?: number;
  /** Snap-to-ground distance for walking down slopes. Default 0.3. */
  snapToGroundDistance?: number;
  /** Rotate the owner to face horizontal movement. Default true. */
  faceMovement?: boolean;
  /** Character pushes dynamic bodies it walks into. Default true. */
  pushDynamicBodies?: boolean;
}

/**
 * A physics-backed character controller: a kinematic capsule driven by
 * rapier's KinematicCharacterController. Handles slopes, stairs
 * (auto-step), snap-to-ground, gravity and jumping, and pushes dynamic
 * bodies out of the way — the real-game replacement for the planar
 * `CharacterController`.
 *
 * ```ts
 * const controller = player.addComponent(
 *   new PhysicsCharacterController(physics, game.input, { speed: 7 })
 * );
 * game.onUpdate(() => {
 *   if (game.input.wasPressed('Space')) controller.jump();
 * });
 * ```
 *
 * Pass `input` to drive it with WASD/left stick, or omit it and set
 * `moveIntent` (a world-space velocity, units/s) from your own AI or
 * network code each frame.
 */
export class PhysicsCharacterController extends Component {
  /** Desired world-space horizontal velocity; set each frame when no Input given. */
  readonly moveIntent = new Vector3();
  /** Actual velocity over the last fixed step (post-collision). */
  readonly velocity = new Vector3();
  grounded = false;
  /** Vertical velocity (gravity + jumps). */
  verticalVelocity = 0;

  speed: number;
  jumpSpeed: number;
  gravity: number;
  faceMovement: boolean;

  body!: RAPIER.RigidBody;
  collider!: RAPIER.Collider;
  private controller!: RAPIER.KinematicCharacterController;
  private readonly options: Required<
    Pick<
      PhysicsCharacterOptions,
      'radius' | 'halfHeight' | 'maxSlopeClimbAngle' | 'autostepHeight' | 'snapToGroundDistance' | 'pushDynamicBodies'
    >
  >;
  private jumpQueued = false;
  private readonly axis = new Vector2();
  private readonly desired = new Vector3();

  constructor(
    private physics: PhysicsWorld,
    private input?: Input,
    options: PhysicsCharacterOptions = {}
  ) {
    super();
    this.speed = options.speed ?? 6;
    this.jumpSpeed = options.jumpSpeed ?? 8;
    this.gravity = options.gravity ?? 25;
    this.faceMovement = options.faceMovement ?? true;
    this.options = {
      radius: options.radius ?? 0.4,
      halfHeight: options.halfHeight ?? 0.5,
      maxSlopeClimbAngle: options.maxSlopeClimbAngle ?? (50 * Math.PI) / 180,
      autostepHeight: options.autostepHeight ?? 0.5,
      snapToGroundDistance: options.snapToGroundDistance ?? 0.3,
      pushDynamicBodies: options.pushDynamicBodies ?? true,
    };
  }

  override onAttach(): void {
    const p = this.owner.position;
    const world = this.physics.raw;
    this.body = world.createRigidBody(
      RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(p.x, p.y, p.z)
    );
    this.collider = world.createCollider(
      RAPIER.ColliderDesc.capsule(this.options.halfHeight, this.options.radius),
      this.body
    );
    this.controller = world.createCharacterController(0.08);
    this.controller.setUp({ x: 0, y: 1, z: 0 });
    this.controller.setMaxSlopeClimbAngle(this.options.maxSlopeClimbAngle);
    this.controller.enableAutostep(this.options.autostepHeight, 0.2, true);
    this.controller.enableSnapToGround(this.options.snapToGroundDistance);
    this.controller.setApplyImpulsesToDynamicBodies(this.options.pushDynamicBodies);
  }

  /** Jump if grounded (queued for the next fixed step). */
  jump(): void {
    if (this.grounded) this.jumpQueued = true;
  }

  /** Teleport the character, clearing vertical velocity. */
  teleport(position: Vector3): void {
    this.body.setTranslation({ x: position.x, y: position.y, z: position.z }, true);
    this.owner.position.copy(position);
    this.verticalVelocity = 0;
  }

  override fixedUpdate(time: Time): void {
    const dt = time.delta;
    if (dt <= 0) return;

    if (this.input) {
      const axis = this.input.moveAxis(this.axis);
      this.moveIntent.set(axis.x, 0, -axis.y).multiplyScalar(this.speed);
    }

    if (this.jumpQueued) {
      this.verticalVelocity = this.jumpSpeed;
      this.jumpQueued = false;
    } else if (this.grounded && this.verticalVelocity < 0) {
      // Small downward bias keeps ground contact on slopes.
      this.verticalVelocity = -0.5;
    }
    this.verticalVelocity -= this.gravity * dt;

    this.desired
      .copy(this.moveIntent)
      .multiplyScalar(dt)
      .setY(this.verticalVelocity * dt);

    this.controller.computeColliderMovement(this.collider, this.desired);
    this.grounded = this.controller.computedGrounded();
    const movement = this.controller.computedMovement();

    const t = this.body.translation();
    const next = { x: t.x + movement.x, y: t.y + movement.y, z: t.z + movement.z };
    this.body.setNextKinematicTranslation(next);
    this.owner.position.set(next.x, next.y, next.z);
    this.velocity.set(movement.x / dt, movement.y / dt, movement.z / dt);

    // Hitting a ceiling: stop rising so we don't stick to it.
    if (this.verticalVelocity > 0 && movement.y < this.desired.y * 0.5) {
      this.verticalVelocity = 0;
    }

    if (this.faceMovement && this.moveIntent.lengthSq() > 0.01) {
      const targetYaw = Math.atan2(this.moveIntent.x, this.moveIntent.z);
      const tau = Math.PI * 2;
      let diff = (targetYaw - this.owner.rotation.y) % tau;
      if (diff > Math.PI) diff -= tau;
      if (diff < -Math.PI) diff += tau;
      this.owner.rotation.y += diff * Math.min(1, 12 * dt);
    }
  }

  override onDetach(): void {
    this.physics.raw.removeCharacterController(this.controller);
    this.physics.raw.removeRigidBody(this.body);
  }
}
