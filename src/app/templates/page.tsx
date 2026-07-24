import type { Metadata } from "next"

import { templates } from "@/lib/templates"
import { TemplatesGallery } from "./templates-gallery"

export const metadata: Metadata = { title: "Templates" }

export default function TemplatesIndex() {
  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete, frontend-only app-shell starters composed from WorkspaceUI blocks.
        </p>

        <TemplatesGallery templates={templates} />
      </div>
    </div>
  )
}
