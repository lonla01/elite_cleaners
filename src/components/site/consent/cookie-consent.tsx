"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { OPEN_CONSENT_SETTINGS_EVENT, readConsent, saveConsent } from "@/lib/consent";
import { Button } from "../button";

/**
 * Consent banner. Shown until the visitor decides; reopened from the footer. Accept and
 * decline are equally prominent. Not modal: the page stays usable while it is shown.
 */
export function CookieConsent() {
  const t = useTranslations("Consent");
  const [open, setOpen] = useState(false);
  const [reopened, setReopened] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // localStorage is only readable after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!readConsent()) setOpen(true);
    const onOpen = () => {
      setReopened(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_SETTINGS_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (open && reopened) headingRef.current?.focus();
  }, [open, reopened]);

  if (!open) return null;

  const decide = (analytics: boolean) => {
    saveConsent(analytics);
    setOpen(false);
  };
  const current = readConsent();

  return (
    <section
      aria-labelledby="consent-title"
      className="fixed inset-x-3 bottom-22 z-50 space-y-4 border border-ink/10 bg-white p-6 shadow-lg sm:right-auto sm:bottom-6 sm:left-6 sm:max-w-md"
    >
      <h2
        id="consent-title"
        ref={headingRef}
        tabIndex={-1}
        className="font-serif text-2xl text-ink outline-none"
      >
        {t("title")}
      </h2>
      <p className="text-sm text-body">
        {t.rich("body", {
          link: (chunks) => (
            <Link href="/cookies" className="underline underline-offset-2">
              {chunks}
            </Link>
          ),
        })}
      </p>
      {current && (
        <p className="text-sm text-muted">
          {current.analytics ? t("currentAccepted") : t("currentDeclined")}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="primary" onClick={() => decide(true)}>
          {t("accept")}
        </Button>
        <Button variant="primary" onClick={() => decide(false)}>
          {t("decline")}
        </Button>
      </div>
    </section>
  );
}

/** Footer link that reopens the banner. */
export function ConsentSettingsButton({ className }: { className?: string }) {
  const t = useTranslations("Consent");
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_SETTINGS_EVENT))}
    >
      {t("settings")}
    </button>
  );
}
