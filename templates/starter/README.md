# My Game

A 3D game for the browser, built on **gama3d · scena3d · anima3d**.

```bash
npm install
npm run dev      # play it
npm run build    # typecheck + bundle to dist/
```

## What is already done for you

- **The shell** — title, settings that persist, pause on Escape *and* on
  losing the tab, results, best score, focus handling. That is GAMA's
  `Shell`, wired to the `data-screen` / `data-shell` / `data-setting`
  attributes in `index.html`. It owns no markup: restyle freely.
- **A round** — find five markers before the clock runs out. Delete it and
  keep everything else; that is what this template is for.
- **A world** (`src/world.ts`) generated from a seed. No models, no textures,
  no level files.
- **A character** (`src/player.ts`) with a procedural gait and foot IK,
  moved by one vector that already folds keyboard, gamepad and the on-screen
  thumbstick together — nothing here branches on "is this a phone".
- **Sound** synthesized at runtime. There is no audio file in the build.
- **A deployable build**: relative `base`, so `dist/` works from a domain
  root or a sub-path (GitHub Pages, itch.io) unchanged.

## Where to start

| I want to… | Open |
|---|---|
| change what a round *is* | `src/main.ts` |
| change the place | `src/world.ts` |
| change how the player moves | `src/player.ts` |
| change how it looks | `src/game.css`, `index.html` |

## Two things worth knowing

**Dedupe three.** `vite.config.ts` sets `resolve.dedupe: ['three']`. The
moment a dependency is linked or nested, `three` resolves twice and both
copies land in the bundle — 37 KB of duplicate matrix maths, and worse,
`instanceof Vector3` starts returning false across the seam.

**The sky is a dome, not a backdrop.** Its radius has to sit inside the
camera's far plane, or you get a black band above the horizon.
