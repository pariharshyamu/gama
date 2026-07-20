import { Box3, Matrix3, Raycaster, Vector3, type Object3D } from 'three';
import { NavMesh, type NavMeshOptions } from './NavMesh';

export interface NavMeshGenOptions extends NavMeshOptions {
  /** Sampling grid resolution. Smaller = more faithful, more triangles. Default 1. */
  cellSize?: number;
  /** Cells within this distance of an edge/obstacle are removed, so paths
   *  keep agent-sized clearance. Default 0.4. */
  agentRadius?: number;
  /** Steepest walkable surface in radians. Default 45°. */
  maxSlope?: number;
  /** Max height difference between adjacent cells that still connects
   *  them (steps, curbs). Bigger differences become cliffs. Default 0.4. */
  maxClimb?: number;
  /** Region to sample; defaults to the source geometry's bounding box. */
  bounds?: Box3;
}

/**
 * Bake a NavMesh from level geometry by grid sampling: rays are cast down
 * through each cell, the highest hit surface is kept if its slope is
 * walkable, cells near edges/obstacles are eroded by `agentRadius`, and
 * the surviving cells are triangulated (with cliff seams left unwelded so
 * disconnected layers stay disconnected).
 *
 * ```ts
 * const nav = generateNavMesh(levelRoot, { cellSize: 0.5, agentRadius: 0.5 });
 * agent.addComponent(new NavMeshAgent(nav));
 * ```
 *
 * Scope (documented honestly): this is single-layer sampling — the highest
 * surface in a cell wins, so walkable areas *underneath* bridges/floors
 * are not captured. Ramps and stairs connect layers when each cell-to-cell
 * rise stays within `maxClimb`. For full multi-layer voxelization, use a
 * Recast-based pipeline and feed its triangles to `new NavMesh(...)`.
 */
export function generateNavMesh(
  source: Object3D | Object3D[],
  options: NavMeshGenOptions = {}
): NavMesh {
  const cellSize = options.cellSize ?? 1;
  const agentRadius = options.agentRadius ?? 0.4;
  const maxSlope = options.maxSlope ?? Math.PI / 4;
  const maxClimb = options.maxClimb ?? 0.4;

  const sources = Array.isArray(source) ? source : [source];
  for (const s of sources) s.updateMatrixWorld(true);

  const bounds = options.bounds ?? sources.reduce((box, s) => box.expandByObject(s), new Box3());
  const cols = Math.max(1, Math.round((bounds.max.x - bounds.min.x) / cellSize));
  const rows = Math.max(1, Math.round((bounds.max.z - bounds.min.z) / cellSize));

  // --- Sample: height per cell, NaN = unwalkable.
  const heights = new Float64Array(cols * rows).fill(NaN);
  const raycaster = new Raycaster();
  raycaster.far = bounds.max.y - bounds.min.y + 2;
  const down = new Vector3(0, -1, 0);
  const origin = new Vector3();
  const normalMatrix = new Matrix3();
  const worldNormal = new Vector3();
  const minNormalY = Math.cos(maxSlope);

  for (let cz = 0; cz < rows; cz++) {
    for (let cx = 0; cx < cols; cx++) {
      origin.set(
        bounds.min.x + (cx + 0.5) * cellSize,
        bounds.max.y + 1,
        bounds.min.z + (cz + 0.5) * cellSize
      );
      raycaster.set(origin, down);
      const hit = raycaster.intersectObjects(sources, true)[0];
      if (!hit || !hit.face) continue;
      normalMatrix.getNormalMatrix(hit.object.matrixWorld);
      worldNormal.copy(hit.face.normal).applyMatrix3(normalMatrix).normalize();
      if (worldNormal.y >= minNormalY) heights[cz * cols + cx] = hit.point.y;
    }
  }

  // --- Erode: remove walkable cells within agentRadius of a boundary
  // (missing neighbor or a cliff-sized height discontinuity).
  const radiusCells = Math.round(agentRadius / cellSize);
  if (radiusCells > 0) {
    const eroded = heights.slice();
    for (let cz = 0; cz < rows; cz++) {
      for (let cx = 0; cx < cols; cx++) {
        const h = heights[cz * cols + cx];
        if (Number.isNaN(h)) continue;
        outer: for (let dz = -radiusCells; dz <= radiusCells; dz++) {
          for (let dx = -radiusCells; dx <= radiusCells; dx++) {
            if (dx * dx + dz * dz > radiusCells * radiusCells) continue;
            const nx = cx + dx;
            const nz = cz + dz;
            const neighbor =
              nx < 0 || nx >= cols || nz < 0 || nz >= rows ? NaN : heights[nz * cols + nx];
            if (Number.isNaN(neighbor) || Math.abs(neighbor - h) > maxClimb) {
              eroded[cz * cols + cx] = NaN;
              break outer;
            }
          }
        }
      }
    }
    heights.set(eroded);
  }

  // --- Triangulate surviving cells. A corner's height is averaged over
  // the adjacent walkable cells whose height is within maxClimb of this
  // cell — so compatible neighbors share identical (weldable) corners
  // while cliff seams produce distinct vertices and stay disconnected.
  const cellAt = (cx: number, cz: number): number =>
    cx < 0 || cx >= cols || cz < 0 || cz >= rows ? NaN : heights[cz * cols + cx];

  const cornerHeight = (cx: number, cz: number, gx: number, gz: number, h: number): number => {
    let sum = 0;
    let count = 0;
    for (const [ax, az] of [
      [gx - 1, gz - 1],
      [gx, gz - 1],
      [gx - 1, gz],
      [gx, gz],
    ]) {
      const ah = cellAt(ax, az);
      if (!Number.isNaN(ah) && Math.abs(ah - h) <= maxClimb) {
        sum += ah;
        count++;
      }
    }
    return count > 0 ? sum / count : h;
  };

  const positions: number[] = [];
  for (let cz = 0; cz < rows; cz++) {
    for (let cx = 0; cx < cols; cx++) {
      const h = heights[cz * cols + cx];
      if (Number.isNaN(h)) continue;
      const x0 = bounds.min.x + cx * cellSize;
      const z0 = bounds.min.z + cz * cellSize;
      const x1 = x0 + cellSize;
      const z1 = z0 + cellSize;
      const h00 = cornerHeight(cx, cz, cx, cz, h);
      const h10 = cornerHeight(cx, cz, cx + 1, cz, h);
      const h01 = cornerHeight(cx, cz, cx, cz + 1, h);
      const h11 = cornerHeight(cx, cz, cx + 1, cz + 1, h);
      positions.push(x0, h00, z0, x1, h11, z1, x1, h10, z0);
      positions.push(x0, h00, z0, x0, h01, z1, x1, h11, z1);
    }
  }

  return new NavMesh(positions, undefined, { weldTolerance: options.weldTolerance });
}
