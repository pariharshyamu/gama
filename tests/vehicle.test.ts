import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { World } from '../src/core/World';
import { Time } from '../src/core/Time';
import { VehicleController } from '../src/controllers/VehicleController';
import { driveVehicle } from '../src/motion/driveVehicle';
import { SphereCollider } from '../src/physics/Collider';
import { resolveCircleCollisions } from '../src/physics/resolve';
import { Circuit, LapTracker } from '../src/templates/racing';
import { TouchControls } from '../src/input/TouchControls';

/** Advance a controller-bearing object through the world for `steps` frames. */
function run(world: World, steps: number, dt = 1 / 60): void {
  const time = new Time();
  time.delta = dt;
  for (let i = 0; i < steps; i++) world.update(time);
}

describe('VehicleController', () => {
  it('accelerates on throttle and moves along its heading (+z)', () => {
    const world = new World();
    const car = world.spawn('car');
    const gear: Array<{ speed?: number; steer?: number }> = [];
    const ctrl = car.addComponent(
      new VehicleController(undefined, { vehicle: { update: (_dt, i) => gear.push(i) } })
    );
    ctrl.setIntentSource(() => ({ throttle: 1, steer: 0 }));
    run(world, 60);
    expect(ctrl.speed).toBeGreaterThan(5);
    expect(car.position.z).toBeGreaterThan(2); // travelled forward
    expect(car.position.x).toBeCloseTo(0, 4);
    // The running gear was pumped with the current speed each frame.
    expect(gear[gear.length - 1].speed).toBeCloseTo(ctrl.speed, 3);
  });

  it('cannot steer while stationary, but turns once rolling', () => {
    const world = new World();
    const car = world.spawn('car');
    const ctrl = car.addComponent(new VehicleController());
    ctrl.setIntentSource(() => ({ throttle: 0, steer: 1 }));
    run(world, 30);
    expect(car.rotation.y).toBeCloseTo(0, 5); // no phantom spin at rest

    ctrl.setIntentSource(() => ({ throttle: 1, steer: 1 }));
    run(world, 60);
    expect(Math.abs(car.rotation.y)).toBeGreaterThan(0.2);
  });

  it('bleeds speed off-track and coasts to rest off throttle', () => {
    const world = new World();
    const car = world.spawn('car');
    const ctrl = car.addComponent(
      new VehicleController(undefined, { offTrack: () => true, offTrackDrag: 5 })
    );
    ctrl.setIntentSource(() => ({ throttle: 1, steer: 0 }));
    run(world, 40);
    const onGas = ctrl.speed;
    ctrl.setIntentSource(() => ({ throttle: 0, steer: 0 }));
    run(world, 120);
    expect(ctrl.speed).toBeLessThan(onGas);
    expect(ctrl.speed).toBeLessThan(1);
  });

  it('reset repositions and stops the car', () => {
    const world = new World();
    const car = world.spawn('car');
    const ctrl = car.addComponent(new VehicleController());
    ctrl.setIntentSource(() => ({ throttle: 1, steer: 0 }));
    run(world, 30);
    ctrl.reset(10, -4, Math.PI);
    expect(car.position.x).toBe(10);
    expect(car.position.z).toBe(-4);
    expect(ctrl.speed).toBe(0);
    expect(car.rotation.y).toBeCloseTo(Math.PI);
  });
});

describe('driveVehicle', () => {
  it('pumps speed and a bounded steer from an agent', () => {
    const captured: Array<{ speed?: number; steer?: number }> = [];
    // A structural stand-in for a MotionAgent: it exposes velocity + owner.
    const agent = {
      velocity: new Vector3(3, 0, 3), // heading 45° off the owner's facing
      owner: { rotation: { y: 0 } },
    };
    const drive = driveVehicle(agent as never, { update: (_dt, i) => captured.push(i) });
    drive(1 / 60);
    expect(captured[0].speed).toBeCloseTo(Math.hypot(3, 3), 3);
    expect(captured[0].steer).toBeGreaterThan(0); // turning toward +x
    expect(Math.abs(captured[0].steer!)).toBeLessThanOrEqual(0.6);
  });

  it('reports no steer when travelling straight ahead', () => {
    const captured: Array<{ speed?: number; steer?: number }> = [];
    const agent = { velocity: new Vector3(0, 0, 5), owner: { rotation: { y: 0 } } };
    driveVehicle(agent as never, { update: (_dt, i) => captured.push(i) })(1 / 60);
    expect(Math.abs(captured[0].steer!)).toBeLessThan(1e-6);
  });
});

describe('resolveCircleCollisions', () => {
  it('pushes overlapping bodies apart; a static one holds its ground', () => {
    const world = new World();
    const a = world.spawn('a');
    a.position.set(0, 0, 0);
    a.addComponent(new SphereCollider(1));
    const b = world.spawn('b');
    b.position.set(0.5, 0, 0);
    b.addComponent(new SphereCollider(1));
    const n = resolveCircleCollisions(world.objects);
    expect(n).toBe(1);
    const gap = a.position.distanceTo(b.position);
    expect(gap).toBeCloseTo(2, 4); // separated to the sum of radii
    expect(a.position.x).toBeCloseTo(-0.75, 4); // both moved half each
    expect(b.position.x).toBeCloseTo(1.25, 4);

    // With a pinned, only the other moves.
    a.position.set(0, 0, 0);
    b.position.set(0.5, 0, 0);
    a.tags.add('static');
    resolveCircleCollisions(world.objects);
    expect(a.position.x).toBeCloseTo(0, 4);
    expect(b.position.x).toBeCloseTo(2, 4);
  });

  it('leaves separated bodies and triggers alone', () => {
    const world = new World();
    const a = world.spawn('a');
    a.position.set(0, 0, 0);
    a.addComponent(new SphereCollider(1));
    const b = world.spawn('b');
    b.position.set(5, 0, 0);
    b.addComponent(new SphereCollider(1));
    expect(resolveCircleCollisions(world.objects)).toBe(0);
    b.position.set(0.5, 0, 0);
    b.getComponent(SphereCollider)!.isTrigger = true;
    expect(resolveCircleCollisions(world.objects)).toBe(0);
  });
});

describe('Circuit', () => {
  const square = new Circuit([
    { x: -10, z: -10 },
    { x: 10, z: -10 },
    { x: 10, z: 10 },
    { x: -10, z: 10 },
  ]);

  it('measures distance off the centreline', () => {
    expect(square.distanceTo(0, -10)).toBeCloseTo(0, 4); // on the bottom edge
    expect(square.distanceTo(0, -6)).toBeCloseTo(4, 4); // 4m inside
    expect(square.length).toBeCloseTo(80, 4);
  });

  it('reports monotone progress around the loop', () => {
    const p0 = square.progress(-10, -10); // start corner
    const p1 = square.progress(10, -10); // a quarter round
    const p2 = square.progress(10, 10); // halfway
    expect(p0).toBeCloseTo(0, 2);
    expect(p1).toBeGreaterThan(0.2);
    expect(p1).toBeLessThan(0.3);
    expect(p2).toBeGreaterThan(p1);
  });
});

describe('LapTracker', () => {
  const square = new Circuit([
    { x: -10, z: -10 },
    { x: 10, z: -10 },
    { x: 10, z: 10 },
    { x: -10, z: 10 },
  ]);

  it('counts a forward lap and times it, ignoring a backward crossing', () => {
    const laps = new LapTracker(square, { laps: 2 });
    // Drive most of the way round (progress climbing), then cross the line.
    laps.update(0, -10, -10); // start
    laps.update(1, 10, 10); // half — 1s
    laps.update(1, -10, 9.9); // three-quarters — 2s
    let s = laps.update(0.5, -10, -10); // cross forward → lap 1, 2.5s lap
    expect(s.lap).toBe(1);
    expect(s.lastLap).toBeCloseTo(2.5, 3);
    expect(s.bestLap).toBeCloseTo(2.5, 3);
    expect(s.finished).toBe(false);

    // Reversing across the line (progress climbs low → high) must NOT count.
    s = laps.update(0.1, -10, 9); // just behind the line going backward
    expect(s.lap).toBe(1);
    s = laps.update(0.1, 10, 9); // further backward, still lap 1
    expect(s.lap).toBe(1);
  });

  it('marks the race finished after the set number of laps', () => {
    const laps = new LapTracker(square, { laps: 1 });
    laps.update(0, -10, -10);
    laps.update(1, 10, 10); // half
    laps.update(1, -10, 9.9); // three-quarters
    const s = laps.update(1, -10, -10); // cross → lap 1 of 1
    expect(s.lap).toBe(1);
    expect(s.finished).toBe(true);
  });
});

describe('TouchControls', () => {
  it('does not mount when there is no DOM (headless/SSR safe)', () => {
    const fakeInput = {
      virtualAxis: { set() {} },
      pressVirtual() {},
      releaseVirtual() {},
    };
    const controls = new TouchControls(fakeInput as never, { show: 'always' });
    expect(controls.mounted).toBe(false);
    controls.dispose(); // must not throw
  });
});
