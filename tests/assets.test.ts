import { describe, expect, it, vi } from 'vitest';
import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import {
  AssetLibrary,
  Catalog,
  LEVEL_VERSION,
  Level,
  parseManifest,
  type AssetLoader,
  type AssetManifest,
} from '../src';

/**
 * The loaders are plain functions, which is the whole reason this file can
 * exist: no GPU, no network, no DOM, and every path a real game takes.
 */
const MANIFEST: AssetManifest = {
  format: 'gama.assets',
  version: 1,
  base: '/assets/',
  assets: {
    'town/crate': { url: 'town/crate.gltf', type: 'model', bytes: 1000, group: 'town' },
    'town/planks': { url: 'town/planks.png', type: 'texture', bytes: 3000, group: 'town' },
    'ruins/statue': { url: 'ruins/statue.gltf', type: 'model', bytes: 6000, group: 'ruins' },
    settings: { url: 'settings.json', type: 'json', bytes: 100 },
  },
};

/** A stand-in glTF: a scene with one mesh, so instancing has something to share. */
const fakeModel = () => {
  const scene = new Group();
  const mesh = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
  scene.add(mesh);
  return { scene, animations: [] };
};

const harness = () => makeLibrary();

function makeLibrary(options: {
  failFirst?: string;
  hold?: string;
  concurrency?: number;
  retries?: number;
} = {}) {
  const calls: string[] = [];
  const ticks = new Map<string, (loaded: number, total: number) => void>();
  const released: string[] = [];
  let failed = false;
  const gates = new Map<string, () => void>();

  const make = (kind: string, value: () => unknown): AssetLoader => async (url, onProgress) => {
    calls.push(url);
    if (onProgress) ticks.set(url, onProgress);
    if (options.failFirst === url && !failed) {
      failed = true;
      throw new Error('network went away');
    }
    if (options.hold === url) {
      await new Promise<void>((resolve) => gates.set(url, resolve));
    }
    void kind;
    return value();
  };

  const library = new AssetLibrary(MANIFEST, {
    concurrency: options.concurrency,
    retries: options.retries,
    loaders: {
      model: make('model', fakeModel),
      texture: make('texture', () => ({
        isTexture: true,
        dispose: () => released.push('texture'),
      })),
      json: make('json', () => ({ volume: 0.8 })),
    },
  });
  return { library, calls, ticks, released, open: (url: string) => gates.get(url)?.() };
}

describe('the asset manifest', () => {
  it('refuses what is not a manifest, and what is from the future', () => {
    expect(() => parseManifest({ hello: 'world' })).toThrow(/not a gama manifest/);
    expect(() => parseManifest(null)).toThrow(/not an object/);
    expect(() => parseManifest({ format: 'gama.assets', version: 99, assets: {} })).toThrow(
      /version 99/
    );
    expect(() => parseManifest({ format: 'gama.assets', version: 1 })).toThrow(/no assets/);
  });
});

describe('AssetLibrary', () => {
  it('resolves keys, groups and *, and says so when it cannot', () => {
    const { library } = harness();
    expect(library.resolve('town')).toEqual(['town/crate', 'town/planks']);
    expect(library.resolve('town/crate')).toEqual(['town/crate']);
    expect(library.resolve('*')).toHaveLength(4);
    expect(library.resolve('town', 'town/crate')).toEqual(['town/crate', 'town/planks']);
    expect(library.groups).toEqual(['ruins', 'town']);
    // The message has to name what IS available, or the next thing anybody
    // does is open the manifest to find out.
    expect(() => library.resolve('twon')).toThrow(/no asset or group named "twon".*ruins, town/s);
  });

  it('prefixes the base, so a key never carries a path', () => {
    const { library } = harness();
    expect(library.url('town/crate')).toBe('/assets/town/crate.gltf');
  });

  it('a given base OVERRIDES the manifest, it does not stack with it', () => {
    // Found by the demo: a manifest that sits next to its assets AND
    // declares where they are produced `./assets/./assets/crate.gltf`, and
    // stacked prefixes are a 404 nobody reads carefully.
    const library = new AssetLibrary(MANIFEST, { base: 'https://cdn.example/v2/' });
    expect(library.url('town/crate')).toBe('https://cdn.example/v2/town/crate.gltf');
  });

  it('weighs progress by BYTES, not by file count', async () => {
    // The point of putting sizes in the manifest. Two files, one 4× the
    // other: half of the big one is not half of the download.
    const { library, ticks } = harness();
    const seen: number[] = [];
    library.onProgress = (p) => seen.push(p.fraction);

    const loading = library.load('town');
    // Let the loaders register their progress callbacks.
    await Promise.resolve();
    ticks.get('/assets/town/planks.png')?.(1500, 3000); // half of the 3 KB one
    expect(library.progress.fraction).toBeCloseTo(1500 / 4000, 5); // 0.375, not 0.5
    expect(library.progress.bytesTotal).toBe(4000);

    await loading;
    expect(library.progress.fraction).toBe(1);
    expect(library.progress.loaded).toBe(2);
    expect(seen[seen.length - 1]).toBe(1);
  });

  it('knows what a download will cost before starting it', () => {
    const { library } = harness();
    expect(library.weightOf('town')).toBe(4000);
    expect(library.weightOf('*')).toBe(10100);
  });

  it('fetches once, however many times it is asked', async () => {
    const { library, calls } = harness();
    await Promise.all([library.load('town/crate'), library.load('town/crate')]);
    await library.load('town');
    expect(calls.filter((c) => c.endsWith('crate.gltf'))).toHaveLength(1);
  });

  it('says what to do when an asset is read too early', async () => {
    const { library } = harness();
    expect(() => library.get('town/crate')).toThrow(/not loaded — await library\.load/);
    expect(() => library.get('nope')).toThrow(/unknown asset "nope"/);
    await library.load('town/crate');
    expect(library.scene('town/crate')).toBeTruthy();
    await library.load('settings');
    expect(library.json<{ volume: number }>('settings').volume).toBe(0.8);
  });

  it('instances share geometry — that is the whole point of loading once', async () => {
    const { library } = harness();
    await library.load('town/crate');

    const a = library.instance('town/crate');
    const b = library.instance('town/crate');
    expect(a).not.toBe(b);

    const geometryOf = (root: typeof a) => {
      let uuid = '';
      root.traverse((node) => {
        const mesh = node as Mesh;
        if (mesh.geometry) uuid = mesh.geometry.uuid;
      });
      return uuid;
    };
    expect(geometryOf(a)).toBe(geometryOf(b));
    expect(geometryOf(a)).toBe(geometryOf(library.scene('town/crate')));
  });

  it('a placement from the library does NOT free the library on delete', async () => {
    // The escape hatch earning its keep. Forty crates are one geometry, so
    // deleting one placement must not blank the other thirty-nine — and the
    // way a factory says so is by claiming ownership with its own dispose.
    const { library } = harness();
    await library.load('town/crate');
    const shared = library.scene('town/crate').children[0] as Mesh;
    const freed = vi.spyOn(shared.geometry, 'dispose');

    const catalog = new Catalog().define('crate', library.factory('town/crate'));
    const live = Level.parse({
      format: 'gama.level',
      version: LEVEL_VERSION,
      entities: [
        { id: 'a', kind: 'crate', at: [0, 0, 0] },
        { id: 'b', kind: 'crate', at: [2, 0, 0] },
      ],
    }).instantiate(catalog, new Group());

    live.remove('a');
    expect(freed).not.toHaveBeenCalled();
    live.dispose();
    expect(freed).not.toHaveBeenCalled(); // still the library's
  });

  it('release is reference-counted, so one level cannot unload another', async () => {
    const { library, calls } = harness();
    await library.load('town'); // the menu wants the crate
    await library.load('town/crate'); // …and so does level one

    expect(library.release('town/crate')).toEqual([]); // level one lets go
    expect(library.isLoaded('town/crate')).toBe(true); // the menu still has it
    expect(library.release('town')).toEqual(['town/crate', 'town/planks']);
    expect(library.isLoaded('town/crate')).toBe(false);

    await library.load('town/crate'); // and it can come back
    expect(calls.filter((c) => c.endsWith('crate.gltf'))).toHaveLength(2);
  });

  it('release frees the GPU resources, not just the reference', async () => {
    const { library, released } = harness();
    await library.load('town');
    const geometry = (library.scene('town/crate').children[0] as Mesh).geometry;
    const freed = vi.spyOn(geometry, 'dispose');

    library.release('town');
    expect(freed).toHaveBeenCalled(); // the model, traversed
    expect(released).toEqual(['texture']); // the texture, by its own dispose
  });

  it('clear lets go of everything, whatever the counts say', async () => {
    const { library } = harness();
    await library.load('*');
    await library.load('*'); // two references to everything
    library.clear();
    expect(library.keys.every((k) => !library.isLoaded(k))).toBe(true);
    expect(library.progress.total).toBe(0);
  });

  it('names the asset when a load fails, and does not poison the cache', async () => {
    const { library } = makeLibrary({ failFirst: '/assets/ruins/statue.gltf', retries: 0 });
    await expect(library.load('ruins')).rejects.toThrow(
      /failed to load "ruins\/statue" from \/assets\/ruins\/statue\.gltf/
    );
    // A dropped connection should not make the asset permanently unloadable.
    await library.load('ruins');
    expect(library.isLoaded('ruins/statue')).toBe(true);
  });

  it('retries before giving up', async () => {
    const { library } = makeLibrary({ failFirst: '/assets/town/crate.gltf', retries: 2 });
    await library.load('town/crate');
    expect(library.isLoaded('town/crate')).toBe(true);
  });

  it('refuses a type it has no loader for, and says how to fix it', async () => {
    const library = new AssetLibrary(MANIFEST, { loaders: {} });
    await expect(library.load('settings')).rejects.toThrow(
      /no loader for type "json".*library\.register\('json'/s
    );
  });

  it('honours the concurrency cap', async () => {
    const { library, calls, open } = makeLibrary({
      hold: '/assets/town/crate.gltf',
      concurrency: 1,
    });
    const loading = library.load('town');
    await Promise.resolve();
    await Promise.resolve();
    // The second file cannot start while the first is still in the air.
    expect(calls).toEqual(['/assets/town/crate.gltf']);
    open('/assets/town/crate.gltf');
    await loading;
    expect(calls).toHaveLength(2);
  });
});
