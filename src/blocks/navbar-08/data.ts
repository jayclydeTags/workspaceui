import type { IconSvgElement } from "@hugeicons/react"
import {
  Analytics01Icon,
  BookOpen01Icon,
  Briefcase01Icon,
  CheckmarkCircle02Icon,
  CustomerSupportIcon,
  HelpCircleIcon,
  News01Icon,
  Plug01Icon,
  Rocket01Icon,
  UserGroupIcon,
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

export const FEATURES: MenuLink[] = [
  {
    title: "Task tracking",
    description: "Plan, assign, and ship in one place.",
    href: "#",
    icon: CheckmarkCircle02Icon,
  },
  {
    title: "Insights",
    description: "See where the week actually went.",
    href: "#",
    icon: Analytics01Icon,
  },
  {
    title: "Automations",
    description: "Let routine updates run themselves.",
    href: "#",
    icon: Rocket01Icon,
  },
  {
    title: "Integrations",
    description: "Bring GitHub, Slack, and Figma along.",
    href: "#",
    icon: Plug01Icon,
  },
]

export const COMPANY_GROUPS: MenuGroup[] = [
  {
    title: "Company",
    links: [
      {
        title: "About us",
        description: "The team and the story so far.",
        href: "#",
        icon: UserGroupIcon,
      },
      {
        title: "Careers",
        description: "Open roles, remote-first.",
        href: "#",
        icon: Briefcase01Icon,
      },
      {
        title: "Newsroom",
        description: "Announcements and press kit.",
        href: "#",
        icon: News01Icon,
      },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        title: "Guides",
        description: "Playbooks for common workflows.",
        href: "#",
        icon: BookOpen01Icon,
      },
      {
        title: "Help center",
        description: "Answers, searchable.",
        href: "#",
        icon: HelpCircleIcon,
      },
      {
        title: "Support",
        description: "Talk to a human, fast.",
        href: "#",
        icon: CustomerSupportIcon,
      },
    ],
  },
]
