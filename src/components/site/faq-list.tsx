import { Heading } from "./typography";

type Item = { question: string; answer: string };

/**
 * Accessible FAQ using native disclosure widgets (keyboard and screen-reader friendly, no JS).
 * FAQPage structured data is added with the service template in milestone 3.
 */
export function FaqList({ items }: { items: Item[] }) {
  return (
    <div className="divide-y divide-ink/15 border-y border-ink/15">
      {items.map((item) => (
        <details key={item.question} className="group py-6">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
            <Heading as="h3" className="text-xl sm:text-2xl">
              {item.question}
            </Heading>
            <span
              aria-hidden
              className="mt-2 text-xl leading-none text-brass-700 transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-4 max-w-(--container-prose) text-body">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
