/**
 * The platform's voice, with this library's mouth.
 *
 * ## Why this exists
 *
 * `renderSpeech` is a Klatt-style cascade formant synthesizer, which is 1980
 * technology and sounds like it. It is phonetically correct — the loci are
 * Delattre's, the voice onset times are Lisker and Abramson's, the nasal zeros
 * are where a side branch of that length puts them — and a listener still
 * reported hiss at the end of words after three rounds of fixes. Being right
 * about the physics and being pleasant to listen to are different problems, and
 * only one of them is solved here.
 *
 * So the split is:
 *
 * - **`speak()` — the synthesizer.** Non-human voices, creatures, radio
 *   chatter, crowd murmur, barks, anything where a tract length of 12 cm or
 *   40 cm is the point. Deterministic, offline, seeded, in the replay
 *   checksum, and it does not care what browser it is in.
 * - **`speakAloud()` — this file.** Anything a player is meant to UNDERSTAND.
 *   The platform's `SpeechSynthesis` speaks a line better than the cascade will
 *   after another month of work, costs nothing, ships no assets, and is in
 *   every browser.
 *
 * ## What is NOT given up
 *
 * **The viseme handshake.** `visemeTrack` comes out of `pronounce()`, which is
 * the lexicon and the prosody model — not the audio. The face is driven by the
 * same F1-is-mouth-opening fact whichever thing is making the sound, so ANIMA's
 * `Speech.follow()` consumes exactly what it consumed before and still imports
 * nothing from here.
 *
 * What DOES have to change is the timing. `SpeechSynthesis` reports no phone
 * boundaries — it will not tell you where the /m/ is — so the planned track has
 * to be re-anchored onto the timings the platform does report, which are WORD
 * boundaries. `anchorTrack` below is that, and it is pure, and it is the part
 * `npm run tts` can actually check.
 */

import type { Viseme } from './diction';
import { pronounce, visemeOf } from './diction';
import type { VoiceSpec } from './voice';
import { voiceOf } from './voice';

/** One phone's worth of mouth, over an interval. */
export interface VisemeCue {
  phone: string;
  /** Seconds from the start of the line. */
  from: number;
  to: number;
  viseme: Viseme;
}

/** Where one word sits in a planned track, as a half-open cue range. */
export interface WordSpan {
  word: string;
  /** Index of the first cue of this word, and one past its last. */
  firstCue: number;
  lastCue: number;
  /** Seconds, in PLANNED time. */
  from: number;
  to: number;
  /** Where this word starts in the original text, for `charIndex` matching. */
  charIndex: number;
}

/** A word boundary the platform reported, in seconds since the line started. */
export interface WordMark {
  /** Index into `WordSpan[]`. */
  word: number;
  at: number;
}

// --------------------------------------------------------------- the plan

/**
 * The planned viseme track for a line, and where its words sit in it.
 *
 * Durations come from `pronounce`, so they are Klatt's duration rules and the
 * prosody model — the same numbers `renderSpeech` would have used. The platform
 * will not agree with them, which is what `anchorTrack` is for; but they are a
 * far better STARTING SHAPE than a flat guess, because the relative lengths
 * within a word are right even when the absolute rate is not.
 */
export function planLine(
  text: string,
  voice: VoiceSpec = voiceOf(),
  options: Parameters<typeof pronounce>[1] = {}
): { cues: VisemeCue[]; words: WordSpan[]; seconds: number } {
  const said = pronounce(text, { ...options, voice });
  const cues: VisemeCue[] = [];
  let t = 0;
  for (const p of said.phones) {
    const seconds = p.seconds ?? 0.06;
    cues.push({ phone: p.phone, from: t, to: t + seconds, viseme: visemeOf(p.phone) });
    t += seconds;
  }

  // Words map onto cues by COUNT, because `pronounce` returns `phones` as
  // exactly the concatenation of each word's phones in order. Anything else
  // would need the two to be kept in step by hand, which is the kind of
  // agreement that quietly stops being true.
  const words: WordSpan[] = [];
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  let cue = 0;
  let searchFrom = 0;
  for (let i = 0; i < said.words.length; i++) {
    const n = said.words[i].phones.length;
    const first = cue;
    const last = Math.min(cues.length, cue + n);
    const token = tokens[i] ?? said.words[i].word;
    const charIndex = text.indexOf(token, searchFrom);
    searchFrom = charIndex < 0 ? searchFrom : charIndex + token.length;
    words.push({
      word: said.words[i].word,
      firstCue: first,
      lastCue: last,
      from: cues[first]?.from ?? t,
      to: cues[last - 1]?.to ?? t,
      charIndex: charIndex < 0 ? 0 : charIndex,
    });
    cue = last;
  }
  return { cues, words, seconds: t };
}

// ------------------------------------------------------------- the warp

/**
 * Re-anchor a planned track onto the times the platform actually reported.
 *
 * A piecewise-linear time warp through the observed word boundaries. Between
 * two marks the plan is stretched or squeezed uniformly, which is the only
 * thing that can be justified: within a word the RELATIVE phone durations are
 * Klatt's and are the best information available, while the absolute rate is
 * the platform's and is the only thing being measured.
 *
 * Three properties, and `npm run tts` checks all three:
 *
 * 1. **Monotonic.** A mouth cannot go backwards. Marks that arrive out of order
 *    or with a zero gap — which happens, because platforms coalesce boundaries
 *    across punctuation — must not produce a cue whose `to` precedes its `from`.
 * 2. **It reduces to the identity** when the platform speaks at exactly the
 *    planned rate. A warp that changes a track it has no information to change
 *    is adding noise.
 * 3. **It beats a global rate estimate**, which is the alternative: scale
 *    everything by `actual / planned` and hope. That is the control, and it has
 *    to lose, or the word marks are not worth reading.
 *
 * `endSeconds` anchors the tail. Without it the last segment's slope is carried
 * forward, which is right when the line is still being spoken and wrong once it
 * has finished.
 */
export function anchorTrack(
  cues: readonly VisemeCue[],
  words: readonly WordSpan[],
  marks: readonly WordMark[],
  endSeconds?: number
): VisemeCue[] {
  // Knots, in (planned, observed) pairs, starting at the origin: the line began
  // when the platform said it began.
  const knots: Array<{ p: number; o: number }> = [{ p: 0, o: 0 }];
  for (const m of marks) {
    const span = words[m.word];
    if (!span || !Number.isFinite(m.at)) continue;
    const previous = knots[knots.length - 1];
    // STRICTLY increasing on both axes, or the warp inverts. A platform that
    // reports two boundaries at the same millisecond is not telling us the
    // second word took no time; it is telling us its clock is coarse.
    if (span.from <= previous.p || m.at <= previous.o) continue;
    knots.push({ p: span.from, o: m.at });
  }
  const plannedEnd = cues.length ? cues[cues.length - 1].to : 0;
  if (endSeconds !== undefined && Number.isFinite(endSeconds)) {
    const previous = knots[knots.length - 1];
    if (plannedEnd > previous.p && endSeconds > previous.o) {
      knots.push({ p: plannedEnd, o: endSeconds });
    }
  }

  // With nothing but the origin there is no rate information at all, so the
  // plan is the best estimate and is returned untouched rather than scaled by
  // an invented number.
  if (knots.length < 2) return cues.map((c) => ({ ...c }));

  const tail = knots[knots.length - 1];
  const before = knots[knots.length - 2];
  const tailSlope = (tail.o - before.o) / Math.max(1e-9, tail.p - before.p);

  const warp = (p: number): number => {
    if (p <= knots[0].p) return knots[0].o;
    for (let i = 1; i < knots.length; i++) {
      if (p <= knots[i].p) {
        const a = knots[i - 1];
        const b = knots[i];
        return a.o + ((p - a.p) / Math.max(1e-9, b.p - a.p)) * (b.o - a.o);
      }
    }
    return tail.o + (p - tail.p) * tailSlope;
  };

  return cues.map((c) => {
    const from = warp(c.from);
    return { ...c, from, to: Math.max(from, warp(c.to)) };
  });
}

/** The mouth at a moment, from a track. Nothing before the first cue or after the last. */
export function mouthFrom(track: readonly VisemeCue[], seconds: number): Viseme {
  const closed: Viseme = { open: 0, round: 0, close: 0, spread: 0 };
  if (!track.length) return closed;
  if (seconds < track[0].from || seconds >= track[track.length - 1].to) return closed;
  // Linear rather than binary: a line is a few dozen cues and this runs once a
  // frame. A binary search here would be a micro-optimisation with a bug in it.
  for (const c of track) if (seconds >= c.from && seconds < c.to) return c.viseme;
  return closed;
}

// ------------------------------------------------------- the platform side

/** The minimum of `SpeechSynthesisUtterance` this needs. Structural, so no DOM lib. */
interface UtteranceLike {
  text: string;
  lang: string;
  pitch: number;
  rate: number;
  volume: number;
  voice: unknown;
  onstart: ((event: unknown) => void) | null;
  onend: ((event: unknown) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onboundary: ((event: { name?: string; charIndex?: number }) => void) | null;
}

interface SynthesisLike {
  speak(utterance: UtteranceLike): void;
  cancel(): void;
  getVoices(): Array<{ name: string; lang: string; default?: boolean }>;
}

interface SpeechGlobals {
  speechSynthesis?: SynthesisLike;
  SpeechSynthesisUtterance?: new (text: string) => UtteranceLike;
  performance?: { now(): number };
  setTimeout?: (fn: () => void, ms: number) => unknown;
}

const globals = (): SpeechGlobals =>
  (typeof globalThis === 'undefined' ? {} : globalThis) as unknown as SpeechGlobals;

/**
 * Whether the platform has a speech synthesizer API at all.
 *
 * NOT whether it can actually speak, and the difference is not academic:
 * headless Chromium exposes `speechSynthesis` and `SpeechSynthesisUtterance`
 * and ships with ZERO voices, so `speak()` is accepted, nothing is said, and
 * `start` never fires. Plenty of Linux desktops without speech-dispatcher do
 * the same. A capability sniff cannot tell those apart from a working engine —
 * `getVoices()` is asynchronous and legitimately empty on the first call in
 * Chrome — so `speakAloud` does not try. It watches for `start` and falls back
 * when it does not come, which covers every reason it might not: no voices, an
 * autoplay policy, a wedged engine, or a platform that simply lied.
 */
export function speechAvailable(): boolean {
  const g = globals();
  return typeof g.speechSynthesis?.speak === 'function' && typeof g.SpeechSynthesisUtterance === 'function';
}

/**
 * Pitch and rate for a body, in the units `SpeechSynthesisUtterance` uses.
 *
 * `voiceOf` derives `f0` from height through the same tube the formants come
 * from, and that number is a FREQUENCY. `utterance.pitch` is a dimensionless
 * multiplier on whatever the platform voice does, 0 to 2 with 1 as neutral, and
 * the platform will not say what its neutral is in hertz. So the honest mapping
 * is a RATIO against this library's own reference speaker — a 1.9 m NPC comes
 * out below a 1.5 m one by the same factor either way, which is the property
 * that makes a crowd sound like a crowd. The absolute pitch is the platform's
 * and is not ours to claim.
 */
export function utteranceVoice(voice: VoiceSpec): { pitch: number; rate: number } {
  // The reference is this library's own default speaker, taken from `voiceOf`
  // rather than written down again — a second copy of a constant is a second
  // thing to keep in step.
  const ratio = voice.f0 / voiceOf().f0;
  return {
    // Clamped to the spec's range rather than to something that sounded nice.
    pitch: Math.max(0, Math.min(2, ratio)),
    rate: 1,
  };
}

export interface SpeakAloudOptions {
  /** BCP 47, e.g. `en-GB`. Defaults to the platform's. */
  lang?: string;
  /** Exact `SpeechSynthesisVoice.name`. Falls back to the platform's default. */
  voiceName?: string;
  volume?: number;
  rate?: number;
  /** Called once per word the platform reports, with its index and time. */
  onWord?: (index: number, seconds: number) => void;
  onEnd?: () => void;
  /**
   * How long to wait for the platform's `start` event before giving up on it
   * and running the mouth off the plan. Seconds.
   *
   * A quarter of a second is long enough for any engine that is going to start
   * and short enough that a face does not visibly hang. Set it to `Infinity` to
   * disable the fallback, which is only sensible in a test.
   */
  startTimeoutSeconds?: number;
}

/**
 * A line the platform is speaking, with a viseme track that follows it.
 *
 * `mouthAt()` is the handshake: it returns the same `Viseme` shape ANIMA's
 * `Speech.follow()` already consumes, so a face driven by the synthesizer and a
 * face driven by the platform are the same code path.
 */
export interface SpokenLine {
  readonly text: string;
  /** The current best track, re-anchored as word boundaries arrive. */
  readonly track: readonly VisemeCue[];
  /** Seconds since the platform actually started, or -1 before that. */
  elapsed(): number;
  /** The mouth now, or at a given time. */
  mouthAt(seconds?: number): Viseme;
  readonly started: boolean;
  readonly done: boolean;
  /** True when the platform never started and the mouth is running off the plan. */
  readonly fellBack: boolean;
  cancel(): void;
}

/**
 * Speak a line with the platform's voice, and follow it with a mouth.
 *
 * Returns a `SpokenLine` whether or not the platform can actually speak. With
 * no `speechSynthesis` the track is the PLANNED one and the clock runs on
 * `performance.now()` from the moment of the call — so a face still moves, in
 * roughly the right shapes, for roughly the right length of time. A missing
 * platform voice should cost you the audio, not the animation.
 */
export function speakAloud(
  text: string,
  voice: VoiceSpec = voiceOf(),
  options: SpeakAloudOptions = {}
): SpokenLine {
  const plan = planLine(text, voice);
  const g = globals();
  const now = (): number => (g.performance?.now ? g.performance.now() : 0) / 1000;

  let track: VisemeCue[] = plan.cues.map((c) => ({ ...c }));
  const marks: WordMark[] = [];
  let startedAt = -1;
  let finished = false;
  let cancelled = false;
  let fellBack = false;

  // When nothing is driving the line, its own plan says when it is over. The
  // platform's `end` event is the authority when there is a platform.
  const expired = (): boolean => fellBack && startedAt >= 0 && now() - startedAt > plan.seconds;

  const line: SpokenLine = {
    text,
    get track() {
      return track;
    },
    elapsed: () => (startedAt < 0 ? -1 : now() - startedAt),
    mouthAt(seconds) {
      const t = seconds ?? line.elapsed();
      if (t < 0 || finished || expired()) return { open: 0, round: 0, close: 0, spread: 0 };
      return mouthFrom(track, t);
    },
    get started() {
      return startedAt >= 0;
    },
    get done() {
      return finished || expired();
    },
    get fellBack() {
      return fellBack;
    },
    cancel() {
      cancelled = true;
      finished = true;
      if (g.speechSynthesis) g.speechSynthesis.cancel();
    },
  };

  if (!speechAvailable()) {
    // No API at all — Node, or a very old browser. Run the planned track on the
    // wall clock. Stated, not hidden: `fellBack` is true and `started` is true,
    // because the face genuinely is moving.
    startedAt = now();
    fellBack = true;
    return line;
  }

  const Utterance = g.SpeechSynthesisUtterance!;
  const utterance = new Utterance(text);
  const mapped = utteranceVoice(voice);
  utterance.pitch = mapped.pitch;
  utterance.rate = options.rate ?? mapped.rate;
  utterance.volume = options.volume ?? 1;
  if (options.lang) utterance.lang = options.lang;
  if (options.voiceName) {
    const found = g.speechSynthesis!.getVoices().find((v) => v.name === options.voiceName);
    if (found) utterance.voice = found;
  }

  // The clock is OURS. `SpeechSynthesisEvent.elapsedTime` is specified in
  // seconds and shipped in milliseconds in more than one engine for years, and
  // there is no way to tell the two apart from a single reading — 1.5 is a
  // plausible number of seconds into a line and a plausible number of
  // milliseconds into one. `performance.now()` from the `start` event has no
  // such ambiguity and needs no unit-sniffing heuristic.
  utterance.onstart = () => {
    // A late `start` after the watchdog has already fired: the platform did
    // wake up, so hand the clock back to it rather than leaving the mouth on a
    // plan the audio no longer matches.
    startedAt = now();
    fellBack = false;
  };
  utterance.onboundary = (event) => {
    if (event.name && event.name !== 'word') return;
    if (startedAt < 0) startedAt = now();
    const at = now() - startedAt;
    const charIndex = event.charIndex ?? 0;
    // The platform gives a character offset; the plan knows where each word
    // starts in the same string. Nearest at or before the offset, so a boundary
    // reported mid-word still lands on that word.
    let index = -1;
    for (let i = 0; i < plan.words.length; i++) {
      if (plan.words[i].charIndex <= charIndex) index = i;
      else break;
    }
    if (index < 0) return;
    marks.push({ word: index, at });
    track = anchorTrack(plan.cues, plan.words, marks);
    options.onWord?.(index, at);
  };
  const end = (): void => {
    if (cancelled || finished) return;
    if (startedAt < 0) {
      // `end` WITHOUT `start`. The platform accepted the utterance and said
      // nothing at all — which is what headless Chromium does, because the API
      // is there and the voice list is empty, and what a Linux desktop without
      // speech-dispatcher does. It is not an error and it does not report one;
      // the utterance simply completes, instantly, in silence.
      //
      // This beat the watchdog below: `end` arrived within a frame, `finished`
      // went true, and the timer bailed out on its own guard. The face sat shut
      // for the whole session. Fall back and run the plan.
      startedAt = now();
      fellBack = true;
      if (typeof g.setTimeout === 'function') {
        g.setTimeout(() => {
          if (cancelled) return;
          finished = true;
          options.onEnd?.();
        }, plan.seconds * 1000);
      }
      return;
    }
    // The final anchor: now the whole line's duration is known, so the tail
    // stops being an extrapolation.
    track = anchorTrack(plan.cues, plan.words, marks, now() - startedAt);
    finished = true;
    options.onEnd?.();
  };
  utterance.onend = end;
  utterance.onerror = end;

  // THE WATCHDOG, and it is the whole reason this is behavioural rather than a
  // capability check. Headless Chromium accepted `speak()` and said nothing,
  // and the face sat frozen with `elapsed()` at −1 forever — which is exactly
  // the failure the "a missing voice costs you the audio, not the animation"
  // claim was supposed to rule out, and it took a headless probe to find.
  const timeout = options.startTimeoutSeconds ?? 0.25;
  if (Number.isFinite(timeout) && typeof g.setTimeout === 'function') {
    g.setTimeout(() => {
      if (startedAt >= 0 || cancelled || finished) return;
      startedAt = now();
      fellBack = true;
    }, timeout * 1000);
  }

  g.speechSynthesis!.speak(utterance);
  return line;
}
