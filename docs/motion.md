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

Notes on scope: this is a *query* system over a mesh you provide — GAMA does
not yet generate navmeshes from arbitrary level geometry (that's Recast-style
voxelization, on the roadmap). Authoring the walkable surface as simple
quads/triangles in code or in Blender covers most game levels.

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
