"use client"

import * as React from "react"

import { NavMain, type NavItem } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  BriefcaseIcon,
  CalendarIcon,
  FileTextIcon,
  LayoutGridIcon,
  MailIcon,
  PackageIcon,
  BookOpenIcon,
  Settings2Icon,
  BarChart2Icon,
} from "lucide-react"

const user = {
  name: "Jay Clyde",
  email: "jayclydetaguines@gmail.com",
  avatar: "",
}

const teams = [
  { name: "Workspace UI", logo: <LayoutGridIcon />, plan: "Personal" },
  { name: "Syntactics Inc", logo: <BriefcaseIcon />, plan: "Team" },
  { name: "Open Source", logo: <PackageIcon />, plan: "Community" },
]

const projects = [
  { name: "Design System", url: "#", icon: <LayoutGridIcon /> },
  { name: "Component Registry", url: "#", icon: <PackageIcon /> },
  { name: "API Docs", url: "#", icon: <BookOpenIcon /> },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onOpenTab?: (id: string, title: string, icon: React.ReactNode) => void
}

export function AppSidebar({ onOpenTab, ...props }: AppSidebarProps) {
  const open = (id: string, title: string, icon: React.ReactNode) =>
    onOpenTab?.(id, title, icon)

  const navMain: NavItem[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <LayoutGridIcon />,
      onClick: () => open("dashboard", "Dashboard", <LayoutGridIcon className="size-3.5" />),
    },
    {
      id: "inbox",
      title: "Mail",
      icon: <MailIcon />,
      isActive: true,
      onClick: () => open("inbox", "Inbox", <MailIcon className="size-3.5" />),
      items: [
        { id: "inbox", title: "Inbox", badge: 12, onClick: () => open("inbox", "Inbox", <MailIcon className="size-3.5" />) },
        { id: "starred", title: "Starred", onClick: () => open("starred", "Starred", <MailIcon className="size-3.5" />) },
        { id: "sent", title: "Sent", onClick: () => open("sent", "Sent", <MailIcon className="size-3.5" />) },
        { id: "drafts", title: "Drafts", badge: 3, onClick: () => open("drafts", "Drafts", <MailIcon className="size-3.5" />) },
        { id: "trash", title: "Trash", onClick: () => open("trash", "Trash", <MailIcon className="size-3.5" />) },
      ],
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: <BarChart2Icon />,
      onClick: () => open("analytics", "Analytics", <BarChart2Icon className="size-3.5" />),
    },
    {
      id: "calendar",
      title: "Calendar",
      icon: <CalendarIcon />,
      onClick: () => open("calendar", "Calendar", <CalendarIcon className="size-3.5" />),
      items: [
        { id: "calendar", title: "Today", onClick: () => open("calendar", "Calendar", <CalendarIcon className="size-3.5" />) },
        { id: "calendar", title: "This Week", onClick: () => open("calendar", "Calendar", <CalendarIcon className="size-3.5" />) },
        { id: "calendar", title: "All Events", onClick: () => open("calendar", "Calendar", <CalendarIcon className="size-3.5" />) },
      ],
    },
    {
      id: "documents",
      title: "Documents",
      icon: <FileTextIcon />,
      onClick: () => open("documents", "Documents", <FileTextIcon className="size-3.5" />),
      items: [
        { id: "documents", title: "Recent", onClick: () => open("documents", "Documents", <FileTextIcon className="size-3.5" />) },
        { id: "documents", title: "Shared", onClick: () => open("documents", "Documents", <FileTextIcon className="size-3.5" />) },
        { id: "documents", title: "Templates", onClick: () => open("documents", "Documents", <FileTextIcon className="size-3.5" />) },
      ],
    },
    {
      id: "settings",
      title: "Settings",
      icon: <Settings2Icon />,
      onClick: () => open("settings", "Settings", <Settings2Icon className="size-3.5" />),
      items: [
        { id: "settings", title: "General", onClick: () => open("settings", "Settings", <Settings2Icon className="size-3.5" />) },
        { id: "settings", title: "Account", onClick: () => open("settings", "Settings", <Settings2Icon className="size-3.5" />) },
        { id: "settings", title: "Notifications", onClick: () => open("settings", "Settings", <Settings2Icon className="size-3.5" />) },
      ],
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
