# Replay & determinism

A replay is not a video. It is the seed, the tick rate, and the inputs — a few
hundred bytes for a whole run — and playing it back means running the
simulation again.

```ts
import { Recorder, replay, worldChecksum } from 'gama3d';

const tape = new Recorder({ seed: 7, tickRate: 50 });

game.onFixedUpdate(() => {
  const input = { x: stick.x, jump: pad.jump };
  tape.capture(input, worldChecksum(game.world));   // checksum optional, take it
  drive(input);
});

// later — a file, a test fixture, a bug report
const result = replay(tape.toJSON(), {
  build: (seed) => buildWorld(seed),
  apply: (input, world) => drive(input, world),
  checksum: (world) => worldChecksum(world),
});
result.diverged;   // null, or { tick, expected, actual }
```

That buys three things a video cannot: a **regression test made of real play**;
a ghost, demo, spectator or anti-cheat check, all the same mechanism; and
**determinism measured** rather than assumed.

## Take the checksum

`worldChecksum` folds every transform into one unsigned 32-bit integer, so two
runs can be compared *per tick* and the **first** tick they disagree on can be
named. That tick is the bug. Everything after it is consequence, and a diff of
final states only ever shows you consequence — which is why `replay` stops at
the first divergence instead of listing four hundred of them.

Without it, `replay` still runs, and `result.compared` is `0`. A replay that
compared nothing is not evidence of anything, and the field says so rather
than letting a green result imply it.

| | |
|---|---|
| `precision` | round before hashing. Leave it **off** on one machine, where the arithmetic is bit-exact. Set it to 3 or 4 to compare two *different* machines — and understand it then cannot see drift below the quantum |
| `names` | off to compare worlds built by different code paths — a server's copy against a client's prediction |
| `deep` | also hash `scale`, `visible` and `userData.checksum` — the escape hatch for health, ammo, a timer: state three.js knows nothing about |

Order is taken as given: `World.objects` is an array and spawn order is stable.
If you hash your own source, sort it first — an unordered container reports a
divergence every run and teaches everybody to ignore the gate.

## Capture on the fixed step, never the frame

A replay is a sequence of simulation ticks. Sampling it on a variable-rate
render loop records a tape that plays back differently on a faster machine,
which is the exact failure the whole idea exists to prevent.

## The tape is small because most ticks are boring

Only ticks where the input **changed** are stored; a tick with no frame repeats
the previous one. A hundred ticks of "hold right" is one frame.

Checksums are the exception — every one given is stored, even on an unchanged
tick. Divergence usually lands on a tick where the player did nothing and the
world moved anyway, and skipping those would hide it.

## What it found

**`createFlock` could not be replayed at all.** It scattered its boids with
`Math.random`, and gave every one a `Wander` reading `Math.random` too. The
same tape, the same seed, a different flock every run — so a flock could not be
replayed, saved, or reproduced from a bug report.

It now takes `seed`, and GAMA ships an `Rng` to spend it on. There were seeds
all over the library already — `Level` carries one, `Catalog` hands one to every
factory — and no generator behind them, which is how the one template that
needed random numbers ended up reaching for the global.

Note the shape of the fix, because half of it is a trap: seeding the **scatter**
alone makes a flock reproducible for exactly one tick. `Wander` advances its
angle by a random step every tick, so two flocks agree at tick 0 and have
drifted by tick 1. `tests/replay.test.ts` asserts both, and re-injecting the
unseeded `Wander` alone fails exactly one test — the tick-after-tick one.

## And a test that was measuring nothing

Worth recording, because it was more convincing than the bug.

The first version of the flock determinism test stepped the world with
`world.fixedUpdate(0.02)`. `World.fixedUpdate` takes a `Time`, not a number, and
`MotionAgent` integrates in `update` rather than `fixedUpdate` — so the call
typechecked nowhere, ran fine under vitest, and **moved nothing at all**. Every
assertion passed on a world that never changed.

A determinism test that steps nothing is the most convincing green there is: it
reproduces perfectly, every time, forever. The suite now opens with a guard
that asserts the flock actually travels and that nothing has gone to `NaN` —
because `worldChecksum` collapses `NaN` to a single byte deliberately (a `NaN`
in the world is the finding, and the tool hunting it must not be the thing that
crashes), which means a dead world would otherwise hash consistently too.

## Rng

```ts
const rng = new Rng(7);
rng.next();                  // 0..1
rng.range(-5, 5);
rng.int(1, 6);               // both ends inclusive, like a die
rng.pick(items);             // throws on empty rather than returning undefined
rng.shuffle(items);          // a copy — your list is very often a constant
rng.stream;                  // a bound () => number, for Wander and friends
rng.fork();                  // a child seeded from this one
```

mulberry32, and the seed is mixed before first use so that seeds 1, 2, 3 do not
begin with three near-identical values — a crowd seeded `1..n` would otherwise
come out visibly striped.

**The algorithm must not be "improved" without a version bump.** Every recorded
replay, every committed level and every ghost is a promise about the exact
numbers it produces.

## What this is not

**Not lockstep networking.** `NetClient` already does prediction and
reconciliation over an unreliable link. A replay is one machine re-running its
own history; sharing tapes between peers as a transport is a different design
with its own failure modes.

**Not a rollback netcode implementation.** There is no state snapshot and no
re-simulation from a rolled-back tick. `worldChecksum` is the piece such a
system would need to detect desync, and it is here; the rest is not.

**Not a save system.** `SaveSlot` holds state; a tape holds history. They
compose — put `tape.toJSON()` in a slot — and neither replaces the other.
