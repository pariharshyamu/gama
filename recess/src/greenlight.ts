import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Scene, Vector3 } from 'three';
import {
  LookAt,
  Locomotion,
  createHumanoid,
  reactionTime,
  SIMPLE_REACTION,
  CHOICE_REACTION,
} from 'anima3d';
import { Rng } from 'gama3d';
import { PALETTE, stripe, type Arena } from './arena';
import { createContestant, type Contestant } from './contestant';

/**
 * ROUND ONE — Green Light.
 *
 * The playground game, and the only rule that matters is that stopping is not
 * free. A signal arrives, you have to notice it, and then a body with momentum
 * in it has to come to rest. Both halves cost time, and the round is the
 * question of whether you left enough of it.
 *
 * THE ELIMINATIONS ARE NOT A DICE ROLL. Donders measured simple reaction time
 * in 1868 and got about 180 ms; it is still about 180 ms. Add the cost of
 * deciding *which* signal arrived and it roughly doubles — ANIMA ships both as
 * `SIMPLE_REACTION` and `CHOICE_REACTION`, and `reactionTime(skill)`
 * interpolates. Every rival on this field is drawn a skill, and whether they
 * die is whether their reaction plus their braking distance fits inside the
 * window the Watcher's turn leaves open.
 *
 * So the player is playing against a published number rather than against me,
 * and the same arithmetic applies to them: hold the key a beat too long and no
 * amount of reflex saves you, because the legs still have to stop.
 */

/**
 * How long the Watcher takes to come round, seconds. THE WHOLE BUDGET.
 *
 * This is not a feel number and it cannot be picked by eye — it is the only
 * thing standing between the round and being mathematically unwinnable, and
 * the first version WAS unwinnable. Stopping from `RUN_SPEED` at `BRAKE` takes
 * (RUN_SPEED − MOTION_THRESHOLD) / BRAKE = 0.54 s, the stare lands at 75%
 * through the turn, and at 0.62 s that put the deadline at 0.465 s. A bot with
 * no reaction time at all, releasing on the exact frame the turn began, was
 * caught every time. Fourteen of fifteen contestants died on the first turn and
 * it read as difficulty.
 *
 * So the budget is derived from the bodies it has to accommodate:
 *
 *   brake to under the threshold          0.54 s
 *   + an expert's reaction (Donders)      0.18 s  = 0.72 s   must survive
 *   + a novice's choice reaction          0.35 s  = 0.89 s   must not
 *
 * 0.75 × 1.05 = 0.79 s is the deadline, and the reason it is not more generous
 * is the SECOND fix this number needed. With everyone pinned at one speed the
 * margins came out uniformly positive — the smallest was a millisecond — and
 * nobody died, because a slow reactor and a fast runner never happened to be
 * the same person in fourteen uncorrelated draws. Speed had to become a choice
 * before the deadline could mean anything, and now it is one for the player
 * too: `RUN_SPEED` is a ceiling you accelerate towards, not a switch.
 *
 *   ambling at 3.5 m/s   stop in 0.35 s   a quarter-second reaction is fine
 *   flat out at 5.2      stop in 0.54 s   and it is not
 */
export const TURN_SECONDS = 1.05;

/**
 * How fast you have to be moving to be seen, m/s.
 *
 * Not zero. A standing human sways, and a rule that killed anyone above
 * absolute rest would kill everybody every round — which is a bug that reads
 * as difficulty.
 */
export const MOTION_THRESHOLD = 0.35;

/** Running speed, and how hard you can brake. Both in SI, both measured against. */
export const RUN_SPEED = 5.2;
export const ACCEL = 7.0;
export const BRAKE = 9.0;

export const START_Z = 3;
export const FINISH_Z = 76;

export type Phase = 'green' | 'turning' | 'red' | 'returning';

interface Rival {
  body: Contestant;
  /** 0 novice … 1 expert. Decides their reaction time and nothing else. */
  skill: number;
  reaction: number;
  /** Seconds left before they start braking, once the turn begins. */
  latency: number;
  speed: number;
  /** How far up the field they are willing to push before a phase ends. */
  nerve: number;
  lane: number;
}

export interface GreenLight {
  readonly group: Group;
  readonly phase: Phase;
  /** 0 → 1 through the current turn. The player's only warning. */
  readonly turnProgress: number;
  /**
   * 0 → 1 through the current GREEN phase.
   *
   * The tick rides this, so the metronome crowds together as the turn
   * approaches. Without it the green phase is a uniform random length with no
   * cue in it, and "run until the turn starts" is a coin flip rather than a
   * judgement — which makes a reaction-time round into a luck round.
   */
  readonly warning: number;
  readonly alive: number;
  readonly total: number;
  readonly caught: number;
  /**
   * The share of the field whose reaction plus braking does NOT fit inside the
   * window, computed from the drawn skills before anybody moves.
   *
   * This is the round's difficulty as a number rather than as a feeling, and it
   * is here because both times this round was wrong it was wrong by a mile —
   * once at 100% and once at 0% — while looking perfectly reasonable on screen.
   */
  readonly lethality: number;
  /** Diagnostics: is the Watcher looking, and how fast is the quickest rival. */
  readonly watch: { on: boolean; fastest: number; t: number };
  /** Per-rival: reaction, top speed, and how much slack they have. */
  readonly profile: { rt: number; top: number; margin: number }[];
  /** The player's current speed — the number their whole risk is a function of. */
  readonly pace: number;
  update(dt: number, player: Contestant, running: boolean): void;
  /** True once the player is over the line. */
  readonly won: boolean;
  dispose(): void;
}

export interface GreenLightOptions {
  seed: number;
  rivals: number;
  onCaught: (who: Contestant, wasPlayer: boolean) => void;
  onWin: () => void;
}

const VEL = new Vector3();
const AT = new Vector3();

export function buildGreenLight(
  scene: Scene,
  arena: Arena,
  options: GreenLightOptions,
): GreenLight {
  const group = new Group();
  const rng = new Rng(options.seed);

  group.add(stripe(START_Z, 30, 0xffffff));
  group.add(stripe(FINISH_Z, 30, PALETTE.safe));

  // ---- The Watcher.
  //
  // A humanoid at four times scale, because the uncanny part of the original
  // is that it is a children's toy the size of a building. It is a rig rather
  // than a statue so the head can lead the turn — a body that rotates as one
  // rigid block reads as a turntable, and the head arriving first is most of
  // what makes it feel like being looked at.
  const watcherRig = createHumanoid({
    seed: 12,
    height: 1.7,
    accessories: 'none',
    colors: { top: 0xe8b84f, bottom: 0xd8543f, boots: 0x2b2b2b },
    hair: { style: 'bob', color: 0x1c1c1c },
  });
  const watcher = new Group();
  watcher.add(watcherRig.object);
  watcher.scale.setScalar(6);
  watcher.position.set(0, 0, FINISH_Z + 7);
  group.add(watcher);

  const plinth = new Mesh(
    new BoxGeometry(9, 1.2, 9),
    new MeshStandardMaterial({ color: PALETTE.wall, roughness: 0.9 }),
  );
  plinth.position.set(0, 0.6, FINISH_Z + 7);
  group.add(plinth);
  watcher.position.y = 1.2;
  plinth.scale.set(1.4, 1, 1.4);

  // The head tracks the field independently of the body's turn, which is what
  // makes the stare land before the shoulders have finished arriving.
  // AN IDLE, OR IT STANDS THERE IN THE BIND POSE. A rig with no controller on
  // it keeps the skeleton it was built with, which is a T-pose — seven metres
  // of it, arms straight out, at the end of the hall. It read as a scarecrow.
  const watcherLoco = new Locomotion(watcherRig);

  const stare = new LookAt(watcherRig, { maxYaw: 55, smoothing: 10 });
  stare.weight = 0;
  const stareAt = new Vector3(0, 1.4, FINISH_Z - 20);
  stare.target = stareAt;

  // ---- The field.
  const rivals: Rival[] = [];
  for (let i = 0; i < options.rivals; i++) {
    const lane = rng.range(-12, 12);
    const body = createContestant({
      seed: 200 + i * 13,
      number: 2 + i,
      at: new Vector3(lane, 0, START_Z - rng.range(0.5, 5)),
    });
    group.add(body.object);
    // Skill is drawn, and it is the ONLY thing that varies. Everything else
    // about how they die follows from it.
    const skill = rng.range(0, 1);
    rivals.push({
      body,
      skill,
      reaction: reactionTime(skill),
      latency: 0,
      speed: 0,
      nerve: rng.range(0.45, 1),
      lane,
    });
  }

  let phase: Phase = 'green';
  let span = rng.range(2.2, 4.5);
  let left = span;
  let turn = 0;
  let caught = 0;
  let watchOn = false;
  let fastest = 0;
  let tNow = 0;
  let won = false;
  let facing = Math.PI; // Math.PI = looking at the wall, 0 = looking at you.
  let pace = 0; // The player's speed, carried between frames because it has mass.

  const kill = (body: Contestant, wasPlayer: boolean) => {
    if (body.out) return;
    body.eliminate(new Vector3(0, 0, FINISH_Z + 7));
    caught++;
    arena.fx.burst('sparks', AT.copy(body.object.position).setY(1.2), {
      count: 14,
      color: PALETTE.danger,
      speed: 3,
    });
    options.onCaught(body, wasPlayer);
  };

  scene.add(group);

  return {
    group,
    get phase() {
      return phase;
    },
    get turnProgress() {
      return phase === 'turning' ? turn / TURN_SECONDS : phase === 'red' ? 1 : 0;
    },
    get warning() {
      return phase === 'green' ? 1 - Math.max(0, Math.min(1, left / span)) : 1;
    },
    get alive() {
      return rivals.filter((r) => !r.body.out).length + 1;
    },
    get total() {
      return rivals.length + 1;
    },
    get caught() {
      return caught;
    },
    get pace() {
      return pace;
    },
    get profile() {
      return rivals.map((r) => {
        const top = RUN_SPEED * (0.63 + r.nerve * 0.47);
        const need = r.reaction + (top - MOTION_THRESHOLD) / BRAKE;
        return {
          rt: +r.reaction.toFixed(3),
          top: +top.toFixed(2),
          margin: +(TURN_SECONDS * 0.75 - need).toFixed(3),
        };
      });
    },
    get watch() {
      return { on: watchOn, fastest: +fastest.toFixed(2), t: +tNow.toFixed(2) };
    },
    get lethality() {
      const doomed = rivals.filter((r) => {
        const top = RUN_SPEED * (0.63 + r.nerve * 0.47);
        return r.reaction + (top - MOTION_THRESHOLD) / BRAKE > TURN_SECONDS * 0.75;
      }).length;
      return rivals.length ? doomed / rivals.length : 0;
    },
    get won() {
      return won;
    },

    update(dt: number, player: Contestant, running: boolean): void {
      if (dt <= 0) return;

      // ---- The Watcher's clock.
      left -= dt;
      if (phase === 'green' && left <= 0) {
        phase = 'turning';
        turn = 0;
        // The turn is a SIGNAL, and every rival starts their own reaction
        // clock the instant it becomes visible. Nothing here decides who
        // lives; the clocks do.
        for (const r of rivals) r.latency = r.reaction;
      } else if (phase === 'turning') {
        turn += dt;
        if (turn >= TURN_SECONDS) {
          phase = 'red';
          left = rng.range(1.6, 3.4);
        }
      } else if (phase === 'red' && left <= 0) {
        phase = 'returning';
        turn = 0;
      } else if (phase === 'returning') {
        turn += dt;
        if (turn >= TURN_SECONDS) {
          phase = 'green';
          span = rng.range(2.0, 4.2);
          left = span;
        }
      }

      // Body angle, and the head leading it. `facing` goes PI → 0 across the
      // turn; the stare weight comes up faster than the body, on purpose.
      const t =
        phase === 'turning'
          ? turn / TURN_SECONDS
          : phase === 'returning'
            ? 1 - turn / TURN_SECONDS
            : phase === 'red'
              ? 1
              : 0;
      const eased = t * t * (3 - 2 * t);
      facing = Math.PI * (1 - eased);
      watcher.rotation.y = facing;
      watcherLoco.update(dt, 0);
      stare.weight = Math.min(1, eased * 1.4);
      stare.update(dt);

      const watching = phase === 'red' || (phase === 'turning' && t > 0.75);
      watchOn = watching;
      tNow = t;
      fastest = 0;

      // ---- The player.
      if (!player.out && !won) {
        // ACCELERATION BOTH WAYS, and it is the whole round. Holding W does not
        // set your speed, it raises it — so the longer you have been running
        // the longer you take to stop, and the deadline is the same either way.
        // Greed is expensive and it is expensive in seconds you can count.
        pace = running
          ? Math.min(RUN_SPEED, pace + ACCEL * dt)
          : Math.max(0, pace - BRAKE * dt);
        player.step(dt, VEL.set(0, 0, pace));
        if (watching && player.speed > MOTION_THRESHOLD) kill(player, true);
        if (player.object.position.z >= FINISH_Z && !player.out) {
          won = true;
          options.onWin();
        }
      }

      // ---- The rivals.
      for (const r of rivals) {
        const b = r.body;
        if (b.out) {
          b.update(dt);
          continue;
        }
        const past = b.object.position.z >= FINISH_Z;
        let wants = 0;
        if (!past) {
          if (phase === 'green' || (phase === 'returning' && turn > TURN_SECONDS * 0.4)) {
            // NERVE BUYS SPEED AND SPENDS SAFETY, and the exchange rate is the
            // brake. The bold run at 1.1x the player and need 0.65 s to stop;
            // the timid run at 0.85x and need 0.49 s. Against a deadline of
            // 0.825 s that is the difference between living and not, and it is
            // why the field thins by about a third a turn instead of 7%.
            wants = RUN_SPEED * (0.63 + r.nerve * 0.47);
          } else if (phase === 'turning') {
            // They keep going until their own reaction time has elapsed. This
            // is where the round is decided and there is no randomness in it.
            r.latency -= dt;
            wants = r.latency > 0 ? r.speed : 0;
          }
        }
        r.speed =
          wants > r.speed
            ? Math.min(wants, r.speed + ACCEL * dt)
            : Math.max(wants, r.speed - BRAKE * dt);
        // A little lane-keeping so the field spreads instead of queueing.
        VEL.set((r.lane - b.object.position.x) * 0.8, 0, r.speed);
        if (VEL.z <= 0.01) VEL.x = 0;
        b.step(dt, VEL);
        if (!past && !b.out) fastest = Math.max(fastest, b.speed);
        if (watching && !past && b.speed > MOTION_THRESHOLD) kill(b, false);
        b.update(dt);
      }
    },

    dispose(): void {
      for (const r of rivals) r.body.dispose();
      group.removeFromParent();
    },
  };
}

/** For the help screen — the numbers the round is actually built on. */
export const REACTION_FACTS = {
  simple: SIMPLE_REACTION,
  choice: CHOICE_REACTION,
  turn: TURN_SECONDS,
};
