"use client"

import { Page } from "@/registry/bases/base/workspaceui/page"

export function PageScrollDemo() {
  return (
    <div className="h-[240px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Page.Root>
        <Page.Header>
          <Page.Heading>
            <Page.Title>Changelog</Page.Title>
          </Page.Heading>
          <Page.Subtitle>
            The header stays fixed while content scrolls
          </Page.Subtitle>
        </Page.Header>
        <Page.Content padded>
          <div className="space-y-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <p className="text-sm font-medium">Release {12 - i}.0</p>
                <p className="text-sm text-muted-foreground">
                  Notes for this release.
                </p>
              </div>
            ))}
          </div>
        </Page.Content>
      </Page.Root>
    </div>
  )
}
