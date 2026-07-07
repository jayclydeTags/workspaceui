import type { ReactNode } from "react"
import type { Metadata } from "next"
import { ThemeProvider, themeScript } from "@/components/theme-provider"

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
        {/* Server-rendered no-flash theme init; sets the class before hydration. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>
          <SiteHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
