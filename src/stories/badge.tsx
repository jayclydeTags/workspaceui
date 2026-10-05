"use client"

import { Badge } from "@/components/ui/badge"
import { defineStory } from "@/components/studio/studio"

type Variant =
  "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"

interface Args {
  label: string
  variant: Variant
}

function Preview({ label, variant }: Args) {
  return <Badge variant={variant}>{label}</Badge>
}

export default defineStory<Args>({
  args: { label: "Badge", variant: "default" },
  controls: {
    label: { type: "text" },
    variant: {
      type: "select",
      group: "style",
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
    },
  },
  preview: Preview,
})
