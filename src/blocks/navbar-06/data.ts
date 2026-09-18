import type { IconSvgElement } from "@hugeicons/react"
import {
  Analytics01Icon,
  Briefcase01Icon,
  CustomerSupportIcon,
  DashboardSquare01Icon,
  Plug01Icon,
  Rocket01Icon,
  Shield01Icon,
  SparklesIcon,
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

export interface Post {
  title: string
  excerpt: string
  href: string
}

export const PRODUCT_GROUPS: MenuGroup[] = [
  {
    title: "Platform",
    links: [
      {
        title: "Dashboards",
        description: "Live metrics for every team.",
        href: "#",
        icon: DashboardSquare01Icon,
      },
      {
        title: "Analytics",
        description: "Explore trends without writing SQL.",
        href: "#",
        icon: Analytics01Icon,
      },
      {
        title: "Automations",
        description: "Trigger work from any event.",
        href: "#",
        icon: Rocket01Icon,
      },
      {
        title: "Integrations",
        description: "Sync with the tools you already use.",
        href: "#",
        icon: Plug01Icon,
      },
    ],
  },
  {
    title: "Solutions",
    links: [
      {
        title: "Startups",
        description: "Move fast with sensible defaults.",
        href: "#",
        icon: SparklesIcon,
      },
      {
        title: "Enterprise",
        description: "Controls and scale for large orgs.",
        href: "#",
        icon: Briefcase01Icon,
      },
      {
        title: "Security",
        description: "SSO, audit trails, and data residency.",
        href: "#",
        icon: Shield01Icon,
      },
      {
        title: "Support teams",
        description: "Resolve tickets with full context.",
        href: "#",
        icon: CustomerSupportIcon,
      },
    ],
  },
]

export const FEATURED_POSTS: Post[] = [
  {
    title: "How we cut reporting time in half",
    excerpt: "What changed when the weekly report built itself.",
    href: "#",
  },
  {
    title: "A field guide to automations",
    excerpt: "Five rules every team should set up in week one.",
    href: "#",
  },
]

export const LINKS = [
  { label: "Pricing", href: "#" },
  { label: "Customers", href: "#" },
  { label: "Docs", href: "#" },
]
