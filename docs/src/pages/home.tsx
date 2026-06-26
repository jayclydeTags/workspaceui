import { Link } from "react-router-dom"
import { ArrowRight, Github } from "lucide-react"

import { InlineCode } from "@/components/code-block"

export function HomePage() {
  return (
    <main className="mx-auto max-w-screen-xl px-4 py-20 md:px-6">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
          Open Source
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Build workspace UIs,{" "}
          <span className="text-muted-foreground">faster.</span>
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Open-source, accessible, and customizable workspace components. Built
          with Tailwind CSS and shadcn&apos;s distribution model. Copy, own,
          and adapt.
        </p>

        <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/docs/getting-started/introduction"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get started
            <ArrowRight className="size-4" />
          </Link>
          <a
            href="https://github.com/jayclydeTags/workspaceui"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Github className="size-4" />
            GitHub
          </a>
        </div>

        {/* Install snippet */}
        <div className="mx-auto max-w-lg">
          <InlineCode code="npx shadcn@latest add https://workspaceui.vercel.app/r/workspace-tabs.json" />
        </div>
      </div>

      {/* Component cards */}
      <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Workspace Tabs",
            description:
              "Chrome-style scrollable tab strip with closeable tabs, unread badges, and macOS-style curved connectors.",
            href: "/docs/components/workspace-tabs",
          },
          {
            title: "Workspace",
            description:
              "Multi-pane IDE-like layout with tab drag/drop, cross-pane transfers, and snap-zone splitting.",
            href: "/docs/components/workspace",
          },
          {
            title: "Blocks",
            description:
              "Full page layout examples — dashboard, inbox, analytics, calendar, documents, and settings.",
            href: "/docs/blocks",
          },
        ].map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="group rounded-xl border border-border p-6 transition-colors hover:border-foreground/20 hover:bg-muted/30"
          >
            <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
              View component
              <ArrowRight className="size-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
