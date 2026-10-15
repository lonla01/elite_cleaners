"use client";

import { useId, type ReactNode } from "react";
import type { Locale } from "@/config/locales";
import { cn } from "@/lib/cn";

/** Horizontal or vertical three-band flag. */
function Tricolour({ colors, vertical }: { colors: [string, string, string]; vertical?: boolean }) {
  return (
    <svg viewBox="0 0 3 3" preserveAspectRatio="none">
      {colors.map((fill, i) =>
        vertical ? (
          <rect key={fill} x={i} width="1" height="3" fill={fill} />
        ) : (
          <rect key={fill} y={i} width="3" height="1" fill={fill} />
        ),
      )}
    </svg>
  );
}

/** Union Jack. Clip-path ids are per instance: the switcher renders in the header and menu. */
function UnionJack() {
  const id = useId();
  const [sea, cross] = [`${id}-s`, `${id}-t`];
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice">
      <clipPath id={sea}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={cross}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${sea})`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path
          d="M0,0 L60,30 M60,0 L0,30"
          clipPath={`url(#${cross})`}
          stroke="#C8102E"
          strokeWidth="4"
        />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

const flags: Record<Locale, () => ReactNode> = {
  en: () => <UnionJack />,
  fr: () => <Tricolour vertical colors={["#002654", "#ffffff", "#ce1126"]} />,
  de: () => <Tricolour colors={["#000000", "#dd0000", "#ffce00"]} />,
  lb: () => <Tricolour colors={["#ed2939", "#ffffff", "#00a1de"]} />,
};

/** Decorative flag for a locale. The surrounding link carries the language name. */
export function LocaleFlag({ locale, className }: { locale: Locale; className?: string }) {
  const Flag = flags[locale];
  return (
    <span
      aria-hidden
      className={cn(
        "block h-5 w-7 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgb(18_26_43/0.15)] [&>svg]:size-full",
        className,
      )}
    >
      <Flag />
    </span>
  );
}
