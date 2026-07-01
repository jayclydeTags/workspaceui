import { useRef } from "react"
import { LayoutDashboard, FileText, Settings, Inbox } from "lucide-react"

import { Workspace, type WorkspaceHandle } from "@/registry/bases/base/workspaceui/workspace"
import { WorkspacePanel } from "@/registry/bases/base/workspaceui/workspace-panel"

export function WorkspaceTabsLiveDemo() {
  const ref = useRef<WorkspaceHandle>(null)

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-border shadow-sm">
      <Workspace
        ref={ref}
        initialPanes={[{
          id: "main",
          tabs: [
            { id: "dashboard", title: "Dashboard", icon: <LayoutDashboard className="size-3.5" />, pinned: true },
            { id: "docs",      title: "Documentation", icon: <FileText className="size-3.5" />, badge: 3 },
            { id: "inbox",     title: "Inbox", icon: <Inbox className="size-3.5" /> },
            { id: "settings",  title: "Settings", icon: <Settings className="size-3.5" /> },
          ],
          onAddTab: () => {
            const id = `tab-${Date.now()}`
            ref.current?.openTabInPane("main", { id, title: "New Tab" })
          },
        }]}
        renderTabContent={(_paneId, tabId) => (
          <WorkspacePanel>
            <div className="flex h-40 items-center justify-center">
              <p className="text-sm text-muted-foreground">{tabId}</p>
            </div>
          </WorkspacePanel>
        )}
      />
    </div>
  )
}
