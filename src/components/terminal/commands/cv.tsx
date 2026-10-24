import type { Command } from "./types";
import { about } from "@/content/about";

export const cvCommand: Command = {
  name: "cv",
  description: "Open the CV",
  run(_args, ctx) {
    ctx.navigate(about.cv);
    return {
      output: (
        <p className="text-fg-muted">
          Opening CV…{" "}
          <a href={about.cv} className="text-accent hover:underline">
            {about.cv}
          </a>
        </p>
      ),
    };
  },
};
