import { ExternalLink } from "lucide-react"

import { useDocumentTitle } from "@/lib/use-document-title"

const BLOCKS = [
  {
    id: "dashboard",
    title: "Dashboard",
    description:
      "Overview page with stats cards, recent activity, and quick-action shortcuts.",
  },
  {
    id: "inbox",
    title: "Inbox",
    description:
      "Multi-view email client layout with inbox, starred, sent, drafts, and trash.",
  },
  {
    id: "analytics",
    title: "Analytics",
    description:
      "Data visualisation dashboard with charts, KPI cards, and date-range controls.",
  },
  {
    id: "calendar",
    title: "Calendar",
    description:
      "Month/week calendar view for scheduling and event management.",
  },
  {
    id: "documents",
    title: "Documents",
    description:
      "File browser with list/grid toggle, breadcrumb navigation, and search.",
  },
  {
    id: "settings",
    title: "Settings",
    description:
      "Preferences panel with sidebar navigation, form controls, and sections.",
  },
]

export function BlocksPage() {
  useDocumentTitle("Blocks")

  return (
    <article className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Blocks</h1>
        <p className="text-muted-foreground">
          Full-page layout examples built with the Workspace component. Each
          block demonstrates a real-world application page rendered inside a
          workspace pane. View the live demo app to see them in action.
        </p>
      </div>

      <div className="not-prose">
        <a
          href="https://github.com/jayclydeTags/workspaceui"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <ExternalLink className="size-4" />
          View live demo on GitHub
        </a>
      </div>

      <div className="not-prose grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BLOCKS.map((block) => (
          <div
            key={block.id}
            className="rounded-xl border border-border p-5"
          >
            <div className="mb-3 aspect-video rounded-md bg-muted/50 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">{block.title}</span>
            </div>
            <h3 className="mb-1 font-semibold text-foreground">{block.title}</h3>
            <p className="text-sm text-muted-foreground">{block.description}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3 text-sm text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">Using blocks</h2>
        <p>
          Each block is a standard React component that uses{" "}
          <code className="font-mono">useWorkspace()</code> to open new tabs
          and communicate with its parent workspace. Clone the repository and
          copy any block page into your project:
        </p>
        <ol className="list-decimal space-y-1 pl-4">
          <li>
            Install the{" "}
            <a href="/docs/components/workspace" className="underline underline-offset-2">
              Workspace
            </a>{" "}
            component.
          </li>
          <li>
            Copy the page file from{" "}
            <code className="font-mono">src/pages/</code> in the repository.
          </li>
          <li>
            Wire it into your workspace's{" "}
            <code className="font-mono">renderTabContent</code> callback.
          </li>
        </ol>
      </section>
    </article>
  )
}
