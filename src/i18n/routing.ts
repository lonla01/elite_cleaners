import { defineRouting } from "next-intl/routing";
import { defaultLocale, enabledLocales } from "@/config/locales";
import { pathnames } from "./pathnames";

export const routing = defineRouting({
  locales: enabledLocales,
  defaultLocale,
  localePrefix: "always",
  // Language is chosen through the URL only. No locale cookie is set before consent.
  localeCookie: false,
  pathnames,
});
