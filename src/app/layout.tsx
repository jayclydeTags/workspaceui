import type { ReactNode } from "react"
import type { Metadata } from "next"
import { RootProvider } from "fumadocs-ui/provider/next"

import "./globals.css"

// next-themes (inside RootProvider) injects its own no-flash theme script, so
// the hand-rolled inline <script> from the old root.tsx is gone.
export const metadata: Metadata = {
  title: "WorkspaceUI",
  description:
    "Open-source workspace UI components built with React and Tailwind CSS.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider search={{ options: { type: "static" } }}>
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
