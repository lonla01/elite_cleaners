import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/locales";
import type { Commune } from "@/content/schemas";
import {
  cantonIds,
  cantonPaths,
  mapSize,
  projectToMap,
  type CantonId,
} from "@/content/geo/cantons";
import { getPathname } from "@/i18n/navigation";

/** Nudges for canton labels that would sit under commune markers (in map pixels). */
const labelOffsets: Partial<Record<CantonId, [number, number]>> = {
  luxembourg: [18, 34],
  "esch-sur-alzette": [-24, 34],
};

/** Rough visual centre of a path, for its label: the mean of its points. */
function labelPosition(d: string): [number, number] {
  const numbers = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  let x = 0;
  let y = 0;
  for (let i = 0; i < numbers.length - 1; i += 2) {
    x += numbers[i]!;
    y += numbers[i + 1]!;
  }
  const n = numbers.length / 2 || 1;
  return [x / n, y / n];
}

/**
 * Inline SVG map of the cantons with links to the local pages. Every canton is served, so
 * all are filled; communes with a page get a marker link. Boundaries © OpenStreetMap
 * contributors (ODbL), credited in the caption.
 */
export async function CantonMap({
  locale,
  label,
  cantonNames,
  communes,
  highlight,
}: {
  locale: Locale;
  label: string;
  cantonNames: Record<CantonId, string>;
  communes: Commune[];
  /** Canton to emphasise (on a commune page). */
  highlight?: CantonId;
}) {
  const t = await getTranslations({ locale, namespace: "Areas" });
  const markers = communes.filter((c) => c.kind === "commune");

  return (
    <figure className="space-y-3">
      <svg
        viewBox={`-10 -10 ${mapSize.width + 20} ${mapSize.height + 20}`}
        className="h-auto w-full max-w-md"
        aria-label={label}
        role="group"
      >
        <g aria-hidden>
          {cantonIds.map((id) => (
            <path
              key={id}
              d={cantonPaths[id].d}
              className={
                highlight === id
                  ? "fill-brass-300 stroke-ivory"
                  : "fill-sand stroke-ivory in-[.dark-surface]:fill-navy-700 in-[.dark-surface]:stroke-navy-900"
              }
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          ))}
          {cantonIds.map((id) => {
            const [cx, cy] = labelPosition(cantonPaths[id].d);
            const [dx, dy] = labelOffsets[id] ?? [0, 0];
            const [x, y] = [cx + dx, cy + dy];
            return (
              <text
                key={id}
                x={x}
                y={y}
                textAnchor="middle"
                className="fill-muted text-[10px] tracking-wide uppercase in-[.dark-surface]:fill-mist"
              >
                {cantonNames[id]}
              </text>
            );
          })}
        </g>
        {markers.map((commune) => {
          const [x, y] = projectToMap(commune.coordinates.lat, commune.coordinates.lon);
          const href = getPathname({
            locale,
            href: { pathname: "/areas/[commune]", params: { commune: commune.slug } },
          });
          return (
            <a
              key={commune.id}
              href={href}
              aria-label={commune.name}
              className="group outline-none"
            >
              <circle
                cx={x}
                cy={y}
                r={12}
                className="fill-transparent group-focus-visible:stroke-ink"
                strokeWidth={2}
              />
              <circle
                cx={x}
                cy={y}
                r={5}
                className="fill-navy-900 stroke-ivory transition-[r] group-hover:fill-brass-700 in-[.dark-surface]:fill-brass-300"
                strokeWidth={2}
              />
              <text
                x={commune.mapLabel === "right" ? x + 9 : x - 9}
                y={commune.mapLabel === "below-left" ? y + 15 : y - 8}
                textAnchor={commune.mapLabel === "right" ? "start" : "end"}
                aria-hidden
                className="fill-ink text-[11px] font-medium in-[.dark-surface]:fill-ivory"
              >
                {commune.name}
              </text>
            </a>
          );
        })}
      </svg>
      <figcaption className="text-xs text-muted in-[.dark-surface]:text-mist">
        {t.rich("mapAttribution", {
          link: (chunks) => (
            <a
              href="https://www.openstreetmap.org/copyright"
              className="underline underline-offset-2"
              rel="noopener noreferrer"
              target="_blank"
            >
              {chunks}
            </a>
          ),
        })}
      </figcaption>
    </figure>
  );
}
