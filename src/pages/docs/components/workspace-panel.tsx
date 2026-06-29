import { useDocumentTitle } from "@/lib/use-document-title"
import { CodeBlock } from "@/components/code-block"
import { ComponentPreview } from "@/components/component-preview"
import { ComponentSource } from "@/components/component-source"
import { ComponentTree } from "@/components/component-tree"
import { CodeTabs } from "@/components/code-tabs"
import { Steps, Step } from "@/components/steps"
import { PropsTable } from "@/components/props-table"

const PREVIEW_CODE = `import { useState } from "react"
import { Home, FileText, Settings } from "lucide-react"
import { WorkspacePanel } from "@/components/ui/workspace-panel"
import { WorkspaceTabs } from "@/components/ui/workspace-tabs"

export function MyPanel() {
  const [activeId, setActiveId] = useState("home")

  return (
    <WorkspacePanel>
      <WorkspaceTabs
        tabs={[
          { id: "home", title: "Home", icon: <Home />, pinned: true },
          { id: "docs", title: "Docs", icon: <FileText />, badge: 2 },
          { id: "settings", title: "Settings", icon: <Settings /> },
        ]}
        activeTabId={activeId}
        onTabChange={setActiveId}
      >
        <div className="p-4">{activeId} content</div>
      </WorkspaceTabs>
    </WorkspacePanel>
  )
}`

const SPLIT_CODE = `import { WorkspacePanel } from "@/components/ui/workspace-panel"
import { WorkspaceTabs } from "@/components/ui/workspace-tabs"

<WorkspacePanel>
  <WorkspaceTabs tabs={editorTabs} activeTabId={editorId} onTabChange={setEditorId}>
    {/* editor content */}
  </WorkspaceTabs>
  <WorkspaceTabs tabs={terminalTabs} activeTabId={terminalId} onTabChange={setTerminalId}>
    {/* terminal content */}
  </WorkspaceTabs>
</WorkspacePanel>`

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
          A standalone panel that wraps one or two{" "}
          <code className="font-mono text-xs">WorkspaceTabs</code> instances. Two
          children stack vertically with a drag-to-resize handle between them. No
          drag-and-drop splitting — use{" "}
          <code className="font-mono text-xs">Workspace</code> for the full
          multi-panel layout.
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
        <CodeBlock
          code={`import { WorkspacePanel } from "@/components/ui/workspace-panel"\nimport { WorkspaceTabs } from "@/components/ui/workspace-tabs"`}
          lang="tsx"
        />
        <CodeBlock code={SPLIT_CODE} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Split Panel</h2>
        <p className="text-sm text-muted-foreground">
          Pass two <code className="font-mono text-xs">WorkspaceTabs</code> as
          children to get a vertically resizable split with a drag handle between
          them.
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
