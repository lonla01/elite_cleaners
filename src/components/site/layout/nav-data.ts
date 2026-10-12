import type { Service, ServiceCategory } from "@/content/schemas";

/** Serializable navigation model passed from server to client components. */
export type NavCategory = Pick<ServiceCategory, "id" | "title" | "navTitle"> & {
  services: Pick<Service, "id" | "slug" | "title">[];
};

export const primaryLinks = [
  { key: "about", href: "/about" },
  { key: "howItWorks", href: "/how-it-works" },
  { key: "areas", href: "/areas" },
  { key: "contact", href: "/contact" },
] as const;
