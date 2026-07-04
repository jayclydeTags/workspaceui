"use client"

import { Settings, Download, Share2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Page } from "@/registry/bases/base/workspaceui/page"

function PreviewFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[240px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
      {children}
    </div>
  )
}

export function PageDefaultDemo() {
  return (
    <PreviewFrame>
      <Page title="Settings" subtitle="Manage your account">
        <p className="text-sm text-muted-foreground">Page content goes here.</p>
      </Page>
    </PreviewFrame>
  )
}

export function PageWithSubtitleDemo() {
  return (
    <PreviewFrame>
      <Page title="Billing" subtitle="Manage your subscription and invoices">
        <p className="text-sm text-muted-foreground">Page content goes here.</p>
      </Page>
    </PreviewFrame>
  )
}

export function PageWithBreadcrumbsDemo() {
  return (
    <PreviewFrame>
      <Page breadcrumbs={[{ label: "Settings", href: "#" }, { label: "Billing" }]}>
        <p className="text-sm text-muted-foreground">Page content goes here.</p>
      </Page>
    </PreviewFrame>
  )
}

export function PageWithBadgeAndActionsDemo() {
  return (
    <PreviewFrame>
      <Page
        visual={<Settings className="mt-0.5 size-5 text-muted-foreground" />}
        title="Billing"
        badge={<Badge variant="secondary">Beta</Badge>}
        actions={<Button size="sm">Save changes</Button>}
      >
        <p className="text-sm text-muted-foreground">Page content goes here.</p>
      </Page>
    </PreviewFrame>
  )
}

export function PageWithoutHeaderDemo() {
  return (
    <PreviewFrame>
      <Page hasHeader={false} hasPadding>
        <p className="text-sm text-muted-foreground">Full-bleed content, no header.</p>
      </Page>
    </PreviewFrame>
  )
}

export function PageTitleOnlyDemo() {
  return (
    <PreviewFrame>
      <Page title="Dashboard">
        <p className="text-sm text-muted-foreground">Page content goes here.</p>
      </Page>
    </PreviewFrame>
  )
}

export function PageWithActionsGroupDemo() {
  return (
    <PreviewFrame>
      <Page
        title="Report"
        subtitle="Q3 2026 performance"
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Share2 className="size-4" />
              Share
            </Button>
            <Button size="sm">
              <Download className="size-4" />
              Export
            </Button>
          </div>
        }
      >
        <p className="text-sm text-muted-foreground">Page content goes here.</p>
      </Page>
    </PreviewFrame>
  )
}

export function PageScrollDemo() {
  return (
    <PreviewFrame>
      <Page title="Changelog" subtitle="The header stays fixed while content scrolls" hasPadding>
        <div className="space-y-4">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="rounded-md border border-border p-3">
              <p className="text-sm font-medium">Release {12 - i}.0</p>
              <p className="text-sm text-muted-foreground">Notes for this release.</p>
            </div>
          ))}
        </div>
      </Page>
    </PreviewFrame>
  )
}

export function PageFullDemo() {
  return (
    <PreviewFrame>
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
    </PreviewFrame>
  )
}