"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { defineStory } from "@/components/studio/studio"
import { Page } from "@/registry/bases/base/workspaceui/page"

interface Args {
  title: string
  subtitle: string
  breadcrumbs: boolean
  badge: string
  actionLabel: string
  hasHeader: boolean
  hasPadding: boolean
}

function Preview({
  title,
  subtitle,
  breadcrumbs,
  badge,
  actionLabel,
  hasHeader,
  hasPadding,
}: Args) {
  return (
    <div className="h-72 w-full overflow-hidden rounded-lg border bg-background">
      <Page
        title={title}
        subtitle={subtitle || undefined}
        breadcrumbs={
          breadcrumbs
            ? [{ label: "Settings", href: "#" }, { label: title }]
            : undefined
        }
        badge={badge ? <Badge variant="secondary">{badge}</Badge> : undefined}
        actions={
          actionLabel ? <Button size="sm">{actionLabel}</Button> : undefined
        }
        hasHeader={hasHeader}
        hasPadding={hasPadding}
      >
        <p className="text-sm text-muted-foreground">Page content goes here.</p>
      </Page>
    </div>
  )
}

export default defineStory<Args>({
  args: {
    title: "Billing",
    subtitle: "Manage your subscription and invoices",
    breadcrumbs: false,
    badge: "",
    actionLabel: "Save changes",
    hasHeader: true,
    hasPadding: true,
  },
  controls: {
    title: {
      type: "text",
      description:
        "Ignored when breadcrumbs are on: the last crumb is the title.",
    },
    subtitle: { type: "text" },
    breadcrumbs: {
      group: "style",
      type: "boolean",
      description: "Breadcrumb trail in place of the title.",
    },
    badge: {
      type: "text",
      description: "Rendered as a Badge next to the title.",
    },
    actionLabel: {
      type: "text",
      description: "Rendered as a Button in `actions`.",
    },
    hasHeader: {
      group: "style",
      type: "boolean",
      description: "Off removes the header (and the h1).",
    },
    hasPadding: {
      group: "style",
      type: "boolean",
      description: "Padding around the content area.",
    },
  },
  preview: Preview,
})
