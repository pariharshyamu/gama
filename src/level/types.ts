/**
 * The level format.
 *
 * A level is a list of PLACEMENTS, not a scene graph and not geometry. That
 * is the whole design, and it follows from what these libraries are: the
 * props are generated from a name and a few numbers, so a file that stored
 * meshes would be a thousand times larger, would go stale the moment a
 * generator improved, and would throw away the seed that made it.
 *
 * So an entity is a `kind` (a name the game registered), a transform, and a
 * bag of options. Loading one runs the factory again.
 */

/** The current format version. Bump when the shape changes; add a migration. */
export const LEVEL_VERSION = 1;

export type Vec3Tuple = [number, number, number];

export interface EntitySpec {
  /**
   * Stable identity, for references between entities and for an editor's
   * selection to survive a save. Assigned deterministically when absent.
   */
  id?: string;
  /** A name registered in the `Catalog`. */
  kind: string;
  /** Position. Omitted when it is the origin. */
  at?: Vec3Tuple;
  /**
   * Rotation: a single number is a Y yaw — which is what nearly every
   * placement in a ground game actually is — or a full XYZ euler.
   */
  rot?: number | Vec3Tuple;
  /** Uniform scale, or per-axis. Omitted when 1. */
  scale?: number | Vec3Tuple;
  /** Whatever the factory takes: colours, sizes, styles, a seed. */
  props?: Record<string, unknown>;
  /** Free labels — `byTag('spawn')` is how gameplay finds things. */
  tags?: string[];
  /** Nested placements, in the parent's local space. */
  children?: EntitySpec[];
}

export interface LevelData {
  /** Marks the file, so a stray JSON is refused rather than half-loaded. */
  format: 'gama.level';
  version: number;
  name?: string;
  /**
   * The level's own seed. Entities that do not carry one are given a
   * derived, deterministic seed — so a generated world stays reproducible
   * without writing a thousand random numbers into the file.
   */
  seed?: number;
  entities: EntitySpec[];
  /** Anything the game wants to keep alongside: par times, music, weather. */
  meta?: Record<string, unknown>;
}

/** What a factory is handed, besides its own props. */
export interface CreateContext {
  id: string;
  kind: string;
  /** Deterministic per-entity seed, derived from the level seed and the id. */
  seed: number;
}

/**
 * What a factory may return.
 *
 * Both shapes are accepted on purpose: SCENA props are `{ object, … }` and
 * ANIMA rigs are `{ object, … }`, while a plain three.js `Object3D` is what
 * anybody's own code returns. This is the trilogy's structural handshake
 * applied to level loading — no library has to learn about another.
 */
export interface HasObject {
  object: { position: unknown };
}
