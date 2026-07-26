"use client"

import { Download, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Page } from "@/registry/bases/base/workspaceui/page"

export function PageWithActionsGroupDemo() {
  return (
    <div className="h-[240px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
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
    </div>
  )
}
