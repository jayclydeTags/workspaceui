"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { defineStory } from "@/components/studio/studio"

interface Args {
  multiple: boolean
  variant: "default" | "outline"
  size: "default" | "sm" | "lg"
  orientation: "horizontal" | "vertical"
  disabled: boolean
}

function Preview({ multiple, variant, size, orientation, disabled }: Args) {
  return (
    <ToggleGroup
      // The pressed set is uncontrolled; remount when the mode changes.
      key={String(multiple)}
      multiple={multiple}
      variant={variant}
      size={size}
      orientation={orientation}
      disabled={disabled}
      defaultValue={["left"]}
      aria-label="Text alignment"
    >
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  )
}

export default defineStory<Args>({
  args: {
    multiple: false,
    variant: "default",
    size: "default",
    orientation: "horizontal",
    disabled: false,
  },
  controls: {
    multiple: {
      type: "boolean",
      description: "Allow several items pressed at once.",
    },
    variant: {
      type: "select",
      group: "style",
      options: ["default", "outline"],
    },
    size: { type: "select", group: "style", options: ["default", "sm", "lg"] },
    orientation: {
      type: "select",
      group: "style",
      options: ["horizontal", "vertical"],
    },
    disabled: { type: "boolean", group: "style" },
  },
  preview: Preview,
})
