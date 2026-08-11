# Flow fields

One flood, any number of agents — and **the eight-way grid is 8.24% wrong**.

```
npm run flow
```

---

## The field everybody builds

A flow field replaces per-agent pathfinding with one field: run a single search
outward from the goal, store how far every cell is, and let each agent read the
local downhill direction. A thousand agents cost one search and a thousand
lookups. That is why every RTS with a crowd in it works this way.

The search is almost always Dijkstra over the eight neighbours, with a cost of 1
to the sides and √2 to the corners. That looks exact — √2 *is* exact — and it is
not, because the **path** is still made of eight directions. To go somewhere at
22.5° a grid path has to stagger between straight and diagonal steps, and the
staircase is longer than the line it approximates.

## How much longer is not a matter of opinion

For a displacement at angle θ into the first octant:

```
grid distance = (cos θ − sin θ)·1 + sin θ·√2  =  cos θ + (√2 − 1) sin θ
```

Differentiate: the worst case is at `tan θ = √2 − 1`, which is **exactly 22.5°**,
and the ratio there is

```
√(4 − 2√2) = 1.08239220…
```

**8.24% too long, at 22.5° from every axis.** Measured on a real 121×121 field,
against a Euclidean distance the solver is never shown:

```
solver    worst error   at angle
grid8         8.239%      22.5°     ← the closed form, to three decimals
eikonal       3.670%      45.0°

error by angle, eight-way:
0° 0.0%  5° 3.9%  10° 6.1%  15° 7.6%  20° 8.2%  22.5° 8.2%  25° 8.2%
30° 7.6%  35° 6.0%  40° 3.8%  45° 0.9%
```

Note the shape: **zero on the axes and zero on the diagonal**, worst halfway
between. Those are the two directions the grid can represent exactly.

---

## A bias does not converge, and that is the point

```
cell    grid8    eikonal
1.00    8.239%    3.670%
0.50    8.239%    2.567%
0.25    8.239%    1.664%
```

Halve the cell size and you get the same staircase twice as often. A finer grid
buys nothing at all — the eight-way error is a **bias**, not a discretisation
error, and no amount of memory fixes it. The eikonal error is a discretisation
error and behaves like one.

That distinction is the release. A wrong answer that converges is a different
kind of thing from a wrong answer that does not.

---

## The fix is the equation the field was always solving

Distance-to-goal is the solution of the **eikonal equation** `|∇φ| = cost`, and
Sethian's Fast Marching Method (1996) solves it directly. At each cell, take the
upwind neighbour in x and in y and solve

```
(φ − a)² + (φ − b)² = (h·F)²
```

which is Pythagoras rather than a staircase, so the wavefront travels at the same
speed in every direction. Same O(n log n) as Dijkstra, four neighbours instead of
eight.

Two details that are doing real work:

- **The near field is seeded exactly.** The scheme is first-order, so whatever
  shape the wavefront has when it leaves the source is carried outward for ever.
  Near a point goal the answer is known, so the ring around it gets its exact
  Euclidean distance — worth a third of the total error. It is applied to the
  eikonal solver **only**; handing the same seed to the eight-way solver dropped
  its error to 7.79% and made it drift with resolution, which would have quietly
  sunk the one claim that matters.
- **The flow is the gradient, not the best neighbour.** An argmin over eight
  neighbours snaps every heading to a multiple of 45° no matter how good the
  field underneath it is, which puts the staircase back after the trouble of
  removing it.

---

## What an agent actually does with it

```
heading error against the true bearing, on open ground
  grid8     mean 10.59°   worst 21.00°
  eikonal   mean  1.55°   worst  2.27°
```

**21° off** is not a rounding detail. It is a crowd crossing open ground that
does not head for the goal — it heads for whichever of eight directions is least
wrong, drifts, corrects, and separates into diagonal and axis-aligned lanes that
nothing in the level put there.

---

## The properties an agent's life depends on

- **Every agent arrives.** 140 starts, through a gap in a wall, all 140 reach the
  goal.
- **Nobody walks uphill.** The distance is a potential; walking downhill on it
  cannot go up. A field with a local minimum in it is worse than no field,
  because the agent stands there for ever looking broken.
- **The wall is a wall.** Behind it the field says 96.79 against a floor of 96.57
  for the two-leg path through the gap — above the floor, and within 0.3% of it.
- **A sealed room stays unreachable** rather than being handed a made-up
  distance.
- **One flood settles every open cell exactly once**, and that number has nothing
  to do with how many agents will read it afterwards.

---

## API

```ts
import { FlowField } from 'gama3d';

const field = new FlowField({ width: 128, height: 128, cell: 0.5 });
field.setCost(cx, cy, Infinity);            // a wall
field.setCost(cx, cy, 5);                   // mud: five times the crossing cost
field.build([{ x: 40, z: 12 }]);            // once, when the goal moves

const step = field.sample(agent.x, agent.z);   // per agent, per frame
agent.x += step.x * speed * dt;
```

`sample` is bilinear across the four surrounding cells, so an agent walking over
a cell boundary turns rather than snapping, and it reports `reachable: false`
rather than a direction when there is nowhere to go. `build` takes several goals
and gives the distance to the nearest. `steer(x, z, speed)` is the same thing
already multiplied out.

`solver: 'grid8'` selects the ordinary eight-neighbour Dijkstra. It is kept and
exported on purpose: a number that is only ever right is a number nobody has
checked against the alternative.

Playground: **`flow`** — the same crowd released twice, one half steering on each
field, over a map with the goal at 22.5°.

---

## Where this is still wrong

The eikonal solve is **first-order**, and its own error peaks on the diagonal at
3.7% for one-metre cells. It converges — quartering the cell more than halves it
— but it is not exact, and a second-order scheme would do better. What it is not
is *biased*: refine the grid and the error goes away, which is the property the
eight-way field does not have at any resolution.
