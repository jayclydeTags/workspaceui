"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  InboxIcon,
  Calendar01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { defineStory } from "@/components/studio/studio"

interface Args {
  header: boolean
  footer: boolean
  badge: boolean
}

const ITEMS = [
  { title: "Home", icon: Home01Icon },
  { title: "Inbox", icon: InboxIcon },
  { title: "Calendar", icon: Calendar01Icon },
  { title: "Settings", icon: Settings01Icon },
]

function Preview({ header, footer, badge }: Args) {
  return (
    // `collapsible="none"` keeps the sidebar in flow so it can sit in a frame;
    // the default offcanvas mode is fixed to the viewport.
    <div className="h-80 w-64 overflow-hidden rounded-lg border">
      <SidebarProvider className="h-full min-h-0">
        <Sidebar collapsible="none">
          {header && (
            <SidebarHeader>
              <span className="px-2 text-sm font-medium">Acme Inc</span>
            </SidebarHeader>
          )}
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {ITEMS.map((item, i) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={i === 0}>
                        <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {badge && item.title === "Inbox" && (
                        <SidebarMenuBadge>24</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          {footer && (
            <SidebarFooter>
              <span className="px-2 text-xs text-muted-foreground">v1.0.0</span>
            </SidebarFooter>
          )}
        </Sidebar>
      </SidebarProvider>
    </div>
  )
}

export default defineStory<Args>({
  args: { header: true, footer: true, badge: true },
  controls: {
    header: { type: "boolean", group: "style", description: "SidebarHeader." },
    footer: { type: "boolean", group: "style", description: "SidebarFooter." },
    badge: { type: "boolean", description: "A SidebarMenuBadge on Inbox." },
  },
  preview: Preview,
})
