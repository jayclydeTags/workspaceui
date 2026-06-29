import { useState } from "react"
import { FileText } from "lucide-react"

import { WorkspaceTabs, type WorkspaceTab } from "@/components/workspaceui/workspace-tabs"

const FILES = [
  "index.tsx", "app.tsx", "main.tsx", "utils.ts", "types.ts",
  "api.ts", "store.ts", "hooks.ts", "config.ts", "README.md",
]

const INITIAL_TABS: WorkspaceTab[] = FILES.map((f, i) => ({
  id: `file-${i}`,
  title: f,
  icon: <FileText className="size-3.5" />,
}))

export function WorkspaceTabsOverflowDemo() {
  const [tabs, setTabs] = useState(INITIAL_TABS)
  const [activeId, setActiveId] = useState("file-0")

  function handleClose(id: string) {
    const next = tabs.filter((t) => t.id !== id)
    setTabs(next)
    if (activeId === id) {
      const idx = tabs.findIndex((t) => t.id === id)
      setActiveId(next[Math.max(0, idx - 1)]?.id ?? next[0]?.id ?? "")
    }
  }

  const active = tabs.find((t) => t.id === activeId)

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-border shadow-sm">
      <WorkspaceTabs
        tabs={tabs}
        activeTabId={activeId}
        onTabChange={setActiveId}
        onTabClose={handleClose}
      >
        <div className="flex h-28 items-center justify-center">
          <p className="text-sm text-muted-foreground">{active?.title}</p>
        </div>
      </WorkspaceTabs>
    </div>
  )
}
