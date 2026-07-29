import { Mesh, PlaneGeometry, Scene, Vector3 } from 'three';
import {
  PALETTES,
  applyFog,
  createLightingRig,
  createPickup,
  createRock,
  createSky,
  createSurface,
  createTree,
  type Pickup,
} from 'scena3d';

/**
 * The world, generated from a seed.
 *
 * The whole point of building on SCENA is that this file replaces an art
 * pipeline: no models to author, no textures to load, no level file to keep
 * in sync. Change the seed and you get a different place; change the numbers
 * and you get a different KIND of place.
 */

export type Quality = 'low' | 'medium' | 'high';

export interface World {
  /** What the player is here to collect. */
  pickups: Pickup[];
  /** Things to walk around: `{ centre, radius }`, in world space. */
  blockers: Array<{ centre: Vector3; radius: number }>;
  /** Half-extent of the playable area. */
  bounds: number;
  update(dt: number): void;
}

/** Small, fast, deterministic. Same seed, same world, on every machine. */
function rng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildWorld(scene: Scene, seed: number, quality: Quality): World {
  const rand = rng(seed);
  const palette = PALETTES.meadow;
  // Small enough that a player can sweep it in a minute — a starter should
  // be findable, not a search across a field.
  const bounds = 26;

  // The sky is a DOME, not an infinite backdrop: its radius has to sit
  // comfortably inside the camera's far plane (300 here) or the view runs
  // off the edge of it and you get a black band above the horizon.
  scene.add(createSky({ palette, radius: 270 }).mesh, createLightingRig('day').group);
  applyFog(scene, 'haze', palette);

  const ground = new Mesh(new PlaneGeometry(bounds * 3, bounds * 3), createSurface('moss', { seed }));
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const blockers: World['blockers'] = [];

  // Scenery. The count scales with the detail setting — the cheapest and
  // most effective quality dial there is.
  const trees = quality === 'low' ? 14 : quality === 'medium' ? 26 : 40;
  for (let i = 0; i < trees; i++) {
    const a = rand() * Math.PI * 2;
    const d = 8 + rand() * (bounds - 10);
    const prop = i % 4 === 0 ? createRock({ seed: seed + i }) : createTree({ seed: seed + i, palette });
    prop.object.position.set(Math.sin(a) * d, 0, Math.cos(a) * d);
    scene.add(prop.object);
    blockers.push({ centre: prop.object.position.clone(), radius: prop.obstacleRadius || 0.9 });
  }

  // Five things to find, spread around the ring so no two are a short hop
  // apart. This is the entire "level design" — replace it with yours.
  const pickups: Pickup[] = [];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + rand() * 0.5;
    const d = 8 + rand() * 11;
    const pickup = createPickup('gem', { seed: seed + i, scale: 1.9 });
    pickup.group.position.set(Math.sin(a) * d, 1, Math.cos(a) * d);
    scene.add(pickup.group);
    pickups.push(pickup);
  }

  return {
    pickups,
    blockers,
    bounds,
    update(dt: number) {
      for (const pickup of pickups) pickup.update(dt);
    },
  };
}
