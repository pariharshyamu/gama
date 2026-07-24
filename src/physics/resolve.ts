import { Vector3 } from 'three';
import type { GameObject } from '../core/GameObject';
import { SphereCollider } from './Collider';

export interface ResolveOptions {
  /**
   * Fraction of the overlap corrected per call (0–1). Lower is softer/
   * springier, 1 fully separates in one step. Default 1.
   */
  strength?: number;
  /**
   * Objects with this tag don't move when pushed (walls, parked cars) but
   * still push others. Default `'static'`.
   */
  staticTag?: string;
  /** Skip pairs where either collider is a trigger. Default true. */
  skipTriggers?: boolean;
}

/**
 * Push overlapping `SphereCollider` bodies apart on the XZ plane — the arcade
 * "things bump and can't pass through each other" that gameplay collision
 * detection alone doesn't give you (that only *reports* contact). Cars jostle,
 * crowds don't interpenetrate, a player can't drive through a rival.
 *
 * Not a physics engine — no momentum transfer, just positional separation
 * (weighted so tagged-static bodies hold their ground). Pair with
 * `CollisionSystem` for enter/exit events. Call each frame:
 *
 * ```ts
 * game.onUpdate(() => resolveCircleCollisions(game.world.objects));
 * ```
 *
 * Returns the number of pairs separated.
 */
export function resolveCircleCollisions(
  objects: Iterable<GameObject>,
  options: ResolveOptions = {}
): number {
  const strength = options.strength ?? 1;
  const staticTag = options.staticTag ?? 'static';
  const skipTriggers = options.skipTriggers ?? true;

  const bodies: Array<{ obj: GameObject; radius: number; fixed: boolean; trigger: boolean }> = [];
  for (const obj of objects) {
    const c = obj.getComponent(SphereCollider);
    if (!c || !c.enabled) continue;
    bodies.push({
      obj,
      radius: c.radius,
      fixed: obj.tags.has(staticTag),
      trigger: c.isTrigger,
    });
  }

  let resolved = 0;
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i];
      const b = bodies[j];
      if (skipTriggers && (a.trigger || b.trigger)) continue;
      if (a.fixed && b.fixed) continue;

      a.obj.getWorldPosition(pa);
      b.obj.getWorldPosition(pb);
      let dx = pb.x - pa.x;
      let dz = pb.z - pa.z;
      let distSq = dx * dx + dz * dz;
      const min = a.radius + b.radius;
      if (distSq >= min * min) continue; // no overlap
      // Degenerate exact overlap: pick a deterministic axis.
      if (distSq === 0) {
        dx = 1;
        dz = 0;
        distSq = 1;
      }
      const dist = Math.sqrt(distSq);
      const overlap = (min - dist) * strength;
      const nx = dx / dist;
      const nz = dz / dist;
      // Split the correction by who can move.
      const aShare = a.fixed ? 0 : b.fixed ? 1 : 0.5;
      const bShare = 1 - aShare;
      if (aShare > 0) {
        a.obj.position.x -= nx * overlap * aShare;
        a.obj.position.z -= nz * overlap * aShare;
      }
      if (bShare > 0) {
        b.obj.position.x += nx * overlap * bShare;
        b.obj.position.z += nz * overlap * bShare;
      }
      resolved++;
    }
  }
  return resolved;
}

const pa = new Vector3();
const pb = new Vector3();
