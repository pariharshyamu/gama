# Platformer: jump physics

Every controller so far moved on the plane. `PlatformerController` adds
the axis games are made of — gravity, jumps, and the three forgivenesses
that separate a platformer that feels right from one that feels broken.

## PlatformerController

```ts
import { PlatformerController } from 'gama3d';

const body = new PlatformerController({
  jumpHeight: 2.2,
  onJump: () => sounds.boing(),
  onLand: (v) => { if (v > 7) feel.shake(Math.min(v / 45, 0.4)); },
});
game.onUpdate((t) => {
  const dt = flow.gate(t.delta);
  body.move(input.axis.x);
  if (input.pressed('jump')) body.jump();
  if (input.released('jump')) body.release();
  body.update(dt, platforms);
  hero.position.copy(body.position);
});
```

The body's `position` is its **feet**. Platforms are structural
`{ center, size }` boxes read live every update — a moving platform is
just a box the game moves; give it a `velocity` and riders are carried.
The controller resolves tops (landing), bottoms (head bumps), and sides
(anything taller than a step pushes the body circle out); frame deltas
are clamped as a whole, then sub-stepped, so a hitch cannot tunnel a
fast fall through a thin ledge.

## The three forgivenesses

On by default, because their absence is what players call "floaty" or
"unfair" without knowing why:

- **Coyote time** — for a tenth of a second after walking off a ledge,
  the jump still works. The player *believed* they pressed in time; the
  controller agrees.
- **Jump buffering** — a press just before touchdown is stored and
  fires the frame the feet land. `jump()` is the jump *button*, not the
  jump.
- **Variable height** — `release()` while rising cuts the climb, so a
  tap hops and a hold clears the gap. Full height comes from
  `jumpHeight`, the number you actually tune levels around.

`onJump`, `onLand(fallSpeed)` and `onFall` are the hook points where
audio and game feel attach: boing on the way up, thud-plus-shake scaled
by the landing speed, a gasp for the walked-off ledge.

## Moving platforms

A platform with a `velocity` carries whoever stands on it, horizontally
and vertically; the feet track a rising top for free because grounded
bodies re-snap to their platform each step. Riding is observable —
`body.ground` is the platform under the feet — which is how the coin
run's bot knows it is aboard the ferry.

## The coin run

The `coinrun` playground is the payoff of the whole comprehensive-gaming
arc: one small platformer built from every pillar shipped before it.
`PlatformerController` runs the body, `GameFlow` runs the shell,
`Objectives` name the goal (ten coins and a flag), `Collector` pays the
coins, `Health` counts the falls (a pit costs a heart and a trip back to
the checkpoint), `Hud` shows all of it, `GameFeel` shakes the landings,
`Soundboard` sells every beat, and a `SaveSlot` remembers the best run
across reloads. The runner is an attract-mode bot: it clears the gaps,
waits at the ledge for the swinging ferry platform, walks aboard, rides
it across, and plants the flag.
