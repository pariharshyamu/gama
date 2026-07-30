import { describe, expect, it } from 'vitest';
import {
  Link,
  NetClient,
  NetServer,
  blendAngle,
  diffState,
  type NetApply,
} from '../src/net';

/**
 * A whole authoritative server and two clients, in one process, with
 * scriptable latency and packet loss and no timers anywhere.
 *
 * That is only possible because the transport is an interface and time is
 * passed in. The alternative — a test that opens a socket and sleeps 200 ms
 * hoping reconciliation happened — is the reason most netcode has none.
 */

interface Move {
  x: number;
  z: number;
}

/** The rules. The same function runs on both sides; that is the trick. */
const move: NetApply<Move> = (state, input, dt) => {
  const speed = 6;
  state.x += (input?.x ?? 0) * speed * dt;
  state.z += (input?.z ?? 0) * speed * dt;
};

interface World {
  server: NetServer<Move>;
  link: Link;
  client: NetClient<Move>;
  /** Run the whole system for `seconds`, in 60 Hz frames. */
  run(seconds: number): void;
}

function world(
  options: { latency?: number; loss?: number; jitter?: number } & Partial<{
    predict: boolean;
    interpolate: boolean;
    correction: 'smooth' | 'snap';
  }> = {}
): World {
  const server = new NetServer<Move>({ apply: move, tickRate: 30, sendRate: 15 });
  server.onJoin = (client) => {
    server.spawn(client.id, { x: 0, z: 0 }, { owner: client.id, meta: { name: client.id } });
  };
  const link = new Link({ latency: options.latency ?? 0, loss: options.loss, jitter: options.jitter, seed: 7 });
  server.accept(link.server, 'p1');
  const client = new NetClient<Move>(link.client, {
    apply: move,
    predict: options.predict ?? true,
    interpolate: options.interpolate ?? true,
    correction: options.correction ?? 'smooth',
    smoothing: 40,
  });

  const run = (seconds: number) => {
    const dt = 1 / 60;
    for (let t = 0; t < seconds; t += dt) {
      link.advance(dt);
      server.update(dt);
      client.update(dt);
    }
    link.flush();
    server.update(dt);
    client.update(dt);
  };
  return { server, link, client, run };
}

describe('the wire', () => {
  it('a delta is the fields that changed, and null when none did', () => {
    expect(diffState(undefined, { x: 1 })).toEqual({ x: 1 });
    expect(diffState({ x: 1, z: 2 }, { x: 1, z: 2 })).toBeNull();
    expect(diffState({ x: 1, z: 2 }, { x: 5, z: 2 })).toEqual({ x: 5, z: 2 });
    // A field that vanished is a change too, or a client renders a ghost limb.
    expect(diffState({ x: 1, z: 2 }, { x: 1 })).toEqual({ x: 1 });
  });

  it('an angle blends the short way round', () => {
    // The single most recognisable networking bug in a browser game: a
    // character spinning past π takes the long route home.
    // Halfway from 3.0 to -3.0 the short way is straight through π,
    // not back down through zero.
    expect(blendAngle(3.0, -3.0, 0.5)).toBeCloseTo(Math.PI, 5);
    expect(blendAngle(0, 1, 0.5)).toBeCloseTo(0.5, 5);
  });
});

describe('NetServer + NetClient', () => {
  it('joins, spawns, and tells the client who it is', () => {
    const { client, run, server } = world({ latency: 30 });
    run(0.3);
    expect(client.ready).toBe(true);
    expect(client.id).toBe('p1');
    expect(server.count).toBe(1);
    expect(client.entities).toHaveLength(1);
    expect(client.entities[0].mine).toBe(true);
    expect(client.entities[0].meta).toEqual({ name: 'p1' });
  });

  it('the client predicts immediately, before any snapshot could arrive', () => {
    const { client, link, server } = world({ latency: 200 });
    const dt = 1 / 60;
    // Get through the handshake, then hold a key for a fifth of a second.
    for (let i = 0; i < 40; i++) {
      link.advance(dt);
      server.update(dt);
      client.update(dt);
    }
    const before = client.me!.x;
    client.setInput({ x: 1, z: 0 });
    for (let i = 0; i < 12; i++) {
      client.update(dt);
    }
    // Nothing has been delivered in that window at all — this is prediction
    // or it is nothing.
    expect(client.me!.x).toBeGreaterThan(before + 0.5);
  });

  it('converges on the server, and the correction is invisible when right', () => {
    // The normal case, and the whole justification for prediction: replaying
    // unacknowledged inputs on top of an old authoritative state lands
    // exactly where the client already drew itself, so nothing corrects.
    const { client, server, run } = world({ latency: 80 });
    run(0.3);
    client.setInput({ x: 1, z: 0.5 });
    run(2);

    const authoritative = server.state('p1')!;
    expect(authoritative.x).toBeGreaterThan(8);

    // The client is AHEAD of the server, and by exactly the inputs the
    // server has not acknowledged yet — one tick's movement each. That is
    // not drift, it is what prediction is for.
    const perTick = 6 / 30;
    const lead = client.me!.x - authoritative.x;
    expect(lead).toBeGreaterThan(0);
    expect(lead).toBeCloseTo(client.pending * perTick, 2);
    // And the prediction was right every single time, so nothing corrected.
    expect(client.corrections).toBe(0);
  });

  it('corrects when the server disagrees, and smooths the jump', () => {
    const { client, server, run } = world({ latency: 60 });
    run(0.3);
    client.setInput({ x: 1, z: 0 });
    run(0.5);

    // The server is the authority: teleport the entity behind the client's back.
    server.state('p1')!.x = 0;
    run(0.4);
    expect(client.corrections).toBeGreaterThan(0);

    // Smoothed, so the drawn position eases onto the corrected one rather
    // than teleporting. Once the error has decayed it is back to leading the
    // server by its unacknowledged inputs and nothing more.
    run(1.5);
    const lead = client.me!.x - server.state('p1')!.x;
    expect(lead).toBeCloseTo(client.pending * (6 / 30), 1);
  });

  it('a laggy client cannot move faster by sending in bursts', () => {
    // Jitter delivers inputs in clumps. A server that applies everything
    // queued gives that client a speed hack for having a bad connection.
    const server = new NetServer<Move>({ apply: move, tickRate: 30, sendRate: 15 });
    server.onJoin = (c) => server.spawn(c.id, { x: 0 }, { owner: c.id });
    const link = new Link({ latency: 0 });
    server.accept(link.server, 'p1');
    const client = new NetClient<Move>(link.client, { apply: move, predict: false });

    link.advance(0.01);
    server.update(0.01);

    // Hand-post eight ticks of input at once, then let the server run ONE.
    for (let s = 1; s <= 8; s++) {
      link.client.send(JSON.stringify({ t: 'in', s, dt: 1 / 30, d: { x: 1, z: 0 } }));
    }
    link.advance(0.001);
    server.update(1 / 30);

    // One tick of movement, not eight.
    expect(server.state('p1')!.x).toBeCloseTo(6 / 30, 4);
    expect(server.client('p1')!.queued).toBe(7);
    client.dispose();
  });

  it('rides out packet loss: a held key keeps moving', () => {
    // A dropped input with a key down must not read as "let go", and a
    // one-tick freeze is visible at 30 Hz. What is measured is the DISTANCE
    // TRAVELLED in a settled window, not the absolute position: a lossy
    // client also takes longer to get through its handshake, and comparing
    // totals measures the join retry rather than the movement.
    const travelled = (options: { loss?: number }) => {
      const w = world({ latency: 40, ...options });
      w.run(1);
      w.client.setInput({ x: 1, z: 0 });
      w.run(0.6); // settle
      const from = w.server.state('p1')!.x;
      w.run(2);
      return { distance: w.server.state('p1')!.x - from, link: w.link };
    };

    const clean = travelled({});
    const lossy = travelled({ loss: 0.3 });

    expect(lossy.link.dropped).toBeGreaterThan(10);
    const ratio = lossy.distance / clean.distance;
    expect(ratio).toBeGreaterThan(0.9); // degraded, not broken
    expect(ratio).toBeLessThanOrEqual(1.02);
  });

  it('drains the input queue even when nothing about me changed', () => {
    // Deltas only carry what CHANGED, so a player standing still disappears
    // from them entirely. The first version drained the acknowledged inputs
    // inside reconciliation — which then never ran — so the queue grew for
    // as long as you stood there. Measured against the reference server:
    // 24 unacknowledged inputs after a second of not moving, which is 800 ms
    // of phantom lag and 24 inputs replayed on top of every correction.
    const { client, run } = world({ latency: 40 });
    run(0.5);
    client.setInput({ x: 0, z: 0 }); // sending intent, but not moving
    run(2);
    expect(client.pending).toBeLessThan(6);
  });

  it('steers its send rate to keep the server from running dry', () => {
    // A server with an empty queue has to guess, and every guess is a
    // misprediction the client then corrects. The queue depth comes back in
    // the snapshot and the client adjusts.
    const { client, run } = world({ latency: 50 });
    run(0.4);
    client.setInput({ x: 1, z: 0 });
    run(3);
    expect(client.serverQueue).toBeGreaterThan(0);
    expect(client.serverQueue).toBeLessThan(6);
    expect(client.rateScale).toBeGreaterThan(0.84);
    expect(client.rateScale).toBeLessThan(1.16);
  });

  it('primes the server buffer at join instead of steering up to it', () => {
    // The steering above has ±15% authority on purpose — it corrects clock
    // drift — which means filling an EMPTY buffer takes about a second. For
    // that whole second one late input makes the server run dry, repeat the
    // last one, and cost the client a correction. Over a real socket that
    // showed up as roughly one run in eight taking exactly one misprediction,
    // on both clients simultaneously.
    //
    // So the first batch of inputs goes out `bufferTarget` deep. The queue
    // must be at target after the FIRST send, not after a second of ramping.
    const { client, server, run } = world({ latency: 0 });
    run(0.3);
    expect(client.ready).toBe(true);
    client.setInput({ x: 1, z: 0 });
    client.update(1 / 60); // one frame — a sixtieth of a server step's worth
    expect(client.pending).toBeGreaterThanOrEqual(2);
    // And the depth is real: the server has them queued, not applied.
    run(0.05);
    expect(server.count).toBe(1);
  });

  it('sends deltas, so a still world costs nothing', () => {
    const { link, run, client } = world({ latency: 0 });
    run(0.4);
    client.setInput({ x: 0, z: 0 }); // sending input, but not moving
    const before = link.bytes;
    run(1);
    const idle = link.bytes - before;

    const moving = world({ latency: 0 });
    moving.run(0.4);
    moving.client.setInput({ x: 1, z: 1 });
    const beforeMoving = moving.link.bytes;
    moving.run(1);

    // Inputs still flow either way; what stops is snapshots.
    expect(idle).toBeLessThan(moving.link.bytes - beforeMoving);
  });

  it('interpolates another player, and renders them in the past', () => {
    const server = new NetServer<Move>({ apply: move, tickRate: 30, sendRate: 10 });
    server.onJoin = (c) => server.spawn(c.id, { x: 0, z: 0 }, { owner: c.id });

    const a = new Link({ latency: 20 });
    const b = new Link({ latency: 20 });
    server.accept(a.server, 'p1');
    server.accept(b.server, 'p2');
    const one = new NetClient<Move>(a.client, { apply: move });
    const two = new NetClient<Move>(b.client, { apply: move, interpolationDelay: 150 });

    const dt = 1 / 60;
    const step = (seconds: number) => {
      for (let t = 0; t < seconds; t += dt) {
        a.advance(dt);
        b.advance(dt);
        server.update(dt);
        one.update(dt);
        two.update(dt);
      }
    };
    step(0.3);
    one.setInput({ x: 1, z: 0 });
    two.setInput({ x: 0, z: 0 });
    step(1.5);

    const seen = two.entities.find((e) => e.id === 'p1')!;
    expect(seen).toBeTruthy();
    expect(seen.mine).toBe(false);
    // Rendered in the past by roughly the interpolation delay: behind the
    // server, but moving.
    expect(seen.state.x).toBeGreaterThan(3);
    expect(seen.state.x).toBeLessThan(server.state('p1')!.x);

    // …and turning interpolation off snaps to the newest snapshot instead.
    two.interpolate = false;
    expect(two.entities.find((e) => e.id === 'p1')!.state.x).toBeGreaterThan(seen.state.x);
  });

  it('removes an entity when its owner leaves', () => {
    const server = new NetServer<Move>({ apply: move, tickRate: 30, sendRate: 30 });
    server.onJoin = (c) => server.spawn(c.id, { x: 0 }, { owner: c.id });
    const a = new Link({ latency: 0 });
    const b = new Link({ latency: 0 });
    server.accept(a.server, 'p1');
    server.accept(b.server, 'p2');
    const one = new NetClient<Move>(a.client, { apply: move });
    const two = new NetClient<Move>(b.client, { apply: move });

    const dt = 1 / 60;
    const step = (n: number) => {
      for (let i = 0; i < n; i++) {
        a.advance(dt);
        b.advance(dt);
        server.update(dt);
        one.update(dt);
        two.update(dt);
      }
    };
    step(20);
    expect(two.entities).toHaveLength(2);

    one.dispose();
    step(20);
    expect(server.count).toBe(1);
    expect(two.entities.map((e) => e.id)).toEqual(['p2']);
  });

  it('measures round-trip time from the link it is actually on', () => {
    const { client, run } = world({ latency: 75 });
    run(2.5); // long enough for a ping to go out and come back
    expect(client.rtt).toBeGreaterThan(120);
    expect(client.rtt).toBeLessThan(180);
  });

  it('refuses a client speaking a different protocol', () => {
    const server = new NetServer<Move>({ apply: move });
    const link = new Link();
    server.accept(link.server, 'p1');
    let why = '';
    link.client.onMessage = (data) => {
      const message = JSON.parse(data);
      if (message.t === 'bye') why = message.why;
    };
    link.client.send(JSON.stringify({ t: 'join', v: 99 }));
    link.flush(); // the join arrives, the server kicks…
    link.flush(); // …and the reply comes back. A round trip is two trips.
    expect(why).toMatch(/protocol 99, server speaks 1/);
  });

  it('survives garbage on the wire', () => {
    const server = new NetServer<Move>({ apply: move });
    const link = new Link();
    server.accept(link.server, 'p1');
    link.client.send('not json at all');
    link.client.send(JSON.stringify({ t: 'in', s: 'nonsense' }));
    link.flush();
    expect(() => server.update(1 / 60)).not.toThrow();
  });

  it('drops an old snapshot that arrives after a newer one', () => {
    // Jitter reorders packets, and applying a stale snapshot after a fresh
    // one drags the whole world backwards for a frame.
    const { client, link, run } = world({ latency: 0 });
    const snapshots: string[] = [];
    const deliver = link.client.onMessage!;
    link.client.onMessage = (data) => {
      if (data.includes('"snap"')) snapshots.push(data);
      deliver(data);
    };

    run(0.3);
    client.setInput({ x: 1, z: 0 });
    run(1);
    const stale = snapshots[1];
    const now = client.entities.find((e) => e.mine)!.state.x;
    expect(now).toBeGreaterThan(2);

    deliver(stale); // the past, arriving late
    expect(client.entities.find((e) => e.mine)!.state.x).toBeCloseTo(now, 4);
  });

  it('broadcasts one-off events to every client', () => {
    const { server, client, run } = world({ latency: 5 });
    const heard: Array<[string, unknown]> = [];
    client.onEvent = (name, data) => heard.push([name, data]);
    run(0.2);
    server.broadcast('goal', { by: 'p1' });
    run(0.2);
    expect(heard).toEqual([['goal', { by: 'p1' }]]);
  });
});
