"use client"

import * as React from "react"
import { LayoutDashboard, FileText, Settings } from "lucide-react"

import { Workspace } from "@/registry/bases/base/workspaceui/workspace"

function Centered({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
      <span className="text-muted-foreground/40 [&>svg]:size-8">{icon}</span>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

// Two side-by-side panes — drag a tab across the divider to transfer it.
export function WorkspaceSplitDemo() {
  const content: Record<string, React.ReactNode> = {
    dashboard: <Centered icon={<LayoutDashboard />} label="Dashboard" />,
    docs: <Centered icon={<FileText />} label="Documentation" />,
    settings: <Centered icon={<Settings />} label="Settings" />,
  }
  return (
    <div className="h-[360px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Workspace
        initialPanes={[
          {
            id: "left",
            defaultSize: 60,
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
          },
          {
            id: "right",
            defaultSize: 40,
            tabs: [
              {
                id: "settings",
                title: "Settings",
                icon: <Settings className="size-3.5" />,
                pinned: true,
              },
            ],
          },
        ]}
        renderTabContent={(_p, tabId) => content[tabId]}
      />
    </div>
  )
}
