import {
  BoxHelper,
  Color,
  DirectionalLight,
  Fog,
  GridHelper,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Raycaster,
  Vector2,
  Vector3,
  type Scene,
} from 'three';
import { Game } from '../core/Game';
import { OrbitRig } from '../camera/OrbitRig';
import type { Catalog } from '../level/Catalog';
import { Level, type LevelInstance } from '../level/Level';
import type { LevelData } from '../level/types';
import { Editor } from './Editor';
import { EDITOR_CSS, EDITOR_HTML } from './chrome';

/**
 * mountEditor — a whole level editor in one call.
 *
 * `Editor` is the machinery; this is the program around it, and it is here
 * because otherwise every game that wants an editor writes the same four
 * hundred lines of palette, inspector, drag handling and toolbar. Point it
 * at a catalog and it builds a tool for whatever that catalog contains:
 *
 * ```ts
 * mountEditor({
 *   catalog,                       // your kinds — SCENA props, ANIMA spawns, anything
 *   container: document.body,
 *   level: await (await fetch('levels/village.json')).json(),
 * });
 * ```
 *
 * It ships its own markup and styles (scoped under `.gama-ed`), so there is
 * no stylesheet to link and nothing to fight with the host page's CSS. It
 * is a separate entry point — `gama3d/editor` — so a game that never opens
 * one pays nothing for it.
 */

export interface MountEditorOptions {
  /** The kinds this editor can place. `Catalog.info()` drives the whole UI. */
  catalog: Catalog;
  /** Where to mount. Defaults to `document.body`. */
  container?: HTMLElement;
  /** The level to open with. */
  level?: LevelData;
  /**
   * localStorage key for keeping work across a refresh. `null` turns it
   * off — which a game embedding this in a dev route usually wants, since
   * its levels belong in files, not in a browser.
   */
  storageKey?: string | null;
  /** Shown in the toolbar. */
  brand?: string;
  subtitle?: string;
  snap?: number;
  /** In degrees, because that is what the toolbar offers. */
  snapAngle?: number;
  /** Starting camera distance. A sixty-metre map wants more than a yard. */
  distance?: number;
  /** Starting camera angles, in radians. */
  pitch?: number;
  yaw?: number;
  /** Passed through to `Level.instantiate`. */
  release?: boolean;
  /**
   * Dress the scene: sky, ground, weather, whatever the game actually
   * looks like. The default is a lit grid over a green plane. Editing
   * against the game's own sky is worth the twenty lines.
   */
  decorate?(scene: Scene, session: EditorSession): void;
  /** Extra toolbar buttons — "Playtest", "Write to disk", "Bake navmesh". */
  actions?: EditorAction[];
  /** After every change, with the level as data. */
  onChange?(session: EditorSession, data: LevelData): void;
}

export interface EditorAction {
  label: string;
  title?: string;
  run(session: EditorSession): void;
}

export interface EditorSession {
  readonly game: Game;
  readonly editor: Editor;
  readonly level: LevelInstance;
  /** Everything the level was built into — decorate around it, not into it. */
  readonly root: Object3D;
  /** Camera pivot; move it to frame something. */
  readonly pivot: Object3D;
  load(data: LevelData): void;
  toJSON(): LevelData;
  /** Trigger the same download the Save button does. */
  download(): void;
  refresh(): void;
  dispose(): void;
}

const round = (n: number) => Math.round(n * 1000) / 1000;
const hex = (n: number) => `#${(n & 0xffffff).toString(16).padStart(6, '0')}`;

let stylesInjected = false;

export function mountEditor(options: MountEditorOptions): EditorSession {
  const {
    catalog,
    container = document.body,
    storageKey = 'gama.editor.level',
    brand = 'GAMA',
    subtitle = 'Level editor',
    release,
  } = options;

  if (!stylesInjected) {
    const style = document.createElement('style');
    style.textContent = EDITOR_CSS;
    document.head.append(style);
    stylesInjected = true;
  }

  const shell = document.createElement('div');
  shell.className = 'gama-ed';
  shell.innerHTML = EDITOR_HTML;
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  container.append(shell);

  const part = <T extends HTMLElement>(name: string): T =>
    shell.querySelector(`[data-ed="${name}"]`) as T;

  part('brand').textContent = brand;
  part('subtitle').textContent = subtitle;

  const viewport = part('viewport');
  const palette = part('palette');
  const inspector = part('inspector');
  const hint = part('hint');
  const status = part('status');
  const snapSelect = part<HTMLSelectElement>('snap');
  const angleSelect = part<HTMLSelectElement>('angle');
  const fileInput = part<HTMLInputElement>('file');

  if (options.snap !== undefined) snapSelect.value = String(options.snap);
  if (options.snapAngle !== undefined) angleSelect.value = String(options.snapAngle);

  // ---------------------------------------------------------------- scene

  const game = new Game({ parent: viewport, autoResize: false, antialias: true });
  const scene = game.world.scene;
  const camera = game.camera as PerspectiveCamera;
  game.renderer.shadowMap.enabled = true;

  const gizmos = new Group();
  gizmos.name = 'gizmos';
  scene.add(gizmos);

  let root = new Group();
  root.name = 'level';
  scene.add(root);

  const pivot = new Object3D();
  scene.add(pivot);

  /** A `PointerLookInput` the rig reads — filled only while orbiting. */
  const look = { pointerDelta: new Vector2(), wheelDelta: 0, pointerDown: false };
  const rig = new OrbitRig(camera, pivot, look, {
    distance: options.distance ?? 30,
    minDistance: 4,
    maxDistance: Math.max(160, (options.distance ?? 30) * 3),
    pitch: options.pitch ?? 0.72,
    yaw: options.yaw ?? 0.5,
    maxPitch: 1.45,
    stiffness: 14,
    lookOffset: new Vector3(0, 1.5, 0),
  });

  const resize = () => {
    const width = viewport.clientWidth || 1;
    const height = viewport.clientHeight || 1;
    game.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    game.renderer.setSize(width, height, true);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(viewport);
  resize();

  // ---------------------------------------------------------------- state

  let live!: LevelInstance;
  let editor!: Editor;
  let levelName = 'Untitled';
  let levelSeed = 1;
  let levelMeta: Record<string, unknown> | undefined;
  let armed: string | null = null;
  let dragging: Map<string, Vector3> | null = null;

  const session: EditorSession = {
    get game() {
      return game;
    },
    get editor() {
      return editor;
    },
    get level() {
      return live;
    },
    get root() {
      return root;
    },
    pivot,
    load,
    toJSON,
    download,
    refresh,
    dispose,
  };

  function toJSON(): LevelData {
    return { ...editor.toJSON(), name: levelName, seed: levelSeed, meta: levelMeta };
  }

  function load(data: LevelData): void {
    live?.dispose();
    scene.remove(root);
    root = new Group();
    root.name = 'level';
    scene.add(root);

    const level = Level.parse(data);
    levelName = level.name ?? 'Untitled';
    levelSeed = level.seed;
    levelMeta = level.meta;
    live = level.instantiate(catalog, root, { release });
    editor = new Editor(live, {
      snap: Number(snapSelect.value),
      snapAngle: (Number(angleSelect.value) * Math.PI) / 180,
      onChange: () => refresh(),
    });
    armed = null;
    refresh();
  }

  function refresh(): void {
    // A drag fires this every frame, and rebuilding a panel of inputs sixty
    // times a second is both wasteful and impossible to type into.
    if (dragging) {
      drawStatus();
      store();
      return;
    }
    drawSelection();
    drawInspector();
    drawStatus();
    drawPaletteState();
    store();
    options.onChange?.(session, toJSON());
  }

  // ------------------------------------------------------------ selection

  function drawSelection(): void {
    // Detaching is not freeing. This runs on every change, so a session of
    // dragging a prop slider quietly accumulated one selection box per
    // edit — found by measuring the renderer while stress-testing the
    // thing this file was written to fix.
    for (const child of gizmos.children) {
      const box = child as BoxHelper;
      box.geometry.dispose();
      box.material.dispose();
    }
    gizmos.clear();
    for (const placed of editor.selected) {
      placed.object.updateWorldMatrix(true, true);
      const box = new BoxHelper(placed.object, 0x4d8dff);
      box.material.depthTest = false;
      box.renderOrder = 2;
      gizmos.add(box);
    }
  }

  // -------------------------------------------------------------- palette

  function drawPalette(): void {
    const groups = new Map<string, HTMLElement>();
    for (const info of catalog.list()) {
      const name = info.group ?? 'Other';
      let section = groups.get(name);
      if (!section) {
        const heading = document.createElement('h4');
        heading.textContent = name;
        palette.append(heading);
        section = document.createElement('div');
        palette.append(section);
        groups.set(name, section);
      }
      const button = document.createElement('button');
      button.textContent = info.label;
      button.dataset.kind = info.kind;
      button.title = info.prefab ? `recipe — expands to ${info.kind}` : info.kind;
      button.addEventListener('click', () => {
        armed = armed === info.kind ? null : info.kind;
        refresh();
      });
      section.append(button);
    }
  }

  function drawPaletteState(): void {
    for (const button of palette.querySelectorAll<HTMLButtonElement>('button')) {
      button.setAttribute('aria-pressed', String(button.dataset.kind === armed));
    }
    hint.classList.toggle('armed', !!armed);
    hint.innerHTML = armed
      ? `Click the ground to place <b>${armed}</b> — <kbd>Esc</kbd> to put it down`
      : editor.selection.length
        ? `<b>${editor.selection.join(', ')}</b> — drag to move · <b>Q</b>/<b>E</b> turn · <b>[</b>/<b>]</b> scale · <b>Del</b>`
        : 'Click a thing to select it, or pick something from the palette';
  }

  // ------------------------------------------------------------ inspector

  function field(label: string, control: HTMLElement): HTMLElement {
    const row = document.createElement('div');
    row.className = 'ed-row';
    const name = document.createElement('label');
    name.textContent = label;
    row.append(name, control);
    return row;
  }

  function numberInput(value: number, step: number, onInput: (v: number) => void): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'number';
    input.step = String(step);
    input.value = String(round(value));
    input.addEventListener('change', () => {
      const parsed = Number(input.value);
      if (Number.isFinite(parsed)) onInput(parsed);
    });
    return input;
  }

  /** Typed numbers are exact numbers — the grid is for dragging. */
  function exact(run: () => void): void {
    const [snap, angle] = [editor.snap, editor.snapAngle];
    editor.snap = 0;
    editor.snapAngle = 0;
    run();
    editor.commit();
    editor.snap = snap;
    editor.snapAngle = angle;
  }

  function drawInspector(): void {
    inspector.replaceChildren();
    const target = editor.focused;

    if (!target) {
      const heading = document.createElement('h4');
      heading.textContent = 'Level';
      inspector.append(heading);

      const name = document.createElement('input');
      name.value = levelName;
      name.addEventListener('change', () => {
        levelName = name.value;
        store();
        drawStatus();
      });
      inspector.append(field('name', name));
      inspector.append(
        field(
          'seed',
          numberInput(levelSeed, 1, (v) => load({ ...toJSON(), seed: Math.round(v) }))
        )
      );
      const note = document.createElement('div');
      note.className = 'ed-empty';
      note.textContent = editor.selection.length
        ? `${editor.selection.length} selected — pick one to edit its props.`
        : 'Nothing selected.';
      inspector.append(note);
      return;
    }

    const object = target.object;
    const info = catalog.info(target.kind);
    const heading = document.createElement('h4');
    heading.textContent = info?.label ?? target.kind;
    inspector.append(heading);

    const id = document.createElement('div');
    id.className = 'ed-readonly';
    id.textContent = `${target.id}  ·  ${target.kind}`;
    inspector.append(field('id', id));

    const triple = document.createElement('div');
    triple.className = 'ed-triple';
    for (const axis of ['x', 'y', 'z'] as const) {
      triple.append(
        numberInput(object.position[axis], 0.1, (v) => {
          const p = object.position.clone();
          p[axis] = v;
          exact(() => editor.moveTo(p.x, p.y, p.z));
        })
      );
    }
    inspector.append(field('position', triple));

    inspector.append(
      field(
        'yaw°',
        numberInput((object.rotation.y * 180) / Math.PI, 5, (v) =>
          exact(() => editor.rotate((v * Math.PI) / 180 - object.rotation.y))
        )
      )
    );
    inspector.append(
      field(
        'scale',
        numberInput(object.scale.x, 0.1, (v) => editor.setScale(Math.max(0.01, v)))
      )
    );

    const tags = document.createElement('input');
    tags.value = target.tags.join(', ');
    tags.placeholder = 'spawn, pickup…';
    tags.addEventListener('change', () =>
      editor.setTags(tags.value.split(',').map((t) => t.trim()).filter(Boolean))
    );
    inspector.append(field('tags', tags));

    // The props panel is generated from what the CATALOG says the kind has,
    // so this file knows nothing about houses, towers or trees.
    if (!info?.fields.length) return;
    const propsHeading = document.createElement('h4');
    propsHeading.textContent = 'Props';
    inspector.append(propsHeading);

    const current = {
      ...info.defaults,
      ...(live.specs.find((s) => s.id === target.id)?.props ?? {}),
    } as Record<string, unknown>;

    for (const spec of info.fields) {
      const value = current[spec.key];
      const label = spec.label ?? spec.key;
      if (spec.type === 'color') {
        const input = document.createElement('input');
        input.type = 'color';
        input.value = hex(typeof value === 'number' ? value : 0xffffff);
        input.addEventListener('change', () =>
          editor.setProps({ [spec.key]: parseInt(input.value.slice(1), 16) })
        );
        inspector.append(field(label, input));
      } else if (spec.type === 'select') {
        const select = document.createElement('select');
        for (const option of spec.options ?? []) {
          const item = document.createElement('option');
          item.value = option;
          item.textContent = option;
          select.append(item);
        }
        select.value = String(value ?? spec.options?.[0] ?? '');
        select.addEventListener('change', () => editor.setProps({ [spec.key]: select.value }));
        inspector.append(field(label, select));
      } else if (spec.type === 'boolean') {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = !!value;
        input.addEventListener('change', () => editor.setProps({ [spec.key]: input.checked }));
        inspector.append(field(label, input));
      } else if (spec.type === 'number') {
        const input = numberInput(typeof value === 'number' ? value : 0, spec.step ?? 0.1, (v) =>
          editor.setProps({ [spec.key]: v })
        );
        if (spec.min !== undefined) input.min = String(spec.min);
        if (spec.max !== undefined) input.max = String(spec.max);
        inspector.append(field(label, input));
      } else {
        const input = document.createElement('input');
        input.value = String(value ?? '');
        input.addEventListener('change', () => editor.setProps({ [spec.key]: input.value }));
        inspector.append(field(label, input));
      }
    }
  }

  // --------------------------------------------------------------- status

  function drawStatus(): void {
    const data = editor.toJSON();
    const unknown = data.entities.filter((e) => !catalog.has(e.kind)).length;
    status.innerHTML =
      `<span><b>${levelName}</b></span>` +
      `<span><b>${data.entities.length}</b> entities · <b>${live.objects.length}</b> built` +
      (unknown ? ` · <b style="color:var(--ed-warn)">${unknown}</b> unknown kind` : '') +
      `</span>` +
      `<span>selection <b>${editor.selection.length || '—'}</b></span>` +
      `<span>undo <b>${editor.undoLabel ?? '—'}</b></span>` +
      `<span>${JSON.stringify(data).length} bytes</span>`;

    const undo = part<HTMLButtonElement>('undo');
    const redo = part<HTMLButtonElement>('redo');
    undo.disabled = !editor.canUndo;
    redo.disabled = !editor.canRedo;
    undo.textContent = editor.canUndo ? `Undo ${editor.undoLabel}` : 'Undo';
    redo.textContent = editor.canRedo ? `Redo ${editor.redoLabel}` : 'Redo';
  }

  // ------------------------------------------------------------- pointers

  const ray = new Raycaster();
  const ndc = new Vector2();
  const groundPlane = new Plane(new Vector3(0, 1, 0), 0);
  const hitPoint = new Vector3();
  let dragStart = new Vector3();
  let orbiting = false;
  let panning = false;
  const lastPointer = new Vector2();
  const canvas = game.renderer.domElement;

  const toNdc = (event: PointerEvent): Vector2 => {
    const rect = canvas.getBoundingClientRect();
    return ndc.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
  };

  /**
   * Placing looks for a surface first, so a crate dropped on a platform
   * lands ON it. Dragging must not — the ray would keep hitting the thing
   * being dragged and chase itself across the map.
   */
  function surfaceAt(event: PointerEvent, planeHeight = 0, useSurfaces = true): Vector3 | null {
    ray.setFromCamera(toNdc(event), camera);
    if (useSurfaces) {
      const hits = ray.intersectObject(root, true);
      if (hits.length) return hits[0].point.clone();
    }
    groundPlane.constant = -planeHeight;
    return ray.ray.intersectPlane(groundPlane, hitPoint) ? hitPoint.clone() : null;
  }

  const snapTo = (v: number) => (editor.snap > 0 ? Math.round(v / editor.snap) * editor.snap : round(v));

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  canvas.addEventListener('pointerdown', (event) => {
    canvas.setPointerCapture(event.pointerId);
    lastPointer.set(event.clientX, event.clientY);

    if (event.button === 2 || event.button === 1) {
      orbiting = !event.shiftKey && event.button === 2;
      panning = !orbiting;
      look.pointerDown = orbiting;
      return;
    }
    if (event.button !== 0) return;

    if (armed) {
      const at = surfaceAt(event);
      if (at) {
        editor.place({ kind: armed, at: [snapTo(at.x), round(at.y), snapTo(at.z)] });
        if (!event.shiftKey) armed = null; // shift keeps the tool, for a row of things
        refresh();
      }
      return;
    }

    const point = toNdc(event);
    const picked = editor.pick(point.x, point.y, camera);
    if (!picked) {
      if (!event.shiftKey) editor.select(null);
      return;
    }
    if (event.shiftKey) editor.select(picked.id, { toggle: true });
    else if (!editor.isSelected(picked.id)) editor.select(picked.id);

    const at = surfaceAt(event, picked.object.position.y, false);
    if (!at || !editor.selection.length) return;
    dragStart = at;
    dragging = new Map(editor.selected.map((p) => [p.id, p.object.position.clone()]));
  });

  canvas.addEventListener('pointermove', (event) => {
    if (orbiting) {
      look.pointerDelta.set(event.clientX - lastPointer.x, event.clientY - lastPointer.y);
      lastPointer.set(event.clientX, event.clientY);
      return;
    }
    if (panning) {
      const dx = (event.clientX - lastPointer.x) * rig.distance * 0.0016;
      const dy = (event.clientY - lastPointer.y) * rig.distance * 0.0016;
      const right = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0).setY(0).normalize();
      const forward = new Vector3().crossVectors(new Vector3(0, 1, 0), right);
      pivot.position.addScaledVector(right, -dx).addScaledVector(forward, -dy);
      lastPointer.set(event.clientX, event.clientY);
      return;
    }
    if (!dragging) return;

    const at = surfaceAt(event, dragStart.y, false);
    if (!at) return;
    // Put everything back where the drag started and apply the WHOLE
    // offset: re-quantising an incremental delta every frame drifts.
    for (const [id, from] of dragging) live.byId(id)?.object.position.copy(from);
    editor.move(at.x - dragStart.x, 0, at.z - dragStart.z);
  });

  const endPointer = (event: PointerEvent) => {
    if (dragging) {
      dragging = null;
      editor.commit();
      refresh();
    }
    orbiting = panning = false;
    look.pointerDown = false;
    look.pointerDelta.set(0, 0);
    canvas.releasePointerCapture?.(event.pointerId);
  };
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);
  canvas.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      look.wheelDelta = event.deltaY;
    },
    { passive: false }
  );

  // ------------------------------------------------------------- keyboard

  const held = new Set<string>();
  const typing = (event: KeyboardEvent) =>
    (event.target as HTMLElement)?.matches?.('input, select, textarea');

  const onKeyDown = (event: KeyboardEvent) => {
    if (typing(event)) return;
    held.add(event.code);
    const meta = event.ctrlKey || event.metaKey;

    if (meta && event.code === 'KeyZ') {
      if (event.shiftKey) editor.redo();
      else editor.undo();
      return event.preventDefault();
    }
    if (meta && event.code === 'KeyY') {
      editor.redo();
      return event.preventDefault();
    }
    if (meta && event.code === 'KeyD') {
      editor.duplicate();
      return event.preventDefault();
    }
    if (meta && event.code === 'KeyS') {
      download();
      return event.preventDefault();
    }
    if (meta && event.code === 'KeyA') {
      editor.selectAll();
      return event.preventDefault();
    }
    if (meta) return;

    const step = event.shiftKey ? 0.05 : editor.snap || 0.25;
    switch (event.code) {
      case 'Escape':
        if (armed) armed = null;
        else editor.select(null);
        refresh();
        break;
      case 'Tab':
        editor.selectNext(event.shiftKey ? -1 : 1);
        break;
      case 'Delete':
      case 'Backspace':
        editor.remove();
        break;
      case 'ArrowLeft':
        editor.move(-step, 0, 0);
        break;
      case 'ArrowRight':
        editor.move(step, 0, 0);
        break;
      case 'ArrowUp':
        editor.move(0, 0, -step);
        break;
      case 'ArrowDown':
        editor.move(0, 0, step);
        break;
      case 'PageUp':
        editor.move(0, step, 0);
        break;
      case 'PageDown':
        editor.move(0, -step, 0);
        break;
      case 'KeyQ':
        editor.rotate(editor.snapAngle || 0.08);
        break;
      case 'KeyE':
        editor.rotate(-(editor.snapAngle || 0.08));
        break;
      case 'BracketRight':
        editor.scaleBy(1.1);
        break;
      case 'BracketLeft':
        editor.scaleBy(1 / 1.1);
        break;
      case 'KeyG':
        editor.ground();
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  const onKeyUp = (event: KeyboardEvent) => {
    held.delete(event.code);
    editor.commit(); // a burst of nudges is one undo step
  };
  const onBlur = () => held.clear();

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);

  // --------------------------------------------------------- files & store

  let storeTimer = 0;
  function store(): void {
    if (!storageKey) return;
    clearTimeout(storeTimer);
    storeTimer = window.setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(toJSON()));
      } catch {
        /* private mode, a full quota — not worth interrupting anybody over */
      }
    }, 400);
  }

  function download(): void {
    const blob = new Blob([`${JSON.stringify(toJSON(), null, 2)}\n`], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${levelName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'level'}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    try {
      load(JSON.parse(await file.text()) as LevelData);
    } catch (error) {
      alert(`That did not load: ${(error as Error).message}`);
    }
    fileInput.value = '';
  });

  // -------------------------------------------------------------- toolbar

  const extras = part('extras');
  for (const action of options.actions ?? []) {
    const button = document.createElement('button');
    button.textContent = action.label;
    if (action.title) button.title = action.title;
    button.addEventListener('click', () => action.run(session));
    extras.append(button);
  }

  shell.querySelector('.ed-tools')!.addEventListener('click', (event) => {
    const act = (event.target as HTMLElement).closest<HTMLElement>('[data-act]')?.dataset.act;
    if (act === 'new') load({ format: 'gama.level', version: 1, name: 'Untitled', entities: [] });
    else if (act === 'open') fileInput.click();
    else if (act === 'save') download();
    else if (act === 'copy') navigator.clipboard?.writeText(JSON.stringify(toJSON(), null, 2));
    else if (act === 'undo') editor.undo();
    else if (act === 'redo') editor.redo();
    else if (act === 'help') part<HTMLDialogElement>('help').showModal();
  });

  snapSelect.addEventListener('change', () => {
    editor.snap = Number(snapSelect.value);
  });
  angleSelect.addEventListener('change', () => {
    editor.snapAngle = (Number(angleSelect.value) * Math.PI) / 180;
  });

  // ------------------------------------------------------------- the loop

  const unsubscribe = game.onUpdate((time) => {
    if (held.size) {
      const speed = 26 * time.delta;
      const right = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0).setY(0).normalize();
      const forward = new Vector3().crossVectors(new Vector3(0, 1, 0), right);
      if (held.has('KeyA')) pivot.position.addScaledVector(right, -speed);
      if (held.has('KeyD')) pivot.position.addScaledVector(right, speed);
      if (held.has('KeyW')) pivot.position.addScaledVector(forward, speed);
      if (held.has('KeyS')) pivot.position.addScaledVector(forward, -speed);
    }
    rig.update(time.delta);
    look.pointerDelta.set(0, 0);
    look.wheelDelta = 0;
    for (const box of gizmos.children) (box as BoxHelper).update();
  });

  function dispose(): void {
    for (const child of gizmos.children) {
      const box = child as BoxHelper;
      box.geometry.dispose();
      box.material.dispose();
    }
    gizmos.clear();
    unsubscribe();
    game.stop();
    observer.disconnect();
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('blur', onBlur);
    live?.dispose();
    shell.remove();
  }

  // ------------------------------------------------------------------- go

  drawPalette();
  options.decorate ? options.decorate(scene, session) : defaultDecor(scene);

  let start = options.level;
  if (storageKey) {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) start = JSON.parse(saved) as LevelData;
    } catch {
      /* fall through to the supplied level */
    }
  }
  try {
    load(start ?? { format: 'gama.level', version: 1, name: 'Untitled', entities: [] });
  } catch {
    // Stored work from an older format should not brick the page.
    load(options.level ?? { format: 'gama.level', version: 1, name: 'Untitled', entities: [] });
  }
  game.start();

  return session;
}

/** A lit grid over a green plane — replaced by `decorate` for a real game. */
function defaultDecor(scene: Scene): void {
  scene.background = new Color(0x0f1420);
  scene.fog = new Fog(0x0f1420, 70, 200);

  const sun = new DirectionalLight(0xfff2dc, 2.5);
  sun.position.set(24, 34, 16);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -50;
  sun.shadow.camera.right = 50;
  sun.shadow.camera.top = 50;
  sun.shadow.camera.bottom = -50;
  sun.shadow.camera.far = 120;
  sun.shadow.bias = -0.0008;
  scene.add(sun, new HemisphereLight(0xa8c6e8, 0x4a5540, 1.7));

  const ground = new Mesh(
    new PlaneGeometry(400, 400),
    new MeshStandardMaterial({ color: 0x44553a, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new GridHelper(120, 120, 0x6ba0ff, 0x33455e);
  grid.material.transparent = true;
  grid.material.opacity = 0.4;
  scene.add(grid);
}

