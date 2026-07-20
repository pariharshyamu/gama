import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { GameObject } from '../src/core/GameObject';
import { Time } from '../src/core/Time';
import { MotionAgent } from '../src/motion/MotionAgent';
import { Seek, Flee, Arrive, Separation, FollowPath } from '../src/motion/steering';
import { Path } from '../src/motion/Path';

function makeAgent(x = 0, y = 0, z = 0): MotionAgent {
  const object = new GameObject('agent');
  object.position.set(x, y, z);
  return object.addComponent(new MotionAgent({ maxSpeed: 5, maxForce: 50 }));
}

function step(agent: MotionAgent, seconds: number, dt = 1 / 60): void {
  const time = new Time();
  time.delta = dt;
  for (let t = 0; t < seconds; t += dt) agent.update(time);
}

describe('Seek', () => {
  it('produces force toward the target', () => {
    const agent = makeAgent(0, 0, 0);
    const force = new Seek(new Vector3(10, 0, 0)).calculate(agent);
    expect(force.x).toBeGreaterThan(0);
    expect(Math.abs(force.z)).toBeLessThan(1e-6);
  });

  it('moves the agent toward the target over time', () => {
    const agent = makeAgent(0, 0, 0);
    agent.addBehavior(new Seek(new Vector3(10, 0, 0)));
    step(agent, 2);
    expect(agent.position.x).toBeGreaterThan(4);
    expect(agent.velocity.x).toBeGreaterThan(3);
  });

  it('accepts a live getter target', () => {
    const target = new Vector3(0, 0, -10);
    const agent = makeAgent();
    agent.addBehavior(new Seek(() => target));
    step(agent, 0.5);
    expect(agent.position.z).toBeLessThan(0);
  });
});

describe('Flee', () => {
  it('pushes the agent away from the threat', () => {
    const agent = makeAgent(1, 0, 0);
    agent.addBehavior(new Flee(new Vector3(0, 0, 0)));
    step(agent, 0.5);
    expect(agent.position.x).toBeGreaterThan(1);
  });

  it('is inert outside the panic radius', () => {
    const agent = makeAgent(100, 0, 0);
    const force = new Flee(new Vector3(0, 0, 0), 10).calculate(agent);
    expect(force.length()).toBe(0);
  });
});

describe('Arrive', () => {
  it('settles near the target instead of overshooting forever', () => {
    const agent = makeAgent(0, 0, 0);
    agent.addBehavior(new Arrive(new Vector3(5, 0, 0), 3));
    step(agent, 6);
    expect(agent.position.distanceTo(new Vector3(5, 0, 0))).toBeLessThan(0.5);
    expect(agent.velocity.length()).toBeLessThan(1);
  });
});

describe('Separation', () => {
  it('pushes crowded agents apart', () => {
    const a = makeAgent(0, 0, 0);
    const b = makeAgent(0.5, 0, 0);
    const flock = [a, b];
    const force = new Separation(() => flock, 2).calculate(a);
    expect(force.x).toBeLessThan(0); // pushed away from b (which is at +x)
  });

  it('ignores agents outside the radius', () => {
    const a = makeAgent(0, 0, 0);
    const b = makeAgent(50, 0, 0);
    const force = new Separation(() => [a, b], 2).calculate(a);
    expect(force.length()).toBe(0);
  });
});

describe('FollowPath', () => {
  it('advances through waypoints and reaches the end', () => {
    const path = new Path([new Vector3(3, 0, 0), new Vector3(3, 0, 3)]);
    const agent = makeAgent(0, 0, 0);
    agent.addBehavior(new FollowPath(path, 0.5));
    step(agent, 8);
    expect(agent.position.distanceTo(new Vector3(3, 0, 3))).toBeLessThan(1);
  });

  it('loops when the path is a loop', () => {
    const path = new Path([new Vector3(1, 0, 0), new Vector3(0, 0, 1)], true);
    path.advance();
    expect(path.current().z).toBe(1);
    path.advance();
    expect(path.current().x).toBe(1); // wrapped back to the first waypoint
  });
});

describe('MotionAgent', () => {
  it('never exceeds maxSpeed', () => {
    const agent = makeAgent();
    agent.maxSpeed = 3;
    agent.addBehavior(new Seek(new Vector3(1000, 0, 0)));
    step(agent, 2);
    expect(agent.velocity.length()).toBeLessThanOrEqual(3 + 1e-9);
  });

  it('keeps planar agents on the ground plane', () => {
    const agent = makeAgent();
    agent.planar = true;
    agent.addBehavior(new Seek(new Vector3(10, 10, 0)));
    step(agent, 1);
    expect(agent.position.y).toBe(0);
  });
});
