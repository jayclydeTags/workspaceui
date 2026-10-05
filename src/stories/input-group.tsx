"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { defineStory } from "@/components/studio/studio"

interface Args {
  addon: "text" | "icon" | "button"
  align: "inline-start" | "inline-end"
  placeholder: string
  disabled: boolean
}

function Preview({ addon, align, placeholder, disabled }: Args) {
  return (
    <InputGroup className="max-w-xs" data-disabled={disabled || undefined}>
      <InputGroupInput
        aria-label="Example input group"
        placeholder={placeholder}
        disabled={disabled}
      />
      <InputGroupAddon align={align}>
        {addon === "text" && <InputGroupText>https://</InputGroupText>}
        {addon === "icon" && (
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
        )}
        {addon === "button" && (
          <InputGroupButton variant="secondary">Search</InputGroupButton>
        )}
      </InputGroupAddon>
    </InputGroup>
  )
}

export default defineStory<Args>({
  args: {
    addon: "text",
    align: "inline-start",
    placeholder: "example.com",
    disabled: false,
  },
  controls: {
    placeholder: { type: "text" },
    addon: {
      type: "select",
      group: "style",
      options: ["text", "icon", "button"],
    },
    align: {
      type: "select",
      group: "style",
      options: ["inline-start", "inline-end"],
    },
    disabled: { type: "boolean", group: "style" },
  },
  preview: Preview,
})
