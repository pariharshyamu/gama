#!/usr/bin/env bash
#
# Puts gama.playmeet.games on HTTPS. Run it ON the server, as root, once the
# DNS A record exists:
#
#     ssh root@103.39.133.227 'EMAIL=you@example.com bash /tmp/gama-deploy/enable-tls.sh'
#
# Obtains a Let's Encrypt certificate over the ACME location that gama.conf
# already serves, then swaps gama.conf for gama-tls.conf and reloads. nginx
# keeps serving throughout; there is no window where the site is down.
#
# `certbot certonly --webroot`, deliberately NOT `certbot --nginx`. The
# --nginx plugin edits the server block IN PLACE, and this config is
# version-controlled and re-installed by bootstrap.sh — so the next
# provisioning run would silently revert TLS and nobody would know until a
# browser complained. The certificate is data and lives on the box; the
# config is code and lives in git.
#
# Safe to run twice: certbot reuses a valid certificate rather than issuing a
# second one, and the config swap is idempotent.
#
# Knobs:
#   DOMAIN     default gama.playmeet.games
#   SERVER_IP  what DOMAIN must resolve to; default 103.39.133.227
#   EMAIL      for expiry warnings. Strongly recommended — without it certbot
#              registers with no contact and nobody is told when renewal
#              starts failing.
#   STAGING=1  use Let's Encrypt's staging CA. The resulting certificate is
#              NOT trusted by browsers, but staging has vastly looser rate
#              limits — use it if you are debugging this script.
#   FORCE=1    skip the DNS match check.
set -euo pipefail

DOMAIN="${DOMAIN:-gama.playmeet.games}"
SERVER_IP="${SERVER_IP:-103.39.133.227}"
WEBROOT="${WEBROOT:-/var/www/certbot}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

say()  { printf '\n\033[1;36m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m  ! %s\033[0m\n' "$*"; }
die()  { printf '\033[1;31m  x %s\033[0m\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "run as root: sudo bash $0"
[ -f "$HERE/nginx/gama-tls.conf" ] || die "nginx/gama-tls.conf not found next to this script — copy the whole deploy/ directory over"

# Where the live config went. bootstrap.sh picks by distro; match it.
if [ -d /etc/nginx/sites-available ]; then
    CONF_DIR=/etc/nginx/sites-available
    ENABLED=/etc/nginx/sites-enabled
else
    CONF_DIR=/etc/nginx/conf.d
    ENABLED=""
fi
[ -f "$CONF_DIR/gama.conf" ] || [ -f "$CONF_DIR/gama-tls.conf" ] \
    || die "no gama config in $CONF_DIR — run bootstrap.sh first"

# ------------------------------------------------------------------- dns
#
# Checked before certbot runs, because a failed validation is not free:
# Let's Encrypt allows 5 per hostname per hour, and burning them on a
# missing A record means waiting rather than fixing.
say "checking $DOMAIN resolves to $SERVER_IP"
resolved="$(getent ahostsv4 "$DOMAIN" 2>/dev/null | awk 'NR==1{print $1}')"
if [ -z "$resolved" ]; then
    die "$DOMAIN does not resolve. Add an A record -> $SERVER_IP and wait for it to propagate."
elif [ "$resolved" != "$SERVER_IP" ]; then
    if [ "${FORCE:-}" = "1" ]; then
        warn "$DOMAIN resolves to $resolved, not $SERVER_IP — continuing because FORCE=1"
    else
        die "$DOMAIN resolves to $resolved, not $SERVER_IP.
     If you just changed DNS, wait for the old record's TTL to expire.
     If it is behind a proxy (Cloudflare's orange cloud), either turn the
     proxy off for this record or use a DNS-01 challenge instead — http-01
     validates against the proxy, not this box.
     Override with FORCE=1 if you know better."
    fi
fi

# --------------------------------------------------------------- certbot
say "installing certbot"
if command -v apt-get >/dev/null 2>&1; then
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -qq
    apt-get install -y -qq certbot
elif command -v dnf >/dev/null 2>&1; then
    dnf install -y -q certbot
elif command -v yum >/dev/null 2>&1; then
    yum install -y -q certbot
fi
command -v certbot >/dev/null 2>&1 || die "certbot did not install; install it by hand and re-run"

# ------------------------------------------------------- acme preflight
#
# The single most valuable check in this script. It writes a token to the
# webroot and fetches it over http://$DOMAIN/ exactly the way Let's Encrypt
# will — which exercises DNS, the provider firewall, port 80, the nginx
# location AND its `^~` priority over the dotfile-deny regex, in one request.
# Every one of those can fail, and certbot's report for all of them is the
# same unhelpful "Invalid response ... 403".
say "pre-flighting the ACME challenge path"
mkdir -p "$WEBROOT/.well-known/acme-challenge"
chmod 755 "$WEBROOT"
token="preflight-$$"
echo "$token" > "$WEBROOT/.well-known/acme-challenge/$token"
# nginx must already be serving the HTTP config for this to pass.
systemctl reload nginx 2>/dev/null || nginx -s reload 2>/dev/null || true
sleep 1
got="$(curl -fsS --max-time 15 "http://$DOMAIN/.well-known/acme-challenge/$token" 2>/dev/null || true)"
rm -f "$WEBROOT/.well-known/acme-challenge/$token"
if [ "$got" != "$token" ]; then
    die "the ACME path is not reachable from outside: expected '$token', got '${got:-<nothing>}'.
     Check, in this order:
       - is TCP/80 open in your provider's firewall or security group?
       - does 'curl -I http://127.0.0.1/healthz' work on this box?
       - does $CONF_DIR/gama.conf still have the
         'location ^~ /.well-known/acme-challenge/' block? A plain prefix
         there gets 403'd by the dotfile-deny regex."
fi
say "ACME path is reachable"

# ------------------------------------------------------------ the cert
say "requesting a certificate for $DOMAIN"
CERTBOT_ARGS=(certonly --webroot -w "$WEBROOT" -d "$DOMAIN"
              --agree-tos --non-interactive --keep-until-expiring
              # nginx stays up; the webroot challenge needs no port 80 grab.
              --deploy-hook "systemctl reload nginx")
if [ -n "${EMAIL:-}" ]; then
    CERTBOT_ARGS+=(-m "$EMAIL")
else
    warn "no EMAIL set — registering without a contact address."
    warn "Nobody will be emailed when renewal starts failing. Re-run with"
    warn "EMAIL=you@example.com to fix that later."
    CERTBOT_ARGS+=(--register-unsafely-without-email)
fi
[ "${STAGING:-}" = "1" ] && { warn "STAGING=1 — the certificate will NOT be browser-trusted"; CERTBOT_ARGS+=(--staging); }

certbot "${CERTBOT_ARGS[@]}"

LIVE="/etc/letsencrypt/live/$DOMAIN"
[ -f "$LIVE/fullchain.pem" ] || die "certbot reported success but $LIVE/fullchain.pem is missing"

# ------------------------------------------------------------ the swap
say "installing the TLS config"
install -m 0644 "$HERE/nginx/gama-tls.conf" "$CONF_DIR/gama-tls.conf"

if [ "$DOMAIN" != "gama.playmeet.games" ]; then
    say "pointing the config at $DOMAIN"
    sed -i "s/gama\.playmeet\.games/$DOMAIN/g" "$CONF_DIR/gama-tls.conf"
fi

# Same IPv6 rule as bootstrap.sh: enable the listener only where the kernel
# can actually open an AF_INET6 socket, because the failure is nginx refusing
# to start rather than quietly skipping it.
if [ -f /proc/net/if_inet6 ]; then
    say "IPv6 detected — enabling the [::] listeners"
    sed -i 's/^\(\s*\)#listen \(\[::\].*\);/\1listen \2;/' "$CONF_DIR/gama-tls.conf"
fi

# Exactly one of the two configs may be enabled: both include
# snippets/gama-http.conf, and a second copy of that `map` is a hard error.
if [ -n "$ENABLED" ]; then
    ln -sfn "$CONF_DIR/gama-tls.conf" "$ENABLED/gama-tls.conf"
    rm -f "$ENABLED/gama.conf"
else
    rm -f "$CONF_DIR/gama.conf"
fi

say "checking the config"
if ! nginx -t; then
    warn "the TLS config failed to validate — rolling back to plain HTTP"
    if [ -n "$ENABLED" ]; then
        rm -f "$ENABLED/gama-tls.conf"
        ln -sfn "$CONF_DIR/gama.conf" "$ENABLED/gama.conf"
    else
        install -m 0644 "$HERE/nginx/gama.conf" "$CONF_DIR/gama.conf"
        rm -f "$CONF_DIR/gama-tls.conf"
    fi
    nginx -t && { systemctl reload nginx || nginx -s reload; }
    die "rolled back; the site is still up over HTTP. Fix the config and re-run."
fi

# ---------------------------------------------------------------- firewall
say "opening port 443"
if command -v ufw >/dev/null 2>&1; then
    ufw allow 443/tcp >/dev/null 2>&1 || true
elif command -v firewall-cmd >/dev/null 2>&1 && firewall-cmd --state >/dev/null 2>&1; then
    firewall-cmd --permanent --add-service=https >/dev/null 2>&1 || true
    firewall-cmd --reload >/dev/null 2>&1 || true
else
    warn "no ufw or firewalld. If your PROVIDER has a security group, open TCP/443 there."
fi

say "reloading nginx"
systemctl reload nginx 2>/dev/null || nginx -s reload

# ----------------------------------------------------------------- renewal
#
# The certbot package ships a systemd timer (or a cron job) that renews
# anything within 30 days of expiry. The --deploy-hook above is stored in the
# renewal config, so nginx picks up the new certificate automatically.
#
# The dry run is what proves all of that, now, rather than discovering in 60
# days that renewal has been failing silently.
say "testing renewal (dry run)"
if certbot renew --dry-run 2>&1 | tail -5; then
    say "renewal works"
else
    warn "the renewal dry run FAILED. The certificate is valid for 90 days,"
    warn "so there is time — but this will need fixing. Start with:"
    warn "  certbot renew --dry-run   (full output)"
fi
systemctl list-timers 2>/dev/null | grep -q certbot \
    || warn "no certbot systemd timer found — check 'systemctl status certbot.timer' or your crontab"

# -------------------------------------------------------------------- smoke
say "checking https://$DOMAIN/"
fail=0
check() {
    local code
    code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "$1" || echo 000)"
    if [ "$code" = "$2" ]; then printf '  \033[32mok\033[0m   %-46s %s\n' "$1" "$code"
    else printf '  \033[31mFAIL\033[0m %-46s %s (wanted %s)\n' "$1" "$code" "$2"; fail=1; fi
}
check "https://$DOMAIN/healthz" 200
check "https://$DOMAIN/" 200
check "https://$DOMAIN/play/" 200
# -I so curl does not follow: the 301 itself is what is being checked.
redirect="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 -I "http://$DOMAIN/" || echo 000)"
if [ "$redirect" = "301" ]; then printf '  \033[32mok\033[0m   %-46s %s\n' "http://$DOMAIN/ (redirect)" "$redirect"
else printf '  \033[31mFAIL\033[0m %-46s %s (wanted 301)\n' "http://$DOMAIN/ (redirect)" "$redirect"; fail=1; fi

[ "$fail" -eq 0 ] || die "TLS is installed but the site is not answering correctly over it"

cat <<EOF

  HTTPS is on.

    site        https://$DOMAIN/
    game        https://$DOMAIN/play/
    expires     $(date -u -d "$(openssl x509 -enddate -noout -in "$LIVE/fullchain.pem" | cut -d= -f2)" '+%Y-%m-%d' 2>/dev/null || echo 'see certbot certificates')
    renewal     automatic, with 'systemctl reload nginx' as the deploy hook

  Update deploy/deploy.env on your machine so the deploy smoke test checks
  the real thing:

    SITE_URL=https://$DOMAIN

EOF
