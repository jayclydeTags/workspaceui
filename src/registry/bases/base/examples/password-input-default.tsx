"use client"

import { Field, FieldLabel } from "@/components/ui/field"
import { PasswordInput } from "@/registry/bases/base/workspaceui/password-input"

export function PasswordInputDefaultDemo() {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor="pw-default">Password</FieldLabel>
      <PasswordInput id="pw-default" autoComplete="current-password" />
    </Field>
  )
}
