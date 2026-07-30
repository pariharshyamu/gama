import type { Object3D } from 'three';

/**
 * Freeing GPU resources, and the one rule about who owns them.
 *
 * Detaching an object from the scene does not free anything: three.js holds
 * geometries, materials and textures until something calls `dispose()`. That
 * is fine for a scene built once, and a leak everywhere else — a level
 * editor rebuilds an entity on every prop change, and a game that unloads a
 * level and loads the next one does it a hundred times an hour.
 *
 * **Ownership is claimed, not guessed.** If the thing that produced an
 * object has its own `dispose()`, that is the whole answer and nothing else
 * is touched. It is how a factory handing out SHARED or cached resources —
 * a glTF loaded once and cloned forty times — says *not yours to free*.
 * Only when nobody claims ownership is the object traversed.
 */

interface Disposable {
  dispose?: () => void;
  uniforms?: Record<string, { value?: unknown } | undefined>;
  [key: string]: unknown;
}

/** Does this look like something that owns its own cleanup? */
export function claimsOwnership(source: unknown): source is { dispose: () => void } {
  return typeof (source as { dispose?: unknown } | null)?.dispose === 'function';
}

/**
 * Free everything an object tree allocated: geometries, materials, and the
 * textures those materials generated.
 *
 * Use only on objects nothing else shares. Anything cloned from a loaded
 * asset shares its geometry with the original, and freeing one blanks all
 * of them.
 */
export function releaseObject(object: Object3D): void {
  object.traverse((node) => {
    const mesh = node as Object3D & {
      geometry?: { dispose?: () => void };
      material?: Disposable | Disposable[];
    };
    mesh.geometry?.dispose?.();
    const material = mesh.material;
    if (Array.isArray(material)) material.forEach(releaseMaterial);
    else if (material) releaseMaterial(material);
  });
}

/** A material, and the textures that came with it. */
export function releaseMaterial(material: Disposable): void {
  const free = (value: unknown): void => {
    const texture = value as { isTexture?: boolean; dispose?: () => void } | null;
    if (texture?.isTexture) texture.dispose?.();
  };
  for (const value of Object.values(material)) free(value);
  // Shader materials keep theirs one level further down.
  for (const uniform of Object.values(material.uniforms ?? {})) free(uniform?.value);
  material.dispose?.();
}
