import { Outlet } from "react-router-dom"

import { SidebarNav } from "@/components/sidebar-nav"

export function DocsLayout() {
  return (
    <div className="mx-auto flex max-w-screen-xl gap-8 px-4 py-8 md:px-6">
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-20">
          <SidebarNav />
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
