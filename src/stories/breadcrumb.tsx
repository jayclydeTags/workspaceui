"use client"

import { Fragment } from "react"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { defineStory } from "@/components/studio/studio"

interface Args {
  depth: number
  collapsed: boolean
}

const TRAIL = ["Home", "Components", "Data", "Table", "Row"]

function Preview({ depth, collapsed }: Args) {
  const trail = TRAIL.slice(0, Math.min(Math.max(depth, 2), TRAIL.length))
  const current = trail[trail.length - 1]
  const links = trail.slice(0, -1)
  // Collapsed: keep the first link, an ellipsis, and the last link.
  const shown =
    collapsed && links.length > 2 ? [links[0], null, links.at(-1)] : links

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {shown.map((label, i) => (
          <Fragment key={label ?? "ellipsis"}>
            <BreadcrumbItem>
              {label === null ? (
                <BreadcrumbEllipsis />
              ) : (
                <BreadcrumbLink href={`#${i}`}>{label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default defineStory<Args>({
  args: { depth: 4, collapsed: false },
  controls: {
    depth: {
      type: "number",
      min: 2,
      max: TRAIL.length,
      description: "Items in the trail.",
    },
    collapsed: {
      type: "boolean",
      group: "style",
      description: "Collapse the middle of a long trail into an ellipsis.",
    },
  },
  preview: Preview,
})
