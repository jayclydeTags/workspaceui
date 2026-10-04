"use client"

import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { defineStory } from "@/components/studio/studio"
import { SecretField } from "@/registry/bases/base/workspaceui/secret-field"

interface Args {
  value: string
  revealable: boolean
  visibleChars?: number
  disabled: boolean
}

function Preview(args: Args) {
  const id = useId()
  return (
    <Field className="w-full max-w-md">
      <FieldLabel htmlFor={id}>Secret key</FieldLabel>
      <SecretField id={id} {...args} />
    </Field>
  )
}

export default defineStory<Args>({
  args: {
    value: "sk_demo_51HxQ2mZ9aB3cD4eF5gH6iJ7kLm8N",
    revealable: true,
    visibleChars: undefined,
    disabled: false,
  },
  controls: {
    value: { type: "text" },
    revealable: {
      group: "style",
      type: "boolean",
      description: "Off for write-once secrets that must stay masked.",
    },
    visibleChars: {
      type: "number",
      min: 0,
      description: "Trailing characters left visible while masked.",
    },
    disabled: { group: "style", type: "boolean" },
  },
  preview: Preview,
})
