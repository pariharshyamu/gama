import { PerspectiveCamera, Vector3 } from 'three';
import { FollowCamera, Game, GameFeel, Shell, TouchControls } from 'gama3d';
import { createCourier, type Courier } from './courier';
import { createHud } from './hud';
import { startRun, type Run } from './run';
import { createSound } from './sound';
import { buildVillage, type Village } from './village';
import { createTownsfolk, type Townsfolk } from './townsfolk';

/**
 * Havenbrook Courier.
 *
 * Everything that is not the game — which panel is up, what Escape does,
 * where the settings live, what happens when the tab is hidden, where focus
 * goes — is GAMA's `Shell`. This file only says what a round IS.
 *
 * The markup carries `data-screen`, `data-shell` and `data-setting`; the
 * Shell finds it. There is no id-wrangling here because there is no longer
 * any to do.
 */

import type { Quality } from './quality';

interface Settings {
  quality: Quality;
  sound: boolean;
  length: number;
}

interface Best {
  score: number;
  delivered: number;
  seed: number;
}

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const seedBox = $<HTMLInputElement>('seed');
const randomSeed = () => 1 + Math.floor(Math.random() * 99998);

// ---- The engine, made once and reused for every round. Rebuilding the
// renderer per round leaks WebGL contexts, and browsers only give you so
// many before they drop the oldest — a bug that shows up on the eighth play
// and never in testing.
const game = new Game({ parent: $('app') });
game.camera = new PerspectiveCamera(56, window.innerWidth / window.innerHeight, 0.1, 400);
const feel = new GameFeel({ seed: 3 });
const hud = createHud();

let village: Village | null = null;
let courier: Courier | null = null;
let folk: Townsfolk | null = null;
let run: Run | null = null;
let camera: FollowCamera | null = null;
let seed = randomSeed();
let rollNext = false;

const shell = new Shell<Settings>({
  name: 'havenbrook',
  settings: { quality: 'medium', sound: true, length: 120 },
  onSettings: (s) => (sound.enabled = s.sound),
  onTeardown: teardown,
  onStart: buildRound,
  onFinish: showResults,
  onError: (e) => {
    console.error(e);
    hud.task('Something went wrong building that village — try another seed.');
  },
});

const sound = createSound(1, shell.settings.sound);
const bestSlot = shell.record<Best>('best');

// ---- A round ---------------------------------------------------------------

function teardown(): void {
  run?.dispose();
  run = null;
  hud.show(false);
  // Everything is rebuilt from the seed, so a round is torn down wholesale
  // rather than reset piecemeal.
  game.world.clear();
  const scene = game.world.scene;
  while (scene.children.length) scene.remove(scene.children[0]);
  courier = null;
  folk = null;
  camera = null;
  village = null;
}

function buildRound(): void {
  // "Go again" should be a new village. The seed box stays authoritative
  // for anyone who typed one in — it just moves on after a finished round.
  if (rollNext) {
    seed = randomSeed();
    seedBox.value = String(seed);
    rollNext = false;
  }
  const scene = game.world.scene;
  const { quality, length } = shell.settings;

  village = buildVillage(scene, seed, quality);
  courier = createCourier(scene, game.input, seed);
  courier.reset(new Vector3(village.depot.x - 3, 0, village.depot.z + 3));

  const crowd = quality === 'low' ? 8 : quality === 'medium' ? 14 : 22;
  folk = createTownsfolk(game.world, village.route, crowd, seed);

  camera = new FollowCamera(game.camera, courier.object, {
    offset: new Vector3(0, 11.5, 13),
    lookOffset: new Vector3(0, 1.2, 0),
    stiffness: 4.5,
  });
  camera.snap();

  run = startRun(scene, village, length, seed, {
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
    onOver: () => shell.finish(),
  });

  hud.task('Collect a parcel from the depot');
  hud.set(run.clock, 0, 0);
  hud.show(true);
  sound.unlock();
}

function showResults(): void {
  if (!run) return;
  rollNext = true;
  sound.over();
  const best = bestSlot.load();
  // A round worth nothing is not a personal best, however empty the save is.
  const isBest = run.score > 0 && (!best || run.score > best.score);
  if (isBest) bestSlot.save({ score: run.score, delivered: run.delivered, seed });

  $('results-title').textContent = isBest ? 'A new best round' : 'Round over';
  $('final-score').textContent = run.score.toLocaleString();
  $('final-stats').innerHTML =
    `<b>${run.delivered}</b> parcels delivered<br>village <b>${seed}</b>`;
  showBest();
}

function showBest(): void {
  const best = bestSlot.load();
  $('best').textContent = best
    ? `Best ${best.score.toLocaleString()} — ${best.delivered} parcels, village ${best.seed}`
    : '';
}

// ---- The frame -------------------------------------------------------------

const lastTarget = new Vector3();
let lastTick = -1;

game.onUpdate((time) => {
  // The one-line pause. Everything below runs on a delta that is zero unless
  // the round is live, so a paused game genuinely stops.
  const dt = shell.gate(Math.min(time.delta, 0.05));

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

    // The last five seconds tick once a second. A clock you can hear beats a
    // clock you have to look at while running.
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

// ---- The bits of the title screen that belong to THIS game ------------------

seedBox.value = String(seed);
seedBox.addEventListener('change', () => {
  const v = parseInt(seedBox.value, 10);
  seed = Number.isFinite(v) && v > 0 ? v : randomSeed();
  seedBox.value = String(seed);
});
$('reroll').addEventListener('click', () => {
  seed = randomSeed();
  seedBox.value = String(seed);
});
hud.onPause(() => shell.pause());

if (matchMedia('(pointer: coarse)').matches) {
  new TouchControls(game.input, {
    buttons: [{ label: 'RUN', code: 'ShiftLeft', css: 'right:26px;bottom:34px' }],
  });
}

showBest();
game.start();

// A tiny surface for the automated play-through that gates this build.
// It reports; it does not command.
(window as unknown as Record<string, unknown>).courierDebug = () => ({
  state: shell.state,
  screen: shell.screen,
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
