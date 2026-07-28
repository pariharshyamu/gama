import type { Vec3Like } from '../audio/Soundboard';

/**
 * Anything collectable: a live trigger circle, a `collect()` that returns
 * its animation's seconds (0 = refused), optionally a `respawn()`.
 * Structurally identical to SCENA's `Pickup` — a coin drops straight in
 * with no imports between the libraries.
 */
export interface CollectibleLike {
  trigger: { center: Vec3Like; radius: number };
  collect(): number;
  respawn?(): number;
}

/** SCENA's `PickupField`, structurally: per-index triggers and accounting. */
export interface FieldLike {
  triggers: ReadonlyArray<{ center: Vec3Like; radius: number; index: number }>;
  isActive(index: number): boolean;
  collect(index: number): number;
  respawn(index: number): number;
}

export interface CollectEvent<V> {
  /** The value registered with the item (default: the item itself). */
  value: V;
  /** Where it was picked up — hand it to a burst, a sound, a ring. */
  at: Vec3Like;
}

export interface CollectorOptions<V> {
  /**
   * Seconds until a collected item respawns, or null to stay collected
   * forever. Default null — most loot is spent once.
   */
  respawnAfter?: number | null;
  /**
   * The actor's own radius, added to every trigger's. Default 0.4 — a
   * torso, not a point.
   */
  reach?: number;
  /** Fired once per collection, with the value and the place. */
  onCollect?: (event: CollectEvent<V>) => void;
}

interface Entry<V> {
  center: Vec3Like;
  radius: number;
  take(): number;
  restore?(): void;
  value: V;
}

/**
 * Collector — the game-loop side of pickups.
 *
 * SCENA renders a coin and animates its exit; WHO collected it, what it
 * was worth, and when it comes back are game-loop questions, and this is
 * where they live. Register items (or a whole instanced field), sweep an
 * actor's position once a frame, and wire the `onCollect` event to score,
 * sound and sparkle:
 *
 * ```ts
 * const collector = new Collector<number>({
 *   respawnAfter: 5,
 *   onCollect: ({ value, at }) => {
 *     score += value;
 *     sounds.coin({ at });
 *     hud.score(score);
 *   },
 * });
 * collector.addField(coins, () => 10);   // a SCENA PickupField, 10 points each
 * collector.add(gem, 100);               // a lone SCENA Pickup
 *
 * game.onUpdate((t) => {
 *   collector.sweep(hero.position);
 *   collector.update(t.delta);           // gameplay time — pause holds respawns
 * });
 * ```
 *
 * Collection defers to the item: `collect()` returning 0 means "not now"
 * (already taken, mid-animation), and the collector trusts it — the state
 * machine lives with the prop, the consequences live here.
 */
export class Collector<V = unknown> {
  private readonly respawnAfter: number | null;
  private readonly reach: number;
  private readonly onCollect?: (event: CollectEvent<V>) => void;
  private readonly entries: Entry<V>[] = [];
  private readonly pending: Array<{ due: number; restore: () => void }> = [];
  private clock = 0;
  private total = 0;

  constructor(options: CollectorOptions<V> = {}) {
    this.respawnAfter = options.respawnAfter ?? null;
    this.reach = options.reach ?? 0.4;
    this.onCollect = options.onCollect;
  }

  /** Everything collected so far, across respawns. */
  get collected(): number {
    return this.total;
  }

  /** Register one collectable. `value` defaults to the item itself. */
  add(item: CollectibleLike, value?: V): this {
    this.entries.push({
      center: item.trigger.center,
      radius: item.trigger.radius,
      take: () => item.collect(),
      restore: item.respawn ? () => void item.respawn!() : undefined,
      value: (value ?? item) as V,
    });
    return this;
  }

  /** Register a whole field; `valueOf` maps an index to its value. */
  addField(field: FieldLike, valueOf?: (index: number) => V): this {
    for (const trigger of field.triggers) {
      this.entries.push({
        center: trigger.center,
        radius: trigger.radius,
        take: () => (field.isActive(trigger.index) ? field.collect(trigger.index) : 0),
        restore: () => void field.respawn(trigger.index),
        value: (valueOf ? valueOf(trigger.index) : (trigger as unknown)) as V,
      });
    }
    return this;
  }

  /**
   * Test an actor position against every item; collect what it touches.
   * Returns how many were collected by this sweep.
   */
  sweep(position: Vec3Like): number {
    let took = 0;
    for (const entry of this.entries) {
      const dx = position.x - entry.center.x;
      const dy = position.y - entry.center.y;
      const dz = position.z - entry.center.z;
      const range = entry.radius + this.reach;
      if (dx * dx + dy * dy + dz * dz > range * range) continue;
      if (entry.take() <= 0) continue; // the prop said "not now" — believe it
      took++;
      this.total++;
      this.onCollect?.({ value: entry.value, at: entry.center });
      if (this.respawnAfter !== null && entry.restore) {
        this.pending.push({ due: this.clock + this.respawnAfter, restore: entry.restore });
      }
    }
    return took;
  }

  /** Advance respawn timers. Feed it GAMEPLAY time, so pause holds the loot. */
  update(dt: number): void {
    const step = Number.isFinite(dt) ? Math.max(dt, 0) : 0;
    this.clock += step;
    while (this.pending.length && this.pending[0].due <= this.clock) {
      this.pending.shift()!.restore();
    }
    // Out-of-order dues can happen if respawnAfter changes are ever added;
    // a sort per insert would be overkill for the handful in flight.
    if (this.pending.length > 1 && this.pending[0].due > this.pending[this.pending.length - 1].due) {
      this.pending.sort((a, b) => a.due - b.due);
    }
  }
}
