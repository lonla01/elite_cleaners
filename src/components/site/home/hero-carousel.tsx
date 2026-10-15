"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

export type HeroSlide = { id: string; title: string; content: ReactNode; image: ReactNode };

/**
 * Manually controlled hero carousel (no autoplay, as agreed). It follows the WAI-ARIA carousel
 * pattern with tabbed slide pickers. Inactive slides are `inert`, so they are hidden from
 * keyboard and assistive technology.
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const t = useTranslations("Carousel");
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const total = slides.length;

  const go = (index: number, focus = false) => {
    const next = (index + total) % total;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onTabKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(active + 1, true);
    else if (e.key === "ArrowLeft") go(active - 1, true);
    else if (e.key === "Home") go(0, true);
    else if (e.key === "End") go(total - 1, true);
    else return;
    e.preventDefault();
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t("label")}
      className="dark-surface relative isolate overflow-hidden bg-navy-900"
    >
      <div className="relative min-h-[36rem] sm:min-h-[40rem] lg:min-h-[max(44rem,calc(100svh-var(--header-height)))]">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            id={`${baseId}-slide-${i}`}
            role="tabpanel"
            aria-roledescription="slide"
            aria-label={t("slide", { current: i + 1, total })}
            inert={i !== active}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-(--ease-out-soft)",
              i === active ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            {slide.image}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/60 to-navy-950/30 md:from-navy-950/85 md:via-navy-950/35 md:to-navy-950/5"
            />
            <div
              aria-hidden
              className="absolute inset-0 hidden bg-gradient-to-r from-navy-950/75 via-navy-950/30 to-transparent md:block"
            />
            <div className="relative mx-auto flex h-full max-w-(--container-site) items-end px-(--spacing-gutter) pt-24 pb-36 sm:pb-40">
              <div className="max-w-2xl space-y-6">{slide.content}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto flex max-w-(--container-site) flex-wrap items-center justify-between gap-4 px-(--spacing-gutter) pb-10">
          <div role="tablist" aria-label={t("label")} className="flex flex-wrap gap-x-6 gap-y-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls={`${baseId}-slide-${i}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => go(i)}
                onKeyDown={onTabKey}
                aria-label={t("goTo", { index: i + 1, title: slide.title })}
                className="group flex min-h-11 items-center"
              >
                <span
                  className={cn(
                    "block h-px transition-all duration-500",
                    i === active ? "w-14 bg-brass-300" : "w-8 bg-ivory/40 group-hover:bg-ivory/70",
                  )}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label={t("previous")}
              className="inline-flex size-11 items-center justify-center rounded-full border border-ivory/30 text-ivory transition-colors hover:border-ivory"
            >
              <ChevronLeft aria-hidden className="size-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label={t("next")}
              className="inline-flex size-11 items-center justify-center rounded-full border border-ivory/30 text-ivory transition-colors hover:border-ivory"
            >
              <ChevronRight aria-hidden className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
