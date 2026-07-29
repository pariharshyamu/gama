import { defineConfig, type Plugin } from 'vite';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Stamp the runner's import map with the vendor build digest.
 *
 * The vendor bundles are served under fixed filenames — an import map has
 * nowhere to put a content hash — so a browser that has fetched them once
 * will keep the old copies indefinitely while the hashed page assets update
 * around them. `build-vendor.mjs` writes the digest; this hangs it off the
 * import-map URLs so the runner's `three` resolves to the fresh copy too.
 */
function stampVendorImports(): Plugin {
  return {
    name: 'stamp-vendor-imports',
    transformIndexHtml(html) {
      let stamp = '';
      try {
        stamp = JSON.parse(
          readFileSync(resolve(here, 'public/vendor/build.json'), 'utf8')
        ).stamp;
      } catch {
        return html; // no stamp yet: leave the URLs alone
      }
      return stamp
        ? html.replace(/"\.\/vendor\/([^"]+)"/g, `"./vendor/$1?v=${stamp}"`)
        : html;
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [stampVendorImports()],
  resolve: {
    // The editor page imports the library by NAME, exactly the way a user's
    // app does — pointed at the source so the page is always built against
    // the tree rather than whatever happens to be in dist.
    alias: {
      'gama3d/editor': resolve(here, '../src/editor.ts'),
      gama3d: resolve(here, '../src/index.ts'),
    },
    // One copy of three, always. Two of them and `instanceof Vector3` starts
    // returning false across the seam.
    dedupe: ['three'],
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(here, 'index.html'),
        playground: resolve(here, 'playground.html'),
        guide: resolve(here, 'guide.html'),
        runner: resolve(here, 'runner.html'),
        editor: resolve(here, 'editor.html'),
      },
    },
  },
});
