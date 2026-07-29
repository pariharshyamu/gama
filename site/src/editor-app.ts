/**
 * A working level editor, built on GAMA's `Catalog`, `Level` and `Editor`.
 *
 * Almost nothing here is editor logic. Selection, snapping, the undo stack,
 * add/duplicate/delete, prop rebuilds and picking all live in the library
 * and are covered by tests; this file is the part that cannot be tested
 * headlessly — DOM, pointers, a camera and a palette. That split is the
 * whole argument for putting an editor in a game library rather than
 * shipping a separate program.
 */
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
} from 'three';
import { Editor, Game, Level, OrbitRig, type LevelData, type LevelInstance } from 'gama3d';
import { EMPTY, STARTER, kit } from './editor-kit';

const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const STORE_KEY = 'gama.editor.level';

// ---------------------------------------------------------------- the scene

const viewport = $('viewport');
const game = new Game({ parent: viewport, autoResize: false, antialias: true });
const scene = game.world.scene;
const camera = game.camera as PerspectiveCamera;

game.renderer.shadowMap.enabled = true;
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

/** Selection boxes live here, so they are never mistaken for level content. */
const gizmos = new Group();
gizmos.name = 'gizmos';
scene.add(gizmos);

// ---------------------------------------------------------------- the camera

const pivot = new Object3D();
scene.add(pivot);

/** A `PointerLookInput` the rig reads — fed only while the right button is down. */
const look = { pointerDelta: new Vector2(), wheelDelta: 0, pointerDown: false };
const rig = new OrbitRig(camera, pivot, look, {
  distance: 30,
  minDistance: 4,
  maxDistance: 130,
  pitch: 0.72,
  yaw: 0.5,
  maxPitch: 1.45,
  stiffness: 14,
  lookOffset: new Vector3(0, 1.5, 0),
});

const resize = () => {
  const width = viewport.clientWidth || 1;
  const height = viewport.clientHeight || 1;
  game.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  game.renderer.setSize(width, height, true);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};
new ResizeObserver(resize).observe(viewport);
resize();

// ----------------------------------------------------------------- the level

let root = new Group();
let live!: LevelInstance;
let editor!: Editor;
let levelName = '';
let levelSeed = 1;

function load(data: LevelData): void {
  live?.dispose();
  scene.remove(root);
  root = new Group();
  root.name = 'level';
  scene.add(root);

  const level = Level.parse(data);
  levelName = level.name ?? 'Untitled';
  levelSeed = level.seed;
  live = level.instantiate(kit, root);
  editor = new Editor(live, {
    snap: Number($<HTMLSelectElement>('snap').value),
    snapAngle: (Number($<HTMLSelectElement>('angle').value) * Math.PI) / 180,
    onChange: () => refresh(),
  });
  armed = null;
  refresh();
}

/** Everything the DOM shows, redrawn from the editor's state. */
function refresh(): void {
  // A drag fires this every frame, and rebuilding a panel of inputs sixty
  // times a second is both wasteful and impossible to type into. The boxes
  // already follow their objects in the render loop.
  if (dragging) {
    drawStatus();
    save();
    return;
  }
  drawSelection();
  drawInspector();
  drawStatus();
  drawPaletteState();
  save();
}

// ------------------------------------------------------------- the selection

function drawSelection(): void {
  gizmos.clear();
  for (const placed of editor.selected) {
    placed.object.updateWorldMatrix(true, true);
    const box = new BoxHelper(placed.object, 0x4d8dff);
    box.material.depthTest = false;
    box.renderOrder = 2;
    gizmos.add(box);
  }
}

// --------------------------------------------------------------- the palette

const palette = $('palette');
let armed: string | null = null;

function drawPalette(): void {
  const groups = new Map<string, HTMLElement>();
  for (const info of kit.list()) {
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
  const hint = $('hint');
  hint.classList.toggle('armed', !!armed);
  hint.innerHTML = armed
    ? `Click the ground to place <b>${armed}</b> — <kbd>Esc</kbd> to put it down`
    : editor.selection.length
      ? `<b>${editor.selection.join(', ')}</b> — drag to move · <b>Q</b>/<b>E</b> turn · <b>[</b>/<b>]</b> scale · <b>Del</b>`
      : 'Click a thing to select it, or pick something from the palette';
}

// ------------------------------------------------------------- the inspector

const inspector = $('inspector');

function field(label: string, control: HTMLElement): HTMLElement {
  const row = document.createElement('div');
  row.className = 'row';
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

const round = (n: number) => Math.round(n * 1000) / 1000;
const hex = (n: number) => `#${(n & 0xffffff).toString(16).padStart(6, '0')}`;

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
      save();
      drawStatus();
    });
    inspector.append(field('name', name));
    inspector.append(
      field(
        'seed',
        numberInput(levelSeed, 1, (v) => {
          // A new seed is a new world: everything derived from it rebuilds.
          const data = editor.toJSON();
          load({ ...data, name: levelName, seed: Math.round(v) });
        })
      )
    );

    const note = document.createElement('div');
    note.className = 'empty';
    note.textContent = editor.selection.length
      ? `${editor.selection.length} selected — pick one to edit its props.`
      : 'Nothing selected.';
    inspector.append(note);
    return;
  }

  const object = target.object;
  const heading = document.createElement('h4');
  heading.textContent = kit.info(target.kind)?.label ?? target.kind;
  inspector.append(heading);

  const id = document.createElement('div');
  id.className = 'readonly';
  id.textContent = `${target.id}  ·  ${target.kind}`;
  inspector.append(field('id', id));

  // Position as three boxes, so a level can be typed as well as dragged.
  const triple = document.createElement('div');
  triple.className = 'triple';
  for (const axis of ['x', 'y', 'z'] as const) {
    triple.append(
      numberInput(object.position[axis], 0.1, (v) => {
        const p = object.position.clone();
        p[axis] = v;
        withoutSnap(() => editor.moveTo(p.x, p.y, p.z));
      })
    );
  }
  inspector.append(field('position', triple));

  inspector.append(
    field(
      'yaw°',
      numberInput((object.rotation.y * 180) / Math.PI, 5, (v) => {
        withoutSnap(() => editor.rotate((v * Math.PI) / 180 - object.rotation.y));
      })
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

  // ---- the props: drawn from what the CATALOG says the kind has, so this
  // panel knows nothing about houses, towers or trees.
  const info = kit.info(target.kind);
  if (info?.fields.length) {
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
}

/** Typed numbers are exact numbers — the grid is for dragging, not for typing. */
function withoutSnap(run: () => void): void {
  const [snap, angle] = [editor.snap, editor.snapAngle];
  editor.snap = 0;
  editor.snapAngle = 0;
  run();
  editor.commit();
  editor.snap = snap;
  editor.snapAngle = angle;
}

// ----------------------------------------------------------------- the status

function drawStatus(): void {
  const data = editor.toJSON();
  const built = live.objects.length;
  const unknown = data.entities.filter((e) => !kit.has(e.kind)).length;
  $('status').innerHTML =
    `<span><b>${levelName}</b></span>` +
    `<span><b>${data.entities.length}</b> entities · <b>${built}</b> built` +
    (unknown ? ` · <b style="color:var(--warn)">${unknown}</b> unknown kind` : '') +
    `</span>` +
    `<span>selection <b>${editor.selection.length || '—'}</b></span>` +
    `<span>undo <b>${editor.undoLabel ?? '—'}</b></span>` +
    `<span>${JSON.stringify(data).length} bytes</span>`;

  const undo = $<HTMLButtonElement>('undo');
  const redo = $<HTMLButtonElement>('redo');
  undo.disabled = !editor.canUndo;
  redo.disabled = !editor.canRedo;
  undo.textContent = editor.canUndo ? `Undo ${editor.undoLabel}` : 'Undo';
  redo.textContent = editor.canRedo ? `Redo ${editor.redoLabel}` : 'Redo';
}

// -------------------------------------------------------------- the pointers

const ray = new Raycaster();
const ndc = new Vector2();
const groundPlane = new Plane(new Vector3(0, 1, 0), 0);
const hitPoint = new Vector3();

let dragging: Map<string, Vector3> | null = null;
let dragStart = new Vector3();
let orbiting = false;
let panning = false;
let lastPointer = new Vector2();

const toNdc = (event: PointerEvent | WheelEvent): Vector2 => {
  const rect = game.renderer.domElement.getBoundingClientRect();
  return ndc.set(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );
};

/**
 * Where a screen point lands in the world.
 *
 * Placing looks for a surface first, so a crate dropped on a platform lands
 * ON it. Dragging must NOT — the ray would keep hitting the thing being
 * dragged and chase itself across the map — so it uses a flat plane at the
 * height the drag started from.
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

const canvas = game.renderer.domElement;
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

canvas.addEventListener('pointerdown', (event) => {
  canvas.setPointerCapture(event.pointerId);
  lastPointer.set(event.clientX, event.clientY);

  if (event.button === 2 || event.button === 1) {
    // Right orbits, right+shift (or middle) slides the camera over the map.
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
      if (!event.shiftKey) armed = null; // shift keeps the tool for a row of things
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
    // Slide the pivot in the camera's own ground plane, scaled by distance so
    // the map moves with the cursor rather than with the zoom level.
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
  // Put everything back where the drag started and apply the WHOLE offset:
  // re-quantising an incremental delta every frame drifts, and the editor
  // snaps the result rather than the step.
  for (const [id, from] of dragging) live.byId(id)?.object.position.copy(from);
  editor.move(at.x - dragStart.x, 0, at.z - dragStart.z);
});

const endPointer = (event: PointerEvent) => {
  if (dragging) editor.commit();
  dragging = null;
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

const snapTo = (v: number) => (editor.snap > 0 ? Math.round(v / editor.snap) * editor.snap : round(v));

// -------------------------------------------------------------- the keyboard

addEventListener('keydown', (event) => {
  const target = event.target as HTMLElement;
  if (target?.matches('input, select, textarea')) return;
  const meta = event.ctrlKey || event.metaKey;

  if (meta && event.code === 'KeyZ') {
    event.shiftKey ? editor.redo() : editor.undo();
    return event.preventDefault();
  }
  if (meta && (event.code === 'KeyY')) {
    editor.redo();
    return event.preventDefault();
  }
  if (meta && event.code === 'KeyD') {
    editor.duplicate();
    return event.preventDefault();
  }
  if (meta && event.code === 'KeyS') {
    saveFile();
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
      armed ? (armed = null) : editor.select(null);
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
      return; // let everything else through
  }
  event.preventDefault();
});

// A key going up ends the run of nudges, so one burst is one undo.
addEventListener('keyup', () => editor.commit());

// Camera panning on WASD, read every frame rather than on keydown so it
// accelerates smoothly instead of repeating at the OS key-repeat rate.
const held = new Set<string>();
addEventListener('keydown', (e) => {
  if (!(e.target as HTMLElement)?.matches('input, select, textarea')) held.add(e.code);
});
addEventListener('keyup', (e) => held.delete(e.code));
addEventListener('blur', () => held.clear());

// ------------------------------------------------------------ files & saving

let saveTimer = 0;
function save(): void {
  clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(toFile()));
    } catch {
      /* private mode, a full quota — not worth interrupting anybody over */
    }
  }, 400);
}

const toFile = (): LevelData => ({ ...editor.toJSON(), name: levelName, seed: levelSeed });

function saveFile(): void {
  const blob = new Blob([`${JSON.stringify(toFile(), null, 2)}\n`], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${levelName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'level'}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

$('file').addEventListener('change', async (event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  try {
    load(JSON.parse(await file.text()) as LevelData);
  } catch (error) {
    alert(`That did not load: ${(error as Error).message}`);
  }
  (event.target as HTMLInputElement).value = '';
});

// ---------------------------------------------------------------- the toolbar

document.querySelector('.tools')!.addEventListener('click', (event) => {
  const act = (event.target as HTMLElement).closest<HTMLElement>('[data-act]')?.dataset.act;
  if (act === 'new') load({ ...EMPTY });
  else if (act === 'reset') load(STARTER);
  else if (act === 'open') $('file').click();
  else if (act === 'save') saveFile();
  else if (act === 'copy') navigator.clipboard?.writeText(JSON.stringify(toFile(), null, 2));
  else if (act === 'undo') editor.undo();
  else if (act === 'redo') editor.redo();
  else if (act === 'help') $<HTMLDialogElement>('help').showModal();
});

$('snap').addEventListener('change', (event) => {
  editor.snap = Number((event.target as HTMLSelectElement).value);
});
$('angle').addEventListener('change', (event) => {
  editor.snapAngle = (Number((event.target as HTMLSelectElement).value) * Math.PI) / 180;
});

// ------------------------------------------------------------------- the loop

game.onUpdate((time) => {
  const speed = 26 * time.delta;
  if (held.size) {
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

// ------------------------------------------------------------------- go

drawPalette();
let restored: LevelData | null = null;
try {
  const saved = localStorage.getItem(STORE_KEY);
  if (saved) restored = JSON.parse(saved) as LevelData;
} catch {
  restored = null;
}
try {
  load(restored ?? STARTER);
} catch {
  load(STARTER); // a stored level from an older format should not brick the page
}
game.start();

// ------------------------------------------------- headless verification hook

declare global {
  interface Window {
    editorDebug: () => Record<string, unknown>;
    editorSelfTest: () => Record<string, unknown>;
  }
}

window.editorDebug = () => ({
  entities: editor.toJSON().entities.length,
  built: live.objects.length,
  editable: editor.editable.length,
  kinds: kit.kinds.length,
  selection: editor.selection,
  undo: editor.undoLabel,
  historyLength: editor.historyLength,
  paletteButtons: palette.querySelectorAll('button').length,
  inspectorRows: inspector.querySelectorAll('.row').length,
  draws: game.renderer.info.render.calls,
  triangles: game.renderer.info.render.triangles,
});

/**
 * The check that matters: drive the real editor through a real edit and see
 * whether the file comes back. A screenshot proves it renders; this proves
 * the round trip survives a session.
 */
window.editorSelfTest = () => {
  // Only this test's own steps are undone. Walking the WHOLE stack would
  // also undo whatever the session did before it was called, and then
  // "restored" would be comparing against somebody else's level.
  const depth = editor.historyLength;
  const before = JSON.stringify(editor.toJSON());
  editor.select(editor.editable[0].id);
  editor.move(3, 0, -2);
  editor.commit();
  editor.rotate(0.4);
  editor.commit();
  const placed = editor.place({ kind: 'barrel', at: [2, 0, 2] });
  const duplicated = editor.duplicate();
  editor.remove();
  const dirty = JSON.stringify(editor.toJSON());

  let steps = 0;
  while (editor.historyLength > depth && editor.undo()) steps++;
  const after = JSON.stringify(editor.toJSON());
  return {
    placed: !!placed,
    duplicated: duplicated.length,
    changed: dirty !== before,
    steps,
    restored: after === before,
    entities: editor.toJSON().entities.length,
  };
};
