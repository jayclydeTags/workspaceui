import { useState } from "react"
import { FileText, Terminal } from "lucide-react"

import { Workspace } from "@/registry/bases/base/workspaceui/workspace"
import { WorkspacePanel } from "@/registry/bases/base/workspaceui/workspace-panel"
import { WorkspaceTabs, type WorkspaceTab } from "@/registry/bases/base/workspaceui/workspace-tabs"

const TERMINAL_TABS: WorkspaceTab[] = [
  { id: "bash", title: "bash",        icon: <Terminal className="size-3.5" />, pinned: true },
  { id: "npm",  title: "npm run dev", icon: <Terminal className="size-3.5" /> },
]

function EditorWithTerminal({ tabId }: { tabId: string }) {
  const [terminalId, setTerminalId] = useState("bash")

  return (
    <WorkspacePanel>
      <div className="flex h-full items-center justify-center">
        <p className="font-mono text-sm text-muted-foreground">{tabId}</p>
      </div>
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
  )
}

export function WorkspacePanelSplitDemo() {
  return (
    <div className="h-[420px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Workspace
        initialPanes={[{
          id: "editor",
          tabs: [
            { id: "main.tsx", title: "main.tsx", icon: <FileText className="size-3.5" />, pinned: true },
            { id: "app.tsx",  title: "app.tsx",  icon: <FileText className="size-3.5" /> },
          ],
        }]}
        renderTabContent={(_paneId, tabId) => <EditorWithTerminal tabId={tabId} />}
      />
    </div>
  )
}
