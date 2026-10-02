"use client"

import { useState } from "react"

import type { NavSection } from "@/lib/nav"
import { SidebarNav } from "@/components/site/sidebar-nav"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ALL = "All"

// Family lives in a select rather than as a third heading level, so the nav
// shows one family's categories at a time instead of every family's at once.
export function BlocksSidebarNav({
  sections: blocksNav,
  // Inside the mobile sheet the sheet itself scrolls, so the caller passes
  // "max-h-none" to avoid a scroll area nested in a scroll area.
  scrollAreaClassName = "max-h-[calc(100svh-9.5rem)]",
}: {
  // Built by getBlocksNav() on the server — it reads the ~90KB registry
  // manifest, which must not follow this client component into the bundle.
  sections: NavSection[]
  scrollAreaClassName?: string
}) {
  const [family, setFamily] = useState(ALL)

  const sections =
    family === ALL
      ? blocksNav
      : blocksNav.filter((section) => section.title === family)

  return (
    <div className="w-full">
      <Select value={family} onValueChange={(value) => setFamily(value ?? ALL)}>
        <SelectTrigger aria-label="Filter blocks by family" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All</SelectItem>
          {blocksNav.map((section) => (
            <SelectItem key={section.title} value={section.title}>
              {section.title}
              {section.comingSoon && (
                <span className="font-mono text-[10px] text-muted-foreground">
                  Soon
                </span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="mt-4">
        <SidebarNav
          sections={sections}
          // The select already names the family; repeating it as a heading
          // only earns its space when several families are on screen.
          showSectionTitles={family === ALL}
          scrollAreaClassName={scrollAreaClassName}
        />
      </div>
    </div>
  )
}
