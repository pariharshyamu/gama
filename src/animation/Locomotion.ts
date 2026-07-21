import type { AnimationClip, Vector3 } from 'three';
import { Component } from '../core/Component';
import type { Animator } from './Animator';

/** Clip names for each locomotion state. Missing states fall back sensibly. */
export interface LocomotionClips {
  idle?: string;
  walk?: string;
  run?: string;
  jump?: string;
  fall?: string;
}

/** Anything Locomotion can read movement from: CharacterController,
 *  MotionAgent, PhysicsCharacterController, or your own controller. */
export interface LocomotionSource {
  velocity: Vector3;
  grounded?: boolean;
  verticalVelocity?: number;
}

export interface LocomotionOptions {
  clips?: LocomotionClips;
  /** Speeds below this play idle. Default 0.5. */
  walkThreshold?: number;
  /** Speeds above this play run. Default 4. */
  runThreshold?: number;
  /** Cross-fade seconds. Default 0.2. */
  fade?: number;
}

/**
 * The glue between moving and animating: watches a controller/agent's
 * velocity and grounded state and drives the Animator — idle/walk/run by
 * speed, jump/fall in the air. Works for players and NPCs alike.
 *
 * ```ts
 * const animator = hero.addComponent(new Animator(gltf.animations, gltf.scene));
 * hero.addComponent(new Locomotion(animator, controller, {
 *   clips: matchClips(gltf.animations), // fuzzy-map Mixamo-style names
 * }));
 * ```
 */
export class Locomotion extends Component {
  private clips: LocomotionClips;
  private walkThreshold: number;
  private runThreshold: number;
  private fade: number;

  constructor(
    private animator: Animator,
    private source: LocomotionSource,
    options: LocomotionOptions = {}
  ) {
    super();
    this.clips = {
      idle: 'idle',
      walk: 'walk',
      run: 'run',
      jump: 'jump',
      fall: 'fall',
      ...options.clips,
    };
    this.walkThreshold = options.walkThreshold ?? 0.5;
    this.runThreshold = options.runThreshold ?? 4;
    this.fade = options.fade ?? 0.2;
  }

  override update(): void {
    const { velocity } = this.source;
    const airborne = this.source.grounded === false;
    let name: string | undefined;

    if (airborne) {
      const vy = this.source.verticalVelocity ?? velocity.y;
      name = vy > 0.5 ? (this.clips.jump ?? this.clips.fall) : (this.clips.fall ?? this.clips.jump);
    } else {
      const speed = Math.hypot(velocity.x, velocity.z);
      name =
        speed < this.walkThreshold
          ? this.clips.idle
          : speed < this.runThreshold
            ? (this.clips.walk ?? this.clips.run)
            : (this.clips.run ?? this.clips.walk);
    }
    if (name && this.animator.has(name)) this.animator.play(name, this.fade);
  }
}

const CLIP_PATTERNS: Array<[keyof LocomotionClips, RegExp]> = [
  ['idle', /idle|stand|breath/i],
  ['walk', /walk/i],
  ['run', /run|jog|sprint/i],
  ['jump', /jump/i],
  ['fall', /fall|air|drop/i],
];

/**
 * Fuzzy-map a model's animation clips to locomotion states by name —
 * handles Mixamo-style names like "FastRun" or "Idle_01" so
 * `model: gltf` wires up with zero configuration in the common case.
 */
export function matchClips(clips: AnimationClip[]): LocomotionClips {
  const result: LocomotionClips = {};
  for (const [state, pattern] of CLIP_PATTERNS) {
    const hit = clips.find((c) => pattern.test(c.name));
    if (hit) result[state] = hit.name;
  }
  return result;
}
