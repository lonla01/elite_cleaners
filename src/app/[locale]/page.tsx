import type { Metadata } from "next";
import type { Locale } from "@/config/locales";
import { getHomePage, listServiceCategories, listTestimonials } from "@/content";
import { buildMetadata } from "@/i18n/metadata";
import {
  ArrowLink,
  Container,
  ContentButtonLink,
  ContentImage,
  CtaBand,
  Eyebrow,
  FeatureGrid,
  Heading,
  Lead,
  Section,
  SectionHeader,
  StepsList,
  TestimonialCards,
} from "@/components/site";
import { HeroCarousel } from "@/components/site/home/hero-carousel";
import { TrustBar } from "@/components/site/home/trust-bar";
import { TrustedBy } from "@/components/site/home/trusted-by";
import { CategoryCards } from "@/components/site/home/category-cards";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const { meta } = await getHomePage(locale);
  return buildMetadata({ locale, href: "/", ...meta });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  const [page, categories, testimonials] = await Promise.all([
    getHomePage(locale),
    listServiceCategories(locale),
    listTestimonials(locale, 3),
  ]);

  return (
    <main id="main">
      <HeroCarousel
        slides={page.hero.slides.map((slide, i) => ({
          id: slide.id,
          title: slide.title,
          image: <ContentImage image={slide.image} fill preload={i === 0} sizes="100vw" />,
          content: (
            <>
              <Eyebrow>{slide.eyebrow}</Eyebrow>
              {i === 0 ? (
                <Heading as="h1" size="display">
                  {slide.title}
                </Heading>
              ) : (
                <Heading as="p" size="display">
                  {slide.title}
                </Heading>
              )}
              <Lead>{slide.body}</Lead>
              <ContentButtonLink link={slide.cta} variant="light" size="lg" />
            </>
          ),
        }))}
      />

      <TrustBar items={page.trust} />
      <TrustedBy data={page.trustedBy} locale={locale} />

      <Section tone="stone">
        <Container className="space-y-14">
          <SectionHeader {...page.categories} />
          <CategoryCards categories={categories} locale={locale} />
        </Container>
      </Section>

      <Section>
        <Container className="space-y-14">
          <SectionHeader {...page.commitment} />
          <FeatureGrid items={page.commitment.items} />
        </Container>
      </Section>

      <Section tone="navy">
        <Container className="space-y-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeader eyebrow={page.process.eyebrow} title={page.process.title} />
            <ArrowLink link={page.process.link} />
          </div>
          <StepsList steps={page.process.steps} locale={locale} />
        </Container>
      </Section>

      <Section>
        <Container className="space-y-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeader eyebrow={page.testimonials.eyebrow} title={page.testimonials.title} />
            <ArrowLink link={page.testimonials.link} />
          </div>
          <TestimonialCards items={testimonials} locale={locale} />
        </Container>
      </Section>

      <CtaBand {...page.cta} />
    </main>
  );
}
