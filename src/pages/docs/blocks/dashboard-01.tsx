import blockSource from "@/components/workspaceui/blocks/dashboard-01.tsx?raw"

import { useDocumentTitle } from "@/lib/use-document-title"
import { BlockPreview } from "@/components/block-preview"
import { Dashboard01 } from "@/components/workspaceui/blocks/dashboard-01"

const FILES = [{ name: "dashboard-01.tsx", code: blockSource }]

export function Dashboard01Page() {
  useDocumentTitle("Dashboard 01")

  return (
    <BlockPreview
      title="Dashboard 01"
      description="Collapsible sidebar nav paired with the Workspace component."
      installCmd="npx shadcn@latest add jayclydeTags/workspaceui/dashboard-01"
      files={FILES}
    >
      <Dashboard01 />
    </BlockPreview>
  )
}
