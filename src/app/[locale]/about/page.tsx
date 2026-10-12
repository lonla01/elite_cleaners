import type { Metadata } from "next";
import type { Locale } from "@/config/locales";
import { getAboutPage } from "@/content";
import { buildMetadata } from "@/i18n/metadata";
import {
  Container,
  ContentImage,
  CtaBand,
  FeatureGrid,
  Heading,
  PageHero,
  Section,
  SectionHeader,
  Text,
} from "@/components/site";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const { meta } = await getAboutPage(locale);
  return buildMetadata({ locale, href: "/about", ...meta });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const locale = (await params).locale as Locale;
  const page = await getAboutPage(locale);

  return (
    <main id="main">
      <PageHero {...page.hero} />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-12">
          <Heading className="lg:col-span-4">{page.story.title}</Heading>
          <div className="space-y-6 lg:col-span-7 lg:col-start-6">
            {page.story.paragraphs.map((p) => (
              <Text key={p} className="text-lg">
                {p}
              </Text>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="stone">
        <Container className="space-y-14">
          <SectionHeader
            eyebrow={page.values.eyebrow}
            title={page.values.title}
            intro={page.values.intro}
          />
          <FeatureGrid items={page.values.items} />
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <ContentImage
              image={page.standards.image}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-[4/5]"
            />
          </div>
          <div className="space-y-10 lg:col-span-6 lg:col-start-7">
            <SectionHeader
              eyebrow={page.standards.eyebrow}
              title={page.standards.title}
              intro={page.standards.intro}
            />
            <dl className="grid gap-8 sm:grid-cols-2">
              {page.standards.items.map((item) => (
                <div key={item.title} className="space-y-2 border-t border-ink/15 pt-4">
                  <dt className="font-serif text-xl text-ink">{item.title}</dt>
                  <dd className="text-body">{item.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>

      <CtaBand {...page.cta} />
    </main>
  );
}
