import { env } from "@/env";

export const siteConfig = {
  /** Absolute base URL, used for canonical URLs, hreflang, sitemaps and OG images. */
  url: env.NEXT_PUBLIC_SITE_URL,
} as const;
