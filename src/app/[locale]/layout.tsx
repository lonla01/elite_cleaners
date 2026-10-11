import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { localeDefinitions } from "@/config/locales";
import { companyDefaults } from "@/config/company";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { SkipLink } from "@/components/site";
import { fontVariables } from "../fonts";
import "@/styles/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const company = companyDefaults.name;
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("defaultTitle", { company }), template: t("titleTemplate", { company }) },
    description: t("defaultDescription"),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Common" });

  return (
    <html lang={localeDefinitions[locale].hreflang} className={fontVariables}>
      <body className="flex min-h-dvh flex-col antialiased">
        <NextIntlClientProvider>
          <SkipLink label={t("skipToContent")} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
