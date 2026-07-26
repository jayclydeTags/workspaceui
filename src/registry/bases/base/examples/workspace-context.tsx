"use client"

import * as React from "react"
import { LayoutDashboard, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Workspace,
  useWorkspace,
} from "@/registry/bases/base/workspaceui/workspace"

function Centered({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
      <span className="text-muted-foreground/40 [&>svg]:size-8">{icon}</span>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

// Content reaches the workspace via useWorkspace() — no ref needed from inside a pane.
function OverviewPanel() {
  const { openTabInPane } = useWorkspace()
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
      <LayoutDashboard className="size-8 text-muted-foreground/40" />
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          openTabInPane("main", {
            id: "details",
            title: "Details",
            icon: <FileText className="size-3.5" />,
          })
        }
      >
        Open details tab
      </Button>
    </div>
  )
}

export function WorkspaceContextDemo() {
  return (
    <div className="h-[360px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Workspace
        initialPanes={[
          {
            id: "main",
            tabs: [
              {
                id: "overview",
                title: "Overview",
                icon: <LayoutDashboard className="size-3.5" />,
                pinned: true,
              },
            ],
          },
        ]}
        renderTabContent={(_p, tabId) =>
          tabId === "overview" ? (
            <OverviewPanel />
          ) : (
            <Centered icon={<FileText />} label={tabId} />
          )
        }
      />
    </div>
  )
}
