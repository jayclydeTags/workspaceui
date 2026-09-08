export interface NavItem {
  title: string
  href: string
  label?: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface NavSection {
  title: string
  items?: NavItem[] // flat list (docs sidebar)
  groups?: NavGroup[] // nested collapsible subcategories (blocks sidebar)
  comingSoon?: boolean // family is announced but has no blocks yet
}

export const nav: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs/getting-started/introduction" },
      { title: "Installation", href: "/docs/getting-started/installation" },
    ],
  },
]
