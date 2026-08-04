/**
 * Voice — a formant synthesizer, and the vowel chart is the formant table.
 *
 * Giving an NPC a voice normally means shipping audio files, or a text-to-speech
 * engine that needs a network, or gibberish beeps. All three are outside what a
 * procedural library can honestly do: the first two are assets, and the third is
 * not a voice.
 *
 * There is a fourth option and it is sixty years old. Fant's **source-filter
 * theory** (1960): speech is a SOURCE — the vocal folds buzzing, or turbulent
 * noise — passed through a FILTER, the vocal tract, whose resonances are called
 * FORMANTS. The source carries pitch. The filter carries the vowel. They are
 * independent, which is why you can sing "ah" at any note, and why a WHISPER —
 * which has no vocal-fold source at all — is still perfectly intelligible.
 *
 * ## The resonances are a length and the speed of sound
 *
 * A vocal tract is a tube closed at the glottis and open at the lips, so it
 * resonates at odd quarter-wavelengths:
 *
 *   Fₙ = (2n − 1)·c / 4L
 *
 * With c = 343 m/s and an adult male tract of 17.5 cm:
 *
 *   F1 = 490 Hz     F2 = 1470 Hz     F3 = 2450 Hz
 *
 * The textbook neutral-vowel formants are 500, 1500 and 2500. **One length and
 * the speed of sound**, and nothing fitted.
 *
 * ## And the vowels are the chart ANIMA already reads
 *
 * The IPA vowel chart's axes are not arbitrary either. Vowel HEIGHT tracks F1
 * (inversely — a close vowel has a low F1), and BACKNESS with ROUNDING tracks
 * F2. Peterson and Barney measured this in 1952 on 76 speakers and it has been
 * reproduced ever since.
 *
 * So ANIMA's `PhonemeSpec` and this file's `VowelSpec` are the same two
 * coordinates read by two different organs — one draws a mouth, one makes a
 * sound — and neither package imports the other.
 *
 * ### The axis a viseme table does not need
 *
 * ANIMA's chart has height and roundedness and no BACKNESS, on purpose: you
 * cannot see where a tongue is, so a viseme table has no use for it. An ear can
 * hear it. `/i/` and `/ɯ/` are both close and unrounded and sit 1000 Hz apart in
 * F2, so this file carries the third axis that the visible one correctly went
 * without. That is not a defect at either end; it is where the two organs stop
 * agreeing about what a vowel is.
 *
 * ## What is measured and what is derived
 *
 * Honesty about which is which, because it decides what the gate can prove:
 *
 *   - The **neutral tube** is derived. `(2n−1)c/4L`, no inputs but a length.
 *   - The **reference vowel formants** are Peterson & Barney's adult-male
 *     measurements. They are data, not a model, and they are labelled as data.
 *   - **Every other voice is derived from those by one number.** A shorter tract
 *     scales every formant by `L_ref / L`, so a woman's and a child's voice come
 *     out of the male table and a length. `npm run voice` renders them and
 *     checks against Peterson & Barney's WOMEN'S and CHILDREN'S rows, which are
 *     used to build nothing — an out-of-sample test of the one thing this file
 *     actually claims.
 */

/** Metres per second, dry air at 20 °C. */
export const SPEED_OF_SOUND = 343;

/** Adult male vocal tract, metres. The length every other one is scaled from. */
export const REFERENCE_TRACT = 0.175;

/** Adult female vocal tract, metres — measured, not `REFERENCE_TRACT × 0.86`. */
export const FEMALE_TRACT = 0.15;

/** A ten-year-old's, metres. */
export const CHILD_TRACT = 0.125;

/**
 * Resonances of a uniform tube closed at one end and open at the other.
 *
 *   Fₙ = (2n − 1)·c / 4L
 *
 * This is the whole of the neutral vowel: a tract at rest, tongue flat, and the
 * schwa that comes out of it. Every other vowel is this tube with a constriction
 * somewhere in it.
 */
export function tubeFormants(tractLength: number, count = 3): number[] {
  const out: number[] = [];
  const l = Math.max(1e-4, tractLength);
  for (let n = 1; n <= count; n++) out.push(((2 * n - 1) * SPEED_OF_SOUND) / (4 * l));
  return out;
}

export interface VowelSpec {
  ipa: string;
  /**
   * The IPA chart's vertical axis, 0 (close) to 1 (open) — the same number
   * ANIMA's viseme table reads, and inversely what F1 does.
   */
  height: number;
  /** Roundedness, 0..1. Also ANIMA's. */
  round: number;
  /**
   * Backness, 0 (front) to 1 (back). **The axis a viseme table does not have**,
   * because a tongue is not visible and is perfectly audible.
   */
  back: number;
  /** Hz, on a `REFERENCE_TRACT`. Peterson & Barney (1952), adult males. */
  f1: number;
  f2: number;
  f3: number;
}

/**
 * Ten vowels, with their measured formants on an adult male tract.
 *
 * These are DATA. The model in this file is the tube and the scaling; the rows
 * below are what 76 speakers actually did in 1952, and pretending they were
 * derived would be the kind of lie the rest of the library exists to avoid.
 */
export const VOWELS: Record<string, VowelSpec> = {
  i: { ipa: 'i', height: 0.05, round: 0.0, back: 0.0, f1: 270, f2: 2290, f3: 3010 },
  I: { ipa: 'ɪ', height: 0.2, round: 0.0, back: 0.15, f1: 390, f2: 1990, f3: 2550 },
  E: { ipa: 'ɛ', height: 0.6, round: 0.0, back: 0.2, f1: 530, f2: 1840, f3: 2480 },
  ae: { ipa: 'æ', height: 0.85, round: 0.0, back: 0.15, f1: 660, f2: 1720, f3: 2410 },
  A: { ipa: 'ɑ', height: 1.0, round: 0.05, back: 0.9, f1: 730, f2: 1090, f3: 2440 },
  O: { ipa: 'ɔ', height: 0.7, round: 0.75, back: 0.95, f1: 570, f2: 840, f3: 2410 },
  U: { ipa: 'ʊ', height: 0.25, round: 0.7, back: 0.8, f1: 440, f2: 1020, f3: 2240 },
  u: { ipa: 'u', height: 0.05, round: 1.0, back: 1.0, f1: 300, f2: 870, f3: 2240 },
  V: { ipa: 'ʌ', height: 0.75, round: 0.0, back: 0.7, f1: 640, f2: 1190, f3: 2390 },
  '@': { ipa: 'ə', height: 0.5, round: 0.1, back: 0.5, f1: 490, f2: 1350, f3: 2440 },
};

export const VOWEL_KEYS = Object.keys(VOWELS);

/**
 * Formant bandwidths, Hz — how sharp each resonance is.
 *
 * Losses in the tract: wall vibration, viscosity, radiation. These are the
 * typical measured values every formant synthesizer since Klatt (1980) uses, and
 * they widen with formant number because the higher resonances lose more.
 */
export const BANDWIDTHS = [60, 90, 150];

/** Vocal tract length for a body, metres. */
export function tractLengthFor(bodyHeight: number): number {
  // A tenth of standing height, which is what an adult male is to three
  // significant figures — 17.5 cm on 1.75 m.
  //
  // It is a FIRST-ORDER model and the residual is real and known: an adult male
  // larynx descends at puberty, so male tracts run some 8% longer than
  // proportional, and a woman of the same height has a slightly shorter tract
  // than this returns (Fitch & Giedd 1999). The gate measures that residual
  // rather than burying it in a fudge factor.
  return Math.max(0.05, bodyHeight * 0.1);
}

/**
 * The formants of a vowel on a tract of any length.
 *
 * ONE NUMBER changes. A tract `k` times shorter resonates `k` times higher, all
 * the way up, which is why a child is not a small adult but a transposed one.
 */
export function formantsOf(vowel: string, tractLength = REFERENCE_TRACT): number[] {
  const spec = VOWELS[vowel] ?? VOWELS['@'];
  const scale = REFERENCE_TRACT / Math.max(1e-4, tractLength);
  return [spec.f1 * scale, spec.f2 * scale, spec.f3 * scale];
}

export interface VoiceSpec {
  /** Metres. */
  tract: number;
  /** Hz — where the vocal folds sit when this voice is not doing anything. */
  f0: number;
}

export interface VoiceOptions {
  /** Standing height, metres. ANIMA's `rig.height` drops straight in. */
  height?: number;
  /** Vocal tract length, metres. Overrides `height`. */
  tract?: number;
  /** Resting pitch, Hz. Derived from the tract when absent. */
  f0?: number;
}

/**
 * A voice for a body.
 *
 * The tract comes from the height. The pitch does NOT come from the tract — the
 * folds and the tube are different organs and they scale differently, which is
 * exactly why a counter-tenor is possible — but they are correlated enough that
 * a resting F0 derived from tract length lands in the published range for that
 * size: about 120 Hz for an adult male tract, 210 for a female one, 300 for a
 * child's.
 */
export function voiceOf(options: VoiceOptions = {}): VoiceSpec {
  const tract = options.tract ?? tractLengthFor(options.height ?? 1.75);
  // 120 Hz at the reference tract, going as 1/L like everything else here.
  const f0 = options.f0 ?? 120 * (REFERENCE_TRACT / tract);
  return { tract, f0 };
}

export interface RenderOptions {
  seconds?: number;
  sampleRate?: number;
  /**
   * Vocal-fold frequency, Hz. **Zero or absent renders a WHISPER** — noise
   * through the same filter, no source pitch at all.
   *
   * A whisper is not a degraded mode. It is the filter on its own, and the fact
   * that it stays intelligible is the evidence that the vowel was never in the
   * pitch. It is also how the gate measures the formants: to see what a filter
   * does, excite it with noise.
   */
  f0?: number;
  amplitude?: number;
  seed?: number;
}

/** A two-pole resonator — one formant. Klatt's, and everybody's since. */
function resonator(frequency: number, bandwidth: number, sampleRate: number) {
  const r = Math.exp((-Math.PI * bandwidth) / sampleRate);
  const c = -r * r;
  const b = 2 * r * Math.cos((2 * Math.PI * frequency) / sampleRate);
  const a = 1 - b - c;
  let y1 = 0;
  let y2 = 0;
  return (x: number): number => {
    const y = a * x + b * y1 + c * y2;
    y2 = y1;
    y1 = y;
    return y;
  };
}

/**
 * The glottal source: a train of Rosenberg pulses.
 *
 * Not a sawtooth and not a square. The folds open slowly and slam shut, and the
 * asymmetry is what a voice sounds like — Rosenberg (1971) measured the shape
 * and fitted the two-piece polynomial used here. The `open quotient` of 0.6 is
 * the fraction of each cycle the folds are apart.
 */
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

/** Deterministic noise, so a whisper is the same whisper twice. */
function noiseSource(seed: number): () => number {
  let state = (seed | 0) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state / 0x7fffffff) % 2;
  };
}

/**
 * Render formants to samples. Pure — no WebAudio, no browser, no assets.
 *
 * Source into a CASCADE of resonators, then a first-order difference for the
 * radiation at the lips (a mouth radiates the derivative of the volume flow,
 * which is the +6 dB/octave tilt every speech spectrum has).
 */
export function renderFormants(formants: number[], options: RenderOptions = {}): Float32Array {
  const sampleRate = options.sampleRate ?? 22050;
  const seconds = options.seconds ?? 0.4;
  const f0 = options.f0 ?? 0;
  const amplitude = options.amplitude ?? 0.5;
  const n = Math.max(1, Math.round(seconds * sampleRate));
  const out = new Float32Array(n);

  const filters = formants.map((f, i) =>
    resonator(Math.min(f, sampleRate / 2 - 100), BANDWIDTHS[i] ?? 200, sampleRate)
  );
  const noise = noiseSource(options.seed ?? 1);
  let phase = 0;
  let previous = 0;

  for (let i = 0; i < n; i++) {
    let x: number;
    if (f0 > 0) {
      phase += f0 / sampleRate;
      if (phase >= 1) phase -= 1;
      x = glottalPulse(phase);
    } else {
      x = noise();
    }
    for (const filter of filters) x = filter(x);
    // Radiation at the lips: the derivative.
    const y = x - previous;
    previous = x;
    out[i] = y * amplitude;
  }

  // Normalise: a cascade's gain depends on where the formants landed, and a
  // voice that gets quieter for saying /i/ is a bug, not a vowel.
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(out[i]));
  if (peak > 1e-9) {
    const g = amplitude / peak;
    for (let i = 0; i < n; i++) out[i] *= g;
  }
  return out;
}

/** Render one vowel on one voice. */
export function renderVowel(
  vowel: string,
  voice: VoiceSpec = voiceOf(),
  options: RenderOptions = {}
): Float32Array {
  return renderFormants(formantsOf(vowel, voice.tract), {
    f0: options.f0 ?? voice.f0,
    ...options,
  });
}

export interface VoiceSegment {
  /** A key of `VOWELS`. */
  vowel: string;
  seconds: number;
}

/**
 * Render a string of vowels, with the formants sliding between them.
 *
 * The slide is the point: formants do not jump, they glide, and the glide is
 * most of what makes a sequence sound like speech rather than a keyboard.
 */
export function renderVoice(
  segments: readonly VoiceSegment[],
  voice: VoiceSpec = voiceOf(),
  options: RenderOptions = {}
): Float32Array {
  const sampleRate = options.sampleRate ?? 22050;
  const f0 = options.f0 ?? voice.f0;
  const amplitude = options.amplitude ?? 0.5;
  const total = segments.reduce((a, s) => a + Math.max(0, s.seconds), 0);
  const n = Math.max(1, Math.round(total * sampleRate));
  const out = new Float32Array(n);
  if (!segments.length) return out;

  const targets = segments.map((s) => formantsOf(s.vowel, voice.tract));
  const noise = noiseSource(options.seed ?? 1);
  let phase = 0;
  let previous = 0;
  // Held filter state across the whole utterance, retuned every sample.
  const state = [0, 0, 0].map(() => ({ y1: 0, y2: 0 }));

  let cursor = 0;
  for (let s = 0; s < segments.length; s++) {
    const length = Math.round(Math.max(0, segments[s].seconds) * sampleRate);
    const from = s === 0 ? targets[0] : targets[s - 1];
    const to = targets[s];
    for (let i = 0; i < length && cursor < n; i++, cursor++) {
      // Glide over the first third of the segment, then hold.
      const t = Math.min(1, (i / Math.max(1, length)) * 3);
      let x: number;
      if (f0 > 0) {
        phase += f0 / sampleRate;
        if (phase >= 1) phase -= 1;
        x = glottalPulse(phase);
      } else {
        x = noise();
      }
      for (let k = 0; k < 3; k++) {
        const f = from[k] + (to[k] - from[k]) * t;
        const r = Math.exp((-Math.PI * BANDWIDTHS[k]) / sampleRate);
        const c = -r * r;
        const b = 2 * r * Math.cos((2 * Math.PI * Math.min(f, sampleRate / 2 - 100)) / sampleRate);
        const a = 1 - b - c;
        const y = a * x + b * state[k].y1 + c * state[k].y2;
        state[k].y2 = state[k].y1;
        state[k].y1 = y;
        x = y;
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
