import type { Command } from "./types";
import { about } from "@/content/about";

export const whoamiCommand: Command = {
  name: "whoami",
  description: "About the person who built this",
  run() {
    return {
      output: (
        <div className="py-1 space-y-1">
          <p className="text-fg font-medium">{about.name}</p>
          <p className="text-fg-muted">
            {about.role} · {about.university}
          </p>
          <p className="text-fg-muted">
            Available for a six-month graduation internship from September 2026.
          </p>
          <p className="text-fg-muted">
            Type <span className="text-accent">help</span> to see what you can
            explore here.
          </p>
        </div>
      ),
      followUp: [
        { label: "projects", command: "ls /projects" },
        { label: "homelab", command: "cat /projects/homelab.md" },
        { label: "contact", command: "contact" },
        { label: "cv", command: "cv" },
      ],
    };
  },
};
