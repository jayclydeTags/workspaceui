import { Link } from "react-router"
import { ArrowRight } from "lucide-react"

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

export default function HomePage() {
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
            <GithubIcon className="size-4" />
            GitHub
          </a>
        </div>

        {/* Install snippet */}
        <div className="mx-auto max-w-lg">
          <DynamicCodeBlock lang="bash" code="npx shadcn@latest add jayclydeTags/workspaceui/workspace-tabs" />
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
