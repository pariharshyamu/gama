import { defineConfig } from 'vite';

export default defineConfig({
  // Relative, so the build works from a sub-path (GitHub Pages, itch.io)
  // as well as from a domain root.
  base: './',
  // DEDUPE THREE. The moment a dependency is linked (npm link, a file: path,
  // a monorepo) or nested, `three` resolves from two directories and BOTH
  // copies land in the bundle. It cost 37 KB gzipped when it happened here —
  // and the weight is the lesser problem: `instanceof Vector3` starts
  // returning false across the seam, which is a genuinely baffling afternoon.
  resolve: { dedupe: ['three'] },
  build: { outDir: 'dist', emptyOutDir: true, target: 'es2022' },
});
