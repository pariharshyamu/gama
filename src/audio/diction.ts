/**
 * Diction — text in, speech out, and the last rung of the ladder.
 *
 * `voice.ts` built the tract. `prosody.ts` gave it a rhythm and a melody.
 * `consonants.ts` gave it segments. This file is the part that turns a line of
 * dialogue into all three, and it is the only one whose central problem is not
 * acoustics at all.
 *
 * ## English spelling does not carry its pronunciation
 *
 * There is no function from letters to sounds in this language. "though",
 * "through", "tough", "thought" and "thorough" share four letters and no vowel;
 * "read" is two words. Every text-to-speech system ever built has a
 * **pronunciation dictionary** at the bottom of it, and the ones that also have
 * letter-to-sound rules use them only for what the dictionary misses.
 *
 * So this file ships a dictionary, and it is small — a few hundred words, enough
 * for game dialogue and honest about being enough for that. `LETTER_RULES` is
 * the fallback and it is crude on purpose: what it gets right is that a word not
 * in the lexicon comes out as *some* pronounceable sequence rather than silence
 * or a crash, and `npm run diction` measures how much worse it is rather than
 * pretending it is fine.
 *
 * ## The syllable is where the three modules meet
 *
 * A word's phones are not a flat list. `/s t r ɛ ŋ θ/` is one syllable and
 * `/ə b aʊ t/` is two, and the difference decides which vowels get Klatt's
 * reduction, where the pitch accents land, and how long the whole line takes.
 * `syllabifyPhones` does the split by the **maximal onset principle** — a
 * consonant between two vowels belongs to the second syllable, because that is
 * what English speakers do with it — and hands the nuclei to `planUtterance`.
 *
 * ## And the handshake
 *
 * `visemeAt` returns `{ open, round, close, spread }` — exactly the shape
 * ANIMA's `Speech` consumes to drive a mouth. Neither package imports the other;
 * they read the same plan, and what makes them agree is that **F1 is mouth
 * opening**. A jaw that drops raises the first formant, in the geometry and in
 * the air, and the gate measures the correlation between what the face is asked
 * to do and what the audio actually does.
 */

import {
  type Phone, type SpeechOptions, CONSONANTS, isConsonant, isVowel, renderSpeech,
} from './consonants';
import { type Syllable, type UtteranceOptions, planUtterance } from './prosody';
import { VOWELS, type VoiceSpec, voiceOf } from './voice';

export interface LexicalEntry {
  /** Phones, in order. Keys of `VOWELS` or of `CONSONANTS`. */
  phones: readonly string[];
  /** Which vowel — counting vowels only — carries primary stress. */
  stress?: number;
}

const w = (phones: string, stress = 0): LexicalEntry => ({ phones: phones.split(' '), stress });

/**
 * A small English pronunciation dictionary.
 *
 * DATA, and incomplete on purpose: enough for game dialogue, not enough for
 * arbitrary prose, and the gate reports the miss rate rather than the file
 * claiming coverage it does not have.
 */
export const LEXICON: Record<string, LexicalEntry> = {
  // function words — reduced, unstressed, and most of any English sentence
  a: w('@'), an: w('ae n'), and: w('ae n d'), are: w('A r'), as: w('ae z'),
  at: w('ae t'), be: w('b i'), been: w('b I n'), but: w('b V t'), by: w('b A'),
  can: w('k ae n'), did: w('d I d'), do: w('d u'), for: w('f O r'), from: w('f r V m'),
  had: w('h ae d'), has: w('h ae z'), have: w('h ae v'), he: w('h i'), her: w('h V r'),
  him: w('h I m'), his: w('h I z'), i: w('A'), if: w('I f'), in: w('I n'),
  is: w('I z'), it: w('I t'), its: w('I t s'), me: w('m i'), my: w('m A'),
  no: w('n O'), not: w('n A t'), of: w('V v'), on: w('A n'), or: w('O r'),
  our: w('A r'), she: w('S i'), so: w('s O'), that: w('D ae t'), the: w('D @'),
  their: w('D E r'), them: w('D E m'), then: w('D E n'), there: w('D E r'),
  they: w('D E'), this: w('D I s'), to: w('t u'), up: w('V p'), us: w('V s'),
  was: w('w V z'), we: w('w i'), were: w('w V r'), what: w('w V t'), when: w('w E n'),
  which: w('w I tS'), who: w('h u'), will: w('w I l'), with: w('w I D'),
  would: w('w U d'), you: w('j u'), your: w('j O r'), until: w('V n t I l', 1),

  // content words — a village's worth
  all: w('O l'), back: w('b ae k'), bad: w('b ae d'), bag: w('b ae g'),
  bell: w('b E l'), best: w('b E s t'), big: w('b I g'), bird: w('b V r d'),
  boat: w('b O t'), book: w('b U k'), bread: w('b r E d'), bridge: w('b r I dZ'),
  bring: w('b r I N'), came: w('k E m'), cart: w('k A r t'), cold: w('k O l d'),
  come: w('k V m'), dark: w('d A r k'), day: w('d E'), does: w('d V z'),
  dog: w('d O g'), done: w('d V n'), door: w('d O r'), down: w('d A n'),
  every: w('E v r i'), far: w('f A r'), find: w('f A n d'), fire: w('f A r'),
  food: w('f u d'), from_: w('f r V m'), gate: w('g E t'), get: w('g E t'),
  give: w('g I v'), go: w('g O'), gold: w('g O l d'), gone: w('g O n'),
  good: w('g U d'), got: w('g A t'), great: w('g r E t'), green: w('g r i n'),
  hand: w('h ae n d'), hard: w('h A r d'), head: w('h E d'), help: w('h E l p'),
  here: w('h I r'), hill: w('h I l'), hold: w('h O l d'), home: w('h O m'),
  horse: w('h O r s'), house: w('h A s'), keep: w('k i p'), key: w('k i'),
  king: w('k I N'), knew: w('n u'), know: w('n O'), lamp: w('l ae m p'),
  land: w('l ae n d'), last: w('l ae s t'), left: w('l E f t'), light: w('l A t'),
  like: w('l A k'), long: w('l O N'), look: w('l U k'), lost: w('l O s t'),
  made: w('m E d'), make: w('m E k'), man: w('m ae n'), many: w('m E n i'),
  might: w('m A t'), mine: w('m A n'), more: w('m O r'), morning: w('m O r n I N'),
  much: w('m V tS'), must: w('m V s t'), name: w('n E m'), near: w('n I r'),
  need: w('n i d'), new: w('n u'), news: w('n u z'), next: w('n E k s t'),
  night: w('n A t'), nobody: w('n O b V d i'), north: w('n O r T'), now: w('n A'),
  old: w('O l d'), one: w('w V n'), open: w('O p @ n'), out: w('A t'),
  over: w('O v V r'), path: w('p ae T'), pay: w('p E'), people: w('p i p @ l'),
  place: w('p l E s'), road: w('r O d'), rock: w('r A k'), room: w('r u m'),
  said: w('s E d'), same: w('s E m'), sea: w('s i'), see: w('s i'),
  send: w('s E n d'), ship: w('S I p'), shop: w('S A p'), should: w('S U d'),
  side: w('s A d'), sign: w('s A n'), sing: w('s I N'), sleep: w('s l i p'),
  small: w('s m O l'), some: w('s V m'), song: w('s O N'), soon: w('s u n'),
  stand: w('s t ae n d'), stone: w('s t O n'), stop: w('s t A p'),
  stopped: w('s t A p t'), street: w('s t r i t'), strong: w('s t r O N'),
  take: w('t E k'), tell: w('t E l'), thank: w('T ae N k'), thing: w('T I N'),
  think: w('T I N k'), three: w('T r i'), time: w('t A m'), told: w('t O l d'),
  town: w('t A n'), traveller: w('t r ae v l V r'), tree: w('t r i'),
  under: w('V n d V r'), village: w('v I l I dZ'), wait: w('w E t'),
  walk: w('w O k'), wall: w('w O l'), want: w('w A n t'), warm: w('w O r m'),
  watch: w('w A tS'), water: w('w O t V r'), way: w('w E'), well: w('w E l'),
  west: w('w E s t'), where: w('w E r'), why: w('w A'), wind: w('w I n d'),
  window: w('w I n d O'), wood: w('w U d'), word: w('w V r d'), work: w('w V r k'),
  world: w('w V r l d'), yes: w('j E s'), yet: w('j E t'), young: w('j V N'),
  asked: w('ae s k t'), carried: w('k ae r i d'), lantern: w('l ae n t V r n'),
};

/**
 * Letter-to-sound, for what the dictionary misses.
 *
 * Crude, and labelled crude. English orthography is not a function of its
 * letters and no table of this size pretends otherwise. What this buys is that
 * an unknown word comes out as *something pronounceable* instead of silence,
 * and `npm run diction` measures how much worse it is than the dictionary
 * rather than letting it pass unremarked.
 */
export const LETTER_RULES: Array<[RegExp, string]> = [
  [/^tch/, 'tS'], [/^ch/, 'tS'], [/^sh/, 'S'], [/^th/, 'T'], [/^ph/, 'f'],
  [/^ck/, 'k'], [/^qu/, 'k w'], [/^ng/, 'N'], [/^wh/, 'w'],
  [/^ee|^ea/, 'i'], [/^oo/, 'u'], [/^ou|^ow/, 'A'], [/^oa/, 'O'],
  [/^ai|^ay/, 'E'], [/^igh/, 'A'], [/^oi|^oy/, 'O'], [/^au|^aw/, 'O'],
  [/^a/, 'ae'], [/^e/, 'E'], [/^i/, 'I'], [/^o/, 'A'], [/^u/, 'V'], [/^y/, 'I'],
  [/^b/, 'b'], [/^c/, 'k'], [/^d/, 'd'], [/^f/, 'f'], [/^g/, 'g'], [/^h/, 'h'],
  [/^j/, 'dZ'], [/^k/, 'k'], [/^l/, 'l'], [/^m/, 'm'], [/^n/, 'n'], [/^p/, 'p'],
  [/^q/, 'k'], [/^r/, 'r'], [/^s/, 's'], [/^t/, 't'], [/^v/, 'v'], [/^w/, 'w'],
  [/^x/, 'k s'], [/^z/, 'z'],
];

/** Guess a word's phones from its letters. The fallback, not the mechanism. */
export function soundOut(word: string): string[] {
  let rest = word.toLowerCase().replace(/[^a-z]/g, '');
  const out: string[] = [];
  while (rest.length) {
    const rule = LETTER_RULES.find(([re]) => re.test(rest));
    if (!rule) { rest = rest.slice(1); continue; }
    const matched = rest.match(rule[0])![0];
    for (const p of rule[1].split(' ')) if (isVowel(p) || isConsonant(p) || p === 'tS' || p === 'dZ') out.push(p);
    rest = rest.slice(matched.length);
  }
  // A word has to have a nucleus or it is not a word.
  if (!out.some(isVowel)) out.push('@');
  return out;
}

/**
 * `/tʃ/` and `/dʒ/` are affricates: a stop released into a fricative, and not
 * either one. `consonants.ts` has no affricate, so they are spelled out here as
 * the two phones they are made of — which is what they are, and is also why
 * spelling them out is only *almost* right: a real affricate releases much
 * faster than a stop followed by a separate fricative.
 */
const AFFRICATES: Record<string, string[]> = { tS: ['t', 'S'], dZ: ['d', 'Z'] };

const expand = (phones: readonly string[]): string[] =>
  phones.flatMap((p) => AFFRICATES[p] ?? [p]);

export interface PronouncedWord {
  word: string;
  phones: string[];
  /** True when the word was not in `LEXICON` and had to be sounded out. */
  guessed: boolean;
}

/** Look a word up, or sound it out. */
export function lookUp(word: string): PronouncedWord {
  const key = word.toLowerCase().replace(/[^a-z']/g, '');
  const entry = LEXICON[key];
  return entry
    ? { word: key, phones: expand(entry.phones), guessed: false }
    : { word: key, phones: expand(soundOut(key)), guessed: true };
}

export interface PhoneSyllable {
  onset: string[];
  nucleus: string;
  coda: string[];
  stressed: boolean;
  wordFinal: boolean;
}

/**
 * Split a word's phones into syllables by the **maximal onset principle**.
 *
 * A consonant sitting between two vowels goes with the SECOND syllable —
 * "a-bout", not "ab-out" — because that is what an English speaker does with it,
 * and because the onset is where a stop's aspiration lives. Get it wrong and
 * "a-bout" becomes "ab-out", which is a different word's rhythm.
 */
export function syllabifyPhones(phones: readonly string[], stress = 0): PhoneSyllable[] {
  const nuclei: number[] = [];
  phones.forEach((p, i) => { if (isVowel(p)) nuclei.push(i); });
  if (!nuclei.length) return [];
  const out: PhoneSyllable[] = [];
  for (let s = 0; s < nuclei.length; s++) {
    const at = nuclei[s];
    const previous = s === 0 ? -1 : nuclei[s - 1];
    const between = phones.slice(previous + 1, at);
    // Maximal onset: everything between two vowels joins the following one,
    // except that the first syllable keeps whatever starts the word.
    const onset = between;
    const next = s + 1 < nuclei.length ? nuclei[s + 1] : phones.length;
    const coda = s + 1 < nuclei.length ? [] : phones.slice(at + 1, next);
    out.push({
      onset, nucleus: phones[at], coda,
      stressed: s === Math.min(stress, nuclei.length - 1),
      wordFinal: s === nuclei.length - 1,
    });
  }
  return out;
}

export interface DictionOptions extends UtteranceOptions, SpeechOptions {
  /** Seconds of silence at a comma or a full stop. */
  pause?: number;
}

export interface Spoken {
  phones: Phone[];
  words: PronouncedWord[];
  syllables: PhoneSyllable[];
  /** How many words had to be sounded out rather than looked up. */
  guessed: number;
  seconds: number;
}

/**
 * Turn a line of text into phones with durations and a pitch contour.
 *
 * This is where the three modules meet: the lexicon gives phones, the syllable
 * split gives nuclei, `planUtterance` gives each nucleus a duration and an F0,
 * and the consonants take their durations from their own specs. What comes out
 * is exactly what `renderSpeech` eats.
 */
export function pronounce(text: string, options: DictionOptions = {}): Spoken {
  const voice = options.voice ?? voiceOf();
  const raw = text.trim().split(/\s+/).filter(Boolean);
  const words: PronouncedWord[] = [];
  const syllables: PhoneSyllable[] = [];
  const forProsody: Syllable[] = [];
  const breaks: number[] = [];

  for (const token of raw) {
    const entry = LEXICON[token.toLowerCase().replace(/[^a-z']/g, '')];
    const got = lookUp(token);
    words.push(got);
    const split = syllabifyPhones(got.phones, entry?.stress ?? 0);
    // A function word carries no stress at all — the same rule `prosody.ts`
    // uses, and it is what makes English sound like English.
    const isFunction = FUNCTION.has(got.word);
    for (const syl of split) {
      syllables.push(syl);
      forProsody.push({
        vowel: syl.nucleus,
        stressed: syl.stressed && !isFunction,
        wordFinal: syl.wordFinal,
      });
    }
    if (/[,.;:!?]$/.test(token)) breaks.push(syllables.length - 1);
  }

  const planned = planUtterance(forProsody, {
    ...options,
    voice,
    intonation: options.intonation ?? (/\?\s*$/.test(text) ? 'question' : 'statement'),
  });

  const phones: Phone[] = [];
  const pause = options.pause ?? 0.16;
  for (let i = 0; i < syllables.length; i++) {
    const syl = syllables[i];
    const plan = planned[i];
    for (const c of syl.onset) phones.push({ phone: c, f0: plan.f0 });
    phones.push({ phone: syl.nucleus, seconds: plan.seconds, f0: plan.f0 });
    for (const c of syl.coda) phones.push({ phone: c, f0: plan.f0 });
    if (breaks.includes(i)) phones.push({ phone: 'p', seconds: pause, f0: plan.f0 });
  }

  return {
    phones,
    words,
    syllables,
    guessed: words.filter((x) => x.guessed).length,
    seconds: planned.reduce((a, p) => a + p.seconds, 0),
  };
}

const FUNCTION: ReadonlySet<string> = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'but', 'by', 'can', 'did',
  'do', 'for', 'from', 'had', 'has', 'have', 'he', 'her', 'him', 'his', 'i',
  'if', 'in', 'is', 'it', 'its', 'me', 'my', 'no', 'not', 'of', 'on', 'or',
  'our', 'she', 'so', 'that', 'the', 'their', 'them', 'then', 'there', 'they',
  'this', 'to', 'until', 'up', 'us', 'was', 'we', 'were', 'what', 'when',
  'which', 'who', 'will', 'with', 'would', 'you', 'your',
]);

/** Text to samples, in one call. */
export function speak(
  text: string,
  voice: VoiceSpec = voiceOf(),
  options: DictionOptions = {}
): Float32Array {
  return renderSpeech(pronounce(text, { ...options, voice }).phones, voice, options);
}

export interface Viseme {
  /** Jaw opening, 0..1. */
  open: number;
  /** Lip rounding, 0..1. */
  round: number;
  /** Lip closure, 0..1 — a bilabial shuts the mouth completely. */
  close: number;
  /** Lip spreading, 0..1. */
  spread: number;
}

/**
 * The mouth shape for a phone — **the handshake, and the whole point of the
 * trilogy having three packages instead of one.**
 *
 * ANIMA's `Speech` consumes exactly this shape and draws a face with it. It
 * imports nothing from here and this imports nothing from there; what makes the
 * two agree is not a shared type, it is a shared fact — **F1 is mouth opening**.
 * A jaw that drops raises the first formant, in the geometry and in the air, so
 * a face driven off `open` and a sound whose F1 comes out of the same phone are
 * describing one event.
 *
 * `npm run diction` measures that: it reads F1 out of the rendered audio frame
 * by frame, reads `open` off the plan the face would use, and correlates them —
 * with a time-shifted version as the control, which must fail.
 */
export function visemeOf(phone: string): Viseme {
  const vowel = VOWELS[phone];
  if (vowel) {
    return {
      open: vowel.height,
      round: vowel.round,
      close: 0,
      // A front unrounded vowel spreads the lips; /i/ is the extreme.
      spread: Math.max(0, (1 - vowel.back) * (1 - vowel.round) * (1 - vowel.height * 0.6)),
    };
  }
  const spec = CONSONANTS[phone];
  if (!spec) return { open: 0.15, round: 0.1, close: 0, spread: 0 };
  // A bilabial shuts the mouth — that is the one viseme a listener can read off
  // a face with no sound at all, and it is why /p b m/ are the classic
  // lip-sync landmark.
  const bilabial = spec.place === 'labial' && spec.manner !== 'fricative';
  return {
    open: bilabial ? 0 : spec.manner === 'approximant' ? 0.3 : 0.18,
    round: spec.place === 'postalveolar' || phone === 'w' ? 0.7 : 0.1,
    close: bilabial ? 1 : spec.place === 'labial' ? 0.55 : 0,
    spread: spec.place === 'alveolar' ? 0.35 : 0,
  };
}

/** The viseme track for a whole utterance, one entry per phone. */
export function visemeTrack(
  phones: readonly Phone[],
  voice: VoiceSpec = voiceOf(),
  options: SpeechOptions = {}
): Array<{ phone: string; from: number; to: number; viseme: Viseme }> {
  const vowelSeconds = options.vowelSeconds ?? 0.16;
  const out: Array<{ phone: string; from: number; to: number; viseme: Viseme }> = [];
  let t = 0;
  for (const p of phones) {
    const spec = CONSONANTS[p.phone];
    let seconds = p.seconds ?? vowelSeconds;
    if (spec) {
      // EXACTLY what `planPhones` lays down, or the face drifts. Only a stop
      // gets a burst and an aspiration; adding those eight milliseconds to
      // every consonant put the mouth a frame ahead of the sound by the end of
      // a sentence, which is the one thing a lip-sync must never do.
      seconds = spec.hold / 1000;
      if (spec.manner === 'stop') {
        seconds += 0.008;
        const vot = Math.max(0, (spec.vot ?? 0) - 8) / 1000;
        if (vot > 0.0005) seconds += vot;
      }
    }
    out.push({ phone: p.phone, from: t, to: t + seconds, viseme: visemeOf(p.phone) });
    t += seconds;
  }
  void voice;
  return out;
}
