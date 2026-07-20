import { describe, expect, it } from 'vitest';
import { World } from '../src/core/World';
import { GameObject } from '../src/core/GameObject';
import { Pool } from '../src/core/Pool';

describe('Pool', () => {
  it('reuses released objects instead of creating new ones', () => {
    const world = new World();
    let created = 0;
    const pool = new Pool(world, {
      create: () => {
        created++;
        return new GameObject('bullet');
      },
    });

    const first = pool.acquire();
    pool.release(first);
    const second = pool.acquire();
    expect(second).toBe(first);
    expect(created).toBe(1);
  });

  it('adds acquired objects to the world and detaches released ones', () => {
    const world = new World();
    const pool = new Pool(world, { create: () => new GameObject() });

    const object = pool.acquire();
    expect(world.objects).toContain(object);
    expect(object.visible).toBe(true);

    pool.release(object);
    expect(world.objects).not.toContain(object);
    expect(world.scene.children).not.toContain(object);
    expect(object.visible).toBe(false);
    expect(pool.freeCount).toBe(1);
  });

  it('keeps components attached across release/acquire', () => {
    const world = new World();
    const pool = new Pool(world, { create: () => new GameObject() });
    const object = pool.acquire();
    const before = object.components.length;
    pool.release(object);
    pool.acquire();
    expect(object.components.length).toBe(before);
  });

  it('runs onAcquire/onRelease hooks and ignores double release', () => {
    const world = new World();
    const log: string[] = [];
    const pool = new Pool(world, {
      create: () => new GameObject(),
      onAcquire: () => log.push('acquire'),
      onRelease: () => log.push('release'),
    });
    const object = pool.acquire();
    pool.release(object);
    pool.release(object);
    expect(log).toEqual(['acquire', 'release']);
  });

  it('warm() pre-creates inactive objects', () => {
    const world = new World();
    let created = 0;
    const pool = new Pool(world, {
      create: () => {
        created++;
        return new GameObject();
      },
    });
    pool.warm(3);
    expect(created).toBe(3);
    expect(pool.freeCount).toBe(3);
    expect(world.objects).toHaveLength(0);
    pool.acquire();
    expect(created).toBe(3);
  });
});
