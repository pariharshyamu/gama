# Game feel & HUD

Two layers that turn a simulation into something you *feel*: `GameFeel`
(the few milliseconds that make a hit land) and `Hud` (the game's words,
drawn over the game's world). They pair with the `Soundboard` — sight,
sound and screen reacting to the same events is most of what "juice"
means.

## GameFeel

```ts
import { GameFeel } from 'gama3d';

const feel = new GameFeel({ seed: 4 });

game.onUpdate((t) => {
  const dt = feel.update(t.delta);  // real dt in, gameplay dt out
  world.step(dt);                   // 0 during hit-stop, scaled in slow-mo
  rig.update(t.delta);              // camera rigs run on REAL time…
  feel.apply(game.camera);          // …then the shake perturbs the result
});

feel.shake(0.4);      // on impact — adds trauma
feel.hitStop(0.08);   // on the big one — 80 ms of stillness
feel.slowMo(0.3, 1.2);// finish-line time, eases back on its own
feel.rumble(0.8, 120);// phones vibrate; everything else ignores it
```

### Shake is trauma squared

Impacts add **trauma**; the camera shakes by **trauma²** (Jonasson's GDC
rule). The square is the whole design: a small knock barely registers, a
big one fills the screen, and the linear decay passes through the violent
range quickly and the subtle range slowly — an aftermath, not a wobble.
The motion itself is smooth seeded noise, not per-frame randomness:
random offsets jitter, noise *sways*. Same seed, same shake, which is
what makes it testable.

`apply()` is remove-then-add — it subtracts what it added last frame
before adding this frame's offset — so it composes both with a rig that
sets the camera absolutely every frame and with a static camera nobody
else moves. When trauma dies, the camera is back at its exact base.

### Hit-stop and slow motion

Both work through one contract: `feel.update(rawDt)` returns the delta
gameplay should advance by. Hit-stop returns 0 for a few dozen
milliseconds — the pause is what gives a blow its weight. Slow-mo returns
a scaled delta for a while, then eases back to full speed over a ramp.
Decay and the countdowns run on *real* time: a frozen frame still
shakes, which is exactly the look.

## Hud

A DOM overlay, deliberately: text wants the text engine. No textures, no
SDF fonts, no packages — absolutely-positioned elements with inline
styles, over any renderer.

```ts
import { Hud } from 'gama3d';

const hud = new Hud();
hud.score(1250);
hud.timer(93.4);                 // 1:33.4 — null hides it
hud.lap(2, 3);
hud.hearts(3, 5);                // ♥♥♥♡♡ — goes red at the last one
hud.banner('LAP 2/3');           // big centre announcement, fades itself
hud.objective('Collect 10 coins');
hud.prompt('Press E to open');   // bottom-centre hint; null hides
sounds.onCaption((c) => hud.caption(`♪ ${c.text}`));

game.onUpdate((t) => hud.update(feel.update(t.delta)));
```

Banners and captions age in `update(dt)` rather than on wall-clock
timeouts — drive it with gameplay time and **a paused game pauses its
HUD with it**.

### The radar

A round minimap on a 2D canvas — no second 3D render, no render targets.
Feed it plain `{x, z}` shapes:

```ts
const radar = hud.radar({ range: 40, colors: { foe: '#f87171', coin: '#fbbf24' } });
game.onUpdate(() => {
  radar.set(
    entities.map((e) => ({ x: e.position.x, z: e.position.z, kind: e.kind })),
    hero.position,
    heroHeading  // radians → heading-up rotation; omit for north-up
  );
});
```

Out-of-range blips are culled at the rim; the player is the wedge at the
centre.

### Testing without a browser

The document is injectable — `new Hud({ document })` builds against
anything that can `createElement`, which is how the test suite drives
every widget from Node with a forty-line fake. The same trick the
`Soundboard` plays with its audio context.

## The pattern, complete

One event, three senses:

```ts
match.onStrike = (energy) => {
  sounds.crack(energy);              // ear
  feel.shake(energy);                // hand (camera)
  feel.hitStop(0.06 + energy * 0.05);
  feel.rumble(energy);               // literal hand
  hud.banner('FOUR!');               // eye
};
```
