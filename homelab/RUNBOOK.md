# Runbook: restore test

A backup counts once it has been restored. This is the procedure for proving
that the nightly Proxmox Backup Server snapshot of `docker01` (the VM that runs
every container) actually comes back as a working machine.

**Last restore test:** not yet performed.
**Measured time, restore start → all containers healthy:** not yet measured.

Both lines are filled in after a real test, never estimated.

## Why the restored VM never touches the network

The restore is a byte-for-byte copy of `docker01`: same static IP, same
containers, same `restart: unless-stopped`. Booted on the LAN it would clash
with the real VM's IP, update public DNS records, and start a second copy of
every job that talks to the outside world. So the network link is disabled
before the first boot, and everything is checked from the Proxmox console.

## Steps

1. **Pick the backup.** Proxmox → Datacenter → storage `backups` → newest
   `docker01` snapshot. Note its timestamp. **Start the clock.**
2. **Restore to a new VM ID** (e.g. 900), on local-lvm, with
   *Unique* checked (new MAC address) and *Start after restore* **unchecked**.
3. **Cut the network before booting:** VM 900 → Hardware → Network Device →
   Edit → tick *Disconnect*. Or on the host: `qm set 900 --net0 <same model and bridge>,link_down=1`.
4. **Boot and log in on the console** (VM 900 → Console).
5. **Check:**
   - `docker ps --format '{{.Names}} {{.Status}}'` — every container is `Up`,
     and the ones with healthchecks say `(healthy)`. Give it a few minutes.
   - Databases accept connections:
     `for c in $(docker ps --format '{{.Names}}' | grep -E 'db$|^postgres$'); do docker exec "$c" pg_isready; done`
   - Data is recent: the newest file under `/opt/homelab/data/nextcloud/data`
     and the Vaultwarden database are from the snapshot's date, not older.
   - `git -C /opt/homelab status` is clean and the log matches the real VM.
6. **Stop the clock** when all checks pass. Write down the time.
7. **Destroy VM 900** (Shutdown, then More → Remove, with *Purge* and
   *Destroy unreferenced disks*).
8. **Record it** on the real `docker01`:

   ```bash
   /opt/homelab/docker-compose/status/set-state.sh lastRestoreTest today
   ```

   The status publisher picks it up within 15 minutes; the site shows
   "restore tested today". Fill in the two lines at the top of this file.

## If a check fails

That is the point of testing. Note what failed, fix the cause on the real
VM (or the backup job), add an entry to the incident log, and test again.
