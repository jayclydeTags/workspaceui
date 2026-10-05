"use client"

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Page } from "@/registry/bases/base/workspaceui/page"

export function PageWithBreadcrumbsDemo() {
  return (
    <div className="h-[240px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <Page.Root>
        <Page.Header>
          <Page.Heading>
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
