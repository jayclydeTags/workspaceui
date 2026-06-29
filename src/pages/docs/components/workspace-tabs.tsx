import { useDocumentTitle } from "@/lib/use-document-title"
import { CodeBlock } from "@/components/code-block"
import { ComponentPreview } from "@/components/component-preview"
import { ComponentSource } from "@/components/component-source"
import { ComponentTree } from "@/components/component-tree"
import { CodeTabs } from "@/components/code-tabs"
import { Steps, Step } from "@/components/steps"
import { PropsTable } from "@/components/props-table"

const PREVIEW_CODE = `import { useState } from "react"
import { LayoutDashboard, FileText, Settings, Inbox } from "lucide-react"
import { WorkspaceTabs } from "@/components/ui/workspace-tabs"

export function MyTabs() {
  const [activeId, setActiveId] = useState("dashboard")
  const [tabs, setTabs] = useState([
    { id: "dashboard", title: "Dashboard", icon: <LayoutDashboard />, pinned: true },
    { id: "docs",      title: "Documentation", icon: <FileText />, badge: 3 },
    { id: "inbox",     title: "Inbox", icon: <Inbox /> },
    { id: "settings",  title: "Settings", icon: <Settings /> },
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

<WorkspaceTabs
  tabs={tabs}
  activeTabId={activeId}
  onTabChange={(id) => setActiveId(id)}
>
  <div>{/* active tab content */}</div>
</WorkspaceTabs>`

const WORKSPACE_TAB_PROPS = [
  { name: "id", type: "string", required: true, description: "Unique identifier for the tab." },
  { name: "title", type: "string", required: true, description: "Display label shown in the tab strip." },
  { name: "icon", type: "React.ReactNode", description: "Optional icon rendered at 14 × 14 px." },
  { name: "badge", type: "number", description: "Unread/notification count shown as a pill. Displays 99+ when over 99." },
  { name: "pinned", type: "boolean", default: "false", description: "Pinned tabs cannot be closed — no close button is rendered." },
]

const WORKSPACE_TABS_PROPS = [
  { name: "tabs", type: "WorkspaceTab[]", required: true, description: "Ordered array of tab definitions." },
  { name: "activeTabId", type: "string", required: true, description: "ID of the currently active tab." },
  { name: "onTabChange", type: "(id: string) => void", required: true, description: "Fired when the user clicks a tab." },
  { name: "onTabClose", type: "(id: string) => void", description: "When provided, each non-pinned tab renders a close button." },
  { name: "onAddTab", type: "() => void", description: 'When provided, a "+" button appears at the end of the strip.' },
  { name: "paneId", type: "string", description: "Required for drag-and-drop when used inside <Workspace>. Omit when used standalone." },
  { name: "children", type: "React.ReactNode", required: true, description: "Content rendered in the area below the tab strip." },
  { name: "className", type: "string", description: "Additional CSS classes applied to the root element." },
]

export function WorkspaceTabsPage() {
  useDocumentTitle("Workspace Tabs")

  return (
    <article className="space-y-12">

      {/* Title + Description */}
      <div>
        <p className="mb-1 text-sm text-muted-foreground">Components</p>
        <h1 className="mb-3 text-3xl font-bold">Workspace Tabs</h1>
        <p className="text-muted-foreground">
          Chrome-style scrollable tab strip with closeable tabs, unread badges,
          overflow fade, and macOS-style curved active-tab connectors.
        </p>
      </div>

      {/* Preview + Code */}
      <ComponentPreview name="workspace-tabs" code={PREVIEW_CODE} />

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Installation</h2>
        <CodeTabs
          cli="npx shadcn@latest add jayclydeTags/workspaceui/workspace-tabs"
          manual={
            <Steps>
              <Step>Install dependencies</Step>
              <CodeBlock code="npm install @base-ui/react lucide-react" lang="bash" />
              <Step>Copy the components into your project</Step>
              <ComponentSource name="workspace-context" />
              <ComponentSource name="workspace-tabs" />
            </Steps>
          }
        />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Usage</h2>
        <CodeBlock code={`import { WorkspaceTabs } from "@/components/ui/workspace-tabs"`} lang="tsx" />
        <CodeBlock code={USAGE_CODE} />
      </section>

      {/* Compositions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Composition</h2>
        <ComponentTree
          description="Use the following composition to build a tab strip:"
          root={{
            name: "WorkspaceTabs",
            children: [
              {
                name: "WorkspaceTab (×n via tabs prop)",
                children: [
                  { name: "icon?" },
                  { name: "badge?" },
                  { name: "pinned?" },
                ],
              },
              { name: "children (content area)" },
            ],
          }}
        />
      </section>

      {/* Features */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Features</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">macOS curved connectors</strong>{" "}
            — SVG clip-path connectors on the active tab match the macOS
            browser tab aesthetic.
          </li>
          <li>
            <strong className="text-foreground">Overflow fade</strong> — a
            gradient mask at the scroll edge indicates hidden tabs without
            clipping content.
          </li>
          <li>
            <strong className="text-foreground">Badges</strong> — numeric
            unread counts rendered as pills, capped at 99+.
          </li>
          <li>
            <strong className="text-foreground">Drag support</strong> —
            pass <code className="font-mono text-xs">paneId</code> when
            used inside <code className="font-mono text-xs">&lt;Workspace&gt;</code>{" "}
            to enable cross-pane tab drag and drop. Drag wires up automatically
            via context — no extra props required.
          </li>
        </ul>
      </section>

      {/* API Reference */}
      <section className="space-y-8">
        <h2 className="text-xl font-semibold">API Reference</h2>

        <div className="space-y-3">
          <h3 className="text-base font-medium">WorkspaceTab</h3>
          <p className="text-sm text-muted-foreground">
            Shape of each item in the{" "}
            <code className="font-mono text-xs">tabs</code> array.
          </p>
          <PropsTable props={WORKSPACE_TAB_PROPS} />
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-medium">WorkspaceTabs</h3>
          <PropsTable props={WORKSPACE_TABS_PROPS} />
        </div>
      </section>

    </article>
  )
}
