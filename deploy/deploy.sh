#!/usr/bin/env bash
#
# Builds the docs site + game and ships it to the box at 103.39.133.227.
# Runs from YOUR machine, against a server that `bootstrap.sh` has already
# provisioned:
#
#     npm run site:deploy
#     DEPLOY_HOST=103.39.133.227 DEPLOY_USER=root bash deploy/deploy.sh
#
# The build happens here, not there. The server needs nginx and rsync and
# nothing else — no Node, no toolchain, no npm registry access — which also
# means a broken build never reaches it: the checks below run against the
# artifacts before a single byte is uploaded.
#
# Knobs (or put them in deploy/deploy.env, which is gitignored):
#   DEPLOY_HOST   default 103.39.133.227
#   DEPLOY_USER   ssh user; default root
#   DEPLOY_PORT   ssh port; default 22
#   SSH_KEY       path to a private key, if not your default
#   WEB_ROOT      remote release root; default /srv/gama
#   KEEP          releases to retain; default 5
#   SKIP_BUILD=1  ship site/dist as it stands (only if you just built it)
#   DRY_RUN=1     do everything except the upload and the swap
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
[ -f "$ROOT/deploy/deploy.env" ] && . "$ROOT/deploy/deploy.env"

DEPLOY_HOST="${DEPLOY_HOST:-103.39.133.227}"
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"
WEB_ROOT="${WEB_ROOT:-/srv/gama}"
KEEP="${KEEP:-5}"
DIST="$ROOT/site/dist"

say()  { printf '\n\033[1;36m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m  ! %s\033[0m\n' "$*"; }
die()  { printf '\033[1;31m  x %s\033[0m\n' "$*" >&2; exit 1; }

SSH_OPTS=(-p "$DEPLOY_PORT")
[ -n "${SSH_KEY:-}" ] && SSH_OPTS+=(-i "$SSH_KEY")
remote() { ssh "${SSH_OPTS[@]}" "$DEPLOY_USER@$DEPLOY_HOST" "$@"; }

# `date` is called once and reused. Calling it per-use is how you get a
# release directory and a symlink that disagree by a second at midnight.
RELEASE="$(date -u +%Y%m%d-%H%M%S)"
RELEASE_PATH="$WEB_ROOT/releases/$RELEASE"

# ------------------------------------------------------------------- build
if [ "${SKIP_BUILD:-}" = "1" ]; then
    say "skipping build (SKIP_BUILD=1)"
else
    say "building site + game"
    # site:build == assets:check, vendor bundles, vite build, then the game.
    # The game is a separate npm project that depends on PUBLISHED gama3d, so
    # the first run of this pulls its own dependencies and is slow.
    ( cd "$ROOT" && npm run site:build )
fi

# ------------------------------------------------------------------ verify
#
# Everything below is checked BEFORE the upload. A deploy that fails here
# costs nothing; a deploy that fails after the symlink flip is an outage.
say "checking the build"
[ -d "$DIST" ] || die "no build at $DIST"
for f in index.html guide.html playground.html runner.html editor.html \
         play/index.html assets/manifest.json; do
    [ -s "$DIST/$f" ] || die "missing or empty: site/dist/$f — build did not complete"
done

# index.html names its hashed bundles. If one of them is absent the page
# loads to a white screen with a console error, which is exactly the failure
# a "did the files copy" check should catch and a directory listing will not.
missing=0
while read -r ref; do
    [ -f "$DIST/$ref" ] || { warn "index.html references a missing file: $ref"; missing=1; }
done < <(grep -o '"\./[^"]*\.\(js\|css\)"' "$DIST/index.html" | tr -d '"' | sed 's#^\./##' | sort -u)
[ "$missing" -eq 0 ] || die "the build is internally inconsistent; not shipping it"

BYTES="$(du -sh "$DIST" | cut -f1)"
FILES="$(find "$DIST" -type f | wc -l | tr -d ' ')"
say "$FILES files, $BYTES → $DEPLOY_USER@$DEPLOY_HOST:$RELEASE_PATH"

if [ "${DRY_RUN:-}" = "1" ]; then
    say "DRY_RUN=1 — stopping before the upload"
    exit 0
fi

# ----------------------------------------------------------------- upload
say "checking the server is reachable"
remote "test -d $WEB_ROOT/releases" \
    || die "$WEB_ROOT/releases is missing on the server — run deploy/bootstrap.sh there first"

say "uploading"
# --link-dest hardlinks anything byte-identical to the live release instead of
# re-sending it. Consecutive deploys of a site whose bundles are content-
# hashed mostly differ in a handful of files, so this makes both the transfer
# and the disk cost of keeping N releases close to free.
#
# The upload goes to a NEW directory. Nothing that is currently being served
# is touched, so an interrupted upload leaves the live site untouched rather
# than half-replaced.
rsync -az --delete --human-readable \
    -e "ssh ${SSH_OPTS[*]}" \
    --link-dest="$WEB_ROOT/current/" \
    "$DIST/" "$DEPLOY_USER@$DEPLOY_HOST:$RELEASE_PATH/"

# ------------------------------------------------------------------- swap
#
# `ln -sfn` is NOT atomic when the target already exists — it unlinks and
# re-creates, and requests landing in that gap get a 404 from a root that
# does not resolve. `mv -T` is a rename(2) and has no such window.
say "swapping current -> $RELEASE"
remote "set -e
    tmp=\$(mktemp -u $WEB_ROOT/.current.XXXXXX)
    ln -s '$RELEASE_PATH' \"\$tmp\"
    mv -T \"\$tmp\" '$WEB_ROOT/current'"

# ------------------------------------------------------------------ prune
say "pruning old releases (keeping $KEEP)"
remote "set -e
    cd $WEB_ROOT/releases
    live=\$(basename \"\$(readlink -f $WEB_ROOT/current)\")
    # Newest first, drop the ones we keep, and never delete what is live —
    # a prune that unlinks the running release takes the site down.
    ls -1 | sort -r | tail -n +\$(( $KEEP + 1 )) | while read -r old; do
        [ \"\$old\" = \"\$live\" ] && continue
        rm -rf -- \"\$old\"
        echo \"  removed \$old\"
    done"

# ------------------------------------------------------------------ smoke
#
# Served-over-HTTP checks, not "did rsync exit 0". These are the ones that
# catch a broken nginx config, an SELinux denial, or a provider firewall.
say "smoke-testing http://$DEPLOY_HOST/"
fail=0
check() { # url, expected status
    local code
    code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "http://$DEPLOY_HOST$1" || echo 000)"
    if [ "$code" = "${2:-200}" ]; then
        printf '  \033[32mok\033[0m   %-28s %s\n' "$1" "$code"
    else
        printf '  \033[31mFAIL\033[0m %-28s %s (wanted %s)\n' "$1" "$code" "${2:-200}"
        fail=1
    fi
}
check /healthz
check /
check /guide            # the extensionless nicety: try_files $uri.html
check /playground.html
check /editor.html
check /play/            # the game
check /assets/manifest.json
check /nope-not-here 404 # a 404 must 404, not fall back to the landing page

# And the bundle the live index.html actually names — the check that catches
# a partial upload, which every status code above would happily survive.
main="$(grep -o '"\./assets/index-[^"]*\.js"' "$DIST/index.html" | head -1 | tr -d '"' | sed 's#^\./##')"
[ -n "$main" ] && check "/$main"

if [ "$fail" -ne 0 ]; then
    warn "the site is live but not healthy. To put the previous release back:"
    warn "  ssh ${SSH_OPTS[*]} $DEPLOY_USER@$DEPLOY_HOST \\"
    warn "    'ls -1 $WEB_ROOT/releases | sort -r | sed -n 2p'   # pick one, then:"
    warn "  ssh ... 'ln -s $WEB_ROOT/releases/<REL> /tmp/c && mv -T /tmp/c $WEB_ROOT/current'"
    exit 1
fi

cat <<EOF

  Deployed.  http://$DEPLOY_HOST/

    release   $RELEASE
    game      http://$DEPLOY_HOST/play/
    guide     http://$DEPLOY_HOST/guide

EOF
