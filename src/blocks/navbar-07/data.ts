import type { IconSvgElement } from "@hugeicons/react"
import {
  Analytics01Icon,
  BookOpen01Icon,
  Calendar03Icon,
  Call02Icon,
  CodeIcon,
  CustomerSupportIcon,
  DashboardSquare01Icon,
  GlobeIcon,
  Layers01Icon,
  Mail01Icon,
  Plug01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons"

export interface MenuLink {
  title: string
  description: string
  href: string
  icon: IconSvgElement
}

export interface MenuGroup {
  title: string
  links: MenuLink[]
}

export const PLATFORM_GROUPS: MenuGroup[] = [
  {
    title: "Build",
    links: [
      {
        title: "Workspaces",
        description: "One home for every project.",
        href: "#",
        icon: Layers01Icon,
      },
      {
        title: "API",
        description: "Everything in the app, over REST.",
        href: "#",
        icon: CodeIcon,
      },
      {
        title: "Integrations",
        description: "Two-way sync with your stack.",
        href: "#",
        icon: Plug01Icon,
      },
    ],
  },
  {
    title: "Operate",
    links: [
      {
        title: "Dashboards",
        description: "The numbers that matter, live.",
        href: "#",
        icon: DashboardSquare01Icon,
      },
      {
        title: "Reports",
        description: "Scheduled and shareable.",
        href: "#",
        icon: Analytics01Icon,
      },
      {
        title: "Scheduling",
        description: "Plan work across time zones.",
        href: "#",
        icon: Calendar03Icon,
      },
    ],
  },
  {
    title: "Grow",
    links: [
      {
        title: "Campaigns",
        description: "Email that reaches the inbox.",
        href: "#",
        icon: Mail01Icon,
      },
      {
        title: "Localization",
        description: "Ship in 30 languages.",
        href: "#",
        icon: GlobeIcon,
      },
      {
        title: "Compliance",
        description: "SOC 2 and GDPR, handled.",
        href: "#",
        icon: Shield01Icon,
      },
    ],
  },
]

export const FOOTER_LINKS = [
  { label: "Contact sales", href: "#", icon: Call02Icon },
  { label: "Help center", href: "#", icon: CustomerSupportIcon },
  { label: "Documentation", href: "#", icon: BookOpen01Icon },
]

export const LINKS = [
  { label: "Pricing", href: "#" },
  { label: "Enterprise", href: "#" },
  { label: "Blog", href: "#" },
]
