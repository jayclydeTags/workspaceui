import { Link } from "react-router-dom"

import { useDocumentTitle } from "@/lib/use-document-title"
import { InlineCode } from "@/components/code-block"

export function IntroductionPage() {
  useDocumentTitle("Introduction")

  return (
    <article className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Introduction</h1>
        <p className="text-muted-foreground">
          WorkspaceUI is a collection of open-source React components for
          building IDE-style workspace interfaces.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What is WorkspaceUI?</h2>
        <p className="text-muted-foreground">
          WorkspaceUI provides high-quality, accessible components for
          multi-pane workspace layouts. Built on top of Tailwind CSS and
          distributed via the shadcn registry model — meaning you own the code
          and can customize it freely.
        </p>
        <p className="text-muted-foreground">
          Components are distributed as source files, not as an npm package.
          When you add a component, it lands in your project as editable source
          code.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Quick install</h2>
        <p className="text-muted-foreground">
          Use the shadcn CLI to add any component directly to your project:
        </p>
        <InlineCode code="npx shadcn@latest add jayclydeTags/workspaceui/workspace-tabs" />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Components</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "Workspace Tabs",
              description: "Chrome-style scrollable tab strip",
              href: "/docs/components/workspace-tabs",
            },
            {
              title: "Workspace",
              description: "Multi-pane IDE-style layout manager",
              href: "/docs/components/workspace",
            },
          ].map((c) => (
            <Link
              key={c.href}
              to={c.href}
              className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/40"
            >
              <p className="font-medium">{c.title}</p>
              <p className="text-sm text-muted-foreground">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  )
}
