import { describe, expect, it } from 'vitest';
import {
  COARTICULATION, CONSONANTS, CONSONANT_KEYS, consonantFormants, frameTimes,
  isConsonant, isVowel, planPhones, renderSpeech,
} from '../src/audio/consonants';
import { VOWELS, formantsOf, voiceOf } from '../src/audio/voice';

const VOICE = voiceOf({ height: 1.75 });

describe('the table is data, and it is shaped like a mouth', () => {
  it('has voice onset times that rise as the closure moves back', () => {
    // Lisker & Abramson (1964). Nobody put this ordering in on purpose; it is
    // how far the air has to travel before the folds can start.
    for (const series of [['b', 'd', 'g'], ['p', 't', 'k']]) {
      const v = series.map((c) => CONSONANTS[c].vot!);
      expect(v[0]).toBeLessThan(v[1]);
      expect(v[1]).toBeLessThan(v[2]);
    }
    // ...and every voiceless stop is aspirated far past every voiced one.
    const voiced = ['b', 'd', 'g'].map((c) => CONSONANTS[c].vot!);
    const voiceless = ['p', 't', 'k'].map((c) => CONSONANTS[c].vot!);
    expect(Math.max(...voiced)).toBeLessThan(Math.min(...voiceless));
  });

  it('gives only nasals a zero, and orders them by side-branch length', () => {
    for (const key of CONSONANT_KEYS) {
      const spec = CONSONANTS[key];
      if (spec.manner === 'nasal') expect(spec.zero).toBeGreaterThan(0);
      else expect(spec.zero).toBeUndefined();
    }
    // /m/ closes at the lips and keeps the whole mouth hanging off the path;
    // /ŋ/ closes at the velum and keeps almost none. Shorter branch, higher zero.
    expect(CONSONANTS.m.zero!).toBeLessThan(CONSONANTS.n.zero!);
    expect(CONSONANTS.n.zero!).toBeLessThan(CONSONANTS.N.zero!);
  });

  it('pairs every voiced obstruent with a voiceless one at the same place', () => {
    for (const [a, b] of [['b', 'p'], ['d', 't'], ['g', 'k'], ['v', 'f'], ['z', 's'], ['Z', 'S']]) {
      expect(CONSONANTS[a].place).toBe(CONSONANTS[b].place);
      expect(CONSONANTS[a].voiced).toBe(true);
      expect(CONSONANTS[b].voiced).toBe(false);
    }
  });

  it('knows what is a consonant and what is a vowel, without overlap', () => {
    expect(isConsonant('b')).toBe(true);
    expect(isVowel('b')).toBe(false);
    expect(isVowel('A')).toBe(true);
    expect(isConsonant('A')).toBe(false);
    for (const key of CONSONANT_KEYS) expect(VOWELS[key]).toBeUndefined();
  });
});

describe('coarticulation is which articulator is busy', () => {
  it('frees the tongue most for a labial and least for an alveolar', () => {
    expect(COARTICULATION.labial).toBeGreaterThan(COARTICULATION.alveolar);
  });

  it('pulls a consonant’s F2 toward the vowel that follows it', () => {
    const alone = consonantFormants('d', VOICE.tract)[1];
    const beforeI = consonantFormants('d', VOICE.tract, 'i')[1];
    const beforeU = consonantFormants('d', VOICE.tract, 'u')[1];
    // /i/'s F2 is above /d/'s locus and /u/'s is below, so the pull reverses.
    expect(beforeI).toBeGreaterThan(alone);
    expect(beforeU).toBeLessThan(alone);
  });

  it('lets a velar follow the vowel almost completely, which is why it has no locus', () => {
    const front = consonantFormants('g', VOICE.tract, 'i')[1];
    const back = consonantFormants('g', VOICE.tract, 'u')[1];
    // A velar closure IS the tongue body, so where it lands moves with the
    // vowel — forward before /i/, back before /u/. That is the velar pinch.
    expect(front).toBeGreaterThan(back + 500);
  });

  it('gives /ɹ/ the low F3 that is the whole of its identity', () => {
    const r = consonantFormants('r', VOICE.tract)[2];
    const l = consonantFormants('l', VOICE.tract)[2];
    expect(r).toBeLessThan(l);
    expect(r).toBeLessThan(2000);
  });
});

describe('the plan', () => {
  it('gives a stop a silent closure, a burst, and aspiration only if voiceless', () => {
    const labels = (c: string): string[] =>
      planPhones([{ phone: c }, { phone: 'A' }], VOICE).map((f) => f.label);
    expect(labels('p')).toContain('p:closure');
    expect(labels('p')).toContain('p:burst');
    expect(labels('p')).toContain('p:aspiration');
    // /b/'s VOT is 1 ms — there is no aspiration to speak of.
    expect(labels('b')).not.toContain('b:aspiration');
  });

  it('makes a voiceless closure completely silent and a voiced one nearly so', () => {
    const frames = planPhones([{ phone: 'p' }, { phone: 'A' }], VOICE);
    const voicedFrames = planPhones([{ phone: 'b' }, { phone: 'A' }], VOICE);
    expect(frames[0].voicing).toBe(0);
    // The "voice bar": the only acoustic difference during the closure itself.
    expect(voicedFrames[0].voicing).toBeGreaterThan(0);
    expect(voicedFrames[0].voicing).toBeLessThan(0.3);
  });

  it('reports where each frame sits, so a release can be measured from', () => {
    const phones = [{ phone: 't' }, { phone: 'i', seconds: 0.2 }];
    const times = frameTimes(phones, VOICE);
    let last = 0;
    for (const f of times) {
      expect(f.from).toBeCloseTo(last, 12);
      expect(f.to).toBeGreaterThanOrEqual(f.from);
      last = f.to;
    }
    const burst = times.find((f) => f.label === 't:burst')!;
    const asp = times.find((f) => f.label === 't:aspiration')!;
    // /t/'s VOT is 70 ms, and the aspiration frame is what carries it.
    expect(asp.from).toBeCloseTo(burst.to, 12);
    expect((asp.to - asp.from) * 1000).toBeGreaterThan(40);
  });

  it('carries the antiformant only on nasals, and drops it when asked', () => {
    const nasal = planPhones([{ phone: 'm' }, { phone: 'A' }], VOICE);
    expect(nasal[0].zero).toBeGreaterThan(0);
    const flat = planPhones([{ phone: 'm' }, { phone: 'A' }], VOICE, { noNasalZero: true });
    expect(flat[0].zero).toBe(0);
    const stop = planPhones([{ phone: 'd' }, { phone: 'A' }], VOICE);
    for (const f of stop) expect(f.zero).toBe(0);
  });
});

describe('rendering', () => {
  const rms = (b: Float32Array, from = 0, to = b.length): number => {
    let s = 0;
    for (let i = from; i < to; i++) s += b[i] * b[i];
    return Math.sqrt(s / Math.max(1, to - from));
  };

  it('is finite and bounded for every consonant before every vowel', () => {
    for (const c of CONSONANT_KEYS) {
      const buf = renderSpeech([{ phone: c }, { phone: 'i', seconds: 0.1 }], VOICE, {
        sampleRate: 16000, seed: 3,
      });
      for (let i = 0; i < buf.length; i++) {
        expect(Number.isFinite(buf[i]), c).toBe(true);
        expect(Math.abs(buf[i]), c).toBeLessThanOrEqual(1.0001);
      }
    }
  });

  it('makes a stop closure silent', () => {
    const phones = [{ phone: 'A', seconds: 0.12 }, { phone: 'p' }, { phone: 'A', seconds: 0.12 }];
    const buf = renderSpeech(phones, VOICE, { sampleRate: 22050, seed: 11 });
    const times = frameTimes(phones, VOICE);
    const closure = times.find((f) => f.label === 'p:closure')!;
    const quiet = rms(buf, Math.round((closure.from + 0.02) * 22050), Math.round((closure.to - 0.01) * 22050));
    const loud = rms(buf, Math.round(0.02 * 22050), Math.round(0.1 * 22050));
    expect(quiet).toBeLessThan(loud * 0.1);
  });

  it('whispers when there is no pitch, and it is not silence', () => {
    const buf = renderSpeech([{ phone: 's' }, { phone: 'A', seconds: 0.2 }], VOICE, {
      sampleRate: 22050, f0: 0, seed: 5,
    });
    expect(rms(buf)).toBeGreaterThan(0.01);
  });

  it('is deterministic for a seed and different for another', () => {
    const of = (seed: number): number[] => [
      ...renderSpeech([{ phone: 's' }, { phone: 'A', seconds: 0.08 }], VOICE, { seed, sampleRate: 16000 }),
    ];
    expect(of(7)).toEqual(of(7));
    expect(of(7)).not.toEqual(of(8));
  });

  it('survives an empty utterance, an unknown phone and a silly rate', () => {
    expect(renderSpeech([], VOICE).length).toBeGreaterThan(0);
    for (const options of [{}, { sampleRate: 8000 }, { vowelSeconds: 0 }, { f0: 0 }]) {
      const buf = renderSpeech([{ phone: 'zzz' }, { phone: 'm' }, { phone: 'A' }], VOICE, {
        seed: 4, ...options,
      });
      for (let i = 0; i < buf.length; i++) expect(Number.isFinite(buf[i])).toBe(true);
    }
  });

  it('leaves a vowel untouched when the nasal zero is switched off', () => {
    // `noNasalZero` is the control the gate leans on, so it had better only
    // ever touch nasals.
    const a = renderSpeech([{ phone: 'A', seconds: 0.1 }], VOICE, { sampleRate: 16000, seed: 2 });
    const b = renderSpeech([{ phone: 'A', seconds: 0.1 }], VOICE, {
      sampleRate: 16000, seed: 2, noNasalZero: true,
    });
    expect([...a]).toEqual([...b]);
  });

  it('changes a nasal when the zero is switched off', () => {
    const a = renderSpeech([{ phone: 'm' }, { phone: 'A', seconds: 0.1 }], VOICE, { sampleRate: 16000, seed: 2 });
    const b = renderSpeech([{ phone: 'm' }, { phone: 'A', seconds: 0.1 }], VOICE, {
      sampleRate: 16000, seed: 2, noNasalZero: true,
    });
    expect([...a]).not.toEqual([...b]);
  });

  it('scales every consonant with the tract, like everything else here', () => {
    const big = consonantFormants('d', 0.2);
    const small = consonantFormants('d', 0.1);
    for (let i = 0; i < 3; i++) expect(small[i] / big[i]).toBeCloseTo(2, 9);
  });

  it('puts a vowel where voice.ts says it is', () => {
    // The two modules have to agree about vowels, or an utterance changes
    // timbre every time it crosses a consonant.
    const frames = planPhones([{ phone: 'A', seconds: 0.1 }], VOICE);
    expect(frames[0].formants).toEqual(formantsOf('A', VOICE.tract));
  });
});
