import type { Status } from "@/content/types";

const STALE_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes

export type StatusResult =
  | { ok: true; data: Status; stale: false }
  | { ok: true; data: Status; stale: true }
  | { ok: false; data: null };

export async function fetchStatus(): Promise<StatusResult> {
  const url = process.env.STATUS_GIST_URL;
  if (!url) {
    console.warn("STATUS_GIST_URL is not set; status widget will be hidden.");
    return { ok: false, data: null };
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 }, // ISR: revalidate every 60 s
    });

    if (!res.ok) {
      console.error(`Status fetch returned ${res.status}`);
      return { ok: false, data: null };
    }

    const data: Status = await res.json();
    const age = Date.now() - new Date(data.updatedAt).getTime();
    const stale = age > STALE_THRESHOLD_MS;

    return { ok: true, data, stale };
  } catch (err) {
    console.error("Status fetch failed:", err);
    return { ok: false, data: null };
  }
}
