import {
  DM_Sans,
  Figtree,
  Geist,
  Inter,
  Lora,
  Manrope,
  Outfit,
  Playfair_Display,
} from "next/font/google"

// next/font requires each loader call assigned to its own module-scope const,
// with literal options — variable names must match fontVariable() in
// lib/create-theme.ts.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" })
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" })
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" })
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" })
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
})

/** Space-separated classes that define every creator font variable. */
export const createFontVariables = [
  geist,
  inter,
  figtree,
  manrope,
  dmSans,
  outfit,
  lora,
  playfairDisplay,
]
  .map((f) => f.variable)
  .join(" ")
