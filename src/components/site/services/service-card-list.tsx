import type { ServiceSummary } from "@/content/schemas";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { Heading, Text } from "../typography";

/** Cards linking to service pages. The whole card is one link. */
export function ServiceCardList({
  services,
  className,
}: {
  services: ServiceSummary[];
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {services.map((service) => (
        <li key={service.id}>
          <Link
            href={{ pathname: "/services/[slug]", params: { slug: service.slug } }}
            className="group flex h-full flex-col gap-4 border-t-2 border-brass-500 bg-white p-8 shadow-(--shadow-soft) transition-shadow hover:shadow-lg"
          >
            <Heading as="h3" className="text-2xl group-hover:text-navy-700">
              {service.title}
            </Heading>
            <Text className="flex-1">{service.summary}</Text>
            <span aria-hidden className="text-ink transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
