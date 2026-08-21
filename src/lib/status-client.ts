import type { Status } from "@/content/types";

const STALE_THRESHOLD_MS = 30 * 60 * 1000;

export type StatusClientResult =
  | { ok: true; data: Status; stale: boolean }
  | { ok: false; data: null };

// Client-side fetch — uses NEXT_PUBLIC_STATUS_GIST_URL (must be set alongside
// server-side STATUS_GIST_URL for the terminal status/uptime commands to work).
export async function fetchStatusClient(): Promise<StatusClientResult> {
  const url = process.env.NEXT_PUBLIC_STATUS_GIST_URL;
  if (!url) return { ok: false, data: null };

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { ok: false, data: null };

    const data: Status = await res.json();
    const stale =
      Date.now() - new Date(data.updatedAt).getTime() > STALE_THRESHOLD_MS;
    return { ok: true, data, stale };
  } catch {
    return { ok: false, data: null };
  }
}
