/**
 * Image registry. Files live in /public/images. Alt text is translatable, so it lives in the
 * content files rather than here. Every entry is a PLACEHOLDER listed in PLACEHOLDERS.md
 * (licensed stock photos for now); replace the file (same name and aspect ratio) or update the
 * entry.
 *
 * Full-bleed heroes are 2560×1600 and are cropped with `object-cover`, so keep the subject
 * near the centre and leave calm space on the left, where the text sits.
 */

/**
 * Appended to every image URL. Optimised images are cached by URL (browsers and CDNs keep them
 * for hours), so bump this whenever files in /public/images are replaced under the same name.
 * `next.config.ts` allows exactly this query string through `images.localPatterns`.
 */
export const imageVersion = "?v=2";

const img = (file: string, width: number, height: number) => ({
  src: `/images/${file}.webp${imageVersion}`,
  width,
  height,
});
const hero = (file: string) => img(file, 2560, 1600);

export const images = {
  "hero-residential": hero("hero-residential"),
  "hero-corporate": hero("hero-corporate"),
  "hero-housekeeping": hero("hero-housekeeping"),
  "hero-post-renovation": hero("hero-post-renovation"),
  "category-residential": img("category-residential", 1200, 900),
  "category-housekeeping": img("category-housekeeping", 1200, 900),
  "category-corporate": img("category-corporate", 1200, 900),
  "about-hero": hero("about-hero"),
  "about-standards": img("about-standards", 1200, 1500),
  "how-it-works-hero": hero("how-it-works-hero"),
  "service-regular-home-cleaning": hero("service-regular-home-cleaning"),
  "service-deep-cleaning": hero("service-deep-cleaning"),
  "service-end-of-tenancy-cleaning": hero("service-end-of-tenancy-cleaning"),
  "service-post-renovation-cleaning": hero("service-post-renovation-cleaning"),
  "service-window-cleaning": hero("service-window-cleaning"),
  "service-carpet-upholstery-care": hero("service-carpet-upholstery-care"),
  "service-serviced-apartment-turnover": hero("service-serviced-apartment-turnover"),
  "service-office-cleaning": hero("service-office-cleaning"),
  "service-financial-institutions": hero("service-financial-institutions"),
  "service-transport-public-facilities": hero("service-transport-public-facilities"),
  "service-medical-practices": hero("service-medical-practices"),
  "service-luxury-retail-hospitality": hero("service-luxury-retail-hospitality"),
  "service-commercial-post-construction": hero("service-commercial-post-construction"),
  "service-disinfection-sanitisation": hero("service-disinfection-sanitisation"),
  "services-hero": hero("services-hero"),
  "areas-hero": hero("areas-hero"),
  "commune-hero": hero("commune-hero"),
  "careers-hero": hero("careers-hero"),
  "testimonials-hero": hero("testimonials-hero"),
  "contact-hero": hero("contact-hero"),
  "legal-hero": hero("legal-hero"),
} as const;

export type ImageKey = keyof typeof images;
export const imageKeys = Object.keys(images) as [ImageKey, ...ImageKey[]];
