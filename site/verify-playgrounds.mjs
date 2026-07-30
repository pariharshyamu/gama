/**
 * Does every playground example actually DRAW something?
 *
 * Ported from SCENA's verifier, which earned its shape the hard way. The
 * things it knows that a naive checker does not:
 *
 *   - a canvas existing and `gl.getError()` being zero are both true of a
 *     completely empty frame — only measuring a SCREENSHOT answers the
 *     question. (`gl.readPixels` reads back pure black: three.js leaves
 *     `preserveDrawingBuffer` off.)
 *   - the example runs inside an iframe; an error listener on the top page
 *     hears nothing when it throws. Listen on every frame.
 *   - under SwiftShader a heavy scene renders at seconds per frame, so a
 *     capture can take 10+ s. A short screenshot timeout makes every route
 *     throw, and a thrown capture prints as `distinct 0 / flattest 1` — the
 *     defaults of a row with no measurement, indistinguishable from a blank
 *     frame. Hence the generous SHOT_TIMEOUT and `why` on every failed row.
 *   - in a fallback chain, record EVERY path's error. A diagnosis built on
 *     the last error is a diagnosis of the backstop.
 *
 * GAMA additions:
 *   - Chromium launches with autoplay allowed, so examples that synthesize
 *     audio (Soundboard) get a RUNNING AudioContext with nobody clicking.
 *   - if an example's iframe defines `audioDebug()`, its numbers are printed
 *     and an all-zero energy report fails the row: sound is part of what
 *     "renders something" means here.
 *   - same for `railDebug()`: a train whose distance went NaN, or which ran
 *     through its station, leaves a perfectly good static track on screen.
 *     Both scored a clean row here before the probe was read.
 *   - same for `assetDebug()`: a pipeline example that quietly fell back to
 *     procedural geometry because every fetch 404'd still draws a scene, so
 *     the row is judged on what actually loaded and on whether instancing
 *     shared its geometry.
 *
 * Usage:  node site/verify-playgrounds.mjs [id ...]
 */
import { inflateSync } from 'node:zlib';

/** Minimal PNG reader — enough to measure a screenshot. */
function decodePng(buf) {
  let p = 8;
  let w = 0, h = 0, bitDepth = 8, colour = 6;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p);
    const type = buf.toString('ascii', p + 4, p + 8);
    const data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0); h = data.readUInt32BE(4);
      bitDepth = data[8]; colour = data[9];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    p += 12 + len;
  }
  if (bitDepth !== 8) throw new Error('only 8-bit PNGs');
  const channels = colour === 6 ? 4 : colour === 2 ? 3 : colour === 0 ? 1 : 0;
  if (!channels) throw new Error('unsupported colour type ' + colour);
  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * channels;
  const out = Buffer.alloc(h * stride);
  let rp = 0;
  for (let y = 0; y < h; y++) {
    const filter = raw[rp++];
    const row = raw.subarray(rp, rp + stride); rp += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? cur[x - channels] : 0;
      const b = prev ? prev[x] : 0;
      const c = prev && x >= channels ? prev[x - channels] : 0;
      let v = row[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const pp = a + b - c;
        const pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      cur[x] = v & 0xff;
    }
  }
  return { w, h, channels, data: out };
}

/** Does this image contain a picture, or one flat colour? */
function measure(png) {
  const { w, h, channels, data } = png;
  const counts = new Map();
  let sum = 0, sum2 = 0, n = 0;
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const i = (y * w + x) * channels;
      const r = data[i], g = data[i + 1] ?? r, b = data[i + 2] ?? r;
      const key = `${r >> 3},${g >> 3},${b >> 3}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      sum += lum; sum2 += lum * lum; n++;
    }
  }
  const top = [...counts.values()].sort((a, b) => b - a)[0] ?? n;
  return {
    distinct: counts.size,
    flattest: Number((top / n).toFixed(3)),
    stdev: Number(Math.sqrt(Math.max(0, sum2 / n - (sum / n) ** 2)).toFixed(2)),
    mean: Number((sum / n).toFixed(1)),
  };
}

/**
 * Playwright from wherever it is.
 *
 * Normally the devDependency, which is what makes this script runnable on a
 * fresh clone and in CI. The rest of the chain is for environments that ship
 * a global one instead — and every path's error is kept, because a diagnosis
 * built on the last failure in a fallback chain is a diagnosis of the
 * backstop.
 */
const pw = await (async () => {
  const tries = [process.env.PLAYWRIGHT, 'playwright', 'playwright-core',
    '/opt/node22/lib/node_modules/playwright/index.mjs'].filter(Boolean);
  for (const t of tries) {
    try { return await import(t); } catch { /* next */ }
  }
  throw new Error(`no playwright found; tried ${tries.join(', ')}`);
})();
const { chromium } = pw;
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = join(fileURLToPath(import.meta.url), '..');
const ROOT = join(here, 'dist');
const OUT = process.env.SHOT_DIR ?? join(here, '..', '.playground-shots');
const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.md': 'text/markdown', '.png': 'image/png', '.svg': 'image/svg+xml',
};
const server = createServer(async (req, res) => {
  const raw = decodeURIComponent(req.url.split('?')[0]);
  const path = raw === '/' ? '/index.html' : raw;
  try {
    const b = await readFile(join(ROOT, path));
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
    res.end(b);
  } catch { res.writeHead(404).end('no'); }
});
await new Promise((r) => server.listen(0, r));
const PORT = server.address().port;
const BASE = `http://localhost:${PORT}`;

await mkdir(OUT, { recursive: true });

const launch = () =>
  chromium.launch({
    ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}),
    args: [
      '--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
      // Nobody clicks in headless. Without this the AudioContext stays
      // suspended, the spectrum sits at zero, and the audio example fails
      // for reasons that are Chrome policy, not broken code.
      '--autoplay-policy=no-user-gesture-required',
    ],
  });
let browser = await launch();
const benign = (t) => /favicon|404|Failed to load resource|WebGL.*deprecat|pointer-lock|Unrecognized feature|AudioContext was not allowed to start|Blocked call to navigator.vibrate/i.test(t);

const only = process.argv.slice(2);
const page0 = await browser.newPage();
await page0.goto(`${BASE}/playground.html`, { waitUntil: 'networkidle' });
const ids = await page0.evaluate(() =>
  [...document.querySelectorAll('select option')].map((o) => o.value)
);
await page0.close();
const list = only.length ? only : ids;
console.log(`${list.length} example(s)\n`);

// A fresh browser every few examples — hygiene, not load-bearing. (SCENA's
// history: this was once believed to fix late-sweep blanks. The real cause
// was capture timeouts; see SHOT_TIMEOUT.)
const RECYCLE_EVERY = 10;

/** Examples whose probe only means something after they have run a while. */
const SETTLE = { railway: 14000 };

const rows = [];
let done = 0;
for (const id of list) {
  if (done > 0 && done % RECYCLE_EVERY === 0) {
    await browser.close();
    browser = await launch();
  }
  done++;
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();
  const errs = [];
  page.on('pageerror', (e) => !benign(String(e)) && errs.push(`page: ${e}`));
  page.on('console', (m) => {
    const t = m.text();
    if ((m.type() === 'error' || m.type() === 'warning') && !benign(t)) errs.push(`${m.type()}: ${t}`);
  });
  await page.goto(`${BASE}/playground.html?example=${id}`, { waitUntil: 'networkidle' });
  // Six seconds is enough to judge a particle burst or a steering agent. It
  // is not enough to judge a train: `railway` has not reached its first
  // station by then, so its probe would report "no arrivals" for a demo that
  // is working perfectly. Time to a verdict is a property of the example.
  await page.waitForTimeout(SETTLE[id] ?? 6000);

  const looksBlank = (m) => m.flattest > 0.985 && m.stdev < 1.5;
  const SHOT_TIMEOUT = 45000;
  // `body > canvas`, not `canvas`: a Hud radar is ALSO a canvas, nested in
  // the overlay div — a bare selector matches both and strict mode balks.
  // The renderer's canvas is the one the Game appends directly to body.
  const shootClip = async () => {
    const box = await page.frameLocator('iframe').locator('body > canvas').first().boundingBox();
    if (!box || box.width < 8 || box.height < 8) throw new Error('no canvas box');
    return page.screenshot({ clip: box, timeout: SHOT_TIMEOUT });
  };
  const shootElement = () =>
    page.frameLocator('iframe').locator('body > canvas').first().screenshot({ timeout: SHOT_TIMEOUT });

  let pix = { ok: false };
  const failures = [];
  for (let attempt = 0; attempt < 3 && !(pix.ok && !looksBlank(pix)); attempt++) {
    if (attempt) await page.waitForTimeout(1500);
    for (const [via, shoot] of [['page-clip', shootClip], ['element', shootElement]]) {
      try {
        const shot = await shoot();
        const m = measure(decodePng(shot));
        if (!pix.ok || looksBlank(pix)) pix = { ok: true, via, ...m };
        if (!looksBlank(m)) break;
      } catch (e) {
        failures.push(`${via}: ${String(e).split('\n')[0].slice(0, 80)}`);
      }
    }
  }
  if (!pix.ok && failures.length) pix.why = failures.join(' | ');
  // GAMA's playground shows a caught runner error in `.pg-error` — and a
  // caught error draws no scene, while the HUD an example mounted BEFORE
  // it threw still varies enough pixels to fool the blank check. So the
  // banner is part of the verdict, not decoration: the `juice` example
  // shipped its first draft with `scene is not defined` past the pixel
  // gate, and only an eyeball on the screenshot caught it.
  const banner = await page.evaluate(() => {
    const el = document.querySelector('.pg-error, #error, .error, [data-error], .runner-error');
    const text = el ? el.textContent.trim() : '';
    return text.slice(0, 160);
  });

  // If the example's iframe published audio evidence, collect and JUDGE it.
  // An offline render whose buffer holds nothing is a silent sound system,
  // and silence must fail the row the same way a blank frame does.
  let audio = null;
  let audioBad = false;
  let assets = null;
  let assetsBad = false;
  let net = null;
  let dialogue = null;
  let netBad = false;
  let dialogueBad = false;
  let rail = null;
  let railBad = false;
  const inner = page.frames().find((f) => f !== page.mainFrame());
  if (inner) {
    try {
      audio = await inner.evaluate(() =>
        typeof window.audioDebug === 'function' ? window.audioDebug() : null
      );
    } catch { /* no debug hook is the normal case */ }
    if (audio && typeof audio.offlineRms === 'number') {
      audioBad = !(audio.offlineRms > 1e-4) || !(audio.offlinePeak > 1e-3);
    }
    // Same idea for assets: a pipeline example that renders a scene it
    // built procedurally, because every fetch 404'd, is not passing.
    try {
      assets = await inner.evaluate(() =>
        typeof window.assetDebug === 'function' ? window.assetDebug() : null
      );
    } catch { /* ditto */ }
    try {
      net = await inner.evaluate(() =>
        typeof window.netDebug === 'function' ? window.netDebug() : null
      );
    } catch { /* ditto */ }
    // Dialogue is the one example whose subject is not pixels at all: it is a
    // graph walk. So the check WALKS it — pick the option that asks his name,
    // confirm the second visit no longer offers it — rather than looking at
    // the frame, which would be just as bright either way.
    try {
      dialogue = await inner.evaluate(async () => {
        if (typeof window.dialogueDebug !== 'function') return null;
        const at = () => window.dialogueDebug();
        const before = at();
        const buttons = () => [...document.querySelectorAll('button')];
        const click = (label) => {
          const button = buttons().find((b) => b.textContent.includes(label) && !b.disabled);
          if (button) button.click();
          return !!button;
        };
        const asked = click("Who's asking?");
        await new Promise((r) => setTimeout(r, 60));
        const named = at();
        click('Continue');
        await new Promise((r) => setTimeout(r, 60));
        const back = at();
        // Second time around the name option is gone: `toldName` gates it.
        const offeredAgain = buttons().some((b) => b.textContent.includes("Who's asking?"));
        return { before, named, back, asked, offeredAgain };
      });
    } catch { /* ditto */ }
    if (net) {
      // A multiplayer demo that renders two capsules because the netcode
      // fell back to reading the server's state directly is not a demo.
      // Prediction must run AHEAD of the server and interpolation BEHIND it,
      // and packets must actually have been dropped and survived.
      netBad =
        !net.ready || net.players !== 2 || net.mine !== 1 ||
        !(net.leadOwn > 0.05) || !(net.lagOther > 0.05) || !(net.serverTick > 30);
    }
    if (dialogue) {
      const { before, named, back, asked, offeredAgain } = dialogue;
      dialogueBad =
        // The lint must be clean, and every node reachable — an unreachable
        // line is content nobody will ever see.
        before.lintErrors !== 0 ||
        before.lintNodes !== before.lintReachable ||
        // Three coins: the pay option is SHOWN and DISABLED — locked, not
        // hidden, so the price is visible. The sneak route is hidden entirely.
        before.coins !== 3 || before.locked !== 1 || before.shown !== 4 ||
        !asked ||
        // Entering `name` set the flag, via an effect on the node.
        named.at !== 'name' || named.paid !== false ||
        back.at !== 'hail' || back.lines < 3 || back.choices !== 1 ||
        offeredAgain;
    }
    if (assets) {
      // Thirty-six crates and six lamps out of TWO loaded models: if the
      // geometry count scales with placements, instancing is not sharing.
      assetsBad =
        !(assets.loaded?.length >= 3) || !(assets.placed > 30) || !(assets.geometries < 12);
    }
    // And the railway: a train that never moves, or whose distance has gone
    // NaN, draws a perfectly good static track. Both of those shipped past
    // this gate once, because "renders something" is not "works" — a NaN
    // train (dt was a Time, not a number) and a train that ran through its
    // station both scored a clean row.
    try {
      rail = await inner.evaluate(() =>
        typeof window.railDebug === 'function' ? window.railDebug() : null
      );
    } catch { /* ditto */ }
    if (rail) {
      railBad =
        !Number.isFinite(rail.distance) || !Number.isFinite(rail.speed) ||
        !(rail.arrivals >= 1) || !(rail.worstOverrun < 0.5) ||
        !(rail.lineLength > 100) || !(rail.draws < 40);
    }
  }

  const blank = !pix.ok || (pix.flattest > 0.985 && pix.stdev < 1.5);
  rows.push({ id, blank, audioBad, assetsBad, netBad, dialogueBad, railBad, errs: errs.length, banner, ...pix });
  const flag = blank ? 'BLANK' : banner ? 'ERROR' : audioBad ? 'MUTE ' : assetsBad ? 'ASSET'
    : netBad ? ' NET ' : dialogueBad ? 'TALK ' : railBad ? 'RAIL ' : errs.length ? 'errs ' : '  ok ';
  console.log(
    `${flag} ${id.padEnd(16)} distinct ${String(pix.distinct ?? 0).padStart(5)}` +
    ` flattest ${String(pix.flattest ?? 1).padStart(5)} stdev ${String(pix.stdev ?? 0).padStart(6)}` +
    ` mean ${String(pix.mean ?? 0).padStart(5)}` +
    (audio ? `  AUDIO: ${JSON.stringify(audio).slice(0, 180)}` : '') +
    (assets ? `  ASSETS: ${JSON.stringify(assets).slice(0, 220)}` : '') +
    (net ? `  NET: ${JSON.stringify(net).slice(0, 260)}` : '') +
    (dialogue ? `  TALK: ${JSON.stringify(dialogue.back).slice(0, 240)}` : '') +
    (rail ? `  RAIL: ${JSON.stringify(rail).slice(0, 240)}` : '') +
    (pix.why ? `  WHY: ${pix.why}` : '') +
    (banner ? `  BANNER: ${banner}` : '') +
    (errs.length ? `\n        ${errs.slice(0, 3).join('\n        ')}` : '')
  );
  if (blank || banner || audioBad || assetsBad || netBad || dialogueBad || railBad || errs.length) await page.screenshot({ path: `${OUT}/pg-${id}.png` });
  await page.close();
  await context.close();
}

const bad = rows.filter(
  (r) => r.blank || r.banner || r.audioBad || r.assetsBad || r.netBad ||
    r.dialogueBad || r.railBad || r.errs
);
console.log(`\n${rows.length - bad.length}/${rows.length} render something.`);
if (bad.length) console.log('PROBLEMS:', bad.map((r) => r.id).join(', '));
await browser.close();
server.close();
process.exit(bad.length ? 1 : 0);
