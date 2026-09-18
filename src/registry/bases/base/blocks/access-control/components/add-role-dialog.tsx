"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Role } from "@/registry/bases/base/blocks/access-control/data"

export const BLANK_ROLE = "blank"

export interface NewRole {
  name: string
  description: string
  /** Role id to copy permissions from, or `BLANK_ROLE`. */
  baseRoleId: string
}

interface AddRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roles: Role[]
  /** Prefills the form, e.g. when duplicating a role. */
  initial?: Partial<NewRole>
  onSubmit: (role: NewRole) => void
}

export function AddRoleDialog({
  open,
  onOpenChange,
  roles,
  initial,
  onSubmit,
}: AddRoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {/* Remounted per open so each opening starts from `initial`. */}
        {open && (
          <AddRoleForm roles={roles} initial={initial} onSubmit={onSubmit} />
        )}
      </DialogContent>
    </Dialog>
  )
}

function AddRoleForm({
  roles,
  initial,
  onSubmit,
}: Pick<AddRoleDialogProps, "roles" | "initial" | "onSubmit">) {
  const [name, setName] = React.useState(initial?.name ?? "")
  const [description, setDescription] = React.useState(
    initial?.description ?? ""
  )
  // Least privilege by default: new roles start as a copy of the most
  // restricted built-in role unless the caller says otherwise.
  const [baseRoleId, setBaseRoleId] = React.useState(
    initial?.baseRoleId ?? roles.at(-1)?.id ?? BLANK_ROLE
  )
  const [error, setError] = React.useState<string | null>(null)
  const nameRef = React.useRef<HTMLInputElement>(null)

  const baseOptions = [
    ...roles.map((role) => ({ value: role.id, label: role.name })),
    { value: BLANK_ROLE, label: "No access" },
  ]

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    const problem = !trimmed
      ? "Enter a name for the role."
      : roles.some((r) => r.name.toLowerCase() === trimmed.toLowerCase())
        ? `A role named “${trimmed}” already exists.`
        : null
    if (problem) {
      setError(problem)
      nameRef.current?.focus()
      return
    }
    onSubmit({ name: trimmed, description: description.trim(), baseRoleId })
  }

  return (
    <form onSubmit={submit} noValidate className="contents">
      <DialogHeader>
        <DialogTitle>Add role</DialogTitle>
        <DialogDescription>
          Start from an existing role, then fine-tune its permissions.
        </DialogDescription>
      </DialogHeader>
      <FieldGroup>
        <Field data-invalid={!!error || undefined}>
          <FieldLabel htmlFor="role-name">Name</FieldLabel>
          <Input
            ref={nameRef}
            id="role-name"
            autoComplete="off"
            value={name}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? "role-name-error" : undefined}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError(null)
            }}
            placeholder="e.g. Billing manager"
          />
          {error && <FieldError id="role-name-error">{error}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="role-description">Description</FieldLabel>
          <Input
            id="role-description"
            autoComplete="off"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this role is for"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="role-base">Start from</FieldLabel>
          <Select
            items={baseOptions}
            value={baseRoleId}
            onValueChange={(value) => value && setBaseRoleId(value)}
          >
            <SelectTrigger id="role-base" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {baseOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldDescription>
            Copies that role’s permissions. Changing them later won’t affect the
            original.
          </FieldDescription>
        </Field>
      </FieldGroup>
      <DialogFooter>
        <DialogClose render={<Button variant="outline" type="button" />}>
          Cancel
        </DialogClose>
        <Button type="submit">Add role</Button>
      </DialogFooter>
    </form>
  )
}
