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
