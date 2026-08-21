import type { Command } from "./types";

export const guiCommand: Command = {
  name: "gui",
  description: "Switch to the normal (UI) view",
  aliases: ["exit"],
  run(_args, ctx) {
    ctx.switchToGui();
    return {};
  },
};
