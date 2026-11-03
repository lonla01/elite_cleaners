"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * The sticky header bar. On the homepage the hero slides under it, so the bar is 30 %
 * transparent with a light blur to let the hero image show through.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const overHero = usePathname() === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-(--header-height) border-b border-ink/10",
        overHero
          ? "bg-ivory/70 backdrop-blur-xs"
          : "bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/85",
      )}
    >
      {children}
    </header>
  );
}
