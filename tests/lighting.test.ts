import { describe, expect, it, vi } from 'vitest';
import { AmbientLight, DirectionalLight, Color, Scene, Fog, Vector3 } from 'three';
import { Flashlight, Illumination, MoodGrade } from '../src';

describe('Illumination', () => {
  it('is ambient in darkness, bright under the lamp, and falls off smoothly', () => {
    const field = new Illumination({ ambient: 0.1 });
    field.add({ center: { x: 0, y: 3, z: 0 }, radius: 6 });
    expect(field.at({ x: 40, y: 0, z: 0 })).toBeCloseTo(0.1); // the dark is the floor
    expect(field.at({ x: 0, y: 3, z: 0 })).toBe(1); // under the source, clamped
    const near = field.at({ x: 2, y: 3, z: 0 });
    const far = field.at({ x: 4, y: 3, z: 0 });
    expect(near).toBeGreaterThan(far);
    expect(far).toBeGreaterThan(0.1);
  });

  it('doused sources stop counting live, and removal removes', () => {
    let lit = true;
    const field = new Illumination({ ambient: 0 });
    const remove = field.add({ center: { x: 0, y: 0, z: 0 }, radius: 5, isLit: () => lit });
    expect(field.at({ x: 1, y: 0, z: 0 })).toBeGreaterThan(0.4);
    lit = false; // the photocell doused it; nobody told the field — nobody needs to
    expect(field.at({ x: 1, y: 0, z: 0 })).toBe(0);
    lit = true;
    remove();
    expect(field.count).toBe(0);
    expect(field.at({ x: 1, y: 0, z: 0 })).toBe(0);
  });

  it('tracks anchors live (a SCENA claim shape) and sums multiple lamps', () => {
    const anchor = new Vector3(0, 2, 0); // Vector3 has getWorldPosition-ish copy? no —
    // a real anchor: any object with getWorldPosition. Fake one that moves.
    const mover = { getWorldPosition: (t: Vector3) => t.copy(anchor) };
    const field = new Illumination({ ambient: 0 });
    field.add({ anchor: mover, radius: 4 });
    field.add({ center: { x: 3, y: 2, z: 0 }, radius: 4, intensity: 0.5 });
    const before = field.at({ x: 0, y: 2, z: 0 });
    anchor.set(10, 2, 0); // the lamp is on a ferry, apparently
    const after = field.at({ x: 0, y: 2, z: 0 });
    expect(before).toBeGreaterThan(after);
    // Two half-lamps overlap toward 1 but never past it.
    const fieldB = new Illumination({ ambient: 0 });
    fieldB.add({ center: { x: 0, y: 0, z: 0 }, radius: 5, intensity: 0.8 });
    fieldB.add({ center: { x: 0.5, y: 0, z: 0 }, radius: 5, intensity: 0.8 });
    expect(fieldB.at({ x: 0.2, y: 0, z: 0 })).toBe(1);
  });
});

describe('Flashlight', () => {
  it('drains while on, gutters when low, dies once, and refuels', () => {
    const onLow = vi.fn();
    const onDied = vi.fn();
    const torch = new Flashlight({ batteryLife: 10, low: 0.3, onLow, onDied });
    torch.update(5);
    expect(torch.battery).toBeCloseTo(0.5);
    expect(torch.glow).toBe(1);
    torch.update(2.5); // 0.25 — below the low mark
    expect(onLow).toHaveBeenCalledTimes(1);
    // The gutter: over a second of low battery, output dips AND recovers.
    const seen = new Set<number>();
    for (let i = 0; i < 120; i++) {
      torch.update(1 / 120);
      seen.add(torch.glow);
    }
    expect(seen.has(1)).toBe(true);
    expect([...seen].some((g) => g < 0.3)).toBe(true);
    torch.update(3);
    expect(torch.battery).toBe(0);
    expect(onDied).toHaveBeenCalledTimes(1);
    expect(torch.glow).toBe(0);
    torch.refuel();
    expect(torch.battery).toBe(1);
    expect(torch.glow).toBe(1);

    const off = new Flashlight({ batteryLife: 10 });
    off.on = false;
    off.update(20);
    expect(off.battery).toBe(1); // off costs nothing
  });

  it('illuminates inside the cone, not behind, not beyond, not while off', () => {
    const torch = new Flashlight({ range: 8, halfAngle: 0.4 });
    torch.aim({ x: 0, y: 0, z: 0 }, 0); // facing +z
    torch.update(0);
    expect(torch.illuminates({ center: { x: 0, y: 0, z: 5 }, radius: 0.4 })).toBe(true);
    expect(torch.illuminates({ center: { x: 0, y: 0, z: -5 }, radius: 0.4 })).toBe(false);
    expect(torch.illuminates({ center: { x: 0, y: 0, z: 12 }, radius: 0.4 })).toBe(false);
    expect(torch.illuminates({ center: { x: 5, y: 0, z: 5 }, radius: 0.4 })).toBe(false);
    // Grazing the edge: angular slack for the target's own size.
    expect(torch.illuminates({ center: { x: 2.1, y: 0, z: 5 }, radius: 0.5 })).toBe(true);
    torch.on = false;
    expect(torch.illuminates({ center: { x: 0, y: 0, z: 5 }, radius: 0.4 })).toBe(false);
  });

  it('feeds an Illumination field: the beam pool moves with the aim', () => {
    const torch = new Flashlight({ range: 8 });
    const field = new Illumination({ ambient: 0 });
    field.add(torch.source);
    torch.aim({ x: 0, y: 0, z: 0 }, 0);
    torch.update(0);
    const ahead = field.at({ x: 0, y: 0, z: 4 });
    const behind = field.at({ x: 0, y: 0, z: -4 });
    expect(ahead).toBeGreaterThan(0.5);
    expect(behind).toBe(0);
    torch.aim({ x: 0, y: 0, z: 0 }, Math.PI); // about face
    torch.update(0);
    expect(field.at({ x: 0, y: 0, z: -4 })).toBeGreaterThan(0.5);
  });
});

describe('MoodGrade', () => {
  it('lerps every graded channel with smoothstep and lands exactly', () => {
    const sun = new DirectionalLight(0xffffff, 1.0);
    const ambient = new AmbientLight(0xffffff, 0.4);
    const scene = new Scene();
    scene.background = new Color(0x000000);
    scene.fog = new Fog(0x000000, 1, 50);
    const grade = new MoodGrade({ sun, ambient, scene: scene as never, fog: scene.fog });
    grade.define('danger', {
      sun: { intensity: 0.2, color: 0xff0000 },
      ambient: { intensity: 0.1 },
      background: 0x400000,
      fog: 0x200000,
    });
    expect(grade.to('nope')).toBe(false); // unknown moods refused, not thrown
    expect(grade.to('danger', 2)).toBe(true);
    grade.update(1); // halfway: smoothstep(0.5) = 0.5
    expect(sun.intensity).toBeCloseTo(0.6, 5);
    expect(ambient.intensity).toBeCloseTo(0.25, 5);
    grade.update(1); // done
    expect(sun.intensity).toBeCloseTo(0.2);
    expect(sun.color.getHex()).toBe(0xff0000);
    expect((scene.background as Color).getHex()).toBe(0x400000);
    expect(scene.fog.color.getHex()).toBe(0x200000);
    expect(grade.blending).toBe(false);
    expect(grade.mood).toBe('danger');
  });

  it('interrupting a blend restarts from wherever the light is NOW', () => {
    const ambient = new AmbientLight(0xffffff, 1.0);
    const grade = new MoodGrade({ ambient });
    grade.define('dark', { ambient: { intensity: 0 } });
    grade.define('bright', { ambient: { intensity: 1 } });
    grade.to('dark', 2);
    grade.update(1); // halfway down: 0.5
    const mid = ambient.intensity;
    grade.to('bright', 1); // change of heart, mid-fade
    grade.update(0.0001);
    expect(ambient.intensity).toBeCloseTo(mid, 2); // no snap
    grade.update(1);
    expect(ambient.intensity).toBeCloseTo(1);
    // set() is the instant cut.
    grade.set('dark');
    expect(ambient.intensity).toBe(0);
  });
});
