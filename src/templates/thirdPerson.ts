import { Vector2, Vector3 } from 'three';
import {
  Animator,
  Component,
  Locomotion,
  matchClips,
  ShoulderRig,
  type GameObject,
  type Input,
  type Time,
} from '../index';
import { attachVisual, type CharacterModel, type GameContext } from './common';

export interface ThirdPersonMovementOptions {
  speed?: number;
  /** Acceleration smoothing (higher = snappier). Default 12. */
  responsiveness?: number;
  jumpSpeed?: number;
  gravity?: number;
  /** Ground height for the built-in flat-ground jump arc. Default 0. */
  groundY?: number;
  /** Key that jumps (KeyboardEvent.code); null disables. Default 'Space'. */
  jumpKey?: string | null;
}

/**
 * Camera-relative planar movement with a simple flat-ground jump arc.
 * Reads WASD/stick, rotates it by the rig's yaw, faces travel, and
 * exposes velocity/grounded/verticalVelocity for Locomotion.
 */
export class ThirdPersonMovement extends Component {
  readonly velocity = new Vector3();
  grounded = true;
  verticalVelocity = 0;
  speed: number;
  responsiveness: number;
  jumpSpeed: number;
  gravity: number;
  groundY: number;
  jumpKey: string | null;

  private readonly axis = new Vector2();
  private readonly desired = new Vector3();

  constructor(
    private input: Input,
    private getYaw: () => number,
    options: ThirdPersonMovementOptions = {}
  ) {
    super();
    this.speed = options.speed ?? 6;
    this.responsiveness = options.responsiveness ?? 12;
    this.jumpSpeed = options.jumpSpeed ?? 8;
    this.gravity = options.gravity ?? 25;
    this.groundY = options.groundY ?? 0;
    this.jumpKey = options.jumpKey === undefined ? 'Space' : options.jumpKey;
  }

  jump(): void {
    if (this.grounded) {
      this.verticalVelocity = this.jumpSpeed;
      this.grounded = false;
    }
  }

  override update(time: Time): void {
    const dt = time.delta;
    if (dt <= 0) return;
    if (this.jumpKey && this.input.wasPressed(this.jumpKey)) this.jump();

    // Camera-relative: rotate the input axis by the rig's yaw.
    const axis = this.input.moveAxis(this.axis);
    const yaw = this.getYaw();
    const sin = Math.sin(yaw);
    const cos = Math.cos(yaw);
    this.desired
      .set(cos * axis.x - sin * axis.y, 0, -sin * axis.x - cos * axis.y)
      .multiplyScalar(this.speed);

    const blend = Math.min(1, this.responsiveness * dt);
    this.velocity.x += (this.desired.x - this.velocity.x) * blend;
    this.velocity.z += (this.desired.z - this.velocity.z) * blend;

    if (!this.grounded) {
      this.verticalVelocity -= this.gravity * dt;
      this.owner.position.y += this.verticalVelocity * dt;
      if (this.owner.position.y <= this.groundY) {
        this.owner.position.y = this.groundY;
        this.verticalVelocity = 0;
        this.grounded = true;
      }
    }
    this.velocity.y = this.verticalVelocity;
    this.owner.position.x += this.velocity.x * dt;
    this.owner.position.z += this.velocity.z * dt;

    if (this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z > 0.01) {
      const targetYaw = Math.atan2(this.velocity.x, this.velocity.z);
      const tau = Math.PI * 2;
      let diff = (targetYaw - this.owner.rotation.y) % tau;
      if (diff > Math.PI) diff -= tau;
      if (diff < -Math.PI) diff += tau;
      this.owner.rotation.y += diff * Math.min(1, 12 * dt);
    }
  }
}

export interface ThirdPersonOptions extends ThirdPersonMovementOptions {
  name?: string;
  /** GLTF-shaped model; a capsule person is used when omitted. */
  model?: CharacterModel;
  /** Capsule-person color when no model is given. */
  color?: number;
  /** Objects the camera must not clip through. */
  cameraColliders?: import('three').Object3D[];
  cameraDistance?: number;
  /** Request pointer lock on canvas click. Default true. */
  pointerLock?: boolean;
}

export interface ThirdPersonCharacter {
  object: GameObject;
  movement: ThirdPersonMovement;
  rig: ShoulderRig;
  animator?: Animator;
  locomotion?: Locomotion;
  dispose(): void;
}

/**
 * A playable third-person character in one call: shoulder camera with
 * mouse look and occlusion, camera-relative WASD/stick movement, jumping,
 * and — when a model with clips is provided — automatic idle/walk/run/
 * jump animation via Locomotion. Without a model you get the capsule
 * person, so it's playable before any assets exist.
 *
 * ```ts
 * const hero = createThirdPersonCharacter(game, {
 *   model: gltf,                 // optional
 *   cameraColliders: [levelMesh],
 * });
 * ```
 *
 * Every part is returned — replace or retune anything. When you outgrow
 * the options, copy this file into your project and edit (it's ~100
 * lines over public APIs; templates are conveniences, not a framework).
 */
export function createThirdPersonCharacter(
  game: GameContext,
  options: ThirdPersonOptions = {}
): ThirdPersonCharacter {
  const object = game.world.spawn(options.name ?? 'player');
  object.tags.add('player');
  attachVisual(object, options.model, options.color);

  const rig = new ShoulderRig(game.camera, object, game.input, {
    colliders: options.cameraColliders,
    distance: options.cameraDistance ?? 3.2,
  });
  const movement = object.addComponent(
    new ThirdPersonMovement(game.input, () => rig.yaw, options)
  );

  let animator: Animator | undefined;
  let locomotion: Locomotion | undefined;
  const clips = options.model?.animations;
  if (clips && clips.length > 0) {
    animator = object.addComponent(new Animator(clips, options.model?.scene));
    locomotion = object.addComponent(
      new Locomotion(animator, movement, { clips: matchClips(clips) })
    );
  }

  const stopRig = game.onUpdate((time) => rig.update(time.delta));
  const canvas = game.renderer?.domElement;
  const lock = () => canvas?.requestPointerLock?.();
  if ((options.pointerLock ?? true) && canvas?.addEventListener) {
    canvas.addEventListener('click', lock);
  }

  return {
    object,
    movement,
    rig,
    animator,
    locomotion,
    dispose() {
      stopRig();
      canvas?.removeEventListener?.('click', lock);
      object.destroy();
    },
  };
}
