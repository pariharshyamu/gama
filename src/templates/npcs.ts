import { Box3, ConeGeometry, Mesh, MeshStandardMaterial, Vector3, type Object3D } from 'three';
import { Rng } from '../core/random';
import {
  Alignment,
  Arrive,
  BehaviorTree,
  Cohesion,
  Component,
  Containment,
  FollowPath,
  MotionAgent,
  Path,
  Separation,
  SpatialGrid,
  Wander,
  Seek,
  action,
  condition,
  reactiveSelector,
  reactiveSequence,
  type GameObject,
} from '../index';
import { attachVisual, type CharacterModel, type GameContext } from './common';

// ---------------------------------------------------------------- Guard

export interface GuardOptions {
  /** Patrol waypoints (looped). */
  route: Vector3[];
  /** What the guard watches for. */
  target: Object3D;
  detectRadius?: number;
  /** Hysteresis: chase continues until the target is this far. Default detect × 1.6. */
  giveUpRadius?: number;
  speed?: number;
  model?: CharacterModel;
  color?: number;
  name?: string;
  onSpotted?: (guard: GameObject) => void;
  onLost?: (guard: GameObject) => void;
}

export type GuardMode = 'patrol' | 'chase' | 'return';

export interface Guard {
  object: GameObject;
  agent: MotionAgent;
  tree: BehaviorTree<unknown>;
  readonly mode: GuardMode | null;
  dispose(): void;
}

/**
 * A patrol guard with a reactive behavior tree: follows its route, chases
 * the target inside `detectRadius` (with give-up hysteresis), then walks
 * back to the route. Emits `guard-spotted` / `guard-lost` events on the
 * GameObject, mirrored by the `onSpotted`/`onLost` callbacks.
 */
export function createGuard(game: GameContext, options: GuardOptions): Guard {
  const detect = options.detectRadius ?? 8;
  const giveUp = options.giveUpRadius ?? detect * 1.6;
  const object = game.world.spawn(options.name ?? 'guard');
  object.tags.add('guard');
  attachVisual(object, options.model, options.color ?? 0xf87171);

  const agent = object.addComponent(
    new MotionAgent({ maxSpeed: options.speed ?? 5.5, maxForce: 25, planar: true })
  );
  const path = new Path(options.route.map((p) => p.clone()), true);
  object.position.copy(path.current());

  const state = { mode: null as GuardMode | null };
  const setMode = (mode: GuardMode, behavior: () => Parameters<MotionAgent['addBehavior']>[0]) => {
    if (state.mode === mode) return;
    const was = state.mode;
    state.mode = mode;
    agent.clearBehaviors();
    agent.addBehavior(behavior());
    if (mode === 'chase') {
      object.events.emit('guard-spotted', object);
      options.onSpotted?.(object);
    } else if (was === 'chase') {
      object.events.emit('guard-lost', object);
      options.onLost?.(object);
    }
  };
  const distToTarget = () => object.position.distanceTo(options.target.position);
  const distToRoute = () => object.position.distanceTo(path.current());

  const tree = object.addComponent(
    new BehaviorTree(
      reactiveSelector(
        reactiveSequence(
          condition(() => (state.mode === 'chase' ? distToTarget() < giveUp : distToTarget() < detect)),
          action(() => {
            setMode('chase', () => new Seek(() => options.target.position));
            return 'running';
          })
        ),
        reactiveSequence(
          condition(
            () => (state.mode === 'chase' || state.mode === 'return') && distToRoute() > 2.5
          ),
          action(() => {
            setMode('return', () => new Arrive(path.current().clone(), 3));
            return 'running';
          })
        ),
        action(() => {
          setMode('patrol', () => new FollowPath(path, 1));
          return 'running';
        })
      ),
      state
    )
  );

  return {
    object,
    agent,
    tree,
    get mode() {
      return state.mode;
    },
    dispose: () => object.destroy(),
  };
}

// ------------------------------------------------------------ Companion

export interface CompanionOptions {
  /** Who to follow. */
  owner: Object3D;
  /** Distance kept from the owner. Default 3. */
  followDistance?: number;
  /** Start slowing inside this radius. Default followDistance + 4. */
  slowRadius?: number;
  /** Left this far behind, the companion teleports to catch up. Default 30. */
  teleportDistance?: number;
  speed?: number;
  model?: CharacterModel;
  color?: number;
  name?: string;
}

/** Teleport catch-up: the companion detail everyone forgets. */
class CatchUp extends Component {
  constructor(private target: Object3D, private agent: MotionAgent, private distance: number) {
    super();
  }
  override update(): void {
    if (this.owner.position.distanceTo(this.target.position) > this.distance) {
      this.owner.position.copy(this.target.position).add(new Vector3(1.5, 0, 1.5));
      this.agent.velocity.set(0, 0, 0);
      this.owner.events.emit('companion-teleported', this.owner);
    }
  }
}

export interface Companion {
  object: GameObject;
  agent: MotionAgent;
  dispose(): void;
}

/**
 * A follower that trails its owner at a respectful distance, idles when
 * close, and teleports to catch up when left far behind (emitting
 * `companion-teleported`).
 */
export function createCompanion(game: GameContext, options: CompanionOptions): Companion {
  const follow = options.followDistance ?? 3;
  const object = game.world.spawn(options.name ?? 'companion');
  object.tags.add('companion');
  attachVisual(object, options.model, options.color ?? 0x34d399);
  object.position.copy(options.owner.position).add(new Vector3(-follow, 0, -follow));

  const agent = object.addComponent(
    new MotionAgent({ maxSpeed: options.speed ?? 6.5, maxForce: 30, planar: true })
  );
  agent.addBehavior(
    new Arrive(() => options.owner.position, options.slowRadius ?? follow + 4, follow)
  );
  object.addComponent(new CatchUp(options.owner, agent, options.teleportDistance ?? 30));

  return { object, agent, dispose: () => object.destroy() };
}

// ---------------------------------------------------------------- Flock

export interface FlockOptions {
  count?: number;
  /** Containment volume. Default a 36×12×36 box centered at origin. */
  bounds?: Box3;
  color?: number;
  maxSpeed?: number;
  /** Extra behaviors per boid (e.g. Flee from a predator). */
  extraBehaviors?: (agent: MotionAgent) => void;
  name?: string;
  /**
   * Seed for the scatter and the wander. Default 1.
   *
   * It used to be `Math.random`, which meant a flock could not be replayed,
   * saved, or reproduced from a bug report — the same tape built a different
   * flock every run. Found by `tests/replay.test.ts`, which is the kind of
   * defect a per-tick checksum exists to make visible.
   */
  seed?: number;
}

export interface Flock {
  objects: GameObject[];
  agents: MotionAgent[];
  grid: SpatialGrid;
  dispose(): void;
}

/**
 * Below this, neighbours come from a plain array instead of the grid.
 *
 * The spatial hash is not free — it trades a per-agent rebuild every frame
 * for fewer comparisons — and a small flock does not have enough comparisons
 * to pay for the rebuild. Measured (`npm run bench:throughput`): at 100
 * agents an array costs 0.30 ms a frame and the grid 0.78 ms; they cross over
 * around 500. The default flock is 100, so using the grid unconditionally
 * made the common case more than twice as slow in the name of scaling.
 */
const GRID_WORTH_IT = 500;

/**
 * A complete boid flock in one call: cones, MotionAgents with the classic
 * separation/alignment/cohesion trio + wander + containment, and — only when
 * the count justifies it — a SpatialGrid rebuilt once per frame.
 */
export function createFlock(game: GameContext, options: FlockOptions = {}): Flock {
  const count = options.count ?? 100;
  const bounds =
    options.bounds ?? new Box3(new Vector3(-18, 1, -18), new Vector3(18, 12, 18));
  const grid = new SpatialGrid(5);
  const rng = new Rng(options.seed ?? 1);
  const useGrid = count >= GRID_WORTH_IT;
  const agents: MotionAgent[] = [];
  const objects: GameObject[] = [];
  const size = bounds.getSize(new Vector3());
  const geometry = new ConeGeometry(0.18, 0.55, 5);
  const material = new MeshStandardMaterial({ color: options.color ?? 0x34d399 });

  for (let i = 0; i < count; i++) {
    const boid = game.world.spawn(options.name ?? 'boid');
    const mesh = new Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    boid.add(mesh);
    boid.position.set(
      bounds.min.x + rng.next() * size.x,
      bounds.min.y + rng.next() * size.y,
      bounds.min.z + rng.next() * size.z
    );
    const agent = boid.addComponent(
      new MotionAgent({ maxSpeed: options.maxSpeed ?? 6, maxForce: 18 })
    );
    agent.velocity.set(rng.next() - 0.5, 0, rng.next() - 0.5).setLength(3);
    const neighbors = useGrid ? grid.near(agent, 5) : () => agents;
    // The wander's own stream, from the same generator: seeding the scatter
    // alone would make a flock reproducible for exactly one tick.
    agent.addBehavior(new Wander(3, 1.5, 4, rng.stream), 0.6);
    agent.addBehavior(new Separation(neighbors, 1.4), 1.8);
    agent.addBehavior(new Alignment(neighbors, 4), 1);
    agent.addBehavior(new Cohesion(neighbors, 5), 0.7);
    agent.addBehavior(new Containment(bounds, 4), 2);
    options.extraBehaviors?.(agent);
    agents.push(agent);
    objects.push(boid);
  }

  // No rebuild when nothing queries it — that rebuild IS the grid's cost.
  const stopRebuild = useGrid ? game.onUpdate(() => grid.rebuild(agents)) : () => {};

  return {
    objects,
    agents,
    grid,
    dispose() {
      stopRebuild();
      for (const boid of objects) boid.destroy();
    },
  };
}
