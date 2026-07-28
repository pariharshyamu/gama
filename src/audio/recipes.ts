/**
 * Sound recipes — every effect in the library as pure, seeded DATA.
 *
 * There are no audio files anywhere in this trilogy, for the same reason
 * there are no texture files: everything is generated from a seed. A sound
 * here is a `SoundSpec` — a handful of oscillator and filtered-noise layers,
 * each with an envelope — and the functions in this file only do arithmetic.
 * They never touch the Web Audio API. That split is what makes audio
 * *testable*: a test can assert that a stone footstep is brighter than a
 * grass one, that every envelope starts and ends at zero (the difference
 * between a footstep and a click), and that the same seed produces the same
 * sound, all in plain Node with no ears and no browser.
 *
 * `Soundboard` is the other half: it takes these specs and turns them into
 * Web Audio nodes. Anything it can render, an `OfflineAudioContext` can
 * render headlessly — which is how the playground proves sound actually
 * comes out.
 */

/** A deterministic random stream, 0..1 — see `makeRandom`. */
export type Rand = () => number;

/** Deterministic little PRNG — mulberry32, matching SCENA's `Rng`. */
export function makeRandom(seed: number): Rand {
  let state = seed >>> 0 || 1;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One point on an automation curve: [time in seconds, value]. */
export type CurvePoint = [number, number];

/** Self-defined so this file needs no DOM lib; assignable to OscillatorType. */
export type Wave = 'sine' | 'square' | 'sawtooth' | 'triangle';
/** Assignable to BiquadFilterType. */
export type Filter = 'lowpass' | 'highpass' | 'bandpass' | 'peaking';

export interface OscLayer {
  kind: 'osc';
  wave: Wave;
  /** Frequency automation in Hz. Values must stay > 0 (exponential ramps). */
  freq: CurvePoint[];
  /** Gain envelope. First and last values are 0 — that is the no-click rule. */
  gain: CurvePoint[];
}

export interface NoiseLayer {
  kind: 'noise';
  color: 'white' | 'pink';
  filter: { type: Filter; freq: CurvePoint[]; q: number };
  gain: CurvePoint[];
}

export type SoundLayer = OscLayer | NoiseLayer;

export interface SoundSpec {
  /** Total length in seconds; layers may end earlier, never later. */
  duration: number;
  layers: SoundLayer[];
  /** What a caption feed prints for this sound. */
  caption: string;
}

// ---------------------------------------------------------------------------
// Envelope helpers. `hit` is the workhorse: near-instant attack, then decay.
// The 3 ms attack is not optional politeness — a gain that starts anywhere
// but zero is a waveform discontinuity, and a discontinuity is an audible
// click on every playback.
// ---------------------------------------------------------------------------

const hit = (peak: number, duration: number, attack = 0.003): CurvePoint[] => [
  [0, 0],
  [attack, peak],
  [duration, 0],
];

/** Fade in and out — for whooshes and anything without a transient. */
const bell = (peak: number, duration: number, rise = 0.35): CurvePoint[] => [
  [0, 0],
  [duration * rise, peak],
  [duration, 0],
];

const flat = (value: number): CurvePoint[] => [[0, value]];

/** ±spread proportional jitter, seeded. jitter(rand, 100, 0.1) → 90..110. */
const jitter = (rand: Rand, value: number, spread: number): number =>
  value * (1 + (rand() * 2 - 1) * spread);

// Written comparison-first so NaN falls out as 0: an engine fed garbage
// must idle, not schedule NaN onto an AudioParam (which throws).
const clamp01 = (x: number): number => (x > 0 ? (x < 1 ? x : 1) : 0);

// ---------------------------------------------------------------------------
// Footsteps
// ---------------------------------------------------------------------------

export type FootstepSurface =
  | 'grass'
  | 'dirt'
  | 'sand'
  | 'stone'
  | 'wood'
  | 'metal'
  | 'water';

interface StepVoice {
  filter: Filter;
  /** Filter centre in Hz — the single number that says hard or soft. */
  freq: number;
  q: number;
  duration: number;
  gain: number;
}

// Ordered soft → hard: the filter frequency IS the material. A boot on
// grass excites almost nothing above 1 kHz; the same boot on stone is
// mostly above 2 kHz. Everything else is trim.
const STEP_VOICES: Record<FootstepSurface, StepVoice> = {
  grass: { filter: 'lowpass', freq: 750, q: 0.7, duration: 0.09, gain: 0.5 },
  dirt: { filter: 'lowpass', freq: 950, q: 0.8, duration: 0.08, gain: 0.55 },
  sand: { filter: 'bandpass', freq: 1400, q: 0.6, duration: 0.15, gain: 0.45 },
  wood: { filter: 'bandpass', freq: 1100, q: 1.1, duration: 0.1, gain: 0.6 },
  stone: { filter: 'highpass', freq: 2100, q: 0.7, duration: 0.055, gain: 0.65 },
  metal: { filter: 'highpass', freq: 2600, q: 0.9, duration: 0.06, gain: 0.55 },
  water: { filter: 'bandpass', freq: 1600, q: 0.9, duration: 0.28, gain: 0.55 },
};

/**
 * One footfall. Two layers at most: the noise of the contact, and — only
 * where the ground itself resonates — a tuned body. Wood gets a hollow
 * knock around 120 Hz, metal a thin ring at ~1.7 kHz, water a downward
 * splash sweep instead of a static filter. `weight` scales loudness and
 * drops the pitch a little: a heavy character lands lower, not just louder.
 */
export function footstepSpec(
  rand: Rand,
  surface: FootstepSurface = 'grass',
  weight = 1
): SoundSpec {
  const voice = STEP_VOICES[surface];
  const freq = jitter(rand, voice.freq, 0.12) / Math.sqrt(Math.max(weight, 0.25));
  const gain = jitter(rand, voice.gain, 0.18) * Math.sqrt(Math.max(weight, 0.25));
  const duration = jitter(rand, voice.duration, 0.1) * (weight > 1 ? 1.15 : 1);

  const freqCurve: CurvePoint[] =
    surface === 'water'
      ? [
          [0, freq * 1.4],
          [duration, freq * 0.45],
        ]
      : flat(freq);

  const layers: SoundLayer[] = [
    {
      kind: 'noise',
      color: surface === 'water' ? 'white' : 'pink',
      filter: { type: voice.filter, freq: freqCurve, q: voice.q },
      gain: hit(gain, duration),
    },
  ];

  if (surface === 'wood') {
    const knock = jitter(rand, 120, 0.15);
    layers.push({
      kind: 'osc',
      wave: 'sine',
      freq: [
        [0, knock * 1.3],
        [0.06, knock],
      ],
      gain: hit(gain * 0.7, Math.min(duration * 1.2, 0.12)),
    });
  } else if (surface === 'metal') {
    layers.push({
      kind: 'osc',
      wave: 'triangle',
      freq: flat(jitter(rand, 1700, 0.2)),
      gain: hit(gain * 0.25, 0.22),
    });
  }

  const total = Math.max(...layers.map((l) => l.gain[l.gain.length - 1][0]));
  return { duration: total, layers, caption: `footstep on ${surface}` };
}

// ---------------------------------------------------------------------------
// Impacts, cracks, whooshes, splashes — the contact family
// ---------------------------------------------------------------------------

export type ImpactMaterial = 'soft' | 'wood' | 'stone' | 'metal';

interface ImpactVoice {
  /** Thump start frequency; it always falls to ~40% of this. */
  thump: number;
  noiseFilter: Filter;
  noiseFreq: number;
  /** Ring partials, as multiples of `thump` — metal's signature. */
  ring: number[];
}

const IMPACT_VOICES: Record<ImpactMaterial, ImpactVoice> = {
  soft: { thump: 120, noiseFilter: 'lowpass', noiseFreq: 500, ring: [] },
  wood: { thump: 175, noiseFilter: 'bandpass', noiseFreq: 900, ring: [] },
  stone: { thump: 220, noiseFilter: 'highpass', noiseFreq: 1500, ring: [] },
  metal: { thump: 250, noiseFilter: 'highpass', noiseFreq: 1800, ring: [4.2, 11.6] },
};

/**
 * A body hitting a body. The recipe is a falling sine thump plus a noise
 * transient shaped by the material — and for metal, two inharmonic ring
 * partials, because a struck plate does not ring at multiples of anything.
 * `energy` 0..1 scales loudness on a square root (perceptual) and length.
 */
export function impactSpec(
  rand: Rand,
  material: ImpactMaterial = 'wood',
  energy = 0.7
): SoundSpec {
  const voice = IMPACT_VOICES[material];
  const e = clamp01(energy);
  const loud = Math.sqrt(e) * 0.85;
  const thump = jitter(rand, voice.thump, 0.12);
  const body = 0.09 + e * 0.08;

  const layers: SoundLayer[] = [
    {
      kind: 'osc',
      wave: 'sine',
      freq: [
        [0, thump],
        [body, thump * 0.4],
      ],
      gain: hit(loud, body),
    },
    {
      kind: 'noise',
      color: 'white',
      filter: { type: voice.noiseFilter, freq: flat(jitter(rand, voice.noiseFreq, 0.15)), q: 0.8 },
      gain: hit(loud * 0.7, 0.03 + e * 0.03),
    },
  ];

  for (const partial of voice.ring) {
    layers.push({
      kind: 'osc',
      wave: 'triangle',
      freq: flat(jitter(rand, thump * partial, 0.05)),
      gain: hit(loud * 0.22, 0.25 + e * 0.3),
    });
  }

  const total = Math.max(...layers.map((l) => l.gain[l.gain.length - 1][0]));
  return { duration: total, layers, caption: `${material} impact` };
}

/**
 * The bat crack — or any sharp break. What separates a crack from an
 * impact is where the energy sits: almost all of it above 1 kHz, and
 * almost all of it inside the first 30 ms. The little 60 Hz thump
 * underneath is what stops it sounding like a snapped twig.
 */
export function crackSpec(rand: Rand, energy = 0.9): SoundSpec {
  const e = clamp01(energy);
  const loud = 0.4 + Math.sqrt(e) * 0.55;
  return {
    duration: 0.24,
    caption: 'sharp crack',
    layers: [
      {
        kind: 'noise',
        color: 'white',
        filter: { type: 'highpass', freq: flat(jitter(rand, 2300, 0.1)), q: 0.7 },
        gain: hit(loud, 0.028, 0.001),
      },
      {
        kind: 'noise',
        color: 'white',
        filter: { type: 'bandpass', freq: flat(jitter(rand, 1250, 0.12)), q: 1.4 },
        gain: hit(loud * 0.7, 0.07, 0.002),
      },
      {
        kind: 'osc',
        wave: 'triangle',
        freq: flat(jitter(rand, 2500, 0.15)),
        gain: hit(loud * 0.3, 0.09, 0.002),
      },
      {
        kind: 'osc',
        wave: 'sine',
        freq: [
          [0, 150],
          [0.07, 62],
        ],
        gain: hit(loud * 0.8, 0.09, 0.002),
      },
    ],
  };
}

/** A swing or a pass-by: bandpassed noise that rises and falls. */
export function whooshSpec(rand: Rand, speed = 0.7): SoundSpec {
  const s = clamp01(speed);
  const duration = 0.4 - s * 0.18;
  const peakFreq = jitter(rand, 550 + s * 900, 0.12);
  return {
    duration,
    caption: 'whoosh',
    layers: [
      {
        kind: 'noise',
        color: 'pink',
        filter: {
          type: 'bandpass',
          freq: [
            [0, peakFreq * 0.45],
            [duration * 0.45, peakFreq],
            [duration, peakFreq * 0.5],
          ],
          q: 1.6,
        },
        gain: bell(0.3 + s * 0.4, duration),
      },
    ],
  };
}

/** Water taking a body in — noise sweeping down as the cavity closes. */
export function splashSpec(rand: Rand, size = 0.6): SoundSpec {
  const s = clamp01(size);
  const duration = 0.25 + s * 0.35;
  return {
    duration,
    caption: 'splash',
    layers: [
      {
        kind: 'noise',
        color: 'white',
        filter: {
          type: 'bandpass',
          freq: [
            [0, jitter(rand, 2300, 0.15)],
            [duration, 480],
          ],
          q: 0.9,
        },
        gain: hit(0.35 + s * 0.4, duration, 0.008),
      },
      {
        kind: 'osc',
        wave: 'sine',
        freq: [
          [0, 220],
          [duration * 0.6, 90],
        ],
        gain: hit(0.25 * s, duration * 0.6, 0.01),
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Rewards and UI — the game-feedback family
// ---------------------------------------------------------------------------

/**
 * The two-note coin, as old as coins in games: a short fifth leaping to the
 * octave-and-a-bit above it, square waves and nothing else. The seeded
 * detune keeps a shower of coins from phasing into one long note.
 */
export function coinSpec(rand: Rand): SoundSpec {
  const detune = 1 + (rand() * 2 - 1) * 0.02;
  const first = 988 * detune;
  const second = 1319 * detune;
  return {
    duration: 0.38,
    caption: 'coin',
    layers: [
      {
        kind: 'osc',
        wave: 'square',
        freq: [
          [0, first],
          [0.07, first],
          [0.0701, second],
        ],
        gain: [
          [0, 0],
          [0.004, 0.16],
          [0.07, 0.14],
          [0.38, 0],
        ],
      },
      {
        kind: 'osc',
        wave: 'sine',
        freq: flat(second * 2),
        gain: [
          [0, 0],
          [0.075, 0],
          [0.08, 0.05],
          [0.34, 0],
        ],
      },
    ],
  };
}

/** A collect-burst pop: a fast upward chirp with a tick of noise. */
export function popSpec(rand: Rand): SoundSpec {
  const top = jitter(rand, 900, 0.1);
  return {
    duration: 0.12,
    caption: 'pop',
    layers: [
      {
        kind: 'osc',
        wave: 'sine',
        freq: [
          [0, top * 0.35],
          [0.06, top],
        ],
        gain: hit(0.35, 0.09, 0.004),
      },
      {
        kind: 'noise',
        color: 'white',
        filter: { type: 'highpass', freq: flat(3000), q: 0.7 },
        gain: hit(0.12, 0.03, 0.001),
      },
    ],
  };
}

/** A bounce: a sine whose pitch overshoots and settles, like the pad. */
export function boingSpec(rand: Rand): SoundSpec {
  const base = jitter(rand, 230, 0.12);
  return {
    duration: 0.42,
    caption: 'boing',
    layers: [
      {
        kind: 'osc',
        wave: 'sine',
        freq: [
          [0, base * 0.8],
          [0.07, base * 1.6],
          [0.16, base * 0.9],
          [0.26, base * 1.15],
          [0.42, base],
        ],
        gain: hit(0.5, 0.42, 0.005),
      },
      {
        kind: 'osc',
        wave: 'triangle',
        freq: [
          [0, base * 1.6],
          [0.07, base * 3.2],
          [0.16, base * 1.8],
          [0.42, base * 2],
        ],
        gain: hit(0.12, 0.3, 0.005),
      },
    ],
  };
}

const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880.0]; // C5 D5 E5 G5 A5

/** One glassy chime note off a pentatonic row — never lands on a sour one. */
export function chimeSpec(rand: Rand, step = 0): SoundSpec {
  const note = PENTATONIC[Math.abs(Math.round(step)) % PENTATONIC.length];
  const freq = jitter(rand, note, 0.004);
  return {
    duration: 0.6,
    caption: 'chime',
    layers: [
      { kind: 'osc', wave: 'triangle', freq: flat(freq), gain: hit(0.3, 0.6, 0.004) },
      { kind: 'osc', wave: 'sine', freq: flat(freq * 2), gain: hit(0.1, 0.45, 0.004) },
    ],
  };
}

/** Three chimes climbing the row — the objective-complete fanfare. */
export function successSpec(rand: Rand): SoundSpec {
  const layers: SoundLayer[] = [];
  [0, 2, 3].forEach((step, i) => {
    const start = i * 0.11;
    const freq = jitter(rand, PENTATONIC[step], 0.004);
    // The stagger lives in the envelope: silence until `start`, then the
    // note. The first note starts at zero, so its hold point would repeat
    // [0, 0] — leave it out.
    const delayed = (peak: number, decay: number): CurvePoint[] => [
      [0, 0],
      ...(start > 0 ? ([[start, 0]] as CurvePoint[]) : []),
      [start + 0.006, peak],
      [start + decay, 0],
    ];
    layers.push({ kind: 'osc', wave: 'triangle', freq: flat(freq), gain: delayed(0.26, 0.55) });
    layers.push({ kind: 'osc', wave: 'sine', freq: flat(freq * 2), gain: delayed(0.08, 0.4) });
  });
  return { duration: 0.22 + 0.55, layers, caption: 'success' };
}

/** Two soft notes stepping down. Losing should never be loud. */
export function failSpec(rand: Rand): SoundSpec {
  const top = jitter(rand, 392, 0.004); // G4
  const bottom = jitter(rand, 311.1, 0.004); // Eb4
  return {
    duration: 0.55,
    caption: 'fail',
    layers: [
      {
        kind: 'osc',
        wave: 'triangle',
        freq: [
          [0, top],
          [0.16, top],
          [0.1601, bottom],
        ],
        gain: [
          [0, 0],
          [0.006, 0.22],
          [0.16, 0.18],
          [0.55, 0],
        ],
      },
    ],
  };
}

/** The smallest UI sound there is: a 30 ms sine tick. */
export function tickSpec(rand: Rand): SoundSpec {
  return {
    duration: 0.03,
    caption: 'tick',
    layers: [
      { kind: 'osc', wave: 'sine', freq: flat(jitter(rand, 2000, 0.05)), gain: hit(0.12, 0.03, 0.001) },
    ],
  };
}

/** A brighter select/confirm blip. */
export function blipSpec(rand: Rand): SoundSpec {
  const base = jitter(rand, 700, 0.05);
  return {
    duration: 0.08,
    caption: 'blip',
    layers: [
      {
        kind: 'osc',
        wave: 'square',
        freq: [
          [0, base],
          [0.06, base * 1.35],
        ],
        gain: hit(0.1, 0.08, 0.002),
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Continuous voicings — pure parameter maps for the persistent sources.
// The Soundboard holds the nodes; these functions decide what the nodes
// should be doing for a given rpm / wind strength / crowd mood, and they
// are where the maths lives so tests can hold it still.
// ---------------------------------------------------------------------------

export interface EngineVoicing {
  /** One frequency per persistent oscillator: firing, crank sub, harmonic. */
  fundamentals: [number, number, number];
  gains: [number, number, number];
  noiseGain: number;
  noiseFreq: number;
}

/**
 * A four-stroke, four-cylinder voice: the firing frequency is rpm/60 × 2
 * (two power strokes per revolution), a sine an octave under it is the
 * crankshaft, a detuned near-second-harmonic gives the snarl, and
 * bandpassed noise is the intake — which is why `load` mostly turns the
 * NOISE up: an engine under load breathes harder before it revs higher.
 */
export function engineVoicing(rpm: number, load = 0.5): EngineVoicing {
  const r = Number.isFinite(rpm) ? Math.min(Math.max(rpm, 500), 8000) : 800;
  const l = clamp01(load);
  const firing = (r / 60) * 2;
  return {
    fundamentals: [firing, firing / 2, firing * 1.98],
    gains: [0.16 + l * 0.1, 0.2 + l * 0.06, 0.05 + l * 0.09],
    noiseGain: 0.02 + l * 0.1 + (r / 8000) * 0.05,
    noiseFreq: 700 + r * 0.16,
  };
}

export interface WindVoicing {
  gain: number;
  cutoff: number;
  gustDepth: number;
  gustRate: number;
}

/**
 * Wind is lowpassed noise; a gale is louder AND brighter. The gust LFO
 * wobbles the cutoff, and its rate rises with strength — a breeze breathes
 * slowly, a storm flutters.
 */
export function windVoicing(strength: number): WindVoicing {
  const s = clamp01(strength);
  return {
    gain: Math.pow(s, 1.4) * 0.5,
    cutoff: 240 + s * 660,
    gustDepth: s * 180,
    gustRate: 0.1 + s * 0.3,
  };
}

export interface RainVoicing {
  gain: number;
  /** Highpass cutoff — heavier rain reaches LOWER, not higher. */
  cutoff: number;
  patterGain: number;
}

/** Drizzle is a hiss; a downpour fills in the bottom and adds patter. */
export function rainVoicing(intensity: number): RainVoicing {
  const i = clamp01(intensity);
  return {
    gain: Math.pow(i, 1.2) * 0.4,
    cutoff: 1400 - i * 700,
    patterGain: i * 0.14,
  };
}

export interface CrowdVoicing {
  gain: number;
  /** Three vowel-ish formant centres; excitement raises all of them. */
  formants: [number, number, number];
  q: number;
  chatterRate: number;
}

/**
 * A crowd is pink noise pushed through three vowel formants — noise that
 * went to the trouble of sounding like people. Excitement raises the
 * formants (voices rise), the level, and the chatter flutter rate.
 */
export function crowdVoicing(excitement: number): CrowdVoicing {
  const e = clamp01(excitement);
  return {
    gain: 0.08 + Math.pow(e, 1.5) * 0.5,
    formants: [620 + e * 160, 1200 + e * 320, 2600 + e * 300],
    q: 4,
    chatterRate: 0.35 + e * 1.3,
  };
}

// ---------------------------------------------------------------------------
// Noise generation — seeded, so the same Soundboard seed is the same hiss.
// ---------------------------------------------------------------------------

/**
 * Fill a buffer with white or pink noise from a seeded stream. Pink is
 * Paul Kellet's three-pole approximation: same energy per octave rather
 * than per hertz, which is why it reads as weather and white reads as TV
 * static.
 */
export function fillNoise(data: Float32Array, rand: Rand, color: 'white' | 'pink'): void {
  if (color === 'white') {
    for (let i = 0; i < data.length; i++) data[i] = rand() * 2 - 1;
    return;
  }
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  for (let i = 0; i < data.length; i++) {
    const white = rand() * 2 - 1;
    b0 = 0.99765 * b0 + white * 0.099046;
    b1 = 0.963 * b1 + white * 0.2965164;
    b2 = 0.57 * b2 + white * 1.0526913;
    data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.28;
  }
}
