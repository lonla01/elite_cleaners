import type { Metadata } from "next";
import { defaultLocale, localeDefinitions, type Locale } from "@/config/locales";
import { siteConfig } from "@/config/site";
import { getPathname } from "./navigation";
import { routing } from "./routing";
import type { AppPathname } from "./pathnames";

type Href = Parameters<typeof getPathname>[0]["href"];

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
  href: Href | AppPathname;
  title: string;
  description: string;
}): Metadata {
  const url = (l: Locale) =>
    new URL(getPathname({ locale: l, href: href as Href }), siteConfig.url).toString();
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
