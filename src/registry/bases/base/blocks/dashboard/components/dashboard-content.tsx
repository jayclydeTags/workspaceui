import * as React from "react"

import { Page } from "@/registry/bases/base/workspaceui/page"

export function EmptyContent() {
  return (
    <div className="h-full p-6">
      <div className="h-full rounded-lg border border-dashed border-border bg-muted/50" />
    </div>
  )
}

export function PlaceholderContent({
  Icon,
  title,
}: {
  Icon: React.ComponentType<{ className?: string }>
  title: string
}) {
  return (
    <Page.Root>
      <Page.Header>
        <Page.Heading>
          <Page.Title>{title}</Page.Title>
        </Page.Heading>
      </Page.Header>
      <Page.Content>
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <Icon className="size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </Page.Content>
    </Page.Root>
  )
}
