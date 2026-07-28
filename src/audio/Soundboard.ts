import {
  blipSpec,
  boingSpec,
  chimeSpec,
  coinSpec,
  crackSpec,
  crowdVoicing,
  engineVoicing,
  rotorVoicing,
  failSpec,
  fillNoise,
  footstepSpec,
  impactSpec,
  makeRandom,
  popSpec,
  rainVoicing,
  splashSpec,
  successSpec,
  tickSpec,
  whooshSpec,
  windVoicing,
  type CurvePoint,
  type FootstepSurface,
  type ImpactMaterial,
  type Rand,
  type SoundSpec,
} from './recipes';

/** Anything with x, y, z — a three `Vector3` qualifies structurally. */
export interface Vec3Like {
  x: number;
  y: number;
  z: number;
}

export type SoundBus = 'sfx' | 'ambient' | 'ui';

/** One line of the caption feed — audio, but visible. */
export interface Caption {
  text: string;
  bus: SoundBus;
  /** World position, when the sound had one. */
  at?: Vec3Like;
  /** Context time when it played, in seconds. */
  time: number;
}

export interface SoundboardOptions {
  /**
   * The audio context to render into. Omit it and the board creates a real
   * `AudioContext` the first time it needs one; pass an `OfflineAudioContext`
   * and every sound renders into a buffer instead — which is how audio gets
   * verified headlessly, with numbers instead of ears.
   */
  context?: BaseAudioContext;
  /** Seed for every jitter and noise buffer. Same seed, same sounds. Default 1. */
  seed?: number;
  /** Master volume 0..1. Default 0.8. */
  volume?: number;
}

export interface PlaySoundOptions {
  /** Per-call gain multiplier. Default 1. */
  volume?: number;
  /** Play positionally from here (inverse-distance panning). Omit = in your head. */
  at?: Vec3Like;
  /** Override the caption text, or `false` to keep this sound off the feed. */
  caption?: string | false;
  /** Route to a different bus than the recipe's default. */
  bus?: SoundBus;
}

/**
 * Soundboard — every sound a game needs, synthesized from a seed.
 *
 * The trilogy generates its worlds, characters and materials procedurally;
 * this is the same bet placed on audio. There are no sample files: a
 * footstep, a bat-crack, a coin, an engine, a rainstorm are all small
 * Web Audio node graphs built from the pure recipes in `recipes.ts`. (For
 * playing *recorded* buffers, `AudioManager` remains the tool — the two are
 * complementary.)
 *
 * ```ts
 * const sounds = new Soundboard({ seed: 7 });
 * sounds.unlock();                                   // arms on first tap/key
 * locomotion.onFootstep(() => sounds.footstep('stone', { at: hero.position }));
 * const engine = sounds.createEngine();
 * game.onUpdate(() => engine.set(car.rpm, car.throttle));
 * ```
 *
 * Three details that are easy to get wrong, handled here:
 *
 * - **Browsers gate audio behind a user gesture.** `unlock()` listens for
 *   the first pointer or key press anywhere and resumes the context; until
 *   then every call schedules silently and harmlessly.
 * - **Everything routes through three buses** (`sfx`, `ambient`, `ui`) into
 *   a shared compressor, so a pile-up of one-shots squeezes instead of
 *   clipping, and `duck()` can make room for what matters.
 * - **Every sound emits a caption.** Synthesized events are already labeled
 *   data, so an accessibility feed costs nothing: `onCaption` tells you
 *   what just played, where, on which bus.
 */
export class Soundboard {
  private readonly rand: Rand;
  private ctx: BaseAudioContext | null = null;
  private readonly ownsContext: boolean;
  private master: GainNode | null = null;
  private comp: DynamicsCompressorNode | null = null;
  private buses: Record<SoundBus, GainNode> | null = null;
  private readonly busVolume: Record<SoundBus, number> = { sfx: 1, ambient: 1, ui: 1 };
  private masterVolume: number;
  private readonly noise = new Map<'white' | 'pink', AudioBuffer>();
  private readonly captionListeners = new Set<(caption: Caption) => void>();
  private readonly captionLog: Caption[] = [];
  private readonly live = new Set<{ stop(fade?: number): void }>();
  private unlockCleanup: (() => void) | null = null;

  constructor(options: SoundboardOptions = {}) {
    this.rand = makeRandom(options.seed ?? 1);
    this.masterVolume = options.volume ?? 0.8;
    this.ownsContext = !options.context;
    if (options.context) this.ctx = options.context;
  }

  /** The context in use — created on first access when none was injected. */
  get context(): BaseAudioContext {
    if (!this.ctx) {
      const Ctor =
        (globalThis as { AudioContext?: new () => AudioContext }).AudioContext ??
        (globalThis as { webkitAudioContext?: new () => AudioContext }).webkitAudioContext;
      if (!Ctor) {
        throw new Error(
          'Soundboard: no AudioContext in this environment — pass one in options ' +
            '(an OfflineAudioContext works for headless rendering).'
        );
      }
      this.ctx = new Ctor();
    }
    return this.ctx;
  }

  /**
   * Arm the board on the first user gesture. Safe to call immediately at
   * startup; it does nothing in environments without a window.
   */
  unlock(target: Pick<Window, 'addEventListener' | 'removeEventListener'> | null = null): void {
    const listen =
      target ?? (typeof window === 'undefined' ? null : (window as Window));
    if (!listen || this.unlockCleanup) return;
    const arm = () => {
      this.unlockCleanup?.();
      void this.resume();
    };
    for (const type of ['pointerdown', 'keydown', 'touchstart']) {
      listen.addEventListener(type, arm);
    }
    this.unlockCleanup = () => {
      for (const type of ['pointerdown', 'keydown', 'touchstart']) {
        listen.removeEventListener(type, arm);
      }
      this.unlockCleanup = null;
    };
  }

  /** Resume a suspended context (must follow a user gesture in browsers). */
  async resume(): Promise<void> {
    const ctx = this.context as AudioContext;
    if (ctx.state === 'suspended' && typeof ctx.resume === 'function') await ctx.resume();
  }

  // -- Mixing ---------------------------------------------------------------

  setVolume(volume: number): void {
    this.masterVolume = volume;
    if (this.master) this.master.gain.setTargetAtTime(volume, this.context.currentTime, 0.03);
  }

  setBusVolume(bus: SoundBus, volume: number): void {
    this.busVolume[bus] = volume;
    if (this.buses) this.buses[bus].gain.setTargetAtTime(volume, this.context.currentTime, 0.03);
  }

  /**
   * Pull a bus down and let it back up — the mixer's way of making room.
   * Duck `ambient` while dialogue or a fanfare plays and the world seems
   * to lean in; nothing needs to stop.
   */
  duck(bus: SoundBus = 'ambient', amount = 0.3, duration = 0.8): void {
    const gain = this.ensureGraph().buses[bus].gain;
    const now = this.context.currentTime;
    const base = this.busVolume[bus];
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(base * amount, now + 0.06);
    gain.setValueAtTime(base * amount, now + Math.max(duration - 0.25, 0.06));
    gain.linearRampToValueAtTime(base, now + Math.max(duration, 0.1));
  }

  /**
   * An `AnalyserNode` fed by the finished master mix (post-compressor) —
   * for spectrum walls, VU meters, or UI that pulses with the sound. What
   * it reads is exactly what reaches the speakers.
   */
  createAnalyser(fftSize = 128): AnalyserNode {
    this.ensureGraph();
    const analyser = this.context.createAnalyser();
    analyser.fftSize = fftSize;
    this.comp?.connect(analyser);
    return analyser;
  }

  // -- Captions -------------------------------------------------------------

  /** Subscribe to the caption feed. Returns unsubscribe. */
  onCaption(listener: (caption: Caption) => void): () => void {
    this.captionListeners.add(listener);
    return () => this.captionListeners.delete(listener);
  }

  /** The last 32 captions, oldest first. */
  captions(): readonly Caption[] {
    return this.captionLog;
  }

  // -- One-shots ------------------------------------------------------------

  footstep(surface: FootstepSurface = 'grass', options: PlaySoundOptions & { weight?: number } = {}): void {
    this.play(footstepSpec(this.rand, surface, options.weight ?? 1), options);
  }

  impact(material: ImpactMaterial = 'wood', energy = 0.7, options?: PlaySoundOptions): void {
    this.play(impactSpec(this.rand, material, energy), options);
  }

  /** The bat-crack / sharp break. */
  crack(energy = 0.9, options?: PlaySoundOptions): void {
    this.play(crackSpec(this.rand, energy), options);
  }

  whoosh(speed = 0.7, options?: PlaySoundOptions): void {
    this.play(whooshSpec(this.rand, speed), options);
  }

  splash(size = 0.6, options?: PlaySoundOptions): void {
    this.play(splashSpec(this.rand, size), options);
  }

  coin(options?: PlaySoundOptions): void {
    this.play(coinSpec(this.rand), options);
  }

  pop(options?: PlaySoundOptions): void {
    this.play(popSpec(this.rand), options);
  }

  boing(options?: PlaySoundOptions): void {
    this.play(boingSpec(this.rand), options);
  }

  chime(step = 0, options?: PlaySoundOptions): void {
    this.play(chimeSpec(this.rand, step), { bus: 'ui', ...options });
  }

  success(options?: PlaySoundOptions): void {
    this.play(successSpec(this.rand), { bus: 'ui', ...options });
  }

  fail(options?: PlaySoundOptions): void {
    this.play(failSpec(this.rand), { bus: 'ui', ...options });
  }

  tick(options?: PlaySoundOptions): void {
    this.play(tickSpec(this.rand), { bus: 'ui', ...options });
  }

  blip(options?: PlaySoundOptions): void {
    this.play(blipSpec(this.rand), { bus: 'ui', ...options });
  }

  /** Escape hatch: render any spec you built yourself. */
  play(spec: SoundSpec, options: PlaySoundOptions = {}): void {
    const bus = options.bus ?? 'sfx';
    const { buses } = this.ensureGraph();
    const ctx = this.context;
    const t0 = ctx.currentTime + 0.005;
    const out = this.route(options.at, buses[bus]);
    const volume = options.volume ?? 1;

    for (const layer of spec.layers) {
      const gain = ctx.createGain();
      this.schedule(gain.gain, layer.gain, t0, volume, false);
      gain.connect(out);
      if (layer.kind === 'osc') {
        const osc = ctx.createOscillator();
        osc.type = layer.wave;
        this.schedule(osc.frequency, layer.freq, t0, 1, true);
        osc.connect(gain);
        osc.start(t0);
        osc.stop(t0 + spec.duration + 0.05);
      } else {
        const source = ctx.createBufferSource();
        source.buffer = this.noiseBuffer(layer.color);
        source.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = layer.filter.type;
        filter.Q.value = layer.filter.q;
        this.schedule(filter.frequency, layer.filter.freq, t0, 1, true);
        source.connect(filter);
        filter.connect(gain);
        // A random start offset so two simultaneous noise layers never share
        // a waveform — identical noise sums to +6 dB of the SAME hiss.
        source.start(t0, this.rand() * (source.buffer.duration - 0.5));
        source.stop(t0 + spec.duration + 0.05);
      }
    }
    if (options.caption !== false) {
      this.emitCaption(options.caption ?? spec.caption, bus, options.at);
    }
  }

  // -- Continuous sources ---------------------------------------------------

  /** A persistent engine voice. Drive it every frame with `set(rpm, load)`. */
  createEngine(options: { volume?: number; at?: Vec3Like } = {}): EngineSound {
    const engine = new EngineSound(this, options);
    this.live.add(engine);
    this.emitCaption('engine running', 'sfx', options.at);
    return engine;
  }

  /** A wind bed on the ambient bus. `set(strength)` with 0..1. */
  createWind(options: { volume?: number } = {}): AmbientBed {
    const bed = new AmbientBed(this, 'wind', options.volume ?? 1);
    this.live.add(bed);
    this.emitCaption('wind', 'ambient');
    return bed;
  }

  /** A rain bed on the ambient bus. `set(intensity)` with 0..1. */
  createRain(options: { volume?: number } = {}): AmbientBed {
    const bed = new AmbientBed(this, 'rain', options.volume ?? 1);
    this.live.add(bed);
    this.emitCaption('rain', 'ambient');
    return bed;
  }

  /** A crowd murmur that can `swell()` when something worth roaring happens. */
  createCrowd(options: { volume?: number } = {}): CrowdSound {
    const crowd = new CrowdSound(this, options.volume ?? 1);
    this.live.add(crowd);
    this.emitCaption('crowd murmur', 'ambient');
    return crowd;
  }

  // -- Spatial --------------------------------------------------------------

  /**
   * Move the ears. Call once per frame with the camera's world position and
   * facing; every positional sound pans and attenuates against it. All three
   * arguments are plain `{x,y,z}` — pass three vectors directly.
   */
  updateListener(
    position: Vec3Like,
    forward: Vec3Like = { x: 0, y: 0, z: -1 },
    up: Vec3Like = { x: 0, y: 1, z: 0 }
  ): void {
    const listener = (this.context as AudioContext).listener;
    if (!listener) return;
    const t = this.context.currentTime;
    if ('positionX' in listener && listener.positionX) {
      listener.positionX.setTargetAtTime(position.x, t, 0.02);
      listener.positionY.setTargetAtTime(position.y, t, 0.02);
      listener.positionZ.setTargetAtTime(position.z, t, 0.02);
      listener.forwardX.setTargetAtTime(forward.x, t, 0.02);
      listener.forwardY.setTargetAtTime(forward.y, t, 0.02);
      listener.forwardZ.setTargetAtTime(forward.z, t, 0.02);
      listener.upX.setTargetAtTime(up.x, t, 0.02);
      listener.upY.setTargetAtTime(up.y, t, 0.02);
      listener.upZ.setTargetAtTime(up.z, t, 0.02);
    } else if ('setPosition' in listener) {
      (listener as unknown as {
        setPosition(x: number, y: number, z: number): void;
        setOrientation(x: number, y: number, z: number, ux: number, uy: number, uz: number): void;
      }).setPosition(position.x, position.y, position.z);
      (listener as unknown as {
        setOrientation(x: number, y: number, z: number, ux: number, uy: number, uz: number): void;
      }).setOrientation(forward.x, forward.y, forward.z, up.x, up.y, up.z);
    }
  }

  /** Stop every live source and, if the board created its context, close it. */
  dispose(): void {
    this.unlockCleanup?.();
    for (const handle of [...this.live]) handle.stop(0.05);
    this.live.clear();
    const ctx = this.ctx as AudioContext | null;
    if (ctx && this.ownsContext && typeof ctx.close === 'function') void ctx.close();
  }

  // -- Internals (shared with the handle classes below) ---------------------

  /** @internal */
  ensureGraph(): { master: GainNode; buses: Record<SoundBus, GainNode> } {
    if (this.master && this.buses) return { master: this.master, buses: this.buses };
    const ctx = this.context;
    const master = ctx.createGain();
    master.gain.value = this.masterVolume;
    const compressor = ctx.createDynamicsCompressor();
    master.connect(compressor);
    compressor.connect(ctx.destination);
    this.comp = compressor;
    const bus = (): GainNode => {
      const g = ctx.createGain();
      g.connect(master);
      return g;
    };
    this.master = master;
    this.buses = { sfx: bus(), ambient: bus(), ui: bus() };
    return { master, buses: this.buses };
  }

  /** @internal */
  route(at: Vec3Like | undefined, bus: GainNode): AudioNode {
    if (!at) return bus;
    const ctx = this.context;
    const panner = ctx.createPanner();
    panner.panningModel = 'equalpower';
    panner.distanceModel = 'inverse';
    panner.refDistance = 4;
    if ('positionX' in panner && panner.positionX) {
      panner.positionX.value = at.x;
      panner.positionY.value = at.y;
      panner.positionZ.value = at.z;
    } else if ('setPosition' in panner) {
      (panner as unknown as { setPosition(x: number, y: number, z: number): void }).setPosition(
        at.x,
        at.y,
        at.z
      );
    }
    panner.connect(bus);
    return panner;
  }

  /** @internal Schedule a curve onto a param; exponential needs values > 0. */
  schedule(
    param: AudioParam,
    points: CurvePoint[],
    t0: number,
    scale: number,
    exponential: boolean
  ): void {
    const value = (v: number) => (exponential ? Math.max(v * scale, 0.0001) : v * scale);
    param.setValueAtTime(value(points[0][1]), t0 + points[0][0]);
    for (let i = 1; i < points.length; i++) {
      const [time, v] = points[i];
      if (exponential) param.exponentialRampToValueAtTime(value(v), t0 + time);
      else param.linearRampToValueAtTime(value(v), t0 + time);
    }
  }

  /** @internal Seeded looping noise, one buffer per color per board. */
  noiseBuffer(color: 'white' | 'pink'): AudioBuffer {
    const cached = this.noise.get(color);
    if (cached) return cached;
    const ctx = this.context;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 2), ctx.sampleRate);
    fillNoise(buffer.getChannelData(0), this.rand, color);
    this.noise.set(color, buffer);
    return buffer;
  }

  /** @internal */
  emitCaption(text: string, bus: SoundBus, at?: Vec3Like): void {
    const caption: Caption = { text, bus, at, time: this.ctx ? this.ctx.currentTime : 0 };
    this.captionLog.push(caption);
    if (this.captionLog.length > 32) this.captionLog.shift();
    for (const listener of this.captionListeners) listener(caption);
  }

  /** @internal */
  forget(handle: { stop(fade?: number): void }): void {
    this.live.delete(handle);
  }

  /** @internal */
  random(): number {
    return this.rand();
  }
}

// ---------------------------------------------------------------------------
// Continuous handles. Each owns a few persistent nodes and moves them with
// setTargetAtTime — an exponential approach that never zippers, whatever
// frame rate `set` is called at.
// ---------------------------------------------------------------------------

/**
 * A running engine. `set(rpm, load)` every frame; the voice follows with
 * ~40 ms of lag, which reads as flywheel inertia rather than sluggishness.
 */
export class EngineSound {
  private readonly oscs: OscillatorNode[];
  private readonly oscGains: GainNode[];
  private readonly noiseGain: GainNode;
  private readonly noiseFilter: BiquadFilterNode;
  private readonly out: GainNode;
  private stopped = false;
  /** The last rpm handed to `set`. */
  rpm = 800;

  constructor(private readonly board: Soundboard, options: { volume?: number; at?: Vec3Like }) {
    const ctx = board.context;
    const { buses } = board.ensureGraph();
    this.out = ctx.createGain();
    this.out.gain.value = options.volume ?? 1;
    this.out.connect(board.route(options.at, buses.sfx));

    const waves: OscillatorType[] = ['sawtooth', 'sine', 'square'];
    this.oscs = waves.map((wave) => {
      const osc = ctx.createOscillator();
      osc.type = wave;
      return osc;
    });
    this.oscGains = this.oscs.map((osc) => {
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(this.out);
      return gain;
    });

    const noise = ctx.createBufferSource();
    noise.buffer = board.noiseBuffer('white');
    noise.loop = true;
    this.noiseFilter = ctx.createBiquadFilter();
    this.noiseFilter.type = 'bandpass';
    this.noiseFilter.Q.value = 0.8;
    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.value = 0;
    noise.connect(this.noiseFilter);
    this.noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.out);

    const t0 = ctx.currentTime;
    for (const osc of this.oscs) osc.start(t0);
    noise.start(t0, board.random());
    this.sources = [...this.oscs, noise];
    this.set(this.rpm, 0.2);
  }

  private readonly sources: AudioScheduledSourceNode[];

  set(rpm: number, load = 0.5): void {
    if (this.stopped) return;
    this.rpm = rpm;
    const t = this.board.context.currentTime;
    const voice = engineVoicing(rpm, load);
    voice.fundamentals.forEach((freq, i) => {
      this.oscs[i].frequency.setTargetAtTime(freq, t, 0.04);
      this.oscGains[i].gain.setTargetAtTime(voice.gains[i], t, 0.08);
    });
    this.noiseFilter.frequency.setTargetAtTime(voice.noiseFreq, t, 0.08);
    this.noiseGain.gain.setTargetAtTime(voice.noiseGain, t, 0.08);
  }

  stop(fade = 0.4): void {
    if (this.stopped) return;
    this.stopped = true;
    const t = this.board.context.currentTime;
    this.out.gain.setTargetAtTime(0, t, Math.max(fade / 4, 0.01));
    for (const source of this.sources) source.stop(t + fade + 0.1);
    this.board.forget(this);
  }
}

/**
 * A helicopter rotor: broadband noise CHOPPED at the blade-pass
 * frequency by an LFO — the wop-wop is a tremolo (see `rotorVoicing`) —
 * with a rumble body under it and a turbine whine over it. `set(rpm)`
 * moves the whole voice; the chop rate IS the rotor.
 *
 * ```ts
 * const rotor = new RotorSound(sounds, { blades: 3, volume: 0.5 });
 * rotor.set(hover.rotor * 400);   // per frame, from the spool
 * ```
 */
export class RotorSound {
  private readonly lfo: OscillatorNode;
  private readonly lfoDepth: GainNode;
  private readonly chopGain: GainNode;
  private readonly bodyFilter: BiquadFilterNode;
  private readonly noiseGain: GainNode;
  private readonly whine: OscillatorNode;
  private readonly whineGain: GainNode;
  private readonly out: GainNode;
  private readonly sources: AudioScheduledSourceNode[];
  private readonly blades: number;
  private stopped = false;
  /** The last rpm handed to `set`. */
  rpm = 0;

  constructor(
    private readonly board: Soundboard,
    options: { blades?: number; volume?: number; at?: Vec3Like } = {}
  ) {
    this.blades = options.blades ?? 3;
    const ctx = board.context;
    const { buses } = board.ensureGraph();
    this.out = ctx.createGain();
    this.out.gain.value = options.volume ?? 1;
    this.out.connect(board.route(options.at, buses.sfx));

    // Noise → low body filter → chopped gain → out.
    const noise = ctx.createBufferSource();
    noise.buffer = board.noiseBuffer('white');
    noise.loop = true;
    this.bodyFilter = ctx.createBiquadFilter();
    this.bodyFilter.type = 'lowpass';
    this.bodyFilter.Q.value = 0.6;
    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.value = 0;
    this.chopGain = ctx.createGain();
    this.chopGain.gain.value = 1;
    noise.connect(this.bodyFilter);
    this.bodyFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.chopGain);
    this.chopGain.connect(this.out);

    // The LFO is the rotor: its frequency is the blade-pass rate.
    this.lfo = ctx.createOscillator();
    this.lfo.type = 'sine';
    this.lfoDepth = ctx.createGain();
    this.lfoDepth.gain.value = 0;
    this.lfo.connect(this.lfoDepth);
    this.lfoDepth.connect(this.chopGain.gain);

    // The turbine whine, thin and high.
    this.whine = ctx.createOscillator();
    this.whine.type = 'sine';
    this.whineGain = ctx.createGain();
    this.whineGain.gain.value = 0;
    this.whine.connect(this.whineGain);
    this.whineGain.connect(this.out);

    const t0 = ctx.currentTime;
    this.lfo.start(t0);
    this.whine.start(t0);
    noise.start(t0, board.random());
    this.sources = [this.lfo, this.whine, noise];
    this.set(0);
  }

  set(rpm: number): void {
    if (this.stopped) return;
    this.rpm = rpm;
    const t = this.board.context.currentTime;
    const voice = rotorVoicing(rpm, this.blades);
    this.lfo.frequency.setTargetAtTime(Math.max(voice.chopHz, 0.01), t, 0.06);
    // Keep the chopped gain positive: base 1 − depth/2, swing ±depth/2.
    this.chopGain.gain.setTargetAtTime(1 - voice.chopDepth / 2, t, 0.08);
    this.lfoDepth.gain.setTargetAtTime(voice.chopDepth / 2, t, 0.08);
    this.bodyFilter.frequency.setTargetAtTime(voice.bodyFreq * 8, t, 0.08);
    this.noiseGain.gain.setTargetAtTime(voice.noiseGain, t, 0.08);
    this.whine.frequency.setTargetAtTime(voice.whineFreq, t, 0.06);
    this.whineGain.gain.setTargetAtTime(voice.whineGain, t, 0.08);
  }

  stop(fade = 0.4): void {
    if (this.stopped) return;
    this.stopped = true;
    const t = this.board.context.currentTime;
    this.out.gain.setTargetAtTime(0, t, Math.max(fade / 4, 0.01));
    for (const source of this.sources) source.stop(t + fade + 0.1);
    this.board.forget(this);
  }
}

/**
 * A weather bed — wind or rain — on the ambient bus. One `set(amount)`
 * call moves the whole voice; the long ramps mean weather changes like
 * weather, not like a fader.
 */
export class AmbientBed {
  private readonly gain: GainNode;
  private readonly filter: BiquadFilterNode;
  private readonly patter: GainNode | null = null;
  private readonly lfoDepth: GainNode | null = null;
  private readonly lfo: OscillatorNode | null = null;
  private readonly sources: AudioScheduledSourceNode[] = [];
  private stopped = false;

  constructor(
    private readonly board: Soundboard,
    private readonly kind: 'wind' | 'rain',
    private readonly volume: number
  ) {
    const ctx = board.context;
    const { buses } = board.ensureGraph();
    this.gain = ctx.createGain();
    this.gain.gain.value = 0;
    this.gain.connect(buses.ambient);

    this.filter = ctx.createBiquadFilter();
    this.filter.type = kind === 'wind' ? 'lowpass' : 'highpass';
    this.filter.Q.value = 0.6;
    const noise = ctx.createBufferSource();
    noise.buffer = board.noiseBuffer(kind === 'wind' ? 'pink' : 'white');
    noise.loop = true;
    noise.connect(this.filter);
    this.filter.connect(this.gain);
    noise.start(ctx.currentTime, board.random());
    this.sources.push(noise);

    if (kind === 'wind') {
      // The gust: a slow LFO into the filter cutoff. Wind with a static
      // spectrum is a broken fan; the wobble is the weather.
      this.lfo = ctx.createOscillator();
      this.lfo.frequency.value = 0.15;
      this.lfoDepth = ctx.createGain();
      this.lfoDepth.gain.value = 0;
      this.lfo.connect(this.lfoDepth);
      this.lfoDepth.connect(this.filter.frequency);
      this.lfo.start(ctx.currentTime);
      this.sources.push(this.lfo);
    } else {
      const drops = ctx.createBufferSource();
      drops.buffer = board.noiseBuffer('white');
      drops.loop = true;
      const dropFilter = ctx.createBiquadFilter();
      dropFilter.type = 'bandpass';
      dropFilter.frequency.value = 4200;
      dropFilter.Q.value = 2.2;
      this.patter = ctx.createGain();
      this.patter.gain.value = 0;
      drops.connect(dropFilter);
      dropFilter.connect(this.patter);
      this.patter.connect(this.gain);
      drops.start(ctx.currentTime, board.random());
      this.sources.push(drops);
    }
    this.set(0.4);
  }

  /** Strength/intensity 0..1. */
  set(amount: number): void {
    if (this.stopped) return;
    const t = this.board.context.currentTime;
    if (this.kind === 'wind') {
      const voice = windVoicing(amount);
      this.gain.gain.setTargetAtTime(voice.gain * this.volume, t, 0.8);
      this.filter.frequency.setTargetAtTime(voice.cutoff, t, 0.8);
      this.lfoDepth?.gain.setTargetAtTime(voice.gustDepth, t, 0.8);
      this.lfo?.frequency.setTargetAtTime(voice.gustRate, t, 0.8);
    } else {
      const voice = rainVoicing(amount);
      this.gain.gain.setTargetAtTime(voice.gain * this.volume, t, 0.8);
      this.filter.frequency.setTargetAtTime(voice.cutoff, t, 0.8);
      this.patter?.gain.setTargetAtTime(voice.patterGain, t, 0.8);
    }
  }

  stop(fade = 1.2): void {
    if (this.stopped) return;
    this.stopped = true;
    const t = this.board.context.currentTime;
    this.gain.gain.setTargetAtTime(0, t, Math.max(fade / 4, 0.01));
    for (const source of this.sources) source.stop(t + fade + 0.1);
    this.board.forget(this);
  }
}

/**
 * A crowd: pink noise through three vowel formants, with a slow flutter so
 * it chatters instead of hissing. `set` follows the mood; `swell` is the
 * boundary-four moment — a rise and a die-down on a schedule.
 */
export class CrowdSound {
  private readonly gain: GainNode;
  private readonly formants: BiquadFilterNode[];
  private readonly lfo: OscillatorNode;
  private readonly lfoDepth: GainNode;
  private readonly sources: AudioScheduledSourceNode[] = [];
  private excitement = 0.25;
  private stopped = false;

  constructor(private readonly board: Soundboard, private readonly volume: number) {
    const ctx = board.context;
    const { buses } = board.ensureGraph();
    this.gain = ctx.createGain();
    this.gain.gain.value = 0;
    this.gain.connect(buses.ambient);

    const noise = ctx.createBufferSource();
    noise.buffer = board.noiseBuffer('pink');
    noise.loop = true;
    this.formants = [0, 1, 2].map(() => {
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      noise.connect(filter);
      filter.connect(this.gain);
      return filter;
    });
    noise.start(ctx.currentTime, board.random());
    this.sources.push(noise);

    this.lfo = ctx.createOscillator();
    this.lfoDepth = ctx.createGain();
    this.lfo.connect(this.lfoDepth);
    this.lfoDepth.connect(this.gain.gain);
    this.lfo.start(ctx.currentTime);
    this.sources.push(this.lfo);
    this.set(this.excitement);
  }

  /** Baseline mood 0..1 — 0.2 murmurs, 0.8 is a full house on its feet. */
  set(excitement: number): void {
    if (this.stopped) return;
    this.excitement = excitement;
    const t = this.board.context.currentTime;
    const voice = crowdVoicing(excitement);
    this.gain.gain.setTargetAtTime(voice.gain * this.volume, t, 1.2);
    voice.formants.forEach((freq, i) => {
      this.formants[i].frequency.setTargetAtTime(freq, t, 1.2);
      this.formants[i].Q.setTargetAtTime(voice.q, t, 1.2);
    });
    this.lfo.frequency.setTargetAtTime(voice.chatterRate, t, 1.2);
    this.lfoDepth.gain.setTargetAtTime(voice.gain * this.volume * 0.35, t, 1.2);
  }

  /** A roar that rises fast and dies down on its own. */
  swell(peak = 1, duration = 2.5): void {
    if (this.stopped) return;
    const t = this.board.context.currentTime;
    const up = crowdVoicing(peak);
    const back = crowdVoicing(this.excitement);
    const gain = this.gain.gain;
    gain.cancelScheduledValues(t);
    gain.setValueAtTime(gain.value, t);
    gain.linearRampToValueAtTime(up.gain * this.volume, t + duration * 0.25);
    gain.setValueAtTime(up.gain * this.volume, t + duration * 0.55);
    gain.linearRampToValueAtTime(back.gain * this.volume, t + duration);
    this.board.emitCaption('crowd roars', 'ambient');
  }

  stop(fade = 1.2): void {
    if (this.stopped) return;
    this.stopped = true;
    const t = this.board.context.currentTime;
    this.gain.gain.setTargetAtTime(0, t, Math.max(fade / 4, 0.01));
    for (const source of this.sources) source.stop(t + fade + 0.1);
    this.board.forget(this);
  }
}
