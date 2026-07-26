"use client"

import * as React from "react"
import { Home, FileText, Plus } from "lucide-react"

import {
  Workspace,
  type WorkspaceHandle,
} from "@/registry/bases/base/workspaceui/workspace"

function Centered({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
      <span className="text-muted-foreground/40 [&>svg]:size-8">{icon}</span>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

// "+" button in the tab strip via onAddTab — opens a new numbered tab through the ref.
export function WorkspaceAddTabDemo() {
  const workspace = React.useRef<WorkspaceHandle>(null)
  const nextId = React.useRef(1)
  return (
    <div className="h-[360px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Workspace
        ref={workspace}
        initialPanes={[
          {
            id: "main",
            tabs: [
              {
                id: "start",
                title: "Start",
                icon: <Home className="size-3.5" />,
                pinned: true,
              },
            ],
            onAddTab: () => {
              const n = nextId.current++
              workspace.current?.openTabInPane("main", {
                id: `tab-${n}`,
                title: `Untitled ${n}`,
                icon: <FileText className="size-3.5" />,
              })
            },
          },
        ]}
        renderTabContent={(_p, tabId) =>
          tabId === "start" ? (
            <Centered icon={<Plus />} label="Press + to open a tab" />
          ) : (
            <Centered icon={<FileText />} label={tabId} />
          )
        }
      />
    </div>
  )
}
