import type { Command } from "./types";
import { HelpOutput } from "./help";
import { clearCommand } from "./clear";
import { whoamiCommand } from "./whoami";
import { lsCommand } from "./ls";
import { cdCommand } from "./cd";
import { catCommand } from "./cat";
import { openCommand } from "./open";
import { themeCommand } from "./theme";
import { cvCommand } from "./cv";
import { contactCommand } from "./contact";
import { guiCommand } from "./gui";
import { statusCommand } from "./status";
import { uptimeCommand } from "./uptime";

// Mutable array populated synchronously at module load time.
// Help is defined here (not in help.tsx) to avoid a circular import:
// help.run() references registry, which would require importing index.tsx.
export const registry: Command[] = [];

registry.push(
  {
    name: "help",
    description: "List available commands",
    aliases: ["?"],
    usage: "help",
    run() {
      return { output: <HelpOutput commands={registry} /> };
    },
  },
  whoamiCommand,
  lsCommand,
  cdCommand,
  catCommand,
  openCommand,
  clearCommand,
  themeCommand,
  cvCommand,
  contactCommand,
  guiCommand,
  statusCommand,
  uptimeCommand,
);

export type { Command, CommandContext, CommandResult } from "./types";
