import { createRoot } from 'react-dom/client';
import { useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box3, Vector3 } from 'three';
import { MotionAgent } from '../../src/motion/MotionAgent';
import {
  Wander,
  Separation,
  Alignment,
  Cohesion,
  Seek,
  Flee,
} from '../../src/motion/steering';
import { Containment } from '../../src/motion/avoidance';
import type { SpatialGrid } from '../../src/motion/SpatialGrid';
import { GamaProvider, Entity, useComponent, useFlockGrid } from '../../src/react';

const BOUNDS = new Box3(new Vector3(-22, 2, -22), new Vector3(22, 14, 22));

function Boid({ grid, chaser }: { grid: SpatialGrid; chaser: MotionAgent }) {
  const agent = useComponent(() => new MotionAgent({ maxSpeed: 6, maxForce: 18 }));
  useEffect(() => {
    agent.velocity.set(Math.random() - 0.5, 0, Math.random() - 0.5).setLength(3);
    const neighbors = grid.near(agent, 5);
    agent.addBehavior(new Wander(), 0.6);
    agent.addBehavior(new Separation(neighbors, 1.4), 1.8);
    agent.addBehavior(new Alignment(neighbors, 4), 1);
    agent.addBehavior(new Cohesion(neighbors, 5), 0.7);
    agent.addBehavior(new Flee(() => chaser.position, 6), 1.6);
    agent.addBehavior(new Containment(BOUNDS, 4), 2);
    return () => agent.clearBehaviors();
  }, [agent, grid, chaser]);
  return (
    <mesh rotation-x={Math.PI / 2}>
      <coneGeometry args={[0.18, 0.55, 5]} />
      <meshStandardMaterial color="#34d399" />
    </mesh>
  );
}

function Chaser({ agent }: { agent: MotionAgent }) {
  const grid = useFlockGrid(5);
  useEffect(() => {
    // Chase the center of nearby boids; wander when alone.
    const center = new Vector3();
    agent.addBehavior(new Wander(), 0.5);
    agent.addBehavior(
      new Seek(() => {
        const near = grid.neighbors(agent.position, 14);
        const others = near.filter((a) => a !== agent);
        if (others.length === 0) return center.copy(agent.position);
        center.set(0, 0, 0);
        for (const other of others) center.add(other.position);
        return center.divideScalar(others.length);
      }),
      1.2
    );
    agent.addBehavior(new Containment(BOUNDS, 4), 2);
    return () => agent.clearBehaviors();
  }, [agent, grid]);
  return null;
}

function Flock() {
  const grid = useFlockGrid(5);
  const chaser = useMemo(() => new MotionAgent({ maxSpeed: 7, maxForce: 16 }), []);
  const boids = useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => ({
        key: i,
        position: [(Math.random() - 0.5) * 36, 3 + Math.random() * 9, (Math.random() - 0.5) * 36] as [
          number,
          number,
          number,
        ],
      })),
    []
  );
  return (
    <>
      {boids.map(({ key, position }) => (
        <Entity key={key} position={position}>
          <Boid grid={grid} chaser={chaser} />
        </Entity>
      ))}
      <Entity
        position={[0, 8, 0]}
        onInit={(e) => {
          e.addComponent(chaser);
        }}
      >
        <Chaser agent={chaser} />
        <mesh rotation-x={Math.PI / 2}>
          <coneGeometry args={[0.45, 1.2, 5]} />
          <meshStandardMaterial color="#f87171" />
        </mesh>
      </Entity>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <Canvas
    camera={{ position: [0, 34, 40], fov: 60 }}
    onCreated={({ camera }) => camera.lookAt(0, 4, 0)}
  >
    <color attach="background" args={['#0b0e14']} />
    <ambientLight intensity={0.6} />
    <directionalLight position={[10, 20, 8]} intensity={1.2} />
    <gridHelper args={[60, 30, '#334155', '#1e293b']} />
    <GamaProvider>
      <Flock />
    </GamaProvider>
  </Canvas>
);
