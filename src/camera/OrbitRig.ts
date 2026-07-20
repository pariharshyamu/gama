import { Vector3, type Camera, type Object3D, type Vector2 } from 'three';

/** The slice of Input the camera rigs read (minimal for testability). */
export interface PointerLookInput {
  pointerDelta: Vector2;
  wheelDelta: number;
  pointerDown: boolean;
}

export interface OrbitRigOptions {
  distance?: number;
  minDistance?: number;
  maxDistance?: number;
  /** Pitch limits in radians (0 = horizon, π/2 = top-down). */
  minPitch?: number;
  maxPitch?: number;
  /** Radians of rotation per pixel of pointer movement. Default 0.005. */
  sensitivity?: number;
  /** Wheel zoom rate. Default 1. */
  zoomSpeed?: number;
  /** Smoothing (higher = snappier). Default 10. */
  stiffness?: number;
  /** Point the camera orbits, relative to the target. Default (0, 1, 0). */
  lookOffset?: Vector3;
  /** Rotate only while the pointer is held down. Default true. */
  requireDrag?: boolean;
  /** Initial yaw/pitch in radians. */
  yaw?: number;
  pitch?: number;
}

/**
 * A drag-to-orbit camera rig around a (possibly moving) target — the
 * RTS/inspection/tavern-brawler camera. Smoothed yaw/pitch/zoom with
 * limits, driven by GAMA's Input (or anything matching PointerLookInput).
 *
 * ```ts
 * const rig = new OrbitRig(game.camera, hero, game.input, { distance: 10 });
 * game.onUpdate((t) => rig.update(t.delta));
 * ```
 */
export class OrbitRig {
  yaw: number;
  pitch: number;
  distance: number;

  minDistance: number;
  maxDistance: number;
  minPitch: number;
  maxPitch: number;
  sensitivity: number;
  zoomSpeed: number;
  stiffness: number;
  requireDrag: boolean;
  readonly lookOffset: Vector3;

  private currentYaw: number;
  private currentPitch: number;
  private currentDistance: number;
  private readonly pivot = new Vector3();

  constructor(
    public camera: Camera,
    public target: Object3D,
    private input: PointerLookInput,
    options: OrbitRigOptions = {}
  ) {
    this.distance = options.distance ?? 10;
    this.minDistance = options.minDistance ?? 2;
    this.maxDistance = options.maxDistance ?? 40;
    this.minPitch = options.minPitch ?? 0.1;
    this.maxPitch = options.maxPitch ?? 1.4;
    this.sensitivity = options.sensitivity ?? 0.005;
    this.zoomSpeed = options.zoomSpeed ?? 1;
    this.stiffness = options.stiffness ?? 10;
    this.requireDrag = options.requireDrag ?? true;
    this.lookOffset = options.lookOffset ?? new Vector3(0, 1, 0);
    this.yaw = options.yaw ?? 0;
    this.pitch = Math.min(this.maxPitch, Math.max(this.minPitch, options.pitch ?? 0.8));
    this.currentYaw = this.yaw;
    this.currentPitch = this.pitch;
    this.currentDistance = this.distance;
    this.apply();
  }

  update(dt: number): void {
    if (!this.requireDrag || this.input.pointerDown) {
      this.yaw -= this.input.pointerDelta.x * this.sensitivity;
      this.pitch += this.input.pointerDelta.y * this.sensitivity;
      this.pitch = Math.min(this.maxPitch, Math.max(this.minPitch, this.pitch));
    }
    if (this.input.wheelDelta !== 0) {
      this.distance *= Math.exp(this.input.wheelDelta * 0.001 * this.zoomSpeed);
      this.distance = Math.min(this.maxDistance, Math.max(this.minDistance, this.distance));
    }
    const blend = Math.min(1, this.stiffness * dt);
    this.currentYaw += (this.yaw - this.currentYaw) * blend;
    this.currentPitch += (this.pitch - this.currentPitch) * blend;
    this.currentDistance += (this.distance - this.currentDistance) * blend;
    this.apply();
  }

  /** Jump instantly to the target orientation (after teleports/cuts). */
  snap(): void {
    this.currentYaw = this.yaw;
    this.currentPitch = this.pitch;
    this.currentDistance = this.distance;
    this.apply();
  }

  private apply(): void {
    this.pivot.copy(this.target.position).add(this.lookOffset);
    const d = this.currentDistance;
    const cp = Math.cos(this.currentPitch);
    this.camera.position.set(
      this.pivot.x + d * cp * Math.sin(this.currentYaw),
      this.pivot.y + d * Math.sin(this.currentPitch),
      this.pivot.z + d * cp * Math.cos(this.currentYaw)
    );
    this.camera.lookAt(this.pivot);
  }
}
