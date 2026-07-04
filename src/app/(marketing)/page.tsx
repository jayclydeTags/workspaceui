import Link from "next/link"
import {
  ArrowRight,
  Accessibility,
  Copy,
  Move,
  Palette,
  Zap,
  Braces,
} from "lucide-react"

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
            href="/docs/getting-started/introduction"
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
          <DynamicCodeBlock lang="bash" code="npx shadcn@latest add jayclydeTags/workspaceui/workspace" />
        </div>
      </div>

      {/* Features */}
      <div className="mt-24 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: Copy,
            title: "Copy, own, adapt",
            description:
              "Distributed via shadcn's model — the code lands in your repo. No black-box package to fight, no version lock-in.",
          },
          {
            icon: Accessibility,
            title: "Accessible by default",
            description:
              "Built on Base UI primitives with full keyboard navigation and correct ARIA out of the box.",
          },
          {
            icon: Move,
            title: "Drag, drop & split",
            description:
              "Multi-pane layouts with cross-pane tab transfers and snap-zone splitting — an IDE workspace in a component.",
          },
          {
            icon: Palette,
            title: "Tailwind v4 themeable",
            description:
              "Styled with theme tokens, not hard-coded colors. Retheme to match your app by editing CSS variables.",
          },
          {
            icon: Braces,
            title: "Fully typed",
            description:
              "Strict TypeScript with exported prop interfaces, so autocomplete and type-checking work end to end.",
          },
          {
            icon: Zap,
            title: "Zero-config install",
            description:
              "One shadcn CLI command pulls the component and its dependencies straight from GitHub — no build step.",
          },
        ].map((item) => (
          <div key={item.title}>
            <div className="mb-3 inline-flex size-9 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground">
              <item.icon className="size-4.5" />
            </div>
            <h3 className="mb-1.5 font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Explore links */}
      <div className="mt-16 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/docs/components/workspace"
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
        >
          Browse components
          <ArrowRight className="size-3.5" />
        </Link>
        <Link
          href="/blocks"
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
        >
          Explore blocks
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </main>
  )
}
