import { useDocumentTitle } from "@/lib/use-document-title"
import { CodeBlock } from "@/components/code-block"
import { ComponentPreview } from "@/components/component-preview"
import { ComponentSource } from "@/components/component-source"
import { ComponentTree } from "@/components/component-tree"
import { CodeTabs } from "@/components/code-tabs"
import { Steps, Step } from "@/components/steps"
import { PropsTable } from "@/components/props-table"

const PREVIEW_CODE = `import { Home, FileText, Settings } from "lucide-react"
import { Workspace } from "@/components/ui/workspace"
import { WorkspacePanel } from "@/components/ui/workspace-panel"

export function MyPanel() {
  return (
    <Workspace
      initialPanes={[{
        id: "main",
        tabs: [
          { id: "home",     title: "Home",          icon: <Home />,     pinned: true },
          { id: "docs",     title: "Documentation", icon: <FileText />, badge: 2 },
          { id: "settings", title: "Settings",      icon: <Settings /> },
        ],
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

const USAGE_IMPORT = `import { Workspace } from "@/components/ui/workspace"
import { WorkspacePanel } from "@/components/ui/workspace-panel"
import { WorkspaceTabs } from "@/components/ui/workspace-tabs"`

const USAGE_CODE = `<Workspace
  initialPanes={[{ id: "editor", tabs: [{ id: "main", title: "main.tsx" }] }]}
  renderTabContent={(_paneId, tabId) => (
    <WorkspacePanel>
      <div>{/* editor content for {tabId} */}</div>
    </WorkspacePanel>
  )}
/>`

const SPLIT_CODE = `import { useState } from "react"
import { FileText, Terminal } from "lucide-react"
import { Workspace } from "@/components/ui/workspace"
import { WorkspacePanel } from "@/components/ui/workspace-panel"
import { WorkspaceTabs } from "@/components/ui/workspace-tabs"

function EditorWithTerminal({ tabId }: { tabId: string }) {
  const [terminalId, setTerminalId] = useState("bash")

  return (
    <WorkspacePanel>
      <div className="flex h-full items-center justify-center">
        <p className="font-mono text-sm text-muted-foreground">{tabId}</p>
      </div>
      <WorkspaceTabs
        tabs={[
          { id: "bash", title: "bash",        icon: <Terminal />, pinned: true },
          { id: "npm",  title: "npm run dev", icon: <Terminal /> },
        ]}
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

export function MySplitPanel() {
  return (
    <Workspace
      initialPanes={[{
        id: "editor",
        tabs: [
          { id: "main.tsx", title: "main.tsx", icon: <FileText />, pinned: true },
          { id: "app.tsx",  title: "app.tsx",  icon: <FileText /> },
        ],
      }]}
      renderTabContent={(_paneId, tabId) => <EditorWithTerminal tabId={tabId} />}
    />
  )
}`

const PANEL_PROPS = [
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description:
      "One or two <WorkspaceTabs> instances. Two children render in a vertically resizable split.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes applied to the root element.",
  },
]

export function WorkspacePanelPage() {
  useDocumentTitle("Workspace Panel")

  return (
    <article className="space-y-12">

      <div>
        <p className="mb-1 text-sm text-muted-foreground">Components</p>
        <h1 className="mb-3 text-3xl font-bold">Workspace Panel</h1>
        <p className="text-muted-foreground">
          A layout component used inside{" "}
          <code className="font-mono text-xs">&lt;Workspace&gt;</code>'s{" "}
          <code className="font-mono text-xs">renderTabContent</code> to split a
          pane's content area vertically. One child fills the pane; two children
          stack with a drag-to-resize handle between them. Drag-to-reorder and
          cross-pane transfers work automatically via the parent{" "}
          <code className="font-mono text-xs">Workspace</code> context.
        </p>
      </div>

      <ComponentPreview name="workspace-panel-single" code={PREVIEW_CODE} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Installation</h2>
        <CodeTabs
          cli="npx shadcn@latest add jayclydeTags/workspaceui/workspace-panel"
          manual={
            <Steps>
              <Step>Install dependencies</Step>
              <CodeBlock
                code="npm install @base-ui/react lucide-react react-resizable-panels"
                lang="bash"
              />
              <Step>Copy the component into your project</Step>
              <ComponentSource name="workspace-panel" />
            </Steps>
          }
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Usage</h2>
        <CodeBlock code={USAGE_IMPORT} lang="tsx" />
        <CodeBlock code={USAGE_CODE} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Split Panel</h2>
        <p className="text-sm text-muted-foreground">
          Pass two children to{" "}
          <code className="font-mono text-xs">WorkspacePanel</code> to get a
          vertically resizable split — ideal for an editor above and a terminal
          strip below. The bottom child is typically a{" "}
          <code className="font-mono text-xs">WorkspaceTabs</code> for secondary
          content like terminal sessions or output panels.
        </p>
        <ComponentPreview name="workspace-panel-split" code={SPLIT_CODE} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Composition</h2>
        <ComponentTree
          description="Compose WorkspacePanel with WorkspaceTabs:"
          root={{
            name: "WorkspacePanel",
            children: [
              {
                name: "WorkspaceTabs (top)",
                children: [{ name: "children (content area)" }],
              },
              {
                name: "WorkspaceTabs (bottom, optional)",
                children: [{ name: "children (content area)" }],
              },
            ],
          }}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">API Reference</h2>
        <div className="space-y-3">
          <h3 className="text-base font-medium">WorkspacePanel</h3>
          <PropsTable props={PANEL_PROPS} />
        </div>
      </section>

    </article>
  )
}
