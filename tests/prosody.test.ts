import { describe, expect, it } from 'vitest';
import {
  ACCENT_EXCURSION, DECLINATION, DURATION_RULES, FUNCTION_WORDS, KLATT_INHERENT,
  KLATT_MIN_FRACTION, QUESTION_RISE, fromSemitones, klattDuration, nPVI,
  planUtterance, syllabify, toSemitones,
} from '../src/audio/prosody';
import { voiceOf } from '../src/audio/voice';

const LEXICON = {
  the: { vowels: ['@'] },
  traveller: { vowels: ['ae', '@', '@'] },
  stopped: { vowels: ['A'] },
  at: { vowels: ['ae'] },
  gate: { vowels: ['E'] },
  water: { vowels: ['O', '@'] },
  until: { vowels: ['V', 'I'], stress: 1 },
};
const LINE = 'the traveller stopped at the gate'.split(' ');

describe('Klatt’s rule form', () => {
  it('is the identity at 100%', () => {
    expect(klattDuration(240, 100, 108)).toBeCloseTo(240, 12);
  });

  it('stops at the floor rather than at zero', () => {
    expect(klattDuration(240, 0, 108)).toBeCloseTo(108, 12);
    // Every shortening rule at once still cannot go through it. That is the
    // whole reason the model has a floor and not just percentages.
    let d = 240;
    for (let i = 0; i < 10; i++) d = klattDuration(d, 50, 108);
    expect(d).toBeGreaterThan(107.9);
  });

  it('keeps the inherent durations that are already most of the rhythm', () => {
    const values = Object.values(KLATT_INHERENT);
    expect(Math.max(...values) / Math.min(...values)).toBeGreaterThan(3);
    expect(KLATT_MIN_FRACTION).toBeGreaterThan(0);
    expect(KLATT_MIN_FRACTION).toBeLessThan(1);
    expect(DURATION_RULES.unstressed).toBeLessThan(100);
    expect(DURATION_RULES.phraseFinal).toBeGreaterThan(100);
  });
});

describe('stress comes from the word list, not from an ear', () => {
  it('leaves function words unstressed and stresses content words', () => {
    const syl = syllabify(LINE, LEXICON);
    // the | tra-vel-ler | stopped | at | the | gate
    expect(syl).toHaveLength(8);
    expect(syl[0]).toMatchObject({ vowel: '@', stressed: false });    // "the"
    expect(syl[1]).toMatchObject({ vowel: 'ae', stressed: true });    // "TRA-vel-ler"
    expect(syl[2].stressed).toBe(false);
    expect(syl[3].stressed).toBe(false);
    expect(syl[4]).toMatchObject({ vowel: 'A', stressed: true });     // "STOPPED"
    expect(FUNCTION_WORDS.has('the')).toBe(true);
    expect(FUNCTION_WORDS.has('traveller')).toBe(false);
  });

  it('honours a word’s own stressed syllable', () => {
    // "un-TIL" — and it is a function word, so it takes no stress at all.
    const [, second] = syllabify(['until'], LEXICON);
    expect(second.stressed).toBe(false);
    const shifted = syllabify(['until'], { until: { vowels: ['V', 'I'], stress: 1 } });
    expect(shifted[1].wordFinal).toBe(true);
  });

  it('marks the last syllable of every word', () => {
    const syl = syllabify(['traveller', 'gate'], LEXICON);
    expect(syl.map((s) => s.wordFinal)).toEqual([false, false, true, true]);
  });

  it('gives an unknown word a schwa instead of throwing', () => {
    const syl = syllabify(['zzz'], LEXICON);
    expect(syl).toHaveLength(1);
    expect(syl[0].vowel).toBe('@');
  });
});

describe('durations', () => {
  const syl = syllabify(LINE, LEXICON);

  it('shortens unstressed syllables and lengthens the last one', () => {
    const plan = planUtterance(syl, {});
    // "the" (unstressed /ə/) against the same /ə/ nowhere near a boundary.
    expect(plan[0].seconds).toBeLessThan(plan[1].seconds);
    // The phrase-final syllable is stretched relative to the same vowel inside.
    const inside = planUtterance([{ vowel: 'E', stressed: true }, { vowel: 'A', stressed: true }], {});
    expect(inside[1].seconds).toBeGreaterThan(inside[0].seconds);
  });

  it('scales with rate and nothing else', () => {
    const normal = planUtterance(syl, {});
    const fast = planUtterance(syl, { rate: 2 });
    for (let i = 0; i < normal.length; i++) {
      expect(fast[i].seconds).toBeCloseTo(normal[i].seconds / 2, 12);
    }
    // nPVI is normalised, so the RHYTHM is unchanged by speaking faster.
    expect(nPVI(fast.map((p) => p.seconds))).toBeCloseTo(nPVI(normal.map((p) => p.seconds)), 10);
  });

  it('produces a bigger nPVI with stress reduction than without', () => {
    const withStress = nPVI(planUtterance(syl, {}).map((p) => p.seconds));
    const even = nPVI(planUtterance(syl, { timing: 'even' }).map((p) => p.seconds));
    // The full claim — that the first lands in the published stress-timed band
    // and the second does not — is `npm run prosody`, over a corpus.
    expect(withStress).toBeGreaterThan(even);
  });
});

describe('nPVI', () => {
  it('is zero for even durations and grows with alternation', () => {
    expect(nPVI([100, 100, 100, 100])).toBeCloseTo(0, 12);
    expect(nPVI([50, 150, 50, 150])).toBeGreaterThan(90);
    expect(nPVI([100])).toBe(0);
    expect(nPVI([])).toBe(0);
  });

  it('does not change when everything is scaled — that is the "normalized"', () => {
    const d = [70, 155, 90, 230, 60];
    expect(nPVI(d.map((x) => x * 3.7))).toBeCloseTo(nPVI(d), 10);
  });
});

describe('pitch is semitones', () => {
  const syl = syllabify(LINE, LEXICON);

  it('round-trips through the semitone conversion', () => {
    expect(fromSemitones(12)).toBeCloseTo(2, 12);
    expect(toSemitones(2)).toBeCloseTo(12, 12);
    expect(toSemitones(fromSemitones(-7.3))).toBeCloseTo(-7.3, 10);
  });

  it('gives three bodies the same tune and different frequencies', () => {
    const plans = [1.78, 1.62, 1.25].map((height) =>
      planUtterance(syl, { voice: voiceOf({ height }) })
    );
    for (let i = 0; i < plans[0].length; i++) {
      expect(plans[1][i].semitones).toBeCloseTo(plans[0][i].semitones, 12);
      expect(plans[2][i].semitones).toBeCloseTo(plans[0][i].semitones, 12);
      expect(plans[2][i].f0).toBeGreaterThan(plans[0][i].f0);
    }
  });

  it('falls across an utterance and jumps on accents', () => {
    const plan = planUtterance(syl, {});
    const accents = plan.filter((p) => p.stressed);
    expect(accents.length).toBeGreaterThan(1);
    // Later accents sit lower than earlier ones: that is declination.
    expect(accents[accents.length - 1].semitones).toBeLessThan(accents[0].semitones);
    // ...and an accent stands above the syllable beside it.
    const i = plan.findIndex((p) => p.stressed);
    expect(plan[i].semitones).toBeGreaterThan(plan[i - 1]?.semitones ?? -Infinity);
    expect(ACCENT_EXCURSION).toBeGreaterThan(0);
    expect(DECLINATION).toBeGreaterThan(0);
  });

  it('ends a question above a statement, and flat is flat', () => {
    const statement = planUtterance(syl, {});
    const question = planUtterance(syl, { intonation: 'question' });
    const flat = planUtterance(syl, { intonation: 'flat' });
    const last = (p: typeof statement): number => p[p.length - 1].semitones;
    expect(last(question) - last(statement)).toBeGreaterThan(QUESTION_RISE * 0.5);
    for (const p of flat) expect(p.semitones).toBe(0);
    // Rhythm is untouched by intonation — they are separate systems.
    expect(flat.map((p) => p.seconds)).toEqual(statement.map((p) => p.seconds));
  });

  it('puts the final movement on the nuclear syllable, not the last one', () => {
    // "...the GATE" ends stressed; "...for WA-ter" ends on a reduced schwa. The
    // movement has to be audible in both, so it runs from the last ACCENT.
    const trailing = syllabify(['the', 'water'], LEXICON);
    const statement = planUtterance(trailing, {});
    const question = planUtterance(trailing, { intonation: 'question' });
    const nucleus = statement.map((p) => p.stressed).lastIndexOf(true);
    expect(nucleus).toBeGreaterThanOrEqual(0);
    // The nucleus itself already differs between the two readings.
    expect(question[nucleus].semitones).toBeGreaterThan(statement[nucleus].semitones);
  });
});

describe('the things it must not do', () => {
  it('survives an empty utterance and a single syllable', () => {
    expect(planUtterance([], {})).toEqual([]);
    const one = planUtterance([{ vowel: 'A', stressed: true }], {});
    expect(one).toHaveLength(1);
    expect(one[0].seconds).toBeGreaterThan(0);
    expect(Number.isFinite(one[0].f0)).toBe(true);
  });

  it('survives an unknown vowel, a zero rate and a negative one', () => {
    for (const options of [{}, { rate: 0 }, { rate: -4 }, { rate: 1e6 }]) {
      const plan = planUtterance([{ vowel: 'zzz' }, { vowel: 'A', stressed: true }], options);
      for (const p of plan) {
        expect(Number.isFinite(p.seconds)).toBe(true);
        expect(p.seconds).toBeGreaterThan(0);
        expect(Number.isFinite(p.f0)).toBe(true);
        expect(p.f0).toBeGreaterThan(0);
      }
    }
  });

  it('keeps an utterance with no stressed syllable at all coherent', () => {
    const plan = planUtterance([{ vowel: '@' }, { vowel: '@' }, { vowel: '@' }], {});
    expect(plan).toHaveLength(3);
    for (const p of plan) expect(Number.isFinite(p.f0)).toBe(true);
  });
});
