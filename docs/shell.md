# The shell, and the templates

The part of a game that is not the game: which panel is on screen, what
Escape does, where the settings live between visits, what happens when the
tab is hidden, how the phone gets a thumbstick, where focus goes when a
dialog opens. None of it is interesting and all of it is required, and a
demo that skips it is a demo forever.

This layer was **extracted from a game that shipped** rather than designed
in advance — [Havenbrook Courier](../game), which is also one of the two
templates below. Everything here exists because writing that game needed it.

## `Shell`

```ts
const shell = new Shell({
  name: 'my-game',
  settings: { quality: 'medium', sound: true, length: 60 },
  onStart: () => buildRound(shell.settings),   // build a round
  onTeardown: () => teardown(),                // …and take it apart
  onFinish: () => fillInResults(),
});

game.onUpdate((t) => {
  const dt = shell.gate(t.delta);   // 0 unless the round is actually live
  …
});
```

It owns **no markup and no styling**. You write the HTML; it finds it by
data attribute:

| attribute | means |
|---|---|
| `data-screen="title"` | a panel. Exactly one shows; `playing` shows none. |
| `data-shell="play"` | a button wired to the lifecycle: `play · again · resume · pause · quit · title`. |
| `data-screen-open="settings"` | opens a panel that is **not** a game state — settings, help, credits. |
| `data-setting="quality"` | two-way bound to the settings object, and persisted. |
| `data-autofocus` | what takes keyboard focus when that panel opens. |

Underneath is `GameFlow`, so illegal moves (results → paused) are refused
rather than smeared over, and `gate(dt)` is the one-line pause.

### The settings binding reads the DEFAULT's type

`{ sound: true }` binds to `checked`; `{ length: 60 }` goes through
`Number`; everything else is a string. The schema stays in one place — the
defaults object — instead of scattered across markup that can drift from it.
Saved settings are **merged over** the defaults, not swapped for them, so a
save written before a setting existed does not delete the new default.
There is a test for exactly that.

### Three details that are easy to skip and hard to live without

**Hide with the attribute, not just the class.** `hidden` is what assistive
technology reads; a class is only what CSS reads. A panel that is invisible
but still in the accessibility tree is a screen reader announcing a menu
nobody can see.

**Let go of focus to play.** Opening a panel focuses its first control.
Going back to the game *blurs* — because a button that keeps focus eats the
next Space, so a player who resumes and then jumps has pressed Resume again.
Two lines, for a bug that is very hard to see and very easy to feel.

**Show the loading screen before you block.** `start()` yields two animation
frames before calling `onStart`. Building a world is usually a second or
more of blocked main thread, and without the yield the loading panel paints
*after* the wait it exists to cover.

## The templates

```bash
node scripts/new-game.mjs my-game                    # starter
node scripts/new-game.mjs my-game --template courier # the full game
```

| template | what it is |
|---|---|
| **starter** | A complete small game — find five markers before the clock runs out — with the whole shell already wired. Delete the round, keep the rest. |
| **courier** | Havenbrook Courier: a generated village, a delivery loop, townsfolk who get in the way, day turning to dusk. A worked example rather than a skeleton. |

Both depend on the **published** packages rather than this repository, so
what you scaffold is what an outside developer gets.

### Two things the templates fix that every new project hits

**Dedupe three.** `resolve: { dedupe: ['three'] }` in the Vite config. The
moment a dependency is linked (`npm link`, a `file:` path, a monorepo) or
nested, `three` resolves from two directories and both copies land in the
bundle. Measured here: **37 KB gzipped** of duplicate matrix maths — and the
weight is the lesser problem, because `instanceof Vector3` starts returning
false across the seam, which is a genuinely baffling afternoon.

**The sky is a dome, not a backdrop.** Its radius must sit comfortably
inside the camera's far plane or the view runs off the edge of it and you
get a black band above the horizon. The starter sets both explicitly and
says why.

## What the shell deliberately does not do

No router, no scene manager, no asset pipeline, no editor. It is about four
hundred lines of the things every game rewrites, and it stops there — the honest
accounting of what these libraries are and are not still stands: there is
no editor, no scene serialization and no asset pipeline here.
