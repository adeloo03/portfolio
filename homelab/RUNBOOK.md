# Runbook: the server is gone

For when the disk dies, the laptop is stolen, or an update leaves it unbootable.
Goal: every service back, with its configuration, without remembering anything.

**Last full drill:** not yet performed.
**Measured recovery time:** not yet measured.

Both lines are filled in after a real drill, never estimated.

## You need

- The PC, with the age private key and `C:\Backups\homelab` (or the offline key copy)
- A machine that boots Linux, on Ethernet (not WiFi — see the incident log)
- Access to the router admin page (DNS settings)

## While it is down

The network has no DNS while Pi-hole is gone. Set the router's DNS back to the
ISP default first, so the household is not offline while you rebuild.

## Steps

1. **Install the OS** (Debian/Ubuntu server), Docker, git, age and dnsutils.
   Add your user to the `docker` group.
2. **Get the repo:** `git clone` the portfolio repo to `~/portfolio`.
3. **Restore the configs.** On the PC, decrypt and send the newest backup:

   ```powershell
   cmd /c "age -d -i KEY C:\Backups\homelab\NEWEST.tar.gz.age | ssh SERVER ""umask 077; cat > /tmp/restore.tar.gz"""
   ```

   Then on the server:

   ```bash
   sudo tar -xzPf /tmp/restore.tar.gz && shred -u /tmp/restore.tar.gz
   ```

   `-P` puts every file back at the absolute path it was backed up from,
   including `homelab/.env` and `scripts/backup.conf`.
4. **Check secrets:** `homelab/.env` came back in step 3. If the GitHub token
   may have left with the old machine, revoke it and make a new one.
5. **Start everything:** `cd ~/portfolio/homelab && docker compose up -d`
6. **Check:** `docker compose ps` shows everything running;
   `dig @127.0.0.1 example.com` answers; `dig @127.0.0.1 doubleclick.net`
   returns `0.0.0.0`; a phone on mobile data connects over WireGuard.
7. **Point the router's DNS back** at the server.
8. **Backups again:** add the root cron line from `scripts/backup.sh` and run
   `sudo scripts/backup.sh` once. Confirm the PC pulls it.
9. **Record it:** add an entry to the incident log, and run
   `scripts/set-state.sh lastIncident today`.
