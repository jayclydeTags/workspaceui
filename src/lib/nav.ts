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
        description: "Collapsible sidebar nav paired with the Workspace component.",
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
        description: "Grouped activity timeline with type/user filters and running stats.",
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
      { title: "Workspace Tabs", href: "/docs/components/workspace-tabs" },
      { title: "Workspace Panel", href: "/docs/components/workspace-panel" },
      { title: "Workspace", href: "/docs/components/workspace" },
      { title: "Page", href: "/docs/components/page" },
    ],
  },
]
