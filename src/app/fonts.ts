import { Heebo, IBM_Plex_Sans } from "next/font/google";

/** Headings, navigation, buttons and lead text. */
export const heading = Heebo({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-heebo",
});

/** Body text. */
export const sans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-plex",
});

export const fontVariables = `${heading.variable} ${sans.variable}`;
