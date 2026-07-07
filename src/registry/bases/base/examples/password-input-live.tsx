"use client"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { PasswordInput } from "@/registry/bases/base/workspaceui/password-input"

export function PasswordInputLiveDemo() {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor="pw-live">New password</FieldLabel>
      <PasswordInput
        id="pw-live"
        autoComplete="new-password"
        showStrength
        placeholder="Type to see the strength meter"
      />
      <FieldDescription>
        Click the eye to reveal. The meter appears as you type.
      </FieldDescription>
    </Field>
  )
}
