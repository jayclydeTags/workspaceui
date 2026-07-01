import { useState } from "react"
import { LayoutDashboard, FileText, Settings } from "lucide-react"

import { WorkspaceTabs, type WorkspaceTab } from "@/registry/bases/base/workspaceui/workspace-tabs"

const TABS: WorkspaceTab[] = [
  { id: "dashboard", title: "Dashboard", icon: <LayoutDashboard className="size-3.5" /> },
  { id: "docs", title: "Documentation", icon: <FileText className="size-3.5" /> },
  { id: "settings", title: "Settings", icon: <Settings className="size-3.5" /> },
]

export function WorkspaceTabsMinimalDemo() {
  const [activeId, setActiveId] = useState("dashboard")
  const active = TABS.find((t) => t.id === activeId)

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-border shadow-sm">
      <WorkspaceTabs tabs={TABS} activeTabId={activeId} onTabChange={setActiveId}>
        <div className="flex h-28 items-center justify-center">
          <p className="text-sm text-muted-foreground">{active?.title}</p>
        </div>
      </WorkspaceTabs>
    </div>
  )
}
