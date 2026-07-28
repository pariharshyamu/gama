import { describe, expect, it, vi } from 'vitest';
import { Object3D } from 'three';
import { FlightController } from '../src';

const fly = (
  flight: FlightController,
  seconds: number,
  each?: (t: number) => void
): void => {
  for (let t = 0; t < seconds; t += 1 / 60) {
    each?.(t);
    flight.update(1 / 60);
  }
};

describe('FlightController', () => {
  it('taxis on the rudder, and nothing flies below rotation speed', () => {
    const flight = new FlightController();
    flight.throttle = 0.25; // a gentle taxi
    flight.control({ pitch: 1 }); // yanking the stick does nothing down here
    fly(flight, 4);
    expect(flight.grounded).toBe(true);
    expect(flight.position.y).toBe(0);
    expect(flight.position.z).toBeGreaterThan(5); // rolling forward
    const headingBefore = flight.heading;
    flight.control({ yaw: 1 });
    fly(flight, 1);
    expect(flight.heading).toBeGreaterThan(headingBefore); // rudder steers the wheels
  });

  it('takes off at rotation speed with the stick back, and climbs', () => {
    const onTakeoff = vi.fn();
    const flight = new FlightController({ onTakeoff });
    flight.throttle = 1;
    flight.control({ pitch: 0.5 });
    fly(flight, 8);
    expect(onTakeoff).toHaveBeenCalledTimes(1);
    expect(flight.grounded).toBe(false);
    expect(flight.position.y).toBeGreaterThan(5);
    expect(flight.speed).toBeGreaterThan(20);
  });

  it('stalls below stall speed: the nose drops and the sky lets go', () => {
    const onStall = vi.fn();
    const flight = new FlightController({ onStall, stallSpeed: 12 });
    flight.throttle = 1;
    flight.control({ pitch: 0.5 });
    fly(flight, 8); // up and away
    flight.control({ pitch: 0 });
    fly(flight, 2);
    const cruiseAltitude = flight.position.y;

    flight.throttle = 0; // the engine goes quiet…
    flight.control({ pitch: 0.6 }); // …and holding the nose up only makes it worse
    fly(flight, 10);
    expect(onStall).toHaveBeenCalled();
    expect(flight.stalled || flight.grounded).toBe(true);
    expect(flight.position.y).toBeLessThan(cruiseAltitude); // altitude is not yours anymore
    // Power restores flight — if there's sky left.
    if (!flight.grounded) {
      flight.throttle = 1;
      flight.control({ pitch: 0.3 });
      fly(flight, 6);
      expect(flight.stalled).toBe(false);
      expect(flight.speed).toBeGreaterThan(12);
    }
  });

  it('banks to turn: roll and the heading follows; wings level and it holds', () => {
    const flight = new FlightController();
    flight.throttle = 1;
    flight.control({ pitch: 0.5 });
    fly(flight, 6);
    flight.control({ pitch: 0, roll: 0 });
    fly(flight, 1);
    const straight = flight.heading;
    fly(flight, 2);
    expect(Math.abs(flight.heading - straight)).toBeLessThan(0.02); // level = straight

    flight.control({ roll: 0.7 });
    fly(flight, 1.2);
    expect(flight.bank).toBeGreaterThan(0.4); // right wing down
    flight.control({ roll: 0 }); // centre the stick, hold what's left of the bank
    const before = flight.heading;
    fly(flight, 0.5);
    expect(flight.heading).toBeLessThan(before); // banked right = turning right (-heading)
  });

  it('lands: touchdown reports the sink rate for the caller to judge', () => {
    const onLand = vi.fn();
    const flight = new FlightController({ onLand });
    flight.throttle = 1;
    flight.control({ pitch: 0.5 });
    fly(flight, 7);
    // Chop the power to descend, keep just enough speed to stay flying —
    // and CLOSE the throttle once down, or this becomes nine touch-and-goes.
    let down = false;
    fly(flight, 90, () => {
      if (down || (down = flight.grounded && flight.position.z > 50)) {
        flight.throttle = 0;
        flight.control({ pitch: 0 });
        return;
      }
      // A stabilized approach: the stick is a RATE, so chase a target
      // ATTITUDE proportionally — glide at -0.1, flare to level at 2.5 m.
      flight.throttle = 0.5;
      const targetPitch = flight.position.y > 2.5 ? -0.22 : -0.04; // a flare still descends
      flight.control({ pitch: Math.min(Math.max((targetPitch - flight.pitch) * 4, -1), 1) });
    });
    expect(onLand).toHaveBeenCalledTimes(1);
    expect(flight.grounded).toBe(true);
    const sink = onLand.mock.calls[0][0] as number;
    expect(sink).toBeGreaterThanOrEqual(0);
    expect(sink).toBeLessThan(8); // flared, not lawn-darted
  });

  it('apply() poses an airframe; aircraftInput mirrors the stick for a SCENA plane', () => {
    const flight = new FlightController();
    flight.throttle = 0.8;
    flight.control({ pitch: 0.4, roll: -0.3, yaw: 0.1 });
    flight.update(1);
    const airframe = new Object3D();
    flight.apply(airframe);
    expect(airframe.position.x).toBeCloseTo(flight.position.x);
    expect(airframe.rotation.y).toBeCloseTo(flight.heading, 1);
    const input = flight.aircraftInput;
    expect(input.throttle).toBe(0.8);
    expect(input.pitch).toBeCloseTo(0.4);
    expect(input.roll).toBeCloseTo(-0.3);
    expect(input.gearDown).toBe(true); // on the runway, wheels out
  });
});
