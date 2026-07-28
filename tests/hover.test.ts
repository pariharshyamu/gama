import { describe, expect, it, vi } from 'vitest';
import { Object3D } from 'three';
import { HoverController, rotorVoicing } from '../src';

const run = (hover: HoverController, seconds: number, each?: () => void): void => {
  for (let t = 0; t < seconds; t += 1 / 60) {
    each?.();
    hover.update(1 / 60);
  }
};

describe('HoverController', () => {
  it('nothing lifts until the rotor is spooled and singing', () => {
    const onTakeoff = vi.fn();
    const hover = new HoverController({ onTakeoff });
    hover.control({ collective: 1 }); // yank the collective on a cold ship
    run(hover, 2);
    expect(hover.grounded).toBe(true); // the rotor is still a sculpture
    expect(onTakeoff).not.toHaveBeenCalled();
    hover.spool = 1;
    run(hover, 4, () => hover.control({ collective: 1 }));
    expect(onTakeoff).toHaveBeenCalledTimes(1);
    expect(hover.grounded).toBe(false);
    expect(hover.position.y).toBeGreaterThan(1);
  });

  it('a hands-off hover BREATHES — bounded, and the same for the same seed', () => {
    const lift = (seed: number): HoverController => {
      const hover = new HoverController({ seed, drift: 0.4 });
      hover.spool = 1;
      run(hover, 4, () => hover.control({ collective: 0.8 }));
      hover.control({ collective: 0, cyclicPitch: 0, cyclicRoll: 0 });
      return hover;
    };
    const a = lift(7);
    const homeX = a.position.x;
    const homeZ = a.position.z;
    run(a, 12);
    const wander = Math.hypot(a.position.x - homeX, a.position.z - homeZ);
    expect(wander).toBeGreaterThan(0.005); // it moved — no screenshot hovers
    expect(wander).toBeLessThan(3); // but it BREATHED, it didn't leave

    const b = lift(7);
    run(b, 12);
    expect(b.position.x).toBeCloseTo(a.position.x, 6); // same seed, same breath
    const c = lift(11);
    run(c, 12);
    expect(c.position.x).not.toBeCloseTo(a.position.x, 4);
  });

  it('cyclic translates in the HEADING frame; pedals turn the frame', () => {
    const hover = new HoverController({ drift: 0 });
    hover.spool = 1;
    run(hover, 4, () => hover.control({ collective: 0.8 }));
    hover.heading = Math.PI / 2; // nose along +x
    hover.control({ collective: 0, cyclicPitch: 1 }); // "forward"
    run(hover, 3);
    expect(hover.position.x).toBeGreaterThan(4); // forward IS +x now
    expect(Math.abs(hover.position.z)).toBeLessThan(1.5);

    const before = hover.heading;
    hover.control({ collective: 0, pedal: -1 });
    run(hover, 1);
    expect(hover.heading).toBeLessThan(before);
  });

  it('descends onto the ground and reports the sink for the skids', () => {
    const onLand = vi.fn();
    const hover = new HoverController({ onLand, drift: 0 });
    hover.spool = 1;
    run(hover, 5, () => hover.control({ collective: 0.9 }));
    run(hover, 30, () => hover.control({ collective: -0.35 })); // a gentle letdown
    expect(onLand).toHaveBeenCalledTimes(1);
    expect(hover.grounded).toBe(true);
    const sink = onLand.mock.calls[0][0] as number;
    expect(sink).toBeGreaterThan(0);
    expect(sink).toBeLessThan(2.2); // skids intact

    // apply(): the airframe leans into travel only when airborne.
    const frame = new Object3D();
    hover.apply(frame);
    expect(frame.position.y).toBe(0);
    expect(frame.rotation.x).toBeCloseTo(0); // grounded ships sit flat (−0 counts)
    expect(hover.helicopterInput.rotor).toBe(1); // the SCENA bridge mirrors spool
  });
});

describe('rotorVoicing', () => {
  it('the chop rate is rev/s × blades — the blade count IS the voice', () => {
    expect(rotorVoicing(300, 3).chopHz).toBeCloseTo(15);
    expect(rotorVoicing(300, 2).chopHz).toBeCloseTo(10);
    expect(rotorVoicing(600, 4).chopHz).toBeCloseTo(40);
    expect(rotorVoicing(0, 3).chopHz).toBe(0);
    expect(rotorVoicing(-50, 3).chopHz).toBe(0); // clamped, not imaginary
    expect(rotorVoicing(10_000, 3).chopHz).toBeCloseTo(30); // rpm capped at 600
    expect(rotorVoicing(300, 99).chopHz).toBeCloseTo(30); // blades capped at 6
  });

  it('everything rises with rpm, and the chop never fully silences the noise', () => {
    const idle = rotorVoicing(80);
    const flight = rotorVoicing(400);
    expect(flight.noiseGain).toBeGreaterThan(idle.noiseGain);
    expect(flight.whineGain).toBeGreaterThan(idle.whineGain);
    expect(flight.bodyFreq).toBeGreaterThan(idle.bodyFreq);
    expect(flight.chopDepth).toBeLessThanOrEqual(0.85); // depth 1 would gate to zero
  });
});
