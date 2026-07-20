import { describe, expect, it } from 'vitest';
import { EventEmitter } from '../src/core/EventEmitter';
import { World } from '../src/core/World';
import { SphereCollider } from '../src/physics/Collider';
import { CollisionSystem } from '../src/physics/CollisionSystem';
import type { GameObject } from '../src/core/GameObject';

describe('EventEmitter', () => {
  it('delivers payloads to listeners and unsubscribes cleanly', () => {
    const events = new EventEmitter<{ hit: number }>();
    const seen: number[] = [];
    const off = events.on('hit', (n) => seen.push(n));
    events.emit('hit', 1);
    off();
    events.emit('hit', 2);
    expect(seen).toEqual([1]);
  });

  it('once() fires exactly once', () => {
    const events = new EventEmitter<{ ping: undefined }>();
    let calls = 0;
    events.once('ping', () => calls++);
    events.emit('ping', undefined);
    events.emit('ping', undefined);
    expect(calls).toBe(1);
  });

  it('tolerates a listener unsubscribing itself during emit', () => {
    const events = new EventEmitter<{ tick: undefined }>();
    const seen: string[] = [];
    const offA = events.on('tick', () => {
      seen.push('a');
      offA();
    });
    events.on('tick', () => seen.push('b'));
    events.emit('tick', undefined);
    events.emit('tick', undefined);
    expect(seen).toEqual(['a', 'b', 'b']);
  });
});

describe('CollisionSystem', () => {
  function setup() {
    const world = new World();
    const a = world.spawn('a');
    a.addComponent(new SphereCollider(1));
    const b = world.spawn('b');
    b.addComponent(new SphereCollider(1));
    b.position.set(10, 0, 0);
    return { world, a, b, system: new CollisionSystem() };
  }

  it('emits enter once on contact, exit once on separation', () => {
    const { world, a, b, system } = setup();
    const log: string[] = [];
    a.events.on('collision-enter', (other: GameObject) => log.push(`enter:${other.name}`));
    a.events.on('collision-exit', (other: GameObject) => log.push(`exit:${other.name}`));

    system.update(world.objects); // apart
    b.position.set(1, 0, 0); // overlap
    system.update(world.objects);
    system.update(world.objects); // still overlapping — no repeat enter
    b.position.set(10, 0, 0); // apart again
    system.update(world.objects);
    system.update(world.objects);

    expect(log).toEqual(['enter:b', 'exit:b']);
  });

  it('emits on both objects of the pair', () => {
    const { world, a, b, system } = setup();
    let aGot: GameObject | null = null;
    let bGot: GameObject | null = null;
    a.events.on('collision-enter', (o: GameObject) => (aGot = o));
    b.events.on('collision-enter', (o: GameObject) => (bGot = o));
    b.position.set(0.5, 0, 0);
    system.update(world.objects);
    expect(aGot).toBe(b);
    expect(bGot).toBe(a);
  });

  it('emits destroyed event when an object is destroyed', () => {
    const world = new World();
    const object = world.spawn('doomed');
    let seen: GameObject | null = null;
    object.events.on('destroyed', (o) => (seen = o));
    object.destroy();
    object.destroy(); // idempotent — no second emit possible after clear
    expect(seen).toBe(object);
  });
});
