# Physics: the rapier adapter

GAMA's built-in colliders cover gameplay triggers and pickups. For real
rigid-body dynamics — stacking crates, bouncing balls, characters that
climb stairs — GAMA ships a thin adapter over
[rapier](https://rapier.rs), behind a separate entry point so the core
library stays dependency-free.

```bash
npm install @dimforge/rapier3d-compat   # optional peer dependency
```

```ts
import { PhysicsWorld, RigidBody, PhysicsCharacterController } from 'gama3d/rapier';
```

Importing `gama` never loads rapier or its WASM — only `gama3d/rapier` does.

## PhysicsWorld

```ts
const physics = await PhysicsWorld.create({ gravity: { x: 0, y: -9.81, z: 0 } });
physics.attach(game);   // steps at the game's fixed rate (see docs/core.md)
```

`attach` uses `game.onFixedUpdate`, and physics steps run *before*
component `fixedUpdate`s — so `RigidBody` components always sync fresh
transforms in the same frame. The raw `RAPIER.World` is exposed as
`physics.raw` for ray casts, joints, and everything else rapier offers.

## RigidBody

Binds a rapier body to a GameObject, created at the object's current
transform on attach:

```ts
// Dynamic: physics moves the object.
crate.addComponent(new RigidBody(physics, {
  collider: { shape: 'box', halfExtents: new Vector3(0.5, 0.5, 0.5), friction: 0.6 },
}));

// Fixed: static level geometry (walls, floors, ramps).
ground.addComponent(new RigidBody(physics, {
  type: 'fixed',
  collider: { shape: 'trimesh', geometry: levelGeometry },
}));

// Kinematic: you move the GameObject; physics follows and pushes
// dynamic bodies out of the way (moving platforms, doors).
platform.addComponent(new RigidBody(physics, { type: 'kinematic', collider: ... }));
```

Shapes: `box`, `sphere`, `capsule`, `trimesh` (from any `BufferGeometry`).
Options: `friction`, `restitution`, `density`, `offset`, `isSensor` per
collider (an array of colliders builds a compound body); `ccd` for fast
movers, `lockRotations` for upright bodies, damping.

Helpers: `applyImpulse`, `setLinearVelocity`, `getLinearVelocity`,
`teleport`. The body is removed from the world on component detach.

Physics objects should be top-level in the world (their local transform is
their world transform) — the norm for anything physics-driven.

## PhysicsCharacterController

The real-game replacement for the planar `CharacterController`: a
kinematic capsule driven by rapier's character controller. It walks
slopes, auto-steps up stairs, snaps to ground on descents, applies
gravity, jumps, and shoves dynamic bodies out of its way.

```ts
player.position.set(0, 0.9, 0); // capsule center: halfHeight + radius above ground
const controller = player.addComponent(
  new PhysicsCharacterController(physics, game.input, {
    speed: 7,
    jumpSpeed: 9,
    autostepHeight: 0.5,
    maxSlopeClimbAngle: (50 * Math.PI) / 180,
  })
);

game.onUpdate(() => {
  if (game.input.wasPressed('Space')) controller.jump();
});
```

- With `input`, WASD/arrows/left-stick drive it. Without, set
  `controller.moveIntent` (world-space velocity, units/s) from AI or
  network code — same controller for players and NPCs.
- `controller.grounded` and `controller.verticalVelocity` are readable
  for animation state (falling vs. jumping vs. running).
- `jump()` only fires when grounded; `teleport()` resets cleanly.

Movement runs in `fixedUpdate`, so character physics is
framerate-independent by construction.

## What stays in core

`SphereCollider`/`BoxCollider` + `CollisionSystem` remain the right tool
for triggers and pickups even in a rapier game — they're cheaper than
sensor colliders and emit GameObject events directly. Use both: rapier
for things that move physically, GAMA colliders for gameplay volumes.

See `examples/physics` (`npm run dev:physics`) for the full playground:
ramp, staircase, crate pyramid, bouncy balls, and a jumping character.
