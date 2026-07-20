import { Vector3 } from 'three';

/** An ordered list of waypoints, optionally looping, for FollowPath. */
export class Path {
  private index = 0;

  constructor(public waypoints: Vector3[] = [], public loop = false) {}

  add(point: Vector3): this {
    this.waypoints.push(point);
    return this;
  }

  isEmpty(): boolean {
    return this.waypoints.length === 0;
  }

  current(): Vector3 {
    return this.waypoints[this.index];
  }

  isAtLast(): boolean {
    return this.index === this.waypoints.length - 1;
  }

  advance(): void {
    if (this.isEmpty()) return;
    if (this.index < this.waypoints.length - 1) {
      this.index++;
    } else if (this.loop) {
      this.index = 0;
    }
  }

  reset(): void {
    this.index = 0;
  }
}
