import { describe, expect, it } from 'vitest';
import { Time } from '../src/core/Time';
import { World } from '../src/core/World';
import {
  BehaviorTree,
  BTNode,
  type BTStatus,
  action,
  condition,
  cooldown,
  invert,
  parallel,
  reactiveSelector,
  reactiveSequence,
  repeat,
  selector,
  sequence,
  succeed,
  untilFail,
  wait,
} from '../src/ai/behaviorTree';

function tick(node: BTNode<unknown>, dt = 1 / 60, elapsed = 0): BTStatus {
  const time = new Time();
  time.delta = dt;
  time.elapsed = elapsed;
  return node.tick(undefined, time);
}

describe('Sequence (with memory)', () => {
  it('runs children in order and succeeds when all succeed', () => {
    const log: string[] = [];
    const tree = sequence(
      action(() => (log.push('a'), true)),
      action(() => (log.push('b'), true))
    );
    expect(tick(tree)).toBe('success');
    expect(log).toEqual(['a', 'b']);
  });

  it('fails fast and does not run later children', () => {
    const log: string[] = [];
    const tree = sequence(
      action(() => false),
      action(() => (log.push('never'), true))
    );
    expect(tick(tree)).toBe('failure');
    expect(log).toEqual([]);
  });

  it('resumes at the running child without re-running earlier ones', () => {
    const log: string[] = [];
    let done = false;
    const tree = sequence(
      action(() => (log.push('once'), true)),
      action(() => (done ? 'success' : 'running'))
    );
    expect(tick(tree)).toBe('running');
    done = true;
    expect(tick(tree)).toBe('success');
    expect(log).toEqual(['once']); // memory: first child ran exactly once
  });
});

describe('Selector', () => {
  it('falls through failures to the first success', () => {
    const tree = selector(
      action(() => false),
      action(() => true),
      action(() => {
        throw new Error('must not reach');
      })
    );
    expect(tick(tree)).toBe('success');
  });

  it('fails when every child fails', () => {
    expect(tick(selector(action(() => false), action(() => false)))).toBe('failure');
  });
});

describe('ReactiveSequence', () => {
  it('re-checks conditions and interrupts the running child when one turns false', () => {
    let canSee = true;
    let resets = 0;
    class Chase extends BTNode<unknown> {
      tick(): BTStatus {
        return 'running';
      }
      override reset(): void {
        resets++;
      }
    }
    const tree = reactiveSequence(
      condition(() => canSee),
      new Chase()
    );
    expect(tick(tree)).toBe('running');
    expect(tick(tree)).toBe('running');
    expect(resets).toBe(0);

    canSee = false; // condition flips → chase must be interrupted
    expect(tick(tree)).toBe('failure');
    expect(resets).toBe(1);
  });
});

describe('ReactiveSelector', () => {
  it('lets a higher-priority branch preempt a running lower one', () => {
    let threat = false;
    let patrolResets = 0;
    class Patrol extends BTNode<unknown> {
      tick(): BTStatus {
        return 'running';
      }
      override reset(): void {
        patrolResets++;
      }
    }
    let fleeing = false;
    const tree = reactiveSelector(
      reactiveSequence(
        condition(() => threat),
        action(() => ((fleeing = true), 'running'))
      ),
      new Patrol()
    );
    expect(tick(tree)).toBe('running'); // patrolling
    threat = true;
    expect(tick(tree)).toBe('running'); // now fleeing
    expect(fleeing).toBe(true);
    expect(patrolResets).toBe(1); // patrol was interrupted
  });
});

describe('decorators', () => {
  it('invert flips success/failure and passes running through', () => {
    expect(tick(invert(action(() => true)))).toBe('failure');
    expect(tick(invert(action(() => false)))).toBe('success');
    expect(tick(invert(action(() => 'running')))).toBe('running');
  });

  it('succeed masks failure', () => {
    expect(tick(succeed(action(() => false)))).toBe('success');
  });

  it('repeat runs N times then succeeds', () => {
    let runs = 0;
    const tree = repeat(
      action(() => (runs++, true)),
      3
    );
    expect(tick(tree)).toBe('running');
    expect(tick(tree)).toBe('running');
    expect(tick(tree)).toBe('success');
    expect(runs).toBe(3);
  });

  it('untilFail succeeds once the child fails', () => {
    let hits = 0;
    const tree = untilFail(action(() => ++hits < 3));
    expect(tick(tree)).toBe('running');
    expect(tick(tree)).toBe('running');
    expect(tick(tree)).toBe('success');
  });

  it('cooldown blocks re-entry until the timer expires', () => {
    let attacks = 0;
    const tree = cooldown(
      action(() => (attacks++, true)),
      2
    );
    expect(tick(tree, 1 / 60, 0)).toBe('success');
    expect(tick(tree, 1 / 60, 1)).toBe('failure'); // still cooling down
    expect(tick(tree, 1 / 60, 2.5)).toBe('success');
    expect(attacks).toBe(2);
  });

  it('wait runs for its duration then succeeds and rearms', () => {
    const tree = wait(0.1);
    expect(tick(tree, 0.05)).toBe('running');
    expect(tick(tree, 0.06)).toBe('success');
    expect(tick(tree, 0.05)).toBe('running'); // reset after success
  });
});

describe('Parallel', () => {
  it('succeeds when the threshold of children succeed', () => {
    let slow = false;
    const tree = parallel([action(() => true), action(() => (slow ? true : 'running'))]);
    expect(tick(tree)).toBe('running');
    slow = true;
    expect(tick(tree)).toBe('success');
  });

  it('fails when the failure threshold is hit', () => {
    const tree = parallel([action(() => 'running'), action(() => false)]);
    expect(tick(tree)).toBe('failure');
  });

  it('does not re-tick already-completed children', () => {
    let first = 0;
    let slow = false;
    const tree = parallel([
      action(() => (first++, true)),
      action(() => (slow ? true : 'running')),
    ]);
    tick(tree);
    tick(tree);
    slow = true;
    tick(tree);
    expect(first).toBe(1);
  });
});

describe('BehaviorTree component', () => {
  it('ticks inside a World update and exposes status', () => {
    const world = new World();
    const npc = world.spawn('npc');
    let ticks = 0;
    const tree = npc.addComponent(
      new BehaviorTree(
        action(() => (ticks++, 'running')),
        undefined
      )
    );
    const time = new Time();
    time.delta = 1 / 60;
    world.update(time);
    world.update(time);
    expect(ticks).toBe(2);
    expect(tree.status).toBe('running');
  });

  it('honors a tick interval for staggered AI', () => {
    const world = new World();
    const npc = world.spawn('npc');
    let ticks = 0;
    npc.addComponent(
      new BehaviorTree(
        action(() => (ticks++, 'running')),
        undefined,
        { interval: 0.125 }
      )
    );
    const time = new Time();
    time.delta = 1 / 64; // binary-exact: 8 frames per interval
    for (let i = 0; i < 16; i++) world.update(time);
    expect(ticks).toBe(2);
  });

  it('drives a guard: patrol until the player is near, chase, then resume', () => {
    interface Guard {
      mode: 'patrol' | 'chase';
      distanceToPlayer: number;
    }
    const guard: Guard = { mode: 'patrol', distanceToPlayer: 100 };
    const tree = new BehaviorTree<Guard>(
      reactiveSelector(
        reactiveSequence(
          condition((g: Guard) => g.distanceToPlayer < 10),
          action((g: Guard) => ((g.mode = 'chase'), 'running'))
        ),
        action((g: Guard) => ((g.mode = 'patrol'), 'running'))
      ),
      guard
    );
    const time = new Time();
    time.delta = 1 / 60;

    tree.update(time);
    expect(guard.mode).toBe('patrol');
    guard.distanceToPlayer = 5;
    tree.update(time);
    expect(guard.mode).toBe('chase');
    guard.distanceToPlayer = 50;
    tree.update(time);
    expect(guard.mode).toBe('patrol');
  });
});
