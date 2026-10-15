#!/usr/bin/env bash
# Writes the running containers as a compose file, using docker-autocompose
# (https://github.com/Red5d/docker-autocompose).
#
# The output CONTAINS SECRETS: every environment variable of every container,
# including passwords. It goes to ../compose.generated.yaml, which is
# git-ignored. Review it, move secrets to .env, then copy the services into
# compose.yaml by hand.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
out="$here/../compose.generated.yaml"

mapfile -t names < <(docker ps --format '{{.Names}}' | grep -v '^status-publisher$' || true)
if [[ ${#names[@]} -eq 0 ]]; then
  echo "no running containers besides status-publisher" >&2
  exit 1
fi

docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  ghcr.io/red5d/docker-autocompose "${names[@]}" > "$out"

chmod 600 "$out"
echo "wrote $out for: ${names[*]}"
echo "it contains secrets — do not commit it, delete it when compose.yaml is done"
