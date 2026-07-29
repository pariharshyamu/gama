import { Scene, Vector3 } from 'three';
import { createBeacon, createZone } from 'scena3d';
import type { Address, Village } from './village';
import type { Courier } from './courier';

/**
 * The rules of a round.
 *
 * The whole design is one loop with one dial: **every delivery buys time.**
 * That is the oldest arcade structure there is (it is what Crazy Taxi and
 * Paperboy run on) and it earns its keep here for a specific reason — it
 * makes the player set their own difficulty. Play safe and the round ends
 * quietly at ninety seconds; take the long address across the square and
 * the clock keeps paying you. No lives, no fail states, no tutorial: the
 * timer teaches the game.
 *
 * Two things push back, so that the loop has a shape:
 *  - the bonus shrinks as deliveries pile up, so a round always ends;
 *  - par time. Beat it and the streak multiplier grows; dawdle and it
 *    resets. That is what stops the safest route from being the best one.
 */

export type Phase = 'collect' | 'deliver';

export interface RunState {
  clock: number;
  score: number;
  delivered: number;
  streak: number;
  phase: Phase;
  /** The house being delivered to, or null while collecting. */
  address: Address | null;
  /** Where the courier should be heading right now. */
  target: Vector3;
  /** 0..1 through the round — drives the sky. */
  progress: number;
  over: boolean;
}

export interface RunEvents {
  onDeliver?(points: number, bonusSeconds: number, streak: number): void;
  onCollect?(address: Address): void;
  onBump?(cost: number): void;
  onOver?(): void;
}

export interface Run extends RunState {
  update(dt: number, courier: Courier, bumped: Vector3 | null): void;
  dispose(): void;
}

const DEPOT_RADIUS = 2.6;
const DOOR_RADIUS = 2.2;
const BUMP_COST = 2;

export function startRun(
  scene: Scene,
  village: Village,
  seconds: number,
  seed: number,
  events: RunEvents = {}
): Run {
  // The two pieces of guidance the player actually navigates by: a ring on
  // the ground at the depot, and a pillar of light over the address. Both
  // are SCENA markers — the "go HERE" that a compass arrow can only hint at.
  const zone = createZone({ radius: DEPOT_RADIUS, seed, color: 0xffbf47 });
  zone.group.position.copy(village.depot);
  scene.add(zone.group);

  const beacon = createBeacon({ height: 11, color: 0x63d19e, seed });
  beacon.group.visible = false;
  scene.add(beacon.group);

  let sinceCollect = 0;
  let par = 1;
  const rand = (() => {
    let s = (seed * 2654435761) >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  })();

  /** Pick the next address: never the same one twice running, and biased
   *  further away as the round goes on so the run escalates by itself. */
  let lastNumber = -1;
  const pick = (from: Vector3, delivered: number): Address => {
    const pool = village.addresses.filter((a) => a.number !== lastNumber);
    const reach = Math.min(1, 0.35 + delivered * 0.09);
    const sorted = [...pool].sort(
      (a, b) => a.door.distanceToSquared(from) - b.door.distanceToSquared(from)
    );
    const lo = Math.floor((sorted.length - 1) * reach * 0.45);
    const hi = Math.floor((sorted.length - 1) * Math.min(1, reach + 0.35));
    const chosen = sorted[Math.min(sorted.length - 1, lo + Math.floor(rand() * (hi - lo + 1)))];
    lastNumber = chosen.number;
    return chosen;
  };

  const run: Run = {
    clock: seconds,
    score: 0,
    delivered: 0,
    streak: 0,
    phase: 'collect',
    address: null,
    target: village.depot.clone(),
    progress: 0,
    over: false,

    update(dt: number, courier: Courier, bumped: Vector3 | null) {
      if (run.over) return;

      run.clock -= dt;
      sinceCollect += dt;
      run.progress = 1 - Math.max(0, run.clock) / seconds;

      if (bumped) {
        run.clock -= BUMP_COST;
        events.onBump?.(BUMP_COST);
      }

      if (run.phase === 'collect') {
        run.target.copy(village.depot);
        if (courier.position.distanceTo(village.depot) < DEPOT_RADIUS) {
          const address = pick(courier.position, run.delivered);
          run.address = address;
          run.phase = 'deliver';
          courier.setCarrying(true);
          beacon.group.position.copy(address.door);
          beacon.group.visible = true;
          zone.group.visible = false;
          sinceCollect = 0;
          // Par: the distance at a brisk walk, plus a third for corners and
          // the crowd. Generous enough to be fair, tight enough to mean it.
          par = (courier.position.distanceTo(address.door) / 4.4) * 1.34 + 1.5;
          events.onCollect?.(address);
        }
      } else if (run.address) {
        run.target.copy(run.address.door);
        if (courier.position.distanceTo(run.address.door) < DOOR_RADIUS) {
          const onTime = sinceCollect <= par;
          run.streak = onTime ? run.streak + 1 : 0;
          const distance = village.depot.distanceTo(run.address.door);
          const points = Math.round(100 + distance * 2 + run.streak * 25);
          // The bonus decays with the count: the round has to end.
          const bonus = Math.max(4, 10 - run.delivered * 0.32) + (onTime ? run.streak * 0.4 : 0);
          run.score += points;
          run.delivered += 1;
          run.clock += bonus;
          run.phase = 'collect';
          run.address = null;
          courier.setCarrying(false);
          courier.cheer();
          beacon.group.visible = false;
          zone.group.visible = true;
          events.onDeliver?.(points, bonus, run.streak);
        }
      }

      // The round runs from afternoon into the dark. It is the difficulty
      // curve you can see: by the last thirty seconds you are navigating by
      // the beacon and the street lamps.
      village.setTimeOfDay(0.42 + run.progress * 0.5);
      zone.update(dt);
      beacon.update(dt);

      if (run.clock <= 0) {
        run.clock = 0;
        run.over = true;
        beacon.group.visible = false;
        events.onOver?.();
      }
    },

    dispose() {
      scene.remove(zone.group, beacon.group);
    },
  };

  return run;
}
