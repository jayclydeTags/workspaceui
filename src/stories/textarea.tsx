"use client"

import { Textarea } from "@/components/ui/textarea"
import { defineStory } from "@/components/studio/studio"

interface Args {
  placeholder: string
  rows: number
  disabled: boolean
  invalid: boolean
}

function Preview({ placeholder, rows, disabled, invalid }: Args) {
  return (
    <Textarea
      className="max-w-xs"
      aria-label="Example textarea"
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      aria-invalid={invalid || undefined}
    />
  )
}

export default defineStory<Args>({
  args: {
    placeholder: "Type your message here.",
    rows: 3,
    disabled: false,
    invalid: false,
  },
  controls: {
    placeholder: { type: "text" },
    rows: { type: "number", min: 1, max: 12 },
    disabled: { type: "boolean", group: "style" },
    invalid: {
      type: "boolean",
      group: "style",
      description: "Sets aria-invalid.",
    },
  },
  preview: Preview,
})
