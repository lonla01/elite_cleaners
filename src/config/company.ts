/**
 * Default company identity. These are PLACEHOLDERS (see PLACEHOLDERS.md).
 *
 * Single place to edit: from milestone 6 onwards, these values seed the `settings` table,
 * and staff edit them in /admin/settings. The public site, emails and documents then read
 * the DB values through `getCompanySettings()`. This file remains the fallback used before
 * the database is seeded (for example at build time or in tests).
 */
export const companyDefaults = {
  name: "[COMPANY NAME]",
  legalName: "[COMPANY LEGAL NAME] S.à r.l.",
  tagline: "[TAGLINE]",
  address: {
    street: "[STREET AND NUMBER]",
    postcode: "L-0000",
    city: "[CITY]",
    country: "LU",
  },
  phone: "+352 00 00 00 00",
  whatsapp: "+352 000 000 000",
  email: "[contact@example.lu]",
  /** Receives notifications for new leads and job applications. */
  notificationEmail: "[leads@example.lu]",
  rcsNumber: "B000000",
  businessPermitNumber: "[00000000/0]",
  vatNumber: "LU00000000",
  iban: "LU00 0000 0000 0000 0000",
  bic: "[BICXXXXX]",
  foundedYear: 2000,
  social: {
    linkedin: "",
    instagram: "",
  },
  openingHours: "Mo-Fr 08:00-18:00",
} as const;

export type CompanyDetails = typeof companyDefaults;
