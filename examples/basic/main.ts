import {
  AmbientLight,
  BoxGeometry,
  Color,
  ConeGeometry,
  DirectionalLight,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
} from 'three';
import {
  Game,
  MotionAgent,
  Seek,
  Wander,
  Separation,
  Alignment,
  Cohesion,
  CharacterController,
  FollowCamera,
  SphereCollider,
  checkCollisions,
  Tweens,
  easing,
} from '../../src';

const game = new Game();
game.world.scene.background = new Color(0x0b0e14);

// Lights & ground
game.world.scene.add(new AmbientLight(0xffffff, 0.6));
const sun = new DirectionalLight(0xffffff, 1.2);
sun.position.set(5, 10, 4);
game.world.scene.add(sun, new GridHelper(60, 60, 0x334155, 0x1e293b));

// Player — a keyboard-driven character the camera follows.
const player = game.world.spawn('player');
player.add(new Mesh(new ConeGeometry(0.5, 1.4, 4), new MeshStandardMaterial({ color: 0x60a5fa })));
player.children[0].rotation.x = Math.PI / 2;
player.position.y = 0.7;
player.addComponent(new CharacterController(game.input, { speed: 8 }));
player.addComponent(new SphereCollider(0.7));
player.tags.add('player');

const followCam = new FollowCamera(game.camera, player, { offset: new Vector3(0, 10, 12) });
game.onUpdate((time) => followCam.update(time.delta));

// Chasers — motion agents that pursue the player and avoid each other.
const chaserAgents: MotionAgent[] = [];
for (let i = 0; i < 3; i++) {
  const chaser = game.world.spawn(`chaser-${i}`);
  chaser.add(new Mesh(new BoxGeometry(0.8, 0.8, 0.8), new MeshStandardMaterial({ color: 0xf87171 })));
  chaser.position.set(Math.cos(i * 2.1) * 15, 0.4, Math.sin(i * 2.1) * 15);
  const agent = chaser.addComponent(new MotionAgent({ maxSpeed: 4.5, planar: true }));
  agent.addBehavior(new Seek(player.position));
  agent.addBehavior(new Separation(() => chaserAgents, 2.5), 2);
  chaserAgents.push(agent);
}

// A wandering flock — separation + alignment + cohesion.
const flock: MotionAgent[] = [];
for (let i = 0; i < 20; i++) {
  const bird = game.world.spawn(`bird-${i}`);
  bird.add(new Mesh(new ConeGeometry(0.2, 0.6, 5), new MeshStandardMaterial({ color: 0x34d399 })));
  bird.children[0].rotation.x = Math.PI / 2;
  bird.position.set((Math.random() - 0.5) * 20, 2.5, (Math.random() - 0.5) * 20);
  const agent = bird.addComponent(new MotionAgent({ maxSpeed: 3.5 }));
  agent.addBehavior(new Wander(), 1);
  agent.addBehavior(new Separation(() => flock, 1.5), 1.6);
  agent.addBehavior(new Alignment(() => flock, 5), 1);
  agent.addBehavior(new Cohesion(() => flock, 6), 0.8);
  // Gentle pull back toward the arena center so the flock stays on screen.
  agent.addBehavior(new Seek(new Vector3(0, 2.5, 0)), 0.15);
  flock.push(agent);
}

// Pickups — tweened bobbing, collected via collider overlap with the player.
const tweens = new Tweens();
game.onUpdate((time) => tweens.update(time.delta));

function spawnPickup(): void {
  const pickup = game.world.spawn('pickup');
  pickup.add(new Mesh(new SphereGeometry(0.35), new MeshStandardMaterial({ color: 0xfbbf24, emissive: 0x92600a })));
  pickup.position.set((Math.random() - 0.5) * 30, 0.6, (Math.random() - 0.5) * 30);
  pickup.addComponent(new SphereCollider(0.6, true));
  pickup.tags.add('pickup');
  pickup.scale.setScalar(0.01);
  tweens.to(pickup.scale, { x: 1, y: 1, z: 1 }, { duration: 0.4, easing: easing.backOut });
}
for (let i = 0; i < 6; i++) spawnPickup();

let score = 0;
game.onUpdate(() => {
  for (const [a, b] of checkCollisions(game.world.objects)) {
    const pickup = a.tags.has('pickup') ? a : b.tags.has('pickup') ? b : null;
    const other = pickup === a ? b : a;
    if (pickup && other.tags.has('player') && !pickup.destroyed) {
      pickup.destroy();
      score++;
      document.title = `GAMA demo — score ${score}`;
      spawnPickup();
    }
  }
});

game.start();
