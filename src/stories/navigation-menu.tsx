"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { defineStory } from "@/components/studio/studio"

interface Args {
  align: "start" | "center" | "end"
  links: number
}

const GUIDES = [
  ["Introduction", "Re-usable components built with Tailwind CSS."],
  ["Installation", "How to install dependencies and structure your app."],
  ["Typography", "Styles for headings, paragraphs, lists, and more."],
]

function Preview({ align, links }: Args) {
  return (
    <NavigationMenu align={align}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-72 flex-col gap-1">
              {GUIDES.slice(0, Math.min(Math.max(links, 1), GUIDES.length)).map(
                ([title, description]) => (
                  <li key={title}>
                    <NavigationMenuLink href="#">
                      <span className="text-sm font-medium">{title}</span>
                      <span className="text-xs text-muted-foreground">
                        {description}
                      </span>
                    </NavigationMenuLink>
                  </li>
                )
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          {/* eslint-disable-next-line shadcn/require-static-classes -- the documented way to style a top-level link like a trigger */}
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default defineStory<Args>({
  args: { align: "start", links: 3 },
  controls: {
    links: {
      type: "number",
      min: 1,
      max: GUIDES.length,
      description: "Links in the menu panel.",
    },
    align: {
      type: "select",
      group: "style",
      options: ["start", "center", "end"],
    },
  },
  preview: Preview,
})
