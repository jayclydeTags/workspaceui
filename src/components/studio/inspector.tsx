"use client"

import type { ReactNode } from "react"

import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { CopyButton } from "@/components/docs/copy-button"
import { Control } from "@/components/studio/controls"
import { ApiReference } from "@/components/studio/api-reference"
import { useStudio } from "@/components/studio/studio-context"
import type { ControlDef } from "@/components/studio/types"

// One scrolling column, top to bottom: name, description, controls (props, then
// variations), install command, API reference.
export function Inspector() {
  const { slots, story, args, setArg, resetArgs } = useStudio()

  const controls = Object.entries(story?.controls ?? {}) as [
    string,
    ControlDef | undefined,
  ][]
  const props = controls.filter(([, def]) => def && def.group !== "style")
  const variations = controls.filter(([, def]) => def?.group === "style")

  const renderControls = (entries: typeof controls) =>
    entries.map(([name, def]) =>
      def ? (
        <Control
          key={name}
          name={name}
          def={def}
          value={args[name]}
          onChange={(value) => setArg(name, value)}
        />
      ) : null
    )

  // A single Reset restores every control, so it sits on the first section.
  const reset = (
    <Button variant="ghost" size="xs" onClick={resetArgs}>
      Reset
    </Button>
  )

  return (
    <aside
      aria-label="Component details"
      className="flex min-w-0 flex-col border-t lg:h-full lg:min-h-0 lg:overflow-y-auto lg:border-t-0"
    >
      <header className="flex flex-col gap-1.5 p-4">
        <h1 className="text-base font-semibold">{slots.title}</h1>
        {slots.description && (
          <p className="text-sm text-muted-foreground">{slots.description}</p>
        )}
      </header>

      {props.length > 0 && (
        <Section title="Props" action={reset}>
          {renderControls(props)}
        </Section>
      )}
      {variations.length > 0 && (
        <Section title="Variations" action={props.length === 0 ? reset : null}>
          {renderControls(variations)}
        </Section>
      )}

      <Section title="Installation">
        <div className="flex items-center gap-1 rounded-lg border bg-muted/40 py-1 ps-3 pe-1">
          <code className="min-w-0 flex-1 overflow-x-auto py-1 text-xs whitespace-nowrap">
            {slots.install}
          </code>
          <CopyButton value={slots.install} />
        </div>
      </Section>

      {slots.docsUrl && (
        <Section title="Documentation">
          <p className="text-sm text-muted-foreground">
            The full API, examples and accessibility notes live in the shadcn/ui
            docs.
          </p>
          <a
            href={slots.docsUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
          >
            View on ui.shadcn.com
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              strokeWidth={2}
              data-icon="inline-end"
            />
          </a>
        </Section>
      )}

      {slots.api.length > 0 && (
        <Section title="API reference">
          <ApiReference blocks={slots.api} />
        </Section>
      )}
    </aside>
  )
}

function Section({
  title,
  action,
  children,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 border-t p-4">
      <div className="flex min-h-6 items-center justify-between gap-2">
        <h2 className="text-sm font-medium">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}
