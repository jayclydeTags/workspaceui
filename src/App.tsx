import * as React from "react"

import { Workspace, type WorkspaceHandle } from "@/registry/ui/workspace"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

import { DashboardPage } from "@/pages/dashboard-page"
import { InboxPage } from "@/pages/inbox-page"
import { AnalyticsPage } from "@/pages/analytics-page"
import { CalendarPage } from "@/pages/calendar-page"
import { DocumentsPage } from "@/pages/documents-page"
import { SettingsPage } from "@/pages/settings-page"

import { LayoutGridIcon } from "lucide-react"

// ── App ────────────────────────────────────────────────────────────────────

export function App() {
  const workspaceRef = React.useRef<WorkspaceHandle>(null)

  // Opens a tab in whichever pane the user last interacted with.
  // Falls back to "main" if no interaction has been recorded yet.
  const handleOpenTab = React.useCallback(
    (id: string, title: string, icon: React.ReactNode) => {
      const ws = workspaceRef.current
      const paneId = ws?.lastActivePaneId ?? "main"
      ws?.openTabInPane(paneId, { id, title, icon })
    },
    [],
  )

  const renderTabContent = (paneId: string, tabId: string): React.ReactNode => {
    switch (tabId) {
      case "dashboard":
        return <DashboardPage paneId={paneId} />
      case "inbox":
      case "starred":
      case "sent":
      case "drafts":
      case "trash":
        return <InboxPage view={tabId} />
      case "analytics":
        return <AnalyticsPage />
      case "calendar":
        return <CalendarPage />
      case "documents":
        return <DocumentsPage />
      case "settings":
        return <SettingsPage />
      default:
        return (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No content for "{tabId}"
          </div>
        )
    }
  }

  return (
    <TooltipProvider>
      <div className="h-screen overflow-hidden">
        <SidebarProvider>
          <AppSidebar onOpenTab={handleOpenTab} />
          <SidebarInset className="flex flex-col overflow-hidden">
            <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Workspace UI</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>

            <div className="min-h-0 flex-1 overflow-hidden">
              <Workspace
                ref={workspaceRef}
                initialPanes={[
                  {
                    id: "main",
                    tabs: [
                      { id: "dashboard", title: "Dashboard", icon: <LayoutGridIcon className="size-3.5" />, pinned: true },
                    ],
                    defaultActiveTabId: "dashboard",
                    defaultSize: 100,
                    minSize: 30,
                  },
                ]}
                renderTabContent={renderTabContent}
                className="h-full"
              />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  )
}

export default App
