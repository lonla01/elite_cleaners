import { Link } from "@/i18n/navigation";

/**
 * Monogram logo: the company initials in a framed square. Replace with the real logo (SVG)
 * once supplied; keep the accessible name on the link, since the initials alone do not say
 * which company this is.
 */
export function Brand({ monogram, label }: { monogram: string; label: string }) {
  const [first, ...rest] = monogram;
  return (
    <Link href="/" aria-label={label} className="group inline-flex">
      <span
        aria-hidden
        className="relative inline-flex size-12 items-center justify-center bg-navy-900 font-heading text-xl leading-none font-bold tracking-[0.04em] transition-colors group-hover:bg-navy-700 in-[.dark-surface]:bg-transparent in-[.dark-surface]:ring-1 in-[.dark-surface]:ring-brass-500"
      >
        <span className="text-ivory">{first}</span>
        <span className="text-brass-300">{rest.join("")}</span>
        <span className="absolute inset-1 border border-brass-500/60 in-[.dark-surface]:hidden" />
      </span>
    </Link>
  );
}
