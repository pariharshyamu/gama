# Changelog

Every minor version here is one feature taken end to end: code, unit tests, a
runnable example in the playground, headless verification in Chromium, and
docs. Nothing is listed as shipped that has not been run.

The entries below are written to be *useful* rather than complete — where a
release found a bug worth knowing about, the bug is in the entry. The commit
messages carry the long form.

Versions follow semver in spirit: while at `0.x`, minor versions may add and
occasionally reshape API. Breaking changes are called out under **Changed**.

Two gaps between this file and the registry, stated rather than papered over:
`0.1.0`–`0.8.0` predate the rename to `gama3d` and were never published, and
`0.33.0` was committed but superseded by `0.34.0` before a publish, so
`npm install gama3d@0.33.0` finds nothing.

## [Unreleased]

### Added

- **`deploy/` — self-hosting the docs site** on a plain Linux box, alongside
  the existing GitHub Pages path rather than instead of it. `bootstrap.sh`
  provisions the server once (nginx, `/srv/gama`, SELinux labelling, port 80);
  `npm run site:deploy` builds locally, ships artifacts, and flips a symlink.
  The server needs nginx and rsync and nothing else — no Node, no toolchain,
  no registry access — so a broken build cannot reach it.
- **Releases, not an in-place sync.** An in-place `rsync` is *visibly* broken
  while it runs: the new `index.html` lands naming hashed bundles that have
  not uploaded yet, and anyone loading the page in that window gets a white
  screen. Each deploy writes a whole directory and moves a symlink with
  `mv -T` — `ln -sfn` onto an existing symlink unlinks and re-creates, which
  is a real if brief window where the document root does not resolve.
- **A smoke test that can fail.** The deploy finishes by requesting the live
  site over HTTPS rather than trusting `rsync`'s exit code, and the check
  worth having is the last one: it fetches the hashed bundle *the deployed
  `index.html` actually names*. A partial upload survives every other status
  code on the list.
- **HTTPS on `gama.playmeet.games`** via `enable-tls.sh` — Let's Encrypt,
  HTTP→HTTPS redirect, HSTS, HTTP/2, automatic renewal with an nginx reload
  hook. It runs `certbot certonly --webroot`, deliberately not `certbot
  --nginx`: the plugin rewrites the server block in place, and this config is
  version-controlled and re-installed by `bootstrap.sh`, so the next
  provisioning run would silently revert TLS. The certificate is data and
  lives on the box; the config is code and lives in git. `bootstrap.sh` knows
  it, and refuses to downgrade a box that already has TLS.
- **A preflight that costs nothing before a request that does.** Let's Encrypt
  allows five failed validations per hostname per hour, so `enable-tls.sh`
  first drops a token in the webroot and fetches it over
  `http://gama.playmeet.games/` exactly the way the CA will — one request that
  exercises DNS, the provider firewall, port 80, and the nginx location. All
  four fail identically and unhelpfully under certbot as `Invalid response …
  403`.
- **`SITE_URL`, separate from `DEPLOY_HOST`.** The upload needs the address
  that answers SSH; the smoke test needs the name on the certificate. Pointing
  the checks at the IP over HTTPS fails every one of them on a name mismatch
  that has nothing to do with the deploy that just ran.

### Fixed

Six nginx traps, four of them found by running the config rather than reading
it, and all recorded in `deploy/README.md` because each one looks correct:

- `types { include /etc/nginx/mime.types; … }` nests a `types` block inside
  another — `mime.types` is itself one — and nginx dies with `unexpected "{"`.
- A `types` block in `server` *replaces* the inherited map instead of
  extending it: every `.css` and `.js` goes out as `application/octet-stream`
  and the site renders as unstyled text with no scripts.
- `listen [::]:80` on a kernel without IPv6 does not degrade, it stops nginx
  starting — a config that passes `nginx -t` for syntax and still refuses to
  boot. It ships commented out and `bootstrap.sh` enables it on evidence.
- `add_header` in a `location` replaces every inherited `add_header` rather
  than adding to it, so per-`location` cache rules silently drop
  `X-Frame-Options` and `Referrer-Policy` from exactly the HTML responses that
  need them. The cache tiers are a `map` for that reason, not for tidiness —
  and it is the same reason HSTS sits in the `:443` block, where `include`
  splices it alongside the others rather than nesting it beneath them.
- `location /.well-known/acme-challenge/` as a plain prefix loses to the
  `location ~ /\.` dotfile-deny regex — regex outranks prefix — so ACME 403s
  and certbot blames the wrong thing. `^~` is the one prefix form that wins.
- `default_server` on the site's `:443` block parses, serves, and quietly
  makes the site answer to *any* name, including the IP the certificate does
  not cover. The default belongs on the block that returns 421.

## [0.45.0] — 2026-07-30

### Added

- **`RailController`** — the vehicle class that does not steer. Everything else
  in GAMA picks a direction and integrates it; a train's entire position is one
  number, so the controller's job is *"how fast, and can I still stop in
  time"*. It owns `distance` and moves nothing: placing the train is the game's
  job, which is what keeps it free of geometry.
- **The `RailLine` handshake** — `{ length, loop? }`, a shape rather than a
  package. SCENA's `createTrack` satisfies it, and so does a hand-rolled
  cumulative-length table; the new `railway` playground builds its own from a
  `CatmullRomCurve3` precisely to show GAMA is not reaching for SCENA.
- `schedule()` / `onArrive` / `onDepart` / `nextStop` / `dwellRemaining`,
  `emergencyStop()` / `resume()`, and `etaTo()` — which integrates the same
  stopping curve `step` drives, stops at every booked stop in between, adds
  their dwell, and adds whatever is left of the one the train is standing in.
- `railway` playground example and [docs/rail.md](docs/rail.md).
- **A `railDebug()` gate in `verify:playgrounds`**, plus a per-example settle
  time — see below for why both were needed.

### Fixed / learned

Four defects, three of which the tests as first written did not catch:

- **The arrival rule, not the brake law.** An earlier version arrived on
  `distance ≥ target && speed < 0.05` with the final step clamped, which is a
  train that reaches the platform and then **shivers in place for 2.4 seconds**
  at 10 Hz while its speed bleeds off against the clamp. Measured, then fixed
  by landing in one step. The `√(2·brake·remaining)` ceiling was written as the
  cure and then *measured against the bang-bang alternative in the same
  harness*: they land identically and the residual differs by less than half a
  metre per second either way. The claim in the module doc was corrected rather
  than kept — the ceiling is the closed form of the same rule, not an
  improvement on it.
- **A clamp that fabricated physics.** "Never move past the mark" brought a
  train at line speed to a stand in **10 m** while `stoppingDistance` reported
  302 — the one thing this module says a train must never do. A stop booked
  inside the braking distance now runs through and brakes to a stand beyond,
  reporting the overrun.
- **A tolerance that got worse the faster the frame rate.** Telling a real
  landing from a fabricated one was first done with a per-step distance
  tolerance. A smaller `dt` bought a *tighter* tolerance for a gap an earlier
  long frame had already opened. Found in the browser, not here: a train 0.39 m
  short at 1.11 m/s ran straight through HAVENBROOK, and because a loop line
  wraps the gap, the station became a lap away and the train accelerated off to
  go round again. Replaced with a question about the approach — *was this train
  ever able to stop for this mark?* — which mentions `dt` nowhere.
- **Two tests that passed for the wrong reason.** "Lands exactly" and "reports
  zero overrun" both passed because the arrival block was snapping the train
  *backwards* onto the mark. Every claim in this release was then re-checked by
  re-injecting the defect it describes; five such mutations are recorded in the
  test names.

And one about gates rather than code: `verify:playgrounds` reported **ok** for
a railway whose `distance` was `NaN` — the example passed `game.onUpdate`'s
`Time` where a number was wanted — because a static track renders perfectly
well. "Renders something" is not "works". The verifier now reads `railDebug()`
and fails the row on a non-finite distance, no arrivals, or an overrun at a
booked stop; the same probe would have caught the missed station too. Six
seconds is enough to judge a particle burst and not enough to judge a train, so
settle time is now a property of the example.

## [0.44.0] — 2026-07-30

### Added

- **Replay** — `Recorder`, `replay`, `TapeReader`, `parseReplay` (versioned,
  with migrations, like `Level` and `Dialogue`). A run is its seed plus its
  inputs — a few hundred bytes, because only ticks where the input *changed*
  are stored — and playing it back re-runs the simulation. That is a regression
  test made of real play, a ghost, a demo, and a spectator, all one mechanism.

- **`worldChecksum`** — the whole world folded into one unsigned 32-bit
  integer, so two runs can be compared per tick and the **first** tick they
  disagree on can be named. That tick is the bug; everything after it is
  consequence, which is why `replay` stops there instead of listing four
  hundred of them. `precision` for cross-machine comparison (and the honest
  warning that it then cannot see drift below the quantum), `deep` for state
  three.js knows nothing about.

- **`Rng`** — mulberry32, seeded, with the seed mixed before first use so that
  seeds 1, 2, 3 do not start with three near-identical values. GAMA had seeds
  everywhere — `Level` carries one, `Catalog` hands one to every factory — and
  no generator behind them.

### Fixed

- **`createFlock` could not be replayed at all.** It scattered its boids with
  `Math.random` and gave every one a `Wander` reading `Math.random` too, so the
  same tape built a different flock every run. It takes `seed` now. Half the
  fix is a trap and the tests say so: seeding the scatter alone leaves a flock
  reproducible for exactly **one tick**, because `Wander` advances its angle by
  a random step every tick — re-injecting the unseeded `Wander` alone fails
  exactly one test.

### Also

- A determinism test that was measuring nothing, recorded because it was more
  convincing than the bug. It stepped the world with `world.fixedUpdate(0.02)`;
  `World.fixedUpdate` takes a `Time`, not a number, and `MotionAgent`
  integrates in `update` — so it typechecked nowhere, ran fine under vitest,
  and moved nothing at all. Every assertion passed on a world that never
  changed. The suite now opens with a guard asserting the flock travels and
  nothing has gone to `NaN`.

## [0.43.0] — 2026-07-30

### Added

- **Dialogue** — a conversation as data. `Dialogue`, `defineDialogue`,
  `parseDialogue` (versioned, with migrations, like `Level`), and a JSON
  condition/effect vocabulary: `is`/`not`/`all`/`any`/`eq`/`ne`/`gte`/`lt` plus
  `{ pred: name }` resolved against predicates you register — the same seam
  `Catalog` uses for level kinds. Effects are `set`, `inc`, `emit`.

  The conditions are data rather than functions *so that they can be read*,
  which is what makes the next item possible.

- **`lintDialogue`** — the payoff. Dangling links, empty lines, unknown
  predicates and **variables read but never written or declared** are errors;
  unreachable nodes, strandable choice lists, unread variables and duplicated
  choice text are warnings. `counts.nodes !== counts.reachable` is a bug, which
  makes it a gate rather than a report.

- **Hidden vs locked choices.** A failing `if` hides a choice; add `locked` and
  it shows greyed. A hidden choice keeps a secret, a locked one teaches — both
  are wanted, and a system with only one forces authors to fake the other.

- **Mid-conversation save.** `toJSON()` is `{ at, vars, visited }`, straight
  into a `SaveSlot`. `restore` deliberately does not re-fire the entering
  effects — they ran before the save, and replaying them would double every
  `inc` on each load.

- **`counts`** — exact `{ lines, choices, events }`, so a conversation is
  testable as a walk. The playground example is verified in CI by *walking* it:
  click the option that asks his name, advance, assert the option is gone.

- A playground example — a bridge toll you can actually negotiate, with a live
  lint report — and [docs/dialogue.md](docs/dialogue.md).

### Notes

Two things found while building the demo, both documented rather than hidden.
Indices must resolve against the **presented** choice list, not the authored
array — the two differ the moment a condition filters anything, and a test pins
it. And the obvious "hidden option plus locked hint carrying the same
condition" idiom is a trap: when the condition passes, both rows appear and the
hint leads nowhere. One choice, locked, is the answer.

## [0.42.0] — 2026-07-30

### Added

- **`npm run bench:throughput`** — absolute milliseconds per frame against
  agent count, deliberately *not* a gate. A regression gate asks "did this get
  worse" and is blind to code that was always slow, because the baseline came
  from that same slow code. This asks how many you can actually have.

### Fixed

- **`SpatialGrid` was slower than brute force below ~1300 agents.** It keyed
  cells with `"x,y,z"` strings — a concatenation and a string hash per agent
  per rebuild, and per cell per query, so a query sweeping 27 cells built 27
  strings to do 27 lookups. At 400 agents, the size of the shipped flock
  example, the "fast" broadphase was 2× slower than comparing every agent to
  every other one. Coordinates now pack into one integer: 2.5× faster at every
  size, and the crossover moved to ~500 agents.

  | agents | plain array | grid before | grid after |
  |---|---|---|---|
  | 100 | 0.30 ms | 2.04 ms | 0.78 ms |
  | 500 | 5.05 ms | 10.98 ms | 4.52 ms |
  | 1000 | 25.67 ms | 23.45 ms | 8.83 ms |
  | 2000 | 91.89 ms | 50.18 ms | 19.78 ms |

  The exact counters are the proof this changed cost and not behaviour:
  `cellsVisited`, `tested` and `found` are byte-identical across the fix.

- **`createFlock` used the grid at its own default size.** The default is 100
  boids, which is the pessimal case — the template now uses a plain array
  below 500 agents and skips the per-frame rebuild entirely.

### Changed

- The docs said "for hundreds, use the spatial hash". They now publish the
  measured crossover and say an array is faster and simpler below ~500 agents.
  Better asymptotics are not the same thing as faster.

## [0.41.1] — 2026-07-30

### Added

- **CI** (`.github/workflows/ci.yml`): four jobs on every push and pull request
  — typecheck/tests/build/manifest, then netcode over real sockets, perf
  counters, and a browser job that verifies every playground example, drives
  the editor, plays the game, and checks the render budgets. Screenshots are
  uploaded as an artifact on every run, because on a failure they are the
  difference between "something is wrong" and seeing the black frame.
- **This changelog**, and it now ships in the npm tarball.
- `node bench/run.mjs --counters-only` — gate the exact counters, report the
  timings without failing on them. What CI uses, and why is in
  [docs/perf.md](docs/perf.md).

### Fixed

- The headless verification scripts only found Playwright at a hardcoded global
  path, so `verify:playgrounds`, `verify:editor`, `bench:render` and the game's
  verifier could not run on a fresh clone. `playwright` is a devDependency now;
  the global paths remain as a fallback.

## [0.41.0] — 2026-07-30

### Added

- **The perf gate.** Two committed baselines and two gates: `npm run bench`
  (11 cases in Node) and `npm run bench:render` (5 scenes in headless
  Chromium). `npm run perf` runs both. Times are stored as ratios to a
  calibration case so the baseline is portable; counters are exact and are the
  real gate. See [docs/perf.md](docs/perf.md).
- **`SpatialGrid.stats`** — `queries`, `cellsVisited`, `cellsOccupied`,
  `tested`, `found`, plus `cellCount` and `resetStats()`. Reset on each
  `rebuild()`, so reading them at the end of a frame describes that frame.
  `cellsVisited / queries` says whether `cellSize` is sane; `tested / found`
  says how selective the cells are.

### Fixed

- **The netcode's input buffer was steered up to from empty, never primed.**
  The send-rate steering has ±15% authority on purpose — its job is clock
  drift, not cold-starting — so filling an empty buffer took about a second,
  and for that whole second one late input made the server run dry, repeat the
  last input, and cost the client a correction. It surfaced as `net:check`
  failing roughly one run in eight with one misprediction on *both* clients at
  the same instant. `NetClient` now seeds its accumulator at welcome so the
  first batch of inputs goes out `bufferTarget` deep.
- **The perf gate's own normalisation was adding noise.** Keeping the smallest
  per-sample `case ÷ calibration` selects the sample whose *denominator* was
  worst. On unchanged code the case's own time was stable to 4% while
  min-of-ratios swung 31%. Now `min(case) ÷ min(calibration)`.

### Notes

The gate was validated by injecting deliberate regressions and watching it
fail — and the first one **got through**, because the broadphase counter
measured neighbours *found* rather than cells *scanned*. That is why
`SpatialGrid.stats` exists.

## [0.40.0] — 2026-07-30

### Added

- **`gama3d/net`** — an authoritative server (`NetServer`), a predicting
  client (`NetClient`), and the three mechanisms that make a networked game
  playable: client-side prediction, reconciliation by replaying unacknowledged
  inputs, and entity interpolation behind server time.
- Transports as a four-member interface: `WebSocketTransport`, a **simulated**
  `Link`/`LoopbackTransport` with latency, jitter, seeded packet loss and no
  timers anywhere, and `BroadcastChannelTransport` for two tabs with no server.
- Per-client delta snapshots, one input applied per tick per client, brief
  repeat of a missing input, and send-rate steering against the queue depth the
  server reports.
- A reference server (`scripts/net-server.mjs`, hand-rolled WebSocket, no
  dependencies) and `npm run net:check`, which drives two real clients over
  real sockets.

### Notes

Six bugs found by measurement, all documented in [docs/net.md](docs/net.md) —
including a dropped handshake that left a client sending exactly one packet
forever, and an ack processed only when the client's own entity appeared in a
delta, so a player standing still accumulated 24 unacknowledged inputs.

## [0.39.0] — 2026-07-30

### Added

- **The asset pipeline.** `scripts/assets.mjs` generates a manifest (keys,
  byte sizes, groups, content hashes) with `--check`, `--types`, `--budget`
  and `--strict`; `AssetLibrary` loads it with byte-weighted progress,
  deduplicated and reference-counted loads, shared instances, and
  `release(group)`.
- `library.factory(key)` so a level file can place a loaded model, with a
  deliberately no-op `dispose` — the clone's geometry belongs to the library.

### Fixed

- Base paths stacked: `openAssets('./assets/manifest.json')` plus a manifest
  `base: './assets/'` produced `./assets/./assets/crate.gltf`. Precedence is
  now caller → manifest → the manifest's own directory.

## [0.38.1] / [0.38.2] — 2026-07-29

Packaging iterations of the same work: building Havenbrook's own editor on top
of `gama3d/editor`, which is what turned up the leak below.

### Fixed

- The editor's `gizmos.clear()` detached its BoxHelpers without disposing
  them. Found only because the leak harness was fixed first: it had been
  measuring the *camera*, since the renderer registers geometries it draws and
  a baseline taken while half the scene was culled makes the first rebuild look
  like a leak.

## [0.38.0] — 2026-07-29

### Added

- **`gama3d/editor`** — `mountEditor(options)` returns an `EditorSession`:
  viewport, palette, inspector, history, storage and chrome, over *your* own
  catalog. The whole tool in one call.
- **Resource release** — `claimsOwnership(source)`, `releaseObject`,
  `releaseMaterial`. The ownership contract: if a factory's return has its own
  `dispose()`, that is called and nothing else is touched; otherwise the
  subtree is traversed and freed. Used by `Level` release and by
  `AssetLibrary.factory()`.
- `docs/workflow.md` — the catalog seam: how GAMA, SCENA and ANIMA compose into
  one game without importing each other.

## [0.37.0] — 2026-07-29

### Added

- **`Editor`** — selection (`select`/`selectAll`/`selectNext`/`pick`),
  transforms (`move`/`rotate`/`scaleBy`/`ground`), structure
  (`place`/`duplicate`/`remove`/`setProps`/`setTags`), and an undo stack that
  merges a drag into one step.
- `Catalog` kind metadata: `label`, `group`, `fields` and `info(kind)`, so a
  palette and an inspector can be generated rather than hand-written.
- `LevelInstance` slots: `specs`, `add(spec, index?)`, `remove(id)`,
  `indexOf(id)`.

### Fixed

- Multi-delete undo restored entities one slot early — indices were read inside
  the removal loop, against a list the previous delete had already shortened.
- `pick` raycast ran against a stale `matrixWorld`, because nothing computes one
  between renders.
- `Catalog.list()` returned kinds alphabetically, so palettes read
  Markers/Dressing/Light before Buildings. Definition order now.

## [0.36.0] — 2026-07-29

### Added

- **Levels**: a `Catalog` of named kinds, prefabs as recipes rather than blobs,
  a JSON format that stores *placements* not geometry, derived seeds, preserved
  unknown kinds, and migrations. `instantiate` / `toJSON` round trip.

## [0.35.0] — 2026-07-29

### Added

- **`Shell`** — the part of a game that is not the game: menu, settings,
  pause, results, save, mobile input.
- Two project templates.

## [0.34.0] — 2026-07-28

### Added

- **Air combat**: `Missiles` (lead pursuit under a hard turn-rate limit with
  speed bleed, so evadability is physics rather than a difficulty slider;
  seeded one-chance flare seduction; pooled instanced) and `LockOn`
  (cone/range/time, no credit for past devotion).

## [0.33.0] — 2026-07-28

Never published; folded into `0.34.0` on npm.

### Added

- **Hover**: `HoverController` (collective/cyclic/pedals, rotor spool inertia,
  seeded hover breath, sink-rate touchdowns, `helicopterInput` bridge) and
  `rotorVoicing`/`RotorSound` — the wop-wop is amplitude, not pitch.

## [0.32.0] — 2026-07-28

### Added

- **Flight**: `FlightController` — throttle→speed→lift, bank-to-turn, stall as
  a state, taxi/rotate/flare/touchdown with sink-rate events, plus `apply()`
  and `aircraftInput` bridges.

## [0.31.0] — 2026-07-28

### Added

- **Light as gameplay**: `Illumination` (a field of structural sources with
  live litness, pure math), `Flashlight` (battery drama, seeded gutter, cone
  reveal with angular slack), `MoodGrade` (structural rig targets, seamless
  interrupted blends).

## [0.30.0] — 2026-07-28

### Added

- **`PlatformerController`** — sub-stepped gravity, walls and ceilings, coyote
  time, jump buffering, variable jump height, moving-platform carry — and the
  coin-run example that justifies each one.

## [0.29.0] — 2026-07-28

### Added

- **Retention**: `GameFlow` (a legal-move state machine, `gate()` as the
  pause), `Objectives` (clamped progress, once-only completion), `SaveSlot`
  (versioned envelope, corruption-safe, null-means-null), and
  `GhostRecorder`/`GhostTape`/`Ghost` — fixed-interval tapes with seam-safe yaw
  playback, so you can race yesterday's you.

## [0.28.0] — 2026-07-28

### Added

- **Opposition**: `Harass` steering (ring + band + seeded strafe) and
  `WaveDirector` (trickle spawns, rest beats, escalation under a ceiling,
  rubber-band pressure).

## [0.27.0] — 2026-07-28

### Added

- **Stakes**: `Health` (i-frames, death as a one-shot edge, revive with a mercy
  window, computed knockback) and `Projectiles` (pooled tracers, structural
  targets, team filtering).

## [0.26.0] — 2026-07-28

### Added

- **The pickup loop**: `Collector` (structural pickups and fields, respawn
  scheduling) and `CheckpointRun` (ordered gates, laps, `setState` painting).

## [0.25.0] — 2026-07-28

### Added

- **`GameFeel`** — trauma-squared screen shake, hit-stop, slow-motion with
  ease-back, haptic rumble.
- **`Hud`** — a DOM overlay: score, timer, hearts, banner, objective, prompt,
  a `Soundboard` caption line, and a canvas radar.

## [0.24.0] — 2026-07-28

### Added

- **Procedural audio** (`Soundboard`): sample-free synthesized SFX from a seed,
  engine/weather/crowd beds, continuous sources, buses and ducking, captions,
  and offline-render verification.

### Changed

- three.js pinned to r185 for development, with the site's vendor bundle split
  fixed to match.

## [0.23.0] — 2026-07-27

### Added

- Seven cricket strokes, and a bat that has to be there for any of them to
  mean anything.

## [0.22.0] — 2026-07-27

### Added

- **`CricketMatch`** — a match as rules and a ball: ball flight, a timing
  window, laws-accurate scoring.

## [0.21.0] — 2026-07-25

### Added

- **`Recipe`** — what to do next.

## [0.20.0] — 2026-07-25

### Added

- **`Automation`** — devices wired to each other.

## [0.19.0] — 2026-07-25

### Added

- **`Queue`** — who is next.

## [0.18.0] — 2026-07-25

### Added

- **`Attention`** — the first thing in the world that interrupts you.

## [0.17.0] — 2026-07-25

### Added

- **`Device`** — powered things take time to become powered.

## [0.16.0] — 2026-07-24

### Added

- **`RideController`** — a horse is not a car.

### Fixed

- The site's vendor bundles are stamped with a build digest, so the playground
  stops serving stale code from cache. An import map has nowhere to put a
  content hash, so the digest hangs off the import-map URLs.

## [0.15.0] — 2026-07-24

### Added

- **`Occupancy`** — who sits where, and the manners of choosing.

## [0.14.0] — 2026-07-24

### Added

- **`Stockpile`** — a resource counter, the produce-something payoff.

## [0.13.0] — 2026-07-24

### Added

- **`throwObject`** — the ballistic release half of the carry verb.

## [0.12.0] — 2026-07-24

### Added

- **Mechanisms & interaction** — the "operate and the world responds" verb.

## [0.11.0] — 2026-07-24

### Added

- **`createRace`** — the whole racer packaged: assembly, rival collision,
  finish and standings.

## [0.10.0] — 2026-07-24

### Added

- **The motion pillar**: touch controls, `VehicleController`, `driveVehicle`,
  `ChaseCamera`, collision pushback, `Circuit`, and a racing template.

## [0.9.0] — 2026-07-21

### Added

- **`gama3d/templates`** — third-person and top-down players, guard/companion/
  flock NPC archetypes, and `Locomotion` animation glue.
- npm publish metadata: repository, homepage, `sideEffects`,
  `prepublishOnly`.

### Changed

- **The npm package is `gama3d`**, not `gama` — the short name was taken on the
  registry. Imports change accordingly.

## [0.8.0] — 2026-07-20

### Added

- The documentation site with a live, editable playground (`npm run site:dev`),
  and `npm run site:publish` to deploy it to the `docs` branch.

## [0.7.0] — 2026-07-20

### Added

- **`gama3d/react`** — react-three-fiber bindings: an Entity/GameObject bridge,
  component hooks, and a flock grid.

## [0.6.0] — 2026-07-20

### Added

- Orbit and shoulder camera rigs (drag-orbit, pointer-lock mouse look, occlusion
  handling).
- `generateNavMesh` — navmesh generation from level geometry, with grid
  sampling and slope/step/radius rules.

## [0.5.0] — 2026-07-20

### Added

- **Behavior trees** — reactive composites, decorators, typed contexts, and a
  `BehaviorTree` component.

## [0.4.0] — 2026-07-20

### Added

- **`gama3d/rapier`** — an optional physics adapter: rigid bodies and a physics
  character controller, behind its own entry point so it costs nothing unused.

## [0.3.0] — 2026-07-20

### Added

- **Navmesh pathfinding** — `NavMesh` (A* plus funnel smoothing) and
  `NavMeshAgent.goTo(point)`.

## [0.2.0] — 2026-07-20

### Added

- `SpatialGrid` for `Separation`/`Alignment`/`Cohesion` neighbour queries at
  scale, `ObstacleAvoidance` and `Containment` steering, gamepad and
  named-action input mapping, an audio manager, a debug overlay, object
  pooling, collision enter/exit events, and a fixed-timestep option.

## [0.1.0] — 2026-07-20

### Added

- GAMA: a game loop, entities and components, motion agents and steering
  behaviours, on top of three.js.
