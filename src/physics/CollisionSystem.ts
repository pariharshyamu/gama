import type { GameObject } from '../core/GameObject';
import { checkCollisions, type CollisionPair } from './Collider';

/**
 * Tracks collider overlaps across frames and emits `collision-enter` /
 * `collision-exit` events on both GameObjects — so gameplay reacts to the
 * moment of contact instead of re-processing every frame of overlap.
 *
 * ```ts
 * const collisions = new CollisionSystem();
 * game.onUpdate(() => collisions.update(game.world.objects));
 * player.events.on('collision-enter', (other) => {
 *   if (other.tags.has('pickup')) collect(other);
 * });
 * ```
 */
export class CollisionSystem {
  private previous = new Map<string, CollisionPair>();

  /** Sweep colliders, emit enter/exit events, return current overlaps. */
  update(objects: Iterable<GameObject>): CollisionPair[] {
    const pairs = checkCollisions(objects);
    const current = new Map<string, CollisionPair>();
    for (const pair of pairs) current.set(this.key(pair), pair);

    for (const [key, [a, b]] of current) {
      if (!this.previous.has(key)) {
        a.events.emit('collision-enter', b);
        b.events.emit('collision-enter', a);
      }
    }
    for (const [key, [a, b]] of this.previous) {
      if (!current.has(key)) {
        a.events.emit('collision-exit', b);
        b.events.emit('collision-exit', a);
      }
    }
    this.previous = current;
    return pairs;
  }

  reset(): void {
    this.previous.clear();
  }

  private key([a, b]: CollisionPair): string {
    return a.id < b.id ? `${a.id}:${b.id}` : `${b.id}:${a.id}`;
  }
}
