import type { ReactNode } from "react"

import { SidebarNav } from "@/components/sidebar-nav"

// Sidebar sections are hand-maintained in src/lib/nav.ts (ordering/titles
// mirror src/content/docs/**/meta.json) and validated against every
// registry:ui item by src/registry/__tests__/registry-docs.test.ts.
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100svh-3.5rem)] overflow-hidden">
      <aside className="hidden w-56 shrink-0 px-4 py-6 md:flex">
        <div className="w-full">
          <SidebarNav />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
