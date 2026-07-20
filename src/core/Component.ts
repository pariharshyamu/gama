import type { GameObject } from './GameObject';
import type { Time } from './Time';

/**
 * Base class for behaviours attached to a GameObject.
 * Lifecycle: `onAttach` when added, `update` every frame while enabled,
 * `onDetach` when removed or when the owner is destroyed.
 */
export abstract class Component {
  enabled = true;
  owner!: GameObject;

  onAttach(): void {}
  onDetach(): void {}
  update(_time: Time): void {}
  /** Called at the fixed simulation rate when the Game runs fixed steps. */
  fixedUpdate(_time: Time): void {}
}
