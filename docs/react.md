# React: the react-three-fiber bindings

`gama3d/react` brings GAMA's motion/AI layer to
[react-three-fiber](https://docs.pmnd.rs/react-three-fiber) — behind a
separate entry point with optional peer dependencies, so core `gama`
never touches React.

```bash
npm install react @react-three/fiber   # optional peers
```

```tsx
import { GamaProvider, Entity, useComponent } from 'gama3d/react';
```

## Design

r3f owns the renderer, scene and frame loop, so there is no `Game` here.
Instead:

- **`<GamaProvider>`** (mounted inside `<Canvas>`) ticks everything from
  r3f's `useFrame`.
- **`<Entity>`** mounts a *real* `GameObject` into the r3f tree via
  `<primitive>` — its JSX children become Object3D children.

Because entities are genuine GameObjects, **every GAMA component works
unchanged inside React**: `MotionAgent`, `NavMeshAgent`, `BehaviorTree`,
`StateMachine`, `Animator`, colliders — no wrappers per component.

## Basics

```tsx
<Canvas>
  <GamaProvider>
    <Entity position={[10, 0, 10]} onInit={(e) => {
      e.addComponent(new MotionAgent({ maxSpeed: 5, planar: true }))
        .addBehavior(new Seek(target));
    }}>
      <mesh><boxGeometry /><meshStandardMaterial color="tomato" /></mesh>
    </Entity>
  </GamaProvider>
</Canvas>
```

`onInit` runs once on mount and may return a cleanup. For idiomatic React
composition, use hooks inside the entity instead:

```tsx
function Chaser({ target }: { target: Vector3 }) {
  const agent = useComponent(() => new MotionAgent({ maxSpeed: 5, planar: true }));
  useEffect(() => {
    const seek = new Seek(target);
    agent.addBehavior(seek);
    return () => agent.removeBehavior(seek);
  }, [agent, target]);
  return null;
}

<Entity><Chaser target={player.position} /><mesh>…</mesh></Entity>
```

`useComponent` attaches for the hook's lifetime — `onAttach` on mount,
`onDetach` on unmount. `useEntity()` gives any child hook the enclosing
GameObject.

## Hooks

| Hook | Purpose |
|---|---|
| `useGama()` | the provider's world: `entities`, `time`, `tweens` |
| `useEntity()` | the enclosing Entity's GameObject |
| `useComponent(factory, deps?)` | attach a Component for the hook's lifetime |
| `useAgentNeighbors()` | Neighbors source over all mounted agents (small flocks) |
| `useFlockGrid(cellSize?)` | SpatialGrid rebuilt each frame (large flocks) |
| `useTweens()` | shared Tweens group, updated by the provider |

Flocking in JSX:

```tsx
function Boid({ grid }: { grid: SpatialGrid }) {
  const agent = useComponent(() => new MotionAgent({ maxSpeed: 6 }));
  useEffect(() => {
    const neighbors = grid.near(agent, 5);
    agent.addBehavior(new Separation(neighbors, 1.4), 1.8);
    agent.addBehavior(new Alignment(neighbors, 4));
    agent.addBehavior(new Cohesion(neighbors, 5), 0.7);
    return () => agent.clearBehaviors();
  }, [agent, grid]);
  return <mesh>…</mesh>;
}
```

## Collisions & events

`<GamaProvider collisions>` runs a `CollisionSystem` sweep each frame;
entities with colliders get `collision-enter`/`collision-exit` events:

```tsx
<Entity onInit={(e) => {
  e.addComponent(new SphereCollider(0.7));
  const off = e.events.on('collision-enter', (other) => {
    if (other.tags.has('pickup')) collect(other);
  });
  return off;
}}>
```

## Notes

- Entity props (`position`, `name`, `tags`) are **initial-only** — after
  mount, the entity moves itself (that's the point). Drive React state
  *from* the simulation via refs/events, not the other way around.
- Cameras, controls, loaders, postprocessing: use the r3f/drei ecosystem —
  the bindings deliberately cover only what r3f lacks (agents, components,
  events, tweens).
- See `examples/react` (`npm run dev:react`): 120 boids and a pursuing
  chaser, fully declarative.
