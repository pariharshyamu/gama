# GAMA — Gaming And Motion Agent

**GAMA** is a 3D game development library built on top of [three.js](https://threejs.org). It gives you the pieces three.js deliberately leaves out — a game loop, entities and components, input, cameras, tweening, gameplay collisions — and its signature feature: **motion agents**, a composable steering-behavior system for bringing NPCs, enemies, flocks and companions to life.

three.js renders. **GAMA makes it a game.**

## Vision

Most web games start the same way: a `requestAnimationFrame` loop, a pile of ad-hoc `update()` calls, keyboard flags scattered across event listeners, and enemy movement written as one-off vector math. GAMA packages those patterns into a small, typed, tree-shakeable library so you start at the gameplay layer, not the plumbing layer.

Design principles:

- **three.js-native, not a wrapper.** A `GameObject` *is* a `THREE.Object3D`. Anything from the three.js ecosystem — loaders, materials, postprocessing — works unchanged. GAMA never hides the renderer or the scene graph from you.
- **Motion is the product.** Character movement, steering-driven AI, animation cross-fades, camera rigs and tweens are first-class, because motion is what makes a 3D scene feel like a game.
- **Composable behaviors over inheritance trees.** An enemy is a `GameObject` + `MotionAgent` + a few weighted steering behaviors + a `StateMachine`. Swap behaviors at runtime to change how it moves.
- **Small and honest scope.** GAMA ships gameplay-level collisions (spheres, boxes, triggers), not a physics engine. When you need rigid-body dynamics, pair it with [rapier](https://rapier.rs) or cannon-es — a `GameObject` composes cleanly with either.

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

Run the bundled demo (player + pursuing chasers + a wandering flock + tweened pickups):

```bash
npm install
npm run dev
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│ Game            loop · renderer · resize · input    │
├─────────────────────────────────────────────────────┤
│ World           THREE.Scene + GameObject registry   │
│ GameObject      extends THREE.Object3D + components │
│ Component       onAttach / update(time) / onDetach  │
├──────────────┬───────────────┬──────────────────────┤
│ Motion       │ Animation     │ Gameplay             │
│ MotionAgent  │ Tween/Tweens  │ CharacterController  │
│ steering:    │ easing        │ FollowCamera         │
│  Seek/Flee   │ Animator      │ SphereCollider       │
│  Arrive      │  (mixer +     │ BoxCollider          │
│  Pursue/Evade│   crossfade)  │ checkCollisions      │
│  Wander      │               │ Assets (gltf/tex/    │
│  Separation  │               │         audio)       │
│  Alignment   │               │                      │
│  Cohesion    │               │                      │
│  FollowPath  │               │                      │
│ StateMachine │               │                      │
└──────────────┴───────────────┴──────────────────────┘
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

Available behaviors: `Seek`, `Flee`, `Arrive`, `Pursue`, `Evade`, `Wander`, `Separation`, `Alignment`, `Cohesion`, `FollowPath`. Implement the one-method `SteeringBehavior` interface to add your own.

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

- [ ] Spatial hashing for `Separation`/`Alignment`/`Cohesion` neighbor queries at scale
- [ ] Obstacle-avoidance and wall-following steering behaviors
- [ ] Navmesh path generation feeding `FollowPath`
- [ ] Gamepad support in `Input`
- [ ] Orbit and shoulder camera rigs
- [ ] Audio manager (positional audio, music cross-fade)
- [ ] Optional adapters for rapier physics bodies

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
