/**
 * INDUCTION — watch a transformer grow the circuit that lets it copy.
 *
 * The model is initialised, trained and drawn here, live. Nothing is loaded:
 * no weights, no assets, no fonts. What you see on the arcs at any moment is
 * the attention the forward pass computed for the sequence on the board, one
 * refresh ago.
 *
 * This file owns the loop and the wiring. `model.ts` is the transformer,
 * `scene.ts` is the geometry, `hud.ts` is the panel. The gates in `tools/`
 * check each of those against the thing it claims to be.
 */
import { Object3D, PerspectiveCamera, HemisphereLight, DirectionalLight, Color } from 'three';
import { Game, OrbitRig, Shell } from 'gama3d';
import {
  CONFIG, Rng, Transformer, circuitMass, headDim, sample, seqLen,
  type Config, type Sample,
} from './model';
import { PALETTE, Stack, meanEntropy } from './scene';
import { Panel, type HeadScore, type Point } from './hud';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const params = new URLSearchParams(location.search);

/**
 * Milliseconds of each frame given to training.
 *
 * Half of a 60 Hz frame. The other half has to cover a re-forward, repainting
 * every arc and the actual draw, and a camera that stutters while you are
 * trying to look at something is worse than a model that trains slower.
 * The gate overrides it to train headlessly at full speed.
 */
const FRAME_BUDGET_MS = Number(params.get('budget') ?? 8);
/** Scene repaint rate. Twelve is well under the frame rate and over the eye's
 *  threshold for "live"; every frame would spend the whole budget redrawing. */
const REFRESH_HZ = 12;
/** How often a point lands on the loss curve. */
const CURVE_EVERY = 50;
/** Sequences used to score the heads. One would be far too noisy to watch. */
const PROBE_SEEDS = [4242, 77, 1234];

const game = new Game({ parent: $('app'), antialias: true });
game.camera = new PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 400);
game.renderer.setClearColor(new Color(PALETTE.bg));

game.world.scene.add(new HemisphereLight(0x9fc4d8, 0x0a0f14, 1.5));
const key = new DirectionalLight(0xffffff, 1.35);
key.position.set(6, 12, -4);
game.world.scene.add(key);

// ---------------------------------------------------------------- the state

let cfg: Config = { ...CONFIG, mlp: params.get('mlp') === '1' };
let model = new Transformer(cfg, 7);
let stack = new Stack(cfg);
let panel = new Panel($('panel'), cfg);
let trainRng = new Rng(1);
let display: Sample = sample(cfg, new Rng(4242));
let probes: Sample[] = PROBE_SEEDS.map((s) => sample(cfg, new Rng(s)));
let history: Point[] = [];
let steps = 0;
let training = false;
let scaled = true;
let started = 0;
let refreshAt = 0;
/** Set by `?steps=N`: train to N and stop, so the gate has a finish line. */
const target = Number(params.get('steps') ?? 0);

const pivot = new Object3D();
game.world.scene.add(pivot);
game.world.scene.add(stack.group);

const rig = new OrbitRig(game.camera, pivot, game.input, {
  distance: 26,
  minDistance: 8,
  maxDistance: 70,
  minPitch: 0.12,
  maxPitch: 1.35,
  yaw: -0.62,
  pitch: 0.72,
  lookOffset: undefined,
});

function placeCamera(): void {
  const [cx, cy, cz] = stack.centre;
  pivot.position.set(cx, cy, cz);
  rig.distance = stack.span * 1.55;
}
placeCamera();

// ------------------------------------------------------------ the rebuild

/**
 * Swap in a fresh model. Turning the MLPs on or off changes which parameters
 * exist, so it cannot be done to a model mid-flight — the optimiser state and
 * the whole training history belong to the architecture that produced them.
 */
function rebuild(next: Partial<Config>): void {
  cfg = { ...cfg, ...next };
  game.world.scene.remove(stack.group);
  model = new Transformer(cfg, 7);
  stack = new Stack(cfg);
  game.world.scene.add(stack.group);
  panel = new Panel($('panel'), cfg);
  trainRng = new Rng(1);
  display = sample(cfg, new Rng(4242));
  probes = PROBE_SEEDS.map((s) => sample(cfg, new Rng(s)));
  history = [];
  steps = 0;
  started = performance.now();
  stack.setSample(display);
  placeCamera();
  refresh(true);
}

function newSequence(): void {
  display = sample(cfg, new Rng(1 + Math.floor(Math.random() * 99999)));
  stack.setSample(display);
  refresh(true);
}

// ------------------------------------------------------------- the numbers

/** What a head attending uniformly over its causal window would score. */
function chanceMass(): { induction: number; previous: number } {
  const n = seqLen(cfg);
  let ind = 0;
  let prev = 0;
  let count = 0;
  for (const s of probes) {
    for (let t = s.period; t < n; t++) {
      let targets = 0;
      for (let j = 1; j <= t; j++) if (s.tokens[j - 1] === s.tokens[t]) targets++;
      ind += targets / (t + 1);
      prev += 1 / (t + 1);
      count++;
    }
  }
  return { induction: ind / count, previous: prev / count };
}
let chance = chanceMass();

function scoreHeads(): HeadScore[] {
  const rows: HeadScore[] = [];
  for (let l = 0; l < cfg.layers; l++) {
    for (let h = 0; h < cfg.heads; h++) {
      rows.push({ layer: l, head: h, induction: 0, previous: 0, colour: stack.headColour(l, h) });
    }
  }
  for (const s of probes) {
    model.forward(s);
    for (const r of rows) {
      const cm = circuitMass(model.attention(r.layer, r.head), cfg, s);
      r.induction += cm.induction / probes.length;
      r.previous += cm.previous / probes.length;
    }
  }
  return rows;
}

function refresh(force = false): void {
  const now = performance.now();
  if (!force && now - refreshAt < 1000 / REFRESH_HZ) return;
  refreshAt = now;

  const heads = scoreHeads();

  // SCORE THE PROBES FIRST, THEN THE DISPLAY SEQUENCE. Both write into the
  // same activation caches, so whichever ran last is what `attention()`
  // returns — and the arcs would be drawn from a sequence that is not the one
  // on the board. Nothing about the picture would look wrong.
  const scale = scaled ? 1 : Math.sqrt(headDim(cfg));
  model.forward(display, scale);
  stack.refresh(model, display);

  panel.drawHeads(heads, chance);
  panel.drawCurve(history, Math.max(1, steps));

  const spread = meanEntropy((l, h) => model.attention(l, h), cfg);
  panel.setEntropy(spread.bits, spread.ceiling, scaled);

  panel.setStats(steps, history[history.length - 1], (performance.now() - started) / 1000);
}

// ---------------------------------------------------------------- the loop

let toastAt = 0;
function toast(msg: string): void {
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('on');
  toastAt = performance.now();
}

game.onUpdate(() => {
  rig.update(game.time.delta);

  if (training && (!target || steps < target)) {
    const until = performance.now() + FRAME_BUDGET_MS;
    do {
      model.trainStep(trainRng);
      steps++;
      if (steps % CURVE_EVERY === 0) {
        const ev = model.evaluate(new Rng(999), 8);
        history.push({ step: steps, cold: ev.lossCold, repeat: ev.lossRepeat });
      }
    } while (performance.now() < until);
    if (target && steps >= target) {
      training = false;
      syncSwitches();
    }
  }
  refresh();

  if (toastAt && performance.now() - toastAt > 4200) {
    $('toast').classList.remove('on');
    toastAt = 0;
  }
});

// -------------------------------------------------------------- the shell

const shell = new Shell({
  root: document.body,
  name: 'induction',
  onStart: () => {
    $('hud').classList.add('on');
    started = performance.now();
    steps = 0;
    history = [];
    chance = chanceMass();
    training = true;
    stack.setSample(display);
    refresh(true);
    syncSwitches();
  },
  onPause: (paused) => {
    if (paused) training = false;
  },
});

function syncSwitches(): void {
  const set = (name: string, on: boolean, label: string, danger = false) => {
    const b = document.querySelector<HTMLElement>(`[data-toggle="${name}"]`);
    if (!b) return;
    b.classList.toggle('on', on && !danger);
    b.classList.toggle('danger', danger);
    const strong = b.querySelector('b');
    if (strong) strong.textContent = label;
  };
  set('scale', scaled, scaled ? 'on' : 'OFF', !scaled);
  set('mlp', cfg.mlp, cfg.mlp ? 'on' : 'off');
  set('run', training, training ? 'on' : 'paused');
}

function toggleScale(): void {
  scaled = !scaled;
  syncSwitches();
  refresh(true);
  toast(
    scaled
      ? 'Divisor back on.'
      : 'Divisor off: the same logits, undivided. Dot products scale as √d_head, so the softmax saturates — the arcs go to one bright line per query and the gradient goes with them.',
  );
}

function toggleMlp(): void {
  rebuild({ mlp: !cfg.mlp });
  training = true;
  syncSwitches();
  toast(
    cfg.mlp
      ? 'MLPs on, training restarted. It will still learn the task — and watch no head end up readable.'
      : 'Attention-only, training restarted.',
  );
}

document.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest('[data-toggle],[data-act]');
  if (!el) return;
  const t = el.getAttribute('data-toggle');
  if (t === 'scale') toggleScale();
  else if (t === 'mlp') toggleMlp();
  else if (t === 'run') {
    training = !training;
    syncSwitches();
  } else if (el.getAttribute('data-act') === 'sample') newSequence();
});

window.addEventListener('keydown', (e) => {
  if (!$('hud').classList.contains('on')) return;
  if (e.code === 'Space') {
    e.preventDefault();
    training = !training;
    syncSwitches();
  } else if (e.code === 'KeyS') toggleScale();
  else if (e.code === 'KeyM') toggleMlp();
  else if (e.code === 'KeyN') newSequence();
});

window.addEventListener('resize', placeCamera);

stack.setSample(display);
refresh(true);
game.start();
void shell;

/**
 * The reporting surface the gate reads.
 *
 * It REPORTS and does not command: the play-through drives this app through
 * the same buttons and keys a person uses, so that what it verifies is what
 * ships. The one thing it can reach that a person cannot is `?steps=`, which
 * only sets a finish line.
 */
declare global {
  interface Window {
    inductionDebug?: () => unknown;
  }
}
window.inductionDebug = () => {
  // ORDER MATTERS AND IT COST TWO FALSE FAILURES. Both `evaluate` and
  // `scoreHeads` run forward passes, and a forward pass overwrites the
  // activation caches that `attention()` reads. Doing them after the display
  // forward meant the reported tensor came from the last evaluation sequence
  // while the arcs came from the one on the board — so the picture-vs-tensor
  // check compared a correct drawing against an unrelated matrix and called
  // the drawing a lie, and the divisor switch appeared to do nothing.
  //
  // So: everything that forwards happens first, and `refresh(true)` runs last.
  // It ends by forwarding the display sequence and painting the scene from
  // exactly those caches, which is what makes the comparison below meaningful.
  const ev = model.evaluate(new Rng(31337), 24);
  const heads = scoreHeads();
  refresh(true);
  const spread = meanEntropy((l, h) => model.attention(l, h), cfg);
  return {
    steps,
    training,
    scaled,
    mlp: cfg.mlp,
    layers: cfg.layers,
    heads: cfg.heads,
    loss: ev.loss,
    cold: ev.lossCold,
    repeat: ev.lossRepeat,
    chance,
    scores: heads.map((h) => ({
      layer: h.layer,
      head: h.head,
      induction: h.induction,
      previous: h.previous,
    })),
    entropy: spread.bits,
    entropyCeiling: spread.ceiling,
    tokens: [...display.tokens],
    period: display.period,
    // What the SCENE drew, read back off the colour buffer, so the gate can
    // compare the picture against the tensor instead of trusting they agree.
    drawn: stack.readback(cfg.layers - 1, cfg.heads - 1),
    attention: [...model.attention(cfg.layers - 1, cfg.heads - 1)],
  };
};
