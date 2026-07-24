export interface Point2 {
  x: number;
  z: number;
}

/**
 * A closed race circuit as pure geometry over its waypoint polyline — no
 * visuals (SCENA's `createPath` draws the ribbon from the same points). It
 * answers the two questions a racing game keeps asking: *how far off the
 * racing line am I?* (for grip loss) and *how far around the lap am I?* (for
 * lap counting and standings).
 *
 * ```ts
 * const circuit = new Circuit(WAYPOINTS);
 * const drive = new VehicleController(game.input, {
 *   vehicle: car,
 *   offTrack: (x, z) => circuit.distanceTo(x, z) > 4,   // grass past the verge
 * });
 * ```
 */
export class Circuit {
  readonly points: Point2[];
  /** Total centreline length (metres). */
  readonly length: number;
  private readonly cumulative: number[]; // arc length at the start of each segment

  constructor(points: Point2[]) {
    if (points.length < 3) throw new Error('Circuit needs at least 3 waypoints');
    this.points = points.map((p) => ({ x: p.x, z: p.z }));
    this.cumulative = [];
    let total = 0;
    const n = this.points.length;
    for (let i = 0; i < n; i++) {
      this.cumulative.push(total);
      const a = this.points[i];
      const b = this.points[(i + 1) % n];
      total += Math.hypot(b.x - a.x, b.z - a.z);
    }
    this.length = total;
  }

  /** Perpendicular distance from (x, z) to the nearest centreline segment. */
  distanceTo(x: number, z: number): number {
    return Math.sqrt(this.nearest(x, z).distSq);
  }

  /** Fractional position around the lap, 0 at the start/finish line … 1. */
  progress(x: number, z: number): number {
    const { index, t } = this.nearest(x, z);
    const a = this.points[index];
    const b = this.points[(index + 1) % this.points.length];
    const seg = Math.hypot(b.x - a.x, b.z - a.z);
    return ((this.cumulative[index] + t * seg) / this.length) % 1;
  }

  /** Nearest segment index, param t in [0,1] along it, and squared distance. */
  private nearest(x: number, z: number): { index: number; t: number; distSq: number } {
    let best = { index: 0, t: 0, distSq: Infinity };
    const n = this.points.length;
    for (let i = 0; i < n; i++) {
      const a = this.points[i];
      const b = this.points[(i + 1) % n];
      const abx = b.x - a.x;
      const abz = b.z - a.z;
      const lenSq = abx * abx + abz * abz || 1e-6;
      let t = ((x - a.x) * abx + (z - a.z) * abz) / lenSq;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const px = a.x + abx * t;
      const pz = a.z + abz * t;
      const distSq = (x - px) * (x - px) + (z - pz) * (z - pz);
      if (distSq < best.distSq) best = { index: i, t, distSq };
    }
    return best;
  }
}

export interface LapTrackerOptions {
  /** Total laps in the race; sets `finished` when reached. 0 = endless. Default 0. */
  laps?: number;
}

export interface LapState {
  /** Completed laps. */
  lap: number;
  /** Seconds into the current lap. */
  lapTime: number;
  /** Duration of the last completed lap (seconds), or 0. */
  lastLap: number;
  /** Best completed lap (seconds), or Infinity. */
  bestLap: number;
  /** True once `laps` completed (endless races never finish). */
  finished: boolean;
}

/**
 * Counts laps and times them by watching a body's `Circuit.progress` cross
 * the start/finish line in the forward direction (driving backward across it
 * doesn't count). Feed it your position each frame.
 *
 * ```ts
 * const laps = new LapTracker(circuit, { laps: 3 });
 * game.onUpdate((t) => {
 *   const s = laps.update(t.delta, car.object.position.x, car.object.position.z);
 *   hud.textContent = `LAP ${s.lap + 1} · ${s.lapTime.toFixed(1)}s`;
 * });
 * ```
 */
export class LapTracker {
  lap = 0;
  lapTime = 0;
  lastLap = 0;
  bestLap = Infinity;
  finished = false;

  private prev = -1;
  private started = false;

  constructor(private circuit: Circuit, private options: LapTrackerOptions = {}) {}

  update(dt: number, x: number, z: number): LapState {
    const p = this.circuit.progress(x, z);
    if (!this.started) {
      this.prev = p;
      this.started = true;
      return this.state();
    }
    if (this.finished) return this.state();

    this.lapTime += dt;
    // Forward line crossing: progress wraps high → low.
    if (this.prev > 0.75 && p < 0.25) {
      this.lastLap = this.lapTime;
      this.bestLap = Math.min(this.bestLap, this.lapTime);
      this.lapTime = 0;
      this.lap += 1;
      if (this.options.laps && this.lap >= this.options.laps) this.finished = true;
    }
    this.prev = p;
    return this.state();
  }

  reset(): void {
    this.lap = 0;
    this.lapTime = 0;
    this.lastLap = 0;
    this.bestLap = Infinity;
    this.finished = false;
    this.prev = -1;
    this.started = false;
  }

  private state(): LapState {
    return {
      lap: this.lap,
      lapTime: this.lapTime,
      lastLap: this.lastLap,
      bestLap: this.bestLap,
      finished: this.finished,
    };
  }
}
