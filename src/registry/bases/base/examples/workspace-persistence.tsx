"use client"

import * as React from "react"
import { Home, FolderOpen, Terminal, Save, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Workspace,
  type WorkspaceHandle,
  type WorkspaceSnapshot,
  type WorkspaceTabDef,
} from "@/registry/bases/base/workspaceui/workspace"

// A snapshot holds tab *ids*, so restore needs somewhere to look them up.
// Icons live here, not in the snapshot — a ReactNode can't be JSON.
const TABS: Record<string, WorkspaceTabDef> = {
  home: { id: "home", title: "Home", icon: <Home className="size-3.5" /> },
  files: { id: "files", title: "Files", icon: <FolderOpen className="size-3.5" /> },
  terminal: { id: "terminal", title: "Terminal", icon: <Terminal className="size-3.5" /> },
}

export function WorkspacePersistenceDemo() {
  const workspace = React.useRef<WorkspaceHandle>(null)
  const [saved, setSaved] = React.useState<WorkspaceSnapshot | null>(null)

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSaved(workspace.current!.serialize())}
        >
          <Save /> Save layout
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={saved === null}
          onClick={() => workspace.current!.restore(saved!, (id) => TABS[id])}
        >
          <RotateCcw /> Restore
        </Button>
        <p className="text-xs text-muted-foreground">
          {saved
            ? `Saved ${saved.columns.length} column${saved.columns.length === 1 ? "" : "s"} — now split or close a pane, then restore.`
            : "Split a pane by dragging a tab to an edge, then save."}
        </p>
      </div>

      <div className="h-[320px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
        <Workspace
          ref={workspace}
          initialPanes={[{ id: "main", tabs: [TABS.home!, TABS.files!, TABS.terminal!] }]}
          renderTabContent={(_paneId, tabId) => (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
              {TABS[tabId]?.icon}
              <p className="text-sm text-muted-foreground">{TABS[tabId]?.title ?? tabId}</p>
            </div>
          )}
        />
      </div>
    </div>
  )
}
