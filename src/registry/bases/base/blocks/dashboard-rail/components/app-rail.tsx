"use client"

import { LayoutGrid, Mail, Settings, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export const RAIL_APPS = [
  { id: "workspace", title: "Workspace", Icon: LayoutGrid },
  { id: "email", title: "Email", Icon: Mail },
] as const

export type AppId = (typeof RAIL_APPS)[number]["id"]

export function AppRail({
  activeAppId,
  onAppSelect,
}: {
  activeAppId: AppId
  onAppSelect: (id: AppId) => void
}) {
  const { toggleSidebar, setOpen } = useSidebar()

  return (
    <Sidebar
      collapsible="none"
      className="w-[calc(var(--sidebar-width-icon)+1px)]! border-e border-sidebar-border"
    >
      <SidebarHeader className="items-center">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
          A
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {RAIL_APPS.map((app) => (
              <SidebarMenuItem key={app.id}>
                <SidebarMenuButton
                  tooltip={{ children: app.title, hidden: false }}
                  isActive={activeAppId === app.id}
                  onClick={() => {
                    if (app.id === activeAppId) {
                      toggleSidebar()
                      return
                    }
                    setOpen(true)
                    onAppSelect(app.id)
                  }}
                  className="justify-center"
                >
                  <app.Icon />
                  <span className="sr-only">{app.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={{ children: "Settings", hidden: false }}
              className="justify-center"
            >
              <Settings />
              <span className="sr-only">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={{ children: "Profile", hidden: false }}
              className="justify-center"
            >
              <User />
              <span className="sr-only">Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
