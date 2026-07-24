import { Vector3, type Camera, type Object3D } from 'three';

export interface ChaseCameraOptions {
  /** How far behind the target to sit (metres). Default 9. */
  distance?: number;
  /** Camera height above the target. Default 4. */
  height?: number;
  /** How far ahead of the target to look. Default 4. */
  lookAhead?: number;
  /** Height of the look point above the target. Default 1. */
  lookHeight?: number;
  /** Positional smoothing (higher = tighter). Default 4. */
  stiffness?: number;
  /**
   * What "behind" means. `'heading'` (default) chases the target's facing
   * (`rotation.y`) — right for cars and steered bodies. `'velocity'` chases
   * the direction of travel, given a `{ velocity }` source via `setVelocitySource`.
   */
  mode?: 'heading' | 'velocity';
}

/**
 * A heading-aware chase camera: sits behind and above a target, looking
 * ahead of it, following as it turns. This is the third piece every action
 * demo used to hand-roll (the racer, the commute) — now one line.
 *
 * ```ts
 * const cam = new ChaseCamera(game.camera, car.object, { distance: 8.5, height: 4.4 });
 * game.onUpdate((t) => cam.update(t.delta));
 * ```
 *
 * GAMA's facing convention is +z, so at `rotation.y = 0` the camera sits at
 * −z (behind) looking toward +z.
 */
export class ChaseCamera {
  distance: number;
  height: number;
  lookAhead: number;
  lookHeight: number;
  stiffness: number;
  mode: 'heading' | 'velocity';

  private velocitySource: { velocity: Vector3 } | null = null;
  private readonly forward = new Vector3();
  private readonly desired = new Vector3();
  private readonly lookAt = new Vector3();

  constructor(public camera: Camera, public target: Object3D, options: ChaseCameraOptions = {}) {
    this.distance = options.distance ?? 9;
    this.height = options.height ?? 4;
    this.lookAhead = options.lookAhead ?? 4;
    this.lookHeight = options.lookHeight ?? 1;
    this.stiffness = options.stiffness ?? 4;
    this.mode = options.mode ?? 'heading';
    this.snap();
  }

  /** In `'velocity'` mode, the body whose travel direction to chase. */
  setVelocitySource(source: { velocity: Vector3 } | null): this {
    this.velocitySource = source;
    return this;
  }

  /** Jump straight to the ideal position (after a teleport or on spawn). */
  snap(): void {
    this.aim();
    this.camera.position.copy(this.desired);
    this.camera.lookAt(this.lookAt);
  }

  update(dt: number): void {
    this.aim();
    this.camera.position.lerp(this.desired, Math.min(1, this.stiffness * dt));
    this.camera.lookAt(this.lookAt);
  }

  private aim(): void {
    if (this.mode === 'velocity' && this.velocitySource && this.velocitySource.velocity.lengthSq() > 1e-4) {
      this.forward.copy(this.velocitySource.velocity).setY(0).normalize();
    } else {
      const yaw = this.target.rotation.y;
      this.forward.set(Math.sin(yaw), 0, Math.cos(yaw));
    }
    const p = this.target.position;
    this.desired.set(
      p.x - this.forward.x * this.distance,
      p.y + this.height,
      p.z - this.forward.z * this.distance
    );
    this.lookAt.set(
      p.x + this.forward.x * this.lookAhead,
      p.y + this.lookHeight,
      p.z + this.forward.z * this.lookAhead
    );
  }
}
