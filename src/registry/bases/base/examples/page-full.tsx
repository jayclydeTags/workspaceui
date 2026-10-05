"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Setting06Icon } from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Page } from "@/registry/bases/base/workspaceui/page"

export function PageFullDemo() {
  return (
    <div className="h-[240px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Page.Root>
        <Page.Header>
          <Page.Heading>
            <Page.Visual>
              <HugeiconsIcon
                icon={Setting06Icon}
                strokeWidth={2}
                className="mt-0.5 size-5 text-muted-foreground"
              />
            </Page.Visual>
            <Page.Breadcrumbs>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Billing</BreadcrumbPage>
              </BreadcrumbItem>
            </Page.Breadcrumbs>
            <Page.Title className="sr-only">Billing</Page.Title>
            <Badge variant="secondary">Beta</Badge>
          </Page.Heading>
          <Page.Actions>
            <Button size="sm">Save changes</Button>
          </Page.Actions>
          <Page.Subtitle>Manage your subscription and invoices</Page.Subtitle>
        </Page.Header>
        <Page.Content padded>
          <p className="text-sm text-muted-foreground">
            Page content goes here.
          </p>
        </Page.Content>
      </Page.Root>
    </div>
  )
}
