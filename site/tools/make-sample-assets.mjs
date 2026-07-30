/**
 * The sample assets the docs playground loads.
 *
 * A demo of an asset pipeline that loads nothing is not a demo, and GAMA
 * ships no art — so these are generated once and committed: real glTF, real
 * PNG, real WAV, fetched over HTTP by the real loaders. Small on purpose
 * (about 40 KB all in) and organised by BUNDLE rather than by file type,
 * because that is what groups are for: `town` loads at the start, `ruins`
 * loads when you walk into them, and one of them can be released.
 *
 *   node site/tools/make-sample-assets.mjs
 *   node scripts/assets.mjs site/public/assets --out site/public/assets/manifest.json
 */
import { deflateSync } from 'node:zlib';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets');

// ---------------------------------------------------------------- geometry

/** Six quads, per-face normals: 24 vertices so the edges stay sharp. */
function box(w, h, d) {
  const [x, y, z] = [w / 2, h / 2, d / 2];
  const faces = [
    { n: [0, 0, 1], v: [[-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z]] },
    { n: [0, 0, -1], v: [[x, -y, -z], [-x, -y, -z], [-x, y, -z], [x, y, -z]] },
    { n: [1, 0, 0], v: [[x, -y, z], [x, -y, -z], [x, y, -z], [x, y, z]] },
    { n: [-1, 0, 0], v: [[-x, -y, -z], [-x, -y, z], [-x, y, z], [-x, y, -z]] },
    { n: [0, 1, 0], v: [[-x, y, z], [x, y, z], [x, y, -z], [-x, y, -z]] },
    { n: [0, -1, 0], v: [[-x, -y, -z], [x, -y, -z], [x, -y, z], [-x, -y, z]] },
  ];
  const positions = [];
  const normals = [];
  const indices = [];
  for (const face of faces) {
    const base = positions.length / 3;
    for (const vertex of face.v) {
      positions.push(...vertex);
      normals.push(...face.n);
    }
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  return { positions, normals, indices };
}

function cylinder(rTop, rBottom, h, segments) {
  const positions = [];
  const normals = [];
  const indices = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const [sx, sz] = [Math.sin(a), Math.cos(a)];
    positions.push(sx * rTop, h / 2, sz * rTop, sx * rBottom, -h / 2, sz * rBottom);
    normals.push(sx, 0, sz, sx, 0, sz);
  }
  for (let i = 0; i < segments; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 3, a, a + 3, a + 2);
  }
  // Caps, as fans around a centre vertex with a flat normal.
  for (const [y, r, ny] of [
    [h / 2, rTop, 1],
    [-h / 2, rBottom, -1],
  ]) {
    const centre = positions.length / 3;
    positions.push(0, y, 0);
    normals.push(0, ny, 0);
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      positions.push(Math.sin(a) * r, y, Math.cos(a) * r);
      normals.push(0, ny, 0);
    }
    for (let i = 0; i < segments; i++) {
      if (ny > 0) indices.push(centre, centre + 1 + i, centre + 2 + i);
      else indices.push(centre, centre + 2 + i, centre + 1 + i);
    }
  }
  return { positions, normals, indices };
}

const cone = (r, h, segments) => cylinder(0.001, r, h, segments);

// ---------------------------------------------------------------- glTF

/**
 * A minimal glTF 2.0 writer: one buffer as a data URI, three accessors per
 * primitive, one material each. Enough for real files that the real
 * GLTFLoader parses — which is the only kind worth putting in a demo.
 */
function gltf(name, parts) {
  const chunks = [];
  let offset = 0;
  const bufferViews = [];
  const accessors = [];

  const push = (typed, target) => {
    // Accessor byteOffsets must be aligned to the component size; padding to
    // four covers both FLOAT and UNSIGNED_SHORT.
    while (offset % 4 !== 0) {
      chunks.push(Buffer.alloc(1));
      offset += 1;
    }
    const bytes = Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength);
    chunks.push(bytes);
    bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: bytes.length, ...(target ? { target } : {}) });
    offset += bytes.length;
    return bufferViews.length - 1;
  };

  const meshes = [];
  const nodes = [];
  const materials = [];

  for (const part of parts) {
    const positions = new Float32Array(part.geometry.positions);
    const normals = new Float32Array(part.geometry.normals);
    const indices = new Uint16Array(part.geometry.indices);

    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < positions.length; i += 3) {
      for (let a = 0; a < 3; a++) {
        min[a] = Math.min(min[a], positions[i + a]);
        max[a] = Math.max(max[a], positions[i + a]);
      }
    }

    const positionView = push(positions, 34962);
    accessors.push({
      bufferView: positionView,
      componentType: 5126,
      count: positions.length / 3,
      type: 'VEC3',
      min,
      max,
    });
    const positionAccessor = accessors.length - 1;

    const normalView = push(normals, 34962);
    accessors.push({
      bufferView: normalView,
      componentType: 5126,
      count: normals.length / 3,
      type: 'VEC3',
    });
    const normalAccessor = accessors.length - 1;

    const indexView = push(indices, 34963);
    accessors.push({
      bufferView: indexView,
      componentType: 5123,
      count: indices.length,
      type: 'SCALAR',
    });
    const indexAccessor = accessors.length - 1;

    materials.push({
      name: `${part.name}-material`,
      pbrMetallicRoughness: {
        baseColorFactor: [...part.color, 1],
        metallicFactor: part.metallic ?? 0,
        roughnessFactor: part.roughness ?? 0.8,
      },
      ...(part.emissive ? { emissiveFactor: part.emissive } : {}),
    });

    meshes.push({
      name: part.name,
      primitives: [
        {
          attributes: { POSITION: positionAccessor, NORMAL: normalAccessor },
          indices: indexAccessor,
          material: materials.length - 1,
        },
      ],
    });
    nodes.push({
      name: part.name,
      mesh: meshes.length - 1,
      ...(part.at ? { translation: part.at } : {}),
      ...(part.scale ? { scale: part.scale } : {}),
    });
  }

  const buffer = Buffer.concat(chunks);
  return `${JSON.stringify(
    {
      asset: { version: '2.0', generator: 'gama sample assets' },
      scene: 0,
      scenes: [{ name, nodes: nodes.map((_, i) => i) }],
      nodes,
      meshes,
      materials,
      accessors,
      bufferViews,
      buffers: [
        {
          byteLength: buffer.length,
          uri: `data:application/octet-stream;base64,${buffer.toString('base64')}`,
        },
      ],
    },
    null,
    1
  )}\n`;
}

// ---------------------------------------------------------------- PNG

const CRC = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return (buffer) => {
    let c = -1;
    for (const byte of buffer) c = table[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  };
})();

const chunk = (type, data) => {
  const head = Buffer.alloc(4);
  head.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(CRC(body));
  return Buffer.concat([head, body, crc]);
};

/** An RGB PNG from a `(x, y) => [r, g, b]` function. */
function png(size, shade) {
  const stride = size * 3;
  const raw = Buffer.alloc(size * (stride + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b] = shade(x, y);
      const at = y * (stride + 1) + 1 + x * 3;
      raw[at] = r;
      raw[at + 1] = g;
      raw[at + 2] = b;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------------------------------------------------------------- WAV

/** 16-bit mono PCM from a `t => -1…1` function. */
function wav(seconds, rate, sample) {
  const count = Math.floor(seconds * rate);
  const data = Buffer.alloc(count * 2);
  for (let i = 0; i < count; i++) {
    const value = Math.max(-1, Math.min(1, sample(i / rate)));
    data.writeInt16LE(Math.round(value * 32767), i * 2);
  }
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

// ---------------------------------------------------------------- the assets

const noise = (x, y, seed) => {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
};

const files = {
  // ---- the town bundle: what a game loads before the first frame
  'town/crate.gltf': gltf('crate', [
    { name: 'body', geometry: box(1, 1, 1), color: [0.66, 0.46, 0.24], at: [0, 0.5, 0] },
    { name: 'band', geometry: box(1.04, 0.1, 1.04), color: [0.34, 0.24, 0.13], at: [0, 0.78, 0] },
  ]),
  'town/lamp.gltf': gltf('lamp', [
    { name: 'post', geometry: cylinder(0.06, 0.1, 2.6, 10), color: [0.2, 0.22, 0.25], at: [0, 1.3, 0], roughness: 0.5 },
    {
      name: 'glass',
      geometry: box(0.34, 0.4, 0.34),
      color: [1, 0.9, 0.66],
      emissive: [1, 0.78, 0.36],
      at: [0, 2.75, 0],
      roughness: 0.2,
    },
  ]),
  'town/planks.png': png(64, (x, y) => {
    const row = Math.floor(y / 8);
    const grain = noise(x, row, 3) * 24;
    const seam = y % 8 === 0 ? -30 : 0;
    return [160 + grain + seam, 112 + grain * 0.7 + seam, 62 + grain * 0.4 + seam];
  }),

  // ---- the ruins bundle: loaded on demand, and released again
  'ruins/statue.gltf': gltf('statue', [
    { name: 'plinth', geometry: box(1.4, 0.5, 1.4), color: [0.62, 0.6, 0.55], at: [0, 0.25, 0] },
    { name: 'shaft', geometry: cylinder(0.3, 0.42, 2.2, 12), color: [0.72, 0.7, 0.64], at: [0, 1.6, 0] },
    { name: 'cap', geometry: cone(0.5, 0.9, 12), color: [0.68, 0.66, 0.6], at: [0, 3.1, 0] },
  ]),
  'ruins/broken-arch.gltf': gltf('broken-arch', [
    { name: 'left', geometry: box(0.6, 3.2, 0.6), color: [0.6, 0.58, 0.52], at: [-1.4, 1.6, 0] },
    { name: 'right', geometry: box(0.6, 2.1, 0.6), color: [0.58, 0.56, 0.5], at: [1.4, 1.05, 0] },
    { name: 'lintel', geometry: box(2.1, 0.5, 0.7), color: [0.63, 0.61, 0.55], at: [-0.8, 3.4, 0] },
  ]),
  'ruins/moss.png': png(64, (x, y) => {
    const n = noise(x, y, 7) * 40 + noise(Math.floor(x / 4), Math.floor(y / 4), 11) * 30;
    return [40 + n * 0.5, 70 + n, 38 + n * 0.4];
  }),

  // ---- ui: no group of its own worth naming, so it sits with the rest
  'ui/chime.wav': wav(0.5, 22050, (t) => {
    const decay = Math.exp(-t * 6);
    return (Math.sin(t * 2 * Math.PI * 880) * 0.6 + Math.sin(t * 2 * Math.PI * 1320) * 0.3) * decay;
  }),
};

await mkdir(OUT, { recursive: true });
for (const [name, contents] of Object.entries(files)) {
  const path = join(OUT, name);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, contents);
  const bytes = Buffer.isBuffer(contents) ? contents.length : Buffer.byteLength(contents);
  console.log(`${name.padEnd(26)} ${String(bytes).padStart(7)} bytes`);
}
