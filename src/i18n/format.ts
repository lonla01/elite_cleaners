/**
 * The single place for locale-aware formatting. It works on both server and client, and
 * in PDFs. Always format through these helpers rather than calling `Intl` directly.
 *
 * Luxembourgish fallback: `lb` has incomplete `Intl` data in some browsers and runtimes.
 * `intlLocale()` walks the `intl` chain in `src/config/locales.ts` (lb-LU → lb → de-LU) and
 * uses the first tag the runtime supports. `lb` therefore formats numbers and months with
 * Luxembourg-German conventions where needed.
 *
 * Dates are always shown as DD/MM/YYYY in every locale, and times use the Luxembourg time zone.
 */
import type { Formats } from "next-intl";
import { defaultLocale, isLocale, localeDefinitions, type Locale } from "@/config/locales";

export const timeZone = "Europe/Luxembourg";
export const currency = "EUR";

export const formats = {
  dateTime: {
    short: { day: "2-digit", month: "2-digit", year: "numeric", timeZone },
    long: { day: "numeric", month: "long", year: "numeric", timeZone },
  },
  number: {
    currency: { style: "currency", currency },
  },
} satisfies Formats;

const resolved = new Map<string, string>();

export function intlLocale(locale: string): string {
  const key = isLocale(locale) ? locale : defaultLocale;
  const cached = resolved.get(key);
  if (cached) return cached;
  const chain = localeDefinitions[key].intl;
  const match =
    chain.find((tag) => {
      try {
        return Intl.DateTimeFormat.supportedLocalesOf([tag]).length > 0;
      } catch {
        return false;
      }
    }) ?? "en-GB";
  resolved.set(key, match);
  return match;
}

type DateInput = Date | string | number;

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value);
}

/** DD/MM/YYYY in the Luxembourg time zone, regardless of locale. */
export function formatDate(value: DateInput): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone,
  }).formatToParts(toDate(value));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value;
  return `${get("day")}/${get("month")}/${get("year")}`;
}

/** e.g. "11 October 2026", "11 octobre 2026", "11. Oktober 2026". */
export function formatDateLong(value: DateInput, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), formats.dateTime.long).format(toDate(value));
}

/** Formats an integer amount of euro cents. */
export function formatMoney(cents: number, locale: Locale): string {
  if (!Number.isInteger(cents))
    throw new TypeError(`formatMoney expects integer cents, got ${cents}`);
  return new Intl.NumberFormat(intlLocale(locale), formats.number.currency).format(cents / 100);
}

export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(intlLocale(locale), options).format(value);
}

/** Formats a VAT rate stored in basis points (1700 → "17 %" / "17%"). */
export function formatPercentFromBasisPoints(bp: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(bp / 10_000);
}
