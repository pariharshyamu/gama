import { Vector3 } from 'three';
import type { MotionAgent } from './MotionAgent';
import type { SteeringBehavior, Target } from './steering';

export interface HarassOptions {
  /** Preferred fighting distance, metres. Default 7. */
  ring?: number;
  /** Half-width of the comfortable band around the ring. Default 1.5. */
  band?: number;
  /** Sideways strafe speed as a fraction of maxSpeed. Default 0.55. */
  strafe?: number;
  /** Seconds between direction flips of the strafe, ± half. Default 2.8. */
  flipEvery?: number;
  /** Seed for the strafe rhythm. Default 1. */
  seed?: number;
}

/**
 * Harass — the ranged enemy's dance. Everyone has fought this one: it
 * keeps its distance, circles you sideways, and backs off exactly as
 * fast as you close.
 *
 * Three urges summed:
 *
 * - **Hold the ring.** Inside the comfortable band the radial urge is
 *   zero; closer than the ring it flees outward, further it closes in —
 *   with the urgency scaled by how far outside the band it is, so the
 *   correction is a drift near the edge and a scramble when you lunge.
 * - **Strafe.** A tangential component circles the target. It flips
 *   direction on a seeded rhythm (with jitter, so a squad never turns
 *   in formation like synchronised swimmers).
 * - Whatever else the agent runs — separation from its squad, obstacle
 *   avoidance — sums on top, like any steering behavior.
 *
 * Firing is not steering: pair it with `Projectiles` and a timer.
 *
 * ```ts
 * agent.addBehavior(new Harass(() => hero.position, { ring: 8, seed: i }));
 * ```
 */
export class Harass implements SteeringBehavior {
  private readonly force = new Vector3();
  private readonly radial = new Vector3();
  private readonly tangent = new Vector3();
  private readonly ring: number;
  private readonly band: number;
  private readonly strafe: number;
  private readonly flipEvery: number;
  private direction: 1 | -1;
  private nextFlip: number;
  private clock = 0;
  private state: number;

  constructor(public target: Target, options: HarassOptions = {}) {
    this.ring = Math.max(options.ring ?? 7, 0.5);
    this.band = Math.max(options.band ?? 1.5, 0.1);
    this.strafe = Math.min(Math.max(options.strafe ?? 0.55, 0), 1);
    this.flipEvery = Math.max(options.flipEvery ?? 2.8, 0.3);
    // A private mulberry32 stream drives the flip rhythm.
    this.state = (options.seed ?? 1) >>> 0 || 1;
    this.direction = this.rand() < 0.5 ? 1 : -1;
    this.nextFlip = this.flipEvery * (0.5 + this.rand());
  }

  private rand(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  calculate(agent: MotionAgent): Vector3 {
    const goal = typeof this.target === 'function' ? this.target() : this.target;
    this.radial.copy(agent.position).sub(goal);
    this.radial.y = 0;
    const dist = this.radial.length();
    if (dist < 1e-4) {
      // Standing inside the target: any way out is the right way.
      this.radial.set(1, 0, 0);
    } else {
      this.radial.multiplyScalar(1 / dist);
    }

    // The strafe clock rides the agent's own frame cadence: MotionAgent
    // calls calculate once per update, so dt-less integration over the
    // velocity magnitude keeps this dependency-free and deterministic
    // enough for a rhythm nobody times with a stopwatch.
    this.clock += 1 / 60;
    if (this.clock >= this.nextFlip) {
      this.clock = 0;
      this.direction = this.direction === 1 ? -1 : 1;
      this.nextFlip = this.flipEvery * (0.5 + this.rand());
    }

    // Radial urge: zero inside the band, scaled by overshoot outside it.
    const error = dist - this.ring;
    const outside = Math.abs(error) - this.band;
    let radialSpeed = 0;
    if (outside > 0) {
      const urgency = Math.min(outside / this.band, 1.5);
      radialSpeed = (error > 0 ? -1 : 1) * agent.maxSpeed * Math.min(urgency, 1);
    }

    // Tangential strafe, perpendicular to the radial in the ground plane.
    this.tangent.set(-this.radial.z, 0, this.radial.x).multiplyScalar(
      agent.maxSpeed * this.strafe * this.direction
    );

    this.force
      .copy(this.radial)
      .multiplyScalar(radialSpeed)
      .add(this.tangent);
    return this.force.sub(agent.velocity);
  }
}
