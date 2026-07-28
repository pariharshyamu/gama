import { Color } from 'three';

/** A light-shaped thing: three's lights are these, structurally. */
interface Lightish {
  color: { getHex(): number; setHex(hex: number): unknown; lerpColors?: unknown };
  intensity: number;
}

/**
 * What MoodGrade drives. Structurally a SCENA `LightingRig` plus the
 * scene's background/fog — pass what you have; absent channels are
 * simply not graded.
 */
export interface MoodTargets {
  sun?: Lightish;
  ambient?: Lightish;
  hemisphere?: Lightish;
  /** Anything with a `.background` Color (a Scene). */
  scene?: { background: { setHex(hex: number): unknown; getHex(): number } | null };
  /** Anything with a `.color` Color (scene.fog). */
  fog?: { color: { setHex(hex: number): unknown; getHex(): number } } | null;
}

/** One mood: only the channels you name are graded. */
export interface MoodPreset {
  sun?: { color?: number; intensity?: number };
  ambient?: { color?: number; intensity?: number };
  hemisphere?: { intensity?: number };
  background?: number;
  fog?: number;
}

interface Channel {
  from: number;
  to: number;
  apply(value: number): void;
}

interface ColorChannel {
  from: Color;
  to: Color;
  apply(value: Color): void;
}

const mixed = new Color();

/**
 * MoodGrade — the game state's visual voice.
 *
 * Define lighting moods, then `to('danger', 2)` lerps every graded
 * channel there over two seconds: ambient dims, fog reddens, the sun
 * cools. Wire it to GameFlow's `onEnter` and each state gets its look;
 * call it from a WaveDirector and the arena darkens as the waves climb.
 *
 * ```ts
 * const grade = new MoodGrade({ sun, ambient, scene, fog: scene.fog });
 * grade.define('calm',   { ambient: { intensity: 0.4 }, background: 0x0b0e14 });
 * grade.define('danger', { ambient: { intensity: 0.15 }, background: 0x1a0508,
 *                          sun: { color: 0xff6a4a } });
 * flow = new GameFlow({ onEnter: { playing: () => grade.to('calm', 1.5) } });
 * game.onUpdate((t) => grade.update(t.delta));   // real time — pause keeps its mood
 * ```
 */
export class MoodGrade {
  private readonly targets: MoodTargets;
  private readonly presets = new Map<string, MoodPreset>();
  private scalars: Channel[] = [];
  private colors: ColorChannel[] = [];
  private elapsed = 0;
  private duration = 0;
  private current = '';

  constructor(targets: MoodTargets) {
    this.targets = targets;
  }

  /** The mood last requested (may still be blending toward it). */
  get mood(): string {
    return this.current;
  }

  /** Mid-lerp right now? */
  get blending(): boolean {
    return this.elapsed < this.duration;
  }

  define(name: string, preset: MoodPreset): this {
    this.presets.set(name, preset);
    return this;
  }

  /** Instantly snap to a mood. */
  set(name: string): void {
    this.to(name, 0);
    this.update(0);
  }

  /**
   * Blend to a mood over `seconds`. Starts from wherever the channels
   * are *now* — interrupting a blend mid-way is seamless. Unknown moods
   * are refused (false), not thrown.
   */
  to(name: string, seconds = 1.5): boolean {
    const preset = this.presets.get(name);
    if (!preset) return false;
    this.current = name;
    this.duration = Math.max(seconds, 0);
    this.elapsed = 0;
    this.scalars = [];
    this.colors = [];
    const t = this.targets;

    const scalar = (
      target: { intensity: number } | undefined | null,
      to: number | undefined
    ): void => {
      if (!target || to === undefined) return;
      this.scalars.push({ from: target.intensity, to, apply: (v) => (target.intensity = v) });
    };
    const color = (
      target: { getHex(): number; setHex(hex: number): unknown } | undefined | null,
      to: number | undefined
    ): void => {
      if (!target || to === undefined) return;
      this.colors.push({
        from: new Color(target.getHex()),
        to: new Color(to),
        apply: (v) => target.setHex(v.getHex()),
      });
    };

    scalar(t.sun, preset.sun?.intensity);
    color(t.sun?.color, preset.sun?.color);
    scalar(t.ambient, preset.ambient?.intensity);
    color(t.ambient?.color, preset.ambient?.color);
    scalar(t.hemisphere, preset.hemisphere?.intensity);
    color(t.scene?.background ?? undefined, preset.background);
    color(t.fog?.color, preset.fog);
    if (this.duration === 0) this.update(0);
    return true;
  }

  /** Feed REAL time — a paused game keeps grading into its pause mood. */
  update(dt: number): void {
    if (this.scalars.length === 0 && this.colors.length === 0) return;
    this.elapsed += Number.isFinite(dt) ? Math.max(dt, 0) : 0;
    const raw = this.duration > 0 ? Math.min(this.elapsed / this.duration, 1) : 1;
    const f = raw * raw * (3 - 2 * raw); // smoothstep — grades ease, not snap
    for (const channel of this.scalars) {
      channel.apply(channel.from + (channel.to - channel.from) * f);
    }
    for (const channel of this.colors) {
      mixed.copy(channel.from).lerp(channel.to, f);
      channel.apply(mixed);
    }
    if (raw >= 1) {
      this.scalars = [];
      this.colors = [];
    }
  }
}
