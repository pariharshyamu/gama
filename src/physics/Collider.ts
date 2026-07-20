import { Box3, Sphere, Vector3 } from 'three';
import { Component } from '../core/Component';
import type { GameObject } from '../core/GameObject';

/**
 * Lightweight sphere collider for gameplay-level collision queries
 * (pickups, triggers, hit detection). This is intentionally not a physics
 * engine — for rigid-body dynamics, pair GAMA with rapier or cannon-es.
 */
export class SphereCollider extends Component {
  constructor(public radius = 1, public isTrigger = false) {
    super();
  }

  worldSphere(target = new Sphere()): Sphere {
    this.owner.getWorldPosition(target.center);
    target.radius = this.radius;
    return target;
  }

  intersects(other: SphereCollider): boolean {
    const a = this.worldSphere(sphereA);
    const b = other.worldSphere(sphereB);
    return a.center.distanceToSquared(b.center) <= (a.radius + b.radius) ** 2;
  }
}

const sphereA = new Sphere();
const sphereB = new Sphere();

/** Axis-aligned box collider, computed from a half-extent size. */
export class BoxCollider extends Component {
  constructor(public size = new Vector3(1, 1, 1), public isTrigger = false) {
    super();
  }

  worldBox(target = new Box3()): Box3 {
    const center = this.owner.getWorldPosition(centerScratch);
    target.setFromCenterAndSize(center, this.size);
    return target;
  }
}

const centerScratch = new Vector3();

export type CollisionPair = [GameObject, GameObject];

/**
 * Brute-force n² sphere-collision sweep — plenty for hundreds of gameplay
 * colliders. Call `check` each frame with the objects to test and handle
 * the returned overlapping pairs.
 */
export function checkCollisions(objects: Iterable<GameObject>): CollisionPair[] {
  const colliders: SphereCollider[] = [];
  for (const object of objects) {
    const c = object.getComponent(SphereCollider);
    if (c && c.enabled) colliders.push(c);
  }
  const pairs: CollisionPair[] = [];
  for (let i = 0; i < colliders.length; i++) {
    for (let j = i + 1; j < colliders.length; j++) {
      if (colliders[i].intersects(colliders[j])) {
        pairs.push([colliders[i].owner, colliders[j].owner]);
      }
    }
  }
  return pairs;
}
