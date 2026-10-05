"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { defineStory } from "@/components/studio/studio"
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
      <Page.Root>
        {hasHeader && (
          <Page.Header>
            <Page.Heading>
              {breadcrumbs ? (
                <>
                  <Page.Breadcrumbs>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </Page.Breadcrumbs>
                  <Page.Title className="sr-only">{title}</Page.Title>
                </>
              ) : (
                <Page.Title>{title}</Page.Title>
              )}
              {badge ? <Badge variant="secondary">{badge}</Badge> : null}
            </Page.Heading>
            {actionLabel ? (
              <Page.Actions>
                <Button size="sm">{actionLabel}</Button>
              </Page.Actions>
            ) : null}
            {subtitle ? <Page.Subtitle>{subtitle}</Page.Subtitle> : null}
          </Page.Header>
        )}
        <Page.Content padded={hasPadding}>
          <p className="text-sm text-muted-foreground">
            Page content goes here.
          </p>
        </Page.Content>
      </Page.Root>
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
