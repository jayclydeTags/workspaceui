"use client"

import type { ComponentType } from "react"
import {
  Archive,
  BarChart2,
  FileEdit,
  FileText,
  Inbox,
  LayoutDashboard,
  Send,
  Settings,
  Trash2,
} from "lucide-react"

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

export type NavItem = {
  id: string
  title: string
  Icon: ComponentType<{ className?: string }>
  pinned: boolean
}

export const APPS_NAV = {
  workspace: [
    { id: "dashboard", title: "Dashboard", Icon: LayoutDashboard, pinned: true },
    { id: "documents", title: "Documents", Icon: FileText, pinned: false },
    { id: "analytics", title: "Analytics", Icon: BarChart2, pinned: false },
    { id: "settings", title: "Settings", Icon: Settings, pinned: false },
  ],
  email: [
    { id: "inbox", title: "Inbox", Icon: Inbox, pinned: true },
    { id: "sent", title: "Sent", Icon: Send, pinned: false },
    { id: "drafts", title: "Drafts", Icon: FileEdit, pinned: false },
    { id: "archive", title: "Archive", Icon: Archive, pinned: false },
    { id: "trash", title: "Trash", Icon: Trash2, pinned: false },
  ],
} as const satisfies Record<string, readonly NavItem[]>

export function NavSidebar({
  title,
  items,
  activeId,
  onNavClick,
}: {
  title: string
  items: readonly NavItem[]
  activeId: string
  onNavClick: (item: NavItem) => void
}) {
  return (
    <Sidebar collapsible="none" className="flex flex-1">
      <SidebarHeader className="flex-row items-center gap-2">
        <span className="truncate text-sm font-semibold">{title}</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={activeId === item.id}
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
