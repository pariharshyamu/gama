# Networking

[Run it →](../playground.html?example=net)

A server is the authority, so every snapshot a client receives is already out
of date by half the round trip. Do nothing about that and you get a game where
pressing a key does nothing for 80 ms and everybody else teleports twelve
times a second. `gama3d/net` is the three mechanisms that fix it, plus the
transports that make them testable.

```ts
import { NetClient, NetServer, WebSocketTransport } from 'gama3d/net';

// rules.js — imported by BOTH sides. This is the whole trick.
export const move = (state, input, dt) => {
  state.x += input.x * 7 * dt;
  state.z += input.z * 7 * dt;
};

// server
const server = new NetServer({ apply: move, tickRate: 30, sendRate: 15 });
server.onJoin = (c) => server.spawn(c.id, { x: 0, z: 0 }, { owner: c.id });

// client
const client = new NetClient(new WebSocketTransport('wss://…'), { apply: move });
loop((dt) => {
  client.setInput({ x: axis.x, z: axis.z });
  client.update(dt);
  for (const e of client.entities) draw(e);   // mine predicted, others smooth
});
```

## The three mechanisms

**Prediction.** Your own entity runs `apply` the instant you press the key, so
input is not gated on the network. Runs *ahead* of the server by roughly the
inputs it has not acknowledged.

**Reconciliation.** A snapshot says where you actually were at input N. Your
state is reset to that and every input after N is replayed on top. When the
prediction was right — the normal case — nothing visibly moves, which is
precisely why prediction is worth doing.

**Interpolation.** Everyone else is drawn `interpolationDelay` behind server
time, so there are always two snapshots to blend between. Rendering the
newest snapshot directly is what makes other players stutter. Beyond the
newest sample it **holds** rather than extrapolating: a guess that overshoots
and snaps back reads worse than a body that pauses.

In the demo those two are visible at once. Solid is what the client draws,
wireframe is where the server really is: the blue capsule's wireframe trails
it (prediction), the orange one's leads it (interpolation). Untick either box
and watch the distance collapse.

## Clients send intent, never state

`apply` is a plain function so it can be imported by a server bundle and a
client bundle, and tested without either. Clients send inputs; the server is
the only thing that runs the rules. That single decision is what separates a
game you can play from a game where whoever edits their bundle wins, and it is
not something you can retrofit.

## A state is `Record<string, number>`

A real restriction, and it buys three things worth more than generality:
numbers **interpolate**, they **compare** cheaply (so a delta is a one-line
diff), and they **quantise** (so a wire format can shrink them). Names, skins
and teams go in `meta`, which is sent when it changes and never interpolated.

Every project that starts by sending arbitrary JSON per entity per tick
arrives here anyway, usually after writing a bespoke interpolator per field.

## Transports are an interface

Four members: `send`, `onMessage`, `onClose`, `open`. Everything above is
written against that and nothing else.

| | |
|---|---|
| `WebSocketTransport` | a real server. Buffers anything sent before the socket opens — a `join` lost to that race is a client that never appears. |
| `Link` / `LoopbackTransport` | a **simulated** pair: latency, jitter, packet loss, seeded, and advanced by `advance(dt)` rather than a clock |
| `BroadcastChannelTransport` | two tabs, same origin, no server. Genuinely useful, genuinely peer-to-peer-on-one-machine. |

`Link` is why there is netcode with tests at all. The suite runs a whole
authoritative server and two clients in one process with scriptable loss and
**no timers anywhere** — the alternative is a test that opens a socket, sleeps
200 ms and hopes reconciliation happened, which is why most netcode has none.

## Four things the server does that a broadcast loop does not

**One input per tick, per client.** Jitter delivers inputs in bursts, and a
server that applies everything queued lets a laggy client move three times in
one step — a speed hack you get for free by having a bad connection.

**A missing input repeats the last one, briefly.** A dropped packet with a key
held down should not read as "let go". Capped by `maxRepeat`, so a client that
actually left stops moving.

**Snapshots are per-client deltas.** Each connection tracks what it was last
told, so a joiner gets everything and everyone else gets what changed.

**Snapshots report the client's queue depth**, and the client steers its own
send rate to keep that near `bufferTarget` (default 2). This one is not
optional: a browser frame loop is not exactly 30 Hz, the two clocks drift, the
server periodically runs dry and covers the gap by repeating — and the client
mispredicts every single time it happens. Measured against the reference
server before this existed: a correction every few seconds from nothing but
drift. After: zero.

**And the buffer is primed, not steered up to.** The steering has ±15%
authority on purpose — its job is drift, not cold-starting — so filling an
empty buffer took about a second, and for that whole second a single late
input still cost a correction. The first batch of inputs now goes out
`bufferTarget` deep, so the client simply starts two server steps ahead, which
is what having a buffer means.

## Corrections are visible or invisible, your choice

`correction: 'smooth'` (default) keeps the error as a decaying offset, so a
misprediction is a drift rather than a teleport. `'snap'` is honest and ugly,
and the right setting while you are working out *why* something mispredicts.
`corrections` counts them, and is the number to watch: it should be zero on a
healthy link.

## The reference server

```bash
npm run build
npm run net:server            # ws://localhost:8787
npm run net:check             # two real clients against it, 10 checks
```

`scripts/net-server.mjs` is ~120 lines of WebSocket and ~40 of game. It is not
part of the library — a server is a deployment, not an import — but "bring
your own server" is cheap to say when the client half has never been run
against one. The WebSocket is hand-rolled rather than pulled from npm for the
same reason nothing else here has dependencies: the protocol is a SHA-1
handshake and a length-prefixed frame, and a reference that drags in a
dependency tree is not a reference for anything.

`net:check` starts it in its own process, connects two clients over real
sockets with Node's own `WebSocket`, and measures: round trip, bytes per
second, whether each client sees the other move, whether a stopped player's
interpolated position converges, and whether a disconnect takes its body with
it. Last run: **0 corrections, 4 inputs in flight, 2.2 kB/s down per client.**

## What it found

Every one of these was measured, not reasoned about:

- **No join retry.** One dropped handshake packet and the client sat there
  forever, having sent exactly one message. Every other message in the
  protocol is disposable; that one is not. Found by a packet-loss test.
- **A retried join spawned the player twice.** The fix for the first bug
  created the second.
- **The ack was only processed when my own entity appeared in a delta.**
  Deltas carry only what changed, so a player standing still vanishes from
  them — and the input queue, drained inside reconciliation, never drained.
  Twenty-four unacknowledged inputs after one second of standing still: 800 ms
  of phantom lag, and twenty-four inputs replayed on top of every correction.
- **The reference server's `close()` never fired `onClose`**, so a client that
  hung up left its body standing in the world forever.
- **A `bye` sent immediately before a disconnect was eaten** by the loopback
  closing its peer synchronously. Real sockets flush before they close, so now
  the hang-up travels over the link behind its data.
- **The input buffer was steered up from empty rather than primed**, so for
  the first second after a client started sending, one late input made the
  server run dry and cost a correction. It showed up as `net:check` failing
  about one run in eight with `1 / 1 corrections` — one misprediction on
  *both* clients at the same instant, which is what pointed at the server's
  buffer rather than at either client's prediction. An intermittent check is
  worth chasing precisely because it is intermittent.
- **The check harness passed a nominal 16 ms** while `setTimeout(16)` took 19,
  so the clients out-produced the server by 20% and the queue hit its cap.
  A game loop that assumes its own frame time makes exactly this mistake.

## What this is not

**No UDP, no WebRTC data channels.** WebSockets are TCP: a lost packet stalls
everything behind it, which is the wrong trade for a twitch shooter and a
perfectly good one for most browser games. WebRTC is the answer when it isn't,
and it is a `Transport` away.

**No lag compensation for hit registration.** The server does not rewind the
world to when you fired. That is the next mechanism after these three, it
needs a rewindable history of every entity, and pretending otherwise would be
worse than saying so.

**No rooms, matchmaking, persistence or anti-cheat beyond authority.** No
binary codec — `Codec` is the hook, JSON is the default, and the demo prints
the byte count so the claim can be checked rather than believed.

**No interest management.** Every client is told about every entity. Fine for
a dozen players in one arena; the first thing to fix for a hundred in a world.
