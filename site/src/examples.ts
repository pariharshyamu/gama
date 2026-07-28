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
import { Game, MotionAgent, Seek, Arrive } from 'gama3d';
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
import { Game, MotionAgent, Wander, Containment } from 'gama3d';
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
import { Game, MotionAgent, Pursue, Evade, Wander, Containment } from 'gama3d';
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
         Containment, SpatialGrid, DebugOverlay } from 'gama3d';
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
import { Game, MotionAgent, Seek, Separation, ObstacleAvoidance } from 'gama3d';
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
import { Game, MotionAgent, FollowPath, Path, Separation } from 'gama3d';
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
import { Game, MotionAgent, NavMesh, NavMeshAgent, Separation } from 'gama3d';
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
import { Game, MotionAgent, NavMeshAgent, generateNavMesh, Separation } from 'gama3d';
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
         condition, action } from 'gama3d';
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
    id: 'third-person',
    title: 'Third-person template',
    group: 'Templates',
    code: `// A playable third-person character in ONE call: shoulder camera with
// mouse look, camera-relative WASD, jumping, and a capsule-person
// placeholder (pass model: gltf to swap it and auto-wire animations).
// Click the preview to lock the pointer; Esc releases it.
import { Game } from 'gama3d';
import { createThirdPersonCharacter, createCapsulePerson } from 'gama3d/templates';
import { Mesh, MeshStandardMaterial, BoxGeometry } from 'three';
${SCENE}

// Some scenery to walk around (and for the camera to avoid clipping).
const crates = [];
const stone = new MeshStandardMaterial({ color: 0x64748b });
for (let i = 0; i < 9; i++) {
  const size = 1 + (i % 3);
  const crate = new Mesh(new BoxGeometry(size, size, size), stone);
  crate.position.set((Math.random() - 0.5) * 26, size / 2, (Math.random() - 0.5) * 26);
  game.world.scene.add(crate);
  crates.push(crate);
}

const hero = createThirdPersonCharacter(game, {
  speed: 7,
  cameraDistance: 4.5,
  cameraColliders: crates,   // camera pulls in front of crates
});

// Every part is yours to retune:
hero.movement.jumpSpeed = 9;
hero.rig.distance = 3.5;

// A friend, so the world isn't lonely.
const friend = createCapsulePerson(0xfbbf24);
friend.position.set(4, 0, -4);
friend.rotation.y = Math.PI;
game.world.scene.add(friend);

game.start();`,
  },

  {
    id: 'npcs',
    title: 'NPC archetypes',
    group: 'Templates',
    code: `// Guards, a companion, and a flock — each one call. Drive the blue
// hero with WASD (click the preview first): guards chase you inside
// their radius, your companion follows, the flock keeps to the sky.
import { Game } from 'gama3d';
import { createTopDownCharacter, createGuard, createCompanion,
         createFlock } from 'gama3d/templates';
import { Box3, Vector3 } from 'three';
${scene(0, 26, 24)}

const hero = createTopDownCharacter(game, { speed: 9, color: 0x60a5fa });

for (let i = 0; i < 2; i++) {
  const guard = createGuard(game, {
    route: [new Vector3(-10, 0, -10 + i * 6), new Vector3(10, 0, -10 + i * 6)],
    target: hero.object,
    detectRadius: 7,
    color: 0xf87171,
  });
  guard.object.events.on('guard-spotted', () => (document.title = 'spotted!'));
  guard.object.events.on('guard-lost', () => (document.title = 'safe'));
}

createCompanion(game, { owner: hero.object, followDistance: 3, color: 0x34d399 });
createFlock(game, {
  count: 60,
  color: 0xc084fc,
  bounds: new Box3(new Vector3(-12, 2, -12), new Vector3(12, 8, 12)),
});

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
         CollisionSystem, Tweens, easing } from 'gama3d';
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
import { Game, OrbitRig, MotionAgent, Wander, Containment } from 'gama3d';
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
import { Game, Tweens, easing } from 'gama3d';
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

  {
    id: 'audio',
    title: 'Procedural audio',
    group: 'Audio',
    code: `// EVERY SOUND HERE IS SYNTHESIZED FROM A SEED — no audio files.
// A walker paces four floors and each speaks with its own footstep
// voice; an unseen engine revs; wind gusts; a coin blips on a timer.
// The wall at the back is a live spectrum analyser on the master mix:
// what you hear is what you see. CLICK ONCE to enable sound (browser
// autoplay rule) — after that, every click is a bat-crack.
import { Game, Soundboard } from 'gama3d';
import { Mesh, MeshStandardMaterial, BoxGeometry, ConeGeometry,
         TorusGeometry } from 'three';
${scene(0, 9, 16, 2)}

const sounds = new Soundboard({ seed: 7 });
sounds.unlock();

const caption = document.createElement('div');
caption.style.cssText =
  'position:fixed;left:12px;bottom:12px;color:#e2e8f0;font:13px ui-monospace,monospace;opacity:.85';
document.body.appendChild(caption);
sounds.onCaption((c) => { caption.textContent = '♪ ' + c.text; });

// Four floors, four voices.
const STRIPS = [
  ['grass', 0x3f7a3f], ['wood', 0x8a6238], ['stone', 0x8b8f96], ['metal', 0x5c6b82],
];
STRIPS.forEach(([, color], i) => {
  const strip = new Mesh(new BoxGeometry(3.5, 0.16, 5), new MeshStandardMaterial({ color }));
  strip.position.set((i - 1.5) * 3.5, 0.08, 0);
  game.world.scene.add(strip);
});

const walker = new Mesh(new ConeGeometry(0.45, 1.3, 6),
  new MeshStandardMaterial({ color: 0xfbbf24 }));
walker.position.y = 0.85;
game.world.scene.add(walker);

// The spectrum wall: 24 bars fed by an analyser on the finished mix.
const analyser = sounds.createAnalyser(64);
const bins = new Uint8Array(analyser.frequencyBinCount);
const bars = Array.from({ length: 24 }, (_, i) => {
  const bar = new Mesh(new BoxGeometry(0.5, 1, 0.5),
    new MeshStandardMaterial({ color: 0x60a5fa }));
  bar.position.set((i - 11.5) * 0.62, 0.5, -6);
  game.world.scene.add(bar);
  return bar;
});

const coin = new Mesh(new TorusGeometry(0.4, 0.14, 10, 24),
  new MeshStandardMaterial({ color: 0xfcd34d }));
coin.position.set(5.4, 2.2, -2);
game.world.scene.add(coin);

const engine = sounds.createEngine({ volume: 0.5 });
const wind = sounds.createWind();
addEventListener('pointerdown', () => sounds.crack(0.9));

let elapsed = 0, walked = 0, nextCoin = 2, dir = 1;
game.onUpdate((t) => {
  elapsed += t.delta;
  // A footstep every 0.8 m, voiced by whichever floor is underfoot and
  // positioned where it lands — walk the row and hear it pan.
  const step = 2.6 * t.delta;
  walker.position.x += dir * step;
  if (Math.abs(walker.position.x) > 6.6) dir = -dir;
  walker.rotation.z = dir > 0 ? -0.12 : 0.12;
  walked += step;
  if (walked > 0.8) {
    walked = 0;
    const idx = Math.max(0, Math.min(3, Math.floor((walker.position.x + 7) / 3.5)));
    sounds.footstep(STRIPS[idx][0], { at: walker.position });
    walker.position.y = 1.05; // a hop on the beat
  }
  walker.position.y += (0.85 - walker.position.y) * 0.2;

  engine.set(1600 + 2400 * (0.5 + 0.5 * Math.sin(elapsed * 0.6)), 0.7);
  wind.set(0.45 + 0.35 * Math.sin(elapsed * 0.13));

  coin.rotation.y = elapsed * 3;
  if (elapsed > nextCoin) {
    nextCoin += 2.4;
    sounds.coin({ at: coin.position });
    coin.scale.setScalar(1.6);
  }
  coin.scale.multiplyScalar(0.94).clampScalar(1, 2);

  analyser.getByteFrequencyData(bins);
  bars.forEach((bar, i) => {
    const v = (bins[Math.floor(i * bins.length / bars.length)] ?? 0) / 255;
    const h = 0.15 + v * 5.5;
    bar.scale.y += (h - bar.scale.y) * 0.35;
    bar.position.y = bar.scale.y / 2;
  });
  sounds.updateListener(game.camera.position, { x: 0, y: -0.5, z: -0.87 });
});

// Headless verification: render the same sounds into an OfflineAudioContext
// and report energy — silence fails the sweep the way a blank frame does.
let offline = { offlineRms: 0, offlinePeak: 0 };
(async () => {
  const off = new OfflineAudioContext(1, 44100, 44100);
  const sb = new Soundboard({ context: off, seed: 5 });
  sb.footstep('stone'); sb.coin(); sb.crack(0.9);
  sb.createEngine().set(3200, 0.8);
  sb.createWind().set(0.8);
  const data = (await off.startRendering()).getChannelData(0);
  let peak = 0, sum = 0;
  for (let i = 0; i < data.length; i++) {
    const v = Math.abs(data[i]);
    peak = v > peak ? v : peak;
    sum += v * v;
  }
  offline = { offlineRms: Math.sqrt(sum / data.length), offlinePeak: peak };
})();
window.audioDebug = () => ({
  ...offline,
  contextState: sounds.context.state,
  captions: sounds.captions().length,
  lastCaption: sounds.captions().length
    ? sounds.captions()[sounds.captions().length - 1].text
    : '',
});

game.start();`,
  },
  {
    id: 'juice',
    title: 'Game feel + HUD',
    group: 'Feel',
    code: `// JUICE: the few milliseconds that make a hit feel like a hit, and
// the words drawn over the world. GameFeel runs shake (trauma-based:
// impacts add trauma, the camera shakes by trauma SQUARED, so small
// knocks barely register and big ones fill the screen), hit-stop, and
// slow motion — feed it the real dt, advance the game with what comes
// back. Hud is the overlay: score, hearts, banner, prompt, radar, and a
// caption line fed straight from the Soundboard.
//
// CLICK for the big one: crack + full shake + hit-stop + rumble.
import { Game, GameFeel, Hud, Soundboard, MotionAgent, Wander,
         Containment } from 'gama3d';
import { Mesh, MeshStandardMaterial, SphereGeometry, ConeGeometry,
         Box3, Vector3 } from 'three';
${scene(0, 10, 15, 1)}

const feel = new GameFeel({ seed: 4 });
const hud = new Hud();
const sounds = new Soundboard({ seed: 7 });
sounds.unlock();
sounds.onCaption((c) => hud.caption('♪ ' + c.text));
hud.objective('Watch the ball. Click for the big one.');
hud.hearts(3, 5);

const ball = new Mesh(new SphereGeometry(0.7, 24, 16),
  new MeshStandardMaterial({ color: 0xf59e0b }));
game.world.scene.add(ball);
let y = 7, vy = 0, score = 0, bounces = 0, elapsed = 0;

// Wanderers for the radar to see.
const bounds = new Box3(new Vector3(-14, 0, -14), new Vector3(14, 4, 14));
const wanderers = Array.from({ length: 6 }, () => {
  const walker = game.world.spawn('wanderer');
  const mesh = new Mesh(new ConeGeometry(0.4, 1.1, 5),
    new MeshStandardMaterial({ color: 0x34d399 }));
  mesh.rotation.x = Math.PI / 2;
  walker.add(mesh);
  walker.position.set(Math.random() * 16 - 8, 0.55, Math.random() * 16 - 8);
  const agent = walker.addComponent(new MotionAgent({ maxSpeed: 4, planar: true }));
  agent.addBehavior(new Wander());
  agent.addBehavior(new Containment(bounds));
  return walker;
});
const radar = hud.radar({ range: 18, colors: { walker: '#34d399' } });

addEventListener('pointerdown', () => {
  sounds.crack(1);
  feel.shake(1);
  feel.hitStop(0.1);
  feel.rumble(1, 140);
  hud.banner('THE BIG ONE', 1.4);
});

game.onUpdate((t) => {
  elapsed += t.delta;
  // THE CONTRACT: real dt in, gameplay dt out. Hit-stop freezes the
  // ball mid-air; slow-mo floats it; the wanderers run on real time so
  // the difference is visible side by side.
  const dt = feel.update(t.delta);
  vy -= 18 * dt;
  y += vy * dt;
  if (y < 0.7 && vy < 0) {
    y = 0.7;
    vy = 12;
    bounces++;
    score += 10;
    feel.shake(0.35);
    sounds.impact('soft', 0.7, { at: ball.position });
    if (bounces % 5 === 0) {
      hud.banner('x' + bounces + ' BOUNCES');
      sounds.success();
      feel.slowMo(0.3, 0.9, 0.5);
    }
  }
  ball.position.set(0, y, 0);
  ball.scale.y = y < 0.9 ? 0.8 : 1;

  hud.score(score);
  hud.timer(elapsed);
  hud.prompt(feel.timeScale === 1 ? 'Click: the big one' : null);
  radar.set(
    wanderers.map((w) => ({ x: w.position.x, z: w.position.z, kind: 'walker' })),
    { x: 0, z: 0 }
  );
  hud.update(dt);
  feel.apply(game.camera);
});

window.juiceDebug = () => ({
  trauma: feel.trauma,
  timeScale: feel.timeScale,
  score,
  bounces,
  hudMounted: !!hud.root.parentNode,
});

game.start();`,
  },
  {
    id: 'loot',
    title: 'Collector + CheckpointRun',
    group: 'Gameplay',
    code: `// THE PICKUP LOOP, END TO END. Collector sweeps the runner against
// every coin (each coin is anything shaped {trigger, collect, respawn}
// — SCENA's pickups drop straight in); CheckpointRun enforces ORDER on
// the three gates: only the next one counts, however hard you drive
// through the others. Score, sound, banner and slow-mo all hang off the
// two event streams.
import { Game, Collector, CheckpointRun, Hud, Soundboard,
         GameFeel } from 'gama3d';
import { Mesh, MeshStandardMaterial, CylinderGeometry, TorusGeometry,
         ConeGeometry, Vector3 } from 'three';
${scene(0, 14, 17, 1)}

const hud = new Hud();
const sounds = new Soundboard({ seed: 5 });
sounds.unlock();
const feel = new GameFeel({ seed: 2 });
sounds.onCaption((c) => hud.caption('♪ ' + c.text));

// The course: three gates on a triangle, coins strewn along its edges.
const GATES = [0, 1, 2].map((i) => {
  const a = (i / 3) * Math.PI * 2;
  return new Vector3(Math.cos(a) * 9, 0, Math.sin(a) * 9);
});
const gateMeshes = GATES.map((p) => {
  const ring = new Mesh(new TorusGeometry(1.6, 0.12, 10, 32),
    new MeshStandardMaterial({ color: 0x64748b }));
  ring.position.set(p.x, 1.6, p.z);
  ring.lookAt(0, 1.6, 0);
  game.world.scene.add(ring);
  return ring;
});

// A coin is ANYTHING shaped {trigger, collect, respawn} — this one is
// eighteen lines; a SCENA createPickup('coin') is a drop-in replacement.
const gold = new MeshStandardMaterial({ color: 0xd9a53c, metalness: 0.55,
  roughness: 0.35, emissive: 0x402c06 });
function makeCoin(x, z, phase) {
  const mesh = new Mesh(new CylinderGeometry(0.3, 0.3, 0.07, 14), gold);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(x, 0.85, z);
  game.world.scene.add(mesh);
  let taken = false;
  return {
    mesh, phase,
    trigger: { center: mesh.position, radius: 0.55 },
    collect: () => (taken ? 0 : ((taken = true), (mesh.visible = false), 0.3)),
    respawn: () => ((taken = false), (mesh.visible = true), 0.3),
  };
}
const coins = [];
for (let g = 0; g < 3; g++) {
  const from = GATES[g], to = GATES[(g + 1) % 3];
  for (let k = 1; k <= 4; k++) {
    const t = k / 5;
    coins.push(makeCoin(from.x + (to.x - from.x) * t,
                        from.z + (to.z - from.z) * t, g * 4 + k));
  }
}

// The two event streams the whole game hangs off.
let score = 0;
const collector = new Collector({
  respawnAfter: 6,
  onCollect: ({ at }) => {
    score += 10;
    hud.score(score);
    sounds.coin({ at });
  },
});
for (const coin of coins) collector.add(coin);

const LAPS = 3;
hud.lap(1, LAPS);
hud.objective('3 laps, gates in order');
const run = new CheckpointRun(
  GATES.map((p, i) => ({
    trigger: { center: p, radius: 1.6 },
    setState: (s) => {
      gateMeshes[i].material = gateMeshes[i].material.clone();
      gateMeshes[i].material.color.setHex(
        s === 'active' ? 0x53c7f0 : s === 'passed' ? 0x4caf6e : 0x64748b);
      gateMeshes[i].material.emissive.setHex(s === 'active' ? 0x0c3946 : 0x000000);
    },
  })),
  {
    laps: LAPS,
    onAdvance: () => sounds.blip(),
    onLap: (lap) => {
      if (lap < LAPS) {
        hud.banner('LAP ' + (lap + 1) + '/' + LAPS);
        hud.lap(lap + 1, LAPS);
        sounds.success();
      }
    },
    onFinish: () => {
      hud.banner('FINISH!', 3);
      sounds.success();
      feel.slowMo(0.35, 1.6);
      feel.shake(0.5);
      setTimeout(() => { run.reset(); hud.lap(1, LAPS); }, 4000);
    },
  }
);

// The runner drives the triangle forever.
const runner = new Mesh(new ConeGeometry(0.5, 1.4, 5),
  new MeshStandardMaterial({ color: 0xf59e0b }));
runner.rotation.x = Math.PI / 2;
game.world.scene.add(runner);

const radar = hud.radar({ range: 14, colors: { coin: '#fbbf24', gate: '#53c7f0' } });

let elapsed = 0, timer = 0;
game.onUpdate((t) => {
  const dt = feel.update(t.delta);
  elapsed += dt;
  timer += dt;
  // Around the triangle: which edge, how far along it.
  const u = (elapsed * 0.12) % 1;
  const edge = Math.floor(u * 3);
  const along = u * 3 - edge;
  const from = GATES[edge], to = GATES[(edge + 1) % 3];
  runner.position.set(from.x + (to.x - from.x) * along, 0.7,
                      from.z + (to.z - from.z) * along);
  runner.lookAt(to.x, 0.7, to.z);

  collector.sweep(runner.position);
  collector.update(dt);
  run.test(runner.position);

  for (const coin of coins) {
    coin.mesh.rotation.z = elapsed * 1.6 + coin.phase;
    coin.mesh.position.y = 0.85 + Math.sin(elapsed * 2 + coin.phase) * 0.07;
  }

  hud.timer(timer);
  radar.set(
    [
      ...coins.filter((c) => c.mesh.visible)
        .map((c) => ({ x: c.mesh.position.x, z: c.mesh.position.z, kind: 'coin' })),
      ...GATES.map((p) => ({ x: p.x, z: p.z, kind: 'gate' })),
    ],
    runner.position
  );
  hud.update(dt);
  feel.apply(game.camera);
});

window.lootDebug = () => ({
  score,
  collected: collector.collected,
  lap: run.lap,
  nextGate: run.index,
  progress: run.progress,
  finished: run.finished,
});

game.start();`,
  },
  {
    id: 'arena',
    title: 'Health + Projectiles',
    group: 'Gameplay',
    code: `// STAKES, wholesome register: bonk and knockout, not gore. The turret
// lobs shells at the amber runner (Health 5 — watch the hearts); the
// runner fires back at the green wanderers (Health 2 each). Everything
// you feel hangs off two event streams: onDamage (shake, sound, hearts,
// knockback, i-frame blink) and onDeath (tip over, banner, respawn).
import { Game, Health, Projectiles, Hud, Soundboard, GameFeel,
         MotionAgent, Wander, Containment } from 'gama3d';
import { Mesh, MeshStandardMaterial, ConeGeometry, CylinderGeometry,
         Box3, Vector3 } from 'three';
${scene(0, 13, 16, 1)}

const hud = new Hud();
const sounds = new Soundboard({ seed: 9 });
sounds.unlock();
const feel = new GameFeel({ seed: 3 });
sounds.onCaption((c) => hud.caption('♪ ' + c.text));
hud.objective('Survive the turret; thin the wanderers');

// THE RUNNER (the "player"): laps the arena, gets shot at, shoots back.
const runner = new Mesh(new ConeGeometry(0.5, 1.4, 5),
  new MeshStandardMaterial({ color: 0xf59e0b }));
runner.rotation.x = Math.PI / 2;
game.world.scene.add(runner);
let knock = new Vector3();
let koUntil = 0;
let koCount = 0;

const playerHealth = new Health({
  max: 5,
  invulnerable: 1,
  onDamage: (e) => {
    hud.hearts(playerHealth.current, 5);
    feel.shake(0.35 + e.amount * 0.15);
    feel.rumble(0.6, 90);
    sounds.impact('soft', 0.8, { at: runner.position });
    if (e.knockback) knock.set(e.knockback.x, 0, e.knockback.z);
  },
  onDeath: () => {
    koCount++;
    hud.banner('KNOCKED OUT', 1.8);
    sounds.fail();
    feel.hitStop(0.12);
    feel.slowMo(0.4, 1.2);
    koUntil = elapsed + 2.2;
  },
  onRevive: () => {
    hud.banner('BACK UP!', 1.2);
    hud.hearts(5, 5);
    sounds.success();
  },
});
hud.hearts(5, 5);

// THE TURRET: leads the runner and lobs on a gravity arc.
const turret = new Mesh(new CylinderGeometry(0.5, 0.7, 1.4, 8),
  new MeshStandardMaterial({ color: 0x64748b }));
turret.position.y = 0.7;
game.world.scene.add(turret);

// THE WANDERERS: three foes with two hearts each.
const bounds = new Box3(new Vector3(-13, 0, -13), new Vector3(13, 3, 13));
const foes = Array.from({ length: 3 }, (_, i) => {
  const walker = game.world.spawn('foe');
  const mesh = new Mesh(new ConeGeometry(0.45, 1.2, 5),
    new MeshStandardMaterial({ color: 0x34d399 }));
  mesh.rotation.x = Math.PI / 2;
  walker.add(mesh);
  walker.position.set(-6 + i * 6, 0.6, -6);
  const agent = walker.addComponent(new MotionAgent({ maxSpeed: 3.5, planar: true }));
  agent.addBehavior(new Wander());
  agent.addBehavior(new Containment(bounds, 3), 2);
  const foe = { walker, mesh, agent, respawnAt: Infinity, health: null };
  foe.health = new Health({
    max: 2,
    invulnerable: 0.5,
    onDamage: (e) => {
      sounds.impact('soft', 0.5, { at: walker.position });
      if (e.knockback) agent.velocity.add(new Vector3(
        e.knockback.x, 0, e.knockback.z));
      mesh.rotation.z = 0.5; // the flinch — eased back below
    },
    onDeath: () => {
      mesh.rotation.z = Math.PI / 2; // tipped over is knocked out
      foe.respawnAt = elapsed + 3;
    },
  });
  return foe;
});

// TWO STREAMS OF SHOTS, one pool, teams keep them honest.
const targets = new Map();
const shots = new Projectiles({
  gravity: 9.8,
  floor: 0,
  onHit: ({ target, at }) => {
    const victim = targets.get(target);
    victim.health.damage({ from: at, knockback: 5 }, target.center);
  },
});
game.world.scene.add(shots.mesh);
const playerTarget = { center: runner.position, radius: 0.7, team: 'player' };
targets.set(playerTarget, { health: playerHealth });
shots.addTarget(playerTarget);
for (const foe of foes) {
  const target = { center: foe.walker.position, radius: 0.65, team: 'foes' };
  targets.set(target, { health: foe.health });
  shots.addTarget(target);
}

const radar = hud.radar({ range: 15, colors: { foe: '#34d399', turret: '#94a3b8' } });

let elapsed = 0, nextShell = 1.5, nextBolt = 1;
game.onUpdate((t) => {
  const dt = feel.update(t.delta);
  elapsed += dt;
  playerHealth.update(dt);
  for (const foe of foes) foe.health.update(dt);

  // The runner laps — or lies where it fell. Knockback decays off.
  const down = !playerHealth.alive;
  if (down && elapsed > koUntil) playerHealth.revive();
  const a = elapsed * 0.55;
  if (!down) {
    runner.position.set(Math.cos(a) * 8 + knock.x, 0.7, Math.sin(a) * 8 + knock.z);
    runner.rotation.set(Math.PI / 2, 0, 0);
    runner.rotation.y = -a;
  } else {
    runner.rotation.z = Math.PI / 2;
  }
  knock.multiplyScalar(Math.pow(0.15, dt));
  // The i-frame blink: invulnerable = flickering, the oldest signal in games.
  runner.visible = playerHealth.invulnerableFor <= 0 ||
    Math.floor(elapsed * 12) % 2 === 0;

  // Turret lobs at where the runner WILL be.
  if (elapsed > nextShell && !down) {
    nextShell = elapsed + 1.4;
    const lead = 0.9;
    const ahead = a + 0.55 * lead;
    const aim = new Vector3(Math.cos(ahead) * 8, 0.7, Math.sin(ahead) * 8);
    const flight = 0.9;
    shots.fire(new Vector3(0, 1.6, 0), new Vector3(
      (aim.x - 0) / flight,
      (aim.y - 1.6) / flight + 9.8 * flight * 0.5,
      (aim.z - 0) / flight
    ), { team: 'turret' });
    sounds.whoosh(0.6);
  }

  // The runner bolts at the nearest standing foe.
  if (elapsed > nextBolt && !down) {
    nextBolt = elapsed + 0.9;
    const standing = foes.filter((f) => f.health.alive);
    if (standing.length) {
      let nearest = standing[0];
      for (const foe of standing) {
        if (foe.walker.position.distanceTo(runner.position) <
            nearest.walker.position.distanceTo(runner.position)) nearest = foe;
      }
      const dir = nearest.walker.position.clone().sub(runner.position).setY(0);
      const d = Math.max(dir.length(), 0.01);
      shots.fire(runner.position.clone().setY(0.9),
        dir.multiplyScalar(14 / d).setY(1.2), { team: 'player', life: 2 });
      sounds.blip();
    }
  }

  // Foes ease out of their flinch; the fallen get back up.
  for (const foe of foes) {
    if (foe.health.alive) {
      foe.mesh.rotation.z *= Math.pow(0.05, dt);
    } else if (elapsed > foe.respawnAt) {
      foe.health.revive();
      foe.mesh.rotation.z = 0;
      foe.walker.position.set((Math.random() - 0.5) * 20, 0.6,
                              (Math.random() - 0.5) * 20);
    }
  }

  shots.update(dt);
  hud.timer(elapsed);
  radar.set(
    [
      ...foes.filter((f) => f.health.alive)
        .map((f) => ({ x: f.walker.position.x, z: f.walker.position.z, kind: 'foe' })),
      { x: 0, z: 0, kind: 'turret' },
    ],
    runner.position
  );
  hud.update(dt);
  feel.apply(game.camera);
});

window.arenaDebug = () => ({
  playerHp: playerHealth.current,
  playerAlive: playerHealth.alive,
  foesAlive: foes.filter((f) => f.health.alive).length,
  shotsActive: shots.active,
  koCount,
});

game.start();`,
  },
];




export function findExample(id: string): Example {
  return EXAMPLES.find((e) => e.id === id) ?? EXAMPLES[0];
}
