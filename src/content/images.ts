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
} as const;

export type ImageKey = keyof typeof images;
export const imageKeys = Object.keys(images) as [ImageKey, ...ImageKey[]];
