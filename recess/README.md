# RECESS

Three childhood games with the stakes moved. A small 3D game for the browser,
built on **gama3d**, **scena3d** and **anima3d** — the hall, the people and the
rules are all generated in code. There is not one asset file in the build.

```
npm install
npm run dev        # play it
npm run build      # typecheck + bundle
npm run verify     # PLAY it, headless, and fail if a round cannot be finished
```

## The idea

Nothing here is a difficulty curve tuned by feel. Each round is built on a
measurement somebody published, and the game is what happens when you have to
live inside it.

### Round one — Green Light

Run on green. Stop before it finishes turning. The only rule that matters is
that **stopping is not free**: a signal has to be noticed, and then a body with
momentum in it has to come to rest.

Donders measured simple reaction time in 1868 and got about 180 ms. It is still
about 180 ms, and ANIMA ships it as `SIMPLE_REACTION`; deciding *which* signal
arrived roughly doubles it (`CHOICE_REACTION`), and `reactionTime(skill)`
interpolates. Every rival on the field is drawn a skill and a nerve, and whether
they die is arithmetic:

```
brake from top speed to under the motion threshold   0.45 – 0.65 s
+ reaction                                           0.18 – 0.35 s
vs the deadline, 0.75 through a 1.05 s turn          0.79 s
```

Speed is a choice for you too — `RUN_SPEED` is a ceiling you accelerate toward,
not a switch — so the faster you were going the longer you need, and greed is
expensive in seconds you can count.

### Round two — Panes

Two panes at every step, one tempered, one not. They are the same geometry with
the **same material instance**, so there is no tint or seam to read the answer
off. The round is honestly a coin.

Which makes the real mechanic **information**, and the price of information is
somebody else. The contestants ahead of you are scouts who do not know they are
scouts, and every one that falls buys you a row.

### Round three — Marbles

They tell you what they are holding. Sometimes they are lying.

**The tell is not shifty eyes.** Everyone knows liars avoid your gaze; DePaulo
et al.'s 2003 meta-analysis of some hundred and fifty cues found gaze aversion
essentially unrelated to deception. A game built on that is a game built on
folklore.

What holds up is duller and more useful: lying is *work*. Hess & Polt (1964) and
Kahneman & Beatty (1966) measured mental effort by watching pupils, and it is
worth about **half a millimetre**.

And half a millimetre is nothing next to the light. Moon & Spencer (1944) has
the pupil covering **five and a half** across eight decades of luminance —
eleven to one, which is why every pupillometry protocol ever published fixes the
luminance before it measures anything. So the round hands you a lamp:

```
lamp swinging   the reflex swamps the tell. You are reading noise.
lamp held       the reflex settles, and half a millimetre is visible.
```

Three holds, five hands. You cannot afford to read them every time.

`npm run verify` measures both halves of that claim off the running build:

```
under a swinging lamp the pupil wanders 2.50 mm against a 0.50 mm tell
held-lamp reads: 2/2 correct
```

## The gate

`npm run verify` does not check that a canvas appeared. It **plays the game** —
all three rounds, on the keyboard, reading the same numbers a player reads off
the HUD — and fails if any round cannot be finished or if the scene throws.

It exists because a verifier that only asks "did something render" passes a game
whose first round is mathematically unwinnable, which is exactly what the first
version of Green Light was: the braking distance alone exceeded the deadline, so
a bot with *zero* reaction time released on the exact frame the turn began and
was still caught. Fourteen of fifteen contestants died on the first turn and it
read as difficulty.

Round two is an honest coin twelve times over, so a bot that guesses reaches
round three about once in four thousand runs. `?probe=1` opens the answer key to
the play-through and to nothing else — without it the round nobody can verify
would be the one the whole game is built around.

## Credits

Inspired by the survival-game genre. The rounds themselves are folk playground
games — red light/green light, stepping stones, odds-and-evens — and every
character, prop, sound and material here is generated procedurally at runtime.
