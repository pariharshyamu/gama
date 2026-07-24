import { Vector2 } from 'three';

/**
 * Keyboard + pointer state polled per frame.
 * `isDown` reports held keys; `wasPressed`/`wasReleased` report edges that
 * occurred since the previous frame and are cleared in `lateUpdate`
 * (called automatically by Game at the end of each step).
 */
export class Input {
  readonly pointer = new Vector2();
  /** Pointer position normalized to [-1, 1], y up — ready for raycasting. */
  readonly pointerNdc = new Vector2();
  /** Pointer movement since last frame (movementX/Y — works under pointer lock). */
  readonly pointerDelta = new Vector2();
  /** Wheel deltaY accumulated since last frame. */
  wheelDelta = 0;
  pointerDown = false;

  /** First connected gamepad's left stick, deadzone applied, y = forward. */
  readonly leftStick = new Vector2();
  readonly rightStick = new Vector2();
  gamepadConnected = false;
  /** Stick deadzone radius. */
  deadzone = 0.15;

  /**
   * A soft directional axis any source can write (x: right, y: forward),
   * folded into `moveAxis`. `TouchControls` steers this from an on-screen
   * joystick, so keyboard/gamepad game code works unchanged on phones.
   */
  readonly virtualAxis = new Vector2();
  /**
   * Soft held "keys" any source can write (KeyboardEvent.code strings),
   * folded into `isDown`/`wasPressed`. On-screen buttons write here.
   */
  readonly virtualDown = new Set<string>();
  private virtualPressed = new Set<string>();
  /** Press a virtual key (edge + held) — for on-screen buttons. */
  pressVirtual(code: string): void {
    if (!this.virtualDown.has(code)) this.virtualPressed.add(code);
    this.virtualDown.add(code);
  }
  /** Release a virtual key. */
  releaseVirtual(code: string): void {
    this.virtualDown.delete(code);
  }

  private gpDown: boolean[] = [];
  private gpPressed: boolean[] = [];
  private down = new Set<string>();
  private pressed = new Set<string>();
  private released = new Set<string>();
  private target: HTMLElement;
  private listeners: Array<[EventTarget, string, EventListener]> = [];

  constructor(target: HTMLElement) {
    this.target = target;
    this.listen(window, 'keydown', (e) => {
      const key = (e as KeyboardEvent).code;
      if (!this.down.has(key)) this.pressed.add(key);
      this.down.add(key);
    });
    this.listen(window, 'keyup', (e) => {
      const key = (e as KeyboardEvent).code;
      this.down.delete(key);
      this.released.add(key);
    });
    this.listen(window, 'blur', () => this.down.clear());
    this.listen(target, 'pointermove', (e) => {
      const pe = e as PointerEvent;
      this.pointerDelta.x += pe.movementX ?? 0;
      this.pointerDelta.y += pe.movementY ?? 0;
      this.updatePointer(pe);
    });
    this.listen(target, 'wheel', (e) => (this.wheelDelta += (e as WheelEvent).deltaY));
    this.listen(target, 'pointerdown', (e) => {
      this.pointerDown = true;
      this.updatePointer(e as PointerEvent);
    });
    this.listen(window, 'pointerup', () => (this.pointerDown = false));
  }

  /** Is the key currently held? Uses KeyboardEvent.code, e.g. 'KeyW', 'Space'. */
  isDown(code: string): boolean {
    return this.down.has(code) || this.virtualDown.has(code);
  }

  /** Did the key go down since last frame? (keyboard or on-screen button) */
  wasPressed(code: string): boolean {
    return this.pressed.has(code) || this.virtualPressed.has(code);
  }

  /** Did the key go up since last frame? */
  wasReleased(code: string): boolean {
    return this.released.has(code);
  }

  /** Is the gamepad button at `index` currently held? (standard mapping) */
  gamepadDown(index: number): boolean {
    return this.gpDown[index] === true;
  }

  /** Did the gamepad button at `index` go down since last frame? */
  gamepadPressed(index: number): boolean {
    return this.gpPressed[index] === true;
  }

  /**
   * WASD/arrow-key + left-stick movement as a vector of length ≤ 1
   * (x: right, y: forward). Pass a target to avoid allocation.
   */
  moveAxis(target = new Vector2()): Vector2 {
    target.set(
      (this.isDown('KeyD') || this.isDown('ArrowRight') ? 1 : 0) -
        (this.isDown('KeyA') || this.isDown('ArrowLeft') ? 1 : 0),
      (this.isDown('KeyW') || this.isDown('ArrowUp') ? 1 : 0) -
        (this.isDown('KeyS') || this.isDown('ArrowDown') ? 1 : 0)
    );
    target.add(this.leftStick).add(this.virtualAxis);
    return target.lengthSq() > 1 ? target.normalize() : target;
  }

  /** Poll gamepad state. Called by Game at the start of each step. */
  update(): void {
    const pads =
      typeof navigator !== 'undefined' && navigator.getGamepads ? navigator.getGamepads() : [];
    let pad: Gamepad | null = null;
    for (const p of pads) {
      if (p) {
        pad = p;
        break;
      }
    }
    this.gamepadConnected = pad !== null;
    if (!pad) {
      this.leftStick.set(0, 0);
      this.rightStick.set(0, 0);
      this.gpDown.length = 0;
      this.gpPressed.length = 0;
      return;
    }
    this.applyDeadzone(this.leftStick.set(pad.axes[0] ?? 0, -(pad.axes[1] ?? 0)));
    this.applyDeadzone(this.rightStick.set(pad.axes[2] ?? 0, -(pad.axes[3] ?? 0)));
    this.gpPressed.length = pad.buttons.length;
    for (let i = 0; i < pad.buttons.length; i++) {
      const isDown = pad.buttons[i].pressed;
      this.gpPressed[i] = isDown && !this.gpDown[i];
      this.gpDown[i] = isDown;
    }
  }

  /** Clear per-frame edge state. Called by Game after each step. */
  lateUpdate(): void {
    this.pressed.clear();
    this.released.clear();
    this.virtualPressed.clear();
    this.pointerDelta.set(0, 0);
    this.wheelDelta = 0;
  }

  private applyDeadzone(stick: Vector2): void {
    if (stick.length() < this.deadzone) stick.set(0, 0);
  }

  dispose(): void {
    for (const [target, type, listener] of this.listeners) {
      target.removeEventListener(type, listener);
    }
    this.listeners.length = 0;
  }

  private updatePointer(e: PointerEvent): void {
    const rect = this.target.getBoundingClientRect();
    this.pointer.set(e.clientX - rect.left, e.clientY - rect.top);
    this.pointerNdc.set(
      (this.pointer.x / rect.width) * 2 - 1,
      -(this.pointer.y / rect.height) * 2 + 1
    );
  }

  private listen(target: EventTarget, type: string, listener: EventListener): void {
    target.addEventListener(type, listener);
    this.listeners.push([target, type, listener]);
  }
}
