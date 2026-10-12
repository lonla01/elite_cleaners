/**
 * Visitor consent for optional technologies. Stored in localStorage (not a cookie), so that
 * pages stay static and nothing is sent to the server. Strictly necessary, so it needs no
 * consent itself. Client-side only.
 */
export type Consent = { version: 1; analytics: boolean; decidedAt: string };

export const CONSENT_STORAGE_KEY = "cookie-consent";
export const CONSENT_CHANGE_EVENT = "consent-change";
export const OPEN_CONSENT_SETTINGS_EVENT = "open-consent-settings";
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<Consent>;
    if (value.version !== 1 || typeof value.analytics !== "boolean" || !value.decidedAt) {
      return null;
    }
    // Ask again after 12 months.
    if (Date.now() - Date.parse(value.decidedAt) > MAX_AGE_MS) return null;
    return value as Consent;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean) {
  const consent: Consent = { version: 1, analytics, decidedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // Storage blocked: the choice applies to this page view only.
  }
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_CHANGE_EVENT, { detail: consent }));
}
