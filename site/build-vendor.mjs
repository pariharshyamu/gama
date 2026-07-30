// Builds the assets the docs site's live playground needs:
// - vendor/gama.js: the library bundled as a single ESM file (three external)
// - vendor/three.module.js: three's own ESM build, copied
// - docs/*.md: the guides, copied for client-side rendering
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'site', 'public');
// Wipe first, so the stamp below digests exactly what this build produced
// and nothing an earlier one happened to leave behind.
rmSync(join(pub, 'vendor'), { recursive: true, force: true });
mkdirSync(join(pub, 'vendor'), { recursive: true });
mkdirSync(join(pub, 'docs'), { recursive: true });

await build({
  entryPoints: [join(root, 'src/index.ts')],
  bundle: true,
  format: 'esm',
  minify: true,
  outfile: join(pub, 'vendor', 'gama.js'),
  plugins: [
    {
      // Keep exactly 'three' external (the runner's import map provides it)
      // while still bundling 'three/examples/jsm/*' (GLTFLoader et al.),
      // which esbuild's `external: ['three']` would wrongly externalize too.
      name: 'three-exact-external',
      setup(builder) {
        builder.onResolve({ filter: /^three$/ }, () => ({ path: 'three', external: true }));
      },
    },
  ],
});

// Templates bundle: shares the core module (external 'gama' via the
// runner's import map) so classes like MotionAgent are not duplicated —
// instanceof checks across user code and templates must agree.
await build({
  entryPoints: [join(root, 'src/templates.ts')],
  bundle: true,
  format: 'esm',
  minify: true,
  outfile: join(pub, 'vendor', 'templates.js'),
  plugins: [
    {
      name: 'externals',
      setup(builder) {
        builder.onResolve({ filter: /^three$/ }, () => ({ path: 'three', external: true }));
        builder.onResolve({ filter: /^\.\.\/index$/ }, () => ({ path: 'gama3d', external: true }));
      },
    },
  ],
});

// Net bundle: no three at all, so it stands alone. A separate file for the
// same reason it is a separate entry point — a playground example that never
// opens a socket should not download the netcode.
await build({
  entryPoints: [join(root, 'src/net.ts')],
  bundle: true,
  format: 'esm',
  minify: true,
  outfile: join(pub, 'vendor', 'net.js'),
  plugins: [
    {
      name: 'externals',
      setup(builder) {
        builder.onResolve({ filter: /^three$/ }, () => ({ path: 'three', external: true }));
      },
    },
  ],
});

// three r185 SPLIT ITS BUILD: three.module.js is no longer the whole
// library, it imports the bulk of it from ./three.core.js alongside. Copy
// only the one and the browser 404s the other, and the entire playground
// dies before a single example runs — so copy every build file the module
// entry can reach.
for (const file of ['three.module.js', 'three.core.js']) {
  copyFileSync(
    join(root, 'node_modules/three/build', file),
    join(pub, 'vendor', file)
  );
}

for (const file of readdirSync(join(root, 'docs'))) {
  copyFileSync(join(root, 'docs', file), join(pub, 'docs', file));
}

console.log('site vendor assets built');

// The vendor bundles are served under FIXED filenames (vendor/gama.js and
// friends) because an import map has nowhere to put a content hash. So a
// browser that fetched them once keeps using that copy of the library
// forever, however many times the docs are redeployed — the page updates,
// its hashed assets update, and the LIBRARY silently does not. Which is the
// worst version of this bug, because everything looks deployed.
//
// So digest the bytes we just emitted and hand the result to the two places
// that name these files — the runner's rewriter and the import map — to hang
// off the URLs as a query. Same bytes, same URL, still cached; anything
// changed at all, new URL. Note this hashes the OUTPUT rather than the
// dependency versions: a locally staged dist or a bumped `three` moves the
// stamp too, and those are exactly the cases a version list would miss.
const digest = createHash('sha256');
const absorb = (dir, prefix = '') => {
  const entries = readdirSync(dir, { withFileTypes: true });
  entries.sort((a, b) => (a.name < b.name ? -1 : 1)); // hash order must not depend on the filesystem
  for (const entry of entries) {
    const rel = prefix + entry.name;
    if (entry.isDirectory()) absorb(join(dir, entry.name), `${rel}/`);
    else if (rel !== 'build.json') digest.update(rel).update(readFileSync(join(dir, entry.name)));
  }
};
absorb(join(pub, 'vendor'));
const stamp = digest.digest('hex').slice(0, 12);
writeFileSync(join(pub, 'vendor', 'build.json'), JSON.stringify({ stamp }));
console.log(`vendor build stamp: ${stamp}`);
