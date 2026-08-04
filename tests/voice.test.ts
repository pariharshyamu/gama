import { describe, expect, it } from 'vitest';
import {
  BANDWIDTHS, CHILD_TRACT, FEMALE_TRACT, REFERENCE_TRACT, SPEED_OF_SOUND,
  VOWELS, VOWEL_KEYS, formantsOf, renderFormants, renderVoice, renderVowel,
  tractLengthFor, tubeFormants, voiceOf,
} from '../src/audio/voice';

describe('the tube', () => {
  it('resonates at odd quarter-wavelengths and nothing else', () => {
    const [f1, f2, f3] = tubeFormants(REFERENCE_TRACT);
    expect(f1).toBeCloseTo(SPEED_OF_SOUND / (4 * REFERENCE_TRACT), 9);
    expect(f2).toBeCloseTo(f1 * 3, 9);
    expect(f3).toBeCloseTo(f1 * 5, 9);
  });

  it('lands on the textbook neutral vowel without having been shown it', () => {
    const [f1, f2, f3] = tubeFormants(REFERENCE_TRACT);
    // 490 / 1470 / 2450 against 500 / 1500 / 2500. One length, one constant.
    expect(f1 / 500).toBeCloseTo(1, 1);
    expect(f2 / 1500).toBeCloseTo(1, 1);
    expect(f3 / 2500).toBeCloseTo(1, 1);
    for (const [got, want] of [[f1, 500], [f2, 1500], [f3, 2500]]) {
      expect(Math.abs(got / want - 1)).toBeLessThan(0.03);
    }
  });

  it('gives as many resonances as it is asked for, all odd multiples', () => {
    const five = tubeFormants(0.2, 5);
    expect(five).toHaveLength(5);
    for (let n = 1; n <= 5; n++) expect(five[n - 1]).toBeCloseTo(five[0] * (2 * n - 1), 6);
  });

  it('does not divide by zero when handed a tract of nothing', () => {
    expect(Number.isFinite(tubeFormants(0)[0])).toBe(true);
    expect(Number.isFinite(tubeFormants(-3)[0])).toBe(true);
  });
});

describe('the vowel table', () => {
  it('carries the third axis a viseme table correctly does without', () => {
    // /i/ and /u/ are both close; one is front and one is back, and the only
    // thing that separates them here is F2 — which is exactly the coordinate
    // ANIMA's mouth cannot see, because a tongue is not visible.
    expect(VOWELS.i.height).toBeCloseTo(VOWELS.u.height, 6);
    expect(VOWELS.i.back).toBeLessThan(0.2);
    expect(VOWELS.u.back).toBeGreaterThan(0.8);
    expect(VOWELS.u.f2).toBeLessThan(VOWELS.i.f2 / 2);
  });

  it('has F1 ranking exactly with the IPA chart’s own vertical axis', () => {
    const byHeight = [...VOWEL_KEYS].sort((a, b) => VOWELS[a].height - VOWELS[b].height);
    const byF1 = [...VOWEL_KEYS].sort((a, b) => VOWELS[a].f1 - VOWELS[b].f1);
    expect(byF1).toEqual(byHeight);
  });

  it('separates every pair of vowels in the plane the ear uses', () => {
    for (let i = 0; i < VOWEL_KEYS.length; i++) {
      for (let j = i + 1; j < VOWEL_KEYS.length; j++) {
        const a = VOWELS[VOWEL_KEYS[i]];
        const b = VOWELS[VOWEL_KEYS[j]];
        const d = Math.hypot(Math.log(a.f1 / b.f1), Math.log(a.f2 / b.f2));
        expect(d, `${a.ipa} vs ${b.ipa}`).toBeGreaterThan(0.1);
      }
    }
  });
});

describe('one length carries every other body', () => {
  it('scales every formant as 1/L, exactly', () => {
    const long = formantsOf('A', 0.2);
    const half = formantsOf('A', 0.1);
    for (let i = 0; i < 3; i++) expect(half[i] / long[i]).toBeCloseTo(2, 9);
  });

  it('turns a body height into a tract and a tract into a voice', () => {
    expect(tractLengthFor(1.75)).toBeCloseTo(REFERENCE_TRACT, 12);
    expect(voiceOf({ height: 2.0 }).f0).toBeLessThan(voiceOf({ height: 1.4 }).f0);
    expect(voiceOf({ tract: REFERENCE_TRACT }).f0).toBeCloseTo(120, 6);
    // An explicit pitch wins over the derived one: the folds and the tube are
    // different organs, which is the whole reason a counter-tenor exists.
    expect(voiceOf({ height: 1.9, f0: 260 }).f0).toBe(260);
  });

  it('reproduces Peterson & Barney’s WOMEN and CHILDREN from the men’s row', () => {
    // The out-of-sample claim, in miniature — the full version with rendered
    // audio and a fitted-ratio floor to compare against is `npm run voice`.
    const women: Record<string, number> = { i: 310, E: 610, A: 850, u: 370, V: 760 };
    const children: Record<string, number> = { i: 370, E: 690, A: 1030, u: 430, V: 850 };
    for (const [table, tract] of [[women, FEMALE_TRACT], [children, CHILD_TRACT]] as const) {
      let sum = 0;
      for (const [key, truth] of Object.entries(table)) {
        sum += Math.abs(formantsOf(key, tract)[0] / truth - 1);
      }
      expect(sum / Object.keys(table).length).toBeLessThan(0.08);
    }
  });

  it('falls back to the neutral vowel rather than throwing', () => {
    expect(formantsOf('not-a-vowel')[0]).toBeCloseTo(VOWELS['@'].f1, 9);
    expect(formantsOf('i', 0)[0]).toBeGreaterThan(0);
    expect(Number.isFinite(formantsOf('i', 0)[0])).toBe(true);
  });
});

describe('rendering', () => {
  const rms = (b: Float32Array): number => {
    let s = 0;
    for (let i = 0; i < b.length; i++) s += b[i] * b[i];
    return Math.sqrt(s / Math.max(1, b.length));
  };

  it('produces the number of samples it was asked for', () => {
    expect(renderVowel('A', voiceOf(), { seconds: 0.25, sampleRate: 8000 })).toHaveLength(2000);
    expect(renderFormants([500, 1500, 2500], { seconds: 1, sampleRate: 16000 })).toHaveLength(16000);
  });

  it('is bounded and finite whatever it is handed', () => {
    const cases = [
      { seconds: 0 }, { seconds: -1 }, { f0: 0 }, { f0: 5000 },
      { sampleRate: 8000, seconds: 0.05 }, { amplitude: 1 },
    ];
    for (const options of cases) {
      const buf = renderVowel('A', voiceOf(), { ...options, seed: 3 });
      for (let i = 0; i < buf.length; i++) {
        expect(Number.isFinite(buf[i]), JSON.stringify(options)).toBe(true);
        expect(Math.abs(buf[i]), JSON.stringify(options)).toBeLessThanOrEqual(1.0001);
      }
    }
  });

  it('normalises, so a vowel does not get quieter for being /i/', () => {
    // A cascade's gain depends on where the formants landed. Without the
    // normalisation /i/ comes out a different loudness from /ɑ/, which is a bug
    // and not a vowel.
    const loud = VOWEL_KEYS.map((k) => rms(renderVowel(k, voiceOf(), { seconds: 0.4, seed: 1 })));
    expect(Math.max(...loud) / Math.min(...loud)).toBeLessThan(2.5);
  });

  it('renders the same whisper twice from the same seed, and a different one otherwise', () => {
    const a = renderVowel('A', voiceOf(), { seconds: 0.1, f0: 0, seed: 11 });
    const b = renderVowel('A', voiceOf(), { seconds: 0.1, f0: 0, seed: 11 });
    const c = renderVowel('A', voiceOf(), { seconds: 0.1, f0: 0, seed: 12 });
    expect([...a]).toEqual([...b]);
    expect([...a]).not.toEqual([...c]);
  });

  it('whispers when there is no pitch, and it is not silence', () => {
    // A whisper is the filter on its own — the evidence that the vowel was
    // never in the pitch to begin with.
    expect(rms(renderVowel('i', voiceOf(), { seconds: 0.4, f0: 0, seed: 5 }))).toBeGreaterThan(0.02);
  });

  it('repeats at the pitch it was given', () => {
    const sampleRate = 22050;
    for (const f0 of [90, 150, 240]) {
      const buf = renderVowel('A', voiceOf(), { seconds: 0.4, sampleRate, f0, seed: 7 });
      let energy = 0;
      for (let i = 0; i < buf.length; i++) energy += buf[i] * buf[i];
      let best = 0;
      let at = 0;
      for (let lag = 44; lag <= 367; lag++) {
        let sum = 0;
        for (let i = 0; i + lag < buf.length; i++) sum += buf[i] * buf[i + lag];
        if (sum / energy > best) { best = sum / energy; at = sampleRate / lag; }
      }
      expect(at / f0, `f0 ${f0}`).toBeCloseTo(1, 1);
      expect(best).toBeGreaterThan(0.8);
    }
  });
});

describe('an utterance', () => {
  it('is one continuous signal, with no step at a vowel boundary', () => {
    const sampleRate = 22050;
    const glide = renderVoice(
      [{ vowel: 'i', seconds: 0.2 }, { vowel: 'A', seconds: 0.2 }, { vowel: 'u', seconds: 0.2 }],
      voiceOf(), { sampleRate, seed: 5 }
    );
    expect(glide).toHaveLength(Math.round(0.6 * sampleRate));
    let jump = 0;
    for (let i = 1; i < glide.length; i++) jump = Math.max(jump, Math.abs(glide[i] - glide[i - 1]));
    // Formants glide, they do not jump — and the glide is most of what makes a
    // sequence sound like speech rather than a keyboard.
    expect(jump).toBeLessThan(0.5);
  });

  it('survives an empty script and a segment of no length', () => {
    expect(renderVoice([], voiceOf()).length).toBeGreaterThan(0);
    const odd = renderVoice([{ vowel: 'A', seconds: 0 }, { vowel: 'i', seconds: 0.1 }], voiceOf(), {
      sampleRate: 8000,
    });
    for (let i = 0; i < odd.length; i++) expect(Number.isFinite(odd[i])).toBe(true);
  });
});

describe('the constants are the ones the module claims', () => {
  it('keeps a bandwidth per formant, widening with formant number', () => {
    expect(BANDWIDTHS).toHaveLength(3);
    for (let i = 1; i < BANDWIDTHS.length; i++) expect(BANDWIDTHS[i]).toBeGreaterThan(BANDWIDTHS[i - 1]);
  });

  it('orders the three published tract lengths the way three bodies are', () => {
    expect(CHILD_TRACT).toBeLessThan(FEMALE_TRACT);
    expect(FEMALE_TRACT).toBeLessThan(REFERENCE_TRACT);
  });
});
