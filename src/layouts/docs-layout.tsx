import { Outlet } from "react-router-dom"
import { DocsLayout as FumaDocsLayout } from "fumadocs-ui/layouts/docs"

import { pageTree } from "@/lib/page-tree"

export function DocsLayout() {
  return (
    <FumaDocsLayout
      tree={pageTree}
      nav={{ enabled: false }}
      searchToggle={{ enabled: false }}
    >
      <Outlet />
    </FumaDocsLayout>
  )
}
