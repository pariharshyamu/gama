# GAMA — Gaming And Motion Agent

[![CI](https://github.com/pariharshyamu/gama/actions/workflows/ci.yml/badge.svg)](https://github.com/pariharshyamu/gama/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/gama3d.svg)](https://www.npmjs.com/package/gama3d)

**GAMA** is a 3D game development library built on top of [three.js](https://threejs.org). It gives you the pieces three.js deliberately leaves out — a game loop, entities and components, input, cameras, tweening, gameplay collisions — and its signature feature: **motion agents**, a composable steering-behavior system for bringing NPCs, enemies, flocks and companions to life.

three.js renders. **GAMA makes it a game.**

## Vision

Most web games start the same way: a `requestAnimationFrame` loop, a pile of ad-hoc `update()` calls, keyboard flags scattered across event listeners, and enemy movement written as one-off vector math. GAMA packages those patterns into a small, typed, tree-shakeable library so you start at the gameplay layer, not the plumbing layer.

Design principles:

- **three.js-native, not a wrapper.** A `GameObject` *is* a `THREE.Object3D`. Anything from the three.js ecosystem — loaders, materials, postprocessing — works unchanged. GAMA never hides the renderer or the scene graph from you.
- **Motion is the product.** Character movement, steering-driven AI, animation cross-fades, camera rigs and tweens are first-class, because motion is what makes a 3D scene feel like a game.
- **Composable behaviors over inheritance trees.** An enemy is a `GameObject` + `MotionAgent` + a few weighted steering behaviors + a `StateMachine`. Swap behaviors at runtime to change how it moves.
- **Small and honest scope.** GAMA ships gameplay-level collisions (spheres, boxes, triggers) in core, not a physics engine. When you need rigid-body dynamics, the optional `gama3d/rapier` adapter binds [rapier](https://rapier.rs) bodies and a stair-climbing character controller to GameObjects — core stays dependency-free either way.

## Install

```bash
npm install gama3d three
```

## Start from a template

The fastest way to a game that is actually a game — title screen, settings
that persist, pause, results, best score, phone controls and a deployable
build, all already wired:

```bash
node scripts/new-game.mjs my-game     # or --template courier
cd my-game && npm install && npm run dev
```

| template | what you get |
|---|---|
| **starter** | A complete small game (find five markers before the clock runs out) with the whole shell wired. Delete the round, keep the rest. |
| **courier** | [Havenbrook Courier](game) — a generated village, a delivery loop, townsfolk in the way, day turning to dusk. A worked example; the docs site serves it at `/play/`. |

Both depend on the **published** packages rather than this repo, so what you
scaffold is exactly what an outside developer gets. See
[the shell & templates](docs/shell.md).

## Quick start

```ts
import { Mesh, BoxGeometry, MeshStandardMaterial, AmbientLight, Vector3 } from 'three';
import { Game, MotionAgent, Seek, CharacterController, FollowCamera } from 'gama3d';

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

The same build is also self-hosted at **<https://gama.playmeet.games/>** —
`npm run site:deploy`, with [deploy/](deploy/README.md) covering the nginx
config, the one-time server bootstrap, Let's Encrypt, and the atomic
release-and-symlink scheme. The two are independent; `base: './'` is what
lets one build serve correctly from both a GitHub Pages subpath and a
domain root.

- [Getting started](docs/getting-started.md)
- [The shell & templates](docs/shell.md) — the part of a game that is not the game
- [Levels: prefabs & format](docs/levels.md) — a scene as data, and the round trip back
- [The editor](docs/editor.md) — `Editor` + `gama3d/editor`: selection, snapped edits, undo that merges a drag into one step, and `mountEditor` for a whole tool in one call
- [The asset pipeline](docs/assets.md) — a generated manifest (keys, byte sizes, groups, hashes), `AssetLibrary` (byte-weighted progress, shared instances, reference-counted release) and a `--check` gate
- [Networking](docs/net.md) — `gama3d/net`: an authoritative server, client-side prediction, reconciliation, entity interpolation, delta snapshots, and a simulated link that makes all of it testable without a socket
- [Dialogue](docs/dialogue.md) — conversations as JSON so `lintDialogue` can read them: dangling links, unreachable lines and misspelt variables found before a player finds them; hidden vs locked choices, mid-conversation saves, exact counters
- [Replay & determinism](docs/replay.md) — a run is its seed plus its inputs, a few hundred bytes: `Recorder`, `replay`, and a per-tick `worldChecksum` that names the FIRST tick two runs disagree on. It found that `createFlock` could not be replayed at all — `Math.random` in the scatter *and* in every boid's `Wander` — and brought GAMA a seeded `Rng` to fix it with
- [The perf gate](docs/perf.md) — `npm run perf`: calibration-relative timing with honest noise handling, exact work counters, render budgets in headless Chromium — and the deliberate regressions it was made to fail on
- [Using all three libraries](docs/workflow.md) — the catalog seam: how GAMA, SCENA and ANIMA compose into one game without importing each other
- [Characters](docs/characters.md) — templates: third-person/top-down players, guards, companions, flocks, locomotion
- [Motion agents & steering](docs/motion.md) — behaviors, flocking at scale, avoidance, state machines, tuning
- [Core](docs/core.md) — loop, fixed timestep, entities, events, pooling
- [Animation](docs/animation.md) — tweens, easing, clip cross-fades
- [Gameplay](docs/gameplay.md) — input & actions, camera, collisions, audio, assets
- [Audio](docs/audio.md) — `Soundboard`: procedural sound from a seed — footsteps, impacts, engines, weather, crowds, captions
- [Game feel & HUD](docs/feel.md) — `GameFeel` (trauma shake, hit-stop, slow-mo, rumble) and `Hud` (score, hearts, banner, prompt, captions, radar)
- [The pickup loop](docs/loop.md) — `Collector` (sweep, values, respawn timers) and `CheckpointRun` (order enforced, laps, progress) over SCENA-shaped props
- [Stakes](docs/stakes.md) — `Health` (i-frames, death as an edge, knockback vectors) and `Projectiles` (pooled instanced shots, teams, arcs)
- [Opposition](docs/opposition.md) — `Harass` (ring-keeping, seeded strafe) and `WaveDirector` (staggered waves, rest, rubber-band pressure)
- [Retention](docs/retention.md) — `GameFlow` (title/playing/paused/results, `gate()` as the pause), `Objectives`, `SaveSlot` (versioned, corruption-safe), ghosts (`GhostRecorder`/`Ghost` — race yesterday's you)
- [Platformer](docs/platformer.md) — `PlatformerController`: gravity, coyote time, jump buffering, variable height, moving-platform carry — and the coin-run payoff demo
- [Light as gameplay](docs/light.md) — `Illumination` (the how-lit-am-I field over structural sources), `Flashlight` (battery, gutter, cone reveal test), `MoodGrade` (lerped lighting moods per game state)
- [Flight](docs/flight.md) — `FlightController`: arcade-honest fixed-wing flight (bank-to-turn, stall, taxi/takeoff/touchdown events) bridging to SCENA airframes via `aircraftInput`
- [Rail](docs/rail.md) — `RailController`: the vehicle that does not steer. A schedule, a stopping curve, honest ETAs, and an overrun you can read — driving a scalar along anything with a `length`
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
│ gama3d/rapier (optional entry point, peer dep on rapier)    │
│ PhysicsWorld · RigidBody · PhysicsCharacterController     │
├───────────────────────────────────────────────────────────┤
│ gama3d/react (optional entry point, peer deps react + r3f)  │
│ GamaProvider · Entity · useComponent · useFlockGrid       │
├───────────────────────────────────────────────────────────┤
│ gama3d/templates (characters in one call)                   │
│ createThirdPersonCharacter · createTopDownCharacter       │
│ createGuard · createCompanion · createFlock · Locomotion  │
└───────────────────────────────────────────────────────────┘
                          three.js
```

### Motion agents

A `MotionAgent` is a component that steers its `GameObject` by summing weighted forces from classic Reynolds steering behaviors. Behaviors take fixed points, live `Vector3` references, getters, or other agents — so targets can move.

```ts
import { MotionAgent, Pursue, Evade, Wander, Separation, Alignment, Cohesion, FollowPath, Path, StateMachine } from 'gama3d';

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

Measured — `npm run bench:throughput` — the grid overtakes a plain array at around **500 agents** (1000 agents: 8.8 ms/frame vs 25.7; 2000: 19.8 vs 91.9). Below that the array is faster and simpler, and the docs [say so](docs/motion.md#when-it-is-worth-it-measured) rather than assuming the fancy structure wins.

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
import { PhysicsWorld, RigidBody, PhysicsCharacterController } from 'gama3d/rapier';

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
import { Tweens, easing, Animator } from 'gama3d';

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
import { Assets } from 'gama3d';

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
- [x] Rapier adapter (`gama3d/rapier`): rigid bodies + physics character controller
- [x] Behavior trees (reactive composites, decorators, typed contexts)
- [x] Orbit and shoulder camera rigs (drag-orbit + pointer-lock mouse look with occlusion)
- [x] React-three-fiber bindings (`gama3d/react`): Entity/GameObject bridge, component hooks, flock grid
- [x] Documentation site with live, editable playground (`npm run site:dev`)
- [x] Character templates (`gama3d/templates`): third-person & top-down players, guard/companion/flock NPCs, Locomotion animation glue
- [x] Game templates (`gama3d/templates`): `createRace` (whole racer), `CricketMatch` (ball flight, timing window, laws-accurate scoring)
- [x] Procedural audio (`Soundboard`): sample-free synthesized SFX, engines/weather/crowd beds, buses & ducking, captions, offline-render verification
- [x] Game feel (`GameFeel`): trauma-squared screen shake, hit-stop, slow-mo with ease-back, haptic rumble
- [x] HUD (`Hud`): DOM overlay — score/timer/hearts, banner, objective, prompt, Soundboard caption line, canvas radar
- [x] Pickup loop: `Collector` (structural pickups/fields, respawn scheduling) and `CheckpointRun` (ordered gates, laps, setState painting)
- [x] Stakes: `Health` (i-frames, one-shot death edge, revive with mercy window, computed knockback) and `Projectiles` (pooled tracers, structural targets, team filtering)
- [x] Opposition: `Harass` steering (ring + band + seeded strafe) and `WaveDirector` (trickle spawns, rest, escalation under a ceiling, rubber-band pressure)
- [x] Retention: `GameFlow` (legal-move state machine, `gate()` pause), `Objectives` (clamped progress, once-only completion), `SaveSlot` (versioned envelope, null-means-null), `GhostRecorder`/`GhostTape`/`Ghost` (fixed-interval tapes, seam-safe yaw playback)
- [x] Platformer: `PlatformerController` (sub-stepped gravity, walls/ceilings, coyote time, jump buffer, variable jump height, moving-platform carry) + the coin-run payoff example
- [x] Light as gameplay: `Illumination` field (structural sources, live litness, pure math), `Flashlight` (battery drama, seeded gutter, cone reveal with angular slack), `MoodGrade` (structural rig targets, seamless interrupted blends)
- [x] Flight: `FlightController` (throttle→speed→lift, bank-to-turn, stall as a state, taxi/rotate/flare/touchdown with sink-rate events, `apply()` + `aircraftInput` bridges)
- [x] Hover: `HoverController` (collective/cyclic/pedals, rotor spool inertia, seeded hover breath, sink-rate touchdowns, `helicopterInput` bridge) + `rotorVoicing`/`RotorSound` (blade-pass tremolo — the wop-wop is amplitude, not pitch)
- [x] Rail: `RailController` (position is one scalar; the `√(2·brake·remaining)` stopping curve, exact landing at any step size, run-through when a mark was booked inside the braking distance, loop-aware schedules, ETAs that integrate the curve they drive)
- [x] Dialogue: conversations as data (`Dialogue`, `defineDialogue`) with a JSON condition/effect vocabulary chosen so `lintDialogue` can statically find dangling links, unreachable nodes, strandable choice lists and undeclared variables; hidden vs locked choices, save/restore mid-line, exact `counts`
- [x] Air combat: `Missiles` (lead pursuit under a hard turn-rate limit with speed-bleed — evadability as physics; seeded one-chance flare seduction; pooled instanced) + `LockOn` (cone/range/time, no credit for past devotion)
- [ ] Multi-layer navmesh generation (Recast-style voxelization)

## Development

```bash
npm install
npm test          # 524 vitest unit tests, no browser
npm run typecheck
npm run build     # tsup → dist (ESM + CJS + d.ts)
npm run dev       # vite dev server for examples/basic
```

And the things that need a browser or a socket, none of which a unit test can
stand in for:

```bash
npm run verify:playgrounds   # every playground example, headless, pixel-checked
npm run verify:editor        # the editor driven for real, 20 checks
npm run net:check            # two clients over real WebSockets, 10 checks
npm run perf                 # timing + exact counters + render budgets
```

All of the above run in CI on every push
([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) — a pipeline that ran
`npm test` and stopped would pass while the playground rendered black, while
the editor's raycast missed, and while the netcode dropped a handshake. Each of
those was a real bug, and none of them was found by a unit test.

Release notes live in [CHANGELOG.md](CHANGELOG.md).

## License

MIT
