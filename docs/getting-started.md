# Getting started

GAMA is a 3D game development library on top of three.js. It is not a wrapper:
a `GameObject` **is** a `THREE.Object3D`, the scene is a real `THREE.Scene`,
and everything from the three.js ecosystem works unchanged.

## Install

```bash
npm install gama three
```

## Your first game

```ts
import { Mesh, BoxGeometry, MeshStandardMaterial, AmbientLight, Vector3 } from 'three';
import { Game, MotionAgent, Seek, CharacterController, FollowCamera } from 'gama';

const game = new Game();                       // renderer, canvas, loop, input
game.world.scene.add(new AmbientLight(0xffffff, 1));

// A player driven by WASD / arrows / gamepad left stick
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

// A smoothed follow camera
const cam = new FollowCamera(game.camera, player, { offset: new Vector3(0, 8, 12) });
game.onUpdate((time) => cam.update(time.delta));

game.start();
```

## The three ideas

1. **`Game`** owns the loop. `game.onUpdate(cb)` runs every frame;
   `game.onFixedUpdate(cb)` runs at a constant rate (default 50 Hz) for
   framerate-independent logic.
2. **`GameObject` + `Component`** is the entity model. Spawn objects from
   `game.world`, attach `Component` subclasses for behaviour, and add
   three.js meshes/lights as children.
3. **`MotionAgent`** is how things move on their own. Attach one, add
   weighted steering behaviors, and the agent integrates forces, moves,
   and turns to face travel each frame.

## Debugging

```ts
import { DebugOverlay } from 'gama';
new DebugOverlay(game); // press F3 in-game
```

You get velocity arrows (cyan) and steering-force arrows (magenta) on every
agent, collider wireframes, and an FPS/entity/draw-call panel. When an agent
misbehaves, look at the magenta arrow — it shows you *why*.

## Examples in this repo

- `npm run dev` — player, pursuing chasers, a small flock, collectible pickups.
- `npm run dev:flock` — 400 boids with spatial hashing, obstacle avoidance
  and containment.

## Next

- [Motion agents & steering](./motion.md)
- [Core: loop, entities, events, pooling](./core.md)
- [Animation: tweens & clips](./animation.md)
- [Gameplay: input, camera, collisions, audio, assets](./gameplay.md)
