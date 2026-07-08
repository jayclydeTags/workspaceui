import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  SHIFT_START,
  emptyDraft,
  isValid,
  type AttendanceDraft,
  type AttendanceEntry,
} from "../data"

export function EntryDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The entry being edited, or `null` when creating a new one. */
  editing: AttendanceEntry | null
  onSubmit: (draft: AttendanceDraft) => void
}) {
  const [draft, setDraft] = React.useState<AttendanceDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for a create or a specific edit —
  // adjusted during render, not in an effect
  // (https://react.dev/learn/you-might-not-need-an-effect).
  const openKey = open ? (editing?.id ?? "new") : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      setDraft(
        editing
          ? {
              employee: editing.employee,
              date: editing.date,
              clockIn: editing.clockIn,
              clockOut: editing.clockOut,
            }
          : emptyDraft()
      )
    }
  }

  const patch = (changes: Partial<AttendanceDraft>) =>
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
          <DialogTitle>{editing ? "Edit entry" : "New entry"}</DialogTitle>
        </DialogHeader>
        <form id="attendance-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="attendance-employee">Employee</FieldLabel>
              <Input
                id="attendance-employee"
                value={draft.employee}
                onChange={(e) => patch({ employee: e.target.value })}
                placeholder="e.g. Ava Chen"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="attendance-date">Date</FieldLabel>
              <Input
                id="attendance-date"
                type="date"
                value={draft.date}
                onChange={(e) => patch({ date: e.target.value })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="attendance-in">Clock in</FieldLabel>
              <Input
                id="attendance-in"
                type="time"
                value={draft.clockIn}
                onChange={(e) => patch({ clockIn: e.target.value })}
              />
              <FieldDescription>
                Leave blank to mark absent. After {SHIFT_START} counts as late.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="attendance-out">Clock out</FieldLabel>
              <Input
                id="attendance-out"
                type="time"
                value={draft.clockOut}
                onChange={(e) => patch({ clockOut: e.target.value })}
                disabled={!draft.clockIn}
              />
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
          <Button type="submit" form="attendance-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Create entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
