# Audio: procedural sound

Everything in this trilogy is generated from a seed — worlds, characters,
materials. `Soundboard` places the same bet on audio: **there are no sample
files**. A footstep, a bat-crack, a coin, an engine, a rainstorm are all
small Web Audio graphs synthesized on demand from pure, seeded recipes. Two
boards with the same seed make the same sounds; a save file that stores a
seed restores the game's voice along with its world.

(For *recorded* buffers — licensed music, voice lines — `AudioManager` on
the gameplay page remains the tool. The two are complementary.)

```ts
import { Soundboard } from 'gama3d';

const sounds = new Soundboard({ seed: 7 });
sounds.unlock();               // arms on the first tap or key press
sounds.footstep('stone');      // and away it goes
```

## The board

Browsers gate audio behind a user gesture. `unlock()` listens once for the
first pointer/key event anywhere and resumes the context; until then every
call schedules silently and harmlessly, so you never have to guard your
game code.

Everything routes through three buses — `sfx`, `ambient`, `ui` — into a
shared compressor, so a pile-up of simultaneous one-shots squeezes rather
than clips.

```ts
sounds.setVolume(0.8);              // master
sounds.setBusVolume('ambient', 0.5);
sounds.duck('ambient', 0.3, 1.2);   // make room, then recover — nothing stops
```

## One-shots

Each call synthesizes a fresh variant — seeded jitter on pitch, level and
length keeps the tenth footstep from being a copy of the first, which is
the difference between a character walking and a metronome ticking.

```ts
sounds.footstep('wood', { at: hero.position });  // grass|dirt|sand|stone|wood|metal|water
sounds.impact('metal', 0.8);   // soft|wood|stone|metal + energy 0..1
sounds.crack(0.9);             // the bat-crack: bright, done in 30 ms
sounds.whoosh(0.7);            // a swing or a pass-by
sounds.splash(0.5);
sounds.coin();                 // the two-note classic
sounds.pop();                  // collect-burst
sounds.boing();                // bounce pad
sounds.chime(2); sounds.success(); sounds.fail();
sounds.tick(); sounds.blip();  // UI, routed to the ui bus
```

The voices are built on one idea per family. A footstep is filtered noise
where **the filter frequency is the material** — grass excites almost
nothing above 1 kHz, stone is mostly above 2 kHz — and only resonant
grounds add a tuned body (wood's hollow knock, metal's thin ring). An
impact is a falling sine thump plus a transient, and metal adds
*inharmonic* ring partials, because a struck plate does not ring at
multiples of anything. Every envelope starts and ends at exactly zero:
that is the no-click rule, and the test suite enforces it on every recipe.

Pass `at: {x,y,z}` — any three `Vector3` qualifies structurally — and the
sound plays positionally with inverse-distance attenuation.

## Continuous sources

Four sounds don't end: they are handles you drive.

```ts
const engine = sounds.createEngine();
game.onUpdate(() => engine.set(car.rpm, car.throttle));

const wind = sounds.createWind();    wind.set(0.6);   // 0..1
const rain = sounds.createRain();    rain.set(0.8);
const crowd = sounds.createCrowd();  crowd.set(0.3);
crowd.swell(1, 2.5);   // the boundary-four moment: rises, dies down on its own
```

The engine is a four-stroke voice: firing frequency at `rpm / 60 × 2`, a
sine an octave under it for the crankshaft, a detuned near-second harmonic
for snarl, and bandpassed noise for intake — which is why `load` mostly
turns the *noise* up: an engine under load breathes harder before it revs
higher. Parameter changes ramp with ~40 ms of lag that reads as flywheel
inertia.

Wind is lowpassed noise whose cutoff *and* gust-flutter rise with strength;
rain reaches **lower** as it hardens (drizzle is a hiss, a downpour has a
bottom) and adds droplet patter on top. The crowd is pink noise pushed
through three vowel formants — noise that went to the trouble of sounding
like people — with excitement raising the voices along with the level.

These handles hold their position statically if you pass `at`; for a moving
emitter, prefer moving the listener (below) or leave the sound unpositioned.

## The ears

Call once per frame with plain `{x,y,z}` shapes — three vectors work
directly, no adapter:

```ts
game.onUpdate(() => sounds.updateListener(camera.position, forwardVec));
```

Every positional sound now pans and attenuates against the camera. In the
playground example the walker's footsteps sweep left to right across the
stereo field as it paces the strips.

## Captions

Synthesized events are already labeled data, so an accessibility feed
costs nothing. Every sound reports itself:

```ts
sounds.onCaption((c) => hud.caption(`♪ ${c.text}`));  // "footstep on wood"
sounds.captions();                                     // the last 32
sounds.splash(0.5, { caption: false });                // keep one off the feed
sounds.footstep('grass', { caption: 'soft steps' });   // or reword it
```

## The spectrum wall

`createAnalyser()` taps the finished mix, post-compressor — what it reads
is exactly what reaches the speakers. The playground's wall of bars is
twelve lines of code:

```ts
const analyser = sounds.createAnalyser(64);
const bins = new Uint8Array(analyser.frequencyBinCount);
// per frame:
analyser.getByteFrequencyData(bins);
bars.forEach((bar, i) => (bar.scale.y = 0.15 + (bins[i] / 255) * 5.5));
```

## Sounds from the rest of the trilogy

The bridges are one-liners, because everything speaks in structural shapes:

```ts
// anima3d: Locomotion emits footstep events; nothing listened until now.
locomotion.onFootstep(() => sounds.footstep('stone', { at: hero.position }));

// The cricket template's bat-ball contact:
match.onStrike = (energy) => { sounds.crack(energy); crowd.swell(energy); };

// scena3d weather drives the beds with the numbers it already has:
wind.set(windField.strength);
rain.set(precipitation.intensity);
```

## Custom recipes

Every recipe is a pure function returning a `SoundSpec` — oscillator and
filtered-noise layers with envelope curves — and `play()` renders any spec
you build yourself:

```ts
import { type SoundSpec } from 'gama3d';

const alarm: SoundSpec = {
  duration: 0.5,
  caption: 'alarm',
  layers: [{
    kind: 'osc', wave: 'square',
    freq: [[0, 880], [0.25, 660], [0.2501, 880], [0.5, 660]],
    gain: [[0, 0], [0.01, 0.2], [0.5, 0]],
  }],
};
sounds.play(alarm, { bus: 'ui' });
```

Keep the no-click rule — first and last gain of every layer at zero — and
frequencies strictly positive (they ride exponential ramps).

## Verifying without ears

Pass an `OfflineAudioContext` and the whole board renders into a buffer
you can measure — which is exactly how the playground sweep gates audio:

```ts
const off = new OfflineAudioContext(1, 44100, 44100);
const sb = new Soundboard({ context: off, seed: 5 });
sb.footstep('stone'); sb.crack(0.9);
const data = (await off.startRendering()).getChannelData(0);
// assert RMS > threshold: silence fails CI the way a blank frame does
```

## What it costs

A one-shot is two to four nodes alive for under half a second; the browser
collects them when the envelope closes. Continuous handles hold four to six
nodes each. The seeded noise buffers (2 s mono, one white, one pink) are
built once per board and shared by every sound that hisses. There is
nothing to preload, nothing to host, and nothing to download: the entire
sound design of a game ships in the code that describes it.
