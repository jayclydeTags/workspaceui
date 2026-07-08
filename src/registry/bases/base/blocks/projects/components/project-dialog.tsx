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
  PROJECT_STATUSES,
  emptyDraft,
  isValid,
  type Project,
  type ProjectDraft,
  type ProjectStatus,
} from "../data"

export function ProjectDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The project being edited, or `null` when creating a new one. */
  editing: Project | null
  onSubmit: (draft: ProjectDraft) => void
}) {
  const [draft, setDraft] = React.useState<ProjectDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for a create or a specific edit —
  // adjusted during render, not in an effect
  // (https://react.dev/learn/you-might-not-need-an-effect).
  const openKey = open ? (editing?.id ?? "new") : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      const { code, name, client, lead, due, progress, status } =
        editing ?? emptyDraft()
      setDraft({ code, name, client, lead, due, progress, status })
    }
  }

  const patch = (changes: Partial<ProjectDraft>) =>
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
          <DialogTitle>{editing ? "Edit project" : "New project"}</DialogTitle>
        </DialogHeader>
        <form id="project-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="project-name">Name</FieldLabel>
              <Input
                id="project-name"
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="e.g. Billing migration"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="project-code">Code</FieldLabel>
              <Input
                id="project-code"
                value={draft.code}
                onChange={(e) => patch({ code: e.target.value })}
                placeholder="e.g. PRJ-101"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="project-client">Client</FieldLabel>
              <Input
                id="project-client"
                value={draft.client}
                onChange={(e) => patch({ client: e.target.value })}
                placeholder="e.g. Northwind"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="project-lead">Lead</FieldLabel>
              <Input
                id="project-lead"
                value={draft.lead}
                onChange={(e) => patch({ lead: e.target.value })}
                placeholder="e.g. Ava Chen"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="project-due">Due date</FieldLabel>
              <Input
                id="project-due"
                type="date"
                value={draft.due}
                onChange={(e) => patch({ due: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="project-progress">Progress (%)</FieldLabel>
              <Input
                id="project-progress"
                type="number"
                min="0"
                max="100"
                step="1"
                value={draft.progress}
                onChange={(e) => patch({ progress: Number(e.target.value) })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="project-status">Status</FieldLabel>
              <Select
                value={draft.status}
                onValueChange={(v) =>
                  patch({ status: (v as ProjectStatus) ?? "planning" })
                }
              >
                <SelectTrigger id="project-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
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
          <Button type="submit" form="project-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Create project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
