import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const tones = {
  ivory: "bg-ivory",
  stone: "bg-stone",
  white: "bg-white",
  navy: "dark-surface bg-navy-900 text-mist",
} as const;

type Props = ComponentProps<"section"> & { tone?: keyof typeof tones };

/** Vertical rhythm wrapper. The `navy` tone flips text colours for its children. */
export function Section({ tone = "ivory", className, ...props }: Props) {
  return <section className={cn("py-(--spacing-section)", tones[tone], className)} {...props} />;
}
