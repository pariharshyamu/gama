import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

// The game ships under /play/ on the docs site, and also has to run from a
// file server at the root during development — so the base is relative.
export default defineConfig({
  base: './',
  // DEDUPE THREE. The instant a dependency is linked (npm link, a file:
  // path, a monorepo) or nested, `three` resolves from two directories and
  // both copies land in the bundle — 38 KB gzipped of duplicate matrix maths
  // here, and worse than the weight: `instanceof Vector3` starts returning
  // false across the seam, which is a genuinely baffling afternoon.
  resolve: { dedupe: ['three'] },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    // Two pages: the game, and the level editor that authors what it loads.
    rollupOptions: {
      input: {
        index: resolve(here, 'index.html'),
      },
    },
  },
});
