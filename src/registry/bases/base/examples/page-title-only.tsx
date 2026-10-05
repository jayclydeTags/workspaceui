"use client"

import { Page } from "@/registry/bases/base/workspaceui/page"

export function PageTitleOnlyDemo() {
  return (
    <div className="h-[240px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Page.Root>
        <Page.Header>
          <Page.Heading>
            <Page.Title>Dashboard</Page.Title>
          </Page.Heading>
        </Page.Header>
        <Page.Content>
          <p className="text-sm text-muted-foreground">
            Page content goes here.
          </p>
        </Page.Content>
      </Page.Root>
    </div>
  )
}
