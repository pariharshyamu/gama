import { Object3D } from 'three';
import type { CreateContext, EntitySpec } from './types';

/**
 * Catalog — the bridge between a name in a file and a thing in the world.
 *
 * GAMA cannot import SCENA or ANIMA (that is the trilogy's one rule), so it
 * has no idea what a `"house"` is. The game says:
 *
 * ```ts
 * const catalog = new Catalog();
 * catalog.define('house', (props, ctx) => createHouse({ seed: ctx.seed, ...props }));
 * catalog.define('villager', (props, ctx) => makeVillager(ctx.seed, props));
 * ```
 *
 * …and from then on a level file can place houses. The factory may return a
 * three.js `Object3D` or anything shaped `{ object }` — SCENA props and
 * ANIMA rigs both drop in unchanged.
 *
 * ## Prefabs
 *
 * A prefab is a **recipe, not a blob**: a named `EntitySpec` with defaults
 * and children, which a placement can override.
 *
 * ```ts
 * catalog.prefab('cottage-with-lamp', {
 *   kind: 'house',
 *   props: { roof: 'thatch' },
 *   children: [{ kind: 'lamp', at: [2.4, 0, 1.8] }],
 * });
 * ```
 *
 * Placing `{ kind: 'cottage-with-lamp', at: [10, 0, 0], props: { roof: 'tile' } }`
 * expands the recipe, merges the override, and keeps the children. Storing
 * baked geometry instead would be larger, would go stale the moment the
 * generator improved, and would throw away the seed that made it.
 */

export type Factory = (
  props: Record<string, unknown>,
  context: CreateContext
) => Object3D | { object: Object3D } | null | undefined;

export interface DefineOptions {
  /** Merged under a placement's own props. */
  defaults?: Record<string, unknown>;
}

/** A live entity, and the spec it came from. */
export interface Placed {
  id: string;
  kind: string;
  object: Object3D;
  tags: string[];
  /** Whatever the factory returned, in case it has an update() worth calling. */
  source: unknown;
  children: Placed[];
}

export class Catalog {
  private readonly factories = new Map<string, { factory: Factory; defaults?: Record<string, unknown> }>();
  private readonly prefabs = new Map<string, EntitySpec>();

  /** Teach the catalog how to build one kind of thing. */
  define(kind: string, factory: Factory, options: DefineOptions = {}): this {
    this.factories.set(kind, { factory, defaults: options.defaults });
    return this;
  }

  /** Register several at once — `{ house: createHouse, tree: createTree }`. */
  defineAll(map: Record<string, Factory>): this {
    for (const [kind, factory] of Object.entries(map)) this.define(kind, factory);
    return this;
  }

  /** Name a recipe: a spec that placements expand and override. */
  prefab(name: string, spec: EntitySpec): this {
    this.prefabs.set(name, spec);
    return this;
  }

  has(kind: string): boolean {
    return this.factories.has(kind) || this.prefabs.has(kind);
  }

  get kinds(): string[] {
    return [...new Set([...this.factories.keys(), ...this.prefabs.keys()])].sort();
  }

  /**
   * Expand a placement through any prefab it names.
   *
   * The placement wins: its props are merged OVER the recipe's, and its
   * transform replaces the recipe's entirely (a prefab's own `at` is a
   * default for when a placement does not say). Children concatenate, so a
   * placement can add to a recipe without redefining it.
   */
  expand(spec: EntitySpec): EntitySpec {
    const recipe = this.prefabs.get(spec.kind);
    if (!recipe) return spec;
    // Recipes may name other recipes; resolve to the bottom.
    const base = this.expand({ ...recipe, id: spec.id ?? recipe.id });
    return {
      ...base,
      id: spec.id ?? base.id,
      at: spec.at ?? base.at,
      rot: spec.rot ?? base.rot,
      scale: spec.scale ?? base.scale,
      props: { ...base.props, ...spec.props },
      tags: [...(base.tags ?? []), ...(spec.tags ?? [])],
      children: [...(base.children ?? []), ...(spec.children ?? [])],
    };
  }

  /** Build one entity. Returns null for a kind this catalog has never heard of. */
  build(spec: EntitySpec, context: CreateContext): { object: Object3D; source: unknown } | null {
    const entry = this.factories.get(spec.kind);
    if (!entry) return null;
    const props = { ...entry.defaults, ...spec.props };
    const made = entry.factory(props, context);
    if (!made) return null;
    const object = made instanceof Object3D ? made : (made as { object: Object3D }).object;
    if (!object) return null;
    return { object, source: made };
  }
}
