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
import { ActionMap, GamepadButton } from 'gama3d';

const actions = new ActionMap(game.input)
  .bind('jump',   { keys: ['Space'], buttons: [GamepadButton.A] })
  .bind('attack', { keys: ['KeyJ'],  buttons: [GamepadButton.X] });

if (actions.wasPressed('jump')) ...
actions.bind('jump', { keys: ['KeyZ'] });   // runtime rebinding
```

### Touch controls (mobile)

`TouchControls` gives a keyboard game a phone port in **one line** — no branching. It draws an on-screen analog joystick and optional buttons, and writes them into the same `input.moveAxis()` / `input.isDown()` your game already reads (via the input's virtual axis and virtual keys):

```ts
import { TouchControls } from 'gama3d';

new TouchControls(game.input, {
  buttons: [{ label: 'A', code: 'Space', css: 'right:26px;bottom:38px' }],
});
// input.moveAxis() now reflects the joystick; input.isDown('Space') the button.
```

It shows only on touch devices by default (`show: 'auto'`), and is purely additive — keyboard and gamepad keep working alongside it, so you can test on desktop. The joystick feeds `input.virtualAxis`; buttons call `input.pressVirtual(code)`; any source can write those directly if you want a custom overlay.

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

Detection reports contact; **`resolveCircleCollisions`** stops it — the arcade "bodies can't pass through each other" you want when cars jostle or a crowd shouldn't interpenetrate. It pushes overlapping `SphereCollider`s apart on the XZ plane (positional only — no momentum):

```ts
game.onUpdate(() => resolveCircleCollisions(game.world.objects));
```

Tag a body `'static'` and it holds its ground while pushing others (walls, parked cars); triggers are skipped. Returns how many pairs it separated.

## Mechanisms & interaction

The "operate and the world responds" verb. A **`Mechanism`** is anything with `open` / `toggle()` / `set()` / `update()` — structurally identical to SCENA's `Manipulable` (doors, levers, drawers, portcullises), so GAMA drives and wires them with no cross-imports.

**`Interactable`** makes one operable in the world — attach it to a body co-located with the prop:

```ts
const post = game.world.spawn('lever'); post.add(lever.object);
post.addComponent(new Interactable(lever, {
  input: game.input, key: 'KeyE',           // press to operate when in range…
  onOperate: (open) => playReachGesture(),  // …fire the ANIMA reach here
}));
post.events.on('operated', () => {});
```

Set `mode: 'auto'` and it becomes an **automatic door** — open while a tagged body is near, closed when they leave. It eases the mechanism's joint (`update`) for you.

**`Trigger`** is the bare proximity primitive — a pressure plate, a detection volume — firing `onEnter`/`onExit` (and `trigger-enter`/`trigger-exit` events) for tagged bodies crossing its radius:

```ts
plate.addComponent(new Trigger({ radius: 1.5, tag: 'player',
  onEnter: () => gate.set(true), onExit: () => gate.set(false) }));
```

And **`linkMechanism`** is level logic — one mechanism driving another. A thrown lever raises a portcullis; a switch opens a gate:

```ts
linkMechanism(lever, portcullis);                  // lever opens → gate rises
linkMechanism(lever, trapdoor, { invert: true });  // …and the trapdoor shuts
```

Together with SCENA's manipulables and ANIMA's `Gesture` reach, these are a keeper throwing a lever to raise a gate, an automatic door, and an opened chest — see the **manipulables** example in the ANIMA playground.

## Vehicles & racing

### The whole game: `createRace`

`createRace` (in `gama3d/templates`) packages the entire assembly — player car, AI rivals, chase camera, touch controls, car-vs-car collision, and live lap **standings with a finish** — so a playable, mobile-ready racer is the world-building plus a dozen lines of glue:

```ts
import { createRace, Circuit } from 'gama3d/templates';

const circuit = new Circuit(WAYPOINTS);              // SCENA's createPath draws the ribbon
scene.add(createPath(WAYPOINTS, { loop: true }).mesh);

const race = createRace(game, {
  circuit,
  player: { object: playerCar.object, vehicle: playerCar },   // SCENA car + running gear
  rivals: [
    { object: r1.object, vehicle: r1, speed: 10 },
    { object: r2.object, vehicle: r2, speed: 11 },
  ],
  laps: 3,
});
race.onFinish((r) => showResults(`You finished P${r.position} — ${r.totalTime.toFixed(1)}s`));
game.onUpdate(() => {
  const s = race.state;                              // recomputed standings each read
  hud.textContent = `P${s.position}/${s.total} · LAP ${Math.min(s.lap + 1, 3)}/3 · ${(s.bestLap === Infinity ? 0 : s.bestLap).toFixed(1)}s`;
});
```

It grids the field just past the start line (pole furthest ahead), drives the player from `input.moveAxis()` (keyboard, gamepad **and** the auto-mounted `TouchControls`), steers the rivals around the racing line, pushes overlapping cars apart so nobody drives through anybody, chases the player, and tracks every car's lap for `state.standings` (leader first) and `state.position` (your place). Parent an ANIMA driver onto `race.player.object` and they ride the moving seat. `race.reset()` returns the field to the grid; `race.dispose()` unhooks it.

It's built entirely from the public pieces below — when the options run out, copy the `Race` source into your project and edit it. Those pieces on their own:

### `VehicleController` is the player car: feed it driver intent (throttle/steer in [−1, 1]) and it handles eager acceleration, coast drag, braking, reverse, speed-scaled steering (no spinning while stopped) and optional off-track grip loss, moving and yawing its owner and driving a SCENA vehicle's running gear so the wheels spin:

```ts
const car = createCar();                            // SCENA visual + slots
const body = game.world.spawn('player'); body.add(car.object);
const drive = body.addComponent(new VehicleController(game.input, {
  vehicle: car,                                     // structural — no SCENA import
  offTrack: (x, z) => circuit.distanceTo(x, z) > 4, // grass past the verge
}));
// Reads input.moveAxis() by default → keyboard, gamepad AND TouchControls all drive it.
```

For **AI cars**, keep using a `MotionAgent` (it already steers and faces its velocity) and connect its output to the running gear with `driveVehicle` — the adapter that used to be a copy-pasted heading-wrap loop:

```ts
const agent = rivalBody.addComponent(new MotionAgent({ maxSpeed: 10 }));
agent.addBehavior(new FollowPath(new Path(waypoints, true), 2));
const spin = driveVehicle(agent, rivalCar);
game.onUpdate((t) => spin(t.delta));                // wheels spin, fronts steer
```

Chase it all with **`ChaseCamera`** (heading-aware, unlike the fixed-offset `FollowCamera`):

```ts
const cam = new ChaseCamera(game.camera, car.object, { distance: 8.5, height: 4.4 });
game.onUpdate((t) => cam.update(t.delta));
```

And the racing **template** (`gama3d/templates`) turns a waypoint loop into gameplay. `Circuit` answers *how far off the line am I?* (grip loss) and *how far round am I?* (standings); `LapTracker` counts forward line crossings and times them:

```ts
import { Circuit, LapTracker } from 'gama3d/templates';

const circuit = new Circuit(WAYPOINTS);             // SCENA's createPath draws the ribbon
const laps = new LapTracker(circuit, { laps: 3 });
game.onUpdate((t) => {
  const s = laps.update(t.delta, car.object.position.x, car.object.position.z);
  hud.textContent = `LAP ${s.lap + 1}/3 · ${s.lapTime.toFixed(1)}s · best ${s.bestLap.toFixed(1)}s`;
});
```

Together — and wrapped up for you by **`createRace`** above — `TouchControls` + `VehicleController` + `ChaseCamera` + `Circuit`/`LapTracker` + `driveVehicle` + `resolveCircleCollisions` are a playable, mobile-ready racer with rivals that bump and a finish line. See the **Pocket racer** in the ANIMA playground.

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
