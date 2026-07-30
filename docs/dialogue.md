# Dialogue

[Run it →](../playground.html?example=dialogue)

A conversation is content, and content wants to live in a file something can
check. So a `gama3d` dialogue script is JSON — nodes, choices, conditions and
effects, no functions — and the payoff is `lintDialogue`, which finds the
dangling link and the misspelt variable before a player does.

```ts
import { Dialogue, defineDialogue, lintDialogue } from 'gama3d';

const script = defineDialogue({
  version: 1,
  start: 'hail',
  vars: { coins: 3, toldName: false },
  nodes: {
    hail: {
      speaker: 'Keeper',
      text: 'Toll for the bridge. Five coins.',
      choices: [
        { text: 'Here you are. (5 coins)', to: 'paid', locked: true,
          if: { gte: ['coins', 5] },
          do: [{ inc: ['coins', -5] }, { emit: 'paid-toll' }] },
        { text: "Who's asking?", to: 'name', if: { not: { is: 'toldName' } } },
        { text: 'I will go around.' },          // no `to` — a walk-away
      ],
    },
    name: { speaker: 'Keeper', text: 'The keeper.', do: [{ set: ['toldName', true] }], to: 'hail' },
    paid: { speaker: 'Keeper', text: 'Mind the third plank.' },
  },
});

const talk = new Dialogue(script, {
  onLine: (line) => hud.caption(`${line.speaker}: ${line.text}`),
  onEvent: (name) => name === 'paid-toll' && goals.advance('toll'),
});
talk.start();
for (const choice of talk.choices) draw(choice);   // {index, text, enabled}
talk.choose(0);
```

## It renders nothing

`line` says who speaks and what they say. `choices` says what can be said back.
Drawing that is yours — a `Hud` caption, a DOM list, an ANIMA `Gesture` on the
speaker's rig, a portrait keyed off `line.id`. This is the same seam `Catalog`
uses for levels: the library owns the structure, the game owns the look.

## Why the conditions are data

The obvious design is `if: (vars) => vars.coins >= 5`. It is more expressive
than the vocabulary below, and it is the wrong trade, because a function cannot
be read. `{ gte: ['coins', 5] }` can, so `coins` joins the set of names the
linter knows about — and `{ gte: ['coin', 5] }` becomes a reported typo instead
of a condition that is silently false forever and a branch that never fires.

| condition | |
|---|---|
| `{ is: 'flag' }` | truthy — the common case, so the shortest |
| `{ not: … }` `{ all: […] }` `{ any: […] }` | empty `all` is true, empty `any` is false |
| `{ eq: ['name', v] }` `{ ne: … }` | exact |
| `{ gte: ['n', 5] }` `{ lt: … }` | a missing number counts as 0, so a counter needs no setup |
| `{ pred: 'hasSeal' }` | a predicate you register — the escape hatch |

| effect | |
|---|---|
| `{ set: ['flag', true] }` | |
| `{ inc: ['coins', -5] }` | |
| `{ emit: 'paid-toll' }` | handed to `onEvent`, *after* the vars update |

There is deliberately no arithmetic and no string building. A condition
language that grows into a scripting language stops being checkable, which was
the entire point. `{ pred: name }` is the pressure valve, resolved against
predicates you pass — exactly how `Catalog` resolves a level file's kinds to
factories, and the linter still knows whether the name exists.

## Hidden or locked, and why both

A choice whose `if` fails is **hidden**. Mark it `locked` and it appears greyed
instead:

```ts
{ text: 'Here you are. (5 coins)', if: { gte: ['coins', 5] }, locked: true }
```

Not cosmetic. A hidden choice keeps a secret; a locked one teaches — it tells
the player what to go and get. A system offering only one of the two forces
authors to fake the other.

One warning from writing the demo: **do not pair a hidden choice with a locked
twin.** The obvious idiom — a real option gated on `coins >= 5` plus a
`(You need 5 coins)` hint carrying the same condition — breaks the moment the
condition passes, because then *both* rows appear and the hint leads nowhere.
One choice, locked, is the whole answer.

## Indices are what the player sees

`choices` returns `index` values against the **presented** list, not the
authored array. Once a condition filters anything the two orders differ, and
resolving a player's click against the raw array takes the wrong branch. The
runtime re-reads the filtered list inside `choose`, so a stale render cannot
pick the wrong line either.

## It saves mid-conversation

```ts
slot.write({ talk: talk.toJSON() });          // { at, vars, visited }
new Dialogue(script).restore(saved.talk);     // same line, same flags
```

`restore` deliberately does not re-fire the entering effects: they ran before
the save, and replaying them would double every `inc` on each load. It does
call `onLine`, because redrawing is presentation rather than state.

## It counts

`counts` is `{ lines, choices, events }` — exact integers. A conversation
becomes testable as a **walk** rather than as a screenshot, which is how the
playground example is verified in CI: click the option that asks his name,
advance, and assert the option is gone the second time.

## lintDialogue

```ts
const report = lintDialogue(script, { predicates });
if (report.errors) throw new Error(formatLint(report));
```

| code | severity | |
|---|---|---|
| `dangling-link` | error | `to` names a node that does not exist |
| `empty-text` | error | a line or choice with nothing in it |
| `unknown-predicate` | error | `{ pred: … }` you never registered |
| `undeclared-variable` | error | read, never written, not in `vars` — the typo catcher |
| `unreachable-node` | warn | content no path reaches from `start` |
| `strandable-node` | warn | every choice conditional, none open at the starting vars |
| `unread-variable` | warn | written, never read — usually a renamed consumer |
| `duplicate-choice` | warn | two identical strings in one list |

`counts` includes `nodes` and `reachable`, and **those two disagreeing is a
bug** — which makes it a gate, not a report. Errors are broken; warnings are
suspicious and occasionally deliberate, since a hub whose options unlock later
is a legitimate shape.

Reachability ignores conditions on purpose. It answers "does a link exist",
not "can this player satisfy it" — the second question needs the whole game to
answer and would make the linter lie about content that unlocks in act three.

## What this is not

**No text formatting, localisation or typewriter effect.** `text` is a string;
wrapping it in a template, looking it up in a locale table, or revealing it a
character at a time are all presentation, and all belong in the same layer that
already owns the font.

**No conversation manager.** One `Dialogue` is one conversation. Which NPC
starts which script, whether they remember you between them, and where the
variables live long-term is the game's — `SaveSlot` holds the store, and
`toJSON` is shaped to go straight into it.

**No voice, no lipsync.** `speaker` and `tag` are the hooks; ANIMA has the
body. Visemes are the obvious next thing and they are not here.
