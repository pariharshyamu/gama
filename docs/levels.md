# Levels: prefabs and a file format

Everything in these libraries has been authored in code so far —
`buildVillage(scene, seed)` and out comes a town. That is a fine way to
build a world and a hopeless way to *edit* one, because there is nothing to
edit. This is the layer that turns a scene into data and back again.

The round trip is the whole feature. An editor is only possible if
`serialize(instantiate(level))` gives back what you started with, so that is
the first test in the suite and everything else is arranged to keep it true.

## The format

A level is a list of **placements** — not a scene graph, and not geometry:

```json
{
  "format": "gama.level",
  "version": 1,
  "name": "Yard",
  "seed": 20,
  "entities": [
    { "id": "c1", "kind": "crate", "at": [-2, 0, 2] },
    { "id": "c2", "kind": "crate", "at": [-0.6, 0, 3.4], "rot": 0.6,
      "props": { "color": 10251071 } },
    { "id": "p1", "kind": "lit-corner", "at": [4, 0, -3] }
  ]
}
```

Storing meshes instead would be a thousand times larger, would go stale the
moment a generator improved, and would throw away the seed that made it. So
an entity is a `kind`, a transform and a bag of options, and loading one
**runs the factory again**.

## The catalog: names in a file, things in a world

GAMA cannot import SCENA or ANIMA — that is the trilogy's one rule — so it
has no idea what a `"house"` is. The game says so:

```ts
const catalog = new Catalog()
  .define('house', (props, ctx) => createHouse({ seed: ctx.seed, ...props }))
  .define('villager', (props, ctx) => makeVillager(ctx.seed, props));

const level = Level.parse(await (await fetch('yard.json')).json());
const live = level.instantiate(catalog, scene);
```

A factory may return a three.js `Object3D` **or** anything shaped
`{ object }` — SCENA props and ANIMA rigs both drop in unchanged. That is
the same structural handshake the rest of the trilogy runs on, applied to
loading.

Gameplay then reads the level rather than hard-coding it:

```ts
const spawn = live.byTag('spawn')[0].object.position;
for (const pickup of live.byTag('coin')) …
```

## Prefabs are recipes, not blobs

```ts
catalog.prefab('lit-corner', {
  kind: 'pillar',
  props: { height: 2.4 },
  children: [{ kind: 'lamp', at: [0, 0, 1.4] }],
});
```

Placing `{ kind: 'lit-corner', at: [4,0,-3], props: { height: 3 } }` expands
the recipe, merges the override, and keeps the children. The placement
wins on transform and props; children concatenate, so a placement can add to
a recipe without redefining it. Recipes may name other recipes.

## Five decisions worth knowing about

**An unknown kind is kept, not dropped.** If a file references a kind this
build has no factory for, the entity is preserved in place and written back
out untouched. The alternative is a game that silently deletes half of
somebody's level the first time it opens it without a plugin registered, and
that is the kind of bug people do not forgive.

**Old files migrate; they do not get refused.** Levels are content, not
caches — a save that no longer parses is somebody's work thrown away. Pass
`migrations` keyed by the version they read *from* and they are applied in
sequence. A file from the *future* is refused, loudly, because guessing is
worse.

**Numbers are rounded and defaults omitted.** Level files live in git.
`0.30000000000000004` in a diff helps nobody, and neither does
`"scale": 1` on every line.

**A yaw stays a yaw.** `rot` may be a single number (Y) or a full triple.
Nearly every placement in a ground game is a yaw, and writing
`[0, 1.5708, 0]` everywhere makes a file harder to read and to hand-edit for
no gain. Serializing picks whichever the object actually is.

**Seeds are derived, not stored.** An entity without its own seed gets one
hashed from the level seed and its id — so a generated world stays
reproducible without a thousand random numbers written into the file.

## The bug the demo found

The playground example lists what it can select, and the list contained an
entity called `"entity"`. Prefab children are created at *instantiate* time,
after ids were assigned to the file's own entities — so they had none, and
every one of them landed on the same fallback string. `byId` returned the
first, and selecting the others was impossible. They are now namespaced
under their parent (`post/lamp-0`, `post/lamp-1`), with a test.

It is the same lesson as the rest of this project: the thing that finds the
bug is the thing that *uses* the feature, not the thing that tests it.

## What this is not

Not an editor — this is the file format and the loader an editor needs:
`byId`, stable ids, an exact round trip, and unknown data that survives a
save. The editor itself is the next layer up, and it is real: see
[the editor](./editor.md), or [open it](../editor.html).
