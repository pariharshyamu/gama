# The editor

[Open it →](../editor.html)

The level format gave a scene a file. This is the part that lets somebody
change it without opening the file — and, more to the point, the part a game
can embed so that *its own* designers never have to.

There are two halves. `Editor` is the bookkeeping every editor needs and
every editor gets wrong the same way — what is selected, what an edit did,
and how to take it back. `mountEditor`, from the separate `gama3d/editor`
entry point, is the program around it: palette, inspector, drag handling,
toolbar, keyboard, autosave.

```ts
import { mountEditor } from 'gama3d/editor';

mountEditor({ catalog, container: document.getElementById('app')!, level });
```

That is a working editor for whatever your catalog contains. It builds its
own DOM and injects its own styles (scoped under `.gama-ed`), so there is
no stylesheet to link and nothing to fight with the host page's CSS, and it
is a separate entry point so a game that never opens one pays nothing for
it. `decorate` swaps the default lit grid for your game's sky and ground;
`actions` adds toolbar buttons; `storageKey: null` turns off browser
autosave for a project whose levels live in files.

```ts
import { Catalog, Level, Editor } from 'gama3d';

const live = Level.parse(file).instantiate(catalog, scene);
const editor = new Editor(live, { snap: 0.5, onChange: () => redraw() });

editor.select(editor.pick(ndcX, ndcY, camera)?.id ?? null);
editor.move(1, 0, 0);         // undoable, snapped
editor.duplicate();           // …from the live transform, not the loaded one
editor.undo();                // and exactly undone
download(editor.toText());
```

## What is selectable

The level's own entity list — the rows a file actually contains. Prefab
children and nested placements are deliberately not selectable, and `pick`
and `resolve` walk up to the thing that owns them: click the lamp on a
lamp-post and you select the post.

The reason is not tidiness. A prefab's lamp exists because a *recipe* said
so; there is no line in the file to write a new position to. An editor that
let you drag it would be an editor that silently discarded the drag on save,
which is worse than one that never offered.

## Three decisions

**Undo stores transforms, not deltas.** A command remembers where things
were and where they ended up. Deltas read tidier and drift: they assume
every edit is invertible in the units it was applied in, which stops being
true the first time a snap rounds something or a second edit lands on the
same object.

**A run of edits is one undo.** Holding an arrow key would otherwise bury
the stack in three hundred entries, and undo becomes useless exactly when
you need it. Consecutive edits of the same kind on the same selection merge
into the entry on top until something ends the run — a different edit, a
selection change, or `commit()`, which the app calls on key-up and
pointer-up. A drag of any length is one step.

**Snapping quantizes the result, not the step.** `move(0.3, 0, 0)` with a
0.5 grid puts the thing *on* the grid, rather than 0.3 from wherever it
already was. The alternative accumulates the object's original offset
forever, and a grid that never actually aligns anything is not a grid.

## Deleting, and putting it back

`remove()` reads the level back before it takes anything out, so an entity
that was dragged returns where it was dragged to — and it returns to the
same **slot**, not to the end of the list. A level file lives in git, and an
undo that reshuffles the entity order turns a one-line diff into a
whole-file one.

Deleting several at once records every index *before* removing any of them.
Reading each index as it goes records positions in a list the previous
delete has already shortened, and the second entity comes back a slot too
early. That one was found by a test, not by reasoning.

## Props are a rebuild

The factory already ran, so changing a prop means building the entity again:
`setProps` swaps the placement and re-instantiates it in place, carrying the
live transform across. Tags are not props — nothing was built from them — so
`setTags` just re-labels, and both are on the same undo stack as everything
else.

## The catalog describes itself

An editor cannot hard-code a game's content, so the catalog carries enough
description to generate a UI:

```ts
catalog.define('house', createHouse, {
  label: 'House',
  group: 'Structures',
  defaults: { storeys: 1 },
  fields: [
    { key: 'width', type: 'number', min: 2, max: 12, step: 0.2 },
    { key: 'roof', type: 'select', options: ['gable', 'flat'] },
    { key: 'roofColor', type: 'color', label: 'roof colour' },
  ],
});
```

`catalog.list()` is a palette; `catalog.info(kind).fields` is an inspector.
The editor page on this site knows nothing about houses, towers or trees —
every button and every row in the panel comes from that. A prefab inherits
the fields of whatever it is a recipe *for*, since those are the props it
actually reaches, and its own props become the defaults shown.

## The API

| | |
|---|---|
| `select(id \| ids \| null, {add, toggle})` · `selectAll()` · `selectNext(±1)` | selection |
| `selection` · `selected` · `focused` · `isSelected(id)` · `editable` | reading it |
| `pick(ndcX, ndcY, camera)` · `resolve(object3d)` | finding it in the scene |
| `move` · `moveTo` · `rotate` · `scaleBy` · `setScale` · `ground` | transforms |
| `place(spec)` · `duplicate(offset)` · `remove()` · `setProps` · `setTags` | structure |
| `undo()` · `redo()` · `canUndo` · `undoLabel` · `commit()` · `clearHistory()` | history |
| `snap` · `snapAngle` · `toJSON()` · `toText()` | the rest |

## Freeing what a rebuild replaces

Changing a prop rebuilds the entity, because the factory already ran. With
a real generator behind the catalog that is expensive: `createHouse` in
SCENA allocates six geometries and five materials, shared with nothing, so
fifteen drags of a width slider is fifteen houses of memory.

`Level.instantiate` takes `{ release }`, on by default, and frees an
entity's resources when it leaves the level. Ownership is the factory's to
claim — if what it returned has its own `dispose()`, that is called and
nothing else is touched, which is how a factory handing out shared or
cached resources says *not yours to free*. Otherwise the object is
traversed and its geometries, materials and their textures are released.

Measured in a browser over fifteen rebuilds: **138 geometries leaked with
release off, 0 with it on.**

## Two demos

[The docs-site editor](../editor.html) runs on twelve procedural primitives
defined in about three hundred lines — deliberately, because it proves the
editor ships no content of its own.

[Havenbrook's editor](../play/editor.html) is the same `mountEditor` call
pointed at a catalog of SCENA props and ANIMA characters: houses, market
stalls, street lamps, trees, roads, delivery doors. It edits the level the
game actually loads. See [using all three libraries](./workflow.md) for how
that fits together.

Both are headlessly verified the way a tool has to be — not "did it draw
something", but *place a barrel from the palette, drag it across the map,
nudge it with the keyboard, undo the lot and check the file came back byte
for byte*. Twenty checks on one, sixteen on the other, and the screenshots
are looked at too.

## What it is not

There is no gizmo — dragging happens on the ground plane, and height is
`PageUp`/`PageDown`. There is no multi-user anything, no asset importing,
and children of a placement cannot be edited separately from their parent.

The honest summary is that this is the editor a game embeds for its own
designers, not one you would ship to strangers. That is the useful shape
for a library: the fifty lines you would have got wrong are done, and the
part that should look like your game is yours.
