# homelab

The public part of the home server setup. The full configuration (one Docker
Compose stack per concern, in git) lives in a private repository on the
server's own Gitea; this folder holds what feeds the portfolio, and how
backups are proven.

## The setup

```
 mini PC (Intel i5-7500T) — Proxmox VE
 ├── VM docker01 ─ Docker, one Compose stack per concern:
 │                 proxy, VPN, monitoring (Prometheus, Grafana, cAdvisor,
 │                 node-exporter, Uptime Kuma), platform (Postgres, ntfy),
 │                 services (Nextcloud, Vaultwarden, Gitea), status publisher
 ├── VM pbs ────── Proxmox Backup Server, own SSD,
 │                 nightly snapshot of docker01, pruned and garbage-collected
 └── LXC ───────── Jellyfin, hardware transcoding (VAAPI)
```

Grew out of a 2013 Packard Bell laptop running four containers started by
hand. What changed: configuration moved into git, backups became nightly
snapshots with retention, monitoring and alerting came in.

## Files

| Path | What |
| --- | --- |
| `status/docker-compose.yml` | The status publisher stack, as deployed. |
| `status/set-state.sh` | Records `lastIncident` / `lastRestoreTest` for the site. |
| `RUNBOOK.md` | Restore test: a nightly snapshot booted as a working VM. |

## Deploying the status stack

On `docker01`:

```bash
mkdir -p /opt/homelab/docker-compose/status /opt/homelab/data/status-publisher
cp status/docker-compose.yml status/set-state.sh /opt/homelab/docker-compose/status/
# .env next to it: GITHUB_TOKEN (gist scope only), GITHUB_GIST_ID — never committed
cd /opt/homelab/docker-compose/status && docker compose up -d --build
docker compose logs -f status-publisher
```
