"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { defineStory } from "@/components/studio/studio"

interface Args {
  shape: "profile" | "lines" | "card"
}

function Preview({ shape }: Args) {
  if (shape === "lines") {
    return (
      <div className="flex w-64 flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    )
  }
  if (shape === "card") {
    return (
      <div className="flex w-64 flex-col gap-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    )
  }
  return (
    <div className="flex items-center gap-4">
      <div className="size-12 overflow-hidden rounded-full">
        <Skeleton className="size-full" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  )
}

export default defineStory<Args>({
  args: { shape: "profile" },
  controls: {
    shape: {
      type: "select",
      group: "style",
      options: ["profile", "lines", "card"],
    },
  },
  preview: Preview,
})
