import { Cormorant_Garamond, Inter } from "next/font/google";

export const serif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

export const sans = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const fontVariables = `${serif.variable} ${sans.variable}`;
