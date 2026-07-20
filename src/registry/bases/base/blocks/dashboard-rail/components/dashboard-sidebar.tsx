"use client"

import { Sidebar, useSidebar } from "@/components/ui/sidebar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { AppRail, type AppId } from "@/registry/bases/base/blocks/dashboard-rail/components/app-rail"
import { NavSidebar, type NavItem } from "@/registry/bases/base/blocks/dashboard-rail/components/nav-sidebar"

export function DashboardSidebar({
  activeAppId,
  onAppSelect,
  navTitle,
  navItems,
  activeId,
  onNavClick,
}: {
  activeAppId: AppId
  onAppSelect: (id: AppId) => void
  navTitle: string
  navItems: readonly NavItem[]
  activeId: string
  onNavClick: (item: NavItem) => void
}) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar()

  const rail = <AppRail activeAppId={activeAppId} onAppSelect={onAppSelect} />
  const nav = (
    <NavSidebar title={navTitle} items={navItems} activeId={activeId} onNavClick={onNavClick} />
  )

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[calc(var(--sidebar-width-icon)+18rem)] flex-row gap-0 p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the app navigation.</SheetDescription>
          </SheetHeader>
          {rail}
          {nav}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sidebar collapsible="icon" className="overflow-hidden *:data-[sidebar=sidebar]:flex-row">
      {rail}
      {nav}
    </Sidebar>
  )
}
