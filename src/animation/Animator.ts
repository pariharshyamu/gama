import { AnimationMixer, type AnimationClip, type AnimationAction, type Object3D } from 'three';
import { Component } from '../core/Component';
import type { Time } from '../core/Time';

/**
 * A friendly wrapper over THREE.AnimationMixer for character animation.
 * Register named clips (e.g. from a loaded GLTF) and cross-fade between
 * them with `play('run', 0.25)`.
 */
export class Animator extends Component {
  private mixer!: AnimationMixer;
  private actions = new Map<string, AnimationAction>();
  private current: AnimationAction | null = null;
  currentName: string | null = null;

  constructor(private clips: AnimationClip[] = [], private root?: Object3D) {
    super();
  }

  override onAttach(): void {
    this.mixer = new AnimationMixer(this.root ?? this.owner);
    for (const clip of this.clips) this.register(clip);
  }

  register(clip: AnimationClip, name = clip.name): void {
    this.actions.set(name, this.mixer.clipAction(clip));
  }

  /** Cross-fade to the named clip. No-op if it is already playing. */
  play(name: string, fadeSeconds = 0.25): void {
    if (name === this.currentName) return;
    const next = this.actions.get(name);
    if (!next) throw new Error(`Animator: no clip named "${name}"`);
    next.reset().play();
    if (this.current) this.current.crossFadeTo(next, fadeSeconds, false);
    this.current = next;
    this.currentName = name;
  }

  override update(time: Time): void {
    this.mixer.update(time.delta);
  }

  override onDetach(): void {
    this.mixer.stopAllAction();
  }
}
