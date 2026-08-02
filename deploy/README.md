# Hosting the site on gama.playmeet.games

The docs site and Havenbrook Courier, served over HTTPS from one Linux box at
103.39.133.227.

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
  └─ smoke-test over HTTPS ◄───────────── nginx :443  gama.playmeet.games
```

## 1. The DNS record — you have to do this one

Nothing in this directory can create it. At whoever hosts the
`playmeet.games` zone:

| | |
|---|---|
| Type | `A` |
| Name | `gama` (i.e. `gama.playmeet.games`) |
| Value | `103.39.133.227` |
| TTL | 300 while you are setting up; raise it later |
| Proxy | **off** — see below if you are on Cloudflare |

Check it landed before going further. `enable-tls.sh` checks too, and refuses
to spend a rate-limited certificate request on a name that does not resolve
here yet:

```sh
dig +short gama.playmeet.games      # want: 103.39.133.227
```

If the zone is on Cloudflare with the orange cloud on, the HTTP-01 challenge
validates against Cloudflare's edge rather than this box. Turn the proxy off
for this record (grey cloud) at least until the certificate is issued, or
switch to a DNS-01 challenge.

## 2. Once, on the server

```sh
scp -r deploy/ root@103.39.133.227:/tmp/gama-deploy
ssh root@103.39.133.227 'bash /tmp/gama-deploy/bootstrap.sh'
```

Installs nginx and rsync, lays out `/srv/gama`, installs the config, labels
the tree for SELinux on RHEL-family boxes, opens port 80, and leaves a
placeholder page so the box answers with something intelligible before the
first deploy. Re-running it is safe — including after TLS is on, which it
detects and leaves alone.

It deliberately does **not** run `ufw enable` for you. It stages the rules —
SSH first, then 80 — and stops, because enabling a default-deny firewall on a
box you are connected to over SSH is a decision to make with your eyes open.

## 3. Turn on HTTPS

```sh
ssh root@103.39.133.227 'EMAIL=you@example.com bash /tmp/gama-deploy/enable-tls.sh'
```

Obtains a Let's Encrypt certificate, swaps the HTTP config for the TLS one,
and reloads. nginx keeps serving throughout; there is no window where the
site is down. Set `EMAIL` — without it certbot registers with no contact and
nobody is told when renewal starts failing.

Debugging it? `STAGING=1` uses Let's Encrypt's staging CA: the certificate is
not browser-trusted, but the rate limits are vastly looser than the five
failures per hostname per hour you get on the real one.

## 4. Every time, from your machine

```sh
cp deploy/deploy.env.example deploy/deploy.env   # once; gitignored
npm run site:deploy
```

The build runs locally and the server only ever receives finished artifacts.
That is why the box needs no toolchain and no npm access — and why a broken
build cannot reach it: the checks run before the upload.

| Variable | Default | |
|---|---|---|
| `DEPLOY_HOST` | `103.39.133.227` | where to ssh/rsync — the IP, so it works when DNS does not |
| `SITE_URL` | `https://gama.playmeet.games` | where to smoke-test — the name on the certificate |
| `DEPLOY_USER` | `root` | must own `/srv/gama` |
| `DEPLOY_PORT` | `22` | |
| `SSH_KEY` | — | if not your default key |
| `WEB_ROOT` | `/srv/gama` | must match bootstrap |
| `KEEP` | `5` | releases retained for rollback |
| `SKIP_BUILD` | — | `1` ships `site/dist` as it stands |
| `DRY_RUN` | — | `1` stops before the upload |

`DEPLOY_HOST` and `SITE_URL` are separate on purpose. The upload needs the
address that answers SSH; the smoke test needs the name on the certificate.
Point the checks at the IP over HTTPS and every one of them fails on a name
mismatch that has nothing to do with the deploy that just ran.

## Or let CI do it

`.github/workflows/deploy.yml` runs all of the above from GitHub Actions —
on push to the default branch, or on demand from the Actions tab with
checkboxes for `provision` and `enable_tls`.

It does not reimplement any of this. It runs `npm run site:deploy` exactly
the way you would locally, so what you test by hand is what CI runs and there
is no second copy of the logic to drift out of sync.

Set up once:

```sh
ssh-keygen -t ed25519 -f ~/.ssh/gama_deploy -C "gama deploy" -N ""
ssh-copy-id -i ~/.ssh/gama_deploy.pub root@103.39.133.227

cat ~/.ssh/gama_deploy          # → secret DEPLOY_SSH_KEY
ssh-keyscan -H 103.39.133.227   # → secret SSH_KNOWN_HOSTS
```

`SSH_KNOWN_HOSTS` is optional and you want it. Without it the workflow falls
back to `ssh-keyscan` at run time, which trusts whatever key the host offers
at that moment — fine on a network you trust, and exactly the check that
would catch someone standing in the middle if you cannot be sure.

The workflow decides HTTP vs HTTPS for its smoke test by asking the server
rather than guessing, so the first run (before a certificate exists) checks
over HTTP and every run afterwards over HTTPS, with no flag to remember.

`typecheck` and the test suite run before anything is uploaded. `deploy.sh`
already refuses to ship a build whose `index.html` names files that are not
there, but that catches a broken *build* — a green site serving a library
that fails its own tests is not a successful deploy either.

## The two configs, and why certbot does not write them

```
snippets/gama-http.conf   http-level: the MIME additions and the cache map
snippets/gama-site.conf   server-level: root, gzip, headers, routing
gama.conf                 :80 serving the site        ← before TLS
gama-tls.conf             :80 redirecting, :443 site  ← after TLS
```

Exactly one of `gama.conf` / `gama-tls.conf` is ever enabled. Both include
`gama-http.conf`, and two copies of that `map` is a hard config error — which
is the failure you want if both ever get enabled at once.

`enable-tls.sh` runs `certbot certonly --webroot`, **not** `certbot --nginx`.
The `--nginx` plugin rewrites the server block in place, and this config is
version-controlled and re-installed by `bootstrap.sh` — so the next
provisioning run would silently revert TLS, and it would look like a clean
run right up until a browser refused the site. The certificate is data and
lives on the box; the config is code and lives in git.

`bootstrap.sh` knows about this: if the TLS config is already enabled it
refreshes the shared snippets and leaves the site config alone.

### Renewal

certbot's own timer renews within 30 days of expiry. The
`--deploy-hook "systemctl reload nginx"` is stored in the renewal config, so
nginx picks up the new certificate without anyone watching. `enable-tls.sh`
runs `certbot renew --dry-run` at the end, which is what proves that now
rather than in 60 days.

The `:80` block keeps serving `/.well-known/acme-challenge/` after the
redirect goes in — HTTP-01 always starts on port 80, and while Let's Encrypt
does follow redirects, renewal not depending on the redirect being correct is
worth the four lines.

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

`deploy.sh` finishes by requesting the live site over HTTPS — not by trusting
that `rsync` exited 0. It checks each entry point, that `/play/` serves the
game, that a nonsense URL 404s rather than falling back to the landing page,
and that the hashed bundle **the deployed `index.html` actually names**
resolves. That last one is the check that catches a partial upload, which
every other status code would happily survive.

`enable-tls.sh` has its own, including one before it spends a certificate
request: it drops a token in the webroot and fetches it over
`http://gama.playmeet.games/` exactly the way Let's Encrypt will. That single
request exercises DNS, the provider firewall, port 80, the nginx location and
its `^~` priority — all of which certbot reports identically and unhelpfully
as `Invalid response … 403`.

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

The same rule is why HSTS sits in `gama-tls.conf`'s `:443` block rather than
in the shared snippet: `include` splices directives into the *same* server
context, so it accumulates onto the other four instead of replacing them —
and it stays off the plain-HTTP config, where browsers ignore it anyway.

## Six nginx traps this config already stepped in

Recorded because all six look correct and none of them are. Four were found
by running the config, not by reading it.

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
refuses to start. It ships commented out; `bootstrap.sh` and `enable-tls.sh`
uncomment it when `/proc/net/if_inet6` says the box actually has IPv6.

**`add_header` in a `location`** — replaces every inherited `add_header`
rather than adding to it. See the caching section.

**`location /.well-known/acme-challenge/`** — a plain prefix location loses to
the `location ~ /\.` dotfile-deny regex, because regex locations outrank
prefix ones. ACME then 403s and certbot reports an unauthorized error that
says nothing about nginx. `^~` is the one prefix form that outranks regex,
and it is what both configs use.

**`default_server` on the site's `:443` block** — parses, serves, and quietly
makes the site answer to *any* name, including the IP the certificate does
not cover. The default belongs on the block that returns 421; the site block
should match its name and nothing else.

## No Content-Security-Policy, and why

The playground compiles user-authored code to a `blob:` module URL and
imports it into a same-origin iframe (`site/src/runner.ts`). A reflexive
`default-src 'self'` breaks the most interesting page on the site. A working
policy needs at least `script-src 'self' blob:` and `worker-src blob:`, and
should be checked against `node site/verify-playgrounds.mjs` before you
believe it.

## HSTS

One year, no `includeSubDomains`, no `preload` — all three are choices.
`includeSubDomains` would commit every `*.gama.playmeet.games` too, including
any that does not speak HTTPS yet; `preload` is effectively irreversible,
since it bakes the name into browser binaries and removal takes months.

To back out, serve `max-age=0` for longer than the longest `max-age` any
visitor has already cached. Removing the header is *not* the same as turning
HSTS off.

## The bare IP still works, sort of

`http://103.39.133.227/` now redirects to `https://103.39.133.227/`, where
the certificate for `gama.playmeet.games` does not match and the browser
warns; clicking through gets a 421. That is correct rather than a
regression — Let's Encrypt will not issue for an IP. The site is at
`https://gama.playmeet.games/`.

## This does not host the multiplayer server

`scripts/net-server.mjs` is a long-lived Node process and is not part of this
deployment — the site does not need it, and nothing on the box runs Node.
Adding it means a systemd unit, and an nginx `location /ws { proxy_pass … }`
with `Upgrade`/`Connection` headers set for the WebSocket handshake. It would
go in `gama-tls.conf`'s `:443` block, and browsers on an HTTPS page can only
open `wss://`, not `ws://`.

## GitHub Pages still works

`npm run site:publish` pushes the same build to the `docs` branch and is
untouched by any of this. The two can run side by side; `base: './'` in
`site/vite.config.ts` is what lets one build serve correctly from both a
subpath and a domain root.

## Verified

Both configs were installed on nginx 1.24.0 against a real `site/dist`, the
TLS one against a self-signed certificate at the Let's Encrypt path — which
is what let the `:443` behaviour be checked before spending a real
certificate request.

Over HTTPS: all seven entry points plus `/play/` and `/play/editor.html` at
200; `/guide` resolving to `guide.html`; a nonsense URL at 404 rather than
the landing page; HTTP/2 negotiated; the immutable cache tier intact; and
HSTS arriving *alongside* the snippet's four headers rather than replacing
them.

Also: `http://…/guide` → 301 to `https://…/guide` with the path kept;
`/.well-known/acme-challenge/` served while `/.hidden` still 403s; and the
IP, a raw `127.0.0.1`, and a forged `Host:` header all getting 421 with an
empty body rather than the site.

`bootstrap.sh` runs end to end on Ubuntu 24.04 — it stops at `systemctl` only
in a container that was not booted with systemd.
