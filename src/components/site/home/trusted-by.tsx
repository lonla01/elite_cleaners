import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import type { HomePage } from "@/content/schemas";
import { Container } from "../container";

/**
 * "Trusted by" strip.
 *
 * IMPORTANT: a real client logo (CFL, banks or any other client) may only be displayed once that
 * client has given WRITTEN permission. Keep a copy of each permission on file. Until then, keep
 * `placeholder: true` in the content so a neutral slot is rendered instead of the logo.
 */
export async function TrustedBy({ data, locale }: { data: HomePage["trustedBy"]; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Common" });
  return (
    <section className="py-16">
      <Container className="space-y-10">
        <h2 className="text-center text-eyebrow tracking-[0.18em] text-muted uppercase">
          {data.title}
        </h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {data.logos.map((logo) => (
            <li
              key={logo.name}
              className="flex h-20 items-center justify-center border border-dashed border-ink/20 px-3 text-center text-xs text-muted"
            >
              <span className="sr-only">{t("logoPlaceholder", { name: logo.name })}</span>
              <span aria-hidden>{logo.name}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
