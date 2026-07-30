import { describe, expect, it, vi } from 'vitest';
import { RailController } from '../src';
import type { RailLine, ScheduledStop } from '../src';

const line = (length: number, loop = false): RailLine => ({ length, loop });

/** Run the driver for `seconds` at `dt`, optionally watching every step. */
const run = (
  driver: RailController,
  seconds: number,
  dt = 1 / 60,
  each?: (t: number) => void
): void => {
  for (let t = 0; t < seconds; t += dt) {
    each?.(t);
    driver.step(dt);
  }
};

describe('RailController', () => {
  describe('stopping distance', () => {
    it('is v² / 2a, and is the distance the train actually takes', () => {
      const driver = new RailController(line(4000), { brake: 0.8 });
      driver.speed = 22;
      expect(driver.stoppingDistance).toBeCloseTo((22 * 22) / (2 * 0.8), 6);
      expect(driver.stoppingDistance).toBeCloseTo(302.5, 1);

      // The claim is only worth anything if braking really takes that far.
      const braking = new RailController(line(4000), { brake: 0.8, buffers: false });
      braking.speed = 22;
      braking.throttle = 0; // ask for a stop
      const from = braking.distance;
      run(braking, 60);
      expect(braking.speed).toBe(0);
      expect(braking.distance - from).toBeCloseTo(302.5, 0);
    });

    it('scales with the square of speed — double the speed, quadruple the distance', () => {
      const driver = new RailController(line(4000));
      driver.speed = 10;
      const slow = driver.stoppingDistance;
      driver.speed = 20;
      expect(driver.stoppingDistance / slow).toBeCloseTo(4, 6);
    });
  });

  describe('the braking law', () => {
    it('lands on the mark exactly, at every step size', () => {
      for (const dt of [1 / 60, 1 / 30, 0.1, 0.25]) {
        const driver = new RailController(line(4000));
        driver.schedule([{ at: 600, dwell: 999, name: 'HAVENBROOK' }]);
        run(driver, 200, dt);
        expect(driver.distance, `dt=${dt}`).toBeCloseTo(600, 6);
        expect(driver.speed, `dt=${dt}`).toBe(0);
      }
    });

    it('reaches the mark in one step, not by shivering against a clamp', () => {
      // The defect the arrival rule exists to kill. Arriving on "distance is
      // there AND speed is nearly zero", with the last step clamped, pins the
      // train on the mark while its speed bleeds off — 2.4 seconds of a train
      // that reads as moving but is not, at 10 Hz. Landing must be one step:
      // the frame before the train is short of the mark and rolling, the
      // frame after it is on the mark and stopped.
      for (const dt of [1 / 60, 0.1]) {
        const driver = new RailController(line(4000));
        driver.schedule([{ at: 600, dwell: 999 }]);
        let framesOnMark = 0;
        let framesStopped = 0;
        run(driver, 300, dt, () => {
          // On the mark, not near it: the last centimetre of the approach is
          // still the approach, and the train is legitimately rolling there.
          if (driver.distance >= 600 - 1e-6) {
            framesOnMark++;
            if (driver.speed === 0) framesStopped++;
          }
        });
        // Every frame the train is at the mark, it is already stopped.
        expect(framesOnMark, `dt=${dt}`).toBeGreaterThan(10);
        expect(framesStopped, `dt=${dt}`).toBe(framesOnMark);
      }
    });

    it('is never going faster than it could stop from', () => {
      // The invariant the whole law is: at every point of the approach the
      // train is inside its own stopping distance for what is left. A driver
      // that brakes late passes this only until it cannot.
      for (const dt of [1 / 60, 0.1]) {
        const driver = new RailController(line(4000));
        driver.schedule([{ at: 600, dwell: 999 }]);
        let worstExcess = 0;
        run(driver, 300, dt, () => {
          const remaining = 600 - driver.distance;
          if (remaining > 1) {
            worstExcess = Math.max(worstExcess, driver.stoppingDistance - remaining);
          }
        });
        // Never needing more room than it has, bar a step of discretisation.
        expect(worstExcess, `dt=${dt}`).toBeLessThan(22 * dt);
      }
    });

    it('never decelerates harder than the brake rate on the approach', () => {
      const dt = 1 / 60;
      const driver = new RailController(line(4000));
      driver.schedule([{ at: 600, dwell: 999 }]);
      let worst = 0;
      let residual = 0;
      for (let t = 0; t < 200; t += dt) {
        const before = driver.speed;
        driver.step(dt);
        if (driver.distance < 600 - 1e-9) {
          worst = Math.max(worst, (before - driver.speed) / dt);
        } else {
          // The landing step zeroes whatever speed discretisation left over
          // the last few millimetres. That is not braking, and pretending it
          // is would make this assertion unsatisfiable at any step size.
          residual = before;
          break;
        }
      }
      expect(worst).toBeLessThanOrEqual(0.8 + 1e-9);
      expect(worst).toBeGreaterThan(0.7); // it does actually brake hard
      expect(residual).toBeLessThan(0.6); // 8 mm of run-in at 60 Hz
    });

    it('overruns a stop it cannot physically make, rather than stopping dead', () => {
      // The defect the conditional landing exists to kill. An unconditional
      // "never move past the mark" clamp brings a train at line speed to a
      // stand in 10 m — a sixpence — while reporting a 302 m stoppingDistance.
      const driver = new RailController(line(4000), { brake: 0.8 });
      driver.speed = 22;
      driver.schedule([{ at: 10, dwell: 999 }]);
      const dt = 1 / 60;
      let worst = 0;
      let overrun = -1;
      driver.onArrive((_stop, past) => {
        overrun = past;
      });
      for (let t = 0; t < 60; t += dt) {
        const before = driver.speed;
        driver.step(dt);
        worst = Math.max(worst, (before - driver.speed) / dt);
      }
      expect(worst).toBeLessThanOrEqual(0.8 + 1e-9);
      expect(driver.speed).toBe(0);
      // It needed 302 m from 22 m/s and had 10, so it stands ~292 m past.
      expect(driver.distance).toBeGreaterThan(280);
      expect(overrun).toBeCloseTo(driver.distance - 10, 6);
      expect(overrun).toBeGreaterThan(280);
    });

    it('cannot be made to miss a stop by an uneven frame rate', () => {
      // Found in the browser, not here: under SwiftShader the frame time
      // wanders, and a train that spent its approach at ~10 Hz arrives at the
      // last centimetres carrying more speed than the ceiling allows. Judged
      // against a per-step tolerance that shrank with dt, it ran straight
      // through HAVENBROOK at 0.39 m short and 1.11 m/s — and because a loop
      // line wraps the gap, the mark became a whole lap away and the train
      // accelerated off rather than stopping.
      // Reproduced by making the frame rate IMPROVE on the run-in: a coarse
      // approach leaves the train above the ceiling, and then fine frames
      // arrive — under the old rule buying an ever tighter tolerance for a
      // gap the coarse frames already opened.
      const driver = new RailController({ length: 290, loop: true },
        { topSpeed: 9, accel: 0.5, brake: 0.6, distance: 8 });
      const arrivals: string[] = [];
      driver.onArrive((stop, overrun) => arrivals.push(`${stop.name}:${overrun.toFixed(2)}`));
      driver.schedule([
        { at: 207, dwell: 11, name: 'HAVENBROOK' },
        { at: 62, dwell: 11, name: 'ASHFORD' },
      ]);
      for (let i = 0; i < 40000; i++) {
        const gap = driver.nextStop ? driver.nextStop.at - driver.distance : Infinity;
        const runningIn = gap > 0 && gap < 3 && driver.speed > 0.001;
        driver.step(runningIn ? 1 / 240 : 0.1);
      }
      expect(arrivals.slice(0, 4)).toEqual([
        'ASHFORD:0.00', 'HAVENBROOK:0.00', 'ASHFORD:0.00', 'HAVENBROOK:0.00',
      ]);
    });

    it('does not let a loop line wrap a stop it is still approaching', () => {
      // The structural half of the same defect: a train that DOES run through
      // its mark must brake to a stand beyond it and count the stop there,
      // not treat the mark as 290 m ahead and go round again.
      const driver = new RailController({ length: 290, loop: true },
        { topSpeed: 9, accel: 0.5, brake: 0.6 });
      driver.speed = 9;
      driver.schedule([{ at: 5, dwell: 99, name: 'TOOCLOSE' }]); // needs 67 m
      let overrun = -1;
      driver.onArrive((_s, past) => {
        overrun = past;
      });
      for (let t = 0; t < 40; t += 1 / 60) driver.step(1 / 60); // 15 s to stop
      expect(driver.speed).toBe(0);
      expect(overrun).toBeCloseTo(67.5 - 5, 0); // v²/2a, less the 5 m it had
      expect(driver.state).toBe('dwelling');
      expect(driver.distance).toBeGreaterThan(60); // stood where it stopped
    });

    it('forgets it could stop when the mark changes under it', () => {
      // A train running happily toward the buffers has "could stop" true for
      // THAT target. Book a stop inside its braking distance and the answer
      // has to be recomputed from scratch, or the new mark inherits a yes it
      // never earned and the train stops dead on it.
      const driver = new RailController(line(6000));
      run(driver, 90); // up to line speed, buffers far away
      expect(driver.speed).toBeCloseTo(22, 1);
      const at = driver.distance;
      let overrun = -1;
      driver.onArrive((_s, past) => {
        overrun = past;
      });
      driver.schedule([{ at: at + 10, dwell: 999 }]); // needs 302 m
      run(driver, 60);
      expect(driver.speed).toBe(0);
      expect(overrun).toBeGreaterThan(280);
      expect(driver.distance - at).toBeGreaterThan(280);
    });

    it('measures an overrun that wraps the end of a loop', () => {
      // `distance - target` is meaningless once the overrun carries the train
      // past the end of a loop and the wrap puts it BEHIND the mark it just
      // ran through. The overrun is accumulated instead.
      const driver = new RailController({ length: 290, loop: true },
        { topSpeed: 9, accel: 0.5, brake: 0.6 });
      driver.speed = 9;
      driver.schedule([{ at: 285, dwell: 999, name: 'LATE' }]);
      driver.distance = 283; // 2 m to run, 67.5 m to stop
      let overrun = -1;
      driver.onArrive((_s, past) => {
        overrun = past;
      });
      run(driver, 40);
      expect(driver.speed).toBe(0);
      expect(driver.distance).toBeLessThan(285); // wrapped past 0
      expect(overrun).toBeCloseTo(67.5 - 2, 0);
    });

    it('reports zero overrun for an ordinary arrival', () => {
      const driver = new RailController(line(4000));
      let overrun = -1;
      driver.onArrive((_stop, past) => {
        overrun = past;
      });
      driver.schedule([{ at: 600, dwell: 999 }]);
      run(driver, 200);
      expect(overrun).toBe(0);
    });

    it('accelerates at the accel rate up to line speed and no further', () => {
      const driver = new RailController(line(100000), { accel: 0.5, topSpeed: 22 });
      run(driver, 10);
      expect(driver.speed).toBeCloseTo(5, 1); // 0.5 m/s² for 10 s
      run(driver, 200);
      expect(driver.speed).toBeCloseTo(22, 6);
      run(driver, 60);
      expect(driver.speed).toBeCloseTo(22, 6); // capped
    });

    it('honours throttle as a fraction of line speed', () => {
      const driver = new RailController(line(100000), { topSpeed: 22 });
      driver.throttle = 0.5;
      run(driver, 300);
      expect(driver.speed).toBeCloseTo(11, 3);
    });
  });

  describe('the schedule', () => {
    it('stops at every stop in order, and reports the one it is approaching', () => {
      const driver = new RailController(line(4000));
      const seen: string[] = [];
      driver.onArrive((stop) => seen.push(`arrive:${stop.name}`));
      driver.onDepart((stop) => seen.push(`depart:${stop.name}`));
      driver.schedule([
        { at: 400, dwell: 10, name: 'A' },
        { at: 900, dwell: 10, name: 'B' },
      ]);
      expect(driver.nextStop?.name).toBe('A');
      run(driver, 300);
      expect(seen).toEqual(['arrive:A', 'depart:A', 'arrive:B', 'depart:B']);
    });

    it('sorts the schedule, because an out-of-order route is undriveable', () => {
      const driver = new RailController(line(4000));
      const arrivals: number[] = [];
      driver.onArrive((stop) => arrivals.push(stop.at));
      driver.schedule([{ at: 900 }, { at: 200 }, { at: 600 }]);
      expect(driver.nextStop?.at).toBe(200);
      run(driver, 400);
      expect(arrivals).toEqual([200, 600, 900]);
    });

    it('waits the dwell, then departs', () => {
      const driver = new RailController(line(4000));
      const departed = vi.fn();
      driver.onDepart(departed);
      driver.schedule([{ at: 300, dwell: 20 }]);
      run(driver, 50); // reaches 300 at ~44 s
      expect(driver.state).toBe('dwelling');
      expect(driver.dwellRemaining).toBeGreaterThan(0);
      expect(driver.speed).toBe(0);
      expect(driver.distance).toBeCloseTo(300, 6);
      expect(departed).not.toHaveBeenCalled();

      const held = driver.dwellRemaining;
      run(driver, held + 0.5);
      expect(departed).toHaveBeenCalledTimes(1);
      expect(driver.dwellRemaining).toBe(0);
      expect(driver.state).toBe('running');
    });

    it('holds the dwell for the time asked, not a frame more or less', () => {
      const driver = new RailController(line(4000));
      driver.schedule([{ at: 300, dwell: 25 }]);
      let stoppedAt = -1;
      let movingAt = -1;
      run(driver, 200, 1 / 60, (t) => {
        if (stoppedAt < 0 && driver.distance >= 299.99) stoppedAt = t;
        else if (stoppedAt >= 0 && movingAt < 0 && driver.distance > 300.01) movingAt = t;
      });
      expect(movingAt - stoppedAt).toBeGreaterThan(24.9);
      expect(movingAt - stoppedAt).toBeLessThan(25.3);
    });

    it('a zero dwell still stops — it just departs in the same step', () => {
      const driver = new RailController(line(4000));
      const seen: string[] = [];
      driver.onArrive(() => seen.push('arrive'));
      driver.onDepart(() => seen.push('depart'));
      driver.schedule([{ at: 300 }]);
      let sawZero = false;
      run(driver, 200, 1 / 60, () => {
        if (driver.distance > 299 && driver.speed === 0) sawZero = true;
      });
      expect(seen).toEqual(['arrive', 'depart']);
      expect(sawZero).toBe(true);
      expect(driver.distance).toBeGreaterThan(300);
    });

    it('drops a stop that lies behind it rather than stalling on it', () => {
      const driver = new RailController(line(4000), { distance: 500 });
      const arrivals: number[] = [];
      driver.onArrive((s) => arrivals.push(s.at));
      driver.schedule([{ at: 100 }, { at: 900, dwell: 999 }]);
      run(driver, 300);
      expect(arrivals).toEqual([900]); // never "arrived" at the one behind
      expect(driver.distance).toBeCloseTo(900, 6);
    });

    it('runs the schedule round again on a loop line', () => {
      const driver = new RailController(line(1200, true));
      const arrivals: number[] = [];
      driver.onArrive((s) => arrivals.push(s.at));
      driver.schedule([{ at: 300, dwell: 5 }, { at: 800, dwell: 5 }]);
      run(driver, 600);
      expect(arrivals.length).toBeGreaterThanOrEqual(4);
      expect(arrivals.slice(0, 4)).toEqual([300, 800, 300, 800]);
      expect(driver.distance).toBeGreaterThanOrEqual(0);
      expect(driver.distance).toBeLessThan(1200);
    });

    it('unsubscribes listeners', () => {
      const driver = new RailController(line(4000));
      const arrived = vi.fn();
      const off = driver.onArrive(arrived);
      driver.schedule([{ at: 200 }, { at: 700 }]);
      run(driver, 40); // reaches 200 at ~36 s, nowhere near 700
      expect(arrived).toHaveBeenCalledTimes(1);
      off();
      run(driver, 300);
      expect(arrived).toHaveBeenCalledTimes(1);
    });
  });

  describe('etaTo', () => {
    it('matches how long the train actually takes, within a second', () => {
      const predict = new RailController(line(4000));
      predict.schedule([{ at: 1500 }]);
      const eta = predict.etaTo(1500);

      const driver = new RailController(line(4000));
      driver.schedule([{ at: 1500 }]);
      let actual = -1;
      const dt = 1 / 60;
      for (let t = 0; t < 600; t += dt) {
        driver.step(dt);
        if (driver.distance >= 1500 - 1e-6) {
          actual = t + dt;
          break;
        }
      }
      expect(actual).toBeGreaterThan(0);
      expect(Math.abs(eta - actual)).toBeLessThan(1);
    });

    it('is not distance over current speed — it accounts for the brake curve', () => {
      const driver = new RailController(line(4000));
      driver.speed = 22;
      driver.schedule([{ at: 1500 }]);
      const naive = 1500 / 22; // 68.2 s, a number the train cannot achieve
      const eta = driver.etaTo(1500);
      expect(eta).toBeGreaterThan(naive + 5);
    });

    it('counts the stops in between, and their dwell', () => {
      const direct = new RailController(line(4000));
      direct.schedule([{ at: 2000 }]);
      const withoutStop = direct.etaTo(2000);

      const stopping = new RailController(line(4000));
      stopping.schedule([{ at: 900, dwell: 45 }, { at: 2000, dwell: 999 }]);
      const withStop = stopping.etaTo(2000);

      // Braking to a halt at 900 and standing 45 s cannot be free.
      expect(withStop).toBeGreaterThan(withoutStop + 45);

      // And it should be close to what the train really does.
      let actual = -1;
      const dt = 1 / 60;
      for (let t = 0; t < 900; t += dt) {
        stopping.step(dt);
        if (stopping.distance >= 2000 - 1e-6) {
          actual = t + dt;
          break;
        }
      }
      expect(Math.abs(withStop - actual)).toBeLessThan(2);
    });

    it('adds whatever is left of the dwell it is sitting in', () => {
      const driver = new RailController(line(4000));
      driver.schedule([{ at: 300, dwell: 60 }, { at: 1200, dwell: 999 }]);
      run(driver, 60);
      expect(driver.state).toBe('dwelling');
      const left = driver.dwellRemaining;
      expect(left).toBeGreaterThan(1);
      const eta = driver.etaTo(1200);

      const rolling = new RailController(line(4000), { distance: 300 });
      rolling.schedule([{ at: 1200 }]);
      expect(eta - rolling.etaTo(1200)).toBeCloseTo(left, 0);
    });

    it('is 0 for where the train already is, and Infinity for what is behind it', () => {
      const driver = new RailController(line(4000), { distance: 500 });
      expect(driver.etaTo(500)).toBe(0);
      expect(driver.etaTo(200)).toBe(Infinity);
    });

    it('goes the long way round on a loop line instead of giving up', () => {
      const driver = new RailController(line(1200, true), { distance: 500 });
      const eta = driver.etaTo(200); // 900 m ahead the long way
      expect(Number.isFinite(eta)).toBe(true);
      expect(eta).toBeGreaterThan(60);
    });

    it('is Infinity when the driver is asking for no speed at all', () => {
      const driver = new RailController(line(4000));
      driver.throttle = 0;
      expect(driver.etaTo(1000)).toBe(Infinity);
    });
  });

  describe('emergency stop', () => {
    it('stops harder than service braking, and overruns the mark', () => {
      const driver = new RailController(line(4000));
      driver.schedule([{ at: 2000 }]);
      run(driver, 60); // up to line speed, well short of the mark
      expect(driver.speed).toBeCloseTo(22, 1);

      const at = driver.distance;
      driver.emergencyStop();
      run(driver, 40);
      expect(driver.state).toBe('stopped');
      expect(driver.speed).toBe(0);
      const rolled = driver.distance - at;
      // 22² / (2 × 1.6) = 151 m, half the service distance.
      expect(rolled).toBeCloseTo(151.25, 0);
      expect(rolled).toBeLessThan(driver.stoppingDistance + 302.5);
    });

    it('ignores the schedule while it is applied, then resumes onto it', () => {
      const driver = new RailController(line(4000));
      const arrived = vi.fn();
      driver.onArrive(arrived);
      driver.schedule([{ at: 2000, dwell: 999 }]);
      run(driver, 60);
      driver.emergencyStop();
      run(driver, 60);
      expect(arrived).not.toHaveBeenCalled();
      expect(driver.distance).toBeLessThan(2000);

      driver.resume();
      run(driver, 300);
      expect(arrived).toHaveBeenCalledTimes(1);
      expect(driver.distance).toBeCloseTo(2000, 6);
    });

    it('can never overrun a mark it was already braking for', () => {
      // Emergency braking is HARDER than service braking, so a train inside
      // its service stopping curve is inside the emergency one by a wider
      // margin still. It always stops short — the overrun path belongs to
      // stops that were unreachable to begin with, not to this.
      for (const at of [40, 80, 200, 400]) {
        const driver = new RailController(line(4000));
        let overrun = -1;
        driver.onArrive((_s, past) => {
          overrun = past;
        });
        driver.schedule([{ at: 600, dwell: 999 }]);
        run(driver, at); // somewhere on the approach
        driver.emergencyStop();
        run(driver, 60);
        expect(driver.distance, `braked at ${at}s`).toBeLessThanOrEqual(600);
        expect(driver.state).toBe('stopped');

        driver.resume();
        run(driver, 200);
        expect(driver.distance, `resumed after ${at}s`).toBeCloseTo(600, 6);
        expect(overrun).toBe(0);
      }
    });
  });

  describe('the line', () => {
    it('stops at the buffers rather than running off the end', () => {
      const driver = new RailController(line(800));
      run(driver, 400);
      expect(driver.distance).toBeCloseTo(800, 6);
      expect(driver.speed).toBe(0);
      expect(driver.state).toBe('stopped');
    });

    it('runs past the end when there are no buffers, clamped by the line', () => {
      const driver = new RailController(line(800), { buffers: false });
      run(driver, 400);
      expect(driver.distance).toBe(800);
      expect(driver.speed).toBe(0);
    });

    it('wraps on a loop line and never stops for buffers', () => {
      const driver = new RailController(line(1000, true));
      run(driver, 400);
      expect(driver.distance).toBeGreaterThanOrEqual(0);
      expect(driver.distance).toBeLessThan(1000);
      expect(driver.speed).toBeCloseTo(22, 3); // still running
      expect(driver.state).toBe('running');
    });

    it('takes the line structurally — a bare length is a valid line', () => {
      // The handshake with SCENA's track is a shape, not an import.
      const driver = new RailController({ length: 500 });
      run(driver, 300);
      expect(driver.distance).toBeCloseTo(500, 6);
    });
  });

  describe('the phases', () => {
    it('reports running, braking, stopped and dwelling in that order', () => {
      const driver = new RailController(line(4000));
      driver.schedule([{ at: 600, dwell: 10 }]);
      const order: string[] = [];
      run(driver, 200, 1 / 60, () => {
        if (order[order.length - 1] !== driver.state) order.push(driver.state);
      });
      // The first entry is the initial 'running' before any step.
      expect(order[0]).toBe('running');
      expect(order).toContain('braking');
      expect(order).toContain('dwelling');
      expect(order.indexOf('braking')).toBeLessThan(order.indexOf('dwelling'));
    });

    it('does nothing at all on a zero or negative step', () => {
      const driver = new RailController(line(4000));
      driver.speed = 10;
      const at = driver.distance;
      driver.step(0);
      driver.step(-1);
      expect(driver.distance).toBe(at);
      expect(driver.speed).toBe(10);
    });
  });

  describe('determinism', () => {
    it('two drivers given the same schedule and steps agree exactly', () => {
      const build = (): RailController => {
        const d = new RailController(line(4000));
        d.schedule([{ at: 500, dwell: 12 }, { at: 1400, dwell: 999 }]);
        return d;
      };
      const a = build();
      const b = build();
      run(a, 400);
      run(b, 400);
      expect(a.distance).toBe(b.distance);
      expect(a.speed).toBe(b.speed);
      expect(a.state).toBe(b.state);
      // and it genuinely moved, so the agreement is not agreement about nothing
      expect(a.distance).toBeCloseTo(1400, 6);
      expect(Number.isNaN(a.distance)).toBe(false);
    });
  });

  describe('the schedule shape', () => {
    it('does not hold onto the array it was given', () => {
      const stops: ScheduledStop[] = [{ at: 300 }];
      const driver = new RailController(line(4000));
      driver.schedule(stops);
      stops.push({ at: 1000 }); // a stop the driver was never told about
      const arrivals: number[] = [];
      driver.onArrive((s) => arrivals.push(s.at));
      run(driver, 300);
      expect(arrivals).toEqual([300]);
      expect(driver.distance).toBeCloseTo(4000, 6); // ran on to the buffers
    });
  });
});
