import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { companyDefaults, type CompanyDetails } from "@/config/company";

export const COMPANY_CACHE_TAG = "company-settings";

/**
 * Company identity used across the site, emails and documents.
 * Milestone 6: read the `settings` row from the database, falling back to `companyDefaults`
 * when it is unavailable; the settings form calls `revalidateTag(COMPANY_CACHE_TAG)`.
 */
export async function getCompany(): Promise<CompanyDetails> {
  "use cache";
  cacheLife("hours");
  cacheTag(COMPANY_CACHE_TAG);
  return companyDefaults;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}
