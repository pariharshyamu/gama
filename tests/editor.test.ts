import { describe, expect, it } from 'vitest';
import { BoxGeometry, Group, Mesh, Object3D, PerspectiveCamera } from 'three';
import { Catalog, Editor, LEVEL_VERSION, Level, type LevelData } from '../src';

/**
 * A yard with one of everything an editor trips over: a plain kind, a kind
 * with props, a prefab that creates children of its own, and an entity from
 * a plugin nobody registered.
 */
const FILE: LevelData = {
  format: 'gama.level',
  version: LEVEL_VERSION,
  name: 'Yard',
  seed: 20,
  entities: [
    { id: 'c1', kind: 'crate', at: [-2, 0, 2] },
    { id: 'c2', kind: 'crate', at: [1, 0, 3], props: { color: 7 } },
    { id: 'post', kind: 'lit-corner', at: [4, 0, -3] },
    { id: 'old-statue', kind: 'statue', at: [0, 0, -6], props: { pose: 'triumphant' } },
  ],
};

const build = (source: LevelData = FILE) => {
  const catalog = new Catalog()
    .define('crate', (props) => {
      const m = new Mesh(new BoxGeometry(1, 1, 1));
      m.name = String(props.color ?? 'plain');
      return m;
    })
    .define('pillar', (props) => {
      const m = new Mesh(new BoxGeometry(0.5, Number(props.height ?? 3), 0.5));
      m.userData.height = props.height ?? 3;
      return m;
    })
    .define('lamp', () => ({ object: new Mesh(new BoxGeometry(0.3, 0.3, 0.3)) }));
  catalog.prefab('lit-corner', {
    kind: 'pillar',
    props: { height: 2.4 },
    children: [{ kind: 'lamp', at: [0, 0, 1.4] }],
  });

  const scene = new Group();
  const live = Level.parse(structuredClone(source)).instantiate(catalog, scene);
  return { scene, live, editor: new Editor(live) };
};

describe('Editor', () => {
  it('undo puts the file back, byte for byte', () => {
    // The invariant the whole thing stands on. Everything else is a feature;
    // this is the promise.
    const { editor } = build();
    const before = editor.toJSON();

    editor.select('c1');
    editor.move(3, 0, -1.5);
    editor.commit();
    editor.rotate(0.4);
    editor.commit();
    editor.scaleBy(2);

    expect(editor.toJSON()).not.toEqual(before);
    while (editor.undo());
    expect(editor.toJSON()).toEqual(before);
  });

  it('redo replays what undo took away', () => {
    const { editor } = build();
    editor.select('c1');
    editor.move(2, 0, 0);
    const after = editor.toJSON();

    editor.undo();
    expect(editor.canRedo).toBe(true);
    editor.redo();
    expect(editor.toJSON()).toEqual(after);
    expect(editor.canRedo).toBe(false);
  });

  it('a run of nudges is one undo step, and commit() ends the run', () => {
    // Holding an arrow key would otherwise bury the stack in three hundred
    // entries, and undo would become useless exactly when you need it.
    const { editor } = build();
    editor.select('c1');
    for (let i = 0; i < 20; i++) editor.move(0.1, 0, 0);
    expect(editor.historyLength).toBe(1);

    editor.commit();
    editor.move(0.1, 0, 0);
    expect(editor.historyLength).toBe(2);

    editor.undo();
    editor.undo();
    expect(editor.toJSON().entities[0].at).toEqual([-2, 0, 2]); // all of it
  });

  it('a different edit, or a different selection, ends the run too', () => {
    const { editor } = build();
    editor.select('c1');
    editor.move(0.5, 0, 0);
    editor.rotate(0.2); // different kind of edit
    editor.move(0.5, 0, 0);
    expect(editor.historyLength).toBe(3);

    editor.select('c2');
    editor.move(0.5, 0, 0);
    editor.select('c1');
    editor.move(0.5, 0, 0);
    expect(editor.historyLength).toBe(5); // selection broke the run both times
  });

  it('snapping lands on the grid, not a grid-step from wherever it was', () => {
    const { editor } = build();
    editor.snap = 0.5;
    editor.select('c2'); // at x = 1
    editor.moveTo(1.17, 0, 3.42);

    const [, c2] = editor.toJSON().entities;
    expect(c2.at).toEqual([1, 0, 3.5]);

    editor.snapAngle = Math.PI / 8;
    editor.rotate(0.1);
    expect(editor.toJSON().entities[1].rot).toBeUndefined(); // a tenth of a radian is not a step
    editor.rotate(0.3);
    expect(editor.toJSON().entities[1].rot).toBeCloseTo(Math.PI / 8, 4);
  });

  it('deletes into the same slot it came out of, with the transform it had', () => {
    // Undo that appends is not undo. A level file lives in git, and an undo
    // that reshuffles the entity list turns a one-line diff into a whole-file
    // one.
    const { editor } = build();
    editor.select('c2');
    editor.move(0, 0, 5);
    editor.commit();
    const moved = editor.toJSON().entities[1];

    editor.remove();
    expect(editor.toJSON().entities.map((e) => e.id)).toEqual(['c1', 'post', 'old-statue']);
    expect(editor.selection).toEqual([]);

    editor.undo();
    const back = editor.toJSON().entities;
    expect(back.map((e) => e.id)).toEqual(['c1', 'c2', 'post', 'old-statue']);
    expect(back[1]).toEqual(moved); // where it was dragged to, not where it loaded
  });

  it('deleting several at once is one undo, and they all come back in order', () => {
    const { editor } = build();
    editor.select(['c1', 'post']);
    editor.remove();
    expect(editor.toJSON().entities.map((e) => e.id)).toEqual(['c2', 'old-statue']);

    expect(editor.undo()).toBe(true);
    expect(editor.toJSON().entities.map((e) => e.id)).toEqual(['c1', 'c2', 'post', 'old-statue']);
  });

  it('duplicates the live transform, with ids that do not collide', () => {
    const { editor, live } = build();
    editor.select('post');
    editor.move(1, 0, 0);
    editor.commit();

    const [copy] = editor.duplicate(2);
    expect(copy).toBeTruthy();
    expect(editor.selection).toEqual(['post-copy']);

    const entities = editor.toJSON().entities;
    const made = entities.find((e) => e.id === 'post-copy')!;
    expect(made.at).toEqual([7, 0, -1]); // 4 + 1 moved, + 2 offset

    // The prefab's children were re-namespaced under the copy, so `byId`
    // still means one thing.
    const ids = live.objects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain('post-copy/lamp-0');

    editor.undo();
    expect(editor.toJSON().entities.some((e) => e.id === 'post-copy')).toBe(false);
  });

  it('places a new entity, and undo takes it back out', () => {
    const { editor, live } = build();
    const placed = editor.place({ kind: 'crate', at: [8, 0, 8], tags: ['new'] });
    expect(placed).toBeTruthy();
    expect(live.byTag('new')).toHaveLength(1);
    expect(editor.selection).toEqual(['crate-4']);

    editor.undo();
    expect(live.byTag('new')).toHaveLength(0);
    expect(editor.toJSON().entities).toHaveLength(4);

    editor.redo();
    expect(editor.toJSON().entities).toHaveLength(5);
  });

  it('changing props builds the thing again and keeps where it stands', () => {
    // The factory already ran, so a prop change is a rebuild. What must NOT
    // be rebuilt is the transform somebody spent a minute getting right.
    const { editor, live } = build();
    editor.select('post');
    editor.move(0, 0, 1);
    editor.commit();

    editor.setProps({ height: 6 });
    expect(live.byId('post')!.object.userData.height).toBe(6);
    expect(live.byId('post')!.object.position.z).toBe(-2);

    editor.undo();
    expect(live.byId('post')!.object.userData.height).toBe(2.4); // the prefab's
    expect(live.byId('post')!.object.position.z).toBe(-2); // still where it was
  });

  it('re-tags without rebuilding, because nothing was built from a tag', () => {
    const { editor, live } = build();
    editor.select('c1');
    const object = live.byId('c1')!.object;

    editor.setTags(['spawn', 'safe']);
    expect(live.byTag('spawn').map((p) => p.id)).toEqual(['c1']);
    expect(editor.toJSON().entities[0].tags).toEqual(['spawn', 'safe']);
    expect(live.byId('c1')!.object).toBe(object); // the same thing, not a new one

    editor.undo();
    expect(live.byTag('spawn')).toEqual([]);
    expect(editor.toJSON().entities[0]).not.toHaveProperty('tags');
  });

  it('leaves an entity it cannot build completely alone', () => {
    // Editing around an unknown kind must not disturb it — the whole reason
    // it is kept is that somebody else's build understands it.
    const { editor } = build();
    editor.selectAll();
    editor.move(1, 1, 1);
    editor.remove();

    const left = editor.toJSON().entities;
    expect(left).toHaveLength(1);
    expect(left[0]).toEqual(FILE.entities[3]); // verbatim, untouched
  });

  it('will not select what the file cannot store', () => {
    // A prefab's lamp is not a row in the file; it belongs to the post. So
    // there is nothing an editor could save if you dragged it.
    const { editor, live } = build();
    expect(live.byId('post/lamp-0')).toBeTruthy();

    editor.select('post/lamp-0');
    expect(editor.selection).toEqual([]);
    expect(editor.editable.map((p) => p.id)).toEqual(['c1', 'c2', 'post']);
  });

  it('resolves a click on a prefab child up to the thing you meant', () => {
    const { editor, live } = build();
    const lamp = live.byId('post/lamp-0')!.object;
    expect(editor.resolve(lamp)!.id).toBe('post');

    const stray = new Object3D();
    expect(editor.resolve(stray)).toBeUndefined();
  });

  it('picks with a ray, which is how anyone actually selects anything', () => {
    const { editor } = build();
    const camera = new PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.set(-2, 0, 12);
    camera.lookAt(-2, 0, 2);
    camera.updateMatrixWorld(true);

    expect(editor.pick(0, 0, camera)?.id).toBe('c1'); // dead centre
    expect(editor.pick(-0.95, 0.95, camera)).toBeUndefined(); // empty sky
  });

  it('cycles the selection, which is how you find something off-screen', () => {
    const { editor } = build();
    editor.selectNext();
    expect(editor.selection).toEqual(['c1']);
    editor.selectNext();
    expect(editor.selection).toEqual(['c2']);
    editor.selectNext(-1);
    expect(editor.selection).toEqual(['c1']);
    editor.selectNext(-1);
    expect(editor.selection).toEqual(['post']); // wraps, never lands nowhere
  });

  it('adds to and toggles a selection', () => {
    const { editor } = build();
    editor.select('c1');
    editor.select('c2', { add: true });
    expect(editor.selection).toEqual(['c1', 'c2']);
    editor.select('c1', { toggle: true });
    expect(editor.selection).toEqual(['c2']);
    expect(editor.focused!.id).toBe('c2');
    editor.select(null);
    expect(editor.focused).toBeUndefined();
  });

  it('a new edit throws away the redos, and history has a ceiling', () => {
    const { editor } = build();
    editor.select('c1');
    editor.move(1, 0, 0);
    editor.undo();
    expect(editor.canRedo).toBe(true);
    editor.commit();
    editor.rotate(0.1);
    expect(editor.canRedo).toBe(false); // that future is gone

    const bounded = new Editor(build().live, { historyLimit: 3 });
    bounded.select('c1');
    for (let i = 0; i < 10; i++) {
      bounded.move(0.1, 0, 0);
      bounded.commit();
    }
    expect(bounded.historyLength).toBe(3);
  });

  it('says what undo would undo, and tells the app when to redraw', () => {
    const seen: string[] = [];
    const { live } = build();
    const editor = new Editor(live, { onChange: (_e, kind) => seen.push(kind) });

    editor.select('c1');
    editor.move(1, 0, 0);
    expect(editor.undoLabel).toBe('Move');
    editor.remove();
    expect(editor.undoLabel).toBe('Delete 1');
    editor.undo();
    expect(editor.redoLabel).toBe('Delete 1');

    // One notification per operation — a delete does not also announce that
    // the selection it just emptied has changed.
    expect(seen).toEqual(['select', 'edit', 'structure', 'history']);
  });

  it('drops the selection when an undo deletes what was selected', () => {
    const { editor } = build();
    const placed = editor.place({ kind: 'crate', at: [0, 0, 0] });
    expect(placed).toBeTruthy();
    expect(editor.selection).toHaveLength(1);
    editor.undo();
    expect(editor.selection).toEqual([]); // not a dangling id
  });

  it('grounds things, because most of them belong on the floor', () => {
    const { editor } = build();
    editor.select('c1');
    editor.move(0, 3, 0);
    editor.commit();
    editor.ground();
    expect(editor.toJSON().entities[0].at).toEqual([-2, 0, 2]);
  });

  it('writes a file that ends in a newline, like every other file in the repo', () => {
    const { editor } = build();
    const text = editor.toText();
    expect(text.endsWith('}\n')).toBe(true);
    expect(JSON.parse(text)).toEqual(editor.toJSON());
  });
});
