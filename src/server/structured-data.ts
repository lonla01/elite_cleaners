import "server-only";
import type { Locale } from "@/config/locales";
import type { CompanyDetails } from "@/config/company";
import { absoluteUrl, type Href } from "@/i18n/metadata";
import { siteConfig } from "@/config/site";
import { getTranslations } from "next-intl/server";

/** schema.org builders. Pages render the result with <JsonLd>. */

export function organization(company: CompanyDetails) {
  return {
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#organization`,
    name: company.name,
    legalName: company.legalName,
    url: siteConfig.url,
    telephone: company.phone,
    email: company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      postalCode: company.address.postcode,
      addressLocality: company.address.city,
      addressCountry: company.address.country,
    },
    areaServed: { "@type": "Country", name: "Luxembourg" },
    openingHours: company.openingHours,
    vatID: company.vatNumber,
  };
}

export function faqPage(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export async function breadcrumbList(locale: Locale, items: { label: string; href: Href }[]) {
  const t = await getTranslations({ locale, namespace: "Common" });
  const all = [{ label: t("home"), href: "/" as Href }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: absoluteUrl(locale, item.href),
    })),
  };
}
