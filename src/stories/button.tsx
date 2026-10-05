"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Mail01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { defineStory } from "@/components/studio/studio"

type Variant =
  "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
type Size =
  "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"

interface Args {
  label: string
  variant: Variant
  size: Size
  icon: boolean
  disabled: boolean
}

function Preview({ label, variant, size, icon, disabled }: Args) {
  // The icon-* sizes are square, icon-only buttons.
  if (size.startsWith("icon")) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        aria-label={label}
      >
        <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />
      </Button>
    )
  }
  return (
    <Button variant={variant} size={size} disabled={disabled}>
      {icon && (
        <HugeiconsIcon
          icon={Mail01Icon}
          strokeWidth={2}
          data-icon="inline-start"
        />
      )}
      {label}
    </Button>
  )
}

export default defineStory<Args>({
  args: {
    label: "Button",
    variant: "default",
    size: "default",
    icon: false,
    disabled: false,
  },
  controls: {
    label: {
      type: "text",
      description: "Also the accessible name of icon-only sizes.",
    },
    icon: {
      type: "boolean",
      description: 'A leading icon, via data-icon="inline-start".',
    },
    variant: {
      type: "select",
      group: "style",
      options: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      type: "select",
      group: "style",
      options: [
        "default",
        "xs",
        "sm",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
      ],
    },
    disabled: { type: "boolean", group: "style" },
  },
  preview: Preview,
})
