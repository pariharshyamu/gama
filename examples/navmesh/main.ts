import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  Color,
  ConeGeometry,
  DirectionalLight,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  Raycaster,
  Vector3,
} from 'three';
import {
  Game,
  MotionAgent,
  NavMesh,
  NavMeshAgent,
  Separation,
  DebugOverlay,
} from '../../src';

const game = new Game();
game.world.scene.background = new Color(0x0b0e14);
game.camera.position.set(0, 46, 34);
game.camera.lookAt(0, 0, 0);

game.world.scene.add(new AmbientLight(0xffffff, 0.6));
const sun = new DirectionalLight(0xffffff, 1.2);
sun.position.set(10, 20, 8);
game.world.scene.add(sun);

// --- Walkable area: a 5x5 grid of 9-unit cells with a plus-shaped set of
// holes; every hole gets a matching wall box. Cells meet edge-to-edge, so
// NavMesh welding derives adjacency automatically.
const CELL = 9;
const HALF = (5 * CELL) / 2;
const holes = new Set(['1,1', '3,1', '2,2', '1,3', '3,3']);
const positions: number[] = [];
const wallMaterial = new MeshStandardMaterial({ color: 0x475569 });
for (let cx = 0; cx < 5; cx++) {
  for (let cz = 0; cz < 5; cz++) {
    const x0 = -HALF + cx * CELL;
    const z0 = -HALF + cz * CELL;
    if (holes.has(`${cx},${cz}`)) {
      const wall = game.world.spawn(`wall-${cx}-${cz}`);
      wall.add(new Mesh(new BoxGeometry(CELL, 5, CELL), wallMaterial));
      wall.position.set(x0 + CELL / 2, 2.5, z0 + CELL / 2);
      continue;
    }
    positions.push(x0, 0, z0, x0 + CELL, 0, z0 + CELL, x0 + CELL, 0, z0);
    positions.push(x0, 0, z0, x0, 0, z0 + CELL, x0 + CELL, 0, z0 + CELL);
  }
}
const navMesh = new NavMesh(positions);

// Render the navmesh itself as the floor, plus a faint wireframe overlay.
const floorGeometry = navMesh.toBufferGeometry();
const floor = new Mesh(floorGeometry, new MeshStandardMaterial({ color: 0x1e293b }));
const wire = new Mesh(
  floorGeometry,
  new MeshStandardMaterial({ color: 0x334155, wireframe: true })
);
wire.position.y = 0.02;
game.world.scene.add(floor, wire);

// --- Agents: MotionAgent for movement, NavMeshAgent for goTo().
const agents: MotionAgent[] = [];
const navAgents: NavMeshAgent[] = [];
const palette = [0x60a5fa, 0xf87171, 0x34d399, 0xfbbf24, 0xc084fc];
for (let i = 0; i < 5; i++) {
  const walker = game.world.spawn(`walker-${i}`);
  const mesh = new Mesh(
    new ConeGeometry(0.5, 1.4, 4),
    new MeshStandardMaterial({ color: palette[i] })
  );
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = 0.7;
  walker.add(mesh);
  walker.position.set(-HALF + 2 + i * 1.6, 0, -HALF + 2);

  const motion = walker.addComponent(new MotionAgent({ maxSpeed: 7, maxForce: 40, planar: true }));
  motion.addBehavior(new Separation(() => agents, 1.4), 1.2);
  agents.push(motion);
  navAgents.push(walker.addComponent(new NavMeshAgent(navMesh)));
}

// Path line for the first agent, refreshed on every goTo.
const pathLine = new Line(
  new BufferGeometry(),
  new LineBasicMaterial({ color: 0x7dd3fc })
);
pathLine.position.y = 0.1;
game.world.scene.add(pathLine);

function sendEveryone(target: Vector3): void {
  navAgents.forEach((nav, i) => {
    // Slight per-agent offset so they don't fight over one point.
    const offset = new Vector3(Math.cos(i * 2.4), 0, Math.sin(i * 2.4)).multiplyScalar(1.2);
    nav.goTo(offset.add(target));
  });
  if (navAgents[0].currentPath) {
    pathLine.geometry.dispose();
    pathLine.geometry = new BufferGeometry().setFromPoints(navAgents[0].currentPath);
  }
}

// Click-to-move: raycast the pointer against the navmesh floor.
const raycaster = new Raycaster();
game.renderer.domElement.addEventListener('pointerdown', () => {
  raycaster.setFromCamera(game.input.pointerNdc, game.camera);
  const hit = raycaster.intersectObject(floor, false)[0];
  if (hit) sendEveryone(hit.point);
});

// Kick off an initial trek to the far corner so something moves immediately.
sendEveryone(new Vector3(HALF - 3, 0, HALF - 3));

new DebugOverlay(game);

game.start();
