import { describe, expect, it } from 'vitest';
import { Group, Mesh, Object3D } from 'three';
import { Catalog, LEVEL_VERSION, Level, type LevelData } from '../src';

/**
 * A catalog of stand-ins. Two shapes on purpose: `box` returns a raw
 * `Object3D`, `prop` returns `{ object }` the way every SCENA prop and
 * ANIMA rig does. Both have to work, because that is the handshake the
 * whole trilogy is built on.
 */
const catalog = () => {
  const made: string[] = [];
  const c = new Catalog()
    .define('box', (props) => {
      const o = new Mesh();
      o.name = String(props.label ?? 'box');
      made.push('box');
      return o;
    })
    .define('prop', (props, ctx) => {
      const group = new Group();
      group.name = `${ctx.kind}:${ctx.id}`;
      return { object: group, seedUsed: ctx.seed, props };
    })
    .define('lamp', () => new Object3D());
  return { c, made };
};

const level = (entities: LevelData['entities'], extra: Partial<LevelData> = {}): Level =>
  Level.parse({ format: 'gama.level', version: LEVEL_VERSION, entities, ...extra });

describe('Level', () => {
  it('round-trips: what goes in comes back out', () => {
    // The invariant an editor stands on. If this drifts, "save" is a lie.
    const source: LevelData = {
      format: 'gama.level',
      version: LEVEL_VERSION,
      name: 'Test Field',
      seed: 7,
      entities: [
        { id: 'a', kind: 'box', at: [1, 0, -2.5], rot: 1.5708, props: { label: 'crate' } },
        { id: 'b', kind: 'prop', at: [4, 0, 0], scale: 2, tags: ['spawn'] },
        { id: 'c', kind: 'lamp' },
      ],
    };
    const { c } = catalog();
    const live = Level.parse(source).instantiate(c, new Group());
    expect(live.serialize()).toEqual(source);
  });

  it('writes back what an editor actually moved', () => {
    const { c } = catalog();
    const parsed = level([{ id: 'a', kind: 'box', at: [0, 0, 0] }]);
    const live = parsed.instantiate(c, new Group());

    live.byId('a')!.object.position.set(3, 0, 4.25);
    live.byId('a')!.object.rotation.y = 0.5;
    live.byId('a')!.object.scale.setScalar(1.5);

    const [entity] = live.serialize().entities;
    expect(entity.at).toEqual([3, 0, 4.25]);
    expect(entity.rot).toBeCloseTo(0.5, 5);
    expect(entity.scale).toBe(1.5);
  });

  it('an unknown kind is kept, not quietly deleted', () => {
    // The failure this guards is somebody opening their level without a
    // plugin registered, saving, and losing half of it.
    const source: LevelData = {
      format: 'gama.level',
      version: LEVEL_VERSION,
      seed: 1,
      entities: [
        { id: 'a', kind: 'box', at: [1, 0, 0] },
        { id: 'x', kind: 'from-a-plugin-we-do-not-have', at: [9, 1, 2], props: { deep: { a: 1 } } },
        { id: 'b', kind: 'lamp', at: [0, 0, 3] },
      ],
    };
    const { c } = catalog();
    const live = Level.parse(source).instantiate(c, new Group());

    expect(live.objects).toHaveLength(2); // only two could be built…
    const out = live.serialize();
    expect(out.entities).toHaveLength(3); // …but all three survive the save
    expect(out.entities[1]).toEqual(source.entities[1]); // verbatim, in place
  });

  it('omits defaults and rounds, so a level file survives code review', () => {
    const { c } = catalog();
    const live = level([{ id: 'a', kind: 'box' }]).instantiate(c, new Group());
    live.byId('a')!.object.position.set(0.1 + 0.2, 0, 0);

    const [entity] = live.serialize().entities;
    expect(entity.at).toEqual([0.3, 0, 0]); // not 0.30000000000000004
    expect(entity).not.toHaveProperty('rot'); // an identity is not written
    expect(entity).not.toHaveProperty('scale');
    expect(entity).not.toHaveProperty('tags');
  });

  it('a yaw stays a yaw, and a real tumble becomes a triple', () => {
    const { c } = catalog();
    const live = level([
      { id: 'flat', kind: 'box' },
      { id: 'tumbled', kind: 'box' },
    ]).instantiate(c, new Group());
    live.byId('flat')!.object.rotation.set(0, 1.2, 0);
    live.byId('tumbled')!.object.rotation.set(0.4, 1.2, 0);

    const out = live.serialize().entities;
    expect(typeof out[0].rot).toBe('number'); // hand-editable, and smaller
    expect(Array.isArray(out[1].rot)).toBe(true);
  });

  it('nests children in the parent\'s space and round-trips them too', () => {
    const source: LevelData = {
      format: 'gama.level',
      version: LEVEL_VERSION,
      seed: 3,
      entities: [
        {
          id: 'house',
          kind: 'prop',
          at: [10, 0, 0],
          children: [{ id: 'house/lamp', kind: 'lamp', at: [2, 0, 1] }],
        },
      ],
    };
    const root = new Group();
    const { c } = catalog();
    const live = Level.parse(source).instantiate(c, root);

    const lamp = live.byId('house/lamp')!;
    expect(lamp.object.parent).toBe(live.byId('house')!.object); // a child, really
    expect(lamp.object.position.x).toBe(2); // local, not world
    expect(live.serialize()).toEqual(source);
  });

  it('prefabs are recipes: the placement overrides, the children survive', () => {
    const { c } = catalog();
    c.prefab('cottage', {
      kind: 'prop',
      props: { roof: 'thatch', walls: 'plaster' },
      children: [{ kind: 'lamp', at: [2, 0, 0] }],
    });

    const live = level([
      { id: 'h1', kind: 'cottage', at: [5, 0, 5], props: { roof: 'tile' } },
    ]).instantiate(c, new Group());

    const house = live.byId('h1')!;
    expect(house.object.position.x).toBe(5);
    // Override wins, the rest of the recipe stays.
    const source = house.source as { props: Record<string, unknown> };
    expect(source.props).toEqual({ roof: 'tile', walls: 'plaster' });
    // And the recipe's children came along.
    expect(live.objects.some((p) => p.kind === 'lamp')).toBe(true);
  });

  it('names a prefab\'s children under their parent, not all the same thing', () => {
    // Found by an editor demo listing what it could select: every child a
    // prefab created carried the same fallback id, so `byId` returned the
    // first one and selecting the others was impossible.
    const { c } = catalog();
    c.prefab('pair', {
      kind: 'prop',
      children: [{ kind: 'lamp', at: [1, 0, 0] }, { kind: 'lamp', at: [-1, 0, 0] }],
    });
    const live = level([{ id: 'post', kind: 'pair' }]).instantiate(c, new Group());

    const ids = live.objects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length); // no duplicates
    expect(ids).toContain('post/lamp-0');
    expect(ids).toContain('post/lamp-1');
    expect(live.byId('post/lamp-1')!.object.position.x).toBe(-1);
  });

  it('gives every entity a deterministic seed it does not have to store', () => {
    const { c } = catalog();
    const build = () =>
      level([{ id: 'a', kind: 'prop' }], { seed: 42 })
        .instantiate(c, new Group())
        .byId('a')!.source as { seedUsed: number };

    const first = build().seedUsed;
    expect(build().seedUsed).toBe(first); // same level, same world

    const other = level([{ id: 'a', kind: 'prop' }], { seed: 43 })
      .instantiate(c, new Group())
      .byId('a')!.source as { seedUsed: number };
    expect(other.seedUsed).not.toBe(first); // a different level, a different one
  });

  it('finds things by tag, which is how gameplay reads a level', () => {
    const { c } = catalog();
    const live = level([
      { kind: 'box', tags: ['spawn'] },
      { kind: 'box', tags: ['pickup', 'gold'] },
      { kind: 'lamp' },
    ]).instantiate(c, new Group());

    expect(live.byTag('spawn')).toHaveLength(1);
    expect(live.byTag('gold')).toHaveLength(1);
    expect(live.byTag('nobody')).toEqual([]);
  });

  it('assigns stable unique ids when a file does not carry them', () => {
    const { c } = catalog();
    const parsed = level([{ kind: 'box' }, { kind: 'box' }, { id: 'box-0', kind: 'lamp' }]);
    const ids = parsed.instantiate(c, new Group()).objects.map((p) => p.id);
    expect(new Set(ids).size).toBe(3); // no collisions with the explicit one
    expect(ids).toContain('box-0');
  });

  it('migrates an old file instead of refusing it', () => {
    // Levels are content. A save that no longer parses is somebody's work
    // thrown away, so the format upgrades rather than rejects.
    const old = { format: 'gama.level', version: 0, entities: [{ kind: 'box', pos: [1, 2, 3] }] };
    const parsed = Level.parse(old, {
      migrations: {
        0: (data) => ({
          ...data,
          version: 1,
          entities: data.entities.map((e) => {
            const { pos, ...rest } = e as typeof e & { pos?: [number, number, number] };
            return { ...rest, at: pos };
          }),
        }),
      },
    });
    expect(parsed.entities[0].at).toEqual([1, 2, 3]);
    expect(parsed.toJSON().version).toBe(LEVEL_VERSION);
  });

  it('refuses what is not a level, and what is from the future', () => {
    expect(() => Level.parse({ hello: 'world' })).toThrow(/not a gama level/);
    expect(() => Level.parse(null)).toThrow(/not an object/);
    expect(() =>
      Level.parse({ format: 'gama.level', version: 99, entities: [] })
    ).toThrow(/version 99/);
    // An old file with no migration supplied says so, rather than loading
    // a shape the code no longer understands.
    expect(() => Level.parse({ format: 'gama.level', version: 0, entities: [] })).toThrow(
      /no migration/
    );
  });

  it('dispose takes the level back out of the scene', () => {
    const root = new Group();
    const { c } = catalog();
    const live = level([{ kind: 'box' }, { kind: 'prop' }]).instantiate(c, root);
    expect(root.children).toHaveLength(2);
    live.dispose();
    expect(root.children).toHaveLength(0);
  });
});
