import type { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { Link } from "@/i18n/navigation";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-sm text-center font-medium",
    "transition-colors duration-200 ease-(--ease-out-soft)",
    "disabled:pointer-events-none disabled:opacity-50",
    // Labels may wrap in longer languages, so there is no fixed width and no nowrap.
    "min-h-11 px-6 py-2.5 text-sm tracking-[0.04em]",
  ],
  {
    variants: {
      variant: {
        primary: "bg-navy-900 text-ivory hover:bg-navy-700",
        accent: "bg-brass-700 text-white hover:bg-navy-900",
        outline:
          "border border-ink/25 text-ink hover:border-ink in-[.dark-surface]:border-ivory/40 in-[.dark-surface]:text-ivory in-[.dark-surface]:hover:border-ivory",
        ghost: "text-ink underline-offset-4 hover:underline in-[.dark-surface]:text-ivory",
        light: "bg-ivory text-ink hover:bg-white",
      },
      size: {
        md: "",
        lg: "min-h-13 px-8 text-base",
        sm: "min-h-9 px-4 text-xs",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ variant, size, asChild, className, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>;

/** Localised internal link styled as a button. */
export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
