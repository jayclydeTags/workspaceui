"use client"

import { Home, FolderOpen, Terminal } from "lucide-react"

import { Workspace } from "@/registry/bases/base/workspaceui/workspace"

const TAB_CONTENT: Record<string, React.ReactNode> = {
  home: (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
      <Home className="size-8 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">Home</p>
    </div>
  ),
  files: (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
      <FolderOpen className="size-8 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">Files</p>
    </div>
  ),
  terminal: (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
      <Terminal className="size-8 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">Terminal</p>
    </div>
  ),
}

export function WorkspaceSinglePaneDemo() {
  return (
    <div className="h-[320px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Workspace
        initialPanes={[
          {
            id: "main",
            tabs: [
              { id: "home", title: "Home", icon: <Home className="size-3.5" />, pinned: true },
              { id: "files", title: "Files", icon: <FolderOpen className="size-3.5" /> },
              { id: "terminal", title: "Terminal", icon: <Terminal className="size-3.5" /> },
            ],
          },
        ]}
        renderTabContent={(_paneId, tabId) =>
          TAB_CONTENT[tabId] ?? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">{tabId}</p>
            </div>
          )
        }
      />
    </div>
  )
}