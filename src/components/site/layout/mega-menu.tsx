"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { buttonVariants } from "../button";
import { primaryLinks, type NavCategory } from "./nav-data";

const linkClass =
  "inline-flex min-h-11 items-center gap-1 px-3 text-sm tracking-[0.04em] text-ink transition-colors hover:text-brass-700 data-[active]:text-brass-700 aria-[current=page]:text-brass-700";

export function MegaMenu({ categories }: { categories: NavCategory[] }) {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  return (
    <NavigationMenu.Root aria-label={t("main")} className="relative hidden lg:block">
      <NavigationMenu.List className="flex items-center">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger
            className={cn(linkClass, "group", pathname.startsWith("/services") && "text-brass-700")}
          >
            {t("services")}
            <ChevronDown
              aria-hidden
              className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute top-0 left-0 w-full data-[motion]:animate-fade-up">
            <div className="grid grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,0.9fr)] gap-10 p-10">
              {categories.map((category) => (
                <div key={category.id} className="space-y-4">
                  <NavigationMenu.Link asChild>
                    <Link
                      href={{ pathname: "/services", hash: category.id }}
                      className="font-serif text-xl text-ink hover:text-brass-700"
                    >
                      {category.navTitle}
                    </Link>
                  </NavigationMenu.Link>
                  <ul className="space-y-1">
                    {category.services.map((service) => (
                      <li key={service.id}>
                        <NavigationMenu.Link asChild>
                          <Link
                            href={{ pathname: "/services/[slug]", params: { slug: service.slug } }}
                            className="block py-1.5 text-sm text-body hover:text-brass-700"
                          >
                            {service.title}
                          </Link>
                        </NavigationMenu.Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="space-y-4 bg-stone p-6">
                <p className="font-serif text-xl text-ink">{t("megaPromoTitle")}</p>
                <p className="text-sm text-body">{t("megaPromoBody")}</p>
                <NavigationMenu.Link asChild>
                  <Link
                    href="/services"
                    className="block text-sm font-medium text-ink underline underline-offset-4"
                  >
                    {t("allServices")}
                  </Link>
                </NavigationMenu.Link>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {primaryLinks.map((item) => (
          <NavigationMenu.Item key={item.key}>
            <NavigationMenu.Link asChild active={pathname === item.href}>
              <Link
                href={item.href}
                className={linkClass}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {t(item.key)}
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>

      {/* Full-width dropdown panel, positioned under the header. */}
      <div className="fixed inset-x-0 top-(--header-height) flex justify-center px-(--spacing-gutter)">
        <NavigationMenu.Viewport className="relative h-(--radix-navigation-menu-viewport-height) w-full max-w-(--container-site) overflow-hidden border border-ink/10 bg-ivory shadow-(--shadow-soft) transition-[height] duration-300" />
      </div>
    </NavigationMenu.Root>
  );
}

export function HeaderQuoteButton({ label }: { label: string }) {
  return (
    <Link
      href="/contact"
      className={cn(buttonVariants({ variant: "primary", size: "sm" }), "hidden sm:inline-flex")}
    >
      {label}
    </Link>
  );
}
