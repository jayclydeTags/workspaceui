export interface NavItem {
  title: string
  href: string
  label?: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

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
      { title: "Workspace", href: "/docs/components/workspace" },
    ],
  },
  {
    title: "Blocks",
    items: [{ title: "Overview", href: "/docs/blocks" }],
  },
]
