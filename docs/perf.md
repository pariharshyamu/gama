# The perf gate

```bash
npm run bench                 # timing + exact counters, in Node
npm run bench:render          # render budgets, in headless Chromium
npm run perf                  # both
npm run bench:update          # re-record after an intended change
npm run bench:render:update
```

Most committed performance baselines are worthless within a week. They were
recorded on one machine, every other machine fails them, and the gate degrades
into something people rerun until it passes — at which point it is worse than
having none, because it costs time and teaches everyone to ignore a red build.

This one is built around one admission: **timing is noise with a signal in it,
and counters are exact.** So there are two gates, and the exact one is the one
that matters.

## Gate 1 — `bench` (11 cases)

Times are stored as **ratios to a calibration case**: a fixed lump of
arithmetic with no library in it. A laptop at half the speed of the recording
machine scores the same ratio, so the baseline is portable.

Four decisions, every one of them forced by a measurement that went wrong
first:

**Calibration is re-measured inside every sample, not once up front.** This
container's speed drifts *during a run*. Identical code scored 1.01× to 1.61×
against a single up-front calibration — normalising against a number measured
ten seconds ago normalises against the wrong machine.

**The minimum is kept, not the median.** The fastest observation is the one
least disturbed by a GC pause or a neighbour process. A median averages in
noise that only ever pushes one way.

**The two minima are divided; the per-sample ratios are not.** The first
version kept the smallest `case ÷ calibration` across samples, which sounds
like the same rule and is not: it selects the sample whose *denominator* was
worst — the one where calibration got hit by a hiccup. On unchanged code the
case's own time was stable to 4% (225.6, 225.6, 216.0 ms) while
min-of-ratios swung 31% (4.61, 3.51, 3.99). The ratio was *adding* noise.
`min(case) ÷ min(calibration)` compares each at its cleanest and cut the
run-to-run spread to 15%.

**Each case's band is 1.5× or its own recorded spread, whichever is wider.**
`level-roundtrip` allocates six thousand meshes and disposes them, so it is
GC-dominated and spreads over 2× run to run. Gating it at 1.5× failed at
random on unchanged code.

**A run noisier than its own band is not gated on timing at all.** It prints
`timing not gated` and moves on. A measurement that cannot resolve the
threshold must never be allowed to fail a build.

The honest limit: a 1.5× band catches an O(n) that became O(n²). It will not
catch 15%. Anything claiming otherwise on a shared box is lying.

**Counters are compared exactly.** Neighbour cells swept, distance tests
performed, snapshot bytes on the wire, mispredictions across eight clients,
meshes built by a level round-trip. These do not move unless behaviour moved.
Several cases also carry a **checksum** of final positions, so an
"optimisation" that quietly changes the simulation is caught even when it is
genuinely faster.

## Gate 2 — `bench:render` (5 scenes)

Frame *time* under headless SwiftShader is meaningless — it is a software
rasteriser on a shared box. What is not meaningless is what the renderer was
**asked** to do. Each scene runs for real in Chromium, then reads the same
`window.*Debug()` probe the verification scripts use:

- `geometries` and `textures` are **exact** — they do not depend on where the
  camera points.
- `draws` and `triangles` get a 25% band, because these scenes have orbiting
  cameras and frustum culling moves with them.

## Watching it fail

A gate nobody has seen fail is a decoration. Two deliberate regressions were
injected, and the first one **got through**:

**The broadphase, take one.** Widening `SpatialGrid.neighbors` by one extra
ring of cells in X and Z — pure waste, same answer — sailed straight past the
gate. The counter at the time was `candidates`, the number of neighbours
*found*, which is invariant to how many cells were scanned. And the timing half
noise-skipped that particular run. **The counter was measuring results, not
work.**

That is why `SpatialGrid` now publishes `stats`:

```ts
grid.rebuild(flock);
for (const agent of flock) grid.neighbors(agent.position, 6, out);
console.log(grid.stats);
// { queries: 200, cellsVisited: 5400, cellsOccupied: 812, tested: 2130, found: 950 }
```

`cellsVisited / queries` says whether `cellSize` is sane — a grid much finer
than the query radius sweeps dozens of cells per query, most of them empty —
and `tested / found` says how selective the cells are once reached. Reset on
every `rebuild()`, so reading them at the end of a frame describes that frame.
This is useful to anyone tuning a flock; it exists because the perf gate
needed it.

**The broadphase, take two.** Same one-ring regression, re-injected:

```
FAIL  flock-200: cellsVisited 2304000 → 5184000 (exact counter changed)
FAIL  flock-200: tested 493539 → 1015005 (exact counter changed)
FAIL  flock-200: 5.50 → 10.98 calibration units (2.00× slower, band 1.50×)
FAIL  spatial-grid: cellsVisited 1415560 → 3081400 (exact counter changed)
FAIL  spatial-grid: tested 437720 → 907590 (exact counter changed)
FAIL  spatial-grid: 5.19 → 10.03 calibration units (1.93× slower, band 1.50×)
```

`found` was **identical** across both runs — 209540 — which is the proof that
the original counter could never have caught this. On the earlier, noisier
normalisation `flock-200`'s timing was noise-skipped on this run and only its
counters fired; both halves catch it now.

**Broken geometry sharing.** Making `AssetLibrary.instance()` deep-copy
geometry instead of sharing it:

```
FAIL  playground/assets: geometries 5 → 85 (exact)
```

`draws` stayed at 81 and `triangles` at 1074. The frame is pixel-identical, so
no screenshot and no unit test would ever have noticed — forty-two crates
quietly stopped being five geometries and became eighty-five. This is exactly
the class of regression the render gate exists for.

## It also catches improvements

The first thing the gate did after being built was fail on a fix. Priming the
netcode's input buffer at join (see [networking](net.md)) produced:

```
FAIL  net-8-clients: corrections 1 → 0 (exact counter changed)
FAIL  net-8-clients: packets 11267 → 11272 (exact counter changed)
FAIL  net-8-clients: bytes 2878518 → 2881845 (exact counter changed)
```

Which is the gate doing its job: it priced the change. One misprediction
across eight clients removed, for five extra packets and 3.3 kB over a
thirty-second simulation. That trade is obviously worth making, and *knowing
the numbers* is the difference between deciding and assuming.

## When a failure is correct

Re-record and **say why in the commit message**. A baseline diff with no
explanation is how the gate rots:

```bash
npm run bench:update
npm run bench:render:update
git add bench/*.json
```

## Adding a case

A case in `bench/cases.mjs` is `{ name, note, setup, run }`. `setup` is
outside the timer; `run` returns `{ counters?, checksum? }`.

```js
{
  name: 'my-thing',
  note: 'what it does and at what scale',
  setup() { return buildTheWorld(); },
  run(fixture) {
    const clock = stepper();               // World.update takes a Time
    for (let i = 0; i < 600; i++) fixture.world.update(clock.tick());
    return { counters: { thingsDone: fixture.count } };
  },
}
```

Two rules learned the hard way:

**Make it take at least ~50 ms.** `behavior-tree` originally ran in 0.4 ms and
reported 18.69× noise — the calibration's own variance dominated the
measurement entirely. The fix was to scale the case up, not to widen the band.

**Count work, not results.** If your counter would be unchanged by a version
of the code that does twice the work to reach the same answer, it is not a perf
counter. Ask what the function is *supposed to be avoiding*, and count that.
