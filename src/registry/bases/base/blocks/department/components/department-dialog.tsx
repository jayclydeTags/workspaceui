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
  type Department,
  type DepartmentDraft,
  type DepartmentStatus,
} from "../data"

export function DepartmentDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The department being edited, or `null` when creating a new one. */
  editing: Department | null
  onSubmit: (draft: DepartmentDraft) => void
}) {
  const [draft, setDraft] = React.useState<DepartmentDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for a create or a specific edit.
  React.useEffect(() => {
    if (!open) return
    setDraft(
      editing
        ? {
            name: editing.name,
            code: editing.code,
            manager: editing.manager,
            status: editing.status,
          }
        : emptyDraft()
    )
  }, [open, editing])

  const patch = (changes: Partial<DepartmentDraft>) =>
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
          <DialogTitle>
            {editing ? "Edit department" : "New department"}
          </DialogTitle>
        </DialogHeader>
        <form id="department-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="dept-name">Name</FieldLabel>
              <Input
                id="dept-name"
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="e.g. Engineering"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="dept-code">Code</FieldLabel>
              <Input
                id="dept-code"
                value={draft.code}
                onChange={(e) =>
                  patch({ code: e.target.value.toUpperCase() })
                }
                placeholder="e.g. ENG"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="dept-manager">Manager</FieldLabel>
              <Input
                id="dept-manager"
                value={draft.manager}
                onChange={(e) => patch({ manager: e.target.value })}
                placeholder="e.g. Sarah Chen"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="dept-status">Status</FieldLabel>
              <Select
                value={draft.status}
                onValueChange={(v) =>
                  patch({ status: (v as DepartmentStatus) ?? "active" })
                }
              >
                <SelectTrigger id="dept-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
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
          <Button type="submit" form="department-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Create department"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
