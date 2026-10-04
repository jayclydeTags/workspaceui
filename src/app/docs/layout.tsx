import type { ReactNode } from "react"

import { SidebarNav } from "@/components/site/sidebar-nav"
import { nav } from "@/lib/nav"

// /docs is prose only (Getting Started). Component pages live under
// /components with their own three-column layout.
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100svh-3.5rem)]">
      <aside className="sticky top-14 fd-scroll-container hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 overflow-y-auto px-4 py-6 md:flex">
        <div className="w-full">
          <SidebarNav sections={nav} />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
