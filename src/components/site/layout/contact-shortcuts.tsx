"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { buttonVariants } from "../button";

type Props = { tel: string; whatsapp: string; phoneDisplay: string };

/**
 * Sticky contact actions on every page: a bottom bar on mobile and a floating cluster on larger
 * screens. The quote button is hidden on the contact page itself.
 */
export function ContactShortcuts({ tel, whatsapp, phoneDisplay }: Props) {
  const t = useTranslations("Common");
  const onContact = usePathname() === "/contact";

  const iconButton =
    "inline-flex size-12 items-center justify-center rounded-full bg-white text-ink shadow-(--shadow-soft) ring-1 ring-ink/10 transition-colors hover:bg-stone";

  return (
    <>
      {/* Mobile: bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-[auto_auto_1fr] gap-2 border-t border-ink/10 bg-ivory/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
        <a href={tel} className={iconButton} aria-label={t("callUsAt", { phone: phoneDisplay })}>
          <Phone aria-hidden className="size-5" strokeWidth={1.5} />
        </a>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={iconButton}
          aria-label={t("whatsappLabel")}
        >
          <MessageCircle aria-hidden className="size-5" strokeWidth={1.5} />
        </a>
        {!onContact && (
          <Link href="/contact" className={buttonVariants({ variant: "primary" })}>
            {t("requestQuote")}
          </Link>
        )}
      </div>

      {/* Tablet and desktop: floating cluster */}
      <div className="fixed right-6 bottom-6 z-30 hidden items-center gap-3 sm:flex">
        <a href={tel} className={iconButton} aria-label={t("callUsAt", { phone: phoneDisplay })}>
          <Phone aria-hidden className="size-5" strokeWidth={1.5} />
        </a>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={iconButton}
          aria-label={t("whatsappLabel")}
        >
          <MessageCircle aria-hidden className="size-5" strokeWidth={1.5} />
        </a>
        {!onContact && (
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "accent" }), "shadow-(--shadow-soft)")}
          >
            {t("requestQuote")}
          </Link>
        )}
      </div>
    </>
  );
}
