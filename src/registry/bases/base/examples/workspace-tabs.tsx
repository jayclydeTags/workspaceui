"use client"

import * as React from "react"
import { Home, FolderOpen, Terminal } from "lucide-react"

import { Workspace } from "@/registry/bases/base/workspaceui/workspace"

function Centered({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
      <span className="text-muted-foreground/40 [&>svg]:size-8">{icon}</span>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

// Single pane, multiple tabs — closable, draggable, no split by default.
export function WorkspaceTabsDemo() {
  const content: Record<string, React.ReactNode> = {
    home: <Centered icon={<Home />} label="Home" />,
    files: <Centered icon={<FolderOpen />} label="Files" />,
    terminal: <Centered icon={<Terminal />} label="Terminal" />,
  }
  return (
    <div className="h-[360px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Workspace
        initialPanes={[
          {
            id: "main",
            tabs: [
              {
                id: "home",
                title: "Home",
                icon: <Home className="size-3.5" />,
                pinned: true,
              },
              {
                id: "files",
                title: "Files",
                icon: <FolderOpen className="size-3.5" />,
              },
              {
                id: "terminal",
                title: "Terminal",
                icon: <Terminal className="size-3.5" />,
              },
            ],
          },
        ]}
        renderTabContent={(_p, tabId) => content[tabId]}
      />
    </div>
  )
}
