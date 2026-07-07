import type { ReactNode } from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"

import { SiteHeader } from "@/components/site-header"

import "./globals.css"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// next-themes injects its own no-flash theme script, so the hand-rolled
// inline <script> from the old root.tsx is gone.
export const metadata: Metadata = {
  title: "WorkspaceUI",
  description:
    "Open-source workspace UI components built with React and Tailwind CSS.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={cn("font-sans", geist.variable)}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
