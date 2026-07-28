import { Vector3 } from 'three';
import type { Vec3Like } from '../audio/Soundboard';
import type { LightSourceLike } from './Illumination';

export interface FlashlightOptions {
  /** Beam reach, metres. Default 8. */
  range?: number;
  /** Beam half-angle, radians. Default 0.42 (~24° either side). */
  halfAngle?: number;
  /** Full battery lasts this many seconds. Default 45. */
  batteryLife?: number;
  /** Below this fraction the beam gutters. Default 0.25. */
  low?: number;
  seed?: number;
  onLow?: () => void;
  onDied?: () => void;
}

/**
 * Flashlight — the light a game carries.
 *
 * A cone of gameplay light with a battery. Feed it the carrier's pose
 * every frame and the frame's GAMEPLAY delta; ask `illuminates(target)`
 * for the reveal test (harassers can flee the beam, hiders are caught by
 * it), or hand `source` to an `Illumination` field so the beam lights
 * the world's math too.
 *
 * The battery is the drama: it drains while on, the beam **gutters**
 * below `low` (seeded stutter — the horror-game grammar for "hurry"),
 * and `onDied` fires once at empty. `refuel()` is the pickup's job.
 *
 * ```ts
 * torch.aim(guard.position, guard.rotation.y);
 * torch.update(dt);
 * if (torch.illuminates({ center: hero.position, radius: 0.4 })) spotted();
 * ```
 */
export class Flashlight {
  readonly position = new Vector3();
  yaw = 0;
  on = true;

  range: number;
  halfAngle: number;

  private batteryLife: number;
  private lowMark: number;
  private charge = 1;
  private clock: number;
  private lowFired = false;
  private readonly onLow?: () => void;
  private readonly onDied?: () => void;
  private readonly beamCenter = new Vector3();
  /** Hand this to `Illumination.add()` — it tracks the beam live. */
  readonly source: LightSourceLike;

  constructor(options: FlashlightOptions = {}) {
    this.range = options.range ?? 8;
    this.halfAngle = options.halfAngle ?? 0.42;
    this.batteryLife = Math.max(options.batteryLife ?? 45, 1);
    this.lowMark = Math.min(Math.max(options.low ?? 0.25, 0), 1);
    this.clock = (options.seed ?? 1) * 1.7;
    this.onLow = options.onLow;
    this.onDied = options.onDied;
    this.source = {
      center: this.beamCenter,
      radius: this.range * 0.55,
      intensity: 1,
      isLit: () => this.lit,
    };
  }

  /** Battery fraction, 0..1. */
  get battery(): number {
    return this.charge;
  }

  /** Actually shedding light right now (on, charged, not mid-gutter)? */
  get lit(): boolean {
    return this.on && this.charge > 0 && this.glow > 0.3;
  }

  /**
   * Beam output 0..1: full when healthy, stuttering when the battery is
   * low, 0 when off or dead. Scale your beam mesh's opacity by this.
   */
  get glow(): number {
    if (!this.on || this.charge <= 0) return 0;
    if (this.charge >= this.lowMark) return 1;
    // The gutter: mostly on, dipping on a nervous aperiodic rhythm.
    const w = Math.sin(this.clock * 13.1) * Math.sin(this.clock * 7.7);
    return w > 0.55 ? 0.15 : 1;
  }

  /** Place and point the beam — call every frame from the carrier. */
  aim(position: Vec3Like, yaw: number): void {
    this.position.set(position.x, position.y, position.z);
    this.yaw = Number.isFinite(yaw) ? yaw : 0;
  }

  toggle(): boolean {
    this.on = !this.on;
    return this.on;
  }

  refuel(amount = 1): void {
    const wasDead = this.charge <= 0;
    this.charge = Math.min(this.charge + Math.max(amount, 0), 1);
    if ((wasDead || this.charge >= this.lowMark) && this.charge > 0) this.lowFired = false;
  }

  /** Feed GAMEPLAY time — a paused game doesn't eat batteries. */
  update(dt: number): void {
    const step = Number.isFinite(dt) ? Math.max(dt, 0) : 0;
    this.clock += step;
    if (this.on && this.charge > 0) {
      const before = this.charge;
      this.charge = Math.max(this.charge - step / this.batteryLife, 0);
      if (!this.lowFired && this.charge < this.lowMark && before >= this.lowMark) {
        this.lowFired = true;
        this.onLow?.();
      }
      if (this.charge <= 0 && before > 0) this.onDied?.();
    }
    // The pool of light sits mid-beam, ahead of the carrier.
    const ahead = this.range * 0.5;
    this.beamCenter.set(
      this.position.x + Math.sin(this.yaw) * ahead,
      this.position.y,
      this.position.z + Math.cos(this.yaw) * ahead
    );
    this.source.radius = this.range * 0.55;
    this.source.intensity = this.glow;
  }

  /** The reveal test: is this circle inside the lit cone right now? */
  illuminates(target: { center: Vec3Like; radius: number }): boolean {
    if (!this.lit) return false;
    const dx = target.center.x - this.position.x;
    const dz = target.center.z - this.position.z;
    const d = Math.sqrt(dx * dx + dz * dz);
    if (d - target.radius > this.range) return false;
    if (d < target.radius) return true; // standing on the torch
    const bearing = Math.atan2(dx, dz);
    let off = bearing - this.yaw;
    while (off > Math.PI) off -= Math.PI * 2;
    while (off < -Math.PI) off += Math.PI * 2;
    // Widen by the target's angular size — grazing the edge still counts.
    const slack = Math.atan2(target.radius, d);
    return Math.abs(off) <= this.halfAngle + slack;
  }
}
