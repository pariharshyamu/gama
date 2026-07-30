#!/usr/bin/env node
/**
 * A reference multiplayer server. About 120 lines of it is WebSocket.
 *
 *   npm run build && node scripts/net-server.mjs [--port 8787]
 *
 * GAMA is a client library and this is deliberately not part of it — a
 * server is a deployment, not an import. But "bring your own server" is a
 * cheap thing to say when the client half has never been run against one, so
 * this exists to be run against, and `scripts/net-check.mjs` does exactly
 * that on every gate.
 *
 * The WebSocket implementation is hand-rolled rather than pulled from npm for
 * the same reason the rest of this project has no dependencies: the protocol
 * is a SHA-1 handshake and a length-prefixed frame, and a reference server
 * that drags in a dependency tree is not a reference for anything.
 */
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { NetServer } from '../dist/net.js';

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

// ---------------------------------------------------------------- websocket

/** Server→client frames are never masked; ours are always text and complete. */
function frame(text) {
  const payload = Buffer.from(text, 'utf8');
  const length = payload.length;
  let header;
  if (length < 126) {
    header = Buffer.from([0x81, length]);
  } else if (length < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(length, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(length), 2);
  }
  return Buffer.concat([header, payload]);
}

/**
 * Pull complete frames out of a growing buffer.
 *
 * TCP does not deliver messages, it delivers bytes: one read can hold three
 * frames, or half of one. Anything that assumes one read is one message works
 * until the first time it doesn't, which is under load.
 */
function* frames(state, chunk) {
  state.buffer = state.buffer.length ? Buffer.concat([state.buffer, chunk]) : chunk;
  for (;;) {
    const buffer = state.buffer;
    if (buffer.length < 2) return;
    const opcode = buffer[0] & 0x0f;
    const masked = (buffer[1] & 0x80) !== 0;
    let length = buffer[1] & 0x7f;
    let offset = 2;
    if (length === 126) {
      if (buffer.length < 4) return;
      length = buffer.readUInt16BE(2);
      offset = 4;
    } else if (length === 127) {
      if (buffer.length < 10) return;
      length = Number(buffer.readBigUInt64BE(2));
      offset = 10;
    }
    const maskKey = masked ? buffer.subarray(offset, offset + 4) : null;
    if (masked) offset += 4;
    if (buffer.length < offset + length) return;

    const payload = Buffer.from(buffer.subarray(offset, offset + length));
    if (maskKey) for (let i = 0; i < payload.length; i++) payload[i] ^= maskKey[i % 4];
    state.buffer = buffer.subarray(offset + length);
    yield { opcode, payload };
  }
}

/** The half of a `Transport` that lives on a socket. */
function socketTransport(socket) {
  // One place that marks the transport closed AND tells whoever is
  // listening. The first version had `close()` set `open = false` and end the
  // socket, so the later 'close' event short-circuited and `onClose` never
  // fired — a client that hung up left its body standing in the world
  // forever. Found by net-check.mjs.
  const shutdown = (sendFrame) => {
    if (!transport.open) return;
    transport.open = false;
    if (sendFrame && !socket.destroyed) socket.end(Buffer.from([0x88, 0x00]));
    transport.onClose?.();
  };

  const transport = {
    onMessage: null,
    onClose: null,
    open: true,
    send(data) {
      if (transport.open && !socket.destroyed) socket.write(frame(data));
    },
    close() {
      shutdown(true);
    },
  };

  const state = { buffer: Buffer.alloc(0) };
  socket.on('data', (chunk) => {
    for (const { opcode, payload } of frames(state, chunk)) {
      if (opcode === 0x1) transport.onMessage?.(payload.toString('utf8'));
      else if (opcode === 0x8) transport.close();
      else if (opcode === 0x9) socket.write(Buffer.concat([Buffer.from([0x8a, payload.length]), payload]));
    }
  });
  socket.on('close', () => shutdown(false));
  socket.on('error', () => shutdown(false));
  return transport;
}

// ---------------------------------------------------------------- the game

/**
 * The rules. The SAME function a browser client runs to predict with — which
 * is the point of `apply` being a plain function, and the reason a shared
 * `rules.js` is the normal way to lay a project like this out.
 */
export const move = (state, input, dt) => {
  const speed = 7;
  const ax = Number(input?.x ?? 0);
  const az = Number(input?.z ?? 0);
  const length = Math.hypot(ax, az) || 1;
  const nx = Math.abs(ax) + Math.abs(az) > 1 ? ax / length : ax;
  const nz = Math.abs(ax) + Math.abs(az) > 1 ? az / length : az;
  state.x += nx * speed * dt;
  state.z += nz * speed * dt;
  // A rink, so a bot holding one direction does not leave the world.
  const bound = 18;
  state.x = Math.max(-bound, Math.min(bound, state.x));
  state.z = Math.max(-bound, Math.min(bound, state.z));
  if (nx || nz) state.yaw = Math.atan2(nx, nz);
};

export function start({ port = 8787, tickRate = 30, sendRate = 15, quiet = false } = {}) {
  const game = new NetServer({ apply: move, tickRate, sendRate });
  let spawned = 0;

  game.onJoin = (client) => {
    const angle = (spawned++ * Math.PI * 2) / 6;
    game.spawn(client.id, {
      x: Number((Math.sin(angle) * 6).toFixed(3)),
      z: Number((Math.cos(angle) * 6).toFixed(3)),
      yaw: 0,
    }, {
      owner: client.id,
      meta: { name: client.data.name ?? client.id, hue: (spawned * 67) % 360 },
    });
    if (!quiet) console.log(`join  ${client.id} (${game.clients.length} online)`);
    game.broadcast('joined', { id: client.id });
  };
  game.onLeave = (client) => {
    if (!quiet) console.log(`leave ${client.id} (${game.clients.length - 1} online)`);
  };

  const http = createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.end(`gama net server\nclients: ${game.clients.length}\ntick: ${game.tick}\n`);
  });

  http.on('upgrade', (req, socket) => {
    const key = req.headers['sec-websocket-key'];
    if (!key) return socket.destroy();
    socket.setNoDelay(true); // Nagle batches small packets, which IS the latency
    socket.write(
      'HTTP/1.1 101 Switching Protocols\r\n' +
        'Upgrade: websocket\r\nConnection: Upgrade\r\n' +
        `Sec-WebSocket-Accept: ${createHash('sha1').update(key + GUID).digest('base64')}\r\n\r\n`
    );
    game.accept(socketTransport(socket));
  });

  // The authoritative clock. A fixed interval, and `update` absorbs whatever
  // the timer actually delivered rather than assuming it was on time.
  let last = process.hrtime.bigint();
  const timer = setInterval(() => {
    const now = process.hrtime.bigint();
    const dt = Number(now - last) / 1e9;
    last = now;
    game.update(dt);
  }, 1000 / tickRate);

  return new Promise((resolve) => {
    http.listen(port, () => {
      if (!quiet) console.log(`listening on ws://localhost:${port} (${tickRate} Hz, ${sendRate} Hz out)`);
      resolve({
        port: http.address().port,
        game,
        stop: () => {
          clearInterval(timer);
          game.dispose();
          http.close();
        },
      });
    });
  });
}

const invoked = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop());
if (invoked) {
  const index = process.argv.indexOf('--port');
  await start({ port: index >= 0 ? Number(process.argv[index + 1]) : 8787 });
}
