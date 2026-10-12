import "server-only";
import type { z } from "zod";
import { defaultLocale, type Locale } from "@/config/locales";

/**
 * File-based content source: JSON files under /content/<locale>/, validated with Zod.
 * A file missing in a locale falls back to English. This is the only module that knows where
 * content is stored; swap it for a CMS-backed source without touching pages.
 */
export async function readContent<T extends z.ZodType>(
  path: string,
  locale: Locale,
  schema: T,
): Promise<z.infer<T>> {
  const raw = (await load(path, locale)) ?? (await load(path, defaultLocale));
  if (raw === undefined) throw new Error(`Content not found: ${path}`);
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new Error(`Invalid content in ${locale}/${path}.json:\n${result.error.message}`);
  }
  return result.data;
}

async function load(path: string, locale: Locale): Promise<unknown> {
  try {
    return (await import(`../../../content/${locale}/${path}.json`)).default;
  } catch {
    return undefined;
  }
}
