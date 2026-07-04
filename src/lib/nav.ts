export interface NavItem {
  title: string
  href: string
  label?: string
  description?: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const blocksNav: NavSection[] = [
  {
    title: "Application",
    items: [
      {
        title: "Dashboard 01",
        href: "/blocks/dashboard-01",
        description:
          "Collapsible sidebar nav paired with the Workspace component.",
      },
      {
        title: "Activity Log 01",
        href: "/blocks/activity-log-01",
        description:
          "Filterable activity log with a responsive datatable — collapses to cards on narrow panes.",
      },
      {
        title: "Activity Feed 01",
        href: "/blocks/activity-feed-01",
        description:
          "Grouped activity timeline with type/user filters and running stats.",
      },
      {
        title: "Access Control 01",
        href: "/blocks/access-control-01",
        description:
          "Manage role permissions across resources with a per-role permission matrix.",
      },
      {
        title: "Invoice Detail 01",
        href: "/blocks/invoice-detail-01",
        description:
          "Master-detail invoice workspace — select a row to open its line items in a new tab.",
      },
      {
        title: "Purchase Order Form 01",
        href: "/blocks/purchase-order-form-01",
        description:
          "Three-step wizard for creating a purchase order — vendor details, line items, and review.",
      },
      {
        title: "Approval Board 01",
        href: "/blocks/approval-board-01",
        description:
          "Drag-and-drop Kanban board for triaging expense, purchase order, and time-off approval requests.",
      },
      {
        title: "Settings 01",
        href: "/blocks/settings-01",
        description:
          "Sectioned workspace settings — company profile, notifications, billing, and security.",
      },
    ],
  },
]

export const nav: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs/getting-started/introduction" },
      { title: "Installation", href: "/docs/getting-started/installation" },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Workspace", href: "/docs/components/workspace" },
      { title: "Page", href: "/docs/components/page" },
    ],
  },
]
