/**
 * Locale registry. To enable a language, set `enabled: true`, add its messages file and
 * content folder, and translate the pathnames in `src/i18n/pathnames.ts`
 * (see README → "How to add or enable a language").
 */
export const allLocales = ["en", "fr", "de", "lb"] as const;
export type Locale = (typeof allLocales)[number];

type LocaleDefinition = {
  /** Native name, shown in the language switcher. */
  label: string;
  enabled: boolean;
  /**
   * BCP 47 tags tried in order for `Intl` formatting. Luxembourgish (`lb`) has partial
   * `Intl` support in browsers, so it falls back to Luxembourg-German conventions.
   */
  intl: readonly string[];
  /** Value for `<html lang>` and hreflang. */
  hreflang: string;
};

export const localeDefinitions: Record<Locale, LocaleDefinition> = {
  en: { label: "English", enabled: true, intl: ["en-GB"], hreflang: "en" },
  fr: { label: "Français", enabled: false, intl: ["fr-LU", "fr"], hreflang: "fr" },
  de: { label: "Deutsch", enabled: false, intl: ["de-LU", "de"], hreflang: "de" },
  lb: { label: "Lëtzebuergesch", enabled: false, intl: ["lb-LU", "lb", "de-LU"], hreflang: "lb" },
};

export const defaultLocale: Locale = "en";

export const enabledLocales = allLocales.filter((l) => localeDefinitions[l].enabled);

/** Locales in which generated documents (quotes, invoices, emails) can be produced. */
export const documentLocales: readonly Locale[] = ["en", "fr", "de"];

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (allLocales as readonly string[]).includes(value);
}
