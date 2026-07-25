import { describe, expect, it } from 'vitest';
import { Device, type PowerState } from '../src';

/** A stand-in for SCENA's ScreenPanel: all the handshake needs is setMode. */
function fakeScreen(): { mode: string; setMode(m: string): void; log: string[] } {
  const log: string[] = [];
  return {
    mode: '',
    setMode(m: string) {
      this.mode = m;
      log.push(m);
    },
    log,
  };
}

function run(device: Device, seconds: number, dt = 1 / 60): void {
  for (let i = 0; i < seconds / dt; i++) device.update(dt);
}

describe('Device power states', () => {
  it('starts off and shows nothing', () => {
    const device = new Device();
    const screen = fakeScreen();
    device.attach(screen);
    expect(device.state).toBe('off');
    expect(screen.mode).toBe('off');
    expect(device.ready).toBe(false);
  });

  it('takes time to boot — it does not snap on', () => {
    const device = new Device({ boot: 2 });
    device.press();
    expect(device.state).toBe('booting');
    expect(device.ready).toBe(false);
    run(device, 1);
    // Still booting halfway through, and saying so.
    expect(device.state).toBe('booting');
    expect(device.progress).toBeGreaterThan(0.4);
    expect(device.progress).toBeLessThan(0.6);
    run(device, 1.2);
    expect(device.state).toBe('on');
    expect(device.ready).toBe(true);
    expect(device.progress).toBe(1);
  });

  it('ignores the power button while booting', () => {
    const device = new Device({ boot: 2 });
    device.press();
    run(device, 0.5);
    device.press();
    device.press();
    expect(device.state).toBe('booting');
    run(device, 2);
    expect(device.state).toBe('on');
  });

  it('wakes far faster than it boots', () => {
    const device = new Device({ boot: 3, wake: 0.4, idle: 1 });
    device.press();
    run(device, 3.1);
    expect(device.state).toBe('on');
    run(device, 1.1); // idle out
    expect(device.state).toBe('sleeping');

    device.nudge();
    expect(device.state).toBe('waking');
    run(device, 0.2);
    expect(device.state).toBe('waking'); // a boot would still be going
    run(device, 0.3);
    expect(device.state).toBe('on');
  });

  it('dims before it sleeps', () => {
    const device = new Device({ boot: 0.01, idle: 10, dimShare: 0.2 });
    device.turnOn(true);
    const seen: PowerState[] = [];
    device.onChange = (s) => seen.push(s);
    run(device, 8.5);
    expect(device.state).toBe('dimmed');
    run(device, 2);
    expect(device.state).toBe('sleeping');
    expect(seen).toEqual(['dimmed', 'sleeping']);
  });

  it('never dozes off when idle is disabled', () => {
    const device = new Device({ idle: 0 });
    device.turnOn(true);
    run(device, 600);
    expect(device.state).toBe('on');
  });

  it('resets the idle clock when touched', () => {
    const device = new Device({ idle: 4, dimShare: 0.25 });
    device.turnOn(true);
    for (let i = 0; i < 10; i++) {
      run(device, 2);
      device.nudge(); // somebody keeps using it
    }
    expect(device.state).toBe('on');
  });
});

describe('Device drives a display', () => {
  it('pushes a mode on every transition', () => {
    const device = new Device({ boot: 1 });
    const screen = fakeScreen();
    device.attach(screen);
    device.press();
    expect(screen.mode).toBe('standby'); // booting
    run(device, 1.1);
    expect(screen.mode).toBe('home'); // on
    device.press();
    expect(screen.mode).toBe('off');
  });

  it('returns to the same content after a sleep', () => {
    const device = new Device({ idle: 2, wake: 0.1 });
    const screen = fakeScreen();
    device.attach(screen);
    device.turnOn(true);
    device.show('video'); // put a film on
    expect(screen.mode).toBe('video');

    run(device, 2.5);
    expect(device.state).toBe('sleeping');
    expect(screen.mode).not.toBe('video');

    device.nudge();
    run(device, 0.2);
    // Back to the film, not dumped at a home screen.
    expect(device.state).toBe('on');
    expect(screen.mode).toBe('video');
  });

  it('holds requested content through a power cycle', () => {
    const device = new Device({ boot: 0.5 });
    const screen = fakeScreen();
    device.attach(screen);
    device.turnOn(true);
    device.show('map');
    device.turnOff();
    expect(screen.mode).toBe('off');
    device.press();
    run(device, 0.6);
    expect(screen.mode).toBe('map');
  });

  it('drives several displays at once', () => {
    const device = new Device();
    const a = fakeScreen();
    const b = fakeScreen();
    device.attach(a).attach(b);
    device.turnOn(true);
    device.show('chart');
    expect(a.mode).toBe('chart');
    expect(b.mode).toBe('chart');
  });

  it('takes per-state mode overrides', () => {
    const device = new Device({ boot: 0.1, modes: { sleeping: 'off', on: 'keypad' } });
    const screen = fakeScreen();
    device.attach(screen);
    device.turnOn(true);
    expect(screen.mode).toBe('keypad');
    device.sleep();
    expect(screen.mode).toBe('off');
  });

  it('reports readiness once, on the transition', () => {
    const device = new Device({ boot: 0.5 });
    let ready = 0;
    device.onReady = () => ready++;
    device.press();
    run(device, 2);
    expect(ready).toBe(1);
  });
});
