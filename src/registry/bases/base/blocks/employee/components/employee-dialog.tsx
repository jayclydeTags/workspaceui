import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  emptyDraft,
  isValid,
  type Employee,
  type EmployeeDraft,
  type EmployeeStatus,
} from "../data"

export function EmployeeDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The employee being edited, or `null` when creating a new one. */
  editing: Employee | null
  onSubmit: (draft: EmployeeDraft) => void
}) {
  const [draft, setDraft] = React.useState<EmployeeDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for a create or a specific edit —
  // one form handles both, keyed off whether `editing` is set. Adjusted during
  // render (not an effect) per https://react.dev/learn/you-might-not-need-an-effect.
  const openKey = open ? (editing?.id ?? "new") : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      setDraft(
        editing
          ? {
              name: editing.name,
              email: editing.email,
              department: editing.department,
              title: editing.title,
              status: editing.status,
              hireDate: editing.hireDate,
            }
          : emptyDraft()
      )
    }
  }

  const patch = (changes: Partial<EmployeeDraft>) =>
    setDraft((prev) => ({ ...prev, ...changes }))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid(draft)) return
    onSubmit(draft)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit employee" : "New employee"}</DialogTitle>
        </DialogHeader>
        <form id="employee-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="employee-name">Name</FieldLabel>
              <Input
                id="employee-name"
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="e.g. Sarah Chen"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="employee-email">Email</FieldLabel>
              <Input
                id="employee-email"
                type="email"
                value={draft.email}
                onChange={(e) => patch({ email: e.target.value })}
                placeholder="e.g. sarah.chen@acme.co"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="employee-title">Title</FieldLabel>
              <Input
                id="employee-title"
                value={draft.title}
                onChange={(e) => patch({ title: e.target.value })}
                placeholder="e.g. Senior Engineer"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="employee-department">Department</FieldLabel>
              <Input
                id="employee-department"
                value={draft.department}
                onChange={(e) => patch({ department: e.target.value })}
                placeholder="e.g. Engineering"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="employee-hire-date">Hire date</FieldLabel>
              <Input
                id="employee-hire-date"
                type="date"
                value={draft.hireDate}
                onChange={(e) => patch({ hireDate: e.target.value })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="employee-status">Status</FieldLabel>
              <Select
                value={draft.status}
                onValueChange={(v) =>
                  patch({ status: (v as EmployeeStatus) ?? "onboarding" })
                }
              >
                <SelectTrigger id="employee-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="employee-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Create employee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
