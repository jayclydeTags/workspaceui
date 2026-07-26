"use client"

import { Field, FieldLabel } from "@/components/ui/field"
import { PasswordInput } from "@/registry/bases/base/workspaceui/password-input"

export function PasswordInputChecklistDemo() {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor="pw-checklist">New password</FieldLabel>
      <PasswordInput
        id="pw-checklist"
        autoComplete="new-password"
        showStrength
        showChecklist
        defaultValue="Secret1"
      />
    </Field>
  )
}
