"use client"

import { Field, FieldLabel } from "@/components/ui/field"
import { PasswordInput } from "@/registry/bases/base/workspaceui/password-input"

export function PasswordInputStrengthDemo() {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor="pw-strength">New password</FieldLabel>
      <PasswordInput
        id="pw-strength"
        autoComplete="new-password"
        showStrength
        defaultValue="Str0ng"
      />
    </Field>
  )
}
