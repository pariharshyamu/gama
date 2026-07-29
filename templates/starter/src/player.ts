import { Object3D, Scene, Vector2, Vector3 } from 'three';
import type { Input } from 'gama3d';
import { FootIK, Locomotion, OUTFITS, createHumanoid } from 'anima3d';
import type { World } from './world';

/**
 * The player: an ANIMA body moved by GAMA's input, walking on SCENA's ground.
 *
 * Movement is driven straight off `input.moveAxis()`, which already folds
 * keyboard, gamepad and TouchControls' on-screen stick into one vector — so
 * nothing in this file knows or cares whether it is running on a phone.
 *
 * GAMA also ships a `CharacterController` that does this, and it is not used
 * here for one specific reason: it is a `Component`, so it moves the
 * `GameObject` it is attached to, and GameObjects are stepped by the World on
 * the REAL clock. A game with a pause screen needs movement on the gated
 * clock. Twenty lines is cheaper than fighting that.
 */

export interface Player {
  object: Object3D;
  readonly position: Vector3;
  readonly speed: number;
  update(dt: number, world: World): void;
  reset(at: Vector3): void;
}

const WALK = 4.2;
const SPRINT = 7.4;

export function createPlayer(scene: Scene, input: Input, seed: number): Player {
  const rig = createHumanoid({ seed, height: 1.8, palette: OUTFITS.villager });
  scene.add(rig.object);

  const loco = new Locomotion(rig);
  // Flat ground here, so the height function is a constant — swap in
  // `terrain.heightAt` and the feet follow a landscape for free.
  const ik = new FootIK(rig, { ground: () => 0 });

  const velocity = new Vector3();
  const desired = new Vector3();
  const axis = new Vector2();

  return {
    object: rig.object,
    position: rig.object.position,
    get speed() {
      return velocity.length();
    },

    update(dt: number, world: World) {
      const sprinting = input.isDown('ShiftLeft') || input.isDown('ShiftRight');
      input.moveAxis(axis);

      // Screen-relative, with a camera that never rotates: up is −z, right
      // is +x. If you give the camera a yaw, rotate this vector by it.
      desired.set(axis.x, 0, -axis.y);
      if (desired.lengthSq() > 1) desired.normalize();
      desired.multiplyScalar(sprinting ? SPRINT : WALK);
      velocity.lerp(desired, Math.min(1, dt * 12));
      rig.object.position.addScaledVector(velocity, dt);

      // Turn toward travel, at a rate rather than instantly.
      if (velocity.lengthSq() > 0.05) {
        let turn = Math.atan2(velocity.x, velocity.z) - rig.object.rotation.y;
        while (turn > Math.PI) turn -= Math.PI * 2;
        while (turn < -Math.PI) turn += Math.PI * 2;
        rig.object.rotation.y += turn * Math.min(1, dt * 12);
      }

      // Circle push-out against the scenery. Not a physics engine — but a
      // player who walks through a tree is not in a place, and this is ten
      // lines. Reach for the rapier adapter when you need stacking or joints.
      for (const b of world.blockers) {
        const dx = rig.object.position.x - b.centre.x;
        const dz = rig.object.position.z - b.centre.z;
        const rr = b.radius + 0.45;
        const d2 = dx * dx + dz * dz;
        if (d2 > rr * rr || d2 < 1e-6) continue;
        const d = Math.sqrt(d2);
        rig.object.position.x = b.centre.x + (dx / d) * rr;
        rig.object.position.z = b.centre.z + (dz / d) * rr;
      }

      const edge = world.bounds - 1;
      rig.object.position.x = Math.min(Math.max(rig.object.position.x, -edge), edge);
      rig.object.position.z = Math.min(Math.max(rig.object.position.z, -edge), edge);

      loco.update(dt, velocity);
      ik.update();
    },

    reset(at: Vector3) {
      rig.object.position.copy(at);
      rig.object.rotation.y = 0;
      velocity.set(0, 0, 0);
    },
  };
}
