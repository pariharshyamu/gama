import { PerspectiveCamera, Vector3 } from 'three';
import { FollowCamera, Game, GameFeel, GameFlow, TouchControls } from 'gama3d';
import { createCourier, type Courier } from './courier';
import { createHud } from './hud';
import { startRun, type Run } from './run';
import { createSound } from './sound';
import { buildVillage, type Village } from './village';
import { createTownsfolk, type Townsfolk } from './townsfolk';
import { loadBest, loadSettings, recordRun, saveSettings, type Settings } from './settings';

/**
 * Havenbrook Courier — the shell.
 *
 * This file is the part a library cannot give you and the part that decides
 * whether a thing is a game: which screen is up, what happens when the tab
 * is hidden, where the seed comes from, what a round is worth, and how you
 * get back to the title. GAMA's `GameFlow` owns the state machine so that
 * illegal moves (results → paused) are refused rather than smeared over.
 */

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

const settings: Settings = loadSettings();
const hud = createHud();
const sound = createSound(1, settings.sound);

// ---- The engine, made once and reused for every round. Rebuilding the
// renderer per round leaks WebGL contexts, and browsers only give you so
// many before they start dropping the oldest — a bug that shows up on the
// eighth play and never in testing.
const game = new Game({ parent: $('app'), antialias: settings.quality !== 'low' });
game.camera = new PerspectiveCamera(56, window.innerWidth / window.innerHeight, 0.1, 400);
const feel = new GameFeel({ seed: 3 });

let village: Village | null = null;
let courier: Courier | null = null;
let folk: Townsfolk | null = null;
let run: Run | null = null;
let camera: FollowCamera | null = null;
let seed = randomSeed();

const flow = new GameFlow({
  initial: 'title',
  onEnter: {
    title: () => {
      screenOnly('title');
      hud.show(false);
    },
    playing: () => {
      screenOnly(null);
      hud.show(true);
    },
    paused: () => screenOnly('paused'),
    results: () => {
      screenOnly('results');
      hud.show(false);
    },
  },
});

function randomSeed(): number {
  return 1 + Math.floor(Math.random() * 99998);
}

/** Exactly one panel visible, or none while playing. */
function screenOnly(id: string | null): void {
  for (const s of ['title', 'help', 'settings', 'paused', 'results', 'loading']) {
    $(s).classList.toggle('hidden', s !== id);
  }
}

function showBest(): void {
  const best = loadBest();
  $('best').textContent = best
    ? `Best ${best.score.toLocaleString()} — ${best.delivered} parcels, village ${best.seed}`
    : '';
}

// ---- Building a round -----------------------------------------------------

function teardown(): void {
  run?.dispose();
  run = null;
  // Everything in the world is disposable and everything is rebuilt from the
  // seed, so a round is torn down wholesale rather than reset piecemeal.
  game.world.clear();
  const scene = game.world.scene;
  while (scene.children.length) scene.remove(scene.children[0]);
  courier = null;
  folk = null;
  camera = null;
  village = null;
}

async function startRound(): Promise<void> {
  screenOnly('loading');
  // One frame for the loading panel to paint before the main thread is
  // taken for a second or two building a village.
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  teardown();
  const scene = game.world.scene;
  village = buildVillage(scene, seed, settings.quality);
  courier = createCourier(scene, game.input, seed);
  courier.reset(new Vector3(village.depot.x - 3, 0, village.depot.z + 3));

  const crowd = settings.quality === 'low' ? 8 : settings.quality === 'medium' ? 14 : 22;
  folk = createTownsfolk(game.world, village.route, crowd, seed);

  camera = new FollowCamera(game.camera, courier.object, {
    offset: new Vector3(0, 11.5, 13),
    lookOffset: new Vector3(0, 1.2, 0),
    stiffness: 4.5,
  });
  camera.snap();

  run = startRun(scene, village, settings.length, seed, {
    onCollect: (address) => {
      hud.task(`Deliver to No. ${address.number}`);
      hud.toast('Parcel');
      sound.collect();
    },
    onDeliver: (points, bonus, streak) => {
      hud.toast(`+${points}   +${bonus.toFixed(0)}s${streak > 1 ? `   ×${streak}` : ''}`);
      hud.task('Back to the depot');
      sound.deliver(streak);
      feel.shake(0.18);
    },
    onBump: () => {
      sound.bump();
      feel.shake(0.35);
    },
    onOver: () => finish(),
  });
  hud.task('Collect a parcel from the depot');
  hud.set(run.clock, 0, 0);

  sound.unlock();
  flow.to('playing');
}

function finish(): void {
  if (!run) return;
  sound.over();
  const isBest = recordRun({ score: run.score, delivered: run.delivered, seed });
  $('results-title').textContent = isBest ? 'A new best round' : 'Round over';
  $('final-score').textContent = run.score.toLocaleString();
  $('final-stats').innerHTML =
    `<b>${run.delivered}</b> parcels delivered<br>` +
    `village <b>${seed}</b>${isBest ? '' : ''}`;
  showBest();
  flow.to('results');
}

// ---- The frame ------------------------------------------------------------

const lastTarget = new Vector3();
let lastTick = -1;

game.onUpdate((time) => {
  // The one-line pause. Everything below runs on a delta that is zero
  // unless the round is actually live, so a paused game genuinely stops
  // rather than quietly ticking behind a panel.
  const dt = flow.gate(Math.min(time.delta, 0.05));

  if (village && courier) village.update(dt, courier.object);
  if (run && courier && folk && camera && village) {
    const sprinting = game.input.isDown('ShiftLeft') || game.input.isDown('ShiftRight');
    courier.update(dt, sprinting, village.blockers, village.bounds);
    const bumped = dt > 0 ? folk.collide(courier) : null;
    if (bumped) courier.bump(bumped);
    folk.update(dt, courier);
    run.update(dt, courier, bumped);

    if (dt > 0 && courier.speed > 0.6) sound.step(courier.speed > 5.5);
    hud.set(run.clock, run.score, run.streak);
    lastTarget.copy(run.target).setY(1.5);
    hud.aim(game.camera, run.over ? null : lastTarget);

    // The last five seconds tick, once a second. A clock you can hear is
    // worth more than a clock you have to look at while running.
    const whole = Math.ceil(run.clock);
    if (run.clock <= 5 && whole !== lastTick) {
      lastTick = whole;
      if (dt > 0) sound.tick();
    }

    camera.update(dt);
  }
  feel.update(dt);
  feel.apply(game.camera);
});

// ---- Wiring ---------------------------------------------------------------

function bindShell(): void {
  $('play').addEventListener('click', () => void startRound());
  $('again').addEventListener('click', () => {
    seed = randomSeed();
    $<HTMLInputElement>('seed').value = String(seed);
    void startRound();
  });
  $('to-title').addEventListener('click', () => {
    teardown();
    flow.to('title');
  });
  $('open-help').addEventListener('click', () => screenOnly('help'));
  $('close-help').addEventListener('click', () => screenOnly('title'));
  $('open-settings').addEventListener('click', () => screenOnly('settings'));
  $('close-settings').addEventListener('click', () => screenOnly('title'));

  $('reroll').addEventListener('click', () => {
    seed = randomSeed();
    $<HTMLInputElement>('seed').value = String(seed);
  });
  $<HTMLInputElement>('seed').addEventListener('change', (e) => {
    const v = parseInt((e.target as HTMLInputElement).value, 10);
    seed = Number.isFinite(v) && v > 0 ? v : randomSeed();
    (e.target as HTMLInputElement).value = String(seed);
  });

  const quality = $<HTMLSelectElement>('quality');
  const length = $<HTMLSelectElement>('length');
  const soundBox = $<HTMLInputElement>('sound');
  quality.value = settings.quality;
  length.value = String(settings.length);
  soundBox.checked = settings.sound;
  quality.addEventListener('change', () => {
    settings.quality = quality.value as Settings['quality'];
    saveSettings(settings);
  });
  length.addEventListener('change', () => {
    settings.length = Number(length.value);
    saveSettings(settings);
  });
  soundBox.addEventListener('change', () => {
    settings.sound = soundBox.checked;
    sound.enabled = soundBox.checked;
    saveSettings(settings);
  });

  const togglePause = () => {
    if (flow.state === 'playing' || flow.state === 'paused') flow.togglePause();
  };
  hud.onPause(togglePause);
  $('resume').addEventListener('click', togglePause);
  $('quit').addEventListener('click', () => finish());
  addEventListener('keydown', (e) => {
    if (e.code === 'Escape' || e.code === 'KeyP') togglePause();
  });

  // Losing the tab mid-round should pause, not hand back a round that ran
  // on without you. Browsers throttle rAF in a hidden tab, but not to zero.
  addEventListener('visibilitychange', () => {
    if (document.hidden && flow.state === 'playing') flow.togglePause();
  });

  // Touch: only built on a device that actually has one, so a desktop
  // player never gets a thumb-stick painted over their game.
  if (matchMedia('(pointer: coarse)').matches) {
    new TouchControls(game.input, {
      buttons: [{ label: 'RUN', code: 'ShiftLeft', css: 'right:26px;bottom:34px' }],
    });
  }
}

$<HTMLInputElement>('seed').value = String(seed);
showBest();
bindShell();
flow.to('title');
game.start();

// A tiny surface for the automated play-through that gates this build.
// It is not a cheat menu: it reports, it does not command.
(window as unknown as Record<string, unknown>).courierDebug = () => ({
  state: flow.state,
  clock: run ? Number(run.clock.toFixed(1)) : null,
  score: run?.score ?? null,
  delivered: run?.delivered ?? null,
  streak: run?.streak ?? null,
  phase: run?.phase ?? null,
  address: run?.address?.number ?? null,
  courier: courier ? [+courier.position.x.toFixed(1), +courier.position.z.toFixed(1)] : null,
  target: run ? [+run.target.x.toFixed(1), +run.target.z.toFixed(1)] : null,
  villagers: folk?.count ?? 0,
  houses: village?.addresses.length ?? 0,
  seed,
  draws: game.renderer.info.render.calls,
  tris: game.renderer.info.render.triangles,
});
