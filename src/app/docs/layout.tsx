import type { ReactNode } from "react"

import { SidebarNav } from "@/components/site/sidebar-nav"
import { getDocsNav } from "@/lib/docs-nav"

// "Getting Started" is hand-maintained in src/lib/nav.ts; the Components
// section is generated from doc pages by getDocsNav() (see src/lib/docs-nav.ts).
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100svh-3.5rem)]">
      <aside className="sticky top-14 fd-scroll-container hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 overflow-y-auto px-4 py-6 md:flex">
        <div className="w-full">
          <SidebarNav sections={getDocsNav()} />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
