/**
 * Image registry. Files live in /public/images. Alt text is translatable, so it lives in the
 * content files rather than here. Every entry is a PLACEHOLDER listed in PLACEHOLDERS.md;
 * replace the file (same name and aspect ratio) or update the entry.
 */
export const images = {
  "hero-residential": { src: "/images/hero-residential.webp", width: 2400, height: 1400 },
  "hero-corporate": { src: "/images/hero-corporate.webp", width: 2400, height: 1400 },
  "hero-housekeeping": { src: "/images/hero-housekeeping.webp", width: 2400, height: 1400 },
  "hero-post-renovation": { src: "/images/hero-post-renovation.webp", width: 2400, height: 1400 },
  "category-residential": { src: "/images/category-residential.webp", width: 1200, height: 900 },
  "category-housekeeping": { src: "/images/category-housekeeping.webp", width: 1200, height: 900 },
  "category-corporate": { src: "/images/category-corporate.webp", width: 1200, height: 900 },
  "about-hero": { src: "/images/about-hero.webp", width: 2400, height: 1200 },
  "about-standards": { src: "/images/about-standards.webp", width: 1200, height: 1500 },
  "how-it-works-hero": { src: "/images/how-it-works-hero.webp", width: 2400, height: 1200 },
  "service-regular-home-cleaning": {
    src: "/images/service-regular-home-cleaning.webp",
    width: 2400,
    height: 1200,
  },
  "service-deep-cleaning": { src: "/images/service-deep-cleaning.webp", width: 2400, height: 1200 },
  "service-end-of-tenancy-cleaning": {
    src: "/images/service-end-of-tenancy-cleaning.webp",
    width: 2400,
    height: 1200,
  },
  "service-post-renovation-cleaning": {
    src: "/images/service-post-renovation-cleaning.webp",
    width: 2400,
    height: 1200,
  },
  "service-window-cleaning": {
    src: "/images/service-window-cleaning.webp",
    width: 2400,
    height: 1200,
  },
  "service-carpet-upholstery-care": {
    src: "/images/service-carpet-upholstery-care.webp",
    width: 2400,
    height: 1200,
  },
  "service-private-housekeeping": {
    src: "/images/service-private-housekeeping.webp",
    width: 2400,
    height: 1200,
  },
  "service-serviced-apartment-turnover": {
    src: "/images/service-serviced-apartment-turnover.webp",
    width: 2400,
    height: 1200,
  },
  "service-office-cleaning": {
    src: "/images/service-office-cleaning.webp",
    width: 2400,
    height: 1200,
  },
  "service-financial-institutions": {
    src: "/images/service-financial-institutions.webp",
    width: 2400,
    height: 1200,
  },
  "service-transport-public-facilities": {
    src: "/images/service-transport-public-facilities.webp",
    width: 2400,
    height: 1200,
  },
  "service-medical-practices": {
    src: "/images/service-medical-practices.webp",
    width: 2400,
    height: 1200,
  },
  "service-luxury-retail-hospitality": {
    src: "/images/service-luxury-retail-hospitality.webp",
    width: 2400,
    height: 1200,
  },
  "service-commercial-post-construction": {
    src: "/images/service-commercial-post-construction.webp",
    width: 2400,
    height: 1200,
  },
  "service-disinfection-sanitisation": {
    src: "/images/service-disinfection-sanitisation.webp",
    width: 2400,
    height: 1200,
  },
  "services-hero": { src: "/images/services-hero.webp", width: 2400, height: 1200 },
  "areas-hero": { src: "/images/areas-hero.webp", width: 2400, height: 1200 },
  "careers-hero": { src: "/images/careers-hero.webp", width: 2400, height: 1200 },
  "testimonials-hero": { src: "/images/testimonials-hero.webp", width: 2400, height: 1200 },
} as const;

export type ImageKey = keyof typeof images;
export const imageKeys = Object.keys(images) as [ImageKey, ...ImageKey[]];
