import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/cn";

const headingSizes = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
} as const;

type HeadingProps = ComponentProps<"h2"> & {
  as?: "h1" | "h2" | "h3" | "h4" | "p";
  size?: keyof typeof headingSizes;
};

/** Separates semantic level (`as`) from visual size (`size`). */
export function Heading({ as: Tag = "h2", size, className, ...props }: HeadingProps) {
  const visual = size ?? (Tag === "h1" ? "h1" : Tag === "h3" || Tag === "h4" ? "h3" : "h2");
  return (
    <Tag
      className={cn(
        "font-serif font-medium text-ink in-[.dark-surface]:text-ivory",
        headingSizes[visual],
        className,
      )}
      {...props}
    />
  );
}

export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-eyebrow font-medium tracking-[0.18em] text-brass-700 uppercase in-[.dark-surface]:text-brass-300",
        className,
      )}
      {...props}
    />
  );
}

export function Lead({ className, ...props }: ComponentProps<"p">) {
  return (
    <p className={cn("text-lead text-body in-[.dark-surface]:text-mist", className)} {...props} />
  );
}

type TextProps = ComponentProps<"p"> & { as?: ElementType; tone?: "body" | "muted" };

export function Text({ as: Tag = "p", tone = "body", className, ...props }: TextProps) {
  return (
    <Tag
      className={cn(
        tone === "muted"
          ? "text-muted in-[.dark-surface]:text-mist"
          : "text-body in-[.dark-surface]:text-mist",
        className,
      )}
      {...props}
    />
  );
}

/** Thin brass rule used as a discreet section ornament. */
export function Rule({ className }: { className?: string }) {
  return <span aria-hidden className={cn("block h-px w-12 bg-brass-500", className)} />;
}
