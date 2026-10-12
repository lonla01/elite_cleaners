import { Check } from "lucide-react";
import { Heading } from "../typography";

type Group = { title: string; items: string[] };

/** "What's included" checklist, grouped. */
export function Checklist({ groups }: { groups: Group[] }) {
  return (
    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <section key={group.title} className="space-y-5">
          <Heading as="h3" className="border-b border-ink/15 pb-3 text-2xl">
            {group.title}
          </Heading>
          <ul className="space-y-3">
            {group.items.map((item) => (
              <li key={item} className="flex gap-3 text-body">
                <Check
                  aria-hidden
                  className="mt-1 size-4 shrink-0 text-brass-700"
                  strokeWidth={2}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
