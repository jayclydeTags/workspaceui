"use client"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { defineStory } from "@/components/studio/studio"

interface Args {
  orientation: "horizontal" | "vertical"
  variant: "default" | "outline" | "secondary"
  buttons: number
}

const LABELS = ["Archive", "Report", "Snooze", "Delete", "More"]

function Preview({ orientation, variant, buttons }: Args) {
  return (
    <ButtonGroup orientation={orientation} aria-label="Message actions">
      {LABELS.slice(0, Math.min(Math.max(buttons, 1), LABELS.length)).map(
        (label) => (
          <Button key={label} variant={variant}>
            {label}
          </Button>
        )
      )}
    </ButtonGroup>
  )
}

export default defineStory<Args>({
  args: { orientation: "horizontal", variant: "outline", buttons: 3 },
  controls: {
    buttons: { type: "number", min: 1, max: LABELS.length },
    orientation: {
      type: "select",
      group: "style",
      options: ["horizontal", "vertical"],
    },
    variant: {
      type: "select",
      group: "style",
      options: ["default", "outline", "secondary"],
      description: "Applied to every button in the group.",
    },
  },
  preview: Preview,
})
