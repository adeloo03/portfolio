# homelab

Configuration and operations for the home server: a 2013 Packard Bell laptop
(AMD E1-2500, 4 GB RAM, 320 GB HDD) running Pi-hole, WireGuard, Glances and
TerraceTime in Docker, plus the [status publisher](../status-publisher) that
feeds the portfolio.

Everything here is sanitised: no IP addresses, hostnames, keys or passwords.
Those live in git-ignored files on the machines that need them.

## How the pieces connect

```
 home server                                    PC (Windows)
 ┌──────────────────────────────┐               ┌──────────────────────┐
 │ containers (compose.yaml)    │               │ age private key      │
 │ status-publisher ──HTTPS──────────► GitHub Gist ◄── portfolio site  │
 │                              │               │                      │
 │ backup.sh (cron, 03:00)      │   ssh pull    │ pull-backups.ps1     │
 │  tar → age (public key) ─────┼──────────────►│  (daily task)        │
 │                              │               │                      │
 │ restore-test.sh ◄────────────┼── decrypted ──┤ restore-test.ps1     │
 │  throwaway Pi-hole, dig      │    stream     │                      │
 └──────────────────────────────┘               └──────────────────────┘
```

- **Nothing connects into the home network.** The publisher pushes out; the PC
  pulls over the LAN.
- **The server can write backups but not read them.** It only holds the age
  public key. A compromised server does not leak old configs.
- **A backup counts once it has been restored.** `restore-test.sh` starts a
  second Pi-hole from the backup and checks it resolves and blocks. Only then
  does `lastRestoreTest` change on the site.

## Files

| Path | What |
| --- | --- |
| `compose.yaml` | Every service, reproducible. Secrets via `.env`. |
| `RUNBOOK.md` | Rebuilding the server from nothing. |
| `scripts/discover.sh` | What runs now: images, mounts, ports. No secrets. |
| `scripts/generate-compose.sh` | Turns running containers into a draft compose file. |
| `scripts/backup.sh` | Encrypted config backup, keeps the last 14. |
| `scripts/restore-test.sh` | Proves a backup restores. |
| `scripts/set-state.sh` | Sets `lastIncident` / `lastRestoreTest` for the site. |
| `pc/pull-backups.ps1` | Copies new backups to the PC. |
| `pc/restore-test.ps1` | Runs the restore test from the PC. |

## Setup

On the server (Debian/Ubuntu):

```bash
sudo apt install age dnsutils
git clone https://github.com/<you>/portfolio.git ~/portfolio
cd ~/portfolio/homelab
cp .env.example .env                       # fill in
cp scripts/backup.conf.example scripts/backup.conf
scripts/discover.sh                        # fill backup.conf from this
sudo scripts/backup.sh --dry-run
```

On the PC:

```powershell
winget install FiloSottile.age
age-keygen -o C:\Users\you\.age\homelab-key.txt   # prints the public key for backup.conf
Copy-Item homelab\pc\settings.example.psd1 homelab\pc\settings.psd1   # fill in
homelab\pc\register-task.ps1
```

Then, on the server, add the root cron line from the top of `scripts/backup.sh`.
