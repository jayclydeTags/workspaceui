"use client"

import type { ComponentType } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArchiveIcon,
  BarChartIcon,
  DashboardSquare01Icon,
  Delete02Icon,
  File01Icon,
  FileEditIcon,
  InboxIcon,
  SentIcon,
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

export type NavItem = {
  id: string
  title: string
  Icon: ComponentType<{ className?: string }>
  pinned: boolean
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <HugeiconsIcon
      icon={DashboardSquare01Icon}
      strokeWidth={2}
      className={className}
    />
  )
}
function DocumentsIcon({ className }: { className?: string }) {
  return (
    <HugeiconsIcon icon={File01Icon} strokeWidth={2} className={className} />
  )
}
function AnalyticsIcon({ className }: { className?: string }) {
  return (
    <HugeiconsIcon icon={BarChartIcon} strokeWidth={2} className={className} />
  )
}
function SettingsIcon({ className }: { className?: string }) {
  return (
    <HugeiconsIcon icon={Setting06Icon} strokeWidth={2} className={className} />
  )
}
function InboxNavIcon({ className }: { className?: string }) {
  return (
    <HugeiconsIcon icon={InboxIcon} strokeWidth={2} className={className} />
  )
}
function SentIconNav({ className }: { className?: string }) {
  return <HugeiconsIcon icon={SentIcon} strokeWidth={2} className={className} />
}
function DraftsIcon({ className }: { className?: string }) {
  return (
    <HugeiconsIcon icon={FileEditIcon} strokeWidth={2} className={className} />
  )
}
function ArchiveNavIcon({ className }: { className?: string }) {
  return (
    <HugeiconsIcon icon={ArchiveIcon} strokeWidth={2} className={className} />
  )
}
function TrashIcon({ className }: { className?: string }) {
  return (
    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className={className} />
  )
}

export const APPS_NAV = {
  workspace: [
    {
      id: "dashboard",
      title: "Dashboard",
      Icon: DashboardIcon,
      pinned: true,
    },
    { id: "documents", title: "Documents", Icon: DocumentsIcon, pinned: false },
    { id: "analytics", title: "Analytics", Icon: AnalyticsIcon, pinned: false },
    { id: "settings", title: "Settings", Icon: SettingsIcon, pinned: false },
  ],
  email: [
    { id: "inbox", title: "Inbox", Icon: InboxNavIcon, pinned: true },
    { id: "sent", title: "Sent", Icon: SentIconNav, pinned: false },
    { id: "drafts", title: "Drafts", Icon: DraftsIcon, pinned: false },
    { id: "archive", title: "Archive", Icon: ArchiveNavIcon, pinned: false },
    { id: "trash", title: "Trash", Icon: TrashIcon, pinned: false },
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
