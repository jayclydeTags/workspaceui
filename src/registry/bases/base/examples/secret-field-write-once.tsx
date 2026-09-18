"use client"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { SecretField } from "@/registry/bases/base/workspaceui/secret-field"

export function SecretFieldWriteOnceDemo() {
  return (
    <Field className="w-full max-w-md">
      <FieldLabel htmlFor="webhook-secret">Webhook signing secret</FieldLabel>
      <SecretField
        id="webhook-secret"
        value="whsec_Q8fK2pL0vX7bN4mR1tY6uZ3c"
        revealable={false}
      />
      <FieldDescription>
        Can be copied but never shown on screen.
      </FieldDescription>
    </Field>
  )
}
