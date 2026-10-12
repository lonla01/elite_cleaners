"use client";

import type { ComponentProps } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { localeDefinitions, type Locale } from "@/config/locales";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

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

  const hrefFor = (target: Locale): Href => {
    if (pathname === "/services/[slug]" && params.slug) {
      const slug = translateSlug(slugMaps.services, params.slug, current, target);
      return { pathname, params: { slug } };
    }
    if (pathname === "/areas/[commune]" && params.commune) {
      const commune = translateSlug(slugMaps.communes, params.commune, current, target);
      return { pathname, params: { commune } };
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
                aria-current={active ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-11 min-w-11 items-center justify-center text-xs font-medium tracking-[0.12em] uppercase transition-colors",
                  active ? "text-ink underline underline-offset-4" : "text-muted hover:text-ink",
                )}
              >
                {locale}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
