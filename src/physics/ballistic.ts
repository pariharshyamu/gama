import { Vector3, type Object3D } from 'three';

/**
 * The initial velocity that lobs a projectile from `from` to `to` over an
 * arc that peaks `peak` metres above the start. Solves the two halves of the
 * parabola independently (rise to the apex, then fall to the target height),
 * so it lands on `to` for any reachable target.
 */
export function ballisticVelocity(
  from: Vector3,
  to: Vector3,
  peak = 2,
  gravity = 18
): Vector3 {
  const h = Math.max(peak, to.y - from.y + 0.05); // apex must clear the target
  const vy = Math.sqrt(2 * gravity * h);
  const tUp = vy / gravity;
  const drop = from.y + h - to.y;
  const tDown = Math.sqrt(Math.max(0, 2 * drop) / gravity);
  const T = Math.max(1e-3, tUp + tDown);
  return new Vector3((to.x - from.x) / T, vy, (to.z - from.z) / T);
}

export interface ThrowOptions {
  /** Initial velocity, m/s. Provide this OR `to` (+ optional `peak`). */
  velocity?: Vector3;
  /** Target landing point (world). With `peak`, the velocity is solved for you. */
  to?: Vector3;
  /** Arc apex above the start when solving from `to`. Default 2. */
  peak?: number;
  /** Downward acceleration, m/s². Default 18 (snappy arcade). */
  gravity?: number;
  /** Tumble, rad/s. Default a gentle seeded-looking spin about x+y. */
  spin?: Vector3;
  /** Ground height to land on — a number or `(x, z) => y`. Default 0. */
  ground?: number | ((x: number, z: number) => number);
  /** Called once, when it lands (position clamped to the ground). */
  onLand?: (object: Object3D) => void;
}

const DEFAULT_SPIN = new Vector3(3.2, 1.1, 0);

/**
 * Throw an object along a ballistic arc — the release half of the carry verb.
 * Hand it an object already in world space (e.g. straight from ANIMA's
 * `Carry.putDown()`), and it integrates gravity + tumble until the object hits
 * the ground, then fires `onLand`. Returns a per-frame updater (like
 * `driveVehicle`) that reports `false` once it has landed.
 *
 * ```ts
 * const box = carry.putDown();                 // back in world space, mid-air
 * const fly = throwObject(box, { to: cartBed, peak: 2.4, onLand: () => stack(box) });
 * game.onUpdate((t) => { if (fly(t.delta)) return; });   // arc, tumble, land
 * ```
 */
export function throwObject(object: Object3D, options: ThrowOptions = {}): (dt: number) => boolean {
  const gravity = options.gravity ?? 18;
  const spin = options.spin ?? DEFAULT_SPIN;
  const groundAt =
    typeof options.ground === 'function'
      ? options.ground
      : (() => {
          const g = options.ground ?? 0;
          return () => g;
        })();

  const velocity = options.velocity
    ? options.velocity.clone()
    : options.to
      ? ballisticVelocity(object.position, options.to, options.peak, gravity)
      : new Vector3();

  let landed = false;
  return (dt: number): boolean => {
    if (landed || dt <= 0) return false;
    velocity.y -= gravity * dt;
    object.position.addScaledVector(velocity, dt);
    object.rotation.x += spin.x * dt;
    object.rotation.y += spin.y * dt;
    object.rotation.z += spin.z * dt;

    const floor = groundAt(object.position.x, object.position.z);
    if (object.position.y <= floor && velocity.y < 0) {
      object.position.y = floor;
      landed = true;
      options.onLand?.(object);
      return false;
    }
    return true;
  };
}
