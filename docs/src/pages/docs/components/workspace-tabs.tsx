import { useDocumentTitle } from "@/lib/use-document-title"
import { CodeBlock, InlineCode } from "@/components/code-block"
import { ComponentPreview } from "@/components/component-preview"
import { PropsTable } from "@/components/props-table"

const PREVIEW_CODE = `import { useState } from "react"
import { LayoutDashboard, FileText, Settings } from "lucide-react"
import { WorkspaceTabs } from "@/components/ui/workspace-tabs"

export function MyTabs() {
  const [activeId, setActiveId] = useState("dashboard")
  const [tabs, setTabs] = useState([
    { id: "dashboard", title: "Dashboard", icon: <LayoutDashboard />, pinned: true },
    { id: "docs", title: "Documentation", icon: <FileText />, badge: 3 },
    { id: "settings", title: "Settings", icon: <Settings /> },
  ])

  return (
    <WorkspaceTabs
      tabs={tabs}
      activeTabId={activeId}
      onTabChange={setActiveId}
      onTabClose={(id) => setTabs((t) => t.filter((tab) => tab.id !== id))}
      onAddTab={() => {
        const id = \`tab-\${Date.now()}\`
        setTabs((t) => [...t, { id, title: "New Tab" }])
        setActiveId(id)
      }}
    >
      <div className="p-4 text-sm text-muted-foreground">
        {tabs.find((t) => t.id === activeId)?.title} content
      </div>
    </WorkspaceTabs>
  )
}`

const USAGE_CODE = `import { WorkspaceTabs } from "@/components/ui/workspace-tabs"

// WorkspaceTab shape
interface WorkspaceTab {
  id: string
  title: string
  icon?: React.ReactNode   // rendered at 14px
  badge?: number           // shown as a pill counter
  pinned?: boolean         // no close button when true
}

// Minimal usage
<WorkspaceTabs
  tabs={tabs}
  activeTabId={activeId}
  onTabChange={(id) => setActiveId(id)}
>
  {/* Content for the active tab */}
  <div>{/* ... */}</div>
</WorkspaceTabs>`

const WORKSPACE_TAB_PROPS = [
  { name: "id", type: "string", required: true, description: "Unique identifier for the tab." },
  { name: "title", type: "string", required: true, description: "Display label shown in the tab strip." },
  { name: "icon", type: "React.ReactNode", description: "Optional icon rendered at 14 × 14 px." },
  { name: "badge", type: "number", description: "Unread / notification count shown as a pill. Capped at 99+." },
  { name: "pinned", type: "boolean", default: "false", description: "Pinned tabs cannot be closed — no close button is rendered." },
]

const WORKSPACE_TABS_PROPS = [
  { name: "tabs", type: "WorkspaceTab[]", required: true, description: "Ordered array of tab definitions." },
  { name: "activeTabId", type: "string", required: true, description: "ID of the currently active tab." },
  { name: "onTabChange", type: "(id: string) => void", required: true, description: "Fired when the user clicks a tab." },
  { name: "onTabClose", type: "(id: string) => void", description: "When provided, each non-pinned tab renders a close button." },
  { name: "onAddTab", type: "() => void", description: 'When provided, a "+" button appears at the end of the strip.' },
  { name: "children", type: "React.ReactNode", required: true, description: "Content rendered in the content area below the tab strip." },
  { name: "className", type: "string", description: "Additional CSS classes applied to the root element." },
]

export function WorkspaceTabsPage() {
  useDocumentTitle("Workspace Tabs")

  return (
    <article className="space-y-10">
      <div>
        <p className="mb-1 text-sm text-muted-foreground">Components</p>
        <h1 className="mb-2 text-3xl font-bold">Workspace Tabs</h1>
        <p className="text-muted-foreground">
          Chrome-style scrollable tab strip with closeable tabs, unread badges,
          overflow fade, and macOS-style curved active-tab connectors.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Installation</h2>
        <InlineCode code="npx shadcn@latest add https://workspaceui.vercel.app/r/workspace-tabs.json" />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Preview</h2>
        <ComponentPreview name="workspace-tabs" code={PREVIEW_CODE} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Usage</h2>
        <CodeBlock code={USAGE_CODE} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">WorkspaceTab</h2>
        <p className="text-sm text-muted-foreground">
          Shape of each item in the <code className="font-mono">tabs</code>{" "}
          array.
        </p>
        <PropsTable props={WORKSPACE_TAB_PROPS} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">WorkspaceTabsProps</h2>
        <PropsTable props={WORKSPACE_TABS_PROPS} />
      </section>
    </article>
  )
}
