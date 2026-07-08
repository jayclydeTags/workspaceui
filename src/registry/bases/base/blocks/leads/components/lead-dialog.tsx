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
  LEAD_SOURCES,
  LEAD_STAGES,
  emptyDraft,
  isValid,
  type Lead,
  type LeadDraft,
  type LeadSource,
  type LeadStage,
} from "../data"

export function LeadDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The lead being edited, or `null` when creating a new one. */
  editing: Lead | null
  onSubmit: (draft: LeadDraft) => void
}) {
  const [draft, setDraft] = React.useState<LeadDraft>(emptyDraft)

  // Seed the form whenever the dialog opens for a create or a specific edit —
  // adjusted during render, not in an effect
  // (https://react.dev/learn/you-might-not-need-an-effect).
  const openKey = open ? (editing?.id ?? "new") : null
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (openKey !== seededKey) {
    setSeededKey(openKey)
    if (openKey !== null) {
      const { name, company, email, source, score, stage } =
        editing ?? emptyDraft()
      setDraft({ name, company, email, source, score, stage })
    }
  }

  const patch = (changes: Partial<LeadDraft>) =>
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
          <DialogTitle>{editing ? "Edit lead" : "New lead"}</DialogTitle>
        </DialogHeader>
        <form id="lead-form" onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="lead-name">Name</FieldLabel>
              <Input
                id="lead-name"
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="e.g. Iris Muller"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="lead-company">Company</FieldLabel>
              <Input
                id="lead-company"
                value={draft.company}
                onChange={(e) => patch({ company: e.target.value })}
                placeholder="e.g. Northwind"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="lead-email">Email</FieldLabel>
              <Input
                id="lead-email"
                type="email"
                value={draft.email}
                onChange={(e) => patch({ email: e.target.value })}
                placeholder="e.g. iris@northwind.example"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="lead-source">Source</FieldLabel>
              <Select
                value={draft.source}
                onValueChange={(v) => patch({ source: (v as LeadSource) ?? "web" })}
              >
                <SelectTrigger id="lead-source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="lead-score">Score</FieldLabel>
              <Input
                id="lead-score"
                type="number"
                min="0"
                max="100"
                step="1"
                value={draft.score}
                onChange={(e) => patch({ score: Number(e.target.value) })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="lead-stage">Stage</FieldLabel>
              <Select
                value={draft.stage}
                onValueChange={(v) => patch({ stage: (v as LeadStage) ?? "new" })}
              >
                <SelectTrigger id="lead-stage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STAGES.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
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
          <Button type="submit" form="lead-form" disabled={!isValid(draft)}>
            {editing ? "Save changes" : "Create lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
