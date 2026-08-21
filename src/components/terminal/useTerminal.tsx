import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { registry } from "./commands/index";
import type { CommandContext } from "./commands/types";

export type LogEntry =
  | { kind: "input"; prompt: string; text: string }
  | { kind: "output"; content: ReactNode; followUp?: { label: string; command: string }[] };

// All names and aliases captured once for completion and "did you mean".
const allNames = registry.flatMap((c) => [c.name, ...(c.aliases ?? [])]);

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function fmtPrompt(cwd: string): string {
  return (cwd === "/" ? "~" : "~" + cwd) + "$ ";
}

export function useTerminal(
  navigate: (href: string) => void,
  switchToGui: () => void,
  toggleTheme: (to?: "dark" | "light") => void
) {
  const [log, setLog] = useState<LogEntry[]>([]);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [cwd, setCwd] = useState("/");

  const clear = useCallback(() => setLog([]), []);

  const execute = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      const prompt = fmtPrompt(cwd);
      const [cmdName = "", ...args] = trimmed.split(/\s+/);

      setLog((prev) => [...prev, { kind: "input", prompt, text: trimmed }]);
      setInputHistory((prev) => [...prev, trimmed]);

      const command = registry.find(
        (c) => c.name === cmdName || (c.aliases ?? []).includes(cmdName)
      );

      if (!command) {
        const closest = allNames.reduce(
          (best, name) => {
            const d = levenshtein(cmdName, name);
            return d < best.d ? { name, d } : best;
          },
          { name: "", d: Infinity }
        );
        const hint =
          closest.d <= 3 ? ` — did you mean "${closest.name}"?` : "";
        setLog((prev) => [
          ...prev,
          {
            kind: "output",
            content: (
              <p className="text-red-400">
                {cmdName}: command not found{hint}
              </p>
            ),
          },
        ]);
        return;
      }

      const ctx: CommandContext = {
        cwd,
        setCwd,
        navigate,
        switchToGui,
        toggleTheme,
      };

      const maybeAsync = command.run(args, ctx);
      const result =
        maybeAsync instanceof Promise ? await maybeAsync : maybeAsync;

      if (result.clear) {
        // Both setLog calls are in the same synchronous batch for sync commands
        // (clear is always sync). The direct assignment wins, clearing everything.
        setLog([]);
        return;
      }

      if (result.output !== undefined) {
        setLog((prev) => [
          ...prev,
          {
            kind: "output",
            content: result.output as ReactNode,
            followUp: result.followUp,
          },
        ]);
      }

      if (result.newCwd) {
        setCwd(result.newCwd);
      }
    },
    [cwd, navigate, switchToGui, toggleTheme]
  );

  const getCompletions = useCallback((partial: string): string[] => {
    if (!partial) return allNames;
    return allNames.filter((n) => n.startsWith(partial));
  }, []);

  return {
    log,
    inputHistory,
    cwd,
    prompt: fmtPrompt(cwd),
    execute,
    clear,
    getCompletions,
  };
}
