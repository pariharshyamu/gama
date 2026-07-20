import { Box3, Vector3 } from 'three';
import type { MotionAgent } from './MotionAgent';
import type { SteeringBehavior } from './steering';

/** A spherical obstacle for ObstacleAvoidance. */
export interface Obstacle {
  center: Vector3;
  radius: number;
}

/**
 * Steer laterally around spherical obstacles ahead of the agent.
 * Projects a probe point along the velocity; if it lands inside an
 * obstacle (padded by `agentRadius`), applies a sideways force away
 * from the obstacle center. Head-on approaches get a deterministic
 * perpendicular nudge so the agent breaks symmetry instead of stalling.
 */
export class ObstacleAvoidance implements SteeringBehavior {
  private readonly ahead = new Vector3();
  private readonly heading = new Vector3();
  private readonly force = new Vector3();

  constructor(
    public obstacles: () => Iterable<Obstacle>,
    public lookAhead = 4,
    public agentRadius = 0.5
  ) {}

  calculate(agent: MotionAgent): Vector3 {
    this.force.set(0, 0, 0);
    const speed = agent.velocity.length();
    if (speed < 1e-4) return this.force;

    this.heading.copy(agent.velocity).divideScalar(speed);
    // Probe further when moving faster, but always look at least halfway.
    const reach = this.lookAhead * Math.max(0.5, speed / agent.maxSpeed);
    this.ahead.copy(agent.position).addScaledVector(this.heading, reach);

    let threat: Obstacle | null = null;
    let threatDist = Infinity;
    for (const obstacle of this.obstacles()) {
      const padded = obstacle.radius + this.agentRadius;
      const collides =
        this.ahead.distanceTo(obstacle.center) < padded ||
        agent.position.distanceTo(obstacle.center) < padded;
      if (collides) {
        const dist = agent.position.distanceTo(obstacle.center);
        if (dist < threatDist) {
          threat = obstacle;
          threatDist = dist;
        }
      }
    }
    if (!threat) return this.force;

    // Lateral escape: push away from the obstacle center, with the
    // along-velocity component removed so the agent swerves, not brakes.
    this.force.copy(this.ahead).sub(threat.center);
    const along = this.force.dot(this.heading);
    this.force.addScaledVector(this.heading, -along);
    if (this.force.lengthSq() < 1e-6) {
      // Dead-center approach: pick a consistent perpendicular.
      this.force.set(this.heading.z, 0, -this.heading.x);
      if (this.force.lengthSq() < 1e-6) this.force.set(1, 0, 0);
    }
    return this.force.setLength(agent.maxForce);
  }
}

/**
 * Keep agents inside a Box3. Force ramps up linearly as the agent enters
 * the `margin` band near a face, and stays at full strength outside the
 * box. Cheap "walls" for arenas and flocking bounds.
 */
export class Containment implements SteeringBehavior {
  private readonly force = new Vector3();

  constructor(public bounds: Box3, public margin = 2) {}

  calculate(agent: MotionAgent): Vector3 {
    const p = agent.position;
    const { min, max } = this.bounds;
    const m = this.margin;
    this.force.set(
      this.push(p.x, min.x, max.x, m),
      this.push(p.y, min.y, max.y, m),
      this.push(p.z, min.z, max.z, m)
    );
    if (this.force.lengthSq() === 0) return this.force;
    return this.force.clampLength(0, 1).multiplyScalar(agent.maxForce);
  }

  /** Signed push strength in [-1, 1] for one axis. */
  private push(value: number, min: number, max: number, margin: number): number {
    if (value < min + margin) return Math.min(1, (min + margin - value) / margin);
    if (value > max - margin) return -Math.min(1, (value - (max - margin)) / margin);
    return 0;
  }
}
