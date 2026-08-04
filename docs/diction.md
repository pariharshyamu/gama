# Diction

Text in, speech out — and the only question left is the one a player asks.

```
npm run diction
```

---

## Can you tell what it said?

Every gate before this asked whether a piece of the model matched physics or a
published measurement. Those are answerable, and they were answered. This one
cannot be settled by a formula, so it is settled by a listener — a very stupid
one.

Ten lines are spoken, each vowel is cut out where the planner said it would be,
and it is labelled with whichever of the ten vowels its spectrum most resembles.
The listener is given the vowel table and **nothing else**: not the text, not
which vowel to expect, not where in the sentence it is. Coarticulation is free
to have ruined any of them.

```
line                                                     vowels   right
the traveller stopped at the gate and asked for water       12    100%
nobody in the village knew his name                         10     80%
she carried a lantern down the road                          9    100%
every window in the town was dark                            9    100%
he said he would wait until the morning                     10     90%
the old man told us to keep to the path                     10     90%
we found a bell and a book in the stone room                11    100%
the king would not come down from the hill                   9    100%
take the horse and go north before night                    10    100%
i think the bridge is gone                                   6    100%

96% of 96 vowels identified, against a 10% chance floor.
Misaligned — the same audio cut from the wrong places — scores 15%.
```

The budget is the **ratio to its own control**, not the score: aligned must beat
misaligned by at least 4×. A score is a baseline; a ratio to the thing that
should fail is not.

---

## The handshake, which is what three packages are for

`visemeOf` returns `{ open, round, close, spread }` — exactly the shape ANIMA's
`Speech` consumes to drive a mouth. ANIMA imports nothing from GAMA and GAMA
imports nothing from ANIMA. What makes them agree is not a shared type but a
shared fact:

> **F1 is mouth opening.** A jaw that drops raises the first formant, in the
> geometry and in the air.

```
aligned:              r = 0.832   over 96 vowels
the face 100 ms late: r = 0.392   ← the control
```

A tenth of a second is about one syllable, and about where a dubbed film starts
to look wrong. Measured as a **spectral centroid** of the band F1 lives in
rather than as a peak — there is no index to get wrong, and no back vowel whose
merged F1 and F2 can be mistaken for each other.

And `/p/`, `/b/`, `/m/` shut the mouth completely: the one viseme a viewer can
read off a silent face, which is why they are the classic lip-sync landmark.

---

## Why there has to be a dictionary

English spelling is not a function of its letters. "though", "through", "tough",
"thought" and "thorough" share four letters and no vowel; "read" is two words.

```
216 words in the lexicon. Sounding each one out from its own letters
reproduces 35% of them exactly, and 48% of their vowels.
```

The gate asserts the fallback **cannot** replace the dictionary — a positive
claim, so that if `LETTER_RULES` ever matched most entries, either the rules got
better than English allows or the lexicon stopped being interesting, and both
are worth being told about.

### The anchor from outside

Every other check here compares the audio against the plan that produced it, so
a corrupted entry is invisible to all of them: change "gate" to `/g u t/` and
the synthesizer says *gut*, the listener hears `/u/`, the plan expected `/u/`,
and every number stays green.

English supplies its own check. Words that **rhyme** must share their nucleus
and coda; **homophones** must be identical throughout. Neither fact comes from
this library, and no plausible corruption survives both. This is the same hole
the voice gate had before Peterson & Barney's men's row was carried a second
time.

---

## Three bugs, and one of them scored the synthesizer at chance

- **`f0: 0` was not whispering.** `renderSpeech` documents it as rendering the
  whole utterance whispered, but each phone carried its own planned pitch and
  quietly overrode it — so asking for a whisper produced a **voiced** signal,
  which the gate then analysed with an analyser that assumes no harmonic comb.
  It read 96 vowels' worth of harmonics and scored the entire synthesizer at
  **11%**, one point above chance. Fixed, the same audio scores 96%.
- **The listener was indexing peaks.** Pulling F1 and F2 out by position is
  fragile exactly where speech is hardest: a back vowel's F1 and F2 sit close
  enough to merge — `/ɔ/` is 570 and 840 — so "the second peak" is F3. It heard
  `/ɔ/` as `/ɛ/` and `/i/` as `/æ/`. It is a template matcher now, which has no
  index to get wrong.
- **The window did not fit the transform.** `spectrum` is Welch-averaged and its
  loop runs while `start + size <= length`, so a slice shorter than the
  transform produces *no windows at all* and returns a flat −240 dB floor. Every
  reduced vowel in running speech is under 50 ms, so a 1024-point transform
  silently analysed nothing.

And a real one in the model: **`visemeTrack` added 8 ms to every consonant** that
the renderer does not, so the face drifted a frame ahead of the sound by the end
of a sentence — the one thing lip-sync must never do.

---

## API

```ts
import { speak, pronounce, visemeTrack, voiceOf } from 'gama3d';

// one call
const samples = speak('the traveller stopped at the gate', voiceOf({ height: 1.75 }));

// or the plan, if the face needs it too
const spoken = pronounce('the bridge is gone?', { voice });
const mouth = visemeTrack(spoken.phones, voice);   // ANIMA eats this
```

- `LEXICON` / `lookUp` / `soundOut` — the dictionary and its fallback.
- `syllabifyPhones` — the maximal onset principle: "a-bout", not "ab-out".
- `pronounce(text, options)` — phones with durations and a pitch contour. A
  trailing `?` gives it a question's intonation.
- `speak(text, voice, options)` — samples. Pure, no assets, no network.
- `visemeOf` / `visemeTrack` — the handshake, aligned to the audio exactly.

---

## Where this is still wrong

**The dictionary is 216 words.** That is enough for village dialogue and not
enough for prose, and the gate reports the miss rate rather than the file
claiming coverage it has not got.

**No stress in the lexicon beyond the first syllable.** Most entries default to
initial stress, which is right for most English content words and wrong for
"about", "again", "before".

**Affricates are spelled out.** `/tʃ/` is rendered as `/t/` followed by `/ʃ/`,
which is what it is made of but releases far too slowly.

**The playground shows one fixed line.** Playground `diction` lays "the
traveller stopped at the gate" out as the machine says it — a block per phone,
width for duration, height for pitch — with the viseme ANIMA would draw beside
it as a working mouth. A page you type your own line into is the obvious next
thing.
