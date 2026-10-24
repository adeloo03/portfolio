import type { Incident } from "./types";

// Newest first. Every entry is something that actually happened; dates that
// were not written down at the time are marked approximate, never guessed.
export const incidents: Incident[] = [
  {
    date: "2024",
    approximate: true,
    title: "Services dropping out on WiFi",
    impact: "Services on the server dropped out unpredictably.",
    cause:
      "An unreliable WiFi link, made worse by where the machine stood in the house. Adjusting the Docker configuration did not help; no software fix closes a bad radio link.",
    fix: "Ran an Ethernet cable to the server. The drop-outs stopped.",
  },
];
