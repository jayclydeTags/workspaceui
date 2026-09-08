"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BarChartIcon,
  DashboardSquare01Icon,
  Database01Icon,
  FileEditIcon,
  Folder01Icon,
  Home01Icon,
  Layers01Icon,
  TerminalIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import {
  WorkspaceTabs,
  type WorkspaceTab,
} from "@/registry/bases/base/workspaceui/workspace-tabs"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  AppSidebar,
  type SidebarNavItem,
} from "@/registry/bases/base/blocks/dashboard-shell/components/app-sidebar"
import {
  HomeContent,
  PlaceholderContent,
} from "@/registry/bases/base/blocks/dashboard-shell/components/dashboard-content"

const INITIAL_TABS: WorkspaceTab[] = [
  {
    id: "home",
    title: "Active Tab",
    icon: (
      <HugeiconsIcon icon={Home01Icon} strokeWidth={2} className="size-3.5" />
    ),
  },
  {
    id: "files",
    title: "Files",
    icon: (
      <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} className="size-3.5" />
    ),
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: (
      <HugeiconsIcon icon={TerminalIcon} strokeWidth={2} className="size-3.5" />
    ),
  },
]

// ponytail: TAB_CONTENT at module level avoids re-creating ReactNodes on each render
const TAB_CONTENT: Record<string, React.ReactNode> = {
  home: <HomeContent />,
  files: (
    <PlaceholderContent
      Icon={(props) => (
        <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} {...props} />
      )}
      title="Files"
    />
  ),
  terminal: (
    <PlaceholderContent
      Icon={(props) => (
        <HugeiconsIcon icon={TerminalIcon} strokeWidth={2} {...props} />
      )}
      title="Terminal"
    />
  ),
  dashboard: <HomeContent />,
  lifecycle: (
    <PlaceholderContent
      Icon={(props) => (
        <HugeiconsIcon icon={Layers01Icon} strokeWidth={2} {...props} />
      )}
      title="Lifecycle"
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
  projects: (
    <PlaceholderContent
      Icon={(props) => (
        <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} {...props} />
      )}
      title="Projects"
    />
  ),
  team: (
    <PlaceholderContent
      Icon={(props) => (
        <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} {...props} />
      )}
      title="Team"
    />
  ),
  "data-library": (
    <PlaceholderContent
      Icon={(props) => (
        <HugeiconsIcon icon={Database01Icon} strokeWidth={2} {...props} />
      )}
      title="Data Library"
    />
  ),
  reports: (
    <PlaceholderContent
      Icon={(props) => (
        <HugeiconsIcon icon={BarChartIcon} strokeWidth={2} {...props} />
      )}
      title="Reports"
    />
  ),
  "word-assistant": (
    <PlaceholderContent
      Icon={(props) => (
        <HugeiconsIcon icon={FileEditIcon} strokeWidth={2} {...props} />
      )}
      title="Word Assistant"
    />
  ),
}

const NAV_TAB_ICON: Record<string, typeof DashboardSquare01Icon> = {
  dashboard: DashboardSquare01Icon,
  lifecycle: Layers01Icon,
  analytics: BarChartIcon,
  projects: Folder01Icon,
  team: UserGroupIcon,
  "data-library": Database01Icon,
  reports: BarChartIcon,
  "word-assistant": FileEditIcon,
}

export function DashboardShell({ className }: { className?: string }) {
  const [tabs, setTabs] = React.useState<WorkspaceTab[]>(INITIAL_TABS)
  const [activeTabId, setActiveTabId] = React.useState("home")

  function openTab(item: SidebarNavItem) {
    const Icon = NAV_TAB_ICON[item.id]
    setTabs((prev) =>
      prev.some((tab) => tab.id === item.id)
        ? prev
        : [
            ...prev,
            {
              id: item.id,
              title: item.title,
              icon: Icon ? (
                <HugeiconsIcon
                  icon={Icon}
                  strokeWidth={2}
                  className="size-3.5"
                />
              ) : undefined,
            },
          ]
    )
    setActiveTabId(item.id)
  }

  function closeTab(id: string) {
    setTabs((prev) => {
      const next = prev.filter((tab) => tab.id !== id)
      if (activeTabId === id) {
        setActiveTabId(next[next.length - 1]?.id ?? "")
      }
      return next
    })
  }

  return (
    // A single global tab strip spans the full shell width, with the sidebar
    // and its content living inside the active tab's panel below it — not
    // beside a per-pane strip. `contain-layout` gives the panel a CSS
    // containing block so the Sidebar's `fixed` aside is scoped to this
    // panel instead of escaping to the shell's outer boundary.
    <WorkspaceTabs
      tabs={tabs}
      activeTabId={activeTabId}
      onTabChange={setActiveTabId}
      onTabClose={closeTab}
      className={cn("h-full min-h-0", className)}
    >
      <div className="relative h-full contain-layout">
        <SidebarProvider className="h-full min-h-0">
          <AppSidebar activeId={activeTabId} onNavClick={openTab} />
          <SidebarInset className="min-h-0">
            {TAB_CONTENT[activeTabId] ?? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                {activeTabId}
              </div>
            )}
          </SidebarInset>
        </SidebarProvider>
      </div>
    </WorkspaceTabs>
  )
}
