import "server-only";
import { z } from "zod";
import type { Locale } from "@/config/locales";
import { readContent } from "./source/fs";
import {
  aboutPageSchema,
  homePageSchema,
  howItWorksPageSchema,
  serviceCategorySchema,
  serviceSchema,
  servicesPageSchema,
  testimonialSchema,
  type ServiceCategoryId,
} from "./schemas";
import serviceIds from "../../content/services.json";

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

export function listTestimonials(locale: Locale) {
  return readContent("testimonials", locale, z.array(testimonialSchema));
}
