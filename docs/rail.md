# Rail: the driver

Rail is the one vehicle class that does not steer.

Everything else in GAMA picks a direction and integrates it — agents steer,
cars drive, aircraft bank. A train's entire position is **one number**: how far
along the line it is. So `RailController`'s job is not "where do I go" but
**"how fast, and can I still stop in time"**.

```ts
import { RailController } from 'gama3d';

const driver = new RailController(line, { topSpeed: 22, accel: 0.6, brake: 0.9 });
driver.schedule([
  { at: platform.stopMark, dwell: 20, name: 'HAVENBROOK' },
  { at: 4200, dwell: 20, name: 'ASHFORD' },
]);
driver.onArrive((stop, overrun) => guard.blowWhistle(stop.name));

driver.step(dt);           // or add it to a GameObject and let fixedUpdate run
train.place(driver.distance);
```

The controller moves **nothing**. It owns `distance`, and placing the train is
the game's job. That is what keeps it free of geometry — and why it takes a
`RailLine`, which is just `{ length, loop? }`.

## The handshake

`RailLine` is a **shape, not a package**. SCENA's `createTrack` returns
something with `length` and `at()`, so it fits without either library knowing
the other exists:

```ts
const line = createTrack(points);        // scena3d
const driver = new RailController(line); // gama3d — reads only `length`
```

and a hand-rolled cumulative-length table fits just as well. The
[railway playground](?example=railway) builds its own from a
`CatmullRomCurve3` in about fifteen lines, precisely to show that GAMA is not
reaching for SCENA here.

## The one number that has to be right

```ts
driver.stoppingDistance;   // v² / 2·brake, in metres, right now
```

At the defaults — 22 m/s line speed, 0.8 m/s² service braking — a train needs
**302 metres** to stop. Everything that makes driving a train feel like driving
a train comes out of that number being large: you commit to a stop long before
you can see the platform, and once you are inside it you are going there.

A train you can stop on a sixpence is a car.

## The braking law

Speed is capped at the fastest the train could still stop from in what it has
left:

```
v ≤ √(2 · brake · remaining)
```

Following that ceiling down *is* braking at exactly the brake rate. It is the
closed form of "am I inside my stopping distance yet?", not an improvement on
it — measured side by side, the two land identically and differ only in the
speed left on the final step. The closed form is used because `remaining` then
bounds the speed continuously.

**What was actually wrong**, and is worth remembering: an earlier version
arrived when `distance ≥ target` *and* `speed < 0.05`, with the last step
clamped so the train could not pass the mark. That is a train which reaches the
platform and then **shivers in place for 2.4 seconds** at 10 Hz while its speed
bleeds off against the clamp. The brake law had nothing to do with it.

## Landing, overrunning, and why there is no tolerance

Two things must both be true, and they pull against each other:

- a train correctly approaching a mark must **land on it exactly**, at any step
  size;
- a train given a mark inside its braking distance must **run through it**,
  because that is what a train does.

The first was easy and the second was easy; telling them apart was not. The
last few centimetres of any discrete approach are unstoppable — `√(2br)` has
infinite slope at the mark, so the train leaves the ceiling around 0.6 m/s with
10 cm to run and the brakes can only shed `brake·dt` per step.

The first attempt tested that gap against a per-step tolerance. It got **worse
the faster the frame rate**: a smaller `dt` bought a tighter tolerance for a
gap that an earlier long frame had already opened. Found in the browser, not in
the tests — a train 0.39 m short at 1.11 m/s ran straight through HAVENBROOK,
and because a loop line wraps the gap, the station became a whole lap away and
the train accelerated off to go round again.

What replaced it asks about the **approach**, not the step:

> Was this train ever able to stop for this mark?

If it was, the last centimetres are discretisation and it lands. If it never
was, no tolerance should be able to fake it. The question does not mention `dt`
at all, and it resets whenever the mark changes — a train happily running for
the buffers has earned a "yes" for the buffers, not for a stop booked in front
of it a moment later.

```ts
driver.onArrive((stop, overrun) => {
  if (overrun > 0.5) hud.banner('OVERRUN — ' + overrun.toFixed(0) + ' m past');
});
```

`overrun` is 0 for every normal arrival. It is accumulated as the train runs
through, not computed as `distance - target`, because a loop's wrap makes that
subtraction meaningless.

## Honest ETAs

```ts
driver.etaTo(platform.stopMark);   // seconds
```

Dividing distance by current speed reports a number the train cannot achieve.
`etaTo` integrates **the same stopping curve `step` drives**, stops at every
scheduled stop in between, adds their dwell, and adds whatever is left of the
dwell the train is standing in right now. It returns `Infinity` for a target
behind a line with ends, and goes the long way round on a loop.

## Emergency braking cannot cause an overrun

`emergencyStop()` ignores the schedule and brakes at `emergencyBrake` (default
double the service rate). It is dramatic, but it can never carry a train
*through* a mark it was already braking for: a train inside its service curve
is inside the emergency curve by a wider margin still, so it always comes to a
stand short. `resume()` picks the approach up from wherever that is.

## The schedule

| | |
|---|---|
| `schedule(stops)` | sorted on the way in; an out-of-order route is undriveable |
| `dwell` | seconds standing. `0` still stops — there is no passing timing point |
| `nextStop` | the mark being approached, `null` past the last one |
| `state` | `running` · `braking` · `stopped` · `dwelling` |
| loop lines | run the schedule round again; that is what a circle line is |
| lines with ends | stop at the buffers, unless `buffers: false` |

A stop **behind** the train on a line with ends is dropped the moment it would
become the target — it can never be reached, and a driver waiting for one would
stall every stop behind it. No arrival fires: the train never stopped there.

## What it does not model

Traction curves, adhesion, wheel slip, brake fade, gradient resistance. That is
a simulator; this is the arcade model, the same choice
[`FlightController`](flight.md) makes and for the same reason. What a game
needs is that the train accelerates, that it cannot stop instantly, and that
arriving on the mark takes planning.

No points, junctions or signalling either — a train that can *choose* a path
stops being a scalar and becomes a graph problem.
