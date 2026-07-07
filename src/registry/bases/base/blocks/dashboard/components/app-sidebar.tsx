"use client"

import { BarChart2, FileText, LayoutDashboard, Settings } from "lucide-react"

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

export const NAV_ITEMS = [
  { id: "dashboard", title: "Dashboard", Icon: LayoutDashboard, pinned: true },
  { id: "documents", title: "Documents", Icon: FileText, pinned: false },
  { id: "analytics", title: "Analytics", Icon: BarChart2, pinned: false },
  { id: "settings", title: "Settings", Icon: Settings, pinned: false },
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
