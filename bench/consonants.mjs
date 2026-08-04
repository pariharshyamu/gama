#!/usr/bin/env node
/**
 * The consonant gate — three claims, and none of them is about a table.
 *
 *   npm run consonants            fail if a consonant stops being one
 *   npm run consonants -- --json  the numbers, machine-readable
 *
 * 1. **A stop is a TRANSITION.** Delattre, Liberman & Cooper (1955) found that
 *    listeners identify /b/, /d/ and /g/ from where F2 is HEADING as the vowel
 *    starts, not from the burst. Each stop has a locus the transition points
 *    back to. The gate renders each stop before all ten vowels, measures F2 at
 *    voicing onset, extrapolates back along the transition, and checks the ten
 *    extrapolations agree on one number — WITHOUT being told what it is.
 *
 * 2. **The /p/ vs /b/ distinction is a DURATION.** Lisker & Abramson (1964) measured voice onset
 *    time across languages. English: /b/ 1 ms, /d/ 5, /g/ 21, /p/ 58, /t/ 70,
 *    /k/ 80. The gate finds voicing onset in the rendered audio, measures VOT
 *    from the release, and checks both the values and a shape nobody put in on
 *    purpose — VOT rises as the closure moves back through the mouth.
 *
 * 3. **A nasal needs a ZERO.** A closed oral cavity hangs off the path as a dead
 *    end and SUBTRACTS a frequency. No cascade of resonators can do that at any
 *    setting, which is why `voice.ts` was never going to say /m/. The gate finds
 *    the notch, and runs an all-pole version alongside as the control.
 */
import {
  CONSONANTS, COARTICULATION, VOWELS, VOWEL_KEYS, formantsOf, frameTimes,
  renderSpeech, voiceOf,
} from '../dist/index.js';
import { peaks, pitchIn, spectrum } from './formants.mjs';

const json = process.argv.includes('--json');
const failures = [];
const fail = (l) => failures.push(l);
const SR = 22050;
const FFT = 2048;
const mean = (a) => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
const VOICE = voiceOf({ height: 1.75 });

// ------------------------------------------------------------ the analysers

/** Short-time spectrum of one slice, in dB. */
function sliceSpectrum(buf, fromSeconds, toSeconds, size = FFT) {
  const a = Math.max(0, Math.round(fromSeconds * SR));
  const b = Math.min(buf.length, Math.round(toSeconds * SR));
  const slice = buf.subarray(a, Math.max(b, a + size));
  return spectrum(slice, size);
}

/**
 * The strongest peak in a band. Used for F2, which during a transition is a
 * moving target and cannot be found by the vowel picker in `formants.mjs` —
 * that one wants a steady spectrum and three formants at once.
 */
function peakIn(mag, lo, hi) {
  const bin = SR / (mag.length * 2);
  const a = Math.max(1, Math.ceil(lo / bin));
  const b = Math.min(mag.length - 2, Math.floor(hi / bin));
  let best = -Infinity;
  let at = 0;
  for (let i = a; i <= b; i++) {
    if (mag[i] > best && mag[i] >= mag[i - 1] && mag[i] >= mag[i + 1]) { best = mag[i]; at = i * bin; }
  }
  return at || NaN;
}

/**
 * The deepest true NOTCH in a band, and how deep it is.
 *
 * A notch is a local minimum with a rise on BOTH sides, and its depth is
 * measured against the nearest local maximum each way. The first version took
 * the lowest bin in the band and measured it against the highest bin anywhere
 * to either side, which on a spectrum that simply slopes downward reports the
 * band edge as a 70 dB notch — it scored all-pole /n/ deeper than the real
 * thing and would have "proved" that a cascade of poles produces antiformants.
 */
function notchIn(mag, lo, hi) {
  const bin = SR / (mag.length * 2);
  const a = Math.max(2, Math.ceil(lo / bin));
  const b = Math.min(mag.length - 3, Math.floor(hi / bin));
  let bestDepth = 0;
  let at = NaN;
  for (let i = a; i <= b; i++) {
    if (!(mag[i] <= mag[i - 1] && mag[i] <= mag[i + 1])) continue;
    // Climb to the nearest local maximum in each direction.
    let left = mag[i];
    for (let j = i - 1; j >= 1; j--) {
      if (mag[j] < mag[j + 1]) break;
      left = mag[j];
    }
    let right = mag[i];
    for (let j = i + 1; j < mag.length - 1; j++) {
      if (mag[j] < mag[j - 1]) break;
      right = mag[j];
    }
    const depth = Math.min(left, right) - mag[i];
    if (depth > bestDepth) { bestDepth = depth; at = i * bin; }
  }
  return { hz: at, depth: bestDepth };
}

/** RMS of a slice. */
function rms(buf, fromSeconds, toSeconds) {
  const a = Math.max(0, Math.round(fromSeconds * SR));
  const b = Math.min(buf.length, Math.round(toSeconds * SR));
  let s = 0;
  for (let i = a; i < b; i++) s += buf[i] * buf[i];
  return Math.sqrt(s / Math.max(1, b - a));
}

// ------------------------------- 1. THE LOCUS IS THE CONSONANT, NOT THE VOWEL

/**
 * F2 at the moment voicing begins, for one consonant-vowel pair.
 *
 * Whispered. A voiced spectrum is a comb, and reading a MOVING formant through
 * a comb in a twelve-millisecond window is hopeless — the first version of this
 * gate picked F1 for half the vowels and put /d/'s locus at 465 Hz. The filter
 * is the same filter whatever the folds are doing, so the transition is
 * identical and there is nothing in the way of seeing it.
 */
function onsetF2(consonant, vowelKey) {
  const phones = [{ phone: consonant }, { phone: vowelKey, seconds: 0.28 }];
  const buf = renderSpeech(phones, VOICE, { sampleRate: SR, seed: 11, f0: 0 });
  const times = frameTimes(phones, VOICE, { sampleRate: SR, seed: 11 });
  const release = times[times.length - 2].to;
  // Bounded, not indexed. Asking a prominence picker for "the second formant"
  // needs it to find the FIRST, and an eleven-millisecond window cannot resolve
  // a 280 Hz resonance — so it returned F1 and F2 as peaks 0 and 1 for some
  // vowels and F2 and F3 for others, which read /du/'s onset as 2498 Hz when the
  // model had put it at 1381. The band below is bounded by the phones
  // themselves: no F1 here reaches 600 Hz at release, and no F3 falls below
  // 2400, so anything in between is F2 and nothing else can be.
  return peakIn(sliceSpectrum(buf, release + 0.001, release + 0.013, 256), 600, 2350);
}

/**
 * The LOCUS EQUATION (Sussman, McCaffrey & Matthews, 1991).
 *
 * Plot F2 at voicing onset against the vowel's own F2, over many vowels, and
 * the points fall on a straight line — one line per consonant, tight enough
 * that its slope and intercept are a signature of the place of articulation.
 * A slope of 1 would mean the consonant does nothing and the vowel is already
 * fully there; a slope of 0 would mean total resistance, every vowel starting
 * from the identical frequency. Real English stops sit in between, and the
 * published slopes are /b/ about 0.87 and /d/ about 0.43 — the alveolar closure
 * constrains the tongue far more than the lips do.
 *
 * This is measured rather than extrapolated on purpose. An earlier version fitted
 * a line through two windows inside each transition and read the intercept: it
 * worked for /d/ and fell apart for /b/, whose locus at 720 Hz sits so near F1
 * that a 23 ms window smears the two together. A regression over ten vowels does
 * not care, because the smear is the same in every one of them.
 */
function locusEquation(consonant) {
  const xs = [];
  const ys = [];
  for (const v of VOWEL_KEYS) {
    const y = onsetF2(consonant, v);
    if (!Number.isFinite(y)) continue;
    xs.push(formantsOf(v, VOICE.tract)[1]);
    ys.push(y);
  }
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let den = 0;
  for (let i = 0; i < xs.length; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2; }
  const slope = num / den;
  const intercept = my - slope * mx;
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < xs.length; i++) {
    ssRes += (ys[i] - (slope * xs[i] + intercept)) ** 2;
    ssTot += (ys[i] - my) ** 2;
  }
  // The locus is the line's FIXED POINT: where onset F2 equals the vowel's own,
  // which is the frequency at which the consonant asks for nothing.
  const locus = slope < 0.999 ? intercept / (1 - slope) : NaN;
  return { xs, ys, slope, intercept, r2: 1 - ssRes / ssTot, locus, published: CONSONANTS[consonant].locus };
}

const loci = {};
for (const c of ['b', 'd', 'g']) loci[c] = locusEquation(c);

// (a) IT HAS TO BE A LINE. That is Sussman's finding and it is not guaranteed
//     by anything in the model — ten vowels spanning 1450 Hz of F2 could easily
//     have scattered.
for (const c of ['b', 'd']) {
  if (!(loci[c].r2 > 0.9)) {
    fail(`/${c}/'s locus equation has R² = ${loci[c].r2.toFixed(3)} — the onsets do not fall on a line, so there is no locus`);
  }
}
// (b) THE SLOPES ORDER THE WAY THE MOUTH DOES. A labial closure leaves the
//     tongue free to be most of the way into the vowel already; an alveolar one
//     pins it. Published: /b/ 0.87, /d/ 0.43.
//
//     BE CLEAR ABOUT WHAT THIS IS. `COARTICULATION` puts those coefficients in
//     and this measures them back out, so it is a round trip through the whole
//     renderer and analyser and NOT an independent prediction. What it does
//     check is that the coefficients survive being turned into audio and read
//     off a spectrum — which they did not, twice, on the way to this line. The
//     load-bearing claims in this file are the nasal zero, which has a control
//     that must fail, and the reversal below, which is a consequence rather
//     than an input.
if (!(loci.b.slope > loci.d.slope + 0.15)) {
  fail(`/b/ and /d/ have locus-equation slopes ${loci.b.slope.toFixed(2)} and ${loci.d.slope.toFixed(2)} — an alveolar closure is not resisting coarticulation more than a labial one`);
}
// (b2) THE REVERSAL, which nobody put in. The same /d/ before /i/ has an F2 that
//      RISES into the vowel and before /u/ one that FALLS — opposite directions,
//      one consonant, because the locus is above one vowel's F2 and below the
//      other's. This is the thing Delattre's listeners were using when the
//      bursts had been cut off, and it falls out of the locus rather than being
//      specified anywhere.
{
  const rise = (v) => {
    const onset = onsetF2('d', v);
    const target = formantsOf(v, VOICE.tract)[1];
    return { v, onset, target, direction: Math.sign(target - onset) };
  };
  const front = rise('i');
  const back = rise('u');
  if (!(front.direction > 0 && back.direction < 0)) {
    fail(`/di/ moves ${front.onset.toFixed(0)}→${front.target.toFixed(0)} and /du/ ${back.onset.toFixed(0)}→${back.target.toFixed(0)} — the transitions do not reverse, so there is nothing for a listener to use`);
  }
  var reversal = { front, back };
}
// (c) ...and the fixed points have to be far apart, and near where Delattre's
//     team put them. That difference is what his listeners heard when the
//     bursts were cut off entirely.
for (const c of ['b', 'd']) {
  if (!(Math.abs(loci[c].locus / loci[c].published - 1) < 0.3)) {
    fail(`/${c}/'s locus equation crosses at ${loci[c].locus.toFixed(0)} Hz against a published ${loci[c].published}`);
  }
}
if (!(loci.d.locus - loci.b.locus > 600)) {
  fail(`/b/ and /d/ have loci at ${loci.b.locus.toFixed(0)} and ${loci.d.locus.toFixed(0)} Hz — only ${(loci.d.locus - loci.b.locus).toFixed(0)} apart`);
}
// (d) AND A VELAR HAS NO LOCUS AT ALL, stated as a positive claim rather than
//     printed as a NaN and hoped past. Its slope comes out at or above 1: the
//     tongue body IS the closure, so where the closure lands follows the vowel
//     completely and there is no frequency the transitions point back to. A
//     line with a slope of one never crosses the diagonal.
if (!(loci.g.slope > 0.95)) {
  fail(`/g/'s locus equation has a slope of ${loci.g.slope.toFixed(2)}, which means a velar has a fixed place of articulation — it does not`);
}
if (Number.isFinite(loci.g.locus)) {
  fail(`/g/'s locus equation crosses the diagonal at ${loci.g.locus.toFixed(0)} Hz — a velar should not have a locus to cross at`);
}

// --------------------------------- 2. VOICE ONSET TIME, against 1964

/**
 * Find voicing onset by looking for PERIODICITY, not for loudness.
 *
 * Aspiration is loud. An energy threshold finds the burst and calls that the
 * start of the vowel, which would report every VOT as about zero and would have
 * passed silently — the first version of this gate did exactly that.
 */
function measureVOT(consonant) {
  const phones = [{ phone: consonant }, { phone: 'A', seconds: 0.3 }];
  const buf = renderSpeech(phones, VOICE, { sampleRate: SR, seed: 11 });
  const times = frameTimes(phones, VOICE, { sampleRate: SR, seed: 11 });
  const burst = times.find((f) => f.label.endsWith(':burst'));
  const release = burst ? burst.from : 0;
  const step = 0.004;
  const window = 0.035;
  for (let t = release; t < release + 0.25; t += step) {
    const got = pitchIn(buf, t * SR, (t + window) * SR, SR, 80, 300);
    if (got && got.strength > 0.6) return { vot: (t - release) * 1000, at: t, hz: got.hz };
  }
  return { vot: NaN, at: NaN, hz: NaN };
}

/** Lisker & Abramson (1964), English word-initial. Builds nothing here. */
const LA_1964 = { b: 1, d: 5, g: 21, p: 58, t: 70, k: 80 };
const vot = {};
for (const c of Object.keys(LA_1964)) vot[c] = measureVOT(c);

{
  // (a) The two series have to separate — that IS the voicing contrast.
  const voiced = ['b', 'd', 'g'].map((c) => vot[c].vot);
  const voiceless = ['p', 't', 'k'].map((c) => vot[c].vot);
  if (!(Math.max(...voiced) < Math.min(...voiceless))) {
    fail(`voiced VOTs ${voiced.map((v) => v.toFixed(0))} overlap voiceless ${voiceless.map((v) => v.toFixed(0))}`);
  }
  // (b) ...and land near the published values. The budget is one PITCH PERIOD:
  //     voicing can only start when the folds next close, so a VOT measured off
  //     a 118 Hz voice is quantised to 8.5 ms whatever the model intended.
  const period = 1000 / VOICE.f0;
  for (const [c, want] of Object.entries(LA_1964)) {
    if (!(Math.abs(vot[c].vot - want) <= period * 2)) {
      fail(`/${c}/ has a voice onset time of ${vot[c].vot.toFixed(0)} ms against Lisker & Abramson's ${want} (budget ${(period * 2).toFixed(0)} ms, two pitch periods)`);
    }
  }
  // (c) THE SHAPE NOBODY PUT IN. VOT rises as the closure moves back through the
  //     mouth — labial, alveolar, velar — in BOTH series independently. That is
  //     a property of how far the air has to travel, not of the table.
  for (const series of [['b', 'd', 'g'], ['p', 't', 'k']]) {
    const v = series.map((c) => vot[c].vot);
    if (!(v[0] <= v[1] && v[1] <= v[2])) {
      fail(`/${series.join('/ /')}/ have VOTs ${v.map((x) => x.toFixed(0))} — not rising with place of articulation`);
    }
  }
  var votPeriod = period;
}

// ------------------------------------ 3. THE NASAL ZERO, AND WHAT LACKS ONE

/**
 * Measure the zero as a DIFFERENCE, not as a dip.
 *
 * An all-pole spectrum has valleys between its formants, and they can be forty
 * decibels deep — the first version of this section looked for the lowest point
 * in a band and duly reported all-pole /m/ as having a deeper "notch" than the
 * real thing, which would have proved the exact opposite of the claim.
 *
 * What an antiresonator actually does is SUBTRACT, so the honest measurement is
 * the same phone rendered twice, with and without its zero, and the difference
 * between the two spectra. That difference is flat wherever the zero is not and
 * plunges where it is, and there is no arrangement of poles that can make a
 * filter quieter than itself.
 *
 * Both renders are normalised independently, so the difference carries an
 * arbitrary constant. Its MEDIAN is that constant; depth is measured from there.
 */
function nasalZero(c) {
  const phones = [{ phone: c }, { phone: 'A', seconds: 0.2 }];
  const times = frameTimes(phones, VOICE);
  const murmur = times[0];
  const render = (options) => renderSpeech(phones, VOICE, { sampleRate: SR, seed: 11, f0: 0, ...options });
  const withZero = sliceSpectrum(render({}), murmur.from + 0.012, murmur.to - 0.004);
  const allPole = sliceSpectrum(render({ noNasalZero: true }), murmur.from + 0.012, murmur.to - 0.004);
  const bin = SR / (withZero.length * 2);
  const lo = Math.ceil(300 / bin);
  const hi = Math.min(withZero.length - 2, Math.floor(5000 / bin));
  const diff = [];
  for (let i = lo; i <= hi; i++) diff.push({ hz: i * bin, d: withZero[i] - allPole[i] });
  const sorted = [...diff].map((x) => x.d).sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  let worst = diff[0];
  for (const x of diff) if (x.d < worst.d) worst = x;
  // How local is it? The fraction of the band the zero moves by more than a
  // third of its own depth. An antiformant is a notch; a gain change is not.
  const depth = median - worst.d;
  const touched = diff.filter((x) => median - x.d > depth / 3).length / diff.length;
  return { hz: worst.hz, depth, touched, median };
}

const nasals = {};
for (const c of ['m', 'n', 'N']) {
  const spec = CONSONANTS[c];
  const got = nasalZero(c);
  nasals[c] = { published: spec.zero, ...got };

  // (a) The subtraction has to happen where the side branch says it does.
  if (!(Math.abs(got.hz / spec.zero - 1) < 0.3)) {
    fail(`/${spec.ipa}/'s antiformant should sit near ${spec.zero} Hz and the zero takes most out at ${got.hz.toFixed(0)}`);
  }
  // (b) It has to take out a real amount.
  if (!(got.depth > 12)) {
    fail(`/${spec.ipa}/'s zero only removes ${got.depth.toFixed(1)} dB`);
  }
  // (c) THE CONTROL, and it is the architectural claim. It has to be LOCAL. A
  //     filter that came out uniformly quieter would just be a gain change, and
  //     a gain change is something a cascade of poles can do perfectly well.
  if (!(got.touched < 0.4)) {
    fail(`/${spec.ipa}/'s zero changes ${(got.touched * 100).toFixed(0)}% of the band — that is a gain change, not an antiformant`);
  }
}
// ...and the three zeros have to ORDER by how much oral cavity is left hanging
// off the path: /m/ closes at the lips and keeps the whole mouth, /ŋ/ closes at
// the velum and keeps almost none. A shorter side branch resonates higher.
{
  const order = ['m', 'n', 'N'].map((c) => nasals[c].hz);
  if (!(order[0] < order[1] && order[1] < order[2])) {
    fail(`the nasal antiformants measure ${order.map((h) => h.toFixed(0))} — not rising as the side branch shortens`);
  }
}
// A VOWEL has no zero at all, so asking for one changes nothing. If this
// difference were not identically flat, `noNasalZero` would be doing something
// other than what it says and the control above would be measuring it.
{
  const phones = [{ phone: 'A', seconds: 0.2 }];
  const a = renderSpeech(phones, VOICE, { sampleRate: SR, seed: 11, f0: 0 });
  const b = renderSpeech(phones, VOICE, { sampleRate: SR, seed: 11, f0: 0, noNasalZero: true });
  let worst = 0;
  for (let i = 0; i < a.length; i++) worst = Math.max(worst, Math.abs(a[i] - b[i]));
  if (!(worst < 1e-9)) fail(`removing the nasal zero changed a VOWEL by ${worst} — it is not only touching nasals`);
}

// -------------------------------------------- 4. fricatives are their cavity

/**
 * All three in ONE utterance, because `renderSpeech` normalises its output.
 *
 * Rendered separately, every fricative comes back at exactly the same peak
 * amplitude and a level comparison measures nothing at all — the first version
 * of this gate reported /s/ as 1.0x the level of /f/ and was reading its own
 * normaliser. Inside one buffer the gain is shared and the levels are real.
 */
const FRIC_PHONES = [
  { phone: 's' }, { phone: 'A', seconds: 0.12 },
  { phone: 'S' }, { phone: 'A', seconds: 0.12 },
  { phone: 'f' }, { phone: 'A', seconds: 0.12 },
];
const FRIC_BUF = renderSpeech(FRIC_PHONES, VOICE, { sampleRate: SR, seed: 11 });
const FRIC_TIMES = frameTimes(FRIC_PHONES, VOICE);
const fricatives = {};
for (const c of ['f', 's', 'S']) {
  const times = [FRIC_TIMES.find((f) => f.label === c)];
  const buf = FRIC_BUF;
  const mag = sliceSpectrum(buf, times[0].from + 0.02, times[0].to - 0.01);
  // Spectral centroid over the band frication lives in.
  const bin = SR / (mag.length * 2);
  let num = 0;
  let den = 0;
  for (let i = Math.ceil(500 / bin); i < mag.length; i++) {
    const p = Math.pow(10, mag[i] / 20);
    num += i * bin * p;
    den += p;
  }
  fricatives[c] = {
    centroid: num / den,
    level: rms(buf, times[0].from + 0.02, times[0].to - 0.01),
  };
}
{
  // /s/ is shaped by a centimetre or two of cavity in front of the constriction
  // and sits high; /ʃ/'s cavity is bigger so it sits lower; /f/ has essentially
  // none, so it is diffuse AND about 20 dB quieter. That last part is why /f/
  // and /θ/ are the English consonants people mishear most.
  if (!(fricatives.s.centroid > fricatives.S.centroid)) {
    fail(`/s/ has a centroid of ${fricatives.s.centroid.toFixed(0)} Hz against /ʃ/'s ${fricatives.S.centroid.toFixed(0)} — a sibilant's pitch is its front cavity`);
  }
  // TWO-SIDED, and against the RIGHT NUMBER. Fletcher (1953) gives /s/ a
  // relative phonetic power of 16 and /f/ of 4, and those are POWERS, so the
  // gap is 10·log₁₀(4) = 6 dB — not the 20 this gate asserted for two releases.
  // A dB is not a dB: amplitudes take 20 and powers take 10, and that same
  // confusion put a 15 dB overshoot into the frication balance before anyone
  // caught it by listening.
  //
  // The check stays two-sided, which is what earned it: a one-sided "louder
  // than /f/" version passed happily while /f/ was 57 dB down and inaudible,
  // which is what a CASCADE of separated bandpasses does — three narrow filters
  // in series multiply, and almost nothing survives all three.
  const dB = 20 * Math.log10(fricatives.s.level / fricatives.f.level);
  if (!(dB > 2 && dB < 14)) {
    fail(`/s/ is ${dB.toFixed(0)} dB above /f/ against Fletcher's 6 — ${dB > 14 ? '/f/ is inaudible, not quiet' : '/f/ is not quiet enough'}`);
  }
}

// ------------------------------------------- 5. the things it must not do

{
  const guards = [];
  // Every phone, alone and before a vowel, finite and bounded.
  for (const c of Object.keys(CONSONANTS)) {
    const buf = renderSpeech([{ phone: c }, { phone: 'i', seconds: 0.12 }], VOICE, {
      sampleRate: SR, seed: 3,
    });
    let bad = false;
    for (let i = 0; i < buf.length; i++) {
      if (!Number.isFinite(buf[i]) || Math.abs(buf[i]) > 1.0001) { bad = true; break; }
    }
    if (bad) fail(`/${CONSONANTS[c].ipa}/ before /i/ produced a non-finite or clipped sample`);
    guards.push(buf.length);
  }
  // An empty utterance, an unknown phone, a whisper, a silly sample rate.
  if (renderSpeech([], VOICE).length < 1) fail('an empty utterance produced no buffer');
  for (const options of [{ f0: 0 }, { sampleRate: 8000 }, { vowelSeconds: 0 }]) {
    const buf = renderSpeech([{ phone: 'zzz' }, { phone: 's' }, { phone: 'A' }], VOICE, {
      seed: 4, ...options,
    });
    for (let i = 0; i < buf.length; i++) {
      if (!Number.isFinite(buf[i])) { fail(`rendering with ${JSON.stringify(options)} produced ${buf[i]}`); break; }
    }
  }
  // A stop's closure is SILENT, which is the point of a stop.
  {
    const phones = [{ phone: 'A', seconds: 0.12 }, { phone: 'p' }, { phone: 'A', seconds: 0.12 }];
    const buf = renderSpeech(phones, VOICE, { sampleRate: SR, seed: 11 });
    const times = frameTimes(phones, VOICE);
    const closure = times.find((f) => f.label === 'p:closure');
    const quiet = rms(buf, closure.from + 0.02, closure.to - 0.01);
    const loud = rms(buf, 0.02, 0.1);
    if (!(quiet < loud * 0.05)) {
      fail(`a /p/ closure is ${(quiet / loud * 100).toFixed(0)}% as loud as the vowel beside it — a stop that does not stop`);
    }
    var closureRatio = quiet / loud;
  }
  var guardCount = guards.length;
}

// ------------------------------------------------------------------- report

if (json) {
  console.log(JSON.stringify({ failures, loci, vot, published: LA_1964, nasals, fricatives, closureRatio }, null, 2));
} else {
  console.log('consonants — a stop is a transition, and a nasal needs a zero\n');

  console.log('  1. THE LOCUS IS THE CONSONANT');
  console.log('  F2 at voicing onset, against the vowel\'s own F2, over ten vowels whose');
  console.log('  F2s span 840 to 2290 Hz. Sussman et al. (1991) found the points fall on');
  console.log('  a line — one per place of articulation.\n');
  console.log('    stop    slope    R²      fixed point    Delattre et al. (1955)');
  for (const c of ['b', 'd', 'g']) {
    console.log(
      `    /${c}/      ${loci[c].slope.toFixed(2).padStart(5)}   ${loci[c].r2.toFixed(3)}      ` +
        `${(Number.isFinite(loci[c].locus) ? `${loci[c].locus.toFixed(0)} Hz` : 'none').padStart(8)}         ${loci[c].published}`
    );
  }
  console.log(`\n    A slope of 1 would mean the consonant does nothing and the vowel is`);
  console.log('    already there; 0 would mean every vowel starts from the same frequency.');
  console.log(`    /b/ at ${loci.b.slope.toFixed(2)} against /d/ at ${loci.d.slope.toFixed(2)} is the lips leaving the tongue free`);
  console.log('    while an alveolar closure pins it — published, 0.87 and 0.43.');
  console.log(`    The two fixed points land ${(loci.d.locus - loci.b.locus).toFixed(0)} Hz apart. /g/ has NONE — its slope is`);
  console.log(`    ${loci.g.slope.toFixed(2)}, so the line never crosses the diagonal, because the tongue body`);
  console.log('    IS the velar closure and there is nothing left over to point anywhere.');
  console.log(`\n    AND THE TRANSITIONS REVERSE. The same /d/ before /i/ runs`);
  console.log(`    ${reversal.front.onset.toFixed(0)} → ${reversal.front.target.toFixed(0)} Hz, and before /u/ it runs ${reversal.back.onset.toFixed(0)} → ${reversal.back.target.toFixed(0)}.`);
  console.log('    Opposite directions, one consonant. Nothing specifies that; it falls out');
  console.log("    of the locus sitting above one vowel's F2 and below the other's, and it");
  console.log("    is what Delattre's listeners heard once the bursts were cut off.\n");

  console.log('  2. /p/ VS /b/ IS A DURATION');
  console.log('  Voicing onset found by PERIODICITY in the rendered audio, not by loudness:');
  console.log('  aspiration is loud, and an energy threshold reports every VOT as zero.\n');
  console.log('    stop   measured VOT   Lisker & Abramson (1964)');
  for (const c of ['b', 'd', 'g', 'p', 't', 'k']) {
    console.log(`    /${c}/       ${vot[c].vot.toFixed(0).padStart(4)} ms            ${String(LA_1964[c]).padStart(3)} ms`);
  }
  console.log(`\n    Budget is ${(votPeriod * 2).toFixed(0)} ms — two pitch periods — because voicing can only`);
  console.log(`    begin when the folds next close, so a VOT off a ${VOICE.f0.toFixed(0)} Hz voice is`);
  console.log(`    quantised to ${votPeriod.toFixed(1)} ms no matter what the model intended.`);
  console.log('    And VOT rises through labial → alveolar → velar in both series,');
  console.log('    which is a fact about how far the air has to travel.\n');

  console.log('  3. A NASAL NEEDS A ZERO');
  console.log('  The closed mouth hangs off the path as a dead end and SUBTRACTS a');
  console.log('  frequency. Measured as the difference between the same phone rendered');
  console.log('  with and without its zero — because an all-pole spectrum has valleys');
  console.log('  between its formants forty decibels deep, and they are not notches.\n');
  console.log('    nasal   the zero takes out    at        over    published');
  for (const c of ['m', 'n', 'N']) {
    const s2 = nasals[c];
    console.log(
      `    /${CONSONANTS[c].ipa}/         ${s2.depth.toFixed(1).padStart(5)} dB       ` +
        `${s2.hz.toFixed(0).padStart(5)} Hz   ${(s2.touched * 100).toFixed(0).padStart(3)}%     ${s2.published} Hz`
    );
  }
  console.log('\n    The third column is the control: an antiformant is LOCAL. A filter that');
  console.log('    came out uniformly quieter would be a gain change, and a cascade of poles');
  console.log('    can do that perfectly well. /m/ closes at the lips and keeps the whole');
  console.log('    mouth hanging off the path; /ŋ/ closes at the velum and keeps almost');
  console.log('    none — so the zeros rise as the side branch shortens.\n');

  console.log('  4. A FRICATIVE IS ITS FRONT CAVITY');
  console.log('    sound   centroid    level');
  for (const c of ['s', 'S', 'f']) {
    console.log(
      `    /${CONSONANTS[c].ipa}/       ${fricatives[c].centroid.toFixed(0).padStart(5)} Hz   ${fricatives[c].level.toFixed(3)}`
    );
  }
  console.log(`\n    /s/ is ${(20 * Math.log10(fricatives.s.level / fricatives.f.level)).toFixed(0)} dB above /f/ — Fletcher's 6 — because /f/ has almost no cavity`);
  console.log('    in front of the constriction to shape or amplify anything. That is why');
  console.log('    /f/ and /θ/ are the two English consonants people mishear most.');
  console.log(`\n    ...and a /p/ closure is ${(closureRatio * 100).toFixed(1)}% as loud as the vowel beside it.`);
}

if (failures.length) {
  console.error('\nCONSONANTS OVER BUDGET');
  for (const l of failures) console.error(`  ${l}`);
  console.error('\nA stop is a transition. If the transitions stopped pointing anywhere, the model moved.');
  process.exit(1);
}
if (!json) console.log('\nconsonants: the transition is the consonant, and the zero is the nasal ✓');
