import { PerspectiveCamera, Vector3 } from 'three';
import { FollowCamera, Game, GameFeel, Shell, Soundboard, TouchControls } from 'gama3d';
import { buildWorld, type Quality, type World } from './world';
import { createPlayer, type Player } from './player';

/**
 * My Game.
 *
 * The round is: find five markers before the clock runs out. Everything
 * around it — title, settings that persist, pause on Escape and on losing
 * the tab, results, best score, a thumbstick on phones, focus handling — is
 * GAMA's `Shell`, driven by the data attributes in index.html.
 *
 * Delete the round and keep the rest. That is what this template is for.
 */

interface Settings {
  quality: Quality;
  sound: boolean;
  length: number;
}

interface Best {
  score: number;
  seconds: number;
}

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const randomSeed = () => 1 + Math.floor(Math.random() * 99998);

// ---- Engine ---------------------------------------------------------------
// Made ONCE and reused for every round. Rebuilding the renderer per round
// leaks WebGL contexts, and browsers only allow a handful before they start
// dropping the oldest — a bug that appears on the eighth play, never in
// testing.
const game = new Game({ parent: $('app') });
game.camera = new PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 300);
const feel = new GameFeel({ seed: 1 });
const sounds = new Soundboard({ seed: 1 });

let world: World | null = null;
let player: Player | null = null;
let camera: FollowCamera | null = null;
let seed = randomSeed();

// The round's own state. Keeping it in one object makes "start a fresh
// round" a single assignment instead of six.
let round = { clock: 0, found: 0, over: false };

const shell = new Shell<Settings>({
  name: 'my-game',
  settings: { quality: 'medium', sound: true, length: 60 },
  onSettings: (s) => sounds.setVolume(s.sound ? 1 : 0),
  onTeardown: teardown,
  onStart: startRound,
  onFinish: showResults,
  onError: (e) => console.error(e),
});

const bestSlot = shell.record<Best>('best');

// ---- A round --------------------------------------------------------------

function teardown(): void {
  $('hud').hidden = true;
  game.world.clear();
  const scene = game.world.scene;
  while (scene.children.length) scene.remove(scene.children[0]);
  world = null;
  player = null;
  camera = null;
}

function startRound(): void {
  seed = randomSeed();
  const scene = game.world.scene;

  world = buildWorld(scene, seed, shell.settings.quality);
  player = createPlayer(scene, game.input, seed);
  player.reset(new Vector3(0, 0, 0));

  camera = new FollowCamera(game.camera, player.object, {
    offset: new Vector3(0, 8.5, 10.5),
    lookOffset: new Vector3(0, 1.2, 0),
    stiffness: 4.5,
  });
  camera.snap();

  round = { clock: shell.settings.length, found: 0, over: false };
  $('hud').hidden = false;
  sounds.setVolume(shell.settings.sound ? 1 : 0);
  sounds.unlock();
}

function showResults(): void {
  const won = round.found >= 5;
  const taken = shell.settings.length - round.clock;
  const best = bestSlot.load();
  // A round worth nothing is not a personal best, however empty the save is.
  const isBest =
    round.found > 0 &&
    (!best || round.found > best.score || (round.found === best.score && taken < best.seconds));
  if (isBest) bestSlot.save({ score: round.found, seconds: Math.round(taken) });

  $('results-title').textContent = won ? 'All five found' : 'Out of time';
  $('final-score').textContent = String(round.found);
  $('final-stats').innerHTML = won
    ? `in <b>${taken.toFixed(1)}s</b>${isBest ? ' — a new best' : ''}`
    : 'markers found';
  showBest();
}

function showBest(): void {
  const best = bestSlot.load();
  $('best').textContent = best ? `Best: ${best.score} in ${best.seconds}s` : '';
}

// ---- The frame ------------------------------------------------------------

game.onUpdate((time) => {
  // The one-line pause: zero unless the round is actually live, so a paused
  // game genuinely stops instead of ticking quietly behind a panel.
  const dt = shell.gate(Math.min(time.delta, 0.05));

  if (dt > 0 && world && player && camera && !round.over) {
    player.update(dt, world);
    world.update(dt);

    // Collection: a plain distance test against each marker's live trigger.
    for (const pickup of world.pickups) {
      if (pickup.state !== 'idle') continue;
      const t = pickup.trigger;
      if (player.position.distanceTo(t.center as Vector3) > t.radius + 0.8) continue;
      pickup.collect();
      round.found++;
      feel.shake(0.25);
      sounds.coin({ volume: 0.5 });
    }

    round.clock -= dt;
    if (round.found >= 5 || round.clock <= 0) {
      round.clock = Math.max(0, round.clock);
      round.over = true;
      sounds[round.found >= 5 ? 'success' : 'fail']({ volume: 0.5 });
      shell.finish();
    }

    const clockEl = $('hud-clock');
    clockEl.textContent = round.clock < 10 ? round.clock.toFixed(1) : String(Math.ceil(round.clock));
    clockEl.classList.toggle('low', round.clock <= 10);
    $('hud-score').textContent = `${round.found}/5`;
    camera.update(dt);
  }

  feel.update(dt);
  feel.apply(game.camera);
});

// ---- Phones ---------------------------------------------------------------
// Only built where there is a touch screen, so a desktop player never gets a
// thumbstick painted over their game.
if (matchMedia('(pointer: coarse)').matches) {
  new TouchControls(game.input, {
    buttons: [{ label: 'RUN', code: 'ShiftLeft', css: 'right:26px;bottom:34px' }],
  });
}

showBest();
game.start();

// A small reporting surface, handy for automated play-throughs. It reports;
// it does not command.
(window as unknown as Record<string, unknown>).gameDebug = () => ({
  state: shell.state,
  screen: shell.screen,
  clock: Number(round.clock.toFixed(1)),
  found: round.found,
  seed,
  player: player ? [+player.position.x.toFixed(1), +player.position.z.toFixed(1)] : null,
  // Nearest marker still out there — what a HUD arrow would point at.
  next: nextMarker(),
  draws: game.renderer.info.render.calls,
});

function nextMarker(): [number, number] | null {
  if (!world || !player) return null;
  let best: [number, number] | null = null;
  let near = Infinity;
  for (const pickup of world.pickups) {
    if (pickup.state !== 'idle') continue;
    const p = pickup.group.position;
    const d = player.position.distanceTo(p);
    if (d < near) {
      near = d;
      best = [+p.x.toFixed(1), +p.z.toFixed(1)];
    }
  }
  return best;
}
