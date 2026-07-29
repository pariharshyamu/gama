import { Group, Mesh, MeshStandardMaterial, RingGeometry, SphereGeometry } from 'three';
import { Catalog } from 'gama3d';
import {
  PALETTES,
  createBanner,
  createBarrel,
  createBrazier,
  createBunting,
  createCart,
  createCrate,
  createFence,
  createFountain,
  createHouse,
  createPath,
  createRock,
  createSign,
  createStall,
  createStatue,
  createStreetLight,
  createTree,
  createWell,
} from 'scena3d';
import { OUTFITS, createHumanoid } from 'anima3d';

/**
 * The catalog: the one file in this game where all three libraries meet.
 *
 * GAMA cannot import SCENA or ANIMA — that is the trilogy's single rule —
 * so it has no idea what a "house" is until this file says so. Everything
 * downstream imports the catalog, not the libraries: the editor builds a
 * palette and an inspector from it, the game builds a village from it, and
 * neither of them needs to know which library made what.
 *
 * The `fields` on each kind are what an editor draws. They are the price of
 * this arrangement — hand-written, and they drift if SCENA grows an option
 * nobody adds here — but they are also the reason the editor is generic.
 */

/** SCENA props all return `{ object, obstacleRadius, … }`. That is the handshake. */
const prop =
  <T extends { object: Group }>(make: (options: Record<string, unknown>) => T) =>
  (props: Record<string, unknown>, ctx: { seed: number }) =>
    make({ seed: ctx.seed, palette: PALETTES.meadow, ...props });

export interface CatalogOptions {
  /**
   * In the editor a villager is a cheap standing figure; in the game the
   * same placement becomes a walking agent with a brain. One flag, two
   * builds, one file — the level says WHERE and WHAT KIND, and never has
   * to carry a rig.
   */
  preview?: boolean;
}

export function createCatalog(options: CatalogOptions = {}): Catalog {
  const catalog = new Catalog();

  // ---- buildings ---------------------------------------------------------

  catalog.define('house', prop(createHouse), {
    label: 'House',
    group: 'Buildings',
    defaults: { width: 5, depth: 4 },
    fields: [
      { key: 'width', type: 'number', min: 3, max: 12, step: 0.25 },
      { key: 'depth', type: 'number', min: 3, max: 12, step: 0.25 },
      { key: 'wallHeight', type: 'number', min: 2, max: 8, step: 0.25 },
      { key: 'wall', type: 'select', options: ['plaster', 'brick', 'ashlar'] },
      { key: 'roof', type: 'select', options: ['tile', 'shingle', 'thatch'] },
    ],
  });

  catalog.define('well', prop(createWell), { label: 'Well', group: 'Buildings' });

  catalog.define('fountain', prop(createFountain), {
    label: 'Fountain',
    group: 'Buildings',
    fields: [
      { key: 'size', type: 'number', min: 1, max: 6, step: 0.25 },
      { key: 'figure', type: 'select', options: ['obelisk', 'figure', 'orb', 'bust', 'beast'] },
      { key: 'centrepiece', type: 'select', options: ['stone', 'bronze'] },
    ],
  });

  catalog.define('stall', prop(createStall), {
    label: 'Market stall',
    group: 'Buildings',
    fields: [
      { key: 'goods', type: 'select', options: ['produce', 'pottery', 'bakery', 'textiles'] },
      { key: 'clothColor', type: 'color', label: 'cloth' },
    ],
  });

  catalog.define('statue', prop(createStatue), {
    label: 'Statue',
    group: 'Buildings',
    fields: [
      { key: 'figure', type: 'select', options: ['obelisk', 'figure', 'orb', 'bust', 'beast'] },
      { key: 'material', type: 'select', options: ['stone', 'bronze'] },
      { key: 'height', type: 'number', min: 1, max: 8, step: 0.25 },
    ],
  });

  // ---- nature ------------------------------------------------------------

  catalog.define('tree', prop(createTree), {
    label: 'Tree',
    group: 'Nature',
    fields: [
      { key: 'height', type: 'number', min: 2, max: 18, step: 0.5 },
      {
        key: 'species',
        type: 'select',
        options: ['oak', 'pine', 'birch', 'cypress', 'cedar', 'maple', 'willow', 'sakura'],
      },
      { key: 'season', type: 'select', options: ['spring', 'summer', 'autumn', 'winter'] },
    ],
  });

  catalog.define('rock', prop(createRock), {
    label: 'Rock',
    group: 'Nature',
    fields: [{ key: 'size', type: 'number', min: 0.3, max: 5, step: 0.1 }],
  });

  catalog.define('fence', prop(createFence), {
    label: 'Fence',
    group: 'Nature',
    defaults: { length: 6 },
    fields: [
      { key: 'length', type: 'number', min: 2, max: 24, step: 0.5 },
      { key: 'height', type: 'number', min: 0.5, max: 3, step: 0.1 },
    ],
  });

  // ---- dressing ----------------------------------------------------------

  catalog.define('crate', prop(createCrate), {
    label: 'Crate',
    group: 'Dressing',
    fields: [
      { key: 'size', type: 'number', min: 0.4, max: 2.5, step: 0.1 },
      { key: 'weathering', type: 'number', min: 0, max: 1, step: 0.05 },
    ],
  });
  catalog.define('barrel', prop(createBarrel), { label: 'Barrel', group: 'Dressing' });
  catalog.define('cart', prop(createCart), {
    label: 'Cart',
    group: 'Dressing',
    fields: [
      { key: 'style', type: 'select', options: ['cart', 'wagon'] },
      { key: 'cargo', type: 'select', options: ['empty', 'crates', 'barrels', 'sacks', 'hay'] },
    ],
  });
  catalog.define('banner', prop(createBanner), {
    label: 'Banner',
    group: 'Dressing',
    fields: [
      { key: 'style', type: 'select', options: ['flag', 'banner', 'pennant'] },
      { key: 'poleHeight', type: 'number', min: 1.5, max: 8, step: 0.25 },
    ],
  });
  catalog.define('bunting', prop(createBunting), {
    label: 'Bunting',
    group: 'Dressing',
    defaults: { span: 9, poleHeight: 3.2 },
    fields: [
      { key: 'span', type: 'number', min: 3, max: 20, step: 0.5 },
      { key: 'poleHeight', type: 'number', min: 2, max: 6, step: 0.2 },
    ],
  });
  catalog.define('sign', prop(createSign), {
    label: 'Sign',
    group: 'Dressing',
    defaults: { kind: 'post', text: 'HAVENBROOK' },
    fields: [
      { key: 'text', type: 'text' },
      { key: 'kind', type: 'select', options: ['post', 'hanging', 'fingerpost', 'milestone'] },
    ],
  });

  // A road is a POLYLINE, and a level file stores transforms. So it is
  // authored as straight segments you place and turn, which is the honest
  // adaptation: the format bends for nobody, and a kind that does not fit
  // it should say so in its shape rather than smuggle a point list into a
  // prop. Ten of these make a ring road and they are trivial to drag.
  catalog.define(
    'road',
    (props) => {
      const length = Number(props.length ?? 8);
      const path = createPath(
        [
          { x: 0, z: -length / 2 },
          { x: 0, z: length / 2 },
        ],
        { width: Number(props.width ?? 3.6), palette: PALETTES.meadow }
      );
      path.mesh.position.y = 0.01; // above the grass, below everything else
      return { object: path.mesh, obstacleRadius: 0 };
    },
    {
      label: 'Road',
      group: 'Nature',
      defaults: { length: 8, width: 3.6 },
      fields: [
        { key: 'length', type: 'number', min: 2, max: 40, step: 0.5 },
        { key: 'width', type: 'number', min: 1, max: 8, step: 0.2 },
      ],
    }
  );

  // ---- light -------------------------------------------------------------
  // These come back as SCENA `Luminous`, which carries a `claim` the light
  // budget registers. The village reads that off `Placed.source` — which is
  // the entire reason `source` exists.

  catalog.define('lamp', prop(createStreetLight), {
    label: 'Street lamp',
    group: 'Light',
    defaults: { style: 'village' },
    fields: [
      { key: 'style', type: 'select', options: ['village', 'modern'] },
      { key: 'height', type: 'number', min: 1.5, max: 8, step: 0.25 },
    ],
  });
  catalog.define('brazier', prop(createBrazier), { label: 'Brazier', group: 'Light' });

  // ---- markers -----------------------------------------------------------
  // No geometry a player will ever see: these are gameplay, and the level
  // file is where gameplay gets placed. `byTag` is how the game finds them.

  catalog.define('address', () => marker(0x4d8dff, 1.1), {
    label: 'Delivery door',
    group: 'Markers',
    fields: [{ key: 'number', type: 'number', min: 1, max: 99, step: 1 }],
  });
  catalog.define('depot', () => marker(0xffc14d, 1.5), { label: 'Depot', group: 'Markers' });
  catalog.define('waypoint', () => marker(0x8fe38f, 0.8), {
    label: 'Route point',
    group: 'Markers',
    fields: [{ key: 'order', type: 'number', min: 0, max: 99, step: 1 }],
  });

  // ---- people ------------------------------------------------------------

  catalog.define(
    'villager',
    (props, ctx) => {
      const rig = createHumanoid({
        seed: ctx.seed,
        palette: props.role === 'guard' ? OUTFITS.guard : OUTFITS.villager,
      });
      // In the game the townsfolk walk the route as GAMA agents; a
      // placement here is a person who STAYS somewhere — a stallholder, a
      // guard on a gate. Either way the file stores a role and a seed.
      return rig;
    },
    {
      label: 'Villager',
      group: 'People',
      defaults: { role: 'villager' },
      fields: [{ key: 'role', type: 'select', options: ['villager', 'guard'] }],
    }
  );

  // ---- recipes -----------------------------------------------------------
  // A recipe is a spec, not a blob: placing one expands it and keeps the
  // children, so "a house with its lamp and its gate" is one click.

  catalog.prefab(
    'cottage-lot',
    {
      kind: 'house',
      props: { width: 5, depth: 4, roof: 'thatch' },
      children: [
        { kind: 'address', at: [0, 0, 2.9], props: { number: 1 }, tags: ['address'] },
        { kind: 'lamp', at: [2.8, 0, 3.4] },
        { kind: 'fence', at: [0, 0, 4.6], props: { length: 6 } },
      ],
    },
    { label: 'Cottage + door', group: 'Recipes' }
  );

  catalog.prefab(
    'market-corner',
    {
      kind: 'stall',
      props: { goods: 'produce' },
      children: [
        { kind: 'crate', at: [1.9, 0, 0.7] },
        { kind: 'barrel', at: [-1.7, 0, 0.5] },
        { kind: 'villager', at: [0, 0, -1.2], props: { role: 'villager' } },
      ],
    },
    { label: 'Stall + keeper', group: 'Recipes' }
  );

  void options.preview; // both builds are the same today; see the note above
  return catalog;
}

/**
 * A marker: a flat ring and a bead, bright and unmistakably not scenery.
 *
 * It has geometry only so an editor has something to click. The game
 * hides these — a delivery door is a position, not a prop.
 */
function marker(color: number, radius: number): Group {
  const group = new Group();
  group.name = 'marker';
  const ring = new Mesh(
    new RingGeometry(radius * 0.72, radius, 24),
    new MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.7 })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.03;
  const bead = new Mesh(
    new SphereGeometry(radius * 0.22, 10, 8),
    new MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9 })
  );
  bead.position.y = radius * 0.9;
  group.add(ring, bead);
  return group;
}
