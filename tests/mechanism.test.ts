import { describe, expect, it, vi } from 'vitest';
import { World } from '../src/core/World';
import { Time } from '../src/core/Time';
import { Trigger, Interactable, linkMechanism, type MechanismSource } from '../src/interaction/mechanism';

function step(world: World, frames: number, dt = 1 / 60): void {
  const time = new Time();
  time.delta = dt;
  for (let i = 0; i < frames; i++) world.update(time);
}

/** A structural stand-in for SCENA's Manipulable. */
function stubMechanism(): MechanismSource & { updates: number } {
  const m = {
    open: false,
    updates: 0,
    onChange: undefined as ((open: boolean) => void) | undefined,
    set(t: number | boolean) {
      const next = typeof t === 'boolean' ? t : t >= 0.5;
      const was = m.open;
      m.open = next;
      if (m.open !== was) m.onChange?.(m.open);
    },
    toggle() {
      m.set(!m.open);
      return m.open;
    },
    update(_dt: number) {
      m.updates++;
    },
  };
  return m;
}

describe('linkMechanism', () => {
  it('drives a target from a source, and syncs immediately', () => {
    const lever = stubMechanism();
    const gate = stubMechanism();
    lever.set(true); // source already open before linking…
    linkMechanism(lever, gate);
    expect(gate.open).toBe(true); // …target is synced on link

    lever.toggle(); // close the lever → gate follows
    expect(gate.open).toBe(false);
    lever.toggle();
    expect(gate.open).toBe(true);
  });

  it('can invert, preserve prior onChange, and unlink', () => {
    const lever = stubMechanism();
    const trap = stubMechanism();
    const prior = vi.fn();
    lever.onChange = prior;

    const unlink = linkMechanism(lever, trap, { invert: true });
    expect(trap.open).toBe(true); // inverted sync: lever closed → trap open

    lever.set(true);
    expect(prior).toHaveBeenCalledWith(true); // prior handler still fires
    expect(trap.open).toBe(false); // inverted

    unlink();
    lever.set(false);
    expect(trap.open).toBe(false); // no longer linked (stays)
    expect(prior).toHaveBeenCalledTimes(2); // prior restored, still wired
  });
});

describe('Trigger', () => {
  it('fires enter/exit for tagged bodies crossing the radius', () => {
    const world = new World();
    const pad = world.spawn('pad');
    const enters: string[] = [];
    const exits: string[] = [];
    pad.addComponent(
      new Trigger({ radius: 2, tag: 'player', onEnter: (o) => enters.push(o.name), onExit: (o) => exits.push(o.name) })
    );
    const player = world.spawn('player');
    player.tags.add('player');
    player.position.set(10, 0, 0); // far
    const rock = world.spawn('rock'); // untagged — ignored
    rock.position.set(0, 0, 0);

    step(world, 1);
    expect(enters).toEqual([]); // player far, rock untagged

    player.position.set(1, 0, 0); // inside
    step(world, 1);
    expect(enters).toEqual(['player']);
    expect(pad.getComponent(Trigger)!.active).toBe(true);

    player.position.set(9, 0, 0); // back out
    step(world, 1);
    expect(exits).toEqual(['player']);
    expect(pad.getComponent(Trigger)!.active).toBe(false);
  });
});

describe('Interactable', () => {
  it('press mode: toggles when an in-range actor presses the key', () => {
    const world = new World();
    const mech = stubMechanism();
    const post = world.spawn('lever');
    let pressed = false;
    const input = { wasPressed: (k: string) => pressed && k === 'KeyE' } as never;
    const onOperate = vi.fn();
    const it0 = post.addComponent(new Interactable(mech, { input, key: 'KeyE', radius: 2, onOperate }));
    const player = world.spawn('player');
    player.tags.add('player');
    player.position.set(5, 0, 0); // out of range

    pressed = true;
    step(world, 1);
    expect(mech.open).toBe(false); // too far to operate
    expect(it0.inRange).toBe(false);

    player.position.set(1, 0, 0); // in range
    step(world, 1);
    expect(it0.inRange).toBe(true);
    expect(mech.open).toBe(true); // pressed while in range → operated
    expect(onOperate).toHaveBeenCalledWith(true, player);
    expect(mech.updates).toBeGreaterThan(0); // it eases the joint for you
  });

  it('auto mode: mirrors proximity like an automatic door', () => {
    const world = new World();
    const mech = stubMechanism();
    const frame = world.spawn('door');
    frame.addComponent(new Interactable(mech, { mode: 'auto', radius: 2, tag: 'player' }));
    const player = world.spawn('player');
    player.tags.add('player');

    player.position.set(6, 0, 0);
    step(world, 1);
    expect(mech.open).toBe(false); // nobody near

    player.position.set(1.5, 0, 0);
    step(world, 1);
    expect(mech.open).toBe(true); // approach → opens

    player.position.set(6, 0, 0);
    step(world, 1);
    expect(mech.open).toBe(false); // leave → closes
  });

  it('operate() works scripted and emits an event', () => {
    const world = new World();
    const mech = stubMechanism();
    const post = world.spawn('chest');
    const inter = post.addComponent(new Interactable(mech));
    const seen = vi.fn();
    post.events.on('operated', seen);
    inter.operate();
    expect(mech.open).toBe(true);
    expect(seen).toHaveBeenCalledOnce();
  });
});
