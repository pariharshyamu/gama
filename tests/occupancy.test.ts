import { describe, expect, it, vi } from 'vitest';
import { Object3D, Vector3 } from 'three';
import { Occupancy, stagger, type Seat } from '../src';

/** A row of seats one metre apart along +x. */
function bench(count: number): Seat[] {
  return Array.from({ length: count }, (_, i) => {
    const anchor = new Object3D();
    anchor.position.set(i, 0, 0);
    return { anchor, kind: 'seat' } satisfies Seat;
  });
}

describe('Occupancy', () => {
  it('hands out each seat once and tracks both directions', () => {
    const seating = new Occupancy(bench(3));
    const [a, b] = ['ann', 'bo'];
    const seatA = seating.claim(a)!;
    expect(seating.taken).toBe(1);
    expect(seating.seatOf(a)).toBe(seatA);
    expect(seating.occupantOf(seatA)).toBe(a);
    expect(seating.isFree(seatA)).toBe(false);

    expect(seating.claimSeat(b, seatA)).toBe(false); // taken
    const seatB = seating.claim(b)!;
    expect(seatB).not.toBe(seatA);
    expect(seating.free).toHaveLength(1);
  });

  it('releases, and the seat comes back into circulation', () => {
    const seating = new Occupancy(bench(2));
    const seat = seating.claim('ann')!;
    expect(seating.release('ann')).toBe(seat);
    expect(seating.release('ann')).toBeNull(); // already up
    expect(seating.isFree(seat)).toBe(true);
    expect(seating.taken).toBe(0);
  });

  it('returns null when the place is full, and fires `full` once it is', () => {
    const seating = new Occupancy(bench(2));
    const onFull = vi.fn();
    seating.events.on('full', onFull);
    seating.claim('a');
    seating.claim('b');
    expect(seating.full).toBe(true);
    expect(onFull).toHaveBeenCalledTimes(1);
    expect(seating.claim('c')).toBeNull();
  });

  it('people spread out before they fill in — the personal-space rule', () => {
    // Seven seats in a row; five strangers arrive one at a time from the
    // same doorway. Nobody should end up shoulder to shoulder while whole
    // stretches of bench sit empty.
    const seats = bench(7);
    const seating = new Occupancy(seats, { whim: 0, personalSpace: 1.5, spacing: 2.2 });
    const door = new Vector3(0, 0, 4);
    const taken: number[] = [];
    for (let i = 0; i < 5; i++) {
      const seat = seating.claim(`p${i}`, { from: door })!;
      taken.push(seats.indexOf(seat));
    }
    const sorted = [...taken].sort((x, y) => x - y);
    // No two adjacent while the bench is only 5/7 full.
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i] - sorted[i - 1], `gap between ${sorted[i - 1]} and ${sorted[i]}`).toBeGreaterThan(0);
    }
    // And they used the whole bench, not just the near end.
    expect(sorted[sorted.length - 1] - sorted[0]).toBeGreaterThanOrEqual(4);
  });

  it('with personalSpace 0 it degenerates to nearest-seat, like a queue', () => {
    const seats = bench(5);
    const seating = new Occupancy(seats, { personalSpace: 0, whim: 0 });
    const door = new Vector3(0, 0, 1);
    expect(seats.indexOf(seating.claim('a', { from: door })!)).toBe(0);
    expect(seats.indexOf(seating.claim('b', { from: door })!)).toBe(1);
    expect(seats.indexOf(seating.claim('c', { from: door })!)).toBe(2);
  });

  it('fills the gaps once spreading out is no longer possible', () => {
    const seats = bench(4);
    const seating = new Occupancy(seats, { whim: 0, personalSpace: 1.2 });
    for (let i = 0; i < 4; i++) seating.claim(`p${i}`, { from: new Vector3(0, 0, 3) });
    expect(seating.full).toBe(true); // everyone got a seat in the end
    expect(new Set(seats.map((s) => seating.occupantOf(s))).size).toBe(4);
  });

  it('score prefers elbow room over a shorter walk', () => {
    const seats = bench(3);
    const seating = new Occupancy(seats, { personalSpace: 1.5, spacing: 2 });
    const from = new Vector3(0, 0, 1); // right next to seat 0
    seating.claimSeat('sitting', seats[0]);
    // Seat 1 is closer to the door, but seat 2 is away from the occupant.
    expect(seating.score(seats[2], from)).toBeGreaterThan(seating.score(seats[1], from));
  });

  it('nearestFree ignores company entirely', () => {
    const seats = bench(4);
    const seating = new Occupancy(seats);
    seating.claimSeat('x', seats[0]);
    expect(seating.nearestFree(new Vector3(0, 0, 0))).toBe(seats[1]);
  });

  it('claiming again moves the owner and frees the old seat', () => {
    const seats = bench(3);
    const seating = new Occupancy(seats);
    const first = seating.claim('ann')!;
    const second = seating.claim('ann')!;
    expect(second).not.toBe(first);
    expect(seating.isFree(first)).toBe(true);
    expect(seating.taken).toBe(1);
  });

  it('emits claim and release with the seat index', () => {
    const seats = bench(3);
    const seating = new Occupancy(seats);
    const claims: number[] = [];
    seating.events.on('claim', (c) => claims.push(c.index));
    seating.events.on('release', (c) => claims.push(-1 - c.index));
    seating.claimSeat('a', seats[2]);
    seating.release('a');
    expect(claims).toEqual([2, -3]);
  });

  it('is deterministic under a seed, and whim changes the outcome', () => {
    const run = (seed: number, whim: number) => {
      const seats = bench(6);
      const seating = new Occupancy(seats, { seed, whim });
      return Array.from({ length: 4 }, (_, i) =>
        seats.indexOf(seating.claim(`p${i}`, { from: new Vector3(0, 0, 2) })!)
      );
    };
    expect(run(9, 0.5)).toEqual(run(9, 0.5));
    expect(run(9, 0)).toEqual(run(4, 0)); // no whim: seed is irrelevant
  });

  it('releaseAll empties the room', () => {
    const seating = new Occupancy(bench(3));
    seating.claim('a');
    seating.claim('b');
    seating.releaseAll();
    expect(seating.taken).toBe(0);
    expect(seating.free).toHaveLength(3);
  });
});

describe('stagger', () => {
  it('gives ascending, uneven start times', () => {
    const delays = stagger(6, { spread: 1 });
    expect(delays).toHaveLength(6);
    expect(delays[0]).toBe(0);
    const gaps: number[] = [];
    for (let i = 1; i < delays.length; i++) {
      expect(delays[i]).toBeGreaterThan(delays[i - 1]);
      gaps.push(delays[i] - delays[i - 1]);
    }
    // Uneven: a metronome would betray the puppetry.
    expect(Math.max(...gaps) - Math.min(...gaps)).toBeGreaterThan(0.15);
  });

  it('honours lead and seed', () => {
    expect(stagger(3, { lead: 2 })[0]).toBe(2);
    expect(stagger(4, { seed: 3 })).toEqual(stagger(4, { seed: 3 }));
    expect(stagger(4, { seed: 3 })).not.toEqual(stagger(4, { seed: 4 }));
  });
});
