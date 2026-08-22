"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTerminal } from "./useTerminal";
import { applyTheme, getCurrentTheme } from "@/lib/theme";

// Chips above the input — tappable shortcuts for mobile visitors.
const QUICK_CHIPS = [
  { label: "homelab", cmd: "cat /projects/homelab.md" },
  { label: "projects", cmd: "ls /projects" },
  { label: "status", cmd: "status" },
  { label: "about", cmd: "cat /about.md" },
  { label: "contact", cmd: "contact" },
  { label: "cv", cmd: "cv" },
] as const;

function commonPrefix(strings: string[]): string {
  if (strings.length === 0) return "";
  let prefix = strings[0];
  for (const s of strings.slice(1)) {
    while (!s.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }
  return prefix;
}

interface TerminalProps {
  /** Called by the "normal view" button and the `gui` command. */
  onSwitchToGui?: () => void;
}

export function Terminal({ onSwitchToGui }: TerminalProps) {
  const router = useRouter();

  const navigate = useCallback(
    (href: string) => {
      if (href.startsWith("http")) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else if (/\.\w+$/.test(href)) {
        // Static file — let the browser handle download/open rather than the client router
        window.location.href = href;
      } else {
        router.push(href);
      }
    },
    [router]
  );

  const switchToGui = useCallback(() => {
    onSwitchToGui?.();
  }, [onSwitchToGui]);

  const toggleTheme = useCallback((to?: "dark" | "light") => {
    const next = to ?? (getCurrentTheme() === "dark" ? "light" : "dark");
    applyTheme(next);
  }, []);

  const { log, inputHistory, prompt, execute, clear, getCompletions } =
    useTerminal(navigate, switchToGui, toggleTheme);

  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draft, setDraft] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // whoami on mount — never show an empty shell.
  useEffect(() => {
    execute("whoami");
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.ctrlKey && e.key === "l") {
        e.preventDefault();
        clear();
        return;
      }
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        setInput("");
        setHistoryIndex(-1);
        setDraft("");
        return;
      }
      if (e.key === "Enter") {
        const trimmed = input.trim();
        if (trimmed) execute(trimmed);
        setInput("");
        setHistoryIndex(-1);
        setDraft("");
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (inputHistory.length === 0) return;
        if (historyIndex === -1) {
          setDraft(input);
          const idx = inputHistory.length - 1;
          setHistoryIndex(idx);
          setInput(inputHistory[idx]);
        } else if (historyIndex > 0) {
          const idx = historyIndex - 1;
          setHistoryIndex(idx);
          setInput(inputHistory[idx]);
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex === -1) return;
        if (historyIndex >= inputHistory.length - 1) {
          setHistoryIndex(-1);
          setInput(draft);
        } else {
          const idx = historyIndex + 1;
          setHistoryIndex(idx);
          setInput(inputHistory[idx]);
        }
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        const tokens = input.trimStart().split(/\s+/);
        if (tokens.length === 1) {
          const completions = getCompletions(tokens[0]);
          if (completions.length === 1) {
            setInput(completions[0] + " ");
          } else if (completions.length > 1) {
            setInput(commonPrefix(completions));
          }
        }
        return;
      }
    },
    [input, historyIndex, draft, inputHistory, execute, clear, getCompletions]
  );

  function handleContainerClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest("a, button, input, select, textarea, [tabindex]")) {
      inputRef.current?.focus();
    }
  }

  return (
    <div
      className="flex flex-col h-full bg-bg font-mono cursor-text"
      onClick={handleContainerClick}
    >
      {/* Top bar — always visible, holds the "normal view" escape hatch */}
      <div className="shrink-0 flex items-center justify-between px-4 h-10 border-b border-border">
        <span className="text-xs text-fg-muted select-none">
          abel@portfolio
        </span>
        {onSwitchToGui && (
          <button
            type="button"
            onClick={onSwitchToGui}
            className="text-xs text-fg-muted hover:text-fg transition-colors border border-border px-2 py-1 rounded"
          >
            normal view ↗
          </button>
        )}
      </div>

      {/* Output log */}
      <div
        ref={outputRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 pt-3 pb-2 text-sm"
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        aria-atomic="false"
        aria-relevant="additions"
      >
        {log.map((entry, i) =>
          entry.kind === "input" ? (
            <div key={i} className="flex gap-2 leading-relaxed">
              <span
                className="text-accent shrink-0 select-none"
                aria-hidden="true"
              >
                {entry.prompt}
              </span>
              <span className="text-fg">{entry.text}</span>
            </div>
          ) : (
            <div key={i} className="mb-1 last:mb-0">
              {entry.content}
              {entry.followUp && entry.followUp.length > 0 && (
                <div
                  className="flex flex-wrap gap-1.5 mt-2"
                  role="group"
                  aria-label="Quick actions"
                >
                  {entry.followUp.map(({ label, command }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => execute(command)}
                      className="px-2.5 py-1 text-xs border border-border rounded bg-bg-raised text-fg-muted hover:text-accent hover:border-accent/50 transition-colors active:opacity-70"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* Quick command chips — tappable on mobile, no keyboard needed */}
      <div
        className="shrink-0 flex gap-2 overflow-x-auto px-4 py-2 border-t border-border"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        aria-label="Quick commands"
        role="group"
      >
        {QUICK_CHIPS.map(({ label, cmd }) => (
          <button
            key={label}
            type="button"
            onClick={() => execute(cmd)}
            className="shrink-0 min-h-[44px] px-3 py-1 text-sm bg-bg-raised border border-border rounded-md text-fg-muted hover:text-fg hover:border-fg-muted transition-colors active:opacity-70 whitespace-nowrap"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Input line */}
      <div className="shrink-0 flex items-center gap-0 px-4 pb-4 pt-1">
        <span
          className="text-accent shrink-0 select-none text-sm"
          aria-hidden="true"
        >
          {prompt}
        </span>
        <input
          ref={inputRef}
          id="terminal-input"
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (historyIndex !== -1) {
              setHistoryIndex(-1);
              setDraft("");
            }
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-fg"
          // 16px prevents iOS Safari from zooming the viewport on focus
          style={{ fontSize: "16px", caretColor: "var(--accent)", outline: "none" }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label={`Terminal input — current directory ${prompt.trim()}`}
        />
      </div>
    </div>
  );
}
