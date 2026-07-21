import * as RAPIER from '@dimforge/rapier3d-compat';
import { Vector3 } from 'three';
import type { Game } from '../core/Game';

export interface PhysicsWorldOptions {
  gravity?: Vector3 | { x: number; y: number; z: number };
}

/**
 * GAMA's adapter around a rapier physics world. Rapier is an optional
 * peer dependency — this module lives behind the `gama3d/rapier` entry
 * point so the core library stays dependency-free.
 *
 * ```ts
 * import { PhysicsWorld, RigidBody } from 'gama3d/rapier';
 *
 * const physics = await PhysicsWorld.create();
 * physics.attach(game);            // steps at the game's fixed rate
 *
 * crate.addComponent(new RigidBody(physics, {
 *   type: 'dynamic',
 *   collider: { shape: 'box', halfExtents: new Vector3(0.5, 0.5, 0.5) },
 * }));
 * ```
 *
 * The raw `RAPIER.World` is exposed as `.raw` — ray casts, joints and
 * anything else rapier offers remain fully available.
 */
export class PhysicsWorld {
  readonly raw: RAPIER.World;

  private constructor(gravity: { x: number; y: number; z: number }) {
    this.raw = new RAPIER.World(gravity);
  }

  /** Initialize the rapier WASM module and create a world. */
  static async create(options: PhysicsWorldOptions = {}): Promise<PhysicsWorld> {
    await RAPIER.init();
    const g = options.gravity ?? { x: 0, y: -9.81, z: 0 };
    return new PhysicsWorld({ x: g.x, y: g.y, z: g.z });
  }

  /** Advance the simulation by `dt` seconds. */
  step(dt: number): void {
    this.raw.timestep = dt;
    this.raw.step();
  }

  /**
   * Step this world at the game's fixed rate. Physics runs *before*
   * component `fixedUpdate`s, so RigidBody components always sync fresh
   * transforms. Returns an unsubscribe.
   */
  attach(game: Game): () => void {
    return game.onFixedUpdate((time) => this.step(time.delta));
  }

  free(): void {
    this.raw.free();
  }
}
