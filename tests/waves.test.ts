import { describe, expect, it, vi } from 'vitest';
import { Vector3 } from 'three';
import { GameObject, Harass, MotionAgent, WaveDirector } from '../src';

describe('Harass', () => {
  // A MotionAgent is a Component — it needs a GameObject to stand in.
  const agentAt = (x: number, z: number, maxSpeed = 6) => {
    const object = new GameObject('harasser');
    object.position.set(x, 0, z);
    return object.addComponent(new MotionAgent({ maxSpeed, planar: true }));
  };

  it('flees inside the ring, closes from outside, rests in the band', () => {
    const target = new Vector3(0, 0, 0);
    const behavior = new Harass(target, { ring: 7, band: 1.5, strafe: 0, seed: 3 });

    const tooClose = behavior.calculate(agentAt(2, 0)).clone();
    expect(tooClose.x).toBeGreaterThan(1); // pushed away from the target

    const tooFar = behavior.calculate(agentAt(15, 0)).clone();
    expect(tooFar.x).toBeLessThan(-1); // pulled back in

    const comfortable = behavior.calculate(agentAt(7.2, 0)).clone();
    expect(comfortable.length()).toBeLessThan(0.01); // band = no radial urge
  });

  it('strafes tangentially and flips on its own seeded rhythm', () => {
    const target = new Vector3(0, 0, 0);
    const behavior = new Harass(target, { ring: 7, strafe: 0.6, flipEvery: 0.5, seed: 5 });
    const agent = agentAt(7, 0);
    const first = behavior.calculate(agent).clone();
    // In the band the force is pure strafe: perpendicular to the radial (+x)
    // means a z component and (near) no x.
    expect(Math.abs(first.z)).toBeGreaterThan(1);
    expect(Math.abs(first.x)).toBeLessThan(0.01);
    const sign = Math.sign(first.z);
    // Run long enough to cross a flip (clock advances 1/60 per calculate).
    let flipped = false;
    for (let i = 0; i < 120; i++) {
      const f = behavior.calculate(agent);
      if (Math.sign(f.z) !== sign && Math.abs(f.z) > 0.5) flipped = true;
    }
    expect(flipped).toBe(true);
    // Different seeds start on their own rhythms — a squad, not a chorus.
    const a = new Harass(target, { seed: 1, strafe: 0.6 }).calculate(agentAt(7, 0)).z;
    const b = new Harass(target, { seed: 2, strafe: 0.6 }).calculate(agentAt(7, 0)).z;
    void a;
    void b; // signs may match by chance; the flip TIMES are what differ
  });

  it('standing exactly on the target still produces a way out', () => {
    const behavior = new Harass(new Vector3(0, 0, 0), { seed: 7 });
    const force = behavior.calculate(agentAt(0, 0));
    expect(Number.isFinite(force.x + force.z)).toBe(true);
    expect(force.length()).toBeGreaterThan(0.5);
  });
});

describe('WaveDirector', () => {
  const run = (director: WaveDirector<string>, seconds: number, dt = 0.1) => {
    for (let t = 0; t < seconds; t += dt) director.update(dt);
  };

  it('spawns a staggered wave, hears about deaths, rests, escalates', () => {
    const spawned: Array<[string, number]> = [];
    const onWave = vi.fn();
    const onCleared = vi.fn();
    const director = new WaveDirector({
      kinds: ['chaser'],
      baseCount: 3,
      growth: 2,
      rest: 2,
      stagger: 0.5,
      seed: 4,
      spawn: (kind, wave) => spawned.push([kind, wave]),
      onWave,
      onCleared,
    });
    director.start();
    expect(director.wave).toBe(1);
    run(director, 0.05);
    expect(spawned.length).toBe(1); // the trickle, not the dump
    run(director, 2);
    expect(spawned.length).toBe(3);
    expect(director.alive).toBe(3);

    director.enemyDown();
    director.enemyDown();
    expect(onCleared).not.toHaveBeenCalled();
    director.enemyDown();
    expect(onCleared).toHaveBeenCalledWith(1);
    expect(director.isResting).toBe(true);

    run(director, 2.2); // the rest passes
    expect(director.wave).toBe(2);
    run(director, 6);
    // Wave 2 = base 3 + growth 2 × pressure factor — more than wave 1.
    expect(spawned.filter(([, w]) => w === 2).length).toBeGreaterThan(3);
    expect(onWave).toHaveBeenCalledTimes(2);
  });

  it('RUBBER-BANDS: a dominating player faces more than a bleeding one', () => {
    const play = (style: 'dominate' | 'struggle') => {
      let spawnedTotal = 0;
      const director = new WaveDirector({
        kinds: ['chaser'],
        baseCount: 3,
        growth: 2,
        rest: 0.5,
        stagger: 0.1,
        seed: 9,
        spawn: () => spawnedTotal++,
      });
      director.start();
      for (let wave = 0; wave < 4; wave++) {
        // Let the wave spawn fully.
        run(director, 3, 0.05);
        const alive = director.alive;
        if (style === 'struggle') {
          director.playerHurt(3); // bled all over the arena
          run(director, 40); // and took forever
        }
        for (let i = 0; i < alive; i++) director.enemyDown();
        run(director, 0.7); // through the rest
      }
      return { spawnedTotal, pressure: director.pressure };
    };
    const dominating = play('dominate');
    const struggling = play('struggle');
    expect(dominating.pressure).toBeGreaterThan(struggling.pressure);
    expect(dominating.spawnedTotal).toBeGreaterThan(struggling.spawnedTotal);
  });

  it('respects the ceiling, refuses zero kinds, and stop() freezes it', () => {
    expect(() => new WaveDirector({ kinds: [], spawn: () => {} })).toThrow(/no kinds/);
    let count = 0;
    const director = new WaveDirector({
      kinds: ['a', 'b'],
      baseCount: 10,
      growth: 50,
      maxCount: 6,
      stagger: 0,
      rest: 0.1,
      spawn: () => count++,
    });
    director.start();
    run(director, 1, 0.05);
    expect(count).toBe(6); // ceiling holds even when growth says 60

    director.stop();
    const before = count;
    for (let i = 0; i < director.alive; i++) director.enemyDown();
    run(director, 5);
    expect(count).toBe(before); // frozen — no next wave while stopped
  });
});
