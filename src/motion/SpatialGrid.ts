import type { Vector3 } from 'three';
import type { MotionAgent } from './MotionAgent';

/**
 * A spatial hash over agents that turns O(n²) flocking neighbor queries
 * into near-O(n). Rebuild once per frame, then hand `grid.near(agent, r)`
 * to Separation/Alignment/Cohesion as their Neighbors source.
 *
 * ```ts
 * const grid = new SpatialGrid(4);
 * game.onUpdate(() => grid.rebuild(flock));
 * agent.addBehavior(new Separation(grid.near(agent, 2), 2));
 * ```
 *
 * Pick `cellSize` close to your largest query radius. Query radius should
 * be ≥ the behavior's own radius (the behavior filters further).
 */
export class SpatialGrid {
  private cells = new Map<string, MotionAgent[]>();

  constructor(public cellSize = 5) {}

  rebuild(agents: Iterable<MotionAgent>): void {
    this.cells.clear();
    for (const agent of agents) {
      const key = this.keyFor(agent.position);
      let cell = this.cells.get(key);
      if (!cell) {
        cell = [];
        this.cells.set(key, cell);
      }
      cell.push(agent);
    }
  }

  /** All agents within `radius` of `center`. Pass `out` to avoid allocation. */
  neighbors(center: Vector3, radius: number, out: MotionAgent[] = []): MotionAgent[] {
    out.length = 0;
    const s = this.cellSize;
    const r2 = radius * radius;
    const minX = Math.floor((center.x - radius) / s);
    const maxX = Math.floor((center.x + radius) / s);
    const minY = Math.floor((center.y - radius) / s);
    const maxY = Math.floor((center.y + radius) / s);
    const minZ = Math.floor((center.z - radius) / s);
    const maxZ = Math.floor((center.z + radius) / s);
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          const cell = this.cells.get(`${x},${y},${z}`);
          if (!cell) continue;
          for (const agent of cell) {
            if (agent.position.distanceToSquared(center) <= r2) out.push(agent);
          }
        }
      }
    }
    return out;
  }

  /**
   * A Neighbors source bound to an agent's live position, with a reused
   * result array — plug directly into flocking behaviors.
   */
  near(agent: MotionAgent, radius: number): () => MotionAgent[] {
    const out: MotionAgent[] = [];
    return () => this.neighbors(agent.position, radius, out);
  }

  private keyFor(p: Vector3): string {
    const s = this.cellSize;
    return `${Math.floor(p.x / s)},${Math.floor(p.y / s)},${Math.floor(p.z / s)}`;
  }
}
