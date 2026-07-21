import { describe, expect, it } from 'vitest';
import { AnimationClip, PerspectiveCamera, Vector2, Vector3 } from 'three';
import { World } from '../src/core/World';
import { Time } from '../src/core/Time';
import { GameObject } from '../src/core/GameObject';
import { Animator } from '../src/animation/Animator';
import { Locomotion, matchClips } from '../src/animation/Locomotion';
import type { Input } from '../src/input/Input';
import type { GameContext } from '../src/templates/common';
import { createThirdPersonCharacter } from '../src/templates/thirdPerson';
import { createTopDownCharacter } from '../src/templates/topDown';
import { createGuard, createCompanion, createFlock } from '../src/templates/npcs';

function stubInput() {
  const state = {
    axis: new Vector2(),
    pressed: new Set<string>(),
    pointerDelta: new Vector2(),
    pointerNdc: new Vector2(),
    wheelDelta: 0,
    pointerDown: false,
    moveAxis(target = new Vector2()) {
      return target.copy(state.axis);
    },
    wasPressed: (code: string) => state.pressed.has(code),
    isDown: () => false,
    gamepadDown: () => false,
    gamepadPressed: () => false,
  };
  return state;
}

function stubGame() {
  const world = new World();
  const input = stubInput();
  const callbacks: Array<(t: Time) => void> = [];
  const game: GameContext = {
    world,
    camera: new PerspectiveCamera(),
    input: input as unknown as Input,
    onUpdate(cb) {
      callbacks.push(cb);
      return () => callbacks.splice(callbacks.indexOf(cb), 1);
    },
  };
  const step = (seconds: number, dt = 1 / 60) => {
    const time = new Time();
    time.delta = dt;
    for (let t = 0; t < seconds; t += dt) {
      for (const cb of callbacks) cb(time);
      world.update(time);
      input.pressed.clear();
    }
  };
  return { game, world, input, step };
}

const walkClips = ['Idle_01', 'Walking', 'FastRun', 'JumpUp', 'FallingDown'].map(
  (name) => new AnimationClip(name, 1, [])
);

describe('matchClips', () => {
  it('fuzzy-maps Mixamo-style clip names to locomotion states', () => {
    expect(matchClips(walkClips)).toEqual({
      idle: 'Idle_01',
      walk: 'Walking',
      run: 'FastRun',
      jump: 'JumpUp',
      fall: 'FallingDown',
    });
  });
});

describe('Locomotion', () => {
  it('switches idle → walk → run by speed and air states by grounded', () => {
    const object = new GameObject();
    const animator = object.addComponent(new Animator(walkClips));
    const source = { velocity: new Vector3(), grounded: true, verticalVelocity: 0 };
    object.addComponent(new Locomotion(animator, source, { clips: matchClips(walkClips) }));
    const time = new Time();
    time.delta = 1 / 60;

    object.update(time);
    expect(animator.currentName).toBe('Idle_01');
    source.velocity.set(2, 0, 0);
    object.update(time);
    expect(animator.currentName).toBe('Walking');
    source.velocity.set(6, 0, 0);
    object.update(time);
    expect(animator.currentName).toBe('FastRun');
    source.grounded = false;
    source.verticalVelocity = 5;
    object.update(time);
    expect(animator.currentName).toBe('JumpUp');
    source.verticalVelocity = -5;
    object.update(time);
    expect(animator.currentName).toBe('FallingDown');
  });
});

describe('createThirdPersonCharacter', () => {
  it('renders a capsule person when no model is given', () => {
    const { game } = stubGame();
    const hero = createThirdPersonCharacter(game, {});
    expect(hero.object.children.length).toBeGreaterThan(0);
    expect(hero.animator).toBeUndefined();
  });

  it('moves camera-relative to the rig yaw', () => {
    const { game, input, step } = stubGame();
    const hero = createThirdPersonCharacter(game, {});
    input.axis.set(0, 1); // push forward

    hero.rig.yaw = 0; // camera looks toward -z
    step(1);
    expect(hero.object.position.z).toBeLessThan(-2);

    const zBefore = hero.object.position.z;
    hero.rig.yaw = Math.PI / 2; // camera looks toward -x
    step(1);
    expect(hero.object.position.x).toBeLessThan(-2);
    expect(Math.abs(hero.object.position.z - zBefore)).toBeLessThan(1.5);
  });

  it('jumps on Space, rises, and lands back on the ground', () => {
    const { game, input, step } = stubGame();
    const hero = createThirdPersonCharacter(game, {});
    input.pressed.add('Space');
    step(1 / 60);
    expect(hero.movement.grounded).toBe(false);
    let apex = 0;
    const track = game.onUpdate(() => (apex = Math.max(apex, hero.object.position.y)));
    step(2);
    track();
    expect(apex).toBeGreaterThan(0.8);
    expect(hero.movement.grounded).toBe(true);
    expect(hero.object.position.y).toBe(0);
  });

  it('wires Animator + Locomotion from a model with clips', () => {
    const { game, input, step } = stubGame();
    const hero = createThirdPersonCharacter(game, {
      model: { scene: new GameObject('rig'), animations: walkClips },
    });
    expect(hero.animator).toBeDefined();
    input.axis.set(0, 1);
    step(1);
    expect(hero.animator?.currentName).toBe('FastRun'); // full speed run
  });
});

describe('createTopDownCharacter', () => {
  it('drives with WASD and follows with the camera', () => {
    const { game, input, step } = stubGame();
    const hero = createTopDownCharacter(game, {});
    expect(hero.controller).toBeDefined();
    input.axis.set(1, 0);
    step(1);
    expect(hero.object.position.x).toBeGreaterThan(3);
    step(1);
    // FollowCamera trails at roughly the configured offset height.
    expect(game.camera.position.y).toBeCloseTo(12, 0);
    expect(game.camera.position.x).toBeGreaterThan(3);
  });
});

describe('createGuard', () => {
  it('patrols, spots a near target, chases, and gives up when it escapes', () => {
    const { game, step } = stubGame();
    const target = new GameObject('intruder');
    target.position.set(100, 0, 100);
    const log: string[] = [];
    const guard = createGuard(game, {
      route: [new Vector3(-8, 0, 0), new Vector3(8, 0, 0)],
      target,
      detectRadius: 8,
      onSpotted: () => log.push('spotted'),
      onLost: () => log.push('lost'),
    });

    step(0.5);
    expect(guard.mode).toBe('patrol');

    target.position.copy(guard.object.position).add(new Vector3(4, 0, 4));
    step(0.5);
    expect(guard.mode).toBe('chase');
    const distanceAfterChase = guard.object.position.distanceTo(target.position);
    expect(distanceAfterChase).toBeLessThan(5); // closing in

    target.position.set(100, 0, 100);
    step(2);
    expect(guard.mode).not.toBe('chase');
    expect(log[0]).toBe('spotted');
    expect(log).toContain('lost');
  });
});

describe('createCompanion', () => {
  it('follows at a distance and stops without crowding the owner', () => {
    const { game, step } = stubGame();
    const owner = new GameObject('hero');
    owner.position.set(10, 0, 0);
    const companion = createCompanion(game, { owner, followDistance: 3 });
    step(4);
    const distance = companion.object.position.distanceTo(owner.position);
    expect(distance).toBeLessThan(6);
    expect(distance).toBeGreaterThan(1.5); // kept personal space
  });

  it('teleports to catch up when left far behind', () => {
    const { game, step } = stubGame();
    const owner = new GameObject('hero');
    const companion = createCompanion(game, { owner, teleportDistance: 20 });
    let teleported = false;
    companion.object.events.on('companion-teleported', () => (teleported = true));
    owner.position.set(500, 0, 0);
    step(1 / 60);
    expect(teleported).toBe(true);
    expect(companion.object.position.distanceTo(owner.position)).toBeLessThan(5);
  });
});

describe('createFlock', () => {
  it('creates the flock and spreads crowded boids apart', () => {
    const { game, world, step } = stubGame();
    const flock = createFlock(game, { count: 12 });
    expect(flock.objects).toHaveLength(12);
    expect(world.objects).toHaveLength(12);

    // Cram them together, then let separation work.
    flock.objects.forEach((boid, i) => boid.position.set(i * 0.05, 5, 0));
    step(2);
    let minDistance = Infinity;
    for (let i = 0; i < flock.objects.length; i++) {
      for (let j = i + 1; j < flock.objects.length; j++) {
        minDistance = Math.min(
          minDistance,
          flock.objects[i].position.distanceTo(flock.objects[j].position)
        );
      }
    }
    expect(minDistance).toBeGreaterThan(0.4);

    flock.dispose();
    step(1 / 60); // world reaps destroyed objects
    expect(world.objects).toHaveLength(0);
  });
});
