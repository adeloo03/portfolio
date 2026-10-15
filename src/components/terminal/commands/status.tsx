import type { Command } from "./types";
import { fetchStatusClient } from "@/lib/status-client";
import { formatAge, formatDaysAgo } from "@/lib/format";

// "2026-10-15 (3 days ago)", or a dash when it has not happened yet.
function dated(isoDate: string | null): string {
  return isoDate ? `${isoDate} (${formatDaysAgo(isoDate)})` : "—";
}

function Row({
  label,
  value,
  dim,
}: {
  label: string;
  value: string;
  dim?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <span className="text-fg-muted w-28 shrink-0">{label}</span>
      <span className={dim ? "text-fg-muted" : "text-fg"}>{value}</span>
    </div>
  );
}

export const statusCommand: Command = {
  name: "status",
  description: "Show homelab status snapshot",
  async run() {
    const result = await fetchStatusClient();

    if (!result.ok) {
      return {
        output: (
          <p className="text-fg-muted">
            Homelab status unavailable — data not reachable right now.
          </p>
        ),
      };
    }

    const { data, stale } = result;

    return {
      output: (
        <div className="py-1 space-y-0.5">
          <p className="text-fg font-medium mb-2">Homelab</p>
          <Row
            label="services"
            value={`${data.servicesUp}/${data.servicesTotal} running`}
          />
          <Row label="uptime" value={`${data.uptimeDays.toFixed(1)} days`} />
          <Row
            label="updated"
            value={
              stale
                ? `${formatAge(data.updatedAt)} (stale)`
                : formatAge(data.updatedAt)
            }
            dim={stale}
          />
          <Row
            label="last incident"
            value={dated(data.lastIncident)}
            dim={!data.lastIncident}
          />
          <Row
            label="restore test"
            value={dated(data.lastRestoreTest)}
            dim={!data.lastRestoreTest}
          />
        </div>
      ),
    };
  },
};
