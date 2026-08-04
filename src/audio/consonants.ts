/**
 * Consonants — and a consonant is mostly not a sound.
 *
 * `voice.ts` is a cascade of resonators, which is a vowel and only a vowel.
 * Consonants break it in three separate ways, and each break is a different
 * piece of machinery rather than another row in a table.
 *
 * ## 1. The one that is genuinely surprising: a stop is a TRANSITION
 *
 * Ask what `/b/` sounds like and the answer seems obvious — a little burst of
 * noise at the lips. Delattre, Liberman and Cooper (1955) cut the bursts off
 * synthetic syllables at Haskins and found listeners still heard `/b/`, `/d/`
 * and `/g/` perfectly well; splice one consonant's burst onto another's
 * transitions and you hear the TRANSITIONS. What identifies a stop is where the
 * second formant is **heading** as the vowel begins.
 *
 * Each stop has a **locus**: a frequency the F2 transition points back to,
 * whatever vowel follows. `/b/` about 720 Hz, `/d/` about 1800. So `/bi/` has
 * an F2 that rises steeply from 720 up to /i/'s 2290, and `/bu/` has one that
 * falls gently from 720 down to /u/'s 870 — opposite directions, same consonant,
 * because the locus is a property of where the tongue and lips were.
 *
 * `npm run consonants` renders each stop before all ten vowels, measures F2 at
 * voicing onset, extrapolates back, and checks the ten extrapolations agree on
 * one number. **The locus is not given to the analyser.**
 *
 * ## 2. The one with a published number: VOICE ONSET TIME
 *
 * `/b/` and `/p/` are the same closure at the same place. What separates them is
 * when the vocal folds start relative to the release — the **voice onset time**
 * — and Lisker and Abramson (1964) measured it across languages. English initial
 * stops: `/b/` 1 ms, `/d/` 5, `/g/` 21, `/p/` 58, `/t/` 70, `/k/` 80. Voiceless
 * stops are ASPIRATED in English, which is why an unaspirated `/p/` sounds like
 * `/b/` to an English ear and does not in French.
 *
 * That table is data. It also has a shape nobody put there on purpose: VOT rises
 * as the closure moves back through the mouth, labial → alveolar → velar, in
 * both series. The gate measures VOT out of the rendered audio and checks both.
 *
 * ## 3. The one that changes the architecture: a nasal needs a ZERO
 *
 * For `/m/`, `/n/` and `/ŋ/` the mouth is CLOSED and the sound leaves through the
 * nose. The oral cavity is still there, hanging off the side of the path as a
 * dead end — and a side branch does not add a resonance, it **subtracts** one.
 * At the frequency where the closed oral tube is a quarter wavelength, the air
 * rushes into it and back in antiphase, and that frequency disappears from the
 * output. An **antiformant**, or zero.
 *
 * A cascade of resonators cannot do this at any setting. Resonators are poles;
 * poles make peaks. Getting a notch requires zeros, which is a different filter
 * — and it is why `renderFormants` was never going to say `/m/` no matter how
 * its table was tuned. The gate renders the nasals, finds the notch, and runs
 * an all-pole version alongside as the control, which must fail to produce one.
 */

import { BANDWIDTHS, VOWELS, type VoiceSpec, formantsOf, voiceOf } from './voice';

export type Manner = 'stop' | 'fricative' | 'nasal' | 'approximant';
export type Place = 'labial' | 'dental' | 'alveolar' | 'postalveolar' | 'velar' | 'glottal';

export interface ConsonantSpec {
  ipa: string;
  manner: Manner;
  place: Place;
  voiced: boolean;
  /**
   * The F2 **locus**, Hz — the frequency the second formant transition points
   * back to. Delattre, Liberman & Cooper (1955), measured at Haskins.
   */
  locus: number;
  /** Closure or constriction, milliseconds. */
  hold: number;
  /**
   * Voice onset time, milliseconds. Lisker & Abramson (1964), English initial
   * position. Stops only.
   */
  vot?: number;
  /** Resonances the frication or burst noise is shaped by, Hz. */
  noise?: readonly number[];
  /** How loud the frication is. Sibilants are loud; `/f/` and `/θ/` are not. */
  noiseGain?: number;
  /**
   * The ANTIFORMANT, Hz. Nasals only, and the reason this file exists.
   *
   * Where the closed oral cavity is a quarter wavelength, it swallows the
   * output. `/m/` has the longest side branch — the whole mouth — so its zero is
   * lowest; `/ŋ/` closes at the velum and has almost no branch left, so its zero
   * is highest.
   */
  zero?: number;
}

/**
 * The consonants, with their measured constants.
 *
 * `locus` is Delattre et al. (1955). `vot` is Lisker & Abramson (1964). Both are
 * DATA and are labelled as data, the same way `VOWELS` is. What this file MODELS
 * is what to do with them.
 *
 * `/g/` is the honest exception. A velar closure has no single locus: it is made
 * further forward before a front vowel than a back one, so F2 and F3 come
 * together at release ("the velar pinch") at a frequency that follows the vowel.
 * The value here is a compromise, the gate measures how badly it scatters
 * instead of hiding it, and that scatter is a real property of velars rather
 * than a defect in the number.
 */
export const CONSONANTS: Record<string, ConsonantSpec> = {
  b: { ipa: 'b', manner: 'stop', place: 'labial', voiced: true, locus: 720, hold: 75, vot: 1 },
  d: { ipa: 'd', manner: 'stop', place: 'alveolar', voiced: true, locus: 1800, hold: 70, vot: 5 },
  g: { ipa: 'g', manner: 'stop', place: 'velar', voiced: true, locus: 2000, hold: 70, vot: 21 },
  p: { ipa: 'p', manner: 'stop', place: 'labial', voiced: false, locus: 720, hold: 85, vot: 58 },
  t: { ipa: 't', manner: 'stop', place: 'alveolar', voiced: false, locus: 1800, hold: 80, vot: 70 },
  k: { ipa: 'k', manner: 'stop', place: 'velar', voiced: false, locus: 2000, hold: 80, vot: 80 },

  // Fricatives. A sibilant is noise shaped by the small cavity in FRONT of the
  // constriction, which is why /s/ is so high: that cavity is a centimetre or
  // two long. /f/ and /θ/ have essentially no front cavity, so their noise is
  // diffuse and about 20 dB quieter — which is why they are the two English
  // consonants people mishear most.
  f: { ipa: 'f', manner: 'fricative', place: 'labial', voiced: false, locus: 1000, hold: 100, noise: [1200, 4500, 8000], noiseGain: 0.06 },
  v: { ipa: 'v', manner: 'fricative', place: 'labial', voiced: true, locus: 1000, hold: 65, noise: [1200, 4500, 8000], noiseGain: 0.08 },
  T: { ipa: 'θ', manner: 'fricative', place: 'dental', voiced: false, locus: 1400, hold: 95, noise: [1400, 5500, 8200], noiseGain: 0.1 },
  D: { ipa: 'ð', manner: 'fricative', place: 'dental', voiced: true, locus: 1400, hold: 60, noise: [1400, 5500, 8200], noiseGain: 0.07 },
  s: { ipa: 's', manner: 'fricative', place: 'alveolar', voiced: false, locus: 1800, hold: 110, noise: [4200, 6800, 8200], noiseGain: 0.5 },
  z: { ipa: 'z', manner: 'fricative', place: 'alveolar', voiced: true, locus: 1800, hold: 75, noise: [4200, 6800, 8200], noiseGain: 0.32 },
  S: { ipa: 'ʃ', manner: 'fricative', place: 'postalveolar', voiced: false, locus: 1900, hold: 110, noise: [2200, 3600, 5200], noiseGain: 0.5 },
  Z: { ipa: 'ʒ', manner: 'fricative', place: 'postalveolar', voiced: true, locus: 1900, hold: 75, noise: [2200, 3600, 5200], noiseGain: 0.32 },
  h: { ipa: 'h', manner: 'fricative', place: 'glottal', voiced: false, locus: 0, hold: 70, noise: [], noiseGain: 0.2 },

  // Nasals. `zero` is the whole point — see the module comment.
  m: { ipa: 'm', manner: 'nasal', place: 'labial', voiced: true, locus: 720, hold: 80, zero: 750 },
  n: { ipa: 'n', manner: 'nasal', place: 'alveolar', voiced: true, locus: 1800, hold: 75, zero: 1700 },
  N: { ipa: 'ŋ', manner: 'nasal', place: 'velar', voiced: true, locus: 2000, hold: 80, zero: 3000 },

  // Approximants are the cheap ones: a formant target and a slow glide to it.
  // /r/'s famously low F3 is the single thing that makes it /r/.
  l: { ipa: 'l', manner: 'approximant', place: 'alveolar', voiced: true, locus: 1100, hold: 65 },
  r: { ipa: 'ɹ', manner: 'approximant', place: 'postalveolar', voiced: true, locus: 1100, hold: 70 },
  w: { ipa: 'w', manner: 'approximant', place: 'labial', voiced: true, locus: 800, hold: 60 },
  j: { ipa: 'j', manner: 'approximant', place: 'palatal' as Place, voiced: true, locus: 2200, hold: 55 },
};

export const CONSONANT_KEYS = Object.keys(CONSONANTS);

/**
 * How much of the coming vowel is already in the closure, 0..1.
 *
 * A consonant is not articulated in isolation and then handed over. While the
 * lips are shut for `/b/` the tongue has nothing to do, so it is already sitting
 * where the vowel wants it — which is why `/bi/` and `/bu/` have almost no F2
 * transition left to make. An alveolar closure uses the tongue TIP and pins the
 * body part-way. A velar closure IS the tongue body, the same organ that makes
 * F2, so there is nothing left over to anticipate with — and where the closure
 * lands moves with the vowel instead, which is the velar pinch.
 *
 * The ordering here is anatomy: it follows which articulator is occupied. The
 * MAGNITUDES are close to the locus-equation slopes Sussman, McCaffrey and
 * Matthews measured in 1991 (about 0.87 labial, 0.43 alveolar), and `npm run
 * consonants` measures them back out — which is a round trip through the
 * renderer rather than a prediction, and is labelled as one.
 */
export const COARTICULATION: Record<string, number> = {
  labial: 0.85,
  dental: 0.6,
  alveolar: 0.45,
  postalveolar: 0.5,
  velar: 0.65,
  glottal: 1,
  palatal: 0.5,
};

/**
 * The full formant target for a consonant's own hold, Hz.
 *
 * F2 is the locus. F1 is low for everything that constricts the tract — a
 * narrow tract has a low first formant, which is a fact about tubes rather than
 * a table. F3 is where `/r/` earns its living: an English `/ɹ/` drops F3 to
 * around 1600 Hz, nearly touching F2, and nothing else in the language does.
 */
export function consonantFormants(key: string, tract: number, nextVowel?: string): number[] {
  const spec = CONSONANTS[key];
  const scale = 0.175 / Math.max(1e-4, tract);
  if (!spec) return formantsOf('@', tract);
  const f1 = spec.manner === 'approximant' ? 400 : 280;
  const f3 = key === 'r' ? 1600 : key === 'l' ? 2600 : 2500;
  let f2 = Math.max(200, spec.locus);
  const vowel = nextVowel ? VOWELS[nextVowel] : undefined;
  if (vowel) {
    // A VELAR has no fixed coarticulation because it has no fixed place: the
    // closure is made further forward before a front vowel and further back
    // before a back one, so the tongue body follows the vowel almost completely
    // in one case and hardly at all in the other. Sussman's slopes for /g/ come
    // out around 0.36 and 0.90 depending on which set of vowels you use, and
    // splitting them is more honest than averaging into a number that describes
    // neither.
    const k = spec.place === 'velar'
      ? (vowel.back < 0.5 ? 0.4 : 0.9)
      : COARTICULATION[spec.place] ?? 0.5;
    f2 = f2 + k * (vowel.f2 - f2);
  }
  return [f1 * scale, Math.max(200, f2) * scale, f3 * scale];
}

/** A phone in an utterance: a vowel key, or a consonant key. */
export interface Phone {
  /** A key of `VOWELS` or of `CONSONANTS`. */
  phone: string;
  /** Seconds. Vowels only — a consonant's duration comes from its own spec. */
  seconds?: number;
  /** Hertz for this phone's voicing. Absent inherits the utterance's. */
  f0?: number;
}

export const isConsonant = (key: string): boolean => Object.prototype.hasOwnProperty.call(CONSONANTS, key);
export const isVowel = (key: string): boolean => Object.prototype.hasOwnProperty.call(VOWELS, key);

/** A two-pole resonator. */
function resonator(sampleRate: number) {
  let y1 = 0;
  let y2 = 0;
  return (x: number, frequency: number, bandwidth: number): number => {
    const r = Math.exp((-Math.PI * bandwidth) / sampleRate);
    const c = -r * r;
    const b = 2 * r * Math.cos((2 * Math.PI * Math.min(frequency, sampleRate / 2 - 100)) / sampleRate);
    const a = 1 - b - c;
    const y = a * x + b * y1 + c * y2;
    y2 = y1;
    y1 = y;
    return y;
  };
}

/**
 * A two-ZERO section — an antiresonator. The thing a cascade of poles cannot be.
 *
 * It is the resonator's own difference equation turned inside out: where a
 * resonator feeds its output back to build a peak, this feeds the INPUT forward
 * to cancel one. Klatt (1980) writes it exactly this way, and the coefficients
 * are the resonator's, reciprocated.
 */
function antiresonator(sampleRate: number) {
  let x1 = 0;
  let x2 = 0;
  return (x: number, frequency: number, bandwidth: number): number => {
    const r = Math.exp((-Math.PI * bandwidth) / sampleRate);
    const c = -r * r;
    const b = 2 * r * Math.cos((2 * Math.PI * Math.min(frequency, sampleRate / 2 - 100)) / sampleRate);
    const a = 1 / Math.max(1e-9, 1 - b - c);
    const y = a * x - a * b * x1 - a * c * x2;
    x2 = x1;
    x1 = x;
    return y;
  };
}

/** Rosenberg's glottal pulse. */
function glottalPulse(phase: number): number {
  const open = 0.6;
  const close = 0.16;
  if (phase < open) {
    const t = phase / open;
    return 3 * t * t - 2 * t * t * t;
  }
  if (phase < open + close) {
    const t = (phase - open) / close;
    return 1 - t * t;
  }
  return 0;
}

function noiseSource(seed: number): () => number {
  let state = (seed | 0) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state / 0x7fffffff) % 2;
  };
}

export interface SpeechOptions {
  sampleRate?: number;
  /** Hertz. Zero renders the whole utterance whispered. */
  f0?: number;
  amplitude?: number;
  seed?: number;
  /**
   * Render nasals WITHOUT their antiformant — all poles, no zero.
   *
   * Wrong, kept, and exported for the reason `FlowField`'s `grid8` is: the claim
   * that a nasal needs a zero is empty without something that lacks one to fail
   * against. `npm run consonants` runs it and requires the notch to vanish.
   */
  noNasalZero?: boolean;
  /** Seconds per vowel when a `Phone` does not say. */
  vowelSeconds?: number;
}

/** One stretch of the timeline with a fixed articulatory target. */
interface Frame {
  seconds: number;
  /** Formant targets at the END of this frame. */
  formants: number[];
  /** Glottal amplitude, 0..1. */
  voicing: number;
  /** Frication amplitude, 0..1. */
  noise: number;
  /** Resonances shaping the frication. Empty means unshaped (a glottal /h/). */
  noiseFormants: readonly number[];
  /** Antiformant, Hz, or 0 for none. */
  zero: number;
  /** Fraction of the frame spent gliding to the target. */
  glide: number;
  f0: number;
  label: string;
}

/**
 * Turn phones into a timeline of articulatory frames.
 *
 * Exported because it is most of what this module claims, and because the gate
 * needs to know where each phone starts in order to measure it — `npm run
 * consonants` reads voice onset times off the rendered audio and needs the
 * release instants to measure from.
 */
export function planPhones(
  phones: readonly Phone[],
  voice: VoiceSpec = voiceOf(),
  options: SpeechOptions = {}
): Frame[] {
  const f0 = options.f0 ?? voice.f0;
  const vowelSeconds = options.vowelSeconds ?? 0.16;
  const frames: Frame[] = [];
  const tract = voice.tract;

  for (let i = 0; i < phones.length; i++) {
    const { phone } = phones[i];
    const pitch = phones[i].f0 ?? f0;
    const spec = CONSONANTS[phone];
    if (!spec) {
      const key = isVowel(phone) ? phone : '@';
      frames.push({
        seconds: Math.max(0, phones[i].seconds ?? vowelSeconds),
        formants: formantsOf(key, tract),
        voicing: 1, noise: 0, noiseFormants: [], zero: 0, glide: 0.35, f0: pitch,
        label: key,
      });
      continue;
    }

    // The FOLLOWING vowel, if there is one. A consonant's own articulation is
    // already partly the vowel after it, and that is not a refinement — it is
    // the difference between a locus equation with a slope and one with none.
    const after = phones[i + 1];
    const nextVowel = after && isVowel(after.phone) ? after.phone : undefined;
    const target = consonantFormants(phone, tract, nextVowel);
    const scale = 0.175 / Math.max(1e-4, tract);
    const noiseFormants = (spec.noise ?? []).map((f) => f * scale);

    if (spec.manner === 'stop') {
      // CLOSURE. Silence — and it is not a gap in the model, it is the sound of
      // a mouth being shut. A voiced stop keeps a weak low buzz going through it
      // (the "voice bar"), which is the only acoustic difference during the
      // closure itself.
      frames.push({
        seconds: spec.hold / 1000,
        formants: target,
        voicing: spec.voiced ? 0.12 : 0,
        noise: 0, noiseFormants: [], zero: 0, glide: 0.6, f0: pitch,
        label: `${phone}:closure`,
      });
      // BURST. A few milliseconds of noise shaped by the cavity in front of the
      // release, which for a stop is wherever the closure was.
      frames.push({
        seconds: 0.008,
        formants: target,
        voicing: 0, noise: 0.35,
        noiseFormants: [target[1], target[2], 5000 * scale],
        zero: 0, glide: 1, f0: pitch,
        label: `${phone}:burst`,
      });
      // ASPIRATION, for exactly the voice onset time. This is the whole /p/ vs
      // /b/ distinction and it is a DURATION, not a sound.
      const vot = Math.max(0, (spec.vot ?? 0) - 8) / 1000;
      if (vot > 0.0005) {
        frames.push({
          seconds: vot,
          formants: target,
          voicing: 0, noise: 0.2,
          noiseFormants: target,
          zero: 0, glide: 1, f0: pitch,
          label: `${phone}:aspiration`,
        });
      }
      continue;
    }

    if (spec.manner === 'nasal') {
      frames.push({
        seconds: spec.hold / 1000,
        // The nasal MURMUR is the NOSE, and the nose is the same tube whichever
        // way the mouth is shut — so all three nasals share these resonances,
        // and what distinguishes them is entirely the zero. Putting the ORAL
        // locus here instead was a modelling error with a measurable
        // consequence: /n/'s pole at 1800 sat on top of its own zero at 1700
        // and the two annihilated, so the notch the gate went looking for was
        // not there to find.
        formants: [270 * scale, 1200 * scale, 2400 * scale],
        voicing: 0.85, noise: 0, noiseFormants: [],
        zero: options.noNasalZero ? 0 : (spec.zero ?? 0) * scale,
        glide: 0.5, f0: pitch,
        label: `${phone}:murmur`,
      });
      continue;
    }

    if (spec.manner === 'fricative') {
      frames.push({
        seconds: spec.hold / 1000,
        formants: target,
        // A voiced fricative is BOTH at once — folds buzzing and turbulence at
        // the constriction — which is a thing this architecture can do and a
        // pure formant table cannot describe.
        voicing: spec.voiced ? 0.45 : 0,
        noise: spec.noiseGain ?? 0.3,
        noiseFormants,
        zero: 0, glide: 0.5, f0: pitch,
        label: phone,
      });
      continue;
    }

    // Approximant: no closure, no noise, just a target and a slow glide.
    frames.push({
      seconds: spec.hold / 1000,
      formants: target,
      voicing: 1, noise: 0, noiseFormants: [], zero: 0, glide: 0.85, f0: pitch,
      label: phone,
    });
  }
  return frames;
}

/**
 * Render an utterance of consonants and vowels.
 *
 * The formants glide continuously across the whole thing, which is what makes
 * the loci audible: a stop's transition is not decoration on the consonant, it
 * IS the consonant, and it lives in the first fifty milliseconds of the vowel
 * after it.
 */
export function renderSpeech(
  phones: readonly Phone[],
  voice: VoiceSpec = voiceOf(),
  options: SpeechOptions = {}
): Float32Array {
  const sampleRate = options.sampleRate ?? 22050;
  const amplitude = options.amplitude ?? 0.5;
  const frames = planPhones(phones, voice, options);
  const total = frames.reduce((a, f) => a + f.seconds, 0);
  const n = Math.max(1, Math.round(total * sampleRate));
  const out = new Float32Array(n);
  if (!frames.length) return out;

  const noise = noiseSource(options.seed ?? 1);
  const poles = [resonator(sampleRate), resonator(sampleRate), resonator(sampleRate)];
  const noisePoles = [resonator(sampleRate), resonator(sampleRate), resonator(sampleRate)];
  const notch = antiresonator(sampleRate);
  let phase = 0;
  let previous = 0;
  let cursor = 0;

  for (let s = 0; s < frames.length; s++) {
    const frame = frames[s];
    const length = Math.round(frame.seconds * sampleRate);
    const before = s === 0 ? frames[0] : frames[s - 1];
    for (let i = 0; i < length && cursor < n; i++, cursor++) {
      const t = Math.min(1, i / Math.max(1, length * frame.glide));
      let voiced = 0;
      if (frame.voicing > 0) {
        if (frame.f0 > 0) {
          phase += frame.f0 / sampleRate;
          if (phase >= 1) phase -= 1;
          voiced = glottalPulse(phase) * frame.voicing;
        } else {
          // WHISPERED: the same articulation with turbulence at the glottis
          // instead of folds. Same convention as `renderVowel`, and the same
          // use — to see what a filter does, excite it with noise. It is how
          // the gate reads a formant transition, because a whisper has no
          // harmonic comb to read the transition through.
          voiced = noise() * frame.voicing * 0.5;
        }
      }
      // The tract, glided from wherever it was to where this frame wants it.
      let x = voiced;
      for (let k = 0; k < 3; k++) {
        const f = before.formants[k] + (frame.formants[k] - before.formants[k]) * t;
        x = poles[k](x, f, BANDWIDTHS[k]);
      }
      // THE ZERO. Only a nasal has one, and no arrangement of the three poles
      // above could stand in for it.
      const zero = before.zero + (frame.zero - before.zero) * t;
      if (zero > 0) x = notch(x, zero, 250);

      // Frication runs through its OWN filters, in parallel — a fricative's
      // noise is shaped by the cavity in front of the constriction, which is
      // not the cavity the voicing came through.
      if (frame.noise > 0) {
        const source = noise() * frame.noise;
        let hiss = source;
        if (frame.noiseFormants.length) {
          // PARALLEL, not cascade. A fricative spectrum has several separate
          // peaks, and three narrow bandpasses IN SERIES pass almost nothing
          // when their centres are far apart — /f/'s 1200 / 4500 / 8000
          // cascaded came out 700 times quieter than /s/, which is silence
          // rather than a quiet consonant. Poles in series multiply; a spectrum
          // with several humps in it needs them added.
          hiss = 0;
          for (let k = 0; k < frame.noiseFormants.length && k < 3; k++) {
            hiss += noisePoles[k](source, frame.noiseFormants[k], 350);
          }
          hiss *= 3;
        }
        x += hiss;
      }

      const y = x - previous;
      previous = x;
      out[cursor] = y;
    }
  }

  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(out[i]));
  if (peak > 1e-9) {
    const g = amplitude / peak;
    for (let i = 0; i < n; i++) out[i] *= g;
  }
  return out;
}

/**
 * Where each frame starts and ends, in seconds.
 *
 * The gate needs release instants to measure voice onset time from, and it must
 * get them from the plan rather than from the audio it is judging.
 */
export function frameTimes(
  phones: readonly Phone[],
  voice: VoiceSpec = voiceOf(),
  options: SpeechOptions = {}
): Array<{ label: string; from: number; to: number }> {
  const frames = planPhones(phones, voice, options);
  const out: Array<{ label: string; from: number; to: number }> = [];
  let t = 0;
  for (const f of frames) {
    out.push({ label: f.label, from: t, to: t + f.seconds });
    t += f.seconds;
  }
  return out;
}
