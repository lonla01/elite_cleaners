import { z } from "zod";
import { pathnames } from "@/i18n/pathnames";
import { imageKeys } from "./images";

/** Internal route keys (see src/i18n/pathnames.ts). Links in content refer to routes, never raw URLs. */
const routeKeys = Object.keys(pathnames) as [keyof typeof pathnames, ...(keyof typeof pathnames)[]];

export const linkSchema = z.object({
  label: z.string().min(1),
  href: z.enum(routeKeys),
  params: z.record(z.string(), z.string()).optional(),
  query: z.record(z.string(), z.string()).optional(),
});
export type ContentLinkData = z.infer<typeof linkSchema>;

export const imageRefSchema = z.object({
  key: z.enum(imageKeys),
  /** Describes the intended photograph. Required for accessibility. Empty string = decorative. */
  alt: z.string(),
});
export type ImageRef = z.infer<typeof imageRefSchema>;

/** Icons are named, so content stays serialisable; the mapping lives in components/site/icon.tsx. */
export const iconNames = [
  "shield",
  "user-check",
  "award",
  "leaf",
  "lock",
  "calendar",
  "key",
  "sparkles",
  "users",
  "heart-handshake",
  "building",
  "home",
  "clipboard",
  "message",
  "check",
  "star",
  "briefcase",
  "stethoscope",
  "store",
  "train",
  "hammer",
  "map-pin",
  "clock",
] as const;
export const iconSchema = z.enum(iconNames);
export type IconName = z.infer<typeof iconSchema>;

const metaSchema = z.object({ title: z.string(), description: z.string() });

const featureSchema = z.object({ icon: iconSchema, title: z.string(), body: z.string() });

const stepSchema = z.object({
  title: z.string(),
  body: z.string(),
  points: z.array(z.string()).default([]),
});

const ctaSchema = z.object({
  title: z.string(),
  body: z.string(),
  primary: linkSchema,
  secondary: linkSchema.optional(),
});

const sectionIntroSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  intro: z.string().optional(),
});

// ---------------------------------------------------------------------------------------------

export const serviceCategoryIds = ["residential", "housekeeping", "corporate"] as const;
export type ServiceCategoryId = (typeof serviceCategoryIds)[number];

export const serviceCategorySchema = z.object({
  id: z.enum(serviceCategoryIds),
  title: z.string(),
  /** Shorter label for menus. */
  navTitle: z.string(),
  description: z.string(),
  image: imageRefSchema,
});
export type ServiceCategory = z.infer<typeof serviceCategorySchema>;

const faqItemSchema = z.object({ question: z.string(), answer: z.string() });

/** URL slugs: lowercase ASCII, digits and hyphens. Localised per content file. */
const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

/**
 * A service and everything its page needs. All service pages share one template
 * (app/[locale]/services/[slug]); section headings come from the `ServicePage` messages.
 */
export const serviceSchema = z.object({
  id: z.string(),
  slug: slugSchema,
  category: z.enum(serviceCategoryIds),
  order: z.number().int(),
  title: z.string(),
  /** One sentence, used on cards, menus and as the default meta description. */
  summary: z.string(),
  meta: metaSchema,
  hero: z.object({ intro: z.string(), image: imageRefSchema }),
  included: z.object({
    intro: z.string().optional(),
    groups: z.array(z.object({ title: z.string(), items: z.array(z.string()).min(1) })).min(1),
  }),
  frequencies: z.object({
    intro: z.string().optional(),
    options: z.array(z.object({ title: z.string(), body: z.string() })).min(1),
  }),
  audience: z.array(featureSchema).min(1),
  faq: z.array(faqItemSchema).min(1),
  /** Service ids, shown as "Related services". */
  related: z.array(z.string()).max(3),
});
export type Service = z.infer<typeof serviceSchema>;
export type ServiceSummary = Pick<
  Service,
  "id" | "slug" | "category" | "order" | "title" | "summary"
>;

export const servicesPageSchema = z.object({
  meta: metaSchema,
  hero: sectionIntroSchema.extend({ image: imageRefSchema }),
  cta: ctaSchema,
});
export type ServicesPage = z.infer<typeof servicesPageSchema>;

export const testimonialSchema = z.object({
  id: z.string(),
  quote: z.string(),
  author: z.string(),
  context: z.string(),
  /** Placeholders are visibly marked on the site until replaced with genuine, consented quotes. */
  placeholder: z.boolean(),
});
export type Testimonial = z.infer<typeof testimonialSchema>;

export const homePageSchema = z.object({
  meta: metaSchema,
  hero: z.object({
    slides: z
      .array(
        z.object({
          id: z.string(),
          eyebrow: z.string(),
          title: z.string(),
          body: z.string(),
          cta: linkSchema,
          image: imageRefSchema,
        }),
      )
      .min(1),
  }),
  trust: z.array(z.object({ icon: iconSchema, value: z.string(), label: z.string() })),
  trustedBy: z.object({
    title: z.string(),
    // Real client logos may only be displayed with each client's WRITTEN permission.
    // Until then, these entries render as neutral placeholder slots.
    logos: z.array(z.object({ name: z.string(), placeholder: z.boolean() })),
  }),
  categories: sectionIntroSchema,
  commitment: sectionIntroSchema.extend({ items: z.array(featureSchema) }),
  process: sectionIntroSchema.extend({ steps: z.array(stepSchema), link: linkSchema }),
  testimonials: sectionIntroSchema.extend({ link: linkSchema }),
  cta: ctaSchema,
});
export type HomePage = z.infer<typeof homePageSchema>;

export const aboutPageSchema = z.object({
  meta: metaSchema,
  hero: sectionIntroSchema.extend({ image: imageRefSchema }),
  story: z.object({ title: z.string(), paragraphs: z.array(z.string()) }),
  values: sectionIntroSchema.extend({ items: z.array(featureSchema) }),
  standards: sectionIntroSchema.extend({
    items: z.array(z.object({ title: z.string(), body: z.string() })),
    image: imageRefSchema,
  }),
  cta: ctaSchema,
});
export type AboutPage = z.infer<typeof aboutPageSchema>;

export const howItWorksPageSchema = z.object({
  meta: metaSchema,
  hero: sectionIntroSchema.extend({ image: imageRefSchema }),
  steps: sectionIntroSchema.extend({ items: z.array(stepSchema) }),
  promises: sectionIntroSchema.extend({ items: z.array(featureSchema) }),
  faq: sectionIntroSchema.extend({ items: z.array(faqItemSchema) }),
  cta: ctaSchema,
});
export type HowItWorksPage = z.infer<typeof howItWorksPageSchema>;
