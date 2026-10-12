import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import { getAreasPage, listCommunes } from "@/content";
import { cantonIds } from "@/content/geo/cantons";
import { buildMetadata } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import {
  Container,
  CtaBand,
  Heading,
  JsonLd,
  PageHero,
  Section,
  SectionHeader,
  Text,
} from "@/components/site";
import { CantonMap } from "@/components/site/areas/canton-map";
import { breadcrumbList } from "@/server/structured-data";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/areas">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const { meta } = await getAreasPage(locale);
  return buildMetadata({ locale, href: "/areas", ...meta });
}

export default async function AreasPage({ params }: PageProps<"/[locale]/areas">) {
  const locale = (await params).locale as Locale;
  const [page, communes, t, tn] = await Promise.all([
    getAreasPage(locale),
    listCommunes(locale),
    getTranslations({ locale, namespace: "Areas" }),
    getTranslations({ locale, namespace: "Nav" }),
  ]);
  const byId = new Map(communes.map((c) => [c.id, c]));

  return (
    <main id="main">
      <JsonLd data={await breadcrumbList(locale, [{ label: tn("areas"), href: "/areas" }])} />
      <PageHero {...page.hero} />

      <Section>
        <Container className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="space-y-10 lg:col-span-5">
            <SectionHeader
              eyebrow={page.map.eyebrow}
              title={page.map.title}
              intro={page.map.intro}
            />
            <div className="space-y-4">
              <Heading as="h3" className="text-xl">
                {t("cantonsTitle")}
              </Heading>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-body sm:grid-cols-3">
                {cantonIds.map((id) => (
                  <li key={id} className="flex items-center gap-2">
                    <span aria-hidden className="size-1.5 rounded-full bg-brass-500" />
                    {page.cantons[id]}
                  </li>
                ))}
              </ul>
            </div>
            <Text tone="muted">{page.crossBorder}</Text>
          </div>
          <div className="flex justify-center lg:col-span-6 lg:col-start-7">
            <CantonMap
              locale={locale}
              label={page.map.label}
              cantonNames={page.cantons}
              communes={communes}
            />
          </div>
        </Container>
      </Section>

      <Section tone="stone">
        <Container className="space-y-12">
          <SectionHeader {...page.communes} />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {communes.map((commune) => (
              <li key={commune.id}>
                <Link
                  href={{ pathname: "/areas/[commune]", params: { commune: commune.slug } }}
                  className="group flex h-full flex-col gap-3 bg-white p-8 shadow-(--shadow-soft) transition-shadow hover:shadow-lg"
                >
                  <span className="text-eyebrow tracking-[0.18em] text-brass-700 uppercase">
                    {commune.kind === "quarter" && commune.parent
                      ? t("quarterOf", { parent: byId.get(commune.parent)?.name ?? "" })
                      : t("canton", { name: page.cantons[commune.canton] })}
                  </span>
                  <Heading as="h3" className="text-2xl group-hover:text-navy-700">
                    {commune.name}
                  </Heading>
                  <Text className="flex-1">{commune.intro}</Text>
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand {...page.cta} />
    </main>
  );
}
