# status-publisher

A small .NET service that reads the home server's current state and publishes a
sanitized JSON snapshot to a public GitHub Gist every 15 minutes.

## Why push-only

The server sits behind a home router. Opening an inbound port would mean:

- Configuring port-forwarding on the router.
- Exposing an endpoint to the public internet.
- Keeping that endpoint authenticated and patched indefinitely.

A single leaked credential or unpatched dependency would give an attacker a
foothold into the home network.

Push-only inverts that surface: the server initiates one outbound HTTPS call
to the GitHub API, which it would be doing anyway (software updates, git
pushes). No inbound ports. No internal hostnames or IP addresses in the
published data. No way for the portfolio site to reach back into the network.
If the publisher stops, the portfolio shows the last known snapshot with a
"last updated" timestamp — a stale widget, not an open socket.

## What gets published

```json
{
  "updatedAt": "2025-09-01T12:00:00.000Z",
  "uptimeDays": 14.3,
  "servicesUp": 4,
  "servicesTotal": 4,
  "lastIncident": "2025-03-14",
  "lastRestoreTest": null
}
```

No hostnames, IP addresses, container names, or file paths appear in the output.

## Setup

### 1. Create the Gist

Go to https://gist.github.com. Create a new **public** gist with a file called
`status.json` and any placeholder content. Copy the ID from the URL — it is the
long hex string after your username.

### 2. Create a GitHub token

Go to https://github.com/settings/tokens → **Generate new token (classic)**.

Select **only** the `gist` scope. This token can read and write your gists, and
nothing else. If it leaks, the blast radius is your gists.

### 3. Configure and run

The publisher runs from [`homelab/compose.yaml`](../homelab/compose.yaml),
alongside everything else on the server:

```bash
cd ~/portfolio/homelab
cp .env.example .env          # fill in GITHUB_TOKEN and GITHUB_GIST_ID
docker compose up -d --build docker-proxy status-publisher
docker compose logs -f status-publisher
```

The container publishes immediately on start, then every 15 minutes.

### 4. Point the portfolio at the raw Gist URL

The raw URL has this shape:

```
https://gist.githubusercontent.com/{username}/{gist-id}/raw/status.json
```

The portfolio fetches this URL server-side and degrades gracefully if it is
stale or unreachable.

## Updating incident dates

```bash
homelab/scripts/set-state.sh lastIncident 2026-10-16
homelab/scripts/set-state.sh lastRestoreTest today    # restore-test.sh does this itself
```

This writes `homelab/state/status-state.json`, mounted read-only at `/state`.
The publisher reads it on every run; no restart needed. Without that file it
falls back to the `LAST_INCIDENT` / `LAST_RESTORE_TEST` env vars. Empty values
are published as `null`.

## Security notes

- The publisher never sees the Docker socket. A `:ro` mount would not help:
  it stops the socket file being changed, not API calls through it, and full
  Docker API access is root on the host. Instead it talks to
  [docker-socket-proxy](https://github.com/Tecnativa/docker-socket-proxy),
  which allows `GET /containers` and nothing else, on an internal network
  with no internet access.
- `/proc/uptime` is mounted read-only for host uptime. The container cannot
  write to `/proc`.
- The container runs as a non-root user (`appuser`).
- The GitHub token needs only the `gist` scope — the minimum required.
- The `.env` file lives only on the server. It is never committed to git.
