"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BarChartIcon,
  File01Icon,
  Setting06Icon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  AppSidebar,
  NAV_ITEMS,
} from "@/registry/bases/base/blocks/dashboard-01/components/app-sidebar"
import {
  EmptyContent,
  PlaceholderContent,
} from "@/registry/bases/base/blocks/dashboard-01/components/dashboard-content"
import { DashboardHeader } from "@/registry/bases/base/blocks/dashboard-01/components/dashboard-header"

// ponytail: CONTENT at module level avoids re-creating ReactNodes on each render
const CONTENT: Record<string, React.ReactNode> = {
  dashboard: <EmptyContent />,
  documents: (
    <PlaceholderContent
      Icon={(props) => (
        <HugeiconsIcon icon={File01Icon} strokeWidth={2} {...props} />
      )}
      title="Documents"
    />
  ),
  analytics: (
    <PlaceholderContent
      Icon={(props) => (
        <HugeiconsIcon icon={BarChartIcon} strokeWidth={2} {...props} />
      )}
      title="Analytics"
    />
  ),
  settings: (
    <PlaceholderContent
      Icon={(props) => (
        <HugeiconsIcon icon={Setting06Icon} strokeWidth={2} {...props} />
      )}
      title="Settings"
    />
  ),
}

export function Dashboard01({ className }: { className?: string }) {
  const [activeId, setActiveId] = React.useState<string>(NAV_ITEMS[0].id)
  const activeTitle =
    NAV_ITEMS.find((item) => item.id === activeId)?.title ?? activeId

  return (
    <SidebarProvider className={cn("h-full min-h-0", className)}>
      <AppSidebar
        activeId={activeId}
        onNavClick={(item) => setActiveId(item.id)}
      />
      <SidebarInset>
        <DashboardHeader title={activeTitle} />
        <div className="min-h-0 flex-1">
          {CONTENT[activeId] ?? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              {activeId}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
