import { Vector3 } from 'three';
import { Component } from '../core/Component';
import type { Time } from '../core/Time';
import type { GameObject } from '../core/GameObject';
import type { Input } from '../input/Input';

/**
 * A stateful, actuatable thing — a door, gate, drawer, lever, portcullis.
 * Structurally identical to SCENA's `Manipulable`, so GAMA drives SCENA's
 * mechanisms (and links them together) without either library importing the
 * other. `open` is the target; `update` eases the joint toward it.
 */
export interface Mechanism {
  readonly open: boolean;
  toggle(): boolean;
  set(target: number | boolean): void;
  update?(dt: number): void;
}

/** A mechanism that also reports its flips — the source end of a link. */
export interface MechanismSource extends Mechanism {
  onChange?: (open: boolean) => void;
}

/**
 * Wire one mechanism to drive another: when `source` opens/closes, `target`
 * follows. A thrown lever raises a portcullis; a switch opens a gate — the
 * first bit of level logic. Chain freely (one source, many targets — call it
 * repeatedly). Returns an unlink function; preserves any existing `onChange`.
 *
 * ```ts
 * linkMechanism(lever, portcullis);              // throw the lever → gate rises
 * linkMechanism(lever, trapdoor, { invert: true }); // …and the trapdoor shuts
 * ```
 */
export function linkMechanism(
  source: MechanismSource,
  target: Mechanism,
  options: { invert?: boolean } = {}
): () => void {
  const previous = source.onChange;
  const handler = (open: boolean): void => {
    previous?.(open);
    target.set(options.invert ? !open : open);
  };
  source.onChange = handler;
  target.set(options.invert ? !source.open : source.open); // sync now
  return () => {
    if (source.onChange === handler) source.onChange = previous;
  };
}

export interface TriggerOptions {
  /** Detection radius in metres (XZ + Y). Default 2. */
  radius?: number;
  /** Only bodies with this tag count. Omit to detect any GameObject. */
  tag?: string;
  /** Fired when a body enters the radius. */
  onEnter?: (other: GameObject) => void;
  /** Fired when a body leaves. */
  onExit?: (other: GameObject) => void;
}

const here = new Vector3();
const there = new Vector3();

/**
 * A proximity trigger: watches the world for tagged bodies inside its radius
 * and fires enter/exit. The building block for pressure plates, automatic
 * doors, and "press to open" prompts. Also emits `trigger-enter` /
 * `trigger-exit` on its owner.
 *
 * ```ts
 * plate.addComponent(new Trigger({ radius: 1.5, tag: 'player',
 *   onEnter: () => gate.set(true), onExit: () => gate.set(false) }));
 * ```
 */
export class Trigger extends Component {
  radius: number;
  tag?: string;
  onEnter?: (other: GameObject) => void;
  onExit?: (other: GameObject) => void;
  private readonly inside = new Set<GameObject>();

  constructor(options: TriggerOptions = {}) {
    super();
    this.radius = options.radius ?? 2;
    this.tag = options.tag;
    this.onEnter = options.onEnter;
    this.onExit = options.onExit;
  }

  /** Is anything currently inside? */
  get active(): boolean {
    return this.inside.size > 0;
  }

  /** How many bodies are inside right now. */
  get count(): number {
    return this.inside.size;
  }

  override update(_time: Time): void {
    const world = this.owner.world;
    if (!world) return;
    this.owner.getWorldPosition(here);
    const r2 = this.radius * this.radius;

    for (const obj of world.objects) {
      if (obj === this.owner || obj.destroyed) continue;
      if (this.tag && !obj.tags.has(this.tag)) continue;
      const within = obj.getWorldPosition(there).distanceToSquared(here) <= r2;
      const was = this.inside.has(obj);
      if (within && !was) {
        this.inside.add(obj);
        this.onEnter?.(obj);
        this.owner.events.emit('trigger-enter', obj);
      } else if (!within && was) {
        this.inside.delete(obj);
        this.onExit?.(obj);
        this.owner.events.emit('trigger-exit', obj);
      }
    }
    // Reap bodies that vanished while inside.
    for (const obj of this.inside) {
      if (obj.destroyed || !world.objects.includes(obj)) {
        this.inside.delete(obj);
        this.onExit?.(obj);
      }
    }
  }
}

export interface InteractableOptions {
  /** How close an actor must be to operate it. Default 2. */
  radius?: number;
  /** Which bodies may operate it. Default 'player'. */
  tag?: string;
  /**
   * `'press'` (default): an in-range actor with the key operates it — needs
   * `input` + `key`. `'auto'`: it simply mirrors proximity (an automatic
   * door — open while someone is near, closed when they leave).
   */
  mode?: 'press' | 'auto';
  /** The input to poll in `'press'` mode. */
  input?: Input;
  /** Key that operates it (KeyboardEvent.code). Default 'KeyE'. */
  key?: string;
  /**
   * Fired the instant it's operated — hook the ANIMA reach gesture here so
   * the hand and the mechanism move together. `open` is the new state,
   * `actor` the body that did it (null for a scripted `operate()`).
   */
  onOperate?: (open: boolean, actor: GameObject | null) => void;
}

/**
 * The player-facing verb: a mechanism made operable in the world. Attach it to
 * a body co-located with a SCENA `Manipulable`; when the player is in range and
 * presses the key it toggles (and eases the joint each frame for you). Or set
 * `mode: 'auto'` for an automatic door. Emits `operated` on its owner.
 *
 * ```ts
 * const post = game.world.spawn('lever'); post.add(lever.object);
 * post.addComponent(new Interactable(lever, {
 *   input: game.input, key: 'KeyE',
 *   onOperate: () => new Gesture(loco, createReachClip(rig), { onApex: () => {} }),
 * }));
 * ```
 */
export class Interactable extends Component {
  readonly mechanism: Mechanism;
  radius: number;
  tag: string;
  mode: 'press' | 'auto';
  key: string;
  onOperate?: (open: boolean, actor: GameObject | null) => void;
  private input?: Input;
  private nearest: GameObject | null = null;

  constructor(mechanism: Mechanism, options: InteractableOptions = {}) {
    super();
    this.mechanism = mechanism;
    this.radius = options.radius ?? 2;
    this.tag = options.tag ?? 'player';
    this.mode = options.mode ?? 'press';
    this.input = options.input;
    this.key = options.key ?? 'KeyE';
    this.onOperate = options.onOperate;
  }

  /** Is a valid actor within range this frame? */
  get inRange(): boolean {
    return this.nearest !== null;
  }

  /** The nearest in-range actor, or null. */
  get actor(): GameObject | null {
    return this.nearest;
  }

  /** Toggle it now (scripted). Fires `onOperate` and emits `operated`. */
  operate(actor: GameObject | null = this.nearest): void {
    const open = this.mechanism.toggle();
    this.onOperate?.(open, actor);
    this.owner.events.emit('operated', this.owner);
  }

  override update(time: Time): void {
    this.trackNearest();
    if (this.mode === 'auto') {
      this.mechanism.set(this.nearest !== null);
    } else if (this.nearest && this.input?.wasPressed(this.key)) {
      this.operate();
    }
    this.mechanism.update?.(time.delta);
  }

  private trackNearest(): void {
    const world = this.owner.world;
    this.nearest = null;
    if (!world) return;
    this.owner.getWorldPosition(here);
    const r2 = this.radius * this.radius;
    let best = r2;
    for (const obj of world.objects) {
      if (obj === this.owner || obj.destroyed || !obj.tags.has(this.tag)) continue;
      const d2 = obj.getWorldPosition(there).distanceToSquared(here);
      if (d2 <= best) {
        best = d2;
        this.nearest = obj;
      }
    }
  }
}
