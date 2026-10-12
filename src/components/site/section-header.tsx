import { cn } from "@/lib/cn";
import { Eyebrow, Heading, Lead, Rule } from "./typography";

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  as?: "h1" | "h2";
  align?: "start" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  intro,
  as = "h2",
  align = "start",
  className,
}: Props) {
  return (
    <header
      className={cn(
        "max-w-(--container-prose) space-y-5",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading as={as}>{title}</Heading>
      <Rule className={cn(align === "center" && "mx-auto")} />
      {intro && <Lead>{intro}</Lead>}
    </header>
  );
}
