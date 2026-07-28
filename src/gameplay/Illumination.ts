import { Vector3 } from 'three';
import type { Vec3Like } from '../audio/Soundboard';

/**
 * Anything that sheds gameplay light. Structurally compatible with a
 * SCENA `LuminousClaim` — pass one straight in: `anchor` is tracked live
 * (movers welcome), `isLit` is read live (a doused lamp stops counting),
 * and `radius` is how far the pool of light reaches.
 */
export interface LightSourceLike {
  /** A fixed (or live-mutated) point… */
  center?: Vec3Like;
  /** …or a tracked scene object (SCENA claims arrive this way). */
  anchor?: { getWorldPosition(target: Vector3): Vector3 };
  /** How far the light reaches, metres. */
  radius: number;
  /** Gameplay weight at the source. Default 1 — one lamp fully lights you. */
  intensity?: number;
  /** Litness, read live. Absent = always lit. */
  isLit?: () => boolean;
}

export interface IlluminationOptions {
  /**
   * The floor — how visible everything is with no lights at all
   * (moonlight, screen glow). Default 0.08.
   */
  ambient?: number;
}

const scratch = new Vector3();

/**
 * Illumination — the number the stealth genre is made of.
 *
 * Gameplay must never read pixels; it reads math. Register the light
 * sources the *game* cares about and ask `at(point)` for 0..1 "how lit
 * is this spot": the guard's perception scales by it, the HUD meter
 * shows it, the shadows between the lamps become *places*. Pure and
 * deterministic — the same philosophy as NavMesh and Projectiles.
 *
 * ```ts
 * const field = new Illumination();
 * for (const lamp of lamps) field.add(lamp.claim);   // SCENA claims drop in
 * const exposure = field.at(hero.position);          // 0 = shadow, 1 = spotlit
 * suspicion += exposure * proximity * dt;
 * ```
 *
 * Falloff is quadratic ease-out per source (bright pool, soft edge),
 * summed across sources, floored by `ambient`, clamped to 1.
 */
export class Illumination {
  private readonly ambient: number;
  private readonly sources: LightSourceLike[] = [];

  constructor(options: IlluminationOptions = {}) {
    this.ambient = Math.min(Math.max(options.ambient ?? 0.08, 0), 1);
  }

  get count(): number {
    return this.sources.length;
  }

  /** Register a source; returns its removal. */
  add(source: LightSourceLike): () => void {
    this.sources.push(source);
    return () => {
      const i = this.sources.indexOf(source);
      if (i >= 0) this.sources.splice(i, 1);
    };
  }

  /** How lit `point` is, 0..1. */
  at(point: Vec3Like): number {
    let total = this.ambient;
    for (const source of this.sources) {
      if (source.isLit?.() === false) continue;
      let x: number;
      let y: number;
      let z: number;
      if (source.anchor) {
        source.anchor.getWorldPosition(scratch);
        x = scratch.x;
        y = scratch.y;
        z = scratch.z;
      } else if (source.center) {
        x = source.center.x;
        y = source.center.y;
        z = source.center.z;
      } else {
        continue;
      }
      const dx = point.x - x;
      const dy = point.y - y;
      const dz = point.z - z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d >= source.radius) continue;
      const t = 1 - d / source.radius;
      total += (source.intensity ?? 1) * t * t;
    }
    return Math.min(total, 1);
  }
}
