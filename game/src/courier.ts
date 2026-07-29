import { Object3D, Scene, Vector2, Vector3 } from 'three';
import { type Input } from 'gama3d';
import { FootIK, Locomotion, OUTFITS, Reactions, attach, createHumanoid } from 'anima3d';
import { createCrate } from 'scena3d';
import type { Blocker } from './village';

/**
 * The courier: one body, assembled from all three libraries.
 *
 * ANIMA builds and animates it, GAMA moves it, SCENA gives it something to
 * carry. None of those three know about each other — the only thing passed
 * between them is a velocity vector and an `Object3D`.
 */

const WALK = 4.4;
const SPRINT = 7.6;

export interface Courier {
  object: Object3D;
  readonly position: Vector3;
  readonly speed: number;
  /** True while a stumble is playing out — controls are soft, not dead. */
  readonly stumbling: boolean;
  carrying: boolean;
  setCarrying(on: boolean): void;
  /** Knock the courier about; costs the round time. */
  bump(from: Vector3): void;
  cheer(): void;
  update(dt: number, sprinting: boolean, blockers: readonly Blocker[], bounds: number): void;
  reset(at: Vector3): void;
}

export function createCourier(scene: Scene, input: Input, seed: number): Courier {
  const rig = createHumanoid({
    seed,
    height: 1.8,
    palette: OUTFITS.villager,
    accessories: ['cap', 'pouch'],
  });
  scene.add(rig.object);

  const loco = new Locomotion(rig);
  const react = new Reactions(rig);
  // Feet land on the ground rather than skating above it. Flat world, so
  // the height function is a constant — the same call a terrain would take.
  const ik = new FootIK(rig, { ground: () => 0 });
  // Movement is driven straight off `input.moveAxis()` — which already
  // folds keyboard, gamepad and TouchControls' on-screen stick into one
  // vector, so the phone build needs no branch anywhere in this file.
  //
  // GAMA ships a `CharacterController` that does this, and it is NOT used
  // here for a specific reason: it is a `Component`, so it moves the
  // `GameObject` it is attached to, and GameObjects are stepped by the
  // World on the real clock. A game with a pause screen needs movement on
  // the GATED clock, and there is no way to hold the World still. Twenty
  // lines is the cheaper answer than fighting that.

  // The parcel, carried in the right hand. It is a SCENA crate scaled down:
  // a real prop, not a placeholder box, so it lights like everything else.
  const parcel = createCrate({ seed: seed + 4 });
  parcel.object.scale.setScalar(0.34);
  attach(rig, 'handRight', parcel.object);
  parcel.object.visible = false;

  const velocity = new Vector3();
  const desired = new Vector3();
  const axis = new Vector2();
  const push = new Vector3();
  let stumble = 0;
  let carrying = false;

  const api: Courier = {
    object: rig.object,
    position: rig.object.position,
    get speed() {
      return velocity.length();
    },
    get stumbling() {
      return stumble > 0;
    },
    get carrying() {
      return carrying;
    },
    set carrying(on: boolean) {
      api.setCarrying(on);
    },

    setCarrying(on: boolean) {
      carrying = on;
      parcel.object.visible = on;
    },

    bump(from: Vector3) {
      if (stumble > 0) return; // already reeling; one stumble per collision
      stumble = 0.75;
      react.flinch({ x: from.x, y: 1, z: from.z });
      // Shoved away from whatever hit you, so a collision has a direction
      // and not just a cost.
      push.copy(rig.object.position).sub(from).setY(0);
      if (push.lengthSq() < 1e-4) push.set(0, 0, 1);
      push.normalize().multiplyScalar(2.6);
    },

    cheer() {
      react.celebrate(0.9);
    },

    update(dt: number, sprinting: boolean, blockers: readonly Blocker[], bounds: number) {
      // A stumble does not take the controls away — it makes them heavy.
      // Removing control entirely reads as a bug; slowing it reads as a hit.
      stumble = Math.max(0, stumble - dt);
      const hobbled = stumble > 0 ? 0.35 : 1;
      const top = (sprinting && !carrying ? SPRINT : sprinting ? SPRINT * 0.86 : WALK) * hobbled;

      input.moveAxis(axis);
      // Screen-relative, and the camera never rotates: up is −z, right is
      // +x. Fixing the camera yaw is a design decision, not a shortcut —
      // a courier reading house numbers wants a map that stays put.
      desired.set(axis.x, 0, -axis.y);
      if (desired.lengthSq() > 1) desired.normalize();
      desired.multiplyScalar(top);
      velocity.lerp(desired, Math.min(1, dt * 12));
      rig.object.position.addScaledVector(velocity, dt);

      if (velocity.lengthSq() > 0.05) {
        const want = Math.atan2(velocity.x, velocity.z);
        let turn = want - rig.object.rotation.y;
        while (turn > Math.PI) turn -= Math.PI * 2;
        while (turn < -Math.PI) turn += Math.PI * 2;
        rig.object.rotation.y += turn * Math.min(1, dt * 12);
      }
      if (push.lengthSq() > 1e-4) {
        rig.object.position.addScaledVector(push, dt);
        push.multiplyScalar(Math.max(0, 1 - dt * 5));
      }

      // Circle push-out against the village's furniture. Not a physics
      // engine — but a courier who walks through a house is not playing a
      // game about a village, and this is eleven lines.
      for (const b of blockers) {
        const dx = rig.object.position.x - b.centre.x;
        const dz = rig.object.position.z - b.centre.z;
        const rr = b.radius + 0.45;
        const d2 = dx * dx + dz * dz;
        if (d2 > rr * rr || d2 < 1e-6) continue;
        const d = Math.sqrt(d2);
        rig.object.position.x = b.centre.x + (dx / d) * rr;
        rig.object.position.z = b.centre.z + (dz / d) * rr;
      }

      const edge = bounds - 2;
      rig.object.position.x = Math.min(Math.max(rig.object.position.x, -edge), edge);
      rig.object.position.z = Math.min(Math.max(rig.object.position.z, -edge), edge);
      rig.object.position.y = 0;

      loco.update(dt, velocity);
      react.update(dt);
      ik.update();
    },

    reset(at: Vector3) {
      rig.object.position.copy(at);
      velocity.set(0, 0, 0);
      push.set(0, 0, 0);
      stumble = 0;
      api.setCarrying(false);
    },
  };

  return api;
}
