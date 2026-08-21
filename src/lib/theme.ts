export function getCurrentTheme(): "dark" | "light" {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function applyTheme(theme: "dark" | "light"): void {
  document.documentElement.classList.toggle("light", theme === "light");
  localStorage.setItem("theme", theme);
}

export function toggleTheme(): "dark" | "light" {
  const next = getCurrentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
