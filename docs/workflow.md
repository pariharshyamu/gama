# Building a game with all three

GAMA cannot import SCENA or ANIMA. That is the trilogy's one rule, and the
obvious question it raises is: then how do you build a game with all three?

The answer is that they never meet at import time. They meet in a
**catalog**, and a file format carries the result. This page is that
arrangement, as built — every path here exists in `game/` in this
repository, and its verifier runs sixteen checks over it.

## Where they meet

```
my-game/
  package.json          gama3d + scena3d + anima3d + three, all from npm
  src/
    catalog.ts          ← the ONLY file that imports all three
    levels/
      havenbrook.json   placements, in git, diffable
    editor.ts           mounts gama3d/editor over the catalog
    level-village.ts    turns the file into gameplay
    main.ts             Shell, Game, load a level, start
  index.html
  editor.html
```

`catalog.ts` is the seam, and it is small:

```ts
import { Catalog } from 'gama3d';
import { createHouse, createStall, createStreetLight, PALETTES } from 'scena3d';
import { createHumanoid, OUTFITS } from 'anima3d';

export const catalog = new Catalog()
  .define('house', (props, ctx) => createHouse({ seed: ctx.seed, ...props }), {
    label: 'House', group: 'Buildings',
    fields: [
      { key: 'width', type: 'number', min: 3, max: 12, step: 0.25 },
      { key: 'roof',  type: 'select', options: ['tile', 'shingle', 'thatch'] },
    ],
  })
  .define('lamp', (props, ctx) => createStreetLight({ seed: ctx.seed, ...props }))
  .define('villager', (props, ctx) => createHumanoid({ seed: ctx.seed }));
```

Everything downstream imports the catalog, not the libraries. The editor
imports it. The game imports it. That one shared object is what makes
*save* in the editor and *load* in the game the same operation.

## The editor is three lines

```ts
import { mountEditor } from 'gama3d/editor';
import { catalog } from './catalog';
import level from './levels/havenbrook.json';

mountEditor({ catalog, container: document.getElementById('app')!, level });
```

Every button in the palette and every row in the inspector comes from
`catalog.info()`. The editor has never heard of a house; it draws a
`width` slider because the catalog said `width` is a number between 3 and
12. Swap the catalog and you have an editor for a different game.

Two options are worth setting for a real project. `decorate` replaces the
default lit grid with the game's own sky and ground — a level that looks
right on a grey grid and wrong in the game has not been edited, it has been
arranged. And `storageKey: null` turns off browser autosave, because a
game's levels belong in files.

## Three buckets, and only one of them is a level file

This is the part that decides your architecture:

| | Where it lives | Why |
|---|---|---|
| **Static placements** — buildings, props, roads, markers | the level `.json` | they have a position, and a position is data |
| **Actors** — the player, the crowd, vehicles | **spawn markers** in the level, instantiated at runtime | a villager is a rig plus a brain plus a state machine; the file should say *where* and *what kind* |
| **Systems** — day/night, weather, wind, audio beds | code, configured from `level.meta` | there is one of each, they have no transform, and serialising them is serialising your engine config into your map |

`meta` is the escape hatch for the third bucket — `{ "bounds": 62,
"timeOfDay": 0.42 }` — and it round-trips untouched.

## Gameplay reads the level, twice over

By **tag**, for the things that are gameplay:

```ts
const live = level.instantiate(catalog, scene);
const depot = live.byTag('depot')[0].object.position;
const doors = live.byTag('address');
const route = live.byTag('waypoint').sort(byOrder);
```

The designer moves the depot in the editor; the code never changes.

And by the **shape of what the factory returned**, for everything else:

```ts
for (const placed of live.objects) {
  const source = placed.source as PropLike;
  if (source.obstacleRadius) blockers.push({ … });   // SCENA props know their footprint
  if (source.claim)          budget.register(source.claim);  // luminous ones know their light
  if (source.update)         updaters.push(source);          // animated ones know they move
}
```

Those three lines are why `Placed.source` exists. GAMA has no idea what
SCENA's `Prop` is — it hands back whatever the factory returned, and the
game, which imports both, knows exactly what to do with it. In Havenbrook
that is the whole collision system: seventy-two blockers, none of them
authored, all of them reported by the props themselves.

## Where the first level comes from

Not from typing a hundred placements. Havenbrook was procedural before it
was a file, so the migration was: run the generator one more time, and
write down what it decided. `game/tools/seed-level.mjs` is committed for
exactly that reason — it ran once, and deleting it would hide where the
level came from. After that the JSON is the source of truth.

The two paths still coexist. `?level=havenbrook` loads the file;
anything else generates from a seed. Both return the same `Village`
interface, so nothing downstream knows which it got — which is the only
honest way to have both.

## What does not fit, and what to do about it

A road is a **polyline**, and a level file stores transforms. There is no
graceful way to put a point list in an `at`/`rot`/`scale`, so Havenbrook's
ring road is fourteen straight segments you place and turn. That is the
right answer: the format bends for nobody, and a kind that does not fit it
should say so in its shape rather than smuggle a point list into a prop.

## The bug this found

The first time the editor was pointed at SCENA rather than at twelve toy
primitives, it exposed a leak that toy content could never have shown.
`createHouse` allocates six geometries and five materials, shared with
nothing, and changing a prop rebuilds the entity — so dragging a width
slider fifteen times left fifteen houses resident. Measured in a real
browser: **138 geometries leaked over fifteen rebuilds, against 0 after the
fix.** `Level.instantiate` now frees what leaves the level.

The same measurement then found a second one, in the editor's own selection
boxes: `gizmos.clear()` detaches a `BoxHelper` but does not free it, and
one was made on every change.

It is the lesson this project keeps re-learning. The thing that finds the
bug is the thing that *uses* the feature — and toy content is not use.
