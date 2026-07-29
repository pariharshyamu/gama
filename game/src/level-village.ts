import { Mesh, Object3D, PlaneGeometry, Scene, Vector3 } from 'three';
import { Level, type EntitySpec, type LevelData, type Placed } from 'gama3d';
import {
  PALETTES,
  applyFog,
  createDayCycle,
  createLightBudget,
  createLightingRig,
  createSky,
  createSurface,
} from 'scena3d';
import { createCatalog } from './catalog';
import type { Quality } from './quality';
import type { Village } from './village';

/**
 * Havenbrook, authored.
 *
 * The other village is a function of a seed. This one is a file, and the
 * point of having both is that the game cannot tell them apart: they return
 * the same `Village`, and `main.ts` never learns which it got.
 *
 * Nothing here knows what a house is. It reads the level the way gameplay
 * should read a level — by TAG for the things that are gameplay, and by the
 * shape of what the factory returned for everything else:
 *
 *   - anything whose source has an `obstacleRadius` is a blocker
 *   - anything whose source has a `claim` is a light the budget can afford
 *   - anything whose source has an `update` gets ticked
 *
 * Those three lines are why `Placed.source` exists. GAMA has no idea what
 * SCENA's `Prop` is; it just hands back whatever the factory returned, and
 * the game — which imports both — knows exactly what to do with it.
 */

/** What a SCENA prop looks like from here. Structural, never imported. */
interface PropLike {
  obstacleRadius?: number;
  claim?: unknown;
  update?(dt: number): void;
  object?: Object3D;
}

const world = (object: Object3D): Vector3 => object.getWorldPosition(new Vector3());

export function villageFromLevel(scene: Scene, data: LevelData, quality: Quality): Village {
  const level = Level.parse(data);
  const meta = (level.meta ?? {}) as { bounds?: number; timeOfDay?: number; palette?: string };
  const bounds = meta.bounds ?? 62;
  const palette = PALETTES.meadow;

  const sky = createSky({ palette });
  const rig = createLightingRig('day');
  scene.add(sky.mesh, rig.group);
  applyFog(scene, 'haze', palette);

  const ground = new Mesh(
    new PlaneGeometry(bounds * 2.4, bounds * 2.4),
    createSurface('moss', { seed: level.seed })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = quality === 'high';
  scene.add(ground);

  const root = new Object3D();
  root.name = 'level';
  scene.add(root);
  const live = level.instantiate(createCatalog(), root);

  // ---- gameplay, read off the level ---------------------------------------

  // Authored children count too: a house's door marker lives inside the
  // house's placement, which is how a number stays attached to a building
  // when somebody drags the building.
  const findSpec = (id: string, list = live.specs): EntitySpec | undefined => {
    for (const entry of list) {
      if (entry.id === id) return entry;
      const nested = entry.children && findSpec(id, entry.children);
      if (nested) return nested;
    }
    return undefined;
  };
  const spec = (placed: Placed) =>
    (findSpec(placed.id)?.props ?? {}) as Record<string, unknown>;

  const addresses = live.byTag('address').map((placed, i) => {
    const door = world(placed.object);
    door.y = 0;
    // The house is whatever the door hangs off — a prefab's child knows its
    // parent, and that saves authoring a second marker for the map blip.
    const centre = placed.object.parent ? world(placed.object.parent) : door.clone();
    centre.y = 0;
    return { number: Number(spec(placed).number ?? i + 1), door, centre };
  });

  const depotMarker = live.byTag('depot')[0];
  const depot = depotMarker ? world(depotMarker.object) : new Vector3();
  depot.y = 0;

  const route = live
    .byTag('waypoint')
    .map((placed) => ({ placed, order: Number(spec(placed).order ?? 0) }))
    .sort((a, b) => a.order - b.order)
    .map(({ placed }) => {
      const p = world(placed.object);
      p.y = 0;
      return p;
    });

  // ---- everything else, read off what the factories returned --------------

  const blockers: Array<{ centre: Vector3; radius: number }> = [];
  const updaters: PropLike[] = [];
  const lamps: Array<{ object: Object3D }> = [];
  const budget = createLightBudget({ max: quality === 'low' ? 3 : quality === 'medium' ? 6 : 9 });
  scene.add(budget.group);

  for (const placed of live.objects) {
    const source = placed.source as PropLike | null;
    if (!source) continue;

    if (source.obstacleRadius) {
      const at = world(placed.object);
      at.y = 0;
      // A scaled prop blocks a scaled area.
      blockers.push({ centre: at, radius: source.obstacleRadius * placed.object.scale.x });
    }
    if (typeof source.update === 'function') updaters.push(source);
    if (source.claim) {
      budget.register(source.claim as Parameters<typeof budget.register>[0]);
      lamps.push({ object: placed.object });
    }
  }

  // Markers are gameplay, not scenery. They exist so an editor has
  // something to click; a player should never see a floating blue ring.
  for (const placed of live.objects) {
    if (placed.kind === 'address' || placed.kind === 'depot' || placed.kind === 'waypoint') {
      placed.object.visible = false;
    }
  }

  const cycle = createDayCycle({
    sky,
    rig,
    scene,
    lamps,
    dayLength: 600,
    timeOfDay: meta.timeOfDay ?? 0.42,
  });

  return {
    addresses,
    blockers,
    depot,
    // A level with no route still has to give the townsfolk somewhere to
    // walk, or they all stand on the origin looking at each other.
    route: route.length >= 3 ? route : ringRoute(24),
    bounds,
    update(dt: number, viewer: Object3D) {
      budget.update(viewer);
      for (const source of updaters) source.update?.(dt);
    },
    setTimeOfDay(t: number) {
      cycle.timeOfDay = t;
      cycle.update(0);
    },
  };
}

function ringRoute(radius: number): Vector3[] {
  return Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return new Vector3(Math.sin(a) * radius, 0, Math.cos(a) * radius);
  });
}
