import { Scene } from 'three';
import { GameObject } from './GameObject';
import type { Time } from './Time';

/**
 * Owns the three.js Scene and the set of live GameObjects.
 * Updates every object each frame and reaps destroyed ones afterwards,
 * so destroying an object mid-update is always safe.
 */
export class World {
  readonly scene = new Scene();
  readonly objects: GameObject[] = [];

  add(object: GameObject): GameObject {
    object.world = this;
    this.objects.push(object);
    this.scene.add(object);
    return object;
  }

  spawn(name?: string): GameObject {
    return this.add(new GameObject(name));
  }

  findByName(name: string): GameObject | undefined {
    return this.objects.find((o) => o.name === name);
  }

  findByTag(tag: string): GameObject[] {
    return this.objects.filter((o) => o.tags.has(tag));
  }

  update(time: Time): void {
    for (const object of this.objects) {
      if (!object.destroyed) object.update(time);
    }
    for (let i = this.objects.length - 1; i >= 0; i--) {
      const object = this.objects[i];
      if (object.destroyed) {
        this.objects.splice(i, 1);
        object.world = null;
        object.dispose();
      }
    }
  }

  clear(): void {
    for (const object of this.objects) object.dispose();
    this.objects.length = 0;
  }
}
