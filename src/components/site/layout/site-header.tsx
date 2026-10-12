import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import { listServiceCategories, listServices } from "@/content";
import { getCompany } from "@/server/company";
import { Container } from "../container";
import { Brand } from "./brand";
import { HeaderQuoteButton, MegaMenu } from "./mega-menu";
import { MobileNav } from "./mobile-nav";
import type { NavCategory } from "./nav-data";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const [t, company, categories, services] = await Promise.all([
    getTranslations({ locale, namespace: "Common" }),
    getCompany(),
    listServiceCategories(locale),
    listServices(locale),
  ]);

  const nav: NavCategory[] = categories.map((c) => ({
    id: c.id,
    title: c.title,
    navTitle: c.navTitle,
    services: services
      .filter((s) => s.category === c.id)
      .map(({ id, slug, title }) => ({ id, slug, title })),
  }));

  return (
    <header className="sticky top-0 z-40 h-(--header-height) border-b border-ink/10 bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/85">
      <Container className="flex h-full items-center justify-between gap-6">
        <Brand name={company.name} label={t("homeLinkLabel", { company: company.name })} />
        <div className="flex items-center gap-2 lg:gap-6">
          <MegaMenu categories={nav} />
          <HeaderQuoteButton label={t("requestQuote")} />
          <MobileNav categories={nav} />
        </div>
      </Container>
    </header>
  );
}
