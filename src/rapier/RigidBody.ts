import * as RAPIER from '@dimforge/rapier3d-compat';
import { BufferAttribute, Vector3, type BufferGeometry } from 'three';
import { Component } from '../core/Component';
import type { PhysicsWorld } from './PhysicsWorld';

export type RigidBodyType = 'dynamic' | 'fixed' | 'kinematic';

export type ColliderShape =
  | { shape: 'box'; halfExtents: Vector3 }
  | { shape: 'sphere'; radius: number }
  | { shape: 'capsule'; halfHeight: number; radius: number }
  | { shape: 'trimesh'; geometry: BufferGeometry };

export type ColliderOptions = ColliderShape & {
  friction?: number;
  restitution?: number;
  density?: number;
  /** Offset relative to the body origin. */
  offset?: Vector3;
  isSensor?: boolean;
};

export interface RigidBodyOptions {
  /** 'dynamic' (simulated), 'fixed' (static level geometry), or 'kinematic'
   *  (you move the GameObject; physics follows). Default 'dynamic'. */
  type?: RigidBodyType;
  collider: ColliderOptions | ColliderOptions[];
  /** Enable continuous collision detection for fast movers. */
  ccd?: boolean;
  /** Prevent the body from rotating (upright enemies, pushable crates). */
  lockRotations?: boolean;
  linearDamping?: number;
  angularDamping?: number;
}

/**
 * Binds a rapier rigid body to a GameObject. On attach, the body is
 * created at the object's current transform. Every fixed step:
 *
 * - **dynamic** bodies write their simulated transform to the GameObject;
 * - **kinematic** bodies read the GameObject's transform into physics
 *   (move the object, physics pushes things out of the way);
 * - **fixed** bodies do nothing (static level geometry).
 *
 * The GameObject is assumed to be top-level in the world (its local
 * transform is its world transform), which is the norm for physics
 * objects.
 */
export class RigidBody extends Component {
  body!: RAPIER.RigidBody;
  colliders: RAPIER.Collider[] = [];
  readonly type: RigidBodyType;

  constructor(private physics: PhysicsWorld, private options: RigidBodyOptions) {
    super();
    this.type = options.type ?? 'dynamic';
  }

  override onAttach(): void {
    const { options } = this;
    const desc =
      this.type === 'dynamic'
        ? RAPIER.RigidBodyDesc.dynamic()
        : this.type === 'kinematic'
          ? RAPIER.RigidBodyDesc.kinematicPositionBased()
          : RAPIER.RigidBodyDesc.fixed();

    const p = this.owner.position;
    const q = this.owner.quaternion;
    desc.setTranslation(p.x, p.y, p.z).setRotation({ x: q.x, y: q.y, z: q.z, w: q.w });
    if (options.ccd) desc.setCcdEnabled(true);
    if (options.lockRotations) desc.lockRotations();
    if (options.linearDamping !== undefined) desc.setLinearDamping(options.linearDamping);
    if (options.angularDamping !== undefined) desc.setAngularDamping(options.angularDamping);

    this.body = this.physics.raw.createRigidBody(desc);

    const colliders = Array.isArray(options.collider) ? options.collider : [options.collider];
    for (const c of colliders) {
      const colliderDesc = makeColliderDesc(c);
      if (c.friction !== undefined) colliderDesc.setFriction(c.friction);
      if (c.restitution !== undefined) colliderDesc.setRestitution(c.restitution);
      if (c.density !== undefined) colliderDesc.setDensity(c.density);
      if (c.isSensor) colliderDesc.setSensor(true);
      if (c.offset) colliderDesc.setTranslation(c.offset.x, c.offset.y, c.offset.z);
      this.colliders.push(this.physics.raw.createCollider(colliderDesc, this.body));
    }
  }

  override fixedUpdate(): void {
    if (this.type === 'dynamic') {
      const t = this.body.translation();
      const r = this.body.rotation();
      this.owner.position.set(t.x, t.y, t.z);
      this.owner.quaternion.set(r.x, r.y, r.z, r.w);
    } else if (this.type === 'kinematic') {
      const p = this.owner.position;
      const q = this.owner.quaternion;
      this.body.setNextKinematicTranslation({ x: p.x, y: p.y, z: p.z });
      this.body.setNextKinematicRotation({ x: q.x, y: q.y, z: q.z, w: q.w });
    }
  }

  applyImpulse(impulse: Vector3): void {
    this.body.applyImpulse({ x: impulse.x, y: impulse.y, z: impulse.z }, true);
  }

  setLinearVelocity(velocity: Vector3): void {
    this.body.setLinvel({ x: velocity.x, y: velocity.y, z: velocity.z }, true);
  }

  getLinearVelocity(target = new Vector3()): Vector3 {
    const v = this.body.linvel();
    return target.set(v.x, v.y, v.z);
  }

  /** Move the body (and owner) instantly, resetting velocities. */
  teleport(position: Vector3): void {
    this.body.setTranslation({ x: position.x, y: position.y, z: position.z }, true);
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    this.owner.position.copy(position);
  }

  override onDetach(): void {
    this.physics.raw.removeRigidBody(this.body);
    this.colliders.length = 0;
  }
}

function makeColliderDesc(options: ColliderShape): RAPIER.ColliderDesc {
  switch (options.shape) {
    case 'box': {
      const h = options.halfExtents;
      return RAPIER.ColliderDesc.cuboid(h.x, h.y, h.z);
    }
    case 'sphere':
      return RAPIER.ColliderDesc.ball(options.radius);
    case 'capsule':
      return RAPIER.ColliderDesc.capsule(options.halfHeight, options.radius);
    case 'trimesh': {
      const geometry = options.geometry;
      const position = geometry.getAttribute('position') as BufferAttribute;
      const vertices = new Float32Array(position.array);
      const indices = geometry.index
        ? new Uint32Array(geometry.index.array)
        : new Uint32Array(Array.from({ length: position.count }, (_, i) => i));
      const desc = RAPIER.ColliderDesc.trimesh(vertices, indices);
      if (!desc) throw new Error('Failed to build trimesh collider');
      return desc;
    }
  }
}
