# Light as gameplay

SCENA renders the lamps; what the *game* does with light lives here.
The rule that shapes all three modules: **gameplay never reads pixels —
it reads math**. Deterministic, testable, and exactly as fast headless
as on a GPU.

## Illumination — the number the stealth genre is made of

```ts
import { Illumination } from 'gama3d';

const field = new Illumination({ ambient: 0.08 });
for (const lamp of lamps) field.add(lamp.claim);  // SCENA claims drop in
const exposure = field.at(hero.position);          // 0 = shadow, 1 = spotlit
```

Sources are structural: `{ center | anchor, radius, intensity?, isLit? }`
— a SCENA `LuminousClaim` passes straight in, anchor tracked live
(a lamp on a ferry keeps counting from wherever it is) and `isLit` read
live (the photocell douses a lamp and the field just *knows*). Falloff
is quadratic ease-out per source, summed, floored by `ambient`, clamped
to 1. That one number is the genre: the guard's perception scales by
it, the HUD meter shows it, and the shadows between the lamps become
*places*.

## Flashlight — the light a game carries

```ts
const torch = new Flashlight({ range: 8, batteryLife: 45,
  onLow: () => hud.caption('guttering…'), onDied: () => openings() });
torch.aim(guard.position, guard.rotation.y);
torch.update(dt);                                   // gameplay time
if (torch.illuminates({ center: hero.position, radius: 0.4 })) spotted();
```

A cone of gameplay light with a battery. `illuminates()` is the reveal
test — planar cone check with angular slack for the target's own size,
so grazing the beam's edge still counts. `source` hands the beam to an
`Illumination` field (the pool of light tracks the aim). The battery is
the drama: it drains on gameplay time, the beam **gutters** below `low`
(seeded aperiodic stutter — the horror-game grammar for *hurry*), dies
once with `onDied`, and `refuel()` is the pickup's job. Scale your beam
mesh's opacity by `glow` and the visual and the math never disagree.

## MoodGrade — the game state's visual voice

```ts
const grade = new MoodGrade({ sun, ambient, scene, fog: scene.fog });
grade.define('calm',   { background: 0x0b0e14, ambient: { intensity: 0.4 } });
grade.define('danger', { background: 0x1a0508, sun: { color: 0xff6a4a } });
grade.to('danger', 2);                       // lerps there over 2 s
game.onUpdate((t) => grade.update(t.delta)); // REAL time — pause keeps its mood
```

Targets are structural — a SCENA `LightingRig` plus the scene's
background and fog, or any subset; absent channels simply aren't
graded. Blends smoothstep from wherever the channels are *now*, so
interrupting a fade mid-way is seamless; unknown moods are refused,
not thrown. Wire `to()` into GameFlow's `onEnter` and every state gets
its look; drive it from suspicion and the world blushes when you're
nearly caught.

## The stealth garden

The `stealth` playground composes all three: four lamps and the guard's
torch feed one field; the sneaking bot dashes when its *next step*
reads dark and holds when it doesn't (if caught standing in light, it
keeps moving — out is through); suspicion grows with `exposure ×
proximity` plus a big bump for the beam itself; the torch drains,
gutters, dies — the dark windows are the openings — and MoodGrade turns
the night red as suspicion climbs. `stealthDebug()` reports exposure,
suspicion, battery and mood live.
