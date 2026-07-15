import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Payroll",
  description: "Frontend-only payroll app shell built with WorkspaceUI.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full font-sans", geist.variable, geistMono.variable)}
    >
      <body className="h-full">
        {/* No-flash theme init — runs before paint (see public/theme-init.js). */}
        <script src="/theme-init.js" />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
