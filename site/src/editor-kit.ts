/**
 * The kit the editor places.
 *
 * GAMA cannot import SCENA, so the docs site cannot show off SCENA's props
 * here — and that is the point worth demonstrating anyway: a `Catalog` is
 * whatever the game registers. These are twelve small procedural props
 * built from three.js primitives, each one describing its own editable
 * fields, so the palette and the inspector are GENERATED rather than
 * hard-coded. Swap this file for SCENA factories and the editor is
 * unchanged.
 */
import {
  BoxGeometry,
  CylinderGeometry,
  ConeGeometry,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  type BufferGeometry,
} from 'three';
import { Catalog, type LevelData } from 'gama3d';

/** A tiny deterministic generator, so an entity looks the same every load. */
const rng = (seed: number) => {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};

const num = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const paint = (color: unknown, fallback: number, rough = 0.85) =>
  new MeshStandardMaterial({ color: num(color, fallback), roughness: rough });

const part = (geometry: BufferGeometry, material: MeshStandardMaterial, y = 0): Mesh => {
  const mesh = new Mesh(geometry, material);
  mesh.position.y = y;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
};

const WOOD = 0x8a6242;
const STONE = 0xc3bba9;
const LEAF = 0x4a7c48;

export const kit = new Catalog();

// ---- structures -----------------------------------------------------------

kit.define(
  'wall',
  (props) => {
    const length = num(props.length, 4);
    const height = num(props.height, 2.2);
    const wall = part(new BoxGeometry(length, height, 0.35), paint(props.color, STONE), height / 2);
    return wall;
  },
  {
    label: 'Wall',
    group: 'Structures',
    defaults: { length: 4, height: 2.2, color: STONE },
    fields: [
      { key: 'length', type: 'number', min: 1, max: 20, step: 0.5 },
      { key: 'height', type: 'number', min: 0.5, max: 8, step: 0.1 },
      { key: 'color', type: 'color' },
    ],
  }
);

kit.define(
  'pillar',
  (props) => {
    const height = num(props.height, 3);
    const group = new Group();
    const material = paint(props.color, STONE);
    group.add(part(new CylinderGeometry(0.34, 0.4, height, 12), material, height / 2));
    group.add(part(new BoxGeometry(1, 0.24, 1), material, 0.12));
    group.add(part(new BoxGeometry(0.9, 0.22, 0.9), material, height - 0.11));
    return group;
  },
  {
    label: 'Pillar',
    group: 'Structures',
    defaults: { height: 3, color: STONE },
    fields: [
      { key: 'height', type: 'number', min: 1, max: 10, step: 0.2 },
      { key: 'color', type: 'color' },
    ],
  }
);

kit.define(
  'house',
  (props, ctx) => {
    const random = rng(ctx.seed);
    const width = num(props.width, 4);
    const depth = num(props.depth, 3.4);
    const storeys = Math.max(1, Math.round(num(props.storeys, 1)));
    const body = 2.4 * storeys;
    const group = new Group();
    const walls = paint(props.color, 0xd9cdb4);
    const roofPaint = paint(props.roofColor, 0x8c4b3a, 0.9);

    group.add(part(new BoxGeometry(width, body, depth), walls, body / 2));
    if (props.roof === 'flat') {
      group.add(part(new BoxGeometry(width + 0.3, 0.24, depth + 0.3), roofPaint, body + 0.12));
    } else {
      // A four-sided cone is measured to its CORNERS, so sizing it off the
      // longer wall gives a roof a quarter too wide. The diagonal is what
      // has to be covered.
      const roof = part(new ConeGeometry(Math.hypot(width, depth) * 0.55, 1.5, 4), roofPaint, body + 0.75);
      roof.rotation.y = Math.PI / 4;
      group.add(roof);
    }
    // A door and a couple of windows, jittered by the seed so a row of
    // houses is a row of houses rather than one house copied five times.
    const trim = new MeshStandardMaterial({ color: 0x3d3226, roughness: 0.6 });
    const door = part(new BoxGeometry(0.8, 1.5, 0.12), trim, 0.75);
    door.position.z = depth / 2 + 0.01;
    group.add(door);
    for (let i = 0; i < storeys * 2; i++) {
      const window = part(new BoxGeometry(0.62, 0.62, 0.1), trim, 1.4 + Math.floor(i / 2) * 2.4);
      window.position.x = (i % 2 ? 1 : -1) * (width * 0.26 + random() * 0.2);
      window.position.z = depth / 2 + 0.01;
      group.add(window);
    }
    return group;
  },
  {
    label: 'House',
    group: 'Structures',
    defaults: { width: 4, depth: 3.4, storeys: 1, roof: 'gable', color: 0xd9cdb4, roofColor: 0x8c4b3a },
    fields: [
      { key: 'width', type: 'number', min: 2, max: 12, step: 0.2 },
      { key: 'depth', type: 'number', min: 2, max: 12, step: 0.2 },
      { key: 'storeys', type: 'number', min: 1, max: 4, step: 1 },
      { key: 'roof', type: 'select', options: ['gable', 'flat'] },
      { key: 'color', type: 'color' },
      { key: 'roofColor', type: 'color', label: 'roof colour' },
    ],
  }
);

kit.define(
  'tower',
  (props) => {
    const height = num(props.height, 9);
    const radius = num(props.radius, 1.5);
    const group = new Group();
    const material = paint(props.color, 0xb9b0a0);
    group.add(part(new CylinderGeometry(radius, radius * 1.12, height, 14), material, height / 2));
    group.add(part(new CylinderGeometry(radius * 1.2, radius * 1.2, 0.4, 14), material, height));
    const cap = part(new ConeGeometry(radius * 1.25, 2.2, 14), paint(props.roofColor, 0x4a5a6b, 0.7), height + 1.3);
    group.add(cap);
    return group;
  },
  {
    label: 'Tower',
    group: 'Structures',
    defaults: { height: 9, radius: 1.5, color: 0xb9b0a0, roofColor: 0x4a5a6b },
    fields: [
      { key: 'height', type: 'number', min: 3, max: 30, step: 0.5 },
      { key: 'radius', type: 'number', min: 0.6, max: 5, step: 0.1 },
      { key: 'color', type: 'color' },
      { key: 'roofColor', type: 'color', label: 'roof colour' },
    ],
  }
);

kit.define(
  'platform',
  (props) => {
    const width = num(props.width, 5);
    const depth = num(props.depth, 5);
    const height = num(props.height, 0.4);
    return part(new BoxGeometry(width, height, depth), paint(props.color, 0x9a927f), height / 2);
  },
  {
    label: 'Platform',
    group: 'Structures',
    defaults: { width: 5, depth: 5, height: 0.4, color: 0x9a927f },
    fields: [
      { key: 'width', type: 'number', min: 1, max: 24, step: 0.5 },
      { key: 'depth', type: 'number', min: 1, max: 24, step: 0.5 },
      { key: 'height', type: 'number', min: 0.1, max: 4, step: 0.1 },
      { key: 'color', type: 'color' },
    ],
  }
);

// ---- nature ---------------------------------------------------------------

kit.define(
  'tree',
  (props, ctx) => {
    const random = rng(ctx.seed);
    const height = num(props.height, 4.5);
    const group = new Group();
    const trunk = part(
      new CylinderGeometry(0.14, 0.22, height * 0.45, 7),
      paint(props.trunkColor, 0x6b4b32),
      height * 0.22
    );
    trunk.rotation.z = (random() - 0.5) * 0.08;
    group.add(trunk);
    const leaves = paint(props.color, LEAF, 0.95);
    const tiers = 3;
    for (let i = 0; i < tiers; i++) {
      const t = i / (tiers - 1);
      const cone = part(
        new ConeGeometry(height * (0.32 - t * 0.14), height * 0.4, 8),
        leaves,
        height * (0.42 + t * 0.22)
      );
      cone.rotation.y = random() * Math.PI;
      group.add(cone);
    }
    return group;
  },
  {
    label: 'Tree',
    group: 'Nature',
    defaults: { height: 4.5, color: LEAF, trunkColor: 0x6b4b32 },
    fields: [
      { key: 'height', type: 'number', min: 1.5, max: 14, step: 0.25 },
      { key: 'color', type: 'color', label: 'leaves' },
      { key: 'trunkColor', type: 'color', label: 'trunk' },
    ],
  }
);

kit.define(
  'bush',
  (props, ctx) => {
    const random = rng(ctx.seed);
    const radius = num(props.radius, 0.7);
    const group = new Group();
    const material = paint(props.color, 0x54793f, 0.95);
    for (let i = 0; i < 3; i++) {
      const blob = part(new SphereGeometry(radius * (0.7 + random() * 0.4), 8, 6), material, radius * 0.7);
      blob.position.x = (random() - 0.5) * radius;
      blob.position.z = (random() - 0.5) * radius;
      group.add(blob);
    }
    return group;
  },
  {
    label: 'Bush',
    group: 'Nature',
    defaults: { radius: 0.7, color: 0x54793f },
    fields: [
      { key: 'radius', type: 'number', min: 0.2, max: 3, step: 0.1 },
      { key: 'color', type: 'color' },
    ],
  }
);

kit.define(
  'rock',
  (props, ctx) => {
    const random = rng(ctx.seed);
    const size = num(props.size, 1);
    const rock = part(new IcosahedronGeometry(size, 0), paint(props.color, 0x8b8b86, 0.95), size * 0.55);
    rock.scale.set(1 + random() * 0.5, 0.6 + random() * 0.5, 1 + random() * 0.5);
    rock.rotation.set(random(), random() * Math.PI, random());
    return rock;
  },
  {
    label: 'Rock',
    group: 'Nature',
    defaults: { size: 1, color: 0x8b8b86 },
    fields: [
      { key: 'size', type: 'number', min: 0.2, max: 6, step: 0.1 },
      { key: 'color', type: 'color' },
    ],
  }
);

// ---- props ----------------------------------------------------------------

kit.define(
  'crate',
  (props) => {
    const size = num(props.size, 1);
    const group = new Group();
    const material = paint(props.color, 0xb98b46, 0.8);
    group.add(part(new BoxGeometry(size, size, size), material, size / 2));
    const band = new MeshStandardMaterial({ color: 0x6d4f28, roughness: 0.7 });
    group.add(part(new BoxGeometry(size * 1.02, size * 0.12, size * 1.02), band, size * 0.78));
    return group;
  },
  {
    label: 'Crate',
    group: 'Props',
    defaults: { size: 1, color: 0xb98b46 },
    fields: [
      { key: 'size', type: 'number', min: 0.3, max: 3, step: 0.1 },
      { key: 'color', type: 'color' },
    ],
  }
);

kit.define(
  'barrel',
  (props) => {
    const height = num(props.height, 1.1);
    const group = new Group();
    const material = paint(props.color, 0x7d5a35, 0.8);
    group.add(part(new CylinderGeometry(0.44, 0.38, height, 12), material, height / 2));
    const hoop = new MeshStandardMaterial({ color: 0x4a4a4a, metalness: 0.4, roughness: 0.5 });
    group.add(part(new CylinderGeometry(0.46, 0.46, 0.08, 12), hoop, height * 0.28));
    group.add(part(new CylinderGeometry(0.46, 0.46, 0.08, 12), hoop, height * 0.74));
    return group;
  },
  {
    label: 'Barrel',
    group: 'Props',
    defaults: { height: 1.1, color: 0x7d5a35 },
    fields: [
      { key: 'height', type: 'number', min: 0.4, max: 3, step: 0.1 },
      { key: 'color', type: 'color' },
    ],
  }
);

kit.define(
  'bench',
  (props) => {
    const length = num(props.length, 2);
    const group = new Group();
    const material = paint(props.color, WOOD, 0.8);
    group.add(part(new BoxGeometry(length, 0.12, 0.5), material, 0.45));
    const back = part(new BoxGeometry(length, 0.5, 0.1), material, 0.75);
    back.position.z = -0.2;
    group.add(back);
    for (const side of [-1, 1]) {
      const leg = part(new BoxGeometry(0.12, 0.45, 0.45), material, 0.22);
      leg.position.x = side * (length / 2 - 0.2);
      group.add(leg);
    }
    return group;
  },
  {
    label: 'Bench',
    group: 'Props',
    defaults: { length: 2, color: WOOD },
    fields: [
      { key: 'length', type: 'number', min: 0.8, max: 6, step: 0.2 },
      { key: 'color', type: 'color' },
    ],
  }
);

kit.define(
  'lamp',
  (props) => {
    const height = num(props.height, 2.8);
    const group = new Group();
    group.add(part(new CylinderGeometry(0.07, 0.11, height, 8), paint(props.color, 0x39404a, 0.6), height / 2));
    const glow = new MeshStandardMaterial({
      color: 0xffe6a8,
      emissive: num(props.glow, 0xffcc66),
      emissiveIntensity: 1.5,
    });
    group.add(part(new SphereGeometry(0.2, 10, 8), glow, height + 0.1));
    return group;
  },
  {
    label: 'Lamp',
    group: 'Props',
    defaults: { height: 2.8, color: 0x39404a, glow: 0xffcc66 },
    fields: [
      { key: 'height', type: 'number', min: 1, max: 8, step: 0.2 },
      { key: 'color', type: 'color', label: 'post' },
      { key: 'glow', type: 'color' },
    ],
  }
);

kit.define(
  'fence',
  (props) => {
    const length = num(props.length, 4);
    const group = new Group();
    const material = paint(props.color, 0x7a6142, 0.9);
    const posts = Math.max(2, Math.round(length / 1.2) + 1);
    for (let i = 0; i < posts; i++) {
      const post = part(new BoxGeometry(0.12, 1.1, 0.12), material, 0.55);
      post.position.x = -length / 2 + (i * length) / (posts - 1);
      group.add(post);
    }
    for (const y of [0.45, 0.85]) {
      group.add(part(new BoxGeometry(length, 0.08, 0.07), material, y));
    }
    return group;
  },
  {
    label: 'Fence',
    group: 'Props',
    defaults: { length: 4, color: 0x7a6142 },
    fields: [
      { key: 'length', type: 'number', min: 1, max: 20, step: 0.5 },
      { key: 'color', type: 'color' },
    ],
  }
);

kit.define(
  'signpost',
  (props) => {
    const group = new Group();
    const material = paint(props.color, WOOD, 0.85);
    group.add(part(new CylinderGeometry(0.08, 0.09, 2.2, 8), material, 1.1));
    const board = part(new BoxGeometry(1.4, 0.5, 0.08), paint(props.boardColor, 0xd8c9a3), 1.9);
    board.position.x = 0.5;
    group.add(board);
    return group;
  },
  {
    label: 'Signpost',
    group: 'Props',
    defaults: { color: WOOD, boardColor: 0xd8c9a3 },
    fields: [
      { key: 'color', type: 'color', label: 'post' },
      { key: 'boardColor', type: 'color', label: 'board' },
    ],
  }
);

/** A marker with no mesh: gameplay reads it by tag, an editor still shows it. */
kit.define(
  'spawn',
  () => {
    const group = new Group();
    const ring = part(
      new CylinderGeometry(0.7, 0.7, 0.06, 20),
      new MeshStandardMaterial({ color: 0x2b6cff, emissive: 0x1a3f9e, emissiveIntensity: 0.8 }),
      0.03
    );
    group.add(ring);
    group.add(
      part(
        new ConeGeometry(0.28, 0.9, 8),
        new MeshStandardMaterial({ color: 0x8fc0ff, emissive: 0x2b6cff, emissiveIntensity: 0.5 }),
        0.75
      )
    );
    return group;
  },
  { label: 'Spawn point', group: 'Markers' }
);

// ---- recipes --------------------------------------------------------------

kit.prefab(
  'lit-corner',
  { kind: 'pillar', props: { height: 2.6 }, children: [{ kind: 'lamp', at: [0, 2.6, 0], props: { height: 0.6 } }] },
  { label: 'Lit corner', group: 'Recipes' }
);

kit.prefab(
  'grove',
  {
    kind: 'tree',
    props: { height: 5 },
    children: [
      { kind: 'tree', at: [2.6, 0, 1.4], props: { height: 3.6 } },
      { kind: 'tree', at: [-1.8, 0, 2.2], props: { height: 4.2 } },
      { kind: 'bush', at: [1.2, 0, -1.6] },
    ],
  },
  { label: 'Grove', group: 'Recipes' }
);

kit.prefab(
  'cottage-lot',
  {
    kind: 'house',
    props: { width: 4.2, depth: 3.6 },
    children: [
      { kind: 'fence', at: [0, 0, 3.4], props: { length: 5 } },
      { kind: 'barrel', at: [2.6, 0, 2.2] },
      { kind: 'tree', at: [-3.4, 0, 1.6], props: { height: 4 } },
    ],
  },
  { label: 'Cottage lot', group: 'Recipes' }
);

/**
 * The level the editor opens with. Small on purpose — it should look like
 * something somebody started, not a finished demo, so the first instinct is
 * to change it.
 */
export const STARTER: LevelData = {
  format: 'gama.level',
  version: 1,
  name: 'Millbrook',
  seed: 31,
  entities: [
    { id: 'green', kind: 'platform', at: [0, 0, 0], props: { width: 14, depth: 14, height: 0.2, color: 0x6f7f52 } },
    { id: 'cottage', kind: 'cottage-lot', at: [-6, 0.2, -4], rot: 0.5 },
    { id: 'hall', kind: 'house', at: [5.5, 0.2, -5], rot: -0.35, props: { width: 6, depth: 4.4, storeys: 2, roofColor: 0x5f6b76 } },
    { id: 'watchtower', kind: 'tower', at: [11, 0, -13], props: { height: 8, radius: 1.4 } },
    { id: 'lamp-a', kind: 'lit-corner', at: [-2.5, 0.2, 2.5] },
    { id: 'lamp-b', kind: 'lit-corner', at: [3.5, 0.2, 2.5] },
    { id: 'bench-a', kind: 'bench', at: [0.5, 0.2, 3.4], rot: 3.1416 },
    { id: 'well-rocks', kind: 'rock', at: [0.5, 0.2, -1.5], props: { size: 1.2 } },
    { id: 'grove-w', kind: 'grove', at: [-11, 0, 3] },
    { id: 'crate-a', kind: 'crate', at: [-3.4, 0.2, -0.6] },
    { id: 'crate-b', kind: 'crate', at: [-2.6, 0.2, -1.2], rot: 0.6, props: { size: 0.8 } },
    { id: 'barrel-a', kind: 'barrel', at: [-3.9, 0.2, -1.6] },
    { id: 'start', kind: 'spawn', at: [0, 0.2, 5.5], tags: ['spawn'] },
  ],
};

/** Used by the viewport for its ground plane, and by "New" to start over. */
export const EMPTY: LevelData = {
  format: 'gama.level',
  version: 1,
  name: 'Untitled',
  seed: 1,
  entities: [],
};
