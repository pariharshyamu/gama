import { defineConfig } from 'vite';

// The game ships under /play/ on the docs site, and also has to run from a
// file server at the root during development — so the base is relative.
export default defineConfig({
  base: './',
  build: { outDir: 'dist', emptyOutDir: true, target: 'es2022' },
});
