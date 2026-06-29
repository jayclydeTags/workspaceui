import { Outlet } from "react-router-dom"

import { SidebarNav } from "@/components/sidebar-nav"
import { blocksNav } from "@/lib/nav"

export function BlocksLayout() {
  return (
    <div className="flex h-[calc(100svh-3.5rem)] overflow-hidden">
      <aside className="hidden w-56 shrink-0 border-r border-border px-4 py-6 md:block">
        <SidebarNav sections={blocksNav} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
