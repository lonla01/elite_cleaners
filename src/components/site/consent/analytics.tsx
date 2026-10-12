"use client";

import { useEffect } from "react";
import { CONSENT_CHANGE_EVENT, readConsent, type Consent } from "@/lib/consent";

type Props = { provider: "none" | "plausible"; domain?: string; src: string };

/**
 * Loads the analytics script only after the visitor has accepted it. Nothing is requested
 * from the analytics provider before consent. Withdrawing consent reloads the page, so the
 * script is no longer present.
 */
export function Analytics({ provider, domain, src }: Props) {
  useEffect(() => {
    if (provider !== "plausible" || !domain) return;
    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      const script = document.createElement("script");
      script.defer = true;
      script.src = src;
      script.dataset.domain = domain;
      document.head.appendChild(script);
    };
    if (readConsent()?.analytics) load();
    const onChange = (event: Event) => {
      const consent = (event as CustomEvent<Consent>).detail;
      if (consent.analytics) load();
      else if (loaded) window.location.reload();
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  }, [provider, domain, src]);

  return null;
}
