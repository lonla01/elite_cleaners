import type { Locale } from "@/config/locales";

/**
 * Translated URL segments for static routes. Keys are the internal route names (the
 * folder structure under `app/[locale]`). Dynamic slugs (services, communes) are
 * translated in the content files instead.
 */
export const pathnames = {
  "/": "/",
  "/about": { en: "/about", fr: "/a-propos", de: "/ueber-uns", lb: "/iwwer-eis" },
  "/how-it-works": {
    en: "/how-it-works",
    fr: "/notre-methode",
    de: "/so-arbeiten-wir",
    lb: "/wei-mir-schaffen",
  },
  "/services": { en: "/services", fr: "/services", de: "/leistungen", lb: "/servicer" },
  "/services/[slug]": {
    en: "/services/[slug]",
    fr: "/services/[slug]",
    de: "/leistungen/[slug]",
    lb: "/servicer/[slug]",
  },
  "/areas": {
    en: "/areas-we-serve",
    fr: "/zones-desservies",
    de: "/einsatzgebiete",
    lb: "/regiounen",
  },
  "/areas/[commune]": {
    en: "/areas-we-serve/[commune]",
    fr: "/zones-desservies/[commune]",
    de: "/einsatzgebiete/[commune]",
    lb: "/regiounen/[commune]",
  },
  "/testimonials": {
    en: "/testimonials",
    fr: "/temoignages",
    de: "/referenzen",
    lb: "/temoignagen",
  },
  "/careers": { en: "/careers", fr: "/carrieres", de: "/karriere", lb: "/karriere" },
  "/contact": { en: "/contact", fr: "/contact", de: "/kontakt", lb: "/kontakt" },
  "/privacy": {
    en: "/privacy-policy",
    fr: "/politique-de-confidentialite",
    de: "/datenschutz",
    lb: "/dateschutz",
  },
  "/cookies": {
    en: "/cookie-policy",
    fr: "/politique-cookies",
    de: "/cookie-richtlinie",
    lb: "/cookie-richtlinn",
  },
  "/legal-notice": {
    en: "/legal-notice",
    fr: "/mentions-legales",
    de: "/impressum",
    lb: "/impressum",
  },
  // Internal design-system page. It returns 404 when APP_ENV=production.
  "/styleguide": "/styleguide",
  // Reserved for the blog (post-v1). The routes are not built yet.
  "/blog": { en: "/news", fr: "/actualites", de: "/aktuelles", lb: "/aktualiteiten" },
  "/blog/[slug]": {
    en: "/news/[slug]",
    fr: "/actualites/[slug]",
    de: "/aktuelles/[slug]",
    lb: "/aktualiteiten/[slug]",
  },
} satisfies Record<string, string | Record<Locale, string>>;

export type AppPathname = keyof typeof pathnames;
