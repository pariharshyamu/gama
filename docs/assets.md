# The asset pipeline

[Run it →](../playground.html?example=assets)

Everything in these libraries is generated from a seed, which is a real
answer to the art problem and not a complete one. Sooner or later a game has
a folder of glTF files, and the difference between a loader and a pipeline is
what happens around them.

Two halves. `scripts/assets.mjs` walks the folder and writes a **manifest**;
`AssetLibrary` reads it.

```bash
node scripts/assets.mjs assets --out assets/manifest.json
```

```ts
import { openAssets } from 'gama3d';

const library = await openAssets('./assets/manifest.json');
library.onProgress = (p) => (bar.style.width = `${p.fraction * 100}%`);

await library.load('town');                  // a group
scene.add(library.instance('town/crate'));   // a clone; geometry is shared
library.release('town');                     // …and freed when nothing holds it
```

## Why a manifest at all

**Keys, not paths.** Code says `library.model('crate')`. Moving a file or
adding a content hash to its name breaks the build script, which is a
thirty-second fix, rather than the game, which is a 404 somebody finds in
production. With `--types` the keys become a union type, so a renamed file is
a compile error.

**Sizes, before loading.** This is the one that matters most and gets skipped
most. A bar that counts files makes a 3 MB model and a 2 KB JSON weigh the
same; a bar that counts requests-so-far jumps *backwards* every time a new
one starts. The manifest records byte lengths at build time, so
`progress.fraction` is byte-weighted and honest from the first frame — and
`weightOf('level-2')` tells you what a download will cost before you start
it, which is what a "this level is 4 MB, continue?" prompt needs.

**Groups.** A game loads its menu, then a level, then the next level. The
first directory under the assets root is the group, so the folder layout says
which is which:

```
assets/
  town/  crate.gltf  lamp.gltf  planks.png     → group "town"
  ruins/ statue.gltf broken-arch.gltf moss.png → group "ruins"
```

That is why the sample assets are organised by **bundle** rather than by file
type. `models/` and `textures/` is a tidy folder and a useless group.

**Hashes.** Cache-busting, and so the build script can tell you that two
paths are the same bytes — usually a file copied instead of referenced, which
doubles a download for no visible reason.

## The build script

```
node scripts/assets.mjs assets --out assets/manifest.json \
  [--types src/assets.d.ts] [--base ./assets/] [--budget 8] [--check] [--strict]
```

| | |
|---|---|
| `--check` | writes nothing; exits non-zero if the manifest on disk has drifted from the folder |
| `--types` | emits `AssetName` / `AssetGroup` union types |
| `--budget N` | warns when the total exceeds N MB |
| `--strict` | makes any warning an error |

`--check` is the CI gate, and it is the whole reason to generate a manifest
rather than hand-write one: a manifest that has drifted from its files is a
game that works on the machine where the assets happen to be and 404s
everywhere else. In this repo it runs as part of `site:build`.

It also reports what it will not fix for you: duplicate content, files whose
extension nothing will ever load, and two paths that collapse to one key.

## Loading

```ts
await library.load('town', 'ui/chime', 'settings');
```

Selectors are keys, group names, or `'*'`. Already-loaded assets are counted,
not refetched. Loads are deduplicated — ask twice, fetch once — capped at
`concurrency` (default 6, past which browsers queue anyway) and retried with
backoff. A failure that survives its retries throws with the **key and the
url** in the message, because a bare `404 Not Found` from somewhere inside a
loader is not a diagnosis.

Reading an asset that is not loaded throws too, and says what to do:

```
AssetLibrary: "town/crate" is not loaded — await library.load('town/crate') first
```

Returning `undefined` there would push the failure into whatever line
touches the result next, which is usually deep inside three.js.

## Instances share, and that has a consequence

`instance(key)` clones: `SkeletonUtils.clone` when the model has a skeleton,
`Object3D.clone` otherwise. Plain `clone()` on a skinned mesh leaves it bound
to the *original's* bones, so every copy animates in lockstep with the first
one and nobody can see why.

Forty crates are therefore **one geometry and one material**. Which means
freeing a clone would blank the other thirty-nine — so `library.factory(key)`
returns a placement whose `dispose()` deliberately does nothing:

```ts
catalog.define('crate', library.factory('town/crate'));
```

That is [the ownership contract](./levels.md) from the level loader being
used for real. `Level` frees an entity's resources when it leaves the level
*unless the factory claims ownership*, and this is a factory that claims it
in order to decline. Delete one crate in the editor and the other thirty-nine
are untouched; there is a test that asserts exactly that.

The demo measures it: 42 placements, **5 geometries** in the driver — two per
model plus the ground.

## Unloading

`release(...)` is reference-counted. Two levels that both want the same
texture take two references, and the first one to unload does not blank it
for the second. It returns the keys it actually freed, which is worth logging
when a level transition does not reclaim what you expected. `clear()` frees
everything regardless, for a hard teardown.

The demo measures this too, in a real browser: 5 geometries with `town`
loaded, 11 after `ruins` arrives, and **back to 5** after `release('ruins')`.

## Loaders are functions

```ts
export type AssetLoader = (
  url: string,
  onProgress?: (loaded: number, total: number) => void
) => Promise<unknown>;
```

That is the entire interface. `defaultLoaders()` wraps three's
GLTFLoader/TextureLoader/AudioLoader plus a progress-reporting `fetch` for
JSON and text, and `openAssets` registers them for you — but a game that
wants Draco, KTX2, a mesh format of its own or an IndexedDB cache registers
one rather than waiting for this library to add it:

```ts
library.register('ktx2', (url) => ktx2Loader.loadAsync(url));
```

It is also why the tests cover retries, dedupe, refcounting, byte-weighted
progress and the ownership contract without a GPU, a network or a DOM.

## What this is not

No transcoding. There is no Draco compressor, no KTX2 encoder, no texture
resizer and no mesh optimiser in here — those are heavy native tools, and a
library that shells out to them is a build system wearing a library's
clothes. What this does is describe what you have, tell you when it has
drifted or doubled, load it honestly, and free it. Point `--out` at a folder
your own `gltf-transform` or `toktx` step wrote and the rest works unchanged.

The sample assets under `site/public/assets/` are generated by
`site/tools/make-sample-assets.mjs` and committed: real glTF, real PNG, real
WAV, about 55 kB all in. GAMA ships no art, and a pipeline demo that loads
nothing is not a demo.
