import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { fontVariables } from "../fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Back office",
  robots: { index: false, follow: false },
};

// Separate root layout: the admin is English-only and outside the locale routing.
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh bg-white antialiased">
        <NextIntlClientProvider locale="en">{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
