import { useDocumentTitle } from "@/lib/use-document-title"
import { CodeBlock, InlineCode } from "@/components/code-block"
import { ComponentPreview } from "@/components/component-preview"
import { PropsTable } from "@/components/props-table"

const PREVIEW_CODE = `import { LayoutDashboard, FileText } from "lucide-react"
import { Workspace } from "@/components/ui/workspace"

export function MyWorkspace() {
  return (
    <div className="h-[500px]">
      <Workspace
        initialPanes={[
          {
            id: "pane-main",
            tabs: [
              { id: "dashboard", title: "Dashboard", icon: <LayoutDashboard />, pinned: true },
              { id: "docs", title: "Documentation", icon: <FileText /> },
            ],
          },
        ]}
        renderTabContent={(_paneId, tabId) => (
          <div className="flex h-full items-center justify-center p-6">
            <p className="text-sm text-muted-foreground">{tabId} content</p>
          </div>
        )}
      />
    </div>
  )
}`

const USAGE_CODE = `import { useRef } from "react"
import { Workspace, useWorkspace, type WorkspaceHandle } from "@/components/ui/workspace"

// Programmatic control via ref
function Parent() {
  const ref = useRef<WorkspaceHandle>(null)

  function openNewPane() {
    ref.current?.openPane({
      id: "new-pane",
      tabs: [{ id: "new-tab", title: "New Tab" }],
    })
  }

  return (
    <div className="h-screen">
      <button onClick={openNewPane}>Open pane</button>
      <Workspace
        ref={ref}
        initialPanes={[
          {
            id: "main",
            tabs: [{ id: "home", title: "Home", pinned: true }],
            minSize: 30,
          },
        ]}
        renderTabContent={(paneId, tabId) => (
          <YourPageComponent paneId={paneId} tabId={tabId} />
        )}
        fallback={<EmptyState />}
      />
    </div>
  )
}

// Access workspace state from any child
function YourPageComponent({ paneId }: { paneId: string }) {
  const { openTabInPane } = useWorkspace()

  return (
    <button onClick={() => openTabInPane(paneId, { id: "docs", title: "Docs" })}>
      Open docs tab
    </button>
  )
}`

const WORKSPACE_PROPS = [
  { name: "initialPanes", type: "WorkspacePaneDef[]", default: "[]", description: "Initial pane/tab configuration rendered on mount." },
  { name: "renderTabContent", type: "(paneId: string, tabId: string) => ReactNode", required: true, description: "Renders content for the active tab in each pane. Called on every render." },
  { name: "fallback", type: "ReactNode", description: "Shown when all panes are closed. Defaults to a built-in placeholder." },
  { name: "className", type: "string", description: "Additional CSS classes applied to the root element." },
]

const WORKSPACE_PANE_DEF_PROPS = [
  { name: "id", type: "string", required: true, description: "Unique identifier for this pane." },
  { name: "tabs", type: "WorkspaceTabDef[]", required: true, description: "Initial tabs for this pane." },
  { name: "defaultActiveTabId", type: "string", description: "Which tab is active on mount. Defaults to the first tab." },
  { name: "defaultSize", type: "number", description: "Percentage width (0–100) for horizontal panel groups." },
  { name: "minSize", type: "number", description: "Minimum percentage size. Defaults to 20." },
  { name: "onAddTab", type: "() => void", description: 'Renders a "+" button in the tab strip when provided.' },
]

const WORKSPACE_CONTEXT_PROPS = [
  { name: "panes", type: "readonly PaneState[]", description: "Current flat list of all open panes." },
  { name: "isShowingFallback", type: "boolean", description: "True when all panes are closed and the fallback is visible." },
  { name: "lastActivePaneId", type: "string | null", description: "ID of the most recently focused pane." },
  { name: "openTabInPane", type: "(paneId, tab) => void", description: "Opens or focuses a tab in the specified pane." },
  { name: "closeTab", type: "(paneId, tabId) => void", description: "Closes a tab. Removes the pane if it was the last tab." },
  { name: "activateTab", type: "(paneId, tabId) => void", description: "Switches the active tab in a pane." },
  { name: "updateTab", type: "(paneId, tabId, patch) => void", description: "Patches tab properties (e.g. update badge count)." },
  { name: "openPane", type: "(pane: WorkspacePaneDef) => void", description: "Adds a new pane column. No-op if the pane ID already exists." },
  { name: "closePane", type: "(paneId) => void", description: "Removes a pane and all its tabs." },
]

export function WorkspacePage() {
  useDocumentTitle("Workspace")

  return (
    <article className="space-y-10">
      <div>
        <p className="mb-1 text-sm text-muted-foreground">Components</p>
        <h1 className="mb-2 text-3xl font-bold">Workspace</h1>
        <p className="text-muted-foreground">
          Self-contained multi-pane workspace with tab drag/drop, cross-pane
          transfers, and snap-zone splitting. Exposes a{" "}
          <code className="font-mono text-sm">useWorkspace</code> context hook
          and a <code className="font-mono text-sm">WorkspaceHandle</code> ref
          for programmatic control.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Installation</h2>
        <InlineCode code="npx shadcn@latest add jayclydeTags/workspaceui/workspace" />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Preview</h2>
        <p className="text-sm text-muted-foreground">
          Try dragging tabs between panes, or drag a tab to the edges to split
          the layout.
        </p>
        <ComponentPreview name="workspace" code={PREVIEW_CODE} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Usage</h2>
        <CodeBlock code={USAGE_CODE} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">WorkspaceProps</h2>
        <PropsTable props={WORKSPACE_PROPS} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">WorkspacePaneDef</h2>
        <p className="text-sm text-muted-foreground">
          Used in <code className="font-mono text-sm">initialPanes</code> and{" "}
          <code className="font-mono text-sm">openPane()</code>.
        </p>
        <PropsTable props={WORKSPACE_PANE_DEF_PROPS} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">useWorkspace()</h2>
        <p className="text-sm text-muted-foreground">
          Context hook available to any component rendered inside{" "}
          <code className="font-mono text-sm">&lt;Workspace&gt;</code>.
        </p>
        <PropsTable props={WORKSPACE_CONTEXT_PROPS} />
      </section>
    </article>
  )
}
