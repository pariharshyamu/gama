import type { Input } from './Input';

export interface TouchButtonSpec {
  /** Label drawn in the button. */
  label: string;
  /** Virtual key code it presses while held (KeyboardEvent.code, e.g. 'Space'). */
  code: string;
  /** CSS placement, e.g. `right:24px;bottom:32px`. */
  css: string;
}

export interface TouchControlsOptions {
  /**
   * When to show: `'auto'` (only if the device reports touch — default),
   * `'always'`, or `'never'`.
   */
  show?: 'auto' | 'always' | 'never';
  /** Add a left analog joystick that writes `input.virtualAxis`. Default true. */
  joystick?: boolean;
  /** Extra on-screen buttons pressing virtual keys (`input.virtualDown`). */
  buttons?: TouchButtonSpec[];
  /** Element the controls mount into. Default `document.body`. */
  parent?: HTMLElement;
  /** Joystick tint. Default a translucent white. */
  color?: string;
}

/**
 * On-screen touch controls that drive an `Input`'s virtual axis/buttons —
 * so a game written for keyboard (`input.moveAxis`, `input.isDown`) becomes
 * playable on phones with **one line** and no branching. A left analog
 * joystick feeds `virtualAxis` (x: right, y: forward); optional buttons
 * press virtual keys.
 *
 * ```ts
 * new TouchControls(game.input, { buttons: [{ label: 'A', code: 'Space', css: 'right:24px;bottom:36px' }] });
 * ```
 *
 * Shows only on touch devices by default. Purely additive: a keyboard/
 * gamepad still works simultaneously (great for testing on desktop).
 */
export class TouchControls {
  readonly root: HTMLElement | null = null;
  private cleanup: Array<() => void> = [];

  constructor(input: Input, options: TouchControlsOptions = {}) {
    const show = options.show ?? 'auto';
    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || (navigator.maxTouchPoints ?? 0) > 0);
    if (show === 'never' || (show === 'auto' && !isTouch)) return;
    if (typeof document === 'undefined') return;

    const parent = options.parent ?? document.body;
    const root = document.createElement('div');
    root.className = 'gama-touch';
    root.style.cssText =
      'position:fixed;inset:0;z-index:20;pointer-events:none;' +
      'touch-action:none;user-select:none;-webkit-user-select:none';
    parent.appendChild(root);
    this.root = root;

    if (options.joystick ?? true) this.addJoystick(input, root, options.color);
    for (const button of options.buttons ?? []) this.addButton(input, root, button);
  }

  private addJoystick(input: Input, root: HTMLElement, color = 'rgba(255,255,255,.16)'): void {
    const base = document.createElement('div');
    base.style.cssText =
      'position:absolute;left:26px;bottom:26px;width:132px;height:132px;border-radius:50%;' +
      `background:${color};border:1px solid rgba(255,255,255,.32);pointer-events:auto;touch-action:none`;
    const knob = document.createElement('div');
    knob.style.cssText =
      'position:absolute;left:50%;top:50%;width:58px;height:58px;margin:-29px 0 0 -29px;' +
      'border-radius:50%;background:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.6);' +
      'transition:transform .04s linear';
    base.appendChild(knob);
    root.appendChild(base);

    const radius = 50;
    let active = -1;
    const set = (dx: number, dy: number): void => {
      const len = Math.hypot(dx, dy);
      const clamp = len > radius ? radius / len : 1;
      const x = dx * clamp;
      const y = dy * clamp;
      knob.style.transform = `translate(${x}px, ${y}px)`;
      input.virtualAxis.set(x / radius, -y / radius); // screen-down is -forward
    };
    const reset = (): void => {
      active = -1;
      knob.style.transform = 'translate(0,0)';
      input.virtualAxis.set(0, 0);
    };
    const rect = (): DOMRect => base.getBoundingClientRect();
    const onDown = (e: PointerEvent): void => {
      e.preventDefault();
      active = e.pointerId;
      const r = rect();
      set(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
    };
    const onMove = (e: PointerEvent): void => {
      if (e.pointerId !== active) return;
      const r = rect();
      set(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
    };
    const onUp = (e: PointerEvent): void => {
      if (e.pointerId === active) reset();
    };
    base.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    this.cleanup.push(() => {
      base.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      reset();
    });
  }

  private addButton(input: Input, root: HTMLElement, spec: TouchButtonSpec): void {
    const b = document.createElement('div');
    b.textContent = spec.label;
    b.style.cssText =
      'position:absolute;width:68px;height:68px;border-radius:50%;' +
      'background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.36);' +
      'color:#fff;font:700 22px system-ui;display:flex;align-items:center;justify-content:center;' +
      'pointer-events:auto;touch-action:none;' +
      spec.css;
    root.appendChild(b);
    const press = (e: Event): void => {
      e.preventDefault();
      input.pressVirtual(spec.code);
      b.style.background = 'rgba(255,255,255,.34)';
    };
    const release = (): void => {
      input.releaseVirtual(spec.code);
      b.style.background = 'rgba(255,255,255,.16)';
    };
    b.addEventListener('pointerdown', press);
    b.addEventListener('pointerup', release);
    b.addEventListener('pointercancel', release);
    b.addEventListener('pointerleave', release);
    this.cleanup.push(() => {
      b.removeEventListener('pointerdown', press);
      b.removeEventListener('pointerup', release);
      b.removeEventListener('pointercancel', release);
      b.removeEventListener('pointerleave', release);
    });
  }

  /** Are the controls actually mounted (i.e. shown on this device)? */
  get mounted(): boolean {
    return this.root !== null;
  }

  dispose(): void {
    for (const fn of this.cleanup) fn();
    this.cleanup.length = 0;
    this.root?.remove();
  }
}
