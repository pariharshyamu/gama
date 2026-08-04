/**
 * The analyser the voice gate listens with.
 *
 * Kept apart from the gate on purpose: a synthesizer checked by its own author's
 * arithmetic proves nothing, so this file only ever turns samples into hertz. It
 * knows nothing about vowels, tracts or Peterson & Barney, and `bench/voice.mjs`
 * is the only thing that does.
 */

/** Radix-2 FFT, in place. */
export function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    for (let i = 0; i < n; i += len) {
      for (let k = 0; k < len / 2; k++) {
        const wr = Math.cos(ang * k);
        const wi = Math.sin(ang * k);
        const ur = re[i + k];
        const ui = im[i + k];
        const vr = re[i + k + len / 2] * wr - im[i + k + len / 2] * wi;
        const vi = re[i + k + len / 2] * wi + im[i + k + len / 2] * wr;
        re[i + k] = ur + vr;
        im[i + k] = ui + vi;
        re[i + k + len / 2] = ur - vr;
        im[i + k + len / 2] = ui - vi;
      }
    }
  }
}

/** Welch-averaged magnitude spectrum, in dB. */
export function spectrum(samples, size = 2048) {
  const mag = new Float64Array(size / 2);
  let windows = 0;
  for (let start = 0; start + size <= samples.length; start += size / 2) {
    const re = new Float64Array(size);
    const im = new Float64Array(size);
    for (let i = 0; i < size; i++) {
      const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (size - 1));
      re[i] = samples[start + i] * w;
    }
    fft(re, im);
    for (let i = 0; i < size / 2; i++) mag[i] += Math.hypot(re[i], im[i]);
    windows++;
  }
  for (let i = 0; i < mag.length; i++) {
    mag[i] = 20 * Math.log10(mag[i] / Math.max(1, windows) + 1e-12);
  }
  return mag;
}

/**
 * The spectral ENVELOPE, by cepstral liftering.
 *
 * A voiced spectrum is a comb: the vocal folds put a harmonic every F0 hertz,
 * and peak-picking finds those, not the formants under them. The first version
 * of this gate read /i/ at 90 Hz as having an F1 of 2379 and duly reported that
 * pitch was dragging the vowel around. Nothing was wrong with the synthesizer;
 * the analyser was reading harmonics.
 *
 * The log spectrum of a source through a filter is the SUM of their two log
 * spectra, so an inverse transform separates them by rate: the filter varies
 * slowly across frequency and lands at low quefrency, the harmonic comb varies
 * at F0 and lands at a spike at 1/F0. Keep the low end and transform back, and
 * what is left is the tract. Bogert, Healy and Tukey named this in 1963 and
 * called the axis quefrency on purpose.
 */
export function envelope(mag, sampleRate, cutoffSeconds = 0.004) {
  const n = mag.length * 2;
  // Symmetric log spectrum, so the cepstrum comes out real.
  const re = new Float64Array(n);
  const im = new Float64Array(n);
  for (let i = 0; i < mag.length; i++) {
    re[i] = mag[i];
    re[n - 1 - i] = mag[i];
  }
  fft(re, im);
  // Keep quefrencies below the cutoff — the tract — and drop the pitch spike.
  const keep = Math.max(2, Math.round(cutoffSeconds * sampleRate));
  for (let i = keep; i < n - keep; i++) { re[i] = 0; im[i] = 0; }
  // Back again. The forward transform twice is a reversal and a scale, which
  // is all this needs since the input was symmetric.
  fft(re, im);
  const out = new Float64Array(mag.length);
  for (let i = 0; i < mag.length; i++) out[i] = re[i] / n;
  return out;
}

/**
 * The lifter cutoff for a given pitch.
 *
 * It has to sit BELOW the pitch spike at 1/F0 and above the tract's own
 * structure. There is no cutoff that does both for every pitch, which is not a
 * defect in the analyser: a source that samples the spectrum every F0 hertz
 * carries no information about a formant much below F0, and formant estimation
 * of high voices is hard for exactly that reason.
 */
export function lifterFor(f0) {
  return f0 > 0 ? Math.min(0.004, 0.7 / f0) : 0.004;
}

/**
 * Pick formants by PROMINENCE, not by height.
 *
 * A back vowel's F1 and F2 sit a few hundred hertz apart and the ripple between
 * them is taller than F3, so "the three loudest peaks" returns a shoulder and
 * loses a formant — it read /ɑ/ as 732, 926, 1087 and missed F2 entirely.
 * Prominence, how far a peak stands above the valley you must cross to reach
 * anything higher, is what a peak actually is.
 *
 * **The lifter is only applied to a VOICED spectrum.** A whisper has no harmonic
 * comb to remove, and liftering it anyway smooths the spectrum with a kernel
 * about 125 Hz wide — twice a first formant's own bandwidth. That drags a sharp
 * F1 up the rising skirt of F2 and reported errors of 8 to 11% that belonged
 * entirely to the analyser: unliftered, the same renders come back within 4.1%,
 * with errors of both signs instead of a one-way bias. The gate had been about
 * to widen its budget to cover a defect in its own microphone.
 */
export function peaks(mag, sampleRate, count = 3, minSep = 200, f0 = 0) {
  const binHz = sampleRate / (mag.length * 2);
  const s = f0 > 0 ? envelope(mag, sampleRate, lifterFor(f0)) : mag;
  const lo = Math.ceil(150 / binHz);
  const hi = Math.min(s.length - 2, Math.floor(4600 / binHz));
  const cands = [];
  for (let i = lo + 1; i < hi - 1; i++) {
    if (!(s[i] > s[i - 1] && s[i] >= s[i + 1])) continue;
    let left = s[i];
    for (let j = i - 1; j >= lo; j--) { if (s[j] > s[i]) break; left = Math.min(left, s[j]); }
    let right = s[i];
    for (let j = i + 1; j < hi; j++) { if (s[j] > s[i]) break; right = Math.min(right, s[j]); }
    cands.push({ hz: i * binHz, prom: s[i] - Math.max(left, right) });
  }
  cands.sort((a, b) => b.prom - a.prom);
  const kept = [];
  for (const c of cands) {
    if (kept.length >= count) break;
    if (kept.every((k) => Math.abs(k - c.hz) >= minSep)) kept.push(c.hz);
  }
  return kept.sort((a, b) => a - b);
}

/** How alike two spectral envelopes are over the band a vowel lives in. */
export function envelopeMatch(a, b, sampleRate) {
  const binHz = sampleRate / (a.length * 2);
  const lo = Math.round(200 / binHz);
  const hi = Math.round(3500 / binHz);
  let ma = 0;
  let mb = 0;
  for (let i = lo; i < hi; i++) { ma += a[i]; mb += b[i]; }
  ma /= hi - lo;
  mb /= hi - lo;
  let num = 0;
  let da = 0;
  let db = 0;
  for (let i = lo; i < hi; i++) {
    const x = a[i] - ma;
    const y = b[i] - mb;
    num += x * y;
    da += x * x;
    db += y * y;
  }
  return num / Math.sqrt(da * db + 1e-12);
}

/**
 * Pitch track: the fundamental in each window, by autocorrelation.
 *
 * Not by being told. A planner that produces a beautiful contour and a renderer
 * that ignores it look identical from the planner's side, so the gate reads the
 * pitch back out of the samples.
 *
 * The search starts at a lag well past a formant's ring time. A 60 Hz-wide
 * resonance rings for some five milliseconds, so ANY excitation of it
 * correlates with itself a few hundred samples later — that is not a pitch, and
 * looking for one below about 60 Hz finds the filter instead of the folds.
 */
export function trackPitch(buf, sampleRate, windowSeconds = 0.05, lo = 60, hi = 500) {
  const size = Math.round(windowSeconds * sampleRate);
  const minLag = Math.round(sampleRate / hi);
  const maxLag = Math.round(sampleRate / lo);
  const out = [];
  for (let start = 0; start + size + maxLag <= buf.length; start += size) {
    let energy = 0;
    for (let i = 0; i < size; i++) energy += buf[start + i] * buf[start + i];
    let best = 0;
    let at = 0;
    for (let lag = minLag; lag <= maxLag; lag++) {
      let sum = 0;
      for (let i = 0; i < size; i++) sum += buf[start + i] * buf[start + i + lag];
      const r = sum / (energy + 1e-12);
      if (r > best) { best = r; at = sampleRate / lag; }
    }
    out.push({ at: start / sampleRate, hz: at, strength: best });
  }
  return out;
}

/**
 * The fundamental of one span of samples, by normalized autocorrelation.
 *
 * Confined to `[from, to)` rather than a sliding window, because a window that
 * straddles two syllables averages two pitches and reports neither. Short
 * syllables get a `null` rather than a guess: below about two periods there is
 * nothing to correlate, and saying so beats inventing a number.
 *
 * `hi` defaults to 300 Hz and that is not arbitrary caution. A first formant
 * sits at 490 Hz for a schwa, and a 60 Hz-wide resonance rings hard enough that
 * an autocorrelation allowed up to 500 Hz locks onto it — the first version of
 * this gate read a 115 Hz syllable as being 25 semitones off its plan, which is
 * exactly a fourth-harmonic error onto F1.
 */
export function pitchIn(buf, from, to, sampleRate, lo = 60, hi = 300) {
  const a = Math.max(0, Math.floor(from));
  const b = Math.min(buf.length, Math.floor(to));
  const minLag = Math.round(sampleRate / hi);
  const maxLag = Math.round(sampleRate / lo);
  // Two periods of the LOWEST pitch searched, or the answer is noise.
  if (b - a < maxLag * 2) return null;
  const span = b - a - maxLag;
  let energy = 0;
  for (let i = 0; i < span; i++) energy += buf[a + i] * buf[a + i];
  if (!(energy > 1e-12)) return null;
  let best = 0;
  const r = new Float64Array(maxLag + 1);
  for (let lag = minLag; lag <= maxLag; lag++) {
    let sum = 0;
    for (let i = 0; i < span; i++) sum += buf[a + i] * buf[a + i + lag];
    r[lag] = sum / energy;
    if (r[lag] > best) best = r[lag];
  }
  if (!(best > 0.3)) return null;
  // OCTAVE SAFETY. A periodic signal correlates with itself just as well at
  // twice its period, so "the highest peak" reports the octave below about as
  // often as it reports the pitch: this gate read a syllable planned at 144.5 Hz
  // as being 11.99 semitones off, which is an octave to two decimal places.
  // Taking the SHORTEST lag that gets within a fraction of the best peak is the
  // standard remedy, and 0.85 is loose enough to survive a slightly decaying
  // waveform and tight enough not to catch a formant.
  const threshold = best * 0.85;
  for (let lag = minLag; lag <= maxLag; lag++) {
    if (r[lag] >= threshold) return { hz: sampleRate / lag, strength: r[lag] };
  }
  return null;
}
