import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { GameObject } from '../src/core/GameObject';
import { Time } from '../src/core/Time';
import { MotionAgent } from '../src/motion/MotionAgent';
import { NavMesh } from '../src/nav/NavMesh';
import { NavMeshAgent } from '../src/nav/NavMeshAgent';

/** Build a navmesh from a grid of unit cells (two triangles per cell). */
function gridNavMesh(
  cells: Array<[number, number]>,
  cellSize: number,
  origin = { x: 0, z: 0 }
): NavMesh {
  const positions: number[] = [];
  for (const [cx, cz] of cells) {
    const x0 = origin.x + cx * cellSize;
    const z0 = origin.z + cz * cellSize;
    const x1 = x0 + cellSize;
    const z1 = z0 + cellSize;
    // Two CCW triangles per cell.
    positions.push(x0, 0, z0, x1, 0, z1, x1, 0, z0);
    positions.push(x0, 0, z0, x0, 0, z1, x1, 0, z1);
  }
  return new NavMesh(positions);
}

/** 3x3 grid of 12-unit cells centered at origin, with the middle cell missing. */
function donutNavMesh(): NavMesh {
  const cells: Array<[number, number]> = [];
  for (let x = 0; x < 3; x++) {
    for (let z = 0; z < 3; z++) {
      if (x === 1 && z === 1) continue;
      cells.push([x, z]);
    }
  }
  return gridNavMesh(cells, 12, { x: -18, z: -18 });
}

function pathLength(points: Vector3[]): number {
  let length = 0;
  for (let i = 1; i < points.length; i++) length += points[i].distanceTo(points[i - 1]);
  return length;
}

describe('NavMesh', () => {
  it('welds shared vertices and derives adjacency', () => {
    const nav = gridNavMesh(
      [
        [0, 0],
        [1, 0],
      ],
      10
    );
    expect(nav.triangles).toHaveLength(4);
    // Every triangle touches at least one other.
    for (const tri of nav.triangles) expect(tri.neighbors.length).toBeGreaterThan(0);
  });

  it('returns a straight two-point path within a convex region', () => {
    const nav = gridNavMesh([[0, 0]], 10);
    const path = nav.findPath(new Vector3(1, 0, 1), new Vector3(9, 0, 9));
    expect(path).not.toBeNull();
    expect(pathLength(path!)).toBeCloseTo(new Vector3(8, 0, 8).length(), 1);
  });

  it('string-pulls a long corridor into a near-straight path', () => {
    // 10 cells in a row; naive centroid-hopping would zig-zag.
    const cells: Array<[number, number]> = Array.from({ length: 10 }, (_, i) => [i, 0]);
    const nav = gridNavMesh(cells, 5);
    const from = new Vector3(1, 0, 2.5);
    const to = new Vector3(49, 0, 2.5);
    const path = nav.findPath(from, to)!;
    expect(path).not.toBeNull();
    expect(pathLength(path)).toBeCloseTo(from.distanceTo(to), 1);
  });

  it('routes around a hole and cuts the corners tightly', () => {
    const nav = donutNavMesh();
    const from = new Vector3(-15, 0, -15);
    const to = new Vector3(15, 0, 15);
    const path = nav.findPath(from, to)!;
    expect(path).not.toBeNull();

    // Must be longer than the (blocked) straight line, but not by much more
    // than the optimal corner-hugging route around the center hole.
    const direct = from.distanceTo(to);
    const length = pathLength(path);
    expect(length).toBeGreaterThan(direct);
    expect(length).toBeLessThan(direct * 1.25);

    // No waypoint may sit inside the hole (center 12x12 cell, |x|,|z| < 6).
    for (const p of path) {
      const inHole = Math.abs(p.x) < 5.9 && Math.abs(p.z) < 5.9;
      expect(inHole).toBe(false);
    }

    // Interior corners of the hole should appear as path corners.
    expect(path.length).toBeGreaterThanOrEqual(3);
  });

  it('returns null for disconnected islands', () => {
    const nav = gridNavMesh(
      [
        [0, 0],
        [5, 5], // far away, no shared edge
      ],
      10
    );
    const path = nav.findPath(new Vector3(5, 0, 5), new Vector3(55, 0, 55));
    expect(path).toBeNull();
  });

  it('clamps off-mesh endpoints onto the surface', () => {
    const nav = gridNavMesh([[0, 0]], 10);
    const path = nav.findPath(new Vector3(-5, 3, 5), new Vector3(20, -2, 5))!;
    expect(path[0].x).toBeCloseTo(0);
    expect(path[0].y).toBeCloseTo(0);
    expect(path[path.length - 1].x).toBeCloseTo(10);
    const clamped = nav.closestPoint(new Vector3(50, 9, 5));
    expect(clamped.x).toBeCloseTo(10);
    expect(clamped.y).toBeCloseTo(0);
    expect(clamped.z).toBeCloseTo(5);
  });
});

describe('NavMeshAgent', () => {
  it('drives an agent around the hole to the destination and emits nav-arrived', () => {
    const nav = donutNavMesh();
    const object = new GameObject('walker');
    object.position.set(-15, 0, -15);
    const motion = object.addComponent(new MotionAgent({ maxSpeed: 6, maxForce: 40, planar: true }));
    const navAgent = object.addComponent(new NavMeshAgent(nav));

    expect(navAgent.goTo(new Vector3(15, 0, 15))).toBe(true);
    expect(navAgent.isMoving).toBe(true);

    let arrived = false;
    object.events.on('nav-arrived', () => (arrived = true));

    const time = new Time();
    time.delta = 1 / 60;
    let enteredHole = false;
    for (let i = 0; i < 60 * 30 && !arrived; i++) {
      motion.update(time);
      navAgent.update(time);
      if (Math.abs(object.position.x) < 4 && Math.abs(object.position.z) < 4) {
        enteredHole = true;
      }
    }

    expect(arrived).toBe(true);
    expect(navAgent.isMoving).toBe(false);
    expect(object.position.distanceTo(new Vector3(15, 0, 15))).toBeLessThan(1);
    expect(enteredHole).toBe(false);
  });

  it('returns false and keeps state when the target is unreachable', () => {
    const nav = gridNavMesh(
      [
        [0, 0],
        [5, 5],
      ],
      10
    );
    const object = new GameObject();
    object.position.set(5, 0, 5);
    object.addComponent(new MotionAgent());
    const navAgent = object.addComponent(new NavMeshAgent(nav));
    // Both points resolve to triangles, but the islands are disconnected.
    expect(navAgent.goTo(new Vector3(55, 0, 55))).toBe(false);
    expect(navAgent.isMoving).toBe(false);
  });

  it('stop() abandons the path without emitting arrival', () => {
    const nav = gridNavMesh([[0, 0]], 10);
    const object = new GameObject();
    object.position.set(1, 0, 1);
    object.addComponent(new MotionAgent());
    const navAgent = object.addComponent(new NavMeshAgent(nav));
    let arrived = false;
    object.events.on('nav-arrived', () => (arrived = true));

    navAgent.goTo(new Vector3(9, 0, 9));
    navAgent.stop();
    expect(navAgent.isMoving).toBe(false);
    expect(navAgent.currentPath).toBeNull();
    expect(arrived).toBe(false);
  });
});
