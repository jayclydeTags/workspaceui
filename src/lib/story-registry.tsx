import { readdirSync } from "fs"
import { join } from "path"
import { createElement, type ComponentType, type ReactElement } from "react"
import dynamic from "next/dynamic"

import { Studio } from "@/components/studio/studio"
import type { StudioSlots } from "@/components/studio/types"

const STORIES_ROOT = "src/stories"

// One `dynamic()` per file in src/stories, built from the directory listing so
// a new story only needs to exist — no import to hand-add. Each story module
// default-exports defineStory(...), i.e. the studio bound to that story.
const storyNames = readdirSync(
  join(/*turbopackIgnore: true*/ process.cwd(), STORIES_ROOT)
)
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.replace(/\.tsx$/, ""))

const studios: Record<string, ComponentType<StudioSlots>> = Object.fromEntries(
  storyNames.map((name) => [
    name,
    dynamic(() =>
      import(`@/stories/${name}.tsx`).then(
        (mod) => mod.default as ComponentType<StudioSlots>
      )
    ),
  ])
)

export function hasStory(slug: string): boolean {
  return slug in studios
}

// A component with no story still gets the full layout: its examples on the
// canvas, and the docs, with an empty Props tab.
export function renderStudio(slug: string, slots: StudioSlots): ReactElement {
  return createElement(studios[slug] ?? Studio, slots)
}
