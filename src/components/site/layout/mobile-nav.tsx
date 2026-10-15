"use client";

import { useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "../button";
import { primaryLinks, type NavCategory } from "./nav-data";

export function MobileNav({
  categories,
  languageSwitcher,
}: {
  categories: NavCategory[];
  languageSwitcher?: ReactNode;
}) {
  const t = useTranslations("Nav");
  const tc = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="inline-flex size-11 items-center justify-center text-ink lg:hidden"
        aria-label={t("openMenu")}
      >
        <Menu aria-hidden className="size-6" strokeWidth={1.5} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto bg-ivory shadow-(--shadow-soft)"
        >
          <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
            <Dialog.Title className="font-heading text-2xl text-ink">{t("menuTitle")}</Dialog.Title>
            <Dialog.Close
              className="inline-flex size-11 items-center justify-center text-ink"
              aria-label={t("closeMenu")}
            >
              <X aria-hidden className="size-6" strokeWidth={1.5} />
            </Dialog.Close>
          </div>
          <nav aria-label={t("main")} className="flex-1 px-6 py-4">
            <ul className="divide-y divide-ink/10">
              <li>
                <details className="group py-2">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-heading text-xl text-ink [&::-webkit-details-marker]:hidden">
                    {t("services")}
                    <span
                      aria-hidden
                      className="text-brass-700 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="space-y-5 pt-2 pb-4">
                    {categories.map((category) => (
                      <div key={category.id}>
                        <p className="text-eyebrow tracking-[0.18em] text-brass-700 uppercase">
                          {category.navTitle}
                        </p>
                        <ul className="mt-1">
                          {category.services.map((service) => (
                            <li key={service.id}>
                              <Link
                                href={{
                                  pathname: "/services/[slug]",
                                  params: { slug: service.slug },
                                }}
                                onClick={close}
                                className="block py-2 text-body"
                              >
                                {service.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <Link
                      href="/services"
                      onClick={close}
                      className="block font-medium text-ink underline underline-offset-4"
                    >
                      {t("allServices")}
                    </Link>
                  </div>
                </details>
              </li>
              {primaryLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="flex min-h-14 items-center font-heading text-xl text-ink"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-4 border-t border-ink/10 p-6">
            {languageSwitcher}
            <Link
              href="/contact"
              onClick={close}
              className={buttonVariants({ size: "lg", className: "w-full" })}
            >
              {tc("requestQuote")}
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
