# Havenbrook Courier

A small 3D delivery game for the browser. Collect a parcel from the cart in
the square, get it to the door the beacon is standing over, and keep going:
**every delivery buys you more time**. The round ends when the clock does.

Play: **[/play](../)** on the GAMA docs site · `npm run dev` here.

## Why this exists

It is the honest test the three libraries had not had. GAMA, SCENA and ANIMA
had 2,391 tests and 115 playground examples between them, and not one line
of code that had to survive a menu, a pause, a settings screen, a saved best
score, a phone, or a player who alt-tabs mid-round. Examples are written to
show a feature working. A game has to work when nobody is demonstrating it.

So this is a separate npm project that depends on the **published** packages:

```json
"anima3d": "^0.37.0",
"gama3d": "^0.34.0",
"scena3d": "^0.102.0"
```

Not a workspace link, not a path dependency. If the packages on the registry
are broken, this build breaks — which is the entire point.

## What each library does here

| | |
|---|---|
| **SCENA** | The village: ring road, spokes, twelve cottages, fountain, well, stalls, the depot cart, trees and fences — all from one integer seed. Also the depot ring and the delivery beacon, and the day cycle that takes a round from afternoon into the dark. |
| **ANIMA** | The courier (procedural gait, foot IK, a flinch when you clip somebody, a small celebration on delivery) and the townsfolk, whose heads turn to watch you go past. |
| **GAMA** | The frame loop and renderer, `GameFlow` for the screen state machine, `Input.moveAxis` folding keyboard/gamepad/touch into one vector, `MotionAgent` + `FollowPath` + `Separation` walking the villagers, `SaveSlot` for settings and best score, `GameFeel` for the knocks, and a `Soundboard` that synthesizes every sound at runtime — there is not one audio file in the build. |

## The design, in one paragraph

One loop, one dial: deliveries buy seconds. That is Crazy Taxi's structure
and it is here because it lets the player set their own difficulty — play
safe and the round ends quietly, take the long address and the clock keeps
paying you. Two things push back so the loop has a shape: the time bonus
decays as deliveries pile up (so a round always ends), and **par time** —
beat it and the streak multiplier grows, dawdle and it resets. Villagers are
the only real obstacle; walking into one costs you two seconds and staggers
you both.

## The seed is the level

There are no level files and no editor. The number in the box on the title
screen generates the entire village — layout, house styles, roof materials,
where the lamps stand. Type a friend's seed and you get their town.

## Building

```bash
npm install
npm run dev      # play it locally
npm run build    # typecheck + bundle to dist/
```

From the repository root, `npm run game:build` builds it into the docs site
under `/play/`, and `npm run site:publish` deploys the site with it.

## What it costs

The whole game — three.js, the parts of all three libraries it touches, the
village generator, every sound — is about **200 KB gzipped**. Tree-shaking
does the work: importing one prop from SCENA costs 19 KB, not the 199 KB the
full namespace would.
