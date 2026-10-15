#!/usr/bin/env bash
# Prints what runs on this machine: image, restart policy, network mode,
# published ports and mounts per container. Environment variables are never
# printed — they hold the secrets. Output is meant to fill in backup.conf and
# to check the generated compose file against.
set -euo pipefail

echo "docker group id (DOCKER_GID): $(getent group docker | cut -d: -f3)"
echo

docker ps -a --format '{{.Names}}' | while read -r name; do
  docker inspect --format '== {{.Name}}
image:   {{.Config.Image}}
state:   {{.State.Status}}
restart: {{.HostConfig.RestartPolicy.Name}}
network: {{.HostConfig.NetworkMode}}
ports:  {{range $port, $binds := .HostConfig.PortBindings}} {{$port}}->{{range $binds}}{{.HostPort}}{{end}}{{end}}
mounts:
{{- range .Mounts}}
  {{.Type}}  {{.Source}} -> {{.Destination}}{{if not .RW}} (ro){{end}}
{{- end}}
' "$name"
done
