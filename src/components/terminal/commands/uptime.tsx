import type { Command } from "./types";
import { fetchStatusClient } from "@/lib/status-client";

export const uptimeCommand: Command = {
  name: "uptime",
  description: "Show homelab uptime",
  async run() {
    const result = await fetchStatusClient();

    if (!result.ok) {
      return {
        output: (
          <p className="text-fg-muted">
            Uptime unavailable — homelab data not reachable right now.
          </p>
        ),
      };
    }

    const { data, stale } = result;

    return {
      output: (
        <p className="text-fg">
          {data.uptimeDays.toFixed(1)} days
          {stale && (
            <span className="text-fg-muted"> (last seen {data.updatedAt.slice(0, 10)})</span>
          )}
        </p>
      ),
    };
  },
};
