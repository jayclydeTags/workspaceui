"use client"

import { useId } from "react"

import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { defineStory } from "@/components/studio/studio"

interface Args {
  label: string
  description: string
  error: string
  invalid: boolean
  orientation: "vertical" | "horizontal" | "responsive"
}

function Preview({ label, description, error, invalid, orientation }: Args) {
  const id = useId()
  return (
    <Field
      orientation={orientation}
      data-invalid={invalid || undefined}
      className="w-96"
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        aria-invalid={invalid || undefined}
        placeholder="jane@example.com"
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {invalid && error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

export default defineStory<Args>({
  args: {
    label: "Email",
    description: "We'll only use this to send receipts.",
    error: "Enter a valid email address.",
    invalid: false,
    orientation: "vertical",
  },
  controls: {
    label: { type: "text" },
    description: { type: "text" },
    error: { type: "text", description: "Shown when invalid." },
    invalid: {
      type: "boolean",
      group: "style",
      description: "data-invalid on the Field, aria-invalid on the control.",
    },
    orientation: {
      type: "select",
      group: "style",
      options: ["vertical", "horizontal", "responsive"],
    },
  },
  preview: Preview,
})
