import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import { cn } from "@/lib/cn";
import { Heading, Text } from "./typography";

type Step = { title: string; body: string; points?: string[] };

/** Numbered process steps. `detailed` shows the bullet points (How it works page). */
export async function StepsList({
  steps,
  locale,
  detailed = false,
}: {
  steps: Step[];
  locale: Locale;
  detailed?: boolean;
}) {
  const t = await getTranslations({ locale, namespace: "Home" });
  return (
    <ol
      className={cn("grid gap-10", detailed ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4")}
    >
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="space-y-4 border-t border-ink/15 pt-6 in-[.dark-surface]:border-ivory/20"
        >
          <p className="font-serif text-4xl text-brass-700 in-[.dark-surface]:text-brass-300">
            <span className="sr-only">{t("processStep", { number: i + 1 })}</span>
            <span aria-hidden>{String(i + 1).padStart(2, "0")}</span>
          </p>
          <Heading as="h3" className="text-2xl">
            {step.title}
          </Heading>
          <Text>{step.body}</Text>
          {detailed && step.points && step.points.length > 0 && (
            <ul className="space-y-2 pt-2">
              {step.points.map((point) => (
                <li key={point} className="flex gap-3 text-body">
                  <span aria-hidden className="mt-3 h-px w-4 shrink-0 bg-brass-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}
