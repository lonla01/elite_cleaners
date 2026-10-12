import "server-only";
import { z } from "zod";
import { enabledLocales, type Locale } from "@/config/locales";
import { readContent } from "./source/fs";
import {
  aboutPageSchema,
  areasPageSchema,
  careersPageSchema,
  communeSchema,
  contactPageSchema,
  legalPageSchema,
  homePageSchema,
  howItWorksPageSchema,
  serviceCategorySchema,
  serviceSchema,
  servicesPageSchema,
  testimonialSchema,
  testimonialsPageSchema,
  type ServiceCategoryId,
} from "./schemas";
import serviceIds from "../../content/services.json";
import communeIds from "../../content/communes.json";

export type * from "./schemas";

/** The content-access API. Pages and components import from here only. */

export function getHomePage(locale: Locale) {
  return readContent("home", locale, homePageSchema);
}

export function getAboutPage(locale: Locale) {
  return readContent("pages/about", locale, aboutPageSchema);
}

export function getHowItWorksPage(locale: Locale) {
  return readContent("pages/how-it-works", locale, howItWorksPageSchema);
}

export function listServiceCategories(locale: Locale) {
  return readContent("service-categories", locale, z.array(serviceCategorySchema));
}

/** All services, ordered within their category. */
export async function listServices(locale: Locale, category?: ServiceCategoryId) {
  const services = await Promise.all(
    serviceIds.map((id) => readContent(`services/${id}`, locale, serviceSchema)),
  );
  return services
    .filter((s) => !category || s.category === category)
    .sort((a, b) => a.order - b.order);
}

export async function getServiceBySlug(slug: string, locale: Locale) {
  return (await listServices(locale)).find((s) => s.slug === slug);
}

/** Services by id, in the order given. Unknown ids are skipped. */
export async function getServicesByIds(ids: string[], locale: Locale) {
  const services = await listServices(locale);
  return ids.flatMap((id) => services.find((s) => s.id === id) ?? []);
}

export function getServicesPage(locale: Locale) {
  return readContent("pages/services", locale, servicesPageSchema);
}

export async function listTestimonials(locale: Locale, limit?: number) {
  const all = await readContent("testimonials", locale, z.array(testimonialSchema));
  return limit ? all.slice(0, limit) : all;
}

export function getTestimonialsPage(locale: Locale) {
  return readContent("pages/testimonials", locale, testimonialsPageSchema);
}

/** Communes and quarters with a local page, in the order of content/communes.json. */
export function listCommunes(locale: Locale) {
  return Promise.all(communeIds.map((id) => readContent(`communes/${id}`, locale, communeSchema)));
}

export async function getCommuneBySlug(slug: string, locale: Locale) {
  return (await listCommunes(locale)).find((c) => c.slug === slug);
}

export function getAreasPage(locale: Locale) {
  return readContent("pages/areas", locale, areasPageSchema);
}

export type LegalPageId = "privacy" | "cookies" | "legal-notice";

/** Legal pages. Their text contains company tokens; render through `fillTokens()`. */
export function getLegalPage(id: LegalPageId, locale: Locale) {
  return readContent(`pages/${id}`, locale, legalPageSchema);
}

export function getContactPage(locale: Locale) {
  return readContent("pages/contact", locale, contactPageSchema);
}

export function getCareersPage(locale: Locale) {
  return readContent("pages/careers", locale, careersPageSchema);
}

export type SlugMap = Record<string, Partial<Record<Locale, string>>>;

/**
 * Localised slugs of every service and commune, by id. Used for hreflang alternates and by the
 * language switcher, since dynamic slugs differ between languages.
 */
export async function getSlugMaps(): Promise<{ services: SlugMap; communes: SlugMap }> {
  const services: SlugMap = {};
  const communes: SlugMap = {};
  await Promise.all(
    enabledLocales.map(async (locale) => {
      for (const s of await listServices(locale)) (services[s.id] ??= {})[locale] = s.slug;
      for (const c of await listCommunes(locale)) (communes[c.id] ??= {})[locale] = c.slug;
    }),
  );
  return { services, communes };
}
