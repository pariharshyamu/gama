import { describe, expect, it } from 'vitest';
import { Object3D, Vector3 } from 'three';
import {
  Alignment,
  Rng,
  Cohesion,
  MotionAgent,
  Recorder,
  Seek,
  Separation,
  SpatialGrid,
  TapeReader,
  Time,
  World,
  parseReplay,
  replay,
  REPLAY_VERSION,
  worldChecksum,
  checksumOf,
} from '../src';
import { createFlock } from '../src/templates';

/**
 * A replay is a claim that the same inputs produce the same game. These check
 * the claim two ways: that the machinery does what it says, and — the part
 * that matters — that GAMA's own simulation actually reproduces.
 */

/** A world of movers, driven by one number per tick. Deterministic by design. */
function world(seed: number) {
  const objects: Object3D[] = [];
  for (let i = 0; i < 4; i++) {
    const o = new Object3D();
    o.name = `mover-${i}`;
    o.position.set(seed * 0.1 + i, 0, 0);
    objects.push(o);
  }
  return { objects };
}

const drive = (input: { dx: number } | undefined, w: ReturnType<typeof world>) => {
  if (!input) return;
  for (const o of w.objects) o.position.x += input.dx;
};

describe('worldChecksum', () => {
  it('is stable for an unchanged world and moves when anything does', () => {
    const w = world(1);
    const before = worldChecksum(w);
    expect(worldChecksum(w)).toBe(before);
    w.objects[2].position.z += 1e-9;
    expect(worldChecksum(w)).not.toBe(before);
  });

  it('resolves exactly as far as float64 does, and no further', () => {
    // Out at 1e21 the gap between representable doubles is 131072, so a
    // "difference" smaller than that is not a difference — the two numbers are
    // the same number. Worth pinning, because a desync hunt at the far edge of
    // a map will otherwise blame the checksum for what the format did.
    const a = world(1);
    const b = world(1);
    a.objects[0].position.x = 1e21;
    b.objects[0].position.x = 1e21 + 65536;
    expect(b.objects[0].position.x).toBe(1e21); // not a rounding choice: equal
    expect(worldChecksum(a)).toBe(worldChecksum(b));

    b.objects[0].position.x = 1e21 + 262144; // two ULPs — a real difference
    expect(worldChecksum(a)).not.toBe(worldChecksum(b));
  });

  it('treats -0 and 0 as the same place', () => {
    const a = world(1);
    const b = world(1);
    a.objects[0].position.y = 0;
    b.objects[0].position.y = -0;
    expect(worldChecksum(a)).toBe(worldChecksum(b));
  });

  it('reports a NaN as a divergence rather than throwing', () => {
    // A NaN loose in the world IS the finding. The tool looking for it must
    // not be the thing that crashes.
    const clean = world(1);
    const sick = world(1);
    sick.objects[1].position.x = Number.NaN;
    expect(() => worldChecksum(sick)).not.toThrow();
    expect(worldChecksum(sick)).not.toBe(worldChecksum(clean));
  });

  it('cannot be fooled by concatenation', () => {
    // [1, 23] and [12, 3] must not collide. Hence the separator byte.
    expect(checksumOf([1, 23])).not.toBe(checksumOf([12, 3]));
    expect(checksumOf(['ab', 'c'])).not.toBe(checksumOf(['a', 'bc']));
  });

  it('rounds only when asked, and then hides differences below the quantum', () => {
    const a = world(1);
    const b = world(1);
    b.objects[0].position.x += 1e-6;
    expect(worldChecksum(a)).not.toBe(worldChecksum(b));
    // The documented trade, asserted so nobody is surprised by it.
    expect(worldChecksum(a, { precision: 3 })).toBe(worldChecksum(b, { precision: 3 }));
  });

  it('takes game state three.js knows nothing about', () => {
    const a = world(1);
    const b = world(1);
    a.objects[0].userData.checksum = 100;
    b.objects[0].userData.checksum = 99;
    // Transforms agree, so the shallow hash cannot see it…
    expect(worldChecksum(a)).toBe(worldChecksum(b));
    // …and `deep` is how a game says "health is state too".
    expect(worldChecksum(a, { deep: true })).not.toBe(worldChecksum(b, { deep: true }));
  });
});

describe('Recorder', () => {
  it('stores only the ticks where input changed', () => {
    const recorder = new Recorder<{ dx: number }>({ seed: 1, tickRate: 50 });
    for (let i = 0; i < 100; i++) recorder.capture({ dx: 1 });
    expect(recorder.length).toBe(100);
    expect(recorder.stored).toBe(1); // 100 ticks, one frame
  });

  it('stores every checksum, even on ticks the input held steady', () => {
    // The divergence you are hunting usually lands on a tick where the player
    // did nothing and the world moved anyway. Skipping those hides it.
    const recorder = new Recorder<{ dx: number }>({ seed: 1, tickRate: 50 });
    for (let i = 0; i < 10; i++) recorder.capture({ dx: 1 }, i);
    expect(recorder.stored).toBe(10);
  });

  it('round-trips through JSON with its version', () => {
    const recorder = new Recorder({ seed: 7, tickRate: 60, meta: { level: 'coinrun' } });
    recorder.capture({ jump: true });
    const tape = JSON.parse(JSON.stringify(recorder.toJSON()));
    const parsed = parseReplay(tape);
    expect(parsed.version).toBe(REPLAY_VERSION);
    expect(parsed.seed).toBe(7);
    expect(parsed.meta).toEqual({ level: 'coinrun' });
  });

  it('refuses a tape from a newer build instead of replaying it wrong', () => {
    expect(() => parseReplay({ version: 99, frames: [], ticks: 0, seed: 1, tickRate: 50 }))
      .toThrow(/newer than this build/);
    expect(() => parseReplay({ version: 1, frames: [], ticks: 0, seed: 1, tickRate: 0 }))
      .toThrow(/tickRate/);
  });
});

describe('TapeReader', () => {
  it('fills in the ticks the recorder did not need to store', () => {
    const recorder = new Recorder<{ dx: number }>({ seed: 1, tickRate: 50 });
    recorder.capture({ dx: 1 });
    for (let i = 0; i < 4; i++) recorder.capture({ dx: 1 });
    recorder.capture({ dx: 9 });
    const reader = new TapeReader(recorder.toJSON());
    expect(reader.at(0)).toEqual({ dx: 1 });
    expect(reader.at(3)).toEqual({ dx: 1 }); // never stored, still known
    expect(reader.at(5)).toEqual({ dx: 9 });
  });
});

describe('replay', () => {
  it('reproduces a run exactly', () => {
    const recorder = new Recorder<{ dx: number }>({ seed: 3, tickRate: 50 });
    const live = world(3);
    for (let tick = 0; tick < 50; tick++) {
      const input = { dx: tick % 7 === 0 ? 0.5 : 0.1 };
      drive(input, live);
      recorder.capture(input, worldChecksum(live));
    }

    const result = replay(recorder.toJSON(), {
      build: (seed) => world(seed),
      apply: (input, w) => drive(input, w),
      checksum: (w) => worldChecksum(w),
    });
    expect(result.diverged).toBeNull();
    expect(result.compared).toBe(50);
    expect(worldChecksum(result.world)).toBe(worldChecksum(live));
  });

  it('names the FIRST tick that disagreed, not the last', () => {
    const recorder = new Recorder<{ dx: number }>({ seed: 3, tickRate: 50 });
    const live = world(3);
    for (let tick = 0; tick < 40; tick++) {
      const input = { dx: 0.1 };
      drive(input, live);
      recorder.capture(input, worldChecksum(live));
    }

    // A build that drifts from tick 12 — the shape of every real desync.
    const result = replay(recorder.toJSON(), {
      build: (seed) => world(seed),
      apply: (input, w, tick) => {
        drive(input, w);
        if (tick >= 12) w.objects[0].position.y += 1e-7;
      },
      checksum: (w) => worldChecksum(w),
    });
    expect(result.diverged?.tick).toBe(12);
    // And it stops there: everything after is consequence, not cause.
    expect(result.ticks).toBe(13);
  });

  it('catches a seed that was not honoured', () => {
    const recorder = new Recorder<{ dx: number }>({ seed: 5, tickRate: 50 });
    const live = world(5);
    for (let tick = 0; tick < 10; tick++) {
      const input = { dx: 0.1 };
      drive(input, live);
      recorder.capture(input, worldChecksum(live));
    }
    const result = replay(recorder.toJSON(), {
      build: () => world(999), // ignored the tape's seed
      apply: (input, w) => drive(input, w),
      checksum: (w) => worldChecksum(w),
    });
    expect(result.diverged?.tick).toBe(0);
  });

  it('runs without a checksum, and then admits it compared nothing', () => {
    const recorder = new Recorder<{ dx: number }>({ seed: 1, tickRate: 50 });
    for (let i = 0; i < 5; i++) recorder.capture({ dx: 1 });
    const result = replay(recorder.toJSON(), {
      build: (seed) => world(seed),
      apply: (input, w) => drive(input, w),
    });
    expect(result.diverged).toBeNull();
    expect(result.compared).toBe(0); // NOT evidence of determinism
    expect(result.ticks).toBe(5);
  });
});

/**
 * The test the whole module exists for.
 *
 * Everything above checks the machinery against a fixture built to be
 * deterministic. That proves the tool works; it says nothing about GAMA. This
 * drives a real flock — `MotionAgent`, three steering behaviours and the
 * `SpatialGrid` broadphase — through the recorder and then replays it.
 *
 * If the library ever reads the wall clock, calls `Math.random` in a hot path,
 * or iterates a `Set` where order decides a tie, this is what says so, and it
 * says which tick.
 */
describe('GAMA reproduces its own simulation', () => {
  /** A flock, built the way the docs tell you to build one. */
  function flock(seed: number) {
    const world = new World();
    const grid = new SpatialGrid(2);
    const agents: MotionAgent[] = [];
    // A cheap deterministic spread — no RNG needed, and none wanted: this is
    // testing the SIMULATION, and a seeded generator here would only be
    // testing the generator.
    for (let i = 0; i < 24; i++) {
      const object = world.spawn(`bird-${i}`);
      const agent = new MotionAgent({ maxSpeed: 4, maxForce: 8, planar: true });
      object.addComponent(agent);
      object.position.set(
        ((i * 7919 + seed * 104729) % 100) / 10 - 5,
        0,
        ((i * 6271 + seed * 15485863) % 100) / 10 - 5
      );
      agent.velocity.set((i % 5) - 2, 0, (i % 3) - 1);
      agents.push(agent);
    }
    for (const agent of agents) {
      const near = grid.near(agent, 3);
      agent.addBehavior(new Separation(near, 1.5), 2);
      agent.addBehavior(new Alignment(near, 3), 1);
      agent.addBehavior(new Cohesion(near, 3), 1);
      agent.addBehavior(new Seek(new Vector3(0, 0, 0)), 0.4);
    }
    return { world, grid, agents, time: new Time(), objects: world.objects };
  }

  // `MotionAgent` integrates in `update`, not `fixedUpdate`, and `World` takes
  // a `Time` rather than a number. The first version of this passed a bare
  // `0.02` to `fixedUpdate` — which typechecks nowhere but ran fine under
  // vitest, moved nothing at all, and made every assertion below pass on a
  // world that never changed. A determinism test that steps nothing is the
  // most convincing green there is.
  const step = (input: { dt: number } | undefined, w: ReturnType<typeof flock>) => {
    if (!input) return;
    w.grid.rebuild(w.agents);
    w.time.delta = input.dt;
    w.time.elapsed += input.dt;
    w.time.frame++;
    w.world.update(w.time);
  };

  it('the flock actually moves — the guard on every test below', () => {
    const w = flock(11);
    const before = worldChecksum(w);
    const start = w.objects[0].position.clone();
    for (let i = 0; i < 20; i++) step({ dt: 0.02 }, w);
    expect(worldChecksum(w)).not.toBe(before);
    expect(w.objects[0].position.distanceTo(start)).toBeGreaterThan(0.1);
    // And nothing has gone to NaN, which would hash consistently and make a
    // dead world look like a reproducing one.
    for (const o of w.objects) expect(Number.isFinite(o.position.x)).toBe(true);
  });

  it('a 24-bird flock replays tick for tick', () => {
    const live = flock(11);
    const recorder = new Recorder<{ dt: number }>({ seed: 11, tickRate: 50 });
    for (let tick = 0; tick < 120; tick++) {
      const input = { dt: 0.02 };
      step(input, live);
      recorder.capture(input, worldChecksum(live));
    }

    const result = replay(recorder.toJSON(), {
      build: (seed) => flock(seed),
      apply: (input, w) => step(input, w),
      checksum: (w) => worldChecksum(w),
    });

    expect(result.diverged).toBeNull();
    expect(result.compared).toBe(120);
  });

  it('two independent builds of the same seed agree at every tick', () => {
    // Not the same assertion as the replay above: that one re-drives a tape,
    // this one runs two simulations side by side. A shared module-level
    // cache — a pooled vector, a memo keyed on nothing — shows up here and
    // not there, because the replay runs its two halves one after the other.
    const a = flock(4);
    const b = flock(4);
    for (let tick = 0; tick < 60; tick++) {
      step({ dt: 0.02 }, a);
      step({ dt: 0.02 }, b);
      expect(worldChecksum(a), `tick ${tick}`).toBe(worldChecksum(b));
    }
  });

  it('a different seed is a different flock', () => {
    // Guards the guard: if `worldChecksum` returned a constant, or the seed
    // never reached the world, every test above would pass on nothing.
    const a = flock(1);
    const b = flock(2);
    for (let tick = 0; tick < 20; tick++) {
      step({ dt: 0.02 }, a);
      step({ dt: 0.02 }, b);
    }
    expect(worldChecksum(a)).not.toBe(worldChecksum(b));
  });
});

describe('Rng', () => {
  it('gives the same sequence for the same seed, forever', () => {
    const a = Array.from({ length: 8 }, () => 0).map(() => new Rng(42).next());
    expect(new Set(a).size).toBe(1); // a fresh Rng(42) always starts the same
    const one = new Rng(7);
    const two = new Rng(7);
    for (let i = 0; i < 100; i++) expect(one.next()).toBe(two.next());
  });

  it('separates adjacent seeds', () => {
    // Unmixed, seeds 1/2/3 begin with near-identical values and a crowd
    // seeded 1..n comes out visibly striped.
    const firsts = [1, 2, 3, 4, 5].map((seed) => new Rng(seed).next());
    for (let i = 1; i < firsts.length; i++) {
      expect(Math.abs(firsts[i] - firsts[i - 1])).toBeGreaterThan(0.01);
    }
  });

  it('stays inside its bounds', () => {
    const rng = new Rng(3);
    for (let i = 0; i < 500; i++) {
      const v = rng.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
      const n = rng.int(1, 6);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(6); // both ends, like a die
    }
  });

  it('shuffles a copy, not the caller\'s list', () => {
    const source = Object.freeze([1, 2, 3, 4, 5]);
    const shuffled = new Rng(9).shuffle(source);
    expect(source).toEqual([1, 2, 3, 4, 5]);
    expect(shuffled.slice().sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('refuses to pick from nothing rather than returning undefined', () => {
    expect(() => new Rng(1).pick([])).toThrow(/empty/);
  });
});

/**
 * The defect the replay module was built to find, kept found.
 *
 * `createFlock` scattered its boids with `Math.random` and gave every one a
 * `Wander` reading `Math.random` too. Nothing about it could be reproduced: not
 * a replay, not a save, not a bug report. The tests below are what stop it
 * coming back, and the one that matters is the second — seeding the SCATTER
 * alone leaves the flock reproducible for exactly one tick.
 */
describe('createFlock is reproducible', () => {
  const context = () => {
    const world = new World();
    const time = new Time();
    return {
      ctx: {
        world,
        camera: {} as never,
        input: {} as never,
        onUpdate: () => () => {},
      },
      world,
      time,
      objects: world.objects,
    };
  };

  const run = (seed: number, ticks: number) => {
    const c = context();
    const flock = createFlock(c.ctx, { count: 30, seed });
    for (let i = 0; i < ticks; i++) {
      flock.grid.rebuild(flock.agents);
      c.time.delta = 0.02;
      c.time.frame++;
      c.world.update(c.time);
    }
    return worldChecksum(c);
  };

  it('the same seed builds the same flock', () => {
    expect(run(5, 0)).toBe(run(5, 0));
  });

  it('and keeps building it, tick after tick', () => {
    // The one the scatter-only fix would fail: `Wander` advances its angle by
    // a random step EVERY tick, so a seeded scatter with an unseeded wander
    // agrees at tick 0 and has drifted apart by tick 1.
    expect(run(5, 1)).toBe(run(5, 1));
    expect(run(5, 40)).toBe(run(5, 40));
  });

  it('different seeds build different flocks', () => {
    // Guards the guard: if the seed were ignored entirely, every assertion
    // above would still pass.
    expect(run(1, 20)).not.toBe(run(2, 20));
  });

  it('and the flock is actually flying', () => {
    const a = run(5, 0);
    const b = run(5, 40);
    expect(a).not.toBe(b);
  });
});
