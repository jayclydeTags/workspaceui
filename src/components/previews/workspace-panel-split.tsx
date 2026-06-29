import { useState } from "react"
import { FileText, Terminal } from "lucide-react"

import { WorkspacePanel } from "@/components/workspaceui/workspace-panel"
import { WorkspaceTabs, type WorkspaceTab } from "@/components/workspaceui/workspace-tabs"

const EDITOR_TABS: WorkspaceTab[] = [
  { id: "main", title: "main.tsx", icon: <FileText className="size-3.5" /> },
  { id: "app", title: "app.tsx", icon: <FileText className="size-3.5" /> },
]

const TERMINAL_TABS: WorkspaceTab[] = [
  { id: "bash", title: "bash", icon: <Terminal className="size-3.5" />, pinned: true },
  { id: "npm", title: "npm run dev", icon: <Terminal className="size-3.5" /> },
]

export function WorkspacePanelSplitDemo() {
  const [editorId, setEditorId] = useState("main")
  const [terminalId, setTerminalId] = useState("bash")

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <WorkspacePanel>
        <WorkspaceTabs
          tabs={EDITOR_TABS}
          activeTabId={editorId}
          onTabChange={setEditorId}
        >
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              {editorId === "main" ? "// main.tsx" : "// app.tsx"}
            </p>
          </div>
        </WorkspaceTabs>
        <WorkspaceTabs
          tabs={TERMINAL_TABS}
          activeTabId={terminalId}
          onTabChange={setTerminalId}
        >
          <div className="flex h-full items-center justify-center font-mono text-sm text-muted-foreground">
            {terminalId === "bash" ? "$ _" : "$ pnpm dev"}
          </div>
        </WorkspaceTabs>
      </WorkspacePanel>
    </div>
  )
}
