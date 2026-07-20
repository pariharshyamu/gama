import { Texture, TextureLoader, AudioLoader } from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Promise-based asset loading with caching and simple progress reporting.
 *
 * ```ts
 * const assets = new Assets();
 * assets.onProgress = (done, total) => hud.setLoading(done / total);
 * const [hero, ground] = await Promise.all([
 *   assets.gltf('models/hero.glb'),
 *   assets.texture('textures/grass.png'),
 * ]);
 * ```
 */
export class Assets {
  onProgress: ((loaded: number, total: number) => void) | null = null;

  private gltfLoader = new GLTFLoader();
  private textureLoader = new TextureLoader();
  private audioLoader = new AudioLoader();
  private cache = new Map<string, Promise<unknown>>();
  private loaded = 0;
  private total = 0;

  gltf(url: string): Promise<GLTF> {
    return this.load(url, () => this.gltfLoader.loadAsync(url));
  }

  texture(url: string): Promise<Texture> {
    return this.load(url, () => this.textureLoader.loadAsync(url));
  }

  audio(url: string): Promise<AudioBuffer> {
    return this.load(url, () => this.audioLoader.loadAsync(url));
  }

  private load<T>(url: string, loader: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(url);
    if (cached) return cached as Promise<T>;

    this.total++;
    const promise = loader()
      .then((asset) => {
        this.loaded++;
        this.onProgress?.(this.loaded, this.total);
        return asset;
      })
      .catch((error) => {
        this.cache.delete(url);
        this.total--;
        throw error;
      });
    this.cache.set(url, promise);
    return promise;
  }
}
