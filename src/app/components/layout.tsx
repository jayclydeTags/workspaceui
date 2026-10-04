import type { ReactNode } from "react"
import type { Metadata } from "next"

import { SidebarNav } from "@/components/site/sidebar-nav"
import { getComponentsNav } from "@/lib/component-pages"

export const metadata: Metadata = { title: "Components" }

// [sidebar] [canvas] [inspector]: this layout owns the sidebar; the page owns
// the canvas + inspector pair (see components/studio). From md up the shell is
// a fixed-height frame so each column scrolls on its own.
export default function ComponentsLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] md:h-[calc(100svh-3.5rem)] md:overflow-hidden">
      <aside className="hidden w-56 shrink-0 px-4 py-6 md:flex">
        <SidebarNav sections={getComponentsNav()} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col border-l md:overflow-y-auto lg:overflow-hidden">
        {children}
      </div>
    </div>
  )
}
