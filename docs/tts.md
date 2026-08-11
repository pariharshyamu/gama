# The platform speaks, the mouth is ours

**Two ways to make an NPC talk, and this library ships both.** One of them is
right about the physics. The other one is the one a player can understand.

```
npm run tts
```

---

## The split

| | `speak()` | `speakAloud()` |
|---|---|---|
| what it is | a Klatt-style cascade formant synthesizer | the platform's `SpeechSynthesis` |
| use it for | creatures, radio, crowd murmur, barks, anything non-human | any line a player must UNDERSTAND |
| voice from a body | yes — `voiceOf({ height })` derives the tract | a pitch RATIO only |
| deterministic | yes, seeded, offline, in the replay checksum | no |
| assets | none | none |
| sounds like | 1980, because it is 1980 | a person |

`renderSpeech` is phonetically correct. The loci are Delattre's, the voice onset
times are Lisker and Abramson's, the nasal zeros are where a side branch of that
length puts them, and every one of those is measured back out of the rendered
audio by `npm run consonants`. It is also, after three rounds of level fixes
that each found a real bug, still not something you would want an NPC to say a
sentence with. **Being right about the physics and being pleasant to listen to
are different problems, and this library only solved one of them.**

So the synthesizer keeps the jobs where a 12 cm vocal tract or a 40 cm one is
the point, and where determinism matters, and the platform gets the dialogue.

## What is NOT given up

**The viseme handshake.** The mouth comes out of `pronounce()` — the lexicon and
the prosody model — not out of the audio. So the face is driven by the same
**F1 is mouth opening** fact whichever thing is making the sound, and ANIMA's
`Speech.follow()` consumes exactly the same `{ open, round, close, spread }` it
always did, still importing nothing from here.

```ts
import { speakAloud, voiceOf } from 'gama3d';

const line = speakAloud('the traveller stopped at the gate', voiceOf({ height: 1.75 }));

// every frame
face.follow(line.mouthAt());
```

## The one thing that does change: timing

`SpeechSynthesis` reports **word** boundaries and no phone boundaries. It will
never tell you where the `/m/` is. So the planned track has to be re-anchored
onto the timings the platform does report, and that is `anchorTrack`: a
piecewise-linear time warp through the observed word marks.

Between two marks the plan is stretched uniformly, which is the only thing that
can be justified — within a word the RELATIVE phone durations are Klatt's and
are the best information anyone has, while the absolute rate is the platform's
and is the only thing being measured.

```
                              drift from the words
anchored on word boundaries          13 ms
a global rate estimate               68 ms
the budget                           40 ms   one frame at 24 fps
```

The 40 ms is not chosen here: it is the tolerance ANIMA's lip-sync gate already
uses, which is about where a mouth starts looking dubbed.

## What the gate can and cannot check

**Nothing in `npm run tts` listens to a voice.** There is no `speechSynthesis`
in Node, and headless Chromium ships with zero voices, so whether a platform
voice says "Havenbrook" nicely is not checkable here and is not claimed. What is
checked is the warp, which is the only part this library wrote:

- **It reduces to the identity.** A platform speaking at exactly the planned
  rate carries no information the plan does not have, and the warp returns the
  plan unchanged to within a nanosecond. A warp that moved a track it had no
  reason to move would have scored well on everything else.
- **A mouth cannot run backwards.** Ten malformed mark streams — out of order,
  coalesced onto one instant, all at zero, non-finite, indices past the end, the
  same word twice, none at all, and observed times that run backwards. Only the
  last of those fails without the guard in `anchorTrack`, and every other case
  passed a build with the guard deleted, which is why it is in the list.
- **It beats the alternative**, which is scaling everything by
  `actual / planned`. That is the control and it has to lose.

The ground truth for the last one is a simulated speaker, and **a simulator is
not a browser**. What makes it more than self-congratulation is that the control
is scored by the same simulator, so anything the simulation gets wrong it gets
wrong for both. The first version of that simulator stretched each word by one
constant — a piecewise-constant rate change, which a word-anchored warp inverts
*exactly*. It printed 0 ms, and would have printed 0 ms for a warp with a sign
error in it. The rate now wanders within each word as well, which is information
no word boundary can carry.

## The pitch, which is the other half of a face

`SpokenLine.pitchAt(seconds)` returns **semitones relative to whoever is
speaking**. Ekman's *About Brows* (1979) and Cavé et al. (1996) found that brow
raises are prosodic before they are emotional — about seven in ten coincide with
a rise in F0 — so a face with the contour punctuates a sentence for free, and one
without it has to be animated by hand.

```
a statement spans        6.3 semitones
a question ends at       9.0  against a statement's 3.5
a long line declines     1.7 semitones from its first half to its second
```

It is a field on the same cue the visemes are on, so a word boundary that moves
the mouth moves the accent with it. **Semitones and not hertz**, because a face
does not care how big a larynx is: a 1.2 m NPC and a 1.95 m one hand the same
numbers to the same face for the same sentence. Nothing else in the gate pins
that — returning raw hertz passes the span check, the question check and the
declination check, and only the two-speaker comparison catches it.

The declination is why the consumer needs a running baseline. A brow wired
straight to pitch sinks with the sentence; ANIMA's `Brows` tracks the floor.

## `speechAvailable()` is not what you think it is

It reports whether the **API** exists. Not whether the platform can speak, and
the difference is not academic:

> Headless Chromium exposes `speechSynthesis` and `SpeechSynthesisUtterance`,
> ships with **zero voices**, accepts `speak()`, says nothing, and fires `end`
> without ever firing `start`.

A capability sniff cannot tell that apart from a working engine — `getVoices()`
is asynchronous and legitimately empty on the first call in Chrome — so
`speakAloud` does not try. It watches for the behaviour instead: a start
watchdog, plus a check for `end` arriving without `start`. Either one puts the
line into `fellBack`, where the mouth runs off the plan on the wall clock.

**A missing platform voice should cost you the audio, not the animation.** That
claim was in the first draft of this file and was false when written: the face
sat shut with `elapsed()` at −1 for the whole session, and it took a headless
probe to find, because on a developer machine with voices installed everything
looked perfect.

## API

```ts
speechAvailable(): boolean
speakAloud(text, voice?, options?): SpokenLine
planLine(text, voice?, options?): { cues, words, seconds }
anchorTrack(cues, words, marks, endSeconds?): VisemeCue[]
mouthFrom(track, seconds): Viseme
utteranceVoice(voice): { pitch, rate }
```

- **`SpokenLine.mouthAt(seconds?)`** — the handshake. Same shape as `visemeOf`.
- **`SpokenLine.fellBack`** — true when the platform never started and the mouth
  is running off the plan. Worth surfacing in a debug overlay.
- **`utteranceVoice`** maps a body onto `utterance.pitch`, which is a
  dimensionless multiplier the platform never defines in hertz. The mapping is
  therefore a **ratio** against this library's own reference speaker: two NPCs an
  octave apart in `voiceOf` are an octave apart in `utterance.pitch`, whatever
  the platform's neutral turns out to be. Mapping onto a difference instead also
  falls with height and also lands inside the spec's 0..2, which is why the gate
  asserts the ratio and not the ordering.

## Where this is still wrong

**Word marks are the only timing signal, and some engines do not send them.**
Safari's `boundary` support has historically been partial. With no marks the
track is the plan, unwarped, which is a worse mouth but a working one.

**`onboundary` gives a character offset, not a word index.** The mapping here is
"the last planned word whose `charIndex` is at or before the offset", which is
right for ordinary prose and will drift on text where the lexicon's tokenisation
and the platform's disagree — hyphenation, numerals, abbreviations.

**No voice selection by character.** `voiceName` takes an exact string and there
is no notion of picking a gruff voice for a guard. Voice lists differ per
platform, per OS, and per install, so anything cleverer would be a lie on some
machine.
