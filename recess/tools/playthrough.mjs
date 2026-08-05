/**
 * The play-through that gates this build.
 *
 * It does not check that the page loaded. It PLAYS the game — all three rounds,
 * on the keyboard, reading the same reporting surface a human reads off the
 * HUD — and fails if any round cannot be completed or if the scene throws.
 *
 * A verifier that only asks "did a canvas appear" passes a game whose second
 * round is unwinnable, which is the failure this one exists to prevent.
 *
 *   node tools/playthrough.mjs            play, and shoot each round
 *   node tools/playthrough.mjs --keep     leave the browser numbers on stdout
 */
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = join(fileURLToPath(import.meta.url), '..');
const ROOT = join(here, '..', 'dist');
const OUT = process.env.SHOT_DIR ?? join(here, '..', '.shots');
const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = createServer(async (req, res) => {
  const raw = decodeURIComponent(req.url.split('?')[0]);
  const path = raw === '/' ? '/index.html' : raw;
  try {
    const b = await readFile(join(ROOT, path));
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
    res.end(b);
  } catch {
    res.writeHead(404).end('no');
  }
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}`;
await mkdir(OUT, { recursive: true });

const tries = [process.env.PLAYWRIGHT, 'playwright', 'playwright-core',
  '/opt/node22/lib/node_modules/playwright/index.mjs'].filter(Boolean);
let pw = null;
for (const t of tries) {
  try {
    pw = await import(t);
    break;
  } catch {}
}
if (!pw) throw new Error(`no playwright found; tried ${tries.join(', ')}`);
const { chromium } = pw;

const browser = await chromium.launch({
  ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}),
  args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

// EVERY error the scene throws is recorded and fails the run. A probe that
// swallows a ReferenceError reports a working game as a dead one, and a dead
// one as working.
const errs = [];
const benign = (t) =>
  /favicon|404|Failed to load resource|WebGL.*deprecat|AudioContext was not allowed/i.test(t);
page.on('pageerror', (e) => !benign(String(e)) && errs.push(`page: ${e}`));
page.on('console', (m) => {
  const t = m.text();
  if ((m.type() === 'error' || m.type() === 'warning') && !benign(t)) errs.push(`${m.type()}: ${t}`);
});

const read = () => page.evaluate(() => window.recessDebug?.() ?? { missing: true });
/**
 * Hold a key long enough for a frame to sample it.
 *
 * `keyboard.press` is about ten milliseconds and a frame is sixteen, so a
 * pressed key can go down and up between two polls of `isDown` and never
 * happen at all. This cost a round: the bot was choosing the correct pane
 * every time and stepping onto the other one.
 */
const tap = async (code, ms = 70) => {
  await page.keyboard.down(code);
  await page.waitForTimeout(ms);
  await page.keyboard.up(code);
};
const shoot = async (name) => writeFile(join(OUT, `${name}.png`), await page.screenshot());
const fail = (m) => {
  console.error(`FAILED: ${m}`);
  errs.push(m);
};

await page.goto(`${BASE}/index.html?probe=1`, { waitUntil: 'networkidle' });
await page.click('[data-shell="play"]');
await page.waitForTimeout(1200);

let s = await read();
if (s.missing) fail('no reporting surface — the game did not start');

// ---------------------------------------------------------------- ROUND ONE
//
// The bot plays the published number: run on green, and let go the INSTANT the
// turn starts. It has no reaction time of its own, so if it still gets caught
// the round is not winnable by anybody.
let held = false;
const holdW = async (on) => {
  if (on === held) return;
  held = on;
  if (on) await page.keyboard.down('KeyW');
  else await page.keyboard.up('KeyW');
};

let shotGreen = false;
let shotRed = false;
let lethality = null;
let peakCaught = 0;
let lastPhase = '';
let dumped = false;
for (let i = 0; i < 4000 && s.round === 1 && !s.outcome; i++) {
  s = await read();
  if (!s.greenlight) break;
  const { phase } = s.greenlight;
  if (lethality === null) lethality = s.greenlight.lethality;
  peakCaught = Math.max(peakCaught, s.greenlight.caught);
  if (process.env.TRACE && !dumped && s.greenlight.profile) {
    dumped = true;
    console.log('  rival profile (margin < 0 means they cannot stop in time):');
    for (const q of s.greenlight.profile) console.log(`    rt ${q.rt}  top ${q.top}  margin ${q.margin}`);
  }
  if (process.env.TRACE && phase !== lastPhase) {
    console.log(`  ${lastPhase} -> ${phase}  caught ${s.greenlight.caught}  alive ${s.greenlight.alive}  z ${s.greenlight.z}`);
    lastPhase = phase;
  }
  await holdW(phase === 'green' && s.curtain <= 0);
  if (phase === 'green' && !shotGreen && s.greenlight.z > 12) {
    await shoot('round1-green');
    shotGreen = true;
  }
  if (phase === 'red' && !shotRed && s.greenlight.caught > 0) {
    await shoot('round1-red');
    shotRed = true;
  }
  await page.waitForTimeout(24);
}
await holdW(false);
const r1 = s.greenlight;
console.log(
  `round 1  ${peakCaught} caught  lethality ${lethality}  (bot ${s.round > 1 || s.curtain > 0 ? 'crossed' : 'z=' + r1?.z})`,
);
if (!shotGreen) await shoot('round1-green');
if (!shotRed) await shoot('round1-red');
if (s.outcome === 'lost') fail('eliminated in round one while obeying the signal perfectly');

await page.waitForTimeout(3200); // the interstitial
s = await read();
if (s.round !== 2) fail(`did not reach round two (round=${s.round}, outcome=${s.outcome})`);

// ---------------------------------------------------------------- ROUND TWO
//
// STATE-DRIVEN, NOT SLEEP-DRIVEN. A step takes 0.34 s of GAME time, and
// headless under SwiftShader the game runs slower than the wall clock — so a
// fixed sleep after pressing W sometimes lands mid-step, the choose() is
// refused as committed, and the bot walks onto the pane it just decided
// against. That looked exactly like a broken round for three runs.
let shotPanes = false;
const settled = async () => {
  for (let i = 0; i < 120; i++) {
    const q = await read();
    if (!q.panes || q.outcome) return q;
    const l = q.panes.locks;
    if (l.stepping === 0 && l.falling === 0) return q;
    await page.waitForTimeout(40);
  }
  return read();
};

for (let i = 0; i < 200 && s.round === 2 && !s.outcome; i++) {
  s = await settled();
  if (!s.panes || s.outcome) break;
  if (s.panes.next === null) {
    fail('the answer key is not open — run with ?probe=1');
    break;
  }
  if (!shotPanes && s.panes.row >= 3) {
    await shoot('round2-panes');
    shotPanes = true;
  }
  // Hold the direction until the game agrees, then step.
  const want = s.panes.next;
  const key = want < 0 ? 'KeyA' : 'KeyD';
  await page.keyboard.down(key);
  for (let k = 0; k < 25; k++) {
    const q = await read();
    if (q.panes?.side === want) break;
    await page.waitForTimeout(35);
  }
  await page.keyboard.up(key);
  const before = s.panes.row;
  const committed = (await read()).panes?.side;
  await tap('KeyW');
  for (let k = 0; k < 60; k++) {
    const q = await read();
    if (!q.panes || q.outcome) break;
    if (q.panes.row > before) {
      if (process.env.TRACE) {
        console.log(`    step ${JSON.stringify(q.panes.lastStep)} wanted ${want} committed ${committed}`);
      }
      break;
    }
    await page.waitForTimeout(40);
  }
}
s = await read();
console.log(`round 2  row=${s.panes?.row ?? 'done'}  known=${s.panes?.known ?? '—'}`);
if (!shotPanes) await shoot('round2-panes');
if (s.outcome === 'lost') fail('fell in round two while stepping only on tempered panes');

await page.waitForTimeout(3200);
s = await read();
if (s.round !== 3) fail(`did not reach round three (round=${s.round}, outcome=${s.outcome})`);

// -------------------------------------------------------------- ROUND THREE
//
// The bot plays the actual thesis: hold the lamp, wait for the reflex to
// settle, and call a bluff when the pupil is wider than the light explains.
// If this does not beat chance the round is decoration.
const reads = [];
// Every frame under a SWINGING lamp, to measure how much noise the light
// injects. This is the round's thesis as a number: Moon & Spencer put the
// light at 5.5 mm across eight decades and Kahneman & Beatty put effort at
// 0.5, so if the swing does not swamp the tell the lamp is decoration.
const swingExcess = [];
let shotSteady = false;
let shotSwing = false;
for (let i = 0; i < 6000 && s.round === 3 && !s.outcome; i++) {
  s = await read();
  const m = s.marbles;
  if (!m) break;
  if (!m.steady && m.beat === 'declare') swingExcess.push(m.pupil - m.baseline);
  if (!shotSwing && m.beat === 'declare' && !m.steady) {
    await shoot('round3-swinging');
    shotSwing = true;
  }
  if (m.beat === 'declare' && !m.steady && m.holds > 0) await tap('KeyH');
  if (m.beat === 'call') {
    if (m.settled && !shotSteady) {
      await shoot('round3-steady');
      shotSteady = true;
    }
    // Half a millimetre is the whole task-evoked response, so a quarter of it
    // is the honest midpoint to split on.
    const excess = m.pupil - m.baseline;
    const believe = m.settled ? excess < 0.25 : true;
    if (m.settled) reads.push({ excess: +excess.toFixed(3), bluff: m.bluffing, called: !believe });
    await tap(believe ? 'KeyB' : 'KeyN');
    await page.waitForTimeout(240);
  }
  await page.waitForTimeout(25);
}
if (!shotSwing) await shoot('round3-swinging');
if (!shotSteady) await shoot('round3-steady');
const m = s.marbles;
const right = reads.filter((r) => r.called === r.bluff).length;
console.log(`round 3  you ${m?.yours ?? '—'} them ${m?.theirs ?? '—'}  ${right}/${reads.length} reads correct`);
for (const r of reads) console.log(`    excess ${r.excess} mm  bluff=${r.bluff}  called=${r.called}`);

// THE ROUND'S THESIS, AS TWO NUMBERS.
const span = swingExcess.length
  ? Math.max(...swingExcess) - Math.min(...swingExcess)
  : 0;
console.log(`  under a swinging lamp the pupil wanders ${span.toFixed(2)} mm against a 0.50 mm tell`);
if (!(span > 0.5)) {
  fail(`the swinging lamp only moved the pupil ${span.toFixed(2)} mm — it does not swamp the tell, so holding it buys nothing`);
}
if (reads.length && right < reads.length) {
  fail(`${reads.length - right} of ${reads.length} held-lamp reads were wrong — the tell is not readable even with the light fixed`);
}
if (!reads.length) fail('never got a settled reading — round three cannot be played as designed');
console.log(`outcome  ${s.outcome ?? 'still playing'}  reached round ${s.reached}`);
await page.waitForTimeout(2600);
s = await read();
await shoot('results');

if (s.reached < 3) fail(`never reached round three (reached ${s.reached})`);
console.log(`draws ${s.draws}  tris ${s.tris}`);

if (errs.length) {
  console.error(`\nPLAYTHROUGH FAILED (${errs.length}):`);
  for (const e of errs) console.error(`  - ${e}`);
}
await browser.close();
server.close();
process.exit(errs.length ? 1 : 0);
