import { cacheLife } from "next/cache";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import { listServiceCategories } from "@/content";
import { Link } from "@/i18n/navigation";
import { getCompany, telHref } from "@/server/company";
import { Container } from "../container";
import { Brand } from "./brand";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const [t, tn, tc, company, categories] = await Promise.all([
    getTranslations({ locale, namespace: "Footer" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Common" }),
    getCompany(),
    listServiceCategories(locale),
  ]);

  const heading = "text-eyebrow tracking-[0.18em] text-brass-300 uppercase";
  const link = "inline-block py-1 text-mist transition-colors hover:text-ivory";

  return (
    <footer className="dark-surface bg-navy-950 pt-20 pb-28 text-mist sm:pb-12">
      <Container className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-6">
          <Brand name={company.name} label={tc("homeLinkLabel", { company: company.name })} />
          <p className="max-w-xs">{t("coverage")}</p>
          <address className="space-y-1 not-italic">
            <p>{company.address.street}</p>
            <p>
              {company.address.postcode} {company.address.city}
            </p>
            <p>
              <a href={telHref(company.phone)} className={link}>
                {company.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${company.email}`} className={link}>
                {company.email}
              </a>
            </p>
          </address>
        </div>

        <nav aria-labelledby="footer-services">
          <h2 id="footer-services" className={heading}>
            {t("services")}
          </h2>
          <ul className="mt-4">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={{ pathname: "/services", hash: c.id }} className={link}>
                  {c.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/services" className={link}>
                {tn("allServices")}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-company">
          <h2 id="footer-company" className={heading}>
            {t("company")}
          </h2>
          <ul className="mt-4">
            {(
              [
                ["/about", "about"],
                ["/how-it-works", "howItWorks"],
                ["/areas", "areas"],
                ["/testimonials", "testimonials"],
                ["/careers", "careers"],
                ["/contact", "contact"],
              ] as const
            ).map(([href, key]) => (
              <li key={href}>
                <Link href={href} className={link}>
                  {tn(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-legal">
          <h2 id="footer-legal" className={heading}>
            {t("legal")}
          </h2>
          <ul className="mt-4">
            {(
              [
                ["/privacy", "privacy"],
                ["/cookies", "cookies"],
                ["/legal-notice", "legalNotice"],
              ] as const
            ).map(([href, key]) => (
              <li key={href}>
                <Link href={href} className={link}>
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <Container className="mt-16 flex flex-col gap-2 border-t border-ivory/10 pt-8 text-sm sm:flex-row sm:justify-between">
        <p>
          {t("copyright", { year: String(await CurrentYearText()), legalName: company.legalName })}
        </p>
        <p>{t("registration", { rcs: company.rcsNumber, vat: company.vatNumber })}</p>
      </Container>
    </footer>
  );
}

async function CurrentYearText() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
