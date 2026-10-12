import type { ComponentProps } from "react";
import type { VariantProps } from "class-variance-authority";
import { Link } from "@/i18n/navigation";
import type { ContentLinkData } from "@/content/schemas";
import { cn } from "@/lib/cn";
import { buttonVariants } from "./button";

type Href = ComponentProps<typeof Link>["href"];

/** Converts a content link (route key + params) into a typed, localised href. */
export function toHref(link: Pick<ContentLinkData, "href" | "params" | "query">): Href {
  return (
    link.params || link.query
      ? { pathname: link.href, params: link.params, query: link.query }
      : link.href
  ) as Href;
}

type Props = Omit<ComponentProps<typeof Link>, "href" | "children"> & { link: ContentLinkData };

export function ContentLink({ link, ...props }: Props) {
  return (
    <Link href={toHref(link)} {...props}>
      {link.label}
    </Link>
  );
}

export function ContentButtonLink({
  link,
  variant,
  size,
  className,
  ...props
}: Props & VariantProps<typeof buttonVariants>) {
  return (
    <ContentLink
      link={link}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

/** Text link with a discreet animated underline and arrow. */
export function ArrowLink({ link, className, ...props }: Props) {
  return (
    <Link
      href={toHref(link)}
      className={cn(
        "group inline-flex items-center gap-2 text-sm font-medium tracking-[0.04em] text-ink in-[.dark-surface]:text-ivory",
        className,
      )}
      {...props}
    >
      <span className="border-b border-current/30 pb-0.5 transition-colors group-hover:border-current">
        {link.label}
      </span>
      <span aria-hidden className="transition-transform group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
