import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import { Link } from "@/i18n/navigation";
import type { Href } from "@/i18n/metadata";
import { Container } from "./container";

export type Crumb = { label: string; href?: Href };

/** Visible breadcrumb trail. The last item is the current page and is not a link. */
export async function Breadcrumbs({ items, locale }: { items: Crumb[]; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Common" });
  return (
    <Container className="pt-8">
      <nav aria-label={t("breadcrumbs")}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
          <li>
            <Link href="/" className="hover:text-ink">
              {t("home")}
            </Link>
          </li>
          {items.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              <span aria-hidden className="text-mist">
                /
              </span>
              {item.href ? (
                <Link href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </Container>
  );
}
