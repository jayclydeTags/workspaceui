"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { BoldIcon } from "@hugeicons/core-free-icons"

import { Toggle } from "@/components/ui/toggle"
import { defineStory } from "@/components/studio/studio"

interface Args {
  label: string
  pressed: boolean
  variant: "default" | "outline"
  size: "default" | "sm" | "lg"
  disabled: boolean
}

function Preview({ label, pressed, variant, size, disabled }: Args) {
  return (
    // Uncontrolled, so a changed `pressed` control remounts it.
    <Toggle
      key={String(pressed)}
      aria-label={label}
      defaultPressed={pressed}
      variant={variant}
      size={size}
      disabled={disabled}
    >
      <HugeiconsIcon icon={BoldIcon} strokeWidth={2} />
      {label}
    </Toggle>
  )
}

export default defineStory<Args>({
  args: {
    label: "Bold",
    pressed: false,
    variant: "default",
    size: "default",
    disabled: false,
  },
  controls: {
    label: { type: "text" },
    pressed: { type: "boolean", label: "Initially pressed" },
    variant: {
      type: "select",
      group: "style",
      options: ["default", "outline"],
    },
    size: { type: "select", group: "style", options: ["default", "sm", "lg"] },
    disabled: { type: "boolean", group: "style" },
  },
  preview: Preview,
})
