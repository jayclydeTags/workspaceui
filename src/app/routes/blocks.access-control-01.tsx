import pageSource from "@/registry/bases/base/blocks/access-control-01/page.tsx?raw"
import dataSource from "@/registry/bases/base/blocks/access-control-01/data.ts?raw"
import permissionTableSource from "@/registry/bases/base/blocks/access-control-01/components/permission-table.tsx?raw"

import { useDocumentTitle } from "@/lib/use-document-title"
import { BlockPreview } from "@/components/block-preview"

const FILES = [
  { name: "page.tsx", path: "app/access-control/page.tsx", code: pageSource },
  { name: "data.ts", path: "app/access-control/data.ts", code: dataSource },
  {
    name: "permission-table.tsx",
    path: "components/blocks/access-control-01/components/permission-table.tsx",
    code: permissionTableSource,
  },
]

export default function AccessControl01Page() {
  useDocumentTitle("Access Control 01")

  return (
    <BlockPreview
      title="Access Control 01"
      slug="access-control-01"
      installCmd="npx shadcn@latest add jayclydeTags/workspaceui/access-control-01"
      files={FILES}
    />
  )
}
