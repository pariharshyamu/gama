import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Scene } from 'three';
import {
  EFFORT_DILATION,
  Floor,
  Locomotion,
  Pupils,
  createEyes,
  createHumanoid,
  pupilFor,
  type EyeProp,
  type HumanoidRig,
} from 'anima3d';
import { Rng } from 'gama3d';
import { PALETTE, type Arena } from './arena';

/**
 * ROUND THREE — Marbles.
 *
 * Odds or evens against one opponent, and they tell you which they are holding.
 * Sometimes they are lying. The round is whether you can tell.
 *
 * THE TELL IS NOT SHIFTY EYES, AND THAT IS THE POINT OF THE ROUND.
 *
 * Everybody knows liars avoid your gaze. It is the single most confidently held
 * belief about deception and it is not true — DePaulo et al.'s 2003
 * meta-analysis of a hundred and fifty-odd cues found gaze aversion essentially
 * unrelated to lying. A game built on it would be a game built on folklore.
 *
 * What DOES hold up is much duller and much more useful: lying is WORK. You
 * have to hold the truth and the story in mind at once and keep them apart.
 * Kahneman & Beatty (1966) put a number on mental effort by watching pupils,
 * and Hess & Polt (1964) got there first — the pupil dilates under cognitive
 * load, by about half a millimetre at full stretch.
 *
 * AND HALF A MILLIMETRE IS NOTHING NEXT TO THE LIGHT.
 *
 * Moon & Spencer (1944) has the pupil covering five and a half millimetres
 * across eight decades of luminance. Eleven times the effort signal. Which is
 * why every pupillometry protocol ever published fixes the luminance before it
 * measures anything, and it is why this round hands you a lamp:
 *
 *   the lamp swinging   the reflex swamps the tell. You are reading noise.
 *   the lamp held       the reflex settles, and half a millimetre is visible.
 *
 * You get three holds and there are five hands. That is the whole game: you
 * cannot afford to read them every time, so you have to choose when the
 * question is worth the answer.
 *
 * ANIMA 0.69.0 built the pupil and its gate proved exactly this — a mood is
 * 4.3x more readable with the light held still, and a control that answers to
 * mood and ignores the room gets the published result backwards. This round is
 * that gate, played.
 */

/** Luminance with the lamp steady, cd/m² — an ordinary indoor level. */
export const STEADY_LUX = 50;

/**
 * How long the light has to hold before a reading means anything, seconds.
 *
 * Redilation runs on a 1.6 s time constant and it is the slow direction, so a
 * reading taken a moment after the light moved is measuring the reflex still
 * catching up. Three time constants is settled.
 */
export const SETTLE_SECONDS = 2.4;

/** Marbles each. First to take them all, or to run out. */
export const STAKE = 5;
export const HOLDS = 3;

export type Beat = 'deal' | 'declare' | 'call' | 'reveal' | 'over';

export interface Marbles {
  readonly group: Group;
  readonly beat: Beat;
  /** Pupil diameter this frame, millimetres. What the player is looking at. */
  readonly pupilMm: number;
  /** What the pupil WOULD be from the light alone. The baseline to beat. */
  readonly baselineMm: number;
  /** True once the light has been still long enough to trust the number. */
  readonly settled: boolean;
  readonly steady: boolean;
  readonly holdsLeft: number;
  readonly claim: 'odd' | 'even';
  readonly yours: number;
  readonly theirs: number;
  readonly hand: number;
  readonly lastResult: string;
  /**
   * Whether this hand is a lie.
   *
   * THE ANSWER KEY. `main.ts` exposes it only behind `?probe=1`, so the gate
   * can check that the pupil actually separates a bluff from an honest hand
   * under a held lamp and actually fails to under a swinging one. A round built
   * on a published effect that turns out not to work in the build is the exact
   * thing this project keeps catching, and it is only ever caught by measuring.
   */
  readonly bluffing: boolean;
  readonly won: boolean;
  readonly lost: boolean;
  /** Hold the lamp still. Costs a hold, and only the first press in a hand. */
  hold(): void;
  /** Believe them, or call it. Only during `call`. */
  answer(believe: boolean): void;
  update(dt: number, arena: Arena): void;
  dispose(): void;
}

export interface MarblesOptions {
  seed: number;
  onResolve: (won: boolean, wasBluff: boolean) => void;
  onOver: (won: boolean) => void;
}

export function buildMarbles(scene: Scene, options: MarblesOptions): Marbles {
  const group = new Group();
  const rng = new Rng(options.seed * 17 + 3);

  // ---- The opponent. One face, close enough to read.
  const rig: HumanoidRig = createHumanoid({
    seed: 77,
    height: 1.74,
    accessories: 'none',
    colors: { top: 0x2f9e8f, bottom: 0x2f9e8f, boots: 0xf2f2f2 },
    hair: { style: 'side-part' },
    face: { facialHair: 'none' },
  });
  rig.object.position.set(0, 0, 2.05);
  rig.object.rotation.y = Math.PI;
  group.add(rig.object);

  // AN IDLE, OR THEY SIT THERE IN THE BIND POSE with their arms straight out.
  // Same bug as the Watcher, same cause: a rig with no controller keeps the
  // skeleton it was built with, and that skeleton is a T.
  const idle = new Locomotion(rig);

  const eyes: EyeProp = createEyes(rig);
  const pupils = new Pupils({ luminance: STEADY_LUX });
  // Their gaze runs on the conversational rule, so the face is alive between
  // hands rather than staring through you. It is NOT the tell — see above.
  const floor = new Floor({ role: 'speaking', seed: 5 });

  const table = new Mesh(
    new BoxGeometry(1.6, 0.06, 1.0),
    new MeshStandardMaterial({ color: PALETTE.trim, roughness: 0.6 }),
  );
  table.position.set(0, 0.86, 1.45);
  group.add(table);

  let beat: Beat = 'deal';
  let timer = 0.9;
  let claim: 'odd' | 'even' = 'odd';
  let bluffing = false;
  let yours = STAKE;
  let theirs = STAKE;
  let hand = 1;
  let holdsLeft = HOLDS;
  let steady = false;
  let stillFor = 0;
  let lastResult = '';
  let won = false;
  let lost = false;
  let swing = 0;
  let effort = 0;
  let since = 0;
  let untilEnd = 3;

  const deal = () => {
    // They pick a parity and decide whether to lie about it. The lie is the
    // only thing that drives effort, and effort is the only thing that drives
    // the pupil beyond what the light explains.
    const actual = rng.chance(0.5) ? 'odd' : 'even';
    bluffing = rng.chance(0.45);
    claim = bluffing ? (actual === 'odd' ? 'even' : 'odd') : actual;
    beat = 'declare';
    timer = 2.8;
    since = 0;
    untilEnd = timer;
  };

  scene.add(group);

  const self: Marbles = {
    group,
    get beat() {
      return beat;
    },
    get pupilMm() {
      return pupils.diameter;
    },
    get baselineMm() {
      return pupilFor(steady ? STEADY_LUX : swingLux(swing));
    },
    get settled() {
      return steady && stillFor >= SETTLE_SECONDS;
    },
    get steady() {
      return steady;
    },
    get holdsLeft() {
      return holdsLeft;
    },
    get claim() {
      return claim;
    },
    get yours() {
      return yours;
    },
    get theirs() {
      return theirs;
    },
    get hand() {
      return hand;
    },
    get bluffing() {
      return bluffing;
    },
    get lastResult() {
      return lastResult;
    },
    get won() {
      return won;
    },
    get lost() {
      return lost;
    },

    hold(): void {
      if (steady || holdsLeft <= 0 || beat === 'over') return;
      holdsLeft--;
      steady = true;
      stillFor = 0;
    },

    answer(believe: boolean): void {
      if (beat !== 'call') return;
      // Believing a bluff is wrong; calling an honest claim is wrong. The
      // pupil told you which, if you paid for it.
      const right = believe !== bluffing;
      if (right) {
        theirs--;
        yours++;
        lastResult = bluffing ? 'Called it. They were lying.' : 'Believed, and they were straight.';
      } else {
        yours--;
        theirs++;
        lastResult = bluffing ? 'They lied and you took it.' : 'They were straight and you doubted.';
      }
      options.onResolve(right, bluffing);
      beat = 'reveal';
      timer = 2.0;
    },

    update(dt: number, arena: Arena): void {
      if (dt <= 0) return;

      // ---- The lamp. Left alone it swings across decades of luminance, which
      // is what makes the round hard: the reflex is eleven times the tell.
      swing += dt * 0.9;
      const lux = steady ? STEADY_LUX : swingLux(swing);
      stillFor = steady ? stillFor + dt : 0;
      arena.lamp.intensity = steady ? 26 : 10 + 24 * (0.5 + 0.5 * Math.sin(swing * 2.1));
      arena.key.intensity = steady ? 1.15 : 0.5 + 1.4 * (0.5 + 0.5 * Math.sin(swing * 2.1));

      // ---- Effort. It rises while they are holding a lie together and falls
      // away once the hand is resolved. Nothing else touches it.
      const target = beat === 'declare' && bluffing ? 1 : beat === 'declare' ? 0.15 : 0;
      effort += (target - effort) * Math.min(1, dt * 1.6);
      pupils.update(dt, { luminance: lux, effort });

      // ---- The face.
      idle.update(dt, 0);
      since += dt;
      untilEnd = Math.max(0, untilEnd - dt);
      floor.update(dt, {
        role: beat === 'declare' ? 'speaking' : 'listening',
        untilEnd: beat === 'declare' ? untilEnd : undefined,
        since: beat === 'declare' ? since : undefined,
      });
      const t = floor.target;
      eyes.apply({
        lid: 0.08,
        gaze: t.pitch * 0.5,
        yaw: t.yaw * 0.6,
        pupil: pupils.diameter,
      });

      // ---- The beats.
      timer -= dt;
      if (beat === 'deal' && timer <= 0) deal();
      else if (beat === 'declare' && timer <= 0) {
        beat = 'call';
        timer = 99;
      } else if (beat === 'reveal' && timer <= 0) {
        // A hand ends and the lamp goes back to swinging. A hold buys you one
        // hand, not the match.
        steady = false;
        stillFor = 0;
        if (theirs <= 0) {
          won = true;
          beat = 'over';
          options.onOver(true);
        } else if (yours <= 0) {
          lost = true;
          beat = 'over';
          options.onOver(false);
        } else {
          hand++;
          beat = 'deal';
          timer = 1.0;
        }
      }
    },

    dispose(): void {
      rig.object.removeFromParent();
      rig.mesh.geometry.dispose();
      group.removeFromParent();
    },
  };
  return self;
}

/**
 * The swinging lamp, in cd/m².
 *
 * It crosses two and a half decades, which is not dramatic by daylight
 * standards and is already far more than the half millimetre of effort can
 * survive. That asymmetry is the round.
 */
function swingLux(phase: number): number {
  const s = 0.5 + 0.5 * Math.sin(phase * 2.1);
  return Math.pow(10, 0.3 + s * 2.5);
}

/** What the HUD needs to explain itself. */
export const PUPIL_FACTS = {
  effort: EFFORT_DILATION,
  settle: SETTLE_SECONDS,
};
