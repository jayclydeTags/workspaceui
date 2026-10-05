"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { defineStory } from "@/components/studio/studio"

interface Args {
  title: string
  description: string
  side: "top" | "right" | "bottom" | "left"
  align: "start" | "center" | "end"
}

function Preview({ title, description, side, align }: Args) {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Open popover
      </PopoverTrigger>
      <PopoverContent side={side} align={align}>
        <PopoverHeader>
          <PopoverTitle>{title}</PopoverTitle>
          <PopoverDescription>{description}</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}

export default defineStory<Args>({
  args: {
    title: "Dimensions",
    description: "Set the dimensions for the layer.",
    side: "bottom",
    align: "center",
  },
  controls: {
    title: { type: "text" },
    description: { type: "text" },
    side: {
      type: "select",
      group: "style",
      options: ["top", "right", "bottom", "left"],
    },
    align: {
      type: "select",
      group: "style",
      options: ["start", "center", "end"],
    },
  },
  preview: Preview,
})
