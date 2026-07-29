/**
 * Does the whole workflow hold together?
 *
 * Not "does it render" — that is the docs site's job. This checks the three
 * claims the catalog seam makes:
 *
 *   1. an editor that has never heard of SCENA can place SCENA props,
 *      because the catalog described them;
 *   2. the file that editor writes is the file the GAME loads, and
 *      gameplay finds what it needs in it by tag;
 *   3. rebuilding an entity does not leak, which is measured by mounting
 *      the same editor twice — once with release off — and comparing what
 *      the renderer says it is holding.
 *
 *   node tools/verify.mjs
 */
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
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

const here = join(fileURLToPath(import.meta.url), '..');
const ROOT = join(here, '..', 'dist');
const OUT = process.env.SHOT_DIR ?? join(here, '..', '..', '.playground-shots');
const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = createServer(async (req, res) => {
  const raw = decodeURIComponent(req.url.split('?')[0]);
  const path = raw === '/' ? '/index.html' : raw;
  try {
    const body = await readFile(join(ROOT, path));
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('no');
  }
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}`;
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}),
  args: [
    '--no-sandbox',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--autoplay-policy=no-user-gesture-required',
  ],
});

const checks = [];
const check = (name, ok, detail = '') => {
  checks.push({ name, ok });
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${name}${detail ? `  — ${detail}` : ''}`);
};
const noise = [];
const benign = (t) => /favicon|404|Failed to load resource|WebGL.*deprecat|AudioContext/i.test(t);
const watch = (page) => {
  page.on('console', (m) => m.type() === 'error' && !benign(m.text()) && noise.push(m.text()));
  page.on('pageerror', (e) => noise.push(String(e)));
  return page;
};

// ============================================================ 1. the editor

const page = watch(await browser.newPage({ viewport: { width: 1360, height: 820 } }));
await page.goto(`${BASE}/editor.html`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => typeof window.editorDebug === 'function', { timeout: 30000 });
await page.waitForTimeout(6000); // SwiftShader, and eighty-five procedural props

const ed = await page.evaluate(() => window.editorDebug());
console.log('\neditorDebug()', ed, '\n');

check('the level loaded', ed.entities === 103, `${ed.entities} entities`);
check('every placement built', ed.built >= 103, `${ed.built} objects`);
check('the palette came from the catalog', ed.kinds >= 20, `${ed.kinds} kinds`);
check('gameplay markers survive the file', ed.addresses === 10 && ed.depots === 1 && ed.waypoints === 12,
  `${ed.addresses} doors, ${ed.depots} depot, ${ed.waypoints} waypoints`);
check('SCENA props report their own footprint', ed.blockers > 30 && ed.houseRadius > 1,
  `${ed.blockers} blockers, house r=${ed.houseRadius}`);
check('it drew a village', ed.draws > 100 && ed.triangles > 15000,
  `${ed.draws} draws, ${ed.triangles} tris`);

await page.screenshot({ path: join(OUT, 'game-editor.png'), timeout: 60000 });

// Select a house so the generated inspector — every row of which came out
// of the catalog, not out of the editor — is in the shot.
await page.locator('.ed-viewport canvas').click({ position: { x: 5, y: 5 } });
for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
await page.waitForTimeout(1500);
const picked = await page.evaluate(() => window.editorDebug());
check('cycling selects a real entity', picked.selection.length === 1, picked.selection.join(','));
// Five rows are the editor's own (id, position, yaw, scale, tags). Any
// more came out of the catalog's `fields`, which is the claim being made.
const rows = await page.locator('.ed-inspector .ed-row').count();
check('the inspector is generated from the catalog', rows > 5, `${rows} rows, 5 of them fixed`);
await page.screenshot({ path: join(OUT, 'game-editor-selected.png'), timeout: 60000 });

// ================================================== 2. the leak, measured

const tidy = await page.evaluate(() => window.editorStress(15));
console.log('\nrelease on ', tidy);
const leakPage = watch(await browser.newPage({ viewport: { width: 900, height: 600 } }));
await leakPage.goto(`${BASE}/editor.html?leak=1`, { waitUntil: 'networkidle' });
await leakPage.waitForFunction(() => typeof window.editorStress === 'function', { timeout: 30000 });
await leakPage.waitForTimeout(5000);
const leaky = await leakPage.evaluate(() => window.editorStress(15));
console.log('release off', leaky, '\n');

// A handful of geometries appear either way: forcing the house into the
// render list registers sub-meshes that were culled when `before` was
// taken. That is a constant, not a leak. The leak is the SLOPE — one
// house's worth of geometry per rebuild — and it is gone.
check('rebuilding an entity frees the old one', tidy.leaked <= 5,
  `${tidy.leaked} geometries left over after 15 rebuilds`);
check('and without release it would not have', leaky.leaked > tidy.leaked * 10,
  `${leaky.leaked} leaked with release:false — ${(leaky.leaked / Math.max(1, tidy.leaked)).toFixed(0)}× worse`);
await leakPage.close();

// ============================================== 3. the game loads that file

const play = watch(await browser.newPage({ viewport: { width: 1280, height: 720 } }));
await play.goto(`${BASE}/index.html?level=havenbrook`, { waitUntil: 'networkidle' });
await play.waitForTimeout(2000);
await play.click('[data-shell="play"]');
await play.waitForTimeout(9000);

const state = await play.evaluate(() => window.courierDebug?.() ?? null);
console.log('courierDebug()', state, '\n');
check('the game started on the authored level', !!state, state ? '' : 'no debug hook');
if (state) {
  check('it found the doors the file carries', state.houses === 10, `${state.houses} addresses`);
  check('the townsfolk got a route to walk', state.villagers > 0, `${state.villagers} villagers`);
  // Nobody is pressing keys, so the round is still in its collect phase —
  // and the target it is steering to is the depot marker THE FILE placed.
  // If the marker had not been read, this would be the origin.
  const away = Math.hypot(state.target[0], state.target[1]);
  check('the depot came out of the file', state.phase === 'collect' && away > 2,
    `phase ${state.phase}, target ${state.target}`);
  check('it is rendering the village', state.tris > 15000, `${state.tris} tris`);
}
await play.screenshot({ path: join(OUT, 'game-authored.png'), timeout: 60000 });

check('no console errors anywhere', noise.length === 0, noise.slice(0, 3).join(' | '));

await browser.close();
server.close();

const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
if (failed.length) process.exit(1);
