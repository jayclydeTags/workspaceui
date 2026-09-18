"use client"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { SecretField } from "@/registry/bases/base/workspaceui/secret-field"

export function SecretFieldDemo() {
  return (
    <Field className="w-full max-w-md">
      <FieldLabel htmlFor="secret-key">Secret key</FieldLabel>
      <SecretField
        id="secret-key"
        value="sk_demo_51HxQ2mZ9aB3cD4eF5gH6iJ7kLm8N"
      />
      <FieldDescription>
        Use this key to authenticate server-side requests. Never expose it in
        client code.
      </FieldDescription>
    </Field>
  )
}
