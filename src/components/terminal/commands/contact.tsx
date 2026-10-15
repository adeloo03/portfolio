import type { Command } from "./types";
import { about } from "@/content/about";

export const contactCommand: Command = {
  name: "contact",
  description: "Show contact information",
  run() {
    return {
      output: (
        <div className="py-1 space-y-1">
          <div className="flex gap-4">
            <span className="text-fg-muted w-16 shrink-0">Email</span>
            <a
              href={`mailto:${about.contact.email}`}
              className="text-accent hover:underline"
            >
              {about.contact.email}
            </a>
          </div>
          <div className="flex gap-4">
            <span className="text-fg-muted w-16 shrink-0">GitHub</span>
            <a
              href={about.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              {about.contact.github.replace("https://", "")}
            </a>
          </div>
          <p className="text-fg-muted pt-1">
            {about.availability.label} · Leiden
          </p>
        </div>
      ),
    };
  },
};
