import type { Command } from "./types";
import { resolvePath } from "@/lib/fs";

function resolve(cwd: string, target: string): string {
  if (!target || target === "~" || target === "/") return "/";
  if (target === "..") {
    const parts = cwd.split("/").filter(Boolean);
    parts.pop();
    return parts.length ? "/" + parts.join("/") : "/";
  }
  return target.startsWith("/")
    ? target
    : cwd === "/"
    ? "/" + target
    : cwd + "/" + target;
}

export const cdCommand: Command = {
  name: "cd",
  description: "Change directory",
  usage: "cd [path]",
  run(args, ctx) {
    const target = args[0] ?? "/";
    const resolved = resolve(ctx.cwd, target);
    const node = resolvePath(resolved);

    if (!node || node.kind !== "dir") {
      return {
        output: (
          <p className="text-red-400">cd: {target}: no such directory</p>
        ),
      };
    }

    return { newCwd: resolved };
  },
};
