import type { Command } from "./types";

export const themeCommand: Command = {
  name: "theme",
  description: "Toggle or set the color theme",
  usage: "theme [dark|light|toggle]",
  run(args, ctx) {
    const arg = args[0] ?? "toggle";

    if (arg === "dark") {
      ctx.toggleTheme("dark");
      return {
        output: <p className="text-fg-muted">Switched to dark mode.</p>,
      };
    }

    if (arg === "light") {
      ctx.toggleTheme("light");
      return {
        output: <p className="text-fg-muted">Switched to light mode.</p>,
      };
    }

    if (arg === "toggle") {
      ctx.toggleTheme();
      return { output: <p className="text-fg-muted">Theme toggled.</p> };
    }

    return {
      output: (
        <p className="text-red-400">
          theme: unknown argument &quot;{arg}&quot;. Use: dark, light, toggle
        </p>
      ),
    };
  },
};
