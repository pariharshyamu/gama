import {
  AmbientLight,
  Color,
  ConeGeometry,
  DirectionalLight,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  RingGeometry,
  Vector3,
} from 'three';
import {
  Game,
  GameObject,
  MotionAgent,
  Pursue,
  Arrive,
  FollowPath,
  Path,
  Separation,
  CharacterController,
  FollowCamera,
  DebugOverlay,
  BehaviorTree,
  reactiveSelector,
  reactiveSequence,
  condition,
  action,
} from '../../src';

const game = new Game();
game.world.scene.background = new Color(0x0b0e14);
game.world.scene.add(new AmbientLight(0xffffff, 0.6));
const sun = new DirectionalLight(0xffffff, 1.2);
sun.position.set(10, 20, 8);
game.world.scene.add(sun, new GridHelper(60, 30, 0x334155, 0x1e293b));

// Player.
const player = game.world.spawn('player');
const playerMesh = new Mesh(
  new ConeGeometry(0.5, 1.4, 4),
  new MeshStandardMaterial({ color: 0x60a5fa })
);
playerMesh.rotation.x = Math.PI / 2;
playerMesh.position.y = 0.7;
player.add(playerMesh);
player.position.set(0, 0, 16);
player.addComponent(new CharacterController(game.input, { speed: 9 }));
const playerAgent = player.addComponent(new MotionAgent({ maxSpeed: 0 })); // pursue target only

const cam = new FollowCamera(game.camera, player, { offset: new Vector3(0, 16, 15) });
game.onUpdate((t) => cam.update(t.delta));

// Guard AI ---------------------------------------------------------------

const DETECT_RADIUS = 8;
const GIVE_UP_RADIUS = 13;
const COLORS = { patrol: 0x34d399, chase: 0xf87171, return: 0xfbbf24 } as const;
type Mode = keyof typeof COLORS;

interface Guard {
  object: GameObject;
  agent: MotionAgent;
  material: MeshStandardMaterial;
  patrol: FollowPath;
  chase: Pursue;
  returnHome: Arrive | null;
  mode: Mode | null;
}

/** Swap the agent's steering behaviors when the tree changes mode. */
function setMode(guard: Guard, mode: Mode): void {
  if (guard.mode === mode) return;
  guard.mode = mode;
  guard.material.color.setHex(COLORS[mode]);
  guard.agent.clearBehaviors();
  guard.agent.addBehavior(new Separation(() => guards.map((g) => g.agent), 1.8), 1.5);
  if (mode === 'patrol') guard.agent.addBehavior(guard.patrol);
  if (mode === 'chase') guard.agent.addBehavior(guard.chase);
  if (mode === 'return') {
    guard.returnHome = new Arrive(guard.patrol.path.current().clone(), 3);
    guard.agent.addBehavior(guard.returnHome);
  }
}

const distanceToPlayer = (g: Guard) => g.object.position.distanceTo(player.position);
const distanceToRoute = (g: Guard) => g.object.position.distanceTo(g.patrol.path.current());

/**
 * Priority root (reactive — higher branches preempt lower ones):
 *   1. player close → chase
 *   2. far from the patrol route (after a chase) → walk back
 *   3. otherwise → patrol
 */
const guardTree = () =>
  reactiveSelector<Guard>(
    reactiveSequence(
      condition((g: Guard) =>
        g.mode === 'chase' ? distanceToPlayer(g) < GIVE_UP_RADIUS : distanceToPlayer(g) < DETECT_RADIUS
      ),
      action((g: Guard) => {
        setMode(g, 'chase');
        return 'running';
      })
    ),
    // Only after a chase: walk back to the route (patrolling itself moves
    // between distant waypoints, so distance alone must not trigger this).
    reactiveSequence(
      condition(
        (g: Guard) =>
          (g.mode === 'chase' || g.mode === 'return') && distanceToRoute(g) > 2.5
      ),
      action((g: Guard) => {
        setMode(g, 'return');
        return 'running';
      })
    ),
    action((g: Guard) => {
      setMode(g, 'patrol');
      return 'running';
    })
  );

// Patrol route shared by all guards (staggered start waypoints).
const routePoints = [
  new Vector3(-12, 0, -12),
  new Vector3(12, 0, -12),
  new Vector3(12, 0, 4),
  new Vector3(-12, 0, 4),
];
const routeRing = new Mesh(
  new RingGeometry(0.4, 0.6, 24),
  new MeshStandardMaterial({ color: 0x334155 })
);
routeRing.rotation.x = -Math.PI / 2;
for (const p of routePoints) {
  const marker = routeRing.clone();
  marker.position.copy(p).setY(0.02);
  game.world.scene.add(marker);
}

const guards: Guard[] = [];
for (let i = 0; i < 3; i++) {
  const object = game.world.spawn(`guard-${i}`);
  const material = new MeshStandardMaterial({ color: COLORS.patrol });
  const mesh = new Mesh(new ConeGeometry(0.55, 1.5, 5), material);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = 0.75;
  object.add(mesh);
  object.position.copy(routePoints[i % routePoints.length]);

  const agent = object.addComponent(new MotionAgent({ maxSpeed: 5.5, maxForce: 25, planar: true }));
  const path = new Path(routePoints.map((p) => p.clone()), true);
  for (let skip = 0; skip < i; skip++) path.advance(); // stagger along the route

  const guard: Guard = {
    object,
    agent,
    material,
    patrol: new FollowPath(path, 1),
    chase: new Pursue(playerAgent, 0.6),
    returnHome: null,
    mode: null,
  };
  guards.push(guard);
  object.addComponent(new BehaviorTree(guardTree(), guard, { interval: 0.05 }));
}

// Track the player's velocity so Pursue can predict (player uses
// CharacterController, so mirror its velocity into the MotionAgent).
const playerController = player.requireComponent(CharacterController);
game.onUpdate(() => playerAgent.velocity.copy(playerController.velocity));

new DebugOverlay(game);
game.start();
