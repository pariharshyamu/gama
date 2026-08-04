# Prosody

The part of speech that is not the words. **English rhythm is a published
number, and the model has to land on it.**

```
npm run prosody
```

---

## Why a correct vowel still sounds like a machine

`voice.ts` gives an NPC a vocal tract, and the tract is right — a tube, checked
against 1952. It renders a vowel at a pitch, and the pitch is a *constant*,
which no voice has ever been.

A line delivered at flat F0 with evenly-spaced syllables does not sound wrong
because of its timbre. It sounds wrong because of its **rhythm and its melody**,
and those are two separate systems that happen to be separately published and
separately checkable.

---

## Duration: Klatt's rule form, and the floor is the interesting part

Klatt (1979) modelled segment duration as a chain of multiplicative rules
applied not to the duration but to the duration **above a floor**:

```
DUR = (INHERENT − MINIMUM) × percent/100 + MINIMUM
```

That shape matters more than any of the percentages. It means no stack of
shortening rules can drive a segment to nothing — a syllable squeezed by every
rule at once lands on its minimum and stops.

## The test that could have failed

Grabe and Low (2002) put a number on the old "stress-timed vs syllable-timed"
split: the **normalized Pairwise Variability Index**, how unlike each vowel is
from the one beside it, normalised so speaking faster does not change it.
Measured off recordings of humans:

```
Thai 65.8 | Dutch 65.5 | German 59.7 | English 57.2 | Tamil 55.8
Estonian 45.4 | French 43.5 | Japanese 40.9 | Spanish 29.7 | Mandarin 27.0
```

This library was built from none of it. The durations come out of Klatt's rules;
nPVI is measured out of the result:

```
Klatt rules, stress-timed      63.8      inside the 57.2–65.5 that the
                                         stress-timed languages cover
...no stress reduction         50.2      out of that group entirely
...no MINDUR floor             85.0      past every language ever measured
```

**The contrast is the claim.** If the model scored the same with and without
stress reduction, 63.8 would be an accident of the vowel inventory rather than a
property of the rules. It moves 13.6 points, and it moves in the direction the
rhythm-class hypothesis says it should.

And it does **not** reach Spanish, which is the honest part. The residual is
English's own inherent vowel durations, which even timing cannot remove: `/æ/`
is 3.4× `/ə/` before a single rule has run. Spanish scores lower partly because
its five vowels are durationally uniform, and no amount of even timing turns an
English vowel inventory into a Spanish one.

Take Klatt's floor out and unstressed syllables compress toward zero, nPVI goes
to 85.0, and the model leaves the human range in the other direction. That is
the control, and it is what the floor is for.

---

## Pitch: a semitone phenomenon, and a child proves it

Declination, accent size and the final rise are published in **semitones**, and
that is not a unit convention — it is the finding. A man, a woman and a child
saying the same sentence have F0 contours that differ by a constant factor in
hertz and coincide in semitones.

So this module does its pitch arithmetic in semitones and converts once, at the
end:

```
man    1.78 m   F0 118 Hz   contour  91–166 Hz   −4.6…5.9 st
woman  1.62 m   F0 130 Hz   contour 100–182 Hz   −4.6…5.9 st
child  1.25 m   F0 168 Hz   contour 129–236 Hz   −4.6…5.9 st

They differ by up to 70 Hz and agree to 3.1e-15 semitones.
```

`pitchInHertz: true` runs the whole model in hertz using the figures a reference
male voice would give — which is what a naive implementation does — and puts the
three bodies **1.6 semitones apart**. That is a different tune, and it ships,
exported, for the same reason `FlowField`'s `grid8` does: a claim with no
alternative to fail against is not a claim.

Constants are 't Hart, Collier & Cohen (1990): declination 0.55 st/s, accent
excursion 6 st, final fall 4 st, question rise 7 st.

---

## And the renderer has to follow the planner

A planner that produces a perfect contour and a renderer that ignores it look
identical from the planner's side. So the gate reads the pitch **back out of the
samples** by autocorrelation:

```
worst syllable off its plan:                0.38 semitones
statement, at its last readable syllable:   3.8 st
question, at the SAME syllable:             8.4 st, 4.6 higher
declination through 5 accents:             −1.51 st/s
...and through 'flat' accents:              0.03 st/s   ← the control
```

A semitone is the budget, because that is roughly the resolution a listener has
for a sustained pitch — and it is measured in the unit the model works in, where
the same error would otherwise be a different number for every body.

### Three bugs the audio found that the plan could not

**The final movement was on the wrong syllable.** A question rise applied to the
*last* syllable is inaudible in English, because English sentences very often end
on a reduced schwa lasting under sixty milliseconds — "…for WA-ter". A statement
and a question came out with the same tune everywhere a listener could hear one,
and the gate found it by measuring both and getting **0.0 semitones** of
difference. The movement now runs in time from the start of the **nuclear
syllable** — the last accent — to the end.

**The pitch tracker was reading a formant.** An autocorrelation allowed up to
500 Hz locked onto the schwa's 490 Hz first formant and reported a 115 Hz
syllable as 25 semitones off its plan.

**Then it was reading the octave below.** A periodic signal correlates with
itself just as well at twice its period, so "the highest peak" reports the
octave about as often as the pitch: a syllable planned at 144.5 Hz came back
11.99 semitones away, which is an octave to two decimal places. Taking the
*shortest* lag within 0.85 of the best peak is the standard remedy.

---

## API

```ts
import { syllabify, planUtterance, renderVoice, voiceOf } from 'gama3d';

const LEXICON = { the: { vowels: ['@'] }, gate: { vowels: ['E'] }, /* … */ };

const syllables = syllabify('the traveller stopped at the gate'.split(' '), LEXICON);
const plan = planUtterance(syllables, {
  voice: voiceOf({ height: rig.height }),
  intonation: 'question',
});

const samples = renderVoice(plan, voiceOf({ height: rig.height }), { sampleRate: 22050 });
```

`planUtterance` returns `{ vowel, seconds, f0, semitones, stressed }[]`, which is
already the shape `renderVoice` accepts — `VoiceSegment` gained an optional
per-segment `f0`, and the renderer glides between them in semitones because a
linear ramp in hertz between two notes an octave apart spends most of its time
near the top one.

`syllabify` assigns stress by rule: a word is in `FUNCTION_WORDS` or it is not,
and a content word takes primary stress on its lexically stressed syllable.
Nothing anywhere is marked by ear — if it were, the rhythm the gate measures
would be one somebody chose.

`nPVI(durations)` is exported, because the metric is the point.

---

## Where this is still wrong

**The lexicon is yours.** English spelling does not carry its vowels, so
`syllabify` needs a table. Turning arbitrary text into that table is a real
problem and a separate one — it needs a pronunciation dictionary or
letter-to-sound rules, and it is data rather than DSP.

**One accent size for every accent.** Real speech has a nuclear accent that is
larger than the prenuclear ones, and contrastive stress larger still. Everything
here gets the same 6 semitones.

**No pauses, and no breathing.** A comma is a boundary with a duration, and
declination resets after one. Neither is modelled, so a long line declines
further than a person would let it.

**Still vowels only.** A consonant is a constriction, and until there are
consonants this is a rhythm and a melody carried on a vowel skeleton — which is
a real technique, and is not yet words.
