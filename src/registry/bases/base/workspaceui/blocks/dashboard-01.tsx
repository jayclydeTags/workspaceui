import * as React from "react"
import { BarChart2, FileText, LayoutDashboard, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Workspace,
  type WorkspaceHandle,
  type WorkspaceTabDef,
} from "@/registry/bases/base/workspaceui/workspace"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const NAV_ITEMS = [
  { id: "dashboard", title: "Dashboard", Icon: LayoutDashboard, pinned: true },
  { id: "documents", title: "Documents", Icon: FileText, pinned: false },
  { id: "analytics", title: "Analytics", Icon: BarChart2, pinned: false },
  { id: "settings", title: "Settings", Icon: Settings, pinned: false },
] as const

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

export function Dashboard01({ className }: { className?: string }) {
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
        <header className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-3">
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
          className="flex-1 min-h-0"
        />
      </SidebarInset>
    </SidebarProvider>
  )
}

function AppSidebar({
  onNavClick,
}: {
  onNavClick: (item: (typeof NAV_ITEMS)[number]) => void
}) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-1 text-sm font-semibold">My App</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton onClick={() => onNavClick(item)}>
                    <item.Icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function DashboardContent() {
  const stats = [
    { label: "Revenue", value: "$12,450" },
    { label: "Users", value: "1,234" },
    { label: "Orders", value: "567" },
    { label: "Active", value: "89" },
  ]
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlaceholderContent({
  Icon,
  title,
}: {
  Icon: React.ComponentType<{ className?: string }>
  title: string
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <Icon className="size-8 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  )
}
