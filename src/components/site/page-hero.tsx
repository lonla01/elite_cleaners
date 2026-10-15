import type { ReactNode } from "react";
import type { ImageRef } from "@/content/schemas";
import { cn } from "@/lib/cn";
import { Container } from "./container";
import { ContentImage } from "./content-image";
import { Eyebrow, Heading } from "./typography";

type Props = {
  eyebrow?: ReactNode;
  title: string;
  intro?: string;
  image: ImageRef;
  /** Rendered above the eyebrow, e.g. breadcrumbs. */
  top?: ReactNode;
  /** Rendered below the intro, e.g. a call to action. */
  children?: ReactNode;
  /** `compact` is a shorter band for text-heavy pages such as the legal documents. */
  size?: "default" | "compact";
};

/**
 * Interior page hero: a full-bleed photograph with the title set over it. Two gradients keep
 * the text readable whatever the photo: one from the left (where the text sits on wide
 * screens) and one from the bottom (where it sits on small ones).
 */
export function PageHero({ eyebrow, title, intro, image, top, children, size = "default" }: Props) {
  return (
    <section
      className={cn(
        "dark-surface relative isolate flex items-end overflow-hidden bg-navy-900",
        size === "default"
          ? "min-h-[34rem] sm:min-h-[38rem] lg:min-h-[min(46rem,calc(100svh-var(--header-height)))]"
          : "min-h-[22rem] sm:min-h-[26rem]",
      )}
    >
      <ContentImage image={image} fill preload sizes="100vw" className="-z-20" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/90 via-navy-950/60 to-navy-950/30 md:from-navy-950/85 md:via-navy-950/35 md:to-navy-950/5"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-navy-950/75 via-navy-950/30 to-transparent md:block"
      />
      <Container
        className={cn("w-full space-y-10", size === "default" ? "pt-28 pb-16 sm:pb-24" : "py-16")}
      >
        {top}
        <div className="max-w-3xl space-y-6 motion-safe:animate-fade-up">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <Heading as="h1" size={size === "default" ? "display" : "h1"}>
            {title}
          </Heading>
          {intro && <p className="max-w-2xl text-lead text-ivory/90">{intro}</p>}
          {children && <div className="pt-2">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
