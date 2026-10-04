"use client"

import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { defineStory } from "@/components/studio/studio"
import { PasswordInput } from "@/registry/bases/base/workspaceui/password-input"

interface Args {
  placeholder: string
  showStrength: boolean
  showChecklist: boolean
  disabled: boolean
}

function Preview(args: Args) {
  const id = useId()
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor={id}>Password</FieldLabel>
      <PasswordInput id={id} autoComplete="new-password" {...args} />
    </Field>
  )
}

export default defineStory<Args>({
  args: {
    placeholder: "Type to see the strength meter",
    showStrength: true,
    showChecklist: true,
    disabled: false,
  },
  controls: {
    placeholder: { type: "text" },
    showStrength: {
      type: "boolean",
      description: "Live strength meter. New-password fields only.",
    },
    showChecklist: {
      type: "boolean",
      description: "Live requirements checklist. New-password fields only.",
    },
    disabled: { group: "style", type: "boolean" },
  },
  preview: Preview,
})
