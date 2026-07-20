import {
  AmbientLight,
  Box3,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from 'three';
import {
  Game,
  MotionAgent,
  Wander,
  Separation,
  Alignment,
  Cohesion,
  SpatialGrid,
  ObstacleAvoidance,
  Containment,
  DebugOverlay,
  type Obstacle,
} from '../../src';

const game = new Game();
game.world.scene.background = new Color(0x0b0e14);
game.camera.position.set(0, 42, 46);
game.camera.lookAt(0, 4, 0);

game.world.scene.add(new AmbientLight(0xffffff, 0.6));
const sun = new DirectionalLight(0xffffff, 1.2);
sun.position.set(10, 20, 8);
game.world.scene.add(sun, new GridHelper(80, 40, 0x334155, 0x1e293b));

// Obstacle columns the flock must weave around.
const obstacles: Obstacle[] = [];
const columnMaterial = new MeshStandardMaterial({ color: 0x64748b });
for (let i = 0; i < 7; i++) {
  const radius = 1.5 + (i % 3);
  const angle = (i / 7) * Math.PI * 2;
  const center = new Vector3(Math.cos(angle) * 12, 6, Math.sin(angle) * 12);
  const column = game.world.spawn(`column-${i}`);
  column.add(new Mesh(new CylinderGeometry(radius, radius, 12, 16), columnMaterial));
  column.position.copy(center).setY(6);
  obstacles.push({ center, radius });
}

// The flock: 400 boids sharing one SpatialGrid for near-O(n) neighbor lookups.
const NEIGHBOR_RADIUS = 5;
const bounds = new Box3(new Vector3(-30, 1, -30), new Vector3(30, 14, 30));
const grid = new SpatialGrid(NEIGHBOR_RADIUS);
const flock: MotionAgent[] = [];
const boidGeometry = new ConeGeometry(0.18, 0.55, 5);
const boidMaterial = new MeshStandardMaterial({ color: 0x34d399 });

for (let i = 0; i < 400; i++) {
  const boid = game.world.spawn(`boid-${i}`);
  const mesh = new Mesh(boidGeometry, boidMaterial);
  mesh.rotation.x = Math.PI / 2;
  boid.add(mesh);
  boid.position.set((Math.random() - 0.5) * 50, 2 + Math.random() * 10, (Math.random() - 0.5) * 50);

  const agent = boid.addComponent(new MotionAgent({ maxSpeed: 6, maxForce: 18 }));
  agent.velocity.set(Math.random() - 0.5, 0, Math.random() - 0.5).setLength(3);
  const neighbors = grid.near(agent, NEIGHBOR_RADIUS);
  agent.addBehavior(new Wander(), 0.6);
  agent.addBehavior(new Separation(neighbors, 1.4), 1.8);
  agent.addBehavior(new Alignment(neighbors, 4), 1);
  agent.addBehavior(new Cohesion(neighbors, 5), 0.7);
  agent.addBehavior(new ObstacleAvoidance(() => obstacles, 5, 0.4), 2.5);
  agent.addBehavior(new Containment(bounds, 4), 2);
  flock.push(agent);
}

// One grid rebuild per frame covers every boid's neighbor queries.
game.onUpdate(() => grid.rebuild(flock));

new DebugOverlay(game);

game.start();
