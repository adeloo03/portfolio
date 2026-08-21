import { ImageResponse } from "next/og";

export const alt = "Abel Deloo — I build things that keep running.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          Third-year CS · Leiden University · Available September 2026
        </div>
      </div>
    ),
    { ...size }
  );
}
