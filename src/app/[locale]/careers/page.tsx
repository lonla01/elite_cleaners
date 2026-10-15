import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import { getCareersPage } from "@/content";
import { buildMetadata } from "@/i18n/metadata";
import {
  Container,
  FeatureGrid,
  Heading,
  JsonLd,
  PageHero,
  Section,
  SectionHeader,
  StepsList,
  Text,
} from "@/components/site";
import { CareersForm } from "@/components/site/forms/careers-form";
import { breadcrumbList } from "@/server/structured-data";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/careers">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const { meta } = await getCareersPage(locale);
  return buildMetadata({ locale, href: "/careers", ...meta });
}

export default async function CareersPage({ params }: PageProps<"/[locale]/careers">) {
  const locale = (await params).locale as Locale;
  const [page, tn] = await Promise.all([
    getCareersPage(locale),
    getTranslations({ locale, namespace: "Nav" }),
  ]);

  return (
    <main id="main">
      <JsonLd data={await breadcrumbList(locale, [{ label: tn("careers"), href: "/careers" }])} />
      <PageHero {...page.hero} />

      <Section>
        <Container className="space-y-14">
          <SectionHeader eyebrow={page.why.eyebrow} title={page.why.title} intro={page.why.intro} />
          <FeatureGrid items={page.why.items} />
        </Container>
      </Section>

      <Section tone="stone">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader eyebrow={page.roles.eyebrow} title={page.roles.title} />
          </div>
          <dl className="grid gap-8 sm:grid-cols-2 lg:col-span-8">
            {page.roles.items.map((role) => (
              <div key={role.title} className="space-y-2 border-t border-ink/15 pt-4">
                <dt className="font-heading text-xl text-ink">{role.title}</dt>
                <dd className="text-body">{role.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section tone="navy">
        <Container className="space-y-14">
          <SectionHeader eyebrow={page.process.eyebrow} title={page.process.title} />
          <StepsList steps={page.process.steps} locale={locale} />
        </Container>
      </Section>

      <Section id="apply" className="scroll-mt-(--header-height)">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <Heading>{page.form.title}</Heading>
            {page.form.intro && <Text>{page.form.intro}</Text>}
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <CareersForm />
          </div>
        </Container>
      </Section>
    </main>
  );
}
