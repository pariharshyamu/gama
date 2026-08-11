import { defineConfig } from 'vite';

// Relative base: this runs from a plain file server in the gates and from a
// sub-path when deployed, and neither should need a rebuild.
export default defineConfig({
  base: './',
  // DEDUPE THREE — two copies in one bundle make `instanceof Vector3` return
  // false across the seam, which is a genuinely baffling afternoon.
  resolve: { dedupe: ['three'] },
  build: { outDir: 'dist', emptyOutDir: true, target: 'es2022' },
});
