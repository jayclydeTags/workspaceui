import { useDocumentTitle } from "@/lib/use-document-title"
import { CodeBlock } from "@/components/code-block"
import { ComponentPreview } from "@/components/component-preview"
import { ComponentSource } from "@/components/component-source"
import { ComponentTree } from "@/components/component-tree"
import { CodeTabs } from "@/components/code-tabs"
import { Steps, Step } from "@/components/steps"
import { PropsTable } from "@/components/props-table"

const PREVIEW_CODE = `import { useRef } from "react"
import { LayoutDashboard, FileText, Settings, Inbox } from "lucide-react"
import { Workspace, type WorkspaceHandle } from "@/components/ui/workspace"
import { WorkspacePanel } from "@/components/ui/workspace-panel"

export function MyTabs() {
  const ref = useRef<WorkspaceHandle>(null)

  return (
    <Workspace
      ref={ref}
      initialPanes={[{
        id: "main",
        tabs: [
          { id: "dashboard", title: "Dashboard", icon: <LayoutDashboard />, pinned: true },
          { id: "docs",      title: "Documentation", icon: <FileText />, badge: 3 },
          { id: "inbox",     title: "Inbox", icon: <Inbox /> },
          { id: "settings",  title: "Settings", icon: <Settings /> },
        ],
        onAddTab: () => {
          const id = \`tab-\${Date.now()}\`
          ref.current?.openTabInPane("main", { id, title: "New Tab" })
        },
      }]}
      renderTabContent={(_paneId, tabId) => (
        <WorkspacePanel>
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">{tabId}</p>
          </div>
        </WorkspacePanel>
      )}
    />
  )
}`

const USAGE_IMPORT = `import { Workspace, type WorkspaceHandle } from "@/components/ui/workspace"
import { WorkspacePanel } from "@/components/ui/workspace-panel"
import { WorkspaceTabs } from "@/components/ui/workspace-tabs"`

const USAGE_CODE = `// Pane-level tabs are declared in initialPanes — Workspace renders the strip.
<Workspace
  initialPanes={[{ id: "pane", tabs: [{ id: "home", title: "Home", pinned: true }] }]}
  renderTabContent={(_paneId, tabId) => (
    <WorkspacePanel>
      <div>{/* tab content */}</div>

      {/* Sub-panel strip — WorkspaceTabs used directly for nested content */}
      <WorkspaceTabs
        tabs={terminalTabs}
        activeTabId={terminalId}
        onTabChange={setTerminalId}
      >
        <div className="p-3 font-mono text-xs">$ _</div>
      </WorkspaceTabs>
    </WorkspacePanel>
  )}
/>`

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
  { name: "paneId", type: "string", description: "Connects this strip to the parent <Workspace> drag context, enabling tab reordering and cross-pane transfers. Set automatically for pane-level strips; pass explicitly when using WorkspaceTabs as a sub-panel in renderTabContent." },
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
          overflow fade, and macOS-style curved active-tab connectors. Designed
          to run inside{" "}
          <code className="font-mono text-xs">&lt;Workspace&gt;</code>, which
          provides the drag context for tab reordering and cross-pane transfers.
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
        <CodeBlock code={USAGE_IMPORT} lang="tsx" />
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
            <strong className="text-foreground">Drag to reorder</strong> —
            drag tabs within the strip to reorder them. Cross-pane transfers
            and snap-zone splitting are also supported. All drag behavior is
            provided by the parent{" "}
            <code className="font-mono text-xs">&lt;Workspace&gt;</code> context
            — no extra props required for pane-level tabs.
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
