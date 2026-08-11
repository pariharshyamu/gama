# Utility AI

Value per second — and **Charnov's theorem instead of a threshold**.

```
npm run forage
```

---

## Every utility system ships with numbers nobody can justify

The standard shape, from Dave Mark's Infinite Axis Utility System onward: each
action has considerations, each consideration maps an input onto 0..1 through a
response curve, the curves are multiplied, the highest product wins.

Which leaves a designer holding a curve per consideration with two to four shape
parameters, a weight per consideration, and a **compensation factor** — because
multiplying N numbers below 1 drives the score toward zero, so an action
described by five considerations loses to one described by two for no reason but
the count.

None of those numbers means anything. They are fitted by watching the agent and
nudging until it stops doing something stupid, and refitted whenever the game
changes.

## They exist because the scale is invented

A response curve's job is to map metres, hit points and seconds of cooldown onto
one made-up 0..1 axis so they can be combined. The weights then trade off axes
that were never comparable.

So don't invent the axis. An action is **worth something** and it **costs
seconds**, and both are quantities the game already counts:

```
utility = value / seconds
```

Coins per second. Metres per second. Hit points per second. That is a rate, and
rates compare. No curve to shape, no weight to balance, no compensation factor,
because nothing is being multiplied.

```ts
const actions = [
  { name: 'loot',   value: (c) => c.coins,    seconds: () => 6 },
  { name: 'sprint', value: (c) => c.distance, seconds: (c) => c.distance / 6 },
];
choose(actions, ctx);   // 30 coins over 6 s is 5/s; 12 m at 6 m/s is 6/s
```

A rate is a **ratio scale**, so counting in pennies instead of pounds, or minutes
instead of seconds, cannot reorder anything — and the gate checks it. A zero-second
action scores **0, not infinity**: a free action would otherwise beat everything
for ever, which presents as an agent standing still doing something instantaneous.

---

## The harder half is knowing when to stop

Choosing between actions is the easy part. Knowing when to quit the one you are
doing is where every implementation reaches for a threshold somebody picked:
leave the node at 20% remaining, retreat below 30% health, give up after 8
seconds.

Behavioural ecology settled this in 1976. Charnov's **marginal value theorem**:
an animal exploiting a depleting patch should leave when the patch's
*instantaneous* rate of return has dropped to the *average* rate available in the
environment as a whole. No sooner, no later.

```
maximise  R(t) = g(t) / (T + t)          g = cumulative gain, T = travel
dR/dt = 0  ⟹  g′(t)·(T + t) = g(t)  ⟹  g′(t*) = R(t*)
```

The optimum is exactly where the patch's marginal rate has fallen to the rate the
whole cycle is achieving — the tangent from `−T` to the gain curve.

`optimalStay` solves that as a **root**, deliberately, and not by searching R for
its maximum: a number found by sweeping cannot then be checked against a sweep,
and checking it against a sweep is the only check worth having.

---

## Against an exhaustive search it was never shown

```
 amount  tau  travel   theorem t*   sweep t*   best rate   forager   of best
     10    5       2        3.894       3.90     0.91796   0.91796   100.00%
     10    5      10        7.526       7.55     0.44393   0.44366    99.94%
     10    5      30       11.108      11.10     0.21688   0.21625    99.71%
     40   12       5        9.513       9.50     1.50872   1.50789    99.95%
      5    2       1        1.715       1.70     1.06034   1.06012    99.98%
    100   30      20       29.077      29.10     1.26460   1.26023    99.65%
```

The sweep is 6000 fixed leaving times, brute-forced. `Forager` was given none of
them — it measures the environment's rate off **its own life**, harvest divided
by elapsed time, travel included — and lands on the same number. It also cannot
*beat* the sweep, and the gate asserts that too: a forager that outscores an
exhaustive search is measuring its own rate wrongly.

---

## The two predictions a threshold cannot make

**Longer travel, longer stay.** Travel is time bought and paid for that yields
nothing, so it lowers the whole cycle's rate and the bar a patch has to clear:

```
travel   theorem t*   forager
   0.5        2.081     2.083
     2        3.894     3.900
     5        5.731     5.733
    15        8.745     8.750
    40       12.184    12.200
```

**A richer world, an earlier exit.** The patch is identical every time; only what
is on offer elsewhere changes:

```
world pays   leave at   forager
      0.20     11.513    11.517
      0.50      6.931     6.933
      1.00      3.466     3.467
      1.50      1.438     1.450
```

Better opportunities elsewhere abandon a patch that nothing has changed about. No
"leave at 20% remaining" rule does that, because it cannot see elsewhere.

---

## What a tuned threshold costs one level along

The rule everybody writes is *leave when the patch is X% picked*. Tune it
properly — 54% is genuinely optimal for a 2 s walk — then change the level:

```
travel   best there   the tuned rule   the forager   it loses
   0.5          34%           1.2314        1.3190       6.6%
     2          54%           0.9180        0.9177      -0.0%
     5          68%           0.6083        0.6356       4.3%
    15          83%           0.2863        0.3470      17.5%
    40          91%           0.1233        0.1738      29.1%
```

The threshold is not badly tuned. "Optimal here" is simply a different number
over there, and no amount of care with the first number fixes the second. The
forager was never given either one.

---

## API

```ts
import {
  choose, rank, rateOf,                       // utility as a rate
  Forager, depletingPatch,                     // the theorem, running
  optimalStay, leaveWhen, marginalRate, longRunRate, bestRate,
} from 'gama3d';

const forager = new Forager(() => nextBush());
game.onUpdate(({ delta }) => forager.update(delta));
```

`PatchLike` is anything with `gain(seconds)` — the cumulative yield so far — and
an optional `travel`. A bush emptying, an ore vein thinning, a room running out
of things worth looting. `depletingPatch(amount, tau)` is the exponential shape
every measurement in the literature is fitted with.

Leave `environmentRate` out of `ForagerOptions` and the forager measures it, which
is the version with **no parameters at all** — and it is also what the theorem is
about, since an animal cannot be told the environment's average, only have
experienced it.

Playground: **`forage`** — two colonies, one running the theorem and one running
the 54% threshold, on a walk the threshold was not tuned for.

---

## Where it has nothing to say

- **A patch that never depletes.** If yield is linear in time there is no
  marginal moment to leave at, and `optimalStay` returns `Infinity` rather than
  inventing one.
- **A patch that gives nothing** leaves at once; one emptied in a blink leaves in
  a blink.
- **A forager with nowhere to go** does not advance and does not throw.
- The theorem assumes the agent can tell how fast the patch is currently paying.
  An agent that cannot measure its own marginal rate needs something else, and
  this module does not pretend otherwise.
