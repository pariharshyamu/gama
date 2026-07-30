# Motion agents & steering

The motion layer is GAMA's signature feature: composable steering behaviors
that make NPCs, enemies, flocks and companions move believably.

## MotionAgent

A `Component` that steers its owner. Each frame it:

1. sums the forces of its behaviors (each scaled by its weight),
2. clamps the sum to `maxForce`, divides by `mass`,
3. integrates velocity (clamped to `maxSpeed`), moves the owner,
4. optionally rotates the owner to face travel (`faceVelocity`, `turnRate`).

```ts
const agent = enemy.addComponent(new MotionAgent({
  maxSpeed: 6,     // hard velocity cap
  maxForce: 10,    // hard steering cap — lower = lazier turns
  planar: true,    // lock to the XZ plane (ground units)
}));
agent.addBehavior(new Seek(player.position));          // weight 1
agent.addBehavior(new Separation(() => enemies), 1.5); // weight 1.5
```

`agent.lastSteering` holds the final clamped force each frame — the
`DebugOverlay` draws it so you can see what the agent is "thinking".

## Behavior catalogue

| Behavior | What it does |
|---|---|
| `Seek(target)` | full speed toward a point |
| `Flee(target, panicRadius?)` | full speed away, active within the radius |
| `Arrive(target, slowRadius?, stopRadius?)` | seek that decelerates and stops |
| `Pursue(quarry, maxPrediction?)` | seek a moving agent's predicted position |
| `Evade(pursuer, maxPrediction?, panicRadius?)` | flee a predicted position |
| `Wander(distance?, radius?, jitter?, random?)` | organic meandering |
| `Separation(neighbors, radius?)` | push apart when crowded |
| `Alignment(neighbors, radius?)` | match neighbors' velocity |
| `Cohesion(neighbors, radius?)` | steer toward neighbors' center |
| `FollowPath(path, waypointRadius?)` | traverse waypoints, arrive at the end |
| `ObstacleAvoidance(obstacles, lookAhead?, agentRadius?)` | swerve around spheres |
| `Containment(bounds, margin?)` | stay inside a Box3 |

`target` can be a fixed `Vector3`, a live reference (like `player.position`),
or a getter — so targets can move. Custom behaviors implement one method:

```ts
class Gravity implements SteeringBehavior {
  calculate(agent: MotionAgent) { return new Vector3(0, -9.8 * agent.mass, 0); }
}
```

## Flocking at scale: SpatialGrid

The flocking behaviors take a `Neighbors` source (`() => Iterable<MotionAgent>`).
A plain array works for dozens of agents; for hundreds, use the spatial hash:

```ts
const grid = new SpatialGrid(5);              // cell size ≈ largest query radius
game.onUpdate(() => grid.rebuild(flock));     // once per frame

const neighbors = grid.near(agent, 5);        // bound to the agent, reuses its array
agent.addBehavior(new Separation(neighbors, 1.5), 1.8);
agent.addBehavior(new Alignment(neighbors, 4));
agent.addBehavior(new Cohesion(neighbors, 5), 0.7);
```

The query radius passed to `near` should be ≥ each behavior's own radius —
behaviors filter further themselves. See `examples/flock` for 400 boids.

### Checking that it is actually helping

`cellSize` is the one number that decides whether the grid earns its keep, and
guessing at it is easy. `grid.stats` says what the last frame's queries really
cost:

```ts
game.onUpdate(() => {
  // Last frame's numbers — read them BEFORE the rebuild zeroes them.
  const { queries, cellsVisited, tested, found } = grid.stats;
  if (queries) console.log(cellsVisited / queries, tested / found);
  grid.rebuild(flock);
});
```

- **`cellsVisited / queries`** — cells swept per query. A grid much finer than
  the query radius sweeps a large block, most of it empty: radius 6 over
  `cellSize` 1 is 2197 map lookups to answer one question.
- **`tested / found`** — distance comparisons per neighbour returned. Climbing
  means cells are too coarse and each one drags in agents that get rejected.

Both are exact integers for a given scene, which makes them worth asserting in
a performance test — see [the perf gate](perf.md). A broadphase that scans
more cells to return the same neighbours is invisible in the result and obvious
in `cellsVisited`.

## Obstacle avoidance

```ts
const obstacles: Obstacle[] = [{ center: new Vector3(5, 0, 0), radius: 2 }];
agent.addBehavior(new ObstacleAvoidance(() => obstacles, 4, 0.5), 2.5);
```

The behavior probes ahead along the velocity and applies a *lateral* force
(swerve, not brake). Give it a higher weight than goal-seeking behaviors so
survival beats ambition. Dead-center approaches get a deterministic sideways
nudge so agents never stall on symmetry.

`Containment` complements it as cheap walls:

```ts
agent.addBehavior(new Containment(new Box3(min, max), 3), 2);
```

## Paths

```ts
const path = new Path([a, b, c], /* loop */ true);
agent.addBehavior(new FollowPath(path, 0.5));
```

## Navigation: NavMesh & goTo

Hand-authored paths cover patrol routes; for "walk to this point through
this level", use a navmesh. Feed `NavMesh` the triangles of your walkable
floor — from a `BufferGeometry` you authored/exported, or built in code:

```ts
const nav = NavMesh.fromGeometry(floorGeometry);
// or: new NavMesh(positionsArray, indicesArray?)
```

The mesh welds shared vertices, derives triangle adjacency, and answers
queries: A* finds the triangle corridor, then the funnel algorithm
string-pulls it so paths hug corners instead of zig-zagging between
triangle centers.

```ts
nav.findPath(from, to);      // Vector3[] waypoints, or null if disconnected
nav.closestPoint(p);         // clamp any point onto the walkable surface
nav.toBufferGeometry();      // renderable geometry for debug display
```

`NavMeshAgent` turns that into one call. It requires a `MotionAgent` on the
same object (add it first):

```ts
enemy.addComponent(new MotionAgent({ maxSpeed: 5, planar: true }));
const navAgent = enemy.addComponent(new NavMeshAgent(nav));

navAgent.goTo(clickPoint);                    // false if unreachable
enemy.events.on('nav-arrived', () => attack());
navAgent.stop();                              // abandon (no arrival event)
navAgent.currentPath;                         // waypoints, e.g. to draw a line
```

Paths are computed once per `goTo`. For a moving target, call `goTo` again
on an interval — repathing every 0.25–0.5 s is plenty for chase behavior.
Other steering behaviors compose as usual: give agents `Separation` so
groups don't stack up on the same waypoint. See `examples/navmesh` for
click-to-move with five agents.

### Generating navmeshes from level geometry

Instead of authoring the walkable surface, bake it:

```ts
const nav = generateNavMesh(levelRoot, {
  cellSize: 0.5,     // sampling resolution
  agentRadius: 0.5,  // clearance eroded from edges and obstacles
  maxSlope: Math.PI / 4,
  maxClimb: 0.4,     // step height that still connects cells
});
```

`generateNavMesh` grid-samples the geometry with downward raycasts: the
highest surface in each cell is kept if its slope is walkable, cells near
edges/obstacles are eroded by `agentRadius`, and the result is
triangulated with cliff seams left unwelded — so an obstacle's top
becomes a disconnected island unless a ramp (rising ≤ `maxClimb` per
cell) connects it. `nav.toBufferGeometry()` renders the baked surface for
sanity-checking; `examples/navgen` shows a whole level baked from plain
boxes.

Honest scope: this is **single-layer** sampling — the highest surface
wins, so walkable space *underneath* bridges and floors is not captured.
For multi-layer levels, use a Recast-based pipeline offline and feed its
triangles to `new NavMesh(...)`.

## Decision-making: StateMachine

Steering answers *how* to move; a `StateMachine` component answers *what to
do now*. States typically swap the agent's behaviors on enter:

```ts
const brain = guard.addComponent(new StateMachine({ agent }));
brain.addState({
  name: 'patrol',
  enter: ({ agent }) => { agent.clearBehaviors(); agent.addBehavior(patrolBehavior); },
  update: ({ agent }) => {
    if (agent.position.distanceTo(player.position) < 8) brain.setState('chase');
  },
});
brain.addState({
  name: 'chase',
  enter: ({ agent }) => { agent.clearBehaviors(); agent.addBehavior(new Pursue(playerAgent)); },
  update: ({ agent }) => {
    if (agent.position.distanceTo(player.position) > 15) brain.setState('patrol');
  },
});
brain.setState('patrol');
```

## Decision-making at scale: behavior trees

State machines get unwieldy past ~5 states — every new behavior multiplies
transitions. A behavior tree composes instead: priorities are order,
interruption is built in, and branches are reusable.

```ts
import {
  BehaviorTree, reactiveSelector, reactiveSequence,
  condition, action, cooldown, wait, sequence,
} from 'gama3d';

const tree = new BehaviorTree<Guard>(
  reactiveSelector(
    // Priority 1: fight when the player is visible.
    reactiveSequence(
      condition((g) => g.canSeePlayer()),
      action((g) => { g.chase(); return 'running'; })
    ),
    // Priority 2: investigate the last known position.
    reactiveSequence(
      condition((g) => g.hasLastKnownPosition()),
      action((g) => g.goToLastKnown()),   // boolean or BTStatus
      wait(2),                            // look around
      action((g) => { g.clearLastKnown(); return 'success'; })
    ),
    // Fallback: patrol.
    action((g) => { g.patrol(); return 'running'; })
  ),
  guardContext
);
guard.addComponent(tree);
```

Semantics (matching BehaviorTree.CPP conventions):

- `sequence` / `selector` have **memory**: they resume at their running
  child and do not re-run earlier children.
- `reactiveSequence` / `reactiveSelector` re-tick from the first child
  every tick — conditions are re-checked while later children run, and a
  flipped condition or newly-viable higher branch **interrupts** (resets)
  the running child. Use reactive nodes wherever behavior must be
  abortable; that's usually the root.
- `parallel(children, { successThreshold, failureThreshold })` ticks all
  children per tick.
- Decorators: `invert`, `succeed`, `repeat(node, n)`, `untilFail`,
  `cooldown(node, seconds)` for attack/ability timers, and the `wait(s)`
  leaf.
- Actions return `'success' | 'failure' | 'running'` — or a boolean as
  shorthand. Long-running work returns `'running'` and keeps getting
  ticked.

The typical GAMA pattern: actions swap the MotionAgent's steering
behaviors on mode change and return `'running'`; conditions read
distances and world state. `new BehaviorTree(root, ctx, { interval: 0.1 })`
staggers AI ticks — an easy perf win for crowds, since steering keeps
integrating every frame regardless.

`StateMachine` remains the better fit for genuinely modal logic with few
states (game phases, door open/closed); reach for the tree when an NPC's
"what should I do now?" list grows past a handful of rules. See
`examples/ai` for three patrol guards that chase and give up.

## Tuning tips

- **Jittery agents**: lower `maxForce`, or raise behavior radii so forces
  change less abruptly.
- **Orbiting instead of arriving**: use `Arrive` instead of `Seek` for
  stationary targets.
- **Flock clumps or scatters**: `Separation` weight controls spacing;
  `Cohesion` weight controls togetherness. Start at 1.8 / 0.7 and adjust.
- **Agents clip obstacles**: raise the avoidance weight or `lookAhead`, or
  pad `agentRadius`.
- Turn on `DebugOverlay` and watch the magenta steering arrows while tuning —
  it's the difference between guessing and seeing.
