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
  SidebarTrigger,
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
  { id: "dashboard", title: "Dashboard", Icon: DashboardIcon, pinned: true },
  { id: "documents", title: "Documents", Icon: DocumentsIcon, pinned: false },
  { id: "analytics", title: "Analytics", Icon: AnalyticsIcon, pinned: false },
  { id: "settings", title: "Settings", Icon: SettingsIcon, pinned: false },
] as const

export function AppSidebar({
  onNavClick,
}: {
  onNavClick: (item: (typeof NAV_ITEMS)[number]) => void
}) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 px-1 py-1">
          <span className="truncate text-sm font-semibold group-data-[collapsible=icon]:hidden">
            My App
          </span>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    tooltip={item.title}
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
