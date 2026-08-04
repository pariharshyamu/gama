#!/usr/bin/env node
/**
 * The prosody gate — rhythm and melody, checked against people.
 *
 *   npm run prosody            fail if the voice stops sounding like a language
 *   npm run prosody -- --json  the numbers, machine-readable
 *
 * ## Two claims, and neither is about this library
 *
 * 1. **English rhythm is a measured statistic, and the model has to land in it.**
 *    Grabe and Low (2002) put a number on the old "stress-timed vs
 *    syllable-timed" split: the normalized Pairwise Variability Index, how
 *    unlike each vowel is from the one beside it. English 57.2, Dutch 65.5,
 *    French 43.5, Spanish 29.7, Mandarin 27.0 — measured off recordings of
 *    humans, and this library was built from none of it. The duration model
 *    comes out of Klatt's rules; nPVI is measured out of the result.
 *
 * 2. **Pitch is a semitone phenomenon.** Declination, accent size and the final
 *    rise are published in semitones because that is what they are: a man, a
 *    woman and a child saying the same sentence have F0 contours that differ by
 *    a constant factor in hertz and coincide in semitones. So the gate renders
 *    all three and checks it — with a hertz-based version alongside as the
 *    control, which has to fail.
 *
 * ## And a third thing the planner cannot check about itself
 *
 * The pitch is read back OUT OF THE SAMPLES by autocorrelation. A planner that
 * produces a perfect contour and a renderer that ignores it look identical from
 * the planner's side.
 */
import {
  ACCENT_EXCURSION, DECLINATION, FINAL_FALL, KLATT_INHERENT, KLATT_MIN_FRACTION,
  QUESTION_RISE, VOWELS, klattDuration, nPVI, planUtterance, renderVoice,
  syllabify, toSemitones, voiceOf,
} from '../dist/index.js';
import { pitchIn } from './formants.mjs';

const json = process.argv.includes('--json');
const failures = [];
const fail = (l) => failures.push(l);

const SR = 22050;
const mean = (a) => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);

// --------------------------------------------------------------- the corpus

/**
 * Grabe & Low (2002), vocalic nPVI. Measured off recordings of humans. These
 * numbers BUILD NOTHING here — they are only ever compared against.
 */
const PUBLISHED = {
  Dutch: 65.5, Thai: 65.8, German: 59.7, English: 57.2, Tamil: 55.8,
  Estonian: 45.4, French: 43.5, Japanese: 40.9, Spanish: 29.7, Mandarin: 27.0,
};
/** The stress-timed group, and the span it covers. */
const STRESS_TIMED = ['English', 'German', 'Dutch'];
const STRESS_LO = Math.min(...STRESS_TIMED.map((k) => PUBLISHED[k]));
const STRESS_HI = Math.max(...STRESS_TIMED.map((k) => PUBLISHED[k]));
const HUMAN_LO = Math.min(...Object.values(PUBLISHED));
const HUMAN_HI = Math.max(...Object.values(PUBLISHED));

/**
 * A small lexicon: one vowel per syllable, and where the primary stress sits.
 *
 * English spelling does not carry its vowels, so these have to come from
 * somewhere and they come from a table. What is NOT in the table is stress
 * marked by ear — a word is a function word or it is not, and `syllabify`
 * decides. If stress were marked by hand the rhythm this gate measures would be
 * one somebody chose.
 */
const LEXICON = {
  the: { vowels: ['@'] }, a: { vowels: ['@'] }, at: { vowels: ['ae'] },
  and: { vowels: ['ae'] }, for: { vowels: ['O'] }, he: { vowels: ['i'] },
  she: { vowels: ['i'] }, his: { vowels: ['I'] }, in: { vowels: ['I'] },
  was: { vowels: ['V'] }, would: { vowels: ['U'] }, until: { vowels: ['V', 'I'], stress: 1 },
  traveller: { vowels: ['ae', '@', '@'] }, stopped: { vowels: ['A'] },
  gate: { vowels: ['E'] }, asked: { vowels: ['ae'] }, water: { vowels: ['O', '@'] },
  said: { vowels: ['E'] }, wait: { vowels: ['E'] }, morning: { vowels: ['O', 'I'] },
  nobody: { vowels: ['O', '@', 'i'] }, village: { vowels: ['I', 'I'] },
  knew: { vowels: ['u'] }, name: { vowels: ['E'] }, carried: { vowels: ['ae', 'i'] },
  lantern: { vowels: ['ae', '@'] }, down: { vowels: ['A'] },
  every: { vowels: ['E', 'I'] }, window: { vowels: ['I', 'O'] }, dark: { vowels: ['A'] },
};

const SENTENCES = [
  'the traveller stopped at the gate and asked for water',
  'he said he would wait until the morning',
  'nobody in the village knew his name',
  'she carried a lantern down the village',
  'every window in the village was dark',
];
const SYLLABLES = SENTENCES.map((s) => syllabify(s.split(' '), LEXICON));

const rhythm = (options) =>
  SYLLABLES.map((syl) => nPVI(planUtterance(syl, options).map((p) => p.seconds)));

// -------------------------------------- 1. Klatt's rule form, before anything

{
  // The floor is the claim, not the percentages. Squeeze a segment by every
  // shortening rule at once and it lands on its minimum rather than on nothing.
  const inherent = 240;
  const minimum = inherent * KLATT_MIN_FRACTION;
  if (klattDuration(inherent, 100, minimum) !== inherent) {
    fail('a rule at 100% changed the duration');
  }
  if (!(klattDuration(inherent, 0, minimum) === minimum)) {
    fail('a rule at 0% did not stop at the floor');
  }
  const squeezed = klattDuration(klattDuration(inherent, 50, minimum), 50, minimum);
  if (!(squeezed > minimum * 0.999)) fail(`two shortening rules went through the floor to ${squeezed}`);
  // ...and the inherent durations are already most of the rhythm, before a
  // single rule runs. /æ/ is more than three times /ə/.
  const spread = Math.max(...Object.values(KLATT_INHERENT)) / Math.min(...Object.values(KLATT_INHERENT));
  if (!(spread > 3)) fail(`the inherent vowel durations only spread ${spread.toFixed(1)}×`);
  var ruleForm = { spread, squeezed, minimum };
}

// ------------------------------ 2. THE RHYTHM CLASS, against published people

const stressTimed = rhythm({});
const evenTimed = rhythm({ timing: 'even' });
const noFloorPlan = SYLLABLES.map((syl) =>
  nPVI(
    syl.map((s, i) => {
      // Klatt's rules with MINDUR taken out — the same model, no floor.
      const inh = KLATT_INHERENT[s.vowel] ?? 70;
      let pct = s.stressed ? 100 : 50;
      if (i === syl.length - 1) pct *= 1.4;
      else if (s.wordFinal) pct *= 0.9;
      return (inh * pct) / 100;
    })
  )
);

const english = mean(stressTimed);
const even = mean(evenTimed);
const noFloor = mean(noFloorPlan);

// (a) The model has to land inside the span the stress-timed languages cover.
if (!(english >= STRESS_LO && english <= STRESS_HI)) {
  fail(
    `nPVI ${english.toFixed(1)} is outside the stress-timed span ` +
      `${STRESS_LO}–${STRESS_HI} (English ${PUBLISHED.English}, Dutch ${PUBLISHED.Dutch})`
  );
}
// (b) THE CONTRAST IS THE CLAIM. Take the stress reduction out and the rhythm
//     has to leave the stress-timed group — that is what "stress-timed" means,
//     and if the model scored the same either way the number would be an
//     accident of the vowel inventory rather than a property of the rules.
if (!(even < STRESS_LO)) {
  fail(`without stress reduction the rhythm is still ${even.toFixed(1)}, inside the stress-timed group`);
}
if (!(english - even > 8)) {
  fail(`stress reduction only moves the rhythm by ${(english - even).toFixed(1)} nPVI`);
}
// (c) THE CONTROL. Remove Klatt's floor and the model has to leave the range of
//     every language anyone has measured. A model that stays human-shaped
//     without the floor would mean the floor was decoration.
if (!(noFloor > HUMAN_HI)) {
  fail(`without the MINDUR floor the rhythm is ${noFloor.toFixed(1)}, still inside the human range (${HUMAN_LO}–${HUMAN_HI}) — the floor is doing nothing`);
}

// ------------------------------------ 3. PITCH IS SEMITONES, AND A CHILD KNOWS

const BODIES = [
  ['man', 1.78],
  ['woman', 1.62],
  ['child', 1.25],
];

function contour(height, options = {}) {
  const voice = voiceOf({ height });
  const plan = planUtterance(SYLLABLES[0], { voice, ...options });
  return { voice, plan, hz: plan.map((p) => p.f0), st: plan.map((p) => toSemitones(p.f0 / voice.f0)) };
}

function contourSpread(options = {}) {
  const all = BODIES.map(([, h]) => contour(h, options));
  let worstSt = 0;
  let worstHz = 0;
  for (let i = 0; i < all[0].st.length; i++) {
    const st = all.map((c) => c.st[i]);
    worstSt = Math.max(worstSt, Math.max(...st) - Math.min(...st));
    // In hertz the three have to DIVERGE, or "they agree in semitones" is empty.
    const hz = all.map((c) => c.hz[i]);
    worstHz = Math.max(worstHz, Math.max(...hz) - Math.min(...hz));
  }
  return { worstSt, worstHz, all };
}

const semitone = contourSpread();
const hertzControl = contourSpread({ pitchInHertz: true });

// The same sentence on three bodies is the same TUNE. To floating point.
if (!(semitone.worstSt < 1e-9)) {
  fail(`three bodies disagree by ${semitone.worstSt.toFixed(4)} semitones on the same sentence`);
}
// ...and it is not the same tune in hertz, or nothing was shown.
if (!(semitone.worstHz > 50)) {
  fail(`three bodies differ by only ${semitone.worstHz.toFixed(1)} Hz — the semitone agreement is vacuous`);
}
// THE CONTROL: do the arithmetic in hertz and the three stop agreeing.
// A semitone: the same bar the rendered-pitch check below uses, and for the
// same reason — it is about the resolution at which two contours stop being
// the same tune. The semitone model puts the three bodies at 2e-15.
if (!(hertzControl.worstSt > 1)) {
  fail(`a hertz-based contour still agrees to ${hertzControl.worstSt.toFixed(2)} semitones across three bodies — the control is not failing`);
}

// ------------------------------- 4. and the RENDERER has to follow the planner

/**
 * Pitch read back out of the samples, per planned syllable.
 *
 * Measured over the syllable's own second half only — the first third is the
 * glide, and a window that reaches into the neighbour averages two pitches and
 * reports neither. Syllables too short to hold two periods come back NaN and
 * are skipped, which is most of the unstressed ones: at 5 syllables a second a
 * reduced schwa lasts 50 ms and a 90 Hz voice needs 22 of them per period.
 */
function heard(plan, voice) {
  const buf = renderVoice(
    plan.map((p) => ({ vowel: p.vowel, seconds: p.seconds, f0: p.f0 })),
    voice, { sampleRate: SR, seed: 5 }
  );
  const out = [];
  let start = 0;
  for (const p of plan) {
    const end = start + p.seconds;
    const got = pitchIn(buf, (start + p.seconds * 0.5) * SR, end * SR, SR);
    out.push(got ? got.hz : NaN);
    start = end;
  }
  return { buf, out, measured: out.filter(Number.isFinite).length };
}

const statementVoice = voiceOf({ height: 1.78 });
const statement = planUtterance(SYLLABLES[0], { voice: statementVoice });
const question = planUtterance(SYLLABLES[0], { voice: statementVoice, intonation: 'question' });
const flat = planUtterance(SYLLABLES[0], { voice: statementVoice, intonation: 'flat' });

const heardStatement = heard(statement, statementVoice);
const heardQuestion = heard(question, statementVoice);
const heardFlat = heard(flat, statementVoice);

{
  // (a) What was rendered is what was planned.
  let worst = 0;
  let at = -1;
  for (let i = 0; i < statement.length; i++) {
    const got = heardStatement.out[i];
    if (!Number.isFinite(got)) continue;
    const err = Math.abs(toSemitones(got / statement[i].f0));
    if (err > worst) { worst = err; at = i; }
  }
  // A semitone is the resolution a listener has for a sustained pitch, and the
  // budget is one — measured in the unit the model works in rather than in
  // hertz, where the same error would be a different number per body.
  if (!(worst < 1)) {
    fail(`syllable ${at} was planned at ${statement[at]?.f0.toFixed(1)} Hz and came out ${worst.toFixed(2)} semitones away`);
  }
  var tracking = { worst, at };
}

{
  // (b) A statement falls and a question rises, MEASURED OFF THE AUDIO.
  //
  // At the same syllable in both, or the comparison is between two different
  // places in the sentence. Reduced syllables are too short to hold two periods
  // of a 118 Hz voice and come back unmeasured, so the last syllable BOTH
  // renders can be read at is the one to ask.
  let idx = -1;
  for (let i = heardStatement.out.length - 1; i >= 0; i--) {
    if (Number.isFinite(heardStatement.out[i]) && Number.isFinite(heardQuestion.out[i])) { idx = i; break; }
  }
  if (idx < 0) fail('no syllable in the utterance was long enough to read a pitch from');
  const endStatement = toSemitones(heardStatement.out[idx] / statementVoice.f0);
  const endQuestion = toSemitones(heardQuestion.out[idx] / statementVoice.f0);
  if (!(endQuestion - endStatement > QUESTION_RISE * 0.5)) {
    fail(`a question ends only ${(endQuestion - endStatement).toFixed(1)} semitones above a statement`);
  }
  // DECLINATION, measured off the audio rather than at one syllable.
  //
  // The last readable syllable is the accented nucleus and is SUPPOSED to sit
  // above the baseline — asserting it ended below the start was simply the
  // wrong claim, and it failed on a correct contour. Declination is a trend, so
  // it is measured as one: a least-squares slope through the ACCENTED syllables
  // only, which all carry the same +6 excursion and so differ from each other
  // by the baseline alone.
  const accents = [];
  let clock = 0;
  for (let i = 0; i < statement.length; i++) {
    const centre = clock + statement[i].seconds / 2;
    clock += statement[i].seconds;
    if (statement[i].stressed && Number.isFinite(heardStatement.out[i])) {
      accents.push([centre, toSemitones(heardStatement.out[i] / statementVoice.f0)]);
    }
  }
  let slope = 0;
  if (accents.length >= 3) {
    const mx = mean(accents.map((p) => p[0]));
    const my = mean(accents.map((p) => p[1]));
    let num = 0;
    let den = 0;
    for (const [x, y] of accents) { num += (x - mx) * (y - my); den += (x - mx) ** 2; }
    slope = num / den;
  } else {
    fail(`only ${accents.length} accented syllables were readable — declination cannot be measured`);
  }
  // It has to FALL, and at roughly the published rate. The final movement drags
  // the last accent down further, so the measured slope is steeper than
  // DECLINATION alone and the bar is one-sided on purpose.
  if (!(slope < -DECLINATION * 0.5)) {
    fail(`a statement's accents fall at ${slope.toFixed(2)} st/s against a published ${DECLINATION}`);
  }
  // ...and the control: 'flat' has no declination, so its slope must be ~zero.
  const flatAccents = [];
  clock = 0;
  for (let i = 0; i < flat.length; i++) {
    const centre = clock + flat[i].seconds / 2;
    clock += flat[i].seconds;
    if (flat[i].stressed && Number.isFinite(heardFlat.out[i])) {
      flatAccents.push([centre, toSemitones(heardFlat.out[i] / statementVoice.f0)]);
    }
  }
  const flatSlope = flatAccents.length >= 3
    ? (() => {
        const mx = mean(flatAccents.map((p) => p[0]));
        const my = mean(flatAccents.map((p) => p[1]));
        let num = 0;
        let den = 0;
        for (const [x, y] of flatAccents) { num += (x - mx) * (y - my); den += (x - mx) ** 2; }
        return num / den;
      })()
    : NaN;
  if (!(Math.abs(flatSlope) < 0.1)) {
    fail(`'flat' intonation still declines at ${flatSlope.toFixed(2)} st/s — the declination is not the planner's`);
  }
  // (c) The flat control: no declination, no accents, no final movement, so the
  //     pitch track has to be a straight line. If it is not flat, the contour in
  //     the other two came from somewhere other than the planner.
  const flatTrack = heardFlat.out.filter(Number.isFinite);
  const flatSpread = toSemitones(Math.max(...flatTrack) / Math.min(...flatTrack));
  if (!(flatSpread < 0.5)) fail(`'flat' intonation still moved ${flatSpread.toFixed(2)} semitones`);
  const statementTrack = heardStatement.out.filter(Number.isFinite);
  const statementSpread = toSemitones(Math.max(...statementTrack) / Math.min(...statementTrack));
  if (!(statementSpread > 6)) {
    fail(`a statement only spans ${statementSpread.toFixed(1)} semitones — the contour is not reaching the audio`);
  }
  var melody = { idx, endStatement, endQuestion, flatSpread, statementSpread, slope, flatSlope, accents: accents.length };
}

// ----------------------------------------- 5. the things it must not do

{
  if (planUtterance([], {}).length !== 0) fail('an empty utterance produced syllables');
  const one = planUtterance([{ vowel: 'A', stressed: true }], {});
  if (one.length !== 1 || !(one[0].seconds > 0)) fail('a one-syllable utterance came out wrong');
  // An unknown vowel is a schwa, not a crash — the same rule `voice.ts` uses.
  const unknown = planUtterance([{ vowel: 'zzz' }], {});
  if (!Number.isFinite(unknown[0].seconds)) fail('an unknown vowel produced a non-finite duration');
  // Rate scales the whole thing and nothing else.
  const slow = planUtterance(SYLLABLES[1], { rate: 0.5 });
  const fast = planUtterance(SYLLABLES[1], { rate: 2 });
  const ratio = slow.reduce((a, p) => a + p.seconds, 0) / fast.reduce((a, p) => a + p.seconds, 0);
  if (Math.abs(ratio - 4) > 1e-9) fail(`halving and doubling the rate gave a ${ratio.toFixed(3)}× span, not 4`);
  // ...and rate must NOT change the rhythm, which is what normalising nPVI is for.
  const fastRhythm = mean(SYLLABLES.map((s) => nPVI(planUtterance(s, { rate: 2 }).map((p) => p.seconds))));
  if (Math.abs(fastRhythm - english) > 1e-9) {
    fail(`speaking twice as fast changed the rhythm from ${english.toFixed(1)} to ${fastRhythm.toFixed(1)}`);
  }
  // Every rendered sample stays finite and bounded.
  for (let i = 0; i < heardQuestion.buf.length; i++) {
    if (!Number.isFinite(heardQuestion.buf[i]) || Math.abs(heardQuestion.buf[i]) > 1.0001) {
      fail(`a rendered utterance produced ${heardQuestion.buf[i]} at sample ${i}`);
      break;
    }
  }
  var guards = { ratio, fastRhythm };
}

// ------------------------------------------------------------------- report

if (json) {
  console.log(JSON.stringify({
    failures, ruleForm, published: PUBLISHED, stressTimed, evenTimed,
    english, even, noFloor, semitone: { worstSt: semitone.worstSt, worstHz: semitone.worstHz },
    hertzControl: { worstSt: hertzControl.worstSt }, tracking, melody, guards,
  }, null, 2));
} else {
  console.log('prosody — the part of speech that is not the words\n');

  console.log('  THE RHYTHM CLASS, MEASURED OUT OF THE MODEL');
  console.log('  Grabe & Low (2002) put a number on "stress-timed vs syllable-timed":');
  console.log('  the normalized Pairwise Variability Index, off recordings of humans.');
  console.log('  This library was built from none of it.\n');
  console.log('    published            nPVI          this model                nPVI');
  const rows = Object.entries(PUBLISHED).sort((a, b) => b[1] - a[1]);
  const mine = [
    ['Klatt rules, stress-timed', english],
    ['...no stress reduction', even],
    ['...no MINDUR floor', noFloor],
  ];
  for (let i = 0; i < rows.length; i++) {
    const [lang, v] = rows[i];
    const m = mine[i];
    console.log(
      `    ${lang.padEnd(20)}${v.toFixed(1).padStart(5)}     ` +
        (m ? `${m[0].padEnd(26)}${m[1].toFixed(1).padStart(5)}` : '')
    );
  }
  console.log(`\n    ${english.toFixed(1)} sits inside the ${STRESS_LO}–${STRESS_HI} the stress-timed languages cover.`);
  console.log(`    Take the stress reduction out and it falls to ${even.toFixed(1)} — out of that group`);
  console.log('    entirely, which is what "stress-timed" means. It does NOT reach Spanish,');
  console.log("    and should not: the residual is English's own vowel durations, which even");
  console.log(`    timing cannot remove — /æ/ is ${ruleForm.spread.toFixed(1)}× /ə/ before a rule has run.`);
  console.log(`    Take Klatt's FLOOR out and it goes to ${noFloor.toFixed(1)}, past every language`);
  console.log(`    ever measured (${HUMAN_LO}–${HUMAN_HI}). Unstressed syllables compress to nothing.\n`);

  console.log('  PITCH IS A SEMITONE PHENOMENON, AND A CHILD PROVES IT');
  console.log('    The same sentence, three bodies:');
  for (let i = 0; i < BODIES.length; i++) {
    const c = semitone.all[i];
    console.log(
      `      ${BODIES[i][0].padEnd(6)} ${BODIES[i][1]} m   F0 ${c.voice.f0.toFixed(0).padStart(3)} Hz   ` +
        `contour ${Math.min(...c.hz).toFixed(0)}–${Math.max(...c.hz).toFixed(0)} Hz   ` +
        `${Math.min(...c.st).toFixed(1)}–${Math.max(...c.st).toFixed(1)} st`
    );
  }
  console.log(`    They differ by up to ${semitone.worstHz.toFixed(0)} Hz and agree to ${semitone.worstSt.toExponential(1)} semitones.`);
  console.log(`    The control — the same model doing its arithmetic in HERTZ — puts them`);
  console.log(`    ${hertzControl.worstSt.toFixed(1)} semitones apart, which is a different tune.\n`);

  console.log('  AND THE RENDERER FOLLOWS THE PLANNER');
  console.log('  (pitch read back out of the samples by autocorrelation, not by being told)');
  console.log(`    worst syllable off its plan:      ${tracking.worst.toFixed(2)} semitones`);
  console.log(`    statement, at its last readable syllable:   ${melody.endStatement.toFixed(1)} st`);
  console.log(`    question, at the SAME syllable (${melody.idx}):          ${melody.endQuestion.toFixed(1)} st, ${(melody.endQuestion - melody.endStatement).toFixed(1)} higher`);
  console.log(`    a statement spans:                ${melody.statementSpread.toFixed(1)} semitones`);
  console.log(`    'flat' spans:                     ${melody.flatSpread.toFixed(2)} semitones — the control`);
  console.log(`    declination through ${melody.accents} accents:      ${melody.slope.toFixed(2)} st/s   (planned ${DECLINATION}, plus the final fall)`);
  console.log(`    ...and through 'flat' accents:    ${melody.flatSlope.toFixed(2)} st/s — the control`);
  console.log(`\n    declination ${DECLINATION} st/s, accent ${ACCENT_EXCURSION} st, final fall ${FINAL_FALL} st, question rise ${QUESTION_RISE} st`);
  console.log("    ('t Hart, Collier & Cohen 1990 — semitones, because that is how they");
  console.log('     were published, and the three bodies above are why.)');
  void VOWELS;
}

if (failures.length) {
  console.error('\nPROSODY OVER BUDGET');
  for (const l of failures) console.error(`  ${l}`);
  console.error('\nRhythm is a published statistic. If the voice stopped being a language, the voice moved.');
  process.exit(1);
}
if (!json) console.log('\nprosody: the rhythm is English and the melody is semitones ✓');
