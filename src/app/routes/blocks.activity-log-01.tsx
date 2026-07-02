import pageSource from "@/registry/bases/base/blocks/activity-log-01/page.tsx?raw"
import dataSource from "@/registry/bases/base/blocks/activity-log-01/data.ts?raw"
import dataTableSource from "@/registry/bases/base/blocks/activity-log-01/components/data-table.tsx?raw"

import { useDocumentTitle } from "@/lib/use-document-title"
import { BlockPreview } from "@/components/block-preview"
import { ActivityLog01 } from "@/registry/bases/base/blocks/activity-log-01/page"

const FILES = [
  { name: "page.tsx",       path: "app/activity-log/page.tsx",   code: pageSource      },
  { name: "data.ts",        path: "app/activity-log/data.ts",    code: dataSource      },
  { name: "data-table.tsx", path: "components/blocks/activity-log-01/components/data-table.tsx", code: dataTableSource },
]

export default function ActivityLog01Page() {
  useDocumentTitle("Activity Log 01")

  return (
    <BlockPreview
      title="Activity Log 01"
      installCmd="npx shadcn@latest add jayclydeTags/workspaceui/activity-log-01"
      files={FILES}
    >
      <ActivityLog01 />
    </BlockPreview>
  )
}
