import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import { getTestimonialsPage, listTestimonials } from "@/content";
import { buildMetadata } from "@/i18n/metadata";
import {
  Container,
  CtaBand,
  JsonLd,
  PageHero,
  Section,
  TestimonialCards,
  Text,
} from "@/components/site";
import { breadcrumbList } from "@/server/structured-data";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/testimonials">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const { meta } = await getTestimonialsPage(locale);
  return buildMetadata({ locale, href: "/testimonials", ...meta });
}

// No Review or AggregateRating structured data: search engines do not allow self-serving
// reviews, and these must stay genuine.
export default async function TestimonialsPage({ params }: PageProps<"/[locale]/testimonials">) {
  const locale = (await params).locale as Locale;
  const [page, testimonials, tn] = await Promise.all([
    getTestimonialsPage(locale),
    listTestimonials(locale),
    getTranslations({ locale, namespace: "Nav" }),
  ]);

  return (
    <main id="main">
      <JsonLd
        data={await breadcrumbList(locale, [{ label: tn("testimonials"), href: "/testimonials" }])}
      />
      <PageHero {...page.hero} />
      <Section>
        <Container className="space-y-10">
          <TestimonialCards items={testimonials} locale={locale} />
          <Text tone="muted" className="max-w-(--container-prose)">
            {page.note}
          </Text>
        </Container>
      </Section>
      <CtaBand {...page.cta} />
    </main>
  );
}
