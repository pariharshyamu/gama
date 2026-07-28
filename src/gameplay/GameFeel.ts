import type { Camera } from 'three';

/**
 * GameFeel — the few milliseconds that make a hit feel like a hit.
 *
 * Four tricks, all famous, all cheap, all easy to get subtly wrong:
 *
 * - **Screen shake** is trauma-based (Jonasson's GDC rule): impacts add
 *   *trauma*, the camera shakes by *trauma squared*, and trauma decays
 *   linearly. The square is the whole design — small knocks barely
 *   register while big ones fill the screen, and the decay passes through
 *   the violent range quickly and the subtle range slowly, which reads as
 *   an aftermath rather than a wobble. The shake itself is smooth seeded
 *   noise, not per-frame randomness: random offsets jitter, noise *sways*.
 * - **Hit-stop** freezes gameplay for a few dozen milliseconds on contact.
 *   The pause is what gives the blow its weight — cricket bat, boxing
 *   glove, sword; everything lands harder with 60–90 ms of stillness.
 * - **Slow motion** scales gameplay time and eases back to full speed on
 *   a schedule — the finish-line moment.
 * - **Rumble** forwards a pulse to `navigator.vibrate` where it exists
 *   (phones), and silently does nothing where it does not.
 *
 * The contract with the game loop is one line: feed it the raw frame
 * delta, advance the game with what comes back.
 *
 * ```ts
 * const feel = new GameFeel({ seed: 4 });
 * const dt = feel.update(rawDt);   // 0 during hit-stop, scaled in slow-mo
 * world.step(dt);
 * rig.update(rawDt);               // camera RIGS run on real time...
 * feel.apply(camera);              // ...then the shake perturbs the result
 * feel.shake(0.4);                 // on impact
 * feel.hitStop(0.08);              // on the big one
 * ```
 *
 * `apply` is remove-then-add: it subtracts what it added last frame before
 * adding this frame's offset, so it composes with a rig that sets the
 * camera absolutely each frame AND with a static camera nobody moves.
 */

export interface GameFeelOptions {
  /** Trauma lost per second. Default 1.4 (a full-trauma hit rings ~0.7 s). */
  decay?: number;
  /** Max positional shake at full trauma, in metres. Default 0.35. */
  amplitude?: number;
  /** Max roll at full trauma, in radians. Default 0.06. */
  roll?: number;
  /** Shake frequency in Hz — how fast the sway sways. Default 9. */
  frequency?: number;
  /** Same seed, same shake. Default 1. */
  seed?: number;
}

/** Smooth 1-D value noise: C1-continuous, in [-1, 1], deterministic. */
function makeNoise(seed: number): (t: number) => number {
  // Lattice of seeded random values, cosine-interpolated. Enough smoothness
  // for a camera; no gradient tables required.
  const lattice = (i: number): number => {
    let h = (i * 374761393 + seed * 668265263) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296 * 2 - 1;
  };
  return (t: number): number => {
    const i = Math.floor(t);
    const f = t - i;
    const s = (1 - Math.cos(f * Math.PI)) / 2;
    return lattice(i) * (1 - s) + lattice(i + 1) * s;
  };
}

export class GameFeel {
  private readonly decay: number;
  private readonly amplitude: number;
  private readonly rollMax: number;
  private readonly frequency: number;
  private readonly noiseX: (t: number) => number;
  private readonly noiseY: (t: number) => number;
  private readonly noiseR: (t: number) => number;

  private traumaLevel = 0;
  private clock = 0;
  private stopLeft = 0;
  private slowRate = 1;
  private slowLeft = 0;
  private slowRamp = 0;

  // What apply() added last frame, so it can take it back first.
  private appliedX = 0;
  private appliedY = 0;
  private appliedZ = 0;
  private appliedRoll = 0;

  constructor(options: GameFeelOptions = {}) {
    this.decay = options.decay ?? 1.4;
    this.amplitude = options.amplitude ?? 0.35;
    this.rollMax = options.roll ?? 0.06;
    this.frequency = options.frequency ?? 9;
    const seed = options.seed ?? 1;
    this.noiseX = makeNoise(seed);
    this.noiseY = makeNoise(seed + 101);
    this.noiseR = makeNoise(seed + 211);
  }

  /** Current trauma, 0..1. Shake magnitude is this squared. */
  get trauma(): number {
    return this.traumaLevel;
  }

  /** Current gameplay time scale (0 during hit-stop, `rate` in slow-mo). */
  get timeScale(): number {
    if (this.stopLeft > 0) return 0;
    if (this.slowLeft > 0) return this.slowRate;
    if (this.slowRamp > 0) {
      // Easing back: ramp is the fraction of the return trip remaining.
      return this.slowRate + (1 - this.slowRate) * (1 - this.slowRamp);
    }
    return 1;
  }

  /** Add trauma, 0..1. Additive and clamped — two hits shake more than one. */
  shake(amount: number): void {
    if (!Number.isFinite(amount)) return;
    this.traumaLevel = Math.min(Math.max(this.traumaLevel + amount, 0), 1);
  }

  /** Freeze gameplay for `seconds` (real time). Repeat calls take the longer. */
  hitStop(seconds = 0.08): void {
    if (!Number.isFinite(seconds)) return;
    this.stopLeft = Math.max(this.stopLeft, Math.max(seconds, 0));
  }

  /**
   * Run gameplay at `rate` for `seconds`, then ease back to full speed
   * over `ramp` seconds.
   */
  slowMo(rate = 0.3, seconds = 1.2, ramp = 0.5): void {
    if (!Number.isFinite(rate) || !Number.isFinite(seconds)) return;
    this.slowRate = Math.min(Math.max(rate, 0.02), 1);
    this.slowLeft = Math.max(seconds, 0);
    this.slowRampTotal = Math.max(ramp, 0.01);
    this.slowRamp = 0;
  }
  private slowRampTotal = 0.5;

  /** A vibration pulse on hardware that has one (milliseconds). */
  rumble(strength = 0.5, ms = 80): void {
    const nav = (globalThis as { navigator?: { vibrate?: (ms: number) => boolean } }).navigator;
    if (nav?.vibrate) nav.vibrate(Math.round(ms * Math.min(Math.max(strength, 0), 1)));
  }

  /**
   * Advance with the REAL frame delta; returns the delta gameplay should
   * advance by. Hit-stop and shake decay run on real time — a frozen frame
   * still shakes, which is exactly the look.
   */
  update(dt: number): number {
    // Everything below is linear in dt, so any honest frame is safe; the cap
    // only guards the multi-second monster a background tab hands back.
    const step = Number.isFinite(dt) ? Math.min(Math.max(dt, 0), 1) : 0;
    this.clock += step;
    this.traumaLevel = Math.max(this.traumaLevel - this.decay * step, 0);

    if (this.stopLeft > 0) {
      this.stopLeft = Math.max(this.stopLeft - step, 0);
      return 0;
    }
    if (this.slowLeft > 0) {
      this.slowLeft = Math.max(this.slowLeft - step, 0);
      if (this.slowLeft === 0) this.slowRamp = this.slowRampTotal;
      return step * this.slowRate;
    }
    if (this.slowRamp > 0) {
      this.slowRamp = Math.max(this.slowRamp - step, 0);
      const back = 1 - this.slowRamp / this.slowRampTotal;
      return step * (this.slowRate + (1 - this.slowRate) * back);
    }
    return step;
  }

  /**
   * Perturb the camera by the current shake. Call after rigs/controls have
   * positioned it. Safe for cameras nothing else moves: what was added last
   * frame is removed first.
   */
  apply(camera: Camera): void {
    camera.position.x -= this.appliedX;
    camera.position.y -= this.appliedY;
    camera.position.z -= this.appliedZ;
    camera.rotation.z -= this.appliedRoll;

    const power = this.traumaLevel * this.traumaLevel;
    const t = this.clock * this.frequency;
    this.appliedX = this.noiseX(t) * this.amplitude * power;
    this.appliedY = this.noiseY(t) * this.amplitude * power;
    this.appliedZ = 0;
    this.appliedRoll = this.noiseR(t) * this.rollMax * power;

    camera.position.x += this.appliedX;
    camera.position.y += this.appliedY;
    camera.position.z += this.appliedZ;
    camera.rotation.z += this.appliedRoll;
  }
}
