#!/usr/bin/env bash
#
# One-time provisioning for the box at 103.39.133.227. Run it ON the server,
# as root, once:
#
#     scp -r deploy/ root@103.39.133.227:/tmp/gama-deploy
#     ssh root@103.39.133.227 'bash /tmp/gama-deploy/bootstrap.sh'
#
# It installs nginx, lays out /srv/gama, installs the site config and opens
# port 80. It does NOT build or upload the site — that is deploy.sh, which
# runs from your machine and can be re-run as often as you like.
#
# Safe to run twice. Every step checks before it acts, so a re-run after a
# failed one picks up where it stopped rather than starting a second copy of
# anything.
#
# Knobs:
#   DEPLOY_USER   who owns /srv/gama, and therefore who can deploy without
#                 sudo. Defaults to whoever invoked this via sudo, or root.
#   WEB_ROOT      where releases live. Default /srv/gama.
set -euo pipefail

DEPLOY_USER="${DEPLOY_USER:-${SUDO_USER:-root}}"
WEB_ROOT="${WEB_ROOT:-/srv/gama}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

say()  { printf '\n\033[1;36m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m  ! %s\033[0m\n' "$*"; }
die()  { printf '\033[1;31m  x %s\033[0m\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "run as root: sudo bash $0"
[ -f "$HERE/nginx/gama.conf" ] || die "nginx/gama.conf not found next to this script — copy the whole deploy/ directory over, not just this file"
id "$DEPLOY_USER" >/dev/null 2>&1 || die "user '$DEPLOY_USER' does not exist. Create it and install its SSH key first, or re-run with DEPLOY_USER=root."

# ---------------------------------------------------------------- packages
say "installing nginx"
if command -v apt-get >/dev/null 2>&1; then
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -qq
    apt-get install -y -qq nginx rsync curl
    PKG=deb
elif command -v dnf >/dev/null 2>&1; then
    dnf install -y -q nginx rsync curl
    PKG=rpm
elif command -v yum >/dev/null 2>&1; then
    yum install -y -q nginx rsync curl
    PKG=rpm
else
    die "no apt-get, dnf or yum — install nginx and rsync by hand, then re-run"
fi

# rsync on the SERVER is not optional even though the deploy runs from your
# machine: `rsync local remote` needs rsync at BOTH ends of the pipe.
command -v rsync >/dev/null 2>&1 || die "rsync failed to install; deploy.sh cannot work without it"

# ------------------------------------------------------------------ layout
#
#   /srv/gama/releases/<utc-timestamp>/   one full copy of site/dist per deploy
#   /srv/gama/current -> releases/<...>   the symlink nginx serves through
#
# Releases are whole directories rather than a single tree rsynced in place,
# because an in-place rsync is visibly broken while it runs: the new
# index.html lands referencing hashed bundles that have not uploaded yet, and
# anyone loading the page in that window gets a white screen. A symlink flip
# has no such window.
say "creating $WEB_ROOT (owner: $DEPLOY_USER)"
mkdir -p "$WEB_ROOT/releases"
chown -R "$DEPLOY_USER" "$WEB_ROOT"
# 755: nginx runs as its own user and has to traverse this to read the files.
chmod 755 "$WEB_ROOT" "$WEB_ROOT/releases"

if [ ! -e "$WEB_ROOT/current" ]; then
    say "seeding a placeholder release"
    # So the box answers with something intelligible between provisioning and
    # the first deploy, instead of nginx's bare 404.
    ph="$WEB_ROOT/releases/0000-placeholder"
    mkdir -p "$ph"
    cat > "$ph/index.html" <<'HTML'
<!doctype html>
<meta charset="utf-8">
<title>gama — provisioned</title>
<body style="font:16px/1.6 system-ui;max-width:34rem;margin:12vh auto;padding:0 1rem">
<h1>Server provisioned.</h1>
<p>nginx is serving, and no site has been deployed yet.</p>
<p>Run <code>npm run site:deploy</code> from a checkout of the repository.</p>
HTML
    chown -R "$DEPLOY_USER" "$ph"
    ln -s "$ph" "$WEB_ROOT/current"
    chown -h "$DEPLOY_USER" "$WEB_ROOT/current"
fi

# ------------------------------------------------------------------ selinux
#
# RHEL-family only, and the single most common reason a correct nginx config
# still returns 403 from /srv: the files are readable, the directory is
# traversable, and SELinux denies it anyway because the type is var_t rather
# than httpd_sys_content_t. `fcontext` (persistent) rather than `chcon`
# (until the next relabel), so that releases rsynced in later inherit it.
if command -v getenforce >/dev/null 2>&1 && [ "$(getenforce)" != "Disabled" ]; then
    say "labelling $WEB_ROOT for SELinux"
    if ! command -v semanage >/dev/null 2>&1; then
        [ "$PKG" = rpm ] && { dnf install -y -q policycoreutils-python-utils || true; }
    fi
    if command -v semanage >/dev/null 2>&1; then
        semanage fcontext -a -t httpd_sys_content_t "${WEB_ROOT}(/.*)?" 2>/dev/null || true
        restorecon -R "$WEB_ROOT"
    else
        warn "semanage unavailable; falling back to chcon (lost on a filesystem relabel)"
        chcon -R -t httpd_sys_content_t "$WEB_ROOT" || warn "chcon failed — expect 403s from nginx"
    fi
fi

# -------------------------------------------------------------- nginx conf
if [ -d /etc/nginx/sites-available ]; then
    CONF_DIR=/etc/nginx/sites-available
    ENABLED=/etc/nginx/sites-enabled
else
    CONF_DIR=/etc/nginx/conf.d
    ENABLED=""
fi

# Shared by both the HTTP and the TLS config. Debian ships snippets/;
# RHEL-family does not, so make it either way.
say "installing the shared snippets"
mkdir -p /etc/nginx/snippets
install -m 0644 "$HERE/nginx/snippets/gama-http.conf" /etc/nginx/snippets/gama-http.conf
install -m 0644 "$HERE/nginx/snippets/gama-site.conf" /etc/nginx/snippets/gama-site.conf

# The webroot enable-tls.sh serves ACME challenges from. Created here so the
# `location ^~ /.well-known/acme-challenge/` in gama.conf has a real
# directory behind it from the first boot.
mkdir -p /var/www/certbot/.well-known/acme-challenge
chmod 755 /var/www/certbot

# THE TLS CHECK. Re-running bootstrap on a box that already has HTTPS must
# not quietly drop it back to plain HTTP — which is exactly what installing
# gama.conf unconditionally would do, and it would look like a successful
# provisioning run right up until a browser refused the site.
if [ -e "${ENABLED:-$CONF_DIR}/gama-tls.conf" ]; then
    say "TLS config is already enabled — leaving it alone"
    warn "Refreshing the snippets above updated the shared parts (cache rules,"
    warn "headers, routing). To update the TLS server block itself, re-run"
    warn "enable-tls.sh; it is idempotent and reuses the existing certificate."
    SITE_CONF="$CONF_DIR/gama-tls.conf"
else
    say "installing the site config (plain HTTP)"
    install -m 0644 "$HERE/nginx/gama.conf" "$CONF_DIR/gama.conf"
    SITE_CONF="$CONF_DIR/gama.conf"
    if [ -n "$ENABLED" ]; then
        ln -sfn "$CONF_DIR/gama.conf" "$ENABLED/gama.conf"
        # The stock `default` site also claims `listen 80 default_server`, and
        # two default servers on one port is a hard config error — nginx will
        # refuse to start, not pick one.
        if [ -e "$ENABLED/default" ]; then
            rm -f "$ENABLED/default"
            say "removed the stock 'default' site (it also claimed default_server)"
        fi
    else
        # Same collision, different file: the stock nginx.conf ships an inline
        # `server { listen 80 default_server; ... }`. It cannot be deleted from
        # here without rewriting nginx.conf, so say so plainly rather than
        # failing at `nginx -t` with a message about duplicate defaults.
        if grep -qE '^\s*listen\s+80\s+default_server' /etc/nginx/nginx.conf 2>/dev/null; then
            warn "/etc/nginx/nginx.conf has its own 'listen 80 default_server' block."
            warn "Comment that server{} block out, or nginx will reject this config."
        fi
    fi
fi

# The IPv6 listeners ship commented out — see the note in gama.conf. Enable
# them only where the kernel can actually open an AF_INET6 socket, because the
# failure mode is nginx refusing to start rather than quietly skipping them.
if [ -f /proc/net/if_inet6 ]; then
    say "IPv6 detected — enabling the [::] listeners"
    sed -i 's/^\(\s*\)#listen \(\[::\].*\);/\1listen \2;/' "$SITE_CONF"
fi

if [ "$WEB_ROOT" != "/srv/gama" ]; then
    say "pointing the config at $WEB_ROOT"
    # The root lives in the shared snippet now, so this is one file, not two.
    sed -i "s#root /srv/gama/current;#root ${WEB_ROOT}/current;#" \
        /etc/nginx/snippets/gama-site.conf
fi

say "checking the config"
nginx -t

# ---------------------------------------------------------------- firewall
#
# SSH FIRST, ALWAYS. Enabling a default-deny firewall before allowing the
# port you are currently connected over ends the session and the box with it.
say "opening port 80"
if command -v ufw >/dev/null 2>&1; then
    ufw allow OpenSSH >/dev/null 2>&1 || ufw allow 22/tcp >/dev/null 2>&1 || true
    ufw allow 80/tcp  >/dev/null 2>&1 || true
    if ! ufw status 2>/dev/null | grep -q "^Status: active"; then
        # Deliberately not enabled for you. `ufw enable` over SSH is a
        # coin-flip you should call yourself, having read the rules above it.
        warn "ufw is installed but inactive. Rules are staged; run 'ufw enable' when ready."
    fi
elif command -v firewall-cmd >/dev/null 2>&1 && firewall-cmd --state >/dev/null 2>&1; then
    firewall-cmd --permanent --add-service=ssh  >/dev/null 2>&1 || true
    firewall-cmd --permanent --add-service=http >/dev/null 2>&1 || true
    firewall-cmd --reload >/dev/null 2>&1 || true
else
    warn "no ufw or firewalld found. If your PROVIDER has a security group or"
    warn "network firewall, open TCP/80 there — the box being right is only half."
fi

# ------------------------------------------------------------------- start
say "starting nginx"
systemctl enable nginx >/dev/null 2>&1 || true
systemctl restart nginx
sleep 1
systemctl is-active --quiet nginx || die "nginx did not start — see: journalctl -xeu nginx"

# Prove it from the box itself. If this passes and the outside world still
# cannot reach port 80, the problem is upstream (provider firewall), not here
# — which is a genuinely useful thing to have narrowed down.
if curl -fsS --max-time 5 http://127.0.0.1/healthz >/dev/null; then
    say "nginx is serving — /healthz answered locally"
else
    die "nginx is running but /healthz did not answer locally"
fi

cat <<EOF

  Provisioned.

    web root    $WEB_ROOT/current -> $(readlink -f "$WEB_ROOT/current")
    owner       $DEPLOY_USER
    listening   http://103.39.133.227/

  Next, from your checkout of the repository:

    DEPLOY_HOST=103.39.133.227 DEPLOY_USER=$DEPLOY_USER npm run site:deploy

  Then, once gama.playmeet.games has an A record pointing at this box,
  turn on HTTPS (nginx keeps serving throughout):

    EMAIL=you@example.com bash $HERE/enable-tls.sh

EOF
