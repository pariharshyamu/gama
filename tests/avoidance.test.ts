import { describe, expect, it } from 'vitest';
import { Box3, Vector3 } from 'three';
import { GameObject } from '../src/core/GameObject';
import { Time } from '../src/core/Time';
import { MotionAgent } from '../src/motion/MotionAgent';
import { ObstacleAvoidance, Containment, type Obstacle } from '../src/motion/avoidance';
import { Seek } from '../src/motion/steering';

function makeAgent(x = 0, y = 0, z = 0): MotionAgent {
  const object = new GameObject();
  object.position.set(x, y, z);
  return object.addComponent(new MotionAgent({ maxSpeed: 5, maxForce: 60 }));
}

function step(agent: MotionAgent, seconds: number, dt = 1 / 60): void {
  const time = new Time();
  time.delta = dt;
  for (let t = 0; t < seconds; t += dt) agent.update(time);
}

describe('ObstacleAvoidance', () => {
  it('is inert when no obstacle is in the probe', () => {
    const agent = makeAgent();
    agent.velocity.set(5, 0, 0);
    const behavior = new ObstacleAvoidance(() => [{ center: new Vector3(0, 0, 50), radius: 2 }]);
    expect(behavior.calculate(agent).length()).toBe(0);
  });

  it('steers laterally away from an off-center obstacle ahead', () => {
    const agent = makeAgent();
    agent.velocity.set(5, 0, 0);
    const obstacle: Obstacle = { center: new Vector3(3, 0, 0.3), radius: 1 };
    const force = new ObstacleAvoidance(() => [obstacle]).calculate(agent);
    expect(force.z).toBeLessThan(0); // obstacle sits at +z, push is -z
    // Lateral, not braking: no significant component against travel.
    expect(Math.abs(force.x)).toBeLessThan(Math.abs(force.z));
  });

  it('breaks symmetry on a dead-center approach instead of stalling', () => {
    const agent = makeAgent();
    agent.velocity.set(5, 0, 0);
    const force = new ObstacleAvoidance(() => [
      { center: new Vector3(3, 0, 0), radius: 1 },
    ]).calculate(agent);
    expect(force.length()).toBeGreaterThan(0);
  });

  it('carries a seeking agent around an obstacle without penetrating it', () => {
    const agent = makeAgent(0, 0, 0);
    const obstacle: Obstacle = { center: new Vector3(6, 0, 0.01), radius: 1.5 };
    agent.addBehavior(new Seek(new Vector3(14, 0, 0)));
    agent.addBehavior(new ObstacleAvoidance(() => [obstacle], 4, 0.4), 2.5);

    let minDist = Infinity;
    const time = new Time();
    time.delta = 1 / 60;
    for (let i = 0; i < 60 * 6; i++) {
      agent.update(time);
      minDist = Math.min(minDist, agent.position.distanceTo(obstacle.center));
    }
    expect(minDist).toBeGreaterThan(obstacle.radius * 0.9);
    expect(agent.position.distanceTo(new Vector3(14, 0, 0))).toBeLessThan(3);
  });
});

describe('Containment', () => {
  it('pushes an agent near a wall back toward the inside', () => {
    const bounds = new Box3(new Vector3(-10, -10, -10), new Vector3(10, 10, 10));
    const agent = makeAgent(9.5, 0, 0);
    const force = new Containment(bounds, 2).calculate(agent);
    expect(force.x).toBeLessThan(0);
  });

  it('pushes at full strength when outside the bounds', () => {
    const bounds = new Box3(new Vector3(-10, -10, -10), new Vector3(10, 10, 10));
    const agent = makeAgent(0, 0, -15);
    const force = new Containment(bounds, 2).calculate(agent);
    expect(force.z).toBeCloseTo(agent.maxForce);
  });

  it('is inert well inside the bounds', () => {
    const bounds = new Box3(new Vector3(-10, -10, -10), new Vector3(10, 10, 10));
    const agent = makeAgent(0, 0, 0);
    expect(new Containment(bounds, 2).calculate(agent).length()).toBe(0);
  });

  it('keeps a wandering agent inside the box over time', () => {
    const bounds = new Box3(new Vector3(-8, -8, -8), new Vector3(8, 8, 8));
    const agent = makeAgent(0, 0, 0);
    agent.velocity.set(4, 0, 3);
    agent.addBehavior(new Containment(bounds, 2), 2);
    step(agent, 10);
    expect(Math.abs(agent.position.x)).toBeLessThan(9);
    expect(Math.abs(agent.position.z)).toBeLessThan(9);
  });
});
