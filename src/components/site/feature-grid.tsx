import type { IconName } from "@/content/schemas";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";
import { Heading, Text } from "./typography";

type Feature = { icon: IconName; title: string; body: string };

export function FeatureGrid({ items, className }: { items: Feature[]; className?: string }) {
  return (
    <ul className={cn("grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((item) => (
        <li key={item.title} className="space-y-4">
          <Icon
            name={item.icon}
            className="size-8 text-brass-700 in-[.dark-surface]:text-brass-300"
          />
          <Heading as="h3" className="text-2xl">
            {item.title}
          </Heading>
          <Text>{item.body}</Text>
        </li>
      ))}
    </ul>
  );
}
