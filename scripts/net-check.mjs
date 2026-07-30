#!/usr/bin/env node
/**
 * Does the netcode work over a real socket?
 *
 *   npm run build && node scripts/net-check.mjs
 *
 * The unit tests run a server and two clients with no sockets at all, which
 * is what makes them deterministic and is also exactly what they do not
 * prove. This starts the reference server in its own process, connects two
 * clients over real WebSockets with Node's own client, drives them, and
 * checks that each one sees the other move.
 *
 * Every number here is measured, not asserted from the design: the round
 * trip, the bytes, how far each client is ahead of the server, and whether
 * the interpolated view of the other player is where it should be.
 */
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NetClient, WebSocketTransport } from '../dist/net.js';
import { move } from './net-server.mjs';

const here = dirname(fileURLToPath(import.meta.url));

const checks = [];
const check = (name, ok, detail = '') => {
  checks.push({ name, ok });
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${name}${detail ? `  — ${detail}` : ''}`);
};

if (typeof WebSocket !== 'function') {
  console.error('net-check: this Node has no global WebSocket (needs Node 21+)');
  process.exit(1);
}

// ---- a real server, in its own process ------------------------------------

const PORT = 8791;
const server = spawn(process.execPath, [join(here, 'net-server.mjs'), '--port', String(PORT)], {
  stdio: ['ignore', 'pipe', 'inherit'],
});
const log = [];
server.stdout.on('data', (chunk) => log.push(String(chunk)));

const listening = await new Promise((resolve) => {
  const deadline = setTimeout(() => resolve(false), 8000);
  const poll = setInterval(() => {
    if (log.join('').includes('listening')) {
      clearInterval(poll);
      clearTimeout(deadline);
      resolve(true);
    }
  }, 50);
});
check('the reference server came up', listening, log.join('').trim());
if (!listening) {
  server.kill();
  process.exit(1);
}

// ---- two clients, over real WebSockets ------------------------------------

async function connect(name) {
  const transport = new WebSocketTransport(`ws://localhost:${PORT}`);
  await transport.ready;
  const client = new NetClient(transport, {
    apply: move,
    name,
    angleFields: ['yaw'],
    interpolationDelay: 120,
    // A real clock, so the round trip is measured rather than quantised to
    // the frame the reply happened to land in.
    now: () => performance.now() / 1000,
  });
  return client;
}

const one = await connect('one');
const two = await connect('two');

// A frame loop on MEASURED time. The first version passed a nominal 16 ms
// while `setTimeout(16)` actually took ~19, so the clients produced inputs
// 20% faster than the server consumed them, the queue hit its cap, and the
// server trimmed — which reads as lag and mispredictions caused entirely by
// the harness lying about the clock. A game loop that assumes its own frame
// time makes the same mistake.
let previous = performance.now();
const run = async (seconds) => {
  const until = performance.now() + seconds * 1000;
  while (performance.now() < until) {
    await new Promise((resolve) => setTimeout(resolve, 8));
    const now = performance.now();
    const dt = (now - previous) / 1000;
    previous = now;
    one.update(dt);
    two.update(dt);
  }
};

await run(0.6);
check('both were welcomed', !!one.id && !!two.id, `${one.id}, ${two.id}`);
check('each sees two players', one.entities.length === 2 && two.entities.length === 2,
  `${one.entities.length} / ${two.entities.length}`);
check('names crossed the wire', two.entities.some((e) => e.meta?.name === 'one'),
  JSON.stringify(two.entities.map((e) => e.meta?.name)));

// ---- drive them apart -----------------------------------------------------

const startOne = one.me ? { ...one.me } : null;
one.setInput({ x: 1, z: 0 });
two.setInput({ x: -1, z: 0 });
await run(1.6);
one.setInput({ x: 0, z: 0 });
two.setInput({ x: 0, z: 0 });
await run(0.8);

check('a client predicted its own movement', !!one.me && one.me.x - startOne.x > 3,
  `moved ${(one.me.x - startOne.x).toFixed(2)}`);

const seenByTwo = two.entities.find((e) => !e.mine);
const seenByOne = one.entities.find((e) => !e.mine);
check('each sees the OTHER one move', seenByTwo.state.x > 3 && seenByOne.state.x < -3,
  `one at x=${seenByTwo.state.x.toFixed(2)} as two sees it, two at x=${seenByOne.state.x.toFixed(2)} as one sees it`);

// After both stopped, the interpolated view should have caught up to the
// predicted one — an interpolation buffer that never drains is a player who
// is permanently behind.
const gap = Math.abs(seenByTwo.state.x - one.me.x);
check('a stopped player converges in the other view', gap < 0.35, `${gap.toFixed(3)} apart`);

check('round trip measured over the socket', one.rtt > 0 && one.rtt < 200, `${one.rtt.toFixed(2)} ms`);
check('predictions held up', one.corrections === 0 && two.corrections === 0,
  `${one.corrections} / ${two.corrections} corrections`);

const seconds = 3.0;
console.log(
  `\n  ${(one.bytesIn / seconds / 1024).toFixed(2)} kB/s down per client` +
    `, ${one.pending} inputs in flight, server queue ${one.serverQueue}` +
    `, send rate ×${one.rateScale.toFixed(3)}, ${one.joins} handshake retries\n`
);

// ---- and a client leaving takes its body with it --------------------------

two.dispose();
await run(0.8);
check('a disconnect removes the entity', one.entities.length === 1, `${one.entities.length} left`);

one.dispose();
server.kill();

const failed = checks.filter((c) => !c.ok);
console.log(`${checks.length - failed.length}/${checks.length} checks passed`);
process.exit(failed.length ? 1 : 0);
