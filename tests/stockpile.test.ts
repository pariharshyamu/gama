import { describe, expect, it, vi } from 'vitest';
import { Stockpile, type StockChange } from '../src/gameplay/Stockpile';

describe('Stockpile', () => {
  it('adds, removes, and reports counts and totals', () => {
    const s = new Stockpile({ initial: { wood: 2 } });
    expect(s.count('wood')).toBe(2);
    expect(s.count('ore')).toBe(0); // never stocked
    expect(s.add('wood')).toBe(3);
    expect(s.add('ore', 5)).toBe(5);
    expect(s.total).toBe(8);
    expect(s.remove('wood', 10)).toBe(0); // clamps at zero
    expect(s.entries()).toEqual(expect.arrayContaining([['wood', 0], ['ore', 5]]));
  });

  it('emits change with the delta on every count change, and nothing on no-op', () => {
    const s = new Stockpile();
    const changes: StockChange[] = [];
    s.events.on('change', (c) => changes.push(c));
    s.add('wood', 3);
    s.remove('wood', 1);
    s.remove('stone', 1); // already 0 → clamps to 0, no change
    expect(changes).toEqual([
      { resource: 'wood', count: 3, delta: 3 },
      { resource: 'wood', count: 2, delta: -1 },
    ]);
  });

  it('spend only succeeds when affordable, and deducts exactly then', () => {
    const s = new Stockpile({ initial: { wood: 3 } });
    expect(s.spend('wood', 5)).toBe(false); // not enough
    expect(s.count('wood')).toBe(3); // untouched
    expect(s.spend('wood', 2)).toBe(true);
    expect(s.count('wood')).toBe(1);
  });

  it('clamps at capacity and fires full', () => {
    const s = new Stockpile({ capacity: 4 });
    const full = vi.fn();
    s.events.on('full', full);
    expect(s.add('wood', 10)).toBe(4); // clamped
    expect(full).toHaveBeenCalledWith({ resource: 'wood', count: 4, delta: 4 });
  });
});
