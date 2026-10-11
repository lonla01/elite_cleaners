import type { Metadata } from "next";
import messages from "../../messages/en.json";
import { fontVariables } from "./fonts";
import "@/styles/globals.css";

export const metadata: Metadata = { title: messages.NotFound.title };

// Paths outside any locale (e.g. /foo) that the proxy did not redirect.
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body className="flex min-h-dvh items-center justify-center p-6 antialiased">
        <main className="max-w-md space-y-4 text-center">
          <h1 className="text-h1">{messages.NotFound.title}</h1>
          <p>{messages.NotFound.body}</p>
          {/* A full page load is intended: this page sits outside every root layout. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="underline underline-offset-4" href="/">
            {messages.NotFound.backHome}
          </a>
        </main>
      </body>
    </html>
  );
}
