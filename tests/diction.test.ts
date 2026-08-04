import { describe, expect, it } from 'vitest';
import {
  LEXICON, lookUp, pronounce, soundOut, speak, syllabifyPhones, visemeOf, visemeTrack,
} from '../src/audio/diction';
import { frameTimes } from '../src/audio/consonants';
import { VOWELS, voiceOf } from '../src/audio/voice';

const VOICE = voiceOf({ height: 1.75 });

describe('the dictionary', () => {
  it('agrees with English about rhymes and homophones', () => {
    const rime = (word: string): string => {
      const phones = LEXICON[word].phones;
      let last = -1;
      phones.forEach((p, i) => { if (VOWELS[p]) last = i; });
      return phones.slice(last).join(' ');
    };
    for (const [a, b] of [['gate', 'wait'], ['night', 'light'], ['told', 'gold'], ['keep', 'sleep']]) {
      expect(rime(a), `${a}/${b}`).toBe(rime(b));
    }
    for (const [a, b] of [['see', 'sea'], ['knew', 'new'], ['their', 'there']]) {
      expect(LEXICON[a].phones.join(' ')).toBe(LEXICON[b].phones.join(' '));
    }
  });

  it('gives every entry at least one vowel', () => {
    for (const [word, entry] of Object.entries(LEXICON)) {
      expect(entry.phones.some((p) => VOWELS[p]), word).toBe(true);
    }
  });

  it('sounds out an unknown word rather than crashing', () => {
    for (const word of ['zorblat', 'xyzzy', '', '123', 'ffff']) {
      const got = lookUp(word);
      expect(got.phones.some((p) => VOWELS[p]), word).toBe(true);
      if (word) expect(got.guessed).toBe(true);
    }
    expect(lookUp('gate').guessed).toBe(false);
  });

  it('cannot be replaced by its own letter rules', () => {
    // English spelling is not a function of its letters, and this is the
    // positive claim: the fallback must MISS most of the dictionary.
    const exact = Object.entries(LEXICON)
      .filter(([word]) => !word.endsWith('_'))
      .filter(([word, entry]) => soundOut(word).join(' ') === entry.phones.join(' ')).length;
    expect(exact / Object.keys(LEXICON).length).toBeLessThan(0.5);
  });
});

describe('syllables', () => {
  it('follows the maximal onset principle', () => {
    // "a-bout", not "ab-out".
    const about = syllabifyPhones(['@', 'b', 'A', 't']);
    expect(about).toHaveLength(2);
    expect(about[1].onset).toEqual(['b']);
    expect(about[0].onset).toEqual([]);
    expect(about[1].coda).toEqual(['t']);
  });

  it('makes one syllable per vowel and none without', () => {
    expect(syllabifyPhones(['s', 't', 'r', 'E', 'N', 'T'])).toHaveLength(1);
    expect(syllabifyPhones(['s', 't'])).toHaveLength(0);
    expect(syllabifyPhones([])).toHaveLength(0);
  });

  it('marks the last syllable of the word', () => {
    const got = syllabifyPhones(['n', 'O', 'b', 'V', 'd', 'i']);
    expect(got).toHaveLength(3);
    expect(got.map((s) => s.wordFinal)).toEqual([false, false, true]);
  });
});

describe('speaking', () => {
  it('turns text into phones with durations and a contour', () => {
    const s = pronounce('the traveller stopped at the gate', { voice: VOICE });
    expect(s.words).toHaveLength(6);
    expect(s.guessed).toBe(0);
    expect(s.phones.length).toBeGreaterThan(15);
    for (const p of s.phones) expect(p.f0).toBeGreaterThan(0);
    expect(s.seconds).toBeGreaterThan(0.5);
  });

  it('raises the end of a question', () => {
    const last = (t: string): number =>
      pronounce(t, { voice: VOICE }).phones.filter((p) => VOWELS[p.phone]).pop()!.f0!;
    expect(last('the bridge is gone?')).toBeGreaterThan(last('the bridge is gone') * 1.1);
  });

  it('renders finite, bounded audio for anything', () => {
    for (const text of ['', '  ', '...', 'the king would not come down', 'zorblat xyzzy']) {
      const buf = speak(text, VOICE, { sampleRate: 16000, seed: 3 });
      for (let i = 0; i < buf.length; i++) {
        expect(Number.isFinite(buf[i]), text).toBe(true);
        expect(Math.abs(buf[i]), text).toBeLessThanOrEqual(1.0001);
      }
    }
  });

  it('takes longer over a longer line, and honours the rate', () => {
    const n = (t: string, rate = 1): number => speak(t, VOICE, { sampleRate: 16000, rate }).length;
    expect(n('the traveller stopped at the gate and asked for water')).toBeGreaterThan(n('the bridge is gone') * 1.5);
    expect(n('the king would not come down', 0.5)).toBeGreaterThan(n('the king would not come down', 2));
  });

  it('whispers the WHOLE utterance when asked', () => {
    // Per-phone pitches must not override it — that bug made `f0: 0` render a
    // voiced signal and scored the whole synthesizer at chance.
    const phones = pronounce('the gate', { voice: VOICE }).phones;
    expect(phones.every((p) => (p.f0 ?? 0) > 0)).toBe(true);
    const voiced = speak('the gate', VOICE, { sampleRate: 16000, seed: 4 });
    const whispered = speak('the gate', VOICE, { sampleRate: 16000, seed: 4, f0: 0 });
    expect([...voiced]).not.toEqual([...whispered]);
  });
});

describe('the handshake', () => {
  it('opens the mouth for open vowels and shuts it for bilabials', () => {
    expect(visemeOf('A').open).toBeGreaterThan(visemeOf('i').open);
    expect(visemeOf('u').round).toBeGreaterThan(visemeOf('i').round);
    for (const c of ['p', 'b', 'm']) expect(visemeOf(c).close).toBeGreaterThan(0.9);
    for (const v of ['A', 'i', 'u']) expect(visemeOf(v).close).toBe(0);
  });

  it('gives an unknown phone a neutral mouth rather than throwing', () => {
    const got = visemeOf('zzz');
    for (const k of ['open', 'round', 'close', 'spread'] as const) {
      expect(Number.isFinite(got[k])).toBe(true);
      expect(got[k]).toBeGreaterThanOrEqual(0);
      expect(got[k]).toBeLessThanOrEqual(1);
    }
  });

  it('lines the viseme track up with the audio exactly', () => {
    // A face a frame ahead of the sound is the one thing lip-sync must not do.
    const phones = pronounce('the traveller stopped at the gate', { voice: VOICE }).phones;
    const track = visemeTrack(phones, VOICE);
    const frames = frameTimes(phones, VOICE);
    expect(track[track.length - 1].to).toBeCloseTo(frames[frames.length - 1].to, 9);
    let last = 0;
    for (const row of track) {
      expect(row.from).toBeCloseTo(last, 9);
      last = row.to;
    }
  });
});
