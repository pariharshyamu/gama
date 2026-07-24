import { describe, expect, it } from 'vitest';
import { BoxGeometry, Mesh, Object3D, PerspectiveCamera, Vector2, Vector3 } from 'three';
import { OrbitRig, type PointerLookInput } from '../src/camera/OrbitRig';
import { ShoulderRig } from '../src/camera/ShoulderRig';
import { ChaseCamera } from '../src/camera/ChaseCamera';

class StubInput implements PointerLookInput {
  pointerDelta = new Vector2();
  wheelDelta = 0;
  pointerDown = false;
}

function lookDirection(camera: PerspectiveCamera): Vector3 {
  return camera.getWorldDirection(new Vector3());
}

describe('OrbitRig', () => {
  it('orbits on drag and ignores pointer movement when not dragging', () => {
    const camera = new PerspectiveCamera();
    const target = new Object3D();
    const input = new StubInput();
    const rig = new OrbitRig(camera, target, input, { stiffness: 1000 });

    const before = camera.position.clone();
    input.pointerDelta.set(100, 0);
    rig.update(1 / 60); // not dragging
    expect(camera.position.distanceTo(before)).toBeLessThan(1e-6);

    input.pointerDown = true;
    rig.update(1 / 60);
    expect(camera.position.distanceTo(before)).toBeGreaterThan(0.5);
  });

  it('clamps pitch and zoom distance', () => {
    const camera = new PerspectiveCamera();
    const input = new StubInput();
    const rig = new OrbitRig(camera, new Object3D(), input, {
      minPitch: 0.2,
      maxPitch: 1.2,
      minDistance: 5,
      maxDistance: 15,
      stiffness: 1000,
    });
    input.pointerDown = true;
    input.pointerDelta.set(0, 1e6);
    rig.update(1 / 60);
    expect(rig.pitch).toBe(1.2);

    input.pointerDelta.set(0, 0);
    input.wheelDelta = 1e6; // zoom way out
    rig.update(1 / 60);
    expect(rig.distance).toBe(15);
    input.wheelDelta = -1e6; // zoom way in
    rig.update(1 / 60);
    expect(rig.distance).toBe(5);
  });

  it('always looks at the (moving) target pivot', () => {
    const camera = new PerspectiveCamera();
    const target = new Object3D();
    const input = new StubInput();
    const rig = new OrbitRig(camera, target, input, { stiffness: 1000 });

    target.position.set(20, 0, -7);
    rig.update(1 / 60);
    const toPivot = target.position
      .clone()
      .add(rig.lookOffset)
      .sub(camera.position)
      .normalize();
    expect(toPivot.dot(lookDirection(camera))).toBeCloseTo(1, 3);
  });
});

describe('ShoulderRig', () => {
  it('sits behind and beside the target, looking at the shoulder pivot', () => {
    const camera = new PerspectiveCamera();
    const target = new Object3D();
    const rig = new ShoulderRig(camera, target, new StubInput(), {
      yaw: 0,
      pitch: 0,
      distance: 3,
      shoulder: 0.6,
      height: 1.5,
    });
    rig.update(1 / 60);
    expect(camera.position.z).toBeCloseTo(3, 1); // behind (+z when yaw=0)
    expect(camera.position.x).toBeCloseTo(0.6, 3); // over the right shoulder
    expect(camera.position.y).toBeCloseTo(1.5, 3);
    // Forward is the flattened look direction (-z at yaw 0).
    expect(rig.forward.z).toBeCloseTo(-1, 3);
  });

  it('turns with pointer movement', () => {
    const camera = new PerspectiveCamera();
    const input = new StubInput();
    const rig = new ShoulderRig(camera, new Object3D(), input, { yaw: 0, pitch: 0 });
    input.pointerDelta.set(500, 0);
    rig.update(1 / 60);
    expect(Math.abs(rig.yaw)).toBeGreaterThan(0.5);
    expect(Math.abs(rig.forward.x)).toBeGreaterThan(0.4); // look dir rotated
  });

  it('pulls the camera in front of blocking geometry', () => {
    const camera = new PerspectiveCamera();
    const target = new Object3D();
    const wall = new Mesh(new BoxGeometry(10, 10, 0.2));
    wall.position.set(0, 1.5, 1.5); // between pivot and desired camera spot
    wall.updateMatrixWorld();

    const rig = new ShoulderRig(camera, target, new StubInput(), {
      yaw: 0,
      pitch: 0,
      shoulder: 0,
      distance: 3,
      colliders: [wall],
      collisionMargin: 0.2,
    });
    rig.update(1 / 60);
    expect(camera.position.z).toBeLessThan(1.5); // in front of the wall
    expect(camera.position.z).toBeGreaterThan(0.5); // but not at the pivot
  });
});

describe('ChaseCamera', () => {
  it('sits behind and above a target, facing +z at heading 0', () => {
    const camera = new PerspectiveCamera();
    const target = new Object3D();
    const chase = new ChaseCamera(camera, target, { distance: 8, height: 4 });
    // Heading 0 → forward is +z → camera behind at −z.
    expect(camera.position.z).toBeCloseTo(-8, 4);
    expect(camera.position.y).toBeCloseTo(4, 4);
    const dir = camera.getWorldDirection(new Vector3());
    expect(dir.z).toBeGreaterThan(0.5); // looking toward +z
  });

  it('swings around behind the target as it turns', () => {
    const camera = new PerspectiveCamera();
    const target = new Object3D();
    const chase = new ChaseCamera(camera, target, { distance: 8, height: 4, stiffness: 1000 });
    target.rotation.y = Math.PI / 2; // now facing +x
    chase.update(1);
    expect(camera.position.x).toBeLessThan(-6); // behind at −x
    expect(Math.abs(camera.position.z)).toBeLessThan(1);
  });

  it('can chase the direction of travel instead of heading', () => {
    const camera = new PerspectiveCamera();
    const target = new Object3D(); // rotation stays 0…
    const source = { velocity: new Vector3(5, 0, 0) }; // …but moving +x
    const chase = new ChaseCamera(camera, target, { mode: 'velocity', distance: 8, stiffness: 1000 });
    chase.setVelocitySource(source);
    chase.update(1);
    expect(camera.position.x).toBeLessThan(-6); // behind the velocity
  });
});
