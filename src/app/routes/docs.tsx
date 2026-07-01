import { Outlet } from "react-router"
import { DocsLayout as FumaDocsLayout } from "fumadocs-ui/layouts/docs"

import { WorkspaceUILogo } from "@/components/workspaceui-logo"
import { pageTree } from "@/lib/page-tree"

const links = [{ text: "Blocks", url: "/blocks", active: "nested-url" as const }]

export default function DocsLayout() {
  return (
    <FumaDocsLayout
      tree={pageTree}
      links={links}
      githubUrl="https://github.com/jayclydeTags/workspaceui"
      nav={{ title: <WorkspaceUILogo className="h-5 w-auto" /> }}
    >
      <Outlet />
    </FumaDocsLayout>
  )
}
