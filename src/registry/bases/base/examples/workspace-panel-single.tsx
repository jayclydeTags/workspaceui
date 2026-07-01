import { Home, FileText, Settings } from "lucide-react"

import { Workspace } from "@/registry/bases/base/workspaceui/workspace"
import { WorkspacePanel } from "@/registry/bases/base/workspaceui/workspace-panel"

export function WorkspacePanelSingleDemo() {
  return (
    <div className="h-[300px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Workspace
        initialPanes={[{
          id: "main",
          tabs: [
            { id: "home",      title: "Home",          icon: <Home className="size-3.5" />,     pinned: true },
            { id: "docs",      title: "Documentation", icon: <FileText className="size-3.5" />, badge: 2 },
            { id: "settings",  title: "Settings",      icon: <Settings className="size-3.5" /> },
          ],
        }]}
        renderTabContent={(_paneId, tabId) => (
          <WorkspacePanel>
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">{tabId}</p>
            </div>
          </WorkspacePanel>
        )}
      />
    </div>
  )
}
