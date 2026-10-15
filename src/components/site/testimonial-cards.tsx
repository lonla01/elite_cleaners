import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import type { Testimonial } from "@/content/schemas";

export async function TestimonialCards({
  items,
  locale,
}: {
  items: Testimonial[];
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "Common" });
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex flex-col justify-between gap-8 bg-white p-8 shadow-(--shadow-soft)"
        >
          <figure className="space-y-6">
            {item.placeholder && (
              <span className="inline-block border border-brass-700/40 px-2 py-0.5 text-eyebrow tracking-[0.14em] text-brass-700 uppercase">
                {t("placeholder")}
              </span>
            )}
            <blockquote className="font-heading text-xl leading-snug text-ink">
              <p>“{item.quote}”</p>
            </blockquote>
            <figcaption className="text-sm">
              <span className="block font-medium text-ink">{item.author}</span>
              <span className="text-muted">{item.context}</span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
