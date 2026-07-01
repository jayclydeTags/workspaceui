import { Outlet } from "react-router"

import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav"
import { blocksNav } from "@/lib/nav"

export default function BlocksLayout() {
  return (
    <>
      <Header />
      <div className="flex h-[calc(100svh-3.5rem)] overflow-hidden">
        <aside className="hidden w-56 shrink-0 border-r border-border px-4 py-6 md:block">
          <SidebarNav sections={blocksNav} />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
      </div>
    </>
  )
}
