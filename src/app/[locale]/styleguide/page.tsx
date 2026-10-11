import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { env } from "@/env";
import { Button, Container, Eyebrow, Heading, Lead, Rule, Section, Text } from "@/components/site";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const swatches = [
  ["ivory", "bg-ivory"],
  ["stone", "bg-stone"],
  ["sand", "bg-sand"],
  ["ink / navy-900", "bg-navy-900"],
  ["navy-800", "bg-navy-800"],
  ["navy-700", "bg-navy-700"],
  ["brass-300", "bg-brass-300"],
  ["brass-500", "bg-brass-500"],
  ["brass-700", "bg-brass-700"],
] as const;

export default async function StyleguidePage({ params }: PageProps<"/[locale]/styleguide">) {
  if (env.APP_ENV === "production") notFound();
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Styleguide" });

  return (
    <main id="main">
      <Section>
        <Container className="space-y-6">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <Heading as="h1" size="display">
            {t("title")}
          </Heading>
          <Rule />
          <Lead className="max-w-(--container-prose)">{t("lead")}</Lead>
        </Container>
      </Section>

      <Section tone="white">
        <Container className="space-y-8">
          <Heading>{t("colours")}</Heading>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {swatches.map(([name, cls]) => (
              <li key={name} className="space-y-2">
                <div className={`h-20 rounded-md border border-ink/10 ${cls}`} />
                <Text tone="muted" className="text-sm">
                  {name}
                </Text>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container className="space-y-6">
          <Heading>{t("typography")}</Heading>
          <Heading as="p" size="display">
            {t("sampleHeading")}
          </Heading>
          <Heading as="p" size="h1">
            {t("sampleHeading")}
          </Heading>
          <Heading as="p" size="h2">
            {t("sampleHeading")}
          </Heading>
          <Heading as="p" size="h3">
            {t("sampleHeading")}
          </Heading>
          <Lead className="max-w-(--container-prose)">{t("sampleBody")}</Lead>
          <Text className="max-w-(--container-prose)">{t("sampleBody")}</Text>
        </Container>
      </Section>

      <Section tone="stone">
        <Container className="space-y-6">
          <Heading>{t("buttons")}</Heading>
          <div className="flex flex-wrap gap-4">
            <Button>Primary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="lg">Large</Button>
            <Button size="sm">Small</Button>
          </div>
        </Container>
      </Section>

      <Section tone="navy">
        <Container className="space-y-6">
          <Eyebrow>{t("darkSurface")}</Eyebrow>
          <Heading>{t("sampleHeading")}</Heading>
          <Lead className="max-w-(--container-prose)">{t("sampleBody")}</Lead>
          <div className="flex flex-wrap gap-4">
            <Button variant="light">Light</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
