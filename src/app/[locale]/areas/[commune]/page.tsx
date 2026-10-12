import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import { getAreasPage, getCommuneBySlug, getServicesByIds, listCommunes } from "@/content";
import { buildMetadata } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  Breadcrumbs,
  Container,
  CtaBand,
  Eyebrow,
  FaqList,
  Heading,
  JsonLd,
  Lead,
  Section,
  SectionHeader,
  ServiceCardList,
  Text,
} from "@/components/site";
import { CantonMap } from "@/components/site/areas/canton-map";
import { getCompany } from "@/server/company";
import { breadcrumbList, faqPage, organization } from "@/server/structured-data";

export async function generateStaticParams() {
  const params = await Promise.all(
    routing.locales.map(async (locale) =>
      (await listCommunes(locale)).map((c) => ({ locale, commune: c.slug })),
    ),
  );
  return params.flat();
}

async function load(params: PageProps<"/[locale]/areas/[commune]">["params"]) {
  const { locale, commune: slug } = (await params) as { locale: Locale; commune: string };
  const commune = await getCommuneBySlug(slug, locale);
  if (!commune) notFound();
  return { locale, commune };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/areas/[commune]">): Promise<Metadata> {
  const { locale, commune } = await load(params);
  return buildMetadata({
    locale,
    href: { pathname: "/areas/[commune]", params: { commune: commune.slug } },
    ...commune.meta,
  });
}

export default async function CommunePage({ params }: PageProps<"/[locale]/areas/[commune]">) {
  const { locale, commune } = await load(params);
  const [t, tn, page, communes, services, company] = await Promise.all([
    getTranslations({ locale, namespace: "Areas" }),
    getTranslations({ locale, namespace: "Nav" }),
    getAreasPage(locale),
    listCommunes(locale),
    getServicesByIds(commune.services, locale),
    getCompany(),
  ]);
  const byId = new Map(communes.map((c) => [c.id, c]));
  const parent = commune.parent ? byId.get(commune.parent) : undefined;
  const nearby = commune.nearby.flatMap((id) => byId.get(id) ?? []);
  const href = { pathname: "/areas/[commune]", params: { commune: commune.slug } } as const;

  const structuredData = [
    {
      "@context": "https://schema.org",
      ...organization(company),
      areaServed: { "@type": "City", name: commune.name },
    },
    await breadcrumbList(locale, [
      { label: tn("areas"), href: "/areas" },
      { label: commune.name, href },
    ]),
    ...(commune.faq.length > 0 ? [faqPage(commune.faq)] : []),
  ];

  return (
    <main id="main">
      <JsonLd data={structuredData} />
      <Breadcrumbs
        locale={locale}
        items={[{ label: tn("areas"), href: "/areas" }, { label: commune.name }]}
      />

      <Section className="pt-10 sm:pt-16">
        <Container className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="space-y-8 lg:col-span-7">
            <Eyebrow>
              {parent
                ? t("quarterOf", { parent: parent.name })
                : t("canton", { name: page.cantons[commune.canton] })}
            </Eyebrow>
            <Heading as="h1" size="display">
              {commune.name}
            </Heading>
            <Lead>{commune.intro}</Lead>
            <div className="space-y-5">
              {commune.paragraphs.map((p) => (
                <Text key={p}>{p}</Text>
              ))}
            </div>
          </div>
          <div className="flex justify-center lg:col-span-4 lg:col-start-9">
            <CantonMap
              locale={locale}
              label={page.map.label}
              cantonNames={page.cantons}
              communes={communes}
              highlight={commune.canton}
            />
          </div>
        </Container>
      </Section>

      <Section tone="stone">
        <Container className="space-y-12">
          <SectionHeader title={t("servicesTitle", { name: commune.name })} />
          <ServiceCardList services={services} />
        </Container>
      </Section>

      {commune.faq.length > 0 && (
        <Section>
          <Container className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeader title={t("faqTitle")} />
            </div>
            <div className="lg:col-span-8">
              <FaqList items={commune.faq} />
            </div>
          </Container>
        </Section>
      )}

      {nearby.length > 0 && (
        <Section tone={commune.faq.length > 0 ? "stone" : "ivory"}>
          <Container className="space-y-8">
            <Heading className="text-3xl">{t("nearbyTitle")}</Heading>
            <ul className="flex flex-wrap gap-3">
              {nearby.map((c) => (
                <li key={c.id}>
                  <Link
                    href={{ pathname: "/areas/[commune]", params: { commune: c.slug } }}
                    className="inline-flex min-h-11 items-center border border-ink/20 bg-white px-5 text-sm text-ink transition-colors hover:border-ink"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/areas"
                  className="inline-flex min-h-11 items-center px-5 text-sm text-ink underline underline-offset-4"
                >
                  {t("allAreas")}
                </Link>
              </li>
            </ul>
            <Text tone="muted">{page.crossBorder}</Text>
          </Container>
        </Section>
      )}

      <CtaBand
        title={t("ctaTitle", { name: commune.name })}
        body={t("ctaBody", { name: commune.name })}
        primary={{ label: tn("requestQuote"), href: "/contact", query: { area: commune.id } }}
        secondary={{ label: tn("services"), href: "/services" }}
      />
    </main>
  );
}
