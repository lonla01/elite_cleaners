import type { Metadata } from "next";
import type { Locale } from "@/config/locales";
import { getServicesPage, listServiceCategories, listServices } from "@/content";
import { buildMetadata } from "@/i18n/metadata";
import {
  Container,
  CtaBand,
  JsonLd,
  PageHero,
  Section,
  SectionHeader,
  ServiceCardList,
} from "@/components/site";
import { breadcrumbList } from "@/server/structured-data";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const { meta } = await getServicesPage(locale);
  return buildMetadata({ locale, href: "/services", ...meta });
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const locale = (await params).locale as Locale;
  const [page, categories, services] = await Promise.all([
    getServicesPage(locale),
    listServiceCategories(locale),
    listServices(locale),
  ]);
  const breadcrumbs = await breadcrumbList(locale, [
    { label: page.hero.eyebrow ?? page.meta.title, href: "/services" },
  ]);

  return (
    <main id="main">
      <JsonLd data={breadcrumbs} />
      <PageHero {...page.hero} />

      {categories.map((category, i) => (
        <Section
          key={category.id}
          id={category.id}
          tone={i % 2 === 0 ? "ivory" : "stone"}
          className="scroll-mt-(--header-height)"
        >
          <Container className="space-y-12">
            <SectionHeader title={category.title} intro={category.description} />
            <ServiceCardList services={services.filter((s) => s.category === category.id)} />
          </Container>
        </Section>
      ))}

      <CtaBand {...page.cta} />
    </main>
  );
}
