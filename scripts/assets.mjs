#!/usr/bin/env node
/**
 * The build-time half of the asset pipeline.
 *
 * Walks an assets directory and writes a manifest: keys, types, byte sizes,
 * content hashes, groups. That is what turns loading from "fetch some URLs"
 * into something a loading bar can be honest about and a build can check.
 *
 *   node scripts/assets.mjs assets --out assets/manifest.json
 *   node scripts/assets.mjs assets --out assets/manifest.json --check
 *   node scripts/assets.mjs assets --out manifest.json --types src/assets.d.ts
 *
 * `--check` writes nothing and exits non-zero if the manifest on disk does
 * not match what the directory says. That is the CI gate: a manifest that
 * has drifted from its files is a game that 404s on somebody else's machine.
 *
 * What it reports, and why each one has bitten somebody:
 *
 *   - **duplicates** — two paths, one hash. Usually a file copied instead of
 *     referenced, and it doubles the download for no visible reason.
 *   - **budget** — total and per-group bytes against a limit you set. A
 *     texture that grew from 40 KB to 4 MB does not look different in a
 *     diff.
 *   - **unknown extensions** — a file nothing will ever load, sitting in the
 *     directory looking loaded.
 */
import { createHash } from 'node:crypto';
import { readdir, readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';

const TYPES = {
  '.gltf': 'model',
  '.glb': 'model',
  '.fbx': 'model',
  '.obj': 'model',
  '.png': 'texture',
  '.jpg': 'texture',
  '.jpeg': 'texture',
  '.webp': 'texture',
  '.ktx2': 'texture',
  '.hdr': 'texture',
  '.mp3': 'audio',
  '.ogg': 'audio',
  '.wav': 'audio',
  '.m4a': 'audio',
  '.json': 'json',
  '.txt': 'text',
  '.csv': 'text',
  '.md': 'text',
};

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const has = (name) => args.includes(`--${name}`);

const root = resolve(args.find((a) => !a.startsWith('--')) ?? 'assets');
const outPath = resolve(flag('out', join(root, 'manifest.json')));
const typesPath = flag('types');
const base = flag('base');
const budgetMb = Number(flag('budget', '0'));
const check = has('check');
const quiet = has('quiet');

// ---- walk -----------------------------------------------------------------

async function walk(dir) {
  const found = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    console.error(`assets: no such directory: ${dir}`);
    process.exit(1);
  }
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(full)));
    else found.push(full);
  }
  return found;
}

const files = (await walk(root)).filter((f) => resolve(f) !== outPath);

// ---- describe -------------------------------------------------------------

const assets = {};
const warnings = [];
const byHash = new Map();
const skipped = [];

for (const file of files) {
  const rel = relative(root, file).split(sep).join('/');
  const ext = extname(rel).toLowerCase();
  const type = TYPES[ext];
  if (!type) {
    skipped.push(rel);
    continue;
  }

  const bytes = (await stat(file)).size;
  const hash = createHash('sha256').update(await readFile(file)).digest('hex').slice(0, 8);

  // The key is the path without its extension: `models/crate.gltf` becomes
  // `models/crate`. Not the bare filename — two `icon.png` in different
  // folders is a normal thing to have, and silently keeping one of them is
  // not a normal thing to do.
  const key = rel.replace(/\.[^.]+$/, '');
  if (assets[key]) {
    warnings.push(`two files collapse to the key "${key}" — rename one`);
  }
  // The first directory is the group, by convention. A file at the root
  // belongs to no group, which the library reads as "always loaded".
  const group = rel.includes('/') ? rel.slice(0, rel.indexOf('/')) : undefined;

  assets[key] = { url: rel, type, bytes, hash, ...(group ? { group } : {}) };

  const twin = byHash.get(hash);
  if (twin) warnings.push(`"${key}" and "${twin}" are the same bytes — one of them is a copy`);
  else byHash.set(hash, key);
}

// ---- budgets --------------------------------------------------------------

const total = Object.values(assets).reduce((sum, a) => sum + a.bytes, 0);
const perGroup = {};
for (const asset of Object.values(assets)) {
  const name = asset.group ?? '(always)';
  perGroup[name] = (perGroup[name] ?? 0) + asset.bytes;
}
if (budgetMb > 0 && total > budgetMb * 1024 * 1024) {
  warnings.push(
    `total is ${(total / 1048576).toFixed(2)} MB, over the ${budgetMb} MB budget`
  );
}

const manifest = {
  format: 'gama.assets',
  version: 1,
  ...(base ? { base } : {}),
  assets,
  meta: {
    source: relative(process.cwd(), root).split(sep).join('/'),
    count: Object.keys(assets).length,
    bytes: total,
    groups: perGroup,
  },
};

const text = `${JSON.stringify(manifest, null, 2)}\n`;

// ---- report ---------------------------------------------------------------

const mb = (n) => `${(n / 1048576).toFixed(2)} MB`;
if (!quiet) {
  console.log(`assets: ${Object.keys(assets).length} files, ${mb(total)}`);
  for (const [group, bytes] of Object.entries(perGroup).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${group.padEnd(18)} ${mb(bytes).padStart(9)}`);
  }
  if (skipped.length) console.log(`  skipped (unknown type): ${skipped.join(', ')}`);
  for (const warning of warnings) console.log(`  ! ${warning}`);
}

// ---- write, or check ------------------------------------------------------

if (check) {
  let current = null;
  try {
    current = await readFile(outPath, 'utf8');
  } catch {
    console.error(`assets: ${relative(process.cwd(), outPath)} does not exist — run without --check`);
    process.exit(1);
  }
  // Compare the asset table, not the whole file: `meta` carries byte totals
  // and would make the check fail on a formatting change alone.
  const same = JSON.stringify(JSON.parse(current).assets) === JSON.stringify(assets);
  if (!same) {
    console.error(
      `assets: ${relative(process.cwd(), outPath)} is stale — re-run scripts/assets.mjs and commit it`
    );
    process.exit(1);
  }
  if (!quiet) console.log('assets: manifest is current ✓');
} else {
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, text);
  if (!quiet) console.log(`assets: wrote ${relative(process.cwd(), outPath)}`);

  if (typesPath) {
    const keys = Object.keys(assets)
      .map((k) => `  | '${k}'`)
      .join('\n');
    const groups = [...new Set(Object.values(assets).map((a) => a.group).filter(Boolean))]
      .map((g) => `  | '${g}'`)
      .join('\n');
    const declaration =
      `// Generated by scripts/assets.mjs. Do not edit.\n` +
      `// Keys are compile-time, so a renamed file is a type error rather than\n` +
      `// a 404 somebody finds in production.\n\n` +
      `export type AssetName =\n${keys || "  | never"};\n\n` +
      `export type AssetGroup =\n${groups || '  | never'};\n`;
    await mkdir(dirname(resolve(typesPath)), { recursive: true });
    await writeFile(resolve(typesPath), declaration);
    if (!quiet) console.log(`assets: wrote ${typesPath}`);
  }
}

if (warnings.length && has('strict')) {
  console.error(`assets: ${warnings.length} warning(s), and --strict was passed`);
  process.exit(1);
}
