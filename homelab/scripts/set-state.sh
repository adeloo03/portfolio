#!/usr/bin/env bash
# Updates one field of state/status-state.json, which status-publisher reads
# on every publish. No container restart needed.
#
#   set-state.sh lastIncident 2026-10-16
#   set-state.sh lastRestoreTest today
#   set-state.sh lastIncident null
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
state="${STATE_FILE:-$here/../state/status-state.json}"

usage() { echo "usage: $0 <lastIncident|lastRestoreTest> <YYYY-MM-DD|today|null>" >&2; exit 2; }
[[ $# -eq 2 ]] || usage
key="$1"; value="$2"
[[ "$key" == lastIncident || "$key" == lastRestoreTest ]] || usage
[[ "$value" == today ]] && value="$(date -u +%Y-%m-%d)"
[[ "$value" == null || "$value" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] || usage

# Read the current value of a key; prints "null" when absent.
read_field() {
  local v
  v="$(grep -o "\"$1\": *\"[0-9-]*\"" "$state" 2>/dev/null | grep -o '[0-9]\{4\}-[0-9-]*' || true)"
  echo "${v:-null}"
}
as_json() { [[ "$1" == null ]] && echo null || echo "\"$1\""; }

incident="$(read_field lastIncident)"
restore="$(read_field lastRestoreTest)"
[[ "$key" == lastIncident ]] && incident="$value" || restore="$value"

mkdir -p "$(dirname "$state")"
tmp="$state.tmp"
printf '{\n  "lastIncident": %s,\n  "lastRestoreTest": %s\n}\n' \
  "$(as_json "$incident")" "$(as_json "$restore")" > "$tmp"
mv "$tmp" "$state"
cat "$state"
