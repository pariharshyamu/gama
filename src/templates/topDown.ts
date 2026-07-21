import { Raycaster, Vector3, Mesh, MeshBasicMaterial } from 'three';
import {
  Animator,
  CharacterController,
  FollowCamera,
  Locomotion,
  matchClips,
  MotionAgent,
  NavMeshAgent,
  SphereCollider,
  type GameObject,
  type NavMesh,
} from '../index';
import { attachVisual, type CharacterModel, type GameContext } from './common';

export interface TopDownOptions {
  name?: string;
  model?: CharacterModel;
  color?: number;
  speed?: number;
  cameraOffset?: Vector3;
  /** Collider radius for pickups/triggers; 0 disables. Default 0.7. */
  colliderRadius?: number;
  /** Provide a NavMesh to get click-to-move instead of WASD control. */
  navMesh?: NavMesh;
}

export interface TopDownCharacter {
  object: GameObject;
  camera: FollowCamera;
  /** WASD mode only. */
  controller?: CharacterController;
  /** Click-to-move mode only. */
  agent?: MotionAgent;
  navAgent?: NavMeshAgent;
  animator?: Animator;
  locomotion?: Locomotion;
  dispose(): void;
}

/**
 * A top-down character with a smoothed follow camera, in two flavours:
 *
 * - **WASD** (default): CharacterController drives it directly.
 * - **Click-to-move**: pass `navMesh` and clicks pathfind — the ARPG
 *   scheme. The template raycasts clicks against the walkable surface
 *   and calls `navAgent.goTo`.
 *
 * ```ts
 * const hero = createTopDownCharacter(game, { navMesh });
 * hero.object.events.on('nav-arrived', openChest);
 * ```
 */
export function createTopDownCharacter(
  game: GameContext,
  options: TopDownOptions = {}
): TopDownCharacter {
  const object = game.world.spawn(options.name ?? 'player');
  object.tags.add('player');
  attachVisual(object, options.model, options.color);

  const camera = new FollowCamera(game.camera, object, {
    offset: options.cameraOffset ?? new Vector3(0, 12, 10),
  });
  const stopCamera = game.onUpdate((time) => camera.update(time.delta));

  const colliderRadius = options.colliderRadius ?? 0.7;
  if (colliderRadius > 0) object.addComponent(new SphereCollider(colliderRadius));

  const result: TopDownCharacter = {
    object,
    camera,
    dispose() {
      stopCamera();
      object.destroy();
    },
  };

  let source: { velocity: Vector3 };
  if (options.navMesh) {
    const agent = object.addComponent(
      new MotionAgent({ maxSpeed: options.speed ?? 7, maxForce: 40, planar: true })
    );
    const navAgent = object.addComponent(new NavMeshAgent(options.navMesh));
    result.agent = agent;
    result.navAgent = navAgent;
    source = agent;

    const canvas = game.renderer?.domElement;
    if (canvas?.addEventListener) {
      // Invisible pick surface built from the navmesh itself.
      const surface = new Mesh(
        options.navMesh.toBufferGeometry(),
        new MeshBasicMaterial({ visible: false })
      );
      object.world?.scene.add(surface);
      const raycaster = new Raycaster();
      const onClick = () => {
        raycaster.setFromCamera(game.input.pointerNdc, game.camera);
        const hit = raycaster.intersectObject(surface, false)[0];
        if (hit) navAgent.goTo(hit.point);
      };
      canvas.addEventListener('pointerdown', onClick);
      const baseDispose = result.dispose;
      result.dispose = () => {
        canvas.removeEventListener('pointerdown', onClick);
        surface.removeFromParent();
        baseDispose();
      };
    }
  } else {
    const controller = object.addComponent(
      new CharacterController(game.input, { speed: options.speed ?? 8 })
    );
    result.controller = controller;
    source = controller;
  }

  const clips = options.model?.animations;
  if (clips && clips.length > 0) {
    result.animator = object.addComponent(new Animator(clips, options.model?.scene));
    result.locomotion = object.addComponent(
      new Locomotion(result.animator, source, { clips: matchClips(clips) })
    );
  }

  return result;
}
