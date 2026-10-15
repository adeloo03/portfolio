"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getCurrentTheme, applyTheme, subscribeTheme } from "@/lib/theme";

export function ThemeToggle() {
  // null on the server — the real theme is only known in the browser.
  const theme = useSyncExternalStore(subscribeTheme, getCurrentTheme, () => null);
  const mounted = theme !== null;

  // Apply the stored or system theme to <html> once on load.
  useEffect(() => {
    applyTheme(getCurrentTheme());
  }, []);

  function toggle() {
    applyTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      type="button"
      aria-label={
        mounted
          ? `Switch to ${theme === "dark" ? "light" : "dark"} mode`
          : "Toggle theme"
      }
      className="w-8 h-8 flex items-center justify-center rounded text-fg-muted hover:text-fg transition-colors"
    >
      {/* Sun — shown in dark mode to switch to light */}
      <svg
        aria-hidden="true"
        className={mounted && theme === "dark" ? "block" : "hidden"}
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      {/* Moon — shown in light mode to switch to dark */}
      <svg
        aria-hidden="true"
        className={mounted && theme === "light" ? "block" : "hidden"}
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
      <span className={mounted ? "hidden" : "block"} aria-hidden="true">
        ◐
      </span>
    </button>
  );
}
