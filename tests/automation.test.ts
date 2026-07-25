import { describe, expect, it } from 'vitest';
import { Automation } from '../src';

const run = (a: Automation, s: number, dt = 1 / 60): void => {
  for (let i = 0; i < s / dt; i++) a.update(dt);
};

describe('Automation', () => {
  it('does not act instantly — the house catches up', () => {
    // The single most recognisable property of the real thing: you flip the
    // switch and the light comes on a BEAT later.
    const home = new Automation({ seed: 1, delay: 0.4 });
    home.link('switch', 'lamp');
    home.set('switch', true);
    expect(home.isOn('switch')).toBe(true);
    expect(home.isOn('lamp')).toBe(false);
    expect(home.pending).toBe(1);
    run(home, 1);
    expect(home.isOn('lamp')).toBe(true);
    expect(home.pending).toBe(0);
  });

  it('staggers identical devices', () => {
    const home = new Automation({ seed: 3, delay: 0.4 });
    for (let i = 0; i < 6; i++) home.link('scene', `lamp${i}`);
    const at = new Map<string, number>();
    for (let i = 0; i < 6; i++) home.on(`lamp${i}`, () => at.set(`lamp${i}`, step));
    let step = 0;
    home.set('scene', true);
    for (; step < 120; step++) home.update(1 / 60);
    expect(at.size).toBe(6);
    // A shared delay would make this 1.
    expect(new Set(at.values()).size).toBeGreaterThan(2);
  });

  it('carries values through, and can transform them', () => {
    const home = new Automation({ seed: 1, delay: 0.1 });
    home.link('dimmer', 'lamp', { map: (v) => v * 0.5 });
    home.set('dimmer', 0.8);
    run(home, 0.5);
    expect(home.get('lamp')).toBeCloseTo(0.4, 3);
  });

  it('chains down a graph', () => {
    const home = new Automation({ seed: 2, delay: 0.2 });
    home.link('motion', 'hall').link('hall', 'stairs').link('stairs', 'landing');
    home.set('motion', true);
    run(home, 0.25);
    expect(home.isOn('landing')).toBe(false); // still travelling
    run(home, 1.2);
    expect(home.isOn('landing')).toBe(true);
  });

  it('refuses a loop rather than spinning forever', () => {
    const home = new Automation({ seed: 1 });
    home.link('a', 'b').link('b', 'c');
    expect(() => home.link('c', 'a')).toThrow(/loop/);
    expect(() => home.link('a', 'a')).toThrow(/itself/);
    // ...and the rejected link is not left half-wired.
    home.set('a', true);
    run(home, 3);
    expect(home.isOn('c')).toBe(true);
  });

  it('settles once when a switch is flicked twice quickly', () => {
    const home = new Automation({ seed: 1, delay: 0.5 });
    const seen: number[] = [];
    home.link('switch', 'lamp');
    home.on('lamp', (v) => seen.push(v));
    home.set('switch', true);
    run(home, 0.1);
    home.set('switch', false);
    run(home, 2);
    expect(seen).toEqual([]); // never came on at all
    expect(home.isOn('lamp')).toBe(false);
  });
});

describe('sensors hold', () => {
  it('stays on after the motion stops', () => {
    // A sensor that drops the moment you stop moving turns the lights off on
    // somebody sitting still. That is the classic real failure, and modelled
    // it is the classic tell of a fake one.
    const home = new Automation({ seed: 1, delay: 0.05 });
    home.hold('motion', 5);
    home.link('motion', 'lamp');
    home.set('motion', true);
    run(home, 0.2);
    expect(home.isOn('lamp')).toBe(true);
    run(home, 3);
    expect(home.isOn('motion')).toBe(true); // still holding
    run(home, 2.5);
    expect(home.isOn('motion')).toBe(false);
    run(home, 0.3);
    expect(home.isOn('lamp')).toBe(false);
  });

  it('refreshes the hold on each new trigger rather than restarting', () => {
    const home = new Automation({ seed: 1, delay: 0.05 });
    const edges: number[] = [];
    home.hold('motion', 4);
    home.on('motion', (v) => edges.push(v));
    for (let i = 0; i < 6; i++) {
      home.set('motion', true); // somebody keeps moving about
      run(home, 2);
    }
    expect(home.isOn('motion')).toBe(true);
    // One rise, and no flicker in between.
    expect(edges).toEqual([1]);
    run(home, 5);
    expect(edges).toEqual([1, 0]);
  });

  it('reports how long it has left', () => {
    const home = new Automation({ seed: 1 });
    home.hold('motion', 10);
    home.set('motion', true);
    run(home, 4);
    expect(home.holdLeft('motion')).toBeGreaterThan(5);
    expect(home.holdLeft('motion')).toBeLessThan(6.5);
    expect(home.holdLeft('nothing')).toBe(0);
  });

  it('unsubscribes cleanly', () => {
    const home = new Automation({ seed: 1, delay: 0.05 });
    let n = 0;
    const off = home.on('lamp', () => n++);
    home.set('lamp', true);
    expect(n).toBe(1);
    off();
    home.set('lamp', false);
    expect(n).toBe(1);
  });
});
