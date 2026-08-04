/**
 * Prosody — the part of speech that is not the words.
 *
 * `voice.ts` gives an NPC a vocal tract. It renders a vowel at a pitch, and the
 * pitch is a constant, which no voice has ever been. A line delivered at a flat
 * F0 with even syllables does not sound like a robot because the *timbre* is
 * wrong — the timbre is a tube and the tube is right. It sounds like a robot
 * because of the **rhythm and the melody**, and those are separately modelled,
 * separately published, and separately checkable.
 *
 * Two things are going on, and they are independent:
 *
 *   - **Duration.** How long each syllable lasts. Not a constant divided by the
 *     syllable count: English shortens unstressed syllables hard and lengthens
 *     the one before a boundary, and that pattern is most of what makes English
 *     sound like English rather than French.
 *   - **Pitch.** Where F0 goes. It falls across an utterance (DECLINATION), it
 *     jumps up on accented syllables, and what it does at the very end is the
 *     difference between a statement and a question.
 *
 * ## Duration is Klatt's rule form, and the floor is the interesting part
 *
 * Klatt (1979) modelled segment duration as a chain of multiplicative rules
 * applied not to the duration but to the duration ABOVE A FLOOR:
 *
 *   DUR = (INHERENT − MINIMUM) × percent/100 + MINIMUM
 *
 * That shape matters more than any of the percentages. It means no stack of
 * shortening rules can drive a segment to nothing — a syllable squeezed by
 * every rule at once still lands on its minimum. Take the floor out and the
 * model's rhythm leaves the range of every language ever measured (`npm run
 * prosody` reports 82.3 against a human span of 27 to 66).
 *
 * ## Pitch is a SEMITONE phenomenon, and that is the load-bearing claim
 *
 * Declination, accent size and the final rise are all published in semitones,
 * not hertz, and that is not a convention — it is the finding. A man, a woman
 * and a child saying the same sentence have F0 contours that differ by a
 * constant factor in hertz and are IDENTICAL in semitones.
 *
 * So this file does its pitch arithmetic in semitones and converts once at the
 * end. `npm run prosody` renders the same sentence on three tracts and checks
 * that the semitone contours coincide while the hertz contours do not — and
 * runs a hertz-based declination as a control, which must fail.
 */

import { VOWELS, type VoiceSpec, voiceOf } from './voice';

/**
 * Klatt's inherent stressed-vowel durations, milliseconds.
 *
 * DATA, as with `VOWELS`. These are measured durations of stressed vowels in a
 * neutral carrier, and they are already most of the rhythm: /æ/ is more than
 * three times /ə/ before any rule has run at all.
 */
export const KLATT_INHERENT: Record<string, number> = {
  i: 155, I: 135, E: 130, ae: 230, A: 240, O: 240, U: 160, u: 210, V: 140, '@': 70,
};

/**
 * The floor, as a fraction of the inherent duration.
 *
 * Klatt gives a per-segment MINDUR; across his vowels it runs a little under
 * half the inherent duration, and it is carried here as one fraction rather
 * than a second table of numbers this file cannot check. The SHAPE is what is
 * being claimed — a floor exists — and the gate measures what happens without
 * one rather than asserting the fraction is exactly right.
 */
export const KLATT_MIN_FRACTION = 0.45;

/** Klatt's rule percentages, as percentages, applied multiplicatively. */
export const DURATION_RULES = {
  /** An unstressed syllable is roughly half a stressed one. */
  unstressed: 50,
  /** Pre-pausal lengthening: the syllable before a boundary is stretched. */
  phraseFinal: 140,
  /** A non-phrase-final word-final syllable is slightly shortened. */
  wordFinal: 90,
};

/**
 * Pitch constants, in SEMITONES per second or semitones. 't Hart, Collier &
 * Cohen (1990). Semitones and not hertz, which is the whole point.
 */
export const DECLINATION = 0.55;
/** The "standard" accent excursion — how far F0 jumps for a stressed syllable. */
export const ACCENT_EXCURSION = 6;
/** A statement ends below the baseline; a yes/no question ends well above it. */
export const FINAL_FALL = 4;
export const QUESTION_RISE = 7;

/** Conversational English, syllables per second. An input, not a constant. */
export const SPEECH_RATE = 5.3;

/**
 * The reference male F0 the HERTZ control is calibrated on, and the hertz per
 * semitone at that pitch. Both exist only so `pitchInHertz` can be a faithful
 * version of the mistake rather than a strawman: someone writing declination in
 * hertz would measure it on one speaker and apply it to everybody, and these
 * are that speaker's numbers.
 */
const REFERENCE_F0 = 120;
const hertzOffset = (st: number): number => REFERENCE_F0 * (fromSemitones(st) - 1);

/** Ratio to semitones, and back. */
export const toSemitones = (ratio: number): number => 12 * Math.log2(Math.max(1e-9, ratio));
export const fromSemitones = (st: number): number => Math.pow(2, st / 12);

export interface Syllable {
  /** A key of `VOWELS`. */
  vowel: string;
  /** Carries the word's primary stress. Function words carry none. */
  stressed?: boolean;
  /** Last syllable of its word. */
  wordFinal?: boolean;
}

export type Intonation = 'statement' | 'question' | 'flat';
export type Timing = 'stress' | 'even';

export interface UtteranceOptions {
  voice?: VoiceSpec;
  /** Multiplier on the whole utterance. 1 is `SPEECH_RATE`. */
  rate?: number;
  intonation?: Intonation;
  /**
   * `'stress'` applies Klatt's reduction; `'even'` gives every syllable its
   * full inherent duration. The second is not "no rhythm" — the inherent
   * durations are still there — and the gate measures exactly how much of
   * English's rhythm survives it.
   */
  timing?: Timing;
  /** Semitones per second the baseline falls. Defaults to `DECLINATION`. */
  declination?: number;
  /**
   * Do the pitch arithmetic in HERTZ instead of semitones. Wrong, kept, and
   * exported for the same reason `FlowField`'s `grid8` is: a claim with no
   * alternative to fail against is not a claim. `npm run prosody` runs it and
   * requires it to break the three-bodies test.
   */
  pitchInHertz?: boolean;
}

export interface PlannedSyllable {
  vowel: string;
  /** Seconds. */
  seconds: number;
  /** Hertz at this syllable's centre. */
  f0: number;
  /** Semitones relative to the voice's resting pitch — the modelled quantity. */
  semitones: number;
  stressed: boolean;
}

/** Klatt's rule form: shortening applies above a floor, never through it. */
export function klattDuration(inherent: number, percent: number, minimum: number): number {
  return ((inherent - minimum) * percent) / 100 + minimum;
}

/**
 * Turn syllables into durations and a pitch contour.
 *
 * The durations come out of Klatt's rules; the pitch comes out of a declining
 * baseline with an excursion on every accent and a movement at the end. Nothing
 * here is fitted to a rhythm statistic — `npm run prosody` measures one out of
 * the result and compares it with published corpus values.
 */
export function planUtterance(
  syllables: readonly Syllable[],
  options: UtteranceOptions = {}
): PlannedSyllable[] {
  const voice = options.voice ?? voiceOf();
  const rate = Math.max(0.05, options.rate ?? 1);
  const intonation = options.intonation ?? 'statement';
  const timing = options.timing ?? 'stress';
  const declination = options.declination ?? DECLINATION;
  if (!syllables.length) return [];

  // ---- durations
  const planned: PlannedSyllable[] = [];
  let elapsed = 0;
  const total = syllables.length;
  for (let i = 0; i < total; i++) {
    const s = syllables[i];
    const inherent = KLATT_INHERENT[s.vowel] ?? KLATT_INHERENT['@'];
    const minimum = inherent * KLATT_MIN_FRACTION;
    let percent = 100;
    if (timing === 'stress' && !s.stressed) percent = DURATION_RULES.unstressed;
    if (i === total - 1) percent = (percent * DURATION_RULES.phraseFinal) / 100;
    else if (s.wordFinal) percent = (percent * DURATION_RULES.wordFinal) / 100;
    const seconds = klattDuration(inherent, percent, minimum) / 1000 / rate;
    planned.push({ vowel: s.vowel, seconds, f0: voice.f0, semitones: 0, stressed: !!s.stressed });
  }

  // ---- pitch, in semitones relative to the voice's own resting F0
  //
  // The final movement — the fall that ends a statement, the rise that ends a
  // question — begins at the LAST STRESSED syllable and runs to the end. That
  // is the nuclear tone, and putting it on the last syllable instead was a
  // modelling error with an audible consequence: English sentences very often
  // end on a reduced schwa lasting under sixty milliseconds ("...for WA-ter"),
  // so a question and a statement came out with the same tune everywhere a
  // listener could hear one. The gate caught it by measuring the rendered
  // audio and finding the two identical.
  let nucleus = planned.length - 1;
  for (let i = planned.length - 1; i >= 0; i--) {
    if (planned[i].stressed) { nucleus = i; break; }
  }
  const span = planned.reduce((a, p) => a + p.seconds, 0);
  let nucleusStart = 0;
  for (let i = 0; i < nucleus; i++) nucleusStart += planned[i].seconds;
  const tail = Math.max(1e-6, span - nucleusStart);
  const move = intonation === 'question' ? QUESTION_RISE : -FINAL_FALL;
  for (let i = 0; i < planned.length; i++) {
    const centre = elapsed + planned[i].seconds / 2;
    elapsed += planned[i].seconds;
    let st = intonation === 'flat' ? 0 : -declination * centre;
    if (intonation !== 'flat') {
      if (planned[i].stressed) st += ACCENT_EXCURSION;
      // The movement runs in TIME from the start of the nuclear syllable to the
      // end of the utterance, so the nucleus itself is already partway through
      // it. Ramping by syllable INDEX instead put the whole movement on the
      // syllable after the nucleus — which in English is very often a reduced
      // schwa lasting under sixty milliseconds ("...for WA-ter"), so a question
      // and a statement came out with the same tune anywhere a listener could
      // hear one. The gate caught it by measuring the rendered audio and finding
      // the two identical to 0.0 semitones.
      st += move * Math.min(1, Math.max(0, (centre - nucleusStart) / tail));
    }
    planned[i].semitones = st;
    // The conversion happens ONCE, here. `pitchInHertz` runs the whole model in
    // HERTZ using the figures a reference male voice would give — which is what
    // a naive implementation does, and is why a child ends up with a contour
    // that barely moves. It is the control, and the gate requires it to fail.
    planned[i].f0 = options.pitchInHertz
      ? Math.max(40, voice.f0 + hertzOffset(st))
      : voice.f0 * fromSemitones(st);
  }
  return planned;
}

/**
 * The **normalized Pairwise Variability Index** (Grabe & Low, 2002).
 *
 * How unlike each syllable is from the one beside it, normalised so that
 * speaking faster does not change it. It is the measurement that actually
 * separates the rhythm classes — "stress-timed" English and Dutch score high,
 * "syllable-timed" French and Spanish score low — and it is a corpus statistic
 * measured off recordings of humans, so a duration model that was not built
 * from it has somewhere to land or fail to.
 */
export function nPVI(durations: readonly number[]): number {
  if (durations.length < 2) return 0;
  let sum = 0;
  for (let k = 0; k < durations.length - 1; k++) {
    const a = durations[k];
    const b = durations[k + 1];
    sum += Math.abs(a - b) / Math.max(1e-9, (a + b) / 2);
  }
  return (100 / (durations.length - 1)) * sum;
}

/**
 * English function words, which carry no stress.
 *
 * Stress is not marked by ear anywhere in this library. A word is in this set
 * or it is not, and a content word takes primary stress on its lexically
 * stressed syllable. Doing it any other way would mean the rhythm the gate
 * measures was one somebody chose.
 */
export const FUNCTION_WORDS: ReadonlySet<string> = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'can', 'did', 'do', 'for',
  'from', 'had', 'has', 'have', 'he', 'her', 'him', 'his', 'i', 'if', 'in', 'is', 'it',
  'its', 'me', 'my', 'no', 'not', 'of', 'on', 'or', 'our', 'she', 'so', 'that', 'the',
  'their', 'them', 'then', 'there', 'they', 'this', 'to', 'until', 'up', 'us', 'was',
  'we', 'were', 'what', 'when', 'which', 'who', 'will', 'with', 'would', 'you', 'your',
]);

export interface LexicalWord {
  /** One vowel per syllable, as keys of `VOWELS`. */
  vowels: readonly string[];
  /** Index of the syllable carrying primary stress. */
  stress?: number;
}

/**
 * Turn a word list into syllables, with stress assigned by rule.
 *
 * The vowels of each word have to come from somewhere — spelling does not carry
 * them in English — so this takes a lexicon. Turning text into that lexicon is
 * a separate problem and an honest one; this function does the part that is
 * mechanical.
 */
export function syllabify(
  words: readonly string[],
  lexicon: Record<string, LexicalWord>
): Syllable[] {
  const out: Syllable[] = [];
  for (const raw of words) {
    const word = raw.toLowerCase();
    const entry = lexicon[word];
    if (!entry || !entry.vowels.length) {
      out.push({ vowel: '@', stressed: false, wordFinal: true });
      continue;
    }
    const stress = entry.stress ?? 0;
    const isFunction = FUNCTION_WORDS.has(word);
    entry.vowels.forEach((vowel, i) => {
      out.push({
        vowel: VOWELS[vowel] ? vowel : '@',
        stressed: !isFunction && i === stress,
        wordFinal: i === entry.vowels.length - 1,
      });
    });
  }
  return out;
}
