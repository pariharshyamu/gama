import { Mesh, Object3D, PlaneGeometry, Scene, Vector3 } from 'three';
import {
  PALETTES,
  applyFog,
  createBarrel,
  createBunting,
  createCrate,
  createCart,
  createDayCycle,
  createFence,
  createFountain,
  createHouse,
  createLightBudget,
  createLightingRig,
  createPath,
  createSign,
  createSky,
  createStall,
  createStreetLight,
  createSurface,
  createTree,
  createWell,
} from 'scena3d';
import type { Quality } from './quality';

/**
 * Havenbrook, generated.
 *
 * The whole map is a function of one integer. That is the bet this game
 * makes: no level files, no editor, no art pipeline — the seed in the box
 * on the title screen IS the level, and two players typing the same number
 * get the same village down to which cottage has a thatched roof.
 *
 * The layout is deliberately readable rather than realistic: a ring road
 * around a square, houses facing inward off it, everything else outside.
 * A courier has to be able to *learn* a town in ninety seconds, and a
 * plausible medieval tangle is not learnable in ninety seconds.
 */

/** A house that can receive a parcel. */
export interface Address {
  /** House number, as painted on the sign — what the HUD names. */
  number: number;
  /** The door: where a delivery counts. */
  door: Vector3;
  /** Centre of the building, for the map blip. */
  centre: Vector3;
}

/** A circular thing the courier cannot walk through. */
export interface Blocker {
  centre: Vector3;
  radius: number;
}

export interface Village {
  addresses: Address[];
  blockers: Blocker[];
  /** Where parcels are collected — the cart in the square. */
  depot: Vector3;
  /** Ring-road waypoints, handed to the townsfolk to walk. */
  route: Vector3[];
  /** Half-extent of the playable area. */
  bounds: number;
  /** `viewer` is whoever the light budget should follow. */
  update(dt: number, viewer: Object3D): void;
  /** Push the clock and the lamps along; 0..1 through the day. */
  setTimeOfDay(t: number): void;
}

/** Deterministic, tiny, and identical to the one every SCENA prop uses. */
function rng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildVillage(scene: Scene, seed: number, quality: Quality): Village {
  const rand = rng(seed);
  const palette = PALETTES.meadow;
  const RING = 26; // radius of the ring road
  const bounds = 62;

  const sky = createSky({ palette });
  const rig = createLightingRig('day');
  scene.add(sky.mesh, rig.group);
  applyFog(scene, 'haze', palette);

  // Flat ground. A courier game wants a floor you can read distances on,
  // not a landscape that hides the next house behind a hill.
  const ground = new Mesh(
    new PlaneGeometry(bounds * 2.4, bounds * 2.4),
    createSurface('moss', { seed })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = quality === 'high';
  scene.add(ground);

  const blockers: Blocker[] = [];
  // Typed as the day cycle wants them: it ignites anything with an
  // `object`, which is every luminous prop SCENA makes.
  const lamps: Array<{ object: Object3D }> = [];
  const budget = createLightBudget({ max: quality === 'low' ? 3 : quality === 'medium' ? 6 : 9 });
  scene.add(budget.group);

  // ---- The ring road, and the route the townsfolk walk.
  const ringPoints: Vector3[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const wobble = 1 + (rand() - 0.5) * 0.08;
    ringPoints.push(new Vector3(Math.sin(a) * RING * wobble, 0, Math.cos(a) * RING * wobble));
  }
  const road = createPath(ringPoints, { loop: true, width: 4.2, palette });
  scene.add(road.mesh);

  // Four spokes from the square out to the ring. A village with a plan is
  // navigable; a village of objects scattered on grass is a search puzzle,
  // and this game already has a search puzzle in it.
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const spoke = createPath(
      [
        new Vector3(Math.sin(a) * 3, 0, Math.cos(a) * 3),
        new Vector3(Math.sin(a) * (RING - 1), 0, Math.cos(a) * (RING - 1)),
      ],
      { width: 2.6, palette }
    );
    scene.add(spoke.mesh);
  }

  // ---- The square: fountain, well, stalls, bunting, and the depot cart.
  const fountain = createFountain({ seed });
  scene.add(fountain.object);
  blockers.push({ centre: new Vector3(0, 0, 0), radius: fountain.obstacleRadius || 2.4 });

  const well = createWell({ seed: seed + 3 });
  well.object.position.set(-7.5, 0, 5.5);
  scene.add(well.object);
  blockers.push({ centre: well.object.position.clone(), radius: 1.5 });

  for (let i = 0; i < 3; i++) {
    const stall = createStall({ seed: seed + 20 + i });
    const a = 1.1 + i * 1.5;
    stall.object.position.set(Math.sin(a) * 9.5, 0, Math.cos(a) * 9.5);
    stall.object.rotation.y = -a + Math.PI;
    scene.add(stall.object);
    blockers.push({ centre: stall.object.position.clone(), radius: 1.9 });
  }

  // Dressing: the square should look used. Barrels and crates are also
  // blockers, so the clutter is level design rather than set decoration.
  for (let i = 0; i < 7; i++) {
    const a = rand() * Math.PI * 2;
    const d = 5 + rand() * 7;
    const prop = i % 2 === 0 ? createBarrel({ seed: seed + i }) : createCrate({ seed: seed + i });
    prop.object.position.set(Math.sin(a) * d, 0, Math.cos(a) * d);
    prop.object.rotation.y = rand() * Math.PI;
    scene.add(prop.object);
    blockers.push({ centre: prop.object.position.clone(), radius: 0.6 });
  }

  const bunting = createBunting({ seed, span: 11, poleHeight: 3.2 });
  bunting.object.position.set(0, 3.4, -9);
  scene.add(bunting.object);

  // The depot: a handcart in the square. Standing here loads a parcel.
  const depotAt = new Vector3(6.5, 0, 7);
  const cart = createCart({ seed: seed + 5 });
  cart.object.position.copy(depotAt);
  cart.object.rotation.y = -0.7;
  scene.add(cart.object);

  const depotSign = createSign({ kind: 'post', text: 'DEPOT', seed });
  depotSign.object.position.set(depotAt.x + 2.2, 0, depotAt.z + 1.4);
  // Face the sign back at the square, where the courier reads it from.
  depotSign.object.rotation.y = Math.atan2(-depotAt.x, -depotAt.z);
  scene.add(depotSign.object);

  // ---- The houses. Ranged around the ring, facing the square, numbered
  // the way a street is numbered so the HUD can say "No. 7" and mean it.
  const addresses: Address[] = [];
  const COUNT = 12;
  for (let i = 0; i < COUNT; i++) {
    const a = (i / COUNT) * Math.PI * 2 + 0.26;
    const dist = RING + 7.5 + rand() * 3.5;
    const x = Math.sin(a) * dist;
    const z = Math.cos(a) * dist;
    const house = createHouse({ seed: seed * 31 + i, palette });
    house.object.position.set(x, 0, z);
    // Face the square. The door is on the front (+z) face of the model, so
    // the door's world position falls out of the same rotation.
    house.object.rotation.y = Math.atan2(-x, -z);
    house.object.castShadow = quality === 'high';
    scene.add(house.object);

    const inward = new Vector3(-x, 0, -z).normalize();
    const door = new Vector3(x, 0, z).addScaledVector(inward, 2.9);
    addresses.push({ number: i + 1, door, centre: new Vector3(x, 0, z) });
    blockers.push({ centre: new Vector3(x, 0, z), radius: 2.6 });

    // A lamp by every second gate — the light the dusk half of a round runs on.
    if (i % 2 === 0) {
      const lamp = createStreetLight({ style: 'village', seed: seed + 60 + i });
      lamp.object.position.copy(door).addScaledVector(inward, 1.9);
      scene.add(lamp.object);
      budget.register(lamp.claim);
      lamps.push(lamp);
      blockers.push({ centre: lamp.object.position.clone(), radius: 0.45 });
    }
  }

  // ---- Outside the ring: trees, fences, the edge of the world.
  const treeCount = quality === 'low' ? 26 : quality === 'medium' ? 44 : 70;
  for (let i = 0; i < treeCount; i++) {
    const a = rand() * Math.PI * 2;
    const d = RING + 16 + rand() * (bounds - RING - 20);
    const tree = createTree({ seed: (seed + i * 7) | 0, palette });
    tree.object.position.set(Math.sin(a) * d, 0, Math.cos(a) * d);
    scene.add(tree.object);
    if (d < bounds - 6) blockers.push({ centre: tree.object.position.clone(), radius: 0.9 });
  }
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + 0.3;
    const fence = createFence({ seed: seed + i, length: 6 });
    const d = RING + 15;
    fence.object.position.set(Math.sin(a) * d, 0, Math.cos(a) * d);
    fence.object.rotation.y = -a;
    scene.add(fence.object);
  }

  // ---- The day. A round starts in the afternoon and ends after dark: the
  // lamps coming on IS the difficulty curve, not a decoration.
  const cycle = createDayCycle({
    sky,
    rig,
    scene,
    lamps,
    dayLength: 600, // long; the round drives it directly instead
    timeOfDay: 0.42,
  });

  return {
    addresses,
    blockers,
    depot: depotAt,
    route: road.route.map((p) => new Vector3(p.x, 0, p.z)),
    bounds,
    update(_dt: number, viewer: Object3D) {
      // The budget follows the player, not the origin: six real lights
      // chase whoever is looking, and the other lamps stay as glows.
      budget.update(viewer);
    },
    setTimeOfDay(t: number) {
      cycle.timeOfDay = t;
      cycle.update(0);
    },
  };
}
