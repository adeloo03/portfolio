#!/usr/bin/env bash
# Nightly config backup: tar of BACKUP_PATHS, encrypted to the PC's age public
# key. The server can write backups but not read them back, so a compromised
# server does not leak old configs. The PC pulls them (pc/pull-backups.ps1).
#
# Run as root (Pi-hole's files are not world-readable), from cron:
#   0 3 * * * /path/to/homelab/scripts/backup.sh >> /var/log/homelab-backup.log 2>&1
#
#   backup.sh            make a backup
#   backup.sh --dry-run  check config and show what would be backed up
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
conf="${BACKUP_CONF:-$here/backup.conf}"
die() { echo "backup: $*" >&2; exit 1; }

[[ -f "$conf" ]] || die "no config at $conf — copy backup.conf.example"
# shellcheck source=backup.conf.example
source "$conf"

[[ "${AGE_RECIPIENT:-}" == age1* && "$AGE_RECIPIENT" != age1replace-me ]] \
  || die "AGE_RECIPIENT is not set to a real age public key"
BACKUP_DIR="${BACKUP_DIR:-/srv/homelab/backups}"
KEEP="${KEEP:-14}"
command -v age >/dev/null || die "age is not installed (apt install age)"
for p in "${BACKUP_PATHS[@]}"; do
  [[ -e "$p" ]] || die "path does not exist: $p"
done

out="$BACKUP_DIR/homelab-$(date -u +%Y%m%dT%H%M%SZ).tar.gz.age"

if [[ "${1:-}" == --dry-run ]]; then
  echo "would write $out from:"
  du -sh "${BACKUP_PATHS[@]}"
  exit 0
fi

mkdir -p "$BACKUP_DIR"
tmp="$out.partial"
trap 'rm -f "$tmp"' EXIT

# -P stores absolute paths, so the archive says where every file belongs.
# Pi-hole keeps writing while we read; tar then exits 1 ("file changed").
# That is accepted with a warning — the restore test is what proves the
# backup is usable, not tar's exit code.
set +e
tar -czPf - "${BACKUP_PATHS[@]}" | age -r "$AGE_RECIPIENT" -o "$tmp"
status=("${PIPESTATUS[@]}")
set -e
(( status[0] <= 1 )) || die "tar failed with exit ${status[0]}"
(( status[1] == 0 )) || die "age failed with exit ${status[1]}"
(( status[0] == 0 )) || echo "backup: warning: a file changed while it was read" >&2

mv "$tmp" "$out"
trap - EXIT
chmod 640 "$out"
[[ -n "${BACKUP_OWNER:-}" ]] && chown "$BACKUP_OWNER" "$out"

# Keep the newest $KEEP backups.
find "$BACKUP_DIR" -maxdepth 1 -name 'homelab-*.tar.gz.age' -printf '%f\n' \
  | sort -r | tail -n +"$((KEEP + 1))" \
  | while read -r old; do rm -f -- "$BACKUP_DIR/$old"; done

echo "backup: wrote $out ($(du -h "$out" | cut -f1))"
