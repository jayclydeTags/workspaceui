"use client"

import { Settings } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Page } from "@/registry/bases/base/workspaceui/page"

export function PageLiveDemo() {
  return (
    <div className="h-[300px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Page
        visual={<Settings className="mt-0.5 size-5 text-muted-foreground" />}
        breadcrumbs={[{ label: "Settings", href: "#" }, { label: "Billing" }]}
        subtitle="Manage your subscription and invoices"
        badge={<Badge variant="secondary">Beta</Badge>}
        actions={<Button size="sm">Save changes</Button>}
        hasPadding
      >
        <p className="text-sm text-muted-foreground">Page content goes here.</p>
      </Page>
    </div>
  )
}