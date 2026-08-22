"use client";

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Terminal } from "@/components/terminal/Terminal";

/**
 * Mounts a full-viewport terminal overlay unless ?view=ui is set.
 * Rendered inside Suspense in page.tsx (useSearchParams requires it).
 * Without JS this component never executes, leaving the server-rendered
 * UI content visible — satisfying the no-JS requirement.
 *
 * When the overlay is active, the underlying page receives [inert] so
 * keyboard focus cannot reach hidden content (WCAG 2.1 AA focus trap).
 */
export function ModeController() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const isUiMode = searchParams.get("view") === "ui";

  // Apply/remove inert on the underlying page content when the overlay is shown.
  useEffect(() => {
    const targets = [
      document.getElementById("main-content"),
      document.querySelector("header"),
      document.querySelector("footer"),
    ].filter(Boolean) as HTMLElement[];

    if (!isUiMode) {
      targets.forEach((el) => el.setAttribute("inert", ""));
    } else {
      targets.forEach((el) => el.removeAttribute("inert"));
    }

    return () => {
      targets.forEach((el) => el.removeAttribute("inert"));
    };
  }, [isUiMode]);

  const switchToGui = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "ui");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  if (isUiMode) return null;

  return (
    // fixed inset-0 covers the server-rendered UI content.
    // Removing ?view=ui from the URL (e.g. browser Back) restores the terminal.
    <div
      className="fixed inset-0 z-50 bg-bg"
      role="region"
      aria-label="Terminal mode"
    >
      <Terminal onSwitchToGui={switchToGui} />
    </div>
  );
}
