"use client"

import { Input } from "@/components/ui/input"
import { defineStory } from "@/components/studio/studio"

interface Args {
  type: "text" | "email" | "password" | "number" | "search"
  placeholder: string
  disabled: boolean
  invalid: boolean
}

function Preview({ type, placeholder, disabled, invalid }: Args) {
  return (
    <Input
      className="max-w-xs"
      aria-label="Example input"
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={invalid || undefined}
    />
  )
}

export default defineStory<Args>({
  args: {
    type: "text",
    placeholder: "Type something…",
    disabled: false,
    invalid: false,
  },
  controls: {
    type: {
      type: "select",
      options: ["text", "email", "password", "number", "search"],
    },
    placeholder: { type: "text" },
    disabled: { type: "boolean", group: "style" },
    invalid: {
      type: "boolean",
      group: "style",
      description: "Sets aria-invalid.",
    },
  },
  preview: Preview,
})
