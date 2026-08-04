# Changelog

Every minor version here is one feature taken end to end: code, unit tests, a
runnable example in the playground, headless verification in Chromium, and
docs. Nothing is listed as shipped that has not been run.

The entries below are written to be *useful* rather than complete — where a
release found a bug worth knowing about, the bug is in the entry. The commit
messages carry the long form.

Versions follow semver in spirit: while at `0.x`, minor versions may add and
occasionally reshape API. Breaking changes are called out under **Changed**.

Two gaps between this file and the registry, stated rather than papered over:
`0.1.0`–`0.8.0` predate the rename to `gama3d` and were never published, and
`0.33.0` was committed but superseded by `0.34.0` before a publish, so
`npm install gama3d@0.33.0` finds nothing.

## [0.51.1] — 2026-08-04

### Added

- **Playground `diction`** — the gap 0.51.0 left open, and it is stated as
  filled rather than quietly appearing. One line laid out as the machine says
  it: a block per phone, width for duration, height for pitch, amber for a
  vowel and blue for a consonant. Beside it, the viseme ANIMA would draw, as a
  working mouth with a jaw gap and two lips that bridge it — the same
  `{ open, round, close, spread }` that anima3d 0.63.0's `Speech.follow()`
  consumes, with neither package importing the other. The mouth shuts on the
  /p/ in \stopped\, which is the one viseme a viewer reads off a silent face.

### Fixed

- **The first layout was forty-two metres wide.** A 2.5-second line at
  seventeen metres a second, framed against the viewport rather than the
  PREVIEW PANE — which is about half the window's width and taller than it is
  wide. Most of the sentence was off the right-hand edge. Third time this
  release series that a playground was framed for the wrong rectangle.

## [0.51.0] — 2026-08-04

### Added

- **Diction — text in, speech out, and an NPC that talks.** `speak(text, voice)`
  returns a `Float32Array`. `LEXICON` (216 words), `lookUp`, `soundOut`,
  `LETTER_RULES`, `syllabifyPhones`, `pronounce`, `visemeOf`, `visemeTrack`.
- **`npm run diction` — the only question left: can you tell what it said?**
  Ten lines spoken, every vowel cut out where the planner said it would be and
  labelled by a listener given the vowel table and nothing else — not the text,
  not which vowel to expect. **96% of 96 vowels identified**, against a 10%
  chance floor. The budget is the **ratio to its own control** (the same audio
  cut from the wrong places, 15%) rather than the score, because a score is a
  baseline and a ratio to the thing that should fail is not.
- **The handshake.** `visemeOf` returns the mouth shape ANIMA's `Speech`
  consumes. Neither package imports the other; what makes them agree is that
  **F1 is mouth opening**. Correlated at **r = 0.832** over 96 vowels against
  **0.392** for a face shifted 100 ms out of step.
- **An anchor from outside the file.** Every other check compares the audio
  against the plan that produced it, so a corrupted dictionary entry is
  invisible to all of them. English supplies its own check: rhymes must share
  their rime and homophones must be identical. Same hole the voice gate had
  before P&B's men's row was carried twice.

### Fixed

- **`f0: 0` was not whispering, and it scored the synthesizer at chance.**
  `renderSpeech` documents it as whispering the whole utterance, but each phone
  carried its own planned pitch and quietly overrode it — so a whisper request
  produced a VOICED signal, which the gate analysed with an analyser that
  assumes no harmonic comb. It read 96 vowels' worth of harmonics and reported
  **11%** intelligibility, one point above chance. Fixed, the same audio scores
  96%.
- **`visemeTrack` added 8 ms to every consonant the renderer does not**, so the
  face drifted a frame ahead of the sound across a sentence — the one thing
  lip-sync must never do.
- **The gate's listener was indexing peaks.** A back vowel's F1 and F2 merge —
  /ɔ/ is 570 and 840 — so "the second peak" is F3, and it heard /ɔ/ as /ɛ/ and
  /i/ as /æ/. It is a template matcher now, with no index to get wrong.
- **The analysis window did not fit its transform.** `spectrum` is Welch-averaged
  and its loop runs while `start + size <= length`, so a slice shorter than the
  transform produces no windows at all and returns a flat −240 dB floor. Every
  reduced vowel in running speech is under 50 ms.

### Changed

- `npm run diction` joins `prepublishOnly` and CI. Six gates now.
- No new playground: `voice`, `prosody` and `consonants` cover the ladder
  underneath, and this release's payoff is audible rather than visual.

## [0.50.0] — 2026-08-04

### Added

- **Consonants — and a consonant is mostly not a sound.** `voice.ts` is a
  cascade of three resonators, which is a vowel and only a vowel. Consonants
  break it in three separate places, and each break is a different piece of
  machinery rather than another row in a table. `CONSONANTS` (21 phones),
  `COARTICULATION`, `consonantFormants`, `planPhones`, `frameTimes`,
  `renderSpeech`, `isConsonant`/`isVowel`.
- **A stop is a TRANSITION.** Delattre, Liberman and Cooper cut the bursts off
  synthetic syllables at Haskins in 1955 and listeners still heard `/b/`, `/d/`
  and `/g/`. Each stop has a **locus** the F2 transition points back to, so the
  same `/d/` runs **2067 → 2290 Hz** before `/i/` and **1378 → 870** before
  `/u/` — opposite directions, one consonant, and nothing in the model specifies
  it. `/g/`'s locus equation has a slope of **1.07** and never crosses the
  diagonal: a velar closure IS the tongue body, so it has no locus at all, and
  the gate asserts that as a positive claim rather than printing a `NaN`.
- **The `/p/` vs `/b/` distinction is a DURATION.** Voice onset time, Lisker &
  Abramson (1964), measured back out of the rendered audio by **periodicity**
  rather than loudness — aspiration is loud, and an energy threshold reports
  every VOT as about zero. Budget is **two pitch periods**, because voicing can
  only begin when the folds next close, so a VOT off a 120 Hz voice is quantised
  to 8.3 ms whatever the model intended.
- **A nasal needs a ZERO, and that changed the architecture.** The closed oral
  cavity hangs off the path as a dead end and *subtracts* a frequency. Poles make
  peaks; a cascade of resonators cannot produce a notch at any setting, which is
  why `renderFormants` was never going to say `/m/` however its table was tuned.
  `antiresonator` is the first filter in this library that is not a pole.
  `noNasalZero: true` renders nasals all-pole and ships exported as the control.
- **`npm run consonants`** — the gate, with a control on every claim. The zero is
  measured as the **difference** between the same phone rendered with and without
  it, and must be *local*: a filter that came out uniformly quieter would be a
  gain change, which a cascade of poles can do perfectly well.
- **Playground `consonants`.** The F2 track of `/d/` and `/b/` before six vowels,
  with each row's locus drawn across it. The amber row rises for three vowels and
  falls for three; the green row barely moves, because while the lips are shut
  the tongue is already where the vowel wants it.

### Fixed

- **Fricative noise resonances were cascaded rather than summed.** Three narrow
  bandpasses in series multiply, and almost nothing survives all three when their
  centres are far apart: `/f/` came out **57 dB** below `/s/`, which is silence
  rather than a quiet consonant. A spectrum with several humps needs its poles
  added, not chained — the same lesson as the nasal, one filter earlier. Caught
  only after the level check was made **two-sided** against the published ~20 dB;
  the one-sided "louder than /f/" version passed happily.
- **The nasal murmur used the oral locus for its formants.** `/n/`'s pole at
  1800 Hz sat on top of its own zero at 1700 and the two annihilated. The murmur
  is the **nose**, and the nose is the same tube whichever way the mouth is shut,
  so all three nasals now share its resonances and what distinguishes them is
  entirely the zero.
- **The gate's nasal test was measuring valleys, and scored the control as
  better than the real thing.** An all-pole spectrum has gaps between its
  formants forty decibels deep; taking the lowest bin in a band and measuring it
  against the highest bin either side reported all-pole `/n/` as a *deeper*
  notch than the pole-zero one, which would have proved the exact opposite of
  the release's central claim.
- **Fricative levels were measuring the normaliser.** `renderSpeech` normalises
  its output, so three fricatives rendered separately all come back at the same
  peak — `/s/` was reported as 1.0× the level of `/f/`. Measured inside one
  buffer now, where the gain is shared.
- **The F2 picker was returning F3.** Asking a prominence picker for "the second
  formant" requires it to find the first, and an 11 ms window cannot resolve a
  280 Hz resonance, so it read `/du/`'s onset as 2498 Hz where the model had put
  it at 1378. The search band is bounded by the phones themselves now: no F1
  reaches 600 Hz at release and no F3 falls below 2400.
- **The model had no coarticulation at all.** Every locus-equation slope came
  out at zero, because the closure's F2 target was the locus regardless of what
  followed. A consonant's own articulation is already partly the vowel after it,
  and `COARTICULATION` is ordered by which articulator is occupied — the lips
  leave the tongue entirely free, an alveolar closure pins it part-way, and a
  velar closure IS it.

### Changed

- `renderSpeech` honours `f0: 0` as a whisper, driving the tract with turbulence
  instead of folds. The gate uses it to read formant transitions: a voiced
  spectrum is a comb, and a moving formant read through a comb in a 12 ms window
  is hopeless.
- `npm run consonants` joins `prepublishOnly` and CI beside `forage`, `flow`,
  `voice` and `prosody`.

## [0.49.0] — 2026-08-04

### Added

- **Prosody — the part of speech that is not the words.** `voice.ts` gives an
  NPC a vocal tract, and the tract is right. What it renders is still a machine,
  and not because of the timbre: because the pitch is a constant and the
  syllables are evenly spaced. `planUtterance`, `syllabify`, `klattDuration`,
  `nPVI`, `toSemitones`/`fromSemitones`, `KLATT_INHERENT`, `DURATION_RULES`,
  `FUNCTION_WORDS`, `DECLINATION`, `ACCENT_EXCURSION`, `FINAL_FALL`,
  `QUESTION_RISE`.
- **Duration is Klatt's rule form, and the FLOOR is the claim.** Klatt (1979)
  applied shortening rules not to a duration but to the duration above a
  minimum: `DUR = (INHERENT − MIN) × pct/100 + MIN`. That shape matters more
  than any percentage — no stack of rules can squeeze a syllable to nothing.
- **`npm run prosody` — the gate, and the number was measured on people.**
  Grabe & Low (2002) put a figure on the old stress-timed/syllable-timed split:
  the normalized Pairwise Variability Index. English 57.2, Dutch 65.5, German
  59.7, French 43.5, Spanish 29.7, Mandarin 27.0. This library was built from
  none of it. The model comes out at **63.8**, inside the 57.2–65.5 the
  stress-timed languages cover. **The contrast is the claim**: drop the stress
  reduction and it falls to **50.2**, out of that group entirely. Remove Klatt's
  floor and it goes to **85.0**, past every language ever measured.
- **Pitch in SEMITONES, with a hertz version shipped as the control.**
  Declination, accent size and the final rise are published in semitones because
  that is the finding: a man, a woman and a child saying the same sentence
  differ by up to 70 Hz and agree to 3.1e-15 semitones. `pitchInHertz: true`
  runs the same model in hertz on a reference male's figures — what a naive
  implementation does — and puts the three bodies 1.6 semitones apart. It is
  exported for the same reason `FlowField`'s `grid8` is.
- **`VoiceSegment` gained an optional per-segment `f0`**, so a contour can
  actually be rendered. `renderVoice` glides between them in semitones, because
  a linear ramp in hertz between two notes an octave apart spends most of its
  time near the top one.
- **Playground `prosody`.** The same eight syllables three ways — statement,
  question, and a flat control. Each block is a syllable: width is duration,
  height is pitch in semitones, bright is accented. The widths are identical
  across all three lanes, because intonation does not touch rhythm.

### Fixed

- **The final movement was on the wrong syllable, and only the audio said so.**
  A question rise applied to the *last* syllable is inaudible in English,
  because English sentences so often end on a reduced schwa lasting under sixty
  milliseconds — "…for WA-ter". A statement and a question came out with the
  same tune everywhere a listener could hear one, and the gate found it by
  measuring both renders and getting **0.0 semitones** of difference. The
  movement now runs in time from the start of the nuclear syllable — the last
  accent — to the end.
- **The gate's pitch tracker was reading a formant.** An autocorrelation allowed
  up to 500 Hz locked onto the schwa's 490 Hz F1 and reported a 115 Hz syllable
  as 25 semitones off its plan.
- **Then it was reading the octave below.** A periodic signal correlates with
  itself just as well at twice its period, so the highest peak reports the
  octave about as often as the pitch: a syllable planned at 144.5 Hz came back
  11.99 semitones away, which is an octave to two decimal places. Fixed with the
  standard remedy — the shortest lag within 0.85 of the best peak.
- **One assertion in the gate was simply the wrong claim.** "A statement ends
  below where it started" failed on a correct contour, because the last readable
  syllable is the accented nucleus and is *supposed* to sit above the baseline.
  Declination is a trend and is now measured as one: a least-squares slope
  through the accented syllables, −1.51 st/s, against a flat control at 0.03.
- **The playground's first layout was unreadable.** Three lanes scattered in
  depth let perspective have them — the near lane came out twice the size of the
  far one and the strip ran off the frame, so three contours that are congruent
  in the data read as three unrelated shapes. Stacked in Y and viewed head on
  now.

### Changed

- `npm run prosody` joins `prepublishOnly` and CI alongside `forage`, `flow` and
  `voice`.
- `bench/formants.mjs` gained `pitchIn` and `trackPitch` — pitch estimation, so
  the gate can read a contour back out of samples rather than trusting the
  planner that produced it.

## [0.48.0] — 2026-08-04

### Added

- **Voice — an NPC that speaks, with no audio files, no network and no
  assets.** Speech is a SOURCE through a FILTER (Fant, 1960): the folds carry
  pitch, the tract carries the vowel, and they are independent — which is why
  you can sing "ah" on any note and why a whisper, which has no folds in it at
  all, stays intelligible. A tract is a tube closed at the glottis and open at
  the lips, so its resonances are `(2n−1)c/4L`. For 17.5 cm that is **490 /
  1470 / 2450 Hz** against a textbook neutral vowel of 500 / 1500 / 2500 — one
  length and the speed of sound, nothing fitted. `tubeFormants`, `VOWELS`,
  `formantsOf`, `voiceOf`, `tractLengthFor`, `renderFormants`, `renderVowel`,
  `renderVoice`. All pure: a `Float32Array`, no WebAudio and no browser.
- **The vowel chart IS the formant table.** F1 ranks against the IPA chart's own
  vertical axis at **ρ = 1.000** — not a correlation, an identity, because the
  ten vowels rank in exactly the same order on a phonetician's ear in 1888 and a
  spectrograph in 1952. F2 against backness+rounding is ρ = −0.976. ANIMA's
  viseme table reads the same two axes to draw a mouth and imports nothing. It
  has no BACKNESS, correctly: a tongue is not visible, and `/i/` and `/u/` are
  identical on every axis a mouth can show while sitting 1400 Hz apart in F2.
- **`npm run voice` — the gate, and it is out of sample.** Peterson & Barney
  published three rows in 1952; this library carries the men's. Every other
  voice is that row divided by one ratio of tract lengths, and the gate renders
  a woman and a child and checks them against P&B's OWN women's and children's
  rows, which build nothing here. Model error **5.0%** and **5.4%** — against a
  floor of **4.9%** and **4.3%**, which is the best any single ratio achieves on
  the same rows when it is allowed to see the answer. Two measured anatomical
  lengths, shown none of it, cost 0.1 and 1.1 points against a fitted one.
- **Playground `voice`.** Three vowel charts stacked, one per body, each pillar
  placed at `(−log F2, log F1)` — the IPA quadrilateral drawn by the 1952
  numbers alone. In log formant space a different body is a *translation*, so
  the three charts are congruent: same shape, three heights, one diagonal shift.
  Three orbs trace the same utterance through three bodies and never leave
  formation. Click to hear it.

### Fixed

- **The analyser was the bug, and the gate nearly widened its budget to hide
  it.** `npm run voice` reported F1 errors of 8 to 11% and was one commit from
  raising its tolerance to cover them. A voiced spectrum is a comb — a harmonic
  every F0 hertz — so peak-picking finds harmonics rather than formants, and the
  fix for that is cepstral liftering. But a whisper has **no comb to remove**,
  and liftering it anyway smooths the spectrum with a kernel about 125 Hz wide,
  twice a first formant's own bandwidth, which dragged every sharp F1 up the
  rising skirt of F2. Unliftered, the same renders come back within **4.1%**
  with errors of both signs instead of a one-way bias. The lifter is now applied
  to voiced spectra only.
- **A budget derived from the thing under test is not a budget.** The
  out-of-sample floor is fitted to the same vowel table it judges, so corrupting
  a published formant — /ɑ/'s F2 moved from 1090 to 1450 — moved the model and
  its budget together and the gate said nothing at all. Peterson & Barney's
  men's row is now carried a second time in the bench as an anchor from outside,
  and is labelled as the transcription check it is rather than dressed up as a
  claim about speech.
- **The model half of the gate reimplemented the scaling instead of calling
  it.** A `formantsOf` that ignored its tract argument entirely and returned a
  constant sailed through the whole out-of-sample section, because the gate was
  multiplying the table by a ratio itself and checking its own arithmetic. It
  now goes through the shipped function.
- **The `/ʊ/` residual was not widened away.** The children's worst miss outside
  `/ɔ/` sat at 15.4% against a hand-drawn 15% bar. Rather than move the bar, the
  budget was replaced with what the best possible single ratio achieves on the
  same data — and the residual turned out to be the population's rather than the
  model's: P&B's own vowel-by-vowel ratios scatter about 7% around their own
  mean, because a male larynx descends at puberty and a tract does not scale
  uniformly. `/ɔ/` scales men→women at 1.035 where a typical vowel runs 1.212,
  and the gate now asserts that it IS the outlier rather than excusing it.

### Changed

- `npm run voice` joins `prepublishOnly` and CI alongside `forage` and `flow`.
- The bench's analyser (FFT, Welch spectrum, cepstral envelope, prominence peak
  picking) moved to `bench/formants.mjs`, which knows nothing about vowels,
  tracts or Peterson & Barney — so the thing doing the measuring cannot be
  quietly taught the answer.

## [0.47.0] — 2026-08-04

### Added

- **`FlowField` — one flood, any number of agents, and the usual solver is
  8.24% wrong.** A flow field searches outward from the goal once and lets every
  agent read the local downhill direction, which is how any game with a crowd in
  it moves the crowd. The search is almost always Dijkstra over eight
  neighbours, costs 1 and √2 — which looks exact and is not, because the PATH is
  still made of eight directions. For a displacement at angle θ the grid
  distance is `cos θ + (√2 − 1) sin θ`, worst at `tan θ = √2 − 1`, which is
  EXACTLY 22.5°, where the ratio is `√(4 − 2√2) = 1.08239220…`. Measured on a
  real 121×121 field against a Euclidean distance the solver is never shown:
  8.239% at 22.5°, to three decimals, and zero on both the axes and the diagonal
  — the two directions a grid can represent exactly.
- **And it is a BIAS, not a resolution error.** Refined three times, the
  eight-way error does not move: 8.239%, 8.239%, 8.239%. Halve the cell and you
  get the same staircase twice as often, so a finer grid buys nothing at all.
  `FlowField` solves the eikonal equation `|∇φ| = cost` by fast marching instead
  (Sethian 1996) — the quadratic `(φ−a)² + (φ−b)² = (h·F)²`, which is Pythagoras
  rather than a staircase — and its error behaves like a discretisation error
  should: 3.670% → 2.567% → 1.664% as the cell quarters.
- **What an agent does with the difference.** Heading error against the true
  bearing on open ground: eight-way mean 10.59° and worst **21.00°**; eikonal
  mean 1.55° and worst **2.27°**. 21° off is a crowd that separates into lanes
  nothing in the level put there — visible in the playground example as the
  eight-way crowd collapsing into a diagonal line while the eikonal crowd keeps
  its shape.
- **`solver: 'grid8'` ships too**, on purpose: a number that is only ever right
  is a number nobody has checked against the alternative.
- **`npm run flow`, the flow gate**, wired into CI and prepublishOnly, plus the
  properties an agent's life depends on: every one of 140 agents reaches the
  goal through a gap in a wall, none ever walks uphill on the distance field, a
  wall cannot be walked through (the field says 96.79 against a floor of 96.57
  for the two-leg path), a sealed room stays unreachable rather than being given
  a made-up distance, and one flood settles every open cell exactly once.

### Fixed

- The exact near-field seed — the ring around a point goal given its true
  Euclidean distance, worth a third of the eikonal error — was being handed to
  the eight-way solver as well. That dropped its error to 7.79% and made it
  drift with resolution, which would have quietly sunk the one claim that
  matters. It is eikonal-only now: the comparison has to be against a faithful
  eight-way Dijkstra or it is not a comparison.

## [0.46.0] — 2026-08-04

### Added

- **Utility AI, and the utility has a unit.** A utility system scores actions
  with considerations mapped onto 0..1 by response curves, multiplies them, and
  picks the highest — which leaves a designer holding a curve per consideration,
  a weight per consideration, and a compensation factor to undo the fact that
  multiplying N numbers below 1 punishes an action for how many things you
  thought to check. None of those numbers means anything. They exist because the
  0..1 axis is invented: a curve's job is to map metres and hit points and
  seconds onto one scale so they can be added. So do not invent the scale. An
  action is worth something and it costs seconds, so `utility = value / seconds`
  — coins per second, metres per second — and rates compare. `rateOf`, `rank`
  and `choose`, with a ratio-scale check in the gate: counting in pennies
  instead of pounds, or minutes instead of seconds, cannot reorder anything. A
  zero-second action scores 0 and not Infinity, because a free action otherwise
  beats everything for ever.
- **`Forager` — when to stop is a theorem, not a threshold.** Charnov's marginal
  value theorem (1976): leave a depleting patch when its instantaneous rate of
  return has fallen to the average rate available in the environment as a whole.
  `optimalStay` solves `g′(t)(T + t) = g(t)` as a ROOT — deliberately not by
  searching the rate for its maximum, because a number found by sweeping cannot
  then be checked against a sweep. `Forager` runs the rule with the environment
  rate MEASURED off its own life rather than handed to it, which removes the
  last parameter.
- **`npm run forage`, the foraging gate.** It sweeps 6000 fixed leaving times,
  takes the best rate any of them achieves, and requires the forager — told none
  of it — to land on that number: 99.65% to 100.00% across six worlds, and it
  must not exceed it either, since a forager that beats an exhaustive search is
  measuring its own rate wrongly. It also checks both of Charnov's predictions
  (travel up → stay longer; environment richer → leave sooner, with the patch
  unchanged), and that a depletion threshold tuned optimally at one travel time
  loses more than 20% of the rate at another — 29.1% at travel 40, tuned at 2.
  If a fixed threshold were nearly as good, the release would be decoration.
- **`leaveWhen`, `marginalRate`, `longRunRate`, `bestRate`, `depletingPatch`**,
  and the playground example `forage`: two colonies, one running the theorem and
  one running the 54% threshold, on a walk the threshold was not tuned for.

## [0.45.0] — 2026-07-30

### Added

- **`RailController`** — the vehicle class that does not steer. Everything else
  in GAMA picks a direction and integrates it; a train's entire position is one
  number, so the controller's job is *"how fast, and can I still stop in
  time"*. It owns `distance` and moves nothing: placing the train is the game's
  job, which is what keeps it free of geometry.
- **The `RailLine` handshake** — `{ length, loop? }`, a shape rather than a
  package. SCENA's `createTrack` satisfies it, and so does a hand-rolled
  cumulative-length table; the new `railway` playground builds its own from a
  `CatmullRomCurve3` precisely to show GAMA is not reaching for SCENA.
- `schedule()` / `onArrive` / `onDepart` / `nextStop` / `dwellRemaining`,
  `emergencyStop()` / `resume()`, and `etaTo()` — which integrates the same
  stopping curve `step` drives, stops at every booked stop in between, adds
  their dwell, and adds whatever is left of the one the train is standing in.
- `railway` playground example and [docs/rail.md](docs/rail.md).
- **A `railDebug()` gate in `verify:playgrounds`**, plus a per-example settle
  time — see below for why both were needed.

### Fixed / learned

Four defects, three of which the tests as first written did not catch:

- **The arrival rule, not the brake law.** An earlier version arrived on
  `distance ≥ target && speed < 0.05` with the final step clamped, which is a
  train that reaches the platform and then **shivers in place for 2.4 seconds**
  at 10 Hz while its speed bleeds off against the clamp. Measured, then fixed
  by landing in one step. The `√(2·brake·remaining)` ceiling was written as the
  cure and then *measured against the bang-bang alternative in the same
  harness*: they land identically and the residual differs by less than half a
  metre per second either way. The claim in the module doc was corrected rather
  than kept — the ceiling is the closed form of the same rule, not an
  improvement on it.
- **A clamp that fabricated physics.** "Never move past the mark" brought a
  train at line speed to a stand in **10 m** while `stoppingDistance` reported
  302 — the one thing this module says a train must never do. A stop booked
  inside the braking distance now runs through and brakes to a stand beyond,
  reporting the overrun.
- **A tolerance that got worse the faster the frame rate.** Telling a real
  landing from a fabricated one was first done with a per-step distance
  tolerance. A smaller `dt` bought a *tighter* tolerance for a gap an earlier
  long frame had already opened. Found in the browser, not here: a train 0.39 m
  short at 1.11 m/s ran straight through HAVENBROOK, and because a loop line
  wraps the gap, the station became a lap away and the train accelerated off to
  go round again. Replaced with a question about the approach — *was this train
  ever able to stop for this mark?* — which mentions `dt` nowhere.
- **Two tests that passed for the wrong reason.** "Lands exactly" and "reports
  zero overrun" both passed because the arrival block was snapping the train
  *backwards* onto the mark. Every claim in this release was then re-checked by
  re-injecting the defect it describes; five such mutations are recorded in the
  test names.

And one about gates rather than code: `verify:playgrounds` reported **ok** for
a railway whose `distance` was `NaN` — the example passed `game.onUpdate`'s
`Time` where a number was wanted — because a static track renders perfectly
well. "Renders something" is not "works". The verifier now reads `railDebug()`
and fails the row on a non-finite distance, no arrivals, or an overrun at a
booked stop; the same probe would have caught the missed station too. Six
seconds is enough to judge a particle burst and not enough to judge a train, so
settle time is now a property of the example.

## [0.44.0] — 2026-07-30

### Added

- **Replay** — `Recorder`, `replay`, `TapeReader`, `parseReplay` (versioned,
  with migrations, like `Level` and `Dialogue`). A run is its seed plus its
  inputs — a few hundred bytes, because only ticks where the input *changed*
  are stored — and playing it back re-runs the simulation. That is a regression
  test made of real play, a ghost, a demo, and a spectator, all one mechanism.

- **`worldChecksum`** — the whole world folded into one unsigned 32-bit
  integer, so two runs can be compared per tick and the **first** tick they
  disagree on can be named. That tick is the bug; everything after it is
  consequence, which is why `replay` stops there instead of listing four
  hundred of them. `precision` for cross-machine comparison (and the honest
  warning that it then cannot see drift below the quantum), `deep` for state
  three.js knows nothing about.

- **`Rng`** — mulberry32, seeded, with the seed mixed before first use so that
  seeds 1, 2, 3 do not start with three near-identical values. GAMA had seeds
  everywhere — `Level` carries one, `Catalog` hands one to every factory — and
  no generator behind them.

### Fixed

- **`createFlock` could not be replayed at all.** It scattered its boids with
  `Math.random` and gave every one a `Wander` reading `Math.random` too, so the
  same tape built a different flock every run. It takes `seed` now. Half the
  fix is a trap and the tests say so: seeding the scatter alone leaves a flock
  reproducible for exactly **one tick**, because `Wander` advances its angle by
  a random step every tick — re-injecting the unseeded `Wander` alone fails
  exactly one test.

### Also

- A determinism test that was measuring nothing, recorded because it was more
  convincing than the bug. It stepped the world with `world.fixedUpdate(0.02)`;
  `World.fixedUpdate` takes a `Time`, not a number, and `MotionAgent`
  integrates in `update` — so it typechecked nowhere, ran fine under vitest,
  and moved nothing at all. Every assertion passed on a world that never
  changed. The suite now opens with a guard asserting the flock travels and
  nothing has gone to `NaN`.

## [0.43.0] — 2026-07-30

### Added

- **Dialogue** — a conversation as data. `Dialogue`, `defineDialogue`,
  `parseDialogue` (versioned, with migrations, like `Level`), and a JSON
  condition/effect vocabulary: `is`/`not`/`all`/`any`/`eq`/`ne`/`gte`/`lt` plus
  `{ pred: name }` resolved against predicates you register — the same seam
  `Catalog` uses for level kinds. Effects are `set`, `inc`, `emit`.

  The conditions are data rather than functions *so that they can be read*,
  which is what makes the next item possible.

- **`lintDialogue`** — the payoff. Dangling links, empty lines, unknown
  predicates and **variables read but never written or declared** are errors;
  unreachable nodes, strandable choice lists, unread variables and duplicated
  choice text are warnings. `counts.nodes !== counts.reachable` is a bug, which
  makes it a gate rather than a report.

- **Hidden vs locked choices.** A failing `if` hides a choice; add `locked` and
  it shows greyed. A hidden choice keeps a secret, a locked one teaches — both
  are wanted, and a system with only one forces authors to fake the other.

- **Mid-conversation save.** `toJSON()` is `{ at, vars, visited }`, straight
  into a `SaveSlot`. `restore` deliberately does not re-fire the entering
  effects — they ran before the save, and replaying them would double every
  `inc` on each load.

- **`counts`** — exact `{ lines, choices, events }`, so a conversation is
  testable as a walk. The playground example is verified in CI by *walking* it:
  click the option that asks his name, advance, assert the option is gone.

- A playground example — a bridge toll you can actually negotiate, with a live
  lint report — and [docs/dialogue.md](docs/dialogue.md).

### Notes

Two things found while building the demo, both documented rather than hidden.
Indices must resolve against the **presented** choice list, not the authored
array — the two differ the moment a condition filters anything, and a test pins
it. And the obvious "hidden option plus locked hint carrying the same
condition" idiom is a trap: when the condition passes, both rows appear and the
hint leads nowhere. One choice, locked, is the answer.

## [0.42.0] — 2026-07-30

### Added

- **`npm run bench:throughput`** — absolute milliseconds per frame against
  agent count, deliberately *not* a gate. A regression gate asks "did this get
  worse" and is blind to code that was always slow, because the baseline came
  from that same slow code. This asks how many you can actually have.

### Fixed

- **`SpatialGrid` was slower than brute force below ~1300 agents.** It keyed
  cells with `"x,y,z"` strings — a concatenation and a string hash per agent
  per rebuild, and per cell per query, so a query sweeping 27 cells built 27
  strings to do 27 lookups. At 400 agents, the size of the shipped flock
  example, the "fast" broadphase was 2× slower than comparing every agent to
  every other one. Coordinates now pack into one integer: 2.5× faster at every
  size, and the crossover moved to ~500 agents.

  | agents | plain array | grid before | grid after |
  |---|---|---|---|
  | 100 | 0.30 ms | 2.04 ms | 0.78 ms |
  | 500 | 5.05 ms | 10.98 ms | 4.52 ms |
  | 1000 | 25.67 ms | 23.45 ms | 8.83 ms |
  | 2000 | 91.89 ms | 50.18 ms | 19.78 ms |

  The exact counters are the proof this changed cost and not behaviour:
  `cellsVisited`, `tested` and `found` are byte-identical across the fix.

- **`createFlock` used the grid at its own default size.** The default is 100
  boids, which is the pessimal case — the template now uses a plain array
  below 500 agents and skips the per-frame rebuild entirely.

### Changed

- The docs said "for hundreds, use the spatial hash". They now publish the
  measured crossover and say an array is faster and simpler below ~500 agents.
  Better asymptotics are not the same thing as faster.

## [0.41.1] — 2026-07-30

### Added

- **CI** (`.github/workflows/ci.yml`): four jobs on every push and pull request
  — typecheck/tests/build/manifest, then netcode over real sockets, perf
  counters, and a browser job that verifies every playground example, drives
  the editor, plays the game, and checks the render budgets. Screenshots are
  uploaded as an artifact on every run, because on a failure they are the
  difference between "something is wrong" and seeing the black frame.
- **This changelog**, and it now ships in the npm tarball.
- `node bench/run.mjs --counters-only` — gate the exact counters, report the
  timings without failing on them. What CI uses, and why is in
  [docs/perf.md](docs/perf.md).

### Fixed

- The headless verification scripts only found Playwright at a hardcoded global
  path, so `verify:playgrounds`, `verify:editor`, `bench:render` and the game's
  verifier could not run on a fresh clone. `playwright` is a devDependency now;
  the global paths remain as a fallback.

## [0.41.0] — 2026-07-30

### Added

- **The perf gate.** Two committed baselines and two gates: `npm run bench`
  (11 cases in Node) and `npm run bench:render` (5 scenes in headless
  Chromium). `npm run perf` runs both. Times are stored as ratios to a
  calibration case so the baseline is portable; counters are exact and are the
  real gate. See [docs/perf.md](docs/perf.md).
- **`SpatialGrid.stats`** — `queries`, `cellsVisited`, `cellsOccupied`,
  `tested`, `found`, plus `cellCount` and `resetStats()`. Reset on each
  `rebuild()`, so reading them at the end of a frame describes that frame.
  `cellsVisited / queries` says whether `cellSize` is sane; `tested / found`
  says how selective the cells are.

### Fixed

- **The netcode's input buffer was steered up to from empty, never primed.**
  The send-rate steering has ±15% authority on purpose — its job is clock
  drift, not cold-starting — so filling an empty buffer took about a second,
  and for that whole second one late input made the server run dry, repeat the
  last input, and cost the client a correction. It surfaced as `net:check`
  failing roughly one run in eight with one misprediction on *both* clients at
  the same instant. `NetClient` now seeds its accumulator at welcome so the
  first batch of inputs goes out `bufferTarget` deep.
- **The perf gate's own normalisation was adding noise.** Keeping the smallest
  per-sample `case ÷ calibration` selects the sample whose *denominator* was
  worst. On unchanged code the case's own time was stable to 4% while
  min-of-ratios swung 31%. Now `min(case) ÷ min(calibration)`.

### Notes

The gate was validated by injecting deliberate regressions and watching it
fail — and the first one **got through**, because the broadphase counter
measured neighbours *found* rather than cells *scanned*. That is why
`SpatialGrid.stats` exists.

## [0.40.0] — 2026-07-30

### Added

- **`gama3d/net`** — an authoritative server (`NetServer`), a predicting
  client (`NetClient`), and the three mechanisms that make a networked game
  playable: client-side prediction, reconciliation by replaying unacknowledged
  inputs, and entity interpolation behind server time.
- Transports as a four-member interface: `WebSocketTransport`, a **simulated**
  `Link`/`LoopbackTransport` with latency, jitter, seeded packet loss and no
  timers anywhere, and `BroadcastChannelTransport` for two tabs with no server.
- Per-client delta snapshots, one input applied per tick per client, brief
  repeat of a missing input, and send-rate steering against the queue depth the
  server reports.
- A reference server (`scripts/net-server.mjs`, hand-rolled WebSocket, no
  dependencies) and `npm run net:check`, which drives two real clients over
  real sockets.

### Notes

Six bugs found by measurement, all documented in [docs/net.md](docs/net.md) —
including a dropped handshake that left a client sending exactly one packet
forever, and an ack processed only when the client's own entity appeared in a
delta, so a player standing still accumulated 24 unacknowledged inputs.

## [0.39.0] — 2026-07-30

### Added

- **The asset pipeline.** `scripts/assets.mjs` generates a manifest (keys,
  byte sizes, groups, content hashes) with `--check`, `--types`, `--budget`
  and `--strict`; `AssetLibrary` loads it with byte-weighted progress,
  deduplicated and reference-counted loads, shared instances, and
  `release(group)`.
- `library.factory(key)` so a level file can place a loaded model, with a
  deliberately no-op `dispose` — the clone's geometry belongs to the library.

### Fixed

- Base paths stacked: `openAssets('./assets/manifest.json')` plus a manifest
  `base: './assets/'` produced `./assets/./assets/crate.gltf`. Precedence is
  now caller → manifest → the manifest's own directory.

## [0.38.1] / [0.38.2] — 2026-07-29

Packaging iterations of the same work: building Havenbrook's own editor on top
of `gama3d/editor`, which is what turned up the leak below.

### Fixed

- The editor's `gizmos.clear()` detached its BoxHelpers without disposing
  them. Found only because the leak harness was fixed first: it had been
  measuring the *camera*, since the renderer registers geometries it draws and
  a baseline taken while half the scene was culled makes the first rebuild look
  like a leak.

## [0.38.0] — 2026-07-29

### Added

- **`gama3d/editor`** — `mountEditor(options)` returns an `EditorSession`:
  viewport, palette, inspector, history, storage and chrome, over *your* own
  catalog. The whole tool in one call.
- **Resource release** — `claimsOwnership(source)`, `releaseObject`,
  `releaseMaterial`. The ownership contract: if a factory's return has its own
  `dispose()`, that is called and nothing else is touched; otherwise the
  subtree is traversed and freed. Used by `Level` release and by
  `AssetLibrary.factory()`.
- `docs/workflow.md` — the catalog seam: how GAMA, SCENA and ANIMA compose into
  one game without importing each other.

## [0.37.0] — 2026-07-29

### Added

- **`Editor`** — selection (`select`/`selectAll`/`selectNext`/`pick`),
  transforms (`move`/`rotate`/`scaleBy`/`ground`), structure
  (`place`/`duplicate`/`remove`/`setProps`/`setTags`), and an undo stack that
  merges a drag into one step.
- `Catalog` kind metadata: `label`, `group`, `fields` and `info(kind)`, so a
  palette and an inspector can be generated rather than hand-written.
- `LevelInstance` slots: `specs`, `add(spec, index?)`, `remove(id)`,
  `indexOf(id)`.

### Fixed

- Multi-delete undo restored entities one slot early — indices were read inside
  the removal loop, against a list the previous delete had already shortened.
- `pick` raycast ran against a stale `matrixWorld`, because nothing computes one
  between renders.
- `Catalog.list()` returned kinds alphabetically, so palettes read
  Markers/Dressing/Light before Buildings. Definition order now.

## [0.36.0] — 2026-07-29

### Added

- **Levels**: a `Catalog` of named kinds, prefabs as recipes rather than blobs,
  a JSON format that stores *placements* not geometry, derived seeds, preserved
  unknown kinds, and migrations. `instantiate` / `toJSON` round trip.

## [0.35.0] — 2026-07-29

### Added

- **`Shell`** — the part of a game that is not the game: menu, settings,
  pause, results, save, mobile input.
- Two project templates.

## [0.34.0] — 2026-07-28

### Added

- **Air combat**: `Missiles` (lead pursuit under a hard turn-rate limit with
  speed bleed, so evadability is physics rather than a difficulty slider;
  seeded one-chance flare seduction; pooled instanced) and `LockOn`
  (cone/range/time, no credit for past devotion).

## [0.33.0] — 2026-07-28

Never published; folded into `0.34.0` on npm.

### Added

- **Hover**: `HoverController` (collective/cyclic/pedals, rotor spool inertia,
  seeded hover breath, sink-rate touchdowns, `helicopterInput` bridge) and
  `rotorVoicing`/`RotorSound` — the wop-wop is amplitude, not pitch.

## [0.32.0] — 2026-07-28

### Added

- **Flight**: `FlightController` — throttle→speed→lift, bank-to-turn, stall as
  a state, taxi/rotate/flare/touchdown with sink-rate events, plus `apply()`
  and `aircraftInput` bridges.

## [0.31.0] — 2026-07-28

### Added

- **Light as gameplay**: `Illumination` (a field of structural sources with
  live litness, pure math), `Flashlight` (battery drama, seeded gutter, cone
  reveal with angular slack), `MoodGrade` (structural rig targets, seamless
  interrupted blends).

## [0.30.0] — 2026-07-28

### Added

- **`PlatformerController`** — sub-stepped gravity, walls and ceilings, coyote
  time, jump buffering, variable jump height, moving-platform carry — and the
  coin-run example that justifies each one.

## [0.29.0] — 2026-07-28

### Added

- **Retention**: `GameFlow` (a legal-move state machine, `gate()` as the
  pause), `Objectives` (clamped progress, once-only completion), `SaveSlot`
  (versioned envelope, corruption-safe, null-means-null), and
  `GhostRecorder`/`GhostTape`/`Ghost` — fixed-interval tapes with seam-safe yaw
  playback, so you can race yesterday's you.

## [0.28.0] — 2026-07-28

### Added

- **Opposition**: `Harass` steering (ring + band + seeded strafe) and
  `WaveDirector` (trickle spawns, rest beats, escalation under a ceiling,
  rubber-band pressure).

## [0.27.0] — 2026-07-28

### Added

- **Stakes**: `Health` (i-frames, death as a one-shot edge, revive with a mercy
  window, computed knockback) and `Projectiles` (pooled tracers, structural
  targets, team filtering).

## [0.26.0] — 2026-07-28

### Added

- **The pickup loop**: `Collector` (structural pickups and fields, respawn
  scheduling) and `CheckpointRun` (ordered gates, laps, `setState` painting).

## [0.25.0] — 2026-07-28

### Added

- **`GameFeel`** — trauma-squared screen shake, hit-stop, slow-motion with
  ease-back, haptic rumble.
- **`Hud`** — a DOM overlay: score, timer, hearts, banner, objective, prompt,
  a `Soundboard` caption line, and a canvas radar.

## [0.24.0] — 2026-07-28

### Added

- **Procedural audio** (`Soundboard`): sample-free synthesized SFX from a seed,
  engine/weather/crowd beds, continuous sources, buses and ducking, captions,
  and offline-render verification.

### Changed

- three.js pinned to r185 for development, with the site's vendor bundle split
  fixed to match.

## [0.23.0] — 2026-07-27

### Added

- Seven cricket strokes, and a bat that has to be there for any of them to
  mean anything.

## [0.22.0] — 2026-07-27

### Added

- **`CricketMatch`** — a match as rules and a ball: ball flight, a timing
  window, laws-accurate scoring.

## [0.21.0] — 2026-07-25

### Added

- **`Recipe`** — what to do next.

## [0.20.0] — 2026-07-25

### Added

- **`Automation`** — devices wired to each other.

## [0.19.0] — 2026-07-25

### Added

- **`Queue`** — who is next.

## [0.18.0] — 2026-07-25

### Added

- **`Attention`** — the first thing in the world that interrupts you.

## [0.17.0] — 2026-07-25

### Added

- **`Device`** — powered things take time to become powered.

## [0.16.0] — 2026-07-24

### Added

- **`RideController`** — a horse is not a car.

### Fixed

- The site's vendor bundles are stamped with a build digest, so the playground
  stops serving stale code from cache. An import map has nowhere to put a
  content hash, so the digest hangs off the import-map URLs.

## [0.15.0] — 2026-07-24

### Added

- **`Occupancy`** — who sits where, and the manners of choosing.

## [0.14.0] — 2026-07-24

### Added

- **`Stockpile`** — a resource counter, the produce-something payoff.

## [0.13.0] — 2026-07-24

### Added

- **`throwObject`** — the ballistic release half of the carry verb.

## [0.12.0] — 2026-07-24

### Added

- **Mechanisms & interaction** — the "operate and the world responds" verb.

## [0.11.0] — 2026-07-24

### Added

- **`createRace`** — the whole racer packaged: assembly, rival collision,
  finish and standings.

## [0.10.0] — 2026-07-24

### Added

- **The motion pillar**: touch controls, `VehicleController`, `driveVehicle`,
  `ChaseCamera`, collision pushback, `Circuit`, and a racing template.

## [0.9.0] — 2026-07-21

### Added

- **`gama3d/templates`** — third-person and top-down players, guard/companion/
  flock NPC archetypes, and `Locomotion` animation glue.
- npm publish metadata: repository, homepage, `sideEffects`,
  `prepublishOnly`.

### Changed

- **The npm package is `gama3d`**, not `gama` — the short name was taken on the
  registry. Imports change accordingly.

## [0.8.0] — 2026-07-20

### Added

- The documentation site with a live, editable playground (`npm run site:dev`),
  and `npm run site:publish` to deploy it to the `docs` branch.

## [0.7.0] — 2026-07-20

### Added

- **`gama3d/react`** — react-three-fiber bindings: an Entity/GameObject bridge,
  component hooks, and a flock grid.

## [0.6.0] — 2026-07-20

### Added

- Orbit and shoulder camera rigs (drag-orbit, pointer-lock mouse look, occlusion
  handling).
- `generateNavMesh` — navmesh generation from level geometry, with grid
  sampling and slope/step/radius rules.

## [0.5.0] — 2026-07-20

### Added

- **Behavior trees** — reactive composites, decorators, typed contexts, and a
  `BehaviorTree` component.

## [0.4.0] — 2026-07-20

### Added

- **`gama3d/rapier`** — an optional physics adapter: rigid bodies and a physics
  character controller, behind its own entry point so it costs nothing unused.

## [0.3.0] — 2026-07-20

### Added

- **Navmesh pathfinding** — `NavMesh` (A* plus funnel smoothing) and
  `NavMeshAgent.goTo(point)`.

## [0.2.0] — 2026-07-20

### Added

- `SpatialGrid` for `Separation`/`Alignment`/`Cohesion` neighbour queries at
  scale, `ObstacleAvoidance` and `Containment` steering, gamepad and
  named-action input mapping, an audio manager, a debug overlay, object
  pooling, collision enter/exit events, and a fixed-timestep option.

## [0.1.0] — 2026-07-20

### Added

- GAMA: a game loop, entities and components, motion agents and steering
  behaviours, on top of three.js.
