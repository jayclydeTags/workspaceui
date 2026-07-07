import type { ReactNode } from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"

import { SiteHeader } from "@/components/site-header"

import "./globals.css"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export const metadata: Metadata = {
  title: "WorkspaceUI",
  description:
    "Open-source workspace UI components built with React and Tailwind CSS.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={cn("font-sans", geist.variable)}>
      <body>
        {/* No-flash theme init: external (src) script so it runs before paint
            without tripping React 19's inline-"script tag while rendering" warning.
            Source lives in public/theme-init.js. */}
        <script src="/theme-init.js" />
        <ThemeProvider>
          <SiteHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
