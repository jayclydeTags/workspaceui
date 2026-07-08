import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  MAX_HOURS_PER_ENTRY,
  PROJECTS,
  emptyDraft,
  isValid,
  type TimeEntry,
  type TimeEntryDraft,
} from "../data"

export function EntryDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The entry being edited, or `null` when logging a new one. */
  editing: TimeEntry | null
  onSubmit: (draft: TimeEntryDraft) => void
}) {
  const [draft, setDraft] = React.useState<TimeEntryDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for a create or a specific edit —
  // adjusted during render, not in an effect
  // (https://react.dev/learn/you-might-not-need-an-effect).
  const openKey = open ? (editing?.id ?? "new") : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      const { member, project, task, date, hours, billable } =
        editing ?? emptyDraft()
      setDraft({ member, project, task, date, hours, billable })
    }
  }

  const patch = (changes: Partial<TimeEntryDraft>) =>
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
          <DialogTitle>{editing ? "Edit entry" : "Log time"}</DialogTitle>
        </DialogHeader>
        <form id="timesheet-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="timesheet-member">Member</FieldLabel>
              <Input
                id="timesheet-member"
                value={draft.member}
                onChange={(e) => patch({ member: e.target.value })}
                placeholder="e.g. Ava Chen"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="timesheet-project">Project</FieldLabel>
              <Select
                value={draft.project}
                onValueChange={(v) => patch({ project: v ?? PROJECTS[0] })}
              >
                <SelectTrigger id="timesheet-project">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECTS.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="timesheet-task">Task</FieldLabel>
              <Input
                id="timesheet-task"
                value={draft.task}
                onChange={(e) => patch({ task: e.target.value })}
                placeholder="e.g. Dual-write shim"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="timesheet-date">Date</FieldLabel>
              <Input
                id="timesheet-date"
                type="date"
                value={draft.date}
                onChange={(e) => patch({ date: e.target.value })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="timesheet-hours">Hours</FieldLabel>
              <Input
                id="timesheet-hours"
                type="number"
                min="0"
                max={MAX_HOURS_PER_ENTRY}
                step="0.5"
                value={draft.hours || ""}
                onChange={(e) => patch({ hours: Number(e.target.value) })}
                required
              />
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                id="timesheet-billable"
                checked={draft.billable}
                onCheckedChange={(checked) => patch({ billable: checked === true })}
              />
              <FieldLabel htmlFor="timesheet-billable">Billable</FieldLabel>
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
          <Button type="submit" form="timesheet-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Log entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
