import blockSource from "@/components/workspaceui/blocks/activity-log-01.tsx?raw"

import { useDocumentTitle } from "@/lib/use-document-title"
import { BlockPreview } from "@/components/block-preview"
import { ActivityLog01 } from "@/components/workspaceui/blocks/activity-log-01"

const FILES = [{ name: "activity-log-01.tsx", code: blockSource }]

export function ActivityLog01Page() {
  useDocumentTitle("Activity Log 01")

  return (
    <BlockPreview
      title="Activity Log 01"
      description="Filterable activity log with a responsive datatable — collapses to cards on narrow panes."
      installCmd="npx shadcn@latest add jayclydeTags/workspaceui/activity-log-01"
      files={FILES}
    >
      <ActivityLog01 />
    </BlockPreview>
  )
}
