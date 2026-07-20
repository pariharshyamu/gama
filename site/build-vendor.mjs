// Builds the assets the docs site's live playground needs:
// - vendor/gama.js: the library bundled as a single ESM file (three external)
// - vendor/three.module.js: three's own ESM build, copied
// - docs/*.md: the guides, copied for client-side rendering
import { build } from 'esbuild';
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'site', 'public');
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

copyFileSync(
  join(root, 'node_modules/three/build/three.module.js'),
  join(pub, 'vendor', 'three.module.js')
);

for (const file of readdirSync(join(root, 'docs'))) {
  copyFileSync(join(root, 'docs', file), join(pub, 'docs', file));
}

console.log('site vendor assets built');
