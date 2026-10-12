import type { Metadata } from "next";
import type { Locale } from "@/config/locales";
import { getHowItWorksPage } from "@/content";
import { buildMetadata } from "@/i18n/metadata";
import {
  Container,
  CtaBand,
  FaqList,
  FeatureGrid,
  PageHero,
  Section,
  SectionHeader,
  StepsList,
} from "@/components/site";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/how-it-works">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const { meta } = await getHowItWorksPage(locale);
  return buildMetadata({ locale, href: "/how-it-works", ...meta });
}

export default async function HowItWorksPage({ params }: PageProps<"/[locale]/how-it-works">) {
  const locale = (await params).locale as Locale;
  const page = await getHowItWorksPage(locale);

  return (
    <main id="main">
      <PageHero {...page.hero} />

      <Section>
        <Container className="space-y-14">
          <SectionHeader
            eyebrow={page.steps.eyebrow}
            title={page.steps.title}
            intro={page.steps.intro}
          />
          <StepsList steps={page.steps.items} locale={locale} detailed />
        </Container>
      </Section>

      <Section tone="navy">
        <Container className="space-y-14">
          <SectionHeader eyebrow={page.promises.eyebrow} title={page.promises.title} />
          <FeatureGrid items={page.promises.items} />
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader eyebrow={page.faq.eyebrow} title={page.faq.title} />
          </div>
          <div className="lg:col-span-8">
            <FaqList items={page.faq.items} />
          </div>
        </Container>
      </Section>

      <CtaBand {...page.cta} />
    </main>
  );
}
