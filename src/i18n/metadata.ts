import type { Metadata } from "next";
import { defaultLocale, localeDefinitions, type Locale } from "@/config/locales";
import { siteConfig } from "@/config/site";
import { getPathname } from "./navigation";
import { routing } from "./routing";
import type { AppPathname } from "./pathnames";

export type Href = Parameters<typeof getPathname>[0]["href"];

/** Absolute, localised URL for a route (canonical URLs, structured data, emails). */
export function absoluteUrl(locale: Locale, href: Href | AppPathname) {
  return new URL(getPathname({ locale, href: href as Href }), siteConfig.url).toString();
}

/**
 * Page metadata with canonical URL and hreflang alternates for every enabled locale
 * (x-default → English).
 */
export function buildMetadata({
  locale,
  href,
  title,
  description,
}: {
  locale: Locale;
  /** The page's route, or one per locale when slugs are translated. */
  href: Href | AppPathname | ((locale: Locale) => Href);
  title: string;
  description: string;
}): Metadata {
  const url = (l: Locale) => absoluteUrl(l, typeof href === "function" ? href(l) : href);
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [localeDefinitions[l].hreflang, url(l)]),
  );
  languages["x-default"] = url(defaultLocale);

  return {
    title,
    description,
    alternates: { canonical: url(locale), languages },
    openGraph: {
      type: "website",
      title,
      description,
      url: url(locale),
      locale: localeDefinitions[locale].intl[0]?.replace("-", "_"),
    },
  };
}
