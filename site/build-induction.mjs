// Builds INDUCTION and drops it into the docs site at /induction/.
//
// Like the game, this is a SEPARATE npm project that depends on published
// `gama3d`, `scena3d` and `anima3d` rather than on this repo's source — so it
// exercises the libraries the way an outside developer actually gets them, and
// a broken publish fails this build rather than hiding behind a workspace link.
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const app = join(root, 'induction');
const out = join(root, 'site', 'dist', 'induction');

const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });

if (!existsSync(join(app, 'node_modules'))) {
  console.log("installing induction's own dependencies (from npm)…");
  run('npm install --no-audit --no-fund', app);
}
run('npm run build', app);

mkdirSync(out, { recursive: true });
cpSync(join(app, 'dist'), out, { recursive: true });
console.log(`induction → ${out}`);
