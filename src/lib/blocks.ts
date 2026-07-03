import type { ComponentType } from "react"

import { ActivityFeed01 } from "@/registry/bases/base/blocks/activity-feed-01/page"
import { ActivityLog01 } from "@/registry/bases/base/blocks/activity-log-01/page"
import { Dashboard01 } from "@/registry/bases/base/blocks/dashboard-01/page"

export interface BlockMeta {
  slug: string
  title: string
  description: string
  category: string
  Component: ComponentType
}

// Single source of truth for the /blocks gallery. Imported only by the gallery
// route so the block components stay code-split to /blocks (nav.ts, which loads
// everywhere, must not import this).
export const blocks: BlockMeta[] = [
  {
    slug: "dashboard-01",
    title: "Dashboard 01",
    description: "Collapsible sidebar nav paired with the Workspace component.",
    category: "Dashboard",
    Component: Dashboard01,
  },
  {
    slug: "activity-log-01",
    title: "Activity Log 01",
    description:
      "Filterable activity log with a responsive datatable — collapses to cards on narrow panes.",
    category: "Activity",
    Component: ActivityLog01,
  },
  {
    slug: "activity-feed-01",
    title: "Activity Feed 01",
    description: "Grouped activity timeline with type/user filters and running stats.",
    category: "Application",
    Component: ActivityFeed01,
  },
]
