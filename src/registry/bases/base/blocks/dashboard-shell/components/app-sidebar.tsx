"use client"

import type { ComponentProps } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BarChartIcon,
  DashboardSquare01Icon,
  Database01Icon,
  FileEditIcon,
  Folder01Icon,
  HelpCircleIcon,
  Home01Icon,
  InboxIcon,
  Layers01Icon,
  Logout01Icon,
  MoreHorizontalIcon,
  PlusSignIcon,
  Search01Icon,
  Setting06Icon,
  UserCircleIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"

function DashboardIcon(props: ComponentProps<"svg">) {
  return (
    <HugeiconsIcon icon={DashboardSquare01Icon} {...props} strokeWidth={2} />
  )
}
function LifecycleIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={Layers01Icon} {...props} strokeWidth={2} />
}
function AnalyticsIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={BarChartIcon} {...props} strokeWidth={2} />
}
function ProjectsIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={Folder01Icon} {...props} strokeWidth={2} />
}
function TeamIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={UserGroupIcon} {...props} strokeWidth={2} />
}
function DataLibraryIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={Database01Icon} {...props} strokeWidth={2} />
}
function ReportsIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={BarChartIcon} {...props} strokeWidth={2} />
}
function WordAssistantIcon(props: ComponentProps<"svg">) {
  return <HugeiconsIcon icon={FileEditIcon} {...props} strokeWidth={2} />
}

export const NAV_ITEMS = [
  { id: "dashboard", title: "Dashboard", Icon: DashboardIcon, pinned: true },
  { id: "lifecycle", title: "Lifecycle", Icon: LifecycleIcon, pinned: false },
  { id: "analytics", title: "Analytics", Icon: AnalyticsIcon, pinned: false },
  { id: "projects", title: "Projects", Icon: ProjectsIcon, pinned: false },
  { id: "team", title: "Team", Icon: TeamIcon, pinned: false },
] as const

export const DOCUMENT_ITEMS = [
  {
    id: "data-library",
    title: "Data Library",
    Icon: DataLibraryIcon,
    pinned: false,
  },
  { id: "reports", title: "Reports", Icon: ReportsIcon, pinned: false },
  {
    id: "word-assistant",
    title: "Word Assistant",
    Icon: WordAssistantIcon,
    pinned: false,
  },
] as const

export type SidebarNavItem =
  (typeof NAV_ITEMS)[number] | (typeof DOCUMENT_ITEMS)[number]

export function AppSidebar({
  activeId,
  onNavClick,
}: {
  activeId: string
  onNavClick: (item: SidebarNavItem) => void
}) {
  return (
    // The shell nests this sidebar below a global tab strip rather than
    // letting it span the full viewport, so its fixed aside is scoped to
    // that contained region (see the dashboard-shell page's `contain-layout`
    // wrapper). `className` lands directly on the primitive's fixed
    // `data-slot="sidebar-container"` div — override its `h-svh` (real
    // viewport height) to `h-full` (its containing block's height) so it
    // doesn't overshoot past the strip's height and clip its own footer.
    <Sidebar collapsible="icon" className="!h-full">
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 px-1 py-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <HugeiconsIcon
              icon={Home01Icon}
              className="size-5 shrink-0"
              strokeWidth={2}
            />
            <span className="truncate text-sm font-semibold group-data-[collapsible=icon]:hidden">
              Acme Inc.
            </span>
          </div>
          <SidebarTrigger />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:flex-col">
              <SidebarMenuButton
                tooltip="Quick Create"
                className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              >
                <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
                <span>Quick Create</span>
              </SidebarMenuButton>
              <Button
                variant="outline"
                size="icon"
                className="size-8 shrink-0"
                aria-label="Inbox"
              >
                <HugeiconsIcon icon={InboxIcon} strokeWidth={2} />
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
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
        <SidebarGroup>
          <SidebarGroupLabel>Documents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {DOCUMENT_ITEMS.map((item) => (
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
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="More">
                  <HugeiconsIcon
                    icon={MoreHorizontalIcon}
                    strokeWidth={2}
                    className="text-muted-foreground group-hover/menu-button:text-sidebar-accent-foreground"
                  />
                  <span className="text-muted-foreground group-hover/menu-button:text-sidebar-accent-foreground">
                    More
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <HugeiconsIcon icon={Setting06Icon} strokeWidth={2} />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Get Help">
              <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />
              <span>Get Help</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Search">
              <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
              <span>Search</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src="" alt="" />
                  <AvatarFallback className="rounded-lg">SC</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">shadcn</span>
                  <span className="truncate text-xs text-muted-foreground">
                    m@example.com
                  </span>
                </div>
                <HugeiconsIcon
                  icon={MoreHorizontalIcon}
                  className="ms-auto size-4"
                  strokeWidth={2}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" side="top">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      shadcn
                    </span>
                    <span className="mt-0.5 text-xs font-normal text-muted-foreground">
                      m@example.com
                    </span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={UserCircleIcon} strokeWidth={2} />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={Setting06Icon} strokeWidth={2} />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
