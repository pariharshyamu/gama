# Retention: flow, goals, saves, ghosts

A game that plays well for ninety seconds still needs a reason to be
played tomorrow. This pillar is that reason, in four small parts: a
flow that gives the session a shape, objectives that tell the player
what "done" means, a save slot that remembers, and ghosts — the
translucent rival that makes *yesterday's you* the opponent.

## GameFlow — the state machine every game has anyway

```ts
import { GameFlow } from 'gama3d';

const flow = new GameFlow({
  onEnter: { playing: () => hud.banner('GO!'), results: () => showResults() },
});
flow.to('playing');            // legal moves return true
game.onUpdate((t) => {
  const dt = flow.gate(t.delta);   // 0 unless playing
  world.update(dt);
});
```

Four states — `title`, `playing`, `paused`, `results` — and a legality
map: illegal transitions are *refused* (return `false`), not thrown,
because a double-tapped pause button is input noise, not a bug.
`gate(dt)` is the whole pause implementation: it returns the frame's
delta while playing and `0` otherwise, so everything downstream that
already runs on fed time — Collector respawns, Hud banners, wave
timers, ghost recorders — freezes for free the moment you leave
`playing`. No `paused` flags sprinkled through gameplay code.

## Objectives — what "done" means

```ts
const goals = new Objectives(
  [
    { id: 'coins', label: 'Collect coins', target: 10 },
    { id: 'gate', label: 'Open the gate' },
  ],
  { onComplete: (g) => sounds.chime(), onAllComplete: () => flow.to('results') }
);
collector.onCollect = () => goals.advance('coins');
hud.objective(goals.summary());
```

Counters with a target (`3/10`) and booleans without one; progress
clamps at the target, `onComplete` fires exactly once per goal, and
`onAllComplete` fires when the last one lands. `summary()` returns
ready-to-display lines (`✓ Collect coins 10/10`) so the HUD objective
panel is one call. `reset()` rewinds everything for the next attempt.

## SaveSlot — the all-procedural bet pays off

```ts
const slot = new SaveSlot<{ seed: number; best: number }>('coinrun', { version: 2 });
slot.save({ seed: 7, best: 41.3 });
const loaded = slot.load();   // null: absent, corrupt, OR old version
```

Everything in this trilogy generates from seeds, so a save is not a
world — it is a seed and a handful of numbers, kilobytes at most.
`SaveSlot` wraps the boring-but-load-bearing parts: a versioned
envelope, JSON round-trip, and the rule that **null means null** —
absent, unparseable, and wrong-version saves all load as `null`,
because downstream code should branch on "is there a usable save", not
on three flavours of failure. Storage is injectable (tests use a Map);
without any `localStorage` it degrades to in-memory, session-only.

## Ghosts — beat yesterday's you

```ts
const recorder = new GhostRecorder();          // 20 Hz by default
game.onUpdate((t) => {
  const dt = flow.gate(t.delta);
  recorder.record(kart.position, kart.rotation.y, dt);
  if (ghost) {
    const pose = ghost.at(lapClock);           // interpolated, clamped
    ghostMesh.position.copy(pose.position);
    ghostMesh.rotation.y = pose.yaw;
  }
});
// at the finish line:
const tape = recorder.finish();
if (lapTime < best) slot.save({ time: lapTime, tape: tape.toJSON() });
```

The recorder samples pose at its own fixed interval whatever the frame
rate does — feed it erratic deltas and the tape stays evenly spaced.
Feed it *gameplay* time (through `flow.gate`) and pausing pauses the
recording. A tape is flat `[x, y, z, yaw]` floats: a two-minute lap at
20 Hz is about ten kilobytes of JSON, small enough to live in a
SaveSlot next to the seed — which closes the retention loop: record →
save → load → race the translucent rival → beat it → save again.

Playback details that matter more than they look: yaw interpolates the
short way around ±π (a ghost must not pirouette crossing the seam),
`at()` clamps at both ends (a finished ghost parks at the line instead
of vanishing), and `fromJSON` drops a torn tail rather than
interpolating garbage — a half-written sample is not a position.

## The trial

The `trial` playground puts all four together in an attract-mode time
trial: title screen auto-starts, three gates per lap, the recorder
rolling; finish a lap faster than the stored best and the tape is
saved, a translucent ghost spawns from it, and the next run races it.
Reload the page — the ghost is still there, because it lives in
`localStorage` as a couple of kilobytes of seeded world plus tape.
