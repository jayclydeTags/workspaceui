"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Setting06Icon } from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Page } from "@/registry/bases/base/workspaceui/page"

export function PageWithBadgeAndActionsDemo() {
  return (
    <div className="h-[240px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Page
        visual={
          <HugeiconsIcon
            icon={Setting06Icon}
            strokeWidth={2}
            className="mt-0.5 size-5 text-muted-foreground"
          />
        }
        title="Billing"
        badge={<Badge variant="secondary">Beta</Badge>}
        actions={<Button size="sm">Save changes</Button>}
      >
        <p className="text-sm text-muted-foreground">Page content goes here.</p>
      </Page>
    </div>
  )
}
