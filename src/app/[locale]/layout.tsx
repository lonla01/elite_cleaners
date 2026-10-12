import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { localeDefinitions } from "@/config/locales";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { SkipLink } from "@/components/site";
import { SiteHeader } from "@/components/site/layout/site-header";
import { SiteFooter } from "@/components/site/layout/site-footer";
import { ContactShortcuts } from "@/components/site/layout/contact-shortcuts";
import { getCompany, telHref, whatsappHref } from "@/server/company";
import { fontVariables } from "../fonts";
import "@/styles/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const [t, company] = await Promise.all([
    getTranslations({ locale, namespace: "Metadata" }),
    getCompany(),
  ]);
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("defaultTitle", { company: company.name }),
      template: t("titleTemplate", { company: company.name }),
    },
    description: t("defaultDescription"),
    openGraph: { siteName: company.name },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [t, company] = await Promise.all([
    getTranslations({ locale, namespace: "Common" }),
    getCompany(),
  ]);

  return (
    <html lang={localeDefinitions[locale].hreflang} className={fontVariables}>
      <body className="flex min-h-dvh flex-col antialiased">
        <NextIntlClientProvider>
          <SkipLink label={t("skipToContent")} />
          <SiteHeader locale={locale} />
          <div className="flex flex-1 flex-col">{children}</div>
          <SiteFooter locale={locale} />
          <ContactShortcuts
            tel={telHref(company.phone)}
            whatsapp={whatsappHref(company.whatsapp)}
            phoneDisplay={company.phone}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
