/** Standard-mapping gamepad button indices, for readable bindings. */
export const GamepadButton = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  LB: 4,
  RB: 5,
  LT: 6,
  RT: 7,
  Back: 8,
  Start: 9,
  LeftStick: 10,
  RightStick: 11,
  DpadUp: 12,
  DpadDown: 13,
  DpadLeft: 14,
  DpadRight: 15,
} as const;

export interface ActionBinding {
  /** KeyboardEvent.code values, e.g. 'Space', 'KeyE'. */
  keys?: string[];
  /** Gamepad button indices — see GamepadButton. */
  buttons?: number[];
}

/** The slice of Input that ActionMap needs (kept minimal for testability). */
export interface ActionInput {
  isDown(code: string): boolean;
  wasPressed(code: string): boolean;
  gamepadDown(index: number): boolean;
  gamepadPressed(index: number): boolean;
}

/**
 * Named, rebindable actions spanning keyboard and gamepad. Game code asks
 * for "jump", not for Space — so rebinding and multi-device support are
 * configuration, not logic changes.
 *
 * ```ts
 * const actions = new ActionMap(game.input)
 *   .bind('jump',   { keys: ['Space'], buttons: [GamepadButton.A] })
 *   .bind('attack', { keys: ['KeyJ'],  buttons: [GamepadButton.X] });
 * if (actions.wasPressed('jump')) ...
 * ```
 */
export class ActionMap {
  private bindings = new Map<string, { keys: string[]; buttons: number[] }>();

  constructor(private input: ActionInput) {}

  bind(action: string, binding: ActionBinding): this {
    this.bindings.set(action, { keys: binding.keys ?? [], buttons: binding.buttons ?? [] });
    return this;
  }

  unbind(action: string): void {
    this.bindings.delete(action);
  }

  getBinding(action: string): ActionBinding | undefined {
    return this.bindings.get(action);
  }

  isDown(action: string): boolean {
    const b = this.bindings.get(action);
    if (!b) return false;
    return (
      b.keys.some((k) => this.input.isDown(k)) || b.buttons.some((i) => this.input.gamepadDown(i))
    );
  }

  wasPressed(action: string): boolean {
    const b = this.bindings.get(action);
    if (!b) return false;
    return (
      b.keys.some((k) => this.input.wasPressed(k)) ||
      b.buttons.some((i) => this.input.gamepadPressed(i))
    );
  }
}
