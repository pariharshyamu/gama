import { Component } from '../core/Component';
import type { Time } from '../core/Time';

export interface State<TContext> {
  name: string;
  enter?(context: TContext): void;
  update?(context: TContext, time: Time): void;
  exit?(context: TContext): void;
}

/**
 * A finite state machine Component for agent decision-making
 * (patrol → chase → attack → flee, etc.). Pair it with a MotionAgent:
 * states swap the agent's steering behaviors on enter.
 */
export class StateMachine<TContext = unknown> extends Component {
  private states = new Map<string, State<TContext>>();
  private current: State<TContext> | null = null;

  constructor(public context: TContext) {
    super();
  }

  get currentState(): string | null {
    return this.current?.name ?? null;
  }

  addState(state: State<TContext>): this {
    this.states.set(state.name, state);
    return this;
  }

  setState(name: string): void {
    const next = this.states.get(name);
    if (!next) throw new Error(`Unknown state "${name}"`);
    if (next === this.current) return;
    this.current?.exit?.(this.context);
    this.current = next;
    next.enter?.(this.context);
  }

  override update(time: Time): void {
    this.current?.update?.(this.context, time);
  }
}
