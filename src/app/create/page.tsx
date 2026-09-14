import { Suspense } from "react"
import type { Metadata } from "next"

import { ThemeCreator } from "@/components/create/theme-creator"

export const metadata: Metadata = {
  title: "Create",
  description:
    "Build a WorkspaceUI theme — colors, radius and fonts — and install it with the shadcn CLI.",
}

export default function CreatePage() {
  return (
    // ThemeCreator reads the theme from useSearchParams, which needs a
    // Suspense boundary under static export.
    <Suspense fallback={<div className="h-[calc(100svh-3.5rem)]" />}>
      <ThemeCreator />
    </Suspense>
  )
}
