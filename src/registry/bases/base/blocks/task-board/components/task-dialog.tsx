"use client"

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
  PRIORITIES,
  STATUS_COLUMNS,
  STATUS_LABEL,
  emptyDraft,
  isValid,
  type Task,
  type TaskDraft,
  type TaskPriority,
  type TaskStatus,
} from "../data"

export function TaskDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The task being edited, or `null` when creating a new one. */
  editing: Task | null
  onSubmit: (draft: TaskDraft) => void
}) {
  const [draft, setDraft] = React.useState<TaskDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for a create or a specific edit —
  // adjusted during render, not in an effect
  // (https://react.dev/learn/you-might-not-need-an-effect).
  const openKey = open ? (editing?.id ?? "new") : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      const { title, assignee, priority, due, status } = editing ?? emptyDraft()
      setDraft({ title, assignee, priority, due, status })
    }
  }

  const patch = (changes: Partial<TaskDraft>) =>
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
          <DialogTitle>{editing ? "Edit task" : "New task"}</DialogTitle>
        </DialogHeader>
        <form id="task-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="task-title">Title</FieldLabel>
              <Input
                id="task-title"
                value={draft.title}
                onChange={(e) => patch({ title: e.target.value })}
                placeholder="e.g. Draft migration runbook"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="task-assignee">Assignee</FieldLabel>
              <Input
                id="task-assignee"
                value={draft.assignee}
                onChange={(e) => patch({ assignee: e.target.value })}
                placeholder="Leave blank to keep unassigned"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="task-priority">Priority</FieldLabel>
              <Select
                value={draft.priority}
                onValueChange={(v) =>
                  patch({ priority: (v as TaskPriority) ?? "medium" })
                }
              >
                <SelectTrigger id="task-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="task-due">Due date</FieldLabel>
              <Input
                id="task-due"
                type="date"
                value={draft.due}
                onChange={(e) => patch({ due: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="task-status">Column</FieldLabel>
              <Select
                value={draft.status}
                onValueChange={(v) =>
                  patch({ status: (v as TaskStatus) ?? "todo" })
                }
              >
                <SelectTrigger id="task-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_COLUMNS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABEL[status]}
                    </SelectItem>
                  ))}
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
          <Button type="submit" form="task-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Create task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
