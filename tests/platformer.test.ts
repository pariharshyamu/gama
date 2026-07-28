import { describe, expect, it, vi } from 'vitest';
import { PlatformerController, type PlatformLike } from '../src';

const ground = (top = 0, x = 0, w = 100): PlatformLike => ({
  center: { x, y: top - 0.5, z: 0 },
  size: { x: w, y: 1, z: 10 },
});

/** Run n frames at a fixed dt. */
const run = (
  body: PlatformerController,
  platforms: PlatformLike[],
  seconds: number,
  dt = 1 / 60,
  each?: () => void
): void => {
  for (let t = 0; t < seconds; t += dt) {
    each?.();
    body.update(dt, platforms);
  }
};

describe('PlatformerController', () => {
  it('falls, lands on the top, and reports the impact', () => {
    const onLand = vi.fn();
    const body = new PlatformerController({ onLand });
    body.teleport(0, 5);
    run(body, [ground()], 2);
    expect(body.grounded).toBe(true);
    expect(body.position.y).toBeCloseTo(0);
    expect(onLand).toHaveBeenCalledTimes(1);
    expect(onLand.mock.calls[0][0]).toBeGreaterThan(10); // 5 m of fall hits hard
  });

  it('jumps to its advertised height; an early release rises less', () => {
    const platforms = [ground()];
    const full = new PlatformerController({ jumpHeight: 2.2 });
    full.teleport(0, 0.01);
    run(full, platforms, 0.5); // settle
    full.jump();
    let apex = 0;
    run(full, platforms, 1.2, 1 / 60, () => (apex = Math.max(apex, full.position.y)));
    expect(apex).toBeGreaterThan(2.0);
    expect(apex).toBeLessThan(2.4);

    const cut = new PlatformerController({ jumpHeight: 2.2 });
    cut.teleport(0, 0.01);
    run(cut, platforms, 0.5);
    cut.jump();
    run(cut, platforms, 0.1);
    cut.release(); // let go almost immediately
    let cutApex = 0;
    run(cut, platforms, 1.2, 1 / 60, () => (cutApex = Math.max(cutApex, cut.position.y)));
    expect(cutApex).toBeLessThan(apex * 0.7); // meaningfully shorter hop
  });

  it('coyote time: the ledge forgives for a moment, then it does not', () => {
    const onFall = vi.fn();
    const ledge = [ground(0, 0, 4)]; // ends at x = 2
    const forgiven = new PlatformerController({ coyoteTime: 0.1, onFall });
    forgiven.teleport(0, 0.01);
    run(forgiven, ledge, 0.3); // settle on the ledge
    forgiven.move(1);
    while (forgiven.grounded) forgiven.update(1 / 60, ledge); // walk off
    expect(onFall).toHaveBeenCalledTimes(1);
    forgiven.update(1 / 60, ledge); // 1 frame into the void
    forgiven.jump();
    forgiven.update(1 / 60, ledge);
    expect(forgiven.velocity.y).toBeGreaterThan(5); // the coyote jump took

    const late = new PlatformerController({ coyoteTime: 0.1 });
    late.teleport(0, 0.01);
    run(late, ledge, 0.3);
    late.move(1);
    while (late.grounded) late.update(1 / 60, ledge);
    run(late, ledge, 0.3); // far past the window
    const before = late.velocity.y;
    late.jump();
    late.update(1 / 60, ledge);
    expect(late.velocity.y).toBeLessThan(before); // still falling — refused
  });

  it('jump buffering: a press just before touchdown jumps on landing', () => {
    const onJump = vi.fn();
    const body = new PlatformerController({ jumpBuffer: 0.15, onJump });
    body.teleport(0, 1.5);
    while (body.position.y > 0.25) body.update(1 / 60, [ground()]); // falling…
    body.jump(); // …press just above the floor, still airborne
    run(body, [ground()], 1);
    expect(onJump).toHaveBeenCalledTimes(1); // fired the moment it landed
  });

  it('moving platforms carry their rider, horizontally and vertically', () => {
    const mover: PlatformLike = {
      center: { x: 0, y: -0.25, z: 0 },
      size: { x: 3, y: 0.5, z: 3 },
      velocity: { x: 1.5, y: 0, z: 0 },
    };
    const body = new PlatformerController();
    body.teleport(0, 0.01);
    const dt = 1 / 60;
    for (let t = 0; t < 2; t += dt) {
      mover.center.x += mover.velocity!.x * dt; // the game moves its platform
      body.update(dt, [mover]);
    }
    expect(body.grounded).toBe(true);
    expect(body.position.x).toBeGreaterThan(2.5); // went along for the ride

    // Vertical: the rider's feet track the rising top.
    mover.velocity = { x: 0, y: 0.8, z: 0 };
    for (let t = 0; t < 1; t += dt) {
      mover.center.y += 0.8 * dt;
      body.update(dt, [mover]);
    }
    expect(body.grounded).toBe(true);
    expect(body.position.y).toBeCloseTo(mover.center.y + 0.25, 1);
  });

  it('ceilings end jumps; walls stop runs (and neither is the floor)', () => {
    const platforms = [
      ground(),
      { center: { x: 0, y: 2.6, z: 0 }, size: { x: 2, y: 0.4, z: 2 } }, // low ceiling
      { center: { x: 3, y: 1.5, z: 0 }, size: { x: 1, y: 3, z: 4 } }, // wall at x = 2.5
    ];
    const body = new PlatformerController({ height: 1.7, radius: 0.35 });
    body.teleport(0, 0.01);
    run(body, platforms, 0.3);
    body.jump();
    let apex = 0;
    run(body, platforms, 1, 1 / 60, () => (apex = Math.max(apex, body.position.y)));
    expect(apex).toBeLessThan(0.75); // 2.2 m jump bonked at ceiling 0.9 − 1.7 head

    body.move(1); // now run at the wall
    run(body, platforms, 2);
    expect(body.position.x).toBeLessThanOrEqual(2.5 - 0.35 + 1e-6);
    expect(body.position.x).toBeGreaterThan(1.9); // got to the wall, not through it
  });

  it('sub-steps: a huge frame delta cannot tunnel through a thin platform', () => {
    const thin: PlatformLike = { center: { x: 0, y: 3, z: 0 }, size: { x: 4, y: 0.2, z: 4 } };
    const body = new PlatformerController();
    body.teleport(0, 8);
    for (let i = 0; i < 6; i++) body.update(0.25, [thin]); // giant frames, falling fast
    expect(body.position.y).toBeGreaterThanOrEqual(3.09); // caught the 3.1 top
    expect(body.grounded).toBe(true);
  });
});
