import * as rootParams from "next/root-params";
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { allLocales, type Locale } from "@/config/locales";
import { routing } from "./routing";
import { formats, timeZone } from "./format";

export default getRequestConfig(async ({ locale }) => {
  // Admin and document rendering pass an explicit locale (which may be a disabled
  // public locale, e.g. a French invoice). Public pages read it from the URL.
  if (!locale) {
    const param = await rootParams.locale();
    // Routes outside `[locale]` (the admin) have no locale param. They are English-only.
    if (param === undefined) locale = "en";
    else if (!hasLocale(routing.locales, param)) notFound();
    else locale = param;
  }
  if (!hasLocale(allLocales, locale)) notFound();

  return {
    locale,
    timeZone,
    formats,
    messages: await loadMessages(locale),
  };
});

async function loadMessages(locale: Locale) {
  const english = (await import("../../messages/en.json")).default;
  if (locale === "en") return english;
  const localized = (await import(`../../messages/${locale}.json`)).default;
  // Untranslated keys fall back to English.
  return deepMerge(english, localized);
}

type Messages = { [key: string]: string | Messages };

function deepMerge(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = out[key];
    out[key] =
      typeof value === "object" && typeof current === "object" ? deepMerge(current, value) : value;
  }
  return out;
}
