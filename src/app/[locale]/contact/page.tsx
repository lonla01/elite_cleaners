import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone, Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import { getContactPage, listCommunes, listServiceCategories, listServices } from "@/content";
import { buildMetadata } from "@/i18n/metadata";
import {
  Container,
  Eyebrow,
  Heading,
  JsonLd,
  Lead,
  Section,
  SectionHeader,
  Text,
} from "@/components/site";
import { ContactForm } from "@/components/site/forms/contact-form";
import { getCompany, telHref, whatsappHref } from "@/server/company";
import { breadcrumbList, organization } from "@/server/structured-data";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const { meta } = await getContactPage(locale);
  return buildMetadata({ locale, href: "/contact", ...meta });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const locale = (await params).locale as Locale;
  const [page, categories, services, communes, company, t, tn] = await Promise.all([
    getContactPage(locale),
    listServiceCategories(locale),
    listServices(locale),
    listCommunes(locale),
    getCompany(),
    getTranslations({ locale, namespace: "Contact" }),
    getTranslations({ locale, namespace: "Nav" }),
  ]);

  const serviceGroups = categories.map((c) => ({
    label: c.title,
    options: services
      .filter((s) => s.category === c.id)
      .map((s) => ({ value: s.id, label: s.title })),
  }));
  const areas = Object.fromEntries(communes.map((c) => [c.id, c.name]));

  const contactItem = "flex gap-4";
  const icon = "mt-1 size-5 shrink-0 text-brass-700";
  const link = "text-ink underline-offset-4 hover:underline";

  return (
    <main id="main">
      <JsonLd
        data={[
          { "@context": "https://schema.org", ...organization(company) },
          await breadcrumbList(locale, [{ label: tn("contact"), href: "/contact" }]),
        ]}
      />
      <section className="pt-16 sm:pt-24">
        <Container>
          <div className="max-w-(--container-prose) space-y-6">
            {page.hero.eyebrow && <Eyebrow>{page.hero.eyebrow}</Eyebrow>}
            <Heading as="h1" size="display">
              {page.hero.title}
            </Heading>
            {page.hero.intro && <Lead>{page.hero.intro}</Lead>}
          </div>
        </Container>
      </section>

      <Section>
        <Container className="grid gap-16 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <SectionHeader title={page.form.title} intro={page.form.intro} />
            <ContactForm serviceGroups={serviceGroups} areas={areas} phone={company.phone} />
          </div>

          <aside className="space-y-12 lg:col-span-4 lg:col-start-9">
            <div className="space-y-6 bg-stone p-8">
              <Heading as="h2" className="text-2xl">
                {t("detailsTitle")}
              </Heading>
              <ul className="space-y-5 text-body">
                <li className={contactItem}>
                  <Phone aria-hidden className={icon} strokeWidth={1.5} />
                  <span>
                    <span className="block text-sm text-muted">{t("phone")}</span>
                    <a href={telHref(company.phone)} className={link}>
                      {company.phone}
                    </a>
                  </span>
                </li>
                <li className={contactItem}>
                  <MessageCircle aria-hidden className={icon} strokeWidth={1.5} />
                  <span>
                    <span className="block text-sm text-muted">{t("whatsapp")}</span>
                    <a
                      href={whatsappHref(company.whatsapp)}
                      className={link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {company.whatsapp}
                    </a>
                  </span>
                </li>
                <li className={contactItem}>
                  <Mail aria-hidden className={icon} strokeWidth={1.5} />
                  <span>
                    <span className="block text-sm text-muted">{t("email")}</span>
                    <a href={`mailto:${company.email}`} className={`${link} break-all`}>
                      {company.email}
                    </a>
                  </span>
                </li>
                <li className={contactItem}>
                  <MapPin aria-hidden className={icon} strokeWidth={1.5} />
                  <span>
                    <span className="block text-sm text-muted">{t("address")}</span>
                    <address className="not-italic">
                      {company.address.street}
                      <br />
                      {company.address.postcode} {company.address.city}
                    </address>
                  </span>
                </li>
                <li className={contactItem}>
                  <Clock aria-hidden className={icon} strokeWidth={1.5} />
                  <span>
                    <span className="block text-sm text-muted">{t("hours")}</span>
                    {page.hours}
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <Heading as="h2" className="text-2xl">
                {page.next.title}
              </Heading>
              <ol className="space-y-6">
                {page.next.steps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span aria-hidden className="font-heading text-2xl text-brass-700">
                      {i + 1}
                    </span>
                    <span className="space-y-1">
                      <span className="block font-medium text-ink">{step.title}</span>
                      <Text as="span" className="block">
                        {step.body}
                      </Text>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </Container>
      </Section>
    </main>
  );
}
