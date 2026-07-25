import { describe, expect, it } from 'vitest';
import { Queue } from '../src';

const run = (q: Queue<string>, s: number, dt = 1 / 60): void => {
  for (let i = 0; i < s / dt; i++) q.update(dt);
};

describe('Queue', () => {
  it('keeps an order and serves the front', () => {
    const q = new Queue<string>({ service: 2, seed: 1 });
    ['a', 'b', 'c'].forEach((p) => q.join(p));
    expect(q.length).toBe(3);
    expect(q.head).toBe('a');
    expect(q.placeOf('c')).toBe(2);
    const served: string[] = [];
    q.onServed = (w) => served.push(w);
    run(q, 2.1);
    expect(served).toEqual(['a']);
    expect(q.head).toBe('b');
    run(q, 4.2);
    expect(served).toEqual(['a', 'b', 'c']);
    expect(q.length).toBe(0);
    expect(q.head).toBeNull();
  });

  it('stands people further back the further back they are', () => {
    const q = new Queue<string>({ service: 99, spacing: 0.6, seed: 2 });
    ['a', 'b', 'c', 'd'].forEach((p) => q.join(p));
    run(q, 4);
    expect(q.distanceOf('a')).toBeCloseTo(0, 2);
    expect(q.distanceOf('b')).toBeGreaterThan(0.3);
    expect(q.distanceOf('c')).toBeGreaterThan(q.distanceOf('b'));
    expect(q.distanceOf('d')).toBeGreaterThan(q.distanceOf('c'));
  });

  it('leaves different gaps for different people', () => {
    const q = new Queue<string>({ service: 99, spacing: 0.6, seed: 5 });
    const names = Array.from({ length: 8 }, (_, i) => `p${i}`);
    names.forEach((p) => q.join(p));
    run(q, 5);
    const gaps = names.slice(1).map((p, i) => q.distanceOf(p) - q.distanceOf(names[i]));
    const spread = Math.max(...gaps) - Math.min(...gaps);
    // A single spacing constant would make this exactly 0.
    expect(spread).toBeGreaterThan(0.05);
  });

  it('shuffles up as a WAVE, not as a conveyor belt', () => {
    // The tell of a fake queue: when the front leaves, everybody advances on
    // the same frame. Real lines ripple — the person behind moves before the
    // one ten places back has noticed.
    const q = new Queue<string>({ service: 99, spacing: 0.6, reaction: 0.5, seed: 3 });
    const names = Array.from({ length: 6 }, (_, i) => `p${i}`);
    names.forEach((p) => q.join(p));
    run(q, 5);
    const before = names.slice(1).map((p) => q.distanceOf(p));

    q.serve(); // front leaves
    const moved = new Map<string, number>();
    for (let step = 0; step < 180; step++) {
      q.update(1 / 60);
      names.slice(1).forEach((p, i) => {
        if (!moved.has(p) && Math.abs(q.distanceOf(p) - before[i]) > 0.02) moved.set(p, step);
      });
    }
    expect(moved.size).toBeGreaterThan(3);
    const starts = [...moved.values()];
    expect(new Set(starts).size).toBeGreaterThan(2);
    // ...and it travels backwards: the front of the remainder goes first.
    expect(moved.get('p1')!).toBeLessThan(moved.get('p5')!);
  });

  it('eases forward rather than teleporting', () => {
    const q = new Queue<string>({ service: 99, spacing: 0.6, reaction: 0, seed: 4 });
    ['a', 'b'].forEach((p) => q.join(p));
    run(q, 4);
    q.serve();
    const path: number[] = [];
    for (let i = 0; i < 60; i++) {
      q.update(1 / 60);
      path.push(q.distanceOf('b'));
    }
    const jumps = path.slice(1).map((v, i) => Math.abs(v - path[i]));
    expect(Math.max(...jumps)).toBeLessThan(0.1);
    expect(path[path.length - 1]).toBeLessThan(0.05);
  });
});

describe('balking and reneging', () => {
  it('turns people away from a long line — but not all of them', () => {
    const q = new Queue<string>({ service: 999, patience: 4, seed: 7 });
    for (let i = 0; i < 30; i++) q.join(`p${i}`);
    // Some tolerate more than others, so the line settles above `patience`
    // but nowhere near 30.
    expect(q.length).toBeGreaterThan(4);
    expect(q.length).toBeLessThan(20);
  });

  it('reports a balk instead of silently dropping them', () => {
    const q = new Queue<string>({ service: 999, patience: 1, seed: 9 });
    const balked: string[] = [];
    q.onBalk = (w) => balked.push(w);
    for (let i = 0; i < 12; i++) q.join(`p${i}`);
    expect(balked.length).toBeGreaterThan(0);
    expect(q.length + balked.length).toBe(12);
  });

  it('never gives up by default', () => {
    const q = new Queue<string>({ service: 999, seed: 1 });
    ['a', 'b', 'c'].forEach((p) => q.join(p));
    run(q, 600);
    expect(q.length).toBe(3);
  });

  it('gives up when asked to, and not on the person being served', () => {
    const q = new Queue<string>({ service: 999, giveUpAfter: 5, seed: 6 });
    const gone: string[] = [];
    q.onGiveUp = (w) => gone.push(w);
    ['a', 'b', 'c', 'd'].forEach((p) => q.join(p));
    run(q, 20);
    expect(gone.length).toBeGreaterThan(0);
    // 'a' is at the counter — they do not walk out mid-transaction.
    expect(gone).not.toContain('a');
    expect(q.head).toBe('a');
  });

  it('lets somebody leave from the middle and closes the gap', () => {
    const q = new Queue<string>({ service: 999, spacing: 0.6, reaction: 0, seed: 2 });
    ['a', 'b', 'c', 'd'].forEach((p) => q.join(p));
    run(q, 4);
    const dBefore = q.distanceOf('d');
    expect(q.leave('b')).toBe(true);
    run(q, 4);
    expect(q.placeOf('c')).toBe(1);
    expect(q.distanceOf('d')).toBeLessThan(dBefore - 0.3);
    expect(q.leave('zzz')).toBe(false);
  });

  it('reports the front changing', () => {
    const q = new Queue<string>({ service: 1, seed: 1 });
    const fronts: (string | null)[] = [];
    q.onAdvance = (w) => fronts.push(w);
    ['a', 'b'].forEach((p) => q.join(p));
    run(q, 2.4);
    expect(fronts).toEqual(['b', null]);
  });

  it('is deterministic in its seed', () => {
    const trace = (seed: number): string => {
      const q = new Queue<string>({ service: 3, spacing: 0.6, seed });
      const out: string[] = [];
      for (let i = 0; i < 6; i++) q.join(`p${i}`);
      for (let i = 0; i < 600; i++) {
        q.update(1 / 60);
        out.push(q.distanceOf('p4').toFixed(3));
      }
      return out.join(',');
    };
    expect(trace(3)).toBe(trace(3));
    expect(trace(3)).not.toBe(trace(4));
  });
});
