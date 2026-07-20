import { Vector3 } from 'three';
import { Component } from '../core/Component';
import type { Time } from '../core/Time';
import { MotionAgent } from '../motion/MotionAgent';
import { Path } from '../motion/Path';
import { FollowPath } from '../motion/steering';
import type { NavMesh } from './NavMesh';

export interface NavMeshAgentOptions {
  /** Distance at which intermediate waypoints count as reached. Default 0.6. */
  waypointRadius?: number;
  /** Distance at which the destination counts as reached. Default 0.5. */
  arriveRadius?: number;
}

/**
 * Navmesh-driven movement for a MotionAgent: `goTo(point)` finds a path,
 * feeds it to a FollowPath behavior, and emits a `nav-arrived` event on
 * the owner when the destination is reached.
 *
 * Requires a MotionAgent on the same GameObject (add it first).
 *
 * ```ts
 * enemy.addComponent(new MotionAgent({ maxSpeed: 5, planar: true }));
 * const nav = enemy.addComponent(new NavMeshAgent(navMesh));
 * nav.goTo(player.position);
 * enemy.events.on('nav-arrived', () => attack());
 * ```
 *
 * The path is computed once per `goTo` — for a moving target, call `goTo`
 * again on an interval (repathing every 0.25–0.5 s is plenty for chase
 * behavior and keeps costs predictable).
 */
export class NavMeshAgent extends Component {
  readonly destination = new Vector3();
  waypointRadius: number;
  arriveRadius: number;
  /** Waypoints of the path currently being followed (readonly use). */
  currentPath: Vector3[] | null = null;

  private agent!: MotionAgent;
  private behavior: FollowPath | null = null;

  constructor(public navMesh: NavMesh, options: NavMeshAgentOptions = {}) {
    super();
    this.waypointRadius = options.waypointRadius ?? 0.6;
    this.arriveRadius = options.arriveRadius ?? 0.5;
  }

  override onAttach(): void {
    this.agent = this.owner.requireComponent(MotionAgent);
  }

  /**
   * Path to a target point (clamped onto the navmesh). Returns false when
   * no path exists — the agent keeps doing whatever it was doing.
   */
  goTo(target: Vector3): boolean {
    const waypoints = this.navMesh.findPath(this.owner.position, target);
    if (!waypoints) return false;
    this.stop();
    this.currentPath = waypoints;
    this.destination.copy(waypoints[waypoints.length - 1]);
    this.behavior = new FollowPath(new Path(waypoints), this.waypointRadius);
    this.agent.addBehavior(this.behavior);
    return true;
  }

  get isMoving(): boolean {
    return this.behavior !== null;
  }

  /** Abandon the current path (no arrival event). */
  stop(): void {
    if (this.behavior) {
      this.agent.removeBehavior(this.behavior);
      this.behavior = null;
    }
    this.currentPath = null;
  }

  override update(_time: Time): void {
    if (!this.behavior) return;
    if (this.owner.position.distanceTo(this.destination) < this.arriveRadius) {
      this.stop();
      this.owner.events.emit('nav-arrived', this.owner);
    }
  }

  override onDetach(): void {
    this.stop();
  }
}
