import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import { siteConfig } from "@/config/site";
import type { LegalPage } from "@/content/schemas";
import { companyTokens, fillTokens } from "@/content/tokens";
import { formatDate } from "@/i18n/format";
import { getCompany } from "@/server/company";
import { Container } from "../container";
import { Eyebrow, Heading, Lead } from "../typography";

/** Shared layout for the privacy policy, cookie policy and legal notice. */
export async function LegalDocument({ page, locale }: { page: LegalPage; locale: Locale }) {
  const [t, company] = await Promise.all([
    getTranslations({ locale, namespace: "Legal" }),
    getCompany(),
  ]);
  const tokens = companyTokens(company, siteConfig.url);
  const fill = (text: string) => fillTokens(text, tokens);

  return (
    <main id="main" className="py-16 sm:py-24">
      <Container width="prose" className="space-y-12">
        <header className="space-y-6">
          <Eyebrow>{t("updated", { date: formatDate(page.updated) })}</Eyebrow>
          <Heading as="h1">{page.title}</Heading>
          <Lead>{fill(page.intro)}</Lead>
          {!page.reviewed && (
            <p
              role="note"
              className="border-l-2 border-brass-500 bg-stone px-4 py-3 text-sm text-body"
            >
              {t("pendingReview")}
            </p>
          )}
        </header>

        <nav aria-labelledby="toc-title" className="border-y border-ink/15 py-6">
          <h2 id="toc-title" className="text-eyebrow tracking-[0.18em] text-brass-700 uppercase">
            {t("contents")}
          </h2>
          <ol className="mt-4 list-inside list-decimal space-y-1 text-body">
            {page.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="underline-offset-4 hover:underline">
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {page.sections.map((section, i) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className="scroll-mt-(--header-height) space-y-4 text-body"
          >
            <Heading as="h2" id={`${section.id}-title`} className="text-3xl">
              {i + 1}. {section.title}
            </Heading>
            {section.paragraphs.map((p) => (
              <p key={p}>{fill(p)}</p>
            ))}
            {section.list.length > 0 && (
              <ul className="list-disc space-y-2 pl-6 marker:text-brass-700">
                {section.list.map((item) => (
                  <li key={item}>{fill(item)}</li>
                ))}
              </ul>
            )}
            {section.after.map((p) => (
              <p key={p}>{fill(p)}</p>
            ))}
          </section>
        ))}
      </Container>
    </main>
  );
}
