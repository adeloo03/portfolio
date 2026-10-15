#!/usr/bin/env bash
# Proves a backup actually restores: unpacks it, starts a throwaway Pi-hole on
# the restored config next to the real one, and checks that it answers DNS and
# still blocks. Checks the WireGuard config is intact. On success, records
# today as lastRestoreTest for the status publisher.
#
# Takes the DECRYPTED archive on stdin (the key never leaves the PC):
#   age -d -i key.txt backup.tar.gz.age | ssh server 'bash .../restore-test.sh -'
# pc/restore-test.ps1 does exactly that.
#
# Needs: docker access (docker group), dig (apt install dnsutils). No root.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
conf="${BACKUP_CONF:-$here/backup.conf}"
die() { echo "restore-test: FAIL: $*" >&2; exit 1; }
step() { echo "restore-test: $*"; }

[[ "${1:-}" == - ]] || die "usage: $0 -   (archive on stdin)"
[[ -f "$conf" ]] || die "no config at $conf"
# shellcheck source=backup.conf.example
source "$conf"
command -v dig >/dev/null || die "dig is not installed (apt install dnsutils)"

port="${RESTORE_TEST_PORT:-15353}"
name="restore-test-pihole"
work="$(mktemp -d)"   # mode 700: the restored config contains secrets
cleanup() {
  docker rm -f "$name" >/dev/null 2>&1 || true
  # Pi-hole chowns files inside the container; remove them from inside too.
  docker run --rm -v "$work:/w" alpine find /w -mindepth 1 -delete >/dev/null 2>&1 || true
  rm -rf "$work"
}
trap cleanup EXIT

started=$SECONDS

step "unpacking archive"
tar -xzf - -C "$work" || die "archive is corrupt or not a tar.gz"
restored() { echo "$work${1}"; }   # absolute host path → path inside $work

etc="$(restored "$PIHOLE_ETC_PATH")"
[[ -d "$etc" ]] || die "Pi-hole config missing from backup: $PIHOLE_ETC_PATH"
[[ -f "$etc/gravity.db" ]] || die "gravity.db missing — blocklists would be empty"

wg="$(restored "$WG_CONFIG_FILE")"
[[ -f "$wg" ]] || die "WireGuard config missing from backup: $WG_CONFIG_FILE"
grep -q '^\[Interface\]' "$wg" && grep -q '^PrivateKey' "$wg" \
  || die "WireGuard config has no [Interface] / PrivateKey"
step "WireGuard config intact"

image="$(docker inspect --format '{{.Config.Image}}' "$PIHOLE_CONTAINER" 2>/dev/null)" \
  || die "production container '$PIHOLE_CONTAINER' not found — set PIHOLE_CONTAINER"

mounts=(-v "$etc:/etc/pihole")
if [[ -n "${PIHOLE_DNSMASQ_PATH:-}" ]]; then
  dnsmasq="$(restored "$PIHOLE_DNSMASQ_PATH")"
  [[ -d "$dnsmasq" ]] || die "dnsmasq config missing from backup: $PIHOLE_DNSMASQ_PATH"
  mounts+=(-v "$dnsmasq:/etc/dnsmasq.d")
fi

# Listen on all interfaces: the restored config may name a host interface
# (host networking in production) that this container does not have.
# FTLCONF_ is Pi-hole v6, DNSMASQ_LISTENING is v5; each ignores the other.
step "starting $image on 127.0.0.1:$port"
docker run -d --name "$name" \
  -p "127.0.0.1:$port:53/udp" -p "127.0.0.1:$port:53/tcp" \
  -e FTLCONF_dns_listeningMode=all -e DNSMASQ_LISTENING=all \
  "${mounts[@]}" "$image" >/dev/null

ask() { dig @127.0.0.1 -p "$port" +short +time=1 +tries=1 "$1" A 2>/dev/null | tail -n1; }

for _ in $(seq 1 90); do
  [[ -n "$(ask "$ALLOWED_TEST_DOMAIN")" ]] && break
  sleep 1
done
answer="$(ask "$ALLOWED_TEST_DOMAIN")"
[[ -n "$answer" && "$answer" != 0.0.0.0 ]] \
  || die "restored Pi-hole did not resolve $ALLOWED_TEST_DOMAIN within 90 s"
step "resolves $ALLOWED_TEST_DOMAIN"

# Full output, not +short: an empty answer must mean "blocked", never "timed out".
blocked="$(dig @127.0.0.1 -p "$port" +time=2 +tries=2 "$BLOCKED_TEST_DOMAIN" A 2>/dev/null || true)"
grep -q 'status:' <<<"$blocked" || die "no DNS response for $BLOCKED_TEST_DOMAIN"
grep -q 'status: NXDOMAIN' <<<"$blocked" \
  || grep -qE '[[:space:]]A[[:space:]]+0\.0\.0\.0$' <<<"$blocked" \
  || die "$BLOCKED_TEST_DOMAIN was not blocked — blocklists did not restore"
step "blocks $BLOCKED_TEST_DOMAIN"

elapsed=$((SECONDS - started))
"$here/set-state.sh" lastRestoreTest today >/dev/null
step "PASS in ${elapsed}s — lastRestoreTest set to $(date -u +%Y-%m-%d)"
