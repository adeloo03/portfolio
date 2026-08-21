import type { Command } from "./types";

export const clearCommand: Command = {
  name: "clear",
  description: "Clear the terminal screen",
  aliases: ["cls"],
  run() {
    return { clear: true };
  },
};
