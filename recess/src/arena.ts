import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  PointLight,
  Scene,
  Vector3,
} from 'three';
import { createEffects, type Effects } from 'scena3d';

/**
 * The hall the three rounds are played in.
 *
 * One palette, one lighting rig, one set of walls — because the horror of the
 * genre is that it all looks like a nursery. The rounds change; the room does
 * not, and the sameness is doing the work.
 */

export const PALETTE = {
  floor: 0xd9c9a8,
  wall: 0x3f6f74,
  trim: 0xe8834f,
  sky: 0x101820,
  safe: 0x6fc48a,
  danger: 0xd8543f,
};

export interface Arena {
  readonly group: Group;
  readonly fx: Effects;
  /** The key light, so a round can dim or steady it. */
  readonly key: DirectionalLight;
  readonly lamp: PointLight;
  /**
   * Drop the floor away and black it out, for the round played above a drop.
   *
   * Elevating the bridge alone did nothing: at a shallow camera angle six
   * metres of air between the panes and a lit beige floor reads as no gap at
   * all, and the glass reads as grey tile because there is nothing dark behind
   * it to be transparent against. Both problems are the same problem.
   */
  setPit(on: boolean): void;
  dispose(): void;
}

/**
 * The floor is a plane and the walls are boxes.
 *
 * Deliberately not a `createRoom` from SCENA: this hall is 90 metres long and
 * a room kit is built for interiors you walk around in, so it would spend its
 * geometry budget on detail nobody gets within twenty metres of.
 */
export function buildArena(scene: Scene, length = 90, width = 34): Arena {
  const group = new Group();
  scene.background = new Color(PALETTE.sky);

  const floor = new Mesh(
    new PlaneGeometry(width, length),
    new MeshStandardMaterial({ color: PALETTE.floor, roughness: 0.95 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = length / 2;
  floor.receiveShadow = true;
  group.add(floor);

  const wallMat = new MeshStandardMaterial({ color: PALETTE.wall, roughness: 0.9 });
  const trimMat = new MeshStandardMaterial({ color: PALETTE.trim, roughness: 0.8 });
  const wallH = 9;
  for (const side of [-1, 1]) {
    const wall = new Mesh(new BoxGeometry(0.6, wallH, length), wallMat);
    wall.position.set((side * width) / 2, wallH / 2, length / 2);
    group.add(wall);
    // A band at eye height, so the walls have a horizon and the eye can read
    // depth down a corridor this long. Without it the far end is a flat wash.
    const band = new Mesh(new BoxGeometry(0.7, 0.5, length), trimMat);
    band.position.set((side * width) / 2, 2.6, length / 2);
    group.add(band);
  }
  const endWall = new Mesh(new BoxGeometry(width, wallH, 0.6), wallMat);
  endWall.position.set(0, wallH / 2, length);
  group.add(endWall);

  const key = new DirectionalLight(0xfff0d8, 1.5);
  key.position.set(8, 24, 12);
  const fill = new DirectionalLight(0x9fd4ff, 0.45);
  fill.position.set(-10, 12, -8);
  const lamp = new PointLight(0xffe9c0, 0, 40, 2);
  lamp.position.set(0, 6, 6);
  group.add(key, fill, lamp, new AmbientLight(0xffffff, 0.5));

  const fx = createEffects({ capacity: 260, seed: 9 });
  group.add(fx.group);

  scene.add(group);
  const floorMat = floor.material as MeshStandardMaterial;
  return {
    group,
    fx,
    key,
    lamp,
    setPit(on: boolean) {
      floor.position.y = on ? -16 : 0;
      floorMat.color.set(on ? 0x05080b : PALETTE.floor);
      floorMat.needsUpdate = true;
    },
    dispose() {
      group.removeFromParent();
    },
  };
}

/** A painted line across the floor — start lines, finish lines, thresholds. */
export function stripe(z: number, width: number, color: number): Mesh {
  const m = new Mesh(
    new PlaneGeometry(width, 0.5),
    new MeshStandardMaterial({ color, roughness: 0.7 }),
  );
  m.rotation.x = -Math.PI / 2;
  m.position.set(0, 0.02, z);
  return m;
}

export const UP = new Vector3(0, 1, 0);
