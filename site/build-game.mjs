// Builds Havenbrook Courier and drops it into the docs site at /play/.
//
// The game is a SEPARATE npm project that depends on published `gama3d`,
// `scena3d` and `anima3d` — not on this repo's source. That is deliberate:
// it is the only test in the whole trilogy that exercises the libraries the
// way an outside developer actually gets them, and a workspace link or a
// path dependency would quietly hide exactly the breakage it exists to
// catch. If the published packages are wrong, this build fails.
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const game = join(root, 'game');
const out = join(root, 'site', 'dist', 'play');

const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });

if (!existsSync(join(game, 'node_modules'))) {
  console.log('installing the game\'s own dependencies (from npm)…');
  run('npm install --no-audit --no-fund', game);
}
run('npm run build', game);

mkdirSync(out, { recursive: true });
cpSync(join(game, 'dist'), out, { recursive: true });
console.log(`game → ${out}`);
