import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import { getServiceBySlug, getServicesByIds, listServiceCategories, listServices } from "@/content";
import { absoluteUrl, buildMetadata } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";
import {
  Breadcrumbs,
  ButtonLink,
  Checklist,
  Container,
  ContentImage,
  CtaBand,
  Eyebrow,
  FaqList,
  FeatureGrid,
  Heading,
  JsonLd,
  Lead,
  Section,
  SectionHeader,
  ServiceCardList,
  Text,
} from "@/components/site";
import { getCompany } from "@/server/company";
import { breadcrumbList, faqPage, organization } from "@/server/structured-data";

export async function generateStaticParams() {
  const params = await Promise.all(
    routing.locales.map(async (locale) =>
      (await listServices(locale)).map((s) => ({ locale, slug: s.slug })),
    ),
  );
  return params.flat();
}

async function load(params: PageProps<"/[locale]/services/[slug]">["params"]) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const service = await getServiceBySlug(slug, locale);
  if (!service) notFound();
  return { locale, service };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const { locale, service } = await load(params);
  return buildMetadata({
    locale,
    href: { pathname: "/services/[slug]", params: { slug: service.slug } },
    ...service.meta,
  });
}

export default async function ServicePage({ params }: PageProps<"/[locale]/services/[slug]">) {
  const { locale, service } = await load(params);
  const [t, tn, categories, related, company] = await Promise.all([
    getTranslations({ locale, namespace: "ServicePage" }),
    getTranslations({ locale, namespace: "Nav" }),
    listServiceCategories(locale),
    getServicesByIds(service.related, locale),
    getCompany(),
  ]);
  const category = categories.find((c) => c.id === service.category);
  const href = { pathname: "/services/[slug]", params: { slug: service.slug } } as const;
  const quoteHref = { pathname: "/contact", query: { service: service.id } } as const;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: service.summary,
      serviceType: service.title,
      url: absoluteUrl(locale, href),
      provider: organization(company),
      areaServed: { "@type": "Country", name: "Luxembourg" },
    },
    faqPage(service.faq),
    await breadcrumbList(locale, [
      { label: tn("services"), href: "/services" },
      { label: service.title, href },
    ]),
  ];

  return (
    <main id="main">
      <JsonLd data={structuredData} />
      <Breadcrumbs
        locale={locale}
        items={[{ label: tn("services"), href: "/services" }, { label: service.title }]}
      />

      {/* Hero */}
      <section className="pt-10 sm:pt-16">
        <Container className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="space-y-6 lg:col-span-7">
            {category && <Eyebrow>{category.title}</Eyebrow>}
            <Heading as="h1" size="display">
              {service.title}
            </Heading>
          </div>
          <div className="space-y-6 lg:col-span-5">
            <Lead>{service.hero.intro}</Lead>
            <ButtonLink href={quoteHref} variant="accent" size="lg">
              {t("quoteFor")}
            </ButtonLink>
          </div>
        </Container>
        <Container className="mt-12 sm:mt-16">
          <div className="relative aspect-[16/9] overflow-hidden rounded-sm sm:aspect-[2/1]">
            <ContentImage
              image={service.hero.image}
              fill
              preload
              sizes="(min-width: 76rem) 76rem, 100vw"
            />
          </div>
        </Container>
      </section>

      {/* What's included */}
      <Section>
        <Container className="space-y-14">
          <SectionHeader
            eyebrow={t("includedEyebrow")}
            title={t("includedTitle")}
            intro={service.included.intro}
          />
          <Checklist groups={service.included.groups} />
        </Container>
      </Section>

      {/* Frequency */}
      <Section tone="stone">
        <Container className="space-y-14">
          <SectionHeader
            eyebrow={t("frequencyEyebrow")}
            title={t("frequencyTitle")}
            intro={service.frequencies.intro}
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.frequencies.options.map((option) => (
              <li key={option.title} className="space-y-3 bg-white p-8 shadow-(--shadow-soft)">
                <Heading as="h3" className="text-2xl">
                  {option.title}
                </Heading>
                <Text>{option.body}</Text>
              </li>
            ))}
          </ul>
          <Text tone="muted">{t("quoteOnly")}</Text>
        </Container>
      </Section>

      {/* Who it's for */}
      <Section tone="navy">
        <Container className="space-y-14">
          <SectionHeader eyebrow={t("audienceEyebrow")} title={t("audienceTitle")} />
          <FeatureGrid
            items={service.audience}
            className={service.audience.length === 3 ? "lg:grid-cols-3" : undefined}
          />
        </Container>
      </Section>

      {/* FAQ */}
      <Section>
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader eyebrow={t("faqEyebrow")} title={t("faqTitle")} />
          </div>
          <div className="lg:col-span-8">
            <FaqList items={service.faq} />
          </div>
        </Container>
      </Section>

      {/* Related */}
      {related.length > 0 && (
        <Section tone="stone">
          <Container className="space-y-12">
            <SectionHeader title={t("relatedTitle")} />
            <ServiceCardList services={related} />
          </Container>
        </Section>
      )}

      <CtaBand
        title={t("ctaTitle")}
        body={t("ctaBody")}
        primary={{ label: t("quoteFor"), href: "/contact", query: { service: service.id } }}
        secondary={{ label: tn("howItWorks"), href: "/how-it-works" }}
      />
    </main>
  );
}
