import type { ReactNode } from "react";

export type CommandContext = {
  cwd: string;
  setCwd: (path: string) => void;
  navigate: (href: string) => void;
  switchToGui: () => void;
  toggleTheme: (to?: "dark" | "light") => void;
};

export type CommandResult = {
  output?: ReactNode;
  clear?: true;
  newCwd?: string;
  followUp?: { label: string; command: string }[];
};

export type Command = {
  name: string;
  description: string;
  usage?: string;
  aliases?: string[];
  run(
    args: string[],
    ctx: CommandContext
  ): CommandResult | Promise<CommandResult>;
};
