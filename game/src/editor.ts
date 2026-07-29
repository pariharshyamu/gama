/**
 * Havenbrook's level editor.
 *
 * This is the whole thing. `mountEditor` is GAMA's; the catalog is this
 * game's, and it is the only file that knows SCENA and ANIMA exist. What
 * you get is a tool that can place houses, stalls, lamps, trees and
 * delivery doors — none of which GAMA has ever heard of.
 *
 * Saving downloads a level file. Drop it in `src/levels/` and the game
 * loads it: `?level=havenbrook`. That round trip is the point.
 */
import { PALETTES, createLightingRig, createSky, createSurface } from 'scena3d';
import { Mesh, PlaneGeometry } from 'three';
import { mountEditor } from 'gama3d/editor';
import { createCatalog } from './catalog';
import havenbrook from './levels/havenbrook.json';
import type { LevelData } from 'gama3d';

/**
 * `?leak=1` mounts the editor with resource release turned OFF.
 *
 * It exists so the fix can be MEASURED rather than asserted: the verifier
 * loads both pages, rebuilds the same house fifteen times on each, and
 * compares what the renderer says it is holding. A unit test proves
 * `dispose()` gets called; this proves it mattered.
 */
const leaky = new URLSearchParams(location.search).has('leak');

const session = mountEditor({
  release: !leaky,
  storageKey: null, // a game's levels live in files, not in a browser
  catalog: createCatalog({ preview: true }),
  container: document.getElementById('app')!,
  level: havenbrook as LevelData,
  brand: 'HAVENBROOK',
  subtitle: 'level editor',
  snap: 0.5,
  snapAngle: 15,
  // Havenbrook is 120 metres across; opening at the yard-sized default
  // shows a corner of it and nothing about the layout.
  distance: 46,
  pitch: 0.62,
  // Editing against the game's own sky and ground, because a level that
  // looks right on a grey grid and wrong in the game has not been edited,
  // it has been arranged.
  decorate(scene) {
    const sky = createSky({ palette: PALETTES.meadow });
    const rig = createLightingRig('day');
    scene.add(sky.mesh, rig.group);
    // No fog. The game's haze is tuned for a courier's eye-level view; from
    // an editor camera sixty metres up it turns the far half of the map
    // into a grey smear, and you cannot place what you cannot see.
    const ground = new Mesh(new PlaneGeometry(600, 600), createSurface('moss', { seed: 7 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.receiveShadow = true;
    scene.add(ground);
  },
  actions: [
    {
      label: 'Playtest',
      title: 'Open the game on this level (save it into src/levels first)',
      run: () => window.open('./index.html?level=havenbrook', '_blank'),
    },
    {
      label: 'Reload from disk',
      title: 'Throw away browser edits and reopen src/levels/havenbrook.json',
      run: (s) => s.load(havenbrook as LevelData),
    },
  ],
});

declare global {
  interface Window {
    editorDebug: () => Record<string, unknown>;
    editorStress: (times: number) => Promise<Record<string, number>>;
  }
}

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/**
 * Rebuild one house over and over, the way somebody dragging a width
 * slider does, and report what the renderer is holding before and after.
 * A prop change re-runs the factory: SCENA hands back six fresh geometries
 * and five fresh materials every time, and before 0.38.0 every one of them
 * stayed resident.
 */
window.editorStress = async (times: number) => {
  const { editor, game } = session;
  editor.select('house-1');
  // Register what the house already owns BEFORE the baseline is taken.
  // The renderer only counts a geometry it has drawn, so a baseline taken
  // while half the house is frustum-culled makes the first rebuild look
  // like a leak — a constant that moves with the camera, which is exactly
  // the kind of number that turns a measurement into a coin toss.
  const show = () =>
    session.level.byId('house-1')?.object.traverse((o) => {
      o.frustumCulled = false;
    });
  show();
  await frame();
  await frame();
  const before = { ...game.renderer.info.memory };
  for (let i = 0; i < times; i++) {
    editor.setProps({ width: 4.5 + (i % 7) * 0.25 });
    show();
    await frame();
  }
  const after = { ...game.renderer.info.memory };
  return {
    times,
    geometriesBefore: before.geometries,
    geometriesAfter: after.geometries,
    texturesBefore: before.textures,
    texturesAfter: after.textures,
    leaked: after.geometries - before.geometries,
  };
};

window.editorDebug = () => {
  const { editor, level, game } = session;
  const data = editor.toJSON();
  const source = (id: string) => level.byId(id)?.source as { obstacleRadius?: number } | undefined;
  return {
    entities: data.entities.length,
    built: level.objects.length,
    kinds: document.querySelectorAll('.ed-palette button').length,
    // The three things gameplay reads out of a level, counted here so a
    // verifier can prove the file still carries them.
    addresses: level.byTag('address').length,
    depots: level.byTag('depot').length,
    waypoints: level.byTag('waypoint').length,
    // And the structural handshake: SCENA props report their own footprint.
    blockers: level.objects.filter((p) => (p.source as { obstacleRadius?: number })?.obstacleRadius)
      .length,
    houseRadius: source('house-1')?.obstacleRadius ?? null,
    selection: editor.selection,
    undo: editor.undoLabel,
    draws: game.renderer.info.render.calls,
    triangles: game.renderer.info.render.triangles,
    geometries: game.renderer.info.memory.geometries,
    textures: game.renderer.info.memory.textures,
  };
};
