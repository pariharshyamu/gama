import { EventEmitter } from '../core/EventEmitter';

/** A change to the stockpile: `count` is the new total for `resource`. */
export interface StockChange {
  resource: string;
  count: number;
  delta: number;
}

export interface StockpileEvents extends Record<string, unknown> {
  /** Any resource count changed. */
  change: StockChange;
  /** A resource reached the stockpile's capacity. */
  full: StockChange;
}

export interface StockpileOptions {
  /** Per-resource maximum (adds clamp at this count). Default: unbounded. */
  capacity?: number;
  /** Starting counts, e.g. `{ wood: 5 }`. */
  initial?: Record<string, number>;
}

/**
 * A resource counter — the "produce something" payoff for work stations,
 * crafting and gathering loops. Wire a SCENA `WorkStation.onYield` into it and
 * a HUD to its `change` event:
 *
 * ```ts
 * const stock = new Stockpile();
 * choppingBlock.onYield = () => stock.add('wood');
 * stock.events.on('change', ({ resource, count }) => hud.set(resource, count));
 * ```
 *
 * `add`/`remove` clamp at 0 (and at `capacity`, if set), return the new count,
 * and emit `change` (and `full` when a resource tops out). Not a component —
 * keep one per player/base and share it freely.
 */
export class Stockpile {
  readonly events = new EventEmitter<StockpileEvents>();
  readonly capacity: number;
  private readonly counts = new Map<string, number>();

  constructor(options: StockpileOptions = {}) {
    this.capacity = options.capacity ?? Infinity;
    for (const [resource, n] of Object.entries(options.initial ?? {})) {
      this.counts.set(resource, Math.max(0, Math.min(this.capacity, n)));
    }
  }

  /** Current count of a resource (0 if never stocked). */
  count(resource: string): number {
    return this.counts.get(resource) ?? 0;
  }

  /** Every stocked resource and its count. */
  entries(): Array<[string, number]> {
    return [...this.counts.entries()];
  }

  /** Sum across all resources. */
  get total(): number {
    let sum = 0;
    for (const n of this.counts.values()) sum += n;
    return sum;
  }

  /** Add `n` of a resource (clamped to `capacity`). Returns the new count. */
  add(resource: string, n = 1): number {
    return this.set(resource, this.count(resource) + n);
  }

  /** Remove `n` (clamped at 0). Returns the new count. */
  remove(resource: string, n = 1): number {
    return this.set(resource, this.count(resource) - n);
  }

  /**
   * Try to spend `n` of a resource — a crafting cost. Removes and returns true
   * only if enough is in stock; otherwise leaves it untouched and returns false.
   */
  spend(resource: string, n = 1): boolean {
    if (this.count(resource) < n) return false;
    this.remove(resource, n);
    return true;
  }

  /** Set a resource to an exact count (clamped). Returns the new count. */
  set(resource: string, value: number): number {
    const prev = this.count(resource);
    const next = Math.max(0, Math.min(this.capacity, value));
    if (next === prev) return next;
    this.counts.set(resource, next);
    const change: StockChange = { resource, count: next, delta: next - prev };
    this.events.emit('change', change);
    if (next === this.capacity && Number.isFinite(this.capacity)) this.events.emit('full', change);
    return next;
  }
}
