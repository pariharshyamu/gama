/**
 * Does the editor actually edit?
 *
 * The playground verifier answers "did this draw something". That is not
 * enough for a tool: an editor can render a beautiful scene and still lose
 * your work. So this drives the real page with real input — clicks a
 * palette button, clicks the viewport to place, drags something across the
 * map, nudges it with the keyboard, undoes the lot — and then checks the
 * file it produces.
 *
 * Usage:  node site/verify-editor.mjs
 */
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Playwright from wherever it is — it is not a dependency of this package. */
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
  throw new Error(`no playwright found; tried ${tries.join(', ')}`);
})();
const { chromium } = pw;

const here = join(fileURLToPath(import.meta.url), '..');
const ROOT = join(here, 'dist');
const OUT = process.env.SHOT_DIR ?? join(here, '..', '.playground-shots');
const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.md': 'text/markdown',
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
  args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const noise = [];
const benign = (t) => /favicon|404|Failed to load resource|WebGL.*deprecat/i.test(t);
page.on('console', (m) => m.type() === 'error' && !benign(m.text()) && noise.push(m.text()));
page.on('pageerror', (e) => noise.push(String(e)));

const checks = [];
const check = (name, ok, detail = '') => {
  checks.push({ name, ok, detail });
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${name}${detail ? `  — ${detail}` : ''}`);
};

await page.goto(`${BASE}/editor.html`, { waitUntil: 'networkidle' });
// A fresh browser has no stored level, but be explicit — a leftover one
// would make every count below a lie.
await page.evaluate(() => localStorage.removeItem('gama.editor.level'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForFunction(() => typeof window.editorDebug === 'function', { timeout: 20000 });
await page.waitForTimeout(2500); // SwiftShader needs a moment for a first frame

// ---- 1. it came up ---------------------------------------------------------
const first = await page.evaluate(() => window.editorDebug());
console.log('\neditorDebug()', first, '\n');
check('level loaded', first.entities === 13, `${first.entities} entities`);
check('everything built', first.built >= 13 && first.editable === 13, `built ${first.built}`);
check('palette generated from the catalog', first.paletteButtons === first.kinds, `${first.paletteButtons} buttons / ${first.kinds} kinds`);
check('it drew something', first.draws > 0 && first.triangles > 500, `${first.draws} draws, ${first.triangles} tris`);

// ---- 2. the pixels ---------------------------------------------------------
// A blank frame is a nearly-empty PNG. 40 kB of compressed pixels is not a
// proof of beauty, but it IS a proof that something is on the screen — and
// the file is eyeballed as well.
const shot = await page.screenshot({ path: join(OUT, 'editor.png'), timeout: 30000 });
check('screenshot has content', shot.length > 40000, `${(shot.length / 1024) | 0} kB png`);

// ---- 3. place from the palette --------------------------------------------
const box = await page.locator('.ed-viewport canvas').boundingBox();
const centre = { x: box.x + box.width / 2, y: box.y + box.height / 2 };

await page.locator('.ed-palette button[data-kind="barrel"]').click();
const armed = await page.locator('.ed-palette button[data-kind="barrel"]').getAttribute('aria-pressed');
check('palette arms a kind', armed === 'true');

await page.mouse.click(centre.x + 90, centre.y + 60);
await page.waitForTimeout(300);
const placed = await page.evaluate(() => window.editorDebug());
check('clicking the ground places it', placed.entities === 14, `${placed.entities} entities`);
check('the new thing is selected', placed.selection.length === 1, placed.selection.join(','));
check('the inspector drew its props', placed.inspectorRows >= 6, `${placed.inspectorRows} rows`);

// ---- 4. drag it ------------------------------------------------------------
const before = await page.evaluate(() => window.editorDebug().historyLength);
await page.mouse.move(centre.x + 90, centre.y + 60);
await page.mouse.down();
for (let i = 1; i <= 8; i++) {
  await page.mouse.move(centre.x + 90 - i * 14, centre.y + 60 - i * 6);
  await page.waitForTimeout(40);
}
await page.mouse.up();
await page.waitForTimeout(300);
const dragged = await page.evaluate(() => {
  const data = window.editorDebug();
  return { ...data, undo: data.undo };
});
check('a whole drag is one undo step', dragged.historyLength === before + 1, `${before} → ${dragged.historyLength}`);
check('the drag was a move', dragged.undo === 'Move', String(dragged.undo));

// ---- 5. the keyboard -------------------------------------------------------
await page.locator('.ed-viewport canvas').click({ position: { x: 5, y: 5 } });
await page.keyboard.press('Tab');
const cycled = await page.evaluate(() => window.editorDebug().selection);
check('Tab selects something', cycled.length === 1, cycled.join(','));

for (let i = 0; i < 6; i++) await page.keyboard.down('ArrowRight');
await page.keyboard.up('ArrowRight');
await page.waitForTimeout(200);
const nudged = await page.evaluate(() => window.editorDebug());
check('a burst of nudges is one step', nudged.undo === 'Move', String(nudged.undo));

// ---- 6. the round trip, driven through the real editor ---------------------
const selfTest = await page.evaluate(() => window.editorSelfTest());
console.log('\neditorSelfTest()', selfTest, '\n');
check('place / duplicate / delete all worked', selfTest.placed && selfTest.duplicated === 1 && selfTest.changed);
check('undo walked the whole stack back', selfTest.steps >= 5, `${selfTest.steps} steps`);
check('the file came back exactly', selfTest.restored === true);

// ---- 7. the inspector, with something actually selected -------------------
await page.evaluate(() => window.editorDebug());
await page.mouse.click(centre.x + 130, centre.y - 55); // the hall
await page.waitForTimeout(600);
const clicked = await page.evaluate(() => window.editorDebug());
check('clicking a building selects it', clicked.selection.length === 1, clicked.selection.join(','));
check('its props are in the inspector', clicked.inspectorRows >= 10, `${clicked.inspectorRows} rows`);
await page.screenshot({ path: join(OUT, 'editor-selected.png'), timeout: 30000 });

// ---- 8. it survives a reload ----------------------------------------------
await page.evaluate(() => window.editorDebug());
await page.reload({ waitUntil: 'networkidle' });
await page.waitForFunction(() => typeof window.editorDebug === 'function', { timeout: 20000 });
await page.waitForTimeout(1500);
const restored = await page.evaluate(() => window.editorDebug());
check('work survives a refresh', restored.entities === 14, `${restored.entities} entities`);

// ---- 8. nothing screamed ---------------------------------------------------
check('no console errors', noise.length === 0, noise.slice(0, 3).join(' | '));

await page.screenshot({ path: join(OUT, 'editor-after.png'), timeout: 30000 });
await writeFile(
  join(OUT, 'editor-report.json'),
  `${JSON.stringify({ first, placed, dragged, selfTest, restored, noise }, null, 2)}\n`
);

await browser.close();
server.close();

const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
if (failed.length) process.exit(1);
