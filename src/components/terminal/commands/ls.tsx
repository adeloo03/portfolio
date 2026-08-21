import type { Command } from "./types";
import { listDir } from "@/lib/fs";

export const lsCommand: Command = {
  name: "ls",
  description: "List directory contents",
  usage: "ls [path]",
  run(args, ctx) {
    const path = args[0] ?? ctx.cwd;
    const items = listDir(path);

    if (!items) {
      return {
        output: (
          <p className="text-red-400">ls: {path}: no such directory</p>
        ),
      };
    }

    if (items.length === 0) {
      return { output: <p className="text-fg-muted">(empty)</p> };
    }

    const normalised = (path === "/" ? path : path.replace(/\/$/, "")).toLowerCase();
    const followUp =
      normalised === "/projects"
        ? items
            .filter((it) => it.name.endsWith(".md"))
            .map((it) => ({
              label: it.name.replace(".md", ""),
              command: `cat /projects/${it.name}`,
            }))
        : undefined;

    return {
      output: (
        <div className="flex flex-wrap gap-x-5 gap-y-0.5 py-1">
          {items.map((item) => (
            <span
              key={item.name}
              className={item.kind === "dir" ? "text-accent" : "text-fg"}
            >
              {item.name}
              {item.kind === "dir" ? "/" : ""}
            </span>
          ))}
        </div>
      ),
      followUp,
    };
  },
};
