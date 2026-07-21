import { Vector3 } from 'three';
import type { MotionAgent } from './MotionAgent';
import type { Path } from './Path';

/**
 * A steering behavior produces a desired force for a MotionAgent.
 * Behaviors are composable: an agent sums the (weighted) forces of all
 * of its behaviors each frame. These are the classic Reynolds behaviors.
 */
export interface SteeringBehavior {
  calculate(agent: MotionAgent): Vector3;
}

/** A position source: a fixed point, a live Vector3, or a getter. */
export type Target = Vector3 | (() => Vector3);

function resolve(target: Target): Vector3 {
  return typeof target === 'function' ? target() : target;
}

/** Steer at full speed toward a target. */
export class Seek implements SteeringBehavior {
  private readonly force = new Vector3();
  constructor(public target: Target) {}

  calculate(agent: MotionAgent): Vector3 {
    const desired = this.force.copy(resolve(this.target)).sub(agent.position);
    if (desired.lengthSq() < 1e-8) return desired.set(0, 0, 0);
    desired.setLength(agent.maxSpeed);
    return desired.sub(agent.velocity);
  }
}

/** Steer at full speed away from a target, active within `panicRadius`. */
export class Flee implements SteeringBehavior {
  private readonly force = new Vector3();
  constructor(public target: Target, public panicRadius = Infinity) {}

  calculate(agent: MotionAgent): Vector3 {
    const away = this.force.copy(agent.position).sub(resolve(this.target));
    const dist = away.length();
    if (dist < 1e-4 || dist > this.panicRadius) return this.force.set(0, 0, 0);
    away.setLength(agent.maxSpeed);
    return away.sub(agent.velocity);
  }
}

/** Seek that decelerates smoothly inside `slowRadius` and stops at the target. */
export class Arrive implements SteeringBehavior {
  private readonly force = new Vector3();
  constructor(public target: Target, public slowRadius = 3, public stopRadius = 0.05) {}

  calculate(agent: MotionAgent): Vector3 {
    const desired = this.force.copy(resolve(this.target)).sub(agent.position);
    const dist = desired.length();
    if (dist < this.stopRadius) {
      // Brake hard: -v alone caps at |v| and lets fast agents overshoot.
      // The agent clamps the final force to maxForce anyway.
      return desired.copy(agent.velocity).multiplyScalar(-8);
    }
    const speed =
      dist < this.slowRadius ? agent.maxSpeed * (dist / this.slowRadius) : agent.maxSpeed;
    desired.setLength(speed);
    return desired.sub(agent.velocity);
  }
}

/** Seek a moving agent's predicted future position. */
export class Pursue implements SteeringBehavior {
  private readonly seek: Seek;
  private readonly predicted = new Vector3();

  constructor(public quarry: MotionAgent, public maxPrediction = 1) {
    this.seek = new Seek(() => this.predicted);
  }

  calculate(agent: MotionAgent): Vector3 {
    const toQuarry = this.predicted.copy(this.quarry.position).sub(agent.position);
    const lookAhead = Math.min(this.maxPrediction, toQuarry.length() / Math.max(agent.maxSpeed, 1e-4));
    this.predicted.copy(this.quarry.position).addScaledVector(this.quarry.velocity, lookAhead);
    return this.seek.calculate(agent);
  }
}

/** Flee from a moving agent's predicted future position. */
export class Evade implements SteeringBehavior {
  private readonly flee: Flee;
  private readonly predicted = new Vector3();

  constructor(public pursuer: MotionAgent, public maxPrediction = 1, panicRadius = Infinity) {
    this.flee = new Flee(() => this.predicted, panicRadius);
  }

  calculate(agent: MotionAgent): Vector3 {
    const toPursuer = this.predicted.copy(this.pursuer.position).sub(agent.position);
    const lookAhead = Math.min(this.maxPrediction, toPursuer.length() / Math.max(agent.maxSpeed, 1e-4));
    this.predicted.copy(this.pursuer.position).addScaledVector(this.pursuer.velocity, lookAhead);
    return this.flee.calculate(agent);
  }
}

/**
 * Organic meandering: steer toward a point that drifts on a circle
 * projected ahead of the agent.
 */
export class Wander implements SteeringBehavior {
  private angle: number;
  private readonly force = new Vector3();

  constructor(
    public distance = 3,
    public radius = 1.5,
    public jitter = 4,
    /** Injectable RNG for deterministic simulation/tests. */
    private random: () => number = Math.random
  ) {
    this.angle = this.random() * Math.PI * 2;
  }

  calculate(agent: MotionAgent): Vector3 {
    this.angle += (this.random() * 2 - 1) * this.jitter * 0.1;

    const heading =
      agent.velocity.lengthSq() > 1e-6
        ? this.force.copy(agent.velocity).normalize()
        : this.force.set(0, 0, 1);

    const center = heading.multiplyScalar(this.distance);
    center.x += Math.cos(this.angle) * this.radius;
    center.z += Math.sin(this.angle) * this.radius;
    return center.setLength(agent.maxForce * 0.5);
  }
}

/** A group source for flocking behaviors. */
export type Neighbors = () => Iterable<MotionAgent>;

/** Push away from nearby flockmates — prevents crowding. */
export class Separation implements SteeringBehavior {
  private readonly force = new Vector3();
  private readonly push = new Vector3();

  constructor(public neighbors: Neighbors, public radius = 2) {}

  calculate(agent: MotionAgent): Vector3 {
    this.force.set(0, 0, 0);
    let count = 0;
    for (const other of this.neighbors()) {
      if (other === agent) continue;
      const dist = agent.position.distanceTo(other.position);
      if (dist > 0 && dist < this.radius) {
        // Weight inversely by distance: closer flockmates push harder.
        this.push.copy(agent.position).sub(other.position).divideScalar(dist * dist);
        this.force.add(this.push);
        count++;
      }
    }
    if (count === 0) return this.force;
    this.force.divideScalar(count);
    if (this.force.lengthSq() > 1e-8) {
      this.force.setLength(agent.maxSpeed).sub(agent.velocity);
    }
    return this.force;
  }
}

/** Match velocity with nearby flockmates. */
export class Alignment implements SteeringBehavior {
  private readonly force = new Vector3();

  constructor(public neighbors: Neighbors, public radius = 5) {}

  calculate(agent: MotionAgent): Vector3 {
    this.force.set(0, 0, 0);
    let count = 0;
    for (const other of this.neighbors()) {
      if (other === agent) continue;
      if (agent.position.distanceTo(other.position) < this.radius) {
        this.force.add(other.velocity);
        count++;
      }
    }
    if (count === 0) return this.force;
    this.force.divideScalar(count);
    if (this.force.lengthSq() > 1e-8) {
      this.force.setLength(agent.maxSpeed).sub(agent.velocity);
    }
    return this.force;
  }
}

/** Steer toward the center of mass of nearby flockmates. */
export class Cohesion implements SteeringBehavior {
  private readonly center = new Vector3();
  private readonly seek: Seek;

  constructor(public neighbors: Neighbors, public radius = 5) {
    this.seek = new Seek(() => this.center);
  }

  calculate(agent: MotionAgent): Vector3 {
    this.center.set(0, 0, 0);
    let count = 0;
    for (const other of this.neighbors()) {
      if (other === agent) continue;
      if (agent.position.distanceTo(other.position) < this.radius) {
        this.center.add(other.position);
        count++;
      }
    }
    if (count === 0) return this.center;
    this.center.divideScalar(count);
    return this.seek.calculate(agent);
  }
}

/** Follow a Path of waypoints, seeking each in turn (optionally looping). */
export class FollowPath implements SteeringBehavior {
  private readonly arrive: Arrive;
  private readonly seek: Seek;

  constructor(public path: Path, public waypointRadius = 0.5) {
    this.arrive = new Arrive(() => this.path.current());
    this.seek = new Seek(() => this.path.current());
  }

  calculate(agent: MotionAgent): Vector3 {
    if (this.path.isEmpty()) return new Vector3();
    if (agent.position.distanceTo(this.path.current()) < this.waypointRadius) {
      this.path.advance();
    }
    // Arrive at the final waypoint; seek through intermediate ones.
    const last = !this.path.loop && this.path.isAtLast();
    return last ? this.arrive.calculate(agent) : this.seek.calculate(agent);
  }
}
