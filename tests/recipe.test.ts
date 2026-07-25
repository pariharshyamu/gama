import { describe, expect, it } from 'vitest';
import { Recipe, Stockpile, type RecipeStep } from '../src';

const STEW: RecipeStep[] = [
  { id: 'chop', station: 'board', takes: { onion: 1, carrot: 2 }, makes: 'mirepoix' },
  { id: 'brown', station: 'stove', takes: { meat: 1 }, makes: 'browned' },
  {
    id: 'simmer',
    station: 'stove',
    needs: ['chop', 'brown'],
    takes: { mirepoix: 1, browned: 1, stock: 1 },
    makes: 'stew',
    seconds: 30,
  },
];

const stew = (): Recipe => new Recipe({ name: 'stew', steps: STEW });

/** A pantry with everything the recipe's leaves need. */
const stocked = (): Stockpile =>
  new Stockpile({ initial: { onion: 2, carrot: 4, meat: 1, stock: 1 } });

const ids = (steps: RecipeStep[]): string[] => steps.map((s) => s.id).sort();

describe('Recipe — the graph', () => {
  it('READY IS COMPUTED, not stored', () => {
    // The whole difference between a dependency graph and a checklist:
    // putting an onion on the counter unblocks a step nobody touched, and
    // taking it away re-blocks it, with nothing having been told.
    const r = stew();
    const pantry = new Stockpile();
    expect(r.ready(pantry)).toEqual([]);

    pantry.add('meat', 1);
    expect(ids(r.ready(pantry))).toEqual(['brown']);

    pantry.add('onion', 1);
    expect(ids(r.ready(pantry)), 'one carrot short and it said go').toEqual(['brown']);
    pantry.add('carrot', 2);
    expect(ids(r.ready(pantry))).toEqual(['brown', 'chop']);

    pantry.remove('onion', 1);
    expect(ids(r.ready(pantry)), 'it did not notice the onion leaving').toEqual(['brown']);
  });

  it('a step waits for its dependencies however full the pantry is', () => {
    const r = stew();
    const pantry = new Stockpile({ initial: { onion: 9, carrot: 9, meat: 9, stock: 9, mirepoix: 9, browned: 9 } });
    expect(ids(r.ready(pantry))).toEqual(['brown', 'chop']);
    const simmer = r.status(pantry).find((s) => s.id === 'simmer')!;
    expect(simmer.state).toBe('blocked');
    expect(simmer.waitingOn.sort()).toEqual(['brown', 'chop']);
    expect(simmer.short).toEqual({});
  });

  it('finishing the dependencies opens the next step', () => {
    const r = stew();
    const pantry = stocked();
    expect(r.begin('chop', 'cook', pantry)).toBe(true);
    expect(r.finish('chop', pantry)).toBe(true);
    expect(pantry.count('mirepoix')).toBe(1);
    expect(ids(r.ready(pantry)), 'simmer with no browned meat').toEqual(['brown']);

    r.begin('brown', 'cook', pantry);
    r.finish('brown', pantry);
    expect(ids(r.ready(pantry))).toEqual(['simmer']);
    expect(r.progress).toBeCloseTo(2 / 3, 5);
  });

  it('reports progress and completes exactly once', () => {
    const r = stew();
    const pantry = stocked();
    let completed = 0;
    r.events.on('complete', () => (completed += 1));
    expect(r.progress).toBe(0);
    for (const id of ['chop', 'brown', 'simmer']) {
      r.begin(id, 'cook', pantry);
      r.finish(id, pantry);
    }
    expect(r.complete).toBe(true);
    expect(r.progress).toBe(1);
    expect(pantry.count('stew')).toBe(1);
    expect(completed).toBe(1);
    // Finishing a done step changes nothing.
    expect(r.finish('simmer', pantry)).toBe(false);
    expect(completed).toBe(1);
  });
});

describe('Recipe — INPUTS GO AT BEGIN', () => {
  it('so two cooks cannot both start the same step with one onion', () => {
    // The bug that only shows up when a second agent exists — which is to
    // say in the demo, not in the tests, unless there is this test.
    const r = new Recipe({ steps: [{ id: 'chop', takes: { onion: 1 }, makes: 'chopped' }] });
    const pantry = new Stockpile({ initial: { onion: 1 } });
    expect(r.begin('chop', 'alice', pantry)).toBe(true);
    expect(pantry.count('onion'), 'the onion was still there').toBe(0);
    expect(r.begin('chop', 'bob', pantry), 'bob took the same step').toBe(false);
    expect(r.claimant('chop')).toBe('alice');
  });

  it('two cooks CAN work different steps at once', () => {
    const r = stew();
    const pantry = stocked();
    expect(r.begin('chop', 'alice', pantry)).toBe(true);
    expect(r.begin('brown', 'bob', pantry)).toBe(true);
    expect(ids(r.workOf('alice'))).toEqual(['chop']);
    expect(ids(r.workOf('bob'))).toEqual(['brown']);
    expect(r.workOf('carol')).toEqual([]);
  });

  it('will not begin a step it cannot afford, and takes nothing when it refuses', () => {
    const r = stew();
    const pantry = new Stockpile({ initial: { onion: 1, carrot: 1 } });
    expect(r.begin('chop', 'cook', pantry)).toBe(false);
    expect(pantry.count('onion')).toBe(1);
    expect(pantry.count('carrot')).toBe(1);
  });

  it('abandoning LOSES the inputs, unless you asked otherwise', () => {
    // A half-chopped onion is not an onion.
    const r = stew();
    const pantry = stocked();
    r.begin('chop', 'cook', pantry);
    expect(pantry.count('onion')).toBe(1);
    expect(r.abandon('chop', pantry)).toBe(true);
    expect(pantry.count('onion'), 'it gave the onion back').toBe(1);
    expect(r.claimant('chop')).toBeNull();
    // …and it is available again, for whoever has the ingredients.
    expect(ids(r.ready(pantry))).toEqual(['brown', 'chop']);

    const kind = new Recipe({ name: 's', steps: STEW, refundOnAbandon: true });
    const p2 = stocked();
    kind.begin('chop', 'cook', p2);
    expect(p2.count('onion')).toBe(1);
    kind.abandon('chop', p2);
    expect(p2.count('onion')).toBe(2);
  });

  it('emits begin, finish and abandon', () => {
    const r = stew();
    const pantry = stocked();
    const log: string[] = [];
    r.events.on('begin', ({ id, by }) => log.push(`begin ${id} ${by}`));
    r.events.on('finish', ({ id, makes, count }) => log.push(`finish ${id} ${makes} x${count}`));
    r.events.on('abandon', ({ id }) => log.push(`abandon ${id}`));
    r.begin('chop', 'alice', pantry);
    r.abandon('chop', pantry);
    r.begin('brown', 'bob', pantry);
    r.finish('brown', pantry);
    expect(log).toEqual([
      'begin chop alice',
      'abandon chop',
      'begin brown bob',
      'finish brown browned x1',
    ]);
  });
});

describe('Recipe — the shopping list', () => {
  it('asks only for what nothing in the recipe can make', () => {
    // Leaving out the "no step makes it" test turns the list into a demand
    // for the stew you are trying to cook.
    const r = stew();
    const empty = new Stockpile();
    const list = r.missing(empty);
    expect(list).toEqual({ onion: 1, carrot: 2, meat: 1, stock: 1 });
    expect(list.mirepoix).toBeUndefined();
    expect(list.browned).toBeUndefined();
    expect(list.stew).toBeUndefined();
  });

  it('shrinks as the pantry fills, and empties when it is all there', () => {
    const r = stew();
    expect(r.missing(new Stockpile({ initial: { onion: 1, carrot: 1 } })))
      .toEqual({ carrot: 1, meat: 1, stock: 1 });
    expect(r.missing(stocked())).toEqual({});
  });

  it('stops asking for things whose step is already done', () => {
    const r = stew();
    const pantry = stocked();
    r.begin('chop', 'cook', pantry);
    r.finish('chop', pantry);
    // The onions and carrots are chopped; nobody needs to fetch more.
    const list = r.missing(new Stockpile());
    expect(list.onion).toBeUndefined();
    expect(list.carrot).toBeUndefined();
    expect(list.meat).toBe(1);
  });

  it('and this is how an agent decides what to do at all', () => {
    // ready() first; if nothing is ready, missing() says where to go.
    const r = stew();
    const pantry = new Stockpile({ initial: { stock: 1 } });
    expect(r.ready(pantry)).toEqual([]);
    expect(Object.keys(r.missing(pantry)).sort()).toEqual(['carrot', 'meat', 'onion']);
    for (const [resource, n] of Object.entries(r.missing(pantry))) pantry.add(resource, n);
    expect(r.ready(pantry).length).toBeGreaterThan(0);
    expect(r.missing(pantry)).toEqual({});
  });
});

describe('Recipe — timing', () => {
  it('runs its own clocks when asked to', () => {
    const r = stew();
    const pantry = stocked();
    r.begin('chop', 'cook', pantry);
    r.begin('brown', 'cook', pantry);
    // Neither has a duration, so the clock leaves them alone.
    for (let i = 0; i < 60 * 5; i++) r.update(1 / 60, pantry);
    expect(r.done).toBe(0);
    r.finish('chop', pantry);
    r.finish('brown', pantry);

    r.begin('simmer', 'cook', pantry);
    for (let i = 0; i < 60 * 10; i++) r.update(1 / 60, pantry);
    const running = r.status(pantry).find((s) => s.id === 'simmer')!;
    expect(running.state).toBe('running');
    expect(running.progress).toBeGreaterThan(0.3);
    expect(running.progress).toBeLessThan(0.4);
    for (let i = 0; i < 60 * 25; i++) r.update(1 / 60, pantry);
    expect(r.complete).toBe(true);
    expect(pantry.count('stew')).toBe(1);
  });

  it('a recipe driven by a work station never calls update at all', () => {
    // The other half of the contract: SCENA's WorkStation.onYield calls
    // finish, and the recipe times nothing.
    const r = stew();
    const pantry = stocked();
    r.begin('chop', 'cook', pantry);
    r.finish('chop', pantry);
    expect(r.done).toBe(1);
  });

  it('resets', () => {
    const r = stew();
    const pantry = stocked();
    r.begin('chop', 'cook', pantry);
    r.finish('chop', pantry);
    r.reset();
    expect(r.done).toBe(0);
    expect(r.progress).toBe(0);
    expect(r.claimant('chop')).toBeNull();
  });
});

describe('Recipe — refuses to be built wrong', () => {
  it('REJECTS A CYCLE, at construction', () => {
    // A cycle is not a recipe that runs badly. `ready` returns an empty list
    // forever and `progress` sticks, which looks exactly like an agent that
    // has decided to stand still — and is very hard to find from there.
    expect(() => new Recipe({
      name: 'ouroboros',
      steps: [
        { id: 'a', needs: ['c'] },
        { id: 'b', needs: ['a'] },
        { id: 'c', needs: ['b'] },
      ],
    })).toThrow(/cycle/i);

    // Including the shortest one.
    expect(() => new Recipe({ steps: [{ id: 'a', needs: ['a'] }] })).toThrow(/cycle/i);
  });

  it('rejects a dependency that does not exist', () => {
    // Otherwise it blocks that step forever, silently.
    expect(() => new Recipe({ steps: [{ id: 'a', needs: ['ghost'] }] }))
      .toThrow(/does not exist/);
  });

  it('rejects two steps with the same id', () => {
    expect(() => new Recipe({ steps: [{ id: 'a' }, { id: 'a' }] })).toThrow(/two steps/);
  });

  it('a diamond is fine — it is a graph, not a list', () => {
    const r = new Recipe({
      steps: [
        { id: 'root' },
        { id: 'left', needs: ['root'] },
        { id: 'right', needs: ['root'] },
        { id: 'join', needs: ['left', 'right'] },
      ],
    });
    expect(ids(r.ready())).toEqual(['root']);
    r.begin('root');
    r.finish('root');
    expect(ids(r.ready())).toEqual(['left', 'right']);
    r.begin('left');
    r.finish('left');
    expect(ids(r.ready()), 'join went early').toEqual(['right']);
    r.begin('right');
    r.finish('right');
    expect(ids(r.ready())).toEqual(['join']);
  });

  it('works with no pantry at all, for a recipe that is pure sequencing', () => {
    const r = new Recipe({ steps: [{ id: 'a' }, { id: 'b', needs: ['a'] }] });
    expect(ids(r.ready())).toEqual(['a']);
    r.begin('a');
    r.finish('a');
    expect(ids(r.ready())).toEqual(['b']);
    expect(r.missing()).toEqual({});
  });
});

describe('Recipe — the SCENA handshake, without importing SCENA', () => {
  /**
   * A stand-in with the exact shape of a SCENA `WorkStation`: an action, a
   * progress, and `onYield` fired once per cycle. Structural, like every
   * other handshake in the trilogy — if this drives a recipe, the real one
   * does too, and neither library learns about the other.
   */
  const fakeStation = (cycle: number) => {
    let phase = 0;
    let total = 0;
    const api = {
      action: 'chop',
      progress: 0,
      onYield: undefined as ((n: number) => void) | undefined,
      update(dt: number, working = true) {
        if (!working) return;
        phase += dt / cycle;
        while (phase >= 1) {
          phase -= 1;
          total += 1;
          api.onYield?.(total);
        }
        api.progress = phase;
      },
    };
    return api;
  };

  it('a work station finishing a cycle is what finishes a step', () => {
    const r = new Recipe({
      steps: [{ id: 'chop', station: 'board', takes: { onion: 1 }, makes: 'diced' }],
    });
    const pantry = new Stockpile({ initial: { onion: 1 } });
    const board = fakeStation(2);

    const next = r.ready(pantry)[0];
    expect(next.station).toBe('board');
    r.begin(next.id, 'cook', pantry);
    board.onYield = () => r.finish('chop', pantry);

    for (let i = 0; i < 60 * 1.5; i++) board.update(1 / 60);
    expect(r.complete, 'it finished before the station did').toBe(false);
    for (let i = 0; i < 60; i++) board.update(1 / 60);
    expect(r.complete).toBe(true);
    expect(pantry.count('diced')).toBe(1);
    // The recipe timed nothing — the station did.
    expect(r.status()[0].progress).toBe(0);
  });

  it('AN INGREDIENT GOING OFF RE-BLOCKS A READY STEP', () => {
    // The payoff of the whole kitchen sequence: the cold store decides how
    // fast things spoil, spoiling takes them out of the pantry, and `ready`
    // recomputes. Nothing in the chain knows about any other part of it.
    const r = new Recipe({
      steps: [
        { id: 'chop', takes: { fish: 1 }, makes: 'fillet' },
        { id: 'cook', needs: ['chop'], takes: { fillet: 1 }, makes: 'supper' },
      ],
    });
    const pantry = new Stockpile({ initial: { fish: 1 } });
    expect(ids(r.ready(pantry))).toEqual(['chop']);

    // …the cook dawdled, and the fish went off.
    pantry.remove('fish', 1);
    expect(r.ready(pantry)).toEqual([]);
    expect(r.missing(pantry)).toEqual({ fish: 1 });
    // And the recipe says exactly what to go and get, without anybody
    // having written a rule about fish.
    pantry.add('fish', 1);
    expect(ids(r.ready(pantry))).toEqual(['chop']);
  });
});
