import type { Metadata } from "next";
import type { Locale } from "@/config/locales";
import { siteConfig } from "@/config/site";
import { getLegalPage } from "@/content";
import { companyTokens, fillTokens } from "@/content/tokens";
import { buildMetadata } from "@/i18n/metadata";
import { LegalDocument } from "@/components/site/legal/legal-document";
import { getCompany } from "@/server/company";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/cookies">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const [{ meta }, company] = await Promise.all([getLegalPage("cookies", locale), getCompany()]);
  const tokens = companyTokens(company, siteConfig.url);
  return buildMetadata({
    locale,
    href: "/cookies",
    title: fillTokens(meta.title, tokens),
    description: fillTokens(meta.description, tokens),
  });
}

export default async function CookiesPage({ params }: PageProps<"/[locale]/cookies">) {
  const locale = (await params).locale as Locale;
  return <LegalDocument page={await getLegalPage("cookies", locale)} locale={locale} />;
}
