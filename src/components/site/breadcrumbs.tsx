import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import { Link } from "@/i18n/navigation";
import type { Href } from "@/i18n/metadata";

export type Crumb = { label: string; href?: Href };

/**
 * Visible breadcrumb trail. The last item is the current page and is not a link. It is placed
 * inside a `PageHero`, so it adapts to the dark image surface.
 */
export async function Breadcrumbs({ items, locale }: { items: Crumb[]; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Common" });
  const link = "hover:text-ink in-[.dark-surface]:hover:text-ivory";
  return (
    <nav aria-label={t("breadcrumbs")}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted in-[.dark-surface]:text-ivory/80">
        <li>
          <Link href="/" className={link}>
            {t("home")}
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden className="text-mist in-[.dark-surface]:text-ivory/50">
              /
            </span>
            {item.href ? (
              <Link href={item.href} className={link}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink in-[.dark-surface]:text-ivory">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
