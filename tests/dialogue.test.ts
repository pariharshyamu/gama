import { describe, expect, it, vi } from 'vitest';
import { Dialogue } from '../src/dialogue/Dialogue';
import { defineDialogue, parseDialogue, DIALOGUE_VERSION } from '../src/dialogue/script';
import { lintDialogue } from '../src/dialogue/lint';
import { apply, evaluate } from '../src/dialogue/conditions';

/** A small negotiation: a gate, a counter, a locked option, a walk-away. */
const bridge = defineDialogue({
  version: DIALOGUE_VERSION,
  start: 'hail',
  vars: { coins: 0, toldName: false },
  nodes: {
    hail: {
      speaker: 'keeper',
      text: 'Toll for the bridge. Five coins.',
      choices: [
        { text: 'Here you are.', to: 'paid', if: { gte: ['coins', 5] }, do: [{ inc: ['coins', -5] }] },
        { text: '[You need 5 coins]', if: { gte: ['coins', 5] }, locked: true },
        { text: "Who's asking?", to: 'name', if: { not: { is: 'toldName' } } },
        { text: 'I will go around.', tag: 'leave' },
      ],
    },
    name: {
      speaker: 'keeper',
      text: 'The keeper. Same as yesterday.',
      do: [{ set: ['toldName', true] }],
      to: 'hail',
    },
    paid: {
      speaker: 'keeper',
      text: 'Mind the third plank.',
      do: [{ emit: 'crossed' }],
    },
  },
});

describe('conditions', () => {
  it('treats absent, false, zero and empty as untrue', () => {
    expect(evaluate({ is: 'x' }, {})).toBe(false);
    expect(evaluate({ is: 'x' }, { x: false })).toBe(false);
    expect(evaluate({ is: 'x' }, { x: 0 })).toBe(false);
    expect(evaluate({ is: 'x' }, { x: '' })).toBe(false);
    expect(evaluate({ is: 'x' }, { x: true })).toBe(true);
    expect(evaluate({ is: 'x' }, { x: 'yes' })).toBe(true);
  });

  it('counts a missing number as zero rather than NaN', () => {
    // So `{ gte: ['kills', 3] }` works before anything has been killed, and a
    // counter needs no declaration to be compared.
    expect(evaluate({ gte: ['kills', 3] }, {})).toBe(false);
    expect(evaluate({ lt: ['kills', 3] }, {})).toBe(true);
  });

  it('is false for an unregistered predicate rather than throwing', () => {
    // A missing predicate should cost one unavailable choice, not the whole
    // conversation mid-sentence. `lintDialogue` is where it gets shouted about.
    expect(evaluate({ pred: 'hasSeal' }, {})).toBe(false);
    expect(evaluate({ pred: 'hasSeal' }, {}, { hasSeal: () => true })).toBe(true);
  });

  it('applies effects in order, so an emit sees the increment', () => {
    const vars: Record<string, number | string | boolean> = { coins: 2 };
    const events = apply([{ inc: ['coins', 3] }, { emit: 'paid' }], vars);
    expect(vars.coins).toBe(5);
    expect(events).toEqual(['paid']);
  });

  it('empty all is true and empty any is false', () => {
    expect(evaluate({ all: [] }, {})).toBe(true);
    expect(evaluate({ any: [] }, {})).toBe(false);
  });
});

describe('Dialogue', () => {
  it('walks a line with no choices on advance', () => {
    const talk = new Dialogue(bridge, { vars: { coins: 9 } });
    talk.start('name');
    expect(talk.line?.text).toContain('The keeper');
    talk.advance();
    expect(talk.line?.id).toBe('hail');
    expect(talk.vars.toldName).toBe(true); // entering `name` set it
  });

  it('hides a failing choice but shows a locked one', () => {
    const poor = new Dialogue(bridge);
    const texts = poor.choices.length ? [] : null;
    poor.start();
    const shown = poor.choices.map((c) => ({ text: c.text, enabled: c.enabled }));
    expect(texts).toBeNull(); // nothing before start()
    // "Here you are" is hidden (condition fails, not locked); the locked hint
    // is shown disabled; the two unconditional ones are offered.
    expect(shown).toEqual([
      { text: '[You need 5 coins]', enabled: false },
      { text: "Who's asking?", enabled: true },
      { text: 'I will go around.', enabled: true },
    ]);
  });

  it('indexes choices as PRESENTED, not as authored', () => {
    // The bug this pins: resolving a player's index against the raw array
    // takes the wrong branch as soon as a condition filters anything. With no
    // coins, presented index 1 is "Who's asking?" — authored index 2.
    const talk = new Dialogue(bridge);
    talk.start();
    talk.choose(1);
    expect(talk.line?.id).toBe('name');
  });

  it('ignores a choice that is shown but disabled', () => {
    const talk = new Dialogue(bridge);
    talk.start();
    talk.choose(0); // the locked hint
    expect(talk.line?.id).toBe('hail');
    expect(talk.counts.choices).toBe(0);
  });

  it('runs a choice effect then the destination effect, and emits', () => {
    const events: string[] = [];
    const talk = new Dialogue(bridge, {
      vars: { coins: 7 },
      onEvent: (name, vars) => events.push(`${name}@${vars.coins}`),
    });
    talk.start();
    const pay = talk.choices.findIndex((c) => c.text === 'Here you are.');
    talk.choose(pay);
    expect(talk.vars.coins).toBe(2);
    expect(events).toEqual(['crossed@2']); // the emit saw the deduction
    expect(talk.done).toBe(false);
    talk.advance();
    expect(talk.done).toBe(true);
  });

  it('ends on a choice with no destination', () => {
    const onEnd = vi.fn();
    const talk = new Dialogue(bridge, { onEnd });
    talk.start();
    talk.choose(talk.choices.findIndex((c) => c.text === 'I will go around.'));
    expect(talk.done).toBe(true);
    expect(talk.line).toBeNull();
    expect(onEnd).toHaveBeenCalledOnce();
  });

  it('will not advance past an unanswered question', () => {
    // Silently skipping a decision is how a conversation loses its own content.
    const talk = new Dialogue(bridge);
    talk.start();
    talk.advance();
    expect(talk.line?.id).toBe('hail');
  });

  it('counts lines, choices and events exactly', () => {
    const talk = new Dialogue(bridge, { vars: { coins: 5 } });
    talk.start();
    talk.choose(talk.choices.findIndex((c) => c.text === "Who's asking?"));
    talk.advance(); // name -> hail
    talk.choose(talk.choices.findIndex((c) => c.text === 'Here you are.'));
    expect(talk.counts).toEqual({ lines: 4, choices: 2, events: 1 });
    expect(talk.visited('name')).toBe(true);
    expect(talk.visited('nowhere')).toBe(false);
  });

  it('saves and restores mid-conversation without re-firing effects', () => {
    const events: string[] = [];
    const first = new Dialogue(bridge, { vars: { coins: 6 }, onEvent: (n) => events.push(n) });
    first.start();
    first.choose(first.choices.findIndex((c) => c.text === 'Here you are.'));
    expect(events).toEqual(['crossed']);
    const saved = JSON.parse(JSON.stringify(first.toJSON()));

    const onLine = vi.fn();
    const later = new Dialogue(bridge, { onEvent: (n) => events.push(n), onLine });
    later.restore(saved);
    expect(later.line?.id).toBe('paid');
    expect(later.vars.coins).toBe(1);
    expect(onLine).toHaveBeenCalledOnce(); // the HUD gets to redraw
    expect(events).toEqual(['crossed']); // …and `crossed` did NOT fire twice
  });

  it('ends rather than hanging on a dangling link at play time', () => {
    const broken = defineDialogue({
      version: DIALOGUE_VERSION,
      start: 'a',
      nodes: { a: { text: 'off we go', to: 'nowhere' } },
    });
    const talk = new Dialogue(broken).start();
    talk.advance();
    expect(talk.done).toBe(true);
  });
});

describe('parseDialogue', () => {
  it('round-trips through JSON', () => {
    const parsed = parseDialogue(JSON.parse(JSON.stringify(bridge)));
    expect(parsed.version).toBe(DIALOGUE_VERSION);
    expect(Object.keys(parsed.nodes)).toEqual(['hail', 'name', 'paid']);
  });

  it('refuses a future version and a missing start', () => {
    expect(() => parseDialogue({ ...bridge, version: DIALOGUE_VERSION + 1 })).toThrow(/version/);
    expect(() => parseDialogue({ version: 1, nodes: {} })).toThrow(/start/);
    expect(() => parseDialogue({ version: 1, start: 'gone', nodes: {} })).toThrow(/not in/);
  });

  it('migrates an older script rather than refusing it', () => {
    const old = { version: 0, start: 'a', nodes: { a: { text: 'hello' } } };
    const parsed = parseDialogue(old, {
      migrations: { 0: (d) => ({ ...d, vars: { migrated: true } }) },
    });
    expect(parsed.vars).toEqual({ migrated: true });
    expect(parsed.version).toBe(DIALOGUE_VERSION);
  });
});

describe('lintDialogue', () => {
  it('passes a sound script and counts it exactly', () => {
    const report = lintDialogue(bridge);
    expect(report.errors).toBe(0);
    expect(report.counts).toEqual({ nodes: 3, reachable: 3, choices: 4, variables: 2 });
  });

  it('finds a dangling link', () => {
    const report = lintDialogue(
      defineDialogue({
        version: 1,
        start: 'a',
        nodes: {
          a: { text: 'hi', choices: [{ text: 'on', to: 'typo' }] },
        },
      })
    );
    expect(report.findings.map((f) => f.code)).toContain('dangling-link');
    expect(report.errors).toBe(1);
  });

  it('finds an unreachable node', () => {
    const report = lintDialogue(
      defineDialogue({
        version: 1,
        start: 'a',
        nodes: { a: { text: 'hi' }, orphan: { text: 'nobody comes here' } },
      })
    );
    const orphan = report.findings.find((f) => f.code === 'unreachable-node');
    expect(orphan?.node).toBe('orphan');
    expect(report.counts.reachable).toBe(1);
    expect(report.counts.nodes).toBe(2);
  });

  it('catches a misspelt variable — the finding that pays for JSON conditions', () => {
    const report = lintDialogue(
      defineDialogue({
        version: 1,
        start: 'a',
        vars: { coins: 0 },
        nodes: {
          a: { text: 'well?', choices: [{ text: 'pay', if: { gte: ['coin', 5] } }] },
        },
      })
    );
    const typo = report.findings.find((f) => f.code === 'undeclared-variable');
    expect(typo?.message).toContain('"coin"');
    expect(report.errors).toBe(1);
  });

  it('accepts a variable that is written before it is read', () => {
    const report = lintDialogue(
      defineDialogue({
        version: 1,
        start: 'a',
        nodes: {
          a: { text: 'hi', do: [{ set: ['met', true] }], to: 'b' },
          b: { text: 'again?', choices: [{ text: 'yes', if: { is: 'met' } }] },
        },
      })
    );
    expect(report.errors).toBe(0);
  });

  it('reports an unregistered predicate, and accepts a registered one', () => {
    const script = defineDialogue({
      version: 1,
      start: 'a',
      nodes: { a: { text: 'hi', choices: [{ text: 'show seal', if: { pred: 'hasSeal' } }] } },
    });
    expect(lintDialogue(script).errors).toBe(1);
    expect(lintDialogue(script, { predicates: { hasSeal: () => true } }).errors).toBe(0);
  });

  it('warns when every choice is conditional and none open', () => {
    const report = lintDialogue(
      defineDialogue({
        version: 1,
        start: 'a',
        vars: { seal: false },
        nodes: {
          a: {
            text: 'Papers?',
            choices: [{ text: 'the seal', if: { is: 'seal' } }],
          },
        },
      })
    );
    expect(report.findings.map((f) => f.code)).toContain('strandable-node');
    expect(report.errors).toBe(0); // a hub that unlocks later is legitimate
  });

  it('does not warn about stranding when one choice is locked', () => {
    // A locked choice is always visible, so the player is never stuck staring
    // at a question with nothing to click.
    const report = lintDialogue(
      defineDialogue({
        version: 1,
        start: 'a',
        vars: { seal: false },
        nodes: {
          a: { text: 'Papers?', choices: [{ text: '[need the seal]', if: { is: 'seal' }, locked: true }] },
        },
      })
    );
    expect(report.findings.map((f) => f.code)).not.toContain('strandable-node');
  });

  it('finds empty text and duplicated choices', () => {
    const report = lintDialogue(
      defineDialogue({
        version: 1,
        start: 'a',
        nodes: {
          a: { text: '   ', choices: [{ text: 'ok' }, { text: 'ok' }] },
        },
      })
    );
    const codes = report.findings.map((f) => f.code);
    expect(codes).toContain('empty-text');
    expect(codes).toContain('duplicate-choice');
  });
});
