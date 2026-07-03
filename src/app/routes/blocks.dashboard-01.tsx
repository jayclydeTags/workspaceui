import pageSource from "@/registry/bases/base/blocks/dashboard-01/page.tsx?raw"
import appSidebarSource from "@/registry/bases/base/blocks/dashboard-01/components/app-sidebar.tsx?raw"
import dashboardContentSource from "@/registry/bases/base/blocks/dashboard-01/components/dashboard-content.tsx?raw"

import { useDocumentTitle } from "@/lib/use-document-title"
import { BlockPreview } from "@/components/block-preview"

const FILES = [
  { name: "page.tsx", path: "app/dashboard/page.tsx", code: pageSource },
  {
    name: "app-sidebar.tsx",
    path: "components/blocks/dashboard-01/components/app-sidebar.tsx",
    code: appSidebarSource,
  },
  {
    name: "dashboard-content.tsx",
    path: "components/blocks/dashboard-01/components/dashboard-content.tsx",
    code: dashboardContentSource,
  },
]

export default function Dashboard01Page() {
  useDocumentTitle("Dashboard 01")

  return (
    <BlockPreview
      title="Dashboard 01"
      slug="dashboard-01"
      installCmd="npx shadcn@latest add jayclydeTags/workspaceui/dashboard-01"
      files={FILES}
    />
  )
}
