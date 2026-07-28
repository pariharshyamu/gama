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
];






export function findExample(id: string): Example {
  return EXAMPLES.find((e) => e.id === id) ?? EXAMPLES[0];
}
