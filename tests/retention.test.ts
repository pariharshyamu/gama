import { describe, expect, it, vi } from 'vitest';
import {
  GameFlow,
  Ghost,
  GhostRecorder,
  GhostTape,
  Objectives,
  SaveSlot,
  type StorageLike,
} from '../src';

describe('GameFlow', () => {
  it('legal moves move, illegal moves are refused, gate() is the pause', () => {
    const entered: string[] = [];
    const flow = new GameFlow({
      onEnter: { playing: () => entered.push('playing'), results: () => entered.push('results') },
    });
    expect(flow.state).toBe('title');
    expect(flow.gate(0.016)).toBe(0); // the title screen holds time still

    expect(flow.to('results')).toBe(false); // no skipping to the end
    expect(flow.to('playing')).toBe(true);
    expect(flow.gate(0.016)).toBeCloseTo(0.016);

    flow.togglePause();
    expect(flow.state).toBe('paused');
    expect(flow.gate(0.016)).toBe(0);
    flow.togglePause();
    expect(flow.to('results')).toBe(true);
    expect(flow.togglePause()).toBe(false); // results is not pausable
    expect(entered).toEqual(['playing', 'playing', 'results']);
    expect(flow.gate(NaN)).toBe(0);
  });
});

describe('Objectives', () => {
  it('progress clamps, completion fires once, all-complete fires at the end', () => {
    const onComplete = vi.fn();
    const onAll = vi.fn();
    const goals = new Objectives(
      [
        { id: 'coins', label: 'Collect coins', target: 3 },
        { id: 'gate', label: 'Open the gate' },
      ],
      { onComplete, onAllComplete: onAll }
    );
    goals.advance('coins', 2);
    expect(goals.get('coins')!.progress).toBe(2);
    goals.advance('coins', 5); // clamped at target
    expect(goals.get('coins')!.done).toBe(true);
    goals.advance('coins'); // done goals ignore more progress
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onAll).not.toHaveBeenCalled();

    goals.finish('gate');
    expect(onAll).toHaveBeenCalledTimes(1);
    expect(goals.complete).toBe(true);
    expect(goals.summary()).toContain('✓ Collect coins 3/3');

    goals.reset();
    expect(goals.complete).toBe(false);
    expect(goals.get('coins')!.progress).toBe(0);
    expect(() => new Objectives([])).toThrow(/nothing/);
  });
});

describe('SaveSlot', () => {
  const fakeStorage = (): StorageLike & { map: Map<string, string> } => {
    const map = new Map<string, string>();
    return {
      map,
      getItem: (k) => map.get(k) ?? null,
      setItem: (k, v) => void map.set(k, v),
      removeItem: (k) => void map.delete(k),
    };
  };

  it('round-trips, and null MEANS null: absent, corrupt, or old version', () => {
    const storage = fakeStorage();
    const slot = new SaveSlot<{ seed: number; best: number }>('trial', { storage, version: 2 });
    expect(slot.load()).toBeNull();
    expect(slot.exists).toBe(false);

    slot.save({ seed: 7, best: 41.3 });
    expect(slot.load()).toEqual({ seed: 7, best: 41.3 });
    expect(slot.savedAt()).toBeGreaterThan(0);

    storage.map.set('gama:trial', '{not json');
    expect(slot.load()).toBeNull(); // corruption is "no save", not a crash

    slot.save({ seed: 7, best: 41.3 });
    const older = new SaveSlot<{ seed: number }>('trial', { storage, version: 1 });
    expect(older.load()).toBeNull(); // version mismatch loads as nothing

    slot.save({ seed: 9, best: 40 });
    slot.clear();
    expect(slot.exists).toBe(false);
  });
});

describe('Ghosts', () => {
  it('records at its own interval, whatever the frame rate does', () => {
    const recorder = new GhostRecorder({ sampleEvery: 0.1 });
    // Feed one second of erratic frames while moving along +x.
    let t = 0;
    const frames = [0.016, 0.05, 0.2, 0.016, 0.016, 0.3, 0.1, 0.15, 0.05, 0.087];
    for (const dt of frames) {
      t += dt;
      recorder.record({ x: t, y: 0, z: 0 }, 0, dt);
    }
    // First call + one per 0.1 s of accumulated time.
    expect(recorder.recording).toBe(1 + Math.floor(frames.reduce((a, b) => a + b, 0) / 0.1));
    const tape = recorder.finish();
    expect(tape.duration).toBeCloseTo((tape.count - 1) * 0.1, 6);
    expect(recorder.recording).toBe(0); // finish() reset it
  });

  it('plays back interpolated, clamps at the ends, survives JSON', () => {
    const tape = new GhostTape(0.5, Float32Array.from([
      0, 0, 0, 0,        // t = 0.0 at origin
      1, 0, 0, 1,        // t = 0.5 at x=1, yaw 1
      1, 0, 2, 1,        // t = 1.0 at z=2
    ]));
    const ghost = new Ghost(tape);
    expect(ghost.duration).toBeCloseTo(1);
    expect(ghost.at(0.25).position.x).toBeCloseTo(0.5); // halfway to the first mark
    expect(ghost.at(0.25).yaw).toBeCloseTo(0.5);
    expect(ghost.at(0.75).position.z).toBeCloseTo(1);
    expect(ghost.at(99).position.z).toBeCloseTo(2); // clamped at the end
    expect(ghost.done(1.01)).toBe(true);
    expect(ghost.at(-5).position.x).toBeCloseTo(0); // and the start

    const revived = new Ghost(GhostTape.fromJSON(JSON.parse(JSON.stringify(tape.toJSON()))));
    expect(revived.at(0.25).position.x).toBeCloseTo(0.5);
    // A torn tail (partial sample) is dropped, not interpolated.
    const torn = GhostTape.fromJSON({ interval: 0.5, samples: [0, 0, 0, 0, 1, 0] });
    expect(torn.count).toBe(1);
  });

  it('yaw takes the short way around ±π — no pirouettes at the seam', () => {
    const tape = new GhostTape(1, Float32Array.from([
      0, 0, 0, 3.0,      // just under +π
      0, 0, 0, -3.0,     // just over −π: the short way is THROUGH π
    ]));
    const ghost = new Ghost(tape);
    const mid = ghost.at(0.5).yaw;
    // Halfway the short way from 3.0 rad: 3.0 + 0.1416… ≈ π.
    expect(Math.abs(Math.abs(mid) - Math.PI)).toBeLessThan(0.01);
  });

  it('a tape in a save slot is the whole retention loop, in kilobytes', () => {
    const storage = new Map<string, string>();
    const slot = new SaveSlot<{ seed: number; best: GhostTapeJSONish }>('run', {
      storage: {
        getItem: (k) => storage.get(k) ?? null,
        setItem: (k, v) => void storage.set(k, v),
        removeItem: (k) => void storage.delete(k),
      },
    });
    const recorder = new GhostRecorder({ sampleEvery: 0.05 });
    for (let i = 0; i < 120; i++) {
      recorder.record({ x: i * 0.1, y: 0, z: Math.sin(i * 0.1) }, i * 0.02, 1 / 60);
    }
    slot.save({ seed: 7, best: recorder.finish().toJSON() });
    const loaded = slot.load()!;
    const ghost = new Ghost(GhostTape.fromJSON(loaded.best));
    expect(ghost.duration).toBeGreaterThan(1);
    expect(storage.get('gama:run')!.length).toBeLessThan(6000); // kilobytes, literally
  });
});

type GhostTapeJSONish = { interval: number; samples: number[] };
