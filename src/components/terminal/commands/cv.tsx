import type { Command } from "./types";

export const cvCommand: Command = {
  name: "cv",
  description: "Open the CV (PDF)",
  run(_args, ctx) {
    ctx.navigate("/cv.pdf");
    return {
      output: (
        <p className="text-fg-muted">
          Opening CV…{" "}
          <a href="/cv.pdf" className="text-accent hover:underline">
            /cv.pdf
          </a>
        </p>
      ),
    };
  },
};
