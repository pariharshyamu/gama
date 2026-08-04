import { describe, expect, it } from 'vitest';
import {
  Forager, bestRate, choose, depletingPatch, leaveWhen, longRunRate,
  marginalRate, optimalStay, rank, rateOf,
} from '../src/ai/utility';
import type { UtilityAction } from '../src/ai/utility';

const DT = 1 / 60;

interface Ctx {
  distance: number;
  coins: number;
}
const ctx: Ctx = { distance: 12, coins: 30 };
const loot = { name: 'loot', value: (c: Ctx) => c.coins, seconds: () => 6 };
const sprint = { name: 'sprint', value: (c: Ctx) => c.distance, seconds: (c: Ctx) => c.distance / 6 };
const nap = { name: 'nap', value: () => 0, seconds: () => 30 };

/** Long-run rate of an agent that always leaves at a fixed time. */
const fixedRate = (amount: number, tau: number, travel: number, at: number): number =>
  depletingPatch(amount, tau).gain(at) / (travel + at);

/** Brute force: the best any fixed leaving time can manage. */
function sweep(amount: number, tau: number, travel: number): { at: number; rate: number } {
  let best = { at: 0, rate: 0 };
  for (let t = 0.05; t <= 300; t += 0.05) {
    const rate = fixedRate(amount, tau, travel, t);
    if (rate > best.rate) best = { at: t, rate };
  }
  return best;
}

function forage(
  amount: number, tau: number, travel: number, seconds = 4000, environmentRate?: number
): { rate: number; settled: number; visits: number } {
  const leaves: number[] = [];
  const f = new Forager(() => depletingPatch(amount, tau, travel), {
    environmentRate,
    onLeave: (e) => leaves.push(e.seconds),
  });
  for (let i = 0; i * DT < seconds; i++) f.update(DT);
  const tail = leaves.slice(Math.floor(leaves.length * 0.6));
  return {
    rate: f.rate,
    visits: f.visits,
    settled: tail.reduce((a, b) => a + b, 0) / Math.max(1, tail.length),
  };
}

describe('the utility has a unit', () => {
  it('is value over seconds and nothing else', () => {
    expect(rateOf(loot, ctx)).toBeCloseTo(5, 12);
    expect(rateOf(sprint, ctx)).toBeCloseTo(6, 12);
    expect(choose([loot, sprint, nap], ctx)?.name).toBe('sprint');
  });

  it('scores a free action zero rather than infinity', () => {
    // Infinity would beat everything for ever, which presents as an agent
    // standing still doing something instantaneous.
    expect(rateOf({ name: 'free', value: () => 5, seconds: () => 0 }, ctx)).toBe(0);
    expect(rateOf({ name: 'odd', value: () => 5, seconds: () => -1 }, ctx)).toBe(0);
  });

  it('drops unavailable actions instead of ranking them', () => {
    const locked = { name: 'locked', value: () => 1e6, seconds: () => 0.001, available: () => false };
    const ranked = rank([loot, sprint, locked], ctx);
    expect(ranked.map((r) => r.action.name)).toEqual(['sprint', 'loot']);
  });

  it('does not reorder when the units change', () => {
    // A rate is a ratio scale: pennies instead of pounds, minutes instead of
    // seconds. Same decision.
    const all: UtilityAction<Ctx>[] = [loot, sprint, nap];
    const scaled: UtilityAction<Ctx>[] = all.map((a) => ({
      name: a.name,
      value: (c: Ctx) => a.value(c) * 100,
      seconds: (c: Ctx) => a.seconds(c) / 60,
    }));
    const before = rank(all, ctx).map((r) => r.action.name);
    const after = rank(scaled, ctx).map((r) => r.action.name);
    expect(after).toEqual(before);
  });

  it('keeps ties in their declared order, so an agent cannot dither', () => {
    const twins = [
      { name: 'a', value: () => 1, seconds: () => 1 },
      { name: 'b', value: () => 1, seconds: () => 1 },
    ];
    for (let i = 0; i < 20; i++) expect(choose(twins, ctx)?.name).toBe('a');
  });

  it('returns null when there is nothing to do', () => {
    expect(choose([], ctx)).toBeNull();
    expect(choose([{ ...nap, available: () => false }], ctx)).toBeNull();
  });
});

describe('Charnov’s theorem, solved', () => {
  it('lands where an exhaustive sweep lands', () => {
    // A root of g′(t)(T+t) − g(t), against a search over 6000 leaving times.
    // Two different computations; they have to agree.
    for (const [amount, tau, travel] of [[10, 5, 2], [10, 5, 30], [40, 12, 5], [5, 2, 1]]) {
      const star = optimalStay(depletingPatch(amount, tau, travel), travel);
      expect(star, `travel ${travel}`).toBeCloseTo(sweep(amount, tau, travel).at, 1);
    }
  });

  it('makes the marginal rate at the exit equal the rate of the whole cycle', () => {
    const patch = depletingPatch(10, 5, 4);
    const star = optimalStay(patch, 4);
    expect(marginalRate(patch, star)).toBeCloseTo(longRunRate(patch, star, 4), 4);
  });

  it('agrees with the sweep about the rate, not only the moment', () => {
    const brute = sweep(10, 5, 6);
    expect(bestRate(depletingPatch(10, 5, 6), 6)).toBeCloseTo(brute.rate, 3);
  });

  it('has nothing to say about a patch that never depletes', () => {
    expect(optimalStay({ gain: (t) => 2 * t }, 3)).toBe(Infinity);
    expect(leaveWhen({ gain: (t) => 2 * t }, 1)).toBe(Infinity);
  });

  it('leaves a worthless patch at once', () => {
    expect(optimalStay({ gain: () => 0 }, 1)).toBeCloseTo(0, 9);
    expect(leaveWhen(depletingPatch(10, 5), 1e9)).toBe(0);
  });

  it('never waits for an environment that pays nothing', () => {
    expect(leaveWhen(depletingPatch(10, 5), 0)).toBe(Infinity);
  });
});

describe('the forager', () => {
  it('matches an exhaustive search it was never shown', () => {
    for (const [amount, tau, travel] of [[10, 5, 2], [10, 5, 30], [100, 30, 20]]) {
      const brute = sweep(amount, tau, travel);
      const run = forage(amount, tau, travel);
      expect(run.rate, `travel ${travel}`).toBeGreaterThanOrEqual(brute.rate * 0.99);
      // ...and cannot beat it, because the sweep is optimal by construction.
      expect(run.rate, `travel ${travel}`).toBeLessThanOrEqual(brute.rate * 1.001);
    }
  });

  it('stays LONGER when travel is longer — Charnov’s first prediction', () => {
    const times = [0.5, 2, 5, 15, 40].map((travel) => forage(10, 5, travel, 6000).settled);
    for (let i = 1; i < times.length; i++) expect(times[i]).toBeGreaterThan(times[i - 1]);
  });

  it('leaves SOONER when the world is richer — the counter-intuitive one', () => {
    // The patch is identical every time. Only what is on offer elsewhere moves.
    const times = [0.2, 0.5, 1.0, 1.5].map((rate) => forage(10, 5, 3, 4000, rate).settled);
    for (let i = 1; i < times.length; i++) expect(times[i]).toBeLessThan(times[i - 1]);
  });

  it('leaves exactly where the theorem says, when told the rate', () => {
    const patch = depletingPatch(10, 5, 3);
    for (const rate of [0.2, 0.5, 1.0]) {
      expect(forage(10, 5, 3, 4000, rate).settled, `rate ${rate}`).toBeCloseTo(leaveWhen(patch, rate), 1);
    }
  });

  it('counts travel as time lived, or it overstays everywhere', () => {
    const f = new Forager(() => depletingPatch(10, 5, 8));
    for (let i = 0; i < 120; i++) f.update(DT);
    expect(f.phase).toBe('travelling');
    expect(f.elapsed).toBeCloseTo(2, 6);
    expect(f.harvest).toBe(0);
  });

  it('does not throw away the overshoot when it arrives mid-frame', () => {
    const f = new Forager(() => depletingPatch(10, 5, 0.1));
    f.update(0.25);
    expect(f.phase).toBe('foraging');
    expect(f.inPatch).toBeCloseTo(0.15, 9);
    expect(f.harvest).toBeGreaterThan(0);
  });

  it('survives having nowhere to go', () => {
    const idle = new Forager(() => null);
    for (let i = 0; i < 100; i++) idle.update(DT);
    expect(idle.harvest).toBe(0);
    expect(idle.visits).toBe(0);
    expect(idle.rate).toBe(0);
  });

  it('survives a zero and a negative step', () => {
    const f = new Forager(() => depletingPatch(10, 5, 1));
    f.update(0);
    f.update(-1);
    expect(f.elapsed).toBe(0);
    expect(Number.isFinite(f.rate)).toBe(true);
  });

  it('reports every departure with what it got and how long it took', () => {
    const seen: { gained: number; seconds: number; rate: number }[] = [];
    const f = new Forager(() => depletingPatch(10, 5, 2), { onLeave: (e) => seen.push(e) });
    for (let i = 0; i * DT < 200; i++) f.update(DT);
    expect(seen.length).toBe(f.visits);
    expect(seen.length).toBeGreaterThan(5);
    for (const e of seen) {
      expect(e.gained).toBeGreaterThan(0);
      expect(e.rate).toBeCloseTo(e.gained / e.seconds, 9);
    }
  });

  it('holds still until it has enough experience to average', () => {
    const patient = new Forager(() => depletingPatch(10, 5, 1), { settle: 50 });
    for (let i = 0; i * DT < 40; i++) patient.update(DT);
    expect(patient.visits).toBe(0);
  });
});
