#!/usr/bin/env node
/**
 * The diction gate — the end of the ladder, and the only honest question left.
 *
 *   npm run diction            fail if a spoken line stops being intelligible
 *   npm run diction -- --json  the numbers, machine-readable
 *
 * Every gate before this one asked whether a piece of the model matched physics
 * or matched a published measurement. Those are answerable and they have all
 * been answered. This one asks the question a player asks:
 *
 *   **Can you tell what it said?**
 *
 * That cannot be settled by a formula, so it is settled by a listener — a very
 * stupid one. The sentence is rendered, each vowel is cut out at the times the
 * planner said it would be there, its formants are measured, and it is labelled
 * with whichever of the ten vowels it lands nearest in log-formant space. The
 * score is the fraction labelled correctly, and it is free to be bad.
 *
 * The listener knows nothing except the vowel table. It is not told which vowel
 * to expect, it does not see the text, and coarticulation is free to have
 * smeared any of them into its neighbours — which is exactly what happens to
 * real speech and is why real intelligibility scores are not 100% either.
 *
 * ## And the handshake, which is what the trilogy is for
 *
 * `visemeOf` returns the mouth shape ANIMA draws. It is not shared code — ANIMA
 * imports nothing from here — and what makes the two agree is a fact rather than
 * a type: **F1 IS mouth opening**. So the gate reads F1 out of the audio, reads
 * `open` off the plan the face would use, and correlates them. A time-shifted
 * version runs alongside as the control, and it has to fail.
 */
import {
  CONSONANTS, LEXICON, VOWELS, VOWEL_KEYS, frameTimes, lookUp, pronounce,
  renderSpeech, soundOut, speak, syllabifyPhones, visemeOf, visemeTrack, voiceOf,
} from '../dist/index.js';
import { peaks, spectrum } from './formants.mjs';

const json = process.argv.includes('--json');
const failures = [];
const fail = (l) => failures.push(l);
const SR = 22050;
const VOICE = voiceOf({ height: 1.75 });
const mean = (a) => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);

/** Ten lines of village dialogue, from the shipped lexicon. */
const LINES = [
  'the traveller stopped at the gate and asked for water',
  'nobody in the village knew his name',
  'she carried a lantern down the road',
  'every window in the town was dark',
  'he said he would wait until the morning',
  'the old man told us to keep to the path',
  'we found a bell and a book in the stone room',
  'the king would not come down from the hill',
  'take the horse and go north before night',
  'i think the bridge is gone',
];

// ------------------------------------------------------------ the listener

/**
 * Label a stretch of audio with whichever vowel it sounds most like.
 *
 * Nearest neighbour in LOG formant space, over F1 and F2 — the plane the ear
 * uses, where a ratio is a distance. It is given the vowel table and nothing
 * else: not the text, not which vowel to expect, not where in the sentence it
 * is. Coarticulation is free to have ruined it.
 */
const WINDOW = 512;
const BIN = SR / WINDOW;

/**
 * The ten reference spectra — one steady whispered vowel each.
 *
 * The listener is given these and nothing else. It is a TEMPLATE MATCHER rather
 * than a formant reader, and that is not a convenience: pulling F1 and F2 out
 * by index is fragile in exactly the places speech is hardest. A back vowel's
 * F1 and F2 sit close enough to merge into one peak — /ɔ/ is 570 and 840 — so
 * "the second peak" is F3, and the first version of this gate duly heard /ɔ/ as
 * /ɛ/ and /i/ as /æ/. Comparing whole spectra has no index to get wrong.
 */
const REFERENCE = Object.fromEntries(VOWEL_KEYS.map((key) => {
  const buf = renderSpeech([{ phone: key, seconds: 0.4 }], VOICE, {
    sampleRate: SR, f0: 0, seed: 3,
  });
  return [key, shape(spectrum(buf, WINDOW))];
}));

/**
 * A spectrum reduced to the band a vowel lives in: smoothed, then mean removed.
 *
 * The smoothing matters and is applied identically to reference and test. A
 * reference vowel is four hundred milliseconds long and Welch-averages over
 * thirty windows; a reduced /ə/ in running speech is forty and averages over
 * ONE. Correlating a smooth template against a single noisy periodogram matches
 * the noise, not the vowel — it scored 18% where reading peaks scored 68%.
 * Five bins is about 215 Hz, well under the spacing of the formants it has to
 * keep apart.
 */
function shape(mag) {
  const lo = Math.ceil(200 / BIN);
  const hi = Math.min(mag.length - 1, Math.floor(4000 / BIN));
  const out = [];
  const half = 2;
  for (let i = lo; i <= hi; i++) {
    let sum = 0;
    let n = 0;
    for (let j = Math.max(0, i - half); j <= Math.min(mag.length - 1, i + half); j++) { sum += mag[j]; n++; }
    out.push(sum / n);
  }
  const m = out.reduce((a, b) => a + b, 0) / out.length;
  return out.map((x) => x - m);
}

const correlate = (a, b) => {
  let num = 0;
  let da = 0;
  let db = 0;
  for (let i = 0; i < a.length; i++) { num += a[i] * b[i]; da += a[i] * a[i]; db += b[i] * b[i]; }
  return num / Math.sqrt(da * db + 1e-12);
};

/**
 * Label a stretch of audio with whichever vowel it sounds most like.
 *
 * Best-matching reference spectrum. The listener is not told the text, not told
 * which vowel to expect, and not told where in the sentence it is.
 * Coarticulation is free to have ruined it.
 */
function identify(buf, from, to) {
  const a = Math.max(0, Math.round(from * SR));
  const b = Math.min(buf.length, Math.round(to * SR));
  // The window has to FIT. `spectrum` is Welch-averaged and its loop runs while
  // `start + size <= length`, so a slice shorter than the transform produces no
  // windows at all and comes back as a flat −240 dB floor, which matches
  // nothing. Every reduced vowel in these sentences is under 50 ms, so a
  // 1024-point transform silently analysed nothing and the gate reported 31%
  // intelligibility and a NEGATIVE correlation with mouth opening.
  if (b - a < WINDOW) return null;
  const mag = spectrum(buf.subarray(a, b), WINDOW);
  const got = shape(mag);
  let best = null;
  let bestR = -Infinity;
  for (const key of VOWEL_KEYS) {
    const r = correlate(got, REFERENCE[key]);
    if (r > bestR) { bestR = r; best = key; }
  }
  return { heard: best, match: bestR, openness: openness(mag) };
}

/**
 * How open the mouth sounds, peak-free: the spectral centroid of the band F1
 * lives in.
 *
 * An open vowel puts its low-frequency energy higher than a close one, because
 * that is what F1 IS. Measured as a centroid rather than as a peak for the same
 * reason the identification is a template match — there is no index to get
 * wrong, and no back vowel whose merged F1 and F2 can be mistaken for each
 * other.
 */
function openness(mag) {
  const lo = Math.ceil(150 / BIN);
  const hi = Math.min(mag.length - 1, Math.floor(1100 / BIN));
  let num = 0;
  let den = 0;
  for (let i = lo; i <= hi; i++) {
    const p = Math.pow(10, mag[i] / 20);
    num += i * BIN * p;
    den += p;
  }
  return num / den;
}

/**
 * Speak a line and try to read it back.
 *
 * WHISPERED, for the same reason the consonant gate whispers: a voiced spectrum
 * is a comb and the analyser would be reading harmonics. The filter is the same
 * filter, and the claim is about the filter.
 */
function listen(text, options = {}) {
  const spoken = pronounce(text, { voice: VOICE, ...options });
  const buf = speak(text, VOICE, { sampleRate: SR, seed: 11, f0: 0, ...options });
  const times = frameTimes(spoken.phones, VOICE);
  const rows = [];
  let frame = 0;
  for (const p of spoken.phones) {
    // Walk the render's own frame list in step with the phone list; a stop puts
    // down two or three frames and everything else puts down one.
    const start = times[frame].from;
    let end = times[frame].to;
    frame++;
    while (frame < times.length && times[frame].label.startsWith(`${p.phone}:`)) {
      end = times[frame].to;
      frame++;
    }
    if (!VOWELS[p.phone]) continue;
    // The middle half of the vowel — the ends are transitions into and out of
    // the consonants beside it, and those belong to the consonants.
    const got = identify(buf, start + (end - start) * 0.3, start + (end - start) * 0.85);
    if (got) rows.push({ want: p.phone, ...got });
  }
  const right = rows.filter((r) => r.heard === r.want).length;
  return { text, spoken, buf, rows, right, of: rows.length, score: right / Math.max(1, rows.length) };
}

const heard = LINES.map((t) => listen(t));
const score = mean(heard.map((h) => h.score));
const totalVowels = heard.reduce((a, h) => a + h.of, 0);

// ------------------------------------ 1. CAN YOU TELL WHAT IT SAID

{
  // The floor is CHANCE. Ten vowels, so a listener guessing gets 10%, and any
  // number this gate reports has to be read against that rather than against
  // 100 — a synthesizer whose vowels were noise would score 0.1 here.
  const chance = 1 / VOWEL_KEYS.length;
  if (!(score > 0.6)) {
    fail(`${(score * 100).toFixed(0)}% of vowels in ten spoken lines came back as the vowel they were meant to be (chance is ${(chance * 100).toFixed(0)}%)`);
  }
  // ...and every line has to be at least mostly readable. One good line and
  // nine unintelligible ones averages the same as ten mediocre ones.
  const worst = heard.reduce((a, b) => (b.score < a.score ? b : a));
  if (!(worst.score > 0.5)) {
    fail(`"${worst.text}" came back ${(worst.score * 100).toFixed(0)}% right — an average is not an intelligibility`);
  }
  // THE CONTROL. The same listener, on the same audio, asked about a SHUFFLED
  // alignment — vowels cut from the wrong places in the sentence. If that
  // scored as well, the measurement would be reading the vowel inventory rather
  // than the utterance.
  let shuffledRight = 0;
  let shuffledOf = 0;
  for (const h of heard) {
    for (let i = 0; i < h.rows.length; i++) {
      // Compare each measured vowel against a DIFFERENT slot's target.
      const other = h.rows[(i + 3) % h.rows.length];
      shuffledOf++;
      if (h.rows[i].heard === other.want) shuffledRight++;
    }
  }
  const shuffled = shuffledRight / Math.max(1, shuffledOf);
  // The alignment has to be doing almost all the work: at least four times what
  // the same audio scores cut from the wrong places. That ratio is the budget
  // rather than the score itself, because a score is a baseline and a ratio to
  // its own control is not.
  if (!(score > shuffled * 4)) {
    fail(`aligned scores ${(score * 100).toFixed(0)}% against a misaligned ${(shuffled * 100).toFixed(0)}% — only ${(score / Math.max(1e-9, shuffled)).toFixed(1)}× , so most of it is the vowel inventory rather than the utterance`);
  }
  if (!(shuffled < score * 0.6)) {
    fail(`misaligned vowels score ${(shuffled * 100).toFixed(0)}% against an aligned ${(score * 100).toFixed(0)}% — the listener is not listening to where it was told`);
  }
  var intelligibility = { score, worst: worst.score, worstLine: worst.text, shuffled, chance, totalVowels };
}

// ------------------------------- 2. THE HANDSHAKE: F1 IS MOUTH OPENING

/**
 * Correlate the audio's first formant with the mouth ANIMA would draw.
 *
 * This is the seam the whole trilogy exists for, and it is not a shared type.
 * GAMA measures F1; ANIMA opens a jaw; the two agree because a jaw that drops
 * raises the first formant, in the geometry and in the air.
 */
function handshake(shiftSeconds = 0) {
  const xs = [];
  const ys = [];
  for (const h of heard) {
    const track = visemeTrack(h.spoken.phones, VOICE);
    for (const row of track) {
      if (!VOWELS[row.phone]) continue;
      const from = row.from + shiftSeconds + (row.to - row.from) * 0.3;
      const to = row.to + shiftSeconds - (row.to - row.from) * 0.15;
      const got = identify(h.buf, from, to);
      if (!got) continue;
      // The viseme the FACE is handed, at that instant, from the shifted track.
      xs.push(visemeOf(row.phone).open);
      ys.push(Math.log(got.openness));
    }
  }
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  return { r: num / Math.sqrt(dx * dy + 1e-12), n: xs.length };
}

const aligned = handshake(0);
// A tenth of a second: about one syllable at a conversational rate, and the
// point at which a dubbed film starts to look wrong.
const shifted = handshake(0.1);

if (!(aligned.r > 0.75)) {
  fail(`the mouth ANIMA would draw correlates with the audio's F1 at r = ${aligned.r.toFixed(3)} — the face and the voice are describing different events`);
}
if (!(shifted.r < aligned.r * 0.75)) {
  fail(`a face shifted 100 ms out of step still correlates at r = ${shifted.r.toFixed(3)} against ${aligned.r.toFixed(3)} — the correlation is not about alignment, so it proves nothing about lip-sync`);
}
// ...and a bilabial has to SHUT the mouth. It is the one viseme a viewer can
// read off a silent face, and it is why /p b m/ are the lip-sync landmark.
for (const c of ['p', 'b', 'm']) {
  if (!(visemeOf(c).close > 0.9)) fail(`/${c}/ does not close the mouth (${visemeOf(c).close})`);
}
for (const v of ['A', 'i', 'u']) {
  if (!(visemeOf(v).close === 0)) fail(`/${VOWELS[v].ipa}/ closes the mouth, which is not a vowel`);
}

// ---------------------------- 3. THE DICTIONARY, AND WHAT IT MISSES

const spelling = (() => {
  // Every lexicon word, sounded out from its own letters, against its entry.
  let same = 0;
  let total = 0;
  let vowelSame = 0;
  let vowelTotal = 0;
  for (const [word, entry] of Object.entries(LEXICON)) {
    if (word.endsWith('_')) continue;
    const guess = soundOut(word);
    total++;
    if (guess.join(' ') === entry.phones.join(' ')) same++;
    const wantV = entry.phones.filter((p) => VOWELS[p]);
    const gotV = guess.filter((p) => VOWELS[p]);
    for (let i = 0; i < wantV.length; i++) {
      vowelTotal++;
      if (gotV[i] === wantV[i]) vowelSame++;
    }
  }
  return { words: total, exact: same / total, vowels: vowelSame / vowelTotal };
})();
{
  // THE POSITIVE CLAIM. English spelling is NOT a function of its letters, and
  // this file's whole reason for shipping a dictionary is that a letter-to-sound
  // table cannot replace one. If the fallback ever matched the dictionary on
  // most words, either the rules got very good or the lexicon got very small,
  // and both are worth being told about.
  if (!(spelling.exact < 0.5)) {
    fail(`sounding words out from their letters reproduces ${(spelling.exact * 100).toFixed(0)}% of the dictionary exactly — either the rules are better than English allows or the lexicon has stopped being interesting`);
  }
  // ...and the fallback still has to be better than nothing on the vowels.
  if (!(spelling.vowels > 0.3)) {
    fail(`the letter rules get ${(spelling.vowels * 100).toFixed(0)}% of vowels right, which is not a usable fallback`);
  }
  // An unknown word must come out pronounceable, never empty.
  for (const word of ['zorblat', 'xyzzy', 'ffff', '', '123']) {
    const got = lookUp(word);
    if (!got.phones.length) fail(`"${word}" produced no phones at all`);
    if (!got.phones.some((p) => VOWELS[p])) fail(`"${word}" produced no vowel, so it is not a word`);
  }
}

// ------------- 2b. HOW LOUD, WHICH IS WHETHER YOU CAN HEAR IT AT ALL

/**
 * Fletcher (1953), relative phonetic power. Measured on people; builds nothing.
 *
 * A vowel is the loudest thing in speech by about thirty decibels, because a
 * glottis is a far more efficient source than air scraping past a constriction.
 *
 * NOTHING IN THIS FILE MEASURED THAT UNTIL A LISTENER SAID THEY COULD NOT HEAR
 * A WORD. Every check that listened to a vowel rendered it WHISPERED — and a
 * whisper has no glottal source to be out of balance with, so the one ratio
 * that decides whether speech is audible was invisible to all of them. The
 * frication gains had been set against each other, /s/ against /f/, and a
 * spoken line came out normalised by its loudest hiss with every vowel FORTY
 * NINE DECIBELS underneath it. The intelligibility score above was 96% while
 * the audio was unlistenable, because the score was measuring the filter and
 * calling it speech.
 */
const FLETCHER = { A: 600, i: 220, ae: 490, m: 152, n: 36, z: 5, S: 80, s: 16, v: 12, f: 4, T: 1 };

{
  // ONE utterance, VOICED, so the levels are real and share a gain.
  const order = ['A', 's', 'i', 'S', 'f', 'T', 'm', 'z', 'v', 'n'];
  const phones = order.flatMap((p) => (VOWELS[p] ? [{ phone: p, seconds: 0.3 }] : [{ phone: p }]));
  const buf = speak('', VOICE) && renderSpeech(phones, VOICE, { sampleRate: SR, seed: 5 });
  const times = frameTimes(phones, VOICE);
  const level = {};
  let frame = 0;
  for (const p of phones) {
    const from = times[frame].from;
    let to = times[frame].to;
    frame++;
    while (frame < times.length && times[frame].label.startsWith(`${p.phone}:`)) { to = times[frame].to; frame++; }
    const a = Math.round((from + 0.02) * SR);
    const b = Math.round((to - 0.01) * SR);
    let sum = 0;
    for (let i = a; i < b; i++) sum += buf[i] * buf[i];
    level[p.phone] = Math.sqrt(sum / Math.max(1, b - a));
  }
  const dB = (k) => 20 * Math.log10(level[k] / level.s);
  const wantDB = (k) => 10 * Math.log10(FLETCHER[k] / FLETCHER.s);

  const rows = order.map((k) => ({ k, got: dB(k), want: wantDB(k) }));
  // Six decibels: about the point where one sound starts masking another in
  // the same utterance, and well inside the spread of Fletcher's own speakers.
  for (const r of rows) {
    if (!(Math.abs(r.got - r.want) < 6)) {
      fail(`/${VOWELS[r.k]?.ipa ?? CONSONANTS[r.k]?.ipa ?? r.k}/ sits ${r.got.toFixed(0)} dB from /s/ where Fletcher puts it ${r.want.toFixed(0)} — a ${(r.got - r.want).toFixed(0)} dB error, and a sentence is normalised by its loudest sound`);
    }
  }
  // And the headline, stated in the unit Fletcher used. A dB is not a dB:
  // amplitudes take 20·log₁₀ and POWERS take 10, Fletcher published powers, and
  // the first attempt at this fix overshot by exactly that factor of two —
  // 30.8 dB where the table says 15.7. Being wrong in the right direction is
  // still wrong.
  if (!(dB('A') > 12)) {
    fail(`/ɑ/ is only ${dB('A').toFixed(1)} dB above /s/ against Fletcher's ${wantDB('A').toFixed(1)} — you cannot hear a word of a line normalised like that`);
  }
  var loudness = { rows, aOverS: dB('A') };
}

// ---------------- 3b. THE LEXICON HAS TO AGREE WITH ENGLISH, NOT WITH ITSELF

/**
 * Rhymes and homophones — an anchor from OUTSIDE the file.
 *
 * Everything above compares the audio against the plan that produced it, so a
 * corrupted dictionary entry is invisible: change "gate" to /g u t/ and the
 * synthesizer says /gut/, the listener hears /u/, the plan expected /u/, and
 * every number stays green. That is the same hole the voice gate had before
 * Peterson & Barney's men's row was carried a second time.
 *
 * English supplies its own check. Words that RHYME must share their nucleus and
 * coda; words that are HOMOPHONES must be identical throughout. Neither fact
 * comes from this library, and no plausible corruption of one entry survives
 * both.
 */
const RHYMES = [
  ['gate', 'wait'], ['night', 'light'], ['night', 'might'], ['make', 'take'],
  ['name', 'came'], ['name', 'same'], ['told', 'gold'], ['told', 'old'],
  ['cold', 'hold'], ['keep', 'sleep'], ['tree', 'three'], ['down', 'town'],
  ['stone', 'gone'], ['back', 'black'], ['best', 'west'], ['bad', 'had'],
  ['land', 'hand'], ['long', 'song'], ['wall', 'small'], ['book', 'look'],
  ['head', 'bread'], ['well', 'bell'], ['good', 'wood'], ['old', 'told'],
];
const HOMOPHONES = [['see', 'sea'], ['knew', 'new'], ['their', 'there']];

{
  const rime = (word) => {
    const entry = LEXICON[word];
    if (!entry) return null;
    const phones = entry.phones;
    let last = -1;
    phones.forEach((p, i) => { if (VOWELS[p]) last = i; });
    return last < 0 ? null : phones.slice(last).join(' ');
  };
  let checked = 0;
  let broken = 0;
  for (const [a, b] of RHYMES) {
    const ra = rime(a);
    const rb = rime(b);
    // Pairs where one word is not in the lexicon are skipped, not failed — the
    // dictionary is small on purpose and the gate says how small elsewhere.
    if (ra === null || rb === null) continue;
    checked++;
    if (ra !== rb) { broken++; fail(`"${a}" and "${b}" rhyme in English and do not in the lexicon: /${ra}/ against /${rb}/`); }
  }
  for (const [a, b] of HOMOPHONES) {
    if (!LEXICON[a] || !LEXICON[b]) continue;
    checked++;
    if (LEXICON[a].phones.join(' ') !== LEXICON[b].phones.join(' ')) {
      broken++;
      fail(`"${a}" and "${b}" are homophones and the lexicon disagrees: /${LEXICON[a].phones.join(' ')}/ against /${LEXICON[b].phones.join(' ')}/`);
    }
  }
  if (!(checked > 15)) fail(`only ${checked} rhyme pairs could be checked — the anchor has stopped anchoring`);
  var rhyming = { checked, broken };
}

// ---------------------------------- 4. syllables, and the things it must not do

{
  // The maximal onset principle: a consonant between two vowels goes with the
  // SECOND syllable. "a-bout", not "ab-out".
  const about = syllabifyPhones(['@', 'b', 'A', 't']);
  if (about.length !== 2) fail(`"about" split into ${about.length} syllables`);
  if (about[1].onset.join('') !== 'b') fail(`"about" put /b/ in the wrong syllable: ${JSON.stringify(about)}`);
  // A word with no vowel is not a word.
  if (syllabifyPhones(['s', 't']).length !== 0) fail('a vowelless string produced syllables');

  // Rendering never produces anything but finite, bounded audio.
  for (const options of [{}, { rate: 0.4 }, { rate: 3 }, { sampleRate: 8000 }, { f0: 0 }, { intonation: 'question' }]) {
    const buf = speak('the king would not come down from the hill', VOICE, { seed: 5, ...options });
    for (let i = 0; i < buf.length; i++) {
      if (!Number.isFinite(buf[i]) || Math.abs(buf[i]) > 1.0001) {
        fail(`speaking with ${JSON.stringify(options)} produced ${buf[i]} at ${i}`);
        break;
      }
    }
  }
  // Empty and punctuation-only text.
  for (const text of ['', '   ', '...', '?']) {
    const buf = speak(text, VOICE, { sampleRate: SR });
    for (let i = 0; i < buf.length; i++) {
      if (!Number.isFinite(buf[i])) { fail(`speaking ${JSON.stringify(text)} produced ${buf[i]}`); break; }
    }
  }
  // A question ends higher than the same words as a statement.
  const q = pronounce('the bridge is gone?', { voice: VOICE });
  const s = pronounce('the bridge is gone', { voice: VOICE });
  const lastF0 = (p) => p.phones.filter((x) => VOWELS[x.phone]).pop().f0;
  if (!(lastF0(q) > lastF0(s) * 1.1)) {
    fail(`a question ends at ${lastF0(q).toFixed(0)} Hz and the statement at ${lastF0(s).toFixed(0)} — the question mark did nothing`);
  }
  // A longer line takes longer, and the rate does what it says.
  const short = speak('the bridge is gone', VOICE, { sampleRate: SR }).length;
  const long = speak('the traveller stopped at the gate and asked for water', VOICE, { sampleRate: SR }).length;
  if (!(long > short * 1.5)) fail('a sentence twice the length did not take longer to say');
  var guards = { questionHz: lastF0(q), statementHz: lastF0(s) };
}

// ------------------------------------------------------------------- report

if (json) {
  console.log(JSON.stringify({ failures, intelligibility, loudness, aligned, shifted, spelling, rhyming, guards }, null, 2));
} else {
  console.log('diction — text in, speech out, and can you tell what it said\n');

  console.log('  CAN YOU TELL WHAT IT SAID');
  console.log('  Ten lines spoken, every vowel cut out where the planner said it would be,');
  console.log('  and labelled by nearest neighbour in log-formant space. The listener is');
  console.log('  given the vowel table and nothing else — not the text, not which vowel to');
  console.log('  expect, and coarticulation is free to have ruined it.\n');
  console.log('    line                                                     vowels   right');
  for (const h of heard) {
    console.log(
      `    ${h.text.slice(0, 52).padEnd(54)} ${String(h.of).padStart(4)}   ${(h.score * 100).toFixed(0).padStart(4)}%`
    );
  }
  console.log(`\n    ${(score * 100).toFixed(0)}% of ${totalVowels} vowels identified, against a ${(intelligibility.chance * 100).toFixed(0)}% chance floor.`);
  console.log(`    Misaligned — the same audio cut from the wrong places — scores ${(intelligibility.shuffled * 100).toFixed(0)}%,`);
  console.log('    which is the control: the listener is listening to the utterance and');
  console.log('    not to the vowel inventory.\n');

  console.log('  HOW LOUD, WHICH IS WHETHER YOU CAN HEAR IT AT ALL');
  console.log('  Fletcher (1953) relative phonetic power, measured on people. A vowel is');
  console.log('  the loudest thing in speech by thirty decibels. Rendered VOICED, in one');
  console.log('  utterance, so the levels are real and share a gain.\n');
  console.log('    sound    measured   Fletcher');
  for (const r of loudness.rows) {
    console.log(`    /${(VOWELS[r.k]?.ipa ?? CONSONANTS[r.k]?.ipa ?? r.k).padEnd(4)}   ${r.got.toFixed(1).padStart(7)} dB  ${r.want.toFixed(1).padStart(7)} dB`);
  }
  console.log('\n    Nothing here measured this until a listener said they could not hear a');
  console.log('    word. Every check above renders vowels WHISPERED, and a whisper has no');
  console.log('    glottal source to be out of balance with — so the one ratio that decides');
  console.log('    whether speech is audible was invisible to all of them. Vowels were 49 dB');
  console.log('    BELOW /s/, and the score above still read 96%.');
  console.log('    Then the first fix overshot to +30.8, because the correction was worked');
  console.log('    out with 20·log₁₀ on a POWER ratio. A dB is not a dB.\n');

  console.log('  THE HANDSHAKE — F1 IS MOUTH OPENING');
  console.log('  ANIMA draws a mouth from `open`. GAMA measures F1 in the air. Neither');
  console.log('  package imports the other, and what makes them agree is not a shared type');
  console.log('  but a shared fact: a jaw that drops raises the first formant.\n');
  console.log(`    aligned:              r = ${aligned.r.toFixed(3)}   over ${aligned.n} vowels`);
  console.log(`    the face 100 ms late: r = ${shifted.r.toFixed(3)}   ← the control`);
  console.log('    ...and /p/, /b/, /m/ shut the mouth completely, which is the one viseme');
  console.log('    a viewer reads off a silent face.\n');

  console.log('  THE DICTIONARY, AND WHY THERE HAS TO BE ONE');
  console.log(`    ${spelling.words} words in the lexicon. Sounding each one out from its own letters`);
  console.log(`    reproduces ${(spelling.exact * 100).toFixed(0)}% of them exactly, and ${(spelling.vowels * 100).toFixed(0)}% of their vowels.`);
  console.log('    English spelling is not a function of its letters — "though", "through",');
  console.log('    "tough", "thought" and "thorough" share four letters and no vowel — so');
  console.log('    the gate asserts the fallback CANNOT replace the dictionary, rather than');
  console.log('    hoping nobody checks.\n');

  console.log(`    ${rhyming.checked} rhyme and homophone pairs agree — an anchor from outside the file,`);
  console.log('    because every other check here compares the audio against the plan that');
  console.log('    produced it, and a corrupted entry is invisible to all of them.\n');
  console.log(`  ...and "the bridge is gone?" ends at ${guards.questionHz.toFixed(0)} Hz where the statement ends at ${guards.statementHz.toFixed(0)}.`);
}

if (failures.length) {
  console.error('\nDICTION OVER BUDGET');
  for (const l of failures) console.error(`  ${l}`);
  console.error('\nThe question is whether you can tell what it said. If you cannot, it does not matter what is correct.');
  process.exit(1);
}
if (!json) console.log('\ndiction: it says the words, and the face knows which ones ✓');
