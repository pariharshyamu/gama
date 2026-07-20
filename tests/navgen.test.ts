import { describe, expect, it } from 'vitest';
import { Box3, BoxGeometry, BufferAttribute, BufferGeometry, Group, Mesh, Vector3 } from 'three';
import { generateNavMesh } from '../src/nav/generateNavMesh';

function box(w: number, h: number, d: number, x: number, y: number, z: number): Mesh {
  const mesh = new Mesh(new BoxGeometry(w, h, d));
  mesh.position.set(x, y, z);
  return mesh;
}

/** A ramp: quad from (x0, y0) rising to (x1, y1), spanning z ∈ [-zHalf, zHalf]. */
function rampGeometry(x0: number, y0: number, x1: number, y1: number, zHalf: number): Mesh {
  const geometry = new BufferGeometry();
  const positions = new Float32Array([
    x0, y0, -zHalf,  x1, y1, zHalf,   x1, y1, -zHalf,
    x0, y0, -zHalf,  x0, y0, zHalf,   x1, y1, zHalf,
  ]);
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return new Mesh(geometry);
}

function pathLength(points: Vector3[]): number {
  let length = 0;
  for (let i = 1; i < points.length; i++) length += points[i].distanceTo(points[i - 1]);
  return length;
}

describe('generateNavMesh', () => {
  it('bakes a walkable floor and routes around an obstacle standing on it', () => {
    const level = new Group();
    level.add(box(20, 1, 20, 0, -0.5, 0)); // floor, top at y=0
    level.add(box(4, 2, 4, 0, 1, 0)); // obstacle in the middle
    const nav = generateNavMesh(level, { cellSize: 0.5, agentRadius: 0.5 });

    expect(nav.triangles.length).toBeGreaterThan(100);

    const from = new Vector3(-8, 0, -8);
    const to = new Vector3(8, 0, 8);
    const path = nav.findPath(from, to)!;
    expect(path).not.toBeNull();
    expect(pathLength(path)).toBeGreaterThan(from.distanceTo(to)); // detoured

    // No floor-level waypoint may pass through the obstacle footprint
    // (inflated by the agent radius).
    for (const p of path) {
      if (p.y < 1) {
        expect(Math.abs(p.x) > 2.3 || Math.abs(p.z) > 2.3).toBe(true);
      }
    }
  });

  it('leaves the obstacle top as a disconnected island', () => {
    const level = new Group();
    level.add(box(20, 1, 20, 0, -0.5, 0));
    level.add(box(6, 2, 6, 0, 1, 0)); // top at y=2, big enough to survive erosion
    const nav = generateNavMesh(level, { cellSize: 0.5, agentRadius: 0.5 });

    // The top surface was sampled...
    const topPoint = nav.closestPoint(new Vector3(0, 2.5, 0));
    expect(topPoint.y).toBeCloseTo(2, 1);
    // ...but no path connects floor to top (cliff seams are unwelded).
    expect(nav.findPath(new Vector3(-8, 0, -8), new Vector3(0, 2, 0))).toBeNull();
  });

  it('keeps gentle ramps walkable and connected across layers', () => {
    const level = new Group();
    level.add(box(10, 1, 10, -7, -0.5, 0)); // low floor, top y=0, x ∈ [-12,-2]
    level.add(rampGeometry(-2, 0, 4, 2, 5)); // ~18° ramp up to y=2
    level.add(box(10, 1, 10, 9, 1.5, 0)); // high floor, top y=2, x ∈ [4,14]
    const nav = generateNavMesh(level, { cellSize: 0.5, agentRadius: 0.4, maxClimb: 0.4 });

    const path = nav.findPath(new Vector3(-10, 0, 0), new Vector3(12, 2, 0))!;
    expect(path).not.toBeNull();
    const end = path[path.length - 1];
    expect(end.y).toBeCloseTo(2, 0.5); // climbed to the high floor
  });

  it('rejects steep slopes', () => {
    const level = new Group();
    level.add(box(10, 1, 10, -7, -0.5, 0)); // low floor
    level.add(rampGeometry(-2, 0, 0.5, 2, 5)); // ~39°... make steeper: rise 2 over 2.5 ≈ 39°
    level.add(box(10, 1, 10, 6, 1.5, 0)); // high floor
    const nav = generateNavMesh(level, {
      cellSize: 0.5,
      agentRadius: 0.4,
      maxSlope: (30 * Math.PI) / 180, // ramp is steeper than allowed
    });
    expect(nav.findPath(new Vector3(-10, 0, 0), new Vector3(9, 2, 0))).toBeNull();
  });

  it('erosion closes gaps narrower than the agent diameter', () => {
    const buildLevel = () => {
      const level = new Group();
      level.add(box(20, 1, 20, 0, -0.5, 0));
      // Wall across the middle with a 1.6-wide doorway at the center.
      level.add(box(9.2, 2, 1, -5.4, 1, 0));
      level.add(box(9.2, 2, 1, 5.4, 1, 0));
      return level;
    };

    const wide = generateNavMesh(buildLevel(), { cellSize: 0.4, agentRadius: 0.4 });
    expect(wide.findPath(new Vector3(0, 0, -8), new Vector3(0, 0, 8))).not.toBeNull();

    const fat = generateNavMesh(buildLevel(), { cellSize: 0.4, agentRadius: 1.2 });
    const path = fat.findPath(new Vector3(0, 0, -8), new Vector3(0, 0, 8));
    expect(path).toBeNull(); // doorway too narrow for this agent
  });

  it('respects explicit bounds', () => {
    const level = box(100, 1, 100, 0, -0.5, 0);
    const nav = generateNavMesh(level, {
      cellSize: 1,
      agentRadius: 0,
      bounds: new Box3(new Vector3(-5, -2, -5), new Vector3(5, 2, 5)),
    });
    // 10x10 cells, 2 triangles each — nothing sampled outside the bounds.
    expect(nav.triangles.length).toBe(200);
    const clamped = nav.closestPoint(new Vector3(40, 0, 0));
    expect(clamped.x).toBeLessThanOrEqual(5);
  });
});
