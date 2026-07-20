import {
  AmbientLight,
  BoxGeometry,
  CapsuleGeometry,
  Color,
  DirectionalLight,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
} from 'three';
import { Game, FollowCamera, DebugOverlay, type GameObject } from '../../src';
import { PhysicsWorld, RigidBody, PhysicsCharacterController } from '../../src/rapier';

async function main(): Promise<void> {
  const game = new Game();
  game.world.scene.background = new Color(0x0b0e14);
  game.world.scene.add(new AmbientLight(0xffffff, 0.6));
  const sun = new DirectionalLight(0xffffff, 1.2);
  sun.position.set(10, 20, 8);
  game.world.scene.add(sun, new GridHelper(60, 60, 0x334155, 0x1e293b));

  const physics = await PhysicsWorld.create();
  physics.attach(game);

  const fixedBox = (
    name: string,
    size: Vector3,
    position: Vector3,
    rotationZ = 0,
    color = 0x475569
  ): GameObject => {
    const object = game.world.spawn(name);
    object.add(new Mesh(new BoxGeometry(size.x, size.y, size.z), new MeshStandardMaterial({ color })));
    object.position.copy(position);
    object.rotation.z = rotationZ;
    object.addComponent(
      new RigidBody(physics, {
        type: 'fixed',
        collider: { shape: 'box', halfExtents: size.clone().multiplyScalar(0.5) },
      })
    );
    return object;
  };

  // Level: ground, a walkable ramp, and a staircase for auto-step.
  fixedBox('ground', new Vector3(60, 1, 60), new Vector3(0, -0.5, 0), 0, 0x1e293b);
  fixedBox('ramp', new Vector3(8, 0.5, 6), new Vector3(-10, 1.4, -6), -0.35);
  for (let i = 0; i < 5; i++) {
    fixedBox('stair', new Vector3(2, 0.4 * (i + 1), 6), new Vector3(8 + i * 2, 0.2 * (i + 1), -6));
  }

  // A pyramid of dynamic crates to shove over.
  const crateMaterial = new MeshStandardMaterial({ color: 0xd97706 });
  for (let row = 0; row < 4; row++) {
    for (let i = 0; i < 4 - row; i++) {
      const crate = game.world.spawn('crate');
      crate.add(new Mesh(new BoxGeometry(1, 1, 1), crateMaterial));
      crate.position.set(i * 1.05 + row * 0.5 - 1.5, 0.55 + row * 1.05, 6);
      crate.addComponent(
        new RigidBody(physics, {
          collider: { shape: 'box', halfExtents: new Vector3(0.5, 0.5, 0.5), friction: 0.6 },
        })
      );
    }
  }

  // Bouncy balls.
  const ballMaterial = new MeshStandardMaterial({ color: 0x34d399 });
  for (let i = 0; i < 4; i++) {
    const ball = game.world.spawn('ball');
    ball.add(new Mesh(new SphereGeometry(0.45), ballMaterial));
    ball.position.set(-6 + i * 1.5, 5 + i * 1.5, 6);
    ball.addComponent(
      new RigidBody(physics, {
        collider: { shape: 'sphere', radius: 0.45, restitution: 0.8 },
        ccd: true,
      })
    );
  }

  // The player: physics-backed capsule character.
  const player = game.world.spawn('player');
  const capsule = new Mesh(
    new CapsuleGeometry(0.4, 1.0, 8, 16),
    new MeshStandardMaterial({ color: 0x60a5fa })
  );
  player.add(capsule);
  player.position.set(0, 0.9, 0);
  player.tags.add('player');
  const controller = player.addComponent(
    new PhysicsCharacterController(physics, game.input, { speed: 7, jumpSpeed: 9 })
  );

  game.onUpdate(() => {
    if (game.input.wasPressed('Space')) controller.jump();
  });

  const cam = new FollowCamera(game.camera, player, { offset: new Vector3(0, 9, 13) });
  game.onUpdate((time) => cam.update(time.delta));

  new DebugOverlay(game);
  game.start();
}

main();
