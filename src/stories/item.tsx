"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Notification01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { defineStory } from "@/components/studio/studio"

interface Args {
  title: string
  description: string
  media: boolean
  actions: boolean
  variant: "default" | "outline" | "muted"
  size: "default" | "sm" | "xs"
}

function Preview({ title, description, media, actions, variant, size }: Args) {
  return (
    <Item variant={variant} size={size} className="w-96">
      {media && (
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} />
        </ItemMedia>
      )}
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        {description && <ItemDescription>{description}</ItemDescription>}
      </ItemContent>
      {actions && (
        <ItemActions>
          <Button variant="outline" size="sm">
            Open
          </Button>
        </ItemActions>
      )}
    </Item>
  )
}

export default defineStory<Args>({
  args: {
    title: "New activity",
    description: "Someone commented on your pull request.",
    media: true,
    actions: true,
    variant: "outline",
    size: "default",
  },
  controls: {
    title: { type: "text" },
    description: { type: "text" },
    media: { type: "boolean", description: "A leading ItemMedia icon." },
    actions: { type: "boolean", description: "Trailing ItemActions." },
    variant: {
      type: "select",
      group: "style",
      options: ["default", "outline", "muted"],
    },
    size: { type: "select", group: "style", options: ["default", "sm", "xs"] },
  },
  preview: Preview,
})
