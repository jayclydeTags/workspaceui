import { LayoutDashboard, FileText, Settings } from "lucide-react"

import { Workspace } from "@/components/workspaceui/workspace"

const INITIAL_PANES = [
  {
    id: "pane-a",
    tabs: [
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
      },
    ],
    defaultSize: 60,
    minSize: 30,
  },
  {
    id: "pane-b",
    tabs: [
      {
        id: "settings",
        title: "Settings",
        icon: <Settings className="size-3.5" />,
        pinned: true,
      },
    ],
    defaultSize: 40,
    minSize: 30,
  },
]

const TAB_CONTENT: Record<string, React.ReactNode> = {
  dashboard: (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
      <LayoutDashboard className="size-8 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">Dashboard</p>
    </div>
  ),
  docs: (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
      <FileText className="size-8 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">Documentation</p>
    </div>
  ),
  settings: (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
      <Settings className="size-8 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">Settings</p>
    </div>
  ),
}

export function WorkspaceLiveDemo() {
  return (
    <div className="h-[400px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Workspace
        initialPanes={INITIAL_PANES}
        renderTabContent={(_paneId, tabId) =>
          TAB_CONTENT[tabId] ?? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">{tabId}</p>
            </div>
          )
        }
        fallback={
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            All panels closed
          </div>
        }
      />
    </div>
  )
}
