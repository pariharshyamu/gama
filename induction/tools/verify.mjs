/**
 * The play-through: run the app, train it to the circuit, and check that the
 * picture agrees with the model.
 *
 * A verifier that only asks "did a canvas appear" would pass an arc diagram
 * drawing the wrong distribution — and an arc diagram is convincing whatever
 * numbers you feed it, which is the whole hazard of this kind of app. So the
 * last check reads the COLOUR BUFFER back out of the scene, inverts the
 * brightness mapping, and compares the result against the attention tensor the
 * forward pass produced. If those two ever disagree the picture is a lie, and
 * no screenshot would show it.
 *
 *   node tools/verify.mjs            train, check, and shoot
 *   STEPS=1500 node tools/verify.mjs quicker, for iterating
 */
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = join(fileURLToPath(import.meta.url), '..');
const ROOT = join(here, '..', 'dist');
const OUT = process.env.SHOT_DIR ?? join(here, '..', '.shots');
const STEPS = Number(process.env.STEPS ?? 4000);
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };

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

const browser = await pw.chromium.launch({
  ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}),
  args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errs = [];
const benign = (t) => /favicon|404|Failed to load resource|WebGL.*deprecat/i.test(t);
page.on('pageerror', (e) => !benign(String(e)) && errs.push(`page: ${e}`));
page.on('console', (m) => {
  const t = m.text();
  if ((m.type() === 'error' || m.type() === 'warning') && !benign(t)) errs.push(`${m.type()}: ${t}`);
});
const fail = (m) => {
  console.error(`FAILED: ${m}`);
  errs.push(m);
};
const read = () => page.evaluate(() => window.inductionDebug?.() ?? { missing: true });
const shoot = async (n) => writeFile(join(OUT, `${n}.png`), await page.screenshot());

// `budget` is the only knob the gate turns that a person cannot: it hands the
// whole frame to training instead of a slice, so a run that takes a minute of
// watching takes a minute of not watching.
await page.goto(`${BASE}/index.html?steps=${STEPS}&budget=400`, { waitUntil: 'networkidle' });
await page.click('[data-shell="play"]');
await page.waitForTimeout(1500);

let s = await read();
if (s.missing) {
  fail('no reporting surface — the app did not start');
} else {
  console.log(`start   ${s.layers} layers x ${s.heads} heads, ${s.mlp ? 'MLPs on' : 'attention-only'}`);
}

await shoot('01-start');

// ------------------------------------------------------------------- train
let last = -1;
let stalls = 0;
for (let i = 0; i < 900; i++) {
  s = await read();
  if (s.missing) break;
  if (s.steps >= STEPS) break;
  if (s.steps === last && ++stalls > 40) {
    fail(`training stalled at step ${s.steps}`);
    break;
  }
  if (s.steps !== last) stalls = 0;
  last = s.steps;
  if (i % 25 === 0) {
    console.log(`  ${String(s.steps).padStart(5)} steps   cold ${s.cold.toFixed(2)}   repeat ${s.repeat.toFixed(4)}`);
  }
  await page.waitForTimeout(500);
}
s = await read();
console.log(`trained ${s.steps} steps   cold ${s.cold.toFixed(3)}   repeat ${s.repeat.toFixed(4)} nats`);
await shoot('02-trained');

// ------------------------------------------------------------ the circuit
const best = { ind: null, prev: null };
for (const h of s.scores) {
  if (!best.ind || h.induction > best.ind.induction) best.ind = h;
  if (!best.prev || h.previous > best.prev.previous) best.prev = h;
}
for (const h of s.scores) {
  console.log(`  L${h.layer}H${h.head}  induction ${h.induction.toFixed(3)} (${(h.induction / s.chance.induction).toFixed(1)}x chance)  previous ${h.previous.toFixed(3)}`);
}
if (!(best.ind.induction > 0.5)) fail(`no induction head in the running app: best ${best.ind.induction.toFixed(3)}`);
if (best.ind.layer !== s.layers - 1) fail(`induction head is in layer ${best.ind.layer}, not the last`);
if (!(best.prev.previous > 0.5)) fail(`no previous-token head: best ${best.prev.previous.toFixed(3)}`);
if (best.prev.layer !== 0) fail(`previous-token head is in layer ${best.prev.layer}, not layer 0`);
if (!(s.repeat < s.cold / 10)) fail(`repeat loss ${s.repeat.toFixed(3)} is not an order of magnitude under cold ${s.cold.toFixed(3)}`);

// ------------------------------- does the PICTURE match the TENSOR? --------
{
  const n = Math.sqrt(s.attention.length);
  let worst = 0;
  let checked = 0;
  for (const arc of s.drawn) {
    const want = s.attention[arc.q * n + arc.k];
    worst = Math.max(worst, Math.abs(arc.w - want));
    checked++;
  }
  console.log(`picture vs tensor: ${checked} arcs, worst error ${worst.toExponential(2)}`);
  // The round trip is float32 in the colour buffer plus a gamma and its
  // inverse, so a few times 1e-6 is the floor. Anything at 1e-3 means the arcs
  // are being drawn from something other than the model's attention.
  if (!(worst < 1e-4)) {
    fail(`an arc is drawn with weight ${worst.toExponential(2)} away from the attention the model computed — the picture is not the model`);
  }
}

// ------------------------------------------------- the divisor, in the app
//
// HOW BIG A DROP COUNTS? Not a number I pick. Attention spread varies from one
// sequence to the next anyway, so first measure THAT — press "new sequence" a
// few times and record the range. The divisor has to move the number by more
// than the sequence does, or the switch is showing me nothing I could not get
// by looking at a different line.
//
// The margin is smaller here than in `laws`, and that is a real effect rather
// than a weak gate: this model TRAINED with the divisor in place, so its
// weights already produce logits scaled for the divided regime. Removing it at
// inference multiplies them by sqrt(d_head) and sharpens what is left. The
// clean, uncompensated collapse is the one `laws` measures on random vectors.
const wander = [];
for (let i = 0; i < 5; i++) {
  await page.keyboard.press('KeyN');
  await page.waitForTimeout(450);
  wander.push((await read()).entropy);
}
const spread = Math.max(...wander) - Math.min(...wander);

const before = await read();
await page.keyboard.press('KeyS');
await page.waitForTimeout(700);
const after = await read();
const drop = before.entropy - after.entropy;
console.log(
  `divisor on  ${before.entropy.toFixed(2)} bits of ${before.entropyCeiling.toFixed(2)}\n` +
    `divisor off ${after.entropy.toFixed(2)} bits   (drop ${drop.toFixed(2)})\n` +
    `across ${wander.length} different sequences the spread wanders ${spread.toFixed(2)} bits`,
);
await shoot('03-divisor-off');
if (!(after.scaled === false)) fail('the divisor switch did not take');
if (!(drop > 3 * spread)) {
  fail(
    `turning the divisor off moved the spread by ${drop.toFixed(2)} bits, against ${spread.toFixed(2)} bits of ordinary variation between sequences — not enough to call it the divisor's doing`,
  );
}
await page.keyboard.press('KeyS');
await page.waitForTimeout(500);

// A couple of framings for the eye.
await page.mouse.move(720, 450);
await page.mouse.down();
await page.mouse.move(980, 380, { steps: 12 });
await page.mouse.up();
await page.waitForTimeout(600);
await shoot('04-angle');

console.log('\n---');
console.log(`induction head      ${best.ind.induction.toFixed(3)}  L${best.ind.layer}H${best.ind.head}`);
console.log(`previous-token head ${best.prev.previous.toFixed(3)}  L${best.prev.layer}H${best.prev.head}`);
console.log(`repeat ${s.repeat.toFixed(4)} nats vs cold ${s.cold.toFixed(3)} (the task's floor)`);

if (errs.length) {
  console.error(`\nVERIFY FAILED (${errs.length}):`);
  for (const e of errs) console.error(`  - ${e}`);
}
await browser.close();
server.close();
process.exit(errs.length ? 1 : 0);
