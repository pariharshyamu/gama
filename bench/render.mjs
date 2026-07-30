#!/usr/bin/env node
/**
 * The render-budget gate. No timing in it at all.
 *
 *   npm run bench:render          compare against bench/render-baseline.json
 *   npm run bench:render:update   record
 *
 * Frame *time* in headless SwiftShader is meaningless — it is a software
 * rasteriser on a shared box. What is not meaningless is what the renderer
 * was ASKED to do: draw calls, triangles, and how many geometries and
 * textures are resident. Those are properties of the scene and the code that
 * built it, not of the machine, so they can be compared exactly.
 *
 * They are also where the regressions that actually hurt live. If somebody
 * stops sharing a material, geometries climb. If instancing breaks, the
 * count starts scaling with placements — the asset demo draws forty-two
 * crates from FIVE geometries, and a change that makes it ninety is a bug
 * that no unit test would notice and no screenshot would show.
 *
 * Two bands, on purpose:
 *   - `geometries` and `textures` are EXACT. They do not depend on where the
 *     camera is looking, so any movement is a real change.
 *   - `draws` and `triangles` get a percentage band, because several of
 *     these scenes have an orbiting camera and frustum culling moves them.
 */
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pw = await (async () => {
  const tries = [
    process.env.PLAYWRIGHT,
    'playwright',
    'playwright-core',
    '/opt/node22/lib/node_modules/playwright/index.mjs',
  ].filter(Boolean);
  for (const t of tries) {
    try {
      return await import(t);
    } catch {
      /* next */
    }
  }
  throw new Error('no playwright found');
})();
const { chromium } = pw;

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..', 'site', 'dist');
const BASELINE = join(here, 'render-baseline.json');
const args = process.argv.slice(2);
const update = args.includes('--update');
/** Percentage band for the camera-dependent counters. */
const BAND = Number(args.includes('--band') ? args[args.indexOf('--band') + 1] : '0.25');

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.gltf': 'model/gltf+json',
  '.wav': 'audio/wav',
  '.md': 'text/markdown',
  '.svg': 'image/svg+xml',
};
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0]);
  try {
    const body = await readFile(join(ROOT, path === '/' ? '/index.html' : path));
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('no');
  }
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}`;

const browser = await chromium.launch({
  ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}),
  args: [
    '--no-sandbox',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--autoplay-policy=no-user-gesture-required',
  ],
});

/**
 * Each scene names the counters worth watching and which are exact.
 *
 * `inFrame` reads the probe from inside the playground's iframe; the game
 * pages publish theirs on the top document.
 */
const scenes = [
  {
    name: 'playground/assets',
    url: '/playground.html?example=assets',
    inFrame: true,
    probe: 'assetDebug',
    settle: 9000,
    exact: ['geometries', 'textures', 'placed', 'loaded'],
    banded: ['draws', 'triangles'],
    map: (d) => ({ ...d, loaded: d.loaded.length }),
  },
  {
    name: 'playground/level',
    url: '/playground.html?example=level',
    inFrame: true,
    probe: 'levelDebug',
    settle: 8000,
    exact: ['built', 'inFile'],
    banded: ['draws'],
  },
  {
    name: 'playground/net',
    url: '/playground.html?example=net',
    inFrame: true,
    probe: 'netDebug',
    settle: 9000,
    exact: ['players', 'mine'],
    banded: ['draws'],
  },
  {
    name: 'game/editor',
    url: '/play/editor.html',
    probe: 'editorDebug',
    settle: 12000,
    exact: ['entities', 'built', 'kinds', 'addresses', 'waypoints', 'blockers'],
    banded: ['draws', 'triangles', 'geometries', 'textures'],
  },
  {
    name: 'game/havenbrook',
    url: '/play/index.html?level=havenbrook',
    probe: 'courierDebug',
    settle: 10000,
    exact: ['houses'],
    banded: ['draws', 'tris'],
    play: true,
  },
];

const measured = {};
for (const scene of scenes) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 760 } });
  await page.goto(`${BASE}${scene.url}`, { waitUntil: 'networkidle' });
  if (scene.play) {
    await page.waitForTimeout(1500);
    await page.click('[data-shell="play"]').catch(() => {});
  }
  await page.waitForTimeout(scene.settle);

  const target = scene.inFrame
    ? page.frames().find((f) => f !== page.mainFrame())
    : page.mainFrame();
  let stats = null;
  try {
    stats = await target.evaluate(
      (name) => (typeof window[name] === 'function' ? window[name]() : null),
      scene.probe
    );
  } catch {
    /* reported below */
  }
  await page.close();

  if (!stats) {
    console.log(` MISS ${scene.name} — no ${scene.probe}() to read`);
    measured[scene.name] = null;
    continue;
  }
  const mapped = scene.map ? scene.map(stats) : stats;
  const keep = {};
  for (const key of [...scene.exact, ...scene.banded]) {
    if (typeof mapped[key] === 'number') keep[key] = mapped[key];
  }
  measured[scene.name] = keep;
  console.log(
    `  ok  ${scene.name.padEnd(20)} ` +
      Object.entries(keep)
        .map(([k, v]) => `${k}=${v}`)
        .join(' ')
  );
}

await browser.close();
server.close();

if (Object.values(measured).some((m) => m === null)) {
  console.error('\nbench:render — a scene published no probe; nothing to compare');
  process.exit(1);
}

if (update) {
  await writeFile(
    BASELINE,
    `${JSON.stringify(
      {
        note:
          'Deterministic render counters. `exact` keys must match; `banded` keys are ' +
          'allowed a percentage drift because frustum culling moves with the camera.',
        band: BAND,
        scenes: Object.fromEntries(
          scenes.map((s) => [s.name, { exact: s.exact, banded: s.banded, counters: measured[s.name] }])
        ),
      },
      null,
      2
    )}\n`
  );
  console.log(`\nbench:render: wrote ${BASELINE.replace(/.*\//, '')}`);
  process.exit(0);
}

let baseline;
try {
  baseline = JSON.parse(await readFile(BASELINE, 'utf8'));
} catch {
  console.error('bench:render: no baseline — run bench:render:update and commit it');
  process.exit(1);
}

const problems = [];
for (const scene of scenes) {
  const was = baseline.scenes[scene.name];
  const now = measured[scene.name];
  if (!was) {
    console.log(`  ·  ${scene.name} is new — run bench:render:update`);
    continue;
  }
  for (const key of scene.exact) {
    const before = was.counters?.[key];
    if (before === undefined || now[key] === undefined) continue;
    if (before !== now[key]) {
      problems.push(`${scene.name}: ${key} ${before} → ${now[key]} (exact)`);
    }
  }
  for (const key of scene.banded) {
    const before = was.counters?.[key];
    if (before === undefined || now[key] === undefined) continue;
    const drift = Math.abs(now[key] - before) / Math.max(1, before);
    if (drift > BAND) {
      problems.push(
        `${scene.name}: ${key} ${before} → ${now[key]} ` +
          `(${(drift * 100).toFixed(0)}% drift, band ${(BAND * 100) | 0}%)`
      );
    }
  }
}

console.log('');
if (problems.length) {
  for (const problem of problems) console.log(`  FAIL  ${problem}`);
  console.log(
    `\n${problems.length} render regression(s). If intended, re-record with ` +
      '`npm run bench:render:update` and say why in the commit.'
  );
  process.exit(1);
}
console.log(`bench:render: ${scenes.length} scenes, no regressions ✓`);
