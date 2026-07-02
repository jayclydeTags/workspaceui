import { Outlet } from "react-router"
import { HomeLayout as FumaHomeLayout } from "fumadocs-ui/layouts/home"

import { SidebarNav } from "@/components/sidebar-nav"
import { WorkspaceUILogo } from "@/components/workspaceui-logo"
import { blocksNav } from "@/lib/nav"

const links = [
  { text: "Docs", url: "/docs/getting-started/introduction", active: "nested-url" as const },
  { text: "Components", url: "/docs/components/workspace-tabs", active: "nested-url" as const },
  { text: "Blocks", url: "/blocks", active: "nested-url" as const },
]

export default function BlocksLayout() {
  return (
    <FumaHomeLayout
      links={links}
      githubUrl="https://github.com/jayclydeTags/workspaceui"
      nav={{ title: <WorkspaceUILogo className="h-5 w-auto" /> }}
    >
      <div className="flex h-[calc(100svh-3.5rem)] overflow-hidden">
        <aside className="hidden w-56 shrink-0 border-r border-border px-4 py-6 md:block">
          <SidebarNav sections={blocksNav} />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
      </div>
    </FumaHomeLayout>
  )
}
