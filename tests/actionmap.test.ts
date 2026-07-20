import { describe, expect, it } from 'vitest';
import { ActionMap, GamepadButton, type ActionInput } from '../src/input/ActionMap';

class StubInput implements ActionInput {
  downKeys = new Set<string>();
  pressedKeys = new Set<string>();
  downButtons = new Set<number>();
  pressedButtons = new Set<number>();

  isDown(code: string): boolean {
    return this.downKeys.has(code);
  }
  wasPressed(code: string): boolean {
    return this.pressedKeys.has(code);
  }
  gamepadDown(index: number): boolean {
    return this.downButtons.has(index);
  }
  gamepadPressed(index: number): boolean {
    return this.pressedButtons.has(index);
  }
}

describe('ActionMap', () => {
  it('maps any bound key or button to the action', () => {
    const input = new StubInput();
    const actions = new ActionMap(input).bind('jump', {
      keys: ['Space', 'KeyK'],
      buttons: [GamepadButton.A],
    });

    expect(actions.isDown('jump')).toBe(false);
    input.downKeys.add('KeyK');
    expect(actions.isDown('jump')).toBe(true);

    input.downKeys.clear();
    input.downButtons.add(GamepadButton.A);
    expect(actions.isDown('jump')).toBe(true);
  });

  it('reports edge presses from either device', () => {
    const input = new StubInput();
    const actions = new ActionMap(input).bind('attack', {
      keys: ['KeyJ'],
      buttons: [GamepadButton.X],
    });
    input.pressedButtons.add(GamepadButton.X);
    expect(actions.wasPressed('attack')).toBe(true);
    expect(actions.wasPressed('unbound')).toBe(false);
  });

  it('supports rebinding at runtime', () => {
    const input = new StubInput();
    const actions = new ActionMap(input).bind('jump', { keys: ['Space'] });
    input.downKeys.add('KeyZ');
    expect(actions.isDown('jump')).toBe(false);
    actions.bind('jump', { keys: ['KeyZ'] });
    expect(actions.isDown('jump')).toBe(true);
  });
});
