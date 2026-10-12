import type { HomePage } from "@/content/schemas";
import { Container } from "../container";
import { Icon } from "../icon";

export function TrustBar({ items }: { items: HomePage["trust"] }) {
  return (
    <section className="border-b border-ink/10 bg-white">
      <Container>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <li key={item.value} className="flex items-start gap-3">
              <Icon name={item.icon} className="mt-0.5 size-6 shrink-0 text-brass-700" />
              <p className="text-sm leading-snug">
                <span className="block font-medium text-ink">{item.value}</span>
                <span className="text-muted">{item.label}</span>
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
