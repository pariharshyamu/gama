import { describe, expect, it, vi } from 'vitest';
import { CheckpointRun, Collector } from '../src';

/** A minimal SCENA-Pickup-shaped thing: one-shot until respawned. */
const fakePickup = (x: number, z: number, radius = 0.5) => {
  let state: 'idle' | 'gone' = 'idle';
  return {
    trigger: { center: { x, y: 0.8, z }, radius },
    collect: () => (state === 'idle' ? ((state = 'gone'), 0.35) : 0),
    respawn: () => ((state = 'idle'), 0.45),
    get state() {
      return state;
    },
  };
};

/** A minimal SCENA-PickupField-shaped thing. */
const fakeField = (spots: Array<[number, number]>) => {
  const active = spots.map(() => true);
  return {
    triggers: spots.map(([x, z], index) => ({ center: { x, y: 0.8, z }, radius: 0.5, index })),
    isActive: (i: number) => active[i],
    collect: (i: number) => (active[i] ? ((active[i] = false), 0.35) : 0),
    respawn: (i: number) => ((active[i] = true), 0.45),
    active,
  };
};

describe('Collector', () => {
  it('collects what the sweep touches, once, and reports value and place', () => {
    const events: Array<{ value: number; at: { x: number } }> = [];
    const collector = new Collector<number>({ onCollect: (e) => events.push(e as never) });
    const coin = fakePickup(2, 0);
    collector.add(coin, 10);

    expect(collector.sweep({ x: 8, y: 0.8, z: 0 })).toBe(0); // far away
    expect(collector.sweep({ x: 2.3, y: 0.8, z: 0 })).toBe(1); // inside radius+reach
    expect(coin.state).toBe('gone');
    expect(collector.sweep({ x: 2.3, y: 0.8, z: 0 })).toBe(0); // the prop refuses twice
    expect(collector.collected).toBe(1);
    expect(events).toEqual([{ value: 10, at: { x: 2, y: 0.8, z: 0 } }]);
  });

  it('respawns on gameplay time — the loot comes back when the clock says', () => {
    const collector = new Collector({ respawnAfter: 5 });
    const coin = fakePickup(0, 0);
    collector.add(coin);
    collector.sweep({ x: 0, y: 0.8, z: 0 });
    expect(coin.state).toBe('gone');
    collector.update(4.9);
    expect(coin.state).toBe('gone'); // not yet
    collector.update(0.2);
    expect(coin.state).toBe('idle'); // and it can be taken again
    expect(collector.sweep({ x: 0, y: 0.8, z: 0 })).toBe(1);
    expect(collector.collected).toBe(2);
  });

  it('a whole field registers per index, with values mapped', () => {
    const field = fakeField([[0, 0], [3, 0], [6, 0]]);
    const values: number[] = [];
    const collector = new Collector<number>({
      respawnAfter: 2,
      onCollect: (e) => values.push(e.value),
    });
    collector.addField(field, (index) => (index + 1) * 10);

    collector.sweep({ x: 3, y: 0.8, z: 0 });
    expect(field.active).toEqual([true, false, true]);
    expect(values).toEqual([20]);
    collector.update(2.1);
    expect(field.active).toEqual([true, true, true]);
  });

  it('one sweep can take several; NaN time is refused quietly', () => {
    const collector = new Collector();
    collector.add(fakePickup(0, 0));
    collector.add(fakePickup(0.4, 0));
    expect(collector.sweep({ x: 0.2, y: 0.8, z: 0 })).toBe(2);
    collector.update(NaN); // must not corrupt the clock
    expect(collector.collected).toBe(2);
  });
});

describe('CheckpointRun', () => {
  const gates = (states: string[][]) =>
    [0, 1, 2].map((i) => ({
      trigger: { center: { x: i * 10, y: 0, z: 0 }, radius: 2 },
      setState: (s: string) => states[i].push(s),
    }));

  it('ORDER IS THE POINT: only the next checkpoint counts', () => {
    const states: string[][] = [[], [], []];
    const run = new CheckpointRun(gates(states));
    expect(states.map((s) => s[s.length - 1])).toEqual(['active', 'upcoming', 'upcoming']);

    expect(run.test({ x: 20, y: 0, z: 0 })).toBe(false); // gate 2 while 0 is next: ignored
    expect(run.index).toBe(0);
    expect(run.test({ x: 0, y: 5, z: 0 })).toBe(true); // planar — height under the arch is fine
    expect(run.index).toBe(1);
    expect(states[0][states[0].length - 1]).toBe('passed');
    expect(states[1][states[1].length - 1]).toBe('active');
  });

  it('laps wrap, events fire in order, finish fires once', () => {
    const log: string[] = [];
    const run = new CheckpointRun(
      [
        { center: { x: 0, y: 0, z: 0 }, radius: 2 }, // bare circles work too
        { center: { x: 10, y: 0, z: 0 }, radius: 2 },
      ],
      {
        laps: 2,
        onAdvance: (i, lap) => log.push(`cp${i}@${lap}`),
        onLap: (lap) => log.push(`lap${lap}`),
        onFinish: () => log.push('finish'),
      }
    );
    const drive = () => {
      run.test({ x: 0, y: 0, z: 0 });
      run.test({ x: 10, y: 0, z: 0 });
    };
    drive();
    expect(run.lap).toBe(2);
    expect(run.progress).toBeCloseTo(0.5);
    drive();
    expect(run.finished).toBe(true);
    expect(run.progress).toBe(1);
    expect(log).toEqual(['cp0@1', 'cp1@1', 'lap1', 'cp0@2', 'cp1@2', 'lap2', 'finish']);
    // Finished means done: nothing more fires.
    expect(run.test({ x: 0, y: 0, z: 0 })).toBe(false);
    expect(log.length).toBe(7);
  });

  it('reset repaints the lights and starts the run over', () => {
    const states: string[][] = [[], [], []];
    const run = new CheckpointRun(gates(states), { onFinish: vi.fn() });
    run.test({ x: 0, y: 0, z: 0 });
    run.reset();
    expect(run.index).toBe(0);
    expect(run.lap).toBe(1);
    expect(run.finished).toBe(false);
    expect(states.map((s) => s[s.length - 1])).toEqual(['active', 'upcoming', 'upcoming']);
    expect(() => new CheckpointRun([])).toThrow(/no checkpoints/);
  });
});
