import { Group, Object3D, Vector3 } from 'three';
import {
  Blinking,
  Locomotion,
  Reactions,
  createEyes,
  createHumanoid,
  type EyeProp,
  type HumanoidRig,
} from 'anima3d';

/**
 * A contestant: the player and every rival are the same object.
 *
 * There is no separate "NPC" type here on purpose. The player is a contestant
 * whose velocity comes from the keyboard and a rival is one whose velocity
 * comes from a rule, and everything downstream of that — the locomotion blend,
 * the eyes, the collapse when they are out — cannot tell which is which. When
 * they diverge, the rivals start looking like a different species from the
 * thing you are controlling, and that is the tell that ruins a crowd.
 */

/** The uniform. Everyone in the hall is dressed the same; that is the point. */
export const TRACKSUIT = { top: 0x2f9e8f, bottom: 0x2f9e8f, boots: 0xf2f2f2 };

export interface Contestant {
  readonly rig: HumanoidRig;
  readonly object: Group;
  readonly loco: Locomotion;
  readonly lids: Blinking;
  readonly eyes: EyeProp;
  /** Shirt number, so the results screen can name who got through. */
  readonly number: number;
  /** Metres per second, this frame. Measured, never assumed. */
  readonly speed: number;
  out: boolean;
  position: Vector3;
  /** Move by a velocity in m/s and face the way it is going. */
  step(dt: number, velocity: Vector3): void;
  /** Stand still, but keep breathing — a frozen mannequin reads as a bug. */
  hold(dt: number): void;
  /** Out. Collapses, and stops being collided with. */
  eliminate(from?: Vector3): void;
  update(dt: number, task?: 'rest' | 'conversing' | 'reading'): void;
  dispose(): void;
}

export interface ContestantOptions {
  seed: number;
  number: number;
  /** Where they start. */
  at: Vector3;
  /** Which way they face at the start, radians. */
  facing?: number;
  height?: number;
}

const HEADING = new Vector3();

export function createContestant(options: ContestantOptions): Contestant {
  const { seed, number } = options;
  const rig = createHumanoid({
    seed,
    height: options.height ?? 1.62 + ((seed * 37) % 24) / 100,
    accessories: 'none',
    colors: TRACKSUIT,
  });
  const object = rig.object;
  object.position.copy(options.at);
  object.rotation.y = options.facing ?? 0;

  const loco = new Locomotion(rig);
  const react = new Reactions(rig);
  const lids = new Blinking({ task: 'rest', seed: seed + 7 });
  const eyes = createEyes(rig);

  let speed = 0;
  let out = false;

  const self: Contestant = {
    rig,
    object,
    loco,
    lids,
    eyes,
    number,
    get speed() {
      return speed;
    },
    get out() {
      return out;
    },
    set out(v: boolean) {
      out = v;
    },
    get position() {
      return object.position;
    },
    set position(v: Vector3) {
      object.position.copy(v);
    },

    step(dt: number, velocity: Vector3): void {
      if (out) {
        speed = 0;
        return;
      }
      speed = velocity.length();
      if (dt > 0) object.position.addScaledVector(velocity, dt);
      // Face the way you are going, but only while actually going somewhere —
      // normalising a zero vector spins the character to face east the instant
      // they stop, which reads as a flinch nobody asked for.
      if (speed > 0.05) {
        HEADING.copy(velocity).normalize();
        const want = Math.atan2(HEADING.x, HEADING.z);
        const d = ((want - object.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        object.rotation.y += d * Math.min(1, dt * 12);
      }
      loco.update(dt, speed);
    },

    hold(dt: number): void {
      speed = 0;
      loco.update(dt, 0);
    },

    eliminate(from?: Vector3): void {
      if (out) return;
      out = true;
      speed = 0;
      if (from) {
        const away = new Vector3().subVectors(object.position, from).normalize();
        react.stagger({ x: away.x, z: away.z }, 1);
      }
      react.knockOut();
    },

    update(dt: number, task: 'rest' | 'conversing' | 'reading' = 'rest'): void {
      react.update(dt);
      const blink = lids.update(dt, { task });
      eyes.apply({ lid: blink.lid, gaze: blink.gaze });
    },

    dispose(): void {
      object.removeFromParent();
      rig.mesh.geometry.dispose();
    },
  };
  return self;
}

/** Where a contestant's eyes are, for anything that needs to look at them. */
export function eyeLevel(c: Contestant, into: Vector3): Vector3 {
  return into.copy(c.object.position).setY(c.rig.height * 0.93);
}

/** Attach something to a contestant's head — used by the watcher's stare. */
export function head(c: Contestant): Object3D {
  return c.rig.bones.Head;
}
