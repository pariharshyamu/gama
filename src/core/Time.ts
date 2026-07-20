/**
 * Frame timing information passed to every update callback.
 * Delta time is clamped so a backgrounded tab does not produce a
 * catastrophic simulation step when the game resumes.
 */
export class Time {
  /** Seconds since the previous frame, clamped to `maxDelta`. */
  delta = 0;
  /** Unclamped seconds since the previous frame. */
  rawDelta = 0;
  /** Seconds since the game started. */
  elapsed = 0;
  /** Number of frames rendered since the game started. */
  frame = 0;
  /** Time scale multiplier applied to `delta` (slow motion / pause). */
  scale = 1;
  /** Upper bound on `delta` in seconds. */
  maxDelta = 1 / 10;

  private last = -1;

  /** Advance timing using a DOMHighResTimeStamp in milliseconds. */
  tick(nowMs: number): void {
    if (this.last < 0) this.last = nowMs;
    this.rawDelta = (nowMs - this.last) / 1000;
    this.last = nowMs;
    this.delta = Math.min(this.rawDelta, this.maxDelta) * this.scale;
    this.elapsed += this.delta;
    this.frame++;
  }

  reset(): void {
    this.last = -1;
    this.delta = 0;
    this.rawDelta = 0;
    this.elapsed = 0;
    this.frame = 0;
  }
}
