import { useDocumentTitle } from "@/lib/use-document-title"
import { CodeBlock } from "@/components/code-block"
import { ComponentPreview } from "@/components/component-preview"
import { ComponentSource } from "@/components/component-source"
import { ComponentTree } from "@/components/component-tree"
import { CodeTabs } from "@/components/code-tabs"
import { Steps, Step } from "@/components/steps"
import { PropsTable } from "@/components/props-table"

const PREVIEW_CODE = `import { LayoutDashboard, FileText, Settings } from "lucide-react"
import { Workspace } from "@/components/ui/workspace"

export function MyWorkspace() {
  return (
    <div className="h-[500px]">
      <Workspace
        initialPanes={[
          {
            id: "pane-a",
            tabs: [
              { id: "dashboard", title: "Dashboard", icon: <LayoutDashboard />, pinned: true },
              { id: "docs", title: "Documentation", icon: <FileText /> },
            ],
            defaultSize: 60,
          },
          {
            id: "pane-b",
            tabs: [{ id: "settings", title: "Settings", icon: <Settings />, pinned: true }],
            defaultSize: 40,
          },
        ]}
        renderTabContent={(_paneId, tabId) => (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">{tabId}</p>
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

  return (
    <div className="h-screen">
      <button onClick={() => ref.current?.openPane({
        id: "new-pane",
        tabs: [{ id: "new-tab", title: "New Tab" }],
      })}>
        Open pane
      </button>
      <Workspace
        ref={ref}
        initialPanes={[{ id: "main", tabs: [{ id: "home", title: "Home", pinned: true }] }]}
        renderTabContent={(paneId, tabId) => <YourPage paneId={paneId} tabId={tabId} />}
        fallback={<EmptyState />}
      />
    </div>
  )
}

// Access workspace state from any child
function YourPage({ paneId }: { paneId: string }) {
  const { openTabInPane } = useWorkspace()

  return (
    <button onClick={() => openTabInPane(paneId, { id: "docs", title: "Docs" })}>
      Open docs tab
    </button>
  )
}`

const WORKSPACE_PROPS = [
  { name: "initialPanes", type: "WorkspacePaneDef[]", default: "[]", description: "Initial pane/tab configuration rendered on mount." },
  { name: "renderTabContent", type: "(paneId: string, tabId: string) => ReactNode", required: true, description: "Renders content for the active tab in each pane. Called on every render — keep it fast." },
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
    <article className="space-y-12">

      {/* Title + Description */}
      <div>
        <p className="mb-1 text-sm text-muted-foreground">Components</p>
        <h1 className="mb-3 text-3xl font-bold">Workspace</h1>
        <p className="text-muted-foreground">
          Self-contained multi-pane workspace with tab drag/drop, cross-pane
          transfers, and snap-zone splitting. Exposes a{" "}
          <code className="font-mono text-sm">useWorkspace</code> context hook
          and a <code className="font-mono text-sm">WorkspaceHandle</code> ref
          for programmatic control.
        </p>
      </div>

      {/* Preview + Code */}
      <ComponentPreview name="workspace" code={PREVIEW_CODE} />

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Installation</h2>
        <CodeTabs
          cli="npx shadcn@latest add jayclydeTags/workspaceui/workspace"
          manual={
            <Steps>
              <Step>Install dependencies</Step>
              <CodeBlock
                code="npm install @base-ui/react react-resizable-panels lucide-react"
                lang="bash"
              />
              <Step>Add the workspace-tabs and workspace-context components</Step>
              <CodeBlock
                code="npx shadcn@latest add jayclydeTags/workspaceui/workspace-tabs"
                lang="bash"
              />
              <Step>Copy the workspace component into your project</Step>
              <ComponentSource name="workspace" />
            </Steps>
          }
        />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Usage</h2>
        <CodeBlock code={`import { Workspace, useWorkspace, type WorkspaceHandle } from "@/components/ui/workspace"`} lang="tsx" />
        <CodeBlock code={USAGE_CODE} />
      </section>

      {/* Compositions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Composition</h2>
        <ComponentTree
          description="Use the following composition to build a workspace:"
          root={{
            name: "Workspace",
            children: [
              {
                name: "WorkspacePaneDef (×n via initialPanes prop)",
                children: [
                  {
                    name: "WorkspaceTabDef (×n via tabs prop)",
                    children: [
                      { name: "icon?" },
                      { name: "badge?" },
                      { name: "pinned?" },
                    ],
                  },
                ],
              },
              { name: "renderTabContent (active tab content)" },
              { name: "fallback (shown when all panes closed)" },
            ],
          }}
        />
      </section>

      {/* Features */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Features</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Cross-pane drag and drop</strong>{" "}
            — drag a tab from one pane and drop it into another to transfer it.
          </li>
          <li>
            <strong className="text-foreground">Snap-zone splitting</strong>{" "}
            — drag a tab to the left or right edge of a pane to split it into
            two columns.
          </li>
          <li>
            <strong className="text-foreground">Resizable panels</strong>{" "}
            — panel columns are resizable via drag handles, with configurable
            min sizes.
          </li>
          <li>
            <strong className="text-foreground">Imperative handle</strong>{" "}
            — attach a{" "}
            <code className="font-mono text-xs">WorkspaceHandle</code> ref to
            control panes and tabs programmatically from outside the component.
          </li>
          <li>
            <strong className="text-foreground">Context hook</strong>{" "}
            — any component rendered inside{" "}
            <code className="font-mono text-xs">&lt;Workspace&gt;</code> can
            call <code className="font-mono text-xs">useWorkspace()</code> to
            read state or open/close panes and tabs.
          </li>
          <li>
            <strong className="text-foreground">Custom fallback</strong>{" "}
            — configure the view shown when all panes are closed via the{" "}
            <code className="font-mono text-xs">fallback</code> prop.
          </li>
        </ul>
      </section>

      {/* API Reference */}
      <section className="space-y-8">
        <h2 className="text-xl font-semibold">API Reference</h2>

        <div className="space-y-3">
          <h3 className="text-base font-medium">Workspace</h3>
          <PropsTable props={WORKSPACE_PROPS} />
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-medium">WorkspacePaneDef</h3>
          <p className="text-sm text-muted-foreground">
            Used in <code className="font-mono text-xs">initialPanes</code> and{" "}
            <code className="font-mono text-xs">openPane()</code>.
          </p>
          <PropsTable props={WORKSPACE_PANE_DEF_PROPS} />
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-medium">useWorkspace()</h3>
          <p className="text-sm text-muted-foreground">
            Context hook available to any component rendered inside{" "}
            <code className="font-mono text-xs">&lt;Workspace&gt;</code>.
          </p>
          <PropsTable props={WORKSPACE_CONTEXT_PROPS} />
        </div>
      </section>

    </article>
  )
}
