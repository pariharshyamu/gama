#!/usr/bin/env node
/**
 * The TTS gate — what a browser-less machine can honestly check about a bridge
 * to a browser.
 *
 *   npm run tts            fail if the mouth stops following the words
 *   npm run tts -- --json  the numbers, machine-readable
 *
 * BE CLEAR ABOUT THE SCOPE, because it is easy to overclaim here. Nothing in
 * this file listens to a platform voice. There is no `speechSynthesis` in Node
 * and headless Chromium ships without voices, so whether Edge's Aria says
 * "Havenbrook" nicely is not checkable here and is not claimed.
 *
 * What IS checkable is the only part this library wrote: `anchorTrack`, the
 * piecewise-linear warp that drags a planned viseme track onto the word
 * boundaries a platform reports. That is arithmetic, it is pure, and it has
 * three properties that can each be made to fail.
 *
 *   1. IDENTITY. A platform that speaks at exactly the planned rate carries no
 *      information the plan does not already have, and the warp must return the
 *      plan unchanged. A warp that moves a track it has no reason to move is
 *      adding noise and would look like an improvement on every other test.
 *   2. MONOTONIC. A mouth cannot run backwards. Platforms coalesce boundaries,
 *      report them out of order across punctuation, and occasionally emit two
 *      in the same millisecond.
 *   3. IT BEATS THE ALTERNATIVE. The thing you would do without word marks is
 *      scale the whole plan by `actual / planned`. That is the CONTROL and it
 *      has to lose, or reading the boundaries is not worth the code.
 *
 * The ground truth for 3 is a simulated speaker, and a simulator is not a
 * browser — this measures the warp, not the world. What makes it more than
 * self-congratulation is that the control is scored by the same simulator, so
 * anything the simulation gets wrong is wrong for both.
 */
import { anchorTrack, planLine, mouthFrom, pitchFrom, utteranceVoice, voiceOf } from '../dist/index.js';

const json = process.argv.includes('--json');
const failures = [];
const fail = (l) => failures.push(l);
const VOICE = voiceOf({ height: 1.75 });

const LINES = [
  'hello there my name is anna and i am nine',
  'the quick brown fox jumps over the lazy dog',
  'seven bright ships sailed past the old stone pier',
  'many men are coming home in the morning',
  'take the north road and do not stop until you see the river',
];

/**
 * A speaker that does NOT agree with the plan, and does not agree WITHIN a word
 * either.
 *
 * The first version of this stretched each word by one constant. That is a
 * piecewise-constant rate change, and a warp anchored at word starts inverts it
 * EXACTLY — the gate printed 0 ms and would have printed 0 ms for a warp with a
 * sign error in the middle segment. A simulator whose deformation the thing
 * under test can perfectly undo is not a test, it is a restatement.
 *
 * So the rate also wanders WITHIN each word, which is what real engines do:
 * a stressed syllable runs long, an unstressed one is swallowed, and no engine
 * distributes a word's duration the way Klatt's rules do. The warp only sees
 * word boundaries, so that part is information it does not have, and what it
 * scores is how much of the error the boundaries remove — which is the actual
 * question.
 *
 * Seeded, because a gate that fails one run in ten is a gate people re-run.
 */
function simulate(plan, seed) {
  let s = seed >>> 0;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const truth = [];
  const marks = [];
  let t = 0;
  for (let i = 0; i < plan.words.length; i++) {
    const span = plan.words[i];
    const planned = span.to - span.from;
    // Long words drawn out, short ones rushed: a uniform rate change is what
    // the control already handles, so the deformation has to be non-uniform.
    const stretch = (planned > 0.25 ? 1.35 : 0.7) * (0.85 + 0.3 * rand());
    marks.push({ word: i, at: t });
    // ...and the word's own duration redistributed across its phones, which is
    // the part NO word boundary can tell you about.
    const widths = [];
    let sum = 0;
    for (let c = span.firstCue; c < span.lastCue; c++) {
      const w = (plan.cues[c].to - plan.cues[c].from) * (0.55 + 0.9 * rand());
      widths.push(w);
      sum += w;
    }
    const k = sum > 0 ? (planned * stretch) / sum : 1;
    let at = t;
    for (let j = 0; j < widths.length; j++) {
      const w = widths[j] * k;
      truth.push({ phone: plan.cues[span.firstCue + j].phone, from: at, to: at + w });
      at += w;
    }
    t += planned * stretch;
  }
  return { truth, marks, seconds: t };
}

/** Mean absolute error between two tracks' cue starts, in milliseconds. */
function drift(a, truth) {
  let sum = 0;
  const n = Math.min(a.length, truth.length);
  for (let i = 0; i < n; i++) sum += Math.abs(a[i].from - truth[i].from);
  return (sum / Math.max(1, n)) * 1000;
}

/** The control: no word marks, just the total duration. */
function globalScale(cues, seconds) {
  const planned = cues.length ? cues[cues.length - 1].to : 0;
  const k = planned > 0 ? seconds / planned : 1;
  return cues.map((c) => ({ ...c, from: c.from * k, to: c.to * k }));
}

// ------------------------------------------------ 1. IT REDUCES TO IDENTITY

let identity = { worst: 0 };
for (const text of LINES) {
  const plan = planLine(text, VOICE);
  // A speaker that agrees exactly: every word starts where the plan says.
  const marks = plan.words.map((w, i) => ({ word: i, at: w.from }));
  const got = anchorTrack(plan.cues, plan.words, marks, plan.seconds);
  for (let i = 0; i < plan.cues.length; i++) {
    identity.worst = Math.max(identity.worst, Math.abs(got[i].from - plan.cues[i].from));
    identity.worst = Math.max(identity.worst, Math.abs(got[i].to - plan.cues[i].to));
  }
}
if (!(identity.worst < 1e-9)) {
  fail(`a platform speaking at exactly the planned rate moved the track by ${(identity.worst * 1000).toFixed(3)} ms — the warp is inventing timing it was not given`);
}

// ------------------------------------------------------------ 2. MONOTONIC

let monotonic = { cases: 0, worst: 0 };
{
  const plan = planLine(LINES[0], VOICE);
  const nasty = [
    { name: 'in order', marks: plan.words.map((w, i) => ({ word: i, at: w.from * 1.4 })) },
    { name: 'out of order', marks: [{ word: 3, at: 0.5 }, { word: 1, at: 0.2 }, { word: 5, at: 0.9 }] },
    { name: 'coalesced at one instant', marks: plan.words.map((_, i) => ({ word: i, at: 0.3 })) },
    { name: 'all at zero', marks: plan.words.map((_, i) => ({ word: i, at: 0 })) },
    { name: 'non-finite', marks: [{ word: 1, at: NaN }, { word: 2, at: Infinity }, { word: 3, at: 0.4 }] },
    { name: 'past the end', marks: [{ word: 99, at: 0.4 }, { word: 2, at: 0.5 }] },
    { name: 'none at all', marks: [] },
    { name: 'end before the last mark', marks: [{ word: 4, at: 1.0 }], end: 0.2 },
    // THE ONE THAT ACTUALLY BREAKS IT. Without the strictly-increasing guard in
    // `anchorTrack` every other case here still comes out monotonic, so this
    // whole section passed a build with the guard deleted. A knot pair whose
    // OBSERVED times run backwards inverts a segment of the warp and drags the
    // mouth 295 ms into the past. Platforms report boundaries late and out of
    // order across punctuation, so this is not a hypothetical.
    { name: 'observed times run backwards', marks: [{ word: 2, at: 0.9 }, { word: 5, at: 0.1 }] },
    { name: 'the same word marked twice', marks: [{ word: 3, at: 0.2 }, { word: 3, at: 0.9 }] },
  ];
  for (const c of nasty) {
    const got = anchorTrack(plan.cues, plan.words, c.marks, c.end);
    monotonic.cases++;
    let last = -Infinity;
    for (const cue of got) {
      if (!Number.isFinite(cue.from) || !Number.isFinite(cue.to)) {
        fail(`"${c.name}" produced a non-finite cue time`);
        break;
      }
      if (cue.to < cue.from) {
        fail(`"${c.name}" produced a cue ending ${((cue.from - cue.to) * 1000).toFixed(1)} ms before it starts`);
        break;
      }
      if (cue.from < last - 1e-9) {
        monotonic.worst = Math.max(monotonic.worst, last - cue.from);
        fail(`"${c.name}" produced a track that runs backwards by ${((last - cue.from) * 1000).toFixed(1)} ms — a mouth cannot do that`);
        break;
      }
      last = cue.from;
    }
    // And the mouth must be readable at any time without throwing.
    for (let t = -0.5; t < 5; t += 0.05) {
      const m = mouthFrom(got, t);
      for (const k of ['open', 'round', 'close', 'spread']) {
        if (!Number.isFinite(m[k]) || m[k] < 0 || m[k] > 1) {
          fail(`"${c.name}" gave a mouth with ${k} = ${m[k]} at ${t.toFixed(2)}s`);
          t = 99;
          break;
        }
      }
    }
  }
}

// ----------------------------------- 3. AND IT BEATS THE ALTERNATIVE

const scores = [];
for (let i = 0; i < LINES.length; i++) {
  const plan = planLine(LINES[i], VOICE);
  const sim = simulate(plan, 1000 + i * 7);
  const anchored = anchorTrack(plan.cues, plan.words, sim.marks, sim.seconds);
  const control = globalScale(plan.cues, sim.seconds);
  scores.push({
    text: LINES[i],
    anchored: drift(anchored, sim.truth),
    control: drift(control, sim.truth),
    words: plan.words.length,
  });
}
const meanAnchored = scores.reduce((a, s) => a + s.anchored, 0) / scores.length;
const meanControl = scores.reduce((a, s) => a + s.control, 0) / scores.length;
if (!(meanAnchored < meanControl)) {
  fail(`anchoring on word boundaries drifts ${meanAnchored.toFixed(0)} ms against ${meanControl.toFixed(0)} ms for a plain global rate — reading the boundaries is not earning its keep`);
}
// AND BY ENOUGH TO MATTER. Below about 40 ms a viseme error is not visible:
// that is roughly one frame at 24 fps, and it is the tolerance the lip-sync
// gate in ANIMA already uses. A win that lands inside it is not a win.
if (!(meanAnchored < 40)) {
  fail(`anchored visemes drift ${meanAnchored.toFixed(0)} ms from the words, past the ~40 ms where a mouth starts looking dubbed`);
}

// ---------------------------------------- 4. and the voice mapping is a RATIO

let pitches = {};
{
  // `utterance.pitch` is a dimensionless multiplier the platform never defines
  // in hertz, so the only defensible mapping is a ratio against this library's
  // own reference speaker — which makes a tall NPC lower than a short one by
  // the same factor whichever thing is speaking. That is the property a crowd
  // needs; the absolute pitch is the platform's and is not ours to claim.
  const tall = utteranceVoice(voiceOf({ height: 1.95 }));
  const mid = utteranceVoice(voiceOf({ height: 1.75 }));
  const small = utteranceVoice(voiceOf({ height: 1.2 }));
  pitches = { tall: tall.pitch, mid: mid.pitch, small: small.pitch };
  if (!(tall.pitch < mid.pitch && mid.pitch < small.pitch)) {
    fail(`pitch does not fall with height: ${tall.pitch.toFixed(2)} / ${mid.pitch.toFixed(2)} / ${small.pitch.toFixed(2)} for 1.95 m, 1.75 m, 1.2 m`);
  }
  // AND IT IS A RATIO, WHICH ORDERING ALONE DOES NOT CHECK. Mapping f0 onto a
  // DIFFERENCE instead — `1 + (f0 − reference)/400` — also falls with height and
  // also lands inside 0..2, so it passed the line above and this section was a
  // decoration. What separates the two is that a ratio is preserved: two NPCs an
  // octave apart in `voiceOf` must be an octave apart in `utterance.pitch`, or a
  // crowd's spread changes with whatever the platform's neutral happens to be.
  for (const [a, b] of [[1.95, 1.2], [1.75, 1.2], [1.95, 1.75]]) {
    const va = voiceOf({ height: a });
    const vb = voiceOf({ height: b });
    const got = utteranceVoice(va).pitch / utteranceVoice(vb).pitch;
    const want = va.f0 / vb.f0;
    if (!(Math.abs(got / want - 1) < 1e-9)) {
      fail(`${a} m against ${b} m is ${got.toFixed(3)}× in utterance.pitch where their f0 ratio is ${want.toFixed(3)}× — the mapping is not a ratio, so a crowd's spread depends on the platform's neutral`);
    }
  }
  for (const [k, v] of Object.entries(pitches)) {
    if (!(v >= 0 && v <= 2)) fail(`${k} maps to utterance.pitch ${v}, outside the spec's 0..2`);
  }
}

// ------------------- 5. AND THE PITCH RIDES THE SAME WARP AS THE MOUTH

/**
 * A brow raise is punctuation before it is emotion — Ekman (1979), and Cavé et
 * al. (1996) put about seven in ten of them on a rise in F0. So a face wants the
 * contour as well as the visemes, and it wants them to have been moved by the
 * same word boundary: an accent that lands where the mouth is not is worse than
 * no accent at all.
 *
 * Two claims, and the second is the one that could be false.
 */
let pitchTrack = {};
{
  const statement = planLine('the traveller stopped at the gate.', VOICE);
  const question = planLine('did the traveller stop at the gate?', VOICE);
  const long = planLine('the keeper walked the north road and counted every stone along the river.', VOICE);

  // (a) THE CONTOUR HAS SOMETHING IN IT. A flat track gives a face nothing to
  //     do, and this is exactly the failure a prosody model can have while every
  //     other number in it looks right.
  const span = (p) => {
    const ps = p.cues.map((c) => c.pitch);
    return Math.max(...ps) - Math.min(...ps);
  };
  if (!(span(statement) > 3)) {
    fail(`a statement's contour spans only ${span(statement).toFixed(1)} semitones — a face driven off this has nothing to punctuate`);
  }
  // ...and a QUESTION ends higher than a statement, which nobody put in the cue
  // track: it comes from the intonation the prosody model chose off a '?'.
  const endsAt = (p) => p.cues[p.cues.length - 1].pitch;
  if (!(endsAt(question) > endsAt(statement) + 2)) {
    fail(`a question ends at ${endsAt(question).toFixed(1)} semitones against a statement's ${endsAt(statement).toFixed(1)} — the terminal rise is not reaching the cue track`);
  }
  // ...and a long statement DECLINES, which is what makes a running baseline
  // necessary on the far side of the seam rather than optional.
  const half = long.cues.length >> 1;
  const meanOf = (a) => a.reduce((x, y) => x + y.pitch, 0) / Math.max(1, a.length);
  const decline = meanOf(long.cues.slice(0, half)) - meanOf(long.cues.slice(half));

  // (b) AND IT IS SPEAKER-INDEPENDENT, WHICH IS THE UNIT. Semitones relative to
  //     whoever is talking, so a 1.2 m NPC and a 1.95 m one hand a face the same
  //     contour for the same sentence and their brows do the same thing.
  //
  //     Nothing else here pins the unit. Returning raw HERTZ passes every other
  //     check in this section — a statement still spans plenty of them, a
  //     question still ends higher — and it would make brow height a function of
  //     how big the larynx is. Two speakers a fifth apart is the check.
  {
    const small = planLine('the traveller stopped at the gate.', voiceOf({ height: 1.2 }));
    const tall = planLine('the traveller stopped at the gate.', voiceOf({ height: 1.95 }));
    let worst = 0;
    for (let i = 0; i < Math.min(small.cues.length, tall.cues.length); i++) {
      worst = Math.max(worst, Math.abs(small.cues[i].pitch - tall.cues[i].pitch));
    }
    if (!(worst < 0.01)) {
      fail(`a 1.2 m speaker and a 1.95 m one differ by ${worst.toFixed(2)} on the same sentence — the contour is not in semitones relative to the speaker, so a face would raise its brows by how big the larynx is`);
    }
    pitchTrack.speakerSpread = worst;
  }

  // (c) AND IT MOVES WITH THE WORDS — a regression guard, not a claim. The pitch
  //     is a FIELD ON THE CUE the warp moves, so it cannot be left behind
  //     without someone deliberately splitting the two tracks apart. That is the
  //     design working; deleting the warp entirely does not fail this line, and
  //     it is here so a future split has something to break.
  const marks = statement.words.map((w, i) => ({ word: i, at: w.from * 1.6 }));
  const warped = anchorTrack(statement.cues, statement.words, marks, statement.seconds * 1.6);
  const peakOf = (track) => {
    let best = { pitch: -Infinity, from: 0 };
    for (const c of track) if (c.pitch > best.pitch) best = c;
    return best.from;
  };
  const before = peakOf(statement.cues);
  const after = peakOf(warped);
  if (!(Math.abs(after / Math.max(1e-9, before) - 1.6) < 0.05)) {
    fail(`the loudest accent sat at ${before.toFixed(2)}s and after a 1.6x warp sits at ${after.toFixed(2)}s — the pitch is not riding the same anchor as the visemes`);
  }
  // And it is silent outside the line, which is what lets a face hold its
  // declination line through a pause instead of resetting to the floor.
  if (!(pitchFrom(warped, -1) === 0 && pitchFrom(warped, 1e3) === 0)) {
    fail('the contour is not zero outside the line, so a face cannot tell speech from silence');
  }
  pitchTrack = {
    statementSpan: span(statement),
    questionEnd: endsAt(question),
    statementEnd: endsAt(statement),
    decline,
    peakBefore: before,
    peakAfter: after,
  };
}

// ------------------------------------------------------------------- report

if (json) {
  console.log(JSON.stringify({ failures, identity, monotonic, scores, meanAnchored, meanControl, pitches, pitchTrack }, null, 2));
} else {
  console.log('tts — the platform speaks, and this library still owns the mouth\n');
  console.log('  NOTHING HERE LISTENS TO A VOICE. There is no speechSynthesis in Node and');
  console.log('  headless Chromium ships without voices, so how a platform voice SOUNDS is');
  console.log('  not checked and is not claimed. What is checked is the warp — the only');
  console.log('  part of this bridge that is ours.\n');

  console.log('  1. IT REDUCES TO THE IDENTITY');
  console.log(`  A platform speaking at exactly the planned rate moves the track by`);
  console.log(`  ${(identity.worst * 1e6).toFixed(1)} nanoseconds. A warp that changes a track it has no`);
  console.log('  information to change would score well on everything below.\n');

  console.log('  2. A MOUTH CANNOT RUN BACKWARDS');
  console.log(`  ${monotonic.cases} malformed mark streams — out of order, coalesced onto one`);
  console.log('  instant, all at zero, non-finite, indices past the end, the same word twice,');
  console.log('  none at all, an end before the last boundary, and observed times that run');
  console.log('  BACKWARDS. That last one is the only one that fails without the guard in');
  console.log('  anchorTrack: it inverts a segment and drags the mouth 295 ms into the past,');
  console.log('  and every other case here passed a build with the guard deleted.\n');

  console.log('  3. AND IT BEATS WHAT YOU WOULD DO WITHOUT IT');
  console.log('  Against a simulated speaker that draws out long words and rushes short');
  console.log('  ones — a uniform rate change is what the control already handles.\n');
  console.log('    line                                    words   anchored   global rate');
  for (const s of scores) {
    console.log(
      `    ${s.text.slice(0, 36).padEnd(38)}${String(s.words).padStart(3)}   ${s.anchored.toFixed(0).padStart(6)} ms   ${s.control.toFixed(0).padStart(7)} ms`
    );
  }
  console.log(`\n    mean ${meanAnchored.toFixed(0)} ms against the control's ${meanControl.toFixed(0)} ms, and the budget is 40 ms —`);
  console.log('    one frame at 24 fps, which is the tolerance ANIMA\'s lip-sync gate uses.');
  console.log('    THE SIMULATOR IS NOT A BROWSER. It scores the control too, so what it');
  console.log('    gets wrong it gets wrong for both; what it cannot tell you is whether a');
  console.log('    real engine reports boundaries where this one does.\n');

  console.log('  4. AND A TALL NPC IS LOWER THAN A SHORT ONE');
  console.log(`  utterance.pitch is dimensionless and the platform never says what its 1.0`);
  console.log('  is in hertz, so the mapping is a RATIO against this library\'s own speaker.');
  console.log(`    1.95 m  ${pitches.tall.toFixed(2)}      1.75 m  ${pitches.mid.toFixed(2)}      1.20 m  ${pitches.small.toFixed(2)}`);

  console.log('\n  5. AND THE PITCH RIDES THE SAME WARP');
  console.log('  A brow raise is punctuation before it is emotion (Ekman 1979), and about');
  console.log('  seven in ten land on a rise in F0 (Cavé et al. 1996) — so a face wants the');
  console.log('  contour too, moved by the same word boundary that moved the mouth.\n');
  console.log(`    a statement spans        ${pitchTrack.statementSpan.toFixed(1)} semitones`);
  console.log(`    a question ends at       ${pitchTrack.questionEnd.toFixed(1)}  against a statement's ${pitchTrack.statementEnd.toFixed(1)}`);
  console.log(`    a long line declines     ${pitchTrack.decline.toFixed(1)} semitones from its first half to its second`);
  console.log(`    the loudest accent       ${pitchTrack.peakBefore.toFixed(2)}s → ${pitchTrack.peakAfter.toFixed(2)}s under a 1.6x warp`);
  console.log('\n    That last one is the claim that could be false. The declination is why');
  console.log('    a face needs a running baseline on the far side of the seam: a brow');
  console.log('    wired straight to pitch sinks with the sentence.');
}

if (failures.length) {
  console.error('\nTTS OVER BUDGET');
  for (const l of failures) console.error(`  ${l}`);
  console.error('\nThe platform makes the sound. The mouth is still ours, and it has to follow.');
  process.exit(1);
}
if (!json) console.log('\ntts: the words are the platform\'s, the mouth is this library\'s ✓');
