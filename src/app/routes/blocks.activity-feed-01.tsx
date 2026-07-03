import pageSource from "@/registry/bases/base/blocks/activity-feed-01/page.tsx?raw"
import dataSource from "@/registry/bases/base/blocks/activity-feed-01/data.ts?raw"

import { useDocumentTitle } from "@/lib/use-document-title"
import { BlockPreview } from "@/components/block-preview"

const FILES = [
  { name: "page.tsx", path: "app/activity-feed/page.tsx", code: pageSource },
  { name: "data.ts", path: "app/activity-feed/data.ts", code: dataSource },
]

export default function ActivityFeed01Page() {
  useDocumentTitle("Activity Feed 01")

  return (
    <BlockPreview
      title="Activity Feed 01"
      slug="activity-feed-01"
      installCmd="npx shadcn@latest add jayclydeTags/workspaceui/activity-feed-01"
      files={FILES}
    />
  )
}
