/**
 * The first draft of a level, from the generator that used to BE the level.
 *
 * This ran once. Havenbrook was procedural, and going from "a function of a
 * seed" to "a file somebody edits" does not mean hand-typing eighty
 * placements — it means running the generator one more time and writing
 * down what it decided. After that the file is the source of truth and this
 * script is history: it is committed because deleting it would hide where
 * the level came from, not because anyone should run it again.
 *
 *   node tools/seed-level.mjs > src/levels/havenbrook.json
 */

const SEED = 7;
const RING = 26; // the ring road, and the townsfolk's route
const HOUSES = 10;

let s = SEED >>> 0;
const rand = () => {
  s = (s + 0x6d2b79f5) >>> 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const r = (n, places = 2) => Number(n.toFixed(places));
const entities = [];
const add = (spec) => entities.push(spec);

// ---- the square ------------------------------------------------------------
add({ id: 'fountain', kind: 'fountain', props: { size: 2.6, figure: 'figure' } });
add({ id: 'well', kind: 'well', at: [-7.5, 0, 5.5] });
// Clear of the courier's spawn, which is depot + (-3, +3). The first draft
// put it exactly there and the player stood inside a signpost.
add({ id: 'signpost', kind: 'sign', at: [-2.6, 0, 11.4], rot: 0.35, props: { text: 'HAVENBROOK' } });
add({ id: 'bunting', kind: 'bunting', at: [0, 3.4, -9], props: { span: 11, poleHeight: 3.2 } });

const GOODS = ['produce', 'pottery', 'bakery'];
for (let i = 0; i < 3; i++) {
  const a = 1.1 + i * 1.5;
  add({
    id: `stall-${i + 1}`,
    kind: 'stall',
    at: [r(Math.sin(a) * 9.5), 0, r(Math.cos(a) * 9.5)],
    rot: r(-a + Math.PI, 3),
    props: { goods: GOODS[i] },
  });
}

// ---- the depot: a cart you can see, and a marker gameplay reads -------------
add({
  id: 'depot-cart',
  kind: 'cart',
  at: [6.5, 0, 7],
  rot: -0.7,
  props: { style: 'cart', cargo: 'crates' },
  children: [{ id: 'depot', kind: 'depot', at: [-1.6, 0, 0.6], tags: ['depot'] }],
});
add({
  id: 'depot-sign',
  kind: 'sign',
  at: [8.7, 0, 8.4],
  rot: r(Math.atan2(-6.5, -7), 3),
  props: { text: 'DEPOT', kind: 'post' },
});

// ---- clutter, which is level design rather than decoration ------------------
for (let i = 0; i < 7; i++) {
  const a = rand() * Math.PI * 2;
  const d = 5 + rand() * 7;
  add({
    id: `clutter-${i + 1}`,
    kind: i % 2 === 0 ? 'barrel' : 'crate',
    at: [r(Math.sin(a) * d), 0, r(Math.cos(a) * d)],
    rot: r(rand() * Math.PI, 3),
  });
}

// ---- the houses, each carrying its own front door ---------------------------
const ROOFS = ['thatch', 'tile', 'shingle'];
const WALLS = ['plaster', 'brick', 'ashlar'];
for (let i = 0; i < HOUSES; i++) {
  const a = (i / HOUSES) * Math.PI * 2 + 0.26;
  const dist = RING + 7.5 + rand() * 3.5;
  const x = Math.sin(a) * dist;
  const z = Math.cos(a) * dist;
  // Face the square. The door is on the model's +z face, so a child at
  // local (0, 0, 3.2) is the doorstep no matter how the house is turned —
  // which is the whole reason the marker is a CHILD and not a sibling.
  add({
    id: `house-${i + 1}`,
    kind: 'house',
    at: [r(x), 0, r(z)],
    rot: r(Math.atan2(-x, -z), 3),
    props: {
      width: r(4.6 + rand() * 1.6, 1),
      depth: r(3.8 + rand() * 1.2, 1),
      roof: ROOFS[Math.floor(rand() * 3)],
      wall: WALLS[Math.floor(rand() * 3)],
    },
    children: [
      { id: `door-${i + 1}`, kind: 'address', at: [0, 0, 3.2], props: { number: i + 1 }, tags: ['address'] },
    ],
  });

  if (i % 2 === 0) {
    const inward = 1 / Math.hypot(x, z);
    add({
      id: `lamp-${i + 1}`,
      kind: 'lamp',
      at: [r(x - x * inward * 5.4), 0, r(z - z * inward * 5.4)],
    });
  }
}

// ---- the roads: straight segments around the ring, and four spokes ---------
const SEGMENTS = 14;
for (let i = 0; i < SEGMENTS; i++) {
  const a = ((i + 0.5) / SEGMENTS) * Math.PI * 2;
  // Each segment is a chord of the ring, so it is placed at the midpoint
  // and turned to face along the circle.
  const step = (Math.PI * 2) / SEGMENTS;
  add({
    id: `road-${i + 1}`,
    kind: 'road',
    at: [r(Math.sin(a) * RING), 0, r(Math.cos(a) * RING)],
    rot: r(a + Math.PI / 2, 3),
    props: { length: r(2 * RING * Math.sin(step / 2) + 0.6, 1), width: 4.2 },
  });
}
for (let i = 0; i < 4; i++) {
  const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
  const mid = (3 + (RING - 1)) / 2;
  add({
    id: `spoke-${i + 1}`,
    kind: 'road',
    at: [r(Math.sin(a) * mid), 0, r(Math.cos(a) * mid)],
    rot: r(a, 3),
    props: { length: r(RING - 4, 1), width: 2.8 },
  });
}

// ---- the route the townsfolk walk ------------------------------------------
for (let i = 0; i < 12; i++) {
  const a = (i / 12) * Math.PI * 2;
  const wobble = 1 + (rand() - 0.5) * 0.08;
  add({
    id: `way-${i}`,
    kind: 'waypoint',
    at: [r(Math.sin(a) * RING * wobble), 0, r(Math.cos(a) * RING * wobble)],
    props: { order: i },
    tags: ['waypoint'],
  });
}

// ---- outside the ring -------------------------------------------------------
const SPECIES = ['oak', 'pine', 'birch', 'cedar', 'maple'];
for (let i = 0; i < 34; i++) {
  const a = rand() * Math.PI * 2;
  const d = RING + 16 + rand() * 22;
  add({
    id: `tree-${i + 1}`,
    kind: 'tree',
    at: [r(Math.sin(a) * d), 0, r(Math.cos(a) * d)],
    rot: r(rand() * Math.PI * 2, 3),
    props: { species: SPECIES[Math.floor(rand() * SPECIES.length)], height: r(5 + rand() * 5, 1) },
  });
}
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * Math.PI * 2 + 0.3;
  const d = RING + 15;
  add({
    id: `fence-${i + 1}`,
    kind: 'fence',
    at: [r(Math.sin(a) * d), 0, r(Math.cos(a) * d)],
    rot: r(-a, 3),
    props: { length: 6 },
  });
}

process.stdout.write(
  `${JSON.stringify(
    {
      format: 'gama.level',
      version: 1,
      name: 'Havenbrook',
      seed: SEED,
      meta: { bounds: 62, timeOfDay: 0.42 },
      entities,
    },
    null,
    2
  )}\n`
);
