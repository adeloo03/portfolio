import { ImageResponse } from "next/og";
import { about } from "@/content/about";
import { fetchStatus } from "@/lib/status";

export const alt = "Abel Deloo — I build things that keep running.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  // A link shared in a DM shows live evidence before anyone clicks.
  // Stale or missing data is left out rather than shown as current.
  const status = await fetchStatus();
  const live =
    status.ok && !status.stale
      ? `home server: ${status.data.uptimeDays.toFixed(1)} days uptime · ${status.data.servicesUp}/${status.data.servicesTotal} services up`
      : null;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ color: "#f59e0b", fontSize: 18, marginBottom: 32 }}>
          abel@portfolio:~$
        </div>
        <div
          style={{ color: "#fafafa", fontSize: 52, fontWeight: 600, lineHeight: 1.15, marginBottom: 24 }}
        >
          I build things that keep running.
        </div>
        <div style={{ color: "#a1a1aa", fontSize: 24, lineHeight: 1.5 }}>
          {`${about.role} · ${about.university}`}
        </div>
        <div style={{ color: "#a1a1aa", fontSize: 24, lineHeight: 1.5 }}>
          {about.availability.label}
        </div>
        {live && (
          <div style={{ color: "#f59e0b", fontSize: 22, marginTop: 40 }}>
            {live}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
