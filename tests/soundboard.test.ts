import { describe, expect, it, vi } from 'vitest';
import {
  Soundboard,
  blipSpec,
  boingSpec,
  chimeSpec,
  coinSpec,
  crackSpec,
  crowdVoicing,
  engineVoicing,
  failSpec,
  fillNoise,
  footstepSpec,
  impactSpec,
  popSpec,
  rainVoicing,
  splashSpec,
  successSpec,
  tickSpec,
  whooshSpec,
  windVoicing,
  type FootstepSurface,
  type SoundLayer,
  type SoundSpec,
} from '../src';
import { makeRandom } from '../src/audio/recipes';

// ---------------------------------------------------------------------------
// The recipes are pure data, so the interesting audio claims — a stone step
// is brighter than a grass one, nothing clicks, the same seed is the same
// sound — are all provable here in Node, with no ears and no AudioContext.
// ---------------------------------------------------------------------------

const ALL_RECIPES: Array<[string, (rand: () => number) => SoundSpec]> = [
  ['footstep', (r) => footstepSpec(r, 'stone')],
  ['impact', (r) => impactSpec(r, 'metal', 0.8)],
  ['crack', (r) => crackSpec(r, 0.9)],
  ['whoosh', (r) => whooshSpec(r, 0.7)],
  ['splash', (r) => splashSpec(r, 0.6)],
  ['coin', coinSpec],
  ['pop', popSpec],
  ['boing', boingSpec],
  ['chime', (r) => chimeSpec(r, 2)],
  ['success', successSpec],
  ['fail', failSpec],
  ['tick', tickSpec],
  ['blip', blipSpec],
];

const last = <T>(items: readonly T[]): T => items[items.length - 1];

const noiseLayers = (spec: SoundSpec) =>
  spec.layers.filter((l): l is Extract<SoundLayer, { kind: 'noise' }> => l.kind === 'noise');
const oscLayers = (spec: SoundSpec) =>
  spec.layers.filter((l): l is Extract<SoundLayer, { kind: 'osc' }> => l.kind === 'osc');

describe('sound recipes', () => {
  it('THE NO-CLICK RULE: every gain envelope starts and ends at zero', () => {
    for (const [name, make] of ALL_RECIPES) {
      const spec = make(makeRandom(5));
      for (const layer of spec.layers) {
        expect(layer.gain[0][1], `${name} start`).toBe(0);
        expect(layer.gain[layer.gain.length - 1][1], `${name} end`).toBe(0);
      }
    }
  });

  it('every curve is finite, positive-frequency, and strictly ordered in time', () => {
    for (const [name, make] of ALL_RECIPES) {
      const spec = make(makeRandom(11));
      expect(spec.duration, name).toBeGreaterThan(0);
      expect(spec.caption.length, name).toBeGreaterThan(0);
      for (const layer of spec.layers) {
        const curves = layer.kind === 'osc' ? [layer.freq, layer.gain] : [layer.filter.freq, layer.gain];
        for (const curve of curves) {
          for (let i = 0; i < curve.length; i++) {
            expect(Number.isFinite(curve[i][0]), `${name} time`).toBe(true);
            expect(Number.isFinite(curve[i][1]), `${name} value`).toBe(true);
            if (i > 0) expect(curve[i][0], `${name} ordering`).toBeGreaterThan(curve[i - 1][0]);
          }
        }
        const freqs = layer.kind === 'osc' ? layer.freq : layer.filter.freq;
        for (const [, f] of freqs) expect(f, `${name} freq > 0`).toBeGreaterThan(0);
        // No layer outlives the spec it belongs to.
        expect(layer.gain[layer.gain.length - 1][0], name).toBeLessThanOrEqual(spec.duration + 1e-9);
      }
    }
  });

  it('the same seed is the same sound; a different seed is a different one', () => {
    const a = footstepSpec(makeRandom(9), 'wood');
    const b = footstepSpec(makeRandom(9), 'wood');
    const c = footstepSpec(makeRandom(10), 'wood');
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
  });

  it('THE FILTER IS THE MATERIAL: footsteps get brighter from grass to stone', () => {
    const centre = (surface: FootstepSurface) =>
      noiseLayers(footstepSpec(makeRandom(3), surface))[0].filter.freq[0][1];
    expect(centre('grass')).toBeLessThan(centre('sand'));
    expect(centre('sand')).toBeLessThan(centre('stone'));
    // And the resonant grounds carry a tuned body the mute ones lack.
    expect(oscLayers(footstepSpec(makeRandom(3), 'wood')).length).toBeGreaterThan(0);
    expect(oscLayers(footstepSpec(makeRandom(3), 'metal')).length).toBeGreaterThan(0);
    expect(oscLayers(footstepSpec(makeRandom(3), 'grass')).length).toBe(0);
  });

  it('weight lands lower and louder, not just louder', () => {
    const light = footstepSpec(makeRandom(4), 'stone', 0.5);
    const heavy = footstepSpec(makeRandom(4), 'stone', 2);
    const centre = (s: SoundSpec) => noiseLayers(s)[0].filter.freq[0][1];
    const peak = (s: SoundSpec) => Math.max(...s.layers.flatMap((l) => l.gain.map((p) => p[1])));
    expect(centre(heavy)).toBeLessThan(centre(light));
    expect(peak(heavy)).toBeGreaterThan(peak(light));
  });

  it('metal rings inharmonically; energy scales impact loudness and length', () => {
    expect(oscLayers(impactSpec(makeRandom(2), 'metal', 0.7)).length).toBe(3);
    expect(oscLayers(impactSpec(makeRandom(2), 'wood', 0.7)).length).toBe(1);
    const soft = impactSpec(makeRandom(6), 'wood', 0.2);
    const hard = impactSpec(makeRandom(6), 'wood', 1);
    const peak = (s: SoundSpec) => Math.max(...s.layers.flatMap((l) => l.gain.map((p) => p[1])));
    expect(peak(hard)).toBeGreaterThan(peak(soft));
    expect(hard.duration).toBeGreaterThan(soft.duration);
  });

  it('a crack is fast and bright — energy above 1 kHz, attack inside 3 ms', () => {
    const spec = crackSpec(makeRandom(7), 0.9);
    for (const layer of noiseLayers(spec)) {
      expect(layer.filter.freq[0][1]).toBeGreaterThan(1000);
      expect(layer.gain[1][0]).toBeLessThanOrEqual(0.003); // attack time
    }
    expect(spec.duration).toBeLessThan(0.3);
  });

  it('the engine voice follows rpm and breathes with load', () => {
    const idle = engineVoicing(900, 0.1);
    const redline = engineVoicing(6000, 0.1);
    expect(idle.fundamentals[0]).toBeCloseTo(30, 5); // 900 rpm → 30 Hz firing
    expect(redline.fundamentals[0]).toBeCloseTo(200, 5);
    expect(engineVoicing(3000, 1).noiseGain).toBeGreaterThan(engineVoicing(3000, 0).noiseGain);
    // Clamped, never silent, never infinite — whatever the caller sends.
    for (const rpm of [0, -50, 1e9, NaN]) {
      const voice = engineVoicing(rpm, 0.5);
      for (const f of voice.fundamentals) expect(Number.isFinite(f)).toBe(true);
    }
  });

  it('wind gets louder, brighter and gustier; rain reaches lower as it hardens', () => {
    expect(windVoicing(0).gain).toBe(0);
    expect(windVoicing(1).gain).toBeGreaterThan(windVoicing(0.3).gain);
    expect(windVoicing(1).cutoff).toBeGreaterThan(windVoicing(0.2).cutoff);
    expect(windVoicing(5).gain).toBe(windVoicing(1).gain); // clamped
    expect(rainVoicing(1).cutoff).toBeLessThan(rainVoicing(0.1).cutoff);
    expect(rainVoicing(1).gain).toBeGreaterThan(rainVoicing(0.2).gain);
  });

  it('an excited crowd is louder and higher-voiced', () => {
    const calm = crowdVoicing(0.1);
    const roaring = crowdVoicing(1);
    expect(roaring.gain).toBeGreaterThan(calm.gain);
    for (let i = 0; i < 3; i++) expect(roaring.formants[i]).toBeGreaterThan(calm.formants[i]);
  });

  it('pink noise is smoother than white — that is what pink MEANS', () => {
    const white = new Float32Array(8192);
    const pink = new Float32Array(8192);
    fillNoise(white, makeRandom(1), 'white');
    fillNoise(pink, makeRandom(1), 'pink');
    const roughness = (data: Float32Array) => {
      let sum = 0;
      let energy = 0;
      for (let i = 1; i < data.length; i++) {
        sum += (data[i] - data[i - 1]) ** 2;
        energy += data[i] ** 2;
      }
      return sum / energy; // successive-difference power, normalised for level
    };
    expect(roughness(pink)).toBeLessThan(roughness(white) * 0.5);
    for (const v of white) expect(Math.abs(v)).toBeLessThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// The Soundboard renders specs into a Web Audio graph. Node has no Web
// Audio, so a small fake context records what the board schedules — enough
// to prove sources start and stop, envelopes are scheduled, panners appear
// only for positional sounds, and continuous handles follow their inputs.
// ---------------------------------------------------------------------------

class FakeParam {
  events: Array<[string, number, number]> = [];
  constructor(public value = 0) {}
  setValueAtTime(v: number, t: number) {
    this.events.push(['set', v, t]);
    this.value = v;
  }
  linearRampToValueAtTime(v: number, t: number) {
    this.events.push(['linear', v, t]);
    this.value = v;
  }
  exponentialRampToValueAtTime(v: number, t: number) {
    this.events.push(['exp', v, t]);
    this.value = v;
  }
  setTargetAtTime(v: number, t: number) {
    this.events.push(['target', v, t]);
    this.value = v;
  }
  cancelScheduledValues() {
    this.events.push(['cancel', 0, 0]);
  }
}

class FakeNode {
  connections: unknown[] = [];
  started: number[] = [];
  stopped: number[] = [];
  type = '';
  loop = false;
  buffer: { duration: number; getChannelData(i: number): Float32Array } | null = null;
  gain = new FakeParam(1);
  frequency = new FakeParam(350);
  Q = new FakeParam(1);
  positionX = new FakeParam();
  positionY = new FakeParam();
  positionZ = new FakeParam();
  panningModel = '';
  distanceModel = '';
  refDistance = 0;
  constructor(public kind: string) {}
  connect(target: unknown) {
    this.connections.push(target);
  }
  disconnect() {}
  start(when = 0, offset = 0) {
    this.started.push(when + offset * 0); // record the call; offset validity checked separately
    this.lastOffset = offset;
  }
  lastOffset = 0;
  stop(when = 0) {
    this.stopped.push(when);
  }
}

class FakeContext {
  currentTime = 0;
  sampleRate = 8000;
  state = 'running';
  destination = new FakeNode('destination');
  nodes: FakeNode[] = [];
  listener = {
    positionX: new FakeParam(),
    positionY: new FakeParam(),
    positionZ: new FakeParam(),
    forwardX: new FakeParam(),
    forwardY: new FakeParam(),
    forwardZ: new FakeParam(),
    upX: new FakeParam(),
    upY: new FakeParam(),
    upZ: new FakeParam(),
  };
  private make(kind: string) {
    const node = new FakeNode(kind);
    this.nodes.push(node);
    return node;
  }
  createGain() {
    return this.make('gain');
  }
  createOscillator() {
    return this.make('osc');
  }
  createBufferSource() {
    return this.make('source');
  }
  createBiquadFilter() {
    return this.make('filter');
  }
  createPanner() {
    return this.make('panner');
  }
  createDynamicsCompressor() {
    return this.make('compressor');
  }
  createAnalyser() {
    return this.make('analyser');
  }
  createBuffer(_channels: number, length: number, rate: number) {
    const data = new Float32Array(length);
    return { duration: length / rate, getChannelData: () => data };
  }
  of(kind: string) {
    return this.nodes.filter((n) => n.kind === kind);
  }
}

const board = () => {
  const ctx = new FakeContext();
  return { ctx, sounds: new Soundboard({ context: ctx as unknown as BaseAudioContext, seed: 3 }) };
};

describe('Soundboard', () => {
  it('renders a one-shot: sources started, stopped, envelopes scheduled from zero', () => {
    const { ctx, sounds } = board();
    sounds.footstep('wood');
    const sources = [...ctx.of('osc'), ...ctx.of('source')];
    expect(sources.length).toBeGreaterThan(0);
    for (const source of sources) {
      expect(source.started.length).toBe(1);
      expect(source.stopped.length).toBe(1);
      expect(source.stopped[0]).toBeGreaterThan(source.started[0]);
    }
    // Some gain node carries the envelope, and it begins at silence.
    const envelopes = ctx.of('gain').filter((g) => g.gain.events.length > 1);
    expect(envelopes.length).toBeGreaterThan(0);
    expect(envelopes[0].gain.events[0]).toEqual(['set', 0, expect.any(Number)]);
  });

  it('a positional sound routes through a panner; a plain one does not', () => {
    const { ctx, sounds } = board();
    sounds.coin();
    expect(ctx.of('panner').length).toBe(0);
    sounds.coin({ at: { x: 3, y: 1, z: -2 } });
    const [panner] = ctx.of('panner');
    expect(panner).toBeDefined();
    expect(panner.positionX.value).toBe(3);
    expect(panner.positionZ.value).toBe(-2);
  });

  it('captions: every sound reports itself, and can be silenced', () => {
    const { sounds } = board();
    const heard: string[] = [];
    const off = sounds.onCaption((c) => heard.push(c.text));
    sounds.coin();
    sounds.crack(0.9, { at: { x: 1, y: 0, z: 0 } });
    sounds.splash(0.5, { caption: false });
    sounds.footstep('grass', { caption: 'soft steps' });
    expect(heard).toEqual(['coin', 'sharp crack', 'soft steps']);
    expect(last(sounds.captions()).text).toBe('soft steps');
    expect(sounds.captions().find((c) => c.text === 'sharp crack')?.at).toEqual({ x: 1, y: 0, z: 0 });
    off();
    sounds.coin();
    expect(heard.length).toBe(3);
  });

  it('ducking pulls the ambient bus down and schedules its way back', () => {
    const { ctx, sounds } = board();
    sounds.duck('ambient', 0.25, 1);
    const busGains = ctx.of('gain');
    const ducked = busGains.find((g) => g.gain.events.some(([kind]) => kind === 'cancel'));
    expect(ducked).toBeDefined();
    const ramps = ducked!.gain.events.filter(([kind]) => kind === 'linear');
    expect(ramps[0][1]).toBeCloseTo(0.25);
    expect(last(ramps)[1]).toBe(1); // returns to the bus base volume
  });

  it('the engine follows rpm with ramps, and stop() actually stops it', () => {
    const { ctx, sounds } = board();
    const engine = sounds.createEngine();
    engine.set(3000, 1);
    const oscs = ctx.of('osc');
    expect(oscs.length).toBe(3);
    // 3000 rpm → 100 Hz firing frequency on the first oscillator.
    const firing = last(oscs[0].frequency.events.filter(([kind]) => kind === 'target'));
    expect(firing[1]).toBeCloseTo(100, 5);
    expect(engine.rpm).toBe(3000);
    engine.stop();
    for (const osc of oscs) expect(osc.stopped.length).toBe(1);
    engine.set(5000); // after stop: ignored, no throw
  });

  it('weather beds move their whole voice from one set() call', () => {
    const { ctx, sounds } = board();
    const wind = sounds.createWind();
    wind.set(1);
    const filter = ctx.of('filter')[0];
    const cutoff = last(filter.frequency.events.filter(([kind]) => kind === 'target'));
    expect(cutoff[1]).toBeCloseTo(windVoicing(1).cutoff);
    const rain = sounds.createRain();
    rain.set(0.9);
    expect(sounds.captions().map((c) => c.text)).toContain('rain');
  });

  it('the crowd swells and tells the caption feed it roared', () => {
    const { sounds } = board();
    const crowd = sounds.createCrowd();
    const heard = vi.fn();
    sounds.onCaption(heard);
    crowd.swell(1, 2);
    expect(heard).toHaveBeenCalledWith(expect.objectContaining({ text: 'crowd roars' }));
  });

  it('updateListener moves the ears structurally — plain {x,y,z} in', () => {
    const { ctx, sounds } = board();
    sounds.coin(); // force the graph up
    sounds.updateListener({ x: 5, y: 2, z: 8 }, { x: 0, y: 0, z: 1 });
    expect(ctx.listener.positionX.value).toBe(5);
    expect(ctx.listener.forwardZ.value).toBe(1);
  });

  it('createAnalyser taps the finished mix, after the compressor', () => {
    const { ctx, sounds } = board();
    const analyser = sounds.createAnalyser(64) as unknown as FakeNode;
    expect(analyser.kind).toBe('analyser');
    expect(ctx.of('compressor')[0].connections).toContain(analyser);
  });

  it('dispose stops every live handle', () => {
    const { ctx, sounds } = board();
    sounds.createEngine();
    sounds.createWind();
    sounds.dispose();
    const sources = [...ctx.of('osc'), ...ctx.of('source')];
    for (const source of sources) expect(source.stopped.length).toBe(1);
  });

  it('same seed, same call sequence, same scheduled graph', () => {
    const trace = () => {
      const { ctx, sounds } = board();
      sounds.footstep('stone');
      sounds.coin();
      sounds.impact('metal', 0.8);
      return ctx.nodes.map((n) => [
        n.kind,
        n.frequency.events,
        n.gain.events,
        n.lastOffset,
      ]);
    };
    expect(trace()).toEqual(trace());
  });
});
