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

/**
 * One tunable prop, described well enough for an editor to draw a control
 * for it. Optional — a catalog works without any of this — but supplying it
 * is what turns "a list of names" into a palette and an inspector, without
 * the editor having to know a single thing about the game.
 */
export interface PropField {
  key: string;
  type: 'number' | 'color' | 'text' | 'boolean' | 'select';
  label?: string;
  /** Number fields. */
  min?: number;
  max?: number;
  step?: number;
  /** Select fields. */
  options?: string[];
  /** Shown when the placement does not set the prop. */
  default?: unknown;
}

export interface DefineOptions {
  /** Merged under a placement's own props. */
  defaults?: Record<string, unknown>;
  /** Human name for a palette. Defaults to the kind. */
  label?: string;
  /** Palette section — "Structures", "Nature", "Props". */
  group?: string;
  /** What an inspector may edit. */
  fields?: PropField[];
}

export interface PrefabOptions {
  label?: string;
  group?: string;
  /** Overrides the base kind's fields, when a recipe exposes different ones. */
  fields?: PropField[];
}

/** Everything a catalog knows about one kind, for building a UI from. */
export interface KindInfo {
  kind: string;
  label: string;
  group?: string;
  fields: PropField[];
  defaults: Record<string, unknown>;
  /** True when this name is a recipe rather than a factory. */
  prefab: boolean;
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
  private readonly factories = new Map<string, { factory: Factory; options: DefineOptions }>();
  private readonly prefabs = new Map<string, { spec: EntitySpec; options: PrefabOptions }>();

  /** Teach the catalog how to build one kind of thing. */
  define(kind: string, factory: Factory, options: DefineOptions = {}): this {
    this.factories.set(kind, { factory, options });
    return this;
  }

  /** Register several at once — `{ house: createHouse, tree: createTree }`. */
  defineAll(map: Record<string, Factory>): this {
    for (const [kind, factory] of Object.entries(map)) this.define(kind, factory);
    return this;
  }

  /** Name a recipe: a spec that placements expand and override. */
  prefab(name: string, spec: EntitySpec, options: PrefabOptions = {}): this {
    this.prefabs.set(name, { spec, options });
    return this;
  }

  has(kind: string): boolean {
    return this.factories.has(kind) || this.prefabs.has(kind);
  }

  get kinds(): string[] {
    return [...new Set([...this.factories.keys(), ...this.prefabs.keys()])].sort();
  }

  /**
   * What this catalog knows about a kind — enough to draw a palette button
   * and an inspector row without the editor knowing what a "house" is.
   *
   * A prefab inherits the fields of whatever it is a recipe FOR, because
   * that is what its props actually reach; its own props become the
   * defaults shown when a placement does not override them.
   */
  info(kind: string): KindInfo | undefined {
    const factory = this.factories.get(kind);
    if (factory) {
      return {
        kind,
        label: factory.options.label ?? kind,
        group: factory.options.group,
        fields: factory.options.fields ?? [],
        defaults: factory.options.defaults ?? {},
        prefab: false,
      };
    }
    const recipe = this.prefabs.get(kind);
    if (!recipe) return undefined;
    const base = this.info(this.expand({ kind }).kind);
    return {
      kind,
      label: recipe.options.label ?? kind,
      group: recipe.options.group ?? base?.group,
      fields: recipe.options.fields ?? base?.fields ?? [],
      defaults: { ...base?.defaults, ...this.expand({ kind }).props },
      prefab: true,
    };
  }

  /**
   * Everything this catalog can place, for a palette.
   *
   * In DEFINITION order, not alphabetical: a palette should read the way
   * somebody wrote the catalog — buildings, then nature, then dressing —
   * rather than scattering the groups by whichever kind happens to start
   * with an early letter.
   */
  list(): KindInfo[] {
    return [...this.factories.keys(), ...this.prefabs.keys()].map((kind) => this.info(kind)!);
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
    const entry = this.prefabs.get(spec.kind);
    if (!entry) return spec;
    const recipe = entry.spec;
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
    const props = { ...entry.options.defaults, ...spec.props };
    const made = entry.factory(props, context);
    if (!made) return null;
    const object = made instanceof Object3D ? made : (made as { object: Object3D }).object;
    if (!object) return null;
    return { object, source: made };
  }
}
