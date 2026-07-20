# GAMA — Gaming And Motion Agent

**GAMA** is a 3D game development library built on top of [three.js](https://threejs.org). It gives you the pieces three.js deliberately leaves out — a game loop, entities and components, input, cameras, tweening, gameplay collisions — and its signature feature: **motion agents**, a composable steering-behavior system for bringing NPCs, enemies, flocks and companions to life.

three.js renders. **GAMA makes it a game.**

## Vision

Most web games start the same way: a `requestAnimationFrame` loop, a pile of ad-hoc `update()` calls, keyboard flags scattered across event listeners, and enemy movement written as one-off vector math. GAMA packages those patterns into a small, typed, tree-shakeable library so you start at the gameplay layer, not the plumbing layer.

Design principles:

- **three.js-native, not a wrapper.** A `GameObject` *is* a `THREE.Object3D`. Anything from the three.js ecosystem — loaders, materials, postprocessing — works unchanged. GAMA never hides the renderer or the scene graph from you.
- **Motion is the product.** Character movement, steering-driven AI, animation cross-fades, camera rigs and tweens are first-class, because motion is what makes a 3D scene feel like a game.
- **Composable behaviors over inheritance trees.** An enemy is a `GameObject` + `MotionAgent` + a few weighted steering behaviors + a `StateMachine`. Swap behaviors at runtime to change how it moves.
- **Small and honest scope.** GAMA ships gameplay-level collisions (spheres, boxes, triggers) in core, not a physics engine. When you need rigid-body dynamics, the optional `gama/rapier` adapter binds [rapier](https://rapier.rs) bodies and a stair-climbing character controller to GameObjects — core stays dependency-free either way.

## Install

```bash
npm install gama three
```

## Quick start

```ts
import { Mesh, BoxGeometry, MeshStandardMaterial, AmbientLight, Vector3 } from 'three';
import { Game, MotionAgent, Seek, CharacterController, FollowCamera } from 'gama';

const game = new Game();
game.world.scene.add(new AmbientLight(0xffffff, 1));

// A keyboard-driven player
const player = game.world.spawn('player');
player.add(new Mesh(new BoxGeometry(), new MeshStandardMaterial({ color: 0x60a5fa })));
player.addComponent(new CharacterController(game.input, { speed: 8 }));

// An enemy that chases the player
const enemy = game.world.spawn('enemy');
enemy.add(new Mesh(new BoxGeometry(), new MeshStandardMaterial({ color: 0xf87171 })));
enemy.position.set(10, 0, 10);
enemy
  .addComponent(new MotionAgent({ maxSpeed: 5, planar: true }))
  .addBehavior(new Seek(player.position));

// A camera that follows the player
const cam = new FollowCamera(game.camera, player, { offset: new Vector3(0, 8, 12) });
game.onUpdate((time) => cam.update(time.delta));

game.start();
```

Run the bundled demos:

```bash
npm install
npm run dev          # player + pursuing chasers + flock + pickups (F3 = debug overlay)
npm run dev:flock    # 400 boids: spatial hashing, obstacle avoidance, containment
npm run dev:navmesh  # click-to-move: A* + funnel pathfinding around walls
npm run dev:physics  # rapier: stairs, ramps, crate pyramid, jumping character
npm run dev:ai       # behavior-tree guards: patrol → chase → give up
npm run dev:navgen   # navmesh BAKED from level boxes + orbit camera
npm run dev:react    # react-three-fiber: 120 boids as declarative JSX
```

## Documentation

**Docs site with live playground** — run it locally with `npm run site:dev`,
or `npm run site:publish` to build it and push it to the `docs` branch for
GitHub Pages (Settings → Pages → Deploy from a branch → `docs`, `/ (root)`).
It includes every guide below plus a dozen editable, runnable examples of
steering, flocking, navmesh baking, behavior trees and more.

- [Getting started](docs/getting-started.md)
- [Motion agents & steering](docs/motion.md) — behaviors, flocking at scale, avoidance, state machines, tuning
- [Core](docs/core.md) — loop, fixed timestep, entities, events, pooling
- [Animation](docs/animation.md) — tweens, easing, clip cross-fades
- [Gameplay](docs/gameplay.md) — input & actions, camera, collisions, audio, assets
- [Physics](docs/physics.md) — the optional rapier adapter: rigid bodies & character controller
- [React](docs/react.md) — the optional react-three-fiber bindings: `<Entity>`, `useComponent`, flock hooks

## Architecture

```
┌───────────────────────────────────────────────────────────┐
│ Game       loop · fixed timestep · renderer · input       │
├───────────────────────────────────────────────────────────┤
│ World      THREE.Scene + GameObject registry              │
│ GameObject extends THREE.Object3D + components + events   │
│ Component  onAttach / update / fixedUpdate / onDetach     │
├────────────────────┬───────────────┬──────────────────────┤
│ Motion             │ Animation     │ Gameplay             │
│ MotionAgent        │ Tween/Tweens  │ Input + ActionMap    │
│  Seek/Flee/Arrive  │ easing        │  (keyboard, gamepad) │
│  Pursue/Evade      │ Animator      │ CharacterController  │
│  Wander            │  (mixer +     │ FollowCamera         │
│  Separation        │   crossfade)  │ OrbitRig/ShoulderRig │
│  (cont.)           │               │ Sphere/BoxCollider   │
│  Alignment         │               │ CollisionSystem      │
│  Cohesion          │               │  (enter/exit events) │
│  FollowPath        │               │ Pool                 │
│  ObstacleAvoidance │               │ AudioManager         │
│  Containment       │               │ Assets               │
│ SpatialGrid        │               │ DebugOverlay         │
│ NavMesh (A*+funnel)│               │                      │
│ NavMeshAgent.goTo  │               │                      │
│ generateNavMesh    │               │                      │
│ StateMachine       │               │                      │
│ BehaviorTree       │               │                      │
├────────────────────┴───────────────┴──────────────────────┤
│ gama/rapier (optional entry point, peer dep on rapier)    │
│ PhysicsWorld · RigidBody · PhysicsCharacterController     │
├───────────────────────────────────────────────────────────┤
│ gama/react (optional entry point, peer deps react + r3f)  │
│ GamaProvider · Entity · useComponent · useFlockGrid       │
└───────────────────────────────────────────────────────────┘
                          three.js
```

### Motion agents

A `MotionAgent` is a component that steers its `GameObject` by summing weighted forces from classic Reynolds steering behaviors. Behaviors take fixed points, live `Vector3` references, getters, or other agents — so targets can move.

```ts
import { MotionAgent, Pursue, Evade, Wander, Separation, Alignment, Cohesion, FollowPath, Path, StateMachine } from 'gama';

// A guard that patrols, then chases when the player gets close
const agent = guard.addComponent(new MotionAgent({ maxSpeed: 4, planar: true }));
const patrol = new FollowPath(new Path([wp1, wp2, wp3], true));
const chase = new Pursue(playerAgent);

const brain = guard.addComponent(
  new StateMachine({ agent })
);
brain
  .addState({
    name: 'patrol',
    enter: ({ agent }) => { agent.clearBehaviors(); agent.addBehavior(patrol); },
    update: ({ agent }) => {
      if (agent.position.distanceTo(player.position) < 8) brain.setState('chase');
    },
  })
  .addState({
    name: 'chase',
    enter: ({ agent }) => { agent.clearBehaviors(); agent.addBehavior(chase); },
    update: ({ agent }) => {
      if (agent.position.distanceTo(player.position) > 15) brain.setState('patrol');
    },
  });
brain.setState('patrol');

// A flock, in four lines
boid.addComponent(new MotionAgent({ maxSpeed: 3 }))
  .addBehavior(new Separation(() => flock, 1.5), 1.6)
  .addBehavior(new Alignment(() => flock, 5))
  .addBehavior(new Cohesion(() => flock, 6), 0.8);
```

Available behaviors: `Seek`, `Flee`, `Arrive`, `Pursue`, `Evade`, `Wander`, `Separation`, `Alignment`, `Cohesion`, `FollowPath`, `ObstacleAvoidance`, `Containment`. Implement the one-method `SteeringBehavior` interface to add your own.

Flocks scale with `SpatialGrid`, a spatial hash for near-O(n) neighbor queries — `examples/flock` runs 400 boids with obstacle avoidance:

```ts
const grid = new SpatialGrid(5);
game.onUpdate(() => grid.rebuild(flock));
agent.addBehavior(new Separation(grid.near(agent, 5), 1.5), 1.8);
```

### Navigation

Point-to-point movement through a level is one call — `NavMesh` runs A* over
triangle adjacency and string-pulls the result with the funnel algorithm:

```ts
const nav = NavMesh.fromGeometry(floorGeometry);
enemy.addComponent(new MotionAgent({ maxSpeed: 5, planar: true }));
const navAgent = enemy.addComponent(new NavMeshAgent(nav));

navAgent.goTo(clickPoint);
enemy.events.on('nav-arrived', () => attack());
```

### Physics (optional)

Real rigid-body dynamics via the [rapier](https://rapier.rs) adapter — a
separate entry point, so core `gama` stays dependency-free:

```ts
import { PhysicsWorld, RigidBody, PhysicsCharacterController } from 'gama/rapier';

const physics = await PhysicsWorld.create();
physics.attach(game); // steps at the game's fixed rate

crate.addComponent(new RigidBody(physics, {
  collider: { shape: 'box', halfExtents: new Vector3(0.5, 0.5, 0.5) },
}));
const controller = player.addComponent(
  new PhysicsCharacterController(physics, game.input, { speed: 7 })
); // slopes, stairs, snap-to-ground, gravity, jump()
```

### Seeing what agents think

```ts
new DebugOverlay(game); // press F3
```

Velocity arrows (cyan), steering-force arrows (magenta), collider wireframes, and an FPS/entity/draw-call panel — steering bugs stop being invisible.

### Animation

```ts
import { Tweens, easing, Animator } from 'gama';

const tweens = new Tweens();
game.onUpdate((t) => tweens.update(t.delta));
tweens.to(door.position, { y: 4 }, { duration: 0.6, easing: easing.cubicInOut });

// Skinned characters: named clips with cross-fades
const animator = hero.addComponent(new Animator(gltf.animations, gltf.scene));
animator.play('idle');
// later, when the player moves:
animator.play('run', 0.2);
```

### Assets

```ts
import { Assets } from 'gama';

const assets = new Assets();
assets.onProgress = (loaded, total) => hud.setProgress(loaded / total);
const gltf = await assets.gltf('models/hero.glb'); // cached; repeated calls are free
```

## Roadmap

- [x] Spatial hashing for `Separation`/`Alignment`/`Cohesion` neighbor queries at scale
- [x] Obstacle-avoidance (`ObstacleAvoidance`) and bounds (`Containment`) steering behaviors
- [x] Gamepad support and named-action input mapping
- [x] Audio manager (one-shots, positional audio, music cross-fade)
- [x] Debug overlay (steering/velocity arrows, collider wireframes, stats)
- [x] Object pooling and collision enter/exit events
- [x] Fixed-timestep simulation option
- [x] Navmesh pathfinding: `NavMesh` (A* + funnel) and `NavMeshAgent.goTo(point)`
- [x] Navmesh generation from level geometry (`generateNavMesh`: grid sampling, slope/step/radius rules)
- [x] Rapier adapter (`gama/rapier`): rigid bodies + physics character controller
- [x] Behavior trees (reactive composites, decorators, typed contexts)
- [x] Orbit and shoulder camera rigs (drag-orbit + pointer-lock mouse look with occlusion)
- [x] React-three-fiber bindings (`gama/react`): Entity/GameObject bridge, component hooks, flock grid
- [x] Documentation site with live, editable playground (`npm run site:dev`)
- [ ] Multi-layer navmesh generation (Recast-style voxelization)

## Development

```bash
npm install
npm test          # vitest unit tests (steering, tweens, world lifecycle)
npm run typecheck
npm run build     # tsup → dist (ESM + CJS + d.ts)
npm run dev       # vite dev server for examples/basic
```

## License

MIT
