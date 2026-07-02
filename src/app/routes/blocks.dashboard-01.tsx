import blockSource from "@/registry/bases/base/blocks/dashboard-01/page.tsx?raw"

import { useDocumentTitle } from "@/lib/use-document-title"
import { BlockPreview } from "@/components/block-preview"
import { Dashboard01 } from "@/registry/bases/base/blocks/dashboard-01/page"

const FILES = [{ name: "dashboard-01.tsx", code: blockSource }]

export default function Dashboard01Page() {
  useDocumentTitle("Dashboard 01")

  return (
    <BlockPreview
      title="Dashboard 01"
      installCmd="npx shadcn@latest add jayclydeTags/workspaceui/dashboard-01"
      files={FILES}
    >
      <Dashboard01 />
    </BlockPreview>
  )
}
