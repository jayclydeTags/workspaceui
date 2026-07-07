"use client"

import * as React from "react"
import { BarChart2, FileText, LayoutDashboard, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Workspace,
  type WorkspaceHandle,
  type WorkspaceTabDef,
} from "@/registry/bases/base/workspaceui/workspace"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar, NAV_ITEMS } from "@/registry/bases/base/blocks/dashboard/components/app-sidebar"
import {
  DashboardContent,
  PlaceholderContent,
} from "@/registry/bases/base/blocks/dashboard/components/dashboard-content"

const INITIAL_PANES = [
  {
    id: "main",
    tabs: [
      {
        id: "dashboard",
        title: "Dashboard",
        icon: <LayoutDashboard className="size-3.5" />,
        pinned: true,
      },
    ],
  },
]

// ponytail: TAB_CONTENT at module level avoids re-creating ReactNodes on each render
const TAB_CONTENT: Record<string, React.ReactNode> = {
  dashboard: <DashboardContent />,
  documents: <PlaceholderContent Icon={FileText} title="Documents" />,
  analytics: <PlaceholderContent Icon={BarChart2} title="Analytics" />,
  settings: <PlaceholderContent Icon={Settings} title="Settings" />,
}

export function Dashboard({ className }: { className?: string }) {
  const workspaceRef = React.useRef<WorkspaceHandle>(null)

  function openTab(item: (typeof NAV_ITEMS)[number]) {
    const tab: WorkspaceTabDef = {
      id: item.id,
      title: item.title,
      icon: <item.Icon className="size-3.5" />,
      pinned: item.pinned,
    }
    workspaceRef.current?.openTabInPane("main", tab)
  }

  return (
    <SidebarProvider className={cn("h-full min-h-0", className)}>
      <AppSidebar onNavClick={openTab} />
      <SidebarInset>
        <Workspace
          ref={workspaceRef}
          initialPanes={INITIAL_PANES}
          renderTabContent={(_paneId, tabId) =>
            TAB_CONTENT[tabId] ?? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                {tabId}
              </div>
            )
          }
          className="min-h-0 flex-1"
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
