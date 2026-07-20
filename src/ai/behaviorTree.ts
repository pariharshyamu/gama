import { Component } from '../core/Component';
import type { Time } from '../core/Time';

/** Result of ticking a behavior tree node. */
export type BTStatus = 'success' | 'failure' | 'running';

/**
 * Base class for behavior tree nodes. A node is ticked with the tree's
 * context and the frame Time, and reports success/failure/running.
 * `reset()` clears internal state (running children, timers) — called
 * when a branch is interrupted or a composite completes.
 */
export abstract class BTNode<T> {
  abstract tick(context: T, time: Time): BTStatus;
  reset(): void {}
}

/** Leaf that runs a function. Return a BTStatus, or a boolean (→ success/failure). */
export class Action<T> extends BTNode<T> {
  constructor(
    private fn: (context: T, time: Time) => BTStatus | boolean,
    private onReset?: (context: T) => void,
    private context?: T
  ) {
    super();
  }

  tick(context: T, time: Time): BTStatus {
    const result = this.fn(context, time);
    if (result === true) return 'success';
    if (result === false) return 'failure';
    return result;
  }

  override reset(): void {
    if (this.onReset && this.context !== undefined) this.onReset(this.context);
  }
}

/** Leaf that checks a predicate: success when true, failure when false. */
export class Condition<T> extends BTNode<T> {
  constructor(private predicate: (context: T) => boolean) {
    super();
  }

  tick(context: T): BTStatus {
    return this.predicate(context) ? 'success' : 'failure';
  }
}

/** Leaf that runs for `seconds`, then succeeds. */
export class Wait<T> extends BTNode<T> {
  private elapsed = 0;

  constructor(public seconds: number) {
    super();
  }

  tick(_context: T, time: Time): BTStatus {
    this.elapsed += time.delta;
    if (this.elapsed >= this.seconds) {
      this.elapsed = 0;
      return 'success';
    }
    return 'running';
  }

  override reset(): void {
    this.elapsed = 0;
  }
}

/**
 * Ticks children in order; fails on the first failure, succeeds when all
 * succeed. Remembers its running child and resumes there next tick
 * (earlier children are NOT re-run — use ReactiveSequence for that).
 */
export class Sequence<T> extends BTNode<T> {
  private index = 0;

  constructor(protected children: BTNode<T>[]) {
    super();
  }

  tick(context: T, time: Time): BTStatus {
    while (this.index < this.children.length) {
      const status = this.children[this.index].tick(context, time);
      if (status === 'running') return 'running';
      if (status === 'failure') {
        this.reset();
        return 'failure';
      }
      this.index++;
    }
    this.reset();
    return 'success';
  }

  override reset(): void {
    this.index = 0;
    for (const child of this.children) child.reset();
  }
}

/**
 * Ticks children in order; succeeds on the first success, fails when all
 * fail. Remembers its running child and resumes there next tick.
 */
export class Selector<T> extends BTNode<T> {
  private index = 0;

  constructor(protected children: BTNode<T>[]) {
    super();
  }

  tick(context: T, time: Time): BTStatus {
    while (this.index < this.children.length) {
      const status = this.children[this.index].tick(context, time);
      if (status === 'running') return 'running';
      if (status === 'success') {
        this.reset();
        return 'success';
      }
      this.index++;
    }
    this.reset();
    return 'failure';
  }

  override reset(): void {
    this.index = 0;
    for (const child of this.children) child.reset();
  }
}

/**
 * Like Sequence, but re-ticks from the FIRST child every tick — earlier
 * conditions are re-checked while a later child runs, and a condition
 * turning false interrupts (resets) the running child. This is how you
 * make behaviors abortable: `reactiveSequence(condition(...), action(...))`.
 */
export class ReactiveSequence<T> extends BTNode<T> {
  private runningChild = -1;

  constructor(protected children: BTNode<T>[]) {
    super();
  }

  tick(context: T, time: Time): BTStatus {
    for (let i = 0; i < this.children.length; i++) {
      const status = this.children[i].tick(context, time);
      if (status === 'running') {
        if (this.runningChild !== -1 && this.runningChild !== i) {
          this.children[this.runningChild].reset();
        }
        this.runningChild = i;
        return 'running';
      }
      if (status === 'failure') {
        if (this.runningChild !== -1 && this.runningChild !== i) {
          this.children[this.runningChild].reset();
        }
        this.runningChild = -1;
        return 'failure';
      }
    }
    this.runningChild = -1;
    return 'success';
  }

  override reset(): void {
    this.runningChild = -1;
    for (const child of this.children) child.reset();
  }
}

/**
 * Like Selector, but re-ticks from the FIRST child every tick — a
 * higher-priority branch becoming viable interrupts (resets) the running
 * lower-priority branch. This is the classic priority-based AI root.
 */
export class ReactiveSelector<T> extends BTNode<T> {
  private runningChild = -1;

  constructor(protected children: BTNode<T>[]) {
    super();
  }

  tick(context: T, time: Time): BTStatus {
    for (let i = 0; i < this.children.length; i++) {
      const status = this.children[i].tick(context, time);
      if (status === 'running') {
        if (this.runningChild !== -1 && this.runningChild !== i) {
          this.children[this.runningChild].reset();
        }
        this.runningChild = i;
        return 'running';
      }
      if (status === 'success') {
        if (this.runningChild !== -1 && this.runningChild !== i) {
          this.children[this.runningChild].reset();
        }
        this.runningChild = -1;
        return 'success';
      }
    }
    this.runningChild = -1;
    return 'failure';
  }

  override reset(): void {
    this.runningChild = -1;
    for (const child of this.children) child.reset();
  }
}

export interface ParallelOptions {
  /** Children that must succeed for the parallel to succeed. Default: all. */
  successThreshold?: number;
  /** Children that must fail for the parallel to fail. Default: 1. */
  failureThreshold?: number;
}

/**
 * Ticks all children every tick. Completed children keep their status
 * until the parallel itself completes and resets.
 */
export class Parallel<T> extends BTNode<T> {
  private statuses: Array<BTStatus | null> = [];
  private successThreshold: number;
  private failureThreshold: number;

  constructor(protected children: BTNode<T>[], options: ParallelOptions = {}) {
    super();
    this.successThreshold = options.successThreshold ?? children.length;
    this.failureThreshold = options.failureThreshold ?? 1;
  }

  tick(context: T, time: Time): BTStatus {
    let successes = 0;
    let failures = 0;
    for (let i = 0; i < this.children.length; i++) {
      let status = this.statuses[i] ?? null;
      if (status === null || status === 'running') {
        status = this.children[i].tick(context, time);
        this.statuses[i] = status;
      }
      if (status === 'success') successes++;
      if (status === 'failure') failures++;
    }
    if (successes >= this.successThreshold) {
      this.reset();
      return 'success';
    }
    if (failures >= this.failureThreshold) {
      this.reset();
      return 'failure';
    }
    return 'running';
  }

  override reset(): void {
    this.statuses.length = 0;
    for (const child of this.children) child.reset();
  }
}

/** Inverts success/failure; running passes through. */
export class Inverter<T> extends BTNode<T> {
  constructor(protected child: BTNode<T>) {
    super();
  }

  tick(context: T, time: Time): BTStatus {
    const status = this.child.tick(context, time);
    if (status === 'success') return 'failure';
    if (status === 'failure') return 'success';
    return 'running';
  }

  override reset(): void {
    this.child.reset();
  }
}

/** Always reports success once the child completes (either way). */
export class Succeeder<T> extends BTNode<T> {
  constructor(protected child: BTNode<T>) {
    super();
  }

  tick(context: T, time: Time): BTStatus {
    return this.child.tick(context, time) === 'running' ? 'running' : 'success';
  }

  override reset(): void {
    this.child.reset();
  }
}

/** Repeats the child `times` times (Infinity = forever); fails through. */
export class Repeat<T> extends BTNode<T> {
  private count = 0;

  constructor(protected child: BTNode<T>, public times = Infinity) {
    super();
  }

  tick(context: T, time: Time): BTStatus {
    const status = this.child.tick(context, time);
    if (status === 'running') return 'running';
    if (status === 'failure') {
      this.reset();
      return 'failure';
    }
    this.count++;
    if (this.count >= this.times) {
      this.reset();
      return 'success';
    }
    return 'running';
  }

  override reset(): void {
    this.count = 0;
    this.child.reset();
  }
}

/** Repeats the child until it fails, then succeeds. */
export class UntilFail<T> extends BTNode<T> {
  constructor(protected child: BTNode<T>) {
    super();
  }

  tick(context: T, time: Time): BTStatus {
    const status = this.child.tick(context, time);
    if (status === 'failure') return 'success';
    return 'running';
  }

  override reset(): void {
    this.child.reset();
  }
}

/**
 * After the child completes, block (return failure) for `seconds` before
 * it may run again — attack cooldowns, ability timers.
 */
export class Cooldown<T> extends BTNode<T> {
  private readyAt = -Infinity;

  constructor(protected child: BTNode<T>, public seconds: number) {
    super();
  }

  tick(context: T, time: Time): BTStatus {
    if (time.elapsed < this.readyAt) return 'failure';
    const status = this.child.tick(context, time);
    if (status !== 'running') this.readyAt = time.elapsed + this.seconds;
    return status;
  }

  override reset(): void {
    this.child.reset();
  }
}

export interface BehaviorTreeOptions {
  /** Tick interval in seconds; 0 (default) ticks every frame. Staggering
   *  AI across intervals (e.g. 0.1) is an easy perf win for crowds. */
  interval?: number;
}

/**
 * A Component that ticks a behavior tree against a context object.
 * Pair it with a MotionAgent: actions swap steering behaviors, conditions
 * read world state, and reactive composites make everything interruptible.
 *
 * ```ts
 * const tree = new BehaviorTree(
 *   reactiveSelector<Guard>(
 *     reactiveSequence(
 *       condition((g) => g.canSeePlayer()),
 *       action((g) => { g.chase(); return 'running'; })
 *     ),
 *     action((g) => { g.patrol(); return 'running'; })
 *   ),
 *   guardContext
 * );
 * guard.addComponent(tree);
 * ```
 */
export class BehaviorTree<T> extends Component {
  /** Status of the most recent tick. */
  status: BTStatus | null = null;
  private accumulator = 0;
  private interval: number;

  constructor(public root: BTNode<T>, public context: T, options: BehaviorTreeOptions = {}) {
    super();
    this.interval = options.interval ?? 0;
  }

  override update(time: Time): void {
    if (this.interval > 0) {
      this.accumulator += time.delta;
      if (this.accumulator < this.interval) return;
      this.accumulator = 0;
    }
    this.status = this.root.tick(this.context, time);
  }

  reset(): void {
    this.root.reset();
    this.status = null;
    this.accumulator = 0;
  }
}

// --- Factory helpers for readable tree definitions -----------------------

export const sequence = <T>(...children: BTNode<T>[]): Sequence<T> => new Sequence(children);
export const selector = <T>(...children: BTNode<T>[]): Selector<T> => new Selector(children);
export const reactiveSequence = <T>(...children: BTNode<T>[]): ReactiveSequence<T> =>
  new ReactiveSequence(children);
export const reactiveSelector = <T>(...children: BTNode<T>[]): ReactiveSelector<T> =>
  new ReactiveSelector(children);
export const parallel = <T>(children: BTNode<T>[], options?: ParallelOptions): Parallel<T> =>
  new Parallel(children, options);
export const action = <T>(fn: (context: T, time: Time) => BTStatus | boolean): Action<T> =>
  new Action(fn);
export const condition = <T>(predicate: (context: T) => boolean): Condition<T> =>
  new Condition(predicate);
export const wait = <T>(seconds: number): Wait<T> => new Wait(seconds);
export const invert = <T>(child: BTNode<T>): Inverter<T> => new Inverter(child);
export const succeed = <T>(child: BTNode<T>): Succeeder<T> => new Succeeder(child);
export const repeat = <T>(child: BTNode<T>, times?: number): Repeat<T> => new Repeat(child, times);
export const untilFail = <T>(child: BTNode<T>): UntilFail<T> => new UntilFail(child);
export const cooldown = <T>(child: BTNode<T>, seconds: number): Cooldown<T> =>
  new Cooldown(child, seconds);
