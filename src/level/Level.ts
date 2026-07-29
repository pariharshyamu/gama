import { Object3D } from 'three';
import type { Catalog, Placed } from './Catalog';
import { LEVEL_VERSION, type EntitySpec, type LevelData, type Vec3Tuple } from './types';

/**
 * Level — placements in, a live scene out, and the same placements back.
 *
 * The round trip is the whole point. An editor is only possible if
 * `serialize(instantiate(level))` gives you back what you started with, so
 * that is the first test in the file and everything else is arranged to
 * keep it true.
 *
 * ```ts
 * const level = Level.parse(await (await fetch('level.json')).json());
 * const live = level.instantiate(catalog, scene);
 * live.byTag('spawn')[0];                 // gameplay finds things by tag
 * live.objects[3].object.position.x = 12; // an editor drags something
 * download(live.serialize());             // …and saves exactly that
 * ```
 */

export interface LevelOptions {
  /**
   * Upgrades for older files, keyed by the version they read FROM. Levels
   * are content, not caches: a save that no longer parses is somebody's
   * work thrown away, so old ones are migrated rather than refused.
   */
  migrations?: Record<number, (data: LevelData) => LevelData>;
}

export interface LevelInstance {
  objects: Placed[];
  byId(id: string): Placed | undefined;
  byTag(tag: string): Placed[];
  /** Read the LIVE transforms back out as data. */
  serialize(): LevelData;
  /** Detach everything this instance added. */
  dispose(): void;
}

/** Files live in git; `0.30000000000000004` in a diff helps nobody. */
const round = (n: number, places = 4): number => {
  const f = 10 ** places;
  const r = Math.round(n * f) / f;
  return Object.is(r, -0) ? 0 : r;
};

const near = (a: number, b: number, eps = 1e-4): boolean => Math.abs(a - b) < eps;

/** A small deterministic hash, so an entity's seed follows from its id. */
function hashSeed(levelSeed: number, id: string): number {
  let h = (levelSeed ^ 0x9e3779b9) >>> 0;
  for (let i = 0; i < id.length; i++) {
    h = Math.imul(h ^ id.charCodeAt(i), 0x01000193) >>> 0;
  }
  return h % 2147483647 || 1;
}

export class Level {
  name?: string;
  seed: number;
  meta?: Record<string, unknown>;
  entities: EntitySpec[];

  constructor(data: Partial<LevelData> = {}) {
    this.name = data.name;
    this.seed = data.seed ?? 1;
    this.meta = data.meta;
    this.entities = assignIds(data.entities ?? []);
  }

  /**
   * Read a level from parsed JSON: check the marker, migrate, assign ids.
   *
   * Throws on anything that is not a level — a stray JSON file should fail
   * loudly here rather than half-load into an empty world.
   */
  static parse(input: unknown, options: LevelOptions = {}): Level {
    if (!input || typeof input !== 'object') throw new Error('Level.parse: not an object');
    const data = { ...(input as LevelData) };
    if (data.format !== 'gama.level') {
      throw new Error(`Level.parse: not a gama level (format: ${String(data.format)})`);
    }
    let version = Number(data.version ?? 0);
    if (version > LEVEL_VERSION) {
      throw new Error(
        `Level.parse: file is version ${version}, this build understands ${LEVEL_VERSION}`
      );
    }
    let migrated = data;
    while (version < LEVEL_VERSION) {
      const step = options.migrations?.[version];
      if (!step) {
        throw new Error(`Level.parse: no migration from version ${version}`);
      }
      migrated = step(migrated);
      version += 1;
    }
    return new Level({ ...migrated, version: LEVEL_VERSION });
  }

  /** The level as plain data, ready for `JSON.stringify`. */
  toJSON(): LevelData {
    return clean({
      format: 'gama.level',
      version: LEVEL_VERSION,
      name: this.name,
      seed: this.seed,
      meta: this.meta,
      entities: this.entities,
    });
  }

  /**
   * Build the level into a parent object.
   *
   * A kind the catalog does not know is NOT dropped. It is kept, in place,
   * and written back out untouched when the level is saved — because the
   * alternative is a game that quietly deletes half of somebody's level the
   * first time it loads it without a plugin registered.
   */
  instantiate(catalog: Catalog, parent: Object3D): LevelInstance {
    const roots: Placed[] = [];
    const flat: Placed[] = [];
    const unknown: Array<{ index: number; spec: EntitySpec }> = [];
    const seed = this.seed;

    const place = (spec: EntitySpec, into: Object3D, path: string, index: number): Placed | null => {
      const full = catalog.expand(spec);
      // A prefab's children are created HERE, after ids were assigned to the
      // file's own entities — so they have none, and every one of them used
      // to land on the same fallback. Namespacing them under the parent
      // keeps `byId` honest and gives an editor something to select.
      const id = full.id ?? spec.id ?? `${path}${spec.kind}-${index}`;
      const built = catalog.build(full, { id, kind: full.kind, seed: hashSeed(seed, id) });
      if (!built) return null;

      applyTransform(built.object, full);
      into.add(built.object);

      const placed: Placed = {
        id,
        kind: spec.kind,
        object: built.object,
        tags: full.tags ?? [],
        source: built.source,
        children: [],
      };
      full.children?.forEach((child, i) => {
        const made = place(child, built.object, `${id}/`, i);
        if (made) placed.children.push(made);
      });
      flat.push(placed);
      return placed;
    };

    this.entities.forEach((spec, index) => {
      const placed = place(spec, parent, '', index);
      if (placed) roots.push(placed);
      else unknown.push({ index, spec });
    });

    const self = this;
    return {
      objects: flat,
      byId: (id) => flat.find((p) => p.id === id),
      byTag: (tag) => flat.filter((p) => p.tags.includes(tag)),

      serialize(): LevelData {
        const out: EntitySpec[] = [];
        let cursor = 0;
        for (let i = 0; i < self.entities.length; i++) {
          const missing = unknown.find((u) => u.index === i);
          // Verbatim: an entity nobody could build is still somebody's data.
          if (missing) out.push(missing.spec);
          else out.push(readBack(roots[cursor++], self.entities[i]));
        }
        return clean({
          format: 'gama.level',
          version: LEVEL_VERSION,
          name: self.name,
          seed: self.seed,
          meta: self.meta,
          entities: out,
        });
      },

      dispose() {
        for (const placed of roots) placed.object.removeFromParent();
        flat.length = 0;
        roots.length = 0;
      },
    };
  }
}

/** Give every entity a stable id, keeping any it already had. */
function assignIds(entities: EntitySpec[], prefix = ''): EntitySpec[] {
  const seen = new Set<string>();
  return entities.map((spec, i) => {
    let id = spec.id ?? `${prefix}${spec.kind}-${i}`;
    while (seen.has(id)) id = `${id}_`;
    seen.add(id);
    return {
      ...spec,
      id,
      children: spec.children ? assignIds(spec.children, `${id}/`) : undefined,
    };
  });
}

function applyTransform(object: Object3D, spec: EntitySpec): void {
  if (spec.at) object.position.set(spec.at[0], spec.at[1], spec.at[2]);
  if (typeof spec.rot === 'number') object.rotation.set(0, spec.rot, 0);
  else if (spec.rot) object.rotation.set(spec.rot[0], spec.rot[1], spec.rot[2]);
  if (typeof spec.scale === 'number') object.scale.setScalar(spec.scale);
  else if (spec.scale) object.scale.set(spec.scale[0], spec.scale[1], spec.scale[2]);
}

/** One live entity, back to data — transform from the object, rest from the spec. */
function readBack(placed: Placed, original: EntitySpec): EntitySpec {
  const o = placed.object;
  const spec: EntitySpec = { id: placed.id, kind: original.kind };

  if (!near(o.position.x, 0) || !near(o.position.y, 0) || !near(o.position.z, 0)) {
    spec.at = [round(o.position.x), round(o.position.y), round(o.position.z)];
  }
  // A yaw stays a yaw. Nearly every placement in a ground game is one, and
  // writing `[0, 1.5708, 0]` everywhere makes the file harder to read and
  // to hand-edit for no gain.
  const { x: rx, y: ry, z: rz } = o.rotation;
  if (near(rx, 0) && near(rz, 0)) {
    if (!near(ry, 0)) spec.rot = round(ry, 5);
  } else {
    spec.rot = [round(rx, 5), round(ry, 5), round(rz, 5)] as Vec3Tuple;
  }
  const { x: sx, y: sy, z: sz } = o.scale;
  if (near(sx, sy) && near(sy, sz)) {
    if (!near(sx, 1)) spec.scale = round(sx);
  } else {
    spec.scale = [round(sx), round(sy), round(sz)] as Vec3Tuple;
  }

  if (original.props && Object.keys(original.props).length) spec.props = original.props;
  if (placed.tags.length) spec.tags = [...placed.tags];
  if (original.children?.length) {
    spec.children = original.children.map((child, i) =>
      placed.children[i] ? readBack(placed.children[i], child) : child
    );
  }
  return spec;
}

/** Drop undefined keys so files stay small and diffs stay quiet. */
function clean(data: LevelData): LevelData {
  const out = { ...data };
  for (const key of Object.keys(out) as Array<keyof LevelData>) {
    if (out[key] === undefined) delete out[key];
  }
  return out;
}
