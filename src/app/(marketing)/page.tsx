import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  AccessibilityIcon,
  Copy01Icon,
  Move01Icon,
  ColorsIcon,
  FlashIcon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons"

import { DynamicCodeBlock } from "@/components/docs/dynamic-codeblock"
import { GithubIcon } from "@/components/site/github-icon"

// Answers are checked against the repo (LICENSE, registry.json, package.json):
// keep them true when those change.
const FAQ = [
  {
    question: "Is WorkspaceUI free for commercial projects?",
    answer:
      "Yes. It's MIT licensed, so you can use, modify, and ship it in commercial work. Keep the copyright notice with the code you copy.",
  },
  {
    question: "How do I install a component?",
    answer:
      "Run the shadcn CLI with the component's name, for example `npx shadcn@latest add jayclydeTags/workspaceui/workspace`. It also works with pnpm dlx, yarn dlx, or bun x. Every component page shows its exact command.",
  },
  {
    question: "What does my project need?",
    answer:
      "A project set up for shadcn/ui with React 19 and Tailwind CSS v4. Components pull in what they use, such as Base UI, TanStack Table, dnd-kit, or react-resizable-panels, and the CLI installs those dependencies for you.",
  },
  {
    question: "Can I change the design and behavior?",
    answer:
      "Yes. The source is copied into your repo, so you own it: edit the markup, styles, and logic directly. Styling uses your theme tokens, so most restyling is a CSS-variable change. The few components that use success or warning colors add those tokens for you.",
  },
  {
    question: "Can I try a component before installing it?",
    answer:
      "Yes. Each component page is a live playground where you can change its props and variations, resize the canvas, and read the full API. Blocks open as full-page previews with desktop, tablet, and mobile widths.",
  },
  {
    question: "What's the difference between components and blocks?",
    answer:
      "Components are the building pieces: tabs, a data grid, a board column, a usage meter. Blocks are complete layouts assembled from them and from shadcn/ui, such as login flows, dashboards, and settings screens.",
  },
]

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
          with Tailwind CSS and shadcn&apos;s distribution model. Copy, own, and
          adapt.
        </p>

        <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/components"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse components
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-4"
            />
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
          <DynamicCodeBlock
            lang="bash"
            code="npx shadcn@latest add jayclydeTags/workspaceui/workspace"
          />
        </div>
      </div>

      {/* Features */}
      <div className="mt-24 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: (props: React.ComponentProps<"svg">) => (
              <HugeiconsIcon icon={Copy01Icon} {...props} strokeWidth={2} />
            ),
            title: "Copy, own, adapt",
            description:
              "Distributed via shadcn's model — the code lands in your repo. No black-box package to fight, no version lock-in.",
          },
          {
            icon: (props: React.ComponentProps<"svg">) => (
              <HugeiconsIcon
                icon={AccessibilityIcon}
                {...props}
                strokeWidth={2}
              />
            ),
            title: "Accessible by default",
            description:
              "Built on Base UI primitives with full keyboard navigation and correct ARIA out of the box.",
          },
          {
            icon: (props: React.ComponentProps<"svg">) => (
              <HugeiconsIcon icon={Move01Icon} {...props} strokeWidth={2} />
            ),
            title: "Drag, drop & split",
            description:
              "Multi-pane layouts with cross-pane tab transfers and snap-zone splitting — an IDE workspace in a component.",
          },
          {
            icon: (props: React.ComponentProps<"svg">) => (
              <HugeiconsIcon icon={ColorsIcon} {...props} strokeWidth={2} />
            ),
            title: "Tailwind v4 themeable",
            description:
              "Styled with theme tokens, not hard-coded colors. Retheme to match your app by editing CSS variables.",
          },
          {
            icon: (props: React.ComponentProps<"svg">) => (
              <HugeiconsIcon icon={SourceCodeIcon} {...props} strokeWidth={2} />
            ),
            title: "Fully typed",
            description:
              "Strict TypeScript with exported prop interfaces, so autocomplete and type-checking work end to end.",
          },
          {
            icon: (props: React.ComponentProps<"svg">) => (
              <HugeiconsIcon icon={FlashIcon} {...props} strokeWidth={2} />
            ),
            title: "Zero-config install",
            description:
              "One shadcn CLI command pulls the component and its dependencies straight from GitHub — no build step.",
          },
        ].map((item) => (
          <div key={item.title}>
            <div className="mb-3 inline-flex size-9 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground">
              <item.icon className="size-4.5" />
            </div>
            <h3 className="mb-1.5 font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <section
        aria-labelledby="faq-heading"
        className="mx-auto mt-24 max-w-3xl"
      >
        <h2
          id="faq-heading"
          className="mb-8 text-center text-2xl font-semibold tracking-tight text-foreground"
        >
          Frequently asked questions
        </h2>
        <div className="divide-y divide-border border-y border-border">
          {FAQ.map((item) => (
            <div key={item.question} className="py-5">
              <h3 className="mb-1.5 font-semibold text-foreground">
                {item.question}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.answer.split("`").map((part, i) =>
                  i % 2 === 1 ? (
                    <code
                      key={i}
                      className="rounded bg-muted px-1 py-0.5 text-xs break-words text-foreground"
                    >
                      {part}
                    </code>
                  ) : (
                    part
                  )
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore links */}
      <div className="mt-16 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/blocks"
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
        >
          Explore blocks
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            className="size-3.5"
          />
        </Link>
      </div>
    </main>
  )
}
