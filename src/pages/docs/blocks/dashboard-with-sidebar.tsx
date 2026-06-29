import blockSource from "@/components/workspaceui/blocks/dashboard-with-sidebar.tsx?raw"

import { useDocumentTitle } from "@/lib/use-document-title"
import { BlockPreview } from "@/components/block-preview"
import { DashboardWithSidebar } from "@/components/workspaceui/blocks/dashboard-with-sidebar"

const FILES = [
  { name: "dashboard-with-sidebar.tsx", code: blockSource },
]

export function DashboardWithSidebarPage() {
  useDocumentTitle("Dashboard with Sidebar")

  return (
    <BlockPreview
      title="Dashboard with Sidebar"
      description="Collapsible sidebar nav paired with the Workspace component."
      installCmd="npx shadcn@latest add jayclydeTags/workspaceui/dashboard-with-sidebar"
      files={FILES}
    >
      <DashboardWithSidebar />
    </BlockPreview>
  )
}
