import {
  BoxGeometry,
  CapsuleGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  type AnimationClip,
  type Camera,
  type Object3D,
} from 'three';
import type { Time, World, Input, GameObject } from '../index';

/**
 * The slice of Game the templates need — structural, so templates work
 * with the real Game, an r3f bridge, or a test stub.
 */
export interface GameContext {
  world: World;
  camera: Camera;
  input: Input;
  onUpdate(callback: (time: Time) => void): () => void;
  renderer?: { domElement: HTMLElement };
}

/** A GLTF-shaped model: what loaders (and Assets.gltf) return. */
export interface CharacterModel {
  scene: Object3D;
  animations?: AnimationClip[];
}

/**
 * A procedural placeholder character (capsule + eyes + visor, facing +z —
 * GAMA's facing convention) so every template renders and plays without
 * any assets. Swap it for a real model via the template's `model` option.
 */
export function createCapsulePerson(color = 0x60a5fa): Group {
  const person = new Group();
  person.name = 'capsule-person';

  const body = new Mesh(
    new CapsuleGeometry(0.35, 0.9, 6, 12),
    new MeshStandardMaterial({ color })
  );
  body.position.y = 0.8; // feet at y = 0
  person.add(body);

  const eyeMaterial = new MeshStandardMaterial({ color: 0x0b0e14 });
  for (const side of [-1, 1]) {
    const eye = new Mesh(new SphereGeometry(0.06, 8, 8), eyeMaterial);
    eye.position.set(side * 0.13, 1.12, 0.3);
    person.add(eye);
  }
  const visor = new Mesh(new BoxGeometry(0.34, 0.05, 0.08), eyeMaterial);
  visor.position.set(0, 1.24, 0.31);
  person.add(visor);
  return person;
}

/** Attach the model's scene (or a colored capsule person) to an entity. */
export function attachVisual(
  object: GameObject,
  model: CharacterModel | undefined,
  color: number | undefined
): void {
  object.add(model ? model.scene : createCapsulePerson(color));
}
