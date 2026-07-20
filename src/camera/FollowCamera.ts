import { Vector3, type Camera, type Object3D } from 'three';

export interface FollowCameraOptions {
  /** Camera position relative to the target. Default (0, 8, 12). */
  offset?: Vector3;
  /** Point the camera looks at, relative to the target. Default (0, 1, 0). */
  lookOffset?: Vector3;
  /** Positional smoothing (higher = tighter follow). Default 5. */
  stiffness?: number;
}

/**
 * A smoothed third-person/top-down follow rig. Call `update(dt)` each
 * frame (e.g. inside `game.onUpdate`).
 */
export class FollowCamera {
  offset: Vector3;
  lookOffset: Vector3;
  stiffness: number;

  private readonly desired = new Vector3();
  private readonly lookTarget = new Vector3();

  constructor(public camera: Camera, public target: Object3D, options: FollowCameraOptions = {}) {
    this.offset = options.offset ?? new Vector3(0, 8, 12);
    this.lookOffset = options.lookOffset ?? new Vector3(0, 1, 0);
    this.stiffness = options.stiffness ?? 5;
    this.snap();
  }

  /** Jump instantly to the desired position (e.g. after a teleport). */
  snap(): void {
    this.camera.position.copy(this.target.position).add(this.offset);
    this.look();
  }

  update(dt: number): void {
    this.desired.copy(this.target.position).add(this.offset);
    this.camera.position.lerp(this.desired, Math.min(1, this.stiffness * dt));
    this.look();
  }

  private look(): void {
    this.lookTarget.copy(this.target.position).add(this.lookOffset);
    this.camera.lookAt(this.lookTarget);
  }
}
