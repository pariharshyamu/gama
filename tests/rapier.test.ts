import { beforeAll, describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { GameObject } from '../src/core/GameObject';
import { Time } from '../src/core/Time';
import { PhysicsWorld } from '../src/rapier/PhysicsWorld';
import { RigidBody } from '../src/rapier/RigidBody';
import { PhysicsCharacterController } from '../src/rapier/PhysicsCharacterController';

const DT = 1 / 60;

function fixedTime(): Time {
  const time = new Time();
  time.delta = DT;
  return time;
}

/** Step physics then component fixedUpdates, mirroring Game's ordering. */
function simulate(physics: PhysicsWorld, objects: GameObject[], seconds: number): void {
  const time = fixedTime();
  for (let t = 0; t < seconds; t += DT) {
    physics.step(DT);
    for (const o of objects) o.fixedUpdate(time);
  }
}

function ground(physics: PhysicsWorld, y = 0): GameObject {
  const floor = new GameObject('ground');
  floor.position.y = y - 0.5;
  floor.addComponent(
    new RigidBody(physics, {
      type: 'fixed',
      collider: { shape: 'box', halfExtents: new Vector3(50, 0.5, 50) },
    })
  );
  return floor;
}

describe('RigidBody', () => {
  let physics: PhysicsWorld;
  beforeAll(async () => {
    physics = await PhysicsWorld.create();
  });

  it('drops a dynamic ball onto the ground and syncs the GameObject', async () => {
    const world = await PhysicsWorld.create();
    const floor = ground(world);
    const ball = new GameObject('ball');
    ball.position.set(0, 5, 0);
    ball.addComponent(
      new RigidBody(world, { collider: { shape: 'sphere', radius: 0.5 } })
    );

    simulate(world, [floor, ball], 3);
    // Resting on the floor: center ≈ radius above y=0.
    expect(ball.position.y).toBeGreaterThan(0.3);
    expect(ball.position.y).toBeLessThan(0.7);
  });

  it('bounces with restitution', async () => {
    const world = await PhysicsWorld.create();
    const floor = ground(world);
    const ball = new GameObject('bouncy');
    ball.position.set(0, 4, 0);
    const body = ball.addComponent(
      new RigidBody(world, { collider: { shape: 'sphere', radius: 0.5, restitution: 0.9 } })
    );

    let apexAfterBounce = 0;
    let bounced = false;
    const time = fixedTime();
    for (let t = 0; t < 4; t += DT) {
      world.step(DT);
      floor.fixedUpdate(time);
      ball.fixedUpdate(time);
      const vy = body.getLinearVelocity().y;
      if (vy > 0.5) bounced = true;
      if (bounced) apexAfterBounce = Math.max(apexAfterBounce, ball.position.y);
    }
    expect(bounced).toBe(true);
    // Rapier averages restitution with the floor's 0 → effective ~0.45,
    // giving an apex around 1.2 from a 4-unit drop. A dead ball stays ~0.5.
    expect(apexAfterBounce).toBeGreaterThan(1.0);
  });

  it('applies impulses', () => {
    const floor = ground(physics);
    const crate = new GameObject('crate');
    crate.position.set(0, 0.5, 0);
    const body = crate.addComponent(
      new RigidBody(physics, {
        collider: { shape: 'box', halfExtents: new Vector3(0.5, 0.5, 0.5) },
      })
    );
    simulate(physics, [floor, crate], 0.5); // settle
    const before = crate.position.x;
    body.applyImpulse(new Vector3(5, 0, 0));
    simulate(physics, [floor, crate], 1);
    expect(crate.position.x).toBeGreaterThan(before + 0.5);
  });

  it('kinematic bodies follow the GameObject and push dynamic ones', async () => {
    const world = await PhysicsWorld.create();
    const floor = ground(world);
    const platform = new GameObject('platform');
    platform.position.set(-3, 0.5, 0);
    platform.addComponent(
      new RigidBody(world, {
        type: 'kinematic',
        collider: { shape: 'box', halfExtents: new Vector3(1, 0.5, 1) },
      })
    );
    const crate = new GameObject('crate');
    crate.position.set(0, 0.6, 0);
    crate.addComponent(
      new RigidBody(world, {
        collider: { shape: 'box', halfExtents: new Vector3(0.5, 0.5, 0.5) },
      })
    );

    const time = fixedTime();
    for (let t = 0; t < 2; t += DT) {
      platform.position.x += 2 * DT; // slide right through the crate's spot
      world.step(DT);
      for (const o of [floor, platform, crate]) o.fixedUpdate(time);
    }
    expect(crate.position.x).toBeGreaterThan(0.5); // shoved aside
  });

  it('removes the body from the world on detach', async () => {
    const world = await PhysicsWorld.create();
    const thing = new GameObject();
    const body = thing.addComponent(
      new RigidBody(world, { collider: { shape: 'sphere', radius: 0.5 } })
    );
    const countBefore = world.raw.bodies.len();
    thing.removeComponent(body);
    expect(world.raw.bodies.len()).toBe(countBefore - 1);
  });
});

describe('PhysicsCharacterController', () => {
  async function setup(extra?: (physics: PhysicsWorld) => GameObject[]) {
    const physics = await PhysicsWorld.create();
    const objects = [ground(physics)];
    const player = new GameObject('player');
    player.position.set(0, 0.9, 0); // capsule total half-height = 0.9
    const controller = player.addComponent(new PhysicsCharacterController(physics, undefined));
    objects.push(player);
    if (extra) objects.push(...extra(physics));
    return { physics, objects, player, controller };
  }

  it('walks in the intended direction and stays grounded', async () => {
    const { physics, objects, player, controller } = await setup();
    controller.moveIntent.set(6, 0, 0);
    simulate(physics, objects, 1);
    expect(player.position.x).toBeGreaterThan(4);
    expect(controller.grounded).toBe(true);
    expect(Math.abs(player.position.y - 0.9)).toBeLessThan(0.2);
  });

  it('is blocked by a wall', async () => {
    const { physics, objects, player, controller } = await setup((physics) => {
      const wall = new GameObject('wall');
      wall.position.set(3, 2, 0);
      wall.addComponent(
        new RigidBody(physics, {
          type: 'fixed',
          collider: { shape: 'box', halfExtents: new Vector3(0.5, 2, 4) },
        })
      );
      return [wall];
    });
    controller.moveIntent.set(6, 0, 0);
    simulate(physics, objects, 2);
    expect(player.position.x).toBeLessThan(2.7); // wall face at x=2.5
    expect(player.position.x).toBeGreaterThan(1.5); // walked up to it
  });

  it('auto-steps onto a low ledge but not a tall one', async () => {
    const { physics, objects, player, controller } = await setup((physics) => {
      const step = new GameObject('step');
      step.position.set(2, 0.15, 0); // 0.3 tall ledge
      step.addComponent(
        new RigidBody(physics, {
          type: 'fixed',
          collider: { shape: 'box', halfExtents: new Vector3(1, 0.15, 4) },
        })
      );
      const tall = new GameObject('tall');
      tall.position.set(6, 1, 0); // 2.0 tall — beyond autostep
      tall.addComponent(
        new RigidBody(physics, {
          type: 'fixed',
          collider: { shape: 'box', halfExtents: new Vector3(1, 1, 4) },
        })
      );
      return [step, tall];
    });
    controller.moveIntent.set(4, 0, 0);
    let maxY = 0;
    const time = fixedTime();
    for (let t = 0; t < 2; t += DT) {
      physics.step(DT);
      for (const o of objects) o.fixedUpdate(time);
      maxY = Math.max(maxY, player.position.y);
    }
    // Climbed onto the 0.3 ledge while crossing it (standing height 0.9 + 0.3),
    // walked off its far side, and stopped at the tall block (face at x = 5).
    expect(maxY).toBeGreaterThan(1.1);
    expect(player.position.x).toBeLessThan(5.0);
    expect(player.position.x).toBeGreaterThan(3.5);
  });

  it('jumps, rises, and lands back on the ground', async () => {
    const { physics, objects, player, controller } = await setup();
    simulate(physics, objects, 0.5); // settle & ground
    expect(controller.grounded).toBe(true);

    controller.jump();
    let apex = 0;
    const time = fixedTime();
    let airborneFrames = 0;
    for (let t = 0; t < 2.5; t += DT) {
      physics.step(DT);
      for (const o of objects) o.fixedUpdate(time);
      apex = Math.max(apex, player.position.y);
      if (!controller.grounded) airborneFrames++;
    }
    expect(apex).toBeGreaterThan(1.8); // rose well above standing height 0.9
    expect(airborneFrames).toBeGreaterThan(10);
    expect(controller.grounded).toBe(true); // landed
    expect(Math.abs(player.position.y - 0.9)).toBeLessThan(0.2);
  });

  it('does not jump while airborne', async () => {
    const { physics, objects, controller } = await setup();
    simulate(physics, objects, 0.5);
    controller.jump();
    simulate(physics, objects, 0.2); // now airborne
    const vyBefore = controller.verticalVelocity;
    controller.jump(); // should be ignored
    simulate(physics, objects, DT);
    expect(controller.verticalVelocity).toBeLessThan(vyBefore); // still decelerating
  });
});
