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

### Throwing: `throwObject`

The release half of the carry verb. Hand it an object already in world space — straight from ANIMA's `Carry.putDown()` — and it flies a ballistic arc (with tumble) until it hits the ground, then fires `onLand`:

```ts
const box = carry.putDown();                                   // back in the world, mid-air
const fly = throwObject(box, { to: cartBed, peak: 2.2, ground: cartBed.y, onLand: stack });
game.onUpdate((t) => { if (fly) fly(t.delta); });              // arc → tumble → land
```

Give it a `velocity`, or a target `to` (+ `peak`) and it solves the launch velocity for you (`ballisticVelocity` is that solver, exported). `ground` is the landing height — a number or `(x,z) => y`, so it lands on a cart bed, not the floor. The updater returns `false` once it has landed. See the **carryables** example — a porter loads a crate onto a cart.

## Resources: `Stockpile`

The "produce something" payoff for work stations, crafting and gathering. A `Stockpile` counts named resources with `add`/`remove`/`spend`, emits `change` (with the delta) and `full`, and clamps at 0 and an optional `capacity`. Wire a SCENA `WorkStation.onYield` into it and a HUD to its event:

```ts
const stock = new Stockpile({ capacity: 99 });
choppingBlock.onYield = () => stock.add('wood');
stock.events.on('change', ({ resource, count }) => hud.set(resource, count));

if (stock.spend('wood', 5)) build(fence);   // spend only succeeds if affordable
```

Not a component — keep one per player or base and share it. See the **work stations** example, where a worker's chop/mine/saw/stir fill the stockpile shown in the HUD.

## Seats: `Occupancy`

Who is sitting where — the bookkeeping that stops two villagers sharing a chair, and the *manners* that stop them all piling onto the same end of a bench. Hand it a SCENA gathering's `seats` (structurally just `{ anchor, approach? }`, so your own will do):

```ts
const bench = createLongBench({ seats: 4 });                 // SCENA
const seating = new Occupancy(bench.seats, { personalSpace: 1.5 });
const seat = seating.claim(villager, { from: villager.position });
agent.moveTo(seat.approach ?? seat.anchor);                  // walk there first
// …on arrival: interaction.use(seat)                        // ANIMA stages the sit
seating.release(villager);                                   // when they get up
```

The interesting part is `claim`. It does **not** hand out the nearest free seat — it scores each one against how far the claimer must walk *and how close it puts them to whoever is already sitting*. So the first arrival takes an end, the second takes the far end, and only once the bench is busy does anyone squeeze into the middle. That is what people actually do, and it is startlingly more convincing than any amount of extra polish on the sitting animation itself.

| option | what it does |
| --- | --- |
| `personalSpace` | how hard occupants avoid company (0 = a queue, 1 = people, 2 = antisocial) |
| `spacing` | the distance under which two seats feel adjacent (metres) |
| `effort` | how much the walk matters against the company |
| `whim` | how often someone takes a seat that isn't the optimal one — real people are not optimisers |

`claim` returns null when the place is full; claiming twice moves the owner and frees their old seat. `nearestFree(from)` ignores company entirely, for queues and docks. Events: `claim`, `release`, `full`.

**`stagger(count, { spread, lead, seed })`** gives a group uneven start times. Nothing betrays a crowd of puppets faster than all of it moving on the same frame; these delays clump and trail off rather than ticking like a metronome. See the **gatherings** example.

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

## Cricket: `CricketMatch`

`CricketMatch` (in `gama3d/templates`) is a whole short-format match as **rules and a ball** — no scene, no meshes, no three.js beyond a vector. Pair it with SCENA's `createCricketGround` for the field and ANIMA's `Cricketer` for the action, and the three libraries meet at nothing more than positions and a callback.

```ts
import { CricketMatch } from 'gama3d/templates';

const match = new CricketMatch({ overs: 2, wickets: 2, boundary: 62, swingLead: 0.42 });
match.onBall((o) => console.log(o.runs, o.wicket, o.timing));
match.onOver((n) => console.log(`end of over ${n}`));
match.onEnd((result) => hud.textContent = result);

match.bowl();                                  // the ball is on its way
button.onclick = () => match.swing('drive');   // commit a stroke
game.onUpdate((t) => match.update(t.delta));
```

### The ball actually flies

`bowl()` releases from a hand at 2.15 m and the ball drops under gravity, **pitches once** — losing pace off the deck and standing up off the seam — and arrives at the batter around stump height. That is not decoration: it is where the timing window comes from. A ball that pitches shorter has longer to rise and arrives higher; a fuller one skids on. Length and pace both move every delivery, so no two are the same and you have to watch each one.

`match.ball` is a live `Vector3` you can copy straight onto a SCENA `createCricketBall`.

### The bat takes time to come down

This is the part that makes it a game rather than a reaction test. `swing(shot)` does not resolve anything — it **commits** a stroke, and the bat arrives `swingLead` seconds later (0.42 by default, which is ANIMA's `CONTACT_PHASE` on a shot clip). Only then does the game look at where the ball got to.

The result is `error`, in seconds: negative if the bat was early, positive if it was late. That number is the whole difficulty curve.

| `timing` | error | |
|---|---|---|
| `middled` | ≤ 0.05 s | everything the shot has |
| `good` | ≤ 0.13 s | most of it |
| `early` | −0.30 … −0.13 s | thin, and in the air |
| `late` | +0.13 … +0.22 s | if the stumps have not already gone |
| `missed` | beyond | bowled, or through to the keeper |

The bands are for the scorecard; the ball itself feels a **continuous** strike quality, which is why two middled drives are never quite the same shot. `previewError()` flies the ball forward for real — through the bounce, if it has not pitched yet — and reports how far off a bat committed *right now* would be, for a coaching overlay.

The bat lands at an exact instant, sub-frame: 30 fps and 240 fps play the same innings.

### The shots, and the risk

| | |
|---|---|
| `drive` | straight, hard, along the ground — the safest way to four |
| `pull` | square and flat, and it beats the ring if it is middled |
| `defend` | no power at all; you cannot be caught off a shot you did not play |
| `loft` | the six, or the catch — there is no third outcome that matters |

A mistimed ball hit high is taken on the way down, weighted by the shot's own risk. Leave the ball and it hits the stumps about half the time. Swing too late and it is already through the gate.

### The scoring is the laws

Six if it cleared the rope in the air, four if it beat it along the ground, and otherwise what the batters could run. Six balls to an over, wickets bowled and caught, and a chase that ends **the instant** the target is passed. `endInnings` swaps to the second innings with `target`, `needed` and `firstInnings` set; the second one produces `result` — a chase won by wickets, a defence won by runs, or a match tied.

```ts
match.oversBowled;   // "1.3" — one over and three
match.ballsLeft;
match.needed;        // second innings only
match.next();        // ready the next delivery; false once the match is over
```

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

## Device — powered things

Every other prop wears its state: a door is open or shut and you can see which. A device's state is invisible except through what it is displaying, and it does not change instantly. Those delays are the whole difference between a prop that has a light on it and a prop that feels powered.

```ts
const tv = new Device({ boot: 2.4 });
tv.attach(screenPanel);          // anything with setMode(mode: string)
tv.press();                      // the remote — then watch it boot
game.onUpdate((t) => tv.update(t.delta));
```

States: `off → booting → on`, and `on → dimmed → sleeping` on an idle timer, with `sleeping → waking → on`. `progress` reports 0..1 through a boot or a wake.

The realism is in the asymmetries:

- **A cold boot takes seconds; waking from sleep is near-instant.** `boot` defaults to 2.2 s, `wake` to 0.45 s.
- **Mashing the power button during a boot does nothing.** Neither does it in life.
- **Idle is opt-in** (`idle: 0`, the default, never dozes). A desk monitor dims and then sleeps; a television does not do that halfway through a film.
- **`nudge()` resets the idle clock** and wakes a dozing device — what actually happens when somebody sits back down at a machine.
- **Content survives a sleep.** `show('video')` is remembered separately from the power state, so waking returns to the film rather than dumping the viewer at a home screen.

`attach` takes anything with `setMode(mode: string)`, which is exactly what SCENA's `ScreenPanel` publishes — so GAMA drives what a SCENA screen shows with neither library importing the other.

## Attention — what interrupts somebody

Every prop in the trilogy so far waits to be used. Nothing initiates. A phone that rings is the first thing in the world that reaches out and pulls a character out of what they were doing.

```ts
const attention = new Attention({ seed: 3 });
attention.onNotice = (alert) => gaze.glance(alert.at, 1.2);
broadcast({ kind: 'ring', urgency: 0.9, at: phone.position, range: 9 }, crowd);
game.onUpdate((t) => attention.update(t.delta));
```

Interruption turns out to be almost entirely about the things that are *not* uniform:

- **Nobody reacts at the same speed.** A shared latency makes a room turn like a chorus line. Each character draws its own reaction time, fresh for every alert, and the more insistent the alert the faster they come round to it.
- **Not everybody reacts at all.** `sensitivity` sets the type, and a little noise on the judgement means two characters with the *same* sensitivity still disagree about a marginal alert — otherwise `sensitivity` is a constant and a dozen identical characters either all look up or none do.
- **The fifth buzz is not the first buzz.** Interest in a *kind* of alert wears out as it repeats and recovers exponentially while it is quiet. Without this a repeated alert produces an identical response forever, which reads as clockwork inside about three repeats. Getting sick of a buzzing phone does not make you deaf to a doorbell — fatigue is per kind.
- **Insistence outranks.** A buzz does not interrupt a phone call, but a ring interrupts a buzz. `onIgnore` says which of `weak`, `busy` or `tired` applied, which is what you want when a room has gone quiet and you need to know why.

`broadcast` offers an alert to a group with distance falloff, so a ring in the next room is quieter, and returns how many took it up — which will not be all of them.

## Queue — who is next

`Occupancy` answers *who sits where* — a fixed set of places, claimed and released. `Queue` is its sibling and answers *who is next*: an ordered line where the only place that matters is the front.

```ts
const queue = new Queue<Character>({ service: 14, spacing: atm.spacing });
if (queue.join(person) === null) wanderOffInstead(person);   // they balked
game.onUpdate((t) => {
  queue.update(t.delta);
  const at = atm.line.localToWorld(new Vector3(0, 0, -queue.distanceOf(person)));
});
```

The bookkeeping is the easy half. What makes a rendered queue look real:

- **The shuffle is staggered.** When the head leaves, a queue does not advance as one — each person notices in their own time, so the gap travels back down the line like a wave. Advancing everyone on the same frame is a conveyor belt and reads as one instantly. People further back notice later, too.
- **Gaps are not uniform.** People leave different amounts of room, and the same person leaves the same amount every time.
- **People balk.** `join` returns `null` when the line is longer than they will tolerate — with per-person variation, so the same line turns some away and not others. A hard cutoff makes a queue snap between "everyone joins" and "nobody does" at one length.
- **People renege.** `giveUpAfter` makes them leave having already joined, which is what stops a jammed line growing forever. Nobody walks out mid-transaction — the person being served stays.

`distanceOf` eases, so a caller drives a walk toward it rather than teleporting.

## Automation — devices wired to each other

A smart home is a graph: a sensor drives a lamp, a switch drives a scene. Modelled naively it is a lookup table and it feels like one. Two properties do the work:

```ts
const home = new Automation({ seed: 2 });
home.hold('motion', 14);                     // sensor holds after the last trigger
home.link('motion', 'lamp', { delay: 0.4 });
home.on('lamp', (v) => (light.intensity = v * 6));
```

- **Nothing happens instantly.** You flip a smart switch and the light comes on *a beat later*. That lag is the single most recognisable quality of the real thing; without it the graph reads as a light switch with extra steps. Delays are jittered per link, so a bank of identical devices does not answer as one.
- **Sensors hold.** A motion sensor that drops the instant you stop moving turns the lights off on somebody sitting still at a desk — the classic real-world failure, and modelled, the classic tell of a fake one. A re-trigger *refreshes* the hold rather than restarting the channel, so a person moving about produces one rise and no flicker.

Cycles are rejected at `link` time rather than discovered at runtime, and a change already travelling to a target supersedes an earlier one — a switch flicked twice quickly settles once.

## Recipe — what to do next

The kitchen tracks in SCENA built every *thing*: a stove that publishes heat as a field, a cold store that publishes preservation, prep benches that yield, a sink with a queue of dishes, ingredients that go off. What none of them answer is the only question an agent actually has — **what should I do now** — and that is not a list, it is a graph.

```ts
const stew = new Recipe({
  steps: [
    { id: 'chop',  station: 'board', takes: { onion: 1, carrot: 2 }, makes: 'mirepoix' },
    { id: 'brown', station: 'stove', takes: { meat: 1 }, makes: 'browned' },
    { id: 'simmer', station: 'stove', needs: ['chop', 'brown'],
      takes: { mirepoix: 1, browned: 1, stock: 1 }, makes: 'stew', seconds: 30 },
  ],
});

const next = stew.ready(pantry)[0];
if (next && stew.begin(next.id, cook, pantry)) walkTo(stations[next.station]);
```

It never moves anybody and never touches a mesh. It answers three questions: `ready(pantry)` — what could be started now; `missing(pantry)` — what to go and fetch if nothing could; `progress` — how far through we are.

### Ready is computed, never stored

That is the whole difference between a dependency graph and a checklist. A step is ready when its dependencies are done **and** its inputs are in the pantry — so putting an onion on the counter unblocks a step nobody touched, and a fish going off re-blocks one that was ready a second ago. Nothing has to be told, and no part of the chain knows about any other part of it.

### Inputs go at `begin`, not at `finish`

Taking them at the end lets two cooks both start the same step with one onion between them, and **the bug only shows up when a second agent exists** — which is to say in the demo, not in the tests, unless there is a test for it. There is one.

Abandoning a step **loses** its inputs by default: a half-chopped onion is not an onion. `refundOnAbandon` if your game disagrees.

### `missing` is a shopping list, not a wish list

It asks only for what **nothing in the recipe can make**. Leave out that test and the list becomes a demand for the stew you are trying to cook. It also stops asking for the things whose step is already done — nobody needs to fetch more onions once they are chopped.

Together that is a complete agent decision: `ready()` first, and if nothing is ready, `missing()` says where to go.

### Cycles are rejected at construction

A recipe whose step A needs B needs A is not a recipe that runs badly. `ready` returns an empty list forever and `progress` sticks, which looks exactly like an agent that has decided to stand still and is very hard to diagnose from there. Same for a dependency on a step that does not exist, which blocks that step silently and permanently. Both throw when the recipe is built.

### It composes outward, importing nothing

`Pantry` is anything with `count`, `add` and `remove` — `Stockpile` is one. And `finish` is what a SCENA `WorkStation.onYield` calls, so a recipe driven by real work never calls `update` at all and times nothing itself. `update` is there for steps that are just a wait.
