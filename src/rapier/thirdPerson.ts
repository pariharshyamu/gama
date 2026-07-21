import { Vector2 } from 'three';
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
import { attachVisual, type CharacterModel, type GameContext } from '../templates/common';
import { PhysicsCharacterController, type PhysicsCharacterOptions } from './PhysicsCharacterController';
import type { PhysicsWorld } from './PhysicsWorld';

/** Feeds camera-relative input into a PhysicsCharacterController. */
class CameraRelativeIntent extends Component {
  private readonly axis = new Vector2();

  constructor(
    private input: Input,
    private controller: PhysicsCharacterController,
    private getYaw: () => number,
    private speed: number,
    private jumpKey: string | null
  ) {
    super();
  }

  override update(_time: Time): void {
    if (this.jumpKey && this.input.wasPressed(this.jumpKey)) this.controller.jump();
    const axis = this.input.moveAxis(this.axis);
    const yaw = this.getYaw();
    const sin = Math.sin(yaw);
    const cos = Math.cos(yaw);
    this.controller.moveIntent
      .set(cos * axis.x - sin * axis.y, 0, -sin * axis.x - cos * axis.y)
      .multiplyScalar(this.speed);
  }
}

export interface PhysicsThirdPersonOptions extends PhysicsCharacterOptions {
  name?: string;
  model?: CharacterModel;
  color?: number;
  cameraColliders?: import('three').Object3D[];
  cameraDistance?: number;
  pointerLock?: boolean;
  jumpKey?: string | null;
}

export interface PhysicsThirdPersonCharacter {
  object: GameObject;
  controller: PhysicsCharacterController;
  rig: ShoulderRig;
  animator?: Animator;
  locomotion?: Locomotion;
  dispose(): void;
}

/**
 * The physics-backed sibling of `createThirdPersonCharacter` (from
 * `gama3d/templates`): same shoulder camera, camera-relative movement and
 * auto-wired animation, but movement runs through rapier's character
 * controller — real slopes, stairs, snap-to-ground, and pushing crates.
 *
 * ```ts
 * const physics = await PhysicsWorld.create();
 * physics.attach(game);
 * const hero = createPhysicsThirdPersonCharacter(game, physics, {
 *   model: gltf,
 *   cameraColliders: [levelMesh],
 * });
 * ```
 */
export function createPhysicsThirdPersonCharacter(
  game: GameContext,
  physics: PhysicsWorld,
  options: PhysicsThirdPersonOptions = {}
): PhysicsThirdPersonCharacter {
  const object = game.world.spawn(options.name ?? 'player');
  object.tags.add('player');
  attachVisual(object, options.model, options.color);
  const standingY = (options.halfHeight ?? 0.5) + (options.radius ?? 0.4);
  if (object.position.y < standingY) object.position.y = standingY;

  const rig = new ShoulderRig(game.camera, object, game.input, {
    colliders: options.cameraColliders,
    distance: options.cameraDistance ?? 3.2,
  });
  // The controller reads moveIntent (set below), not raw input.
  const controller = object.addComponent(
    new PhysicsCharacterController(physics, undefined, options)
  );
  object.addComponent(
    new CameraRelativeIntent(
      game.input,
      controller,
      () => rig.yaw,
      options.speed ?? 6,
      options.jumpKey === undefined ? 'Space' : options.jumpKey
    )
  );

  let animator: Animator | undefined;
  let locomotion: Locomotion | undefined;
  const clips = options.model?.animations;
  if (clips && clips.length > 0) {
    animator = object.addComponent(new Animator(clips, options.model?.scene));
    locomotion = object.addComponent(
      new Locomotion(animator, controller, { clips: matchClips(clips) })
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
    controller,
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
