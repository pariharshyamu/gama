# Consonants

A consonant is mostly not a sound. **A stop is a transition, `/p/` vs `/b/` is a
duration, and a nasal needs a zero that no cascade of resonators can produce.**

```
npm run consonants
```

---

## Three ways a vowel synthesizer breaks

`voice.ts` is a cascade of three resonators, which is a vowel and only a vowel.
Consonants break it in three separate places, and each break is a different piece
of machinery rather than another row in a table.

## 1. A stop is a TRANSITION

Ask what `/b/` sounds like and the answer seems obvious: a little burst of noise
at the lips. Delattre, Liberman and Cooper cut the bursts off synthetic
syllables at Haskins in 1955 and found listeners still heard `/b/`, `/d/` and
`/g/` perfectly well. Splice one consonant's burst onto another's transitions and
you hear the **transitions**.

Each stop has a **locus** — a frequency the F2 transition points back to,
whatever vowel follows. So the same `/d/` runs in opposite directions depending
on what comes next:

```
/di/   F2 rises   2067 → 2290 Hz
/du/   F2 falls   1378 →  870 Hz
```

Opposite directions, one consonant. Nothing in the model specifies that; it falls
out of the locus sitting above one vowel's F2 and below the other's, and it is
what Delattre's listeners were using once the bursts were gone.

### The locus equation, and what it does and does not prove

Sussman, McCaffrey and Matthews (1991) plotted F2-at-onset against the vowel's
own F2 across many vowels and found the points fall on a line — one per place of
articulation:

```
stop    slope    R²      fixed point    Delattre et al. (1955)
/b/      0.87   0.976        548 Hz         720
/d/      0.53   0.919       1840 Hz        1800
/g/      1.07   0.965         none          2000
```

A slope of 1 would mean the consonant does nothing and the vowel is already
there; 0 would mean every vowel starts from the identical frequency. `COARTICULATION`
puts those coefficients in and the gate measures them back out, so **this is a
round trip through the renderer, not an independent prediction**, and the gate
says so. What it does check is that the coefficients survive being turned into
audio and read off a spectrum — which they did not, twice, on the way here.

The ordering, though, is anatomy. While the lips are shut for `/b/` the tongue
has nothing to do and is already where the vowel wants it. An alveolar closure
uses the tongue tip and pins the body part-way. And a velar closure **is** the
tongue body, the same organ that makes F2 — so `/g/`'s slope comes out at 1.07
and its line never crosses the diagonal. **A velar has no locus**, and the gate
asserts that as a positive claim rather than printing a `NaN` and hoping.

## 2. The `/p/` vs `/b/` distinction is a DURATION

They are the same closure at the same place. What separates them is when the
folds start relative to the release — the **voice onset time** — and Lisker and
Abramson measured it in 1964:

```
stop   measured VOT   Lisker & Abramson (1964)
/b/        12 ms             1 ms
/d/        12 ms             5 ms
/g/        24 ms            21 ms
/p/        60 ms            58 ms
/t/        72 ms            70 ms
/k/        84 ms            80 ms
```

The budget is **two pitch periods**, because voicing can only begin when the
folds next close: a VOT measured off a 120 Hz voice is quantised to 8.3 ms
whatever the model intended. That is a derived budget, not a chosen one.

And VOT rises through labial → alveolar → velar in *both* series, which is a fact
about how far the air has to travel rather than anything in the table.

## 3. A nasal needs a ZERO — and this one changes the architecture

For `/m/`, `/n/` and `/ŋ/` the mouth is closed and the sound leaves through the
nose. The oral cavity is still there, hanging off the side of the path as a dead
end — and a side branch does not add a resonance, it **subtracts** one. Where the
closed oral tube is a quarter wavelength, air rushes in and back in antiphase and
that frequency vanishes from the output.

**A cascade of resonators cannot do this at any setting.** Resonators are poles;
poles make peaks. This is why `renderFormants` was never going to say `/m/` no
matter how its table was tuned, and it is the one thing in the speech ladder that
needed a new filter rather than new numbers:

```
nasal   the zero takes out    at        over    published
/m/          35.3 dB         764 Hz    25%      750 Hz
/n/          25.4 dB        2024 Hz    21%     1700 Hz
/ŋ/          23.8 dB        3208 Hz    17%     3000 Hz
```

The third column is the control: **an antiformant is local**. A filter that came
out uniformly quieter would just be a gain change, and a cascade of poles can do
that perfectly well.

The zeros rise as the side branch shortens — `/m/` closes at the lips and keeps
the whole mouth, `/ŋ/` closes at the velum and keeps almost none.

---

## What the gate had to learn to measure any of this

Four analyser defects, each of which made the model look wrong or — worse — look
right:

- **The nasal test was measuring valleys.** An all-pole spectrum has gaps between
  its formants forty decibels deep. Taking the lowest bin in a band and measuring
  it against the highest bin either side reported all-pole `/n/` as a *deeper*
  notch than the real thing, which would have proved the exact opposite of the
  claim. A zero is now measured as the **difference** between the same phone
  rendered with and without it.
- **Fricative levels were measuring the normaliser.** `renderSpeech` normalises
  its output, so three fricatives rendered separately all come back at the same
  peak and `/s/` was reported as 1.0× the level of `/f/`. They are measured
  inside one buffer now, where the gain is shared.
- **The F2 picker was returning F3.** Asking a prominence picker for "the second
  formant" needs it to find the first, and an 11 ms window cannot resolve a
  280 Hz resonance — so it read `/du/`'s onset as 2498 Hz when the model had put
  it at 1378. The search band is bounded by the phones themselves now.
- **VOT was nearly measured by loudness.** Aspiration is loud; an energy
  threshold finds the burst and calls that the vowel, reporting every VOT as
  about zero. Voicing onset is found by **periodicity**.

And two real model errors the gate caught:

- **Fricative noise resonances were cascaded rather than summed.** Three narrow
  bandpasses in series multiply, and almost nothing survives all three when their
  centres are far apart: `/f/` came out **57 dB** below `/s/`, which is silence
  rather than a quiet consonant. A spectrum with several humps in it needs its
  poles added, not chained. Caught by making the level check two-sided against
  the published ~20 dB — the one-sided version passed happily.
- **The nasal murmur used the oral locus for its formants.** `/n/`'s pole at
  1800 Hz sat on top of its own zero at 1700 and the two annihilated, so the
  notch was not there to find. The murmur is the **nose**, and the nose is the
  same tube whichever way the mouth is shut — so all three nasals share its
  resonances and what distinguishes them is entirely the zero.

---

## API

```ts
import { renderSpeech, voiceOf } from 'gama3d';

// "bad dog" — consonants and vowels in one continuous articulation
const samples = renderSpeech(
  [{ phone: 'b' }, { phone: 'ae' }, { phone: 'd' },
   { phone: 'd' }, { phone: 'O' }, { phone: 'g' }],
  voiceOf({ height: 1.75 }),
  { sampleRate: 22050 }
);
```

- `CONSONANTS` — 21 phones with their loci, voice onset times, antiformants and
  noise resonances. Data, labelled as data.
- `consonantFormants(key, tract, nextVowel?)` — the articulatory target, pulled
  toward the vowel that follows by `COARTICULATION`.
- `planPhones` / `frameTimes` — the timeline, and where each frame sits. The gate
  needs release instants to measure VOT from, and must get them from the plan
  rather than from the audio it is judging.
- `renderSpeech(phones, voice, options)` — pure, a `Float32Array`.
- **`f0: 0` whispers the whole utterance**, which is how the gate reads a formant
  transition: a voiced spectrum is a comb, and a moving formant read through a
  comb in a 12 ms window is hopeless.
- **`noNasalZero: true`** renders nasals all-pole. Wrong, kept, exported — the
  claim that a nasal needs a zero is empty without something lacking one to fail
  against.

---

## Where this is still wrong

**No affricates and no syllabic consonants.** `/tʃ/` is a stop released into a
fricative and is not either one; `/n̩/` in "button" is a syllable with no vowel
in it at all.

**Position is ignored.** A `/p/` at the end of a word is often unreleased — no
burst, no aspiration, just a closure and silence — and `/l/` before a vowel and
after one are audibly different segments. Everything here is rendered as if it
were word-initial.

**The lexicon is still yours.** This is the machinery for saying phones; turning
English text into phones needs a pronunciation dictionary, which is data and a
separate problem.
