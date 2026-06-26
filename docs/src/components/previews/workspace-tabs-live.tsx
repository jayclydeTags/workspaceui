import { useState } from "react"
import { LayoutDashboard, FileText, Settings, Inbox } from "lucide-react"

import { WorkspaceTabs, type WorkspaceTab } from "@/registry/ui/workspace-tabs"

const INITIAL_TABS: WorkspaceTab[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <LayoutDashboard className="size-3.5" />,
    pinned: true,
  },
  {
    id: "docs",
    title: "Documentation",
    icon: <FileText className="size-3.5" />,
    badge: 3,
  },
  {
    id: "inbox",
    title: "Inbox",
    icon: <Inbox className="size-3.5" />,
  },
  {
    id: "settings",
    title: "Settings",
    icon: <Settings className="size-3.5" />,
  },
]

export function WorkspaceTabsLiveDemo() {
  const [tabs, setTabs] = useState(INITIAL_TABS)
  const [activeId, setActiveId] = useState("dashboard")

  function handleClose(id: string) {
    const next = tabs.filter((t) => t.id !== id)
    setTabs(next)
    if (activeId === id) {
      const idx = tabs.findIndex((t) => t.id === id)
      setActiveId(next[Math.max(0, idx - 1)]?.id ?? next[0]?.id ?? "")
    }
  }

  function handleAdd() {
    const newId = `tab-${Date.now()}`
    setTabs((prev) => [...prev, { id: newId, title: "New Tab" }])
    setActiveId(newId)
  }

  const active = tabs.find((t) => t.id === activeId)

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-border shadow-sm">
      <WorkspaceTabs
        tabs={tabs}
        activeTabId={activeId}
        onTabChange={setActiveId}
        onTabClose={handleClose}
        onAddTab={handleAdd}
      >
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            {active?.title ?? "No tab selected"}
          </p>
        </div>
      </WorkspaceTabs>
    </div>
  )
}
