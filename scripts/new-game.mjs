#!/usr/bin/env node
/**
 * Scaffold a new game from one of the templates.
 *
 *   node scripts/new-game.mjs my-game                  # the starter
 *   node scripts/new-game.mjs my-game --template courier
 *   node scripts/new-game.mjs ../elsewhere/my-game --name "Night Shift"
 *
 * It copies a template, renames it, and stops. No install, no git init, no
 * interactive wizard — the next two commands are printed instead of guessed
 * at, because a scaffolder that runs `npm install` for you is a scaffolder
 * that fails behind a corporate proxy for reasons you cannot see.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const TEMPLATES = {
  starter: {
    from: join(root, 'templates', 'starter'),
    blurb: 'A complete small game: find five markers before the clock runs out.',
  },
  courier: {
    from: join(root, 'game'),
    blurb: 'Havenbrook Courier — a full delivery game with a generated village.',
  },
};

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const target = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1]?.startsWith('--') !== true);
const template = flag('template', 'starter');

if (!target || args.includes('--help')) {
  console.log('Usage: node scripts/new-game.mjs <directory> [--template starter|courier] [--name "Title"]\n');
  for (const [id, t] of Object.entries(TEMPLATES)) console.log(`  ${id.padEnd(9)} ${t.blurb}`);
  process.exit(target ? 0 : 1);
}
const chosen = TEMPLATES[template];
if (!chosen) {
  console.error(`Unknown template "${template}". Try: ${Object.keys(TEMPLATES).join(', ')}`);
  process.exit(1);
}

const dest = resolve(process.cwd(), target);
if (existsSync(dest) && readdirSync(dest).length) {
  console.error(`${dest} already exists and is not empty.`);
  process.exit(1);
}

const slug = dest.split(/[\\/]/).pop();
const title = flag('name', slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));

mkdirSync(dest, { recursive: true });
cpSync(chosen.from, dest, {
  recursive: true,
  // Never copy somebody else's build output or installed modules into a
  // brand new project.
  filter: (src) => !/[\\/](node_modules|dist|\.git)$/.test(src),
});

// `_gitignore` ships in the template because npm refuses to publish a file
// literally named `.gitignore` inside a package directory.
const ignore = join(dest, '_gitignore');
if (existsSync(ignore)) renameSync(ignore, join(dest, '.gitignore'));
else writeFileSync(join(dest, '.gitignore'), 'node_modules\ndist\n');

// Rename the project: package name, <title>, and the visible <h1>.
const pkgPath = join(dest, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
pkg.name = slug;
pkg.version = '0.1.0';
pkg.private = true;
delete pkg.description;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

const htmlPath = join(dest, 'index.html');
if (existsSync(htmlPath)) {
  let html = readFileSync(htmlPath, 'utf8');
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${title}</h1>`);
  writeFileSync(htmlPath, html);
}

const readme = join(dest, 'README.md');
if (existsSync(readme) && statSync(readme).isFile()) {
  writeFileSync(
    readme,
    `# ${title}\n\nA 3D game for the browser, built on gama3d · scena3d · anima3d.\n\n` +
      '```bash\nnpm install\nnpm run dev      # play it\nnpm run build    # typecheck + bundle to dist/\n```\n\n' +
      'The shell — title, settings, pause, results, best score, phone controls —\n' +
      "is GAMA's `Shell`, wired to the `data-screen` / `data-shell` / `data-setting`\n" +
      'attributes in `index.html`. `src/main.ts` only says what a round is.\n'
  );
}

console.log(`\n  ${title} → ${dest}\n  from the "${template}" template\n`);
console.log('  Next:\n');
console.log(`    cd ${target}`);
console.log('    npm install');
console.log('    npm run dev\n');
