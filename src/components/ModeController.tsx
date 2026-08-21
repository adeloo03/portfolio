"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Terminal } from "@/components/terminal/Terminal";

/**
 * Mounts a full-viewport terminal overlay unless ?view=ui is set.
 * Rendered inside Suspense in page.tsx (useSearchParams requires it).
 * Without JS this component never executes, leaving the server-rendered
 * UI content visible — satisfying the no-JS requirement.
 */
export function ModeController() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const isUiMode = searchParams.get("view") === "ui";

  const switchToGui = useCallback(() => {
    // Preserve any other search params.
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
