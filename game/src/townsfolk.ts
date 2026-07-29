import { Vector3 } from 'three';
import {
  FollowPath,
  MotionAgent,
  Path,
  Separation,
  SpatialGrid,
  type World,
} from 'gama3d';
import { LookAt, Locomotion, OUTFITS, Reactions, createHumanoid } from 'anima3d';
import type { Courier } from './courier';

/**
 * The people of Havenbrook, who are not scenery.
 *
 * Each one is a GAMA `MotionAgent` walking the ring road with `FollowPath`
 * and holding its own space with `Separation`, wearing an ANIMA body whose
 * gait is driven by the agent's velocity and whose head turns to watch the
 * courier go past. They are the game's only real obstacle: a village where
 * nothing gets in your way is a track, not a town.
 */

export interface Townsfolk {
  /** Nearest villager the courier is currently overlapping, if any. */
  collide(courier: Courier): Vector3 | null;
  update(dt: number, courier: Courier): void;
  readonly count: number;
}

export function createTownsfolk(
  world: World,
  route: readonly Vector3[],
  count: number,
  seed: number
): Townsfolk {
  const grid = new SpatialGrid(4);
  const folk: Array<{
    agent: MotionAgent;
    loco: Locomotion;
    gaze: LookAt;
    react: Reactions;
    shoved: number;
  }> = [];
  const agents: MotionAgent[] = [];

  for (let i = 0; i < count; i++) {
    const rig = createHumanoid({
      seed: seed * 17 + i * 5,
      palette: i % 4 === 0 ? OUTFITS.guard : OUTFITS.villager,
    });
    const object = world.spawn('villager');
    object.add(rig.object);

    // Everyone starts at a different point on the same loop and walks it at
    // their own pace — which is enough to make a street look inhabited.
    const offset = Math.floor((i / count) * route.length);
    const waypoints = route.map((_, k) => route[(k + offset) % route.length].clone());
    // Nudge each person off the exact centreline, or the village walks in
    // single file down one stripe of road.
    const side = (i % 2 === 0 ? 1 : -1) * (0.6 + (i % 3) * 0.45);
    for (const w of waypoints) {
      const r = Math.hypot(w.x, w.z) || 1;
      w.x += (w.x / r) * side;
      w.z += (w.z / r) * side;
    }
    object.position.copy(waypoints[0]);

    const agent = object.addComponent(
      new MotionAgent({ maxSpeed: 1.5 + (i % 5) * 0.22, maxForce: 6, planar: true, turnRate: 6 })
    );
    agent.addBehavior(new FollowPath(new Path(waypoints, true), 2.2));
    agent.addBehavior(new Separation(() => grid.neighbors(object.position, 2.2), 2.2), 2.4);

    folk.push({
      agent,
      loco: new Locomotion(rig),
      gaze: new LookAt(rig),
      react: new Reactions(rig),
      shoved: 0,
    });
    agents.push(agent);
  }

  const hit = new Vector3();

  return {
    get count() {
      return folk.length;
    },

    collide(courier: Courier): Vector3 | null {
      for (const f of folk) {
        const p = f.agent.position;
        const dx = p.x - courier.position.x;
        const dz = p.z - courier.position.z;
        if (dx * dx + dz * dz > 0.9 * 0.9) continue;
        // Both parties feel it. A collision that only staggers the player
        // reads as the world being made of walls.
        f.react.flinch({ x: courier.position.x, y: 1, z: courier.position.z });
        f.shoved = 0.6;
        return hit.set(p.x, 0, p.z);
      }
      return null;
    },

    update(dt: number, courier: Courier) {
      grid.rebuild(agents);
      for (const f of folk) {
        f.shoved = Math.max(0, f.shoved - dt);
        // Shoved villagers stop walking for a moment; the agent keeps its
        // path, so they carry on afterwards rather than losing their way.
        f.agent.maxSpeed = f.shoved > 0 ? 0.15 : Math.max(1.2, f.agent.maxSpeed);
        f.loco.update(dt, f.agent.velocity);
        // They watch whoever is running past them, but only nearby.
        const near = f.agent.position.distanceToSquared(courier.position) < 100;
        f.gaze.target = near ? courier.object : null;
        f.gaze.update(dt);
        f.react.update(dt);
      }
    },
  };
}
