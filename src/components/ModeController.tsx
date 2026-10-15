"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Terminal } from "@/components/terminal/Terminal";

type View = "ui" | "terminal";

const STORAGE_KEY = "view";
const listeners = new Set<() => void>();

function readStoredView(): View | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "ui" || v === "terminal" ? v : null;
  } catch {
    return null;
  }
}

function storeView(view: View): void {
  try {
    localStorage.setItem(STORAGE_KEY, view);
  } catch {
    // Storage blocked (private mode) — the choice just won't persist.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/**
 * Mounts a full-viewport terminal overlay when the resolved view is "terminal".
 *
 * Resolution order: `?view=` param → the visitor's last choice (localStorage)
 * → route default. Only `/` defaults to the terminal; deep links to /work/*
 * and /about open the page itself, because someone clicking a link from a CV
 * wants that page, not a shell.
 *
 * Without JS this component never executes, leaving the server-rendered UI
 * visible. While the overlay is shown, the page underneath is [inert] so
 * keyboard focus cannot reach hidden content.
 */
export function ModeController() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const param = searchParams.get("view");
  const paramView: View | null =
    param === "ui" || param === "terminal" ? param : null;
  // undefined on the server: render nothing until the client knows the choice.
  const stored = useSyncExternalStore(subscribe, readStoredView, () => undefined);

  const view: View | null =
    stored === undefined
      ? null
      : (paramView ?? stored ?? (pathname === "/" ? "terminal" : "ui"));

  // An explicit ?view= is a choice; remember it for the next page.
  useEffect(() => {
    if (paramView) storeView(paramView);
  }, [paramView]);

  useEffect(() => {
    const targets = [
      document.getElementById("main-content"),
      document.querySelector("header"),
      document.querySelector("footer"),
    ].filter(Boolean) as HTMLElement[];

    if (view === "terminal") {
      targets.forEach((el) => el.setAttribute("inert", ""));
    }
    return () => {
      targets.forEach((el) => el.removeAttribute("inert"));
    };
  }, [view]);

  // Switch to the UI view, optionally on another page (`open homelab`).
  const switchToGui = useCallback(
    (href?: string) => {
      storeView("ui");
      if (href) {
        router.push(href);
      } else if (paramView) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("view");
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      }
    },
    [router, pathname, searchParams, paramView]
  );

  if (view !== "terminal") return null;

  return (
    // fixed inset-0 covers the server-rendered UI content.
    <div
      className="fixed inset-0 z-50 bg-bg"
      role="region"
      aria-label="Terminal mode"
    >
      <Terminal onSwitchToGui={switchToGui} />
    </div>
  );
}
