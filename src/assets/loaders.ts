import { AudioLoader, TextureLoader, type Texture } from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AssetLibrary, type AssetLoader, type AssetLibraryOptions } from './AssetLibrary';

/**
 * The loaders a browser game actually needs, wrapped as plain functions.
 *
 * `AssetLibrary` takes loaders rather than owning them, so this file is the
 * only place three's loader classes appear — which is what lets the library
 * be tested without a GPU, and what lets a game swap in Draco, KTX2, a mesh
 * format of its own, or a cache that reads from IndexedDB, without asking
 * anybody's permission.
 */

export interface DefaultLoaderOptions {
  /** Reuse loaders you already configured (a DRACOLoader, a KTX2Loader). */
  gltf?: GLTFLoader;
  texture?: TextureLoader;
  audio?: AudioLoader;
}

/** Adapt three's `loadAsync(url, onProgress)` to the library's shape. */
const fromThree =
  <T>(load: (url: string, onProgress?: (event: ProgressEvent) => void) => Promise<T>): AssetLoader<T> =>
  (url, onProgress) =>
    load(url, onProgress ? (event) => onProgress(event.loaded, event.total) : undefined);

export function defaultLoaders(options: DefaultLoaderOptions = {}): Record<string, AssetLoader> {
  const gltf = options.gltf ?? new GLTFLoader();
  const texture = options.texture ?? new TextureLoader();
  const audio = options.audio ?? new AudioLoader();

  return {
    model: fromThree<GLTF>((url, onProgress) => gltf.loadAsync(url, onProgress)),
    texture: fromThree<Texture>((url, onProgress) => texture.loadAsync(url, onProgress)),
    audio: fromThree<AudioBuffer>((url, onProgress) => audio.loadAsync(url, onProgress)),
    // fetch, not three's FileLoader: it reports progress the same way and
    // does not add a second cache with different eviction rules.
    json: progressiveFetch((response) => response.json()),
    text: progressiveFetch((response) => response.text()),
  };
}

/**
 * `fetch`, reporting progress from Content-Length where the server sends it.
 *
 * Worth the twenty lines: a level file or a dialogue table can be the
 * biggest thing a game downloads, and a bar that sits still through it looks
 * broken.
 */
function progressiveFetch<T>(read: (response: Response) => Promise<T>): AssetLoader<T> {
  return async (url, onProgress) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const length = Number(response.headers.get('content-length') ?? 0);
    if (!onProgress || !length || !response.body) return read(response);

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let loaded = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      onProgress(loaded, length);
    }
    return read(new Response(new Blob(chunks as BlobPart[]), { headers: response.headers }));
  };
}

/**
 * An `AssetLibrary` with the browser loaders already registered.
 *
 * ```ts
 * const library = await openAssets('./assets/manifest.json');
 * await library.load('menu');
 * ```
 */
export async function openAssets(
  manifestUrl: string,
  options: AssetLibraryOptions & DefaultLoaderOptions = {}
): Promise<AssetLibrary> {
  const response = await fetch(manifestUrl);
  if (!response.ok) {
    throw new Error(`openAssets: ${manifestUrl} → ${response.status} ${response.statusText}`);
  }
  const manifest = (await response.json()) as { base?: string };
  // Precedence, most specific first: what the caller passed, then what the
  // manifest declares, then the directory the manifest was fetched from —
  // which is the normal layout and worth not making every game repeat.
  const base = options.base ?? manifest.base ?? manifestUrl.replace(/[^/]*$/, '');
  return new AssetLibrary(manifest, {
    ...options,
    base,
    loaders: { ...defaultLoaders(options), ...options.loaders },
  });
}
