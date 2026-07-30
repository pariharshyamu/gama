/**
 * Transports.
 *
 * A `Transport` is four members. Everything above it — prediction,
 * reconciliation, interpolation, delta snapshots — is written against this
 * and nothing else, which is what makes the netcode testable at all: the
 * tests run a whole authoritative server and two clients with scriptable
 * latency and packet loss, in one process, with no sockets and no timers.
 *
 * It is also what makes a multiplayer demo possible on a static site.
 * `LoopbackTransport` runs the server in the same tab;
 * `BroadcastChannelTransport` gives real cross-tab play with no server at
 * all; `WebSocketTransport` is for when there is one.
 */

export interface Transport {
  send(data: string): void;
  onMessage: ((data: string) => void) | null;
  onClose: (() => void) | null;
  close(): void;
  readonly open: boolean;
}

export interface LinkConditions {
  /** One-way delay in milliseconds. RTT is twice this. */
  latency?: number;
  /** Random extra delay, 0…jitter, per packet. */
  jitter?: number;
  /** Fraction of packets dropped, 0…1. */
  loss?: number;
  /** For reproducible loss. Default 1. */
  seed?: number;
}

interface Parcel {
  at: number;
  /** null means "the peer hung up" — a close, ordered behind its data. */
  data: string | null;
  to: LoopbackTransport;
}

/**
 * A pair of transports wired to each other, with a simulated link.
 *
 * Time is **passed in**, not read from a clock: `advance(dt)` delivers
 * whatever has arrived. That is the difference between a test that asserts
 * reconciliation converges and a test that sleeps 200 ms and hopes.
 *
 * ```ts
 * const link = new Link({ latency: 80, loss: 0.05 });
 * server.accept(link.server);
 * const client = new NetClient(link.client, { apply });
 * // …then, every frame:
 * link.advance(dt); server.update(dt); client.update(dt);
 * ```
 */
export class Link {
  readonly server: LoopbackTransport;
  readonly client: LoopbackTransport;

  latency: number;
  jitter: number;
  loss: number;

  private now = 0;
  private queue: Parcel[] = [];
  private seed: number;
  /** Counted so a demo can show what the link is doing. */
  sent = 0;
  dropped = 0;
  bytes = 0;

  constructor(conditions: LinkConditions = {}) {
    this.latency = conditions.latency ?? 0;
    this.jitter = conditions.jitter ?? 0;
    this.loss = conditions.loss ?? 0;
    this.seed = (conditions.seed ?? 1) >>> 0 || 1;
    this.server = new LoopbackTransport(this);
    this.client = new LoopbackTransport(this);
    this.server.peer = this.client;
    this.client.peer = this.server;
  }

  private random(): number {
    // xorshift: small, seeded, and identical run to run — a flaky network
    // test is worse than no network test.
    let x = this.seed;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.seed = x >>> 0 || 1;
    return this.seed / 4294967296;
  }

  /**
   * A hang-up, queued behind whatever was already sent.
   *
   * A real socket flushes a frame before it closes, so a server that says
   * goodbye and then disconnects is heard. Closing the peer synchronously
   * ate the goodbye — found by a test asserting the kick reason.
   */
  hangUp(to: LoopbackTransport): void {
    this.queue.push({ at: this.now + this.latency / 1000, data: null, to });
  }

  /** Called by a transport's `send`. */
  post(to: LoopbackTransport, data: string): void {
    this.sent += 1;
    this.bytes += data.length;
    if (this.loss > 0 && this.random() < this.loss) {
      this.dropped += 1;
      return;
    }
    const delay = this.latency + (this.jitter > 0 ? this.random() * this.jitter : 0);
    this.queue.push({ at: this.now + delay / 1000, data, to });
  }

  /** Advance the link by `dt` seconds and deliver what has arrived. */
  advance(dt: number): void {
    this.now += dt;
    if (!this.queue.length) return;
    // Sorted by arrival, so jitter reorders packets exactly the way a real
    // link does — which is the point of having jitter at all.
    const due = this.queue.filter((p) => p.at <= this.now).sort((a, b) => a.at - b.at);
    if (!due.length) return;
    this.queue = this.queue.filter((p) => p.at > this.now);
    for (const parcel of due) {
      if (parcel.data === null) parcel.to.hangUp();
      else parcel.to.deliver(parcel.data);
    }
  }

  /** Deliver everything still in flight — for ending a test cleanly. */
  flush(): void {
    this.advance(this.latency / 1000 + this.jitter / 1000 + 1e-6);
  }

  get inFlight(): number {
    return this.queue.length;
  }
}

export class LoopbackTransport implements Transport {
  onMessage: ((data: string) => void) | null = null;
  onClose: (() => void) | null = null;
  peer: LoopbackTransport | null = null;
  private closed = false;

  constructor(private readonly link: Link) {}

  get open(): boolean {
    return !this.closed;
  }

  send(data: string): void {
    if (this.closed || !this.peer) return;
    this.link.post(this.peer, data);
  }

  /** @internal */
  deliver(data: string): void {
    if (!this.closed) this.onMessage?.(data);
  }

  close(): void {
    if (this.closed) return;
    this.closed = true;
    this.onClose?.();
    // The peer learns about it over the link, after anything already in
    // flight — not instantly.
    if (this.peer?.open) this.link.hangUp(this.peer);
  }

  /** @internal — the peer hung up. */
  hangUp(): void {
    if (this.closed) return;
    this.closed = true;
    this.onClose?.();
  }
}

/** A real socket, for when there is a server. */
export class WebSocketTransport implements Transport {
  onMessage: ((data: string) => void) | null = null;
  onClose: (() => void) | null = null;
  /** Resolves when the socket is usable, rejects if it never opens. */
  readonly ready: Promise<void>;

  private readonly socket: WebSocket;
  /**
   * Anything sent before the socket opens, held rather than thrown away —
   * a `join` lost to a race is a client that never appears, and it happens
   * on exactly the connections that are slow enough to matter.
   */
  private pending: string[] = [];

  constructor(url: string | WebSocket) {
    this.socket = typeof url === 'string' ? new WebSocket(url) : url;
    this.ready = new Promise((resolve, reject) => {
      if (this.socket.readyState === 1) return resolve();
      this.socket.addEventListener('open', () => {
        for (const data of this.pending) this.socket.send(data);
        this.pending = [];
        resolve();
      });
      this.socket.addEventListener('error', () => reject(new Error(`WebSocket failed: ${String(url)}`)));
    });
    this.socket.addEventListener('message', (event) => {
      const data = (event as MessageEvent).data;
      this.onMessage?.(typeof data === 'string' ? data : String(data));
    });
    this.socket.addEventListener('close', () => this.onClose?.());
  }

  get open(): boolean {
    return this.socket.readyState === 0 || this.socket.readyState === 1;
  }

  send(data: string): void {
    if (this.socket.readyState === 1) this.socket.send(data);
    else if (this.socket.readyState === 0) this.pending.push(data);
  }

  close(): void {
    this.socket.close();
  }
}

/**
 * Two tabs of the same origin, no server.
 *
 * Genuinely useful and genuinely limited: it is peer-to-peer between tabs
 * on one machine, so one tab has to volunteer to be authoritative. Good for
 * a demo on a static site, a local split-screen, or testing netcode without
 * standing anything up; not a way to ship multiplayer.
 */
export class BroadcastChannelTransport implements Transport {
  onMessage: ((data: string) => void) | null = null;
  onClose: (() => void) | null = null;

  private readonly channel: BroadcastChannel;
  private closed = false;

  constructor(name: string, private readonly address: string) {
    this.channel = new BroadcastChannel(name);
    this.channel.addEventListener('message', (event) => {
      const parcel = (event as MessageEvent).data as { to: string; data: string };
      // A channel is a broadcast, so every transport hears its own peers'
      // traffic AND everybody else's. Addressing is what makes it a link.
      if (parcel && parcel.to === this.address) this.onMessage?.(parcel.data);
    });
  }

  get open(): boolean {
    return !this.closed;
  }

  /** Where replies should be addressed. */
  get peerAddress(): string {
    return this.address;
  }

  send(data: string): void {
    if (!this.closed) this.channel.postMessage({ to: this.reply, data });
  }

  /** Set by whoever paired the two ends. */
  reply = '';

  close(): void {
    if (this.closed) return;
    this.closed = true;
    this.channel.close();
    this.onClose?.();
  }
}
