"use client"

import { Separator } from "@/components/ui/separator"
import { defineStory } from "@/components/studio/studio"

interface Args {
  orientation: "horizontal" | "vertical"
}

function Preview({ orientation }: Args) {
  if (orientation === "vertical") {
    return (
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Blog</span>
        <Separator orientation="vertical" />
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Source</span>
      </div>
    )
  }
  return (
    <div className="w-64 text-sm">
      <p className="font-medium">Radix Primitives</p>
      <p className="text-muted-foreground">
        An open-source UI component library.
      </p>
      <Separator className="my-4" />
      <p>Content below the separator.</p>
    </div>
  )
}

export default defineStory<Args>({
  args: { orientation: "horizontal" },
  controls: {
    orientation: {
      type: "select",
      group: "style",
      options: ["horizontal", "vertical"],
    },
  },
  preview: Preview,
})
