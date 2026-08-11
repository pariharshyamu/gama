# Voice

An NPC that speaks, with **no audio files, no network and no assets**. A vocal
tract is a tube, and a tube's resonances are a length and the speed of sound.

```
npm run voice
```

---

## The three ways to give an NPC a voice, and why they are all wrong

Ship recorded lines and you have shipped assets — megabytes per character, one
language, and a mute NPC the moment anything is generated at runtime. Call a
text-to-speech service and you have shipped a network dependency into the frame
loop. Play a pitched beep per syllable and you have not shipped a voice.

There is a fourth option and it is sixty-six years old.

## Source and filter

Fant's **source-filter theory** (1960): speech is a SOURCE — the vocal folds
buzzing, or turbulent noise — passed through a FILTER, the vocal tract, whose
resonances are the **formants**.

The source carries pitch. The filter carries the vowel. **They are
independent**, which is why you can sing "ah" on any note, and why a WHISPER —
which has no vocal-fold source at all — is still perfectly intelligible.

A tract is closed at the glottis and open at the lips, so it resonates at odd
quarter-wavelengths:

```
Fₙ = (2n − 1)·c / 4L
```

With c = 343 m/s and a 17.5 cm adult male tract:

```
490 / 1470 / 2450 Hz        textbook neutral vowel: 500 / 1500 / 2500
```

**One length and the speed of sound.** Nothing fitted, nothing tuned.

---

## And the vowel chart is the formant table

The IPA vowel chart's axes are not decorative. Vowel HEIGHT tracks F1 inversely,
and BACKNESS with ROUNDING tracks F2:

```
F1 against the IPA's own vowel height:       ρ = 1.000
F2 against backness + rounding:              ρ = −0.976
```

ρ = 1.000 is not a correlation. It means the ten vowels rank in *exactly* the
same order on both, which they must, because they are the same axis measured by
two different instruments — a phonetician's ear in 1888 and a spectrograph in
1952.

ANIMA's `PhonemeSpec` reads height and roundedness to draw a mouth. This file's
`VowelSpec` reads the same two, plus one more. **Neither package imports the
other.**

### The axis a viseme table does not need

ANIMA's chart has no BACKNESS, and that is correct: you cannot see where a
tongue is, so a viseme table has no use for it. An ear can hear it. `/i/` and
`/u/` are both close vowels — identical on every axis a mouth can show — and
they sit 1400 Hz apart in F2.

That is where the two organs stop agreeing about what a vowel is, and it is not
a defect at either end.

---

## The test that could have failed

Analysing your own synthesizer proves it does what it says. It cannot prove what
it says is true. So the gate goes **out of sample**.

Peterson & Barney measured 76 speakers in 1952 and published three rows: men,
women and children. **This library carries the men's row only.** Every other
voice is that row divided by a ratio of tract lengths — one number.

```
women — 15.0 cm tract, ratio 1.167
  vowel   P&B F1/F2     model      heard        model err   heard err
  /i/     310 2790    315 2672   312 2676       2%   -4%      1%   -4%
  /ɛ/     610 2330    618 2147   624 2143       1%   -8%      2%   -8%
  /ɑ/     850 1220    852 1272   851 1276       0%    4%      0%    5%
  /u/     370  950    350 1015   355 1012      -5%    7%     -4%    7%
  /ʌ/     760 1400    747 1388   754 1400      -2%   -1%     -1%   -0%
  model 5.0% mean — and the BEST any single ratio can do is 4.9%, at 1.151.

children — 12.5 cm tract, ratio 1.400
  model 5.4% mean — and the BEST any single ratio can do is 4.3%, at 1.349.
```

Read the second line of each. The budget is not a number anybody chose: it is
what the best possible single ratio achieves on the same rows, found by sweeping
every ratio and letting it see the answer. **Two measured anatomical lengths,
shown none of these rows, cost 0.1 and 1.1 points against a ratio that was
handed them.**

And the floor is real. A fitted ratio still leaves 4.3%, because P&B's own
vowel-by-vowel ratios scatter by about 7% around their own mean — a male larynx
descends at puberty, so a tract does not scale uniformly. `/ɔ/` scales men→women
at 1.035 where a typical vowel runs 1.212. **No single number can pretend
otherwise, and the gate asserts that /ɔ/ is the outlier rather than excusing
it.**

---

## What the gate measures, and what it refuses to

Every budget in `npm run voice` is derived from something already in the module:

| Claim | Budget | Where the budget comes from |
| --- | --- | --- |
| The synthesizer's peaks land where the table says | 0.5 | `BANDWIDTHS` — a peak cannot be located to better than a fraction of its own width |
| One length carries a whole population | the fitted ratio's error | a sweep over every ratio, allowed to see the answer |
| The lips radiate the derivative | 6 dB/octave | what a first difference does |
| The vowel table is Peterson & Barney's | exact | a second copy of the published row |

That last one is not a claim about speech and is labelled as such. It is there
because it had to be: the "best a single ratio can do" floor is fitted to the
same vowel table it judges, so corrupting one published formant moved the model
and its budget together and **the gate said nothing**. A budget derived from the
thing under test is not a budget.

### The analyser was the bug

The gate reported F1 errors of 8 to 11% and was one commit from widening its
budget to accommodate them. They were not in the synthesizer.

A voiced spectrum is a comb — a harmonic every F0 hertz — so peak-picking finds
harmonics, not formants, and the fix is cepstral liftering (Bogert, Healy and
Tukey, 1963). But a whisper has **no comb to remove**, and liftering it anyway
smooths the spectrum with a kernel about 125 Hz wide, twice a first formant's own
bandwidth. That dragged every sharp F1 up the rising skirt of F2.

Unliftered, the same renders come back within **4.1%**, with errors of both
signs instead of a one-way bias.

### Pitch really is not the vowel

```
vowel   F0     envelope match    F1 resolvable at this pitch?
/i/     90        1.000           yes
/i/    180        0.959           yes
/i/    360        0.903           no — F1 270 Hz is below the first harmonic
/ɑ/    360        0.962           yes
```

Two octaves of pitch and the filter does not move. The claim is stated as a
SHAPE and not as a peak position, on purpose: a source that puts a harmonic every
F0 hertz carries no information about a formant below F0. At 360 Hz, /i/'s
270 Hz F1 is not a hard measurement — it is an absent one, and saying so is the
difference between a limit and a bug.

The control is the chipmunk: pitch-shift the same buffer by **resampling**,
which is what playing a recorded sample faster does, and F1 moves by 1.47× and
the envelope falls to 0.555. That is what a sample-based voice does and what
this one does not.

### The mouth radiates the derivative

A mouth is a piston radiating into open air, and the pressure it produces is the
derivative of the flow through it. A derivative is +6 dB/octave, exactly. Below
the first formant the whole cascade is flat, so whatever slope is down there is
the lips and nothing else:

```
/ɑ/ F1 730 → 6.08      /ʊ/ F1 440 → 6.49
/æ/ F1 660 → 6.07      /ɪ/ F1 390 → 6.58
/ʌ/ F1 640 → 6.13      /u/ F1 300 → 7.31
/ɔ/ F1 570 → 6.29      /i/ F1 270 → 7.55
```

6.07 at the open end, drifting up as F1 descends into the measurement band and
its own skirt starts to contribute. Nothing was fitted to make that 6.

---

## API

```ts
import { renderVoice, voiceOf, formantsOf, VOWELS } from 'gama3d';

// A body gives a tract; a tract gives a voice. ANIMA's rig.height drops in.
const voice = voiceOf({ height: 1.62 });      // { tract: 0.162, f0: 129.6 }

// Pure — a Float32Array, no WebAudio, no assets, no browser.
const samples = renderVoice(
  [{ vowel: 'i', seconds: 0.18 }, { vowel: 'A', seconds: 0.22 }, { vowel: 'u', seconds: 0.2 }],
  voice,
  { sampleRate: 22050 }
);

const buffer = ctx.createBuffer(1, samples.length, 22050);
buffer.getChannelData(0).set(samples);
```

- `tubeFormants(L)` — `(2n−1)c/4L`, the neutral vowel and nothing else.
- `formantsOf(vowel, L)` — the table transposed to a tract of any length.
- `renderVowel` / `renderFormants` — one vowel, or three arbitrary resonances.
- `renderVoice(segments, voice)` — a string of vowels with the formants gliding
  between them. The glide is most of what makes a sequence sound like speech
  rather than a keyboard.
- **`f0: 0` renders a whisper.** Noise through the same filter, no folds at all.
  It is not a degraded mode; it is the filter on its own, and it is how the gate
  measures the formants.

Playground: **`voice`** — three vowel charts stacked, one per body. In log
formant space a different body is a *translation*, so the three charts are
congruent: same shape, three heights, one diagonal shift. Click to hear it.

---

## Where this is still wrong

**Vowels only.** A consonant is a constriction — a stop, a fricative, a nasal
side-branch — and none of those are three resonators in a row. `/s/` needs a
noise burst shaped by a front cavity; `/m/` needs a zero as well as poles.

**No prosody.** `f0` is a constant, and a real voice never holds a pitch. The
declination over a sentence, the rise at a question, the stress that lengthens a
syllable — those carry as much meaning as the vowels and none of them are here.

**The tract is uniform.** A real one has a tongue in it, and the formant table
in this file is measured rather than derived for exactly that reason. A
tube-with-a-constriction model would derive them, and would be a bigger claim
than this file makes.
