import type { GameObject } from './GameObject';
import type { World } from './World';

export interface PoolOptions<T extends GameObject> {
  create: () => T;
  /** Called each time an object is (re)activated. Reset transforms/state here. */
  onAcquire?: (object: T) => void;
  /** Called when an object is returned to the pool. */
  onRelease?: (object: T) => void;
}

/**
 * Reuses GameObjects instead of creating and destroying them — essential
 * for bullets, particles and pickups, where per-frame allocation causes
 * GC hitches. Released objects keep their components and are detached
 * from the world (not disposed).
 *
 * ```ts
 * const bullets = new Pool(game.world, { create: makeBullet });
 * const b = bullets.acquire();       // added to the world, visible
 * bullets.release(b);                // removed, hidden, kept for reuse
 * ```
 *
 * Use `pool.release(obj)`, not `obj.destroy()`, for pooled objects —
 * destroy() disposes components and defeats reuse.
 */
export class Pool<T extends GameObject> {
  readonly active = new Set<T>();
  private free: T[] = [];
  private options: PoolOptions<T>;

  constructor(private world: World, options: PoolOptions<T>) {
    this.options = options;
  }

  /** Pre-create `count` inactive objects up front (e.g. during loading). */
  warm(count: number): void {
    for (let i = 0; i < count; i++) {
      const object = this.options.create();
      object.visible = false;
      this.free.push(object);
    }
  }

  acquire(): T {
    const object = this.free.pop() ?? this.options.create();
    object.destroyed = false;
    object.visible = true;
    this.world.add(object);
    this.active.add(object);
    this.options.onAcquire?.(object);
    return object;
  }

  release(object: T): void {
    if (!this.active.delete(object)) return;
    this.options.onRelease?.(object);
    this.world.remove(object);
    object.visible = false;
    this.free.push(object);
  }

  releaseAll(): void {
    for (const object of [...this.active]) this.release(object);
  }

  get activeCount(): number {
    return this.active.size;
  }

  get freeCount(): number {
    return this.free.length;
  }
}
