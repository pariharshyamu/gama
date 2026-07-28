# Opposition: WaveDirector & Harass

Behavior trees, attention and steering have existed for a while; what
was missing was the *assembly* — the enemy that fights like the one
everyone remembers, and the invisible hand that paces them.

## Harass — the ranged enemy's dance

```ts
import { Harass } from 'gama3d';

agent.addBehavior(new Harass(() => hero.position, { ring: 7, seed: i }));
```

Everyone has fought this one: it keeps its distance, circles you
sideways, and backs off exactly as fast as you close. Three urges
summed: hold the ring (zero urge inside the comfort band, a drift near
its edge, a scramble when you lunge), strafe tangentially (flipping on
a seeded rhythm — give each squad member its own seed or they turn like
synchronised swimmers), plus whatever else the agent runs. Firing is
not steering — pair it with `Projectiles` and a timer.

A note from this release's own playtest: the first hero fired at where
the harasser *was*, and one kited it indefinitely — the strafe out-ran
the bolt's flight time. That is the behavior working. The demo now
leads its targets; your players will learn to.

## WaveDirector — pacing without bodies

```ts
const director = new WaveDirector({
  kinds: ['chaser', 'harasser'],
  baseCount: 3, growth: 1.5, maxCount: 10,
  rest: 4, stagger: 0.8,
  spawn: (kind, wave) => spawnFromPool(kind),
  onWave: (wave, count) => hud.banner(`WAVE ${wave}`),
  onCleared: () => sounds.chime(2),
});
director.start();
game.onUpdate((t) => director.update(t.delta));
enemyHealth.onDeath = () => director.enemyDown();
heroHealth.onDamage = (e) => director.playerHurt(e.amount);
```

The director never touches an enemy — it decides *when*, *how many*,
of *what*, then asks the game to spawn each one and waits to hear
about deaths. Spawns trickle on `stagger` rather than dumping; a
cleared wave earns a `rest`; escalation obeys `growth` under a hard
`maxCount` ceiling.

### Rubber-banding

The quiet feature. The director watches how each wave went — cleared
fast and unhurt, or slow and bloody — and drifts `pressure` (0..1,
start 0.5) a third of the way toward the verdict. Pressure scales the
*escalation*, never the base: wave 1 is wave 1 for everyone; by wave 5
a dominating player faces half again more. A lean, never a lurch — the
player at the edge of their ability never notices, and that is the
point. The test plays four waves twice, once dominating and once
bleeding, and asserts the dominator faced more.
