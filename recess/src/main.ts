import { PerspectiveCamera, Vector3 } from 'three';
import { Game, GameFeel, Shell, TouchControls } from 'gama3d';
import { buildArena, type Arena } from './arena';
import { createContestant, type Contestant } from './contestant';
import { buildGreenLight, FINISH_Z, START_Z, type GreenLight } from './greenlight';
import { buildPanes, ROWS, START_AT, type Panes } from './panes';
import { buildMarbles, type Marbles } from './marbles';
import { createHud } from './hud';
import { createSound } from './sound';

/**
 * RECESS — three childhood games with the stakes moved.
 *
 * Everything that is not the game — which panel is up, what Escape does, where
 * focus goes, what happens when the tab is hidden — is GAMA's `Shell`. This
 * file says what a ROUND is and hands the camera to whichever one is running.
 *
 * The three rounds are deliberately three different games rather than one game
 * three times: a reflex test, a decision under uncertainty, and a reading of
 * another person. Each is built on a published number rather than on a
 * difficulty curve I tuned by feel, and each round's own file says which.
 */

interface Settings {
  crowd: 'full' | 'medium' | 'low';
  sound: boolean;
}

interface Best {
  round: number;
  seed: number;
}

type RoundId = 1 | 2 | 3;

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
/**
 * `?probe=1` opens the answer key to the automated play-through, and nothing
 * else. Round two is an honest coin twelve times over, so a bot that guesses
 * reaches round three about once in four thousand runs — which would leave the
 * round nobody can verify being the one the whole game is built around.
 */
const PROBE = new URLSearchParams(location.search).get('probe') === '1';
const randomSeed = () => 1 + Math.floor(Math.random() * 99998);

// One engine for the whole session. Rebuilding the renderer per round leaks
// WebGL contexts, and browsers only give you so many before they drop the
// oldest — a bug that shows up on the eighth play and never in testing.
const game = new Game({ parent: $('app') });
game.camera = new PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 300);
const feel = new GameFeel({ seed: 4 });
const hud = createHud();

let arena: Arena | null = null;
let player: Contestant | null = null;
let field: GreenLight | null = null;
let bridge: Panes | null = null;
let table: Marbles | null = null;
let round: RoundId = 1;
let seed = randomSeed();
let reached = 1;
let outcome: 'won' | 'lost' | null = null;
/** Seconds left on the interstitial between rounds; 0 means play. */
let curtain = 0;
let curtainNext: RoundId | null = null;
let clock = 0;

const shell = new Shell<Settings>({
  name: 'recess',
  settings: { crowd: 'medium', sound: true },
  onSettings: (s) => (sound.enabled = s.sound),
  onTeardown: teardown,
  onStart: () => {
    seed = randomSeed();
    $('seed-shown').textContent = String(seed);
    round = 1;
    reached = 1;
    outcome = null;
    buildRound(1);
  },
  onFinish: showResults,
  onError: (e) => {
    console.error(e);
    hud.task('Something went wrong building that round.');
  },
});

const sound = createSound(3, shell.settings.sound);
const bestSlot = shell.record<Best>('best');

// ---- Rounds -----------------------------------------------------------------

function clearRound(): void {
  field?.dispose();
  bridge?.dispose();
  table?.dispose();
  player?.dispose();
  field = null;
  bridge = null;
  table = null;
  player = null;
}

function teardown(): void {
  clearRound();
  arena?.dispose();
  arena = null;
  hud.show(false);
  hud.choices('none');
  game.world.clear();
  const scene = game.world.scene;
  while (scene.children.length) scene.remove(scene.children[0]);
}

const rivalCount = () => ({ full: 22, medium: 14, low: 7 })[shell.settings.crowd];

/** Edge state for the step key, latched across round boundaries — see below. */
let heldStep = false;

function buildRound(n: RoundId): void {
  clearRound();
  round = n;
  // A KEY HELD ACROSS A ROUND BOUNDARY IS NOT A PRESS IN THE NEW ROUND.
  //
  // You finish Green Light at a dead run, which means W is down at the moment
  // Panes is built — and Panes reads a W as "step onto the pane you have
  // selected", so the round began by walking you onto row zero on whichever
  // side happened to be the default, before you had seen the bridge. Latching
  // this true makes the edge detector wait for a release first.
  heldStep = true;
  reached = Math.max(reached, n);
  clock = 0;
  const scene = game.world.scene;
  if (!arena) arena = buildArena(scene);
  arena.lamp.intensity = 0;
  arena.key.intensity = 1.5;
  arena.setPit(n === 2);

  if (n === 1) {
    player = createContestant({ seed: 1, number: 1, at: new Vector3(0, 0, START_Z) });
    scene.add(player.object);
    field = buildGreenLight(scene, arena, {
      seed,
      rivals: rivalCount(),
      onCaught: (_who, wasPlayer) => {
        sound.caught();
        feel.shake(wasPlayer ? 0.6 : 0.12);
        if (wasPlayer) fail();
      },
      onWin: () => {
        sound.win();
        toRound(2);
      },
    });
    hud.round(1, 'Green Light');
    hud.task('Hold W to run. Let go BEFORE it finishes turning — you still have to stop.');
    hud.gaugeOff();
  } else if (n === 2) {
    player = createContestant({
      seed: 1,
      number: 1,
      at: new Vector3(START_AT.x, START_AT.y, START_AT.z),
    });
    scene.add(player.object);
    bridge = buildPanes(scene, arena, {
      seed,
      scouts: Math.max(3, Math.round(rivalCount() / 3)),
      onShatter: (_row, _side, wasPlayer) => {
        sound.shatter();
        feel.shake(wasPlayer ? 0.5 : 0.15);
      },
      onStep: () => sound.step(),
      onWin: () => {
        sound.win();
        toRound(3);
      },
      onLose: fail,
    });
    hud.round(2, 'Panes');
    hud.task('A and D pick a pane. W steps. One of each pair holds — let someone else find out.');
    hud.gaugeOff();
  } else {
    player = createContestant({ seed: 1, number: 1, at: new Vector3(0, 0, 0.2) });
    scene.add(player.object);
    player.object.visible = false; // First person, for one round only.
    table = buildMarbles(scene, {
      seed,
      onResolve: (right) => {
        if (right) sound.win();
        else sound.lose();
        feel.shake(right ? 0.12 : 0.3);
      },
      onOver: (win) => {
        if (win) {
          outcome = 'won';
          sound.win();
          shell.finish();
        } else {
          fail();
        }
      },
    });
    hud.round(3, 'Marbles');
    hud.task('They say what they hold. Sometimes they lie — and lying is work.');
  }
  hud.show(true);
  sound.unlock();
}

function toRound(next: RoundId): void {
  curtain = 2.6;
  curtainNext = next;
  hud.signal(next === 2 ? 'ROUND TWO' : 'ROUND THREE');
}

function fail(): void {
  if (outcome) return;
  outcome = 'lost';
  sound.lose();
  curtain = 2.2;
  curtainNext = null;
  hud.signal('ELIMINATED', true);
}

function showResults(): void {
  const best = bestSlot.load();
  if (!best || reached > best.round) bestSlot.save({ round: reached, seed });
  const won = outcome === 'won';
  $('results-title').textContent = won ? 'You walked out' : 'Eliminated';
  $('final-round').textContent = won ? 'All three' : `Round ${reached}`;
  $('final-stats').innerHTML = won
    ? 'Reflex, nerve and a reading. Seed <b>' + seed + '</b>.'
    : `You got as far as round <b>${reached}</b>. Seed <b>${seed}</b>.`;
  showBest();
  hud.show(false);
  hud.choices('none');
}

function showBest(): void {
  const best = bestSlot.load();
  $('best').textContent = best ? `Best — round ${best.round} (seed ${best.seed})` : '';
}

// ---- Camera -----------------------------------------------------------------

const camAt = new Vector3();
const camLook = new Vector3();

function placeCamera(dt: number): void {
  if (!player) return;
  const p = player.object.position;
  if (round === 1) {
    camAt.set(p.x * 0.35, 4.1, p.z - 9.5);
    camLook.set(p.x * 0.2, 1.7, Math.min(p.z + 22, FINISH_Z + 9));
  } else if (round === 2) {
    // Rides with the deck, so the drop stays in frame when a pane goes.
    // High and angled down, so the drop under the panes is in shot. A camera
    // level with the deck hides the one thing the round is about.
    camAt.set(p.x * 0.5, START_AT.y + 4.4, p.z - 5.6);
    camLook.set(0, START_AT.y - 2.4, p.z + 6);
  } else {
    // Round three is a face at conversational distance, because the whole
    // round is a measurement you take with your eyes.
    camAt.set(0, 1.6, 1.16);
    camLook.set(0, 1.6, 2.05);
  }
  // Snap on a round change, glide otherwise: a camera that eases across a cut
  // flies the length of the hall in front of the player.
  const k = dt > 0 ? Math.min(1, dt * 6) : 1;
  game.camera.position.lerp(camAt, cameraSnap ? 1 : k);
  game.camera.lookAt(camLook);
  cameraSnap = false;
}
let cameraSnap = true;

// ---- The frame --------------------------------------------------------------

game.onUpdate((time) => {
  const dt = shell.gate(Math.min(time.delta, 0.05));

  // The interstitial runs on real time, not gated time, so the "ELIMINATED"
  // card still counts down while the world is frozen behind it.
  if (curtain > 0) {
    curtain -= Math.min(time.delta, 0.05);
    if (curtain <= 0) {
      hud.signal(null);
      if (curtainNext) {
        buildRound(curtainNext);
        cameraSnap = true;
        curtainNext = null;
      } else {
        shell.finish();
      }
    }
  }

  const live = dt > 0 && curtain <= 0;
  if (live) clock += dt;

  if (round === 1 && field && player) {
    const running = game.input.isDown('KeyW') || game.input.isDown('ArrowUp');
    field.update(live ? dt : 0, player, running);
    player.update(dt);
    const red = field.phase === 'red';
    const turning = field.phase === 'turning';
    hud.signal(red ? 'RED' : turning ? 'TURNING' : 'GREEN', red || turning);
    hud.stat(
      `${field.alive}/${field.total} left`,
      `${Math.max(0, FINISH_Z - player.object.position.z).toFixed(0)} m`,
    );
    if (live && (field.phase === 'green' || turning)) sound.tick(field.warning);
  } else if (round === 2 && bridge && player) {
    const step = game.input.isDown('KeyW') || game.input.isDown('ArrowUp');
    if (live) {
      if (game.input.isDown('KeyA') || game.input.isDown('ArrowLeft')) bridge.choose(-1);
      if (game.input.isDown('KeyD') || game.input.isDown('ArrowRight')) bridge.choose(1);
      if (step && !heldStep) bridge.advance();
    }
    heldStep = step;
    bridge.update(live ? dt : 0, player);
    player.update(dt);
    hud.signal(bridge.side < 0 ? '◀ LEFT' : 'RIGHT ▶');
    hud.stat(`${Math.max(0, bridge.row + 1)}/${ROWS} panes`, `${bridge.known} known`);
  } else if (round === 3 && table && arena) {
    table.update(live ? dt : 0, arena);
    hud.signal(
      table.beat === 'declare' || table.beat === 'call' ? `THEY SAY ${table.claim.toUpperCase()}` : null,
    );
    hud.stat(`you ${table.yours} · them ${table.theirs}`, `hand ${table.hand}`);
    hud.gauge(table.settled ? table.pupilMm : null, table.baselineMm, table.holdsLeft);
    hud.choices(table.beat === 'call' ? 'marbles' : 'none');
    if (table.lastResult) hud.task(table.lastResult);
  }

  placeCamera(dt);
  feel.update(Math.min(time.delta, 0.05));
  feel.apply(game.camera);
});

// ---- Input that is not movement ---------------------------------------------

hud.onChoice((which) => {
  if (!table) return;
  if (which === 'hold') {
    table.hold();
    sound.lamp();
  } else table.answer(which === 'believe');
});
hud.onPause(() => shell.pause());

addEventListener('keydown', (e) => {
  if (!table || shell.state !== 'playing') return;
  if (e.code === 'KeyH') {
    table.hold();
    sound.lamp();
  }
  if (e.code === 'KeyB') table.answer(true);
  if (e.code === 'KeyN') table.answer(false);
});

if (matchMedia('(pointer: coarse)').matches) {
  new TouchControls(game.input, {
    buttons: [
      { label: 'GO', code: 'KeyW', css: 'right:26px;bottom:34px' },
      { label: '◀', code: 'KeyA', css: 'right:150px;bottom:34px' },
      { label: '▶', code: 'KeyD', css: 'right:92px;bottom:34px' },
    ],
  });
}

$('seed-shown').textContent = String(seed);
showBest();
game.start();

// A reporting surface for the automated play-through that gates this build.
// It reports; it does not command.
(window as unknown as Record<string, unknown>).recessDebug = () => ({
  state: shell.state,
  screen: shell.screen,
  round,
  reached,
  outcome,
  curtain: Number(curtain.toFixed(2)),
  clock: Number(clock.toFixed(1)),
  greenlight: field
    ? {
        phase: field.phase,
        turn: Number(field.turnProgress.toFixed(2)),
        alive: field.alive,
        total: field.total,
        caught: field.caught,
        lethality: Number(field.lethality.toFixed(2)),
        watch: field.watch,
        profile: PROBE ? field.profile : null,
        z: player ? Number(player.object.position.z.toFixed(1)) : null,
        speed: player ? Number(player.speed.toFixed(2)) : null,
      }
    : null,
  panes: bridge
    ? {
        row: bridge.row,
        side: bridge.side,
        known: bridge.known,
        alive: bridge.alive,
        next: PROBE ? bridge.peek(bridge.row + 1) : null,
        locks: bridge.locks,
        lastStep: bridge.lastStep,
      }
    : null,
  marbles: table
    ? {
        beat: table.beat,
        claim: table.claim,
        yours: table.yours,
        theirs: table.theirs,
        hand: table.hand,
        steady: table.steady,
        settled: table.settled,
        holds: table.holdsLeft,
        pupil: Number(table.pupilMm.toFixed(2)),
        baseline: Number(table.baselineMm.toFixed(2)),
        bluffing: PROBE ? table.bluffing : null,
      }
    : null,
  keys: {
    w: game.input.isDown('KeyW'),
    a: game.input.isDown('KeyA'),
    d: game.input.isDown('KeyD'),
  },
  draws: game.renderer.info.render.calls,
  tris: game.renderer.info.render.triangles,
});
