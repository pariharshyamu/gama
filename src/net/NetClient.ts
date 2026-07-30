import {
  NET_PROTOCOL,
  blendAngle,
  jsonCodec,
  type Codec,
  type NetApply,
  type NetState,
  type ServerMessage,
} from './protocol';
import type { Transport } from './transport';

/**
 * NetClient — prediction, reconciliation, interpolation.
 *
 * The server is the authority, so every snapshot arrives already out of
 * date by half the round trip. Doing nothing about that gives you a game
 * where pressing a key does nothing for 80 ms and everybody else teleports
 * fifteen times a second. Three mechanisms fix it, and this class is those
 * three mechanisms:
 *
 * **Prediction.** Your own entity runs the same `apply` the server runs, the
 * moment you press the key. No waiting.
 *
 * **Reconciliation.** A snapshot says where you *actually* were at input
 * number N. Your position is reset to that, and every input after N is
 * replayed on top. If your prediction was right, nothing moves — which is
 * the normal case, and why prediction is worth doing at all.
 *
 * **Interpolation.** Everybody else is rendered slightly in the past —
 * `interpolationDelay` behind server time — so there are always two
 * snapshots to blend between. Rendering the newest snapshot directly is
 * what makes other players stutter.
 *
 * ```ts
 * const client = new NetClient(transport, { apply: move });
 * loop((dt) => {
 *   client.setInput({ x: axis.x, z: axis.z });
 *   client.update(dt);
 *   for (const e of client.entities) draw(e);   // mine predicted, others smooth
 * });
 * ```
 */

export interface NetClientOptions<I = unknown> {
  /** The same function the server runs. That is the trick. */
  apply: NetApply<I>;
  /** Run my own entity ahead of the server. Default true. */
  predict?: boolean;
  /** Render everyone else in the past, so there is something to blend. Default true. */
  interpolate?: boolean;
  /** How far in the past, in ms. Default 100 — about two send intervals. */
  interpolationDelay?: number;
  /**
   * What to do when a prediction was wrong. `'smooth'` keeps the error as a
   * decaying offset so the correction is a drift rather than a teleport;
   * `'snap'` is honest and ugly, and useful for seeing when it happens.
   * Default `'smooth'`.
   */
  correction?: 'smooth' | 'snap';
  /** Error decay per second for `'smooth'`. Default 12. */
  smoothing?: number;
  /** Fields that are angles, blended the short way round. */
  angleFields?: string[];
  /** Inputs per second. Default: whatever the server says. */
  tickRate?: number;
  /** Seconds between pings. Default 1. */
  pingInterval?: number;
  /**
   * How many inputs the server should have buffered. Default 2.
   *
   * The client steers its own send rate to hold the server's queue near
   * this. Zero is not the goal: a server that runs dry has to guess, and
   * every guess is a misprediction the client then has to correct. Higher
   * is steadier and adds input lag, so this is the dial between "responsive"
   * and "smooth".
   */
  bufferTarget?: number;
  /**
   * A clock for round-trip timing, in seconds. Defaults to the accumulated
   * `update` time, which cannot resolve better than one frame — pass
   * `() => performance.now() / 1000` for a real measurement.
   */
  now?: () => number;
  codec?: Codec;
  name?: string;
}

/** One entity, as the game should draw it right now. */
export interface NetView {
  id: string;
  owner?: string;
  state: NetState;
  meta?: Record<string, unknown>;
  /** True for the entity this client drives — the predicted one. */
  mine: boolean;
}

interface Sample {
  time: number;
  state: NetState;
}

export class NetClient<I = unknown> {
  /** Assigned by the server's `welcome`. Empty until then. */
  id = '';
  ready = false;
  /** Round-trip time in ms. */
  rtt = 0;
  /** Estimated server time in seconds, smoothed. */
  serverTime = 0;
  /** How many inputs are waiting for an ack. High means a slow link. */
  get pending(): number {
    return this.queue.length;
  }
  /** Set true when the server says goodbye, or the socket closes. */
  closed = false;

  onEvent: ((name: string, data: unknown) => void) | null = null;
  onWelcome: ((id: string) => void) | null = null;
  onClose: ((why: string) => void) | null = null;

  predict: boolean;
  interpolate: boolean;
  interpolationDelay: number;
  correction: 'smooth' | 'snap';
  smoothing: number;

  /** Corrections applied — a jump in this is a prediction that was wrong. */
  corrections = 0;
  /** Bytes received, so a demo can show what the link costs. */
  bytesIn = 0;
  /** Handshake attempts beyond the first — a lossy link shows up here. */
  joins = 0;
  /**
   * The server's input queue depth for this client, as last reported.
   *
   * The number the send rate is steering. 0 means the server ran dry and
   * guessed; a climbing number means inputs are piling up as pure lag.
   */
  serverQueue = 0;
  /** Current send-rate multiplier, 0.85…1.15. Diagnostic. */
  rateScale = 1;

  private readonly transport: Transport;
  private readonly apply: NetApply<I>;
  private readonly codec: Codec;
  private readonly angleFields: Set<string>;
  private readonly pingInterval: number;
  private readonly bufferTarget: number;
  private readonly clock: (() => number) | null;

  private tickRate: number;
  private accumulator = 0;
  private pingAccumulator = 0;
  private joinAccumulator = 0;
  private readonly joinMessage: string;
  private localTime = 0;
  private sequence = 0;
  private input: I | null = null;

  private readonly queue: Array<{ s: number; dt: number; d: I }> = [];
  /** The server's last word on each entity. */
  private readonly authoritative = new Map<string, NetState>();
  private readonly owners = new Map<string, string>();
  private readonly metas = new Map<string, Record<string, unknown>>();
  /** Snapshot history for interpolation. */
  private readonly history = new Map<string, Sample[]>();
  /** My own predicted state, and the decaying error from the last correction. */
  private predicted: NetState | null = null;
  private error: NetState = {};
  private lastTick = -1;

  constructor(transport: Transport, options: NetClientOptions<I>) {
    this.transport = transport;
    this.apply = options.apply;
    this.codec = options.codec ?? jsonCodec;
    this.predict = options.predict ?? true;
    this.interpolate = options.interpolate ?? true;
    this.interpolationDelay = options.interpolationDelay ?? 100;
    this.correction = options.correction ?? 'smooth';
    this.smoothing = options.smoothing ?? 12;
    this.angleFields = new Set(options.angleFields ?? []);
    this.tickRate = options.tickRate ?? 30;
    this.pingInterval = options.pingInterval ?? 1;
    this.bufferTarget = options.bufferTarget ?? 2;
    this.clock = options.now ?? null;

    transport.onMessage = (data) => this.receive(data);
    transport.onClose = () => {
      this.closed = true;
      this.onClose?.('transport closed');
    };
    this.joinMessage = this.codec.encode({ t: 'join', v: NET_PROTOCOL, name: options.name });
    transport.send(this.joinMessage);
  }

  /** The intent for this frame. Sampled once per network tick. */
  setInput(input: I): void {
    this.input = input;
  }

  // ---- the loop ----------------------------------------------------------

  update(dt: number): void {
    this.localTime += dt;

    // Retry the handshake until welcomed. Found by a packet-loss test: one
    // dropped join and the client sat there forever, having sent exactly one
    // packet and received nothing. Every other message in the protocol is
    // disposable; this one is not.
    if (!this.ready && !this.closed) {
      this.joinAccumulator += dt;
      if (this.joinAccumulator >= 0.4) {
        this.joinAccumulator = 0;
        this.joins += 1;
        this.transport.send(this.joinMessage);
      }
    }
    // The server's clock, nudged rather than jumped: a snapshot that arrives
    // early would otherwise rewind interpolation and stutter everything.
    this.serverTime += dt;

    if (this.ready && this.input !== null) {
      // The step SENT is always the server's, so replaying an input covers
      // exactly the time the server will charge it for. What the rate scale
      // changes is how often one goes out, which is what fills or drains the
      // server's buffer.
      const step = 1 / this.tickRate;
      this.accumulator += dt * this.rateScale;
      if (this.accumulator > step * 5) this.accumulator = step * 5;
      while (this.accumulator >= step) {
        this.accumulator -= step;
        this.emit(step);
      }
    }

    this.pingAccumulator += dt;
    if (this.ready && this.pingAccumulator >= this.pingInterval) {
      this.pingAccumulator = 0;
      this.transport.send(this.codec.encode({ t: 'ping', c: this.stamp() }));
    }

    // Decay the correction offset. Nothing else touches `error`, so a
    // prediction that was right leaves this at zero and costs nothing.
    if (this.correction === 'smooth') {
      const keep = Math.exp(-this.smoothing * dt);
      let live = false;
      for (const key of Object.keys(this.error)) {
        const value = this.error[key] * keep;
        if (Math.abs(value) < 1e-4) delete this.error[key];
        else {
          this.error[key] = value;
          live = true;
        }
      }
      void live;
    }
  }

  /** One network tick: stamp the input, send it, predict with it. */
  private emit(dt: number): void {
    if (this.input === null) return;
    this.sequence += 1;
    const entry = { s: this.sequence, dt, d: this.input };
    this.queue.push(entry);
    // Anything older than a second of inputs is never going to be acked.
    while (this.queue.length > this.tickRate * 2) this.queue.shift();

    this.transport.send(this.codec.encode({ t: 'in', s: entry.s, dt, d: entry.d }));

    if (this.predict && this.predicted) {
      this.apply(this.predicted, entry.d, dt, { id: this.id, owner: this.id });
    }
  }

  // ---- the wire ----------------------------------------------------------

  private receive(data: string): void {
    this.bytesIn += data.length;
    let message: ServerMessage;
    try {
      message = this.codec.decode(data) as ServerMessage;
    } catch {
      return;
    }
    if (!message || typeof message !== 'object') return;

    if (message.t === 'welcome') {
      this.id = message.id;
      this.tickRate = message.tickRate;
      this.ready = true;
      // PRIME the server's input buffer instead of waiting for the rate
      // steering to fill it.
      //
      // The steering below has deliberately small authority (±15%), because
      // its job is correcting clock drift, not cold-starting. From an empty
      // buffer that means about a second to reach `bufferTarget` — and for
      // that whole second one late input makes the server run dry, repeat,
      // and cost a correction. Measured over a real socket: roughly one run
      // in eight took exactly one misprediction, on BOTH clients at once,
      // which is what pointed at the server's buffer rather than either
      // client's prediction.
      //
      // Seeding the accumulator makes the first `update` emit the target's
      // worth of inputs at once. That is not cheating: each carries its own
      // `dt` of one server step and is predicted locally, so the client
      // simply starts `bufferTarget` steps ahead of the server, which is
      // precisely what having a buffer means.
      this.accumulator = this.bufferTarget / this.tickRate;
      this.onWelcome?.(message.id);
      return;
    }
    if (message.t === 'pong') {
      this.rtt = Math.max(0, (this.stamp() - message.c) * 1000);
      // The server's time when it replied, plus the trip home.
      const estimate = message.s + this.rtt / 2000;
      this.reconcileClock(estimate);
      return;
    }
    if (message.t === 'ev') {
      this.onEvent?.(message.name, message.d);
      return;
    }
    if (message.t === 'bye') {
      this.closed = true;
      this.onClose?.(message.why);
      return;
    }
    if (message.t !== 'snap') return;

    // Out of order is normal with jitter, and applying an old snapshot after
    // a new one drags everything backwards.
    if (message.k <= this.lastTick) return;
    this.lastTick = message.k;
    this.reconcileClock(message.time);

    // Steer the send rate to keep the server's buffer near the target.
    //
    // Without this the two clocks drift — a browser's frame loop is not
    // exactly 30 Hz — the server periodically runs dry, covers the gap by
    // repeating the last input, and the client mispredicts every time it
    // happens. Measured against the reference server over a real socket:
    // one correction per client per few seconds, from nothing but drift.
    if (typeof message.q === 'number') {
      this.serverQueue = message.q;
      const error = this.bufferTarget - message.q;
      const wanted = 1 + Math.max(-1, Math.min(1, error / 4)) * 0.15;
      this.rateScale += (wanted - this.rateScale) * 0.25;
    }

    // The ack is processed for EVERY snapshot, not only the ones that happen
    // to mention my entity.
    //
    // Deltas only carry what changed, so a player standing still vanishes
    // from them — and the first version drained the input queue inside
    // reconciliation, which then never ran. Measured against the reference
    // server: twenty-four unacknowledged inputs after one second of standing
    // still, which is 800 ms of phantom input lag and twenty-four inputs
    // replayed on top of every correction.
    while (this.queue.length && this.queue[0].s <= message.ack) this.queue.shift();

    for (const entity of message.e) {
      const previous = this.authoritative.get(entity.id);
      const merged: NetState = { ...previous, ...entity.state };
      this.authoritative.set(entity.id, merged);
      if (entity.owner) this.owners.set(entity.id, entity.owner);
      if (entity.meta) this.metas.set(entity.id, entity.meta);

      if (this.owners.get(entity.id) === this.id) {
        this.reconcile(entity.id, merged);
      } else {
        const samples = this.history.get(entity.id) ?? [];
        samples.push({ time: message.time, state: merged });
        // Two seconds of history is far more than any sane interpolation
        // delay needs, and unbounded history is a leak with a nice name.
        while (samples.length > 64) samples.shift();
        this.history.set(entity.id, samples);
      }
    }

    for (const id of message.gone ?? []) {
      this.authoritative.delete(id);
      this.owners.delete(id);
      this.metas.delete(id);
      this.history.delete(id);
      if (this.owners.get(id) === this.id) this.predicted = null;
    }
  }

  /**
   * The clock ping/pong is timed against.
   *
   * The accumulated `update` time by default — deterministic, and what the
   * tests need — but it cannot resolve better than one frame, so on a fast
   * link it reads 0. Pass `now: () => performance.now() / 1000` when the
   * number is for a human to look at.
   */
  private stamp(): number {
    return this.clock ? this.clock() : this.localTime;
  }

  /** Nudge the clock; teleport only if it is hopelessly out. */
  private reconcileClock(estimate: number): void {
    if (this.serverTime === 0 || Math.abs(estimate - this.serverTime) > 0.5) {
      this.serverTime = estimate;
    } else {
      this.serverTime += (estimate - this.serverTime) * 0.1;
    }
  }

  /**
   * Reset to the server's word, then replay everything it has not seen yet.
   *
   * The error is measured AFTER replaying, not before: the question is not
   * "was the server where I thought", it is "where do I end up now versus
   * where I was drawing myself", and those differ by exactly the inputs the
   * server had not processed.
   */
  private reconcile(id: string, authoritative: NetState): void {
    const before = this.predicted ? { ...this.predicted } : null;
    const replayed: NetState = { ...authoritative };
    if (this.predict) {
      for (const entry of this.queue) {
        this.apply(replayed, entry.d, entry.dt, { id, owner: this.id });
      }
    }

    // With prediction off there is nothing to be wrong: every snapshot
    // differs from the last, and counting those as corrections turns a
    // useful diagnostic into a frame counter.
    if (!this.predict) {
      this.predicted = replayed;
      this.error = {};
      return;
    }

    if (before && this.correction === 'smooth') {
      let wrong = false;
      for (const key of Object.keys(replayed)) {
        const delta = (before[key] ?? replayed[key]) - replayed[key];
        if (Math.abs(delta) > 1e-4) {
          this.error[key] = (this.error[key] ?? 0) + delta;
          wrong = true;
        }
      }
      if (wrong) this.corrections += 1;
    } else if (before) {
      for (const key of Object.keys(replayed)) {
        if (Math.abs((before[key] ?? replayed[key]) - replayed[key]) > 1e-4) {
          this.corrections += 1;
          break;
        }
      }
      this.error = {};
    }

    this.predicted = replayed;
  }

  // ---- what to draw ------------------------------------------------------

  /** My entity, as it should be drawn. Null before the first snapshot. */
  get me(): NetState | null {
    if (!this.predicted) return null;
    if (this.correction !== 'smooth' || !Object.keys(this.error).length) {
      return { ...this.predicted };
    }
    const out: NetState = { ...this.predicted };
    for (const key of Object.keys(this.error)) out[key] += this.error[key];
    return out;
  }

  /** Everything, as it should be drawn right now. */
  get entities(): NetView[] {
    const out: NetView[] = [];
    const renderTime = this.serverTime - this.interpolationDelay / 1000;

    for (const [id, authoritative] of this.authoritative) {
      const owner = this.owners.get(id);
      const mine = owner === this.id;
      let state: NetState;
      if (mine && this.predict) {
        state = this.me ?? { ...authoritative };
      } else if (this.interpolate) {
        state = this.sampleAt(id, renderTime) ?? { ...authoritative };
      } else {
        state = { ...authoritative };
      }
      out.push({ id, owner, state, meta: this.metas.get(id), mine });
    }
    return out;
  }

  /** The blend of the two snapshots bracketing `time`. */
  private sampleAt(id: string, time: number): NetState | null {
    const samples = this.history.get(id);
    if (!samples || !samples.length) return null;
    if (time <= samples[0].time) return { ...samples[0].state };

    for (let i = samples.length - 1; i >= 0; i--) {
      if (samples[i].time <= time) {
        const from = samples[i];
        const to = samples[i + 1];
        // Past the newest sample: hold, do not extrapolate. A guess that
        // overshoots and snaps back reads worse than a body that pauses.
        if (!to) return { ...from.state };
        const span = to.time - from.time;
        const t = span > 1e-6 ? Math.min(1, Math.max(0, (time - from.time) / span)) : 1;
        const out: NetState = { ...from.state };
        for (const key of Object.keys(to.state)) {
          const a = from.state[key];
          const b = to.state[key];
          if (typeof a !== 'number') out[key] = b;
          else out[key] = this.angleFields.has(key) ? blendAngle(a, b, t) : a + (b - a) * t;
        }
        return out;
      }
    }
    return { ...samples[0].state };
  }

  /** How far behind server time this client is drawing, in ms. */
  get lag(): number {
    return this.interpolate ? this.interpolationDelay : 0;
  }

  dispose(): void {
    this.transport.close();
  }
}
