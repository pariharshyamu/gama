import type { Vec3Like } from '../audio/Soundboard';

/**
 * What hitting something should cost. `amount` defaults to 1 — hearts,
 * not hit-point spreadsheets — and `from` is where the blow came from,
 * so the event can hand back a ready-made knockback vector.
 */
export interface DamageInfo {
  amount?: number;
  /** Where the hit originated — knockback points away from it. */
  from?: Vec3Like;
  /** Knockback impulse magnitude (m/s) for the caller to apply. Default 0. */
  knockback?: number;
}

export interface DamageEvent {
  amount: number;
  current: number;
  max: number;
  from?: Vec3Like;
  /**
   * A ready-to-apply impulse: away from `from`, mostly planar with a
   * pop of lift — `agent.velocity.add(e.knockback)` and the hit reads.
   * Null when the damage carried none.
   */
  knockback: { x: number; y: number; z: number } | null;
}

export interface HealthOptions {
  /** Hit points. Default 3 — hearts-style. */
  max?: number;
  /**
   * Invulnerability window after a hit, in seconds. Default 0.8. This is
   * the difference between a hazard and a blender: standing in fire
   * should cost one heart per window, not one per frame.
   */
  invulnerable?: number;
  onDamage?: (event: DamageEvent) => void;
  onDeath?: (event: DamageEvent) => void;
  onRevive?: () => void;
}

/**
 * Health — the stakes, kept in the trilogy's wholesome register: bonk
 * and knockout, not gore. A small state machine with the three rules
 * every action game relies on:
 *
 * - **I-frames.** A successful hit opens an invulnerability window;
 *   damage inside it is REFUSED (returns null), which is what makes
 *   overlapping a hazard survivable and multi-hit frames fair.
 * - **Death is an edge, not a state you re-enter.** `onDeath` fires
 *   exactly once, at the hit that did it; further damage is ignored
 *   until `revive()`.
 * - **The dead don't heal.** `heal()` on a knocked-out character does
 *   nothing — coming back is `revive()`, a deliberate act with its own
 *   event and a mercy window of i-frames.
 *
 * ```ts
 * const health = new Health({
 *   max: 5,
 *   onDamage: (e) => {
 *     hud.hearts(health.current, health.max);
 *     feel.shake(0.3 + 0.2 * e.amount);
 *     sounds.impact('soft', 0.6);
 *     if (e.knockback) agent.velocity.add(e.knockback);
 *   },
 *   onDeath: () => anima.knockOut(),   // the crumple, the get-up, elsewhere
 * });
 * health.damage({ from: enemy.position, knockback: 6 }, hero.position);
 * game.onUpdate((t) => health.update(t.delta));
 * ```
 */
export class Health {
  readonly max: number;
  private hp: number;
  private readonly window: number;
  private readonly options: HealthOptions;
  private shield = 0;

  constructor(options: HealthOptions = {}) {
    this.max = Math.max(options.max ?? 3, 1);
    this.hp = this.max;
    this.window = Math.max(options.invulnerable ?? 0.8, 0);
    this.options = options;
  }

  get current(): number {
    return this.hp;
  }

  get alive(): boolean {
    return this.hp > 0;
  }

  /** 0..1 — shaped for `hud.hearts(health.current, health.max)` or a bar. */
  get fraction(): number {
    return this.hp / this.max;
  }

  /** Seconds of invulnerability remaining — blink the mesh while it's > 0. */
  get invulnerableFor(): number {
    return this.shield;
  }

  /**
   * Take a hit. `at` is the victim's own position, used to aim the
   * knockback away from `info.from`. Returns the event, or null when the
   * hit was refused (dead, or inside the i-frame window).
   */
  damage(info: DamageInfo = {}, at?: Vec3Like): DamageEvent | null {
    if (!this.alive || this.shield > 0) return null;
    const amount = Number.isFinite(info.amount) ? Math.max(info.amount as number, 0) : 1;
    if (amount === 0) return null;
    this.hp = Math.max(this.hp - amount, 0);

    let knockback: DamageEvent['knockback'] = null;
    const strength = info.knockback ?? 0;
    if (strength > 0 && info.from && at) {
      let dx = at.x - info.from.x;
      let dz = at.z - info.from.z;
      const len = Math.hypot(dx, dz);
      // A dead-centre hit still knocks SOMEWHERE — default to +x rather
      // than dividing by zero.
      if (len < 1e-6) {
        dx = 1;
        dz = 0;
      } else {
        dx /= len;
        dz /= len;
      }
      knockback = { x: dx * strength, y: strength * 0.35, z: dz * strength };
    }

    const event: DamageEvent = {
      amount,
      current: this.hp,
      max: this.max,
      from: info.from,
      knockback,
    };
    if (this.hp === 0) {
      this.options.onDamage?.(event);
      this.options.onDeath?.(event);
    } else {
      this.shield = this.window;
      this.options.onDamage?.(event);
    }
    return event;
  }

  /** Recover hit points, clamped to max. The dead don't heal — see revive. */
  heal(amount = 1): number {
    if (!this.alive) return this.hp;
    this.hp = Math.min(this.hp + Math.max(amount, 0), this.max);
    return this.hp;
  }

  /** Come back — at full health unless told otherwise, with mercy i-frames. */
  revive(hp?: number): void {
    if (this.alive) return;
    this.hp = Math.min(Math.max(hp ?? this.max, 1), this.max);
    this.shield = Math.max(this.window, 1);
    this.options.onRevive?.();
  }

  /** Tick the i-frame window down. Gameplay time, like everything else. */
  update(dt: number): void {
    const step = Number.isFinite(dt) ? Math.max(dt, 0) : 0;
    this.shield = Math.max(this.shield - step, 0);
  }
}
