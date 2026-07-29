import { Raycaster, Vector2, type Camera, type Object3D } from 'three';
import type { Placed } from '../level/Catalog';
import type { LevelInstance } from '../level/Level';
import type { EntitySpec, LevelData, Vec3Tuple } from '../level/types';

/**
 * Editor — selection, edits and undo over a live level.
 *
 * The interesting part of an editor is not the panel; it is the bookkeeping
 * underneath, which is the part every editor gets wrong the same way. So the
 * machinery lives here, tested, and the app on top is a few hundred lines of
 * DOM:
 *
 * ```ts
 * const editor = new Editor(level.instantiate(catalog, scene), { snap: 0.5 });
 * editor.select(editor.pick(ndcX, ndcY, camera)?.id ?? null);
 * editor.move(1, 0, 0);   // undoable, snapped to the grid
 * editor.undo();          // …and exactly undone
 * download(editor.toJSON());
 * ```
 *
 * Three decisions worth knowing about:
 *
 * **Undo stores transforms, not deltas.** A command remembers where things
 * were and where they ended up. Deltas look tidier and drift: they assume
 * every edit is invertible in the same units it was applied in, which stops
 * being true the moment a snap rounds something or a second edit lands on
 * the same object.
 *
 * **A run of nudges is one undo.** Holding an arrow key would otherwise
 * bury the stack in three hundred entries. Consecutive edits of the same
 * kind on the same selection merge into the entry on top until something
 * ends the run — a different edit, a selection change, or `commit()`, which
 * the app calls on key-up or pointer-up.
 *
 * **The editor edits the file's entity list.** Prefab children and nested
 * placements come with their parent, so a click on a lamp that belongs to a
 * lamp-post selects the post. Anything else would let you drag a thing the
 * file has no way to store.
 */

export interface EditorOptions {
  /** Translation grid in world units. 0 is free movement. */
  snap?: number;
  /** Rotation grid in radians. 0 is free rotation. */
  snapAngle?: number;
  /** How many undo steps to keep. */
  historyLimit?: number;
  /** Called after anything changes — selection, an edit, undo, redo. */
  onChange?: (editor: Editor, change: ChangeKind) => void;
}

export type ChangeKind = 'select' | 'edit' | 'structure' | 'history';

/** One reversible step. */
interface Command {
  label: string;
  /** Consecutive commands sharing a key merge into one undo step. */
  key: string | null;
  undo(): void;
  redo(): void;
  /** Fold a later command of the same key into this one. */
  merge?(next: Command): void;
}

interface Snapshot {
  p: Vec3Tuple;
  r: Vec3Tuple;
  s: Vec3Tuple;
}

const snapshot = (o: Object3D): Snapshot => ({
  p: [o.position.x, o.position.y, o.position.z],
  r: [o.rotation.x, o.rotation.y, o.rotation.z],
  s: [o.scale.x, o.scale.y, o.scale.z],
});

const restore = (o: Object3D, t: Snapshot): void => {
  o.position.set(t.p[0], t.p[1], t.p[2]);
  o.rotation.set(t.r[0], t.r[1], t.r[2]);
  o.scale.set(t.s[0], t.s[1], t.s[2]);
};

const quantize = (value: number, step: number): number =>
  step > 0 ? Math.round(value / step) * step : value;

/** A transform edit: where everything was, and where it ended up. */
class TransformCommand implements Command {
  readonly key: string;
  private readonly after = new Map<string, Snapshot>();

  constructor(
    public label: string,
    key: string,
    private readonly level: LevelInstance,
    private readonly before: Map<string, Snapshot>
  ) {
    this.key = key;
    this.capture();
  }

  private capture(): void {
    for (const id of this.before.keys()) {
      const placed = this.level.byId(id);
      if (placed) this.after.set(id, snapshot(placed.object));
    }
  }

  /** Keep the original `before`, take the newer `after`. */
  merge(next: Command): void {
    (next as TransformCommand).after.forEach((value, id) => this.after.set(id, value));
  }

  private applyAll(from: Map<string, Snapshot>): void {
    from.forEach((value, id) => {
      const placed = this.level.byId(id);
      if (placed) restore(placed.object, value);
    });
  }

  undo(): void {
    this.applyAll(this.before);
  }

  redo(): void {
    this.applyAll(this.after);
  }
}

/** An entity appearing or disappearing, with the slot it belongs in. */
class StructureCommand implements Command {
  readonly key = null;

  constructor(
    public label: string,
    private readonly level: LevelInstance,
    private readonly specs: Array<{ spec: EntitySpec; index: number }>,
    /** true for an add (redo places it), false for a delete. */
    private readonly adding: boolean
  ) {}

  private place(): void {
    // Lowest index first, so each entity lands in the slot it was taken from.
    for (const entry of [...this.specs].sort((a, b) => a.index - b.index)) {
      this.level.add(entry.spec, entry.index);
    }
  }

  private pull(): void {
    for (const entry of this.specs) this.level.remove(entry.spec.id!);
  }

  undo(): void {
    if (this.adding) this.pull();
    else this.place();
  }

  redo(): void {
    if (this.adding) this.place();
    else this.pull();
  }
}

export class Editor {
  /** Translation grid in world units. 0 is free. */
  snap: number;
  /** Rotation grid in radians. 0 is free. */
  snapAngle: number;

  private readonly past: Command[] = [];
  private readonly future: Command[] = [];
  private ids: string[] = [];
  private openKey: string | null = null;
  private readonly limit: number;
  private readonly notify?: (editor: Editor, change: ChangeKind) => void;
  private readonly ray = new Raycaster();
  private readonly pointer = new Vector2();

  constructor(
    readonly level: LevelInstance,
    options: EditorOptions = {}
  ) {
    this.snap = options.snap ?? 0;
    this.snapAngle = options.snapAngle ?? 0;
    this.limit = options.historyLimit ?? 200;
    this.notify = options.onChange;
  }

  // ---- what can be touched -------------------------------------------------

  /**
   * The entities this editor can act on: the level's own entity list, live.
   *
   * Prefab children and nested placements are deliberately absent. They are
   * not rows in the file — they belong to whatever placed them — so dragging
   * one would produce a change the format cannot store.
   */
  get editable(): Placed[] {
    const ids = new Set(this.level.specs.map((s) => s.id));
    return this.level.objects.filter((p) => ids.has(p.id));
  }

  get selection(): string[] {
    return [...this.ids];
  }

  get selected(): Placed[] {
    return this.ids.map((id) => this.level.byId(id)).filter((p): p is Placed => !!p);
  }

  /** The single selected entity, or undefined when none or many. */
  get focused(): Placed | undefined {
    return this.ids.length === 1 ? this.level.byId(this.ids[0]) : undefined;
  }

  isSelected(id: string): boolean {
    return this.ids.includes(id);
  }

  /** Select an id, several ids, or nothing. */
  select(id: string | string[] | null, options: { add?: boolean; toggle?: boolean } = {}): void {
    const wanted = id === null ? [] : Array.isArray(id) ? id : [id];
    const editable = new Set(this.editable.map((p) => p.id));
    const valid = wanted.filter((i) => editable.has(i));

    let next: string[];
    if (options.toggle) {
      next = [...this.ids];
      for (const i of valid) {
        const at = next.indexOf(i);
        if (at >= 0) next.splice(at, 1);
        else next.push(i);
      }
    } else if (options.add) {
      next = [...new Set([...this.ids, ...valid])];
    } else {
      next = valid;
    }
    if (next.length === this.ids.length && next.every((v, i) => v === this.ids[i])) return;
    this.ids = next;
    this.endRun();
    this.notify?.(this, 'select');
  }

  selectAll(): void {
    this.select(this.editable.map((p) => p.id));
  }

  /** Cycle through the level — how you select something you cannot see. */
  selectNext(step = 1): void {
    const all = this.editable;
    if (!all.length) return;
    const from = all.findIndex((p) => p.id === this.ids[this.ids.length - 1]);
    const next = (((from + step) % all.length) + all.length) % all.length;
    this.select(all[next].id);
  }

  /** The editable entity a hit object belongs to, walking up through prefabs. */
  resolve(object: Object3D | null | undefined): Placed | undefined {
    const roots = this.editable;
    for (let node: Object3D | null = object ?? null; node; node = node.parent) {
      const found = roots.find((p) => p.object === node);
      if (found) return found;
    }
    return undefined;
  }

  /**
   * Raycast the level. `x`/`y` are normalised device coordinates — the same
   * `(clientX / innerWidth) * 2 - 1` every three.js app writes out by hand.
   */
  pick(x: number, y: number, camera: Camera): Placed | undefined {
    const roots = this.editable;
    if (!roots.length) return undefined;
    // Raycasting reads matrixWorld, and nothing has computed one since the
    // last render — so a pick in the same tick as an edit, or before the
    // first frame, would test against where things USED to be.
    for (const root of roots) root.object.updateWorldMatrix(true, true);
    this.ray.setFromCamera(this.pointer.set(x, y), camera);
    for (const hit of this.ray.intersectObjects(
      roots.map((p) => p.object),
      true
    )) {
      const found = this.resolve(hit.object);
      if (found) return found;
    }
    return undefined;
  }

  // ---- edits ---------------------------------------------------------------

  /**
   * Move the selection. With `snap` set the result lands ON the grid rather
   * than a grid-step away from wherever it happened to be.
   */
  move(dx: number, dy: number, dz: number): void {
    this.transform('move', 'Move', (object) => {
      const { position: p } = object;
      p.set(
        quantize(p.x + dx, this.snap),
        quantize(p.y + dy, this.snap),
        quantize(p.z + dz, this.snap)
      );
    });
  }

  moveTo(x: number, y: number, z: number): void {
    this.transform('move', 'Move', (object) => {
      object.position.set(quantize(x, this.snap), quantize(y, this.snap), quantize(z, this.snap));
    });
  }

  /** Turn the selection about Y — the rotation a ground game actually uses. */
  rotate(delta: number): void {
    this.transform('rotate', 'Rotate', (object) => {
      object.rotation.y = quantize(object.rotation.y + delta, this.snapAngle);
    });
  }

  scaleBy(factor: number): void {
    this.transform('scale', 'Scale', (object) => {
      object.scale.multiplyScalar(factor);
    });
  }

  setScale(scale: number): void {
    this.transform('scale', 'Scale', (object) => {
      object.scale.setScalar(scale);
    });
  }

  /** Drop the selection onto y = 0, which is where most things belong. */
  ground(): void {
    this.transform('ground', 'Ground', (object) => {
      object.position.y = 0;
    });
  }

  private transform(key: string, label: string, apply: (object: Object3D) => void): void {
    const targets = this.selected;
    if (!targets.length) return;
    const before = new Map<string, Snapshot>();
    for (const placed of targets) before.set(placed.id, snapshot(placed.object));
    for (const placed of targets) apply(placed.object);

    const runKey = `${key}:${this.ids.join(',')}`;
    this.push(new TransformCommand(label, runKey, this.level, before), 'edit');
  }

  // ---- structure -----------------------------------------------------------

  /** Add an entity to the level and select it. Returns null for a kind the catalog lacks. */
  place(spec: EntitySpec, options: { select?: boolean } = {}): Placed | null {
    const placed = this.level.add(spec);
    // The instance assigns the final id; ours may have collided.
    const stored = this.level.specs[this.level.specs.length - 1];
    this.push(
      new StructureCommand(
        `Add ${spec.kind}`,
        this.level,
        [{ spec: stored, index: this.level.specs.length - 1 }],
        true
      ),
      'structure'
    );
    if (options.select !== false) this.select(stored.id!);
    return placed;
  }

  /**
   * Copy the selection, offset by one grid step so the copy is visible.
   *
   * The copy is taken from the LIVE transform, not the spec that was loaded:
   * duplicating something you just dragged has to duplicate where it is now.
   */
  duplicate(offset = this.snap || 1): Placed[] {
    const sources = this.selected;
    if (!sources.length) return [];
    const saved = this.level.serialize().entities;
    const made: Placed[] = [];
    const added: Array<{ spec: EntitySpec; index: number }> = [];

    for (const source of sources) {
      const spec = saved.find((e) => e.id === source.id);
      if (!spec) continue;
      const clone = structuredCloneish(spec);
      const copy: EntitySpec = {
        ...clone,
        // The children lose their ids on purpose: they are namespaced under
        // whatever id the copy ends up with, so two copies of a lamp-post do
        // not both claim `post/lamp-0` and make `byId` a coin toss.
        children: clone.children ? stripIds(clone.children) : undefined,
        id: `${source.id}-copy`,
        at: [(spec.at?.[0] ?? 0) + offset, spec.at?.[1] ?? 0, (spec.at?.[2] ?? 0) + offset],
      };
      const placed = this.level.add(copy);
      const stored = this.level.specs[this.level.specs.length - 1];
      added.push({ spec: stored, index: this.level.specs.length - 1 });
      if (placed) made.push(placed);
    }
    if (!added.length) return [];
    this.push(new StructureCommand(`Duplicate ${added.length}`, this.level, added, true), 'structure');
    this.select(added.map((a) => a.spec.id!));
    return made;
  }

  /** Delete the selection. Undo brings it back in the same slot, as it was. */
  remove(): EntitySpec[] {
    const targets = this.ids.length ? [...this.ids] : [];
    if (!targets.length) return [];
    // Read back first: an entity that was dragged has to come back where it
    // was dragged to, not where the file originally put it.
    const saved = this.level.serialize().entities;
    // Every index is read BEFORE anything is removed. Reading them as we go
    // records where each entity sat in a list the previous delete had
    // already shortened, and undo puts the second one back a slot too early.
    const taken = targets
      .map((id) => ({ spec: saved.find((e) => e.id === id)!, index: this.level.indexOf(id) }))
      .filter((entry) => entry.spec && entry.index >= 0);
    for (const entry of taken) this.level.remove(entry.spec.id!);
    if (!taken.length) return [];
    this.ids = [];
    this.push(new StructureCommand(`Delete ${taken.length}`, this.level, taken, false), 'structure');
    return taken.map((t) => t.spec);
  }

  /**
   * Re-tag the selected entity. Tags are how gameplay finds things in a
   * level (`byTag('spawn')`), so they are edited far more often than props
   * — and unlike props they need no rebuild, since nothing was built from
   * them.
   */
  setTags(tags: string[]): void {
    const target = this.focused;
    if (!target) return;
    const spec = this.level.specs.find((s) => s.id === target.id);
    const before = [...target.tags];
    const after = [...tags];
    const apply = (list: string[]): void => {
      target.tags = [...list];
      if (spec) spec.tags = list.length ? [...list] : undefined;
    };
    apply(after);
    this.push(
      { label: 'Tag', key: null, undo: () => apply(before), redo: () => apply(after) },
      'edit'
    );
  }

  /**
   * Change an entity's props — which means building it again, because the
   * factory already ran. The live transform is carried across.
   */
  setProps(patch: Record<string, unknown>): Placed | null {
    const target = this.focused;
    if (!target) return null;
    const index = this.level.indexOf(target.id);
    const spec = this.level.serialize().entities.find((e) => e.id === target.id);
    if (index < 0 || !spec) return null;

    const next: EntitySpec = { ...spec, props: clean({ ...spec.props, ...patch }) };
    const before = { spec, index };
    const after = { spec: next, index };
    const level = this.level;
    const swap = (from: typeof before, to: typeof after): void => {
      level.remove(from.spec.id!);
      level.add(to.spec, to.index);
    };
    level.remove(spec.id!);
    const placed = level.add(next, index);
    this.push(
      {
        label: 'Edit props',
        key: null,
        undo: () => swap(after, before),
        redo: () => swap(before, after),
      },
      'structure'
    );
    this.select(target.id);
    return placed;
  }

  // ---- history -------------------------------------------------------------

  get canUndo(): boolean {
    return this.past.length > 0;
  }

  get canRedo(): boolean {
    return this.future.length > 0;
  }

  /** What undo would undo — for a menu item that says so. */
  get undoLabel(): string | null {
    return this.past[this.past.length - 1]?.label ?? null;
  }

  get redoLabel(): string | null {
    return this.future[this.future.length - 1]?.label ?? null;
  }

  undo(): boolean {
    const command = this.past.pop();
    if (!command) return false;
    command.undo();
    this.future.push(command);
    this.endRun();
    this.prune();
    this.notify?.(this, 'history');
    return true;
  }

  redo(): boolean {
    const command = this.future.pop();
    if (!command) return false;
    command.redo();
    this.past.push(command);
    this.endRun();
    this.prune();
    this.notify?.(this, 'history');
    return true;
  }

  /**
   * End the current run of merged edits. Apps call this on key-up or
   * pointer-up: everything between two commits is one undo step.
   */
  commit(): void {
    this.endRun();
  }

  clearHistory(): void {
    this.past.length = 0;
    this.future.length = 0;
    this.endRun();
  }

  get historyLength(): number {
    return this.past.length;
  }

  private push(command: Command, change: ChangeKind): void {
    this.future.length = 0;
    const top = this.past[this.past.length - 1];
    if (command.key && command.key === this.openKey && top?.key === command.key && top.merge) {
      top.merge(command);
    } else {
      this.past.push(command);
      if (this.past.length > this.limit) this.past.shift();
    }
    this.openKey = command.key;
    this.notify?.(this, change);
  }

  private endRun(): void {
    this.openKey = null;
  }

  private prune(): void {
    // Selection can point at something an undo just deleted.
    const alive = new Set(this.editable.map((p) => p.id));
    const kept = this.ids.filter((id) => alive.has(id));
    if (kept.length !== this.ids.length) this.ids = kept;
  }

  // ---- output --------------------------------------------------------------

  /** The level as data, read back from what is actually in the scene. */
  toJSON(): LevelData {
    return this.level.serialize();
  }

  /** The level as a file, formatted the way it should land in git. */
  toText(): string {
    return `${JSON.stringify(this.toJSON(), null, 2)}\n`;
  }
}

/** Drop ids from a subtree so they are re-derived under a new parent. */
function stripIds(specs: EntitySpec[]): EntitySpec[] {
  return specs.map(({ id: _id, ...rest }) => ({
    ...rest,
    children: rest.children ? stripIds(rest.children) : undefined,
  }));
}

/** Deep-ish copy, without depending on structuredClone in every runtime. */
function structuredCloneish<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Drop keys set to undefined, so "unset this prop" works. */
function clean(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined) out[key] = value;
  }
  return out;
}
