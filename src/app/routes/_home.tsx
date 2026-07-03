import { Outlet } from "react-router"
import { HomeLayout as FumaHomeLayout } from "fumadocs-ui/layouts/home"

import { WorkspaceUILogo } from "@/components/workspaceui-logo"

const links = [
  { text: "Docs", url: "/docs/getting-started/introduction", active: "nested-url" as const },
  { text: "Components", url: "/docs/components/workspace", active: "nested-url" as const },
  { text: "Blocks", url: "/blocks", active: "nested-url" as const },
]

export default function HomeLayout() {
  return (
    <FumaHomeLayout
      links={links}
      githubUrl="https://github.com/jayclydeTags/workspaceui"
      nav={{ title: <WorkspaceUILogo className="h-5 w-auto" /> }}
    >
      <Outlet />
    </FumaHomeLayout>
  )
}
