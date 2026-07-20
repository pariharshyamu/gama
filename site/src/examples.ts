export interface Example {
  id: string;
  title: string;
  group: string;
  code: string;
}

// Shared prelude used by most examples (kept inline in each so every
// example is fully self-contained and copy-pasteable).
const scene = (x = 0, y = 22, z = 20, lookY = 0) =>
  `import { AmbientLight, Color, DirectionalLight, GridHelper } from 'three';

const game = new Game();
game.world.scene.background = new Color(0x0b0e14);
const sun = new DirectionalLight(0xffffff, 1.2);
sun.position.set(10, 20, 8);
game.world.scene.add(new AmbientLight(0xffffff, 0.6), sun, new GridHelper(40, 40, 0x334155, 0x1e293b));
game.camera.position.set(${x}, ${y}, ${z});
game.camera.lookAt(0, ${lookY}, 0);`;
const SCENE = scene();

export const EXAMPLES: Example[] = [
  {
    id: 'seek',
    title: 'Seek vs Arrive',
    group: 'Steering',
    code: `// Two agents, one target. Blue SEEKS at full speed (and orbits —
// it can't slow down). Green ARRIVES: it decelerates and stops.
// Click anywhere on the ground to move the target.
import { Game, MotionAgent, Seek, Arrive } from 'gama';
import { Mesh, MeshStandardMaterial, ConeGeometry, RingGeometry,
         Raycaster, Plane, Vector3 } from 'three';
${SCENE}

const target = new Vector3(6, 0, 2);
const marker = new Mesh(new RingGeometry(0.5, 0.75, 32),
  new MeshStandardMaterial({ color: 0xfbbf24 }));
marker.rotation.x = -Math.PI / 2;
game.world.scene.add(marker);
game.onUpdate(() => marker.position.copy(target).setY(0.03));

function makeAgent(color, x) {
  const walker = game.world.spawn('walker');
  const mesh = new Mesh(new ConeGeometry(0.5, 1.4, 4),
    new MeshStandardMaterial({ color }));
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = 0.7;
  walker.add(mesh);
  walker.position.set(x, 0, -8);
  return walker.addComponent(new MotionAgent({ maxSpeed: 7, planar: true }));
}
makeAgent(0x60a5fa, -6).addBehavior(new Seek(target));
makeAgent(0x34d399, 6).addBehavior(new Arrive(target, 4));

const raycaster = new Raycaster();
const ground = new Plane(new Vector3(0, 1, 0), 0);
game.renderer.domElement.addEventListener('pointerdown', () => {
  raycaster.setFromCamera(game.input.pointerNdc, game.camera);
  raycaster.ray.intersectPlane(ground, target);
});

game.start();`,
  },

  {
    id: 'wander',
    title: 'Wander + Containment',
    group: 'Steering',
    code: `// Aimless-but-organic meandering: each agent steers toward a point
// drifting on a circle ahead of it. Containment keeps them in bounds.
import { Game, MotionAgent, Wander, Containment } from 'gama';
import { Mesh, MeshStandardMaterial, ConeGeometry, Box3, Vector3 } from 'three';
${SCENE}

const bounds = new Box3(new Vector3(-16, 0, -16), new Vector3(16, 4, 16));
for (let i = 0; i < 14; i++) {
  const walker = game.world.spawn('wanderer');
  const mesh = new Mesh(new ConeGeometry(0.4, 1.1, 5),
    new MeshStandardMaterial({ color: 0x34d399 }));
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = 0.55;
  walker.add(mesh);
  walker.position.set((Math.random() - 0.5) * 24, 0, (Math.random() - 0.5) * 24);
  const agent = walker.addComponent(new MotionAgent({ maxSpeed: 5, planar: true }));
  agent.velocity.set(Math.random() - 0.5, 0, Math.random() - 0.5).setLength(2);
  agent.addBehavior(new Wander(3, 1.5, 4));
  agent.addBehavior(new Containment(bounds, 3), 2);
}

game.start();`,
  },

  {
    id: 'pursuit',
    title: 'Pursue & Evade',
    group: 'Steering',
    code: `// The red hunter PURSUES the green runner's predicted position;
// the runner EVADES the hunter's predicted position. Cat and mouse.
import { Game, MotionAgent, Pursue, Evade, Wander, Containment } from 'gama';
import { Mesh, MeshStandardMaterial, ConeGeometry, Box3, Vector3 } from 'three';
${SCENE}

const bounds = new Box3(new Vector3(-16, 0, -16), new Vector3(16, 4, 16));

function makeAgent(color, x, speed) {
  const walker = game.world.spawn('agent');
  const mesh = new Mesh(new ConeGeometry(0.5, 1.4, 4),
    new MeshStandardMaterial({ color }));
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = 0.7;
  walker.add(mesh);
  walker.position.set(x, 0, 0);
  return walker.addComponent(new MotionAgent({ maxSpeed: speed, planar: true }));
}

const runner = makeAgent(0x34d399, 8, 6.5);
const hunter = makeAgent(0xf87171, -8, 6);

hunter.addBehavior(new Pursue(runner, 1.5));
hunter.addBehavior(new Containment(bounds, 3), 2);
runner.addBehavior(new Evade(hunter, 1.5, 12), 1.4);
runner.addBehavior(new Wander(), 0.5);
runner.addBehavior(new Containment(bounds, 3), 2.5);

game.start();`,
  },

  {
    id: 'flock',
    title: 'Flocking (200 boids)',
    group: 'Steering',
    code: `// Classic boids: separation + alignment + cohesion, with a SpatialGrid
// making neighbor queries near-O(n). Press F3 for the debug overlay —
// cyan arrows are velocity, magenta arrows are steering force.
import { Game, MotionAgent, Wander, Separation, Alignment, Cohesion,
         Containment, SpatialGrid, DebugOverlay } from 'gama';
import { Mesh, MeshStandardMaterial, ConeGeometry, Box3, Vector3 } from 'three';
${scene(0, 26, 30, 4)}

const bounds = new Box3(new Vector3(-18, 1, -18), new Vector3(18, 12, 18));
const grid = new SpatialGrid(5);
const flock = [];

for (let i = 0; i < 200; i++) {
  const boid = game.world.spawn('boid');
  const mesh = new Mesh(new ConeGeometry(0.18, 0.55, 5),
    new MeshStandardMaterial({ color: 0x34d399 }));
  mesh.rotation.x = Math.PI / 2;
  boid.add(mesh);
  boid.position.set((Math.random() - 0.5) * 30, 2 + Math.random() * 8,
                    (Math.random() - 0.5) * 30);
  const agent = boid.addComponent(new MotionAgent({ maxSpeed: 6, maxForce: 18 }));
  agent.velocity.set(Math.random() - 0.5, 0, Math.random() - 0.5).setLength(3);
  const neighbors = grid.near(agent, 5);
  agent.addBehavior(new Wander(), 0.6);
  agent.addBehavior(new Separation(neighbors, 1.4), 1.8);
  agent.addBehavior(new Alignment(neighbors, 4), 1);
  agent.addBehavior(new Cohesion(neighbors, 5), 0.7);
  agent.addBehavior(new Containment(bounds, 4), 2);
  flock.push(agent);
}
game.onUpdate(() => grid.rebuild(flock)); // one rebuild serves every query

new DebugOverlay(game);
game.start();`,
  },

  {
    id: 'avoid',
    title: 'Obstacle avoidance',
    group: 'Steering',
    code: `// Agents ping-pong across a field of pillars. ObstacleAvoidance probes
// ahead along the velocity and swerves — it steers sideways, not brakes.
import { Game, MotionAgent, Seek, Separation, ObstacleAvoidance } from 'gama';
import { Mesh, MeshStandardMaterial, ConeGeometry, CylinderGeometry, Vector3 } from 'three';
${SCENE}

const obstacles = [];
const stone = new MeshStandardMaterial({ color: 0x64748b });
for (let i = 0; i < 6; i++) {
  const radius = 1 + (i % 3) * 0.5;
  const center = new Vector3((Math.random() - 0.5) * 14, 2, (Math.random() - 0.5) * 14);
  const pillar = new Mesh(new CylinderGeometry(radius, radius, 4, 16), stone);
  pillar.position.copy(center);
  game.world.scene.add(pillar);
  obstacles.push({ center, radius });
}

const agents = [];
for (let i = 0; i < 8; i++) {
  const walker = game.world.spawn('walker');
  const mesh = new Mesh(new ConeGeometry(0.4, 1.1, 4),
    new MeshStandardMaterial({ color: 0x60a5fa }));
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = 0.55;
  walker.add(mesh);
  walker.position.set(-16, 0, -14 + i * 4);
  const agent = walker.addComponent(new MotionAgent({ maxSpeed: 6, planar: true }));
  const goal = new Vector3(16, 0, walker.position.z);
  agent.addBehavior(new Seek(goal));
  agent.addBehavior(new ObstacleAvoidance(() => obstacles, 4, 0.5), 2.5);
  agent.addBehavior(new Separation(() => agents, 1.5), 1.2);
  agents.push(agent);
  // Ping-pong: flip the goal when reached.
  game.onUpdate(() => {
    if (walker.position.distanceTo(goal) < 1.5) goal.x = -goal.x;
  });
}

game.start();`,
  },

  {
    id: 'path',
    title: 'Path following',
    group: 'Steering',
    code: `// A looping patrol circuit. FollowPath seeks each waypoint in turn;
// on a looping path it never stops.
import { Game, MotionAgent, FollowPath, Path, Separation } from 'gama';
import { Mesh, MeshStandardMaterial, ConeGeometry, RingGeometry, Vector3 } from 'three';
${SCENE}

const waypoints = [];
for (let i = 0; i < 6; i++) {
  const angle = (i / 6) * Math.PI * 2;
  waypoints.push(new Vector3(Math.cos(angle) * 11, 0, Math.sin(angle) * 8));
}
const ring = new Mesh(new RingGeometry(0.4, 0.6, 24),
  new MeshStandardMaterial({ color: 0x334155 }));
ring.rotation.x = -Math.PI / 2;
for (const p of waypoints) {
  const marker = ring.clone();
  marker.position.copy(p).setY(0.02);
  game.world.scene.add(marker);
}

const agents = [];
for (let i = 0; i < 4; i++) {
  const walker = game.world.spawn('patroller');
  const mesh = new Mesh(new ConeGeometry(0.45, 1.3, 4),
    new MeshStandardMaterial({ color: [0x60a5fa, 0xf87171, 0x34d399, 0xfbbf24][i] }));
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = 0.65;
  walker.add(mesh);
  const path = new Path(waypoints.map((p) => p.clone()), true);
  for (let s = 0; s < i; s++) path.advance(); // stagger along the route
  walker.position.copy(path.current());
  const agent = walker.addComponent(new MotionAgent({ maxSpeed: 6, planar: true }));
  agent.addBehavior(new FollowPath(path, 1));
  agent.addBehavior(new Separation(() => agents, 1.6), 1.2);
  agents.push(agent);
}

game.start();`,
  },

  {
    id: 'navmesh',
    title: 'Navmesh click-to-move',
    group: 'Navigation',
    code: `// A donut-shaped walkable area (center blocked). Click anywhere:
// A* finds the triangle corridor, the funnel algorithm string-pulls it,
// and NavMeshAgent drives a MotionAgent along the waypoints.
import { Game, MotionAgent, NavMesh, NavMeshAgent, Separation } from 'gama';
import { Mesh, MeshStandardMaterial, ConeGeometry, BoxGeometry,
         BufferGeometry, Line, LineBasicMaterial, Raycaster, Vector3 } from 'three';
${SCENE}

// Build the floor as a 3x3 grid of cells with the middle missing.
const CELL = 10;
const positions = [];
for (let cx = 0; cx < 3; cx++) for (let cz = 0; cz < 3; cz++) {
  if (cx === 1 && cz === 1) continue;
  const x0 = -15 + cx * CELL, z0 = -15 + cz * CELL;
  positions.push(x0,0,z0, x0+CELL,0,z0+CELL, x0+CELL,0,z0);
  positions.push(x0,0,z0, x0,0,z0+CELL, x0+CELL,0,z0+CELL);
}
const nav = new NavMesh(positions);
const floor = new Mesh(nav.toBufferGeometry(),
  new MeshStandardMaterial({ color: 0x14532d }));
game.world.scene.add(floor);
const wall = new Mesh(new BoxGeometry(10, 3, 10),
  new MeshStandardMaterial({ color: 0x475569 }));
wall.position.y = 1.5;
game.world.scene.add(wall);

const agents = [], navAgents = [];
for (let i = 0; i < 3; i++) {
  const walker = game.world.spawn('walker');
  const mesh = new Mesh(new ConeGeometry(0.5, 1.4, 4),
    new MeshStandardMaterial({ color: [0x60a5fa, 0xf87171, 0xfbbf24][i] }));
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = 0.7;
  walker.add(mesh);
  walker.position.set(-13 + i * 2, 0, 13);
  const motion = walker.addComponent(new MotionAgent({ maxSpeed: 7, maxForce: 40, planar: true }));
  motion.addBehavior(new Separation(() => agents, 1.4), 1.2);
  agents.push(motion);
  navAgents.push(walker.addComponent(new NavMeshAgent(nav)));
}

const pathLine = new Line(new BufferGeometry(),
  new LineBasicMaterial({ color: 0x7dd3fc }));
pathLine.position.y = 0.1;
game.world.scene.add(pathLine);

const raycaster = new Raycaster();
function goTo(point) {
  navAgents.forEach((nav, i) => {
    const offset = new Vector3(Math.cos(i * 2.1), 0, Math.sin(i * 2.1));
    nav.goTo(offset.add(point));
  });
  if (navAgents[0].currentPath) {
    pathLine.geometry.dispose();
    pathLine.geometry = new BufferGeometry().setFromPoints(navAgents[0].currentPath);
  }
}
game.renderer.domElement.addEventListener('pointerdown', () => {
  raycaster.setFromCamera(game.input.pointerNdc, game.camera);
  const hit = raycaster.intersectObject(floor, false)[0];
  if (hit) goTo(hit.point);
});
goTo(new Vector3(13, 0, -13)); // first trek: around the wall

game.start();`,
  },

  {
    id: 'navgen',
    title: 'Navmesh generation',
    group: 'Navigation',
    code: `// No hand-authored floor: the walkable surface (green) is BAKED from
// the level boxes by grid-sampled raycasts, with agent-radius erosion
// and a ramp connecting the platform. Click to send the agents.
import { Game, MotionAgent, NavMeshAgent, generateNavMesh, Separation } from 'gama';
import { Group, Mesh, MeshStandardMaterial, BoxGeometry, ConeGeometry,
         Raycaster, Vector3 } from 'three';
${scene(0, 30, 26)}

const level = new Group();
const stone = new MeshStandardMaterial({ color: 0x475569 });
function addBox(w, h, d, x, y, z, rz) {
  const mesh = new Mesh(new BoxGeometry(w, h, d), stone);
  mesh.position.set(x, y, z);
  mesh.rotation.z = rz || 0;
  level.add(mesh);
}
addBox(34, 1, 34, 0, -0.5, 0);            // ground
addBox(10, 1, 10, 11, 2.5, -8);           // platform, top y=3
addBox(8.6, 0.4, 4, 2.5, 1.45, -8, 0.36); // ramp up to it
addBox(2, 3, 2, -6, 1.5, -4);             // pillars
addBox(3, 2, 3, 0, 1, 6);
game.world.scene.add(level);

const nav = generateNavMesh(level, { cellSize: 0.5, agentRadius: 0.55, maxClimb: 0.5 });
const surface = new Mesh(nav.toBufferGeometry(),
  new MeshStandardMaterial({ color: 0x14532d, transparent: true, opacity: 0.9 }));
surface.position.y = 0.03;
game.world.scene.add(surface);

const agents = [], navAgents = [];
for (let i = 0; i < 3; i++) {
  const walker = game.world.spawn('walker');
  const mesh = new Mesh(new ConeGeometry(0.45, 1.3, 4),
    new MeshStandardMaterial({ color: [0x60a5fa, 0xf87171, 0xfbbf24][i] }));
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = 0.65;
  walker.add(mesh);
  walker.position.set(-13 + i * 2, 0, 13);
  const motion = walker.addComponent(new MotionAgent({ maxSpeed: 7, maxForce: 40 }));
  motion.addBehavior(new Separation(() => agents, 1.3), 1.2);
  agents.push(motion);
  navAgents.push(walker.addComponent(new NavMeshAgent(nav, { waypointRadius: 0.7 })));
}

const raycaster = new Raycaster();
game.renderer.domElement.addEventListener('pointerdown', () => {
  raycaster.setFromCamera(game.input.pointerNdc, game.camera);
  const hit = raycaster.intersectObject(surface, false)[0];
  if (hit) navAgents.forEach((nav, i) => {
    const offset = new Vector3(Math.cos(i * 2.1), 0, Math.sin(i * 2.1));
    nav.goTo(offset.add(hit.point));
  });
});
navAgents.forEach((nav) => nav.goTo(new Vector3(12, 3, -9))); // onto the platform

game.start();`,
  },

  {
    id: 'behavior-tree',
    title: 'Behavior tree guards',
    group: 'AI',
    code: `// Guards run a reactive behavior tree: chase the target when it's
// close (red), walk back afterwards (yellow), patrol otherwise (green).
// Higher branches preempt lower ones automatically.
import { Game, MotionAgent, Pursue, Arrive, FollowPath, Path, Wander,
         Containment, BehaviorTree, reactiveSelector, reactiveSequence,
         condition, action } from 'gama';
import { Mesh, MeshStandardMaterial, ConeGeometry, SphereGeometry,
         Box3, Vector3 } from 'three';
${SCENE}

// The "player": an autonomous wanderer the guards react to.
const prey = game.world.spawn('prey');
prey.add(new Mesh(new SphereGeometry(0.5),
  new MeshStandardMaterial({ color: 0x60a5fa })));
prey.position.set(0, 0.5, 10);
const preyAgent = prey.addComponent(new MotionAgent({ maxSpeed: 7, planar: true }));
preyAgent.addBehavior(new Wander(3, 2, 5));
preyAgent.addBehavior(new Containment(new Box3(
  new Vector3(-16, 0, -16), new Vector3(16, 2, 16)), 3), 2);

const route = [new Vector3(-10, 0, -10), new Vector3(10, 0, -10),
               new Vector3(10, 0, 2), new Vector3(-10, 0, 2)];

for (let i = 0; i < 3; i++) {
  const body = game.world.spawn('guard');
  const material = new MeshStandardMaterial({ color: 0x34d399 });
  const mesh = new Mesh(new ConeGeometry(0.55, 1.5, 5), material);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = 0.75;
  body.add(mesh);
  body.position.copy(route[i]);

  const agent = body.addComponent(new MotionAgent({ maxSpeed: 5.5, planar: true }));
  const path = new Path(route.map((p) => p.clone()), true);
  for (let s = 0; s < i; s++) path.advance();
  const guard = { agent, body, material, path, mode: null };

  const setMode = (mode, color, behavior) => {
    if (guard.mode === mode) return;
    guard.mode = mode;
    material.color.setHex(color);
    agent.clearBehaviors();
    agent.addBehavior(behavior());
  };
  const distToPrey = () => body.position.distanceTo(prey.position);
  const distToRoute = () => body.position.distanceTo(path.current());

  body.addComponent(new BehaviorTree(reactiveSelector(
    reactiveSequence(
      condition(() => guard.mode === 'chase' ? distToPrey() < 12 : distToPrey() < 7),
      action(() => { setMode('chase', 0xf87171, () => new Pursue(preyAgent, 0.6)); return 'running'; })
    ),
    reactiveSequence(
      condition(() => (guard.mode === 'chase' || guard.mode === 'return') && distToRoute() > 2.5),
      action(() => { setMode('return', 0xfbbf24, () => new Arrive(path.current().clone(), 3)); return 'running'; })
    ),
    action(() => { setMode('patrol', 0x34d399, () => new FollowPath(path, 1)); return 'running'; })
  ), guard));
}

game.start();`,
  },

  {
    id: 'character',
    title: 'Character + camera + pickups',
    group: 'Gameplay',
    code: `// Click the preview to focus it, then drive with WASD / arrows.
// FollowCamera trails you; CollisionSystem fires collision-enter events;
// pickups pop in with a tween.
import { Game, CharacterController, FollowCamera, SphereCollider,
         CollisionSystem, Tweens, easing } from 'gama';
import { Mesh, MeshStandardMaterial, ConeGeometry, SphereGeometry, Vector3 } from 'three';
${SCENE}

const player = game.world.spawn('player');
const mesh = new Mesh(new ConeGeometry(0.5, 1.4, 4),
  new MeshStandardMaterial({ color: 0x60a5fa }));
mesh.rotation.x = Math.PI / 2;
mesh.position.y = 0.7;
player.add(mesh);
player.addComponent(new CharacterController(game.input, { speed: 9 }));
player.addComponent(new SphereCollider(0.8));
player.tags.add('player');

const cam = new FollowCamera(game.camera, player, { offset: new Vector3(0, 9, 12) });
game.onUpdate((t) => cam.update(t.delta));

const tweens = new Tweens();
game.onUpdate((t) => tweens.update(t.delta));

function spawnPickup() {
  const pickup = game.world.spawn('pickup');
  pickup.add(new Mesh(new SphereGeometry(0.35),
    new MeshStandardMaterial({ color: 0xfbbf24, emissive: 0x92600a })));
  pickup.position.set((Math.random() - 0.5) * 26, 0.6, (Math.random() - 0.5) * 26);
  pickup.addComponent(new SphereCollider(0.6, true));
  pickup.tags.add('pickup');
  pickup.scale.setScalar(0.01);
  tweens.to(pickup.scale, { x: 1, y: 1, z: 1 },
    { duration: 0.4, easing: easing.backOut });
}
for (let i = 0; i < 8; i++) spawnPickup();

const collisions = new CollisionSystem();
game.onUpdate(() => collisions.update(game.world.objects));
let score = 0;
player.events.on('collision-enter', (other) => {
  if (other.tags.has('pickup') && !other.destroyed) {
    other.destroy();
    score++;
    document.title = 'score ' + score;
    spawnPickup();
  }
});

game.start();`,
  },

  {
    id: 'orbit',
    title: 'Orbit camera rig',
    group: 'Gameplay',
    code: `// Drag to orbit, wheel to zoom — smoothed, with pitch/distance limits.
// The rig follows its target, so orbit a moving thing just as easily.
import { Game, OrbitRig, MotionAgent, Wander, Containment } from 'gama';
import { Mesh, MeshStandardMaterial, BoxGeometry, ConeGeometry,
         Box3, Vector3 } from 'three';
${SCENE}

const stone = new MeshStandardMaterial({ color: 0x64748b });
for (let i = 0; i < 10; i++) {
  const size = 0.8 + Math.random() * 1.6;
  const crate = new Mesh(new BoxGeometry(size, size, size), stone);
  crate.position.set((Math.random() - 0.5) * 22, size / 2, (Math.random() - 0.5) * 22);
  crate.rotation.y = Math.random() * Math.PI;
  game.world.scene.add(crate);
}

// Something alive to look at.
const walker = game.world.spawn('walker');
const mesh = new Mesh(new ConeGeometry(0.5, 1.4, 4),
  new MeshStandardMaterial({ color: 0x34d399 }));
mesh.rotation.x = Math.PI / 2;
mesh.position.y = 0.7;
walker.add(mesh);
const agent = walker.addComponent(new MotionAgent({ maxSpeed: 4, planar: true }));
agent.addBehavior(new Wander());
agent.addBehavior(new Containment(new Box3(
  new Vector3(-14, 0, -14), new Vector3(14, 2, 14)), 3), 2);

const rig = new OrbitRig(game.camera, walker, game.input, {
  distance: 18, minDistance: 5, maxDistance: 35, pitch: 0.7,
});
game.onUpdate((t) => rig.update(t.delta));

game.start();`,
  },

  {
    id: 'tweens',
    title: 'Tweens & easing',
    group: 'Gameplay',
    code: `// One cube per easing function, bouncing forever. Tweens animate any
// numeric properties — positions, scales, opacity, camera FOV...
import { Game, Tweens, easing } from 'gama';
import { Mesh, MeshStandardMaterial, BoxGeometry } from 'three';
${scene(0, 10, 24, 3)}

const tweens = new Tweens();
game.onUpdate((t) => tweens.update(t.delta));

const curves = [
  ['linear', easing.linear], ['quadInOut', easing.quadInOut],
  ['cubicOut', easing.cubicOut], ['sineInOut', easing.sineInOut],
  ['backOut', easing.backOut], ['elasticOut', easing.elasticOut],
  ['bounceOut', easing.bounceOut],
];

curves.forEach(([name, fn], i) => {
  const cube = new Mesh(new BoxGeometry(1.4, 1.4, 1.4),
    new MeshStandardMaterial({ color: 0x60a5fa }));
  cube.position.set((i - (curves.length - 1) / 2) * 3, 0.7, 0);
  game.world.scene.add(cube);
  const up = () => tweens.to(cube.position, { y: 6 },
    { duration: 1.2, easing: fn, onComplete: down });
  const down = () => tweens.to(cube.position, { y: 0.7 },
    { duration: 1.2, easing: fn, delay: 0.2, onComplete: () => setTimeout(up, 200) });
  setTimeout(up, i * 150);
});

game.start();`,
  },
];

export function findExample(id: string): Example {
  return EXAMPLES.find((e) => e.id === id) ?? EXAMPLES[0];
}
