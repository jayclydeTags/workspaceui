export interface NavItem {
  title: string
  href: string
  label?: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const blocksNav: NavSection[] = [
  {
    title: "Dashboard",
    items: [
      { title: "Dashboard 01", href: "/blocks/dashboard-01" },
      { title: "Activity Log 01", href: "/blocks/activity-log-01" },
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
