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

### 3. Configure the env file

```bash
cp .env.example .env
# Edit .env and fill in GITHUB_TOKEN and GITHUB_GIST_ID.
```

Set `LAST_INCIDENT` and `LAST_RESTORE_TEST` to ISO dates (e.g. `2025-03-14`)
when those events occur. Leave them blank to publish `null`.

### 4. Build the image

Run this on the home server, from the `status-publisher/` directory:

```bash
docker build -t status-publisher .
```

### 5. Run the container

```bash
docker run -d \
  --name status-publisher \
  --restart unless-stopped \
  -v /proc/uptime:/proc/uptime:ro \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  --env-file /path/to/status-publisher/.env \
  status-publisher
```

The container publishes immediately on start, then every 15 minutes.
Check the logs with `docker logs status-publisher`.

### 6. Point the portfolio at the raw Gist URL

The raw URL has this shape:

```
https://gist.githubusercontent.com/{username}/{gist-id}/raw/status.json
```

The portfolio fetches this URL server-side and degrades gracefully if it is
stale or unreachable.

## Updating incident dates

Edit `.env` on the server, then restart the container:

```bash
docker restart status-publisher
```

The next publish (within seconds of restart) will include the new values.

## Security notes

- The Docker socket is mounted read-only (`:ro`). The publisher can list
  containers but cannot create, stop, or remove them.
- `/proc/uptime` is mounted read-only for host uptime. The container cannot
  write to `/proc`.
- The container runs as a non-root user (`appuser`).
- The GitHub token needs only the `gist` scope — the minimum required.
- The `.env` file lives only on the server. It is never committed to git.
