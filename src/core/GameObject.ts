import { Object3D } from 'three';
import { Component } from './Component';
import type { Time } from './Time';
import type { World } from './World';

type ComponentClass<T extends Component> = new (...args: never[]) => T;

/**
 * An entity in the game world. A GameObject *is* a three.js Object3D,
 * so it slots directly into the scene graph, and carries a list of
 * Components that give it behaviour.
 */
export class GameObject extends Object3D {
  readonly components: Component[] = [];
  readonly tags = new Set<string>();
  world: World | null = null;
  destroyed = false;

  constructor(name = 'GameObject') {
    super();
    this.name = name;
  }

  addComponent<T extends Component>(component: T): T {
    component.owner = this;
    this.components.push(component);
    component.onAttach();
    return component;
  }

  getComponent<T extends Component>(type: ComponentClass<T>): T | undefined {
    return this.components.find((c): c is T => c instanceof type);
  }

  requireComponent<T extends Component>(type: ComponentClass<T>): T {
    const c = this.getComponent(type);
    if (!c) throw new Error(`${this.name} is missing required component ${type.name}`);
    return c;
  }

  removeComponent(component: Component): void {
    const i = this.components.indexOf(component);
    if (i >= 0) {
      this.components.splice(i, 1);
      component.onDetach();
    }
  }

  update(time: Time): void {
    for (const c of this.components) {
      if (c.enabled) c.update(time);
    }
  }

  /** Remove from the world at the end of the current frame. */
  destroy(): void {
    this.destroyed = true;
  }

  /** Called by the World when the object is actually removed. */
  dispose(): void {
    for (const c of this.components) c.onDetach();
    this.components.length = 0;
    this.removeFromParent();
  }
}
