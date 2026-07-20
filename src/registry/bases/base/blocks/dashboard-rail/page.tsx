"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Workspace,
  type WorkspaceHandle,
  type WorkspaceTabDef,
} from "@/registry/bases/base/workspaceui/workspace"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/registry/bases/base/blocks/dashboard-rail/components/dashboard-sidebar"
import { type AppId } from "@/registry/bases/base/blocks/dashboard-rail/components/app-rail"
import { APPS_NAV, type NavItem } from "@/registry/bases/base/blocks/dashboard-rail/components/nav-sidebar"
import {
  DashboardContent,
  PlaceholderContent,
} from "@/registry/bases/base/blocks/dashboard-rail/components/dashboard-content"

const DefaultTabIcon = APPS_NAV.workspace[0].Icon

const INITIAL_PANES = [
  {
    id: "main",
    tabs: [
      {
        id: "dashboard",
        title: "Dashboard",
        icon: <DefaultTabIcon className="size-3.5" />,
        pinned: true,
      },
    ],
  },
]

// ponytail: TAB_CONTENT built once from APPS_NAV, avoids hand-duplicating icons/titles per tab id
const ALL_NAV_ITEMS = [...APPS_NAV.workspace, ...APPS_NAV.email]
const TAB_CONTENT: Record<string, React.ReactNode> = Object.fromEntries(
  ALL_NAV_ITEMS.map((item) => [
    item.id,
    item.id === "dashboard" ? (
      <DashboardContent />
    ) : (
      <PlaceholderContent Icon={item.Icon} title={item.title} />
    ),
  ])
)

export function DashboardRail({ className }: { className?: string }) {
  const workspaceRef = React.useRef<WorkspaceHandle>(null)
  const [activeAppId, setActiveAppId] = React.useState<AppId>("workspace")
  const [activeId, setActiveId] = React.useState<string>("dashboard")

  const navItems = APPS_NAV[activeAppId]

  function openTab(item: NavItem) {
    const tab: WorkspaceTabDef = {
      id: item.id,
      title: item.title,
      icon: <item.Icon className="size-3.5" />,
      pinned: item.pinned,
    }
    workspaceRef.current?.openTabInPane("main", tab)
    setActiveId(item.id)
  }

  function selectApp(appId: AppId) {
    setActiveAppId(appId)
    const items = APPS_NAV[appId]
    openTab(items.find((item) => item.pinned) ?? items[0])
  }

  const activeTitle = navItems.find((item) => item.id === activeId)?.title ?? navItems[0].title

  return (
    <SidebarProvider className={cn("h-full min-h-0", className)}>
      <DashboardSidebar
        activeAppId={activeAppId}
        onAppSelect={selectApp}
        navTitle={activeTitle}
        navItems={navItems}
        activeId={activeId}
        onNavClick={openTab}
      />
      <SidebarInset>
        <header className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-3 md:hidden">
          <SidebarTrigger />
        </header>
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
