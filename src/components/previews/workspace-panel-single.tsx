import { useState } from "react"
import { Home, FileText, Settings } from "lucide-react"

import { WorkspacePanel } from "@/components/workspaceui/workspace-panel"
import { WorkspaceTabs, type WorkspaceTab } from "@/components/workspaceui/workspace-tabs"

const INITIAL_TABS: WorkspaceTab[] = [
  { id: "home", title: "Home", icon: <Home className="size-3.5" />, pinned: true },
  { id: "docs", title: "Documentation", icon: <FileText className="size-3.5" />, badge: 2 },
  { id: "settings", title: "Settings", icon: <Settings className="size-3.5" /> },
]

export function WorkspacePanelSingleDemo() {
  const [tabs, setTabs] = useState(INITIAL_TABS)
  const [activeId, setActiveId] = useState("home")

  function handleClose(id: string) {
    const next = tabs.filter((t) => t.id !== id)
    setTabs(next)
    if (activeId === id) {
      const idx = tabs.findIndex((t) => t.id === id)
      setActiveId(next[Math.max(0, idx - 1)]?.id ?? next[0]?.id ?? "")
    }
  }

  return (
    <div className="h-[300px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <WorkspacePanel>
        <WorkspaceTabs
          tabs={tabs}
          activeTabId={activeId}
          onTabChange={setActiveId}
          onTabClose={handleClose}
        >
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              {tabs.find((t) => t.id === activeId)?.title}
            </p>
          </div>
        </WorkspaceTabs>
      </WorkspacePanel>
    </div>
  )
}
