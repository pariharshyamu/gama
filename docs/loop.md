# The pickup loop: Collector & CheckpointRun

SCENA renders a coin and animates its exit. WHO collected it, what it
was worth, and when it comes back are game-loop questions — and they
live here. Both classes consume plain structural shapes, so SCENA's
`createPickup` / `createPickupField` / `createCheckpoint` drop straight
in with no imports between the libraries; anything else shaped the same
way works identically (the playground's coins are eighteen inline
lines).

## Collector

```ts
import { Collector } from 'gama3d';

const collector = new Collector<number>({
  respawnAfter: 5,          // null (default) = spent once, forever
  reach: 0.4,               // the actor's own radius
  onCollect: ({ value, at }) => {
    score += value;
    sounds.coin({ at });    // one event, all senses
    fx.ring(at);
    hud.score(score);
  },
});

collector.add(gem, 100);              // anything {trigger, collect, respawn?}
collector.addField(coins, () => 10);  // a whole instanced field, per-index

game.onUpdate((t) => {
  collector.sweep(hero.position);     // collect what the actor touches
  collector.update(t.delta);          // GAMEPLAY time — pause holds the loot
});
```

Two design points that matter:

- **Collection defers to the prop.** `collect()` returning 0 means "not
  now" (already taken, mid-animation) and the collector believes it —
  the state machine lives with the prop, the consequences live here.
  That's why a sweep can never double-collect.
- **Respawn timers run on the time you feed `update`.** Feed gameplay
  time (through `GameFeel.update`'s return) and a paused or slow-motion
  game holds its loot with it.

## CheckpointRun

The one thing a checkpoint sequence must do is **refuse shortcuts**:
only the *next* checkpoint counts, however hard you drive through the
others.

```ts
import { CheckpointRun } from 'gama3d';

const run = new CheckpointRun(arches, {   // SCENA checkpoints, or bare {center, radius}
  laps: 3,
  onAdvance: () => sounds.blip(),
  onLap: (lap) => { hud.banner(`LAP ${lap + 1}/3`); hud.lap(lap + 1, 3); },
  onFinish: () => { hud.banner('FINISH!'); feel.slowMo(0.3, 2); },
});

game.onUpdate(() => run.test(kart.position));
```

The run drives the props' visuals through the structural `setState`
hook: the next arch is `active`, everything taken is `passed`,
everything ahead is `upcoming` — repainted on every advance, lap wrap,
and `reset()`. The test is planar (XZ) on purpose: an arch is entered
at any height under it. `progress` (0..1 across all laps) is shaped for
a progress bar.

## The trilogy loop, complete

```ts
// SCENA renders; GAMA decides; feel, sound and HUD react:
collector.addField(scenaCoins, () => 10);
const run = new CheckpointRun(scenaArches, { laps: 3, ... });

game.onUpdate((t) => {
  const dt = feel.update(t.delta);
  collector.sweep(hero.position);
  collector.update(dt);
  run.test(hero.position);
  hud.update(dt);
  feel.apply(game.camera);
});
```
