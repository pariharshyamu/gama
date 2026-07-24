import { describe, expect, it, vi } from 'vitest';
import { Object3D, PerspectiveCamera, Vector2 } from 'three';
import { World } from '../src/core/World';
import { Time } from '../src/core/Time';
import { createRace, Circuit } from '../src/templates/racing';
import type { GameContext } from '../src/templates/common';

/** A running-gear stub that just records what it was pumped with. */
function stubVehicle(): { update: (dt: number, i: { speed?: number; steer?: number }) => void; last?: { speed?: number; steer?: number } } {
  const gear = { last: undefined as { speed?: number; steer?: number } | undefined, update(_dt: number, i: { speed?: number; steer?: number }) { gear.last = i; } };
  return gear;
}

/** A minimal Input the controllers can hold without a DOM. */
const fakeInput = {
  virtualAxis: { set() {} },
  pressVirtual() {},
  releaseVirtual() {},
  moveAxis: (v: Vector2) => v.set(0, 0),
} as never;

const RING = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  return { x: Math.cos(a) * 24, z: Math.sin(a) * 24 };
});

describe('createRace', () => {
  it('grids the field just past the line and drives the player forward', () => {
    const world = new World();
    const camera = new PerspectiveCamera();
    const ctx: GameContext = { world, camera, input: fakeInput, onUpdate: () => () => {} };
    const circuit = new Circuit(RING);
    const gear = stubVehicle();
    const race = createRace(ctx, {
      circuit,
      player: { object: new Object3D(), vehicle: gear },
      rivals: [
        { object: new Object3D(), vehicle: stubVehicle(), speed: 8 },
        { object: new Object3D(), vehicle: stubVehicle(), speed: 8 },
      ],
      laps: 3,
      autoUpdate: false,
    });

    // Everyone starts near the line (tiny progress), pole furthest ahead.
    expect(race.state.total).toBe(3);
    expect(race.state.standings).toHaveLength(3);
    const startProgress = circuit.progress(race.player.body.position.x, race.player.body.position.z);
    expect(startProgress).toBeLessThan(0.1); // past the line, not most of a lap behind it

    // Drive: throttle down, step the world (components) + the race each frame.
    race.player.controller.setIntentSource(() => ({ throttle: 1, steer: 0 }));
    const before = race.player.body.position.clone();
    const time = new Time();
    time.delta = 1 / 60;
    for (let i = 0; i < 90; i++) {
      world.update(time);
      race.update(time.delta);
    }
    expect(race.player.controller.speed).toBeGreaterThan(5);
    expect(race.player.body.position.distanceTo(before)).toBeGreaterThan(3);
    expect(gear.last!.speed).toBeGreaterThan(0); // wheels were pumped
    // Camera swung in behind the player (not still at the origin).
    expect(camera.position.length()).toBeGreaterThan(1);
  });

  it('sends AI rivals around the racing line', () => {
    const world = new World();
    const camera = new PerspectiveCamera();
    const ctx: GameContext = { world, camera, input: fakeInput, onUpdate: () => () => {} };
    const race = createRace(ctx, {
      circuit: new Circuit(RING),
      player: { object: new Object3D() },
      rivals: [{ object: new Object3D(), vehicle: stubVehicle(), speed: 10 }],
      autoUpdate: false,
    });
    const rival = race.rivals[0];
    const before = rival.body.position.clone();
    const time = new Time();
    time.delta = 1 / 60;
    for (let i = 0; i < 60; i++) {
      world.update(time);
      race.update(time.delta);
    }
    expect(rival.agent.velocity.length()).toBeGreaterThan(1); // it got moving
    expect(rival.body.position.distanceTo(before)).toBeGreaterThan(1);
  });

  it('keeps cars from driving through each other', () => {
    const world = new World();
    const camera = new PerspectiveCamera();
    const ctx: GameContext = { world, camera, input: fakeInput, onUpdate: () => () => {} };
    const race = createRace(ctx, {
      circuit: new Circuit(RING),
      player: { object: new Object3D(), radius: 1.3 },
      rivals: [{ object: new Object3D(), radius: 1.3 }],
      autoUpdate: false,
    });
    // Jam them onto the same spot, then let the race resolve it.
    race.player.body.position.set(0, 0, 0);
    race.rivals[0].body.position.set(0.2, 0, 0);
    race.update(1 / 60);
    const gap = race.player.body.position.distanceTo(race.rivals[0].body.position);
    expect(gap).toBeGreaterThan(2.5); // pushed apart to ~sum of radii (2.6)
  });

  it('counts laps, ranks the field, and fires onFinish once', () => {
    const world = new World();
    const camera = new PerspectiveCamera();
    const ctx: GameContext = { world, camera, input: fakeInput, onUpdate: () => () => {} };
    const square = new Circuit([
      { x: -10, z: -10 },
      { x: 10, z: -10 },
      { x: 10, z: 10 },
      { x: -10, z: 10 },
    ]);
    const race = createRace(ctx, {
      circuit: square,
      player: { object: new Object3D() },
      laps: 1,
      collide: false,
      touch: false,
      autoUpdate: false,
    });
    const onFinish = vi.fn();
    race.onFinish(onFinish);

    // Walk the player forward around the loop, then across the line.
    const drive = (dt: number, x: number, z: number) => {
      race.player.body.position.set(x, 0, z);
      return race.update(dt);
    };
    drive(0, -10, -10); // start on the line
    drive(1, 10, 10); // half
    drive(1, -10, 9.9); // three-quarters
    const s = drive(0.5, -10, -10); // cross forward → lap 1 of 1

    expect(s.lap).toBe(1);
    expect(s.finished).toBe(true);
    expect(s.position).toBe(1); // solo, so leading
    expect(s.total).toBe(1);
    expect(s.totalTime).toBeCloseTo(2.5, 3);
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onFinish).toHaveBeenCalledWith(expect.objectContaining({ position: 1, total: 1 }));

    // Further updates don't re-fire the finish.
    drive(1, 10, -10);
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('reset puts the field back on the grid and re-zeroes the clock', () => {
    const world = new World();
    const camera = new PerspectiveCamera();
    const ctx: GameContext = { world, camera, input: fakeInput, onUpdate: () => () => {} };
    const race = createRace(ctx, {
      circuit: new Circuit(RING),
      player: { object: new Object3D(), vehicle: stubVehicle() },
      rivals: [{ object: new Object3D(), vehicle: stubVehicle() }],
      autoUpdate: false,
    });
    const grid = race.player.body.position.clone();
    race.player.controller.setIntentSource(() => ({ throttle: 1, steer: 0 }));
    const time = new Time();
    time.delta = 1 / 60;
    for (let i = 0; i < 30; i++) {
      world.update(time);
      race.update(time.delta);
    }
    expect(race.player.body.position.distanceTo(grid)).toBeGreaterThan(0.5);

    race.reset();
    expect(race.player.body.position.distanceTo(grid)).toBeCloseTo(0, 4);
    expect(race.player.controller.speed).toBe(0);
    expect(race.state.totalTime).toBe(0);
  });
});
