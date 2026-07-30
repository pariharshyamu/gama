import type { Vector3 } from 'three';
import type { MotionAgent } from './MotionAgent';

/**
 * How much work the last frame's queries actually did.
 *
 * The point of a broadphase is to do less, so the only way to know it is
 * working is to count. `cellsVisited / queries` says whether `cellSize` is
 * sane — a grid far finer than the query radius sweeps dozens of cells per
 * query, most of them empty — and `tested / found` says how selective the
 * cells are once reached. Both are exact integers for a given scene, which
 * makes them the thing to assert in a perf test: a change that scans more to
 * return the same neighbors is invisible to the result and obvious here.
 */
export interface SpatialGridStats {
  /** `neighbors()` calls. */
  queries: number;
  /** Cell coordinates looked up — empty ones included, because they cost. */
  cellsVisited: number;
  /** Cells that held at least one agent. */
  cellsOccupied: number;
  /** Distance comparisons performed. */
  tested: number;
  /** Agents returned. */
  found: number;
}

/**
 * A spatial hash over agents that turns O(n²) flocking neighbor queries
 * into near-O(n). Rebuild once per frame, then hand `grid.near(agent, r)`
 * to Separation/Alignment/Cohesion as their Neighbors source.
 *
 * **Worth it above roughly 500 agents.** Below that a plain array is faster
 * AND simpler: the grid trades a per-agent rebuild every frame for fewer
 * comparisons, and a small flock does not have enough comparisons to pay for
 * the rebuild. Measured — `npm run bench:throughput` — 100 agents cost
 * 0.30 ms with an array and 0.78 ms with the grid; 2000 cost 91.9 ms and
 * 19.8 ms. Better asymptotics are not the same thing as faster.
 *
 * ```ts
 * const grid = new SpatialGrid(4);
 * game.onUpdate(() => grid.rebuild(flock));
 * agent.addBehavior(new Separation(grid.near(agent, 2), 2));
 * ```
 *
 * Pick `cellSize` close to your largest query radius. Query radius should
 * be ≥ the behavior's own radius (the behavior filters further). If you are
 * not sure you picked well, read `stats` — see {@link SpatialGridStats}.
 */
/**
 * Cell coordinates are packed into ONE number rather than a `"x,y,z"` string.
 *
 * This is the whole performance story of the class. A string key means a
 * concatenation plus a string hash per agent per rebuild AND per cell per
 * query — a query sweeping 27 cells built 27 strings to do 27 Map lookups.
 * Measured at 400 agents, that made the "fast" broadphase 2x SLOWER than
 * comparing every agent to every other one, which is the opposite of the
 * reason it exists.
 *
 * 16 bits per axis, biased so negatives pack: ±32768 cells, or ±163,840 world
 * units at the default `cellSize` of 5. The product stays under 2^48, well
 * inside the 2^53 exact-integer range, so keys never collide within that
 * volume. Outside it they can, which is a real limit and a very large box.
 */
const AXIS = 1 << 16;
const BIAS = 1 << 15;
const packCell = (x: number, y: number, z: number): number =>
  ((x + BIAS) * AXIS + (y + BIAS)) * AXIS + (z + BIAS);

export class SpatialGrid {
  private cells = new Map<number, MotionAgent[]>();

  /**
   * Work done by queries since the last `rebuild()`. Since `rebuild()` is a
   * once-per-frame call, reading this at the end of a frame describes that
   * frame. Call {@link resetStats} instead if you rebuild on another cadence.
   */
  readonly stats: SpatialGridStats = {
    queries: 0,
    cellsVisited: 0,
    cellsOccupied: 0,
    tested: 0,
    found: 0,
  };

  constructor(public cellSize = 5) {}

  /** How many cells currently hold agents. */
  get cellCount(): number {
    return this.cells.size;
  }

  /** Zero the work counters. `rebuild()` does this for you. */
  resetStats(): void {
    const s = this.stats;
    s.queries = s.cellsVisited = s.cellsOccupied = s.tested = s.found = 0;
  }

  rebuild(agents: Iterable<MotionAgent>): void {
    this.cells.clear();
    this.resetStats();
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
    const stats = this.stats;
    stats.queries++;
    const minX = Math.floor((center.x - radius) / s);
    const maxX = Math.floor((center.x + radius) / s);
    const minY = Math.floor((center.y - radius) / s);
    const maxY = Math.floor((center.y + radius) / s);
    const minZ = Math.floor((center.z - radius) / s);
    const maxZ = Math.floor((center.z + radius) / s);
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          stats.cellsVisited++;
          const cell = this.cells.get(packCell(x, y, z));
          if (!cell) continue;
          stats.cellsOccupied++;
          stats.tested += cell.length;
          for (const agent of cell) {
            if (agent.position.distanceToSquared(center) <= r2) out.push(agent);
          }
        }
      }
    }
    stats.found += out.length;
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

  private keyFor(p: Vector3): number {
    const s = this.cellSize;
    return packCell(Math.floor(p.x / s), Math.floor(p.y / s), Math.floor(p.z / s));
  }
}
