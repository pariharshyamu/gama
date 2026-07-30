import {
  NET_PROTOCOL,
  diffState,
  jsonCodec,
  type ClientMessage,
  type Codec,
  type NetApply,
  type NetEntitySnapshot,
  type NetState,
  type ServerMessage,
} from './protocol';
import type { Transport } from './transport';

/**
 * NetServer — the authority.
 *
 * It owns every entity, it is the only thing that runs the rules, and it
 * tells clients what happened. Clients send *intent* and never state, which
 * is the one architectural decision that separates a game you can play from
 * a game where whoever edits their bundle wins.
 *
 * ```ts
 * const server = new NetServer({ apply: move, tickRate: 30, sendRate: 15 });
 * server.onJoin = (client) => server.spawn(client.id, { x: 0, z: 0, yaw: 0 }, { owner: client.id });
 * server.accept(transport);          // per connection
 * loop(dt => server.update(dt));
 * ```
 *
 * Three things it does that a naive broadcast loop does not:
 *
 * **One input per tick, per client.** Jitter delivers inputs in bursts, and
 * a server that applies everything queued lets a laggy client move three
 * times in one step — a speed hack you get for free by having a bad
 * connection. Surplus inputs wait; a client that floods has its queue
 * trimmed rather than the server's clock stretched.
 *
 * **A missing input repeats the last one, briefly.** A dropped packet with
 * a key held down should not read as "let go", and freezing for one tick is
 * visible. Repeats are capped, so a client that actually left stops moving.
 *
 * **Snapshots are per-client deltas.** Each connection has its own record of
 * what it was last told, so a client that just joined gets everything and a
 * client mid-game gets what changed. Broadcasting the same full snapshot to
 * everybody is the easy version and it is what stops scaling first.
 */

export interface NetConnection {
  readonly id: string;
  readonly transport: Transport;
  /** Whatever the game wants to hang off a connection: name, team, score. */
  data: Record<string, unknown>;
  /** Round-trip time in ms, from this client's pings. 0 until one lands. */
  readonly rtt: number;
  /** Inputs waiting to be applied. Large means this client is behind. */
  readonly queued: number;
  send(message: ServerMessage): void;
  kick(why?: string): void;
}

export interface NetServerOptions<I = unknown> {
  apply: NetApply<I>;
  /** Simulation steps per second. Default 30. */
  tickRate?: number;
  /** Snapshots per second. Default 15 — half the tick rate is plenty. */
  sendRate?: number;
  codec?: Codec;
  /** Inputs held per client before the oldest are dropped. Default 8. */
  maxQueue?: number;
  /** Ticks a missing input may be covered by repeating the last. Default 4. */
  maxRepeat?: number;
}

interface Connection extends NetConnection {
  inputs: Array<{ s: number; dt: number; d: unknown }>;
  lastInput: { dt: number; d: unknown } | null;
  repeats: number;
  ack: number;
  rtt: number;
  /** What this client was last told, per entity. */
  sent: Map<string, NetState>;
  known: Set<string>;
  alive: boolean;
  joined: boolean;
}

interface Entity {
  id: string;
  owner?: string;
  state: NetState;
  meta?: Record<string, unknown>;
  /** Bumped when meta changes, so a delta knows to resend it. */
  metaVersion: number;
  sentMeta: Map<string, number>;
}

export class NetServer<I = unknown> {
  /** Called when a client has joined. Spawn its entity here. */
  onJoin: ((client: NetConnection, server: NetServer<I>) => void) | null = null;
  onLeave: ((client: NetConnection, server: NetServer<I>) => void) | null = null;

  readonly tickRate: number;
  readonly sendRate: number;
  /** Ticks simulated since the server started. */
  tick = 0;
  /** Server time in seconds — what clients interpolate against. */
  time = 0;

  private readonly apply: NetApply<I>;
  private readonly codec: Codec;
  private readonly maxQueue: number;
  private readonly maxRepeat: number;
  private readonly entities = new Map<string, Entity>();
  private readonly connections = new Map<string, Connection>();
  private accumulator = 0;
  private sendAccumulator = 0;
  private nextId = 1;

  constructor(options: NetServerOptions<I>) {
    this.apply = options.apply;
    this.tickRate = options.tickRate ?? 30;
    this.sendRate = options.sendRate ?? 15;
    this.codec = options.codec ?? jsonCodec;
    this.maxQueue = options.maxQueue ?? 8;
    this.maxRepeat = options.maxRepeat ?? 4;
  }

  // ---- connections -------------------------------------------------------

  get clients(): NetConnection[] {
    return [...this.connections.values()];
  }

  client(id: string): NetConnection | undefined {
    return this.connections.get(id);
  }

  /** Take a new connection. The client says `join`; this replies `welcome`. */
  accept(transport: Transport, id = `p${this.nextId++}`): NetConnection {
    const connection: Connection = {
      id,
      transport,
      data: {},
      inputs: [],
      lastInput: null,
      repeats: 0,
      ack: 0,
      rtt: 0,
      sent: new Map(),
      known: new Set(),
      alive: true,
      joined: false,
      get queued() {
        return connection.inputs.length;
      },
      send: (message) => {
        if (connection.alive && transport.open) transport.send(this.codec.encode(message));
      },
      kick: (why = 'kicked') => {
        connection.send({ t: 'bye', why });
        transport.close();
        this.drop(connection);
      },
    };

    transport.onMessage = (data) => this.receive(connection, data);
    transport.onClose = () => this.drop(connection);
    this.connections.set(id, connection);
    return connection;
  }

  private drop(connection: Connection): void {
    if (!connection.alive) return;
    connection.alive = false;
    this.connections.delete(connection.id);
    this.onLeave?.(connection, this);
    // Anything this client owned goes with it, or the world fills up with
    // motionless bodies that nobody is driving.
    for (const entity of [...this.entities.values()]) {
      if (entity.owner === connection.id) this.despawn(entity.id);
    }
  }

  private receive(connection: Connection, data: string): void {
    let message: ClientMessage;
    try {
      message = this.codec.decode(data) as ClientMessage;
    } catch {
      return; // garbage from a client is not the server's problem to crash on
    }
    if (!message || typeof message !== 'object') return;

    if (message.t === 'join') {
      if (message.v !== NET_PROTOCOL) {
        connection.kick(`protocol ${String(message.v)}, server speaks ${NET_PROTOCOL}`);
        return;
      }
      if (typeof message.name === 'string') connection.data.name = message.name;
      connection.send({
        t: 'welcome',
        v: NET_PROTOCOL,
        id: connection.id,
        tickRate: this.tickRate,
        sendRate: this.sendRate,
      });
      // A client retries `join` until it is welcomed, so a repeat means its
      // first attempt (or our first welcome) was lost — not a second player.
      // Spawning again here would give one connection two bodies.
      if (connection.joined) return;
      connection.joined = true;
      this.onJoin?.(connection, this);
      return;
    }

    if (message.t === 'in') {
      if (typeof message.s !== 'number' || typeof message.dt !== 'number') return;
      // Out of order and duplicate inputs are normal on a real link.
      if (message.s <= connection.ack) return;
      if (connection.inputs.some((i) => i.s === message.s)) return;
      connection.inputs.push({ s: message.s, dt: message.dt, d: message.d });
      connection.inputs.sort((a, b) => a.s - b.s);
      // Trim from the FRONT: the newest intent is the one worth keeping, and
      // a client cannot lengthen the server's tick by shouting.
      while (connection.inputs.length > this.maxQueue) {
        const dropped = connection.inputs.shift();
        if (dropped) connection.ack = Math.max(connection.ack, dropped.s);
      }
      return;
    }

    if (message.t === 'ping') {
      connection.send({ t: 'pong', c: message.c, s: this.time });
    }
  }

  // ---- entities ----------------------------------------------------------

  get count(): number {
    return this.entities.size;
  }

  spawn(
    id: string,
    state: NetState,
    options: { owner?: string; meta?: Record<string, unknown> } = {}
  ): NetState {
    const entity: Entity = {
      id,
      owner: options.owner,
      state: { ...state },
      meta: options.meta,
      metaVersion: 1,
      sentMeta: new Map(),
    };
    this.entities.set(id, entity);
    return entity.state;
  }

  despawn(id: string): boolean {
    return this.entities.delete(id);
  }

  /** The live state, mutable — the server is allowed to move things itself. */
  state(id: string): NetState | undefined {
    return this.entities.get(id)?.state;
  }

  setMeta(id: string, meta: Record<string, unknown>): void {
    const entity = this.entities.get(id);
    if (!entity) return;
    entity.meta = meta;
    entity.metaVersion += 1;
  }

  get ids(): string[] {
    return [...this.entities.keys()];
  }

  /** Send a one-off to everybody: a goal, a hit, a chat line. */
  broadcast(name: string, data?: unknown): void {
    for (const connection of this.connections.values()) {
      connection.send({ t: 'ev', name, d: data });
    }
  }

  // ---- the loop ----------------------------------------------------------

  update(dt: number): void {
    const step = 1 / this.tickRate;
    this.accumulator += dt;
    // Bound the catch-up: a tab that was backgrounded for a minute must not
    // try to simulate a minute in one frame.
    if (this.accumulator > step * 10) this.accumulator = step * 10;
    while (this.accumulator >= step) {
      this.accumulator -= step;
      this.step(step);
    }

    this.sendAccumulator += dt;
    const interval = 1 / this.sendRate;
    if (this.sendAccumulator >= interval) {
      this.sendAccumulator %= interval;
      this.publish();
    }
  }

  /** One authoritative simulation step. */
  private step(dt: number): void {
    for (const connection of this.connections.values()) {
      const input = connection.inputs.shift();
      if (input) {
        connection.ack = input.s;
        connection.lastInput = { dt: input.dt, d: input.d };
        connection.repeats = 0;
        this.applyTo(connection.id, input.d, dt);
      } else if (connection.lastInput && connection.repeats < this.maxRepeat) {
        // A dropped packet with a key held down should not read as "let go".
        connection.repeats += 1;
        this.applyTo(connection.id, connection.lastInput.d, dt);
      }
    }
    this.tick += 1;
    this.time += dt;
  }

  private applyTo(owner: string, input: unknown, dt: number): void {
    for (const entity of this.entities.values()) {
      if (entity.owner !== owner) continue;
      this.apply(entity.state, input as I, dt, { id: entity.id, owner: entity.owner });
    }
  }

  /** A delta snapshot, per client. */
  private publish(): void {
    for (const connection of this.connections.values()) {
      const changed: NetEntitySnapshot[] = [];
      for (const entity of this.entities.values()) {
        const delta = diffState(connection.sent.get(entity.id), entity.state);
        const metaStale = !!entity.meta && entity.sentMeta.get(connection.id) !== entity.metaVersion;
        if (!delta && !metaStale) continue;

        const snapshot: NetEntitySnapshot = { id: entity.id, state: delta ?? { ...entity.state } };
        // Owner and meta go with the first sighting, and again when meta
        // changes — not every tick.
        if (!connection.known.has(entity.id)) {
          if (entity.owner) snapshot.owner = entity.owner;
        }
        if (metaStale && entity.meta) snapshot.meta = entity.meta;
        changed.push(snapshot);
        connection.sent.set(entity.id, { ...entity.state });
        connection.known.add(entity.id);
        entity.sentMeta.set(connection.id, entity.metaVersion);
      }

      const gone = [...connection.known].filter((id) => !this.entities.has(id));
      for (const id of gone) {
        connection.known.delete(id);
        connection.sent.delete(id);
      }

      // Sent even when nothing changed: `q` is how the client steers its
      // send rate, and a silent server leaves it flying blind.
      connection.send({
        t: 'snap',
        k: this.tick,
        time: Number(this.time.toFixed(4)),
        ack: connection.ack,
        q: connection.inputs.length,
        e: changed,
        ...(gone.length ? { gone } : {}),
      });
    }
  }

  /** Close every connection. */
  dispose(): void {
    for (const connection of [...this.connections.values()]) {
      connection.transport.close();
      this.drop(connection);
    }
    this.entities.clear();
  }
}
