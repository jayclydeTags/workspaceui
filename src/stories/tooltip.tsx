"use client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { defineStory } from "@/components/studio/studio"

interface Args {
  text: string
  side: "top" | "right" | "bottom" | "left"
  align: "start" | "center" | "end"
}

function Preview({ text, side, align }: Args) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Hover me
        </TooltipTrigger>
        <TooltipContent side={side} align={align}>
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default defineStory<Args>({
  args: { text: "Add to library", side: "top", align: "center" },
  controls: {
    text: { type: "text" },
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
