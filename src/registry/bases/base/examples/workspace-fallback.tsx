"use client"

import * as React from "react"
import { FileText, Inbox } from "lucide-react"

import { Workspace } from "@/registry/bases/base/workspaceui/workspace"

function Centered({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
      <span className="text-muted-foreground/40 [&>svg]:size-8">{icon}</span>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

// Custom fallback — close the single tab to reveal it.
export function WorkspaceFallbackDemo() {
  return (
    <div className="h-[360px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Workspace
        initialPanes={[
          {
            id: "main",
            tabs: [
              {
                id: "scratch",
                title: "Scratch",
                icon: <FileText className="size-3.5" />,
              },
            ],
          },
        ]}
        renderTabContent={(_p, tabId) => (
          <Centered icon={<FileText />} label={tabId} />
        )}
        fallback={
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <Inbox className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No panels open</p>
            <p className="text-xs text-muted-foreground/70">
              Close the tab above to land here.
            </p>
          </div>
        }
      />
    </div>
  )
}
