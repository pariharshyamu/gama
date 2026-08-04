#!/usr/bin/env node
/**
 * The voice gate — a formant synthesizer, checked by listening to itself.
 *
 *   npm run voice            fail if the voice stops being a vocal tract
 *   npm run voice -- --json  the numbers, machine-readable
 *
 * ## The claim
 *
 * Speech is a SOURCE through a FILTER (Fant 1960). The source is pitch; the
 * filter is the vowel; they are independent. The filter's resonances are the
 * formants, and for a tube closed at one end they are `(2n−1)c/4L` — one length
 * and the speed of sound.
 *
 * ## Two claims, gated apart, because they can fail apart
 *
 * 1. **The MODEL**: every voice is the adult-male formant table scaled by one
 *    ratio of tract lengths. No audio in this half at all — it is arithmetic
 *    against Peterson & Barney's women's and children's rows, which build
 *    nothing here and are only ever compared against.
 * 2. **The SYNTHESIZER**: what comes out of the speaker is what the table asked
 *    for. Render, take the spectrum, find the peaks, and check they landed.
 *
 * Composed, they are what a listener hears; kept apart, a failure says which
 * half moved. The budget for (1) is what the best possible single ratio
 * achieves on the same data, and the budget for (2) is the resonators' own
 * bandwidths. Neither is a number anybody chose.
 *
 * ## And a third thing, which is not a claim at all
 *
 * P&B's MEN'S row is here too, and the library carries a copy of it. That
 * comparison proves nothing about speech; it proves the table has not rotted.
 * It is here because it had to be: the floor in (1) is fitted to the same vowel
 * table it is judging, so corrupting a single published formant moved the model
 * and the budget together and the gate said nothing. A budget derived from the
 * thing under test is not a budget, and the fix is an anchor from outside it.
 */
import {
  BANDWIDTHS, CHILD_TRACT, FEMALE_TRACT, REFERENCE_TRACT, SPEED_OF_SOUND,
  VOWELS, VOWEL_KEYS, formantsOf, renderVowel, renderVoice, tractLengthFor,
  tubeFormants, voiceOf,
} from '../dist/index.js';
import { envelope, envelopeMatch, lifterFor, peaks, spectrum } from './formants.mjs';

const json = process.argv.includes('--json');
const failures = [];
const fail = (l) => failures.push(l);
const close = (a, b, tol, what) => {
  if (!(Math.abs(a - b) <= tol)) fail(`${what}: ${a} against ${b}, tolerance ${tol}`);
};

const SR = 22050;
/** 4096 points at 22.05 kHz is a 5.4 Hz bin — a ninth of the narrowest formant. */
const FFT = 4096;

/** Measure a vowel by WHISPERING it — noise through the filter, no pitch. */
function measure(vowel, tract, options = {}) {
  const buf = renderVowel(vowel, voiceOf({ tract }), {
    seconds: 4, sampleRate: SR, f0: 0, seed: 7, ...options,
  });
  return peaks(spectrum(buf, FFT), SR, 3, 150, options.f0 ?? 0);
}

/**
 * How far a measured formant landed from where it was asked for, **in units of
 * that formant's own bandwidth**.
 *
 * This is the budget for everything the synthesizer is asked to do, and it is
 * not a number this file picked: `BANDWIDTHS` is in the module, it is what makes
 * the peak the width it is, and a peak cannot be located to better than a
 * fraction of its own width. Half a bandwidth is the bar throughout.
 */
const OFFSET_BUDGET = 0.5;
const offsets = (want, got) =>
  want.map((w, i) => (got[i] === undefined ? Infinity : Math.abs(got[i] - w) / BANDWIDTHS[i]));

// ----------------------------------------- 1. the tube, before any synthesis

{
  const [f1, f2, f3] = tubeFormants(REFERENCE_TRACT);
  close(f1, SPEED_OF_SOUND / (4 * REFERENCE_TRACT), 1e-9, 'F1 is not c/4L');
  close(f2, f1 * 3, 1e-9, 'F2 is not the third harmonic of a quarter-wave tube');
  close(f3, f1 * 5, 1e-9, 'F3 is not the fifth');
  // ...and the textbook neutral vowel, which the tube was not fitted to.
  for (const [got, want] of [[f1, 500], [f2, 1500], [f3, 2500]]) {
    if (!(Math.abs(got / want - 1) < 0.03)) {
      fail(`a 17.5 cm tube resonates at ${got.toFixed(0)} Hz against a textbook ${want}`);
    }
  }
  var tube = [f1, f2, f3];
}

// ------------- 2. the synthesizer produces what it claims to, at every size
//
// Not just at the reference length. The male tract is where the table came
// from; the female and child tracts are the same table transposed, and if the
// cascade only behaved itself at one size the transposition would be the thing
// that broke.

const TRACTS = [['male', REFERENCE_TRACT], ['female', FEMALE_TRACT], ['child', CHILD_TRACT]];
const selfCheck = [];
for (const [label, tract] of TRACTS) {
  for (const key of VOWEL_KEYS) {
    const want = formantsOf(key, tract);
    const got = measure(key, tract);
    if (got.length < 3) { fail(`${label} /${VOWELS[key].ipa}/ produced only ${got.length} formants`); continue; }
    const off = offsets(want, got);
    selfCheck.push({ label, key, tract, want, got, worst: Math.max(...off), relative: Math.max(...want.map((w, i) => Math.abs(got[i] / w - 1))) });
    if (Math.max(...off) > OFFSET_BUDGET) {
      fail(
        `${label} /${VOWELS[key].ipa}/ was asked for ${want.map((f) => f.toFixed(0)).join('/')} and produced ` +
          `${got.map((f) => f.toFixed(0)).join('/')} — ${Math.max(...off).toFixed(2)} of a bandwidth off`
      );
    }
  }
}

// -------------------- 3. OUT OF SAMPLE: a woman and a child from one length

/**
 * Peterson & Barney's MEN'S row — the one the library actually carries.
 *
 * This is a transcription check and it is labelled as one: it proves nothing
 * about vocal tracts, it proves that `VOWELS` still says what the 1952 paper
 * said. Without it a single digit could rot in the module and every downstream
 * comparison would rot with it in step — moving /ɑ/'s F2 from 1090 to 1450 got
 * past the whole rest of this file, because the "best a single ratio can do"
 * floor is fitted to the same table it is judging and rose to meet the damage.
 * A budget derived from the thing under test is not a budget.
 */
const PB_MEN = {
  i: [270, 2290, 3010], I: [390, 1990, 2550], E: [530, 1840, 2480],
  ae: [660, 1720, 2410], A: [730, 1090, 2440], O: [570, 840, 2410],
  U: [440, 1020, 2240], u: [300, 870, 2240], V: [640, 1190, 2390],
};
for (const [key, row] of Object.entries(PB_MEN)) {
  for (const [i, f] of ['f1', 'f2', 'f3'].entries()) {
    if (VOWELS[key][f] !== row[i]) {
      fail(`VOWELS.${key}.${f} is ${VOWELS[key][f]} where Peterson & Barney measured ${row[i]}`);
    }
  }
}
// /ə/ is not in P&B — they measured ten vowels and the schwa was not one of
// them. It is the tube at rest instead, and its F1 is c/4L to the hertz.
close(VOWELS['@'].f1, tubeFormants(REFERENCE_TRACT)[0], 0.5, 'the schwa is not the neutral tube');

/**
 * Peterson & Barney (1952), F1/F2 in Hz. These rows BUILD NOTHING. They are
 * only ever compared against, which is the only reason the comparison means
 * anything.
 */
const PB_WOMEN = {
  i: [310, 2790], I: [430, 2480], E: [610, 2330], ae: [860, 2050], A: [850, 1220],
  O: [590, 920], U: [470, 1160], u: [370, 950], V: [760, 1400],
};
const PB_CHILDREN = {
  i: [370, 3200], I: [530, 2730], E: [690, 2610], ae: [1010, 2320], A: [1030, 1370],
  O: [680, 1060], U: [560, 1410], u: [430, 1170], V: [850, 1590],
};

/**
 * Error of "male table on a tract of this length" against a published
 * population. No audio, and — importantly — through `formantsOf`, the function
 * the library actually ships. An earlier version multiplied the table by a ratio
 * itself, which meant a `formantsOf` that ignored its tract argument entirely
 * sailed through this whole section: the gate was checking its own arithmetic.
 */
function scaleError(ratio, table) {
  const tract = REFERENCE_TRACT / ratio;
  let sum = 0;
  let n = 0;
  let worst = 0;
  let worstAt = '';
  for (const [key, truth] of Object.entries(table)) {
    const model = formantsOf(key, tract);
    for (const j of [0, 1]) {
      const e = Math.abs(model[j] / truth[j] - 1);
      sum += e;
      n++;
      if (e > worst) { worst = e; worstAt = `/${VOWELS[key].ipa}/ F${j + 1}`; }
    }
  }
  return { mean: sum / n, worst, worstAt };
}

function population(label, tract, table) {
  const ratio = REFERENCE_TRACT / tract;
  const model = scaleError(ratio, table);
  // The floor: the best ANY single ratio can do on these rows, found by sweep.
  // It is allowed to see the answer. The anatomical ratio is not.
  let fitted = ratio;
  let floor = Infinity;
  for (let r = 0.8; r < 1.8; r += 0.0005) {
    const e = scaleError(r, table).mean;
    if (e < floor) { floor = e; fitted = r; }
  }
  const rows = [];
  let heardSum = 0;
  let heardWorst = 0;
  let offsetWorst = 0;
  let offsetAt = '';
  for (const [key, truth] of Object.entries(table)) {
    const want = formantsOf(key, tract);
    const got = measure(key, tract);
    if (got.length < 2) { fail(`${label}: /${VOWELS[key].ipa}/ lost a formant`); continue; }
    const off = offsets(want, got);
    if (Math.max(off[0], off[1]) > offsetWorst) {
      offsetWorst = Math.max(off[0], off[1]);
      offsetAt = `/${VOWELS[key].ipa}/`;
    }
    const e1 = got[0] / truth[0] - 1;
    const e2 = got[1] / truth[1] - 1;
    rows.push({ key, truth, want: [want[0], want[1]], got: [got[0], got[1]], e1, e2 });
    for (const e of [Math.abs(e1), Math.abs(e2)]) {
      heardSum += e;
      heardWorst = Math.max(heardWorst, e);
    }
  }
  return {
    label, tract, ratio, fitted, floor, model, rows,
    heard: heardSum / (rows.length * 2), heardWorst, offsetWorst, offsetAt,
  };
}

const women = population('women', FEMALE_TRACT, PB_WOMEN);
const children = population('children', CHILD_TRACT, PB_CHILDREN);

for (const p of [women, children]) {
  // (a) THE FLOOR IS REAL, and this is a positive claim about the data rather
  //     than an excuse. If a ratio fitted to the answer could get under 4%, the
  //     residual would be the model's fault; it cannot, because P&B's own
  //     vowel-by-vowel ratios scatter by about 7% around their own mean. A tract
  //     does not scale uniformly — a male larynx descends at puberty — and no
  //     single number can pretend it does.
  if (!(p.floor > 0.04)) {
    fail(`${p.label}: a ratio fitted to the answer gets ${(p.floor * 100).toFixed(1)}% — the residual is no longer the population's, it is the model's`);
  }
  // (b) AND ANATOMY IS WORTH ALMOST AS MUCH AS FITTING. Two measured lengths,
  //     shown none of the target rows, cost under two points against a ratio
  //     that was handed them.
  if (!(p.model.mean < p.floor + 0.02)) {
    fail(`${p.label}: the anatomical ratio ${p.ratio.toFixed(3)} is ${(p.model.mean * 100).toFixed(1)}% off against a fitted ${p.fitted.toFixed(3)}'s ${(p.floor * 100).toFixed(1)}% — the length is not carrying it`);
  }
  // (c) ...and the synthesizer, at a tract it was never tuned on, still lands
  //     its formants within half their own bandwidth. Same bar as section 2,
  //     applied to two populations the reference table never saw.
  if (!(p.offsetWorst < OFFSET_BUDGET)) {
    fail(`${p.label}: ${p.offsetAt} came out ${p.offsetWorst.toFixed(2)} of a bandwidth from its own target — the cascade does not transpose`);
  }
}

// /ɔ/ is the biggest residual in both populations, and the reason is in P&B's
// own table rather than in this one. Stated as a POSITIVE claim so that if it
// ever stops being the outlier — better model, or a different reference — the
// gate says so instead of quietly carrying a hole.
{
  const ratio = (t) => t.O[0] / VOWELS.O.f1;
  const typical = ['i', 'A', 'u', 'ae'].map((k) => PB_WOMEN[k][0] / VOWELS[k].f1);
  const mean = typical.reduce((a, b) => a + b, 0) / typical.length;
  if (!(ratio(PB_WOMEN) < mean - 0.08)) {
    fail(`/ɔ/ scales at ${ratio(PB_WOMEN).toFixed(3)} against a typical ${mean.toFixed(3)} — it is no longer the outlier this gate names`);
  }
  var outlier = { oh: ratio(PB_WOMEN), typical: mean };
}

// -------------------- 4. pitch and vowel are different things, and here is why

const octave = [];
for (const key of ['i', 'A', 'u']) {
  const want = formantsOf(key, REFERENCE_TRACT);
  // The reference is the SAME SOURCE at the lowest pitch, not the whisper.
  //
  // Comparing a voiced envelope against a whispered one compares filter+glottal
  // tilt against filter+flat noise, and the glottal source falls about 12 dB an
  // octave — so the two envelopes differ by the source, not the filter, and /i/
  // scored 0.416 against its own whisper while being the same vowel. The claim
  // is that PITCH does not change the vowel, so the comparison is across pitch.
  const reference = envelope(
    spectrum(renderVowel(key, voiceOf({ tract: REFERENCE_TRACT }), { seconds: 4, sampleRate: SR, f0: 90, seed: 7 }), FFT),
    SR, lifterFor(90)
  );
  for (const f0 of [90, 180, 360]) {
    const buf = renderVowel(key, voiceOf({ tract: REFERENCE_TRACT }), {
      seconds: 4, sampleRate: SR, f0, seed: 7,
    });
    const spec = spectrum(buf, FFT);
    const match = envelopeMatch(envelope(spec, SR, lifterFor(f0)), reference, SR);
    // A source that puts a harmonic every F0 hertz carries NO information about
    // a formant below F0 — there is nothing down there to excite. /i/'s F1 is
    // 270 Hz, so at 360 Hz it is not a hard measurement, it is an absent one.
    // Saying so is the difference between a limit and a bug.
    octave.push({ key, f0, match, resolvable: want[0] > f0 });

    // THE CHECK: the filter is the same filter whatever the folds are doing, so
    // the envelope has to be the same shape at every pitch. Stated as a shape
    // and not as a peak position on purpose — the shape is what survives the
    // comb, and the claim is about the filter, not about what a spectrum of a
    // buzzing source is able to show.
    if (!(match > 0.9)) {
      fail(`/${VOWELS[key].ipa}/ at ${f0} Hz has an envelope only ${match.toFixed(3)} like the same vowel at 90 Hz`);
    }
  }
}

/**
 * ...and the source has to actually be a source.
 *
 * Everything above is about the FILTER, and a synthesizer that quietly ignored
 * `f0` and whispered every line would sail through all of it with a perfect
 * 1.000 envelope match at every pitch. So: a voiced render must be PERIODIC at
 * the pitch it was asked for, found by autocorrelation and not by being told,
 * and the whisper must not be periodic at anything.
 */
{
  const period = (buf, sampleRate) => {
    let best = 0;
    let at = 0;
    let energy = 0;
    for (let i = 0; i < buf.length; i++) energy += buf[i] * buf[i];
    for (let lag = Math.round(sampleRate / 500); lag <= Math.round(sampleRate / 60); lag++) {
      let sum = 0;
      for (let i = 0; i + lag < buf.length; i++) sum += buf[i] * buf[i + lag];
      const r = sum / (energy + 1e-12);
      if (r > best) { best = r; at = sampleRate / lag; }
    }
    return { hz: at, strength: best };
  };
  const PITCHES = [90, 140, 220];
  const voiced = [];
  for (const f0 of PITCHES) {
    const p = period(renderVowel('A', voiceOf(), { seconds: 0.5, sampleRate: SR, f0, seed: 7 }), SR);
    voiced.push({ f0, ...p });
    if (!(Math.abs(p.hz / f0 - 1) < 0.03)) {
      fail(`a vowel asked to buzz at ${f0} Hz repeats at ${p.hz.toFixed(1)} Hz`);
    }
  }
  // THE CONTROL, and it is not "a whisper is aperiodic" — a whisper is not.
  //
  // A 60 Hz-wide resonance has a Q around twelve and rings for some five
  // milliseconds, so ANY excitation of it correlates with itself a few hundred
  // samples later: /ɑ/ whispered comes back 0.54 "periodic". What it does not do
  // is come back periodic at a pitch, and that is the claim. The whisper's peak
  // lands at 361 Hz, which is not 90 and not 140 and not 220 and is not anything
  // this file asked for; a detector that returned whatever it was handed would
  // have failed here.
  const breath = period(renderVowel('A', voiceOf(), { seconds: 0.5, sampleRate: SR, f0: 0, seed: 7 }), SR);
  const nearest = Math.min(...PITCHES.map((f) => Math.abs(breath.hz / f - 1)));
  if (!(nearest > 0.2)) {
    fail(`a whisper repeats at ${breath.hz.toFixed(0)} Hz, within ${(nearest * 100).toFixed(0)}% of a pitch nobody asked it for — the detector is echoing its input`);
  }
  const weakest = Math.min(...voiced.map((v) => v.strength));
  if (!(breath.strength < weakest * 0.75)) {
    fail(`a whisper is ${breath.strength.toFixed(2)} periodic against a voiced ${weakest.toFixed(2)} — the folds are not doing anything the filter was not already doing`);
  }
  var source = { voiced, breath, nearest };
}

/**
 * The control: pitch-shift by RESAMPLING, which is what playing a recorded
 * sample faster does. The formants move with it, and that is the chipmunk.
 */
{
  const key = 'A';
  const want = formantsOf(key, REFERENCE_TRACT);
  const buf = renderVowel(key, voiceOf({ tract: REFERENCE_TRACT }), {
    seconds: 4, sampleRate: SR, f0: 0, seed: 7,
  });
  const reference = envelope(spectrum(buf, FFT), SR, lifterFor(0));
  const ratio = 1.5;
  const resampled = new Float32Array(Math.floor(buf.length / ratio));
  for (let i = 0; i < resampled.length; i++) resampled[i] = buf[Math.floor(i * ratio)];
  const spec = spectrum(resampled, FFT);
  const got = peaks(spec, SR, 3, 150);
  const moved = got.length ? got[0] / want[0] : NaN;
  const match = envelopeMatch(envelope(spec, SR, lifterFor(0)), reference, SR);
  // It has to FAIL both tests the synthesizer passes, or they prove nothing.
  if (!(moved > 1.25)) {
    fail(`resampling by ${ratio}× only moved F1 by ${moved.toFixed(2)}× — the control is not failing, so the check is empty`);
  }
  if (!(match < 0.9)) {
    fail(`resampling left the envelope ${match.toFixed(3)} like the original — the envelope check has no teeth`);
  }
  var chipmunk = { ratio, moved, match };
}

// ---------------------- 4b. the mouth radiates the derivative, and it shows

/**
 * A mouth is a piston radiating into open air, and the pressure it produces is
 * the **derivative** of the volume flow through it. A derivative is +6 dB per
 * octave, exactly, and that tilt is why speech has the spectral slope it has and
 * why a synthesizer without it sounds like it is speaking through a blanket.
 *
 * It is also measurable without any special pleading. Below the first formant
 * the whole cascade is flat — every resonator is above — so whatever slope the
 * spectrum has down there is the radiation and nothing else. Measured between
 * 50 and 150 Hz it comes out at **6.07 dB/octave** for the open vowels, and
 * creeps above 6 for the close ones exactly as F1 descends toward the band and
 * its own skirt starts to contribute. The number is not fitted; it is what a
 * first difference does.
 */
{
  const SLOPE = [];
  for (const key of VOWEL_KEYS) {
    const mag = spectrum(renderVowel(key, voiceOf(), { seconds: 4, sampleRate: SR, f0: 0, seed: 7 }), FFT);
    const binHz = SR / FFT;
    const at = (hz) => mag[Math.round(hz / binHz)];
    SLOPE.push({ key, f1: formantsOf(key)[0], slope: (at(150) - at(50)) / Math.log2(3) });
  }
  const flattest = SLOPE.reduce((a, b) => (b.slope < a.slope ? b : a));
  if (!(Math.abs(flattest.slope - 6) < 0.3)) {
    fail(`below F1 the spectrum rises at ${flattest.slope.toFixed(2)} dB/octave, and a first difference rises at 6`);
  }
  // ...and the deviation from 6 has to be the F1 skirt rather than noise, so it
  // has to be one-signed: every vowel at or ABOVE six, never below.
  const under = SLOPE.filter((s) => s.slope < 5.9);
  if (under.length) {
    fail(`${under.map((s) => `/${VOWELS[s.key].ipa}/ at ${s.slope.toFixed(2)}`).join(', ')} — below the radiation slope, which nothing in the model can do`);
  }
  var radiation = { slope: SLOPE, flattest };
}

// ------------------------------- 5. the chart really is the formant table

/** Spearman's rank correlation. */
function spearman(xs, ys) {
  const rank = (v) => {
    const order = v.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
    const r = new Array(v.length);
    for (let i = 0; i < order.length; i++) r[order[i][1]] = i;
    return r;
  };
  const rx = rank(xs);
  const ry = rank(ys);
  const n = xs.length;
  let d2 = 0;
  for (let i = 0; i < n; i++) d2 += (rx[i] - ry[i]) ** 2;
  return 1 - (6 * d2) / (n * (n * n - 1));
}

const heights = VOWEL_KEYS.map((k) => VOWELS[k].height);
const f1s = VOWEL_KEYS.map((k) => VOWELS[k].f1);
const backs = VOWEL_KEYS.map((k) => VOWELS[k].back + VOWELS[k].round);
const f2s = VOWEL_KEYS.map((k) => VOWELS[k].f2);
const rhoF1 = spearman(heights, f1s);
const rhoF2 = spearman(backs, f2s);

// F1 IS the chart's vertical axis. Not correlated with it — it is it.
if (!(rhoF1 > 0.97)) {
  fail(`F1 ranks against the IPA's own vowel height at ρ = ${rhoF1.toFixed(3)}, which is not "the chart is the table"`);
}
// F2 falls as the tongue goes back and the lips round. Strong, and not perfect,
// because two axes are being collapsed onto one number.
if (!(rhoF2 < -0.85)) {
  fail(`F2 ranks against backness+rounding at ρ = ${rhoF2.toFixed(3)}`);
}

// ...and the vowels have to be TELLABLE APART in the plane the ear uses.
let closest = Infinity;
let closestPair = '';
for (let i = 0; i < VOWEL_KEYS.length; i++) {
  for (let j = i + 1; j < VOWEL_KEYS.length; j++) {
    const a = VOWELS[VOWEL_KEYS[i]];
    const b = VOWELS[VOWEL_KEYS[j]];
    // Mel-ish: the ear resolves low frequencies far more finely than high, so
    // a plain hertz distance would call /i/ and /ɪ/ further apart than /ɑ/ and
    // /ɔ/, which is the opposite of what a listener does.
    const d = Math.hypot(Math.log(a.f1 / b.f1), Math.log(a.f2 / b.f2));
    if (d < closest) { closest = d; closestPair = `/${a.ipa}/ and /${b.ipa}/`; }
  }
}
if (!(closest > 0.1)) fail(`${closestPair} are the same vowel to within ${closest.toFixed(3)} in log-formant space`);

// ------------------------------------- 6. the body, and the things it must not do

{
  close(tractLengthFor(1.75), REFERENCE_TRACT, 1e-12, 'a 1.75 m body is not a 17.5 cm tract');
  const tall = voiceOf({ height: 2.0 });
  const short = voiceOf({ height: 1.4 });
  if (!(tall.f0 < short.f0)) fail('a taller body did not get a lower voice');
  // Formants scale as 1/L exactly — that is the whole model, so it had better.
  const a = formantsOf('A', 0.2);
  const b = formantsOf('A', 0.1);
  for (let i = 0; i < 3; i++) close(b[i] / a[i], 2, 1e-9, 'halving the tract did not double the formants');

  // A voice must come out finite and bounded no matter what it is handed.
  for (const opts of [{ seconds: 0 }, { f0: 0 }, { f0: 5000 }, { seconds: 0.05, sampleRate: 8000 }]) {
    const buf = renderVowel('A', voiceOf(), { ...opts, seed: 3 });
    for (let i = 0; i < buf.length; i++) {
      if (!Number.isFinite(buf[i]) || Math.abs(buf[i]) > 1.0001) {
        fail(`rendering with ${JSON.stringify(opts)} produced ${buf[i]} at sample ${i}`);
        break;
      }
    }
  }
  // An unknown vowel is a schwa, not a crash.
  close(formantsOf('zzz')[0], VOWELS['@'].f1, 1e-9, 'an unknown vowel was not the neutral one');
  // And a glide between vowels is one continuous signal.
  const glide = renderVoice(
    [{ vowel: 'i', seconds: 0.2 }, { vowel: 'A', seconds: 0.2 }, { vowel: 'u', seconds: 0.2 }],
    voiceOf(), { sampleRate: SR, seed: 5 }
  );
  if (glide.length !== Math.round(0.6 * SR)) fail(`a 0.6 s utterance came out ${glide.length} samples`);
  let jump = 0;
  for (let i = 1; i < glide.length; i++) jump = Math.max(jump, Math.abs(glide[i] - glide[i - 1]));
  if (!(jump < 0.5)) fail(`the glide between vowels stepped by ${jump.toFixed(3)} in one sample`);
  var bodyChecks = { jump };
}

// ------------------------------------------------------------------- report

if (json) {
  console.log(JSON.stringify({
    failures, tube, selfCheck, women, children, octave, source, radiation, chipmunk, outlier,
    rhoF1, rhoF2, closest, bodyChecks,
  }, null, 2));
} else {
  const worstSelf = selfCheck.reduce((a, b) => (b.worst > a.worst ? b : a));
  console.log('voice — a tube, a length, and the speed of sound\n');
  console.log('  THE NEUTRAL VOWEL, DERIVED');
  console.log(`    a ${REFERENCE_TRACT * 100} cm tube closed at one end resonates at (2n−1)c/4L:`);
  console.log(`      ${tube.map((f) => f.toFixed(0)).join(' / ')} Hz     textbook neutral: 500 / 1500 / 2500\n`);

  console.log('  THE SYNTHESIZER, ANALYSED OUT OF ITS OWN OUTPUT');
  console.log('  (whispered — noise through the filter, no vocal folds at all)');
  console.log('    tract      vowels   worst offset from target   worst in Hz');
  for (const [label, tract] of TRACTS) {
    const mine = selfCheck.filter((r) => r.label === label);
    const w = mine.reduce((a, b) => (b.worst > a.worst ? b : a));
    console.log(
      `    ${label.padEnd(8)} ${String(mine.length).padStart(4)}       ` +
        `${w.worst.toFixed(2)} of a bandwidth       ${(w.relative * 100).toFixed(1)}%   at /${VOWELS[w.key].ipa}/`
    );
  }
  console.log(`    ${selfCheck.length} formants, every one inside ${OFFSET_BUDGET} of its own bandwidth.`);
  console.log(`    The budget is BANDWIDTHS, which is in the module: a peak cannot be`);
  console.log(`    found to better than a fraction of its own width, and is not asked to.\n`);

  console.log('  OUT OF SAMPLE — ONE LENGTH, A WHOLE OTHER POPULATION');
  console.log('  Peterson & Barney (1952) measured men, women and children. Only the men');
  console.log('  are in this library. The other two rows build nothing and are only');
  console.log('  compared against, which is the only reason the comparison means anything.');
  for (const p of [women, children]) {
    console.log(`\n    ${p.label} — ${(p.tract * 100).toFixed(1)} cm tract, ratio ${p.ratio.toFixed(3)}`);
    console.log('      vowel    P&B F1/F2     model      heard        model err   heard err');
    for (const row of p.rows) {
      console.log(
        `      /${VOWELS[row.key].ipa}/     ${row.truth[0].toString().padStart(4)} ${row.truth[1].toString().padStart(4)}` +
          `   ${row.want.map((f) => f.toFixed(0).padStart(4)).join(' ')}  ${row.got.map((f) => f.toFixed(0).padStart(4)).join(' ')}` +
          `    ${((row.want[0] / row.truth[0] - 1) * 100).toFixed(0).padStart(4)}% ${((row.want[1] / row.truth[1] - 1) * 100).toFixed(0).padStart(4)}%` +
          `   ${(row.e1 * 100).toFixed(0).padStart(4)}% ${(row.e2 * 100).toFixed(0).padStart(4)}%`
      );
    }
    console.log(
      `      model ${(p.model.mean * 100).toFixed(1)}% mean — and the BEST any single ratio can do is ` +
        `${(p.floor * 100).toFixed(1)}%, at ${p.fitted.toFixed(3)}.`
    );
    console.log(
      `      Two measured lengths, shown none of these rows, cost ` +
        `${((p.model.mean - p.floor) * 100).toFixed(1)} points against a ratio that was handed them.`
    );
    console.log(
      `      Rendered: ${(p.heard * 100).toFixed(1)}% mean, and every formant within ` +
        `${p.offsetWorst.toFixed(2)} of a bandwidth of its own target.`
    );
  }
  console.log(`\n    The residual belongs to the data. P&B's own /ɔ/ scales men→women at`);
  console.log(`    ${outlier.oh.toFixed(3)} where a typical vowel runs ${outlier.typical.toFixed(3)} — a larynx descends at puberty and a`);
  console.log('    tract does not scale uniformly. No one number can pretend otherwise.');

  console.log('\n  PITCH IS NOT THE VOWEL');
  console.log('    Not "the peak stayed put" — above F0 a peak is resolvable and below it');
  console.log('    there is nothing to resolve, because a buzz every F0 hertz never excites');
  console.log('    what lies underneath. The SHAPE is the claim, against the same vowel at 90 Hz.');
  console.log('    vowel   F0     envelope match    F1 resolvable at this pitch?');
  for (const o of octave) {
    console.log(
      `    /${VOWELS[o.key].ipa}/    ${o.f0.toString().padStart(3)}        ${o.match.toFixed(3)}` +
        `           ${o.resolvable ? 'yes' : `no — F1 ${formantsOf(o.key)[0].toFixed(0)} Hz is below the first harmonic`}`
    );
  }
  console.log('    And the SOURCE is a source: a vowel asked to buzz at');
  console.log(`      ${source.voiced.map((v) => `${v.f0} Hz repeats at ${v.hz.toFixed(0)} (${v.strength.toFixed(2)} periodic)`).join('\n      ')}`);
  console.log(`    ...and the whisper comes back ${source.breath.strength.toFixed(2)} periodic at ${source.breath.hz.toFixed(0)} Hz, which is a 60 Hz-wide`);
  console.log(`    resonance ringing, not a pitch: it is ${(source.nearest * 100).toFixed(0)}% away from the nearest thing asked for.`);
  console.log(`    The control: pitch-shifting by RESAMPLING moves F1 by ${chipmunk.moved.toFixed(2)}× for a`);
  console.log(`    ${chipmunk.ratio}× shift and leaves the envelope only ${chipmunk.match.toFixed(3)} like the original.`);
  console.log('    That is the chipmunk, and it is what a recorded sample does.\n');

  console.log('  THE MOUTH RADIATES THE DERIVATIVE');
  console.log('    Below F1 the cascade is flat, so the slope down there is the lips alone.');
  console.log('    A first difference is +6 dB/octave exactly. Measured 50→150 Hz:');
  console.log(`      ${[...radiation.slope].sort((a, b) => b.f1 - a.f1).map((s) => `/${VOWELS[s.key].ipa}/ F1 ${s.f1.toFixed(0).padStart(3)} → ${s.slope.toFixed(2)}`).join('\n      ')}`);
  console.log(`    ${radiation.flattest.slope.toFixed(2)} at the open end, drifting up as F1 comes down into the band`);
  console.log('    and its own skirt joins in. Nothing was fitted to make that 6.\n');

  console.log('  AND THE CHART IS THE TABLE');
  console.log(`    F1 against the IPA's own vowel height:        ρ = ${rhoF1.toFixed(3)}`);
  console.log(`    F2 against backness + rounding:               ρ = ${rhoF2.toFixed(3)}`);
  console.log('    ANIMA reads the same two axes to draw a mouth, and imports nothing.');
  console.log('    It has no BACKNESS, correctly — a tongue is not visible. An ear hears it.');
  void worstSelf;
}

if (failures.length) {
  console.error('\nVOICE OVER BUDGET');
  for (const l of failures) console.error(`  ${l}`);
  console.error('\nA vocal tract is a tube. If the voice stopped agreeing with 1952, the voice moved.');
  process.exit(1);
}
if (!json) console.log('\nvoice: the vowel is in the filter, and the filter is a length ✓');
