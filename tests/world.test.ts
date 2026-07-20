import { describe, expect, it } from 'vitest';
import { World } from '../src/core/World';
import { Component } from '../src/core/Component';
import { Time } from '../src/core/Time';
import { StateMachine } from '../src/motion/StateMachine';

class Counter extends Component {
  count = 0;
  override update(): void {
    this.count++;
  }
}

describe('World', () => {
  it('updates components on live objects', () => {
    const world = new World();
    const object = world.spawn('thing');
    const counter = object.addComponent(new Counter());
    const time = new Time();
    world.update(time);
    world.update(time);
    expect(counter.count).toBe(2);
  });

  it('reaps destroyed objects safely mid-update', () => {
    const world = new World();
    const a = world.spawn('a');
    a.addComponent(
      new (class extends Component {
        override update(): void {
          this.owner.destroy();
        }
      })()
    );
    world.update(new Time());
    expect(world.objects.length).toBe(0);
    expect(world.scene.children.length).toBe(0);
  });

  it('finds objects by tag', () => {
    const world = new World();
    const enemy = world.spawn('enemy');
    enemy.tags.add('enemy');
    world.spawn('prop');
    expect(world.findByTag('enemy')).toEqual([enemy]);
  });
});

describe('Time', () => {
  it('clamps huge frame gaps', () => {
    const time = new Time();
    time.tick(0);
    time.tick(5000); // 5s stall (tab in background)
    expect(time.delta).toBeLessThanOrEqual(time.maxDelta);
    expect(time.rawDelta).toBeCloseTo(5);
  });
});

describe('StateMachine', () => {
  it('runs enter/update/exit hooks in order', () => {
    const log: string[] = [];
    const context = { log };
    const fsm = new StateMachine(context);
    fsm.addState({
      name: 'idle',
      enter: (c) => c.log.push('enter idle'),
      update: (c) => c.log.push('update idle'),
      exit: (c) => c.log.push('exit idle'),
    });
    fsm.addState({ name: 'chase', enter: (c) => c.log.push('enter chase') });

    fsm.setState('idle');
    fsm.update(new Time());
    fsm.setState('chase');
    expect(log).toEqual(['enter idle', 'update idle', 'exit idle', 'enter chase']);
    expect(fsm.currentState).toBe('chase');
  });
});
