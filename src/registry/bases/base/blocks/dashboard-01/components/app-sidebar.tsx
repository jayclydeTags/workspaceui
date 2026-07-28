"use client"

import type { ComponentProps } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BarChartIcon,
  DashboardSquare01Icon,
  File01Icon,
  Setting06Icon,
} from "@hugeicons/core-free-icons"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

function DashboardIcon(props: ComponentProps<"svg">) {
  return (
    <HugeiconsIcon icon={DashboardSquare01Icon} {...props} strokeWidth={2} />
  )
}
function DocumentsIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={File01Icon} {...props} strokeWidth={2} />
}
function AnalyticsIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={BarChartIcon} {...props} strokeWidth={2} />
}
function SettingsIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={Setting06Icon} {...props} strokeWidth={2} />
}

export const NAV_ITEMS = [
  { id: "dashboard", title: "Dashboard", Icon: DashboardIcon },
  { id: "documents", title: "Documents", Icon: DocumentsIcon },
  { id: "analytics", title: "Analytics", Icon: AnalyticsIcon },
  { id: "settings", title: "Settings", Icon: SettingsIcon },
] as const

export function AppSidebar({
  activeId,
  onNavClick,
}: {
  activeId: string
  onNavClick: (item: (typeof NAV_ITEMS)[number]) => void
}) {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="pointer-events-none">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <DashboardIcon className="size-4" />
              </div>
              <span className="truncate text-sm font-semibold">My App</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={item.id === activeId}
                    onClick={() => onNavClick(item)}
                  >
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
