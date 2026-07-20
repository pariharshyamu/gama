// gama/react — optional react-three-fiber bindings.
// Import from 'gama/react'; requires the optional peer dependencies:
//   npm install react @react-three/fiber
//
// Design: r3f owns the renderer, scene and frame loop, so there is no Game
// here. <GamaProvider> ticks real GameObjects from useFrame, and <Entity>
// mounts a genuine GameObject into the r3f tree — which means every GAMA
// Component (MotionAgent, NavMeshAgent, BehaviorTree, Animator, ...) works
// unchanged inside React via useComponent.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type DependencyList,
  type ReactNode,
} from 'react';
import { useFrame } from '@react-three/fiber';
import { GameObject } from './core/GameObject';
import { Time } from './core/Time';
import { Tweens } from './animation/Tween';
import { MotionAgent } from './motion/MotionAgent';
import { SpatialGrid } from './motion/SpatialGrid';
import { CollisionSystem } from './physics/CollisionSystem';
import type { Component } from './core/Component';

export interface GamaWorld {
  /** All mounted Entity GameObjects. */
  entities: Set<GameObject>;
  /** Frame timing shared by every entity update. */
  time: Time;
  /** A shared tween group, updated every frame. */
  tweens: Tweens;
}

const GamaContext = createContext<GamaWorld | null>(null);
const EntityContext = createContext<GameObject | null>(null);

export interface GamaProviderProps {
  children?: ReactNode;
  /** Run a CollisionSystem sweep each frame, emitting collision-enter/exit
   *  events on entities with colliders. Default false. */
  collisions?: boolean;
  /** Clamp on the per-frame delta in seconds. Default 0.1. */
  maxDelta?: number;
}

/**
 * Mount once inside `<Canvas>`. Ticks every `<Entity>`'s components and the
 * shared tween group from r3f's frame loop.
 *
 * ```tsx
 * <Canvas>
 *   <GamaProvider>
 *     <Enemy target={playerRef} />
 *   </GamaProvider>
 * </Canvas>
 * ```
 */
export function GamaProvider({ children, collisions = false, maxDelta = 0.1 }: GamaProviderProps) {
  const world = useMemo<GamaWorld>(
    () => ({ entities: new Set(), time: new Time(), tweens: new Tweens() }),
    []
  );
  const collisionSystem = useMemo(() => new CollisionSystem(), []);

  useFrame((_state, delta) => {
    const { time, entities, tweens } = world;
    time.rawDelta = delta;
    time.delta = Math.min(delta, maxDelta) * time.scale;
    time.elapsed += time.delta;
    time.frame++;
    for (const entity of entities) {
      if (!entity.destroyed) entity.update(time);
    }
    tweens.update(time.delta);
    if (collisions) collisionSystem.update(entities);
  });

  return <GamaContext.Provider value={world}>{children}</GamaContext.Provider>;
}

/** The GamaWorld from the nearest provider. Throws outside a GamaProvider. */
export function useGama(): GamaWorld {
  const world = useContext(GamaContext);
  if (!world) throw new Error('useGama must be used inside <GamaProvider>');
  return world;
}

export interface EntityProps {
  name?: string;
  /** Initial position (the entity moves itself afterwards). */
  position?: [number, number, number];
  tags?: string[];
  /** Imperative setup: add components, subscribe to events. May return a
   *  cleanup function. Runs once on mount. */
  onInit?: (entity: GameObject) => void | (() => void);
  children?: ReactNode;
}

/**
 * A GAMA GameObject in the r3f tree. Children (meshes, lights, nested
 * elements) become its Object3D children; components attached via
 * `useComponent` or `onInit` are ticked by the provider.
 *
 * ```tsx
 * <Entity position={[10, 0, 10]} onInit={(e) => {
 *   e.addComponent(new MotionAgent({ maxSpeed: 5 }))
 *     .addBehavior(new Seek(target));
 * }}>
 *   <mesh><boxGeometry /><meshStandardMaterial color="tomato" /></mesh>
 * </Entity>
 * ```
 */
export function Entity({ name, position, tags, onInit, children }: EntityProps) {
  const { entities } = useGama();
  const entity = useMemo(() => {
    const gameObject = new GameObject(name);
    if (position) gameObject.position.set(position[0], position[1], position[2]);
    if (tags) for (const tag of tags) gameObject.tags.add(tag);
    return gameObject;
    // Recreating on prop change would drop runtime state; props are initial-only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    entity.destroyed = false;
    entities.add(entity);
    const cleanup = onInit?.(entity);
    return () => {
      cleanup?.();
      entities.delete(entity);
      entity.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity, entities]);

  return (
    <primitive object={entity} dispose={null}>
      <EntityContext.Provider value={entity}>{children}</EntityContext.Provider>
    </primitive>
  );
}

/** The enclosing Entity's GameObject. Throws outside an <Entity>. */
export function useEntity(): GameObject {
  const entity = useContext(EntityContext);
  if (!entity) throw new Error('useEntity must be used inside <Entity>');
  return entity;
}

/**
 * Attach a GAMA Component to the enclosing Entity for this hook's
 * lifetime — added (onAttach) on mount, removed (onDetach) on unmount.
 *
 * ```tsx
 * function Chaser({ target }: { target: Vector3 }) {
 *   const agent = useComponent(() => new MotionAgent({ maxSpeed: 5, planar: true }));
 *   useEffect(() => {
 *     const seek = new Seek(target);
 *     agent.addBehavior(seek);
 *     return () => agent.removeBehavior(seek);
 *   }, [agent, target]);
 *   return null; // render nothing; sibling meshes are the visual
 * }
 * ```
 */
export function useComponent<T extends Component>(factory: () => T, deps: DependencyList = []): T {
  const entity = useEntity();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const component = useMemo(factory, deps);
  useEffect(() => {
    entity.addComponent(component);
    return () => entity.removeComponent(component);
  }, [entity, component]);
  return component;
}

/**
 * A live Neighbors source over every mounted entity's MotionAgent —
 * plug straight into Separation/Alignment/Cohesion for small flocks.
 * For hundreds of agents prefer `useFlockGrid`.
 */
export function useAgentNeighbors(): () => MotionAgent[] {
  const { entities } = useGama();
  return useMemo(() => {
    const out: MotionAgent[] = [];
    return () => {
      out.length = 0;
      for (const entity of entities) {
        const agent = entity.getComponent(MotionAgent);
        if (agent) out.push(agent);
      }
      return out;
    };
  }, [entities]);
}

/**
 * A SpatialGrid rebuilt each frame from every mounted entity's
 * MotionAgent — near-O(n) neighbor queries for large flocks:
 *
 * ```tsx
 * const grid = useFlockGrid(4);
 * // inside an entity: agent.addBehavior(new Separation(grid.near(agent, 2), 2))
 * ```
 */
export function useFlockGrid(cellSize = 5): SpatialGrid {
  const { entities } = useGama();
  const grid = useMemo(() => new SpatialGrid(cellSize), [cellSize]);
  const agents = useMemo<MotionAgent[]>(() => [], []);
  useFrame(() => {
    agents.length = 0;
    for (const entity of entities) {
      const agent = entity.getComponent(MotionAgent);
      if (agent) agents.push(agent);
    }
    grid.rebuild(agents);
  });
  return grid;
}

/** The provider's shared Tweens group (updated every frame). */
export function useTweens(): Tweens {
  return useGama().tweens;
}
