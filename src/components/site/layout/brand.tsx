import { Link } from "@/i18n/navigation";

/**
 * Wordmark placeholder. Replace with the real logo (SVG) once supplied; keep the accessible
 * name on the link.
 */
export function Brand({ name, label }: { name: string; label: string }) {
  return (
    <Link href="/" aria-label={label} className="group inline-flex flex-col leading-none">
      <span className="font-serif text-2xl font-semibold tracking-wide text-ink group-hover:text-navy-700 in-[.dark-surface]:text-ivory">
        {name}
      </span>
      <span aria-hidden className="mt-1 h-px w-8 bg-brass-500 transition-all group-hover:w-12" />
    </Link>
  );
}
