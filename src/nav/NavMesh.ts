import { BufferAttribute, BufferGeometry, Triangle, Vector3 } from 'three';

export interface NavMeshOptions {
  /** Vertices closer than this are welded into one. Default 1e-3. */
  weldTolerance?: number;
}

export interface NavTriangle {
  index: number;
  triangle: Triangle;
  centroid: Vector3;
  /** Adjacent triangles and the welded vertex indices of the shared edge. */
  neighbors: Array<{ tri: number; va: number; vb: number }>;
}

interface Portal {
  left: Vector3;
  right: Vector3;
}

/**
 * A walkable-surface navigation mesh built from triangle geometry.
 * Feed it the triangles of your walkable floor (authored in your DCC tool,
 * exported from a plugin, or built in code); it welds shared vertices,
 * derives triangle adjacency, and answers path queries:
 *
 * ```ts
 * const nav = NavMesh.fromGeometry(floorGeometry);
 * const waypoints = nav.findPath(enemy.position, player.position);
 * ```
 *
 * `findPath` runs A* over the triangle graph and then string-pulls the
 * result with the funnel algorithm, so paths hug corners naturally
 * instead of zig-zagging between triangle centers. Pair with
 * `NavMeshAgent` for `agent.goTo(point)`.
 */
export class NavMesh {
  readonly vertices: Vector3[] = [];
  readonly triangles: NavTriangle[] = [];

  constructor(
    positions: ArrayLike<number>,
    indices?: ArrayLike<number>,
    options: NavMeshOptions = {}
  ) {
    const tolerance = options.weldTolerance ?? 1e-3;
    const keyToVertex = new Map<string, number>();

    const weld = (x: number, y: number, z: number): number => {
      const key = `${Math.round(x / tolerance)},${Math.round(y / tolerance)},${Math.round(z / tolerance)}`;
      let index = keyToVertex.get(key);
      if (index === undefined) {
        index = this.vertices.length;
        this.vertices.push(new Vector3(x, y, z));
        keyToVertex.set(key, index);
      }
      return index;
    };

    const triCount = indices ? indices.length / 3 : positions.length / 9;
    const cornerAt = (corner: number): number => (indices ? indices[corner] : corner);

    const edgeToTris = new Map<string, Array<{ tri: number; va: number; vb: number }>>();
    for (let t = 0; t < triCount; t++) {
      const ids: number[] = [];
      for (let c = 0; c < 3; c++) {
        const p = cornerAt(t * 3 + c) * 3;
        ids.push(weld(positions[p], positions[p + 1], positions[p + 2]));
      }
      const [ia, ib, ic] = ids;
      if (ia === ib || ib === ic || ia === ic) continue; // degenerate

      const a = this.vertices[ia];
      const b = this.vertices[ib];
      const c = this.vertices[ic];
      const triangle = new Triangle(a, b, c);
      if (triangle.getArea() < tolerance * tolerance) continue;

      const index = this.triangles.length;
      this.triangles.push({
        index,
        triangle,
        centroid: new Vector3().add(a).add(b).add(c).divideScalar(3),
        neighbors: [],
      });

      for (const [va, vb] of [
        [ia, ib],
        [ib, ic],
        [ic, ia],
      ]) {
        const key = va < vb ? `${va}_${vb}` : `${vb}_${va}`;
        let list = edgeToTris.get(key);
        if (!list) {
          list = [];
          edgeToTris.set(key, list);
        }
        list.push({ tri: index, va, vb });
      }
    }

    for (const list of edgeToTris.values()) {
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (i === j) continue;
          this.triangles[list[i].tri].neighbors.push({
            tri: list[j].tri,
            va: list[i].va,
            vb: list[i].vb,
          });
        }
      }
    }
  }

  static fromGeometry(geometry: BufferGeometry, options?: NavMeshOptions): NavMesh {
    const position = geometry.getAttribute('position') as BufferAttribute;
    return new NavMesh(
      position.array as ArrayLike<number>,
      geometry.index ? (geometry.index.array as ArrayLike<number>) : undefined,
      options
    );
  }

  /** The triangle whose surface is closest to `point`, or null if empty. */
  closestTriangle(point: Vector3): NavTriangle | null {
    let best: NavTriangle | null = null;
    let bestDistSq = Infinity;
    const scratch = new Vector3();
    for (const tri of this.triangles) {
      tri.triangle.closestPointToPoint(point, scratch);
      const distSq = scratch.distanceToSquared(point);
      if (distSq < bestDistSq) {
        bestDistSq = distSq;
        best = tri;
      }
    }
    return best;
  }

  /** Clamp a point onto the navmesh surface. */
  closestPoint(point: Vector3, target = new Vector3()): Vector3 {
    const tri = this.closestTriangle(point);
    if (!tri) return target.copy(point);
    return tri.triangle.closestPointToPoint(point, target);
  }

  /**
   * Shortest known path from `from` to `to` as smoothed waypoints (both
   * endpoints clamped onto the mesh and included). Returns null when the
   * endpoints are on disconnected parts of the mesh, or the mesh is empty.
   */
  findPath(from: Vector3, to: Vector3): Vector3[] | null {
    const startTri = this.closestTriangle(from);
    const endTri = this.closestTriangle(to);
    if (!startTri || !endTri) return null;

    const start = startTri.triangle.closestPointToPoint(from, new Vector3());
    const end = endTri.triangle.closestPointToPoint(to, new Vector3());
    if (startTri === endTri) return [start, end];

    const corridor = this.aStar(startTri, endTri, end);
    if (!corridor) return null;

    return this.funnel(corridor, start, end);
  }

  /** Build renderable geometry of the walkable surface (debug overlays). */
  toBufferGeometry(): BufferGeometry {
    const positions = new Float32Array(this.triangles.length * 9);
    let offset = 0;
    for (const { triangle } of this.triangles) {
      for (const v of [triangle.a, triangle.b, triangle.c]) {
        positions[offset++] = v.x;
        positions[offset++] = v.y;
        positions[offset++] = v.z;
      }
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    return geometry;
  }

  /** A* over triangle adjacency; returns the triangle corridor or null. */
  private aStar(startTri: NavTriangle, endTri: NavTriangle, goal: Vector3): NavTriangle[] | null {
    const g = new Map<number, number>();
    const cameFrom = new Map<number, number>();
    const closed = new Set<number>();
    // Simple binary min-heap of [fScore, triIndex].
    const heap: Array<[number, number]> = [];
    const push = (entry: [number, number]) => {
      heap.push(entry);
      let i = heap.length - 1;
      while (i > 0) {
        const parent = (i - 1) >> 1;
        if (heap[parent][0] <= heap[i][0]) break;
        [heap[parent], heap[i]] = [heap[i], heap[parent]];
        i = parent;
      }
    };
    const pop = (): [number, number] | undefined => {
      const top = heap[0];
      const last = heap.pop();
      if (heap.length && last) {
        heap[0] = last;
        let i = 0;
        for (;;) {
          const l = i * 2 + 1;
          const r = l + 1;
          let smallest = i;
          if (l < heap.length && heap[l][0] < heap[smallest][0]) smallest = l;
          if (r < heap.length && heap[r][0] < heap[smallest][0]) smallest = r;
          if (smallest === i) break;
          [heap[smallest], heap[i]] = [heap[i], heap[smallest]];
          i = smallest;
        }
      }
      return top;
    };

    g.set(startTri.index, 0);
    push([startTri.centroid.distanceTo(goal), startTri.index]);

    while (heap.length) {
      const entry = pop();
      if (!entry) break;
      const current = entry[1];
      if (current === endTri.index) {
        const corridor: NavTriangle[] = [];
        let walk: number | undefined = current;
        while (walk !== undefined) {
          corridor.push(this.triangles[walk]);
          walk = cameFrom.get(walk);
        }
        return corridor.reverse();
      }
      if (closed.has(current)) continue;
      closed.add(current);

      const tri = this.triangles[current];
      for (const { tri: next } of tri.neighbors) {
        if (closed.has(next)) continue;
        const tentative =
          (g.get(current) ?? Infinity) +
          tri.centroid.distanceTo(this.triangles[next].centroid);
        if (tentative < (g.get(next) ?? Infinity)) {
          g.set(next, tentative);
          cameFrom.set(next, current);
          push([tentative + this.triangles[next].centroid.distanceTo(goal), next]);
        }
      }
    }
    return null;
  }

  /** Funnel (string-pulling) over the corridor's portal edges, in XZ. */
  private funnel(corridor: NavTriangle[], start: Vector3, end: Vector3): Vector3[] {
    const portals: Portal[] = [{ left: start, right: start }];
    const direction = new Vector3();
    for (let i = 0; i < corridor.length - 1; i++) {
      const edge = corridor[i].neighbors.find((n) => n.tri === corridor[i + 1].index);
      if (!edge) return [start, end]; // should not happen; fail soft
      direction.copy(corridor[i + 1].centroid).sub(corridor[i].centroid);
      const va = this.vertices[edge.va];
      const vb = this.vertices[edge.vb];
      // side > 0 ⇔ va is on the left of the travel direction (see triarea2).
      const side =
        direction.x * (va.z - corridor[i].centroid.z) -
        direction.z * (va.x - corridor[i].centroid.x);
      portals.push(side > 0 ? { left: va, right: vb } : { left: vb, right: va });
    }
    portals.push({ left: end, right: end });
    return stringPull(portals);
  }
}

/** Twice the signed XZ area of (a, b, c); > 0 when c is left of a→b. */
function triarea2(a: Vector3, b: Vector3, c: Vector3): number {
  return (b.x - a.x) * (c.z - a.z) - (c.x - a.x) * (b.z - a.z);
}

function sameXZ(a: Vector3, b: Vector3): boolean {
  return (a.x - b.x) ** 2 + (a.z - b.z) ** 2 < 1e-8;
}

/** Simple Stupid Funnel Algorithm over a portal channel. */
function stringPull(portals: Portal[]): Vector3[] {
  const points: Vector3[] = [portals[0].left.clone()];
  let apex = portals[0].left;
  let left = portals[0].left;
  let right = portals[0].right;
  let apexIndex = 0;
  let leftIndex = 0;
  let rightIndex = 0;

  for (let i = 1; i < portals.length; i++) {
    const pl = portals[i].left;
    const pr = portals[i].right;

    // Tighten the right side of the funnel.
    if (triarea2(apex, right, pr) >= 0) {
      if (sameXZ(apex, right) || triarea2(apex, left, pr) < 0) {
        right = pr;
        rightIndex = i;
      } else {
        // Right crossed over left: the left bound is a path corner.
        points.push(left.clone());
        apex = left;
        apexIndex = leftIndex;
        left = apex;
        right = apex;
        leftIndex = apexIndex;
        rightIndex = apexIndex;
        i = apexIndex;
        continue;
      }
    }
    // Tighten the left side of the funnel.
    if (triarea2(apex, left, pl) <= 0) {
      if (sameXZ(apex, left) || triarea2(apex, right, pl) > 0) {
        left = pl;
        leftIndex = i;
      } else {
        points.push(right.clone());
        apex = right;
        apexIndex = rightIndex;
        left = apex;
        right = apex;
        leftIndex = apexIndex;
        rightIndex = apexIndex;
        i = apexIndex;
        continue;
      }
    }
  }
  const last = portals[portals.length - 1].left;
  if (!sameXZ(points[points.length - 1], last)) points.push(last.clone());
  return points;
}
