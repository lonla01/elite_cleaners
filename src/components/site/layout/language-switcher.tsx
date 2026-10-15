"use client";

import type { ComponentProps } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { localeDefinitions, type Locale } from "@/config/locales";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { LocaleFlag } from "./flags";

type SlugMap = Record<string, Partial<Record<Locale, string>>>;
type Href = ComponentProps<typeof Link>["href"];

/** Finds the slug of the same item in another locale. */
function translateSlug(map: SlugMap, slug: string, from: Locale, to: Locale) {
  const entry = Object.values(map).find((slugs) => slugs[from] === slug);
  return entry?.[to] ?? slug;
}

/**
 * Links to the current page in every enabled language. Dynamic slugs (services, communes)
 * are translated through the slug maps, since they differ between languages.
 */
export function LanguageSwitcher({
  locales,
  slugMaps,
  className,
}: {
  locales: readonly Locale[];
  slugMaps: { services: SlugMap; communes: SlugMap };
  className?: string;
}) {
  const t = useTranslations("Nav");
  const current = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams<{ slug?: string; commune?: string }>();

  // Dynamic routes are detected from their params: behind the Proxy rewrite, `usePathname`
  // returns the concrete internal path (`/areas/luxembourg-city`), not the route template.
  const hrefFor = (target: Locale): Href => {
    if (params.slug) {
      const slug = translateSlug(slugMaps.services, params.slug, current, target);
      return { pathname: "/services/[slug]", params: { slug } };
    }
    if (params.commune) {
      const commune = translateSlug(slugMaps.communes, params.commune, current, target);
      return { pathname: "/areas/[commune]", params: { commune } };
    }
    return pathname as Href;
  };

  if (locales.length < 2) return null;

  return (
    <nav aria-label={t("language")} className={className}>
      <ul className="flex items-center gap-1">
        {locales.map((locale) => {
          const { label, hreflang } = localeDefinitions[locale];
          const active = locale === current;
          return (
            <li key={locale}>
              <Link
                href={hrefFor(locale)}
                locale={locale}
                lang={hreflang}
                hrefLang={hreflang}
                aria-label={label}
                title={label}
                aria-current={active ? "true" : undefined}
                className="group inline-flex min-h-11 min-w-11 items-center justify-center"
              >
                <LocaleFlag
                  locale={locale}
                  className={cn(
                    "transition-[opacity,box-shadow]",
                    active
                      ? "shadow-[0_0_0_2px_var(--color-brass-500)]"
                      : "opacity-60 group-hover:opacity-100",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
