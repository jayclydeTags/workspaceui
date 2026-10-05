"use client"

import { Page } from "@/registry/bases/base/workspaceui/page"

export function PageDefaultDemo() {
  return (
    <div className="h-[240px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Page.Root>
        <Page.Header>
          <Page.Heading>
            <Page.Title>Settings</Page.Title>
          </Page.Heading>
          <Page.Subtitle>Manage your account</Page.Subtitle>
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
