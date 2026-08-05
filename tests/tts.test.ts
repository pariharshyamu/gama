import { describe, expect, it } from 'vitest';
import {
  anchorTrack, mouthFrom, pitchFrom, planLine, speakAloud, speechAvailable, utteranceVoice,
} from '../src/audio/tts';
import { visemeOf } from '../src/audio/diction';
import { voiceOf } from '../src/audio/voice';

const VOICE = voiceOf({ height: 1.75 });

describe('the plan is the lexicon, not the audio', () => {
  it('gives one cue per phone, contiguous and in order', () => {
    const plan = planLine('hello there', VOICE);
    expect(plan.cues.length).toBeGreaterThan(4);
    let last = 0;
    for (const c of plan.cues) {
      expect(c.from).toBeCloseTo(last, 12);
      expect(c.to).toBeGreaterThan(c.from);
      last = c.to;
    }
    expect(plan.seconds).toBeCloseTo(last, 12);
  });

  it('maps every word onto its own cues, covering all of them exactly once', () => {
    const plan = planLine('many men are coming home', VOICE);
    expect(plan.words.length).toBe(5);
    let cue = 0;
    for (const w of plan.words) {
      expect(w.firstCue).toBe(cue);
      expect(w.lastCue).toBeGreaterThan(w.firstCue);
      cue = w.lastCue;
    }
    expect(cue).toBe(plan.cues.length);
  });

  it('finds each word in the original text, so charIndex can be matched', () => {
    const text = 'take the north road';
    const plan = planLine(text, VOICE);
    for (const w of plan.words) {
      expect(text.slice(w.charIndex).toLowerCase().startsWith(w.word)).toBe(true);
    }
    // ...and strictly increasing, or a boundary lands on the wrong word.
    for (let i = 1; i < plan.words.length; i++) {
      expect(plan.words[i].charIndex).toBeGreaterThan(plan.words[i - 1].charIndex);
    }
  });

  it('drives the mouth from the SAME visemeOf the synthesizer uses', () => {
    // The handshake: whichever thing makes the sound, the face is the same.
    const plan = planLine('my name', VOICE);
    for (const c of plan.cues) expect(c.viseme).toEqual(visemeOf(c.phone));
  });

  it('survives an empty line and a line of nothing but spaces', () => {
    for (const text of ['', '   ']) {
      const plan = planLine(text, VOICE);
      expect(plan.cues).toEqual([]);
      expect(plan.words).toEqual([]);
      expect(mouthFrom(plan.cues, 0)).toEqual({ open: 0, round: 0, close: 0, spread: 0 });
    }
  });
});

describe('the warp', () => {
  const plan = planLine('hello there my name is anna', VOICE);

  it('is the identity when the platform agrees with the plan', () => {
    const marks = plan.words.map((w, i) => ({ word: i, at: w.from }));
    const got = anchorTrack(plan.cues, plan.words, marks, plan.seconds);
    for (let i = 0; i < plan.cues.length; i++) {
      expect(got[i].from).toBeCloseTo(plan.cues[i].from, 12);
      expect(got[i].to).toBeCloseTo(plan.cues[i].to, 12);
    }
  });

  it('returns the plan untouched when there is nothing to anchor to', () => {
    const got = anchorTrack(plan.cues, plan.words, []);
    expect(got.map((c) => c.from)).toEqual(plan.cues.map((c) => c.from));
  });

  it('puts each marked word where the platform said it was', () => {
    const marks = plan.words.map((w, i) => ({ word: i, at: w.from * 1.6 }));
    const got = anchorTrack(plan.cues, plan.words, marks, plan.seconds * 1.6);
    for (let i = 1; i < plan.words.length; i++) {
      expect(got[plan.words[i].firstCue].from).toBeCloseTo(marks[i].at, 9);
    }
  });

  it('stays monotonic however badly the marks arrive', () => {
    const nasty = [
      [{ word: 2, at: 0.9 }, { word: 4, at: 0.1 }],
      [{ word: 3, at: 0.2 }, { word: 3, at: 0.9 }],
      [{ word: 1, at: NaN }, { word: 2, at: 0.4 }],
      [{ word: 99, at: 0.3 }],
      plan.words.map((_, i) => ({ word: i, at: 0 })),
    ];
    for (const marks of nasty) {
      const got = anchorTrack(plan.cues, plan.words, marks);
      let last = -Infinity;
      for (const c of got) {
        expect(Number.isFinite(c.from)).toBe(true);
        expect(c.to).toBeGreaterThanOrEqual(c.from);
        expect(c.from).toBeGreaterThanOrEqual(last - 1e-9);
        last = c.from;
      }
    }
  });

  it('ignores an end time that would run the line backwards', () => {
    const marks = [{ word: 4, at: 1.0 }];
    const got = anchorTrack(plan.cues, plan.words, marks, 0.2);
    expect(got[got.length - 1].to).toBeGreaterThan(1.0);
  });
});

describe('the mouth', () => {
  const plan = planLine('my name is anna', VOICE);

  it('is shut before the line and after it', () => {
    const shut = { open: 0, round: 0, close: 0, spread: 0 };
    expect(mouthFrom(plan.cues, -1)).toEqual(shut);
    expect(mouthFrom(plan.cues, plan.seconds + 1)).toEqual(shut);
  });

  it('is inside 0..1 on every channel at every moment of the line', () => {
    for (let t = 0; t < plan.seconds; t += 0.005) {
      const m = mouthFrom(plan.cues, t);
      for (const v of Object.values(m)) {
        expect(Number.isFinite(v)).toBe(true);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });

  it('shuts the lips completely somewhere in "my name"', () => {
    // /m/ is a bilabial: the one viseme a listener can read off a silent face.
    let shut = false;
    for (let t = 0; t < plan.seconds; t += 0.005) if (mouthFrom(plan.cues, t).close >= 1) shut = true;
    expect(shut).toBe(true);
  });
});

describe('the voice mapping', () => {
  it('is a RATIO, so two NPCs keep their interval whatever the platform does', () => {
    for (const [a, b] of [[1.95, 1.2], [1.75, 1.4]]) {
      const va = voiceOf({ height: a });
      const vb = voiceOf({ height: b });
      const got = utteranceVoice(va).pitch / utteranceVoice(vb).pitch;
      expect(got).toBeCloseTo(va.f0 / vb.f0, 9);
    }
  });

  it('stays inside the spec range for bodies well outside human ones', () => {
    for (const height of [0.3, 0.8, 1.2, 1.75, 2.4, 4]) {
      const { pitch, rate } = utteranceVoice(voiceOf({ height }));
      expect(pitch).toBeGreaterThanOrEqual(0);
      expect(pitch).toBeLessThanOrEqual(2);
      expect(rate).toBeGreaterThan(0);
    }
  });
});

describe('degrading without a platform voice', () => {
  it('knows there is no speech synthesizer in Node', () => {
    expect(speechAvailable()).toBe(false);
  });

  it('still returns a line whose mouth moves, because that is the animation', () => {
    // A missing platform voice should cost the audio, not the face.
    const line = speakAloud('hello there', VOICE);
    expect(line.text).toBe('hello there');
    expect(line.track.length).toBeGreaterThan(0);
    expect(line.started).toBe(true);
    expect(line.done).toBe(false);
    const m = line.mouthAt(0.2);
    for (const v of Object.values(m)) expect(Number.isFinite(v)).toBe(true);
  });

  it('shuts the mouth once cancelled, and stays cancelled', () => {
    const line = speakAloud('hello there', VOICE);
    line.cancel();
    expect(line.done).toBe(true);
    expect(line.mouthAt(0.2)).toEqual({ open: 0, round: 0, close: 0, spread: 0 });
  });
});

describe('the pitch a face punctuates with', () => {
  it('gives every cue a pitch, in semitones relative to the speaker', () => {
    const plan = planLine('the traveller stopped at the gate.', VOICE);
    for (const c of plan.cues) {
      expect(Number.isFinite(c.pitch)).toBe(true);
      // A human contour lives inside an octave either way of its own f0.
      expect(Math.abs(c.pitch)).toBeLessThan(12);
    }
  });

  it('is the SAME contour whatever size the speaker is', () => {
    // Two NPCs a fifth apart hand a face identical numbers, so their brows do
    // the same thing on the same sentence. In hertz they would differ by 40%.
    const a = planLine('the traveller stopped at the gate.', voiceOf({ height: 1.2 }));
    const b = planLine('the traveller stopped at the gate.', voiceOf({ height: 1.95 }));
    for (let i = 0; i < a.cues.length; i++) expect(a.cues[i].pitch).toBeCloseTo(b.cues[i].pitch, 9);
  });

  it('ends a question higher than a statement', () => {
    const q = planLine('did the traveller stop at the gate?', VOICE);
    const s = planLine('the traveller stopped at the gate.', VOICE);
    expect(q.cues[q.cues.length - 1].pitch).toBeGreaterThan(s.cues[s.cues.length - 1].pitch + 2);
  });

  it('declines across a long statement, which is why a face needs a baseline', () => {
    const p = planLine('the keeper walked the north road and counted every stone along the river.', VOICE);
    const half = p.cues.length >> 1;
    const mean = (a: typeof p.cues) => a.reduce((x, c) => x + c.pitch, 0) / a.length;
    expect(mean(p.cues.slice(0, half))).toBeGreaterThan(mean(p.cues.slice(half)) + 0.5);
  });

  it('is silent outside the line, so a pause is distinguishable from a low note', () => {
    const plan = planLine('hello there', VOICE);
    expect(pitchFrom(plan.cues, -1)).toBe(0);
    expect(pitchFrom(plan.cues, plan.seconds + 1)).toBe(0);
    expect(pitchFrom([], 0.5)).toBe(0);
  });

  it('rides the same warp as the visemes', () => {
    const plan = planLine('the traveller stopped at the gate.', VOICE);
    const marks = plan.words.map((w, i) => ({ word: i, at: w.from * 1.6 }));
    const warped = anchorTrack(plan.cues, plan.words, marks, plan.seconds * 1.6);
    for (let i = 0; i < plan.cues.length; i++) expect(warped[i].pitch).toBe(plan.cues[i].pitch);
    const peak = (t: typeof plan.cues) => t.reduce((b, c) => (c.pitch > b.pitch ? c : b)).from;
    expect(peak(warped) / peak(plan.cues)).toBeCloseTo(1.6, 1);
  });

  it('reports pitch through a SpokenLine, and nothing once it is done', () => {
    const line = speakAloud('hello there', VOICE);
    expect(Number.isFinite(line.pitchAt(0.1))).toBe(true);
    expect(line.pitchAt(-1)).toBe(0);
    line.cancel();
    expect(line.pitchAt(0.1)).toBe(0);
  });
});
