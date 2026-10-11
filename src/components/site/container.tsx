import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Props = ComponentProps<"div"> & { width?: "site" | "prose" };

export function Container({ width = "site", className, ...props }: Props) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-(--spacing-gutter)",
        width === "site" ? "max-w-(--container-site)" : "max-w-(--container-prose)",
        className,
      )}
      {...props}
    />
  );
}
