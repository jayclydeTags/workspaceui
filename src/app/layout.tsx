import type { ReactNode } from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { ThemeProvider } from "@/components/site/theme-provider"

import { SiteHeader } from "@/components/site/site-header"
import { getDocsNav } from "@/lib/docs-nav"
import { getBlocksNav } from "@/lib/block-taxonomy"

import "./globals.css"
import { Geist } from "next/font/google"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "WorkspaceUI",
  description:
    "Open-source workspace UI components built with React and Tailwind CSS.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn("font-sans", geist.variable)}
    >
      <body>
        {/* No-flash theme init: next/script's beforeInteractive strategy injects
            this into <head> ahead of hydration, so it runs before paint without
            React warning about a script rendered inside a component tree.
            Source lives in public/theme-init.js. */}
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <ThemeProvider>
          <SiteHeader docsNav={getDocsNav()} blocksNav={getBlocksNav()} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
