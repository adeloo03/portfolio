import { fetchStatus } from "@/lib/status";
import { formatAge, formatDaysAgo } from "@/lib/format";

const stripClass =
  "flex items-start gap-3 px-4 py-2.5 rounded border border-border text-sm font-mono text-fg-muted";

export async function StatusStrip() {
  const result = await fetchStatus();

  if (!result.ok) {
    return (
      <div role="status" aria-label="Home server status" className={stripClass}>
        <span className="inline-block w-2 h-2 mt-1.5 rounded-full bg-border shrink-0" aria-hidden="true" />
        <span>Homelab — status not available</span>
      </div>
    );
  }

  const { data, stale } = result;

  // Each item is one fact; the list wraps between items on narrow screens.
  const items = [
    <span key="services" className="text-fg">
      {data.servicesUp}/{data.servicesTotal} services
    </span>,
    <span key="uptime" className="text-fg">
      {data.uptimeDays.toFixed(1)} days uptime
    </span>,
    data.lastRestoreTest && (
      <span key="restore">
        restore tested <span className="text-fg">{formatDaysAgo(data.lastRestoreTest)}</span>
      </span>
    ),
    data.lastIncident && (
      <span key="incident">last incident {formatDaysAgo(data.lastIncident)}</span>
    ),
    <span key="updated" title={data.updatedAt}>
      {stale ? "last seen" : "updated"} {formatAge(data.updatedAt)}
    </span>,
  ].filter(Boolean);

  return (
    // role="status" makes the aria-label meaningful and announces updates to AT
    <div role="status" aria-label="Home server status" className={stripClass}>
      <span
        className={`inline-block w-2 h-2 mt-1.5 rounded-full shrink-0 ${
          stale ? "bg-fg-muted" : "bg-accent"
        }`}
        aria-hidden="true"
      />
      <span className="flex flex-wrap gap-x-2 gap-y-0.5">
        <span>Homelab</span>
        {items.map((item, i) => (
          <span key={i} className="whitespace-nowrap">
            <span aria-hidden="true">· </span>
            {item}
          </span>
        ))}
      </span>
    </div>
  );
}

export function StatusStripSkeleton() {
  return (
    <div
      role="status"
      aria-label="Home server status loading"
      className={`${stripClass} animate-pulse`}
    >
      <span className="inline-block w-2 h-2 mt-1.5 rounded-full bg-border shrink-0" aria-hidden="true" />
      <span>Homelab — loading…</span>
    </div>
  );
}
