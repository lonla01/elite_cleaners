import "server-only";
import type { z } from "zod";
import { getTranslations } from "next-intl/server";
import { defaultLocale, isLocale, localeDefinitions, type Locale } from "@/config/locales";
import type { FormState } from "@/lib/form-state";

/** The form's locale (a hidden field), restricted to enabled locales. */
export function formLocale(formData: FormData): Locale {
  const value = formData.get("locale");
  return isLocale(value) && localeDefinitions[value].enabled ? value : defaultLocale;
}

/** Plain values from FormData. Files are skipped; `multi` fields become arrays. */
export function formValues(formData: FormData, multi: string[] = []) {
  const values: Record<string, string | string[]> = {};
  for (const key of new Set(formData.keys())) {
    if (key.startsWith("$ACTION") || key === "website") continue;
    const all = formData.getAll(key).filter((v): v is string => typeof v === "string");
    if (multi.includes(key)) values[key] = all;
    else if (all[0] !== undefined) values[key] = all[0];
  }
  return values;
}

/** A filled honeypot means a bot. */
export function isBot(formData: FormData) {
  const value = formData.get("website");
  return typeof value === "string" && value.trim() !== "";
}

/**
 * Turns Zod issues into translated field errors. Schemas use message keys from
 * `Forms.errors` as their error messages.
 */
export async function errorState(
  locale: Locale,
  values: Record<string, string | string[]>,
  issues: z.core.$ZodIssue[] = [],
  message?: string,
): Promise<FormState> {
  const t = await getTranslations({ locale, namespace: "Forms.errors" });
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const field = String(issue.path[0] ?? "form");
    if (fieldErrors[field]) continue;
    fieldErrors[field] = t.has(issue.message) ? t(issue.message) : t("invalid");
  }
  return {
    status: "error",
    message: message ?? t("summary"),
    fieldErrors,
    values,
    attempt: Date.now(),
  };
}
