import { Vector3 } from 'three';
import type { MotionAgent } from './MotionAgent';

/** The bit of a SCENA vehicle prop this adapter drives (structural). */
export interface VehicleRunningGear {
  update(dt: number, input: { speed?: number; steer?: number }): void;
}

/**
 * Drive a SCENA vehicle's running gear from a GAMA `MotionAgent` — the
 * adapter that used to be a copy-pasted heading-wrap loop in every demo.
 *
 * The agent already steers and faces its velocity (`faceVelocity`, on by
 * default); this reads its speed and the residual cornering angle and pumps
 * the wheels/steering each frame. Attach the vehicle's visual under the same
 * GameObject as the agent, then:
 *
 * ```ts
 * const rival = createCar();               // SCENA
 * carObject.add(rival.object);
 * const agent = carObject.addComponent(new MotionAgent({ maxSpeed: 10 }));
 * agent.addBehavior(new FollowPath(track, 2));
 * const drive = driveVehicle(agent, rival);
 * game.onUpdate((t) => drive(t.delta));    // wheels spin, fronts steer
 * ```
 */
export function driveVehicle(agent: MotionAgent, vehicle: VehicleRunningGear): (dt: number) => void {
  const vel = new Vector3();
  return (dt: number) => {
    vel.copy(agent.velocity);
    const speed = Math.hypot(vel.x, vel.z);
    let steer = 0;
    if (speed > 0.05) {
      const desired = Math.atan2(vel.x, vel.z);
      steer = shortestAngle(agent.owner.rotation.y, desired);
    }
    vehicle.update(dt, { speed, steer: Math.max(-0.6, Math.min(0.6, steer * 1.3)) });
  };
}

function shortestAngle(from: number, to: number): number {
  const tau = Math.PI * 2;
  let diff = (to - from) % tau;
  if (diff > Math.PI) diff -= tau;
  if (diff < -Math.PI) diff += tau;
  return diff;
}
