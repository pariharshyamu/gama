# Hosting the site on 103.39.133.227

The docs site and Havenbrook Courier, served from one Linux box over HTTP.

Everything `npm run site:build` produces is static — five HTML entry points,
the hashed bundles, the vendor import-map targets, the guides as markdown,
and the game under `/play/`. So the server is nginx handing over a directory,
and nothing else: no Node process, no database, no application server.

```
your machine                              103.39.133.227
─────────────                             ──────────────
npm run site:deploy
  ├─ npm run site:build   →  site/dist/
  ├─ check the artifacts                  /srv/gama/releases/20260802-141500/
  ├─ rsync ────────────────────────────►  /srv/gama/releases/20260802-141530/  ← new
  ├─ flip the symlink ─────────────────►  /srv/gama/current ─┘
  ├─ prune to the last 5
  └─ smoke-test over HTTP  ◄───────────── nginx :80
```

## Once, on the server

```sh
scp -r deploy/ root@103.39.133.227:/tmp/gama-deploy
ssh root@103.39.133.227 'bash /tmp/gama-deploy/bootstrap.sh'
```

Installs nginx and rsync, lays out `/srv/gama`, installs the site config,
labels the tree for SELinux on RHEL-family boxes, opens port 80, and leaves a
placeholder page so the IP answers with something intelligible before the
first deploy. Re-running it is safe.

It deliberately does **not** run `ufw enable` for you. It stages the rules —
SSH first, then 80 — and stops, because enabling a default-deny firewall on a
box you are connected to over SSH is a decision to make with your eyes open.

## Every time, from your machine

```sh
cp deploy/deploy.env.example deploy/deploy.env   # once; gitignored
npm run site:deploy
```

The build runs locally and the server only ever receives finished artifacts.
That is why the box needs no toolchain and no npm access — and why a broken
build cannot reach it: the checks run before the upload.

| Variable | Default | |
|---|---|---|
| `DEPLOY_HOST` | `103.39.133.227` | |
| `DEPLOY_USER` | `root` | must own `/srv/gama` |
| `DEPLOY_PORT` | `22` | |
| `SSH_KEY` | — | if not your default key |
| `WEB_ROOT` | `/srv/gama` | must match bootstrap |
| `KEEP` | `5` | releases retained for rollback |
| `SKIP_BUILD` | — | `1` ships `site/dist` as it stands |
| `DRY_RUN` | — | `1` stops before the upload |

## Why releases and a symlink

An in-place `rsync` over the live directory is visibly broken while it runs:
the new `index.html` lands naming hashed bundles that have not uploaded yet,
and anyone who loads the page in that window gets a white screen. Each deploy
therefore writes a whole new directory and then moves a symlink.

The move is `mv -T`, not `ln -sfn`. `ln -sfn` onto an existing symlink
unlinks and re-creates — a real, if brief, window where the document root
does not resolve. `mv -T` is `rename(2)` and has none.

`--link-dest` hardlinks anything byte-identical to the previous release, so
consecutive deploys of a content-hashed site transfer and store almost
nothing. Five retained releases do not cost five copies.

nginx re-resolves `/srv/gama/current` per request, so the flip needs no
reload and drops no connection. **Do not add `open_file_cache`** without also
reloading on deploy — caching the resolved descriptors is exactly what would
make the swap stop working.

### Rolling back

```sh
ssh root@103.39.133.227 'ls -1 /srv/gama/releases | sort -r'     # pick one
ssh root@103.39.133.227 'ln -s /srv/gama/releases/REL /tmp/c && mv -T /tmp/c /srv/gama/current'
```

No rebuild, no upload; it is the same atomic flip pointed backwards.

## What the smoke test actually proves

`deploy.sh` finishes by requesting the live site over HTTP — not by trusting
that `rsync` exited 0. It checks each entry point, that `/play/` serves the
game, that a nonsense URL 404s rather than falling back to the landing page,
and that the hashed bundle **the deployed `index.html` actually names**
resolves. That last one is the check that catches a partial upload, which
every other status code would happily survive.

## Caching, in three tiers

Worth knowing before you change any of it, because `dist/assets/` is a
**mixed** directory — Vite's fingerprinted bundles land there alongside the
unhashed game art copied from `site/public/assets/`.

| | |
|---|---|
| `assets/name-HASH.js\|css` | 1 year, `immutable` — the hash is the cache key |
| `vendor/*` | 1 year — fixed filenames, but `?v=<digest>` stamped by `site/vite.config.ts` busts them |
| `assets/manifest.json`, `docs/*.md`, `*.html` | `no-cache`, always revalidated |
| everything else (art, audio) | 1 day |

A blanket immutable rule on `/assets/` would pin stale `.gltf` files for a
year. `index.html` is never immutable because one cached copy of it pins an
entire stale deploy no matter how correct the first row is.

The rules are a `map`, not per-`location` headers, and that is load-bearing:
`add_header` inside a `location` **replaces** every inherited `add_header`
rather than adding to it, so the obvious version of this config silently
drops `X-Frame-Options` and `Referrer-Policy` from exactly the responses that
need them most. Deriving the value keeps one header set for the whole server.

## Three nginx traps this config already stepped in

Recorded because all three look correct and none of them are.

**`types { include /etc/nginx/mime.types; … }`** — `mime.types` is *itself* a
`types { … }` block, so this nests one inside another and nginx dies with
``unexpected "{" in /etc/nginx/mime.types:2``.

**A `types` block inside `server { … }`** — parses fine, and replaces the
inherited map instead of extending it. Every `.css` and `.js` then goes out
as `application/octet-stream`, and the site renders as unstyled text with no
scripts and no clue why. The additions live at http level, in the same
context `nginx.conf` included the base map into, where a second `types` block
accumulates onto the first.

**`listen [::]:80`** — on a kernel without IPv6 this does not degrade, it
kills nginx outright with `socket() [::]:80 failed (97: Address family not
supported by protocol)`: a config that passes `nginx -t` for syntax and still
refuses to start. It ships commented out; `bootstrap.sh` uncomments it when
`/proc/net/if_inet6` says the box actually has IPv6.

## No HTTPS, and why

Let's Encrypt does not issue certificates for bare IP addresses, so
`http://103.39.133.227/` is the honest ceiling for this setup. Nothing here
handles credentials or payments, so the exposure is eavesdropping on which
docs page someone read.

The moment a domain points at the box:

```sh
# add `server_name example.com;` to the server block first,
# or certbot has nothing to match
sudo certbot --nginx -d example.com
```

which rewrites the config in place, adds the 443 listener and the
HTTP→HTTPS redirect, and installs a renewal timer.

## No Content-Security-Policy, and why

The playground compiles user-authored code to a `blob:` module URL and
imports it into a same-origin iframe (`site/src/runner.ts`). A reflexive
`default-src 'self'` breaks the most interesting page on the site. A working
policy needs at least `script-src 'self' blob:` and `worker-src blob:`, and
should be checked against `node site/verify-playgrounds.mjs` before you
believe it.

## This does not host the multiplayer server

`scripts/net-server.mjs` is a long-lived Node process and is not part of this
deployment — the site does not need it, and nothing on the box runs Node.
Adding it means a systemd unit, and an nginx `location /ws { proxy_pass … }`
with `Upgrade`/`Connection` headers set for the WebSocket handshake.

## GitHub Pages still works

`npm run site:publish` pushes the same build to the `docs` branch and is
untouched by any of this. The two can run side by side; `base: './'` in
`site/vite.config.ts` is what lets one build serve correctly from both a
subpath and a domain root.

## Verified

The config in `nginx/gama.conf` was installed on nginx 1.24.0 against a real
`site/dist`, and checked for: all seven entry points plus `/play/` and
`/play/editor.html` returning 200; `/guide` resolving to `guide.html`; a
nonsense URL returning 404 rather than the landing page; dotfiles returning
403; the four cache tiers emitting the right `Cache-Control`; the security
headers surviving on every one of them; `gltf`, `markdown` and `wav` typed
correctly; and gzip engaging on the 572 KB editor bundle.

`bootstrap.sh` was run end to end on Ubuntu 24.04 — it stops at `systemctl`
only in a container that was not booted with systemd.
