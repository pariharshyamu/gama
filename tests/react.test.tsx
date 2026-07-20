import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useEffect } from 'react';
import { GamaProvider, Entity, useComponent, useAgentNeighbors, useTweens } from '../src/react';
import { GameObject } from '../src/core/GameObject';
import { MotionAgent } from '../src/motion/MotionAgent';
import { Seek, Separation } from '../src/motion/steering';
import { SphereCollider } from '../src/physics/Collider';

async function advanceSeconds(
  renderer: Awaited<ReturnType<typeof ReactThreeTestRenderer.create>>,
  seconds: number,
  dt = 1 / 60
): Promise<void> {
  await renderer.advanceFrames(Math.round(seconds / dt), dt);
}

describe('gama/react', () => {
  it('mounts an Entity as a GameObject in the r3f scene', async () => {
    let captured: GameObject | null = null;
    const renderer = await ReactThreeTestRenderer.create(
      <GamaProvider>
        <Entity
          name="hero"
          position={[1, 2, 3]}
          tags={['player']}
          onInit={(e) => {
            captured = e;
          }}
        >
          <mesh />
        </Entity>
      </GamaProvider>
    );
    expect(captured).not.toBeNull();
    const entity = captured as unknown as GameObject;
    expect(entity).toBeInstanceOf(GameObject);
    expect(entity.name).toBe('hero');
    expect(entity.tags.has('player')).toBe(true);
    expect(entity.position.toArray()).toEqual([1, 2, 3]);
    expect(entity.children.length).toBe(1); // the mesh became a child
    await renderer.unmount();
  });

  it('ticks components: a Seek agent moves toward its target', async () => {
    let entity: GameObject | null = null;
    const renderer = await ReactThreeTestRenderer.create(
      <GamaProvider>
        <Entity
          onInit={(e) => {
            entity = e;
            e.addComponent(new MotionAgent({ maxSpeed: 5, maxForce: 50 })).addBehavior(
              new Seek(new Vector3(10, 0, 0))
            );
          }}
        >
          <mesh />
        </Entity>
      </GamaProvider>
    );
    await advanceSeconds(renderer, 2);
    expect((entity as unknown as GameObject).position.x).toBeGreaterThan(4);
    await renderer.unmount();
  });

  it('useComponent attaches on mount and detaches on unmount', async () => {
    let entity: GameObject | null = null;
    function Agent() {
      const agent = useComponent(() => new MotionAgent({ maxSpeed: 3 }));
      useEffect(() => {
        entity = agent.owner;
      }, [agent]);
      return null;
    }
    const renderer = await ReactThreeTestRenderer.create(
      <GamaProvider>
        <Entity>
          <Agent />
          <mesh />
        </Entity>
      </GamaProvider>
    );
    expect((entity as unknown as GameObject).getComponent(MotionAgent)).toBeDefined();
    await renderer.unmount();
    expect((entity as unknown as GameObject).components.length).toBe(0); // disposed
  });

  it('useAgentNeighbors feeds flocking across entities', async () => {
    const positions: GameObject[] = [];
    function Boid({ x }: { x: number }) {
      const neighbors = useAgentNeighbors();
      return (
        <Entity
          position={[x, 0, 0]}
          onInit={(e) => {
            positions.push(e);
            e.addComponent(new MotionAgent({ maxSpeed: 4 })).addBehavior(
              new Separation(neighbors, 5)
            );
          }}
        >
          <mesh />
        </Entity>
      );
    }
    const renderer = await ReactThreeTestRenderer.create(
      <GamaProvider>
        <Boid x={-0.5} />
        <Boid x={0.5} />
      </GamaProvider>
    );
    await advanceSeconds(renderer, 1);
    // Separation pushed them apart.
    expect(positions[1].position.x - positions[0].position.x).toBeGreaterThan(2);
    await renderer.unmount();
  });

  it('shared tweens update from the provider frame loop', async () => {
    const box = { scale: 0 };
    function Kick() {
      const tweens = useTweens();
      useEffect(() => {
        tweens.to(box, { scale: 1 }, { duration: 0.5 });
      }, [tweens]);
      return null;
    }
    const renderer = await ReactThreeTestRenderer.create(
      <GamaProvider>
        <Kick />
      </GamaProvider>
    );
    await advanceSeconds(renderer, 1);
    expect(box.scale).toBe(1);
    await renderer.unmount();
  });

  it('collision events fire between entities when collisions is enabled', async () => {
    const log: string[] = [];
    const renderer = await ReactThreeTestRenderer.create(
      <GamaProvider collisions>
        <Entity
          name="a"
          position={[0, 0, 0]}
          onInit={(e) => {
            e.addComponent(new SphereCollider(1));
            e.events.on('collision-enter', (other) => log.push(`a hit ${other.name}`));
          }}
        >
          <mesh />
        </Entity>
        <Entity
          name="b"
          position={[0.5, 0, 0]}
          onInit={(e) => {
            e.addComponent(new SphereCollider(1));
          }}
        >
          <mesh />
        </Entity>
      </GamaProvider>
    );
    await advanceSeconds(renderer, 0.1);
    expect(log).toContain('a hit b');
    await renderer.unmount();
  });
});
