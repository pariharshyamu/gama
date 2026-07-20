import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  Color,
  ConeGeometry,
  DirectionalLight,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Raycaster,
  Vector2,
  Vector3,
} from 'three';
import {
  Game,
  MotionAgent,
  NavMeshAgent,
  generateNavMesh,
  Separation,
  OrbitRig,
  DebugOverlay,
} from '../../src';

const game = new Game();
game.world.scene.background = new Color(0x0b0e14);
game.world.scene.add(new AmbientLight(0xffffff, 0.6));
const sun = new DirectionalLight(0xffffff, 1.2);
sun.position.set(12, 20, 8);
game.world.scene.add(sun);

// --- The level: plain boxes + a rotated ramp. No hand-authored navmesh.
const level = new Group();
const stone = new MeshStandardMaterial({ color: 0x475569 });
const addBox = (w: number, h: number, d: number, x: number, y: number, z: number, rz = 0) => {
  const mesh = new Mesh(new BoxGeometry(w, h, d), stone);
  mesh.position.set(x, y, z);
  mesh.rotation.z = rz;
  level.add(mesh);
  return mesh;
};

addBox(36, 1, 36, 0, -0.5, 0); // ground, top y=0
addBox(10, 1, 12, 12, 2.5, -8); // raised platform, top y=3
addBox(8.6, 0.4, 4, 3.5, 1.45, -8, 0.36); // ramp rising toward +x, up to the platform
// Pillars and crates to route around.
addBox(2, 3, 2, -6, 1.5, -6);
addBox(2, 3, 2, -6, 1.5, 4);
addBox(3, 2, 3, 2, 1, 6);
addBox(2.5, 2.5, 2.5, 5, 1.25, 1);
game.world.scene.add(level);

// --- Bake the navmesh from the level geometry.
const nav = generateNavMesh(level, { cellSize: 0.5, agentRadius: 0.55, maxClimb: 0.5 });

// Visualize the baked walkable surface.
const navGeometry = nav.toBufferGeometry();
const navSurface = new Mesh(
  navGeometry,
  new MeshStandardMaterial({ color: 0x14532d, transparent: true, opacity: 0.85 })
);
navSurface.position.y = 0.03;
const navWire = new Mesh(
  navGeometry,
  new MeshStandardMaterial({ color: 0x34d399, wireframe: true, transparent: true, opacity: 0.35 })
);
navWire.position.y = 0.04;
game.world.scene.add(navSurface, navWire);

// --- Agents.
const agents: MotionAgent[] = [];
const navAgents: NavMeshAgent[] = [];
const palette = [0x60a5fa, 0xf87171, 0xfbbf24, 0xc084fc];
for (let i = 0; i < 4; i++) {
  const walker = game.world.spawn(`walker-${i}`);
  const mesh = new Mesh(
    new ConeGeometry(0.45, 1.3, 4),
    new MeshStandardMaterial({ color: palette[i] })
  );
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = 0.65;
  walker.add(mesh);
  walker.position.set(-12 + i * 2, 0, 12);
  const motion = walker.addComponent(new MotionAgent({ maxSpeed: 6, maxForce: 35 }));
  motion.addBehavior(new Separation(() => agents, 1.3), 1.2);
  agents.push(motion);
  navAgents.push(walker.addComponent(new NavMeshAgent(nav, { waypointRadius: 0.7 })));
}

// Path line for the first agent.
const pathLine = new Line(new BufferGeometry(), new LineBasicMaterial({ color: 0x7dd3fc }));
pathLine.position.y = 0.12;
game.world.scene.add(pathLine);

function sendEveryone(target: Vector3): void {
  navAgents.forEach((navAgent, i) => {
    const offset = new Vector3(Math.cos(i * 1.7), 0, Math.sin(i * 1.7)).multiplyScalar(1.1);
    navAgent.goTo(offset.add(target));
  });
  if (navAgents[0].currentPath) {
    pathLine.geometry.dispose();
    pathLine.geometry = new BufferGeometry().setFromPoints(navAgents[0].currentPath);
  }
}

// --- Orbit camera; click (without dragging) sends the agents.
const orbitTarget = new Object3D();
orbitTarget.position.set(2, 0, 0);
const rig = new OrbitRig(game.camera, orbitTarget, game.input, {
  distance: 26,
  pitch: 0.9,
  yaw: 0.4,
});
game.onUpdate((time) => rig.update(time.delta));

const raycaster = new Raycaster();
const downAt = new Vector2();
game.renderer.domElement.addEventListener('pointerdown', () => downAt.copy(game.input.pointer));
game.renderer.domElement.addEventListener('pointerup', () => {
  if (game.input.pointer.distanceTo(downAt) > 6) return; // was a drag → orbit only
  raycaster.setFromCamera(game.input.pointerNdc, game.camera);
  const hit = raycaster.intersectObject(navSurface, false)[0];
  if (hit) sendEveryone(hit.point);
});

// First trek: onto the platform, via the ramp.
sendEveryone(new Vector3(13, 3, -9));

new DebugOverlay(game);
game.start();
