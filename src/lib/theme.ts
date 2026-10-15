export type Theme = "dark" | "light";

const listeners = new Set<() => void>();

export function getCurrentTheme(): Theme {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("light", theme === "light");
  localStorage.setItem("theme", theme);
  listeners.forEach((l) => l());
}

export function toggleTheme(): Theme {
  const next = getCurrentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}

/** For useSyncExternalStore — fires whenever applyTheme runs. */
export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
