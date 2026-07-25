import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { Attention, broadcast, type Alert } from '../src';

const ring = (urgency = 0.9): Alert => ({ kind: 'ring', urgency });

function run(a: Attention, seconds: number, dt = 1 / 60): void {
  for (let i = 0; i < seconds / dt; i++) a.update(dt);
}

describe('Attention', () => {
  it('does not react instantly — there is a beat first', () => {
    const attention = new Attention({ seed: 1 });
    let noticed = 0;
    attention.onNotice = () => noticed++;
    expect(attention.notice(ring())).toBe(true);
    // The alert has landed, but they have not turned yet.
    expect(attention.reacting).toBe(true);
    expect(attention.engaged).toBe(false);
    expect(noticed).toBe(0);
    run(attention, 1.2);
    expect(attention.engaged).toBe(true);
    expect(noticed).toBe(1);
  });

  it('lets go and reports it', () => {
    const attention = new Attention({ seed: 1 });
    let released = 0;
    attention.onRelease = () => released++;
    attention.notice({ ...ring(), duration: 0.8 });
    run(attention, 1.0);
    expect(attention.engaged).toBe(true);
    run(attention, 1.2);
    expect(attention.engaged).toBe(false);
    expect(attention.focus).toBeNull();
    expect(released).toBe(1);
  });

  it('ignores something too quiet to bother with', () => {
    const attention = new Attention({ seed: 1, threshold: 0.5 });
    const reasons: string[] = [];
    attention.onIgnore = (_a, why) => reasons.push(why);
    expect(attention.notice({ kind: 'notify', urgency: 0.1 })).toBe(false);
    expect(reasons).toEqual(['weak']);
  });

  it('will not let a buzz interrupt a call', () => {
    const attention = new Attention({ seed: 1 });
    const reasons: string[] = [];
    attention.onIgnore = (_a, why) => reasons.push(why);
    attention.notice({ kind: 'ring', urgency: 0.95, duration: 4 });
    run(attention, 1.2);
    expect(attention.focus?.kind).toBe('ring');
    expect(attention.notice({ kind: 'buzz', urgency: 0.4 })).toBe(false);
    expect(reasons).toEqual(['busy']);
    expect(attention.focus?.kind).toBe('ring');
  });

  it('lets something MORE insistent take over', () => {
    const attention = new Attention({ seed: 1 });
    attention.notice({ kind: 'buzz', urgency: 0.5, duration: 6 });
    run(attention, 1.2);
    expect(attention.focus?.kind).toBe('buzz');
    expect(attention.notice({ kind: 'ring', urgency: 0.95 })).toBe(true);
    run(attention, 1.2);
    expect(attention.focus?.kind).toBe('ring');
  });
});

describe('habituation', () => {
  // The fifth buzz is not the first buzz. Without this a repeated alert
  // produces an identical response forever, and a room of people reads as
  // clockwork inside about three repeats.
  it('wears out on repetition, and says so', () => {
    const attention = new Attention({ seed: 4, fatigue: 0.5 });
    const taken: boolean[] = [];
    for (let i = 0; i < 6; i++) {
      taken.push(attention.notice({ kind: 'buzz', urgency: 0.8, duration: 0.2 }));
      run(attention, 1.5);
    }
    expect(taken[0]).toBe(true);
    expect(taken[taken.length - 1]).toBe(false);
    // ...and the interest curve is monotonically down, not a cliff.
    expect(attention.interestIn('buzz')).toBeLessThan(0.2);
  });

  it('reports being tired of a thing, distinct from it being quiet', () => {
    const attention = new Attention({ seed: 4, fatigue: 0.6, recovery: 0 });
    const reasons: string[] = [];
    attention.onIgnore = (_a, why) => reasons.push(why);
    for (let i = 0; i < 8; i++) {
      attention.notice({ kind: 'buzz', urgency: 0.9, duration: 0.1 });
      run(attention, 0.8);
    }
    expect(reasons).toContain('tired');
  });

  it('gets tired of one kind without going deaf to everything', () => {
    const attention = new Attention({ seed: 4, fatigue: 0.6 });
    for (let i = 0; i < 8; i++) {
      attention.notice({ kind: 'buzz', urgency: 0.9, duration: 0.1 });
      run(attention, 0.6);
    }
    expect(attention.notice({ kind: 'buzz', urgency: 0.9 })).toBe(false);
    // A doorbell is still a doorbell.
    expect(attention.notice({ kind: 'ring', urgency: 0.9 })).toBe(true);
  });

  it('recovers while it is quiet', () => {
    const attention = new Attention({ seed: 4, fatigue: 0.7, recovery: 6 });
    for (let i = 0; i < 5; i++) {
      attention.notice({ kind: 'buzz', urgency: 0.9, duration: 0.1 });
      run(attention, 0.5);
    }
    const worn = attention.interestIn('buzz');
    expect(worn).toBeLessThan(0.3);
    run(attention, 30);
    expect(attention.interestIn('buzz')).toBeGreaterThan(worn + 0.4);
    expect(attention.notice({ kind: 'buzz', urgency: 0.9 })).toBe(true);
  });
});

describe('a room does not turn in unison', () => {
  it('reacts at different times', () => {
    const crowd = Array.from({ length: 8 }, (_, i) => new Attention({ seed: i + 1 }));
    const at: number[] = [];
    crowd.forEach((a, i) => {
      a.onNotice = () => at.push(i);
    });
    for (const a of crowd) a.notice(ring());
    // Step and record when each one actually turns.
    const times = new Map<number, number>();
    for (let step = 0; step < 200; step++) {
      const before = at.length;
      for (const a of crowd) a.update(1 / 60);
      for (let k = before; k < at.length; k++) times.set(at[k], step);
    }
    const distinct = new Set(times.values()).size;
    expect(times.size).toBeGreaterThan(5);
    // If they all shared one latency this would be 1.
    expect(distinct).toBeGreaterThan(3);
  });

  it('does not get everyone — some people just do not look up', () => {
    const crowd = Array.from({ length: 12 }, (_, i) =>
      new Attention({ seed: i + 1, sensitivity: 0.4 })
    );
    // Deliberately marginal: 0.4 x 0.7 sits right on the 0.25 threshold, so
    // the per-notice mood decides it and the room splits.
    const taken = crowd.filter((a) => a.notice({ kind: 'notify', urgency: 0.7 })).length;
    expect(taken).toBeGreaterThan(0);
    expect(taken).toBeLessThan(12);
  });
});

describe('broadcast', () => {
  it('is quieter further away, and inaudible past the range', () => {
    const near = { attention: new Attention({ seed: 2 }), position: new Vector3(0, 0, 1) };
    const far = { attention: new Attention({ seed: 2 }), position: new Vector3(0, 0, 9.5) };
    const away = { attention: new Attention({ seed: 2 }), position: new Vector3(0, 0, 40) };
    broadcast(
      { kind: 'ring', urgency: 0.9, at: new Vector3(0, 0, 0), range: 10 },
      [near, far, away]
    );
    expect(near.attention.reacting).toBe(true);
    expect(away.attention.reacting).toBe(false);
    // The far one is inside the range but attenuated to nearly nothing.
    expect(far.attention.reacting).toBe(false);
  });

  it('counts who took it up', () => {
    const crowd = Array.from({ length: 6 }, (_, i) => ({
      attention: new Attention({ seed: i + 1 }),
      position: new Vector3(i * 1.5, 0, 0),
    }));
    const taken = broadcast(
      { kind: 'ring', urgency: 0.95, at: new Vector3(0, 0, 0), range: 14 },
      crowd
    );
    expect(taken).toBeGreaterThan(2);
    expect(taken).toBeLessThanOrEqual(6);
  });

  it('works on listeners with no position at all', () => {
    const crowd = [{ attention: new Attention({ seed: 1 }) }];
    expect(broadcast({ kind: 'ring', urgency: 0.9, at: new Vector3() }, crowd)).toBe(1);
  });
});
