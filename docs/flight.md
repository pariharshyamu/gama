# Flight: the arcade-honest model

The trilogy's flight model keeps exactly the physics a player can FEEL
and nothing they can't. SCENA builds the airplanes; `FlightController`
flies them.

## FlightController

```ts
const flight = new FlightController({
  onTakeoff: () => hud.banner('AIRBORNE'),
  onStall: () => feel.shake(0.35),
  onLand: (sink) => feel.shake(Math.min(sink / 12, 0.5)),
});
game.onUpdate((t) => {
  flight.throttle = input.throttle;
  flight.control({ pitch: stick.y, roll: stick.x, yaw: rudder });
  flight.update(t.delta);
  flight.apply(airframe);                       // pose the mesh
  plane.update(t.delta, flight.aircraftInput);  // the SCENA plane shows it
});
```

The rules, in feel-order:

- **Throttle buys speed, speed buys lift.** Climbing costs energy;
  diving returns it.
- **Bank-to-turn.** Roll and pull — the coupling that makes flight
  feel like flight. A whisper of rudder helps; it doesn't replace it.
- **The stall.** Below `stallSpeed` the wings stop flying: the nose
  drops, the sky lets go, and only airspeed buys it back. `onStall`
  fires on entry; `stalled` reads live.
- **The ground is not optional.** On it, the controller taxis — rudder
  steers, wings stay level, and nothing flies until `rotateSpeed` plus
  a pull on the stick (`onTakeoff`). Touchdown fires `onLand(sinkRate)`
  and the CALLER judges it: a two is a greaser, an eight is a story.

`apply(object)` poses any Object3D from the state (yaw/pitch/roll);
`aircraftInput` mirrors the stick in the shape a SCENA plane's
`update` expects, so the control surfaces deflect and the gear drops
when low and slow — the model and the airframe never disagree.

## The stick is a rate

`control()` deflections are RATES, not attitudes — holding full back
keeps pitching until the clamp. Autopilots (and the `aviator` bot)
should chase target *attitudes* proportionally:

```ts
const stick = clamp((targetPitch - flight.pitch) * 4, -1, 1);
```

Two bugs this release's own bot wrote, both worth keeping: a
proportional-only roll command *integrated* into a saturated bank and
orbited its waypoint forever (chase a target bank instead); and a
too-gentle approach stick never got the nose down from a full-power
climb, stalling it onto the runway at 11 m/s (the telemetry's last
line before that fix: a perfect level skim at exactly flare height,
forever — an autopilot that flares too well never lands).

## Altitude bands & AI in 3D

The steering library already thinks in `Vector3` — `Pursue`, `Evade`
and friends work at altitude unchanged, and `Containment` pushes on
all three axes, so a tall `Box3` IS the altitude band that keeps AI
wingmen in the play volume. No new class needed; that audit is the
whole story.

## The aviator playground

The `aviator` example is the model demonstrating itself: takeoff,
a waypoint square at 14 m, and once per lap the autopilot cuts the
engine, holds the nose up, and lets physics do the teaching — stall,
nose-drop, sink, power-on recovery. The engine's voice (`EngineSound`)
follows the throttle the whole way.
