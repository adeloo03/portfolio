import { fetchStatus } from "@/lib/status";

function formatAge(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 2) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return `${hours}h ago`;
}

export async function StatusStrip() {
  const result = await fetchStatus();
  if (!result.ok) return null;

  const { data, stale } = result;

  return (
    // role="status" makes the aria-label meaningful and announces updates to AT
    <div
      role="status"
      aria-label="Home server status"
      className="flex items-center gap-3 px-4 py-2.5 rounded border border-border text-sm font-mono text-fg-muted"
    >
      <span
        className={`inline-block w-2 h-2 rounded-full shrink-0 ${
          stale ? "bg-fg-muted" : "bg-accent"
        }`}
        aria-hidden="true"
      />
      <span>
        Homelab&nbsp;&mdash;&nbsp;
        <span className="text-fg">
          {data.servicesUp}/{data.servicesTotal} services
        </span>
        &nbsp;&middot;&nbsp;
        <span className="text-fg">
          {data.uptimeDays.toFixed(1)} days uptime
        </span>
        &nbsp;&middot;&nbsp;
        <span title={data.updatedAt}>
          {stale ? "last seen" : "updated"} {formatAge(data.updatedAt)}
        </span>
      </span>
    </div>
  );
}

export function StatusStripSkeleton() {
  return (
    <div
      role="status"
      aria-label="Home server status loading"
      className="flex items-center gap-3 px-4 py-2.5 rounded border border-border text-sm font-mono text-fg-muted animate-pulse"
    >
      <span className="inline-block w-2 h-2 rounded-full bg-border shrink-0" aria-hidden="true" />
      <span>Homelab — loading…</span>
    </div>
  );
}
