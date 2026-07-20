# Gameplay: input, camera, collisions, audio, assets

## Input & actions

`game.input` polls keyboard, pointer and the first connected gamepad:

```ts
input.isDown('KeyW');        // held (KeyboardEvent.code)
input.wasPressed('Space');   // edge since last frame
input.moveAxis(scratch);     // WASD/arrows + left stick, length ≤ 1
input.leftStick;             // Vector2, deadzone applied, y = forward
input.gamepadDown(0);        // standard-mapping button index
input.pointerNdc;            // pointer in [-1,1] NDC — ready for Raycaster
```

Bind **named actions** so game code never hardcodes physical keys:

```ts
import { ActionMap, GamepadButton } from 'gama';

const actions = new ActionMap(game.input)
  .bind('jump',   { keys: ['Space'], buttons: [GamepadButton.A] })
  .bind('attack', { keys: ['KeyJ'],  buttons: [GamepadButton.X] });

if (actions.wasPressed('jump')) ...
actions.bind('jump', { keys: ['KeyZ'] });   // runtime rebinding
```

## Character control & camera

```ts
player.addComponent(new CharacterController(game.input, {
  speed: 8,
  responsiveness: 12,   // accel smoothing — higher is snappier
  faceMovement: true,
}));

const cam = new FollowCamera(game.camera, player, {
  offset: new Vector3(0, 8, 12),
  stiffness: 5,          // higher = tighter follow
});
game.onUpdate((t) => cam.update(t.delta));
cam.snap();              // after teleports
```

### Camera rigs

Three rigs cover the common genres — all follow moving targets and are
updated from `game.onUpdate`:

- **`FollowCamera`** — fixed-offset smoothed follow (top-down, runners).
- **`OrbitRig`** — drag to orbit, wheel to zoom, with pitch/distance
  limits and smoothing (RTS, inspection, tactics):

  ```ts
  const rig = new OrbitRig(game.camera, hero, game.input, {
    distance: 12, minDistance: 4, maxDistance: 30,
    requireDrag: true,     // rotate only while the pointer is held
  });
  game.onUpdate((t) => rig.update(t.delta));
  ```

- **`ShoulderRig`** — over-the-shoulder mouse look for third-person
  action, with raycast occlusion pulling the camera in front of walls:

  ```ts
  const rig = new ShoulderRig(game.camera, hero, game.input, {
    shoulder: 0.6, distance: 3,
    colliders: [levelMesh],           // camera never clips through these
  });
  game.renderer.domElement.addEventListener('click', () =>
    game.renderer.domElement.requestPointerLock());
  game.onUpdate((t) => rig.update(t.delta));
  hero.rotation.y = rig.yaw;          // aim the character with the camera
  ```

  `rig.forward` (flattened look direction) drives camera-relative
  movement. Both rigs read `input.pointerDelta`/`wheelDelta`, which work
  under pointer lock.

## Collisions

GAMA ships gameplay-level collisions — triggers, pickups, hit detection —
not rigid-body physics (pair with rapier or cannon-es for that).

```ts
player.addComponent(new SphereCollider(0.7));
coin.addComponent(new SphereCollider(0.5, /* isTrigger */ true));

const collisions = new CollisionSystem();
game.onUpdate(() => collisions.update(game.world.objects));

player.events.on('collision-enter', (other) => {
  if (other.tags.has('coin')) collect(other);
});
player.events.on('collision-exit', (other) => { ... });
```

`CollisionSystem` tracks pairs across frames and fires enter/exit on **both**
objects at the moment of contact/separation. For a raw same-frame overlap
list, `checkCollisions(objects)` returns the pairs directly.

## Audio

```ts
const audio = new AudioManager(game.camera);   // listener rides the camera

audio.playOneShot(hitBuffer, { volume: 0.8 });
audio.playAt(enemy, growlBuffer, { refDistance: 4 });  // positional, follows enemy
audio.playMusic(themeBuffer);                          // loops, cross-fades from previous
audio.stopMusic(2);
audio.setMasterVolume(0.5);
```

Browsers block audio until a user gesture — start music from a click/keypress
handler (a "click to start" screen is the usual pattern).

## Assets

Promise-based, cached, with progress:

```ts
const assets = new Assets();
assets.onProgress = (loaded, total) => hud.setProgress(loaded / total);

const [hero, grass, theme] = await Promise.all([
  assets.gltf('models/hero.glb'),
  assets.texture('textures/grass.png'),
  assets.audio('music/theme.ogg'),
]);
```

Repeated requests for the same URL return the cached promise — safe to call
from anywhere without coordinating.
