"use client"

import { Page } from "@/registry/bases/base/workspaceui/page"

export function PageWithoutHeaderDemo() {
  return (
    <div className="h-[240px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Page.Root>
        <Page.Content padded>
          <p className="text-sm text-muted-foreground">
            Full-bleed content, no header.
          </p>
        </Page.Content>
      </Page.Root>
    </div>
  )
}
