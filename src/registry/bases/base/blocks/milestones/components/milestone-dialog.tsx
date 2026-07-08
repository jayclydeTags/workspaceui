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
  emptyDraft,
  isValid,
  type Milestone,
  type MilestoneDraft,
} from "../data"

export function MilestoneDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The milestone being edited, or `null` when creating a new one. */
  editing: Milestone | null
  onSubmit: (draft: MilestoneDraft) => void
}) {
  const [draft, setDraft] = React.useState<MilestoneDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for a create or a specific edit —
  // adjusted during render, not in an effect
  // (https://react.dev/learn/you-might-not-need-an-effect).
  const openKey = open ? (editing?.id ?? "new") : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      const { name, project, owner, due, tasksTotal, tasksDone } =
        editing ?? emptyDraft()
      setDraft({ name, project, owner, due, tasksTotal, tasksDone })
    }
  }

  const patch = (changes: Partial<MilestoneDraft>) =>
    setDraft((prev) => ({ ...prev, ...changes }))

  const tooManyDone = draft.tasksDone > draft.tasksTotal

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
            {editing ? "Edit milestone" : "New milestone"}
          </DialogTitle>
        </DialogHeader>
        <form id="milestone-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="milestone-name">Name</FieldLabel>
              <Input
                id="milestone-name"
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="e.g. Schema frozen"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="milestone-project">Project</FieldLabel>
              <Input
                id="milestone-project"
                value={draft.project}
                onChange={(e) => patch({ project: e.target.value })}
                placeholder="e.g. PRJ-101"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="milestone-owner">Owner</FieldLabel>
              <Input
                id="milestone-owner"
                value={draft.owner}
                onChange={(e) => patch({ owner: e.target.value })}
                placeholder="e.g. Ava Chen"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="milestone-due">Due date</FieldLabel>
              <Input
                id="milestone-due"
                type="date"
                value={draft.due}
                onChange={(e) => patch({ due: e.target.value })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="milestone-total">Tasks in scope</FieldLabel>
              <Input
                id="milestone-total"
                type="number"
                min="1"
                step="1"
                value={draft.tasksTotal || ""}
                onChange={(e) => patch({ tasksTotal: Number(e.target.value) })}
                required
              />
            </Field>
            <Field data-invalid={tooManyDone || undefined}>
              <FieldLabel htmlFor="milestone-done">Tasks done</FieldLabel>
              <Input
                id="milestone-done"
                type="number"
                min="0"
                step="1"
                value={draft.tasksDone}
                onChange={(e) => patch({ tasksDone: Number(e.target.value) })}
                aria-invalid={tooManyDone}
              />
              {tooManyDone && (
                <FieldDescription>
                  Can&apos;t finish more tasks than are in scope.
                </FieldDescription>
              )}
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
          <Button type="submit" form="milestone-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Create milestone"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
