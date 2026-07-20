import { Raycaster, Vector3, type Camera, type Object3D } from 'three';
import type { PointerLookInput } from './OrbitRig';

export interface ShoulderRigOptions {
  /** Camera distance behind the shoulder pivot. Default 3. */
  distance?: number;
  /** Pivot height above the target origin. Default 1.5. */
  height?: number;
  /** Lateral shoulder offset (+ = over the right shoulder). Default 0.6. */
  shoulder?: number;
  /** Radians per pixel of pointer movement. Default 0.003. */
  sensitivity?: number;
  minPitch?: number;
  maxPitch?: number;
  /** Objects the camera must not clip through (raycast occlusion). */
  colliders?: Object3D[];
  /** Gap kept between camera and blocking geometry. Default 0.2. */
  collisionMargin?: number;
  yaw?: number;
  pitch?: number;
}

/**
 * An over-the-shoulder third-person rig: mouse-look yaw/pitch around the
 * character with a lateral shoulder offset, and raycast occlusion that
 * pulls the camera in front of walls. Designed for pointer lock:
 *
 * ```ts
 * const rig = new ShoulderRig(game.camera, hero, game.input, {
 *   colliders: [levelMesh],
 * });
 * game.renderer.domElement.addEventListener('click', () =>
 *   game.renderer.domElement.requestPointerLock()
 * );
 * game.onUpdate((t) => rig.update(t.delta));
 * hero.rotation.y = rig.yaw; // aim character with camera
 * ```
 *
 * `rig.forward` / `rig.yaw` give the flattened look direction for
 * camera-relative movement.
 */
export class ShoulderRig {
  yaw: number;
  pitch: number;
  distance: number;
  height: number;
  shoulder: number;
  sensitivity: number;
  minPitch: number;
  maxPitch: number;
  colliders: Object3D[];
  collisionMargin: number;

  /** Flattened look direction on XZ (unit). Updated each frame. */
  readonly forward = new Vector3(0, 0, -1);

  private readonly pivot = new Vector3();
  private readonly back = new Vector3();
  private readonly desired = new Vector3();
  private readonly raycaster = new Raycaster();

  constructor(
    public camera: Camera,
    public target: Object3D,
    private input: PointerLookInput,
    options: ShoulderRigOptions = {}
  ) {
    this.distance = options.distance ?? 3;
    this.height = options.height ?? 1.5;
    this.shoulder = options.shoulder ?? 0.6;
    this.sensitivity = options.sensitivity ?? 0.003;
    this.minPitch = options.minPitch ?? -1.1;
    this.maxPitch = options.maxPitch ?? 1.1;
    this.colliders = options.colliders ?? [];
    this.collisionMargin = options.collisionMargin ?? 0.2;
    this.yaw = options.yaw ?? 0;
    this.pitch = options.pitch ?? 0.15;
    this.update(0);
  }

  update(_dt: number): void {
    this.yaw -= this.input.pointerDelta.x * this.sensitivity;
    this.pitch += this.input.pointerDelta.y * this.sensitivity;
    this.pitch = Math.min(this.maxPitch, Math.max(this.minPitch, this.pitch));

    const sinYaw = Math.sin(this.yaw);
    const cosYaw = Math.cos(this.yaw);
    // Pivot: above the target, shifted sideways along the camera-right axis.
    this.pivot
      .copy(this.target.position)
      .add(this.desired.set(cosYaw * this.shoulder, this.height, -sinYaw * this.shoulder));

    const cp = Math.cos(this.pitch);
    this.back.set(sinYaw * cp, Math.sin(this.pitch), cosYaw * cp); // away from look dir
    this.desired.copy(this.pivot).addScaledVector(this.back, this.distance);

    let distance = this.distance;
    if (this.colliders.length > 0) {
      this.raycaster.set(this.pivot, this.back);
      this.raycaster.far = this.distance + this.collisionMargin;
      const hit = this.raycaster.intersectObjects(this.colliders, true)[0];
      if (hit) distance = Math.max(0.1, hit.distance - this.collisionMargin);
    }

    this.camera.position.copy(this.pivot).addScaledVector(this.back, distance);
    this.camera.lookAt(this.pivot);
    this.forward.set(-sinYaw * 1, 0, -cosYaw * 1);
  }
}
