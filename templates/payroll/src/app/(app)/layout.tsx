"use client"

import * as React from "react"
import type { ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { WorkspaceTabs } from "@/registry/bases/base/workspaceui/workspace-tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { AppSidebar } from "./app-sidebar"
import { NAV_ITEMS, navById, navByHref } from "./nav"

const PINNED_IDS = NAV_ITEMS.filter((i) => i.pinned).map((i) => i.id)

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const activeId = (navByHref.get(pathname) ?? NAV_ITEMS[0]).id

  // Open tabs accumulate as you navigate — a real browser-like workspace strip.
  // Next.js keeps this layout mounted across child-route changes, so the state
  // persists. Pinned routes (Overview) are always present and can't be closed.
  const [openIds, setOpenIds] = React.useState<string[]>(() =>
    PINNED_IDS.includes(activeId) ? PINNED_IDS : [...PINNED_IDS, activeId]
  )

  React.useEffect(() => {
    setOpenIds((prev) => (prev.includes(activeId) ? prev : [...prev, activeId]))
  }, [activeId])

  const tabs = openIds
    .map((id) => navById.get(id))
    .filter((i): i is NonNullable<typeof i> => i != null)
    .map((i) => ({
      id: i.id,
      title: i.title,
      icon: <i.Icon className="size-3.5" />,
      pinned: i.pinned,
    }))

  function navigate(id: string) {
    const href = navById.get(id)?.href
    if (href) router.push(href)
  }

  function closeTab(id: string) {
    setOpenIds((prev) => {
      const next = prev.filter((x) => x !== id)
      if (id === activeId) {
        const idx = prev.indexOf(id)
        const fallback = next[idx - 1] ?? next[idx] ?? next[0]
        if (fallback) navigate(fallback)
      }
      return next
    })
  }

  return (
    <SidebarProvider className="h-svh">
      <AppSidebar activeId={activeId} />
      <SidebarInset className="flex min-h-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-3">
          <SidebarTrigger className="md:hidden" />
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <WorkspaceTabs
          tabs={tabs}
          activeTabId={activeId}
          onTabChange={navigate}
          onTabClose={closeTab}
          className="min-h-0 flex-1"
        >
          {children}
        </WorkspaceTabs>
      </SidebarInset>
    </SidebarProvider>
  )
}
