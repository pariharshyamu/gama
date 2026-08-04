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
  {
    id: 'waves',
    title: 'WaveDirector + Harass',
    group: 'Gameplay',
    code: `// THE OPPOSITION, PACED. The director decides when, how many, and how
// hard — then asks the game to spawn each body and waits to hear about
// deaths. Chasers SEEK; harassers keep their ring and strafe (watch the
// green ones circle). The quiet feature is RUBBER-BANDING: clear a wave
// fast and unhurt and the next leans harder; bleed and it eases off.
// The pressure readout is the objective line, top right.
import { Game, WaveDirector, Harass, Health, Projectiles, Hud,
         Soundboard, GameFeel, MotionAgent, Seek } from 'gama3d';
import { Mesh, MeshStandardMaterial, ConeGeometry, SphereGeometry,
         Vector3 } from 'three';
${scene(0, 15, 18, 1)}

const hud = new Hud();
const sounds = new Soundboard({ seed: 6 });
sounds.unlock();
const feel = new GameFeel({ seed: 2 });
sounds.onCaption((c) => hud.caption('♪ ' + c.text));

// The hero circles; enemies come to it.
const hero = new Mesh(new SphereGeometry(0.5, 20, 14),
  new MeshStandardMaterial({ color: 0xf59e0b }));
game.world.scene.add(hero);
const heroHealth = new Health({
  max: 8,
  invulnerable: 0.6,
  onDamage: (e) => {
    hud.hearts(heroHealth.current, 8);
    feel.shake(0.3);
    sounds.impact('soft', 0.6);
    director.playerHurt(e.amount);   // the band hears about the bleeding
  },
  onDeath: () => {
    hud.banner('DOWN!', 1.6);
    sounds.fail();
    setTimeout(() => { heroHealth.revive(); hud.hearts(8, 8); }, 1800);
  },
});
hud.hearts(8, 8);

// One pool of enemy bodies, reused wave after wave.
const foeMat = { chaser: new MeshStandardMaterial({ color: 0xf87171 }),
                 harasser: new MeshStandardMaterial({ color: 0x34d399 }) };
const pool = [];
let seedCounter = 1;
function spawnEnemy(kind) {
  let foe = pool.find((f) => !f.active);
  if (!foe) {
    const walker = game.world.spawn('foe');
    const mesh = new Mesh(new ConeGeometry(0.45, 1.2, 5), foeMat.chaser);
    mesh.rotation.x = Math.PI / 2;
    walker.add(mesh);
    const agent = walker.addComponent(new MotionAgent({ maxSpeed: 4, planar: true }));
    foe = { walker, mesh, agent, active: false, health: null, target: null };
    pool.push(foe);
  }
  const a = Math.random() * Math.PI * 2;
  foe.walker.position.set(Math.cos(a) * 14, 0.6, Math.sin(a) * 14);
  foe.walker.visible = true;
  foe.active = true;
  foe.mesh.material = foeMat[kind];
  foe.agent.clearBehaviors();
  if (kind === 'chaser') {
    foe.agent.addBehavior(new Seek(hero.position));
    foe.agent.maxSpeed = 4.2;
  } else {
    foe.agent.addBehavior(new Harass(hero.position, { ring: 6.5, seed: seedCounter++ }));
    foe.agent.maxSpeed = 5;
  }
  foe.health = new Health({
    max: 2,
    invulnerable: 0.3,
    onDeath: () => {
      foe.active = false;
      foe.walker.visible = false;
      director.enemyDown();          // the director keeps the count
      sounds.pop();
    },
  });
  foe.target = { center: foe.walker.position, radius: 0.6, team: 'foes' };
  shots.addTarget(foe.target);
}

const director = new WaveDirector({
  kinds: ['chaser', 'harasser'],
  baseCount: 3,
  growth: 1.5,
  maxCount: 10,
  rest: 3.5,
  stagger: 0.7,
  seed: 8,
  spawn: spawnEnemy,
  onWave: (wave, count) => {
    hud.banner('WAVE ' + wave, 1.6);
    hud.lap(wave, 99, 'WAVE');
    sounds.success();
  },
  onCleared: () => sounds.chime(2),
});

const shots = new Projectiles({
  onHit: ({ target, at }) => {
    const foe = pool.find((f) => f.target === target && f.active);
    if (foe) foe.health.damage({ from: at, knockback: 4 }, target.center);
    if (foe && foe.health.alive === false) feel.shake(0.15);
  },
});
game.world.scene.add(shots.mesh);
const heroChest = new Vector3();

const radar = hud.radar({ range: 16,
  colors: { chaser: '#f87171', harasser: '#34d399' } });

let elapsed = 0, nextBolt = 0.8;
game.onUpdate((t) => {
  const dt = feel.update(t.delta);
  elapsed += dt;
  heroHealth.update(dt);
  director.update(dt);

  const a = elapsed * 0.4;
  hero.position.set(Math.cos(a) * 4, 0.55, Math.sin(a) * 4);
  heroChest.copy(hero.position);

  // The hero bolts at the nearest live enemy.
  if (elapsed > nextBolt && heroHealth.alive) {
    nextBolt = elapsed + 0.55;
    const live = pool.filter((f) => f.active);
    if (live.length) {
      let nearest = live[0];
      for (const foe of live) {
        if (foe.walker.position.distanceTo(hero.position) <
            nearest.walker.position.distanceTo(hero.position)) nearest = foe;
      }
      // LEAD THE TARGET: a harasser strafes fast enough that a bolt
      // aimed at where it IS misses by a body-width — the first probe of
      // this example watched one kite the hero indefinitely. Aim at
      // where it WILL be when the bolt arrives.
      const d0 = nearest.walker.position.distanceTo(hero.position);
      const lead = nearest.agent.velocity.clone().multiplyScalar(d0 / 13);
      const aim = nearest.walker.position.clone().add(lead);
      const dir = aim.sub(hero.position).setY(0);
      const d = Math.max(dir.length(), 0.01);
      shots.fire(hero.position.clone().setY(0.7),
        dir.multiplyScalar(13 / d).setY(0.2), { team: 'player', life: 2.5 });
    }
  }

  // Chasers that reach the hero cost a heart (melee, crudely).
  for (const foe of pool) {
    if (!foe.active) continue;
    foe.health.update(dt);
    if (foe.walker.position.distanceTo(hero.position) < 1.1) {
      heroHealth.damage({ from: foe.walker.position, knockback: 2 }, hero.position);
    }
  }

  shots.update(dt);
  hud.timer(elapsed);
  hud.objective('pressure ' + director.pressure.toFixed(2) +
    (director.isResting ? ' · resting' : ' · wave ' + director.wave));
  radar.set(
    pool.filter((f) => f.active).map((f) => ({
      x: f.walker.position.x, z: f.walker.position.z,
      kind: f.mesh.material === foeMat.chaser ? 'chaser' : 'harasser',
    })),
    hero.position
  );
  hud.update(dt);
  feel.apply(game.camera);
});
director.start();

window.wavesDebug = () => ({
  wave: director.wave,
  alive: director.alive,
  pressure: Number(director.pressure.toFixed(3)),
  resting: director.isResting,
  heroHp: heroHealth.current,
  poolSize: pool.length,
});

game.start();`,
  },
  {
    id: 'trial',
    title: 'Time trial: flow, ghost & the save',
    group: 'Gameplay',
    code: `// THE RETENTION LOOP: beat yesterday's you. GameFlow runs the shell
// (attract mode starts it; click restarts from results). Every lap is
// RECORDED at 20 Hz; finish faster than your best and the tape becomes
// the new ghost — the translucent kart you race from then on. Best time
// and tape persist in a SaveSlot: reload the page and the ghost is
// still there, because a save here is a seed and a few kilobytes.
import { Game, GameFlow, Objectives, SaveSlot, GhostRecorder, Ghost,
         GhostTape, CheckpointRun, Hud, Soundboard,
         GameFeel } from 'gama3d';
import { Mesh, MeshStandardMaterial, ConeGeometry, TorusGeometry,
         Vector3 } from 'three';
${scene(0, 14, 17, 1)}

const hud = new Hud();
const sounds = new Soundboard({ seed: 3 });
sounds.unlock();
const feel = new GameFeel({ seed: 5 });
sounds.onCaption((c) => hud.caption('♪ ' + c.text));

// The course: three gates on a triangle.
const GATES = [0, 1, 2].map((i) => {
  const a = (i / 3) * Math.PI * 2 + 0.5;
  return new Vector3(Math.cos(a) * 9, 0, Math.sin(a) * 9);
});
const gateMeshes = GATES.map((p) => {
  const ring = new Mesh(new TorusGeometry(1.5, 0.12, 10, 32),
    new MeshStandardMaterial({ color: 0x64748b }));
  ring.position.set(p.x, 1.5, p.z);
  ring.lookAt(0, 1.5, 0);
  game.world.scene.add(ring);
  return ring;
});

const kart = new Mesh(new ConeGeometry(0.5, 1.4, 5),
  new MeshStandardMaterial({ color: 0xf59e0b }));
kart.rotation.x = Math.PI / 2;
game.world.scene.add(kart);

// The ghost: the same shape, barely there.
const ghostMesh = new Mesh(new ConeGeometry(0.5, 1.4, 5),
  new MeshStandardMaterial({ color: 0x8fd0ff, transparent: true,
    opacity: 0.35, depthWrite: false }));
ghostMesh.rotation.x = Math.PI / 2;
ghostMesh.visible = false;
game.world.scene.add(ghostMesh);

const slot = new SaveSlot('trial-best', { version: 1 });
let best = slot.load(); // { time, tape } | null
let ghost = best ? new Ghost(GhostTape.fromJSON(best.tape)) : null;
const recorder = new GhostRecorder({ sampleEvery: 0.05 });

const LAPS = 3;
let lapClock = 0, lapsDone = 0, elapsed = 0;
const goals = new Objectives(
  [{ id: 'laps', label: 'Finish laps', target: LAPS }],
  { onProgress: () => hud.objective(goals.summary() +
      (best ? '\\nbest ' + best.time.toFixed(1) + 's' : '')) }
);

const run = new CheckpointRun(
  GATES.map((p, i) => ({
    trigger: { center: p, radius: 1.5 },
    setState: (s) => gateMeshes[i].material.color.setHex(
      s === 'active' ? 0x53c7f0 : s === 'passed' ? 0x4caf6e : 0x64748b),
  })),
  {
    laps: LAPS,
    onAdvance: () => sounds.blip(),
    onLap: (lap) => {
      // The lap is the unit of retention: better than best = new ghost.
      const tape = recorder.finish();
      if (!best || lapClock < best.time) {
        best = { time: lapClock, tape: tape.toJSON() };
        slot.save(best);
        ghost = new Ghost(GhostTape.fromJSON(best.tape));
        hud.banner('BEST ' + lapClock.toFixed(1) + 's', 1.6);
        sounds.success();
        feel.slowMo(0.4, 1);
      } else {
        hud.banner('LAP ' + lapClock.toFixed(1) + 's', 1.2);
      }
      lapClock = 0;
      lapsDone = lap;
      goals.advance('laps');
      hud.lap(Math.min(lap + 1, LAPS), LAPS);
      if (lap >= LAPS) flow.to('results');
    },
  }
);

const flow = new GameFlow({
  onEnter: {
    playing: () => {
      run.reset();
      recorder.reset();
      lapClock = 0;
      lapsDone = 0;
      goals.reset();
      hud.lap(1, LAPS);
      hud.banner('GO!', 1);
      hud.objective(goals.summary() +
        (best ? '\\nbest ' + best.time.toFixed(1) + 's' : ''));
    },
    results: () => {
      hud.banner('DONE — click to run again', 3);
      sounds.success();
    },
    title: () => hud.banner('TIME TRIAL', 2),
  },
});
hud.banner('TIME TRIAL', 2);
let attract = 1.5; // headless and idle pages start themselves
addEventListener('pointerdown', () => {
  if (flow.state === 'title' || flow.state === 'results') flow.to('playing');
});

game.onUpdate((t) => {
  const real = feel.update(t.delta);
  if (flow.state === 'title') {
    attract -= t.delta;
    if (attract <= 0) flow.to('playing');
  }
  if (flow.state === 'results') {
    attract -= t.delta;
    if (attract <= 0) { attract = 2; flow.to('playing'); }
  }
  const dt = flow.gate(real);
  elapsed += dt;
  lapClock += dt;

  // The kart drives its triangle; speed wobbles so laps differ.
  const u = (elapsed * (0.11 + 0.015 * Math.sin(elapsed * 0.37))) % 1;
  const edge = Math.floor(u * 3);
  const along = u * 3 - edge;
  const from = GATES[edge], to = GATES[(edge + 1) % 3];
  if (flow.playing) {
    kart.position.set(from.x + (to.x - from.x) * along, 0.7,
                      from.z + (to.z - from.z) * along);
    kart.lookAt(to.x, 0.7, to.z);
    run.test(kart.position);
    recorder.record(kart.position, kart.rotation.y, dt);
  }

  // The ghost races the CURRENT lap clock.
  if (ghost && flow.playing) {
    ghostMesh.visible = true;
    const pose = ghost.at(lapClock);
    ghostMesh.position.set(pose.position.x, pose.position.y, pose.position.z);
    ghostMesh.rotation.set(Math.PI / 2, pose.yaw, 0);
  } else {
    ghostMesh.visible = false;
  }

  hud.timer(lapClock);
  hud.update(dt);
  feel.apply(game.camera);
});

window.trialDebug = () => ({
  state: flow.state,
  lapsDone,
  lapClock: Number(lapClock.toFixed(2)),
  best: best ? Number(best.time.toFixed(2)) : null,
  ghostRacing: ghostMesh.visible,
  saved: slot.exists,
});

game.start();`,
  },
  {
    id: 'coinrun',
    title: 'Coin run: the payoff platformer',
    group: 'Gameplay',
    code: `// THE PAYOFF: every pillar in one platformer. PlatformerController
// runs the body (gravity, coyote time, jump buffering, variable height,
// moving-platform carry). GameFlow runs the shell, Objectives name the
// goal, Collector pays the coins, Health counts the falls, and Hud,
// GameFeel and Soundboard sell every beat. The runner is an attract-mode
// bot: it clears the gaps, WAITS for the purple platform, rides it
// across, and plants the flag — best time and coins persist in a
// SaveSlot, so the banner remembers you between reloads.
import { Game, GameFlow, Objectives, SaveSlot, PlatformerController,
         Collector, Health, Hud, Soundboard, GameFeel } from 'gama3d';
import { Mesh, MeshStandardMaterial, BoxGeometry, OctahedronGeometry,
         ConeGeometry } from 'three';
${scene(6, 7, 18, 2)}

const hud = new Hud();
const sounds = new Soundboard({ seed: 11 });
sounds.unlock();
const feel = new GameFeel({ seed: 4 });
sounds.onCaption((c) => hud.caption('♪ ' + c.text));

// ---- The course. Platforms are just boxes; one of them moves.
const mat = (c) => new MeshStandardMaterial({ color: c });
const slab = (x1, x2, top, thick, tint) => {
  const p = { center: { x: (x1 + x2) / 2, y: top - thick / 2, z: 0 },
              size: { x: x2 - x1, y: thick, z: 4 } };
  p.mesh = new Mesh(new BoxGeometry(p.size.x, p.size.y, p.size.z), mat(tint));
  p.mesh.position.set(p.center.x, p.center.y, 0);
  game.world.scene.add(p.mesh);
  return p;
};
const stone = 0x3b4a63;
const mover = slab(29.75, 32.25, 0, 0.5, 0x7c5cd6);
mover.velocity = { x: 0, y: 0, z: 0 };
const platforms = [
  slab(-2, 8, 0, 1, stone),        // start
  slab(10.5, 16.5, 0, 1, stone),   // across the first gap
  slab(18, 21, 1.2, 0.5, 0x53a06e), // the green floater
  slab(22.5, 28, 0, 1, stone),     // the landing
  mover,                            // the ferry
  slab(34.5, 41, 0, 1, stone),     // the finish
];

// ---- Coins: ten octahedra. The PROP owns its taken state; the
// Collector believes a collect() that returns 0.
const COINS = [[2, 0.9], [5, 0.9], [9.2, 2.8], [12, 0.9], [15, 0.9],
               [19, 2.1], [20.3, 2.1], [24, 0.9], [26.5, 0.9], [36.5, 0.9]];
const coins = COINS.map(([x, y]) => {
  const mesh = new Mesh(new OctahedronGeometry(0.32), mat(0xfbbf24));
  mesh.position.set(x, y, 0);
  game.world.scene.add(mesh);
  return { mesh, taken: false,
    trigger: { center: { x, y, z: 0 }, radius: 0.55 },
    collect() { if (this.taken) return 0;
      this.taken = true; this.mesh.visible = false; return 0.4; } };
});

const pole = new Mesh(new BoxGeometry(0.12, 2.6, 0.12), mat(0x94a3b8));
pole.position.set(39, 1.3, 0);
const flag = new Mesh(new ConeGeometry(0.45, 1.1, 4), mat(0xe4574d));
flag.rotation.z = -Math.PI / 2;
flag.position.set(39.45, 2.2, 0);
game.world.scene.add(pole, flag);

// ---- The cast: one body, three hearts, ten coins, one flag.
const hero = new Mesh(new ConeGeometry(0.42, 1.7, 6), mat(0xf59e0b));
game.world.scene.add(hero);
const body = new PlatformerController({
  onJump: () => sounds.boing({ volume: 0.5 }),
  onLand: (v) => { if (v > 7) { feel.shake(Math.min(v / 45, 0.4));
    sounds.impact('soft', Math.min(v / 18, 1)); } },
});

let score = 0, clock = 0, finished = 0;
const goals = new Objectives(
  [{ id: 'coins', label: 'Coins', target: COINS.length },
   { id: 'flag', label: 'Reach the flag' }],
  { onProgress: () => hud.objective(goals.summary()),
    onComplete: () => sounds.chime(2) }
);
const collector = new Collector({
  onCollect: ({ at }) => {
    score += 100; hud.score(score);
    sounds.coin({ at }); goals.advance('coins');
  },
});
for (const c of coins) collector.add(c);

const health = new Health({
  max: 3,
  onDamage: (e) => { hud.hearts(e.current, e.max);
    sounds.fail({ volume: 0.4 }); feel.shake(0.35); },
  onDeath: () => { hud.banner('FALLEN', 1.6); feel.hitStop(0.25); },
});

const slot = new SaveSlot('coinrun-best', { version: 1 });
let best = slot.load(); // { time, coins } | null

// ---- The bot: run right, jump at the marks, wait for the ferry.
const CHECKPOINTS = [1, 11.5, 23.5];
const JUMPS = [7.4, 16.0, 32.6];
let lastJump = 0, holdUntil = 0, checkpoint = 1;

const flow = new GameFlow({
  onEnter: {
    playing: () => {
      for (const c of coins) { c.taken = false; c.mesh.visible = true; }
      goals.reset(); health.revive();
      score = 0; clock = 0; finished = 0; lastJump = 0; checkpoint = 1;
      body.teleport(1, 0.02);
      hud.score(0); hud.hearts(3, 3); hud.timer(0);
      hud.objective(goals.summary());
      hud.banner(best
        ? 'BEST ' + best.time.toFixed(1) + 's · ' + best.coins + ' coins'
        : 'COIN RUN', 1.6);
    },
    results: () => {},
    title: () => hud.banner('COIN RUN', 2),
  },
});
hud.banner('COIN RUN', 2);
let attract = 1.2;
addEventListener('pointerdown', () => {
  if (flow.state === 'title' || flow.state === 'results') flow.to('playing');
});

game.onUpdate((t) => {
  const real = feel.update(t.delta);
  if (flow.state === 'title' || flow.state === 'results') {
    attract -= t.delta;
    if (attract <= 0) { attract = 2.5; flow.to('playing'); }
  }
  const dt = flow.gate(real);
  clock += dt;

  // The ferry swings; its velocity is what carries the rider.
  const w = 1.2, mid = 31, amp = 1.55;
  mover.center.x = mid + amp * Math.sin(clock * w);
  mover.velocity.x = amp * w * Math.cos(clock * w);
  mover.mesh.position.x = mover.center.x;

  if (flow.playing) {
    const x = body.position.x;
    const riding = body.ground === mover;
    // Wait at the edge until the ferry swings within a stride, then
    // WALK aboard (its left extreme overlaps the ledge); ride until it
    // swings to the far side, then run and jump for the finish slab.
    const docked = mover.center.x < 29.6;
    const wait = x > 27.2 && x < 28.2 && body.grounded && !riding && !docked;
    const go = riding ? (mover.center.x > 32.2 ? 1 : 0) : (wait ? 0 : 1);
    body.move(go);
    const mark = JUMPS.find((j) => j > lastJump && x >= j);
    if (mark && body.grounded && go) {
      body.jump(); lastJump = mark; holdUntil = clock + 0.45;
    }
    if (clock > holdUntil) body.release();
    body.update(dt, platforms);
    hero.position.set(body.position.x, body.position.y + 0.85, 0);
    collector.sweep({ x: body.position.x, y: body.position.y + 0.9, z: 0 });

    // Checkpoints are just "the furthest slab you stood on".
    if (body.grounded) {
      for (const cp of CHECKPOINTS) if (x > cp && cp > checkpoint) checkpoint = cp;
    }
    // The pit: lose a heart, go back to the checkpoint.
    if (body.position.y < -6) {
      const hit = health.damage({ amount: 1 });
      if (hit && health.alive) {
        body.teleport(checkpoint, 0.02);
        lastJump = checkpoint - 0.5;
        hud.banner('OOF', 0.9);
      } else if (!health.alive) {
        flow.to('results'); attract = 1.8;
      }
    }
    // The flag.
    if (finished === 0 && body.grounded && x >= 38.6) {
      finished = clock;
      goals.finish('flag');
      const got = goals.get('coins').progress;
      sounds.success(); feel.slowMo(0.35, 1.1);
      if (!best || got > best.coins ||
          (got === best.coins && clock < best.time)) {
        best = { time: clock, coins: got };
        slot.save(best);
        hud.banner('NEW BEST ' + clock.toFixed(1) + 's · ' + got + ' coins', 2.4);
      } else {
        hud.banner('DONE ' + clock.toFixed(1) + 's · ' + got + ' coins', 2.2);
      }
      flow.to('results'); attract = 2.5;
    }
  }

  for (const c of coins) if (!c.taken) {
    c.mesh.rotation.y += t.delta * 2.4;
    c.mesh.position.y = c.trigger.center.y + Math.sin(clock * 3 + c.trigger.center.x) * 0.08;
  }
  health.update(dt);
  hud.timer(flow.playing ? clock : null);
  hud.update(dt);

  // A side-scroller camera: lead the runner, ease along.
  const cx = body.position.x + 3.5;
  game.camera.position.x += (cx - game.camera.position.x) * Math.min(1, 4 * t.delta);
  game.camera.position.y += (body.position.y + 4.5 - game.camera.position.y) * Math.min(1, 2 * t.delta);
  game.camera.lookAt(game.camera.position.x, body.position.y + 1, 0);
  feel.apply(game.camera);
});

window.coinrunDebug = () => ({
  state: flow.state,
  x: Number(body.position.x.toFixed(2)),
  y: Number(body.position.y.toFixed(2)),
  grounded: body.grounded,
  riding: body.ground === mover,
  coins: goals.get('coins').progress,
  left: coins.filter((c) => !c.taken).map((c) => c.trigger.center.x),
  hearts: health.current,
  clock: Number(clock.toFixed(2)),
  finished: finished > 0,
  best,
  saved: slot.exists,
});

game.start();`,
  },
  {
    id: 'stealth',
    title: 'Stealth: the illumination field',
    group: 'Gameplay',
    code: `// LIGHT AS GAMEPLAY. The stealth genre is one number: how lit am I?
// The Illumination field answers it in pure math (no pixels read) —
// lamps register structurally, the guard's Flashlight feeds the same
// field, and the sneaking bot dashes when its NEXT step reads dark.
// The torch has a battery: it gutters, dies, and gets fresh cells 4 s
// later — the dark windows are your openings. MoodGrade turns the
// whole scene red as suspicion climbs.
import { Game, Illumination, Flashlight, MoodGrade, GameFlow, Hud,
         Soundboard, GameFeel } from 'gama3d';
import { Mesh, MeshBasicMaterial, MeshStandardMaterial, AdditiveBlending,
         BoxGeometry, ConeGeometry, CylinderGeometry, Group, PointLight,
         SphereGeometry } from 'three';
${scene(0, 16, 15, 0)}

const hud = new Hud();
const sounds = new Soundboard({ seed: 21 });
sounds.unlock();
const feel = new GameFeel({ seed: 6 });
sounds.onCaption((c) => hud.caption('♪ ' + c.text));

// Night. The helper's sun dims to moonlight; the mood owns the rest.
sun.intensity = 0.12;
sun.color.setHex(0x8fa8d8);
const moon = new AmbientLight(0x7080b0, 0.22);
game.world.scene.add(moon);

const grade = new MoodGrade({ sun, ambient: moon, scene: game.world.scene });
grade.define('calm', { background: 0x0b0e14, ambient: { intensity: 0.22 },
  sun: { color: 0x8fa8d8, intensity: 0.12 } });
grade.define('alert', { background: 0x1e070c, ambient: { intensity: 0.3 },
  sun: { color: 0xff5040, intensity: 0.3 } });
grade.set('calm');

// ---- The lamps: a lit band the hero must cross. Only FOUR real
// PointLights — a scena LightBudget would pool these; a demo can afford
// them. Each lamp registers with the FIELD, which is what gameplay reads.
const field = new Illumination({ ambient: 0.06 });
const mat = (c) => new MeshStandardMaterial({ color: c });
for (const x of [-7, -2.5, 2, 6.5]) {
  const pole = new Mesh(new CylinderGeometry(0.06, 0.09, 2.6, 6),
    mat(0x2c2f34));
  pole.position.set(x, 1.3, 0);
  const bulb = new Mesh(new SphereGeometry(0.14, 8, 6),
    new MeshStandardMaterial({ color: 0xffd889, emissive: 0xffd889,
      emissiveIntensity: 2 }));
  bulb.position.set(x, 2.5, 0);
  const glow = new PointLight(0xffd889, 5, 7, 1.8);
  glow.position.set(x, 2.4, 0);
  game.world.scene.add(pole, bulb, glow);
  field.add({ center: { x, y: 0, z: 0 }, radius: 3.5 });
}

// The shed (the goal) and the start.
const shed = new Mesh(new BoxGeometry(3, 2, 2.4), mat(0x2a3446));
shed.position.set(-4.2, 1, -12);
game.world.scene.add(shed);

// ---- The cast.
const hero = new Mesh(new ConeGeometry(0.4, 1.3, 6), mat(0x53c7f0));
hero.position.set(-4.2, 0.65, 12);
const guard = new Mesh(new ConeGeometry(0.45, 1.5, 6), mat(0xe4574d));
guard.position.set(0, 0.75, 0);
game.world.scene.add(hero, guard);

// The guard's torch — and its VISIBLE beam, opacity scaled by glow.
const torch = new Flashlight({ range: 8, halfAngle: 0.38, batteryLife: 12,
  seed: 3,
  onLow: () => hud.caption('the torch is guttering…'),
  onDied: () => { hud.caption('…dead. GO.'); sounds.blip(); } });
field.add(torch.source);
const beamMat = new MeshBasicMaterial({ color: 0xfff2c0, transparent: true,
  opacity: 0.2, blending: AdditiveBlending, depthWrite: false });
// Apex at the pivot (the guard's hand), spread 8 m down its local +z.
const beamPivot = new Group();
const beam = new Mesh(new ConeGeometry(2.6, 8, 14, 1, true), beamMat);
beam.rotation.x = -Math.PI / 2;
beam.position.z = 4;
beamPivot.add(beam);
game.world.scene.add(beamPivot);

const flow = new GameFlow();
flow.to('playing');
hud.banner('REACH THE SHED', 2);
let suspicion = 0, runs = 0, spotted = 0, deadTimer = 0, exposure = 0;

game.onUpdate((t) => {
  const real = feel.update(t.delta);
  const dt = flow.gate(real);

  // The guard patrols the lit band, torch sweeping with the walk.
  const gx = Math.sin(t.elapsed * 0.32) * 7.5;
  const facing = Math.cos(t.elapsed * 0.32) > 0 ? Math.PI / 2 : -Math.PI / 2;
  guard.position.x = gx;
  guard.rotation.y = facing;
  torch.aim({ x: gx, y: 0, z: 0 }, facing);
  torch.update(dt);
  if (torch.battery <= 0) {
    deadTimer += dt;
    if (deadTimer > 4) { torch.refuel(); deadTimer = 0;
      hud.caption('fresh batteries'); }
  }
  beamPivot.position.set(gx, 0.9, 0);
  beamPivot.rotation.y = facing;
  beamMat.opacity = 0.2 * torch.glow;

  // The one number: how lit is the hero — and its next step?
  exposure = field.at(hero.position);
  const beamOnHero = torch.illuminates({ center: hero.position, radius: 0.4 });

  // The sneak: dash when the NEXT step reads dark and the beam is off you;
  // if you're caught standing in light, keep moving — out is through.
  const next = { x: hero.position.x, y: 0, z: hero.position.z - 0.9 };
  const nextLit = field.at(next) > 0.42;
  const go = (!nextLit && !beamOnHero) || exposure > 0.42;
  if (go && flow.playing) hero.position.z -= 2.3 * dt;

  // Suspicion: exposure is only dangerous when the guard can see you.
  const dx = hero.position.x - gx, dz = hero.position.z;
  const gd = Math.sqrt(dx * dx + dz * dz);
  if (beamOnHero) suspicion += 1.4 * dt;
  else if (gd < 7) suspicion += exposure * (1 - gd / 7) * 1.6 * dt;
  else suspicion -= 0.35 * dt;
  suspicion = Math.min(Math.max(suspicion, 0), 1);

  if (suspicion >= 1) {
    spotted++; suspicion = 0.4;
    hud.banner('SPOTTED', 1.2);
    sounds.fail(); feel.shake(0.4);
    hero.position.set(-4.2, 0.65, 12);
  }
  if (hero.position.z < -10.8) {
    runs++; hud.score(runs, 'RUNS');
    hud.banner('SLIPPED THROUGH', 1.4);
    sounds.success();
    hero.position.set(-4.2, 0.65, 12);
    suspicion = 0;
  }

  // The mood follows the suspicion, with hysteresis so it can't flap.
  if (suspicion > 0.5 && grade.mood !== 'alert') grade.to('alert', 0.8);
  else if (suspicion < 0.22 && grade.mood !== 'calm') grade.to('calm', 1.6);
  grade.update(real);

  const bars = Math.round(exposure * 8);
  hud.prompt('EXPOSURE ' + '█'.repeat(bars) + '░'.repeat(8 - bars) +
    '  ·  torch ' + Math.round(torch.battery * 100) + '%');
  hud.update(dt);
  feel.apply(game.camera);
});

window.stealthDebug = () => ({
  exposure: Number(exposure.toFixed(3)),
  suspicion: Number(suspicion.toFixed(3)),
  torchBattery: Number(torch.battery.toFixed(3)),
  torchLit: torch.lit,
  heroZ: Number(hero.position.z.toFixed(2)),
  runs,
  spotted,
  mood: grade.mood,
  sources: field.count,
});

game.start();`,
  },
  {
    id: 'aviator',
    title: 'Aviator: the flight model',
    group: 'Gameplay',
    code: `// ARCADE-HONEST FLIGHT. Throttle buys speed, speed buys lift,
// BANK-TO-TURN makes it feel like flying, climbing costs energy — and
// below stall speed the wings STOP FLYING. The autopilot takes off,
// flies the square at 14 m, then once per lap cuts the engine and
// holds the nose up to show you the stall: nose drop, sink, the
// recover-with-power. The engine's voice follows the throttle.
import { Game, FlightController, ChaseCamera, Hud, Soundboard,
         EngineSound, GameFeel } from 'gama3d';
import { Mesh, MeshStandardMaterial, BoxGeometry, ConeGeometry,
         Group } from 'three';
${scene(0, 18, 30, 6)}

const hud = new Hud();
const sounds = new Soundboard({ seed: 8 });
sounds.unlock();
const feel = new GameFeel({ seed: 9 });
sounds.onCaption((c) => hud.caption('♪ ' + c.text));
const engine = new EngineSound(sounds, { volume: 0.35 });

// The world below: a field big enough that altitude has a horizon,
// and the strip, so the takeoff has somewhere to leave from.
const field = new Mesh(new BoxGeometry(400, 0.02, 400),
  new MeshStandardMaterial({ color: 0x18251c }));
field.position.y = -0.02;
const strip = new Mesh(new BoxGeometry(6, 0.06, 70),
  new MeshStandardMaterial({ color: 0x23262d }));
strip.position.set(0, 0.03, 20);
game.world.scene.add(field, strip);

// A box-built airframe: fuselage, wings, tail — the pose IS the story.
const mat = (c) => new MeshStandardMaterial({ color: c });
const airframe = new Group();
const fuselage = new Mesh(new BoxGeometry(0.9, 0.9, 5), mat(0x3a6ea5));
fuselage.position.y = 0.9;
const wings = new Mesh(new BoxGeometry(9, 0.12, 1.5), mat(0xd8dee6));
wings.position.set(0, 1.15, 0.3);
const fin = new Mesh(new BoxGeometry(0.1, 1.2, 0.8), mat(0xd8dee6));
fin.position.set(0, 1.6, -2.3);
const stab = new Mesh(new BoxGeometry(2.6, 0.1, 0.7), mat(0xd8dee6));
stab.position.set(0, 1.05, -2.4);
const spinner = new Mesh(new ConeGeometry(0.22, 0.5, 8), mat(0x22262b));
spinner.rotation.x = Math.PI / 2;
spinner.position.set(0, 0.9, 2.7);
airframe.add(fuselage, wings, fin, stab, spinner);
game.world.scene.add(airframe);

const flight = new FlightController({
  onTakeoff: () => { hud.banner('AIRBORNE', 1.4); sounds.success(); },
  onStall: () => { hud.banner('STALL', 1.2); sounds.fail(); feel.shake(0.35); },
  onLand: (sink) => { hud.banner('DOWN ' + sink.toFixed(1) + ' m/s', 1.6);
    feel.shake(Math.min(sink / 12, 0.5)); },
});
flight.position.set(0, 0, -10);

const cam = new ChaseCamera(game.camera, airframe, { distance: 14, height: 5 });

// The autopilot: a square at 14 m, one deliberate stall per lap.
const WAYPOINTS = [[38, 45], [-38, 45], [-38, -45], [38, -45]];
let wp = 0, laps = 0, phase = 'takeoff', stallClock = 0;

game.onUpdate((t) => {
  const dt = feel.update(t.delta);

  if (phase === 'takeoff') {
    flight.throttle = 1;
    flight.control({ pitch: flight.speed > 13 ? 0.5 : 0 });
    if (flight.position.y > 10) phase = 'cruise';
  } else if (phase === 'cruise') {
    const [wx, wz] = WAYPOINTS[wp];
    const dx = wx - flight.position.x, dz = wz - flight.position.z;
    if (Math.sqrt(dx * dx + dz * dz) < 26) {
      wp = (wp + 1) % WAYPOINTS.length;
      if (wp === 0) { laps++; phase = 'stall'; stallClock = 0;
        hud.caption('…and now, the stall demonstration'); }
    }
    // Chase a heading with bank; chase an altitude with pitch attitude.
    let err = Math.atan2(dx, dz) - flight.heading;
    while (err > Math.PI) err -= Math.PI * 2;
    while (err < -Math.PI) err += Math.PI * 2;
    // The stick is a RATE: chase target ATTITUDES, don't command raw rates.
    const targetPitch = Math.min(Math.max((14 - flight.position.y) * 0.05, -0.25), 0.3);
    const targetBank = Math.min(Math.max(-err * 1.2, -0.85), 0.85);
    flight.throttle = 0.8;
    flight.control({
      roll: Math.min(Math.max((targetBank - flight.bank) * 3, -1), 1),
      pitch: Math.min(Math.max((targetPitch - flight.pitch) * 4, -1), 1),
    });
  } else {
    // The demonstration: engine to idle, stick back, and wait for physics.
    stallClock += dt;
    flight.throttle = 0;
    flight.control({ pitch: 0.6, roll: 0 });
    if (flight.stalled && flight.position.y < 9) {
      phase = 'cruise'; // recover: power on, wings level, fly away
      flight.throttle = 1;
      hud.caption('power ON — recovering');
    }
    if (stallClock > 12) phase = 'cruise'; // safety net, not that physics needs one
  }

  flight.update(dt);
  flight.apply(airframe);
  engine.set(700 + flight.throttle * 1900 + flight.speed * 8, 0.3 + flight.throttle * 0.6);

  hud.prompt('SPD ' + flight.speed.toFixed(0) + ' m/s · ALT ' +
    flight.position.y.toFixed(0) + ' m · THR ' +
    Math.round(flight.throttle * 100) + '%' + (flight.stalled ? '  ⚠ STALL' : ''));
  hud.update(dt);
  cam.update(dt);
  feel.apply(game.camera);
});

window.aviatorDebug = () => ({
  phase,
  laps,
  speed: Number(flight.speed.toFixed(1)),
  alt: Number(flight.position.y.toFixed(1)),
  heading: Number(flight.heading.toFixed(2)),
  bank: Number(flight.bank.toFixed(2)),
  stalled: flight.stalled,
  grounded: flight.grounded,
  waypoint: wp,
});

game.start();`,
  },
  {
    id: 'rescue',
    title: 'Night rescue: the searchlight',
    group: 'Gameplay',
    code: `// THE SEARCHLIGHT HANDSHAKE. A HoverController flies the ship —
// collective, cyclic, pedals, rotor INERTIA, and a seeded hover
// breath (a perfectly still hover reads as a screenshot). The nose
// light is a gama Flashlight feeding an Illumination field: the beam
// you SEE and the exposure the game COMPUTES are the same math. A
// raft drifts in the dark; the bot flies the search ladder until the
// beam finds it, holds the hover, lowers the winch, and the RotorSound
// wop-wops through the whole thing at blade-pass frequency.
import { Game, HoverController, Flashlight, Illumination, Hud,
         Soundboard, RotorSound, GameFeel } from 'gama3d';
import { Mesh, MeshBasicMaterial, MeshStandardMaterial, AdditiveBlending,
         BoxGeometry, CylinderGeometry, ConeGeometry, Group } from 'three';
${scene(0, 16, 26, 3)}

const hud = new Hud();
const sounds = new Soundboard({ seed: 17 });
sounds.unlock();
const feel = new GameFeel({ seed: 3 });
sounds.onCaption((c) => hud.caption('♪ ' + c.text));
const rotorSound = new RotorSound(sounds, { blades: 3, volume: 0.4 });

// Night sea.
game.world.scene.background.setHex(0x05080f);
sun.intensity = 0.1;
sun.color.setHex(0x8fa8d8);
const sea = new Mesh(new BoxGeometry(300, 0.05, 300),
  new MeshStandardMaterial({ color: 0x0a1622 }));
sea.position.y = -0.03;
game.world.scene.add(sea);

// The raft: three souls' worth of dark orange, invisible until lit.
const raft = new Mesh(new BoxGeometry(1.6, 0.35, 1.1),
  new MeshStandardMaterial({ color: 0x7a4416 }));
raft.position.set(14, 0.2, -10);
game.world.scene.add(raft);
let raftDrift = 0.7;

// The ship: a box helicopter with a spinning rotor disc.
const mat = (c) => new MeshStandardMaterial({ color: c });
const ship = new Group();
const cabin = new Mesh(new BoxGeometry(1.4, 1.2, 2.6), mat(0xd8a13a));
cabin.position.y = 1.1;
const boom = new Mesh(new BoxGeometry(0.35, 0.4, 3), mat(0xd8a13a));
boom.position.set(0, 1.25, -2.4);
const disc = new Mesh(new CylinderGeometry(3.4, 3.4, 0.04, 24),
  new MeshBasicMaterial({ color: 0xdadfe8, transparent: true, opacity: 0.2,
    blending: AdditiveBlending, depthWrite: false }));
disc.position.y = 2.1;
const skidL = new Mesh(new BoxGeometry(0.08, 0.08, 2.4), mat(0x22262b));
skidL.position.set(-0.7, 0.08, 0.2);
const skidR = skidL.clone(); skidR.position.x = 0.7;
ship.add(cabin, boom, disc, skidL, skidR);
// The visible beam, apex at the nose light.
const beamMat = new MeshBasicMaterial({ color: 0xfff2c0, transparent: true,
  opacity: 0, blending: AdditiveBlending, depthWrite: false });
const beam = new Mesh(new ConeGeometry(3.2, 13, 14, 1, true), beamMat);
const beamPivot = new Group();
beam.rotation.x = -Math.PI / 2; beam.position.z = 6.5;
beamPivot.add(beam);
beamPivot.position.set(0, 0.6, 1.2);
ship.add(beamPivot);
// The winch line.
const line = new Mesh(new CylinderGeometry(0.03, 0.03, 1, 5), mat(0x9aa3ad));
line.visible = false;
ship.add(line);
game.world.scene.add(ship);

const hover = new HoverController({ seed: 5,
  onTakeoff: () => hud.banner('DUSTOFF', 1.4),
  onLand: (s) => hud.banner('SKIDS DOWN ' + s.toFixed(1), 1.5) });
hover.spool = 1;

// The searchlight: a Flashlight whose cone IS the gameplay.
const torch = new Flashlight({ range: 15, halfAngle: 0.32, batteryLife: 9999 });
const field = new Illumination({ ambient: 0.03 });
field.add(torch.source);

// The bot: climb, fly the ladder, find, hover, winch, repeat.
const LADDER = [[-16, -16], [16, -16], [16, 0], [-16, 0], [-16, 16], [16, 16]];
let leg = 0, phase = 'lift', winch = 0, saved = 0, sweep = 0;

game.onUpdate((t) => {
  const dt = feel.update(t.delta);

  // The raft drifts; the sea is not still either.
  raft.position.x += Math.sin(t.elapsed * 0.13) * raftDrift * dt;
  raft.position.z += Math.cos(t.elapsed * 0.09) * raftDrift * dt;
  raft.position.y = 0.2 + Math.sin(t.elapsed * 1.1) * 0.06;

  const raftTrigger = { center: raft.position, radius: 1.2 };
  const lit = torch.illuminates(raftTrigger);
  const exposure = field.at(raft.position);

  if (phase === 'lift') {
    hover.control({ collective: 0.9 });
    if (hover.position.y > 11) { phase = 'search'; hud.banner('SEARCH', 1.2); }
  } else if (phase === 'search') {
    const [lx, lz] = LADDER[leg];
    const dx = lx - hover.position.x, dz = lz - hover.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < 3) leg = (leg + 1) % LADDER.length;
    // Nose toward the leg; cyclic forward; light sweeping ahead.
    let err = Math.atan2(dx, dz) - hover.heading;
    while (err > Math.PI) err -= Math.PI * 2;
    while (err < -Math.PI) err += Math.PI * 2;
    hover.control({
      collective: (11 - hover.position.y) * 0.3,
      cyclicPitch: Math.min(dist * 0.2, 0.75),
      pedal: Math.min(Math.max(err * 1.4, -1), 1),
    });
    sweep += dt;
    const wag = Math.sin(sweep * 1.3) * 0.5;
    torch.aim({ x: hover.position.x, y: 0, z: hover.position.z },
      hover.heading + wag);
    beamPivot.rotation.y = wag;
    if (lit) { phase = 'found'; hud.banner('IN THE BEAM', 1.4);
      sounds.success(); feel.shake(0.2); }
  } else if (phase === 'found') {
    // Hold over the raft; when steady, drop the line.
    const dx = raft.position.x - hover.position.x;
    const dz = raft.position.z - hover.position.z;
    let err = Math.atan2(dx, dz) - hover.heading;
    while (err > Math.PI) err -= Math.PI * 2;
    while (err < -Math.PI) err += Math.PI * 2;
    hover.control({
      collective: (9 - hover.position.y) * 0.35,
      cyclicPitch: Math.min(Math.sqrt(dx * dx + dz * dz) * 0.14, 0.5),
      pedal: Math.min(Math.max(err * 1.4, -1), 1),
    });
    torch.aim({ x: hover.position.x, y: 0, z: hover.position.z }, hover.heading);
    beamPivot.rotation.y = 0;
    if (Math.sqrt(dx * dx + dz * dz) < 2.2) { phase = 'winch'; winch = 0; }
  } else if (phase === 'winch') {
    hover.control({ collective: (9 - hover.position.y) * 0.35 });
    winch += dt;
    line.visible = true;
    const drop = Math.min(winch * 2.2, hover.position.y - 1);
    line.scale.y = drop;
    line.position.set(0, 1 - drop / 2, 0);
    if (winch > 4.5) {
      saved++; hud.score(saved, 'SAVED'); sounds.chime(saved % 6);
      hud.banner('SOUL ABOARD', 1.6);
      line.visible = false;
      // A new raft, somewhere else in the dark.
      raft.position.set(-20 + (saved * 17) % 40, 0.2, -18 + (saved * 23) % 36);
      phase = 'search';
    }
  }

  hover.update(dt);
  torch.update(dt);
  hover.apply(ship);
  disc.rotation.y += dt * hover.rotor * 25;
  beamMat.opacity = 0.16 * torch.glow * (phase === 'search' || phase === 'found' || phase === 'winch' ? 1 : 0);
  rotorSound.set(hover.rotor * 400);

  hud.prompt('ALT ' + hover.position.y.toFixed(0) + ' m · raft exposure ' +
    exposure.toFixed(2) + (lit ? '  ● IN BEAM' : ''));
  hud.update(dt);
  game.camera.position.set(hover.position.x - 10, hover.position.y + 7,
    hover.position.z + 14);
  game.camera.lookAt(hover.position.x, Math.max(hover.position.y - 4, 0.5),
    hover.position.z - 2);
  feel.apply(game.camera);
});

window.rescueDebug = () => ({
  phase,
  saved,
  alt: Number(hover.position.y.toFixed(1)),
  rotor: Number(hover.rotor.toFixed(2)),
  exposure: Number(field.at(raft.position).toFixed(3)),
  inBeam: torch.illuminates({ center: raft.position, radius: 1.2 }),
  raft: [Number(raft.position.x.toFixed(1)), Number(raft.position.z.toFixed(1))],
  chopHz: Number((rotorSound.rpm / 60 * 3).toFixed(1)),
});

game.start();`,
  },
  {
    id: 'dogfight',
    title: 'Dogfight: missiles, locks & flares',
    group: 'Gameplay',
    code: `// THE TURN-RATE LIMIT IS THE WHOLE GAME. Missiles chase with lead
// pursuit but turn like airframes, not math — hard turns bleed speed,
// slow targets are doomed, fast crossers escape. The LockOn growl
// climbs to a solid tone; flares get ONE seeded chance each to buy a
// missile off. Blue hunts the bandits; the bandits shoot back; both
// sides carry flares and neither side's missiles are magic.
import { Game, FlightController, Missiles, LockOn, Health, Hud,
         Soundboard, GameFeel } from 'gama3d';
import { Mesh, MeshStandardMaterial, MeshBasicMaterial, BoxGeometry,
         ConeGeometry, Group, Vector3 } from 'three';
${scene(0, 20, 34, 8)}

const hud = new Hud();
const sounds = new Soundboard({ seed: 23 });
sounds.unlock();
const feel = new GameFeel({ seed: 7 });
sounds.onCaption((c) => hud.caption('♪ ' + c.text));

const field = new Mesh(new BoxGeometry(500, 0.02, 500),
  new MeshStandardMaterial({ color: 0x1c2a20 }));
field.position.y = -0.02;
game.world.scene.add(field);

// A box jet: fuselage, delta wing, fin. Blue for us, rust for them.
const mat = (c) => new MeshStandardMaterial({ color: c });
const makeJet = (color) => {
  const jet = new Group();
  const body = new Mesh(new BoxGeometry(0.8, 0.7, 4.6), mat(color));
  body.position.y = 0.8;
  const wing = new Mesh(new BoxGeometry(6, 0.1, 2.2), mat(0xd8dee6));
  wing.position.set(0, 0.85, -0.9);
  const fin = new Mesh(new BoxGeometry(0.08, 1.1, 1), mat(0xd8dee6));
  fin.position.set(0, 1.5, -2);
  jet.add(body, wing, fin);
  return jet;
};

const player = makeJet(0x3a6ea5);
game.world.scene.add(player);
const flight = new FlightController({ maxSpeed: 34 });
const health = new Health({ max: 5,
  onDamage: (e) => { hud.hearts(e.current, e.max); feel.shake(0.4);
    sounds.impact('metal', 0.9); },
  onDeath: () => { hud.banner('HIT THE SILK', 2); sounds.fail();
    health.revive(); hud.hearts(5, 5); } });
hud.hearts(5, 5);

// The bandits: two rust jets orbiting the arena at altitude.
const bandits = [0, 1].map((i) => {
  const jet = makeJet(0xb0552e);
  game.world.scene.add(jet);
  return { jet, angle: i * Math.PI, radius: 46 + i * 14,
    height: 16 + i * 5, speed: 0.32 - i * 0.06, down: 0,
    center: new Vector3(), trigger: null };
});
for (const b of bandits) b.trigger = { center: b.center, radius: 2 };

// ---- The ordnance, both directions.
let kills = 0, decoyed = 0;
const playerMissiles = new Missiles({ seed: 5, turnRate: 2.1, flareCharm: 0.45,
  onHit: ({ target }) => {
    const bandit = bandits.find((b) => b.trigger === target);
    if (bandit && bandit.down <= 0) {
      bandit.down = 3.5; kills++;
      hud.score(kills, 'KILLS'); hud.banner('SPLASH ONE', 1.4);
      sounds.crack(1); feel.shake(0.45); feel.slowMo(0.4, 0.7);
    }
  },
  onDecoyed: () => { decoyed++; hud.banner('FLARED OFF', 1.1); sounds.pop(); },
});
const banditMissiles = new Missiles({ seed: 9, turnRate: 1.5, flareCharm: 0.6,
  onHit: () => health.damage({ amount: 1 }),
  onDecoyed: () => hud.caption('their round bought our flare'),
});
game.world.scene.add(playerMissiles.group, banditMissiles.group);
banditMissiles.group.material = new MeshBasicMaterial({ color: 0xff8866 });

const lock = new LockOn({ halfAngle: 0.62, range: 110, lockTime: 0.85 });
let fireCooldown = 0, banditFireClock = 5, tickClock = 0;
let flareTimer = -1, banditFlareTimer = -1;

flight.throttle = 1;
flight.control({ pitch: 0.5 });

game.onUpdate((t) => {
  const dt = feel.update(t.delta);

  // The bandits fly their circuits (or fall out of them).
  for (const b of bandits) {
    if (b.down > 0) {
      b.down -= dt;
      b.jet.position.y = Math.max(b.jet.position.y - 8 * dt, 1);
      b.jet.rotation.z += dt * 5; // going down spinning
      if (b.down <= 0) b.angle += Math.PI; // respawns across the arena
    } else {
      b.angle += b.speed * dt;
      b.jet.position.set(Math.sin(b.angle) * b.radius, b.height,
        Math.cos(b.angle) * b.radius);
      b.jet.rotation.set(0, b.angle + Math.PI / 2, -0.3);
    }
    b.center.copy(b.jet.position);
  }

  // Our autopilot: chase the nearest live bandit's sky.
  const quarry = bandits.filter((b) => b.down <= 0)
    .sort((a, c) => a.jet.position.distanceToSquared(flight.position) -
                    c.jet.position.distanceToSquared(flight.position))[0];
  if (!flight.grounded && quarry) {
    const dx = quarry.jet.position.x - flight.position.x;
    const dz = quarry.jet.position.z - flight.position.z;
    let err = Math.atan2(dx, dz) - flight.heading;
    while (err > Math.PI) err -= Math.PI * 2;
    while (err < -Math.PI) err += Math.PI * 2;
    const targetBank = Math.min(Math.max(-err * 1.1, -0.8), 0.8);
    const targetPitch = Math.min(Math.max(
      (quarry.height - 2 - flight.position.y) * 0.04, -0.2), 0.3);
    flight.control({
      roll: Math.min(Math.max((targetBank - flight.bank) * 3, -1), 1),
      pitch: Math.min(Math.max((targetPitch - flight.pitch) * 4, -1), 1),
    });
    flight.throttle = 0.85;
  }
  flight.update(dt);
  flight.apply(player);

  // The seeker looks where we fly.
  const dir = flight.velocity.clone().normalize();
  lock.update(dt, { position: flight.position, direction: dir },
    quarry ? quarry.trigger : null);
  fireCooldown -= dt;
  tickClock -= dt;
  if (lock.state !== 'seeking' && tickClock <= 0) {
    tickClock = lock.state === 'locked' ? 0.09 : 0.45 - lock.progress * 0.3;
    sounds.tick();
  }
  if (lock.state === 'locked' && fireCooldown <= 0 && quarry) {
    fireCooldown = 4;
    playerMissiles.fire(flight.position, dir, quarry.trigger);
    sounds.whoosh(1);
    hud.caption('FOX TWO');
    banditFlareTimer = 1.1; // they saw the smoke
  }

  // Their side of the argument.
  banditFireClock -= dt;
  if (banditFireClock <= 0 && quarry && !flight.grounded) {
    banditFireClock = 7;
    const from = quarry.jet.position;
    const at = new Vector3().subVectors(flight.position, from).normalize();
    banditMissiles.fire(from, at,
      { center: flight.position, radius: 1.6 });
    hud.caption('SMOKE IN THE AIR — flares ready');
    flareTimer = 1.2;
  }
  if (flareTimer > 0 && (flareTimer -= dt) <= 0) {
    banditMissiles.flare({ x: flight.position.x - dir.x * 3,
      y: flight.position.y - 1, z: flight.position.z - dir.z * 3 });
    hud.caption('flares away');
  }
  if (banditFlareTimer > 0 && (banditFlareTimer -= dt) <= 0 && quarry) {
    playerMissiles.flare({ x: quarry.jet.position.x, y: quarry.jet.position.y - 2,
      z: quarry.jet.position.z - 4 });
  }

  playerMissiles.update(dt);
  banditMissiles.update(dt);
  health.update(dt);

  hud.prompt(lock.state === 'locked' ? '● LOCK — FOX TWO READY'
    : lock.state === 'locking' ? '◐ locking ' + Math.round(lock.progress * 100) + '%'
    : '○ seeking');
  hud.update(dt);
  game.camera.position.set(flight.position.x - dir.x * 16,
    flight.position.y + 6, flight.position.z - dir.z * 16);
  game.camera.lookAt(flight.position.x, flight.position.y, flight.position.z);
  feel.apply(game.camera);
});

window.dogfightDebug = () => ({
  kills,
  decoyed,
  playerHp: health.current,
  lock: lock.state,
  progress: Number(lock.progress.toFixed(2)),
  ours: playerMissiles.alive,
  theirs: banditMissiles.alive,
  flares: playerMissiles.flaresBurning + banditMissiles.flaresBurning,
  alt: Number(flight.position.y.toFixed(1)),
  banditsUp: bandits.filter((b) => b.down <= 0).length,
});

game.start();`,
  },
  {
    id: 'level',
    title: 'Levels: prefabs & the round trip',
    group: 'Core',
    code: `// A LEVEL, AND A LITTLE EDITOR. The scene on the left is built from the
// JSON on the right — and the JSON on the right is re-read from the scene
// every time you move something. That round trip is the whole feature:
// an editor is only possible if save(load(x)) gives back x.
// Click to select · arrows move · Q/E turn · +/− scale · Tab cycles.
// Note entity "old-statue": no factory is registered for its kind, so it
// cannot be built — and it is still in the file, untouched, after a save.
import { BoxGeometry, Color, ConeGeometry, CylinderGeometry, Group, HemisphereLight,
         Mesh, MeshStandardMaterial, PlaneGeometry, Raycaster, SphereGeometry,
         Vector2 } from 'three';
import { Catalog, Game, Level } from 'gama3d';

const game = new Game();
const scene = game.world.scene;
game.camera.position.set(11, 10, 14);
game.camera.lookAt(0, 0.5, 0);

const paint = (color) => new MeshStandardMaterial({ color, roughness: 0.75 });
scene.background = new Color(0x2c3a47); // no sky in this example; not a void either
const ground = new Mesh(new PlaneGeometry(40, 40), paint(0x46533f));
ground.rotation.x = -Math.PI / 2;
scene.add(ground);
scene.add(new HemisphereLight(0xbfd4e8, 0x33402f, 1.5));

// ---- The catalog: the bridge from a NAME in a file to a thing in the
// world. GAMA cannot import SCENA, so it has no idea what a "crate" is
// until the game says so. Any factory works — these return raw meshes;
// SCENA props and ANIMA rigs return { object } and drop in unchanged.
const catalog = new Catalog()
  .define('crate', (props) => {
    const m = new Mesh(new BoxGeometry(1.2, 1.2, 1.2), paint(props.color ?? 0xb98b46));
    m.position.y = 0.6;
    return m;
  })
  .define('pillar', (props) => {
    const h = props.height ?? 3;
    const m = new Mesh(new CylinderGeometry(0.42, 0.5, h, 10), paint(0xcfc6b4));
    m.position.y = h / 2;
    return m;
  })
  .define('tree', (props, ctx) => {
    const g = new Group();
    const trunk = new Mesh(new CylinderGeometry(0.16, 0.22, 1.5, 7), paint(0x6b4b32));
    trunk.position.y = 0.75;
    const leaf = new Mesh(new ConeGeometry(1.1, 2.4, 8), paint(props.color ?? 0x3f7a45));
    leaf.position.y = 2.3;
    g.add(trunk, leaf);
    g.name = 'tree-' + ctx.seed;
    return g;
  })
  .define('lamp', () => {
    const g = new Group();
    const post = new Mesh(new CylinderGeometry(0.07, 0.09, 2.6, 6), paint(0x3a3f45));
    post.position.y = 1.3;
    const bulb = new Mesh(new SphereGeometry(0.22, 10, 8),
      new MeshStandardMaterial({ color: 0xffe6a8, emissive: 0xffcc66, emissiveIntensity: 1.4 }));
    bulb.position.y = 2.7;
    g.add(post, bulb);
    return g;
  });

// A PREFAB is a recipe, not a blob: a named spec that a placement can
// override. Storing baked geometry would be larger, would go stale the
// moment the generator improved, and would throw the seed away.
catalog.prefab('lit-corner', {
  kind: 'pillar',
  props: { height: 2.4 },
  children: [{ kind: 'lamp', at: [0, 0, 1.4] }],
});

// ---- The file. Hand-written, hand-editable, and small because defaults
// are omitted and numbers are rounded on the way out.
const FILE = {
  format: 'gama.level',
  version: 1,
  name: 'Yard',
  seed: 20,
  entities: [
    { id: 'c1', kind: 'crate', at: [-2, 0, 2] },
    { id: 'c2', kind: 'crate', at: [-0.6, 0, 3.4], rot: 0.6, props: { color: 0x9c6b3f } },
    { id: 'p1', kind: 'lit-corner', at: [4, 0, -3] },
    { id: 't1', kind: 'tree', at: [-6, 0, -4] },
    { id: 't2', kind: 'tree', at: [6, 0, 5], scale: 1.4 },
    { id: 'old-statue', kind: 'statue', at: [0, 0, -6], props: { pose: 'triumphant' } },
  ],
};

const level = Level.parse(FILE);
const live = level.instantiate(catalog, scene);

// ---- The editor.
const panel = document.createElement('pre');
panel.style.cssText = 'position:fixed;top:0;right:0;width:min(38vw,340px);height:100vh;' +
  'overflow:auto;margin:0;padding:14px;background:rgba(12,16,22,.88);color:#cfe3ff;' +
  'font:11px/1.5 ui-monospace,Menlo,monospace;border-left:1px solid #ffffff22;' +
  'backdrop-filter:blur(8px);white-space:pre-wrap;';
document.body.appendChild(panel);

const help = document.createElement('div');
help.style.cssText = 'position:fixed;left:14px;bottom:14px;color:#eaf1f8;' +
  'font:13px/1.6 system-ui;text-shadow:0 1px 4px #000a;';
document.body.appendChild(help);

let picked = 0;
// Roots only: a prefab's child lamp moves with its pillar, so selecting it
// separately would be a lie about what the file says.
const pickable = live.objects.filter((p) => !p.id.includes('/'));
// Remember each mesh's authored emissive before anything tints it.
for (const o of pickable) {
  o.object.traverse((c) => {
    if (c.isMesh && c.material?.emissive) c.userData.baseEmissive = c.material.emissive.getHex();
  });
}
const ray = new Raycaster();
const pointer = new Vector2();

const refresh = () => {
  const data = live.serialize();
  panel.textContent = JSON.stringify(data, null, 2);
  const p = pickable[picked];
  help.innerHTML = 'selected <b>' + p.id + '</b> (' + p.kind + ')  ·  ' +
    'click / Tab to select · arrows move · Q E turn · + − scale';
  // Highlight by tinting the selection's own materials — cloned on first
  // touch, because these factories share one material per colour and a
  // shared material tints every crate in the yard at once.
  for (const o of pickable) {
    o.object.traverse((c) => {
      if (!c.isMesh) return;
      if (!c.userData.own) { c.material = c.material.clone(); c.userData.own = true; }
      const on = o === p;
      c.material.emissive.setHex(on ? 0x2b5cff : c.userData.baseEmissive ?? 0x000000);
      c.material.emissiveIntensity = on ? 0.55 : 1;
    });
  }
};

addEventListener('pointerdown', (e) => {
  if (e.clientX > innerWidth - Math.min(innerWidth * 0.38, 340)) return; // the panel
  pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(pointer, game.camera);
  for (const hit of ray.intersectObjects(pickable.map((p) => p.object), true)) {
    const index = pickable.findIndex((p) => {
      let node = hit.object;
      while (node) { if (node === p.object) return true; node = node.parent; }
      return false;
    });
    if (index >= 0) { picked = index; refresh(); return; }
  }
});

addEventListener('keydown', (e) => {
  const o = pickable[picked].object;
  const step = e.shiftKey ? 0.05 : 0.25;
  const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0],
                  ArrowUp: [0, -step], ArrowDown: [0, step] };
  if (moves[e.code]) { o.position.x += moves[e.code][0]; o.position.z += moves[e.code][1]; }
  else if (e.code === 'KeyQ') o.rotation.y += 0.1;
  else if (e.code === 'KeyE') o.rotation.y -= 0.1;
  else if (e.code === 'Equal' || e.code === 'NumpadAdd') o.scale.multiplyScalar(1.1);
  else if (e.code === 'Minus' || e.code === 'NumpadSubtract') o.scale.multiplyScalar(1 / 1.1);
  else if (e.code === 'Tab') picked = (picked + 1) % pickable.length;
  else return;
  e.preventDefault();
  refresh();
});

refresh();
game.start();

window.levelDebug = () => {
  const data = live.serialize();
  return {
    built: live.objects.length,
    inFile: data.entities.length,
    // The unknown kind could not be built, and is still in the file.
    keptUnknown: data.entities.some((e) => e.kind === 'statue'),
    selected: pickable[picked].id,
    selectedAt: data.entities.find((e) => e.id === pickable[picked].id).at,
    selectedRot: data.entities.find((e) => e.id === pickable[picked].id).rot,
    json: JSON.stringify(data).length,
    // Where each root sits on screen, 0..1 across the canvas. An editor
    // wants this for gizmos and labels; here it lets a test click exactly.
    spots: pickable.map((p) => {
      const v = p.object.position.clone().project(game.camera);
      return { id: p.id, x: (v.x + 1) / 2, y: (1 - v.y) / 2 };
    }),
    draws: game.renderer.info.render.calls,
  };
};`,
  },
  {
    id: 'assets',
    title: 'Assets: a manifest, groups & instancing',
    group: 'Core',
    code: `// AN ASSET PIPELINE. Every model, texture and sound here is a real file
// fetched over HTTP, described by a manifest that scripts/assets.mjs
// generated: keys, types, byte sizes, content hashes, groups.
//
// Watch the bar. It is weighted by BYTES from the manifest, so it is honest
// from the first frame instead of counting files and lying about the last
// 40%. Then: "town" is loaded up front, "ruins" only when you ask, and
// releasing it frees the geometry — the counter proves it.
import { AmbientLight, DirectionalLight, Fog, Color, Mesh, MeshStandardMaterial,
         PlaneGeometry, RepeatWrapping, SRGBColorSpace, Vector3 } from 'three';
import { Catalog, Game, Level, openAssets } from 'gama3d';

const game = new Game();
const scene = game.world.scene;
scene.background = new Color(0x121821);
scene.fog = new Fog(0x121821, 40, 90);
game.camera.position.set(0, 9, 16);
game.camera.lookAt(0, 1.2, 0);
scene.add(new AmbientLight(0xbfd4e8, 1.4));
const sun = new DirectionalLight(0xfff0d8, 2.2);
sun.position.set(12, 18, 8);
scene.add(sun);

// ---- the loading bar, byte-weighted -----------------------------------
const ui = document.createElement('div');
ui.style.cssText = 'position:fixed;inset:auto 0 0 0;padding:14px 18px;background:#0b0e14dd;' +
  'color:#dbe4f0;font:13px/1.6 ui-monospace,Menlo,monospace;border-top:1px solid #262d3b';
ui.innerHTML =
  '<div id="line">reading the manifest…</div>' +
  '<div style="height:6px;background:#1d2531;border-radius:3px;margin:8px 0 10px;overflow:hidden">' +
  '<div id="bar" style="height:100%;width:0;background:#4d8dff;transition:width .1s"></div></div>' +
  '<button id="ruins">Load the ruins</button> <button id="drop" disabled>Release them</button>' +
  ' <span id="mem" style="color:#8593a8"></span>';
document.body.appendChild(ui);
const $ = (id) => document.getElementById(id);

const kb = (n) => (n / 1024).toFixed(1) + ' kB';
const memo = () => {
  const m = game.renderer.info.memory;
  $('mem').textContent = \`· \${m.geometries} geometries, \${m.textures} textures in the driver\`;
};

// ---- open the library --------------------------------------------------
// One fetch for the manifest; the base defaults to the directory it sat in,
// so no key in this file carries a path.
const library = await openAssets('./assets/manifest.json');

library.onProgress = (p) => {
  $('bar').style.width = (p.fraction * 100).toFixed(1) + '%';
  $('line').textContent = p.fraction < 1
    ? \`loading \${p.current ?? ''} — \${kb(p.bytesLoaded)} of \${kb(p.bytesTotal)} (\${(p.fraction * 100) | 0}%)\`
    : \`\${p.loaded} assets, \${kb(p.bytesTotal)}\`;
};

// The whole point of a manifest: the cost is known BEFORE the request.
$('line').textContent = \`town is \${kb(library.weightOf('town'))} across \` +
  \`\${library.resolve('town').length} files — loading…\`;
await library.load('town', 'ui/chime');

// ---- the ground uses a loaded texture ---------------------------------
const planks = library.texture('town/planks');
planks.wrapS = planks.wrapT = RepeatWrapping;
planks.repeat.set(12, 12);
planks.colorSpace = SRGBColorSpace;
const ground = new Mesh(new PlaneGeometry(70, 70), new MeshStandardMaterial({ map: planks }));
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// ---- a level file that places LOADED MODELS ---------------------------
// \`library.factory(key)\` is a Catalog factory, so a level file can place a
// glTF exactly the way it places a procedural prop. Forty crates are one
// geometry: the clones share it, and the factory's dispose is a no-op so
// deleting one placement cannot blank the others.
const catalog = new Catalog()
  .define('crate', library.factory('town/crate'), { label: 'Crate', group: 'Town' })
  .define('lamp', library.factory('town/lamp'), { label: 'Lamp', group: 'Town' });

const entities = [];
for (let i = 0; i < 36; i++) {
  const a = (i / 36) * Math.PI * 2;
  const r = 6 + (i % 4) * 1.6;
  entities.push({
    id: 'crate-' + i,
    kind: 'crate',
    at: [+(Math.sin(a) * r).toFixed(2), (i % 3) * 1.02, +(Math.cos(a) * r).toFixed(2)],
    rot: +(a * 2).toFixed(3),
  });
}
for (let i = 0; i < 6; i++) {
  const a = (i / 6) * Math.PI * 2 + 0.3;
  entities.push({ id: 'lamp-' + i, kind: 'lamp', at: [+(Math.sin(a) * 14).toFixed(2), 0, +(Math.cos(a) * 14).toFixed(2)] });
}
const live = Level.parse({ format: 'gama.level', version: 1, name: 'Yard', seed: 4, entities })
  .instantiate(catalog, scene);
memo();

// ---- a group loaded on demand, and released again ---------------------
let ruins = null;
$('ruins').onclick = async () => {
  $('ruins').disabled = true;
  await library.load('ruins');
  const statue = library.instance('ruins/statue');
  statue.position.set(0, 0, 0);
  const archA = library.instance('ruins/broken-arch');
  archA.position.set(-9, 0, -9);
  const archB = library.instance('ruins/broken-arch');
  archB.position.set(9, 0, -9);
  archB.rotation.y = 0.6;
  ruins = [statue, archA, archB];
  scene.add(...ruins);
  $('drop').disabled = false;
  memo();
};

$('drop').onclick = () => {
  for (const object of ruins ?? []) object.removeFromParent();
  ruins = null;
  // The clones came from the library, so THIS is what frees the geometry.
  const freed = library.release('ruins');
  $('line').textContent = 'released: ' + freed.join(', ');
  $('ruins').disabled = false;
  $('drop').disabled = true;
  setTimeout(memo, 100); // the driver drops them on the next frame
};

game.onUpdate((t) => {
  const spin = t.elapsed * 0.12;
  game.camera.position.set(Math.sin(spin) * 20, 9.5, Math.cos(spin) * 20);
  game.camera.lookAt(0, 1.4, 0);
});
game.start();
setInterval(memo, 500);

window.assetDebug = () => ({
  keys: library.keys.length,
  groups: library.groups,
  townBytes: library.weightOf('town'),
  loaded: library.keys.filter((k) => library.isLoaded(k)),
  placed: live.objects.length,
  // One geometry per distinct model, however many placements there are.
  geometries: game.renderer.info.memory.geometries,
  textures: game.renderer.info.memory.textures,
  triangles: game.renderer.info.render.triangles,
  draws: game.renderer.info.render.calls,
  ruinsLoaded: library.isLoaded('ruins/statue'),
  chime: library.audio('ui/chime')?.duration ?? null,
});`,
  },
  {
    id: 'net',
    title: 'Multiplayer: prediction & interpolation',
    group: 'Core',
    code: `// AUTHORITATIVE MULTIPLAYER, ALL IN ONE TAB. There is a real server here —
// it owns every entity and runs the only copy of the rules — plus two real
// clients, each on its own simulated link. Turn the latency up.
//
// SOLID = what the client draws.  WIREFRAME = where the server actually is.
// Blue is you (predicted, so it runs AHEAD of the server). Orange is the
// other player (interpolated, so it runs BEHIND). Untick either box to see
// what the mechanism was buying you.
import { AmbientLight, BoxGeometry, CapsuleGeometry, CylinderGeometry, Color,
         DirectionalLight, EdgesGeometry, Group, LineBasicMaterial, LineSegments,
         Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import { Game } from 'gama3d';
import { Link, NetClient, NetServer } from 'gama3d/net';

// ---- the rules. ONE function, run by the server and by every client. -----
// The server runs it to be right; a client runs it to not wait 100 ms to
// find out. That is the whole of prediction.
const move = (state, input, dt) => {
  const speed = 7;
  state.x += (input?.x ?? 0) * speed * dt;
  state.z += (input?.z ?? 0) * speed * dt;
  const edge = 9;
  state.x = Math.max(-edge, Math.min(edge, state.x));
  state.z = Math.max(-edge, Math.min(edge, state.z));
  if (input?.x || input?.z) state.yaw = Math.atan2(input.x, input.z);
};

// ---- the server ----------------------------------------------------------
const server = new NetServer({ apply: move, tickRate: 30, sendRate: 12 });
server.onJoin = (client) => {
  const at = client.id === 'p1' ? [-4, 2] : [4, -2];
  server.spawn(client.id, { x: at[0], z: at[1], yaw: 0 }, {
    owner: client.id,
    meta: { name: client.id === 'p1' ? 'you' : 'them' },
  });
};

// ---- two links, two clients ---------------------------------------------
const mine = new Link({ latency: 90, jitter: 20, loss: 0.02, seed: 3 });
const theirs = new Link({ latency: 60, jitter: 10, seed: 11 });
server.accept(mine.server, 'p1');
server.accept(theirs.server, 'p2');

const me = new NetClient(mine.client, { apply: move, angleFields: ['yaw'], interpolationDelay: 140 });
const them = new NetClient(theirs.client, { apply: move, angleFields: ['yaw'] });

// ---- the scene ----------------------------------------------------------
const game = new Game();
const scene = game.world.scene;
scene.background = new Color(0x0d1219);
game.camera.position.set(0, 15, 15);
game.camera.lookAt(0, 0.5, -1.5);
scene.add(new AmbientLight(0xbcd0e6, 1.5));
const sun = new DirectionalLight(0xffffff, 1.6);
sun.position.set(8, 20, 10);
scene.add(sun);

const floor = new Mesh(new PlaneGeometry(22, 22),
  new MeshStandardMaterial({ color: 0x27313f, roughness: 1 }));
floor.rotation.x = -Math.PI / 2;
scene.add(floor);
for (let i = -10; i <= 10; i += 2) {
  for (const [a, b] of [[[i, -10], [i, 10]], [[-10, i], [10, i]]]) {
    const line = new Mesh(new BoxGeometry(Math.abs(b[0] - a[0]) || 0.04, 0.01, Math.abs(b[1] - a[1]) || 0.04),
      new MeshStandardMaterial({ color: 0x334357 }));
    line.position.set((a[0] + b[0]) / 2, 0.012, (a[1] + b[1]) / 2);
    scene.add(line);
  }
}

const HUES = { p1: 0x4d8dff, p2: 0xff9a4d };
const bodies = new Map();
const ghosts = new Map();

function bodyFor(id) {
  let body = bodies.get(id);
  if (body) return body;
  const group = new Group();
  const colour = HUES[id] ?? 0xcccccc;
  const capsule = new Mesh(new CapsuleGeometry(0.5, 1, 6, 12),
    new MeshStandardMaterial({ color: colour, roughness: 0.5 }));
  capsule.position.y = 1;
  const nose = new Mesh(new CylinderGeometry(0.001, 0.22, 0.7, 8),
    new MeshStandardMaterial({ color: colour, emissive: colour, emissiveIntensity: 0.5 }));
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, 1, 0.6);
  group.add(capsule, nose);
  scene.add(group);
  bodies.set(id, group);
  return group;
}

/** A wireframe box at the server's real position: the truth, for comparison. */
function ghostFor(id) {
  let ghost = ghosts.get(id);
  if (ghost) return ghost;
  const edges = new LineSegments(new EdgesGeometry(new BoxGeometry(1.3, 2.1, 1.3)),
    new LineBasicMaterial({ color: HUES[id] ?? 0xffffff, transparent: true, opacity: 0.9 }));
  edges.position.y = 1;
  const group = new Group();
  group.add(edges);
  scene.add(group);
  ghosts.set(id, group);
  return group;
}

// ---- the controls -------------------------------------------------------
const panel = document.createElement('div');
panel.style.cssText = 'position:fixed;inset:auto 0 0 0;padding:8px 12px;background:#0b0e14e6;' +
  'color:#dbe4f0;font:11px/1.5 ui-monospace,Menlo,monospace;border-top:1px solid #262d3b;' +
  'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2px 16px;white-space:nowrap';
panel.innerHTML =
  '<label>lag <input id=lat type=range min=0 max=300 step=10 value=90 style="width:78px"> <b id=latv>90</b>ms</label>' +
  '<label>jitter <input id=jit type=range min=0 max=120 step=5 value=20 style="width:64px"> <b id=jitv>20</b>ms</label>' +
  '<label>loss <input id=los type=range min=0 max=30 step=1 value=2 style="width:64px"> <b id=losv>2</b>%</label>' +
  '<label><input id=pred type=checkbox checked> predict my own moves</label>' +
  '<label><input id=interp type=checkbox checked> interpolate the other player</label>' +
  '<label><input id=drive type=checkbox checked> auto-drive (or use arrow keys)</label>' +
  '<div id=r1 style="grid-column:1/-1;white-space:normal;color:#8fa8c8"></div>';
document.body.appendChild(panel);
const $ = (id) => document.getElementById(id);

const bind = (slider, readout, set) => {
  const apply = () => { $(readout).textContent = $(slider).value; set(Number($(slider).value)); };
  $(slider).addEventListener('input', apply);
  apply();
};
bind('lat', 'latv', (v) => { mine.latency = v; });
bind('jit', 'jitv', (v) => { mine.jitter = v; });
bind('los', 'losv', (v) => { mine.loss = v / 100; });
$('pred').addEventListener('change', () => { me.predict = $('pred').checked; });
$('interp').addEventListener('change', () => { me.interpolate = $('interp').checked; });

// ---- input --------------------------------------------------------------
const held = new Set();
addEventListener('keydown', (e) => {
  if (e.code.startsWith('Arrow')) { held.add(e.code); e.preventDefault(); }
});
addEventListener('keyup', (e) => held.delete(e.code));

let clock = 0;
game.onUpdate((time) => {
  const dt = Math.min(0.05, time.delta);
  clock += dt;

  // You: arrow keys, or a figure-of-eight so the demo shows itself.
  let ax = (held.has('ArrowRight') ? 1 : 0) - (held.has('ArrowLeft') ? 1 : 0);
  let az = (held.has('ArrowDown') ? 1 : 0) - (held.has('ArrowUp') ? 1 : 0);
  if (!ax && !az && $('drive').checked) {
    ax = Math.cos(clock * 1.3);
    az = Math.cos(clock * 2.1) * 0.8;
  }
  me.setInput({ x: ax, z: az });
  // Them: a bot, circling the other way.
  them.setInput({ x: Math.cos(-clock * 1.5 + 2), z: Math.sin(-clock * 1.5 + 2) });

  // The links carry packets; the server and the clients each run their own
  // clock. Nothing here shares state — it all goes over the wire.
  mine.advance(dt);
  theirs.advance(dt);
  server.update(dt);
  me.update(dt);
  them.update(dt);

  // Draw the world as MY client believes it to be.
  for (const view of me.entities) {
    const body = bodyFor(view.id);
    body.position.set(view.state.x, 0, view.state.z);
    body.rotation.y = view.state.yaw ?? 0;
  }
  // …and the server's truth alongside it.
  for (const id of server.ids) {
    const truth = server.state(id);
    const ghost = ghostFor(id);
    ghost.position.set(truth.x, 0, truth.z);
  }

  const lead = leadOf('p1');
  const behind = leadOf('p2');
  // Distance from the wireframe, either way round: with prediction on you
  // are ahead of it, with prediction off you sit on it.
  $('r1').innerHTML =
    \`rtt <b>\${me.rtt.toFixed(0)}</b>ms · unacked <b>\${me.pending}</b> · server queue \` +
    \`<b>\${me.serverQueue}</b> · rate ×<b>\${me.rateScale.toFixed(2)}</b> · corrections \` +
    \`<b>\${me.corrections}</b> · dropped <b>\${mine.dropped}</b>/<b>\${mine.sent}</b>\` +
    \` &nbsp;&nbsp;→ &nbsp;you are <b>\${lead.toFixed(2)}</b>m from your own wireframe,\` +
    \` they are <b>\${behind.toFixed(2)}</b>m from theirs\`;
});

/** Distance between what my client draws and where the server really is. */
function leadOf(id) {
  const view = me.entities.find((e) => e.id === id);
  const truth = server.state(id);
  if (!view || !truth) return 0;
  return Math.hypot(view.state.x - truth.x, view.state.z - truth.z);
}

game.start();

window.netDebug = () => ({
  ready: me.ready && them.ready,
  players: me.entities.length,
  mine: me.entities.filter((e) => e.mine).length,
  rtt: Math.round(me.rtt),
  pending: me.pending,
  serverQueue: me.serverQueue,
  corrections: me.corrections,
  dropped: mine.dropped,
  sent: mine.sent,
  bytesIn: me.bytesIn,
  // The two numbers the demo exists to show: prediction runs ahead of the
  // server, interpolation runs behind it.
  leadOwn: Number(leadOf('p1').toFixed(3)),
  lagOther: Number(leadOf('p2').toFixed(3)),
  serverTick: server.tick,
  draws: game.renderer.info.render.calls,
});`,
  },
  {
    id: 'dialogue',
    title: 'Dialogue: a conversation as data',
    group: 'Core',
    code: `// A CONVERSATION AS DATA. The script below is JSON — no functions in it —
// which is what lets lintDialogue() read it and tell you about a dangling
// link or a misspelt variable before a player ever finds one.
//
// Try: pay the toll with too few coins (the option is HIDDEN), watch the
// locked hint that tells you what you need, ask his name twice (the second
// time the option is gone), then SAVE mid-conversation and reload.
import { AmbientLight, BoxGeometry, CapsuleGeometry, Color, CylinderGeometry,
         DirectionalLight, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import { Game, Dialogue, defineDialogue, lintDialogue } from 'gama3d';

// ---- the content. Data, not code. ----------------------------------------
const script = defineDialogue({
  version: 1,
  start: 'hail',
  // Declared variables. Anything read but not declared and never written is
  // a typo, and the linter says so — that is what the JSON buys.
  vars: { coins: 3, toldName: false, paid: false },
  nodes: {
    hail: {
      speaker: 'Keeper',
      text: 'Toll for the bridge. Five coins.',
      choices: [
        // ONE choice, locked rather than hidden: greyed out when you cannot
        // afford it, so the price is visible instead of secret. A locked twin
        // of a hidden option looks tempting and is a trap — when the
        // condition passes, BOTH rows appear and one of them goes nowhere.
        { text: 'Here you are. (5 coins)', to: 'paid', locked: true,
          if: { gte: ['coins', 5] },
          do: [{ inc: ['coins', -5] }, { set: ['paid', true] }, { emit: 'paid-toll' }] },
        // Hidden, not locked: he should not advertise the shortcut.
        { text: 'Slip past while he yawns.', to: 'sneak', if: { gte: ['coins', 99] } },
        { text: "Who's asking?", to: 'name', if: { not: { is: 'toldName' } } },
        { text: 'What is on the other side?', to: 'other' },
        { text: 'I will go around.', tag: 'leave' },
      ],
    },
    name: {
      speaker: 'Keeper',
      text: 'The keeper. Same as yesterday, same as tomorrow.',
      do: [{ set: ['toldName', true] }],
      to: 'hail',
    },
    other: {
      speaker: 'Keeper',
      text: 'Havenbrook. Bread, a well, and people who pay their tolls.',
      to: 'hail',
    },
    paid: {
      speaker: 'Keeper',
      text: 'Mind the third plank. It remembers the river.',
      do: [{ emit: 'crossed' }],
    },
    // Unreachable in practice at three coins — and the linter counts it as
    // reachable because reachability ignores conditions, which is the honest
    // answer: the link exists, whether or not a player can satisfy it.
    sneak: {
      speaker: 'Keeper',
      text: '...I can hear you, you know.',
      to: 'hail',
    },
  },
});

// ---- the lint. This runs at load; in a real project it is a CI step. -----
const report = lintDialogue(script);

const game = new Game();
game.world.scene.background = new Color(0x1b2432);
game.world.scene.add(new AmbientLight(0xffffff, 0.55));
const sun = new DirectionalLight(0xffe6bd, 1.5);
sun.position.set(6, 12, 5);
game.world.scene.add(sun);
game.camera.position.set(0.2, 2.9, 7.6);
game.camera.lookAt(0, 1.5, -1.6);

const water = new Mesh(new PlaneGeometry(60, 60),
  new MeshStandardMaterial({ color: 0x1d3b52, roughness: 0.25, metalness: 0.35 }));
water.rotation.x = -Math.PI / 2;
game.world.scene.add(water);

// A bridge, a keeper, and you.
for (let i = 0; i < 7; i++) {
  const plank = new Mesh(new BoxGeometry(3.2, 0.16, 0.7),
    new MeshStandardMaterial({ color: i === 2 ? 0x7c4a2d : 0x9a6b43, roughness: 0.9 }));
  plank.position.set(0, 0.9, -1.2 - i * 0.85);
  game.world.scene.add(plank);
}
for (const side of [-1.5, 1.5]) {
  const rail = new Mesh(new CylinderGeometry(0.07, 0.07, 6.4, 6),
    new MeshStandardMaterial({ color: 0x6b4a30, roughness: 0.95 }));
  rail.rotation.x = Math.PI / 2;
  rail.position.set(side, 1.5, -3.8);
  game.world.scene.add(rail);
}
const keeper = new Mesh(new CapsuleGeometry(0.42, 1.0, 6, 12),
  new MeshStandardMaterial({ color: 0xc98f5a, roughness: 0.7 }));
keeper.position.set(-0.9, 1.72, -0.4);
game.world.scene.add(keeper);
const you = new Mesh(new CapsuleGeometry(0.4, 0.95, 6, 12),
  new MeshStandardMaterial({ color: 0x60a5fa, roughness: 0.7 }));
you.position.set(1.1, 1.68, 1.6);
game.world.scene.add(you);

// ---- presentation is entirely the caller's ------------------------------
const ui = document.createElement('div');
ui.style.cssText = 'position:absolute;left:12px;right:12px;bottom:12px;font:13px/1.5 ' +
  'system-ui,sans-serif;color:#e8eef6;background:rgba(12,18,28,.86);border:1px solid ' +
  '#2b3a4d;border-radius:10px;padding:12px 14px;max-width:640px;margin:0 auto';
document.body.appendChild(ui);

const purse = document.createElement('div');
purse.style.cssText = 'position:absolute;top:12px;left:12px;font:12px/1.6 system-ui,' +
  'sans-serif;color:#cfe0f5;background:rgba(12,18,28,.86);border:1px solid #2b3a4d;' +
  'border-radius:8px;padding:8px 10px';
document.body.appendChild(purse);

let events = [];
let talk = null;

function render() {
  const line = talk.line;
  purse.innerHTML = '<b>coins</b> ' + talk.vars.coins +
    ' &nbsp; <b>lines</b> ' + talk.counts.lines +
    ' &nbsp; <b>choices</b> ' + talk.counts.choices +
    '<br><span style="opacity:.7">lint: ' + report.counts.nodes + ' nodes, ' +
    report.counts.reachable + ' reachable, ' + report.errors + ' errors</span>' +
    (events.length ? '<br><span style="color:#86efac">emitted: ' + events.join(', ') + '</span>' : '');

  if (!line) {
    ui.innerHTML = '<div style="opacity:.75">— the conversation is over —</div>';
    const again = document.createElement('button');
    again.textContent = 'Talk again';
    again.style.cssText = 'margin-top:8px;font:12px system-ui;padding:5px 10px;' +
      'background:#1f2f43;color:#e8eef6;border:1px solid #3a4f68;border-radius:6px;cursor:pointer';
    again.onclick = () => { begin(3); };
    ui.appendChild(again);
    return;
  }

  ui.innerHTML = '<div style="color:#fbbf24;font-weight:600">' + (line.speaker || '-') +
    '</div><div style="margin:4px 0 10px">' + line.text + '</div>';

  const choices = talk.choices;
  if (choices.length === 0) {
    const next = document.createElement('button');
    next.textContent = 'Continue';
    next.style.cssText = 'font:12px system-ui;padding:5px 10px;background:#1f2f43;' +
      'color:#e8eef6;border:1px solid #3a4f68;border-radius:6px;cursor:pointer';
    next.onclick = () => { talk.advance(); render(); };
    ui.appendChild(next);
  }
  for (const choice of choices) {
    const button = document.createElement('button');
    button.textContent = (choice.enabled ? '> ' : 'x ') + choice.text;
    button.disabled = !choice.enabled;
    button.style.cssText = 'display:block;width:100%;text-align:left;margin:3px 0;' +
      'font:12px system-ui;padding:6px 9px;border-radius:6px;cursor:' +
      (choice.enabled ? 'pointer' : 'not-allowed') + ';background:' +
      (choice.enabled ? '#1f2f43' : '#171f2b') + ';color:' +
      (choice.enabled ? '#e8eef6' : '#7b8798') + ';border:1px solid ' +
      (choice.enabled ? '#3a4f68' : '#252f3d');
    button.onclick = () => { talk.choose(choice.index); render(); };
    ui.appendChild(button);
  }
}

function begin(coins) {
  events = [];
  talk = new Dialogue(script, {
    vars: { coins: coins },
    onEvent: (name) => { events.push(name); },
  });
  talk.start();
  render();
}
begin(3);

// Controls: change the purse to watch conditions gate, and prove the save.
const tools = document.createElement('div');
tools.style.cssText = 'position:absolute;top:12px;right:12px;display:flex;gap:6px';
for (const [label, fn] of [
  ['coins 3', () => begin(3)],
  ['coins 7', () => begin(7)],
  ['save + reload', () => {
    const saved = JSON.parse(JSON.stringify(talk.toJSON()));
    talk = new Dialogue(script, { onEvent: (name) => { events.push(name); } });
    talk.restore(saved);
    render();
  }],
]) {
  const b = document.createElement('button');
  b.textContent = label;
  b.style.cssText = 'font:12px system-ui;padding:5px 9px;background:#1f2f43;color:#e8eef6;' +
    'border:1px solid #3a4f68;border-radius:6px;cursor:pointer';
  b.onclick = fn;
  tools.appendChild(b);
}
document.body.appendChild(tools);

game.start();

// The probe the verifier reads. Exact integers, so a conversation is testable
// as a WALK rather than as a screenshot.
window.dialogueDebug = () => ({
  at: talk.line ? talk.line.id : null,
  speaker: talk.line ? talk.line.speaker : null,
  shown: talk.choices.length,
  enabled: talk.choices.filter((c) => c.enabled).length,
  locked: talk.choices.filter((c) => !c.enabled).length,
  coins: talk.vars.coins,
  paid: talk.vars.paid === true,
  lines: talk.counts.lines,
  choices: talk.counts.choices,
  events: talk.counts.events,
  emitted: events.slice(),
  done: talk.done,
  lintNodes: report.counts.nodes,
  lintReachable: report.counts.reachable,
  lintErrors: report.errors,
  lintWarnings: report.warnings,
  draws: game.renderer.info.render.calls,
});`,
  },
  {
    id: 'railway',
    title: 'Railway: the driver',
    group: 'Gameplay',
    code: `// A train is the one vehicle that does not steer. Its entire
// position is ONE NUMBER — how far along the line — so the driver's
// job is not "where do I go" but "how fast, and can I still stop in
// time". RailController owns that number and the schedule.
//
// The track below is the EXAMPLE'S OWN, built from a curve and a
// cumulative length table, because the controller wants nothing from
// a track but its length. Watch the readout: the train starts braking
// a long way out, because at line speed it needs ~100 m to stop.
import { Game, RailController, Hud } from 'gama3d';
import { Mesh, InstancedMesh, MeshStandardMaterial, BoxGeometry,
         CylinderGeometry, CatmullRomCurve3, TubeGeometry, Group,
         Object3D, Vector3 } from 'three';
${scene(0, 56, 112, 11)}

// A low fill from the camera's side: the prelude lights for a single prop
// at the origin, and this is a 120 m oval.
const fill = new DirectionalLight(0xbcd0e8, 0.5);
fill.position.set(-30, 26, 60);
game.world.scene.add(fill);

const hud = new Hud();

// ── The line ────────────────────────────────────────────────────────
// Resampled to EQUAL ARC LENGTH once, up front. A curve's parameter is
// not distance — on a bend it covers far less ground per unit t than
// on a straight — so a train driven on t would speed up and slow down
// on every corner for no reason at all.
const ROUTE = [
  new Vector3(-38, 0, -30), new Vector3(0, 0, -37), new Vector3(38, 0, -30),
  new Vector3(50, 0, 0), new Vector3(38, 0, 30), new Vector3(0, 0, 37),
  new Vector3(-38, 0, 30), new Vector3(-50, 0, 0),
];
const curve = new CatmullRomCurve3(ROUTE, true, 'catmullrom', 0.5);
curve.arcLengthDivisions = 2000;
const N = 480;
const spaced = curve.getSpacedPoints(N);
const cum = [0];
for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + spaced[i].distanceTo(spaced[i - 1]));
const LENGTH = cum[N];

// Binary search the table: distance in, place out.
const at = (d, out) => {
  const x = ((d % LENGTH) + LENGTH) % LENGTH;
  let lo = 1, hi = N;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] < x) lo = mid + 1; else hi = mid; }
  const span = Math.max(1e-6, cum[lo] - cum[lo - 1]);
  return out.copy(spaced[lo - 1]).lerp(spaced[lo], (x - cum[lo - 1]) / span);
};

const UP = new Vector3(0, 1, 0);
const railMat = new MeshStandardMaterial({ color: 0x99a4b0, roughness: 0.45, metalness: 0.65 });
for (const gauge of [0.75, -0.75]) {
  const pts = [];
  for (let i = 0; i < N; i++) {
    const p = spaced[i];
    const t = spaced[(i + 1) % N].clone().sub(p).normalize();
    pts.push(p.clone().add(t.cross(UP).multiplyScalar(gauge)).setY(0.16));
  }
  game.world.scene.add(new Mesh(new TubeGeometry(new CatmullRomCurve3(pts, true), 320, 0.085, 4, true), railMat));
}

// One InstancedMesh, whatever the length. A Mesh each would be 160
// draw calls for something nobody looks at directly.
const SLEEPERS = Math.floor(LENGTH / 2.4);
const sleepers = new InstancedMesh(new BoxGeometry(2.9, 0.16, 0.44),
  new MeshStandardMaterial({ color: 0x4a3d31, roughness: 0.95 }), SLEEPERS);
const dummy = new Object3D();
const pos = new Vector3(), ahead = new Vector3();
for (let i = 0; i < SLEEPERS; i++) {
  const d = (i / SLEEPERS) * LENGTH;
  at(d, pos); at(d + 0.6, ahead);
  dummy.position.copy(pos).setY(0.08);
  dummy.rotation.y = Math.atan2(ahead.x - pos.x, ahead.z - pos.z);
  dummy.updateMatrix();
  sleepers.setMatrixAt(i, dummy.matrix);
}
const ground = new Mesh(new BoxGeometry(240, 0.04, 200),
  new MeshStandardMaterial({ color: 0x2f3d2c }));
ground.position.y = 0.02; // above the prelude's grid, which it replaces
game.world.scene.add(ground, sleepers);

// ── The train ───────────────────────────────────────────────────────
const paint = (c, r = 0.6) => new MeshStandardMaterial({ color: c, roughness: r });
const ROOF = paint(0x9aa3ab, 0.78);
const WHEEL = paint(0x1b1f24, 0.8);
const build = (len, colour, loco) => {
  const g = new Group();
  const body = new Mesh(new BoxGeometry(3, 3.1, len), paint(colour));
  body.position.y = 2.1;
  const roof = new Mesh(new BoxGeometry(3.1, 0.32, len - 0.4), ROOF);
  roof.position.y = 3.75;
  g.add(body, roof);
  if (loco) {
    const cab = new Mesh(new BoxGeometry(3.1, 1.5, 3.6), paint(0x3a3f47));
    cab.position.set(0, 4.2, -len / 2 + 2.4);
    const stack = new Mesh(new CylinderGeometry(0.42, 0.52, 1.3, 10), paint(0x22262b));
    stack.position.set(0, 4.4, len / 2 - 1.8);
    g.add(cab, stack);
  }
  const wheels = [];
  for (const z of [-len * 0.34, len * 0.34]) {
    for (const x of [-1.32, 1.32]) {
      const w = new Mesh(new CylinderGeometry(0.62, 0.62, 0.24, 12), WHEEL);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.62, z);
      wheels.push(w);
      g.add(w);
    }
  }
  return { group: g, len, wheels };
};
const CONSIST = [build(15, 0x7d2b2b, true), build(16, 0x2f4f6f), build(16, 0x2f4f6f)];
for (const v of CONSIST) game.world.scene.add(v.group);

// A vehicle on a curve does not face the way the track faces under its
// middle: it is a rigid body on two bogies and faces the CHORD between
// them. Two extra samples per carriage, and it is the difference
// between a train and boxes shrink-wrapped to a spline.
const front = new Vector3(), back = new Vector3(), chord = new Vector3();
const place = (d) => {
  let cursor = 0;
  for (const v of CONSIST) {
    const centre = d - cursor - v.len / 2;
    at(centre + v.len * 0.34, front);
    at(centre - v.len * 0.34, back);
    v.group.position.lerpVectors(back, front, 0.5).setY(0);
    chord.subVectors(front, back).normalize();
    v.group.rotation.y = Math.atan2(chord.x, chord.z);
    // Wheels roll by DISTANCE, not by time. A wheel spun on a timer
    // slips every time the train changes speed — rail foot skate.
    for (const w of v.wheels) w.rotation.x = -d / 0.62;
    cursor += v.len + 1.2;
  }
};

// ── The platforms ───────────────────────────────────────────────────
const lateral = new Vector3();
const platform = (mark, colour) => {
  const c = new Vector3(), a = new Vector3(), m = new Vector3();
  at(mark - HALF_DECK, c); at(mark - HALF_DECK + 1, a);
  const yaw = Math.atan2(a.x - c.x, a.z - c.z);
  lateral.set(-Math.cos(yaw), 0, Math.sin(yaw));
  const deck = new Mesh(new BoxGeometry(8, 1.05, 52), paint(0x565c64, 0.95));
  deck.position.copy(c).addScaledVector(lateral, 6.2).setY(0.54);
  deck.rotation.y = yaw;
  // The stopping mark: where the train's FRONT should come to rest.
  at(mark, m);
  const stripe = new Mesh(new BoxGeometry(8.4, 0.08, 1.1), paint(colour, 0.5));
  stripe.position.copy(m).addScaledVector(lateral, 6.2).setY(1.06);
  stripe.rotation.y = yaw;
  game.world.scene.add(deck, stripe);
};
// A platform is a STRAIGHT 52 m box, so it belongs on a straight stretch of
// line — put one on a bend and it juts off tangentially, which is exactly why
// real platforms are built on the straight. The flat runs on this oval are at
// its ends, so the deck is centred there and the stop mark is at the far end
// of it: the mark is where the train's FRONT comes to rest.
const HALF_DECK = 26;
const STOPS = [
  { at: Math.round(LENGTH * 0.625) + HALF_DECK, dwell: 11, name: 'HAVENBROOK' },
  { at: Math.round(LENGTH * 0.125) + HALF_DECK, dwell: 11, name: 'ASHFORD' },
];
platform(STOPS[0].at, 0xfbbf24);
platform(STOPS[1].at, 0x38bdf8);

// ── The driver ──────────────────────────────────────────────────────
// Takes { length, loop } — a shape, not a package. SCENA's createTrack
// fits it exactly, and this hand-rolled table fits it just as well.
const driver = new RailController({ length: LENGTH, loop: true }, {
  topSpeed: 9, accel: 0.5, brake: 0.6, distance: 40,
});
driver.schedule(STOPS);

let arrivals = 0;
let worstOverrun = 0;
driver.onArrive((stop, overrun) => {
  arrivals++;
  worstOverrun = Math.max(worstOverrun, overrun);
  hud.banner(stop.name, 1.8);
});
driver.onDepart((stop) => hud.caption('Away from ' + stop.name));

game.onUpdate((t) => {
  // Stepped by hand rather than added to a GameObject, because the
  // controller moves nothing itself — it owns a number, and placing
  // the train is the game's job.
  driver.step(t.delta);
  place(driver.distance);

  const next = driver.nextStop;
  const eta = next ? driver.etaTo(next.at) : Infinity;
  hud.objective(next ? 'NEXT  ' + next.name + '  in ' +
    (Number.isFinite(eta) ? eta.toFixed(0) + ' s' : '—') : 'NO BOOKED STOPS');
  hud.prompt(driver.state.toUpperCase() + '  ·  ' + driver.speed.toFixed(1) +
    ' m/s  ·  needs ' + driver.stoppingDistance.toFixed(0) + ' m to stop' +
    (next ? '  ·  ' + Math.max(0, next.at - driver.distance).toFixed(0) + ' m to run' : ''));
  hud.update(t.delta);
});

window.railDebug = () => {
  const next = driver.nextStop;
  const eta = next ? driver.etaTo(next.at) : Infinity;
  return {
    state: driver.state,
    distance: Number(driver.distance.toFixed(2)),
    speed: Number(driver.speed.toFixed(2)),
    stoppingDistance: Number(driver.stoppingDistance.toFixed(1)),
    lineLength: Number(LENGTH.toFixed(1)),
    next: next ? next.name : null,
    eta: Number.isFinite(eta) ? Number(eta.toFixed(1)) : -1,
    arrivals,
    worstOverrun: Number(worstOverrun.toFixed(3)),
    draws: game.renderer.info.render.calls,
  };
};

game.start();`,
  },
  {
    id: 'forage',
    title: 'Utility AI: Charnov instead of a threshold',
    group: 'AI',
    code: `// WHEN TO STOP IS THE HALF NOBODY HAS A PRINCIPLE FOR.
//
// A utility system scores actions with response curves and weights, and the
// weights exist to trade off axes that were never comparable. Do not invent the
// axis: an action is worth something and it costs seconds, so utility is VALUE
// PER SECOND and there is nothing left to shape.
//
// The harder half is knowing when to quit the thing you are doing, and every
// implementation solves that with a threshold somebody picked — leave at 20%
// remaining, give up after 8 seconds.
//
// Behavioural ecology settled it in 1976. Charnov's MARGINAL VALUE THEOREM: quit
// when this patch's instantaneous rate of return has fallen to the average rate
// available in the environment as a whole. No sooner, no later.
//
// WHAT YOU ARE WATCHING
//
// Two foragers work the same ring of depleting bushes. The GREEN one runs the
// theorem, with the environment's rate MEASURED off its own life rather than
// handed to it — so it has no parameters at all. The AMBER one uses the rule
// everybody writes: leave when the bush is 54% picked, which is the OPTIMAL
// threshold for a short walk between bushes.
//
// The bar behind each is its harvest. The walk is long here, and the tuned
// threshold is now wrong: it quits bushes that are still paying better than
// anything it could walk to. Watch the green bar pull away.
//
// The bushes shrink as they are picked, and each forager's ring shows the rate
// it is currently getting. Nothing in the green agent was tuned.
import { BoxGeometry, CylinderGeometry, Mesh, MeshStandardMaterial,
         RingGeometry, DoubleSide, Vector3 } from 'three';
import { Game, Forager, depletingPatch, optimalStay } from 'gama3d';
${SCENE}

const AMOUNT = 10;      // berries a bush holds
const TAU = 5;          // seconds to take 63% of them
const TRAVEL = 12;      // seconds of walking between bushes — a LONG walk
const TUNED = 0.54;     // the optimal depletion threshold for a 2 s walk

// Two colonies, well apart, so nothing about the comparison is a coincidence
// of who got where first. Each has its own ring of bushes and its own walker.
const RING = 6;
const BUSHES = 6;
const spot = (home, i) => new Vector3(
  home + Math.cos((i / BUSHES) * Math.PI * 2) * RING,
  0,
  Math.sin((i / BUSHES) * Math.PI * 2) * RING
);

function colony(home, colour, bushColour) {
  const bushes = [];
  for (let i = 0; i < BUSHES; i++) {
    const mesh = new Mesh(
      new CylinderGeometry(0.85, 1.05, 1.8, 9),
      new MeshStandardMaterial({ color: bushColour, roughness: 0.85 })
    );
    const at = spot(home, i);
    mesh.position.set(at.x, 0.9, at.z);
    game.world.scene.add(mesh);
    bushes.push(mesh);
  }
  const body = new Mesh(
    new BoxGeometry(1, 2, 1),
    new MeshStandardMaterial({ color: colour, emissive: colour, emissiveIntensity: 0.25 })
  );
  body.position.set(home, 1, 0);
  const ring = new Mesh(
    new RingGeometry(1.4, 1.8, 32),
    new MeshStandardMaterial({ color: colour, side: DoubleSide, transparent: true, opacity: 0.55 })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(home, 0.04, 0);
  // The harvest, as a column standing at the front of its own colony.
  const bar = new Mesh(
    new BoxGeometry(1.4, 1, 1.4),
    new MeshStandardMaterial({ color: colour, emissive: colour, emissiveIntensity: 0.5 })
  );
  bar.position.set(home, 0, 11);
  game.world.scene.add(body, ring, bar);
  return { home, bushes, body, ring, bar };
}

const green = colony(-11, 0x54b070, 0x3d7a52);
const amber = colony(11, 0xd8a83a, 0x8a7130);

// THE THEOREM. No parameters: the environment's rate is MEASURED off its own
// life, not handed to it.
let greenIndex = 0;
const forager = new Forager(() => {
  greenIndex = (greenIndex + 1) % BUSHES;
  return depletingPatch(AMOUNT, TAU, TRAVEL);
});

// THE THRESHOLD, hand-rolled exactly as anybody would write it. Optimal for a
// 2 s walk, and this walk is twelve.
// t = -tau * ln(1 - fraction) is where that fraction has been picked.
const TUNED_STAY = -TAU * Math.log(1 - TUNED);
let amberIndex = 0;
let amberPhase = 'travelling';
let amberClock = TRAVEL;
let amberIn = 0;
let amberHarvest = 0;
let amberElapsed = 0;
const amberPatch = depletingPatch(AMOUNT, TAU);

// What the theorem says the right answer is here, for the readout.
const IDEAL = optimalStay(depletingPatch(AMOUNT, TAU, TRAVEL), TRAVEL);

let t = 0;
game.onUpdate(({ delta }) => {
  const dt = Math.min(0.05, delta);
  t += dt;

  forager.update(dt);

  amberElapsed += dt;
  if (amberPhase === 'travelling') {
    amberClock -= dt;
    if (amberClock <= 0) { amberPhase = 'foraging'; amberIn = -amberClock; }
  } else {
    const was = amberPatch.gain(amberIn);
    amberIn += dt;
    amberHarvest += amberPatch.gain(amberIn) - was;
    if (amberIn >= TUNED_STAY) {
      amberPhase = 'travelling'; amberClock = TRAVEL; amberIn = 0;
      amberIndex = (amberIndex + 1) % BUSHES;
    }
  }

  // Walk the body out to its bush and back; shrink the bush being worked.
  const place = (c, index, travelling, progress, inPatch) => {
    const at = spot(c.home, index);
    const p = travelling ? Math.min(1, Math.max(0, progress)) : 1;
    c.body.position.x = c.home + (at.x - c.home) * p;
    c.body.position.z = at.z * p;
    c.ring.position.set(c.body.position.x, 0.04, c.body.position.z);
    // A bush shows what is left of it: e^(-t/tau) of its berries.
    const left = travelling ? 1 : Math.exp(-inPatch / TAU);
    c.bushes[index].scale.y = 0.2 + 0.8 * left;
    c.bushes[index].position.y = 0.9 * c.bushes[index].scale.y;
  };
  place(green, greenIndex, forager.phase === 'travelling',
    1 - forager.remainingTravel / TRAVEL, forager.inPatch);
  place(amber, amberIndex, amberPhase === 'travelling', 1 - amberClock / TRAVEL, amberIn);

  // The harvest columns. Same scale for both, so the gap is the whole story.
  const grow = (bar, harvest) => {
    const h = Math.max(0.1, harvest * 0.22);
    bar.scale.y = h;
    bar.position.y = h / 2;
  };
  grow(green.bar, forager.harvest);
  grow(amber.bar, amberHarvest);

  // Hold both colonies in frame, tilted enough to read the columns.
  game.camera.position.set(0, 20, 26);
  game.camera.lookAt(0, 2, 2);
});

window.forageDebug = () => ({
  // The scene's own clock — a headless run is about a third of real time.
  clock: Number(t.toFixed(1)),
  travel: TRAVEL,
  // What the theorem says, and what the measured-rate forager actually does.
  theoremSays: Number(IDEAL.toFixed(3)),
  theorem: {
    harvest: Number(forager.harvest.toFixed(2)),
    rate: Number(forager.rate.toFixed(4)),
    // Measured off its own life. Nobody told it this number.
    environmentRate: Number(forager.environmentRate.toFixed(4)),
    marginal: Number(forager.marginal.toFixed(4)),
    visits: forager.visits,
    phase: forager.phase,
  },
  threshold: {
    leaveAt: Number(TUNED_STAY.toFixed(3)),
    harvest: Number(amberHarvest.toFixed(2)),
    rate: Number((amberHarvest / Math.max(1e-6, amberElapsed)).toFixed(4)),
  },
  // THE POINT OF THE SCENE: how much a threshold tuned for a shorter walk costs.
  ahead: Number((forager.harvest - amberHarvest).toFixed(2)),
  draws: game.renderer.info.render.calls,
});

game.start();
`,
  },
  {
    id: 'flow',
    title: 'Flow fields: the eight-way grid is 8.24% wrong',
    group: 'AI',
    code: `// ONE FLOOD, ANY NUMBER OF AGENTS — AND THE USUAL ONE IS BIASED.
//
// A flow field runs a single search outward from the goal and lets every agent
// read the local downhill direction. It is how any game with a crowd in it
// moves the crowd. The search is almost always Dijkstra over eight neighbours,
// costs 1 and sqrt(2), which looks exact and is not: the PATH is still made of
// eight directions, and a staircase is longer than the line it approximates.
//
// For a displacement at angle t the grid distance is cos t + (sqrt(2)-1) sin t,
// worst at tan t = sqrt(2)-1 — exactly 22.5 degrees — where the ratio is
//
//   sqrt(4 - 2*sqrt(2)) = 1.08239220...
//
// 8.24% too long. And it is a BIAS, not a resolution error: halve the cell and
// you get the same staircase twice as often.
//
// WHAT YOU ARE WATCHING
//
// The same crowd released twice from the same places, at a goal deliberately
// placed at 22.5 degrees. AMBER steers on the eight-way field. GREEN steers on
// a fast-marching solve of the eikonal equation |grad phi| = cost, which is
// Pythagoras instead of a staircase.
//
// Watch what happens to the SHAPE of each crowd. Nothing is in the way — the
// ground is empty — but the amber crowd collapses into a thin diagonal line,
// because the eight-way field funnels everyone onto the same few directions.
// The green crowd keeps its shape and walks at the goal.
//
// On open ground the eight-way field is up to 21 degrees off the true bearing.
// The eikonal one is under 6.
//
// The bars at the back are how many of each have arrived.
import { BoxGeometry, CylinderGeometry, InstancedMesh, Matrix4, Mesh,
         MeshStandardMaterial, Object3D, Vector3 } from 'three';
import { Game, FlowField, EIGHT_WAY_ANISOTROPY } from 'gama3d';
${SCENE}

const N = 81;              // cells
const CELL = 0.22;         // metres — two fields have to fit side by side
const SPAN = N * CELL;
const MID = SPAN / 2;
// The goal at 22.5 degrees from the start corner: the worst direction there is.
const R = SPAN * 0.34;
const GOAL = { x: MID + Math.cos(Math.PI / 8) * R, z: MID + Math.sin(Math.PI / 8) * R };

const eight = new FlowField({ width: N, height: N, cell: CELL, solver: 'grid8' });
const eikonal = new FlowField({ width: N, height: N, cell: CELL, solver: 'eikonal' });
for (const f of [eight, eikonal]) f.build([GOAL]);

// The two crowds. Same starts, same speed, different field.
const COUNT = 220;
const SPEED = 1.5;
function crowd(colour, field, lane) {
  // Each crowd is DRAWN in its own half of the world. They share one set of
  // field coordinates — the ground is uniform, so the same field at two offsets
  // is the same problem twice — and the first version put them on top of each
  // other, which showed one crowd and hid the comparison.
  const mesh = new InstancedMesh(
    new BoxGeometry(0.16, 0.5, 0.16),
    new MeshStandardMaterial({ color: colour, emissive: colour, emissiveIntensity: 0.25 }),
    COUNT
  );
  mesh.frustumCulled = false;
  game.world.scene.add(mesh);
  const agents = [];
  for (let i = 0; i < COUNT; i++) {
    // A block of starts well away from the goal, identical for both crowds.
    const row = Math.floor(i / 22), col = i % 22;
    agents.push({ x: 1.2 + col * 0.2, z: 1.2 + row * 0.2, done: false });
  }
  const post = new Mesh(
    new CylinderGeometry(0.28, 0.28, 2, 12),
    new MeshStandardMaterial({ color: 0xffffff, emissive: 0x888888 })
  );
  const offset = (lane - 0.5) * SPAN * 1.1;
  post.position.set(GOAL.x - SPAN / 2 + offset, 1, GOAL.z - SPAN / 2);
  game.world.scene.add(post);
  return { mesh, agents, field, arrived: 0, colour, offset, reset: () => {
    for (let i = 0; i < COUNT; i++) {
      const row = Math.floor(i / 22), col = i % 22;
      agents[i].x = 1.2 + col * 0.2; agents[i].z = 1.2 + row * 0.2; agents[i].done = false;
    }
  } };
}
const amber = crowd(0xd8a83a, eight, 0);
const green = crowd(0x54b070, eikonal, 1);

// Arrival bars at the back.
const bar = (colour, x) => {
  const m = new Mesh(
    new BoxGeometry(1.1, 1, 1.1),
    new MeshStandardMaterial({ color: colour, emissive: colour, emissiveIntensity: 0.5 })
  );
  m.position.set(x, 0, -SPAN / 2 - 2.5);
  game.world.scene.add(m);
  return m;
};
const amberBar = bar(0xd8a83a, -SPAN * 0.2);
const greenBar = bar(0x54b070, SPAN * 0.2);

const dummy = new Object3D();
let t = 0;
let laps = 0;

game.onUpdate(({ delta }) => {
  const dt = Math.min(0.05, delta);
  t += dt;
  for (const c of [amber, green]) {
    for (let i = 0; i < c.agents.length; i++) {
      const a = c.agents[i];
      if (!a.done) {
        const s = c.field.sample(a.x, a.z);
        if (s.reachable && s.distance < 1.0) { a.done = true; c.arrived++; }
        else if (s.reachable) { a.x += s.x * SPEED * dt; a.z += s.z * SPEED * dt; }
      }
      dummy.position.set(a.x - SPAN / 2 + c.offset, a.done ? 0.12 : 0.25, a.z - SPAN / 2);
      dummy.updateMatrix();
      c.mesh.setMatrixAt(i, dummy.matrix);
    }
    c.mesh.instanceMatrix.needsUpdate = true;
  }
  // Release them again once both crowds are in, so the crossing — which is the
  // only part worth looking at — is what is on screen most of the time.
  if (amber.arrived >= COUNT && green.arrived >= COUNT) {
    laps++;
    amber.arrived = 0; green.arrived = 0;
    amber.reset(); green.reset();
  }

  const grow = (m, n) => {
    const h = Math.max(0.1, (n / COUNT) * 5);
    m.scale.y = h;
    m.position.y = h / 2;
  };
  grow(amberBar, amber.arrived);
  grow(greenBar, green.arrived);

  game.camera.position.set(0, 25, 21);
  game.camera.lookAt(0, 0, 0);
});

window.flowDebug = () => {
  // The heading error each field gives on open ground, measured live.
  const bearing = (field) => {
    // A radius that stays well inside the grid: sampling near the border reads
    // the one-sided gradients there, not the field's own quality, and the first
    // version of this readout put the eikonal field at 14° for that reason.
    let worst = 0;
    for (let d = 0; d < 360; d += 2) {
      const x = GOAL.x + Math.cos((d * Math.PI) / 180) * (SPAN * 0.28);
      const z = GOAL.z + Math.sin((d * Math.PI) / 180) * (SPAN * 0.28);
      const s = field.sample(x, z);
      if (!s.reachable) continue;
      const want = Math.atan2(GOAL.z - z, GOAL.x - x);
      const got = Math.atan2(s.z, s.x);
      worst = Math.max(worst, (Math.abs(((got - want + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * 180) / Math.PI);
    }
    return Number(worst.toFixed(2));
  };
  return {
    // The scene's own clock — a headless run is about a third of real time.
    clock: Number(t.toFixed(1)),
    // The closed form, before any of this ran.
    anisotropy: Number(EIGHT_WAY_ANISOTROPY.toFixed(6)),
    worstAngleDeg: 22.5,
    cells: N * N,
    // One flood each, and every open cell settled exactly once.
    settled: { eight: eight.visited, eikonal: eikonal.visited },
    // THE POINT OF THE SCENE: what each field tells an agent to do.
    worstHeadingDeg: { eight: bearing(eight), eikonal: bearing(eikonal) },
    arrived: { eight: amber.arrived, eikonal: green.arrived, of: COUNT },
    laps,
    draws: game.renderer.info.render.calls,
  };
};

game.start();
`,
  },
  {
    id: 'voice',
    title: 'Voice: the vowel chart IS the formant table',
    group: 'AI',
    code: `// A VOICE WITHOUT AN AUDIO FILE.
//
// Speech is a SOURCE through a FILTER (Fant, 1960). The vocal folds buzz — that
// is pitch — and the tract they buzz through is a tube whose resonances are the
// vowel. The two are independent, which is why you can sing "ah" on any note,
// and why a WHISPER, which has no folds in it at all, is still intelligible.
//
// A tube closed at the glottis and open at the lips resonates at (2n-1)c/4L.
// For a 17.5 cm adult male tract that is 490 / 1470 / 2450 Hz, against a
// textbook neutral vowel of 500 / 1500 / 2500. One length and the speed of
// sound, nothing fitted.
//
// WHAT YOU ARE LOOKING AT
//
// Three vowel charts, floating one above another. The floor plan is not drawn
// by hand: each pillar sits at (-log F2, log F1) — the two numbers Peterson and
// Barney measured in 1952 — and what comes out is the IPA vowel quadrilateral,
// front-close at the far left, back-open at the near right. The chart every
// phonetics textbook prints IS the formant table, plotted.
//
// The three charts are a man (17.5 cm tract, amber), a woman (15 cm, green) and
// a child (12.5 cm, blue). Only the man's row is in the library. The other two
// are that row divided by a length — and in LOG formant space, dividing by a
// length is a TRANSLATION, so the three charts are congruent. Same shape, three
// heights, shifted along one diagonal. Watch the three orbs: they trace the
// same utterance through three bodies and never leave formation.
//
// The ladder at the right is the live filter: three beads per speaker at
// log F1, F2, F3. The beads slide as the vowel changes and the SPACING between
// them is identical across all three speakers, because the spacing is the vowel
// and the offset is the body.
//
// Click to hear it. No samples, no network, no assets — renderVoice() returns
// a Float32Array and the browser plays it.
import { BoxGeometry, BufferGeometry, CylinderGeometry, Line, LineBasicMaterial,
         LineLoop, Mesh, MeshStandardMaterial, SphereGeometry, Vector3 } from 'three';
import { Game, VOWELS, VOWEL_KEYS, formantsOf, renderVoice, voiceOf,
         REFERENCE_TRACT } from 'gama3d';
${SCENE}

// Log-formant space. The chart is what the numbers already say it is.
const K = 7;
const MID_F2 = 10.4;   // log2 of a middle F2, so the chart sits around x = 0
const MID_F1 = 8.8;
const px = (f2) => -(Math.log2(f2) - MID_F2) * K;
const pz = (f1) => (Math.log2(f1) - MID_F1) * K;

// The utterance, and every speaker says the same one at the same tempo so the
// formation is the thing on screen.
const LINE = ['i', 'E', 'ae', 'A', 'O', 'u', 'U', 'V', 'I', '@'];
const HOLD = 0.55;

const SPEAKERS = [
  { name: 'man', tract: REFERENCE_TRACT, colour: 0xd8a83a, y: 0 },
  { name: 'woman', tract: 0.15, colour: 0x54b070, y: 3.2 },
  { name: 'child', tract: 0.125, colour: 0x5aa8d8, y: 6.4 },
];

// The OUTLINE is the payoff, not the pillars. Eight peripheral vowels drawn as
// a closed loop give the IPA quadrilateral itself, and three of them stacked
// are visibly the SAME SHAPE at three offsets. The first version of this scene
// drew only the pillars and read as three scattered clouds: the numbers in the
// probe said congruent, and the screen did not show it.
const RIM = ['i', 'I', 'E', 'ae', 'A', 'O', 'u'];

for (const s of SPEAKERS) {
  s.voice = voiceOf({ tract: s.tract });
  s.spot = {};
  for (const key of VOWEL_KEYS) {
    const f = formantsOf(key, s.tract);
    const at = new Vector3(px(f[1]), s.y, pz(f[0]));
    s.spot[key] = at;
    // Pillar height is F1 itself, so the chart's vertical axis is visible as
    // height as well as depth: a close vowel is a low F1 and a short pillar.
    const h = 0.2 + (Math.log2(f[0]) - 7.6) * 0.45;
    const pillar = new Mesh(
      new BoxGeometry(0.3, h, 0.3),
      new MeshStandardMaterial({ color: s.colour, emissive: s.colour, emissiveIntensity: 0.45 })
    );
    pillar.position.set(at.x, s.y + h / 2, at.z);
    game.world.scene.add(pillar);
  }
  const rim = new LineLoop(
    new BufferGeometry().setFromPoints(RIM.map((k) => s.spot[k].clone().setY(s.y + 0.06))),
    new LineBasicMaterial({ color: s.colour })
  );
  game.world.scene.add(rim);

  const orb = new Mesh(
    new SphereGeometry(0.4, 20, 14),
    new MeshStandardMaterial({ color: 0xffffff, emissive: s.colour, emissiveIntensity: 1.1 })
  );
  game.world.scene.add(orb);
  s.orb = orb;

  // The ladder: three beads at log F1, F2, F3, on a pole of this speaker's own.
  const lx = 6.4 + SPEAKERS.indexOf(s) * 1.4;
  const lz = 9.8;
  const pole = new Mesh(
    new CylinderGeometry(0.07, 0.07, 9, 8),
    new MeshStandardMaterial({ color: 0x475569, emissive: 0x1e293b })
  );
  pole.position.set(lx, 4.5, lz);
  game.world.scene.add(pole);
  s.beads = [0, 1, 2].map(() => {
    const b = new Mesh(
      new SphereGeometry(0.28, 16, 12),
      new MeshStandardMaterial({ color: s.colour, emissive: s.colour, emissiveIntensity: 0.9 })
    );
    game.world.scene.add(b);
    return b;
  });
  s.ladder = { x: lx, z: lz };
}

// One diagonal, drawn once: every speaker's /ɑ/ lies on it, and so does every
// speaker's /i/, because a shorter tract is a TRANSLATION in this space.
for (const key of ['i', 'A']) {
  game.world.scene.add(new Line(
    new BufferGeometry().setFromPoints(SPEAKERS.map((s) => s.spot[key].clone().setY(s.y + 0.06))),
    new LineBasicMaterial({ color: 0x64748b })
  ));
}

// ---- the sound itself, rendered once, no assets involved
const SEGMENTS = LINE.map((vowel) => ({ vowel, seconds: HOLD }));
let ctx = null;
function speak() {
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    let when = ctx.currentTime + 0.05;
    for (const s of SPEAKERS) {
      const data = renderVoice(SEGMENTS, s.voice, { sampleRate: ctx.sampleRate, amplitude: 0.35 });
      const buffer = ctx.createBuffer(1, data.length, ctx.sampleRate);
      buffer.getChannelData(0).set(data);
      const node = ctx.createBufferSource();
      node.buffer = buffer;
      node.connect(ctx.destination);
      node.start(when);
      when += buffer.duration + 0.25;
    }
  } catch (err) { /* no audio device is not a reason to stop drawing */ }
}
game.renderer.domElement.addEventListener('pointerdown', speak);

let t = 0;
let said = 0;
const from = new Vector3();
const to = new Vector3();

game.onUpdate(({ delta }) => {
  t += Math.min(0.05, delta);
  const span = LINE.length * HOLD;
  const phase = (t % span) / HOLD;
  const i = Math.floor(phase);
  said = Math.floor(t / HOLD);
  // The same glide renderVoice uses: move over the first third, then hold.
  const g = Math.min(1, (phase - i) * 3);
  const a = LINE[(i + LINE.length - 1) % LINE.length];
  const b = LINE[i];

  for (const s of SPEAKERS) {
    from.copy(s.spot[a]);
    to.copy(s.spot[b]);
    s.orb.position.lerpVectors(from, to, g).setY(s.y + 1.1);
    // Live formants, glided in log space exactly as the filter is.
    const fa = formantsOf(a, s.tract);
    const fb = formantsOf(b, s.tract);
    s.live = [0, 1, 2].map((k) => Math.pow(2, Math.log2(fa[k]) + (Math.log2(fb[k]) - Math.log2(fa[k])) * g));
    for (let k = 0; k < 3; k++) {
      s.beads[k].position.set(s.ladder.x, (Math.log2(s.live[k]) - 7.6) * 1.55, s.ladder.z);
    }
  }

  game.camera.position.set(0, 16, 25);
  game.camera.lookAt(0.5, 3.2, 2.0);
});

// The offline render is the audio evidence: pure samples, no device needed.
window.audioDebug = () => {
  const data = renderVoice(SEGMENTS, SPEAKERS[0].voice, { sampleRate: 22050, amplitude: 0.35 });
  let sum = 0, peak = 0;
  for (let i = 0; i < data.length; i++) { sum += data[i] * data[i]; peak = Math.max(peak, Math.abs(data[i])); }
  return {
    offlineRms: Number(Math.sqrt(sum / data.length).toFixed(5)),
    offlinePeak: Number(peak.toFixed(4)),
    samples: data.length,
    seconds: Number((data.length / 22050).toFixed(2)),
  };
};

window.voiceDebug = () => {
  // THE CLAIM ON SCREEN: a different body is a TRANSLATION in log formant
  // space, so the three charts are congruent. Measured against the ten vowels
  // rather than asserted — the offset between any two speakers has to be the
  // same for every one of them.
  const drift = (a, b) => {
    let worst = 0;
    let mean = 0;
    for (const key of VOWEL_KEYS) {
      const d = a.spot[key].clone().sub(b.spot[key]);
      mean += Math.hypot(d.x, d.z) / VOWEL_KEYS.length;
    }
    for (const key of VOWEL_KEYS) {
      const d = a.spot[key].clone().sub(b.spot[key]);
      worst = Math.max(worst, Math.abs(Math.hypot(d.x, d.z) - mean));
    }
    return { shift: Number(mean.toFixed(4)), worstDeviation: Number(worst.toFixed(6)) };
  };
  // ...and the SPACING of the ladder beads is the vowel, not the body, so it
  // has to agree across speakers to the last decimal.
  const spacing = SPEAKERS.map((s) => Number((Math.log2(s.live[1] / s.live[0])).toFixed(6)));
  return {
    clock: Number(t.toFixed(1)),
    vowels: VOWEL_KEYS.length,
    saying: LINE[Math.floor((t % (LINE.length * HOLD)) / HOLD)],
    said,
    tracts: SPEAKERS.map((s) => s.tract),
    f0: SPEAKERS.map((s) => Number(s.voice.f0.toFixed(1))),
    liveF1: SPEAKERS.map((s) => Number(s.live[0].toFixed(0))),
    congruent: {
      manToWoman: drift(SPEAKERS[0], SPEAKERS[1]),
      womanToChild: drift(SPEAKERS[1], SPEAKERS[2]),
    },
    ladderSpacing: spacing,
    draws: game.renderer.info.render.calls,
  };
};

game.start();
`,
  },
];






export function findExample(id: string): Example {
  return EXAMPLES.find((e) => e.id === id) ?? EXAMPLES[0];
}
