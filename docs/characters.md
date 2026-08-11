# Characters: templates & locomotion

`gama3d/templates` turns GAMA's parts into playable characters and living
NPCs in one call each. Templates are thin, readable factories over public
APIs — every part they build is returned, and when you outgrow the
options the intended move is to **copy the template's source into your
project and edit it**. They are conveniences, not a framework layer.

```ts
import {
  createThirdPersonCharacter, createTopDownCharacter,
  createGuard, createCompanion, createFlock, createCapsulePerson,
} from 'gama3d/templates';
```

Every template renders without assets: omit `model` and you get the
procedural **capsule person** (capsule + eyes, facing +z), so a template
is playable the second you call it. Pass `model: gltf` to swap in a real
character — and if the model has animation clips, they're auto-wired.

## Locomotion: the glue between moving and animating

The `Locomotion` component (in core `gama`) watches any controller or
agent — anything with `velocity` and optionally `grounded` /
`verticalVelocity` — and drives an `Animator`: idle/walk/run by speed,
jump/fall in the air, with cross-fades.

```ts
import { Animator, Locomotion, matchClips } from 'gama3d';

const animator = hero.addComponent(new Animator(gltf.animations, gltf.scene));
hero.addComponent(new Locomotion(animator, controller, {
  clips: matchClips(gltf.animations),  // fuzzy-maps "FastRun", "Idle_01", ...
  walkThreshold: 0.5,
  runThreshold: 4,
}));
```

`matchClips` handles Mixamo-style names, so `model: gltf` needs zero
animation configuration in the common case. Missing states fall back
sensibly (no walk clip → run is used for both).

## Third-person

```ts
const hero = createThirdPersonCharacter(game, {
  model: gltf,                  // optional — capsule person otherwise
  speed: 7,
  cameraColliders: [levelMesh], // camera never clips through these
});
// → { object, movement, rig, animator?, locomotion?, dispose }
hero.movement.jumpSpeed = 9;    // every part is exposed and retunable
```

Shoulder camera with pointer-lock mouse look and occlusion,
camera-relative WASD/stick movement, facing, jumping (with a flat-ground
arc), and auto-wired animation. For real level geometry — slopes, stairs,
pushing crates — use the physics sibling from the rapier adapter:

```ts
import { PhysicsWorld, createPhysicsThirdPersonCharacter } from 'gama3d/rapier';

const physics = await PhysicsWorld.create();
physics.attach(game);
const hero = createPhysicsThirdPersonCharacter(game, physics, {
  model: gltf,
  autostepHeight: 0.5,
});
```

Same shape, same options, but movement runs through rapier's character
controller.

## Top-down

```ts
// WASD flavour:
const hero = createTopDownCharacter(game, { speed: 8 });

// Click-to-move (ARPG) flavour — pass a navmesh and clicks pathfind:
const hero = createTopDownCharacter(game, { navMesh });
hero.object.events.on('nav-arrived', openChest);
```

Both come with a smoothed `FollowCamera` and a sphere collider for
pickups/triggers (`colliderRadius: 0` disables it).

## NPC archetypes

**Guard** — patrol route, chase on sight (with give-up hysteresis), walk
back afterwards. The behavior tree from the AI guide, productized:

```ts
const guard = createGuard(game, {
  route: [a, b, c],
  target: player.object,
  detectRadius: 8,
  onSpotted: () => music.combat(),
  onLost: () => music.calm(),
});
guard.mode;                      // 'patrol' | 'chase' | 'return'
guard.object.events.on('guard-spotted', ...);  // same signals as events
```

**Companion** — follows at a respectful distance, idles when close, and
teleports to catch up when left far behind (emitting
`companion-teleported` — the detail everyone forgets):

```ts
createCompanion(game, { owner: hero.object, followDistance: 3 });
```

**Flock** — the complete boid setup (separation/alignment/cohesion +
wander + containment + a SpatialGrid rebuilt per frame) in one call:

```ts
const birds = createFlock(game, {
  count: 150,
  bounds: new Box3(min, max),
  extraBehaviors: (agent) => agent.addBehavior(new Flee(() => hawk.position, 8)),
});
```

## Notes

- Templates take a `GameContext` — structurally just
  `{ world, camera, input, onUpdate, renderer? }` — so they work with the
  real `Game`, a custom loop, or a test stub.
- Everything a template creates lives on the returned record and the
  GameObject's components; `dispose()` tears it all down.
- See the playground's **Templates** group for live, editable versions of
  everything on this page.
