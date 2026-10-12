import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import type { ServiceCategory } from "@/content/schemas";
import { Link } from "@/i18n/navigation";
import { ContentImage } from "../content-image";
import { Heading, Text } from "../typography";

export async function CategoryCards({
  categories,
  locale,
}: {
  categories: ServiceCategory[];
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "Common" });
  return (
    <ul className="grid gap-8 md:grid-cols-3">
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={{ pathname: "/services", hash: category.id }}
            className="group block h-full bg-white shadow-(--shadow-soft) transition-shadow hover:shadow-lg"
          >
            <div className="overflow-hidden">
              <ContentImage
                image={category.image}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[4/3] transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.03]"
              />
            </div>
            <div className="space-y-3 p-8">
              <Heading as="h3" className="text-2xl group-hover:text-navy-700">
                {category.title}
              </Heading>
              <Text>{category.description}</Text>
              <span
                aria-hidden
                className="inline-flex items-center gap-2 pt-2 text-sm font-medium text-ink"
              >
                {t("learnMore")}{" "}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
